import {
  Accepts,
  Body,
  Description,
  Post,
  Prefix,
  Returns,
  Title
} from '@swarmjs/core'
import { IOrmConf } from '../interfaces/IOrmConf'
import { Formatter } from '../classes/Orm/Formatter'

@Title('Schemas')
@Description('Provide tools to handle ORM schemas')
@Prefix('/schemas', true)
export class Schemas {
  @Post('/to-json-schema')
  @Accepts('OrmConf')
  @Returns(200, 'JsonSchema', 'JSON Schema')
  static async toJsonSchema (@Body() schema: IOrmConf) {
    return Formatter.getValidationSchema(schema)
  }

  @Post('/format-form-data')
  @Title('Format data from a form as if we store it in the database')
  static async formatData (
    @Body('schema') schema: IOrmConf,
    @Body('doc') doc: any
  ) {
    return await Formatter.toDb(doc, schema, undefined, null, null)
  }
}
