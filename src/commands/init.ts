import path from 'path'
import fs from 'fs/promises'

import chalk from 'chalk'
import clear from 'clear'
import inquirer from 'inquirer'

import oldConfig from '../config.json'

type InitConfig = {
  gitlabToken?: string,
  slackToken?: string,
  jiraToken?: string,
}

const CONFIG_PATH = path.resolve(__dirname, '../config.json')

const INIT_QUESTIONS = [
  {
    type: 'input',
    name: 'gitlabToken',
    message: 'Gitlab access token',
    suffix: ' (https://gitlab.com)',
  },
  {
    type: 'input',
    name: 'slackToken',
    message: 'Slack access token',
    suffix: ' (https://slack.com)',
  },
  {
    type: 'input',
    name: 'jiraToken',
    message: 'Jira access token',
    suffix: ' (https://shelf.atlassian.com)',
  },
]

export async function init () {  
  let isOk = false
  let config : InitConfig = {}

  while (!isOk) {
    clear()
    config = await promptConfig(config)
    console.log(JSON.stringify(config, null, 2))

    const { isDone } = await inquirer.prompt({
      name: 'isDone',
      type: 'confirm',
      default: true,
      message: 'Create config file?',
    })
    isOk = isDone
  }

  clear()
  saveConfig(config)
  console.log(chalk.green('CLI config updated successfully!'))
}

async function promptConfig (config: InitConfig) : Promise<InitConfig> {
  const result = Object.assign({}, config)

  for (const item of INIT_QUESTIONS) {
    console.log(chalk.cyan('Shelf CLI initalization'))
    const answers = await inquirer.prompt({
      ...item,
      default: config[item.name],
    })
    Object.assign(result, answers)
    clear()
  }

  return result
}

async function saveConfig (config: InitConfig) {
  const newConfig = {
    ...oldConfig,
    ...config,
  }

  const output = JSON.stringify(newConfig, null, 2)
  await fs.writeFile(CONFIG_PATH, output)
}
