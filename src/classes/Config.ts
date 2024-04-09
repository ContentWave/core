import { Db } from './Db'

const cache: { [key: string]: any } = {}

export class Config {
  static getDefaults () {
    return {
      handleErrors: true,
      pluginDefaults: {
        email: null,
        sms: null,
        push: null,
        aitext: null,
        aiimage: null,
        error: null,
        fs: null,
        workflow: null,
        auth: null,
        geocode: null,
        i18n: null
      },
      uploadAllowedMimes: [
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp',
        'image/png',
        'image/heic',
        'application/pdf'
      ],
      roles: ['$admin', '$developer', '$anonymous', '$owner']
    }
  }

  static async retrieveConfigFromDb () {
    const configs = Db.model('WaveConfig')?.find({}) ?? []
    for await (const config of configs) {
      cache[config.name] = config.data
    }
    const defaults: any = Config.getDefaults()
    for (let key in defaults) {
      if (cache[key] === undefined) await Config.set(key, defaults[key])
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
