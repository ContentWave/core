import { JSONSchema7 } from '../../../interfaces/JsonSchema'
import { ensureArray } from '../../Array'
import { Plugins } from '../../Plugins'
import { IImageOrmField } from '../IOrmConf'
import mime from 'mime-types'
import sharp from 'sharp'
import heicConvert from 'heic-convert'
import { Config } from '../../Config'

interface ImageContent {
  content: string
  filename: string
}

export class TypeImage {
  static getValidationSchema (conf: IImageOrmField): JSONSchema7 {
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

  static getMongooseField (conf: IImageOrmField): any {
    const ret: any = {
      $type: String,
      index: !!conf.index,
      unique: !!conf.unique,
      default: conf.nullable ? null : ''
    }
    if (conf.multiple) return [ret]
    return ret
  }

  static getMongooseIndex (_: string, _2: IImageOrmField): any {
    return null
  }

  static async preSave (_: string, _2: any, _3: IImageOrmField): Promise<void> {}

  static async fromDb (data: any, conf: IImageOrmField): Promise<string | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      return data.map((d: any) => `${d}`)
    }
    if (!data) return conf.nullable ? null : ''
    return `${data}`
  }

  static dataUriToImageContent (datauri: string): ImageContent {
    const splitted = datauri.substring(5).split(',')
    const header = splitted.shift() ?? ''
    const [mimeType, format] = header.split(';')
    const content = splitted.join(',')
    const filename = `image.${mime.extension(mimeType)}`
    return {
      filename,
      content:
        format === 'base64'
          ? decodeURI(content)
          : Buffer.from(content).toString('base64')
    }
  }

  static async uploadImageContent (
    fsPlugin: any,
    image: ImageContent,
    conf: IImageOrmField
  ): Promise<string> {
    let mimeType = mime.lookup(image.filename)

    if ((Config.get('uploadAllowedMimes') ?? []).includes(mimeType) === false)
      return ''
    if (!mimeType || mimeType.substring(0, 6) !== 'image/') return ''

    if (mimeType === 'image/heic') {
      image.content = Buffer.from(
        await heicConvert({
          buffer: Buffer.from(image.content, 'base64'),
          format: 'JPEG',
          quality: 1
        })
      ).toString('base64')
      image.filename += '.jpg'
      mimeType = 'image/jpg'
    }

    if (conf.resize) {
      image.content = (
        await sharp(Buffer.from(image.content, 'base64'), {
          animated: mimeType === 'image/gif'
        })
          .resize(conf.maxWidth, conf.maxHeight, {
            fit: conf.crop ? 'outside' : 'inside'
          })
          .toBuffer()
      ).toString('base64')
    }

    return await fsPlugin.storeImage(
      Buffer.from(image.content, 'base64'),
      image.filename
    )
  }

  static async handleImage (
    image: string | ImageContent,
    conf: IImageOrmField
  ): Promise<string> {
    const fsPlugin = Plugins.getInstance('fs')
    if (typeof image === 'string') {
      if (image.substring(0, 5) === 'data:' && fsPlugin) {
        return TypeImage.uploadImageContent(
          fsPlugin,
          TypeImage.dataUriToImageContent(image),
          conf
        )
      }
      return image
    }
    if (!fsPlugin) {
      const mimeType = mime.lookup(image.filename)
      if (!mimeType) return ''
      return `data:${mimeType};base64,${image.content}`
    }
    return TypeImage.uploadImageContent(fsPlugin, image, conf)
  }

  static async toDb (
    data: any,
    conf: IImageOrmField
  ): Promise<string | string[] | null> {
    if (conf.multiple) {
      data = ensureArray(data)
      data = data.filter((d: any) => conf.nullable || d !== null)
      const ret: string[] = []
      for (let d of data) {
        const url = await TypeImage.handleImage(d, conf)
        if (url.length) ret.push(url)
      }
      return ret
    }

    if (!data) return conf.nullable ? null : ''
    return await TypeImage.handleImage(data, conf)
  }
}
