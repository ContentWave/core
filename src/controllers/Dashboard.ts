import {
  Access,
  Description,
  Get,
  Parameter,
  Prefix,
  Query,
  Returns,
  Title
} from '@swarmjs/core'
import { Model } from '../classes/Model'
import { Db } from '../classes/Db'

@Title('Dashboard')
@Description('Dashboard related methods')
@Prefix('/dashboard', true)
export class Dashboard {
  @Get('/models/:modelName/search')
  @Title('Search for references in a model collection')
  @Description('Returns a list of documents with label and value')
  @Access('$admin')
  @Parameter('modelName', 'String', 'Model name')
  @Query('q', 'String', 'Query')
  @Query('limit', 'String', 'Limit of results, defaults to 50')
  @Returns(200, 'RefSearchResults', 'Results')
  @Returns(403, 'Error', 'Cannot access to this ressource')
  static async searchForReferences (
    @Parameter('modelName') modelName: string,
    @Query('q') query: string,
    @Query('limit') limit: string = '50'
  ) {
    if (modelName === 'test') {
      return [
        { label: 'foo', value: '662b65497855667bd0f25628' },
        { label: 'foo2', value: '662b6560b6451042acc728ac' },
        { label: 'foo3', value: '662b6567635680bdc1c46c94' },
        { label: 'foo4', value: '662b656b1332d3e70863a136' },
        { label: 'foo5', value: '662b656f211c4d34958181a2' },
        { label: 'foo6', value: '662b6573c152251f4283367d' },
        { label: 'foo7', value: '662b65764ffd940f961af279' }
      ]
    }
    const field = Model.getNameField(modelName)
    if (field === undefined) return []

    const items: any[] = await Db.model(modelName).find(
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

  @Get('/models/:modelName/:docId/name')
  @Title('Get reference name')
  @Description('Returns the name of a reference')
  @Access('$admin')
  @Parameter('modelName', 'String', 'Model name')
  @Parameter('docId', 'ObjectID', 'Document ID')
  @Returns(200, 'RefSearchResults', 'Results with one item')
  @Returns(403, 'Error', 'Cannot access to this ressource')
  static async getReferenceName (
    @Parameter('modelName') modelName: string,
    @Parameter('docId') docId: string
  ) {
    if (modelName === 'test') {
      const data = [
        { label: 'foo', value: '662b65497855667bd0f25628' },
        { label: 'foo2', value: '662b6560b6451042acc728ac' },
        { label: 'foo3', value: '662b6567635680bdc1c46c94' },
        { label: 'foo4', value: '662b656b1332d3e70863a136' },
        { label: 'foo5', value: '662b656f211c4d34958181a2' },
        { label: 'foo6', value: '662b6573c152251f4283367d' },
        { label: 'foo7', value: '662b65764ffd940f961af279' }
      ]
      return [data.find(d => d.value === docId)]
    }
    const field = Model.getNameField(modelName)
    if (field === undefined) return [{ label: '-', value: docId }]

    const item: any = await Db.model(modelName).findById(docId)

    return [{ label: item?.[field] ?? '-', value: docId }]
  }
}
