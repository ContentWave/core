import dayjs from 'dayjs'
import { IDateOrmField } from '../IOrmConf'
import { JSONSchema7 } from '../../../interfaces/JsonSchema'

export class TypeDate {
  static getValidationSchema (conf: IDateOrmField): JSONSchema7 {
    if (conf.nullable)
      return {
        oneOf: [
          {
            type: 'string',
            format: 'date'
          },
          {
            type: 'null'
          }
        ]
      }
    return {
      type: 'string',
      format: 'date'
    }
  }

  static getMongooseField (conf: IDateOrmField): any {
    const ret: any = { $type: Date, index: !!conf.index }
    if (conf.defaultToCurrentTime) ret.default = Date.now
    return ret
  }

  static getMongooseIndex (_: string, _2: IDateOrmField): any {
    return null
  }

  static async preSave (_: string, _2: any, _3: IDateOrmField): Promise<void> {}

  static async fromDb (data: any, conf: IDateOrmField): Promise<string | null> {
    if (!data && conf.defaultToCurrentTime) data = dayjs().toDate()
    if (!data) return null
    const date = dayjs(data)
    if (date.isValid()) return date.format('YYYY-MM-DD')
    return null
  }

  static async toDb (data: any, conf: IDateOrmField): Promise<Date | null> {
    if (!data && conf.defaultToCurrentTime) data = dayjs().format('YYYY-MM-DD')
    if (!data) return null
    const date = dayjs(data)
    if (!date.isValid()) {
      if (conf.defaultToCurrentTime) data = dayjs(dayjs().format('YYYY-MM-DD'))
      else return null
    }
    return date.toDate()
  }
}
