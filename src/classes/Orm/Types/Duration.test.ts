import { IDurationOrmField } from '../../../interfaces/IOrmConf'
import { TypeDuration } from './Duration'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

describe('ORM: Duration', () => {
  let simpleDuration: IDurationOrmField = {
    type: 'duration',
    title: '',
    description: ''
  }
  let nullableDuration: IDurationOrmField = {
    type: 'duration',
    nullable: true,
    title: '',
    description: ''
  }
  let simpleMultipleDuration: IDurationOrmField = {
    type: 'duration',
    multiple: true,
    title: '',
    description: ''
  }
  let nullableMultipleDuration: IDurationOrmField = {
    type: 'duration',
    nullable: true,
    multiple: true,
    title: '',
    description: ''
  }

  test('fromDb', async () => {
    expect(await TypeDuration.fromDb(undefined, simpleDuration)).toBe('P0D')
    expect(await TypeDuration.fromDb(undefined, nullableDuration)).toBe(null)
    expect(
      await TypeDuration.fromDb(undefined, simpleMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.fromDb(undefined, simpleMultipleDuration)
    ).toHaveLength(0)
    expect(
      await TypeDuration.fromDb(undefined, nullableMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.fromDb(undefined, nullableMultipleDuration)
    ).toHaveLength(0)

    expect(await TypeDuration.fromDb(null, simpleDuration)).toBe('P0D')
    expect(await TypeDuration.fromDb(null, nullableDuration)).toBe(null)
    expect(
      await TypeDuration.fromDb(null, simpleMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.fromDb(null, simpleMultipleDuration)
    ).toHaveLength(0)
    expect(
      await TypeDuration.fromDb(null, nullableMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.fromDb(null, nullableMultipleDuration)
    ).toHaveLength(1)

    expect(await TypeDuration.fromDb('P0D', simpleDuration)).toBe('P0D')
    expect(await TypeDuration.fromDb('P0D', nullableDuration)).toBe('P0D')
    expect(
      await TypeDuration.fromDb('P0D', simpleMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.fromDb('P0D', simpleMultipleDuration)
    ).toHaveLength(1)
    expect(
      (await TypeDuration.fromDb('P0D', simpleMultipleDuration))?.[0]
    ).toBe('P0D')
    expect(
      await TypeDuration.fromDb('P0D', nullableMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.fromDb('P0D', nullableMultipleDuration)
    ).toHaveLength(1)
    expect(
      (await TypeDuration.fromDb('P0D', nullableMultipleDuration))?.[0]
    ).toBe('P0D')

    expect(
      await TypeDuration.fromDb(['P0D'], simpleMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.fromDb(['P0D'], simpleMultipleDuration)
    ).toHaveLength(1)
    expect(
      (await TypeDuration.fromDb(['P0D'], simpleMultipleDuration))?.[0]
    ).toBe('P0D')
    expect(
      await TypeDuration.fromDb(['P0D'], nullableMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.fromDb(['P0D'], nullableMultipleDuration)
    ).toHaveLength(1)
    expect(
      (await TypeDuration.fromDb(['P0D'], nullableMultipleDuration))?.[0]
    ).toBe('P0D')
  })

  test('toDb', async () => {
    expect(await TypeDuration.toDb(undefined, simpleDuration)).toBe('P0D')
    expect(await TypeDuration.toDb(undefined, nullableDuration)).toBe(null)
    expect(
      await TypeDuration.toDb(undefined, simpleMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.toDb(undefined, simpleMultipleDuration)
    ).toHaveLength(0)
    expect(
      await TypeDuration.toDb(undefined, nullableMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.toDb(undefined, nullableMultipleDuration)
    ).toHaveLength(0)

    expect(await TypeDuration.toDb(null, simpleDuration)).toBe('P0D')
    expect(await TypeDuration.toDb(null, nullableDuration)).toBe(null)
    expect(
      await TypeDuration.toDb(null, simpleMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(await TypeDuration.toDb(null, simpleMultipleDuration)).toHaveLength(
      0
    )
    expect(
      await TypeDuration.toDb(null, nullableMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.toDb(null, nullableMultipleDuration)
    ).toHaveLength(1)

    expect(await TypeDuration.toDb('P0D', simpleDuration)).toBe('P0D')
    expect(await TypeDuration.toDb('P0D', nullableDuration)).toBe('P0D')
    expect(
      await TypeDuration.toDb('P0D', simpleMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(await TypeDuration.toDb('P0D', simpleMultipleDuration)).toHaveLength(
      1
    )
    expect((await TypeDuration.toDb('P0D', simpleMultipleDuration))?.[0]).toBe(
      'P0D'
    )
    expect(
      await TypeDuration.toDb('P0D', nullableMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.toDb('P0D', nullableMultipleDuration)
    ).toHaveLength(1)
    expect(
      (await TypeDuration.toDb('P0D', nullableMultipleDuration))?.[0]
    ).toBe('P0D')

    expect(
      await TypeDuration.toDb(['P0D'], simpleMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.toDb(['P0D'], simpleMultipleDuration)
    ).toHaveLength(1)
    expect(
      (await TypeDuration.toDb(['P0D'], simpleMultipleDuration))?.[0]
    ).toBe('P0D')
    expect(
      await TypeDuration.toDb(['P0D'], nullableMultipleDuration)
    ).toBeInstanceOf(Array)
    expect(
      await TypeDuration.toDb(['P0D'], nullableMultipleDuration)
    ).toHaveLength(1)
    expect(
      (await TypeDuration.toDb(['P0D'], nullableMultipleDuration))?.[0]
    ).toBe('P0D')
  })

  test('getValidationSchema', async () => {
    const ajv = new Ajv()
    addFormats(ajv)
    const nonNullableSchema = ajv.compile(
      TypeDuration.getValidationSchema(simpleDuration)
    )
    const nullableSchema = ajv.compile(
      TypeDuration.getValidationSchema(nullableDuration)
    )
    const multipleSchema = ajv.compile(
      TypeDuration.getValidationSchema({
        ...simpleMultipleDuration,
        minItems: 2,
        maxItems: 4
      })
    )

    expect(nonNullableSchema('P0D')).toBe(true)
    expect(nonNullableSchema('Not a duration')).toBe(false)
    expect(nonNullableSchema(null)).toBe(false)
    expect(nonNullableSchema(undefined)).toBe(false)
    expect(nullableSchema('P0D')).toBe(true)
    expect(nullableSchema(null)).toBe(true)
    expect(nullableSchema(undefined)).toBe(false)
    expect(multipleSchema(['P0D', 'P0D'])).toBe(true)
    expect(multipleSchema(['P0D'])).toBe(false)
    expect(multipleSchema(['P0D', 'P0D', 'P0D', 'P0D', 'P0D'])).toBe(false)
    expect(multipleSchema([null])).toBe(false)
  })

  test('getMongooseField', () => {
    const simpleField = TypeDuration.getMongooseField(simpleDuration)
    const nullableField = TypeDuration.getMongooseField(nullableDuration)
    const simpleMultipleField = TypeDuration.getMongooseField(
      simpleMultipleDuration
    )

    expect(simpleField.$type).toBe(String)
    expect(nullableField.$type).toBe(String)
    expect(simpleMultipleField?.[0]?.$type).toBe(String)
  })

  test('getMongooseIndex', () => {
    const simpleField = TypeDuration.getMongooseIndex('name', simpleDuration)
    const nullableField = TypeDuration.getMongooseIndex(
      'name',
      nullableDuration
    )
    const simpleMultipleField = TypeDuration.getMongooseIndex(
      'name',
      simpleMultipleDuration
    )

    expect(simpleField).toBe(null)
    expect(nullableField).toBe(null)
    expect(simpleMultipleField).toBe(null)
  })
})
