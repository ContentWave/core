import mongoose, { Connection, Document } from 'mongoose'
import { Db } from '../classes/Db'

interface IWaveRequest extends Document {
  controller: string
  method: string
  duration: number
  error: boolean
  date: Date
}

interface WaveRequestModel extends mongoose.Model<IWaveRequest, {}, {}> {}

const schema = new mongoose.Schema<IWaveRequest, WaveRequestModel, {}>({
  controller: {
    $type: String
  },
  method: {
    $type: String
  },
  duration: {
    $type: Number
  },
  error: {
    $type: Boolean
  },
  date: {
    $type: Date
  }
})

export default function createWaveRequest (conn: Connection) {
  conn.model<IWaveRequest, WaveRequestModel>('WaveRequest', schema)
}

export const getWaveRequestModel = function () {
  return Db.instance.model<IWaveRequest, WaveRequestModel>('WaveRequest')
}
