import { parsePhoneNumber } from 'awesome-phonenumber'
import { JSONSchema7 } from '../../../interfaces/JsonSchema'
import { ensureArray } from '../../Array'
import { IPhoneOrmField } from '../IOrmConf'

export class TypePhone {
  static getValidationSchema (conf: IPhoneOrmField): JSONSchema7 {
    let phoneField: JSONSchema7 = {
      type: 'string'
    }

    let field: JSONSchema7 = conf.nullable
      ? {
          oneOf: [
            phoneField,
            {
              type: 'null'
            }
          ]
        }
      : phoneField

    if (conf.multiple)
      return {
        type: 'array',
        items: field,
        minItems: conf.minItems,
        maxItems: conf.maxItems
      }
    return field
  }

  static getMongooseField (conf: IPhoneOrmField): any {
    const ret: any = {
      $type: String,
      index: !!conf.index,
      unique: !!conf.unique
    }
    if (conf.multiple) return [ret]
    return ret
  }

  static getMongooseIndex (_: string, _2: IPhoneOrmField): any {
    return null
  }

  static async preSave (_: string, _2: any, _3: IPhoneOrmField): Promise<void> {}

  static async fromDb (data: any, conf: IPhoneOrmField): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      return data.map((d: any) => `${d}`)
    }
    if (!data) return null
    return `${data}`
  }

  static async toDb (data: any, conf: IPhoneOrmField): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      return data
        .map((d: any) => {
          const pn = parsePhoneNumber(`${d}`, {
            regionCode: conf.defaultCountry ?? 'US'
          })
          if (!pn.valid && !conf.nullable)
            throw new Error(
              `${d} is not a valid phone number for ${
                conf.defaultCountry ?? 'US'
              }`
            )
          return pn.valid ? pn.number.e164 : null
        })
        .filter((d: string | null) => d !== null)
    }
    if (!data) return null
    const pn = parsePhoneNumber(`${data}`, {
      regionCode: conf.defaultCountry ?? 'US'
    })
    if (!pn.valid && !conf.nullable)
      throw new Error(
        `${data} is not a valid phone number for ${conf.defaultCountry ?? 'US'}`
      )
    return pn.valid ? pn.number.e164 : null
  }
}
