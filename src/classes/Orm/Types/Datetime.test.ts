import { IDateTimeOrmField } from '../IOrmConf'
import { TypeDatetime } from './Datetime'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

describe('ORM: Datetime', () => {
  let simpleDatetime: IDateTimeOrmField = {
    type: 'datetime',
    defaultToCurrentTime: false
  }
  let defaultDatetime: IDateTimeOrmField = {
    type: 'datetime',
    defaultToCurrentTime: true
  }
  let nullableDatetime: IDateTimeOrmField = {
    type: 'datetime',
    defaultToCurrentTime: false,
    nullable: true
  }
  let nullableButDefaultDatetime: IDateTimeOrmField = {
    type: 'datetime',
    defaultToCurrentTime: true,
    nullable: true
  }

  test('fromDb', async () => {
    expect(await TypeDatetime.fromDb(undefined, simpleDatetime)).toBe(null)
    expect(await TypeDatetime.fromDb(undefined, defaultDatetime)).not.toBe(null)
    expect(await TypeDatetime.fromDb(undefined, nullableDatetime)).toBe(null)
    expect(
      await TypeDatetime.fromDb(undefined, nullableButDefaultDatetime)
    ).not.toBe(null)

    expect(await TypeDatetime.fromDb(new Date(), simpleDatetime)).not.toBe(null)
    expect(await TypeDatetime.fromDb(new Date(), defaultDatetime)).not.toBe(
      null
    )
    expect(await TypeDatetime.fromDb(new Date(), nullableDatetime)).not.toBe(
      null
    )
    expect(
      await TypeDatetime.fromDb(new Date(), nullableButDefaultDatetime)
    ).not.toBe(null)

    expect(await TypeDatetime.fromDb('not a datetime', simpleDatetime)).toBe(
      null
    )
    expect(await TypeDatetime.fromDb('not a datetime', defaultDatetime)).toBe(
      null
    )
    expect(await TypeDatetime.fromDb('not a datetime', nullableDatetime)).toBe(
      null
    )
    expect(
      await TypeDatetime.fromDb('not a datetime', nullableButDefaultDatetime)
    ).toBe(null)
  })

  test('toDb', async () => {
    expect(await TypeDatetime.toDb(undefined, simpleDatetime)).toBe(null)
    expect(await TypeDatetime.toDb(undefined, defaultDatetime)).not.toBe(null)
    expect(await TypeDatetime.toDb(undefined, nullableDatetime)).toBe(null)
    expect(
      await TypeDatetime.toDb(undefined, nullableButDefaultDatetime)
    ).not.toBe(null)

    expect(await TypeDatetime.toDb('2024-01-20', simpleDatetime)).not.toBe(null)
    expect(await TypeDatetime.toDb('2024-01-20', defaultDatetime)).not.toBe(
      null
    )
    expect(await TypeDatetime.toDb('2024-01-20', nullableDatetime)).not.toBe(
      null
    )
    expect(
      await TypeDatetime.toDb('2024-01-20', nullableButDefaultDatetime)
    ).not.toBe(null)

    expect(await TypeDatetime.toDb('not a datetime', simpleDatetime)).toBe(null)
    expect(await TypeDatetime.toDb('not a datetime', defaultDatetime)).not.toBe(
      null
    )
    expect(await TypeDatetime.toDb('not a datetime', nullableDatetime)).toBe(
      null
    )
    expect(
      await TypeDatetime.toDb('not a datetime', nullableButDefaultDatetime)
    ).not.toBe(null)
  })

  test('getValidationSchema', async () => {
    const ajv = new Ajv()
    addFormats(ajv)
    const nonNullableSchema = ajv.compile(
      TypeDatetime.getValidationSchema(simpleDatetime)
    )
    const nullableSchema = ajv.compile(
      TypeDatetime.getValidationSchema(nullableDatetime)
    )

    expect(nonNullableSchema('2024-01-20T12:00:12Z')).toBe(true)
    expect(nonNullableSchema('')).toBe(false)
    expect(nonNullableSchema(undefined)).toBe(false)
    expect(nonNullableSchema(null)).toBe(false)

    expect(nullableSchema('2024-01-20T12:00:12Z')).toBe(true)
    expect(nullableSchema('')).toBe(false)
    expect(nullableSchema(undefined)).toBe(false)
    expect(nullableSchema(null)).toBe(true)
  })

  test('getMongooseField', () => {
    const simpleField = TypeDatetime.getMongooseField(simpleDatetime)
    const defaultField = TypeDatetime.getMongooseField(defaultDatetime)

    expect(simpleField.$type).toBe(Date)
    expect(simpleField.default).toBeUndefined()

    expect(defaultField.$type).toBe(Date)
    expect(defaultField.default).toBeDefined()
  })

  test('getMongooseIndex', () => {
    const simpleField = TypeDatetime.getMongooseIndex('name', simpleDatetime)
    const defaultField = TypeDatetime.getMongooseIndex('name', defaultDatetime)

    expect(simpleField).toBe(null)
    expect(defaultField).toBe(null)
  })
})
