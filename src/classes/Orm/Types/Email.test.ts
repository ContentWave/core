import { IEmailOrmField } from '../../../interfaces/IOrmConf'
import { TypeEmail } from './Email'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

describe('ORM: Email', () => {
  let simpleEmail: IEmailOrmField = {
    type: 'email'
  }
  let nullableEmail: IEmailOrmField = {
    type: 'email',
    nullable: true
  }
  let simpleMultipleEmail: IEmailOrmField = {
    type: 'email',
    multiple: true
  }
  let nullableMultipleEmail: IEmailOrmField = {
    type: 'email',
    nullable: true,
    multiple: true
  }

  test('fromDb', async () => {
    expect(await TypeEmail.fromDb(undefined, simpleEmail)).toBe(null)
    expect(await TypeEmail.fromDb(undefined, nullableEmail)).toBe(null)
    expect(
      await TypeEmail.fromDb(undefined, simpleMultipleEmail)
    ).toBeInstanceOf(Array)
    expect(await TypeEmail.fromDb(undefined, simpleMultipleEmail)).toHaveLength(
      0
    )
    expect(
      await TypeEmail.fromDb(undefined, nullableMultipleEmail)
    ).toBeInstanceOf(Array)
    expect(
      await TypeEmail.fromDb(undefined, nullableMultipleEmail)
    ).toHaveLength(0)

    expect(await TypeEmail.fromDb(null, simpleEmail)).toBe(null)
    expect(await TypeEmail.fromDb(null, nullableEmail)).toBe(null)
    expect(await TypeEmail.fromDb(null, simpleMultipleEmail)).toBeInstanceOf(
      Array
    )
    expect(await TypeEmail.fromDb(null, simpleMultipleEmail)).toHaveLength(0)
    expect(await TypeEmail.fromDb(null, nullableMultipleEmail)).toBeInstanceOf(
      Array
    )
    expect(await TypeEmail.fromDb(null, nullableMultipleEmail)).toHaveLength(1)

    expect(await TypeEmail.fromDb('test@test.com', simpleEmail)).toBe(
      'test@test.com'
    )
    expect(await TypeEmail.fromDb('test@test.com', nullableEmail)).toBe(
      'test@test.com'
    )
    expect(
      await TypeEmail.fromDb('test@test.com', simpleMultipleEmail)
    ).toBeInstanceOf(Array)
    expect(
      await TypeEmail.fromDb('test@test.com', simpleMultipleEmail)
    ).toHaveLength(1)
    expect(
      (await TypeEmail.fromDb('test@test.com', simpleMultipleEmail))?.[0]
    ).toBe('test@test.com')
    expect(
      await TypeEmail.fromDb('test@test.com', nullableMultipleEmail)
    ).toBeInstanceOf(Array)
    expect(
      await TypeEmail.fromDb('test@test.com', nullableMultipleEmail)
    ).toHaveLength(1)
    expect(
      (await TypeEmail.fromDb('test@test.com', nullableMultipleEmail))?.[0]
    ).toBe('test@test.com')

    expect(
      await TypeEmail.fromDb(['test@test.com'], simpleMultipleEmail)
    ).toBeInstanceOf(Array)
    expect(
      await TypeEmail.fromDb(['test@test.com'], simpleMultipleEmail)
    ).toHaveLength(1)
    expect(
      (await TypeEmail.fromDb(['test@test.com'], simpleMultipleEmail))?.[0]
    ).toBe('test@test.com')
    expect(
      await TypeEmail.fromDb(['test@test.com'], nullableMultipleEmail)
    ).toBeInstanceOf(Array)
    expect(
      await TypeEmail.fromDb(['test@test.com'], nullableMultipleEmail)
    ).toHaveLength(1)
    expect(
      (await TypeEmail.fromDb(['test@test.com'], nullableMultipleEmail))?.[0]
    ).toBe('test@test.com')
  })

  test('toDb', async () => {
    expect(await TypeEmail.toDb(undefined, simpleEmail)).toBe(null)
    expect(await TypeEmail.toDb(undefined, nullableEmail)).toBe(null)
    expect(await TypeEmail.toDb(undefined, simpleMultipleEmail)).toBeInstanceOf(
      Array
    )
    expect(await TypeEmail.toDb(undefined, simpleMultipleEmail)).toHaveLength(0)
    expect(
      await TypeEmail.toDb(undefined, nullableMultipleEmail)
    ).toBeInstanceOf(Array)
    expect(await TypeEmail.toDb(undefined, nullableMultipleEmail)).toHaveLength(
      0
    )

    expect(await TypeEmail.toDb(null, simpleEmail)).toBe(null)
    expect(await TypeEmail.toDb(null, nullableEmail)).toBe(null)
    expect(await TypeEmail.toDb(null, simpleMultipleEmail)).toBeInstanceOf(
      Array
    )
    expect(await TypeEmail.toDb(null, simpleMultipleEmail)).toHaveLength(0)
    expect(await TypeEmail.toDb(null, nullableMultipleEmail)).toBeInstanceOf(
      Array
    )
    expect(await TypeEmail.toDb(null, nullableMultipleEmail)).toHaveLength(1)

    expect(await TypeEmail.toDb('test@test.com', simpleEmail)).toBe(
      'test@test.com'
    )
    expect(await TypeEmail.toDb('test@test.com', nullableEmail)).toBe(
      'test@test.com'
    )
    expect(
      await TypeEmail.toDb('test@test.com', simpleMultipleEmail)
    ).toBeInstanceOf(Array)
    expect(
      await TypeEmail.toDb('test@test.com', simpleMultipleEmail)
    ).toHaveLength(1)
    expect(
      (await TypeEmail.toDb('test@test.com', simpleMultipleEmail))?.[0]
    ).toBe('test@test.com')
    expect(
      await TypeEmail.toDb('test@test.com', nullableMultipleEmail)
    ).toBeInstanceOf(Array)
    expect(
      await TypeEmail.toDb('test@test.com', nullableMultipleEmail)
    ).toHaveLength(1)
    expect(
      (await TypeEmail.toDb('test@test.com', nullableMultipleEmail))?.[0]
    ).toBe('test@test.com')

    expect(
      await TypeEmail.toDb(['test@test.com'], simpleMultipleEmail)
    ).toBeInstanceOf(Array)
    expect(
      await TypeEmail.toDb(['test@test.com'], simpleMultipleEmail)
    ).toHaveLength(1)
    expect(
      (await TypeEmail.toDb(['test@test.com'], simpleMultipleEmail))?.[0]
    ).toBe('test@test.com')
    expect(
      await TypeEmail.toDb(['test@test.com'], nullableMultipleEmail)
    ).toBeInstanceOf(Array)
    expect(
      await TypeEmail.toDb(['test@test.com'], nullableMultipleEmail)
    ).toHaveLength(1)
    expect(
      (await TypeEmail.toDb(['test@test.com'], nullableMultipleEmail))?.[0]
    ).toBe('test@test.com')
  })

  test('getValidationSchema', async () => {
    const ajv = new Ajv()
    addFormats(ajv)
    const nonNullableSchema = ajv.compile(
      TypeEmail.getValidationSchema(simpleEmail)
    )
    const nullableSchema = ajv.compile(
      TypeEmail.getValidationSchema(nullableEmail)
    )
    const multipleSchema = ajv.compile(
      TypeEmail.getValidationSchema({
        ...simpleMultipleEmail,
        minItems: 2,
        maxItems: 4
      })
    )

    expect(nonNullableSchema('test@test.com')).toBe(true)
    expect(nonNullableSchema('test')).toBe(false)
    expect(nonNullableSchema(null)).toBe(false)
    expect(nonNullableSchema(undefined)).toBe(false)
    expect(nullableSchema('test@test.com')).toBe(true)
    expect(nullableSchema(null)).toBe(true)
    expect(nullableSchema(undefined)).toBe(false)
    expect(multipleSchema(['test@test.com', 'test@test.com'])).toBe(true)
    expect(multipleSchema(['test@test.com'])).toBe(false)
    expect(
      multipleSchema([
        'test@test.com',
        'test@test.com',
        'test@test.com',
        'test@test.com',
        'test@test.com'
      ])
    ).toBe(false)
    expect(multipleSchema([null])).toBe(false)
  })

  test('getMongooseField', () => {
    const simpleField = TypeEmail.getMongooseField(simpleEmail)
    const nullableField = TypeEmail.getMongooseField(nullableEmail)
    const simpleMultipleField = TypeEmail.getMongooseField(simpleMultipleEmail)

    expect(simpleField.$type).toBe(String)
    expect(nullableField.$type).toBe(String)
    expect(simpleMultipleField?.[0]?.$type).toBe(String)
  })

  test('getMongooseIndex', () => {
    const simpleField = TypeEmail.getMongooseIndex('name', simpleEmail)
    const nullableField = TypeEmail.getMongooseIndex('name', nullableEmail)
    const simpleMultipleField = TypeEmail.getMongooseIndex(
      'name',
      simpleMultipleEmail
    )

    expect(simpleField).toBe(null)
    expect(nullableField).toBe(null)
    expect(simpleMultipleField).toBe(null)
  })
})
