import { JSONSchema7 } from '../../../interfaces/JsonSchema'
import { ensureArray } from '../../Tools/Array'
import { IEmailOrmField } from '../../../interfaces/IOrmConf'

export class TypeEmail {
  static getValidationSchema (conf: IEmailOrmField): JSONSchema7 {
    let field: JSONSchema7 = conf.nullable
      ? {
          oneOf: [
            {
              type: 'string',
              format: 'email'
            },
            {
              type: 'null'
            }
          ]
        }
      : {
          type: 'string',
          format: 'email'
        }

    if (conf.multiple)
      return {
        type: 'array',
        items: field,
        minItems: conf.minItems,
        maxItems: conf.maxItems
      }
    return field
  }

  static getMongooseField (conf: IEmailOrmField): any {
    const ret: any = {
      $type: String,
      lowercase: true,
      index: !!conf.index,
      unique: !!conf.unique
    }
    if (conf.multiple) return [ret]
    return ret
  }

  static getMongooseIndex (_: string, _2: IEmailOrmField): any {
    return null
  }

  static async preSave (_: string, _2: any, _3: IEmailOrmField): Promise<void> {}

  static async fromDb (data: any, conf: IEmailOrmField): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => `${d}`.trim().toLowerCase())
    }
    if (!data) return null
    return `${data}`.trim().toLowerCase()
  }

  static async toDb (data: any, conf: IEmailOrmField): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => `${d}`.trim().toLowerCase())
    }
    if (!data) return null
    return `${data}`.trim().toLowerCase()
  }
}
