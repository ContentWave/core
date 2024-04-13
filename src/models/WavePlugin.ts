import mongoose, { Connection } from 'mongoose'

interface IWavePlugin {
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
