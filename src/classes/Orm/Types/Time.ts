import dayjs from 'dayjs'
import { JSONSchema7 } from '../../../interfaces/JsonSchema'
import { ITimeOrmField } from '../IOrmConf'

export class TypeTime {
  static getValidationSchema (conf: ITimeOrmField): JSONSchema7 {
    if (conf.nullable)
      return {
        oneOf: [
          {
            type: 'string',
            format: 'time'
          },
          {
            type: 'null'
          }
        ]
      }
    return {
      type: 'string',
      format: 'time'
    }
  }

  static getMongooseField (conf: ITimeOrmField): any {
    const ret: any = { $type: Date, index: !!conf.index }
    if (conf.defaultToCurrentTime) ret.default = Date.now
    return ret
  }

  static getMongooseIndex (_: string, _2: ITimeOrmField): any {
    return null
  }

  static async preSave (_: string, _2: any, _3: ITimeOrmField): Promise<void> {}

  static async fromDb (data: any, conf: ITimeOrmField): Promise<string | null> {
    if (!data && conf.defaultToCurrentTime) data = dayjs().toDate()
    if (!data) return null
    const date = dayjs(data)
    if (date.isValid()) return date.format('HH:mm:ssZ[Z]')
    return null
  }

  static async toDb (data: any, conf: ITimeOrmField): Promise<Date | null> {
    if (!data && conf.defaultToCurrentTime)
      data = dayjs().format('HH:mm:ssZ[Z]')
    if (!data) return null
    const date = dayjs(`1970-01-01T${data}`)
    if (!date.isValid()) {
      if (conf.defaultToCurrentTime)
        data = dayjs(dayjs().format('1970-01-01HH:mm:ssZ[Z]'))
      else return null
    }
    return date.toDate()
  }
}
