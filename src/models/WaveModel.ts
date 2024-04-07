import mongoose, { Connection } from 'mongoose'
import { IOrmConf } from '../classes/Orm/IOrmConf'

export interface IWaveModelRelation {
  name: string
  model: string
  field: string
}

interface IWaveModel {
  name: string
  conf: IOrmConf
  relations: IWaveModelRelation[]
}

interface WaveModelModel extends mongoose.Model<IWaveModel, {}, {}> {}

const schema = new mongoose.Schema<IWaveModel, WaveModelModel, {}>({
  name: {
    type: String,
    unique: true
  },
  conf: {},
  relations: [
    {
      name: String,
      model: String,
      field: String
    }
  ]
})

export default function createWaveModel (conn: Connection) {
  conn.model<IWaveModel, WaveModelModel>('WaveModel', schema)
}
