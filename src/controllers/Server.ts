import {
  Access,
  Description,
  FastifyReply,
  Post,
  Prefix,
  Res,
  Returns,
  Title
} from '@swarmjs/core'
import { Config } from '../classes/Config'
import { Db } from '../classes/Db'
import { Server as ServerInstance } from '../classes/Server'

@Title('Server')
@Description('Provides methods to handle server execution')
@Prefix('/server', true)
export class Server {
  @Title('Restart server')
  @Description('Takes into account models updates and restarts server')
  @Post('/restart')
  @Access('$developer')
  @Returns(200, 'Empty', 'Server restarting')
  @Returns(403, 'Error', 'You do not have authorization to restart server')
  static async restart (@Res() res: FastifyReply) {
    res.send({})
    await Config.set('serverNeedsRestart', false)
    await Db.init()
    await ServerInstance.start()
  }
}
