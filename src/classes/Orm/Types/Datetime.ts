import dayjs from 'dayjs'
import { IDateTimeOrmField } from '../../../interfaces/IOrmConf'
import { JSONSchema7 } from '../../../interfaces/JsonSchema'

export class TypeDatetime {
  static getValidationSchema (conf: IDateTimeOrmField): JSONSchema7 {
    if (conf.nullable)
      return {
        oneOf: [
          {
            type: 'string',
            format: 'date-time'
          },
          {
            type: 'null'
          }
        ]
      }
    return {
      type: 'string',
      format: 'date-time'
    }
  }

  static getMongooseField (conf: IDateTimeOrmField): any {
    const ret: any = { $type: Date, index: !!conf.index }
    if (conf.defaultToCurrentTime) ret.default = Date.now
    return ret
  }

  static getMongooseIndex (_: string, _2: IDateTimeOrmField): any {
    return null
  }

  static async preSave (
    _: string,
    _2: any,
    _3: IDateTimeOrmField
  ): Promise<void> {}

  static async fromDb (
    data: any,
    conf: IDateTimeOrmField
  ): Promise<string | null> {
    if (!data && conf.defaultToCurrentTime) data = dayjs().toDate()
    if (!data) return null
    const date = dayjs(data)
    if (date.isValid()) return date.format('YYYY-MM-DDTHH:mm:ssZ[Z]')
    return null
  }

  static async toDb (data: any, conf: IDateTimeOrmField): Promise<Date | null> {
    if (!data && conf.defaultToCurrentTime)
      data = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]')
    if (!data) return null
    const date = dayjs(data)
    if (!date.isValid()) {
      if (conf.defaultToCurrentTime)
        data = dayjs(dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'))
      else return null
    }
    return date.toDate()
  }
}
