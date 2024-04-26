import { Swarm } from '@swarmjs/core'
import { handleError } from './Errors'
import { Config } from './Config'
import path from 'path'
import { Auth } from '../controllers/Auth'
import { Ui } from '../controllers/Ui'
import { getWaveSessionModel } from '../models/WaveSession'
import { getWaveRequestModel } from '../models/WaveRequest'
import { AuthPassword } from '../controllers/AuthPassword'
import { SwaggerPlugin } from '@swarmjs/swagger'
import { AuthOneTimeCode } from '../controllers/AuthOneTimeCode'
import { AuthFido } from '../controllers/AuthFido'
import { AuthTotp } from '../controllers/AuthTotp'
import { AuthMagicLink } from '../controllers/AuthMagicLink'
import { AuthSso } from '../controllers/AuthSso'
import { Schemas } from '../controllers/Schemas'
import { Dashboard } from '../controllers/Dashboard'

let instance: Swarm

/**
 * Handles HTTP server
 */
export class Server {
  /**
   * Start the server, or restart it if there is already one instance running
   */
  static async start () {
    const app = new Swarm({
      logLevel: process.env.LOG_LEVEL ?? 'info',
      title: Config.get('title') ?? '',
      description: Config.get('description') ?? '',
      baseUrl: process.env.BASE_URL ?? '',
      servers: [
        {
          url: process.env.BASE_URL ?? '',
          description: Config.get('title') ?? ''
        }
      ],
      languages: Config.get('languages') ?? ['en'],
      bodyLimit: Config.get('fileUploadLimit') ?? 5242880
    })

    /**
     * Swarm plugins
     */
    app.use(SwaggerPlugin, {
      appendToJs: `window.ui.initOAuth({
        clientId: "self",
        clientSecret: "",
        realm: "",
        appName: "",
        scopeSeparator: " ",
        scopes: "",
        additionalQueryStringParams: {},
        useBasicAuthenticationWithAccessCodeGrant: false,
        usePkceWithAuthorizationCodeGrant: true
      })`
    })

    /**
     * Global error handler
     */
    process.on('uncaughtException', function (err: any) {
      handleError(err)
      console.error(err)
    })

    await Server.registerFastifyPlugins(app)
    await Server.registerPerformanceHooks(app)
    await Server.registerAuthHooks(app)
    await Server.registerControllers(app)

    if (instance) {
      await instance.fastify.close()
    }

    instance = app

    await instance.listen(
      +(process.env.PORT ?? 8080),
      process.env.HOST ?? '0.0.0.0'
    )
  }

  static async registerFastifyPlugins (app: Swarm) {
    /**
     * Handle CORS
     */
    app.fastify.register(require('@fastify/cors'), {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })

    /**
     * Allow urlencoded forms
     */
    app.fastify.register(require('@fastify/formbody'))

    /**
     * Allow file uploads
     */
    app.fastify.register(require('@fastify/multipart'), {
      limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: Config.get('fileUploadLimit') ?? 5242880, // Max field value size in bytes
        fields: 10, // Max number of non-file fields
        fileSize: Config.get('fileUploadLimit') ?? 5242880, // For multipart forms, the max file size in bytes
        files: 1, // Max number of file fields
        headerPairs: 2000 // Max number of header key=>value pairs
      }
    })

    /**
     * Handle frontends
     */
    app.fastify.register(require('@fastify/static'), {
      root: path.join(__dirname, '../frontend/auth/.output/public/'),
      prefix: '/auth',
      decorateReply: false,
      prefixAvoidTrailingSlash: true
    })
    app.fastify.register(require('@fastify/static'), {
      root: path.join(__dirname, '../frontend/dashboard/.output/public/'),
      prefix: '/dashboard',
      decorateReply: false,
      prefixAvoidTrailingSlash: true
    })
  }

  static async registerPerformanceHooks (app: Swarm) {
    /**
     * Hooks to monitor performance
     */
    app.hooks.add('preHandler', (state: any) => {
      state.startDate = +new Date()
      return state
    })
    app.hooks.add('postHandler', (state: any) => {
      getWaveRequestModel().create({
        controller: state.controller,
        method: state.method,
        duration: +new Date() - state.startDate,
        error: false,
        date: new Date()
      })
    })
    app.hooks.add('onError', (state: any) => {
      handleError(state.error)
      getWaveRequestModel().create({
        controller: state.controller,
        method: state.method,
        duration: +new Date() - state.startDate,
        error: true,
        date: new Date()
      })
    })
  }

  static async registerAuthHooks (app: Swarm) {
    /**
     * Auth
     */
    app.fastify.decorateRequest('user', null)
    app.fastify.decorateRequest('session', null)
    app.fastify.addHook('preHandler', async function (req: any) {
      if (req.headers.authorization === undefined) return

      const [mode, token] = req.headers.authorization.split(' ')

      switch (mode) {
        case 'Bearer':
          const session = await getWaveSessionModel().findByAccessToken(token)
          if (session) {
            req.session = session
            req.user = session.user
          }
          break
      }
    })
    app.onSocketConnection(async (socket: any, eventBus: any) => {
      const session = await getWaveSessionModel().findByAccessToken(
        socket.handshake.auth.token
      )
      if (session) {
        socket.join(`user:${session.user.id}`)
        socket.data.userId = session.user.id
        eventBus.emit('loggedIn', session.user.id)
      } else {
        socket.disconnect(true)
      }
    })
    app.setOption('getUserAccess', (req: any) => {
      if (req.user === null) return ['$anonymous']
      return ['$loggedIn', `user:${req.user.id}`, ...(req.user.roles ?? [])]
    })
    app.oauth2AuthAutorizationCode(
      `${process.env.BASE_URL ?? ''}/auth/authorize`,
      `${process.env.BASE_URL ?? ''}/auth/token`,
      `${process.env.BASE_URL ?? ''}/auth/token`,
      {}
    )
    app.appendOption('injectors', {
      name: 'auth:user',
      getValue (req: any) {
        return req.user
      }
    })
    app.appendOption('injectors', {
      name: 'auth:session',
      getValue (req: any) {
        return req.session
      }
    })

    /**
     * I18n
     */
    app.i18n.addTranslations(
      {
        en: require('../locales/auth/en.json'),
        fr: require('../locales/auth/fr.json')
      },
      'auth'
    )
  }

  static async registerControllers (app: Swarm) {
    AuthFido.setup()

    app.controllers.add(Auth)
    app.controllers.add(AuthPassword)
    app.controllers.add(AuthOneTimeCode)
    app.controllers.add(AuthFido)
    app.controllers.add(AuthTotp)
    app.controllers.add(AuthMagicLink)
    app.controllers.add(AuthSso)
    app.controllers.add(Ui)
    app.controllers.add(Schemas)
    app.controllers.add(Dashboard)
  }
}
