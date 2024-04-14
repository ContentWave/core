import {
  IWaveModelAuthorizations,
  IWaveModelRelation,
  IWaveModelSearch,
  getWaveModelModel
} from '../models/WaveModel'
import { Db } from './Db'
import { IOrmConf } from '../interfaces/IOrmConf'

export interface IModelConf {
  conf: IOrmConf
  relations: IWaveModelRelation[]
  authorizations: IWaveModelAuthorizations
  search: IWaveModelSearch
  cached: boolean
}

const cache: { [key: string]: IModelConf } = {}

export class Model {
  static async retrieveModelsFromDb () {
    const models = getWaveModelModel().find({}) ?? []
    for await (const model of models) {
      cache[model.name] = {
        conf: model.conf,
        relations: model.relations,
        authorizations: model.authorizations,
        search: model.search,
        cached: model.cached
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

  static getSearch (name: string): IWaveModelSearch | undefined {
    return cache[name]?.search ?? undefined
  }

  static getCached (name: string): boolean {
    return cache[name]?.cached ?? false
  }

  static getList (): { [key: string]: IModelConf } {
    return cache
  }

  static async update (
    name: string,
    conf: IOrmConf,
    relations: IWaveModelRelation[],
    authorizations: IWaveModelAuthorizations,
    search: IWaveModelSearch,
    cached: boolean
  ) {
    cache[name] = { conf, relations, authorizations, search, cached }
    await getWaveModelModel().updateOne(
      { name },
      { $set: { name, conf, relations, authorizations, search, cached } },
      { upsert: true }
    )
    await Db.init()
  }

  static async delete (name: string) {
    if (cache[name] !== undefined) delete cache[name]
    await getWaveModelModel().deleteOne({ name })
    await Db.init()
  }
}
