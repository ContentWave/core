import {
  Accepts,
  Access,
  Body,
  Description,
  Get,
  Parameter,
  Post,
  Prefix,
  Query,
  Returns,
  Title
} from '@swarmjs/core'
import { Model } from '../classes/Model'
import { Db } from '../classes/Db'
import { TypeFile } from '../classes/Orm/Types/File'
import { TypeImage } from '../classes/Orm/Types/Image'
import { Config } from '../classes/Config'
import { AuthFido } from './AuthFido'

@Title('Dashboard')
@Description('Dashboard related methods')
@Prefix('/dashboard', true)
export class Dashboard {
  @Get('/models/:model/search')
  @Title('Search for references in a model collection')
  @Description('Returns a list of documents with label and value')
  @Access('$admin')
  @Parameter('model', 'String', 'Model name')
  @Query('q', 'String', 'Query')
  @Query('limit', 'String', 'Limit of results, defaults to 50')
  @Returns(200, 'RefSearchResults', 'Results')
  @Returns(403, 'Error', 'Cannot access to this resource')
  static async searchForReferences (
    @Parameter('model') model: string,
    @Query('q') query: string,
    @Query('limit') limit: string = '50'
  ) {
    const field = Model.getNameField(model)
    if (field === undefined) return []

    const items: any[] = await Db.model(model).find(
      {
        [field]: {
          $regex: query,
          $options: 'i'
        }
      },
      {
        _id: 1,
        [field]: 1
      },
      {
        limit: +limit
      }
    )

    return items.map(result => ({
      label: result[field],
      value: result._id.toHexString()
    }))
  }

  @Get('/models/:model/:docId/name')
  @Title('Get reference name')
  @Description('Returns the name of a reference')
  @Access('$admin')
  @Parameter('model', 'String', 'Model name')
  @Parameter('docId', 'ObjectID', 'Document ID')
  @Returns(200, 'RefSearchResults', 'Results with one item')
  @Returns(403, 'Error', 'Cannot access to this resource')
  static async getReferenceName (
    @Parameter('model') model: string,
    @Parameter('docId') docId: string
  ) {
    const field = Model.getNameField(model)
    if (field === undefined) return [{ label: '-', value: docId }]

    const item: any = await Db.model(model).findById(docId)

    return [{ label: item?.[field] ?? '-', value: docId }]
  }

  @Post('/upload-file')
  @Title('Upload a single file')
  @Access('$admin')
  @Accepts('Base64File')
  @Returns(200, 'UploadedFile', 'Results with one item')
  @Returns(403, 'Error', 'Cannot access to this resource')
  static async uploadFile (
    @Body('filename') filename: string,
    @Body('content') content: string
  ) {
    const url = await TypeFile.toDb({ filename, content }, { type: 'file' })
    return { url }
  }

  @Post('/upload-image')
  @Title('Upload a single image and resize it')
  @Access('$admin')
  @Accepts('Base64File')
  @Query('resize', 'TextBoolean', 'Asks to resize image')
  @Query('crop', 'TextBoolean', 'Tells if the image must be cropped')
  @Query('maxHeight', 'String', 'Max height in px')
  @Query('maxWidth', 'String', 'Max width in px')
  @Returns(200, 'UploadedFile', 'Results with one item')
  @Returns(403, 'Error', 'Cannot access to this resource')
  static async uploadImage (
    @Body('filename') filename: string,
    @Body('content') content: string,
    @Query('resize') resize: string = 'false',
    @Query('crop') crop: string = 'false',
    @Query('maxHeight') maxHeight: string = '0',
    @Query('maxWidth') maxWidth: string = '0'
  ) {
    const url = await TypeImage.toDb(
      { filename, content },
      {
        type: 'image',
        resize: resize === 'true',
        crop: crop === 'true',
        maxHeight: +maxHeight,
        maxWidth: +maxWidth
      }
    )
    return { url }
  }

  @Get('/config/:key')
  @Title('Get config key value')
  @Access('$developer')
  @Parameter('key', 'String', 'Config key')
  @Returns(200, 'AnyValue', 'Value')
  @Returns(403, 'Error', 'Cannot access to this resource')
  static async getConfigValue (@Parameter('key') key: string) {
    return {
      value: Config.get(key)
    }
  }

  @Post('/config/:key')
  @Title('Set config key value')
  @Access('$developer')
  @Accepts('AnyValue')
  @Parameter('key', 'String', 'Config key')
  @Returns(200, 'Empty', 'Value saved')
  @Returns(403, 'Error', 'Cannot access to this resource')
  static async setConfigValue (
    @Parameter('key') key: string,
    @Body('value') value: any
  ) {
    await Config.set(key, value)
    if (key === 'auth') AuthFido.setup()
    return {}
  }

  @Get('/models')
  @Title('List models')
  @Access('$developer')
  @Returns(200, 'LabelValueList', 'Models')
  @Returns(403, 'Error', 'Cannot access to this resource')
  static async listModels () {
    const list = Model.getList()

    return Object.entries(list).map(([name, _]) => ({
      label: name,
      value: name
    }))
  }
}
