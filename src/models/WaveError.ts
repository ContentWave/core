import mongoose, { Connection } from 'mongoose'

export interface IWaveErrorContext {
  file: string
  line: number
  column: number
  fromLine: number
  toLine: number
  lines: string[]
}

export interface IWaveError {
  date: Date
  message: string
  stack: string
  type: string
  details?: { [key: string]: any }
  context: IWaveErrorContext
}

interface WaveErrorModel extends mongoose.Model<IWaveError, {}, {}> {}

const schema = new mongoose.Schema<IWaveError, WaveErrorModel, {}>({
  message: String,
  stack: String,
  type: String,
  details: {},
  context: {
    file: String,
    line: Number,
    column: Number,
    fromLine: Number,
    toLine: Number,
    lines: [String]
  }
})

export default function createWaveError (conn: Connection) {
  conn.model<IWaveError, WaveErrorModel>('WaveError', schema)
}
