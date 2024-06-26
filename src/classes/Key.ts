import wcmatch from 'wildcard-match'
import { IWaveUser } from '../models/WaveUser'
import { randomUUID } from 'crypto'
import { IWaveKey, getWaveKeyModel } from '../models/WaveKey'

interface IKey {
  secret: string
  domains: string[]
  type: 'browser' | 'application'
  owner: string
}

interface INewKey {
  client_id: string
  client_secret: string
}

const cache: { [key: string]: IKey } = {}

export class Key {
  static async retrieveKeysFromDb () {
    try {
      const url = new URL(
        process.env.DASHBOARD_FRONTEND_URL ?? process.env.BASE_URL ?? ''
      )
      const url2 = new URL(process.env.BASE_URL ?? '')
      cache.self = {
        secret: 'self',
        type: 'browser',
        domains: [url.host, url2.host],
        owner: ''
      }
    } catch {}

    const keys: IWaveKey[] = await getWaveKeyModel().find({})
    for await (const key of keys) {
      cache[key.id] = {
        secret: key.secret,
        type: key.type,
        domains: key.domains ?? [],
        owner: key.user._id.toHexString()
      }
    }
  }

  static getKeyType (id: string): 'browser' | 'application' | null {
    return cache[id]?.type ?? null
  }

  static getKeyOwnerId (id: string): string | null {
    return cache[id]?.owner ?? null
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
    user: IWaveUser,
    name: string,
    type: 'browser' | 'application',
    domains: string[]
  ): Promise<INewKey | null> {
    const created = await getWaveKeyModel().create({
      user: user.id,
      name,
      type,
      domains,
      secret: randomUUID()
    })
    if (!created) return null
    cache[created.id] = {
      secret: created.secret,
      type: created.type,
      domains: created.domains ?? [],
      owner: user.id
    }
    return {
      client_id: created.id,
      client_secret: created.secret
    }
  }

  static async update (
    id: string,
    user: IWaveUser,
    name: string,
    domains: string[]
  ) {
    const res = await getWaveKeyModel().updateOne(
      { _id: id, user: user.id },
      { $set: { name, domains } }
    )
    if (res?.modifiedCount && cache[id] !== undefined)
      cache[id].domains = domains
  }

  static async delete (id: string, user: IWaveUser) {
    const res = await getWaveKeyModel().deleteOne({
      _id: id,
      user: user.id
    })
    if (res?.deletedCount && cache[id] !== undefined) delete cache[id]
  }
}
