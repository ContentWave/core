import mongoose, { Connection, Document } from 'mongoose'
import { Db } from '../classes/Db'

export interface IWaveAuthorizationCode extends Document {
  code: string
  codeChallenge: string
  codeChallengeMethod: string
  redirectUri: string
  clientId: string
  expiresAt: Date
  state: string
  scope: string
  user: mongoose.Types.ObjectId
}

export interface WaveAuthorizationCodeModel
  extends mongoose.Model<IWaveAuthorizationCode, {}, {}> {}

const schema = new mongoose.Schema<
  IWaveAuthorizationCode,
  WaveAuthorizationCodeModel,
  {}
>({
  code: { type: String, index: true },
  expiresAt: Date,
  codeChallenge: String,
  codeChallengeMethod: String,
  redirectUri: String,
  clientId: String,
  state: String,
  scope: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'WaveUser' }
})

export default function createWaveAuthorizationCode (conn: Connection) {
  conn.model<IWaveAuthorizationCode, WaveAuthorizationCodeModel>(
    'WaveAuthorizationCode',
    schema
  )
}

export const getWaveAuthorizationCodeModel = function () {
  return Db.instance.model<IWaveAuthorizationCode, WaveAuthorizationCodeModel>(
    'WaveAuthorizationCode'
  )
}
