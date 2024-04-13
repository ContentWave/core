import mongoose, { Connection, Document } from 'mongoose'
import { Db } from '../classes/Db'

interface IWaveConfig extends Document {
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

export const getWaveConfigModel = function () {
  return Db.instance.model<IWaveConfig, WaveConfigModel>('WaveConfig')
}
