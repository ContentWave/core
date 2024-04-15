import mongoose, { Connection, Document } from 'mongoose'
import { Db } from '../classes/Db'
import { IWaveUser } from './WaveUser'

export interface IWaveAuthorizationChallenge extends Document {
  redirectUri: string
  expiresAt: Date
  codeChallenge: string
  codeChallengeMethod: string
  clientId: string
  authorized: boolean
  readyToRedirect: boolean
  needsTotp: boolean
  needsValidation: boolean
  needsOneTimeCode: boolean
  oneTimeCode: string
  user: mongoose.Types.ObjectId | IWaveUser
  magicLinks: string[]
}

export interface WaveAuthorizationChallengeModel
  extends mongoose.Model<IWaveAuthorizationChallenge, {}, {}> {}

const schema = new mongoose.Schema<
  IWaveAuthorizationChallenge,
  WaveAuthorizationChallengeModel,
  {}
>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'WaveUser' },
  redirectUri: String,
  expiresAt: Date,
  codeChallenge: String,
  codeChallengeMethod: String,
  clientId: String,
  authorized: Boolean,
  readyToRedirect: Boolean,
  needsTotp: Boolean,
  needsValidation: Boolean,
  needsOneTimeCode: Boolean,
  oneTimeCode: String,
  magicLinks: [String]
})

export default function createWaveAuthorizationChallenge (conn: Connection) {
  conn.model<IWaveAuthorizationChallenge, WaveAuthorizationChallengeModel>(
    'WaveAuthorizationChallenge',
    schema
  )
}

export const getWaveAuthorizationChallengeModel = function () {
  return Db.instance.model<
    IWaveAuthorizationChallenge,
    WaveAuthorizationChallengeModel
  >('WaveAuthorizationChallenge')
}
