import mongoose, { Connection, Document } from 'mongoose'
import { Db } from '../classes/Db'

export interface IWaveErrorContext extends Document {
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
  footprint: string
}

interface WaveErrorModel extends mongoose.Model<IWaveError, {}, {}> {}

const schema = new mongoose.Schema<IWaveError, WaveErrorModel, {}>({
  footprint: String,
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

export const getWaveErrorModel = function () {
  return Db.instance.model<IWaveError, WaveErrorModel>('WaveError')
}
