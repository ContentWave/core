import {
  Accepts,
  Body,
  Description,
  FastifyReply,
  Get,
  Parameter,
  Post,
  Prefix,
  Req,
  Res,
  Returns,
  Title
} from '@swarmjs/core'
import { getWaveAuthorizationChallengeModel } from '../models/WaveAuthorizationChallenge'
import { BadRequest } from 'http-errors'
import { IWaveUser, getWaveUserModel } from '../models/WaveUser'
import { randomUUID } from 'crypto'
import { Crypt } from '../classes/Crypt'
import { Config } from '../classes/Config'
import { Auth } from './Auth'
import { Plugins } from '../classes/Plugins'
import { HtmlEmail } from '../classes/HtmlEmail'
import { AuthOneTimeCode } from './AuthOneTimeCode'

@Title('Auth')
@Description('Handles authentication to this server')
@Prefix('/auth', true)
export class AuthMagicLink {
  @Post('/challenges/:challengeId/magic-links')
  @Title('Send a magic link to user')
  @Description('Tries to send a magic link to a user, linked to this challenge')
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Accepts('MagicLink')
  @Returns(200, 'Empty', 'Mail sent if the user exists')
  @Returns(400, 'Error', 'Bad credentials')
  static async send (
    @Parameter('challengeId') challengeId: string,
    @Body('email') email: string,
    @Req() request: any
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (!challenge || +challenge.expiresAt < +new Date()) throw new BadRequest()

    email = email.toLowerCase()
    const emailPlugin = Plugins.getInstance('email')
    if (!emailPlugin) throw new BadRequest()

    const user = await getWaveUserModel().findOne({
      email
    })

    if (!user) return {}

    const code = randomUUID()
    challenge.user = user._id
    challenge.magicLinks.push(code)
    challenge.markModified('magicLinks')
    await challenge.save()

    const html = HtmlEmail.create(request.$t(`Magic link`, {}, null, 'auth'))
      .header({
        logo: Config.get('logo') ?? '',
        title: request.$t('Login with a magic link', null, 'auth')
      })
      .text(
        request.$t(
          'Please click on the button below to log in, or copy-paste the following link in your browser address bar :<br />{url}',
          { url: `${process.env.BASE_URL ?? ''}/auth/magic-links/${code}` },
          null,
          'auth'
        )
      )
      .button(
        request.$t('Log in', {}, null, 'auth'),
        `${process.env.BASE_URL ?? ''}/auth/magic-links/${code}`
      )
      .end()

    await emailPlugin.sendEmail(
      user,
      request.$t(
        `Log in to {name}`,
        { name: Config.get('title') },
        null,
        'auth'
      ),
      html
    )
    return {}
  }

  @Get('/magic-links/:code')
  @Title('Log a user with a magic link')
  @Description('Tries to fulfill a challenge with a magic link')
  @Parameter('code', 'Uuid', 'Magic Link ID')
  static async login (
    @Parameter('code') code: string,
    @Res() res: FastifyReply
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findOne({
      magicLinks: code
    })
    if (!challenge || +challenge.expiresAt < +new Date())
      return Auth.sendToErrorPage(
        res,
        'Magic link does not exists or is expired.'
      )

    challenge.authorized = true
    challenge.readyToRedirect = true
    challenge.needsTotp = false
    challenge.needsValidation = false
    challenge.needsOneTimeCode = false
    await challenge.save()

    return Auth.sendToLoginPage(res, challenge.id)
  }
}
