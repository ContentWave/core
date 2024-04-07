import { JSONSchema7 } from '../../../interfaces/JsonSchema'
import { ensureArray } from '../../Array'
import { Plugins } from '../../Plugins'
import { IFileOrmField } from '../IOrmConf'
import mime from 'mime-types'

interface FileContent {
  content: string
  filename: string
}

export class TypeFile {
  static getValidationSchema (conf: IFileOrmField): JSONSchema7 {
    let fields: JSONSchema7[] = [
      {
        type: 'string',
        format: 'uri'
      },
      {
        type: 'object',
        properties: {
          content: { type: 'string', format: 'byte' },
          filename: { type: 'string' }
        },
        required: []
      }
    ]
    if (conf.nullable) fields.push({ type: 'null' })

    let field: JSONSchema7 = {
      oneOf: fields
    }

    if (conf.multiple)
      return {
        type: 'array',
        items: field,
        minItems: conf.minItems,
        maxItems: conf.maxItems
      }
    return field
  }

  static getMongooseField (conf: IFileOrmField): any {
    const ret: any = {
      $type: String,
      index: !!conf.index,
      unique: !!conf.unique,
      default: conf.default ?? (conf.nullable ? null : '')
    }
    if (conf.multiple) return [ret]
    return ret
  }

  static getMongooseIndex (_: string, _2: IFileOrmField): any {
    return null
  }

  static async preSave (_: string, _2: any, _3: IFileOrmField): Promise<void> {}

  static async fromDb (data: any, conf: IFileOrmField): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => `${d}`)
    }
    if (!data) return conf.default ?? (conf.nullable ? null : '')
    return `${data}`
  }

  static dataUriToFileContent (datauri: string): FileContent {
    const splitted = datauri.substring(5).split(',')
    const header = splitted.shift() ?? ''
    const [mimeType, format] = header.split(';')
    const content = splitted.join(',')
    const filename = `file.${mime.extension(mimeType)}`
    return {
      filename,
      content:
        format === 'base64' ? content : Buffer.from(content).toString('base64')
    }
  }

  static async uploadFileContent (
    fsPlugin: any,
    file: FileContent
  ): Promise<string> {
    return await fsPlugin.storeFile(
      Buffer.from(file.content, 'base64'),
      file.filename
    )
  }

  static async handleFile (file: string | FileContent): Promise<string> {
    const fsPlugin = Plugins.getInstance('fs')
    if (typeof file === 'string') {
      if (file.substring(0, 5) === 'data:' && fsPlugin) {
        return TypeFile.uploadFileContent(
          fsPlugin,
          TypeFile.dataUriToFileContent(file)
        )
      }
      return file
    }
    if (!fsPlugin) {
      const mimeType = mime.lookup(file.filename)
      if (!mimeType) return ''
      return `data:${mimeType};base64,${file.content}`
    }
    return TypeFile.uploadFileContent(fsPlugin, file)
  }

  static async toDb (
    data: any,
    conf: IFileOrmField
  ): Promise<string | string[] | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      const ret: string[] = []
      for (let d of data) {
        ret.push(await TypeFile.handleFile(d))
      }
      return ret
    }
    if (!data) return conf.default ?? (conf.nullable ? null : '')
    return await TypeFile.handleFile(data)
  }
}
