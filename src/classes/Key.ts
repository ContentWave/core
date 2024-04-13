import { Db } from './Db'
import wcmatch from 'wildcard-match'
import { HydratedDocument } from 'mongoose'
import { IWaveUser } from '../models/WaveUser'
import { randomUUID } from 'crypto'

interface IKey {
  secret: string
  domains: string[]
}

interface INewKey {
  client_id: string
  client_secret: string
}

const cache: { [key: string]: IKey } = {}

export class Key {
  static async retrieveKeysFromDb () {
    try {
      const url = new URL(process.env.BASE_URL ?? '')
      cache.self = {
        secret: 'self',
        domains: [url.host]
      }
    } catch {}

    const keys = Db.model('WaveKey')?.find({}) ?? []
    for await (const key of keys) {
      cache[key.id] = {
        secret: key.secret,
        domains: key.domains ?? []
      }
    }
  }

  static validateKey (id: string, redirectUri: string): boolean {
    const key = cache[id]
    if (key === undefined) return false

    let redirectDomain = ''
    try {
      const url = new URL(redirectUri)
      redirectDomain = url.host
    } catch {
      return false
    }

    const matchingDomains = key.domains.filter((domain: string) => {
      const isMatch = wcmatch(domain)
      return isMatch(redirectDomain)
    })

    return matchingDomains.length > 0
  }

  static validateKeyAndSecret (id: string, secret: string): boolean {
    return cache[id] && cache[id].secret === secret
  }

  static async create (
    user: HydratedDocument<IWaveUser>,
    name: string,
    domains: string[]
  ): Promise<INewKey> {
    const created = await Db.model('WaveKey')?.create({
      user: user.id,
      name,
      domains,
      secret: randomUUID()
    })
    cache[created.id] = {
      secret: created.secret,
      domains: created.domains ?? []
    }
    return {
      client_id: created.id,
      client_secret: created.secret
    }
  }

  static async update (
    id: string,
    user: HydratedDocument<IWaveUser>,
    name: string,
    domains: string[]
  ) {
    const res = await Db.model('WaveKey')?.updateOne(
      { _id: id, user: user.id },
      { $set: { name, domains } }
    )
    if (res?.modifiedCount && cache[id] !== undefined)
      cache[id].domains = domains
  }

  static async delete (id: string, user: HydratedDocument<IWaveUser>) {
    const res = await Db.model('WaveKey')?.deleteOne({
      _id: id,
      user: user.id
    })
    if (res?.deletedCount && cache[id] !== undefined) delete cache[id]
  }
}
