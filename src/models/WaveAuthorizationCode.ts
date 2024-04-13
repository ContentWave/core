import mongoose, { Connection } from 'mongoose'

interface IWaveAuthorizationCode {
  code: string
  codeChallenge: string
  codeChallengeMethod: string
  redirectUri: string
  clientId: string
  expiresAt: Date
  user: mongoose.Types.ObjectId
}

interface WaveAuthorizationCodeModel
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
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'WaveUser' }
})

export default function createWaveAuthorizationCode (conn: Connection) {
  conn.model<IWaveAuthorizationCode, WaveAuthorizationCodeModel>(
    'WaveAuthorizationCode',
    schema
  )
}
