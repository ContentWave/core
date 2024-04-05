import { IDurationOrmField } from '../IOrmConf'
import { JSONSchema7 } from '../../../interfaces/JsonSchema'
import { ensureArray } from '../../Array'

export class TypeDuration {
  static getValidationSchema (conf: IDurationOrmField): JSONSchema7 {
    let field: JSONSchema7 = conf.nullable
      ? {
          oneOf: [
            {
              type: 'string',
              format: 'duration'
            },
            {
              type: 'null'
            }
          ]
        }
      : {
          type: 'string',
          format: 'duration'
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

  static getMongooseField (conf: IDurationOrmField): any {
    const ret: any = { $type: String, index: !!conf.index }
    if (conf.multiple) return [ret]
    return ret
  }

  static getMongooseIndex (_: string, _2: IDurationOrmField): any {
    return null
  }

  static async preSave (
    _: string,
    _2: any,
    _3: IDurationOrmField
  ): Promise<void> {}

  static async fromDb (
    data: any,
    conf: IDurationOrmField
  ): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: string | null) => (d === null ? null : `${d}`))
    }
    if (!data && !conf.nullable) data = 'P0D'
    if (!data) return null
    return data
  }

  static async toDb (
    data: any,
    conf: IDurationOrmField
  ): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data
    }
    if (!data && !conf.nullable) data = 'P0D'
    if (!data) return null
    return data
  }
}
