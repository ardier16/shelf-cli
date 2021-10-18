import { appendFileSync, existsSync, readFileSync } from 'fs'
import { homedir } from 'os'
import { resolve } from 'path'

export type ShelfConfig = Record<string, string> & {
  gitlabToken: string,
  slackToken: string,
  jiraEmail: string,
  jiraToken: string,
}

export const defaultConfig = {
  gitlabToken: '',
  slackToken: '',
  jiraEmail: '',
  jiraToken: '',
}

export const CONFIG_PATH = resolve(homedir(), '.shelfrc')

if (!existsSync(CONFIG_PATH)) {
  appendFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2))
}

const rawConfig = readFileSync(CONFIG_PATH)
export const config : ShelfConfig = JSON.parse(rawConfig.toString())
