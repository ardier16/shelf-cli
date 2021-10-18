import { existsSync } from 'fs'
import { resolve } from 'path'

const isDevEnv = process.env.NODE_ENV === 'development'
const localPath = resolve(__dirname, './config.local.json')
const publicPath = resolve(__dirname, './config.json')

export const CONFIG_PATH = isDevEnv && existsSync(localPath)
  ? localPath
  : publicPath

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const config = require(CONFIG_PATH)
