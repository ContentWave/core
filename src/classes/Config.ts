import { Db } from './Db'

const cache: { [key: string]: any } = {}

export class Config {
  static async retrieveConfigFromDb () {
    const models = Db.model('WaveConfig')?.find({}) ?? []
    for await (const model of models) {
      cache[model.name] = model.data
    }
  }

  static get (name: string): any | null {
    return cache[name] ?? null
  }

  static async set (name: string, data: any) {
    cache[name] = data
    await Db.model('WaveConfig')?.updateOne(
      { name },
      { name, data },
      { upsert: true }
    )
  }

  static async delete (name: string) {
    if (cache[name] !== undefined) delete cache[name]
    await Db.model('WaveConfig')?.deleteOne({ name })
  }
}
