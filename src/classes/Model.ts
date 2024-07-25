import {
  IWaveModelAuthorizations,
  IWaveModelRelation,
  IWaveModelSearch,
  getWaveModelModel
} from '../models/WaveModel'
import { IOrmConf } from '../interfaces/IOrmConf'
import { Config } from './Config'
import { FastifyReply, Swarm } from '@swarmjs/core'
import { Db } from './Db'
import { Formatter } from './Orm/Formatter'
import { Crud } from './Crud'

export interface IModelConf {
  conf: IOrmConf
  relations: IWaveModelRelation[]
  authorizations: IWaveModelAuthorizations
  search: IWaveModelSearch
  cached: boolean
  nameField: string
  listFields: string[]
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
      newCache[model.name] = {
        conf: model.conf,
        relations: model.relations,
        authorizations: model.authorizations,
        search: model.search,
        cached: model.cached,
        nameField: model.nameField,
        listFields: model.listFields
      }
      if (model.search?.enabled && model.search?.method === 'js') {
        newSearchFunctions[model.name] = model.search.js ?? ''
      }
    }

    cache = newCache
    searchFunctions = newSearchFunctions
  }

  static saveSearchFunction (name: string, code: string) {
    searchFunctions[name] = code
  }

  static async runSearchFunction (
    name: string,
    $data: any
  ): Promise<IModelSearchResult> {
    let $score = 0
    let $keep = true
    $data['_original'] = JSON.parse(JSON.stringify($data))
    eval(searchFunctions[name])
    return { keep: $keep, score: $score }
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

  static getListFields (name: string): string[] {
    return cache[name]?.listFields ?? []
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
    nameField: string,
    listFields: string[]
  ) {
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
          nameField,
          listFields
        }
      },
      { upsert: true }
    )
    await Config.set('serverNeedsRestart', true)
    await Model.retrieveModelsFromDb()
  }

  static async delete (name: string) {
    await getWaveModelModel().deleteOne({ name })
    await Config.set('serverNeedsRestart', true)
    await Model.retrieveModelsFromDb()
  }

  static async registerControllers (name: string, app: Swarm) {
    const conf = Model.getConf(name)
    if (!conf) return
    const model = Db.model(name)
    if (!model) return
    const crud = new Crud(model)

    app.controllers.addController(name, {
      title: name,
      description: `${name} related endpoints`,
      root: true,
      prefix: `/api/${name}`
    })

    // List
    app.controllers.addMethod(
      name,
      async function list (req: any, res: FastifyReply) {
        const ret = await crud.list(req, res)
        if (!ret) return ret

        const docs = []
        for (let doc of ret.docs) {
          docs.push(
            await Formatter.fromDb(
              doc,
              conf,
              Model.getAuthorizations(name),
              req.user
            )
          )
        }
        ret.docs = docs

        return ret
      },
      {
        title: 'List documents',
        description: `List ${name} documents`,
        method: 'GET',
        route: '/'
      }
    )
  }
}
