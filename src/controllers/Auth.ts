import {
  Accepts,
  Body,
  Description,
  FastifyReply,
  Get,
  Header,
  Post,
  Prefix,
  Query,
  Res,
  Returns,
  Title
} from '@swarmjs/core'
import { Key } from '../classes/Key'
import { Config } from '../classes/Config'
import { Plugins } from '../classes/Plugins'
import { Db } from '../classes/Db'
import dayjs from 'dayjs'
import { HydratedDocument } from 'mongoose'
import { IWaveUser, WaveUserModel } from '../models/WaveUser'
import jwt from 'jsonwebtoken'
import { BadRequest } from 'http-errors'
import UAParser from 'ua-parser-js'
import crypto, { randomUUID } from 'crypto'
import { IWaveSession, IWaveSessionMethods } from '../models/WaveSession'

@Title('Auth')
@Description('Handles authentication to this server')
@Prefix('/auth', true)
export class Auth {
  @Get('/authorize')
  @Title('Start OAuth2 login process')
  @Description('Redirects the user to the login page')
  @Query('response_type', { type: 'string', enum: ['code'] })
  @Query('client_id', { type: 'string', pattern: '^[0-9a-f]{24}$' })
  @Query('redirect_uri', { type: 'string', format: 'uri' })
  @Query('scope', { type: 'string' })
  @Query('state', { type: 'string' })
  @Query('code_challenge', { type: 'string' })
  @Query('code_challenge_method', { type: 'string', enum: ['S256'] })
  static async authorize (
    @Query('response_type') responseType: string | undefined,
    @Query('client_id') clientId: string | undefined,
    @Query('redirect_uri') redirectUri: string | undefined,
    @Query('scope') scope: string | undefined,
    @Query('state') state: string | undefined,
    @Query('code_challenge') codeChallenge: string | undefined,
    @Query('code_challenge_method') codeChallengeMethod: string | undefined,
    @Res() res: FastifyReply
  ) {
    if (responseType !== 'code')
      return Auth.sendToErrorPage(res, 'response_type must be "code".')
    if (clientId === undefined)
      return Auth.sendToErrorPage(res, 'client_id must be specified.')
    if (redirectUri === undefined)
      return Auth.sendToErrorPage(res, 'redirect_uri must be specified.')
    if (codeChallenge === undefined)
      return Auth.sendToErrorPage(res, 'code_challenge must be specified.')
    if (codeChallengeMethod === undefined)
      return Auth.sendToErrorPage(
        res,
        'code_challenge_method must be specified.'
      )
    scope ??= ''
    state ??= ''

    const valid = Key.validateKey(clientId, redirectUri)
    if (!valid)
      return Auth.sendToErrorPage(
        res,
        'This client_id does not exists or has been deleted.'
      )
    const challenge = await Db.model('WaveAuthorizationChallenge')?.create({
      redirectUri,
      expiresAt: dayjs().add(15, 'minutes').toDate(),
      codeChallenge,
      codeChallengeMethod,
      clientId
    })
    if (!challenge)
      return Auth.sendToErrorPage(
        res,
        'An error occured when creating the challenge.'
      )
    return Auth.sendToLoginPage(res, challenge.id)
  }

  static async fulfillChallengeWithUser (
    res: FastifyReply,
    challengeId: string,
    user: HydratedDocument<IWaveUser>
  ) {
    const challenge = await Db.model('WaveAuthorizationChallenge')?.findById(
      challengeId
    )
    if (!challenge || +challenge.expiresAt < +new Date())
      return Auth.sendToErrorPage(
        res,
        'The challenge is expired, please try again.'
      )
    await Db.model('WaveAuthorizationChallenge')?.deleteOne({
      _id: challenge._id
    })

    const code = await Db.model('WaveAuthorizationCode')?.create({
      code: jwt.sign(
        {
          uri: challenge.redirectUri,
          id: challenge.clientId
        },
        Config.get('jwtKey')
      ),
      expiresAt: dayjs().add(1, 'minute').toDate(),
      codeChallenge: challenge.codeChallenge,
      codeChallengeMethod: challenge.codeChallengeMethod,
      redirectUri: challenge.redirectUri,
      clientId: challenge.clientId,
      user: user._id
    })

    const url = new URL(challenge.redirectUri)
    url.searchParams.set('code', code.code)
    res.redirect(url.href)
  }

  static async sendToErrorPage (res: FastifyReply, errorMessage: string) {
    res.redirect(
      `${
        process.env.AUTH_FRONTEND_URL ?? ''
      }/auth/error?msg=${encodeURIComponent(errorMessage)}`
    )
  }

  static async sendToLoginPage (res: FastifyReply, challengeId: string) {
    res.redirect(
      `${
        process.env.AUTH_FRONTEND_URL ?? ''
      }/auth/login/?challenge_id=${challengeId}`
    )
  }

  @Post('/token')
  @Title('Exchange an authorization code')
  @Description(
    'Exchange an authorization code for an access token and a refresh token'
  )
  @Accepts('OAuthTokenExchange')
  @Returns(200, 'OAuthToken', 'Access and refresh tokens')
  @Returns(400, 'Error', 'Code expired')
  static async token (
    @Body('grant_type') grantType: 'refresh_token' | 'authorization_code',
    @Body('client_id') clientId: string,
    @Body('redirect_uri') redirectUri: string = '',
    @Body('code_verifier') codeVerifier: string = '',
    @Body('code') code: string = '',
    @Body('refresh_token') refreshToken: string = '',
    @Header('user-agent') userAgent: string = ''
  ) {
    try {
      let session: HydratedDocument<
        IWaveSession,
        IWaveSessionMethods,
        WaveUserModel
      > | null = null
      if (grantType === 'authorization_code') {
        const parser = new UAParser(userAgent)
        const parserResult = parser.getResult()
        const decoded: any = jwt.verify(code, Config.get('jwtKey'))
        const challenge = await Db.model('WaveAuthorizationCode')?.findOne({
          code,
          expiresAt: {
            $gt: new Date()
          }
        })
        if (
          !challenge ||
          challenge.redirectUri !== decoded.uri ||
          challenge.clientId !== decoded.id ||
          challenge.redirectUri !== redirectUri ||
          challenge.clientId !== clientId
        )
          throw new BadRequest()

        const codeChallenge: string = crypto.subtle
          .digest('SHA-256', new TextEncoder().encode(codeVerifier))
          .toString()
        if (codeChallenge !== challenge.codeChallenge) throw new BadRequest()

        refreshToken = jwt.sign(
          {
            id: randomUUID()
          },
          Config.get('jwtKey')
        )

        session = await Db.model('WaveSession')?.create({
          user: challenge.user._id,
          browserName: parserResult.browser?.name ?? 'Unknown',
          osName: parserResult.os?.name ?? 'Unknown',
          refreshToken,
          lastUsed: new Date()
        })
      } else if (grantType === 'refresh_token') {
        session =
          (await Db.model('WaveSession')?.findOne({ refreshToken })) ?? null
        if (session) {
          session.lastUsed = new Date()
          await session.save()
        }
      }

      if (!session) throw new BadRequest()

      const accessToken = session.getAccessToken()

      return {
        token_type: 'bearer',
        expires_in: 1800,
        access_token: accessToken,
        refresh_token: refreshToken,
        scope: ''
      }
    } catch {
      throw new BadRequest()
    }
  }

  @Get('/config')
  @Title('Retrieves auth configuration')
  @Description('Returns various configurations for the login/register page')
  static async getConfiguration () {
    return {
      conf: Config.get('auth') ?? {
        password: true,
        fido2: true,
        googleAuthenticator: true,
        otl: true,
        invite: false,
        register: true
      },
      plugins: Plugins.getList('auth')
        .filter(plugin => plugin.enabled)
        .map(plugin => ({
          key: plugin.key,
          style: Plugins.getInstance('auth', plugin.key)?.getButtonStyle()
        }))
    }
  }
}
