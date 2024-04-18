import { randomUUID } from 'crypto'
import { getWaveConfigModel } from '../models/WaveConfig'

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
        i18n: null,
        payments: null
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
      roles: ['$admin', '$developer', '$anonymous', '$owner', '$loggedIn'],
      everyoneCanCreateKeys: false,
      title: 'ContentWave',
      description: 'The best start for your headless projects',
      logo: '',
      logoBackground: '',
      logoSize: 'contain',
      color: '#FF6F47',
      languages: ['en'],
      fileUploadLimit: 5242880,
      jwtKey: randomUUID(),
      auth: {
        password: true,
        fido2: true,
        totp: true,
        magicLink: true,
        oneTimeCode: false,
        invite: false,
        validation: false,
        register: true,
        defaultRedirectUrl: ''
      }
    }
  }

  static async retrieveConfigFromDb () {
    const configs: any = getWaveConfigModel().find({}) ?? []
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
    await getWaveConfigModel().updateOne(
      { name },
      { name, data },
      { upsert: true }
    )
  }

  static async delete (name: string) {
    if (cache[name] !== undefined) delete cache[name]
    await getWaveConfigModel().deleteOne({ name })
  }
}
