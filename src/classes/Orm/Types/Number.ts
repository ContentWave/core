import { JSONSchema7 } from '../../../interfaces/JsonSchema'
import { ensureArray } from '../../Array'
import { INumberOrmField } from '../IOrmConf'

export class TypeNumber {
  static getValidationSchema (conf: INumberOrmField): JSONSchema7 {
    let numberField: JSONSchema7 = {
      type: 'number'
    }
    if (conf.min) numberField.minimum = conf.min
    if (conf.max) numberField.maximum = conf.max

    let field: JSONSchema7 = conf.nullable
      ? {
          oneOf: [
            numberField,
            {
              type: 'null'
            }
          ]
        }
      : numberField

    if (conf.multiple)
      return {
        type: 'array',
        items: field,
        minItems: conf.minItems,
        maxItems: conf.maxItems
      }
    return field
  }

  static getMongooseField (conf: INumberOrmField): any {
    const ret: any = {
      $type: Number,
      index: !!conf.index,
      unique: !!conf.unique,
      default: conf.default ?? (conf.nullable ? null : 0)
    }
    if (conf.multiple) return [ret]
    return ret
  }

  static getMongooseIndex (_: string, _2: INumberOrmField): any {
    return null
  }

  static async preSave (
    _: string,
    _2: any,
    _3: INumberOrmField
  ): Promise<void> {}

  static async fromDb (data: any, conf: INumberOrmField): Promise<any | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => parseFloat(`${d}`))
    }
    if (!data) return conf.default ?? (conf.nullable ? null : 0)
    return parseFloat(`${data}`)
  }

  static async toDb (data: any, conf: INumberOrmField): Promise<any | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => parseFloat(`${d}`))
    }
    if (!data) return conf.default ?? (conf.nullable ? null : 0)
    return parseFloat(`${data}`)
  }
}
