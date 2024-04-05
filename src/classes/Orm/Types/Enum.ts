import { JSONSchema7 } from '../../../interfaces/JsonSchema'
import { ensureArray } from '../../Array'
import { IEnumOrmField } from '../IOrmConf'

export class TypeEnum {
  static getValidationSchema (conf: IEnumOrmField): JSONSchema7 {
    let stringField: JSONSchema7 = {
      type: 'string',
      enum: conf.values
    }

    let field: JSONSchema7 = conf.nullable
      ? {
          oneOf: [
            stringField,
            {
              type: 'null'
            }
          ]
        }
      : stringField

    if (conf.multiple)
      return {
        type: 'array',
        items: field,
        minItems: conf.minItems,
        maxItems: conf.maxItems
      }
    return field
  }

  static getMongooseField (conf: IEnumOrmField): any {
    const ret: any = {
      $type: String,
      index: !!conf.index,
      unique: !!conf.unique
    }
    if (conf.multiple) return [ret]
    return ret
  }

  static getMongooseIndex (_: string, _2: IEnumOrmField): any {
    return null
  }

  static async preSave (_: string, _2: any, _3: IEnumOrmField): Promise<void> {}

  static async fromDb (data: any, conf: IEnumOrmField): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => `${d}`)
    }
    if (!data) return null
    return `${data}`
  }

  static async toDb (data: any, conf: IEnumOrmField): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => `${d}`)
    }
    if (!data) return null
    return `${data}`
  }
}
