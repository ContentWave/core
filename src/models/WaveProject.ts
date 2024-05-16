import mongoose, { Connection, Document } from 'mongoose'
import { Db } from '../classes/Db'

export interface IWaveProject extends Document {
  name: string
  key: string
}

interface WaveProjectModel extends mongoose.Model<IWaveProject, {}, {}> {}

const schema = new mongoose.Schema<IWaveProject, WaveProjectModel, {}>({
  name: String,
  key: { type: String, unique: true }
})

export default function createWaveProject (conn: Connection) {
  conn.model<IWaveProject, WaveProjectModel>('WaveProject', schema)
}

export const getWaveProjectModel = function () {
  return Db.instance.model<IWaveProject, WaveProjectModel>('WaveProject')
}
