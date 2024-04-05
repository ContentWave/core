import mongoose from 'mongoose'
import { JSONSchema7 } from '../../interfaces/JsonSchema'
import { IOrmConf } from './IOrmConf'
import { TypeDate } from './Types/Date'
import { TypeDatetime } from './Types/Datetime'
import { TypeDuration } from './Types/Duration'
import { TypeEmail } from './Types/Email'
import { TypeEnum } from './Types/Enum'
import { TypeFile } from './Types/File'
import { TypeImage } from './Types/Image'
import { TypeNumber } from './Types/Number'
import { TypePhone } from './Types/Phone'
import { TypePostalAddress } from './Types/PostalAddress'
import { TypeRef } from './Types/Ref'
import { TypeText } from './Types/Text'
import { TypeTime } from './Types/Time'
import { TypeUuid } from './Types/Uuid'

const formatters: any = {
  date: TypeDate,
  datetime: TypeDatetime,
  duration: TypeDuration,
  email: TypeEmail,
  file: TypeFile,
  image: TypeImage,
  number: TypeNumber,
  phone: TypePhone,
  ref: TypeRef,
  text: TypeText,
  time: TypeTime,
  uuid: TypeUuid,
  enum: TypeEnum,
  postaladdress: TypePostalAddress
}

export class Formatter {
  static async fromDb (
    data: { [key: string]: any },
    conf: IOrmConf
  ): Promise<{ [key: string]: any }> {
    let ret: { [key: string]: any } = {
      id: data._id.toHexString()
    }
    for (let key in conf) {
      ret[key] = await formatters[conf[key].type].fromDb(
        data[key] as any,
        conf[key]
      )
    }
    return ret
  }

  static async toDb (
    data: { [key: string]: any },
    conf: IOrmConf
  ): Promise<{ [key: string]: any }> {
    let ret: { [key: string]: any } = {}
    for (let key in conf) {
      ret[key] = await formatters[conf[key].type].toDb(
        data[key] as any,
        conf[key]
      )
    }
    return ret
  }

  static getValidationSchema (conf: IOrmConf): JSONSchema7 {
    const ret: any = {
      type: 'object',
      properties: {
        id: { type: 'string', regex: '^[0-9a-f]{24}$' }
      },
      required: []
    }
    for (let key in conf) {
      ret.properties[key] = formatters[conf[key].type].getValidationSchema(
        conf[key]
      )
      if (conf[key].required) ret.required.push(key)
    }
    return ret as JSONSchema7
  }

  static getMongooseSchema (conf: IOrmConf): any {
    const schema = new mongoose.Schema({}, { typeKey: '$type' })

    for (let key in conf) {
      schema.add({
        [key]: formatters[conf[key].type].getMongooseField(conf[key])
      })
      const idx = formatters[conf[key].type].getMongooseIndex(key, conf[key])
      if (idx !== null) {
        schema.index(idx)
      }
    }

    schema.pre('save', async function (next) {
      await Formatter.handlePreSave(this, conf)
      return next()
    })

    return schema
  }

  static async handlePreSave (obj: any, conf: IOrmConf): Promise<void> {
    for (let key in conf) {
      await formatters[conf[key].type].preSave(key, obj, conf[key])
    }
  }
}
