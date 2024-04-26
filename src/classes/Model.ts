import {
  IWaveModelAuthorizations,
  IWaveModelRelation,
  IWaveModelSearch,
  getWaveModelModel
} from '../models/WaveModel'
import { Db } from './Db'
import { IOrmConf } from '../interfaces/IOrmConf'
import ivm from 'isolated-vm'

export interface IModelConf {
  conf: IOrmConf
  relations: IWaveModelRelation[]
  authorizations: IWaveModelAuthorizations
  search: IWaveModelSearch
  cached: boolean
  nameField: string
}

interface IModelSearchResult {
  keep: boolean
  score: number
}

const cache: { [key: string]: IModelConf } = {}
const searchFunctions: { [key: string]: string } = {}

export class Model {
  static async retrieveModelsFromDb () {
    const models = getWaveModelModel().find({}) ?? []
    for await (const model of models) {
      cache[model.name] = {
        conf: model.conf,
        relations: model.relations,
        authorizations: model.authorizations,
        search: model.search,
        cached: model.cached,
        nameField: model.nameField
      }
      if (model.search?.enabled && model.search?.method === 'js') {
        Model.saveSearchFunction(model.name, model.search.js ?? '')
      }
    }
  }

  static saveSearchFunction (name: string, code: string) {
    searchFunctions[name] = code
  }

  static async runSearchFunction (
    name: string,
    data: any
  ): Promise<IModelSearchResult> {
    const isolate = new ivm.Isolate({ memoryLimit: 64 })
    const context = await isolate.createContext()
    const ret = await context.evalClosure(
      `$data = ${JSON.stringify(data)};
      let $score = 0;
      let $keep = true;
      ${searchFunctions[name]}
      ; return !!$keep ? +$score : null`
    )
    if (ret === null)
      return {
        keep: false,
        score: 0
      }
    return { keep: true, score: ret }
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

  static getNameField (name: string): string | undefined {
    return cache[name]?.nameField ?? undefined
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
    cached: boolean,
    nameField: string
  ) {
    cache[name] = {
      conf,
      relations,
      authorizations,
      search,
      cached,
      nameField
    }

    if (search?.enabled && search?.method === 'js') {
      Model.saveSearchFunction(name, search.js ?? '')
    }

    await getWaveModelModel().updateOne(
      { name },
      {
        $set: {
          name,
          conf,
          relations,
          authorizations,
          search,
          cached,
          nameField
        }
      },
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
