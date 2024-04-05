import { JSONSchema7 } from '../../../interfaces/JsonSchema'
import { ensureArray } from '../../Array'
import { ITextOrmField } from '../IOrmConf'

export class TypeText {
  static getValidationSchema (conf: ITextOrmField): JSONSchema7 {
    let stringField: JSONSchema7 = {
      type: 'string'
    }
    if (conf.regex) stringField.pattern = conf.regex
    if (conf.minLength !== undefined) stringField.minLength = conf.minLength
    if (conf.maxLength !== undefined) stringField.maxLength = conf.maxLength

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

  static getMongooseField (conf: ITextOrmField): any {
    const ret: any = {
      $type: String,
      index: !!conf.index,
      unique: !!conf.unique,
      default: conf.default ?? (conf.nullable ? null : '')
    }
    if (conf.multiple) return [ret]
    return ret
  }

  static getMongooseIndex (_: string, _2: ITextOrmField): any {
    return null
  }

  static async preSave (_: string, _2: any, _3: ITextOrmField): Promise<void> {}

  static async fromDb (data: any, conf: ITextOrmField): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => `${d}`)
    }
    if (!data) return conf.default ?? (conf.nullable ? null : '')
    return `${data}`
  }

  static async toDb (data: any, conf: ITextOrmField): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => `${d}`)
    }
    if (!data) return conf.default ?? (conf.nullable ? null : '')
    return `${data}`
  }
}
