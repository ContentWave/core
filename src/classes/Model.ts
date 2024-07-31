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
import { getWaveUserModel } from '../models/WaveUser'
import { Unauthorized, NotFound } from 'http-errors'
import QueryString from 'qs'
import { getProperty, setProperty } from 'dot-prop'

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
      async function list (request: any, res: FastifyReply) {
        const filters: { [key: string]: any }[] = []

        // Handle owner filter
        if (getWaveUserModel().requireToBeOwner(authorizations)) {
          if (!request.user) throw new Unauthorized()
          filters.push({ _owner: request.user._id })
        }

        let limit: number = 20
        let page = 1
        let sort: string = '_id'
        let fields: null | string[] = null
        let populate: null | string | string[] = null
        const transform = async (doc: any) =>
          await Formatter.fromDb(doc, conf, authorizations, request.user)

        const query = QueryString.parse(
          new URL(request.raw.url, `http://url.com`).search.substring(1)
        )

        for (const key in query) {
          switch (key) {
            case 'populate':
              populate = ((query[key] ?? '') as string).split(',')
              break
            case 'limit':
              limit = +(query[key] ?? 20)
              break
            case 'page':
              page = +(query[key] ?? 1)
              break
            case 'sort':
              sort = (query[key] ?? '_id') as string
              break
            case 'q':
              filters.push({
                $text: {
                  $search: query[key] ?? ''
                }
              })
              break
            case 'fields':
              if (typeof query[key] === 'string')
                fields = (query[key] as string)
                  .split(',')
                  .map(a => a.trim())
                  .filter(a => a.length)
              break
            default:
              let val: any = query[key]
              if (typeof val === 'string')
                val = {
                  eq: val
                }
              for (let cond in val) {
                switch (cond) {
                  case 'eq':
                  case 'ne':
                  case 'gt':
                  case 'gte':
                  case 'lt':
                  case 'lte':
                    filters.push({
                      [key]: {
                        [`$${cond}`]: val[cond]
                      }
                    })
                    break
                  case 'range':
                    const range = val[cond]
                      .split(',')
                      .map((a: string) => parseFloat(a))
                    filters.push({
                      [key]: {
                        $gte: range[0],
                        $lte: range[1]
                      }
                    })
                    break
                  case 'in':
                  case 'nin':
                    filters.push({
                      [key]: {
                        [`$${cond}`]: val[cond].split(',')
                      }
                    })
                    break
                  case 'contains':
                    filters.push({
                      [key]: {
                        $regex: val[cond].replace(
                          /[.*+?^${}()|[\]\\]/g,
                          '\\$&'
                        ),
                        $options: 'i'
                      }
                    })
                    break
                  case 'exists':
                    filters.push({
                      [key]: {
                        $exists: true
                      }
                    })
                    break
                  case 'regex':
                    filters.push({
                      [key]: {
                        $regex: val[cond]
                      }
                    })
                    break
                  case 'regexInsensitive':
                    filters.push({
                      [key]: {
                        $regex: val[cond],
                        $options: 'i'
                      }
                    })
                    break
                  case 'near':
                    const nearConf = (val[cond] ?? '').split(',')
                    filters.push({
                      [key]: {
                        $geoWithin: {
                          $center: [
                            [parseFloat(nearConf[1]), parseFloat(nearConf[0])],
                            parseInt(nearConf[2])
                          ]
                        }
                      }
                    })
                    break
                  case 'within':
                    const withinConf = (val[cond] ?? '')
                      .split(',')
                      .map((a: string) => parseFloat(a))
                    const matrix = []
                    for (let i = 0; i < withinConf.length; i = i + 2) {
                      matrix.push([withinConf[i + 1], withinConf[i + 0]])
                    }
                    const geoE = matrix[0][0]
                    const geoN = matrix[0][1]
                    const geoW = matrix[1][0]
                    const geoS = matrix[1][1]
                    filters.push({
                      [key]: {
                        $geoWithin: {
                          $geometry: {
                            type: 'Polygon',
                            coordinates: [
                              [
                                [geoE, geoN],
                                [geoW, geoN],
                                [geoW, geoS],
                                [geoE, geoS],
                                [geoE, geoN]
                              ]
                            ]
                          }
                        }
                      }
                    })
                    break
                }
              }
              break
          }
        }

        let mongoQuery = {}
        if (filters.length === 1) mongoQuery = filters[0]
        else if (filters.length)
          mongoQuery = {
            $and: filters
          }

        if (limit < 1) limit = 20

        const total = await model.countDocuments(mongoQuery)
        let maxPage = Math.ceil(total / limit)
        if (maxPage < 1) maxPage = 1
        if (page < 1) page = 1
        if (page > maxPage) page = maxPage

        const req = model
          .find(mongoQuery)
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(limit)

        if (populate !== null) {
          if (populate instanceof Array === false)
            populate = [populate as string]
          for (let field of populate) req.populate(field)
        }

        const docs = await req.exec()

        const returned: any = {
          docs: [],
          page,
          limit,
          maxPage,
          total
        }

        for (let doc of docs) {
          doc = doc.toObject({
            flattenMaps: true,
            flattenObjectIds: true
          }) as any
          if (transform !== null) doc = (await transform(doc)) as any
          if (fields !== null) {
            const newDoc: { [key: string]: any } = {}
            for (const field of fields) {
              setProperty(newDoc, field, getProperty(doc, field))
            }
            doc = newDoc as any
          }
          returned.docs.push(doc)
        }

        res.code(200).send(returned)
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

    // create
    app.controllers.addMethod(
      name,
      async function create (req: any, res: FastifyReply) {
        if (
          !getWaveUserModel().resolveAuthorizations(
            authorizations,
            'write',
            req.user
          )
        )
          throw new Unauthorized()

        const doc = await Formatter.toDb(
          req.body ?? {},
          conf,
          authorizations,
          req.user
        )
        const created = await model.create(doc)
        res.code(201).send({
          id: created.id
        })
      },
      {
        title: 'Create a document',
        description: `Create a ${name} document`,
        method: 'POST',
        route: '/',
        parameters: [],
        accepts: {
          mimeType: 'application/json',
          schema: Formatter.getValidationSchema(conf, false)
        },
        returns: [
          {
            code: 201,
            description: 'Document created',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                id: { type: 'string', pattern: '^[0-9a-f]{24}$' }
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
      async function get (request: any, res: FastifyReply) {
        const transform = async (doc: any) => {
          return await Formatter.fromDb(doc, conf, authorizations, request.user)
        }
        let populate: null | string | string[] = null
        let filter = null
        let fields: null | string[] = null

        if (typeof request.query.fields === 'string')
          fields = (request.query.fields as string)
            .split(',')
            .map(a => a.trim())
            .filter(a => a.length)
        const filters: { [key: string]: any }[] = [
          {
            _id: request.params.id
          }
        ]

        if (typeof request.query.populate === 'string')
          populate = request.query.populate.split(',')

        if (filter !== null) filters.push(filter)

        let mongoQuery = {}
        if (filters.length === 1) mongoQuery = filters[0]
        else if (filters.length)
          mongoQuery = {
            $and: filters
          }

        let doc: any = await model.findOne(mongoQuery)
        if (!doc) throw new NotFound()

        if (populate !== null) {
          if (populate instanceof Array === false)
            populate = [populate as string]
          for (const field of populate) await doc.populate(field)
        }

        doc = doc.toObject({
          flattenMaps: true,
          flattenObjectIds: true
        })

        if (transform !== null) doc = await transform(doc)

        if (fields !== null) {
          const newDoc = {}
          for (const field of fields) {
            setProperty(newDoc, field, getProperty(doc, field))
          }
          doc = newDoc
        }

        res.code(200).send(doc)
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

    // put
    app.controllers.addMethod(
      name,
      async function replace (request: any, reply: FastifyReply) {
        let doc = await model.findOne({
          _id: request.params.id
        })
        if (doc) {
          if (
            !getWaveUserModel().resolveAuthorizations(
              authorizations,
              'write',
              request.user,
              doc
            )
          )
            throw new Unauthorized()
          doc.overwrite(
            await Formatter.toDb(
              request.body,
              conf,
              authorizations,
              request.user,
              doc
            )
          )
          await doc.save()
          reply.code(200).send({})
        } else {
          if (
            !getWaveUserModel().resolveAuthorizations(
              authorizations,
              'write',
              request.user
            )
          )
            throw new Unauthorized()
          const newDoc = await model.create(
            await Formatter.toDb(
              request.body,
              conf,
              authorizations,
              request.user,
              doc
            )
          )
          reply.code(201).send({
            id: newDoc.id
          })
        }
      },
      {
        title: 'Create or replace a document',
        description: `Create or replace a ${name} document by a new document`,
        method: 'PUT',
        route: '/:id',
        accepts: {
          mimeType: 'application/json',
          schema: Formatter.getValidationSchema(conf, false)
        },
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
            description: 'Document updated',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {}
            }
          },
          {
            code: 201,
            description: 'Document created',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: { id: { type: 'string', pattern: '^[0-9a-f]{24}$' } }
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

    // patch
    app.controllers.addMethod(
      name,
      async function update (request: any, reply: FastifyReply) {
        const doc = await model.findOne({
          _id: request.params.id
        })
        if (!doc) throw new NotFound()
        if (
          !getWaveUserModel().resolveAuthorizations(
            authorizations,
            'write',
            request.user,
            doc
          )
        )
          throw new Unauthorized()

        for (let key in request.body) {
          doc.set(key, request.body[key])
        }

        await doc.save()
        reply.code(200).send({})
      },
      {
        title: 'Update a document',
        description: `Update a ${name} document with supplied data`,
        method: 'PATCH',
        route: '/:id',
        accepts: {
          mimeType: 'application/json',
          schema: Formatter.getValidationSchema(conf, false)
        },
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
            description: 'Document updated',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {}
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

    // delete
    app.controllers.addMethod(
      name,
      async function remove (request: any, reply: FastifyReply) {
        const doc = await model.findOne({
          _id: request.params.id
        })
        if (!doc) throw new NotFound()
        if (
          !getWaveUserModel().resolveAuthorizations(
            authorizations,
            'write',
            request.user,
            doc
          )
        )
          throw new Unauthorized()

        const res = await model.deleteOne({
          _id: request.params.id
        })
        if (res.deletedCount) {
          reply.code(204).send({})
        } else {
          throw new NotFound()
        }
      },
      {
        title: 'Delete a document',
        description: `Delete a ${name} document`,
        method: 'DELETE',
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
            code: 204,
            description: 'Document deleted',
            mimeType: 'application/json',
            schema: {
              type: 'object',
              properties: {}
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
