import { IUuidOrmField } from '../../../interfaces/IOrmConf'
import { TypeUuid } from './Uuid'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

describe('ORM: Uuid', () => {
  let simpleUuid: IUuidOrmField = {
    type: 'uuid',
    title: '',
    description: ''
  }
  let multipleUuid: IUuidOrmField = {
    type: 'uuid',
    multiple: true,
    title: '',
    description: ''
  }
  let nullableUuid: IUuidOrmField = {
    type: 'uuid',
    nullable: true,
    title: '',
    description: ''
  }
  let multipleNullableUuid: IUuidOrmField = {
    type: 'uuid',
    multiple: true,
    nullable: true,
    title: '',
    description: ''
  }

  test('fromDb', async () => {
    expect(await TypeUuid.fromDb(undefined, simpleUuid)).not.toBe(null)
    expect(await TypeUuid.fromDb(undefined, nullableUuid)).toBe(null)
    expect(await TypeUuid.fromDb(undefined, multipleUuid)).toBeInstanceOf(Array)
    expect(await TypeUuid.fromDb(undefined, multipleUuid)).toHaveLength(0)
    expect(
      await TypeUuid.fromDb(undefined, multipleNullableUuid)
    ).toBeInstanceOf(Array)
    expect(await TypeUuid.fromDb(undefined, multipleNullableUuid)).toHaveLength(
      0
    )

    expect(await TypeUuid.fromDb(null, simpleUuid)).not.toBe(null)
    expect(await TypeUuid.fromDb(null, nullableUuid)).toBe(null)

    expect(
      await TypeUuid.fromDb('8e77c927-b08c-4a8b-afc2-68311db2ae8e', simpleUuid)
    ).toBe('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
    expect(
      await TypeUuid.fromDb(
        '8e77c927-b08c-4a8b-afc2-68311db2ae8e',
        nullableUuid
      )
    ).toBe('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
    expect(
      await TypeUuid.fromDb(
        '8e77c927-b08c-4a8b-afc2-68311db2ae8e',
        multipleUuid
      )
    ).toBeInstanceOf(Array)
    expect(
      await TypeUuid.fromDb(
        '8e77c927-b08c-4a8b-afc2-68311db2ae8e',
        multipleUuid
      )
    ).toHaveLength(1)
    expect(
      (
        await TypeUuid.fromDb(
          '8e77c927-b08c-4a8b-afc2-68311db2ae8e',
          multipleUuid
        )
      )?.[0]
    ).toBe('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
    expect(
      await TypeUuid.fromDb(
        '8e77c927-b08c-4a8b-afc2-68311db2ae8e',
        multipleNullableUuid
      )
    ).toBeInstanceOf(Array)
    expect(
      await TypeUuid.fromDb(
        '8e77c927-b08c-4a8b-afc2-68311db2ae8e',
        multipleNullableUuid
      )
    ).toHaveLength(1)
    expect(
      (
        await TypeUuid.fromDb(
          '8e77c927-b08c-4a8b-afc2-68311db2ae8e',
          multipleNullableUuid
        )
      )?.[0]
    ).toBe('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
    expect(
      await TypeUuid.fromDb(
        ['8e77c927-b08c-4a8b-afc2-68311db2ae8e'],
        multipleUuid
      )
    ).toBeInstanceOf(Array)
    expect(
      await TypeUuid.fromDb(
        ['8e77c927-b08c-4a8b-afc2-68311db2ae8e'],
        multipleUuid
      )
    ).toHaveLength(1)
    expect(
      (
        await TypeUuid.fromDb(
          ['8e77c927-b08c-4a8b-afc2-68311db2ae8e'],
          multipleUuid
        )
      )?.[0]
    ).toBe('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
    expect(
      await TypeUuid.fromDb(
        ['8e77c927-b08c-4a8b-afc2-68311db2ae8e'],
        multipleNullableUuid
      )
    ).toBeInstanceOf(Array)
    expect(
      await TypeUuid.fromDb(
        ['8e77c927-b08c-4a8b-afc2-68311db2ae8e'],
        multipleNullableUuid
      )
    ).toHaveLength(1)
    expect(
      (
        await TypeUuid.fromDb(
          ['8e77c927-b08c-4a8b-afc2-68311db2ae8e'],
          multipleNullableUuid
        )
      )?.[0]
    ).toBe('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
  })

  test('toDb', async () => {
    expect(await TypeUuid.toDb(undefined, simpleUuid)).not.toBe(null)
    expect(await TypeUuid.toDb(undefined, nullableUuid)).toBe(null)
    expect(await TypeUuid.toDb(undefined, multipleUuid)).toBeInstanceOf(Array)
    expect(await TypeUuid.toDb(undefined, multipleUuid)).toHaveLength(0)
    expect(await TypeUuid.toDb(undefined, multipleNullableUuid)).toBeInstanceOf(
      Array
    )
    expect(await TypeUuid.toDb(undefined, multipleNullableUuid)).toHaveLength(0)

    expect(await TypeUuid.toDb(null, simpleUuid)).not.toBe(null)
    expect(await TypeUuid.toDb(null, nullableUuid)).toBe(null)

    expect(
      await TypeUuid.toDb('8e77c927-b08c-4a8b-afc2-68311db2ae8e', simpleUuid)
    ).toBe('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
    expect(
      await TypeUuid.toDb('8e77c927-b08c-4a8b-afc2-68311db2ae8e', nullableUuid)
    ).toBe('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
    expect(
      await TypeUuid.toDb('8e77c927-b08c-4a8b-afc2-68311db2ae8e', multipleUuid)
    ).toBeInstanceOf(Array)
    expect(
      await TypeUuid.toDb('8e77c927-b08c-4a8b-afc2-68311db2ae8e', multipleUuid)
    ).toHaveLength(1)
    expect(
      (
        await TypeUuid.toDb(
          '8e77c927-b08c-4a8b-afc2-68311db2ae8e',
          multipleUuid
        )
      )?.[0]
    ).toBe('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
    expect(
      await TypeUuid.toDb(
        '8e77c927-b08c-4a8b-afc2-68311db2ae8e',
        multipleNullableUuid
      )
    ).toBeInstanceOf(Array)
    expect(
      await TypeUuid.toDb(
        '8e77c927-b08c-4a8b-afc2-68311db2ae8e',
        multipleNullableUuid
      )
    ).toHaveLength(1)
    expect(
      (
        await TypeUuid.toDb(
          '8e77c927-b08c-4a8b-afc2-68311db2ae8e',
          multipleNullableUuid
        )
      )?.[0]
    ).toBe('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
    expect(
      await TypeUuid.toDb(
        ['8e77c927-b08c-4a8b-afc2-68311db2ae8e'],
        multipleUuid
      )
    ).toBeInstanceOf(Array)
    expect(
      await TypeUuid.toDb(
        ['8e77c927-b08c-4a8b-afc2-68311db2ae8e'],
        multipleUuid
      )
    ).toHaveLength(1)
    expect(
      (
        await TypeUuid.toDb(
          ['8e77c927-b08c-4a8b-afc2-68311db2ae8e'],
          multipleUuid
        )
      )?.[0]
    ).toBe('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
    expect(
      await TypeUuid.toDb(
        ['8e77c927-b08c-4a8b-afc2-68311db2ae8e'],
        multipleNullableUuid
      )
    ).toBeInstanceOf(Array)
    expect(
      await TypeUuid.toDb(
        ['8e77c927-b08c-4a8b-afc2-68311db2ae8e'],
        multipleNullableUuid
      )
    ).toHaveLength(1)
    expect(
      (
        await TypeUuid.toDb(
          ['8e77c927-b08c-4a8b-afc2-68311db2ae8e'],
          multipleNullableUuid
        )
      )?.[0]
    ).toBe('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
  })

  test('getValidationSchema', async () => {
    const ajv = new Ajv()
    addFormats(ajv)
    const nonNullableSchema = ajv.compile(
      TypeUuid.getValidationSchema(simpleUuid)
    )
    const nullableSchema = ajv.compile(
      TypeUuid.getValidationSchema(nullableUuid)
    )
    const nonNullableMultipleSchema = ajv.compile(
      TypeUuid.getValidationSchema(multipleUuid)
    )
    const nullableMultipleSchema = ajv.compile(
      TypeUuid.getValidationSchema(multipleNullableUuid)
    )

    expect(nonNullableSchema('8e77c927-b08c-4a8b-afc2-68311db2ae8e')).toBe(true)
    expect(nonNullableSchema('')).toBe(false)
    expect(nonNullableSchema(undefined)).toBe(false)
    expect(nonNullableSchema(null)).toBe(false)

    expect(nullableSchema('8e77c927-b08c-4a8b-afc2-68311db2ae8e')).toBe(true)
    expect(nullableSchema('')).toBe(false)
    expect(nullableSchema(undefined)).toBe(false)
    expect(nullableSchema(null)).toBe(true)

    expect(
      nonNullableMultipleSchema('8e77c927-b08c-4a8b-afc2-68311db2ae8e')
    ).toBe(false)
    expect(nonNullableMultipleSchema('')).toBe(false)
    expect(nonNullableMultipleSchema(undefined)).toBe(false)
    expect(nonNullableMultipleSchema(null)).toBe(false)

    expect(nullableMultipleSchema('8e77c927-b08c-4a8b-afc2-68311db2ae8e')).toBe(
      false
    )
    expect(nullableMultipleSchema('')).toBe(false)
    expect(nullableMultipleSchema(undefined)).toBe(false)
    expect(nullableMultipleSchema(null)).toBe(false)

    expect(
      nonNullableMultipleSchema(['8e77c927-b08c-4a8b-afc2-68311db2ae8e'])
    ).toBe(true)
    expect(nonNullableMultipleSchema([''])).toBe(false)
    expect(nonNullableMultipleSchema([undefined])).toBe(false)
    expect(nonNullableMultipleSchema([null])).toBe(false)

    expect(
      nullableMultipleSchema(['8e77c927-b08c-4a8b-afc2-68311db2ae8e'])
    ).toBe(true)
    expect(nullableMultipleSchema([''])).toBe(false)
    expect(nullableMultipleSchema([undefined])).toBe(false)
    expect(nullableMultipleSchema([null])).toBe(true)
  })

  test('getMongooseField', () => {
    const simpleField = TypeUuid.getMongooseField(simpleUuid)
    const nullableField = TypeUuid.getMongooseField(nullableUuid)
    const simpleMultipleField = TypeUuid.getMongooseField(multipleUuid)
    const nullableMultipleField =
      TypeUuid.getMongooseField(multipleNullableUuid)

    expect(simpleField.$type).toBe(String)
    expect(nullableField.$type).toBe(String)
    expect(simpleMultipleField?.[0]?.$type).toBe(String)
    expect(nullableMultipleField?.[0]?.$type).toBe(String)
  })

  test('getMongooseIndex', () => {
    const simpleField = TypeUuid.getMongooseIndex('name', simpleUuid)
    const nullableField = TypeUuid.getMongooseIndex('name', nullableUuid)
    const simpleMultipleField = TypeUuid.getMongooseIndex('name', multipleUuid)
    const nullableMultipleField = TypeUuid.getMongooseIndex(
      'name',
      multipleNullableUuid
    )

    expect(simpleField).toBe(null)
    expect(nullableField).toBe(null)
    expect(simpleMultipleField).toBe(null)
    expect(nullableMultipleField).toBe(null)
  })
})
