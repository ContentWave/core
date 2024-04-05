import { ITextOrmField } from '../IOrmConf'
import { TypeText } from './Text'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

describe('ORM: Text', () => {
  let simpleText: ITextOrmField = {
    type: 'text'
  }
  let defaultText: ITextOrmField = {
    type: 'text',
    default: 'foo'
  }
  let nullableText: ITextOrmField = {
    type: 'text',
    nullable: true
  }
  let simpleMultipleText: ITextOrmField = {
    type: 'text',
    multiple: true
  }
  let defaultMultipleText: ITextOrmField = {
    type: 'text',
    default: 'foo',
    multiple: true
  }
  let nullableMultipleText: ITextOrmField = {
    type: 'text',
    nullable: true,
    multiple: true
  }

  test('fromDb', async () => {
    expect(await TypeText.fromDb(undefined, simpleText)).toBe('')
    expect(await TypeText.fromDb(undefined, defaultText)).toBe('foo')
    expect(await TypeText.fromDb(undefined, nullableText)).toBe(null)
    expect(await TypeText.fromDb(undefined, simpleMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.fromDb(undefined, simpleMultipleText)).toHaveLength(0)
    expect(
      await TypeText.fromDb(undefined, defaultMultipleText)
    ).toBeInstanceOf(Array)
    expect(await TypeText.fromDb(undefined, defaultMultipleText)).toHaveLength(
      0
    )
    expect(
      await TypeText.fromDb(undefined, nullableMultipleText)
    ).toBeInstanceOf(Array)
    expect(await TypeText.fromDb(undefined, nullableMultipleText)).toHaveLength(
      0
    )

    expect(await TypeText.fromDb(null, simpleText)).toBe('')
    expect(await TypeText.fromDb(null, defaultText)).toBe('foo')
    expect(await TypeText.fromDb(null, nullableText)).toBe(null)
    expect(await TypeText.fromDb(null, simpleMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.fromDb(null, simpleMultipleText)).toHaveLength(0)
    expect(await TypeText.fromDb(null, defaultMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.fromDb(null, defaultMultipleText)).toHaveLength(0)
    expect(await TypeText.fromDb(null, nullableMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.fromDb(null, nullableMultipleText)).toHaveLength(1)

    expect(await TypeText.fromDb('pwet', simpleText)).toBe('pwet')
    expect(await TypeText.fromDb('pwet', defaultText)).toBe('pwet')
    expect(await TypeText.fromDb('pwet', nullableText)).toBe('pwet')
    expect(await TypeText.fromDb('pwet', simpleMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.fromDb('pwet', simpleMultipleText)).toHaveLength(1)
    expect((await TypeText.fromDb('pwet', simpleMultipleText))?.[0]).toBe(
      'pwet'
    )
    expect(await TypeText.fromDb('pwet', defaultMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.fromDb('pwet', defaultMultipleText)).toHaveLength(1)
    expect((await TypeText.fromDb('pwet', defaultMultipleText))?.[0]).toBe(
      'pwet'
    )
    expect(await TypeText.fromDb('pwet', nullableMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.fromDb('pwet', nullableMultipleText)).toHaveLength(1)
    expect((await TypeText.fromDb('pwet', nullableMultipleText))?.[0]).toBe(
      'pwet'
    )

    expect(await TypeText.fromDb(['pwet'], simpleMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.fromDb(['pwet'], simpleMultipleText)).toHaveLength(1)
    expect((await TypeText.fromDb(['pwet'], simpleMultipleText))?.[0]).toBe(
      'pwet'
    )
    expect(await TypeText.fromDb(['pwet'], defaultMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.fromDb(['pwet'], defaultMultipleText)).toHaveLength(1)
    expect((await TypeText.fromDb(['pwet'], defaultMultipleText))?.[0]).toBe(
      'pwet'
    )
    expect(
      await TypeText.fromDb(['pwet'], nullableMultipleText)
    ).toBeInstanceOf(Array)
    expect(await TypeText.fromDb(['pwet'], nullableMultipleText)).toHaveLength(
      1
    )
    expect((await TypeText.fromDb(['pwet'], nullableMultipleText))?.[0]).toBe(
      'pwet'
    )
  })

  test('toDb', async () => {
    expect(await TypeText.toDb(undefined, simpleText)).toBe('')
    expect(await TypeText.toDb(undefined, defaultText)).toBe('foo')
    expect(await TypeText.toDb(undefined, nullableText)).toBe(null)
    expect(await TypeText.toDb(undefined, simpleMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.toDb(undefined, simpleMultipleText)).toHaveLength(0)
    expect(await TypeText.toDb(undefined, defaultMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.toDb(undefined, defaultMultipleText)).toHaveLength(0)
    expect(await TypeText.toDb(undefined, nullableMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.toDb(undefined, nullableMultipleText)).toHaveLength(0)

    expect(await TypeText.toDb(null, simpleText)).toBe('')
    expect(await TypeText.toDb(null, defaultText)).toBe('foo')
    expect(await TypeText.toDb(null, nullableText)).toBe(null)
    expect(await TypeText.toDb(null, simpleMultipleText)).toBeInstanceOf(Array)
    expect(await TypeText.toDb(null, simpleMultipleText)).toHaveLength(0)
    expect(await TypeText.toDb(null, defaultMultipleText)).toBeInstanceOf(Array)
    expect(await TypeText.toDb(null, defaultMultipleText)).toHaveLength(0)
    expect(await TypeText.toDb(null, nullableMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.toDb(null, nullableMultipleText)).toHaveLength(1)

    expect(await TypeText.toDb('pwet', simpleText)).toBe('pwet')
    expect(await TypeText.toDb('pwet', defaultText)).toBe('pwet')
    expect(await TypeText.toDb('pwet', nullableText)).toBe('pwet')
    expect(await TypeText.toDb('pwet', simpleMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.toDb('pwet', simpleMultipleText)).toHaveLength(1)
    expect((await TypeText.toDb('pwet', simpleMultipleText))?.[0]).toBe('pwet')
    expect(await TypeText.toDb('pwet', defaultMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.toDb('pwet', defaultMultipleText)).toHaveLength(1)
    expect((await TypeText.toDb('pwet', defaultMultipleText))?.[0]).toBe('pwet')
    expect(await TypeText.toDb('pwet', nullableMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.toDb('pwet', nullableMultipleText)).toHaveLength(1)
    expect((await TypeText.toDb('pwet', nullableMultipleText))?.[0]).toBe(
      'pwet'
    )

    expect(await TypeText.toDb(['pwet'], simpleMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.toDb(['pwet'], simpleMultipleText)).toHaveLength(1)
    expect((await TypeText.toDb(['pwet'], simpleMultipleText))?.[0]).toBe(
      'pwet'
    )
    expect(await TypeText.toDb(['pwet'], defaultMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.toDb(['pwet'], defaultMultipleText)).toHaveLength(1)
    expect((await TypeText.toDb(['pwet'], defaultMultipleText))?.[0]).toBe(
      'pwet'
    )
    expect(await TypeText.toDb(['pwet'], nullableMultipleText)).toBeInstanceOf(
      Array
    )
    expect(await TypeText.toDb(['pwet'], nullableMultipleText)).toHaveLength(1)
    expect((await TypeText.toDb(['pwet'], nullableMultipleText))?.[0]).toBe(
      'pwet'
    )
  })

  test('getValidationSchema', async () => {
    const ajv = new Ajv()
    addFormats(ajv)
    const nonNullableSchema = ajv.compile(
      TypeText.getValidationSchema(simpleText)
    )
    const nullableSchema = ajv.compile(
      TypeText.getValidationSchema(nullableText)
    )
    const multipleSchema = ajv.compile(
      TypeText.getValidationSchema({
        ...simpleMultipleText,
        minItems: 2,
        maxItems: 4
      })
    )
    const patternSchema = ajv.compile(
      TypeText.getValidationSchema({
        type: 'text',
        regex: '^[0-9]+$'
      })
    )
    const minLengthSchema = ajv.compile(
      TypeText.getValidationSchema({
        type: 'text',
        minLength: 10
      })
    )
    const maxLengthSchema = ajv.compile(
      TypeText.getValidationSchema({
        type: 'text',
        maxLength: 10
      })
    )

    expect(nonNullableSchema('ok')).toBe(true)
    expect(nonNullableSchema(null)).toBe(false)
    expect(nonNullableSchema(undefined)).toBe(false)
    expect(nullableSchema('ok')).toBe(true)
    expect(nullableSchema(null)).toBe(true)
    expect(nullableSchema(undefined)).toBe(false)
    expect(multipleSchema(['test', 'test2'])).toBe(true)
    expect(multipleSchema(['test'])).toBe(false)
    expect(multipleSchema(['test', 'test', 'test', 'test', 'test'])).toBe(false)
    expect(multipleSchema([null])).toBe(false)
    expect(patternSchema('42')).toBe(true)
    expect(patternSchema('not ok')).toBe(false)
    expect(minLengthSchema('0123456789')).toBe(true)
    expect(minLengthSchema('not ok')).toBe(false)
    expect(maxLengthSchema('0123456789')).toBe(true)
    expect(maxLengthSchema('this phrase is very not ok')).toBe(false)
  })

  test('getMongooseField', () => {
    const simpleField = TypeText.getMongooseField(simpleText)
    const nullableField = TypeText.getMongooseField(nullableText)
    const simpleMultipleField = TypeText.getMongooseField(simpleMultipleText)
    const defaultField = TypeText.getMongooseField(defaultText)

    expect(simpleField.$type).toBe(String)
    expect(nullableField.$type).toBe(String)
    expect(simpleMultipleField?.[0]?.$type).toBe(String)
    expect(defaultField.$type).toBe(String)
    expect(defaultField.default).toBeDefined()
  })

  test('getMongooseIndex', () => {
    const simpleField = TypeText.getMongooseIndex('name', simpleText)
    const nullableField = TypeText.getMongooseIndex('name', nullableText)
    const simpleMultipleField = TypeText.getMongooseIndex(
      'name',
      simpleMultipleText
    )
    const defaultField = TypeText.getMongooseIndex('name', defaultText)

    expect(simpleField).toBe(null)
    expect(nullableField).toBe(null)
    expect(simpleMultipleField).toBe(null)
    expect(defaultField).toBe(null)
  })
})
