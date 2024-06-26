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
import { Crypt } from '../classes/Tools/Crypt'
import { Config } from '../classes/Config'
import { Plugins } from '../classes/Plugins'
import { HtmlEmail } from '../classes/Tools/HtmlEmail'
import { AuthOneTimeCode } from './AuthOneTimeCode'
import { Auth } from './Auth'

@Title('Auth')
@Description('Handles authentication to this server')
@Prefix('/auth', true)
export class AuthPassword {
  @Post('/challenges/:challengeId/register')
  @Title('Creates an account with email/password')
  @Description('Tries to create a new account for a specific challenge')
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Accepts('Register')
  @Returns(200, 'AuthChallengeState', 'Account created')
  @Returns(400, 'Error', 'Account already existing with this email')
  static async register (
    @Parameter('challengeId') challengeId: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
    @Req() request: any
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (!challenge || +challenge.expiresAt < +new Date()) throw new BadRequest()

    email = email.toLowerCase()

    let user = await getWaveUserModel().findOne({
      email
    })

    if (user) throw BadRequest()

    user = await getWaveUserModel().create({
      email,
      firstname,
      lastname,
      password: await Crypt.hash(password),
      validated: !Config.get('auth')?.validation,
      validationCode: !!Config.get('auth')?.validation ? randomUUID() : ''
    })

    const sent = await AuthPassword.sendValidationCode(user, request)
    if (!sent) {
      user.validated = true
      user.validationCode = ''
      await user.save()
    }

    try {
      challenge.authorized = true
      challenge.user = user._id
      challenge.needsTotp = true
      challenge.authorized = true
      challenge.readyToRedirect = user.validated
      challenge.needsTotp = false
      challenge.needsValidation = !user.validated
      challenge.needsOneTimeCode = false
      await challenge.save()

      return {
        authorized: challenge.authorized,
        readyToRedirect: challenge.readyToRedirect,
        needsTotp: false,
        needsValidation: challenge.needsValidation,
        needsOneTimeCode: false,
        haveTotp: user.totp?.secret && !user.totp?.pending,
        totpType: user?.totp?.isGoogle ? 'google' : 'totp'
      }
    } catch {
      throw new BadRequest()
    }
  }

  @Post('/challenges/:challengeId/validation/retry')
  @Title('Send a new validation link')
  @Description('Send a new validation line by email')
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Returns(200, 'Empty', 'Email sent')
  @Returns(400, 'Error', 'Bad challenge')
  static async sendValidationAgain (
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

    if (user.validated === false && challenge.needsValidation) {
      await AuthPassword.sendValidationCode(user, request)
    }
    await challenge.save()

    return {}
  }

  static async sendValidationCode (
    user: IWaveUser,
    request: any
  ): Promise<boolean> {
    const emailPlugin = Plugins.getInstance('email')
    if (!emailPlugin) return false

    const html = HtmlEmail.create(
      request.$t('Please confirm your email address', {}, null, 'auth')
    )
      .header({
        logo: Config.get('logo') ?? '',
        title: request.$t('Please confirm your email address', null, 'auth')
      })
      .text(
        request.$t(
          `Please click on the button below to confirm your email address, or copy-paste the following link in your browser address bar :<br />{url}`,
          {
            url: `${process.env.BASE_URL ?? ''}/auth/confirm-email/${
              user.validationCode
            }`
          },
          null,
          'auth'
        )
      )
      .button(
        request.$t('Confirm your email address', {}, null, 'auth'),
        `${process.env.BASE_URL ?? ''}/auth/confirm-email/${
          user.validationCode
        }`
      )
      .end()

    return await emailPlugin.sendEmail(
      user,
      request.$t(`Confirm your email address`, {}, null, 'auth'),
      html
    )
  }

  @Get('/confirm-email/:code')
  @Title('Confirm email')
  @Description('Confirm email and redirect user to auth UI')
  @Parameter('code', 'Uuid', 'Validation code')
  static async confirmEmail (
    @Parameter('code') validationCode: string,
    @Res() res: FastifyReply
  ) {
    const user = await getWaveUserModel().findOne({ validationCode })
    if (!user) return Auth.sendToErrorPage(res, 'Validation code is invalid')
    user.validated = true
    user.validationCode = ''
    await user.save()
    await getWaveAuthorizationChallengeModel().updateMany(
      {
        user: user._id
      },
      {
        $set: {
          needsValidation: false
        }
      }
    )
    const challenge = await getWaveAuthorizationChallengeModel().findOne({
      user: user._id,
      expiresAt: { $gt: new Date() }
    })
    if (challenge)
      return Auth.sendToLoginPage(res, challenge.id, { emailConfirmed: 'true' })
    res.redirect(`${process.env.AUTH_FRONTEND_URL ?? ''}/auth/email-confirmed`)
  }

  @Post('/challenges/:challengeId/login')
  @Title('Log in with email/password')
  @Description(
    'Tries to log in an account with email address and password, for a specific challenge'
  )
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Accepts('Login')
  @Returns(200, 'AuthChallengeState', 'Logged in')
  @Returns(400, 'Error', 'Bad credentials')
  static async login (
    @Parameter('challengeId') challengeId: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() request: any
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (!challenge || +challenge.expiresAt < +new Date()) throw new BadRequest()

    email = email.toLowerCase()

    const user = await getWaveUserModel().findOne({
      email
    })

    if (!user) throw BadRequest()

    try {
      const passwordValid = await Crypt.verify(password, user.password)
      if (!passwordValid) throw new BadRequest()

      let needsTotp = false
      if (Config.get('auth')?.totp && !user.totp?.pending && user.totp?.secret)
        needsTotp = true
      let needsOneTimeCode = false
      const emailPlugin = Plugins.getInstance('email')
      if (!!Config.get('auth')?.oneTimeCode && emailPlugin && user.validated)
        needsOneTimeCode = true
      challenge.user = user._id
      challenge.needsTotp = true
      challenge.authorized = true
      challenge.readyToRedirect =
        !needsTotp && user.validated && !needsOneTimeCode
      challenge.needsTotp = needsTotp
      challenge.needsValidation = !user.validated
      challenge.needsOneTimeCode = needsOneTimeCode
      if (needsOneTimeCode) {
        await AuthOneTimeCode.sendOneTimeCode(user, challenge, request)
      }
      await challenge.save()

      return {
        authorized: challenge.authorized,
        readyToRedirect: challenge.readyToRedirect,
        needsTotp,
        needsValidation: challenge.needsValidation,
        needsOneTimeCode,
        haveTotp: user.totp?.secret && !user.totp?.pending,
        totpType: user?.totp?.isGoogle ? 'google' : 'totp'
      }
    } catch {
      throw new BadRequest()
    }
  }
}
