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
import { Crud } from '@swarmjs/crud'
import { getWaveUserModel } from '../models/WaveUser'
import { Unauthorized } from 'http-errors'

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
    const authorizations = Model.getAuthorizations(name)

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
        const filter: { [key: string]: any } = {}

        // Handle owner filter
        if (getWaveUserModel().requireToBeOwner(authorizations)) {
          if (!req.user) throw new Unauthorized()
          filter['_owner'] = req.user._id
        }

        return await crud.list(req, res, {
          filter,
          transform: async (doc: any) => {
            return await Formatter.fromDb(doc, conf, authorizations, req.user)
          }
        })
      },
      {
        title: 'List documents',
        description: `List ${name} documents`,
        method: 'GET',
        route: '/',
        returns: [
          {
            code: 200,
            description: 'Found documents',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                docs: {
                  type: 'array',
                  items: {
                    allOf: [
                      Formatter.getValidationSchema(conf),
                      {
                        type: 'object',
                        properties: {
                          createdAt: {
                            type: 'string',
                            format: 'datetime'
                          },
                          updatedAt: {
                            type: 'string',
                            format: 'datetime'
                          }
                        }
                      }
                    ]
                  }
                },
                page: {
                  type: 'number'
                },
                limit: {
                  type: 'number'
                },
                maxPage: {
                  type: 'number'
                },
                total: {
                  type: 'number'
                }
              }
            }
          },
          {
            code: 401,
            description: 'Unauthorized',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number'
                },
                code: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                time: {
                  type: 'string'
                }
              }
            }
          }
        ]
      }
    )

    // get
    app.controllers.addMethod(
      name,
      async function get (req: any, res: FastifyReply) {
        return await crud.get(req, res, {
          transform: async (doc: any) => {
            return await Formatter.fromDb(doc, conf, authorizations, req.user)
          }
        })
      },
      {
        title: 'Get a document',
        description: `Get a ${name} document`,
        method: 'GET',
        route: '/:id',
        parameters: [
          {
            name: 'id',
            description: 'Document ID',
            schema: { type: 'string', pattern: '^[0-9a-f]{24}$' }
          }
        ],
        returns: [
          {
            code: 200,
            description: 'Found document',
            mimeType: 'application/json',
            schema: {
              allOf: [
                Formatter.getValidationSchema(conf),
                {
                  type: 'object',
                  properties: {
                    createdAt: {
                      type: 'string',
                      format: 'datetime'
                    },
                    updatedAt: {
                      type: 'string',
                      format: 'datetime'
                    }
                  }
                }
              ]
            }
          },
          {
            code: 401,
            description: 'Unauthorized',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number'
                },
                code: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                time: {
                  type: 'string'
                }
              }
            }
          }
        ]
      }
    )
  }
}
