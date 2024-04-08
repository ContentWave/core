import {
  IWaveModelAuthorizations,
  IWaveModelRelation
} from '../models/WaveModel'
import { Db } from './Db'
import { IOrmConf } from '../interfaces/IOrmConf'

interface IModelConf {
  conf: IOrmConf
  relations: IWaveModelRelation[]
  authorizations: IWaveModelAuthorizations
}

const cache: { [key: string]: IModelConf } = {}

export class Model {
  static async retrieveModelsFromDb () {
    const models = Db.model('WaveModel')?.find({}) ?? []
    for await (const model of models) {
      cache[model.name] = {
        conf: model.conf,
        relations: model.relations,
        authorizations: model.authorizations
      }
    }
  }

  static getConf (name: string): IOrmConf | null {
    return cache[name]?.conf ?? null
  }

  static getRelations (name: string): IWaveModelRelation[] {
    return cache[name]?.relations ?? []
  }

  static getAuthorizations (name: string): IWaveModelAuthorizations | undefined {
    return cache[name]?.authorizations ?? undefined
  }

  static getList (): { [key: string]: IModelConf } {
    return cache
  }

  static async update (
    name: string,
    conf: IOrmConf,
    relations: IWaveModelRelation[],
    authorizations: IWaveModelAuthorizations
  ) {
    cache[name] = { conf, relations, authorizations }
    await Db.model('WaveModel')?.updateOne(
      { name },
      { name, conf, relations, authorizations },
      { upsert: true }
    )
    await Db.init()
  }

  static async delete (name: string) {
    if (cache[name] !== undefined) delete cache[name]
    await Db.model('WaveModel')?.deleteOne({ name })
    await Db.init()
  }
}
