import { getWaveConfigModel } from '../models/WaveConfig'
import { Config } from './Config'
import { Db } from './Db'

describe('Config', () => {
  beforeAll(async () => {
    await Db.init()
    await getWaveConfigModel().insertMany([
      {
        name: 'foo',
        data: 'bar'
      },
      {
        name: 'test',
        data: { foo: 'bar' }
      },
      {
        name: 'answer',
        data: 42
      }
    ])
    await Config.retrieveConfigFromDb()
  })

  afterAll(async () => {
    await Db.close()
  })

  test('Loads existing config', async () => {
    const conf = Config.get('foo')
    expect(conf).toBe('bar')
    const confObj = Config.get('test')
    expect(confObj?.foo).toBe('bar')
    const confInt = Config.get('answer')
    expect(confInt).toBe(42)
    const confNonExistant = Config.get('pwet')
    expect(confNonExistant).toBeNull()
  })

  test('Set config', async () => {
    const conf = Config.get('newOne')
    expect(conf).toBeNull()
    await Config.set('newOne', 'brah')
    const conf2 = Config.get('newOne')
    expect(conf2).toBe('brah')
  })

  test('Delete config', async () => {
    const conf = Config.get('foo')
    expect(conf).toBe('bar')
    await Config.delete('foo')
    const conf2 = Config.get('foo')
    expect(conf2).toBeNull()
  })
})
