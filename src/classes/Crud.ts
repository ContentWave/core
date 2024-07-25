import { CrudObject } from '../interfaces/CrudObject'
import { CrudDeleteOptions } from '../interfaces/CrudDeleteOptions'
import { CrudGetOptions } from '../interfaces/CrudGetOptions'
import { CrudListOptions } from '../interfaces/CrudListOptions'
import { CrudUpdateOptions } from '../interfaces/CrudUpdateOptions'
import { NotFound } from 'http-errors'
import qs from 'qs'
import { getProperty, setProperty } from 'dot-prop'

export class Crud {
  model: any
  cache: CrudObject

  constructor (model: any) {
    this.model = model
    this.cache = {}
  }

  async list (
    request: any,
    reply: any,
    options: Partial<CrudListOptions> = {},
    doNotSend = false
  ) {
    const opts: CrudListOptions = {
      primaryKey: '_id',
      defaultLimit: 20,
      filter: null,
      defaultSort: '_id',
      transform: null,
      populate: null,
      ...options
    }

    const filters: CrudObject[] = []
    if (opts.filter !== null) filters.push(opts.filter)
    let limit: number = opts.defaultLimit
    let page = 1
    let sort: string = opts.defaultSort
    let fields: null | string[] = null

    const query = qs.parse(
      new URL(request.raw.url, `http://url.com`).search.substring(1)
    )

    for (let key in query) {
      switch (key) {
        case 'limit':
          limit = +(query[key] ?? opts.defaultLimit)
          break
        case 'page':
          page = +(query[key] ?? 1)
          break
        case 'sort':
          sort = (query[key] ?? opts.defaultSort) as string
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
                    $regex: val[cond].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
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

    if (limit < 1) limit = opts.defaultLimit

    const total = await this.model.countDocuments(mongoQuery)
    let maxPage = Math.ceil(total / limit)
    if (maxPage < 1) maxPage = 1
    if (page < 1) page = 1
    if (page > maxPage) page = maxPage

    const req = this.model
      .find(mongoQuery)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)

    if (opts.populate !== null) {
      if (opts.populate instanceof Array === false)
        opts.populate = [opts.populate as string]
      for (let field of opts.populate) req.populate(field)
    }

    const docs = await req.exec()

    const returned = {
      docs: docs.map((doc: any) => {
        doc = doc.toObject({
          flattenMaps: true,
          flattenObjectIds: true
        })
        doc.id = doc[opts.primaryKey]
        delete doc[opts.primaryKey]
        if (opts.transform !== null) doc = opts.transform(doc, request)
        if (fields !== null) {
          let newDoc = {}
          for (let field of fields) {
            setProperty(newDoc, field, getProperty(doc, field))
          }
          doc = newDoc
        }
        return doc
      }),
      page,
      limit,
      maxPage,
      total
    }

    if (doNotSend) {
      return returned
    } else {
      reply.code(200).send(returned)
      return
    }
  }

  getListSchema (docSchema: any) {
    return {
      type: 'object',
      properties: {
        docs: {
          type: 'array',
          items: docSchema
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
  }

  async create (request: any, reply: any) {
    const doc = await this.model.create(request.body)
    reply.code(201).send({
      id: doc.id
    })
  }

  async get (request: any, reply: any, options: Partial<CrudGetOptions> = {}) {
    const opts: CrudGetOptions = {
      idParam: 'id',
      primaryKey: '_id',
      transform: null,
      populate: null,
      filter: null,
      ...options
    }

    let fields: null | string[] = null
    if (typeof request.query.fields === 'string')
      fields = (request.query.fields as string)
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length)
    const filters: CrudObject[] = [
      {
        [opts.primaryKey]: request.params[opts.idParam]
      }
    ]
    if (opts.filter !== null) filters.push(opts.filter)
    let mongoQuery = {}
    if (filters.length === 1) mongoQuery = filters[0]
    else if (filters.length)
      mongoQuery = {
        $and: filters
      }

    let doc = await this.model.findOne(mongoQuery)
    if (!doc) throw new NotFound()

    if (opts.populate !== null) {
      if (opts.populate instanceof Array === false)
        opts.populate = [opts.populate as string]
      for (let field of opts.populate) await doc.populate(field)
    }

    doc = doc.toObject({
      flattenMaps: true,
      flattenObjectIds: true
    })
    doc.id = doc[opts.primaryKey]
    delete doc[opts.primaryKey]

    if (opts.transform !== null) doc = opts.transform(doc, request)

    if (fields !== null) {
      let newDoc = {}
      for (let field of fields) {
        setProperty(newDoc, field, getProperty(doc, field))
      }
      doc = newDoc
    }

    reply.code(200).send(doc)
  }

  async first (
    request: any,
    reply: any,
    options: Partial<CrudListOptions> = {}
  ) {
    request.query.sort = '_id'
    request.query.limit = 1
    request.query.page = 1
    const ret = await this.list(request, reply, options, true)

    if ((ret?.docs ?? []).length) {
      reply.code(200).send(ret?.docs[0])
    } else {
      throw NotFound()
    }
  }

  async last (request: any, reply: any, options: Partial<CrudListOptions> = {}) {
    request.query.sort = '-_id'
    request.query.limit = 1
    request.query.page = 1
    const ret = await this.list(request, reply, options, true)

    if ((ret?.docs ?? []).length) {
      reply.code(200).send(ret?.docs[0])
    } else {
      throw NotFound()
    }
  }

  async count (
    request: any,
    reply: any,
    options: Partial<CrudListOptions> = {}
  ) {
    request.query.sort = '_id'
    request.query.limit = 1
    request.query.page = 1
    const ret = await this.list(request, reply, options, true)

    reply.code(200).send({
      count: ret?.total ?? 0
    })
  }

  async update (
    request: any,
    reply: any,
    options: Partial<CrudUpdateOptions> = {}
  ) {
    const opts: CrudUpdateOptions = {
      idParam: 'id',
      primaryKey: '_id',
      ...options
    }

    const doc = await this.model.findOne({
      [opts.primaryKey]: request.params[opts.idParam]
    })
    if (!doc) throw new NotFound()

    for (let key in request.body) {
      doc.set(key, request.body[key])
    }

    await doc.save()
    reply.code(200).send({})
  }

  async replace (
    request: any,
    reply: any,
    options: Partial<CrudUpdateOptions> = {}
  ) {
    const opts: CrudUpdateOptions = {
      idParam: 'id',
      primaryKey: '_id',
      ...options
    }

    let doc = await this.model.findOne({
      [opts.primaryKey]: request.params[opts.idParam]
    })
    if (doc) {
      doc.overwrite(request.body)
      await doc.save()
      reply.code(200).send({})
    } else {
      const newDoc = await this.model.create(request.body)
      reply.code(201).send({
        id: newDoc.id
      })
    }
  }

  async delete (
    request: any,
    reply: any,
    options: Partial<CrudDeleteOptions> = {}
  ) {
    const opts: CrudDeleteOptions = {
      idParam: 'id',
      primaryKey: '_id',
      ...options
    }

    const res = await this.model.deleteOne({
      [opts.primaryKey]: request.params[opts.idParam]
    })
    if (res.deletedCount) {
      reply.code(204).send({})
    } else {
      throw new NotFound()
    }
  }
}
