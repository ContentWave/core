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
  method:
    | 'regex'
    | 'atlassearch'
    | 'memory'
    | 'atlasvectorsearch'
    | 'rag'
    | 'js'
  fields: string[]
  js?: string
}

export interface IWaveModel extends Document {
  name: string
  conf: IOrmConf
  relations: IWaveModelRelation[]
  authorizations: IWaveModelAuthorizations
  search: IWaveModelSearch
  cached: boolean
  nameField: string
  listFields: string[]
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
    method: {
      type: String,
      enum: ['regex', 'atlassearch', 'memory', 'atlasvectorsearch', 'rag', 'js']
      /**
       * regex: search in mongodb with a regex (or locally if collection is cached)
       * memory: search in memory with flexsearch (https://github.com/nextapps-de/flexsearch)
       * rag: search in memory with RAG (https://github.com/Stevenic/vectra?tab=readme-ov-file) (needs an AI plugin enabled)
       * atlassearch: search in mongodb with Atlas Search ($search aggregation pipeline stage)
       * atlasvectorsearch: search in mongodb with Atlas Vector Search ($vectorSearch aggregation pipeline stage) (needs an AI plugin enabled)
       * js: run user provided JS script to filter and ponderate search results
       */
    },
    fields: [String],
    js: String
  },
  cached: { type: Boolean, default: false },
  nameField: String,
  listFields: [String]
})

export default function createWaveModel (conn: Connection) {
  conn.model<IWaveModel, WaveModelModel>('WaveModel', schema)
}

export const getWaveModelModel = function () {
  return Db.instance.model<IWaveModel, WaveModelModel>('WaveModel')
}
