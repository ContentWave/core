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
    return dayjs(data).format('HH:mm:ssZ[Z]')
  }

  static async toDb (data: any, conf: ITimeOrmField): Promise<Date | null> {
    if (!data && conf.defaultToCurrentTime)
      data = dayjs().format('HH:mm:ssZ[Z]')
    if (!data) return null
    return dayjs(`0000-00-00T${data}`).toDate()
  }
}
