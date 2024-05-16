import mongoose, { Connection, Document } from 'mongoose'
import { Db } from '../classes/Db'

interface IWavePlugin extends Document {
  name: string
  enabled: boolean
  version: string
  conf: any
}

interface WavePluginModel extends mongoose.Model<IWavePlugin, {}, {}> {}

const schema = new mongoose.Schema<IWavePlugin, WavePluginModel, {}>({
  name: String,
  enabled: { type: Boolean, default: true },
  version: String,
  conf: {}
})

export default function createWavePlugin (conn: Connection) {
  conn.model<IWavePlugin, WavePluginModel>('WavePlugin', schema)
}

export const getWavePluginModel = function () {
  return Db.instance.model<IWavePlugin, WavePluginModel>('WavePlugin')
}
