import mongoose, { Connection, Document } from 'mongoose'
import { Db } from '../classes/Db'

export interface IWaveKey extends Document {
  user: mongoose.Types.ObjectId
  name: string
  secret: string
  lastUsed: Date
  domains: string[]
}

export interface WaveKeyModel extends mongoose.Model<IWaveKey, {}, {}> {}

const schema = new mongoose.Schema<IWaveKey, WaveKeyModel, {}>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'WaveUser' },
  name: String,
  secret: String,
  lastUsed: Date,
  domains: [String]
})

export default function createWaveKey (conn: Connection) {
  conn.model<IWaveKey, WaveKeyModel>('WaveKey', schema)
}

export const getWaveKeyModel = function () {
  return Db.instance.model<IWaveKey, WaveKeyModel>('WaveKey')
}
