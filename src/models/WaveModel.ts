import mongoose, { Connection, Document } from 'mongoose'
import { IOrmConf } from '../interfaces/IOrmConf'
import { Db } from '../classes/Db'

export interface IWaveModelAuthorization {
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

export interface IWaveModelSearch {
  enabled: boolean
  method: 'regex' | 'memory' | 'rag'
  fields: string[]
}

export interface IWaveModel extends Document {
  name: string
  conf: IOrmConf
  relations: IWaveModelRelation[]
  authorizations: IWaveModelAuthorizations
  search: IWaveModelSearch
  cached: boolean
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
  },
  search: {
    enabled: { type: Boolean, default: false },
    method: { type: String, enum: ['regex', 'memory', 'rag'] },
    fields: [String]
  },
  cached: { type: Boolean, default: false }
})

export default function createWaveModel (conn: Connection) {
  conn.model<IWaveModel, WaveModelModel>('WaveModel', schema)
}

export const getWaveModelModel = function () {
  return Db.instance.model<IWaveModel, WaveModelModel>('WaveModel')
}
