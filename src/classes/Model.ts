import { IWaveModelRelation } from '../models/WaveModel'
import { Db } from './Db'
import { IOrmConf } from './Orm/IOrmConf'

interface IModelConf {
  conf: IOrmConf
  relations: IWaveModelRelation[]
}

const cache: { [key: string]: IModelConf } = {}

export class Model {
  static async retrieveModelsFromDb () {
    const models = Db.model('WaveModel')?.find({}) ?? []
    for await (const model of models) {
      cache[model.name] = { conf: model.conf, relations: model.relations }
    }
  }

  static getConf (name: string): IOrmConf | null {
    return cache[name]?.conf ?? null
  }

  static getRelations (name: string): IWaveModelRelation[] {
    return cache[name]?.relations ?? []
  }

  static getModels (): { [key: string]: IModelConf } {
    return cache
  }

  static async setModel (
    name: string,
    conf: IOrmConf,
    relations: IWaveModelRelation[] = []
  ) {
    cache[name] = { conf, relations }
    await Db.model('WaveModel')?.updateOne(
      { name },
      { name, conf, relations },
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
