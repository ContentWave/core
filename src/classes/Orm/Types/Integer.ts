import { JSONSchema7 } from '../../../interfaces/JsonSchema'
import { ensureArray } from '../../Array'
import { IIntegerOrmField } from '../IOrmConf'

export class TypeInteger {
  static getValidationSchema (conf: IIntegerOrmField): JSONSchema7 {
    let integerField: JSONSchema7 = {
      type: 'integer'
    }
    if (conf.min) integerField.minimum = conf.min
    if (conf.max) integerField.maximum = conf.max

    let field: JSONSchema7 = conf.nullable
      ? {
          oneOf: [
            integerField,
            {
              type: 'null'
            }
          ]
        }
      : integerField

    if (conf.multiple)
      return {
        type: 'array',
        items: field,
        minItems: conf.minItems,
        maxItems: conf.maxItems
      }
    return field
  }

  static getMongooseField (conf: IIntegerOrmField): any {
    const ret: any = {
      $type: Number,
      index: !!conf.index,
      unique: !!conf.unique,
      default: conf.default ?? (conf.nullable ? null : 0)
    }
    if (conf.multiple) return [ret]
    return ret
  }

  static getMongooseIndex (_: string, _2: IIntegerOrmField): any {
    return null
  }

  static async preSave (
    _: string,
    _2: any,
    _3: IIntegerOrmField
  ): Promise<void> {}

  static async fromDb (data: any, conf: IIntegerOrmField): Promise<any | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => parseInt(`${d}`))
    }
    if (!data) return conf.default ?? (conf.nullable ? null : 0)
    return parseInt(`${data}`)
  }

  static async toDb (data: any, conf: IIntegerOrmField): Promise<any | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => parseInt(`${d}`))
    }
    if (!data) return conf.default ?? (conf.nullable ? null : 0)
    return parseInt(`${data}`)
  }
}
