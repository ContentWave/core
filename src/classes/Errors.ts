import axios from 'axios'
import fs from 'fs'
import { IWaveErrorContext } from '../models/WaveError'
import { Db } from './Db'

let contextCache: { [key: string]: IWaveErrorContext } = {}

function getContext (stack: string): IWaveErrorContext {
  const stackLines: string[] = stack.split('\n')
  const re = /(\/[^:]+):([0-9]+):([0-9]+)/
  const m = re.exec(stackLines[1] ?? '')
  if (!m)
    return {
      file: '',
      line: 0,
      column: 0,
      fromLine: 0,
      toLine: 0,
      lines: []
    }
  const [_, filePath, line, column]: string[] = m

  if (contextCache[`${filePath}:${line}:${column}`] !== undefined)
    return contextCache[`${filePath}:${line}:${column}`]

  const ret: IWaveErrorContext = {
    file: filePath,
    line: +line,
    column: +column,
    fromLine: +line - 10,
    toLine: +line + 10,
    lines: []
  }

  const src: string[] = (
    fs.existsSync(filePath) ? fs.readFileSync(filePath).toString() : ''
  ).split('\n')

  if (ret.fromLine < 1) ret.fromLine = 1
  if (ret.toLine > src.length) ret.toLine = src.length
  ret.lines = src.slice(ret.fromLine - 1, ret.toLine - 1)

  contextCache[`${filePath}:${line}:${column}`] = ret
  return ret
}

function handleAxiosError (err: any) {
  if (!axios.isAxiosError(err)) return false

  const details: any = err.toJSON()

  if (err.response) {
    Db.model('WaveError')?.create({
      date: new Date(),
      message: details.message,
      stack: details.stack ?? '',
      type: 'axios',
      details: {
        type: details.code,
        request: {
          aborted: err.request.destroyed,
          finished: err.request.writableEnded,
          headers: { ...details.config.headers },
          method: details.config.method.toUpperCase(),
          url: details.config.url,
          body: details.config.data
        },
        response: {
          responded: true,
          headers: err.response.headers,
          status: err.response.status,
          body:
            typeof err.response.data === 'string'
              ? err.response.data
              : JSON.stringify(err.response.data)
        }
      },
      context: getContext(details.stack ?? '')
    })
    return true
  }

  if (err.request) {
    Db.model('WaveError')?.create({
      date: new Date(),
      message: details.message,
      stack: details.stack ?? '',
      type: 'axios',
      details: {
        type: details.code,
        request: {
          aborted: err.request.destroyed,
          finished: err.request.writableEnded,
          headers: { ...details.config.headers },
          method: details.config.method.toUpperCase(),
          url: details.config.url,
          body: details.config.data
        },
        response: {
          responded: false,
          headers: {},
          status: 0,
          body: ''
        }
      },
      context: getContext(details.stack ?? '')
    })
    return true
  }

  return false
}

export function handleError (err: any) {
  if (handleAxiosError(err)) return

  Db.model('WaveError')?.create({
    date: new Date(),
    message: err.message,
    stack: err.stack,
    type: 'generic',
    context: getContext(err.stack ?? '')
  })
}
