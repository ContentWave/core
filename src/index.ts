import 'dotenv/config'
import { Db } from './classes/Db'
import { Server } from './classes/Server'
import path from 'path'
import { Plugins } from './classes/Plugins'

process.env.ROOT_DIR = path.resolve(__dirname, '..')
;(async () => {
  await Db.init()
  await Plugins.init()
  await Server.start()
})()
