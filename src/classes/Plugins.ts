import path from 'path'
import { I18nString, PluginType } from '@contentwave/plugin'
import { Config } from './Config'
import { getWavePluginModel } from '../models/WavePlugin'

interface IWavePlugin {
  name: I18nString
  description: I18nString
  instance: any
  configured: boolean
  enabled: boolean
  types: PluginType[]
  version: string
}

interface IWavePluginInList {
  key: string
  name: I18nString
  description: I18nString
  configured: boolean
  enabled: boolean
  types: PluginType[]
  version: string
}

type IWavePluginList = IWavePluginInList[]

let plugins: { [key: string]: IWavePlugin } = {}
let defaultPlugins: { [key: string]: string | null } = {
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
}

//let contentWaveVersion: string

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

    //contentWaveVersion = packageJson.version ?? '0.0.0'

    for (let dependency in packageJson?.dependencies) {
      if (dependency.substring(0, 21) !== '@contentwave-plugins/') continue
      const cls = require(dependency)
      await Plugins.load(dependency.substring(21), cls)
    }

    // Handle defaults
    const def = Config.get('pluginDefaults') ?? {}
    for (let key in def) {
      defaultPlugins[key] = def[key]
    }
  }

  static async load (name: string, requiredCls: any) {
    const instance = new requiredCls()
    const conf = await getWavePluginModel().findOne({ name })
    if (conf) await instance.setup(conf)
    const types = instance.getType()
    plugins[name] = {
      name: instance.getName(),
      description: instance.getDescription(),
      version: instance.getVersion(),
      enabled: conf?.enabled ?? false,
      instance,
      configured: !!conf,
      types: types instanceof Array ? types : [types]
    }
  }

  static getList (type: PluginType | null = null): IWavePluginList {
    return Object.entries(plugins)
      .map(([key, conf]) => ({
        key,
        name: conf.name,
        description: conf.description,
        configured: conf.configured,
        types: conf.types,
        version: conf.version,
        enabled: conf.enabled
      }))
      .filter(item => type === null || item.types.includes(type))
  }

  static getDefaults () {
    return defaultPlugins
  }

  static async setDefault (type: PluginType, plugin: string | null) {
    defaultPlugins[type] = plugin
    await Config.set('pluginDefaults', defaultPlugins)
  }

  static getInstance (
    type: PluginType,
    force: string | null = null
  ): any | null {
    let plugin = defaultPlugins[type]
    if (force) plugin = force
    if (plugin === null) return null
    return plugins[plugin]?.instance ?? null
  }
}
