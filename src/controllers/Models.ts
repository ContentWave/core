import {
  Accepts,
  Access,
  Body,
  Delete,
  Description,
  FastifyReply,
  Get,
  Parameter,
  Prefix,
  Put,
  Res,
  Returns,
  Title
} from '@swarmjs/core'
import { Model } from '../classes/Model'
import {
  IWaveModelAuthorizations,
  IWaveModelRelation,
  IWaveModelSearch
} from '../models/WaveModel'
import { IOrmConf } from '../interfaces/IOrmConf'

@Title('Models')
@Description('Manage models')
@Prefix('/models', true)
export class Models {
  @Get('/')
  @Title('List models')
  @Description('Retrieve a list of models')
  @Access('$admin')
  @Returns(200, 'ModelList', 'List of models')
  @Returns(403, 'Error', 'You cannot access this resource')
  static async list () {
    return Object.entries(Model.getList()).map(([name, _]) => ({
      name
    }))
  }

  @Get('/:model')
  @Title('Get model configuration')
  @Description('Retrieves a specific model configuration')
  @Parameter('model', { type: 'string', pattern: '^[a-z-]+$' })
  @Access('$admin')
  @Returns(200, 'Model', 'Model configuration')
  @Returns(403, 'Error', 'You cannot access this resource')
  static async get (@Parameter('model') name: string) {
    return {
      conf: Model.getConf(name),
      relations: Model.getRelations(name),
      authorizations: Model.getAuthorizations(name),
      search: Model.getSearch(name),
      cached: Model.getCached(name),
      nameField: Model.getNameField(name),
      listFields: Model.getListFields(name)
    }
  }

  @Put('/:model')
  @Title('Creates or updates a model')
  @Description('Creates or updates a specific model')
  @Parameter('model', { type: 'string', pattern: '^[a-z-]+$' })
  @Access('$admin')
  @Accepts('Model')
  @Returns(200, 'Empty', 'Model saved')
  @Returns(403, 'Error', 'You cannot access this resource')
  static async update (
    @Parameter('model') name: string,
    @Body('conf') conf: IOrmConf,
    @Body('relations') relations: IWaveModelRelation[],
    @Body('authorizations') authorizations: IWaveModelAuthorizations,
    @Body('search') search: IWaveModelSearch,
    @Body('cached') cached: boolean,
    @Body('nameField') nameField: string,
    @Body('listFields') listFields: string[]
  ) {
    await Model.update(
      name,
      conf,
      relations,
      authorizations,
      search,
      cached,
      nameField,
      listFields
    )
  }

  @Delete('/:model')
  @Title('Delete model')
  @Description('Deletes a model')
  @Parameter('model', { type: 'string', pattern: '^[a-z-]+$' })
  @Access('$admin')
  @Returns(204, 'Empty', 'Model deleted')
  @Returns(403, 'Error', 'You cannot access this resource')
  static async delete (
    @Parameter('model') name: string,
    @Res() reply: FastifyReply
  ) {
    await Model.delete(name)
    reply.code(204).send()
  }
}
