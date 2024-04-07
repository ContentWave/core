import { IEnumOrmField } from '../../../interfaces/IOrmConf'
import { TypeEnum } from './Enum'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

describe('ORM: Enum', () => {
  let simpleEnum: IEnumOrmField = {
    type: 'enum',
    values: ['foo']
  }
  let nullableEnum: IEnumOrmField = {
    type: 'enum',
    values: ['foo'],
    nullable: true
  }
  let simpleMultipleEnum: IEnumOrmField = {
    type: 'enum',
    values: ['foo'],
    multiple: true
  }
  let nullableMultipleEnum: IEnumOrmField = {
    type: 'enum',
    values: ['foo'],
    nullable: true,
    multiple: true
  }

  test('fromDb', async () => {
    expect(await TypeEnum.fromDb(undefined, simpleEnum)).toBe(null)
    expect(await TypeEnum.fromDb(undefined, nullableEnum)).toBe(null)
    expect(await TypeEnum.fromDb(undefined, simpleMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.fromDb(undefined, simpleMultipleEnum)).toHaveLength(0)
    expect(
      await TypeEnum.fromDb(undefined, nullableMultipleEnum)
    ).toBeInstanceOf(Array)
    expect(await TypeEnum.fromDb(undefined, nullableMultipleEnum)).toHaveLength(
      0
    )

    expect(await TypeEnum.fromDb(null, simpleEnum)).toBe(null)
    expect(await TypeEnum.fromDb(null, nullableEnum)).toBe(null)
    expect(await TypeEnum.fromDb(null, simpleMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.fromDb(null, simpleMultipleEnum)).toHaveLength(0)
    expect(await TypeEnum.fromDb(null, nullableMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.fromDb(null, nullableMultipleEnum)).toHaveLength(1)

    expect(await TypeEnum.fromDb('foo', simpleEnum)).toBe('foo')
    expect(await TypeEnum.fromDb('foo', nullableEnum)).toBe('foo')
    expect(await TypeEnum.fromDb('foo', simpleMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.fromDb('foo', simpleMultipleEnum)).toHaveLength(1)
    expect((await TypeEnum.fromDb('foo', simpleMultipleEnum))?.[0]).toBe('foo')
    expect(await TypeEnum.fromDb('foo', nullableMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.fromDb('foo', nullableMultipleEnum)).toHaveLength(1)
    expect((await TypeEnum.fromDb('foo', nullableMultipleEnum))?.[0]).toBe(
      'foo'
    )

    expect(await TypeEnum.fromDb(['foo'], simpleMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.fromDb(['foo'], simpleMultipleEnum)).toHaveLength(1)
    expect((await TypeEnum.fromDb(['foo'], simpleMultipleEnum))?.[0]).toBe(
      'foo'
    )
    expect(await TypeEnum.fromDb(['foo'], nullableMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.fromDb(['foo'], nullableMultipleEnum)).toHaveLength(1)
    expect((await TypeEnum.fromDb(['foo'], nullableMultipleEnum))?.[0]).toBe(
      'foo'
    )
  })

  test('toDb', async () => {
    expect(await TypeEnum.toDb(undefined, simpleEnum)).toBe(null)
    expect(await TypeEnum.toDb(undefined, nullableEnum)).toBe(null)
    expect(await TypeEnum.toDb(undefined, simpleMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.toDb(undefined, simpleMultipleEnum)).toHaveLength(0)
    expect(await TypeEnum.toDb(undefined, nullableMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.toDb(undefined, nullableMultipleEnum)).toHaveLength(0)

    expect(await TypeEnum.toDb(null, simpleEnum)).toBe(null)
    expect(await TypeEnum.toDb(null, nullableEnum)).toBe(null)
    expect(await TypeEnum.toDb(null, simpleMultipleEnum)).toBeInstanceOf(Array)
    expect(await TypeEnum.toDb(null, simpleMultipleEnum)).toHaveLength(0)
    expect(await TypeEnum.toDb(null, nullableMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.toDb(null, nullableMultipleEnum)).toHaveLength(1)

    expect(await TypeEnum.toDb('foo', simpleEnum)).toBe('foo')
    expect(await TypeEnum.toDb('foo', nullableEnum)).toBe('foo')
    expect(await TypeEnum.toDb('foo', simpleMultipleEnum)).toBeInstanceOf(Array)
    expect(await TypeEnum.toDb('foo', simpleMultipleEnum)).toHaveLength(1)
    expect((await TypeEnum.toDb('foo', simpleMultipleEnum))?.[0]).toBe('foo')
    expect(await TypeEnum.toDb('foo', nullableMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.toDb('foo', nullableMultipleEnum)).toHaveLength(1)
    expect((await TypeEnum.toDb('foo', nullableMultipleEnum))?.[0]).toBe('foo')

    expect(await TypeEnum.toDb(['foo'], simpleMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.toDb(['foo'], simpleMultipleEnum)).toHaveLength(1)
    expect((await TypeEnum.toDb(['foo'], simpleMultipleEnum))?.[0]).toBe('foo')
    expect(await TypeEnum.toDb(['foo'], nullableMultipleEnum)).toBeInstanceOf(
      Array
    )
    expect(await TypeEnum.toDb(['foo'], nullableMultipleEnum)).toHaveLength(1)
    expect((await TypeEnum.toDb(['foo'], nullableMultipleEnum))?.[0]).toBe(
      'foo'
    )
  })

  test('getValidationSchema', async () => {
    const ajv = new Ajv()
    addFormats(ajv)
    const nonNullableSchema = ajv.compile(
      TypeEnum.getValidationSchema(simpleEnum)
    )
    const nullableSchema = ajv.compile(
      TypeEnum.getValidationSchema(nullableEnum)
    )
    const multipleSchema = ajv.compile(
      TypeEnum.getValidationSchema({
        ...simpleMultipleEnum,
        minItems: 2,
        maxItems: 4
      })
    )

    expect(nonNullableSchema('foo')).toBe(true)
    expect(nonNullableSchema('test')).toBe(false)
    expect(nonNullableSchema(null)).toBe(false)
    expect(nonNullableSchema(undefined)).toBe(false)
    expect(nullableSchema('foo')).toBe(true)
    expect(nullableSchema(null)).toBe(true)
    expect(nullableSchema(undefined)).toBe(false)
    expect(multipleSchema(['foo', 'foo'])).toBe(true)
    expect(multipleSchema(['foo'])).toBe(false)
    expect(multipleSchema(['foo', 'foo', 'foo', 'foo', 'foo'])).toBe(false)
    expect(multipleSchema([null])).toBe(false)
  })

  test('getMongooseField', () => {
    const simpleField = TypeEnum.getMongooseField(simpleEnum)
    const nullableField = TypeEnum.getMongooseField(nullableEnum)
    const simpleMultipleField = TypeEnum.getMongooseField(simpleMultipleEnum)

    expect(simpleField.$type).toBe(String)
    expect(nullableField.$type).toBe(String)
    expect(simpleMultipleField?.[0]?.$type).toBe(String)
  })

  test('getMongooseIndex', () => {
    const simpleField = TypeEnum.getMongooseIndex('name', simpleEnum)
    const nullableField = TypeEnum.getMongooseIndex('name', nullableEnum)
    const simpleMultipleField = TypeEnum.getMongooseIndex(
      'name',
      simpleMultipleEnum
    )

    expect(simpleField).toBe(null)
    expect(nullableField).toBe(null)
    expect(simpleMultipleField).toBe(null)
  })
})
