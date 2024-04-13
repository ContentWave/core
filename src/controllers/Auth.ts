import {
  Description,
  FastifyReply,
  Get,
  Prefix,
  Query,
  Res,
  Title
} from '@swarmjs/core'
import { Key } from '../classes/Key'
import { Config } from '../classes/Config'
import { Plugins } from '../classes/Plugins'

@Title('Auth')
@Description('Handles authentication to this server')
@Prefix('/auth', true)
export class Auth {
  @Get('/authorize')
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
    if (scope === undefined)
      return Auth.sendToErrorPage(res, 'scope must be specified.')
    if (state === undefined)
      return Auth.sendToErrorPage(res, 'state must be specified.')
    if (codeChallenge === undefined)
      return Auth.sendToErrorPage(res, 'code_challenge must be specified.')
    if (codeChallengeMethod === undefined)
      return Auth.sendToErrorPage(
        res,
        'code_challenge_method must be specified.'
      )

    const valid = Key.validateKey(clientId, redirectUri)
    if (!valid)
      return Auth.sendToErrorPage(
        res,
        'This client_id does not exists or has been deleted.'
      )
  }

  static async sendToErrorPage (res: FastifyReply, errorMessage: string) {
    res.redirect(
      `${
        process.env.AUTH_FRONTEND_URL ?? ''
      }/auth/login/error?msg=${encodeURIComponent(errorMessage)}`
    )
  }

  static async sendToLoginPage (res: FastifyReply, errorMessage: string) {
    res.redirect(
      `${
        process.env.AUTH_FRONTEND_URL ?? ''
      }/auth/login/?msg=${encodeURIComponent(errorMessage)}`
    )
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
