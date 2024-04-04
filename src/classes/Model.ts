import { Db } from './Db'
import { IOrmConf } from './Orm/IOrmConf'

const cache: { [key: string]: IOrmConf } = {}

export class Model {
  static async retrieveModelsFromDb () {
    const models = Db.model('WaveModel')?.find({}) ?? []
    for await (const model of models) {
      cache[model.name] = model.conf
    }
  }

  static getModel (name: string): IOrmConf | null {
    return cache[name] ?? null
  }

  static getModels (): { [key: string]: IOrmConf } {
    return cache
  }

  static async setModel (name: string, conf: IOrmConf) {
    cache[name] = conf
    await Db.model('WaveModel')?.updateOne(
      { name },
      { name, conf },
      { upsert: true }
    )
    await Db.init()
  }

  static async deleteModel (name: string) {
    if (cache[name] !== undefined) delete cache[name]
    await Db.model('WaveModel')?.deleteOne({ name })
    await Db.init()
  }
}
