import mongoose, { Connection } from 'mongoose'
import jwt from 'jsonwebtoken'
import { Config } from '../classes/Config'

export interface IWaveSession {
  user: mongoose.Types.ObjectId
  refreshToken: string
  browserName: string
  osName: string
  lastUsed: Date
}

export interface IWaveSessionMethods {
  getAccessToken(): string
}

export interface WaveSessionModel
  extends mongoose.Model<IWaveSession, {}, IWaveSessionMethods> {}

const schema = new mongoose.Schema<
  IWaveSession,
  WaveSessionModel,
  IWaveSessionMethods
>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'WaveUser' },
    refreshToken: { type: String, index: true },
    browserName: String,
    osName: String,
    lastUsed: Date
  },
  {
    timestamps: true
  }
)

schema.method('getAccessToken', async function getAccessToken () {
  return jwt.sign(
    {
      id: this.id
    },
    Config.get('jwtKey'),
    { expiresIn: 1800 }
  )
})

export default function createWaveSession (conn: Connection) {
  conn.model<IWaveSession, WaveSessionModel>('WaveSession', schema)
}
