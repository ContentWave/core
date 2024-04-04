import mongoose, { Connection } from 'mongoose'

interface IWaveConfig {
  name: string
  data: any
}

interface WaveConfigModel extends mongoose.Model<IWaveConfig, {}, {}> {}

const schema = new mongoose.Schema<IWaveConfig, WaveConfigModel, {}>({
  name: {
    type: String,
    unique: true
  },
  data: {}
})

export default function createWaveConfig (conn: Connection) {
  conn.model<IWaveConfig, WaveConfigModel>('WaveConfig', schema)
}
