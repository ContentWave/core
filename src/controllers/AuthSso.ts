import {
  Description,
  FastifyReply,
  Get,
  Parameter,
  Prefix,
  Query,
  Res,
  Title
} from '@swarmjs/core'
import { getWaveAuthorizationChallengeModel } from '../models/WaveAuthorizationChallenge'
import { BadRequest } from 'http-errors'
import { getWaveUserModel } from '../models/WaveUser'
import { Auth } from './Auth'
import { Plugins } from '../classes/Plugins'
import { SsoUserData } from '@contentwave/plugin'

@Title('Auth')
@Description('Handles authentication to this server')
@Prefix('/auth', true)
export class AuthSso {
  @Get('/challenges/:challengeId/social/:provider')
  @Title('Init SSO')
  @Description(
    'Inits OAuth2 protocol to an external provider, and redirects user to the login page'
  )
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Parameter('provider', 'String', 'Provider key')
  static async init (
    @Parameter('challengeId') challengeId: string,
    @Parameter('provider') provider: string,
    @Res() res: FastifyReply
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (!challenge || +challenge.expiresAt < +new Date()) throw new BadRequest()

    const plugin = Plugins.getInstance('auth', provider)
    if (!plugin) return Auth.sendToErrorPage(res, 'Unknown provider.')

    const uri = plugin.getRedirectUri(
      `${process.env.BASE_URL ?? ''}/auth/social/${provider}/callback`,
      challengeId
    )
    res.redirect(uri)
  }

  @Get('/social/:provider/callback')
  @Title('SSO callback')
  @Description('Receive code')
  @Query('code', 'String', 'OAuth2 authorization code')
  @Parameter('provider', 'String', 'Provider key')
  static async callback (
    @Parameter('provider') provider: string,
    @Query('code') code: string,
    @Res() res: FastifyReply
  ) {
    const plugin = Plugins.getInstance('auth', provider)
    if (!plugin) return Auth.sendToErrorPage(res, 'Unknown provider.')

    const ret: SsoUserData = await plugin.processCallback(code)
    ret.email = ret.email.toLowerCase()

    const challenge = await getWaveAuthorizationChallengeModel().findById(
      ret.state
    )
    if (!challenge || +challenge.expiresAt < +new Date())
      return Auth.sendToErrorPage(res, 'Challenge expired, please try again.')

    let user = await getWaveUserModel().findOne({ [`sso.${provider}`]: ret.id })
    if (!user) {
      user = await getWaveUserModel().findOne({
        email: ret.email
      })
    }
    if (!user) {
      user = await getWaveUserModel().create({
        firstname: ret.firstname,
        lastname: ret.lastname,
        avatar: ret.avatar ?? '',
        email: ret.email,
        validated: true
      })
    }
    if (user.sso === undefined) user.sso = {}
    user.sso[provider] = ret.id
    if (!user.avatar && ret.avatar) user.avatar = ret.avatar
    user.validated = true
    await user.save()

    challenge.user = user.id
    challenge.authorized = true
    challenge.readyToRedirect = true
    challenge.needsTotp = false
    challenge.needsValidation = false
    challenge.needsOneTimeCode = false
    await challenge.save()

    return Auth.sendToLoginPage(res, challenge.id)
  }
}
