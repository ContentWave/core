import { ObjectId } from 'mongodb'
import { JSONSchema7 } from '../../../interfaces/JsonSchema'
import { Formatter } from '../Formatter'
import { IRefOrmField } from '../IOrmConf'
import { Model } from '../../Model'
import mongoose from 'mongoose'
import { ensureArray } from '../../Array'
import { Db } from '../../Db'

export class TypeRef {
  static getValidationSchema (conf: IRefOrmField): JSONSchema7 {
    const model = Model.getModel(conf.model)

    const nestedSchema: JSONSchema7 = {
      oneOf: [{ type: 'string', pattern: '^[0-9a-f]{24}$' }]
    }
    if (model) nestedSchema.oneOf?.push(Formatter.getValidationSchema(model))

    if (conf.multiple)
      return {
        type: 'array',
        items: nestedSchema,
        minItems: conf.minItems,
        maxItems: conf.maxItems
      }
    return nestedSchema
  }

  static getMongooseField (conf: IRefOrmField): any {
    const ret: any = {
      $type: mongoose.Schema.Types.ObjectId,
      ref: conf.model,
      autopopulate: conf.populate ?? false,
      index: !!conf.index,
      unique: !!conf.unique
    }
    if (conf.multiple) return [ret]
    return ret
  }

  static getMongooseIndex (_: string, _2: IRefOrmField): any {
    return null
  }

  static async preSave (_: string, _2: any, _3: IRefOrmField): Promise<void> {}

  static async fromDb (
    data: any,
    conf: IRefOrmField
  ): Promise<string | string[] | any | null> {
    const modelConf = Model.getModel(conf.model)

    if (conf.multiple) {
      if (!modelConf) return []
      data = data ?? []
      if (conf.populate) {
        let ret = []
        for (let item of data) {
          ret.push(await Formatter.fromDb(item, modelConf))
        }
        return ret
      } else return data.map((item: any) => item._id.toHexString())
    }
    if (!modelConf || !data) return null
    if (conf.populate) {
      return await Formatter.fromDb(data, modelConf)
    }
    return data._id.toHexString()
  }

  static async toDb (
    data: any,
    conf: IRefOrmField
  ): Promise<ObjectId | ObjectId[] | null> {
    const modelConf = Model.getModel(conf.model)

    if (conf.multiple) {
      data = ensureArray(data)
      let ret: ObjectId[] = []
      for (let d of data) {
        if (typeof d === 'string') {
          ret.push(ObjectId.createFromHexString(d))
          break
        }
        if (d.id !== undefined) {
          ret.push(ObjectId.createFromHexString(d.id))
        } else {
          if (modelConf === null) continue
          const formatted = await Formatter.toDb(d, modelConf)
          const created = await Db.model(conf.model)?.create(formatted)
          if (created) ret.push(ObjectId.createFromHexString(created.id))
        }
      }
      return ret
    }
    if (!data) return null
    if (typeof data === 'string') return ObjectId.createFromHexString(data)

    if (data.id !== undefined) return ObjectId.createFromHexString(data.id)

    if (modelConf === null) return null
    const formatted = await Formatter.toDb(data, modelConf)
    const created = await Db.model(conf.model)?.create(formatted)
    if (created) return ObjectId.createFromHexString(created.id)
    return null
  }
}
