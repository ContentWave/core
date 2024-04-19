import mongoose, { Connection, Document, HydratedDocument } from 'mongoose'
import jwt from 'jsonwebtoken'
import { Config } from '../classes/Config'
import { Db } from '../classes/Db'

export interface IWaveSession extends Document {
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
  extends mongoose.Model<IWaveSession, {}, IWaveSessionMethods> {
  findByAccessToken(
    accessToken: string
  ): Promise<HydratedDocument<
    IWaveSession,
    IWaveSessionMethods,
    WaveSessionModel
  > | null>
}

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

schema.static(
  'findByAccessToken',
  async function findByAccessToken (
    accessToken: string
  ): Promise<HydratedDocument<
    IWaveSession,
    IWaveSessionMethods,
    WaveSessionModel
  > | null> {
    try {
      const decoded: any = jwt.verify(accessToken, Config.get('jwtKey'))
      if (decoded.type !== 'user') return null
      const session: HydratedDocument<
        IWaveSession,
        IWaveSessionMethods,
        WaveSessionModel
      > | null = await this.findById(decoded.id, null, {
        populate: 'user'
      })
      if (!session || !session.user?.id) return null
      return session
    } catch {
      return null
    }
  }
)

schema.method('getAccessToken', function getAccessToken () {
  return jwt.sign(
    {
      id: this.id,
      type: 'user'
    },
    Config.get('jwtKey'),
    { expiresIn: 1800 }
  )
})

export default function createWaveSession (conn: Connection) {
  conn.model<IWaveSession, WaveSessionModel>('WaveSession', schema)
}

export const getWaveSessionModel = function () {
  return Db.instance.model<IWaveSession, WaveSessionModel>('WaveSession')
}
