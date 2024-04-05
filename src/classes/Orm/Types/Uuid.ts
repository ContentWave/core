import { JSONSchema7 } from '../../../interfaces/JsonSchema'
import { ensureArray } from '../../Array'
import { IUuidOrmField } from '../IOrmConf'
import { randomUUID } from 'crypto'

export class TypeUuid {
  static getValidationSchema (conf: IUuidOrmField): JSONSchema7 {
    let field: JSONSchema7 = conf.nullable
      ? {
          oneOf: [
            {
              type: 'string',
              format: 'uuid'
            },
            {
              type: 'null'
            }
          ]
        }
      : {
          type: 'string',
          format: 'uuid'
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

  static getMongooseField (conf: IUuidOrmField): any {
    const ret: any = {
      $type: String,
      index: !!conf.index,
      unique: !!conf.unique
    }
    if (conf.multiple) return [ret]
    return ret
  }

  static getMongooseIndex (_: string, _2: IUuidOrmField): any {
    return null
  }

  static async preSave (_: string, _2: any, _3: IUuidOrmField): Promise<void> {}

  static async fromDb (data: any, conf: IUuidOrmField): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => `${d}`)
    }
    if (!data && !conf.nullable) data = randomUUID()
    if (!data) return null
    return `${data}`
  }

  static async toDb (data: any, conf: IUuidOrmField): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => `${d}`)
    }
    if (!data && !conf.nullable) data = randomUUID()
    if (!data) return null
    return `${data}`
  }
}
