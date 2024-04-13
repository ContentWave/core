import { IDateOrmField } from '../../../interfaces/IOrmConf'
import { TypeDate } from './Date'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

describe('ORM: Date', () => {
  let simpleDate: IDateOrmField = {
    type: 'date',
    defaultToCurrentTime: false,
    title: '',
    description: ''
  }
  let defaultDate: IDateOrmField = {
    type: 'date',
    defaultToCurrentTime: true,
    title: '',
    description: ''
  }
  let nullableDate: IDateOrmField = {
    type: 'date',
    defaultToCurrentTime: false,
    nullable: true,
    title: '',
    description: ''
  }
  let nullableButDefaultDate: IDateOrmField = {
    type: 'date',
    defaultToCurrentTime: true,
    nullable: true,
    title: '',
    description: ''
  }

  test('fromDb', async () => {
    expect(await TypeDate.fromDb(undefined, simpleDate)).toBe(null)
    expect(await TypeDate.fromDb(undefined, defaultDate)).not.toBe(null)
    expect(await TypeDate.fromDb(undefined, nullableDate)).toBe(null)
    expect(await TypeDate.fromDb(undefined, nullableButDefaultDate)).not.toBe(
      null
    )

    expect(await TypeDate.fromDb(new Date(), simpleDate)).not.toBe(null)
    expect(await TypeDate.fromDb(new Date(), defaultDate)).not.toBe(null)
    expect(await TypeDate.fromDb(new Date(), nullableDate)).not.toBe(null)
    expect(await TypeDate.fromDb(new Date(), nullableButDefaultDate)).not.toBe(
      null
    )

    expect(await TypeDate.fromDb('not a date', simpleDate)).toBe(null)
    expect(await TypeDate.fromDb('not a date', defaultDate)).toBe(null)
    expect(await TypeDate.fromDb('not a date', nullableDate)).toBe(null)
    expect(await TypeDate.fromDb('not a date', nullableButDefaultDate)).toBe(
      null
    )
  })

  test('toDb', async () => {
    expect(await TypeDate.toDb(undefined, simpleDate)).toBe(null)
    expect(await TypeDate.toDb(undefined, defaultDate)).not.toBe(null)
    expect(await TypeDate.toDb(undefined, nullableDate)).toBe(null)
    expect(await TypeDate.toDb(undefined, nullableButDefaultDate)).not.toBe(
      null
    )

    expect(await TypeDate.toDb('2024-01-20', simpleDate)).not.toBe(null)
    expect(await TypeDate.toDb('2024-01-20', defaultDate)).not.toBe(null)
    expect(await TypeDate.toDb('2024-01-20', nullableDate)).not.toBe(null)
    expect(await TypeDate.toDb('2024-01-20', nullableButDefaultDate)).not.toBe(
      null
    )

    expect(await TypeDate.toDb('not a date', simpleDate)).toBe(null)
    expect(await TypeDate.toDb('not a date', defaultDate)).not.toBe(null)
    expect(await TypeDate.toDb('not a date', nullableDate)).toBe(null)
    expect(await TypeDate.toDb('not a date', nullableButDefaultDate)).not.toBe(
      null
    )
  })

  test('getValidationSchema', async () => {
    const ajv = new Ajv()
    addFormats(ajv)
    const nonNullableSchema = ajv.compile(
      TypeDate.getValidationSchema(simpleDate)
    )
    const nullableSchema = ajv.compile(
      TypeDate.getValidationSchema(nullableDate)
    )

    expect(nonNullableSchema('2024-01-20')).toBe(true)
    expect(nonNullableSchema('')).toBe(false)
    expect(nonNullableSchema(undefined)).toBe(false)
    expect(nonNullableSchema(null)).toBe(false)

    expect(nullableSchema('2024-01-20')).toBe(true)
    expect(nullableSchema('')).toBe(false)
    expect(nullableSchema(undefined)).toBe(false)
    expect(nullableSchema(null)).toBe(true)
  })

  test('getMongooseField', () => {
    const simpleField = TypeDate.getMongooseField(simpleDate)
    const defaultField = TypeDate.getMongooseField(defaultDate)

    expect(simpleField.$type).toBe(Date)
    expect(simpleField.default).toBeUndefined()

    expect(defaultField.$type).toBe(Date)
    expect(defaultField.default).toBeDefined()
  })

  test('getMongooseIndex', () => {
    const simpleField = TypeDate.getMongooseIndex('name', simpleDate)
    const defaultField = TypeDate.getMongooseIndex('name', defaultDate)

    expect(simpleField).toBe(null)
    expect(defaultField).toBe(null)
  })
})
