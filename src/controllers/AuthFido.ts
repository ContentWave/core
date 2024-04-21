import {
  Accepts,
  Body,
  Description,
  Get,
  Parameter,
  Post,
  Prefix,
  Req,
  Returns,
  Title
} from '@swarmjs/core'
import { getWaveAuthorizationChallengeModel } from '../models/WaveAuthorizationChallenge'
import { BadRequest, NotFound, Forbidden } from 'http-errors'
import { IWaveUser, getWaveUserModel } from '../models/WaveUser'
import { randomUUID } from 'crypto'
import { Config } from '../classes/Config'
import {
  ExpectedAssertionResult,
  ExpectedAttestationResult,
  Fido2Lib
} from 'fido2-lib'
import base64url from 'base64url'

let fido: Fido2Lib
let origin: string

@Title('Auth')
@Description('Handles authentication to this server')
@Prefix('/auth', true)
export class AuthFido {
  static setup () {
    fido = new Fido2Lib({
      timeout: 120000,
      rpId: new URL(process.env.BASE_URL ?? '').hostname,
      rpName: Config.get('title'),
      rpIcon: Config.get('logo'),
      challengeSize: 128,
      attestation: 'none',
      cryptoParams: [-7, -257],
      authenticatorAttachment: 'platform',
      authenticatorRequireResidentKey:
        Config.get('auth')?.passkey ?? false ? true : false,
      authenticatorUserVerification: 'required'
    })
    origin = new URL(process.env.BASE_URL ?? '').origin
  }

  @Post('/challenges/:challengeId/fido2/init')
  @Title('Initialize FIDO2 configuration')
  @Description('Initiates FIDO2 protocol')
  @Accepts('Fido2Init')
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Returns(200, 'Fido2AuthParams', 'Auth parameters for FIDO, browser side')
  static async init (
    @Req() request: any,
    @Parameter('challengeId') challengeId: string
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (!challenge || +challenge.expiresAt < +new Date()) throw new BadRequest()

    await challenge.populate('user')
    if (!challenge.user) throw new BadRequest()
    const user: IWaveUser = challenge.user as IWaveUser

    const registrationOptions: any = await fido.attestationOptions()

    const id = randomUUID()
    user.fido2.push({
      id,
      deviceName: request.body.deviceName,
      challenge: Buffer.from(registrationOptions.challenge),
      authChallenge: Buffer.from([]),
      publicKey: '',
      prevCounter: 0
    })
    user.markModified('fido2')
    await user.save()

    registrationOptions.user.id = id
    registrationOptions.user.name = user.email
    registrationOptions.user.displayName =
      `${user.firstname} ${user.lastname}`.trim()
    registrationOptions.challenge = Buffer.from(registrationOptions.challenge)

    return {
      cred: id,
      registrationOptions
    }
  }

  @Post('/challenges/:challengeId/fido2/:credentialId/register')
  @Title('Register FIDO2 credentials')
  @Description('Validates and save new credentials for user')
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Parameter('credentialId', 'Uuid', 'Credential ID')
  @Accepts('Fido2Credential')
  @Returns(200, 'Empty', 'Authentication successful')
  @Returns(403, 'Error', 'Wrong credentials')
  @Returns(404, 'Error', 'Credentials not found')
  static async register (
    @Parameter('challengeId') challengeId: string,
    @Parameter('credentialId') credentialId: string,
    @Body('credential') credential: any
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (!challenge || +challenge.expiresAt < +new Date()) throw new BadRequest()

    await challenge.populate('user')
    if (!challenge.user) throw new BadRequest()
    const user: IWaveUser = challenge.user as IWaveUser

    const _this = user.fido2.find((c: any) => c.id === credentialId)
    if (!_this) throw new NotFound()

    const challengeBuffer = new Uint8Array(_this.challenge).buffer
    credential.rawId = new Uint8Array(
      Buffer.from(credential.rawId, 'base64')
    ).buffer
    credential.response.attestationObject = base64url.decode(
      credential.response.attestationObject,
      'base64'
    )
    credential.response.clientDataJSON = base64url.decode(
      credential.response.clientDataJSON,
      'base64'
    )

    const attestationExpectations: ExpectedAttestationResult = {
      challenge: Buffer.from(challengeBuffer).toString('base64url'),
      origin,
      factor: 'either'
    }

    try {
      const regResult = await fido.attestationResult(
        credential,
        attestationExpectations
      )

      user.fido2 = user.fido2.map((c: any) => {
        if (c.id === credentialId) {
          c.publicKey = regResult.authnrData.get('credentialPublicKeyPem')
          c.prevCounter = regResult.authnrData.get('counter')
        }
        return c
      })
      user.markModified('fido2')
      await user.save()

      return {}
    } catch {
      throw new Forbidden()
    }
  }

  @Get('/challenges/:challengeId/fido2/:credentialId/auth-options')
  @Title('Retrieve FIDO2 auth options')
  @Description('Get auth options for a specific credential')
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Parameter('credentialId', 'Uuid', 'Credential ID')
  @Returns(200, 'Fido2AuthOptions', 'Auth options')
  @Returns(400, 'Error', 'Challenge not found')
  @Returns(404, 'Error', 'Credential not found')
  static async authOptions (
    @Parameter('challengeId') challengeId: string,
    @Parameter('credentialId') credentialId: string
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (!challenge || +challenge.expiresAt < +new Date()) throw new BadRequest()

    await challenge.populate('user')
    if (!challenge.user) throw new BadRequest()
    const user: IWaveUser = challenge.user as IWaveUser
    const authnOptions = await fido.assertionOptions()

    let ok = false
    user.fido2 = user.fido2.map((c: any) => {
      if (c.id === credentialId) {
        c.authChallenge = Buffer.from(authnOptions.challenge)
        ok = true
      }
      return c
    })
    if (!ok) throw new NotFound()

    user.markModified('fido2')
    await user.save()

    authnOptions.challenge = Buffer.from(authnOptions.challenge)

    return authnOptions
  }

  @Post('/challenges/:challengeId/fido2/:credentialId/login')
  @Title('Authenticate user with FIDO2')
  @Description('Tries to authenticate user with supplied credentials')
  @Parameter('challengeId', 'ObjectID', 'Challenge ID')
  @Parameter('credentialId', 'Uuid', 'Credential ID')
  @Accepts('Fido2Credential')
  @Returns(200, 'AuthChallengeState', 'User logged in')
  @Returns(400, 'Error', 'Challenge not found')
  @Returns(404, 'Error', 'Credential not found')
  static async authenticate (
    @Parameter('challengeId') challengeId: string,
    @Parameter('credentialId') credentialId: string,
    @Body('credential') credential: any
  ) {
    const challenge = await getWaveAuthorizationChallengeModel().findById(
      challengeId
    )
    if (!challenge || +challenge.expiresAt < +new Date()) throw new BadRequest()

    const user = await getWaveUserModel().findOne({
      'fido2.id': credentialId
    })
    if (!user) throw new NotFound()

    const _this = user.fido2.find((c: any) => c.id === credentialId)
    if (!_this) throw new NotFound()

    credential.rawId = new Uint8Array(
      Buffer.from(credential.rawId, 'base64')
    ).buffer

    const challengeBuffer = new Uint8Array(_this.authChallenge).buffer

    if (_this.publicKey === 'undefined' || _this.prevCounter === undefined) {
      throw new Forbidden()
    } else {
      const assertionExpectations: ExpectedAssertionResult = {
        challenge: Buffer.from(challengeBuffer).toString('base64url'),
        origin: origin,
        factor: 'either',
        publicKey: _this.publicKey,
        prevCounter: _this.prevCounter,
        userHandle: new Uint8Array(Buffer.from(_this.id)).buffer.toString()
      }

      try {
        await fido.assertionResult(credential, assertionExpectations)

        challenge.authorized = true
        challenge.user = user._id
        challenge.readyToRedirect = user.validated
        await challenge.save()

        /**
         * Here, we consider that if the user is authentified with FIDO2, he doesn't need to use MFA anymore, because what's more
         * secure than a finger ? A live finger.
         */

        return {
          authorized: challenge.authorized,
          readyToRedirect: challenge.readyToRedirect,
          needsTotp: false,
          needsValidation: challenge.needsValidation,
          needsOneTimeCode: false,
          haveTotp: user?.totp?.secret && !user?.totp?.pending,
          totpType: user?.totp?.isGoogle ? 'google' : 'totp'
        }
      } catch {
        throw new Forbidden()
      }
    }
  }
}
