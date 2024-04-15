import { Model } from './Model'

describe('Search functions', () => {
  test('Keep', async () => {
    Model.saveSearchFunction(
      'test',
      `if ($data.foo === 'bar') $score += 20;
        $keep = true;`
    )
    const ret = await Model.runSearchFunction('test', { foo: 'bar' })
    expect(ret.keep).toBe(true)
    expect(ret.score).toBe(20)
  })
  test('Do not keep', async () => {
    Model.saveSearchFunction(
      'test',
      `if ($data.foo === 'bar') $score += 20;
        $keep = false;`
    )
    const ret = await Model.runSearchFunction('test', { foo: 'bar' })
    expect(ret.keep).toBe(false)
    expect(ret.score).toBe(0)
  })
})
