import { Description, Get, Prefix, Returns, Title } from '@swarmjs/core'
import { Config } from '../classes/Config'

@Title('UI')
@Description('Provides data to different frontends')
@Prefix('/ui', true)
export class Ui {
  @Get('/config')
  @Returns(200, 'UiConfig', 'UI design configuration')
  static async authorize () {
    return {
      logo: Config.get('logo'),
      logoBackground: Config.get('logoBackground'),
      logoSize: Config.get('logoSize'),
      title: Config.get('title'),
      description: Config.get('description'),
      color: Config.get('color')
    }
  }
}
