import mongoose, { Connection } from 'mongoose'
import createWaveModel from '../models/WaveModel'
import { Formatter } from './Orm/Formatter'
import createWavePlugin from '../models/WavePlugin'
import { Model } from './Model'
import createWaveConfig from '../models/WaveConfig'
import { Config } from './Config'

let instance: Connection

/**
 * Handles Database connection
 */
export class Db {
  /**
   * Connects to the database and stores a reference to the actual database
   */
  static async init (): Promise<void> {
    const newInstance = await mongoose
      .createConnection(process.env.MONGO_DSN as string, {
        maxPoolSize: +((process.env.MONGO_MAX_POOL_SIZE as string) ?? '5')
      })
      .asPromise()
    // Now register models
    createWaveModel(newInstance)
    createWavePlugin(newInstance)
    createWaveConfig(newInstance)

    await Config.retrieveConfigFromDb()
    await Model.retrieveModelsFromDb()

    // Handle dynamic models
    const models = Model.getModels()
    for (let modelName in models) {
      const schema = Formatter.getMongooseSchema(models[modelName])
      newInstance.model(modelName, schema)
    }

    // And now, replace the instance
    const oldInstance = instance
    instance = newInstance
    if (oldInstance) await oldInstance.close()
  }

  static get instance (): Connection {
    return instance
  }

  static model (
    name: string
  ): mongoose.Model<any, unknown, unknown, {}, any, any> | null {
    const models = instance.modelNames()
    if (models.includes(name) === false) return null
    return instance.model(name)
  }
}
