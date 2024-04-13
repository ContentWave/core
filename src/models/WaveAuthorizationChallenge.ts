import mongoose, { Connection } from 'mongoose'

interface IWaveAuthorizationChallenge {
  redirectUri: string
  expiresAt: Date
  codeChallenge: string
  codeChallengeMethod: string
  clientId: string
}

interface WaveAuthorizationChallengeModel
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
