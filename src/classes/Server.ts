import { Swarm } from '@swarmjs/core'

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
      title: process.env.APP_TITLE ?? '',
      description: process.env.APP_DESCRIPTION ?? '',
      baseUrl: process.env.BASE_URL ?? '',
      servers: [
        {
          url: process.env.BASE_URL ?? '',
          description: process.env.APP_TITLE ?? ''
        }
      ],
      languages: (process.env.LANGUAGES ?? 'en').split(',')
    })

    app.fastify.register(require('@fastify/cors'), {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })

    app.fastify.register(require('@fastify/multipart'), {
      limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: +(process.env.FILE_UPLOAD_LIMIT ?? 5242880), // Max field value size in bytes
        fields: 10, // Max number of non-file fields
        fileSize: +(process.env.FILE_UPLOAD_LIMIT ?? 5242880), // For multipart forms, the max file size in bytes
        files: 1, // Max number of file fields
        headerPairs: 2000 // Max number of header key=>value pairs
      }
    })

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
