import mongoose, { Connection, Document } from 'mongoose'
import { Db } from '../classes/Db'

export interface IWaveAuthorizationChallenge extends Document {
  redirectUri: string
  expiresAt: Date
  codeChallenge: string
  codeChallengeMethod: string
  clientId: string
}

export interface WaveAuthorizationChallengeModel
  extends mongoose.Model<IWaveAuthorizationChallenge, {}, {}> {}

const schema = new mongoose.Schema<
  IWaveAuthorizationChallenge,
  WaveAuthorizationChallengeModel,
  {}
>({
  redirectUri: String,
  expiresAt: Date,
  codeChallenge: String,
  codeChallengeMethod: String,
  clientId: String
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
