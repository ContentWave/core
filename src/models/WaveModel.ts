import mongoose, { Connection } from 'mongoose'
import { IOrmConf } from '../interfaces/IOrmConf'

interface IWaveModelAuthorization {
  allow: boolean
  roles: string[]
}

export interface IWaveModelAuthorizations {
  enabled: boolean
  read: IWaveModelAuthorization
  write: IWaveModelAuthorization
}

export interface IWaveModelRelation {
  name: string
  model: string
  field: string
}

interface IWaveModel {
  name: string
  conf: IOrmConf
  relations: IWaveModelRelation[]
  authorizations: IWaveModelAuthorizations
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
  ],
  authorizations: {
    enabled: Boolean,
    read: {
      allow: Boolean,
      roles: [String]
    },
    write: {
      allow: Boolean,
      roles: [String]
    }
  }
})

export default function createWaveModel (conn: Connection) {
  conn.model<IWaveModel, WaveModelModel>('WaveModel', schema)
}
