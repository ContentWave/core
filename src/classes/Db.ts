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
import createWaveKey from '../models/WaveKey'
import { Key } from './Key'
import createWaveAuthorizationChallenge from '../models/WaveAuthorizationChallenge'
import createWaveAuthorizationCode from '../models/WaveAuthorizationCode'
import createWaveSession from '../models/WaveSession'
import createWaveProject from '../models/WaveProject'
import { Projects } from './Projects'

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
    createWaveKey(newInstance)
    createWaveAuthorizationChallenge(newInstance)
    createWaveAuthorizationCode(newInstance)
    createWaveSession(newInstance)
    createWaveProject(newInstance)

    const oldInstance = Db.instance
    Db.instance = newInstance
    if (oldInstance) await oldInstance.close()

    await Projects.retrieveProjectsFromDb()
    await Config.retrieveConfigFromDb()
    await Model.retrieveModelsFromDb()
    await Key.retrieveKeysFromDb()

    // Handle dynamic models
    const models = Model.getList()
    for (let modelName in models) {
      const schema = Formatter.getMongooseSchema(models[modelName])
      newInstance.model(modelName, schema)
    }
  }

  static async close () {
    if (Db.instance) await Db.instance.close()
  }

  static model<T, U> (project: string, name: string): mongoose.Model<T, U> {
    const models = Db.instance.modelNames()
    if (models.includes(`${project}_${name}`) === false)
      return Db.instance.model<T, U>(
        name,
        new mongoose.Schema()
      ) as mongoose.Model<T, U>
    return Db.instance.model<T, U>(name) as mongoose.Model<T, U>
  }
}
