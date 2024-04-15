import * as argon2 from 'argon2'

export class Crypt {
  static async hash (str: string): Promise<string> {
    return argon2.hash(str, {
      type: argon2.argon2i
    })
  }

  static async verify (str: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, str)
  }
}
