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
      logo: 'data:image/png;base64,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',
      logoBackground: '#fe6f47',
      logoSize: 'cover',
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
        defaultRedirectUrl: '',
        passkey: true
      },
      serverNeedsRestart: false
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
