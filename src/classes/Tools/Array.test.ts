import { ensureArray } from './Array'

test('ensureArray creates an array each time', () => {
  expect(ensureArray(undefined)).toBeInstanceOf(Array)
  expect(ensureArray(undefined)).toHaveLength(0)
  expect(ensureArray(null)).toBeInstanceOf(Array)
  expect(ensureArray(null)).toHaveLength(1)
  expect(ensureArray(null)).toContain(null)
  expect(ensureArray('null')).toBeInstanceOf(Array)
  expect(ensureArray('null')).toHaveLength(1)
  expect(ensureArray('null')).toContain('null')
  expect(ensureArray({ foo: 'bar' })).toBeInstanceOf(Array)
  expect(ensureArray({ foo: 'bar' })).toHaveLength(1)
})
