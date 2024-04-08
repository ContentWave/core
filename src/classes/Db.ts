import mongoose, { Connection } from 'mongoose'
import createWaveModel from '../models/WaveModel'
import { Formatter } from './Orm/Formatter'
import createWavePlugin from '../models/WavePlugin'
import { Model } from './Model'
import createWaveConfig from '../models/WaveConfig'
import { Config } from './Config'
import createWaveRequest from '../models/WaveRequest'
import createWaveUser from '../models/WaveUser'
import createWaveError from '../models/WaveError'

/**
 * Handles Database connection
 */
export class Db {
  static instance: Connection

  /**
   * Connects to the database and stores a reference to the actual database
   */
  static async init (): Promise<void> {
    const newInstance = await mongoose
      .createConnection(process.env.MONGO_URL as string, {
        maxPoolSize: +((process.env.MONGO_MAX_POOL_SIZE as string) ?? '5')
      })
      .asPromise()
    // Now register models
    createWaveModel(newInstance)
    createWavePlugin(newInstance)
    createWaveConfig(newInstance)
    createWaveRequest(newInstance)
    createWaveError(newInstance)
    createWaveUser(newInstance)

    const oldInstance = Db.instance
    Db.instance = newInstance
    if (oldInstance) await oldInstance.close()

    await Config.retrieveConfigFromDb()
    await Model.retrieveModelsFromDb()

    // Handle dynamic models
    const models = Model.getList()
    for (let modelName in models) {
      const schema = Formatter.getMongooseSchema(models[modelName].conf)
      newInstance.model(modelName, schema)
    }
  }

  static async close () {
    if (Db.instance) await Db.instance.close()
  }

  static model<T, U, V> (
    name: string
  ): mongoose.Model<any, unknown, unknown, {}, any, any> | null {
    const models = Db.instance.modelNames()
    if (models.includes(name) === false) return null
    return Db.instance.model<T, U, V>(name) as mongoose.Model<
      any,
      unknown,
      unknown,
      {},
      any,
      any
    >
  }
}
