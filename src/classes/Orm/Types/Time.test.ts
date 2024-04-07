import { ITimeOrmField } from '../../../interfaces/IOrmConf'
import { TypeTime } from './Time'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

describe('ORM: Time', () => {
  let simpleTime: ITimeOrmField = {
    type: 'time',
    defaultToCurrentTime: false
  }
  let defaultTime: ITimeOrmField = {
    type: 'time',
    defaultToCurrentTime: true
  }
  let nullableTime: ITimeOrmField = {
    type: 'time',
    defaultToCurrentTime: false,
    nullable: true
  }
  let nullableButDefaultTime: ITimeOrmField = {
    type: 'time',
    defaultToCurrentTime: true,
    nullable: true
  }

  test('fromDb', async () => {
    expect(await TypeTime.fromDb(undefined, simpleTime)).toBe(null)
    expect(await TypeTime.fromDb(undefined, defaultTime)).not.toBe(null)
    expect(await TypeTime.fromDb(undefined, nullableTime)).toBe(null)
    expect(await TypeTime.fromDb(undefined, nullableButDefaultTime)).not.toBe(
      null
    )

    expect(await TypeTime.fromDb(new Date(), simpleTime)).not.toBe(null)
    expect(await TypeTime.fromDb(new Date(), defaultTime)).not.toBe(null)
    expect(await TypeTime.fromDb(new Date(), nullableTime)).not.toBe(null)
    expect(await TypeTime.fromDb(new Date(), nullableButDefaultTime)).not.toBe(
      null
    )

    expect(await TypeTime.fromDb('not a time', simpleTime)).toBe(null)
    expect(await TypeTime.fromDb('not a time', defaultTime)).toBe(null)
    expect(await TypeTime.fromDb('not a time', nullableTime)).toBe(null)
    expect(await TypeTime.fromDb('not a time', nullableButDefaultTime)).toBe(
      null
    )
  })

  test('toDb', async () => {
    expect(await TypeTime.toDb(undefined, simpleTime)).toBe(null)
    expect(await TypeTime.toDb(undefined, defaultTime)).not.toBe(null)
    expect(await TypeTime.toDb(undefined, nullableTime)).toBe(null)
    expect(await TypeTime.toDb(undefined, nullableButDefaultTime)).not.toBe(
      null
    )

    expect(await TypeTime.toDb('12:00:12Z', simpleTime)).not.toBe(null)
    expect(await TypeTime.toDb('12:00:12Z', defaultTime)).not.toBe(null)
    expect(await TypeTime.toDb('12:00:12Z', nullableTime)).not.toBe(null)
    expect(await TypeTime.toDb('12:00:12Z', nullableButDefaultTime)).not.toBe(
      null
    )

    expect(await TypeTime.toDb('not a time', simpleTime)).toBe(null)
    expect(await TypeTime.toDb('not a time', defaultTime)).not.toBe(null)
    expect(await TypeTime.toDb('not a time', nullableTime)).toBe(null)
    expect(await TypeTime.toDb('not a time', nullableButDefaultTime)).not.toBe(
      null
    )
  })

  test('getValidationSchema', async () => {
    const ajv = new Ajv()
    addFormats(ajv)
    const nonNullableSchema = ajv.compile(
      TypeTime.getValidationSchema(simpleTime)
    )
    const nullableSchema = ajv.compile(
      TypeTime.getValidationSchema(nullableTime)
    )

    expect(nonNullableSchema('12:00:12Z')).toBe(true)
    expect(nonNullableSchema('')).toBe(false)
    expect(nonNullableSchema(undefined)).toBe(false)
    expect(nonNullableSchema(null)).toBe(false)

    expect(nullableSchema('12:00:12Z')).toBe(true)
    expect(nullableSchema('')).toBe(false)
    expect(nullableSchema(undefined)).toBe(false)
    expect(nullableSchema(null)).toBe(true)
  })

  test('getMongooseField', () => {
    const simpleField = TypeTime.getMongooseField(simpleTime)
    const defaultField = TypeTime.getMongooseField(defaultTime)

    expect(simpleField.$type).toBe(Date)
    expect(simpleField.default).toBeUndefined()

    expect(defaultField.$type).toBe(Date)
    expect(defaultField.default).toBeDefined()
  })

  test('getMongooseIndex', () => {
    const simpleField = TypeTime.getMongooseIndex('name', simpleTime)
    const defaultField = TypeTime.getMongooseIndex('name', defaultTime)

    expect(simpleField).toBe(null)
    expect(defaultField).toBe(null)
  })
})
