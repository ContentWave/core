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
  project: string
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

let cache: { [key: string]: IModelConf } = {}
let searchFunctions: { [key: string]: string } = {}

export class Model {
  static async retrieveModelsFromDb () {
    const newCache: { [key: string]: IModelConf } = {}
    const newSearchFunctions: { [key: string]: string } = {}

    const models = getWaveModelModel().find({}) ?? []
    for await (const model of models) {
      newCache[`${model.project}:${model.name}`] = {
        conf: model.conf,
        project: model.project,
        relations: model.relations,
        authorizations: model.authorizations,
        search: model.search,
        cached: model.cached,
        nameField: model.nameField
      }
      if (model.search?.enabled && model.search?.method === 'js') {
        newSearchFunctions[`${model.project}_${model.name}`] =
          model.search.js ?? ''
      }
    }

    cache = newCache
    searchFunctions = newSearchFunctions

    getWaveModelModel()
      .watch()
      .on('change', () => {
        Db.init()
      })
  }

  static saveSearchFunction (project: string, name: string, code: string) {
    searchFunctions[`${project}_${name}`] = code
  }

  static async runSearchFunction (
    project: string,
    name: string,
    $data: any
  ): Promise<IModelSearchResult> {
    let $score = 0
    let $keep = true
    $data['_original'] = JSON.parse(JSON.stringify($data))
    eval(searchFunctions[`${project}_${name}`])
    return { keep: $keep, score: $score }
  }

  static getConf (project: string, name: string): IOrmConf | null {
    return cache[`${project}_${name}`]?.conf ?? null
  }

  static getRelations (project: string, name: string): IWaveModelRelation[] {
    return cache[`${project}_${name}`]?.relations ?? []
  }

  static getAuthorizations (
    project: string,
    name: string
  ): IWaveModelAuthorizations | undefined {
    return cache[`${project}_${name}`]?.authorizations ?? undefined
  }

  static getSearch (
    project: string,
    name: string
  ): IWaveModelSearch | undefined {
    return cache[`${project}_${name}`]?.search ?? undefined
  }

  static getCached (project: string, name: string): boolean {
    return cache[`${project}_${name}`]?.cached ?? false
  }

  static getNameField (project: string, name: string): string | undefined {
    return cache[`${project}_${name}`]?.nameField ?? undefined
  }

  static getList (project?: string): { [key: string]: IModelConf } {
    return Object.fromEntries(
      Object.entries(cache).filter(
        ([_, model]) => project === undefined || model.project === project
      )
    )
  }

  static async update (
    project: string,
    name: string,
    conf: IOrmConf,
    relations: IWaveModelRelation[],
    authorizations: IWaveModelAuthorizations,
    search: IWaveModelSearch,
    cached: boolean,
    nameField: string
  ) {
    await getWaveModelModel().updateOne(
      { project, name },
      {
        $set: {
          name,
          project,
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
  }

  static async delete (project: string, name: string) {
    await getWaveModelModel().deleteOne({ project, name })
  }
}
