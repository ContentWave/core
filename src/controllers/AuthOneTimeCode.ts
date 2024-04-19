import {
  Accepts,
  Body,
  Description,
  Parameter,
  Post,
  Prefix,
  Req,
  Returns,
  Title
} from '@swarmjs/core'
import {
  IWaveAuthorizationChallenge,
  getWaveAuthorizationChallengeModel
} from '../models/WaveAuthorizationChallenge'
import { BadRequest } from 'http-errors'
import { IWaveUser } from '../models/WaveUser'
import { Config } from '../classes/Config'
import { Plugins } from '../classes/Plugins'
import { HtmlEmail } from '../classes/HtmlEmail'
import randomstring from 'randomstring'

@Title('Auth')
@Description('Handles authentication to this server')
@Prefix('/auth', true)
export class AuthOneTimeCode {
  @Post('/challenges/:challengeId/one-time-code/retry')
  @Title('Send a new one-time-code')
  @Description('Send a new one-time-code by email')
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Returns(200, 'Empty', 'Email sent')
  @Returns(400, 'Error', 'Bad challenge')
  static async sendOneTimeCodeAgain (
    @Parameter('challengeId') challengeId: string,
    @Req() request: any
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (!challenge || +challenge.expiresAt < +new Date()) throw new BadRequest()

    await challenge.populate('user')
    if (!challenge.user) throw new BadRequest()
    const user: IWaveUser = challenge.user as IWaveUser

    if (challenge.needsOneTimeCode) {
      await AuthOneTimeCode.sendOneTimeCode(user, challenge, request)
    }
    await challenge.save()

    return {}
  }

  static async sendOneTimeCode (
    user: IWaveUser,
    challenge: IWaveAuthorizationChallenge,
    request: any
  ) {
    const emailPlugin = Plugins.getInstance('email')

    challenge.oneTimeCode = randomstring.generate({
      length: 8,
      charset: 'numeric'
    })

    const html = HtmlEmail.create(
      request.$t(`Confirm your authentication request`, {}, null, 'auth')
    )
      .header({
        logo: Config.get('logo') ?? '',
        title: request.$t('Security code', null, 'auth')
      })
      .text(
        request.$t(
          'Please enter the code below into the log in form:',
          {},
          null,
          'auth'
        )
      )
      .header({
        title: challenge.oneTimeCode
      })
      .warning({
        windowTitle: request.$t(
          'This code is strictly personal !',
          {},
          null,
          'auth'
        ),
        description: request.$t(
          'Do not give this code to anybody, and make sure you enter this code only on this website: {baseUrl}.',
          { baseUrl: process.env.BASE_URL ?? '' },
          null,
          'auth'
        )
      })
      .end()

    const sent = await emailPlugin.sendEmail(
      user,
      request.$t(`Confirm your authentication request`, {}, null, 'auth'),
      html
    )

    if (!sent) {
      challenge.needsOneTimeCode = false
      challenge.oneTimeCode = ''
      challenge.readyToRedirect = !challenge.needsTotp && user.validated
    }
  }

  @Post('/challenges/:challengeId/one-time-code')
  @Title('Submit a one-time-code')
  @Description(
    'Validates an auth challenge with a one-time-code received by email'
  )
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Accepts('OneTimeCode')
  @Returns(200, 'AuthChallengeState', 'Logged in')
  @Returns(400, 'Error', 'Bad code')
  static async submitOneTimeCode (
    @Parameter('challengeId') challengeId: string,
    @Body('code') code: string
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (
      !challenge ||
      +challenge.expiresAt < +new Date() ||
      challenge.oneTimeCode !== code
    )
      throw new BadRequest()

    await challenge.populate('user')
    if (!challenge.user) throw new BadRequest()
    const user: IWaveUser = challenge.user as IWaveUser

    challenge.oneTimeCode = ''
    challenge.needsOneTimeCode = false
    challenge.readyToRedirect = !challenge.needsTotp && user.validated
    await challenge.save()

    return {
      authorized: challenge.authorized,
      readyToRedirect: challenge.readyToRedirect,
      needsTotp: challenge.needsTotp,
      needsValidation: challenge.needsValidation,
      needsOneTimeCode: challenge.needsOneTimeCode,
      haveTotp: user?.totp?.secret && !user?.totp?.pending,
      totpType: user?.totp?.isGoogle ? 'google' : 'totp'
    }
  }
}
