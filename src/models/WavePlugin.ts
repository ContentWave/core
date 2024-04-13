import mongoose, { Connection, Document } from 'mongoose'
import { Db } from '../classes/Db'

interface IWavePlugin extends Document {
  name: string
  enabled: boolean
  conf: any
}

interface WavePluginModel extends mongoose.Model<IWavePlugin, {}, {}> {}

const schema = new mongoose.Schema<IWavePlugin, WavePluginModel, {}>({
  name: {
    type: String,
    unique: true
  },
  enabled: { type: Boolean, default: true },
  conf: {}
})

export default function createWavePlugin (conn: Connection) {
  conn.model<IWavePlugin, WavePluginModel>('WavePlugin', schema)
}

export const getWavePluginModel = function () {
  return Db.instance.model<IWavePlugin, WavePluginModel>('WavePlugin')
}
