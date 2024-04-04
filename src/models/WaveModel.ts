import mongoose, { Connection } from 'mongoose'
import { IOrmConf } from '../classes/Orm/IOrmConf'

interface IWaveModel {
  name: string
  conf: IOrmConf
}

interface WaveModelModel extends mongoose.Model<IWaveModel, {}, {}> {}

const schema = new mongoose.Schema<IWaveModel, WaveModelModel, {}>({
  name: {
    type: String,
    unique: true
  },
  conf: {}
})

export default function createWaveModel (conn: Connection) {
  conn.model<IWaveModel, WaveModelModel>('WaveModel', schema)
}
