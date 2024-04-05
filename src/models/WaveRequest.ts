import mongoose, { Connection } from 'mongoose'

interface IWaveRequest {
  controller: string
  method: string
  duration: number
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
  date: {
    $type: Date
  }
})

export default function createWaveRequest (conn: Connection) {
  conn.model<IWaveRequest, WaveRequestModel>('WaveRequest', schema)
}
