import { INumberOrmField } from '../../../interfaces/IOrmConf'
import { TypeNumber } from './Number'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

describe('ORM: Number', () => {
  let simpleNumber: INumberOrmField = {
    type: 'number',
    title: '',
    description: ''
  }
  let defaultNumber: INumberOrmField = {
    type: 'number',
    default: 42,
    title: '',
    description: ''
  }
  let nullableNumber: INumberOrmField = {
    type: 'number',
    nullable: true,
    title: '',
    description: ''
  }
  let simpleMultipleNumber: INumberOrmField = {
    type: 'number',
    multiple: true,
    title: '',
    description: ''
  }
  let defaultMultipleNumber: INumberOrmField = {
    type: 'number',
    default: 42,
    multiple: true,
    title: '',
    description: ''
  }
  let nullableMultipleNumber: INumberOrmField = {
    type: 'number',
    nullable: true,
    multiple: true,
    title: '',
    description: ''
  }

  test('fromDb', async () => {
    expect(await TypeNumber.fromDb(undefined, simpleNumber)).toBe(0)
    expect(await TypeNumber.fromDb(undefined, defaultNumber)).toBe(42)
    expect(await TypeNumber.fromDb(undefined, nullableNumber)).toBe(null)
    expect(
      await TypeNumber.fromDb(undefined, simpleMultipleNumber)
    ).toBeInstanceOf(Array)
    expect(
      await TypeNumber.fromDb(undefined, simpleMultipleNumber)
    ).toHaveLength(0)
    expect(
      await TypeNumber.fromDb(undefined, defaultMultipleNumber)
    ).toBeInstanceOf(Array)
    expect(
      await TypeNumber.fromDb(undefined, defaultMultipleNumber)
    ).toHaveLength(0)
    expect(
      await TypeNumber.fromDb(undefined, nullableMultipleNumber)
    ).toBeInstanceOf(Array)
    expect(
      await TypeNumber.fromDb(undefined, nullableMultipleNumber)
    ).toHaveLength(0)

    expect(await TypeNumber.fromDb(null, simpleNumber)).toBe(0)
    expect(await TypeNumber.fromDb(null, defaultNumber)).toBe(42)
    expect(await TypeNumber.fromDb(null, nullableNumber)).toBe(null)
    expect(await TypeNumber.fromDb(null, simpleMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.fromDb(null, simpleMultipleNumber)).toHaveLength(0)
    expect(await TypeNumber.fromDb(null, defaultMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.fromDb(null, defaultMultipleNumber)).toHaveLength(0)
    expect(
      await TypeNumber.fromDb(null, nullableMultipleNumber)
    ).toBeInstanceOf(Array)
    expect(await TypeNumber.fromDb(null, nullableMultipleNumber)).toHaveLength(
      1
    )

    expect(await TypeNumber.fromDb(21, simpleNumber)).toBe(21)
    expect(await TypeNumber.fromDb('42', simpleNumber)).toBe(42)
    expect(await TypeNumber.fromDb('42.32', simpleNumber)).toBe(42.32)
    expect(await TypeNumber.fromDb(42.32, simpleNumber)).toBe(42.32)
    expect(await TypeNumber.fromDb(21, defaultNumber)).toBe(21)
    expect(await TypeNumber.fromDb(21, nullableNumber)).toBe(21)
    expect(await TypeNumber.fromDb(21, simpleMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.fromDb(21, simpleMultipleNumber)).toHaveLength(1)
    expect((await TypeNumber.fromDb(21, simpleMultipleNumber))?.[0]).toBe(21)
    expect(await TypeNumber.fromDb(21, defaultMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.fromDb(21, defaultMultipleNumber)).toHaveLength(1)
    expect((await TypeNumber.fromDb(21, defaultMultipleNumber))?.[0]).toBe(21)
    expect(await TypeNumber.fromDb(21, nullableMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.fromDb(21, nullableMultipleNumber)).toHaveLength(1)
    expect((await TypeNumber.fromDb(21, nullableMultipleNumber))?.[0]).toBe(21)

    expect(await TypeNumber.fromDb([21], simpleMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.fromDb([21], simpleMultipleNumber)).toHaveLength(1)
    expect((await TypeNumber.fromDb([21], simpleMultipleNumber))?.[0]).toBe(21)
    expect(await TypeNumber.fromDb([21], defaultMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.fromDb([21], defaultMultipleNumber)).toHaveLength(1)
    expect((await TypeNumber.fromDb([21], defaultMultipleNumber))?.[0]).toBe(21)
    expect(
      await TypeNumber.fromDb([21], nullableMultipleNumber)
    ).toBeInstanceOf(Array)
    expect(await TypeNumber.fromDb([21], nullableMultipleNumber)).toHaveLength(
      1
    )
    expect((await TypeNumber.fromDb([21], nullableMultipleNumber))?.[0]).toBe(
      21
    )
  })

  test('toDb', async () => {
    expect(await TypeNumber.toDb(undefined, simpleNumber)).toBe(0)
    expect(await TypeNumber.toDb(undefined, defaultNumber)).toBe(42)
    expect(await TypeNumber.toDb(undefined, nullableNumber)).toBe(null)
    expect(
      await TypeNumber.toDb(undefined, simpleMultipleNumber)
    ).toBeInstanceOf(Array)
    expect(await TypeNumber.toDb(undefined, simpleMultipleNumber)).toHaveLength(
      0
    )
    expect(
      await TypeNumber.toDb(undefined, defaultMultipleNumber)
    ).toBeInstanceOf(Array)
    expect(
      await TypeNumber.toDb(undefined, defaultMultipleNumber)
    ).toHaveLength(0)
    expect(
      await TypeNumber.toDb(undefined, nullableMultipleNumber)
    ).toBeInstanceOf(Array)
    expect(
      await TypeNumber.toDb(undefined, nullableMultipleNumber)
    ).toHaveLength(0)

    expect(await TypeNumber.toDb(null, simpleNumber)).toBe(0)
    expect(await TypeNumber.toDb(null, defaultNumber)).toBe(42)
    expect(await TypeNumber.toDb(null, nullableNumber)).toBe(null)
    expect(await TypeNumber.toDb(null, simpleMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.toDb(null, simpleMultipleNumber)).toHaveLength(0)
    expect(await TypeNumber.toDb(null, defaultMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.toDb(null, defaultMultipleNumber)).toHaveLength(0)
    expect(await TypeNumber.toDb(null, nullableMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.toDb(null, nullableMultipleNumber)).toHaveLength(1)

    expect(await TypeNumber.toDb(21, simpleNumber)).toBe(21)
    expect(await TypeNumber.toDb('42', simpleNumber)).toBe(42)
    expect(await TypeNumber.toDb('42.32', simpleNumber)).toBe(42.32)
    expect(await TypeNumber.toDb(42.32, simpleNumber)).toBe(42.32)
    expect(await TypeNumber.toDb(21, defaultNumber)).toBe(21)
    expect(await TypeNumber.toDb(21, nullableNumber)).toBe(21)
    expect(await TypeNumber.toDb(21, simpleMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.toDb(21, simpleMultipleNumber)).toHaveLength(1)
    expect((await TypeNumber.toDb(21, simpleMultipleNumber))?.[0]).toBe(21)
    expect(await TypeNumber.toDb(21, defaultMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.toDb(21, defaultMultipleNumber)).toHaveLength(1)
    expect((await TypeNumber.toDb(21, defaultMultipleNumber))?.[0]).toBe(21)
    expect(await TypeNumber.toDb(21, nullableMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.toDb(21, nullableMultipleNumber)).toHaveLength(1)
    expect((await TypeNumber.toDb(21, nullableMultipleNumber))?.[0]).toBe(21)

    expect(await TypeNumber.toDb([21], simpleMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.toDb([21], simpleMultipleNumber)).toHaveLength(1)
    expect((await TypeNumber.toDb([21], simpleMultipleNumber))?.[0]).toBe(21)
    expect(await TypeNumber.toDb([21], defaultMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.toDb([21], defaultMultipleNumber)).toHaveLength(1)
    expect((await TypeNumber.toDb([21], defaultMultipleNumber))?.[0]).toBe(21)
    expect(await TypeNumber.toDb([21], nullableMultipleNumber)).toBeInstanceOf(
      Array
    )
    expect(await TypeNumber.toDb([21], nullableMultipleNumber)).toHaveLength(1)
    expect((await TypeNumber.toDb([21], nullableMultipleNumber))?.[0]).toBe(21)
  })

  test('getValidationSchema', async () => {
    const ajv = new Ajv()
    addFormats(ajv)
    const nonNullableSchema = ajv.compile(
      TypeNumber.getValidationSchema(simpleNumber)
    )
    const nullableSchema = ajv.compile(
      TypeNumber.getValidationSchema(nullableNumber)
    )
    const multipleSchema = ajv.compile(
      TypeNumber.getValidationSchema({
        ...simpleMultipleNumber,
        minItems: 2,
        maxItems: 4
      })
    )
    const minSchema = ajv.compile(
      TypeNumber.getValidationSchema({
        type: 'number',
        min: 10
      })
    )
    const maxSchema = ajv.compile(
      TypeNumber.getValidationSchema({
        type: 'number',
        max: 10
      })
    )

    expect(nonNullableSchema(42)).toBe(true)
    expect(nonNullableSchema(null)).toBe(false)
    expect(nonNullableSchema(undefined)).toBe(false)
    expect(nullableSchema(42)).toBe(true)
    expect(nullableSchema(null)).toBe(true)
    expect(nullableSchema(undefined)).toBe(false)
    expect(multipleSchema([42, 42])).toBe(true)
    expect(multipleSchema([42])).toBe(false)
    expect(multipleSchema([42, 42, 42, 42, 42])).toBe(false)
    expect(multipleSchema([null])).toBe(false)
    expect(minSchema(12)).toBe(true)
    expect(minSchema(3)).toBe(false)
    expect(maxSchema(3)).toBe(true)
    expect(maxSchema(12)).toBe(false)
  })

  test('getMongooseField', () => {
    const simpleField = TypeNumber.getMongooseField(simpleNumber)
    const nullableField = TypeNumber.getMongooseField(nullableNumber)
    const simpleMultipleField =
      TypeNumber.getMongooseField(simpleMultipleNumber)
    const defaultField = TypeNumber.getMongooseField(defaultNumber)

    expect(simpleField.$type).toBe(Number)
    expect(nullableField.$type).toBe(Number)
    expect(simpleMultipleField?.[0]?.$type).toBe(Number)
    expect(defaultField.$type).toBe(Number)
    expect(defaultField.default).toBeDefined()
  })

  test('getMongooseIndex', () => {
    const simpleField = TypeNumber.getMongooseIndex('name', simpleNumber)
    const nullableField = TypeNumber.getMongooseIndex('name', nullableNumber)
    const simpleMultipleField = TypeNumber.getMongooseIndex(
      'name',
      simpleMultipleNumber
    )
    const defaultField = TypeNumber.getMongooseIndex('name', defaultNumber)

    expect(simpleField).toBe(null)
    expect(nullableField).toBe(null)
    expect(simpleMultipleField).toBe(null)
    expect(defaultField).toBe(null)
  })
})
