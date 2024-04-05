import { IIntegerOrmField } from '../IOrmConf'
import { TypeInteger } from './Integer'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

describe('ORM: Integer', () => {
  let simpleInteger: IIntegerOrmField = {
    type: 'integer'
  }
  let defaultInteger: IIntegerOrmField = {
    type: 'integer',
    default: 42
  }
  let nullableInteger: IIntegerOrmField = {
    type: 'integer',
    nullable: true
  }
  let simpleMultipleInteger: IIntegerOrmField = {
    type: 'integer',
    multiple: true
  }
  let defaultMultipleInteger: IIntegerOrmField = {
    type: 'integer',
    default: 42,
    multiple: true
  }
  let nullableMultipleInteger: IIntegerOrmField = {
    type: 'integer',
    nullable: true,
    multiple: true
  }

  test('fromDb', async () => {
    expect(await TypeInteger.fromDb(undefined, simpleInteger)).toBe(0)
    expect(await TypeInteger.fromDb(undefined, defaultInteger)).toBe(42)
    expect(await TypeInteger.fromDb(undefined, nullableInteger)).toBe(null)
    expect(
      await TypeInteger.fromDb(undefined, simpleMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(
      await TypeInteger.fromDb(undefined, simpleMultipleInteger)
    ).toHaveLength(0)
    expect(
      await TypeInteger.fromDb(undefined, defaultMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(
      await TypeInteger.fromDb(undefined, defaultMultipleInteger)
    ).toHaveLength(0)
    expect(
      await TypeInteger.fromDb(undefined, nullableMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(
      await TypeInteger.fromDb(undefined, nullableMultipleInteger)
    ).toHaveLength(0)

    expect(await TypeInteger.fromDb(null, simpleInteger)).toBe(0)
    expect(await TypeInteger.fromDb(null, defaultInteger)).toBe(42)
    expect(await TypeInteger.fromDb(null, nullableInteger)).toBe(null)
    expect(
      await TypeInteger.fromDb(null, simpleMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(await TypeInteger.fromDb(null, simpleMultipleInteger)).toHaveLength(
      0
    )
    expect(
      await TypeInteger.fromDb(null, defaultMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(await TypeInteger.fromDb(null, defaultMultipleInteger)).toHaveLength(
      0
    )
    expect(
      await TypeInteger.fromDb(null, nullableMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(
      await TypeInteger.fromDb(null, nullableMultipleInteger)
    ).toHaveLength(1)

    expect(await TypeInteger.fromDb(21, simpleInteger)).toBe(21)
    expect(await TypeInteger.fromDb('42', simpleInteger)).toBe(42)
    expect(await TypeInteger.fromDb('42.32', simpleInteger)).toBe(42)
    expect(await TypeInteger.fromDb(42.32, simpleInteger)).toBe(42)
    expect(await TypeInteger.fromDb(21, defaultInteger)).toBe(21)
    expect(await TypeInteger.fromDb(21, nullableInteger)).toBe(21)
    expect(await TypeInteger.fromDb(21, simpleMultipleInteger)).toBeInstanceOf(
      Array
    )
    expect(await TypeInteger.fromDb(21, simpleMultipleInteger)).toHaveLength(1)
    expect((await TypeInteger.fromDb(21, simpleMultipleInteger))?.[0]).toBe(21)
    expect(await TypeInteger.fromDb(21, defaultMultipleInteger)).toBeInstanceOf(
      Array
    )
    expect(await TypeInteger.fromDb(21, defaultMultipleInteger)).toHaveLength(1)
    expect((await TypeInteger.fromDb(21, defaultMultipleInteger))?.[0]).toBe(21)
    expect(
      await TypeInteger.fromDb(21, nullableMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(await TypeInteger.fromDb(21, nullableMultipleInteger)).toHaveLength(
      1
    )
    expect((await TypeInteger.fromDb(21, nullableMultipleInteger))?.[0]).toBe(
      21
    )

    expect(
      await TypeInteger.fromDb([21], simpleMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(await TypeInteger.fromDb([21], simpleMultipleInteger)).toHaveLength(
      1
    )
    expect((await TypeInteger.fromDb([21], simpleMultipleInteger))?.[0]).toBe(
      21
    )
    expect(
      await TypeInteger.fromDb([21], defaultMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(await TypeInteger.fromDb([21], defaultMultipleInteger)).toHaveLength(
      1
    )
    expect((await TypeInteger.fromDb([21], defaultMultipleInteger))?.[0]).toBe(
      21
    )
    expect(
      await TypeInteger.fromDb([21], nullableMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(
      await TypeInteger.fromDb([21], nullableMultipleInteger)
    ).toHaveLength(1)
    expect((await TypeInteger.fromDb([21], nullableMultipleInteger))?.[0]).toBe(
      21
    )
  })

  test('toDb', async () => {
    expect(await TypeInteger.toDb(undefined, simpleInteger)).toBe(0)
    expect(await TypeInteger.toDb(undefined, defaultInteger)).toBe(42)
    expect(await TypeInteger.toDb(undefined, nullableInteger)).toBe(null)
    expect(
      await TypeInteger.toDb(undefined, simpleMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(
      await TypeInteger.toDb(undefined, simpleMultipleInteger)
    ).toHaveLength(0)
    expect(
      await TypeInteger.toDb(undefined, defaultMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(
      await TypeInteger.toDb(undefined, defaultMultipleInteger)
    ).toHaveLength(0)
    expect(
      await TypeInteger.toDb(undefined, nullableMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(
      await TypeInteger.toDb(undefined, nullableMultipleInteger)
    ).toHaveLength(0)

    expect(await TypeInteger.toDb(null, simpleInteger)).toBe(0)
    expect(await TypeInteger.toDb(null, defaultInteger)).toBe(42)
    expect(await TypeInteger.toDb(null, nullableInteger)).toBe(null)
    expect(await TypeInteger.toDb(null, simpleMultipleInteger)).toBeInstanceOf(
      Array
    )
    expect(await TypeInteger.toDb(null, simpleMultipleInteger)).toHaveLength(0)
    expect(await TypeInteger.toDb(null, defaultMultipleInteger)).toBeInstanceOf(
      Array
    )
    expect(await TypeInteger.toDb(null, defaultMultipleInteger)).toHaveLength(0)
    expect(
      await TypeInteger.toDb(null, nullableMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(await TypeInteger.toDb(null, nullableMultipleInteger)).toHaveLength(
      1
    )

    expect(await TypeInteger.toDb(21, simpleInteger)).toBe(21)
    expect(await TypeInteger.toDb('42', simpleInteger)).toBe(42)
    expect(await TypeInteger.toDb('42.32', simpleInteger)).toBe(42)
    expect(await TypeInteger.toDb(42.32, simpleInteger)).toBe(42)
    expect(await TypeInteger.toDb(21, defaultInteger)).toBe(21)
    expect(await TypeInteger.toDb(21, nullableInteger)).toBe(21)
    expect(await TypeInteger.toDb(21, simpleMultipleInteger)).toBeInstanceOf(
      Array
    )
    expect(await TypeInteger.toDb(21, simpleMultipleInteger)).toHaveLength(1)
    expect((await TypeInteger.toDb(21, simpleMultipleInteger))?.[0]).toBe(21)
    expect(await TypeInteger.toDb(21, defaultMultipleInteger)).toBeInstanceOf(
      Array
    )
    expect(await TypeInteger.toDb(21, defaultMultipleInteger)).toHaveLength(1)
    expect((await TypeInteger.toDb(21, defaultMultipleInteger))?.[0]).toBe(21)
    expect(await TypeInteger.toDb(21, nullableMultipleInteger)).toBeInstanceOf(
      Array
    )
    expect(await TypeInteger.toDb(21, nullableMultipleInteger)).toHaveLength(1)
    expect((await TypeInteger.toDb(21, nullableMultipleInteger))?.[0]).toBe(21)

    expect(await TypeInteger.toDb([21], simpleMultipleInteger)).toBeInstanceOf(
      Array
    )
    expect(await TypeInteger.toDb([21], simpleMultipleInteger)).toHaveLength(1)
    expect((await TypeInteger.toDb([21], simpleMultipleInteger))?.[0]).toBe(21)
    expect(await TypeInteger.toDb([21], defaultMultipleInteger)).toBeInstanceOf(
      Array
    )
    expect(await TypeInteger.toDb([21], defaultMultipleInteger)).toHaveLength(1)
    expect((await TypeInteger.toDb([21], defaultMultipleInteger))?.[0]).toBe(21)
    expect(
      await TypeInteger.toDb([21], nullableMultipleInteger)
    ).toBeInstanceOf(Array)
    expect(await TypeInteger.toDb([21], nullableMultipleInteger)).toHaveLength(
      1
    )
    expect((await TypeInteger.toDb([21], nullableMultipleInteger))?.[0]).toBe(
      21
    )
  })

  test('getValidationSchema', async () => {
    const ajv = new Ajv()
    addFormats(ajv)
    const nonNullableSchema = ajv.compile(
      TypeInteger.getValidationSchema(simpleInteger)
    )
    const nullableSchema = ajv.compile(
      TypeInteger.getValidationSchema(nullableInteger)
    )
    const multipleSchema = ajv.compile(
      TypeInteger.getValidationSchema({
        ...simpleMultipleInteger,
        minItems: 2,
        maxItems: 4
      })
    )
    const minSchema = ajv.compile(
      TypeInteger.getValidationSchema({
        type: 'integer',
        min: 10
      })
    )
    const maxSchema = ajv.compile(
      TypeInteger.getValidationSchema({
        type: 'integer',
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
    const simpleField = TypeInteger.getMongooseField(simpleInteger)
    const nullableField = TypeInteger.getMongooseField(nullableInteger)
    const simpleMultipleField = TypeInteger.getMongooseField(
      simpleMultipleInteger
    )
    const defaultField = TypeInteger.getMongooseField(defaultInteger)

    expect(simpleField.$type).toBe(Number)
    expect(nullableField.$type).toBe(Number)
    expect(simpleMultipleField?.[0]?.$type).toBe(Number)
    expect(defaultField.$type).toBe(Number)
    expect(defaultField.default).toBeDefined()
  })

  test('getMongooseIndex', () => {
    const simpleField = TypeInteger.getMongooseIndex('name', simpleInteger)
    const nullableField = TypeInteger.getMongooseIndex('name', nullableInteger)
    const simpleMultipleField = TypeInteger.getMongooseIndex(
      'name',
      simpleMultipleInteger
    )
    const defaultField = TypeInteger.getMongooseIndex('name', defaultInteger)

    expect(simpleField).toBe(null)
    expect(nullableField).toBe(null)
    expect(simpleMultipleField).toBe(null)
    expect(defaultField).toBe(null)
  })
})
