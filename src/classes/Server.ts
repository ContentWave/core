import { Swarm } from '@swarmjs/core'
import { Db } from './Db'
import { handleError } from './Errors'
import { Config } from './Config'
import path from 'path'
import { Auth } from '../controllers/Auth'
import { Ui } from '../controllers/Ui'

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
      languages: Config.get('languages') ?? ['en']
    })

    app.fastify.register(require('@fastify/cors'), {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })

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

    // Hooks to monitor performance
    app.hooks.add('preHandler', (state: any) => {
      state.startDate = +new Date()
      return state
    })
    app.hooks.add('postHandler', (state: any) => {
      Db.model('WaveRequest')?.create({
        controller: state.controller,
        method: state.method,
        duration: +new Date() - state.startDate,
        error: false,
        date: new Date()
      })
    })
    app.hooks.add('onError', (state: any) => {
      handleError(state.error)
      Db.model('WaveRequest')?.create({
        controller: state.controller,
        method: state.method,
        duration: +new Date() - state.startDate,
        error: true,
        date: new Date()
      })
    })

    // Global error handler
    process.on('uncaughtException', function (err: any) {
      handleError(err)
      console.error(err)
    })

    // I18n
    app.i18n.addTranslations(
      {
        en: require('../locales/auth/en.json'),
        fr: require('../locales/auth/fr.json')
      },
      'auth'
    )

    // Controllers
    app.controllers.add(Auth)
    app.controllers.add(Ui)

    if (instance) {
      await instance.fastify.close()
    }

    instance = app

    await instance.listen(
      +(process.env.PORT ?? 8080),
      process.env.HOST ?? '0.0.0.0'
    )
  }
}
