import path from 'path'
import { I18nString, PluginTypes } from '@contentwave/plugin'
import { Db } from './Db'
import { Config } from './Config'

interface IWavePlugin {
  name: I18nString
  description: I18nString
  instance: any
  configured: boolean
  types: PluginTypes[]
  version: string
  minVersionSupported: string
  maxVersionSupported: string
}

interface IWavePluginInList {
  key: string
  name: I18nString
  description: I18nString
  configured: boolean
  types: PluginTypes[]
  version: string
  minVersionSupported: string
  maxVersionSupported: string
}

type IWavePluginList = IWavePluginInList[]

let plugins: { [key: string]: IWavePlugin } = {}
let defaultPlugins: { [key: string]: string | null } = {
  email: null,
  sms: null,
  push: null,
  ai: null,
  fs: null,
  workflow: null,
  auth: null,
  geocode: null,
  i18n: null
}

/**
 * Handles ContentWave plugins
 */
export class Plugins {
  /**
   * Start the server, or restart it if there is already one instance running
   */
  static async init () {
    const packageJson = require(path.join(
      process.env.ROOT_DIR ?? '',
      'package.json'
    ))

    for (let dependency in packageJson?.dependencies) {
      if (dependency.substring(0, 21) !== '@contentwave-plugins/') continue
      const cls = require(dependency)
      await Plugins.load(dependency, cls)
    }

    // Handle defaults
    const def = Config.get('pluginDefaults') ?? {}
    for (let key in def) {
      defaultPlugins[key] = def[key]
    }
  }

  static async load (name: string, requiredCls: any) {
    const instance = new requiredCls()
    const conf = await Db.model('WavePlugin')?.findOne({ name })
    if (conf) await instance.setup(conf)
    const types = instance.getType()
    plugins[name] = {
      name: instance.getName(),
      description: instance.getDescription(),
      version: instance.getVersion(),
      maxVersionSupported: instance.getMaxVersionSupported(),
      minVersionSupported: instance.getMinVersionSupported(),
      instance,
      configured: !!conf,
      types: types instanceof Array ? types : [types]
    }
  }

  static getList (): IWavePluginList {
    return Object.entries(plugins).map(([key, conf]) => ({
      key,
      name: conf.name,
      description: conf.description,
      configured: conf.configured,
      types: conf.types,
      version: conf.version,
      minVersionSupported: conf.minVersionSupported,
      maxVersionSupported: conf.maxVersionSupported
    }))
  }

  static getDefaults () {
    return defaultPlugins
  }

  static async setDefault (type: string, plugin: string | null) {
    defaultPlugins[type] = plugin
    await Config.set('pluginDefaults', defaultPlugins)
  }

  static getInstance (type: string, force: string | null = null): any | null {
    let plugin = defaultPlugins[type]
    if (force) plugin = force
    if (plugin === null) return null
    return plugins[plugin]?.instance ?? null
  }
}
