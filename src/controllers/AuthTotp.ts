import {
  Accepts,
  Access,
  Body,
  Delete,
  Description,
  FastifyReply,
  Parameter,
  Post,
  Prefix,
  Query,
  Res,
  Returns,
  Title
} from '@swarmjs/core'
import { getWaveAuthorizationChallengeModel } from '../models/WaveAuthorizationChallenge'
import { BadRequest, Forbidden } from 'http-errors'
import { IWaveUser } from '../models/WaveUser'
import { Config } from '../classes/Config'
import { Auth } from './Auth'
import { authenticator, totp } from 'otplib'
import qrcode from 'qrcode'
import randomstring from 'randomstring'
import { User } from '../decorators/user'

@Title('Auth')
@Description('Handles authentication to this server')
@Prefix('/auth', true)
export class AuthTotp {
  @Post('/challenges/:challengeId/totp')
  @Title('Get QRCode')
  @Description('Get QRCode to attach logged in account to TOTP provider')
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Query(
    'google',
    { type: 'string', enum: ['true', 'false'] },
    'If provider is Google Authenticator'
  )
  @Returns(200, 'QRCode', 'Generated QRCode')
  @Returns(400, 'Error', 'The logged in account already has an authenticator')
  static async add (
    @Parameter('challengeId') challengeId: string,
    @Query('google') isGoogle: string = 'false'
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (!challenge || +challenge.expiresAt < +new Date()) throw new BadRequest()

    await challenge.populate('user')
    if (!challenge.user) throw new BadRequest()
    const user: IWaveUser = challenge.user as IWaveUser
    if (!user.totp?.pending && user.totp?.secret) throw new BadRequest()

    user.totp = {
      pending: true,
      secret:
        isGoogle === 'true'
          ? authenticator.generateSecret()
          : randomstring
              .generate({ length: 16, charset: 'alphanumeric' })
              .toUpperCase(),
      isGoogle: isGoogle === 'true'
    }
    await user.save()

    let otpauth

    if (user.totp.isGoogle)
      otpauth = authenticator.keyuri(
        user.email,
        Config.get('title'),
        user.totp.secret
      )
    else
      otpauth = totp.keyuri(user.email, Config.get('title'), user.totp.secret)
    const imageUrl = await qrcode.toDataURL(otpauth)

    return {
      qrcode: imageUrl
    }
  }

  @Post('/challenges/:challengeId/totp/validate')
  @Title('Validate TOTP')
  @Description('Validates TOTP provider')
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Accepts('TotpCode')
  @Returns(200, 'Empty', 'Provider is validated')
  @Returns(
    400,
    'Error',
    'No authenticator on this account, or already validated'
  )
  @Returns(403, 'Error', 'Code is invalid')
  static async validate (
    @Parameter('challengeId') challengeId: string,
    @Body('code') code: string
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (!challenge || +challenge.expiresAt < +new Date()) throw new BadRequest()

    await challenge.populate('user')
    if (!challenge.user) throw new BadRequest()
    const user: IWaveUser = challenge.user as IWaveUser

    if (!user.totp?.pending || !user.totp?.secret) throw new BadRequest()

    try {
      const isValid = user.totp.isGoogle
        ? authenticator.verify({
            token: code,
            secret: user.totp.secret
          })
        : totp.verify({ token: code, secret: user.totp.secret })
      if (!isValid) throw new Forbidden()
    } catch (err: any) {
      throw new Forbidden()
    }

    user.totp.pending = false
    user.markModified('totp')
    await user.save()

    return {}
  }

  @Post('/challenges/:challengeId/totp/verify')
  @Title('Verify TOTP')
  @Description('Verify TOTP code')
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Accepts('TotpCode')
  @Returns(200, 'AuthChallengeState', 'Code is validated')
  @Returns(
    400,
    'Error',
    'No authenticator on this account, or already validated'
  )
  @Returns(403, 'Error', 'Code is invalid')
  static async verify (
    @Parameter('challengeId') challengeId: string,
    @Body('code') code: string
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (
      !challenge ||
      +challenge.expiresAt < +new Date() ||
      !challenge.needsTotp
    )
      throw new BadRequest()

    await challenge.populate('user')
    if (!challenge.user) throw new BadRequest()
    const user: IWaveUser = challenge.user as IWaveUser

    if (user.totp?.pending || !user.totp?.secret) {
      challenge.needsTotp = false
    } else {
      try {
        const isValid = user.totp.isGoogle
          ? authenticator.verify({
              token: code,
              secret: user.totp.secret
            })
          : totp.verify({ token: code, secret: user.totp.secret })
        if (!isValid) throw new Forbidden()
      } catch (err: any) {
        throw new Forbidden()
      }
    }

    challenge.readyToRedirect =
      !challenge.needsTotp && user.validated && !challenge.needsOneTimeCode
    await challenge.save()

    return {
      authorized: challenge.authorized,
      readyToRedirect: challenge.readyToRedirect,
      redirectUrl: challenge.readyToRedirect
        ? await Auth.fulfillChallenge(challengeId)
        : undefined,
      needsTotp: challenge.needsTotp,
      needsValidation: challenge.needsValidation,
      needsOneTimeCode: challenge.needsOneTimeCode,
      haveTotp: user?.totp?.secret && !user?.totp?.pending,
      totpType: user?.totp?.isGoogle ? 'google' : 'totp'
    }
  }

  @Delete('/totp')
  @Title('Deletes TOTP')
  @Description('Deletes TOTP for the logged in user')
  @Access('$loggedIn')
  @Returns(204, 'Empty', 'TOTP is deleted')
  @Returns(400, 'Error', 'No authenticator on this account')
  @Returns(403, 'Error', 'Not logged in')
  static async delete (@User() user: IWaveUser, @Res() reply: FastifyReply) {
    if (!user.totp?.secret) throw new BadRequest()
    user.totp = {
      pending: false,
      secret: '',
      isGoogle: false
    }
    user.markModified('totp')
    await user.save()
    reply.code(204)
    return {}
  }
}
