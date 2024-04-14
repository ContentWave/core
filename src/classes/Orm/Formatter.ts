import mongoose, { HydratedDocument } from 'mongoose'
import { JSONSchema7 } from '../../interfaces/JsonSchema'
import { IOrmConf } from '../../interfaces/IOrmConf'
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
import { IWaveUser, WaveUserModel } from '../../models/WaveUser'
import { Unauthorized } from 'http-errors'
import { IWaveModelAuthorizations } from '../../models/WaveModel'
import dayjs from 'dayjs'
import { IModelConf } from '../Model'

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
    conf: IOrmConf,
    authorizations: IWaveModelAuthorizations | undefined = undefined,
    user: HydratedDocument<IWaveUser, WaveUserModel> | null = null,
    existingDocument: HydratedDocument<any, any> | null = null
  ): Promise<{ [key: string]: any }> {
    const userModel = mongoose.model<IWaveUser, WaveUserModel>('WaveUser')
    const globalAccess = userModel.resolveAuthorizations(
      authorizations,
      'read',
      user,
      existingDocument
    )
    if (!globalAccess) throw new Unauthorized()

    let ret: { [key: string]: any } = {
      id: data._id.toHexString(),
      createdAt: dayjs(data.createdAt).format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
      updatedAt: dayjs(data.updatedAt).format('YYYY-MM-DDTHH:mm:ssZ[Z]')
    }
    for (let key in conf) {
      if (
        userModel.resolveAuthorizations(conf[key].authorizations, 'read', user)
      )
        ret[key] = await formatters[conf[key].type].fromDb(
          data[key] as any,
          conf[key],
          user
        )
    }

    return ret
  }

  static async toDb (
    data: { [key: string]: any },
    conf: IOrmConf,
    authorizations: IWaveModelAuthorizations | undefined = undefined,
    user: HydratedDocument<IWaveUser, WaveUserModel> | null = null,
    existingDocument: HydratedDocument<any, any> | null = null
  ): Promise<{ [key: string]: any }> {
    const userModel = mongoose.model<IWaveUser, WaveUserModel>('WaveUser')
    const globalAccess = userModel.resolveAuthorizations(
      authorizations,
      'write',
      user,
      existingDocument
    )
    if (!globalAccess) throw new Unauthorized()

    let ret: { [key: string]: any } = {}
    for (let key in conf) {
      if (
        data[key] !== undefined &&
        userModel.resolveAuthorizations(conf[key].authorizations, 'write', user)
      )
        ret[key] = await formatters[conf[key].type].toDb(
          data[key] as any,
          conf[key],
          user
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

  static getMongooseSchema (modelConf: IModelConf): any {
    const conf = modelConf.conf

    const schema = new mongoose.Schema(
      {
        _owner: { type: mongoose.Schema.Types.ObjectId, ref: 'WaveUser' }
      },
      { typeKey: '$type', timestamps: true }
    )

    for (let key in conf) {
      schema.add({
        [key]: formatters[conf[key].type].getMongooseField(conf[key])
      })
      const idx = formatters[conf[key].type].getMongooseIndex(key, conf[key])
      if (idx !== null) {
        schema.index(idx)
      }
    }

    if (modelConf.search.enabled) {
      schema.add({
        _searchData: String,
        _searchVector: [Number]
      })
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
