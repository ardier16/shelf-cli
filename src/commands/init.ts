import { writeFile } from 'fs/promises'

import chalk from 'chalk'
import clear from 'clear'
import inquirer, { QuestionCollection } from 'inquirer'

import { config as oldConfig, CONFIG_PATH, ShelfConfig } from '../config'

const INIT_QUESTIONS = [
  {
    type: 'input',
    name: 'gitlabToken',
    message: 'Gitlab access token',
    suffix: '\nhttps://docs.gitlab.com/ee/user/profile/personal_access_tokens.html\n',
  },
  {
    type: 'input',
    name: 'slackToken',
    message: 'Slack access token',
    suffix: '\nhttps://slack.com\n',
  },
  {
    type: 'input',
    name: 'jiraEmail',
    message: 'Jira email',
  },
  {
    type: 'input',
    name: 'jiraToken',
    message: 'Jira access token',
    suffix: '\nhttps://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/\n',
  },
]

export async function init () {
  let isOk = false
  let config : ShelfConfig

  do {
    clear()
    config = await promptConfig()
    console.log(JSON.stringify(config, null, 2))

    const { isDone } = await inquirer.prompt({
      name: 'isDone',
      type: 'confirm',
      default: true,
      message: 'Update config file?',
    })
    isOk = isDone
  } while (!isOk)

  saveConfig(config)
  clear()
  console.log(chalk.green('CLI config updated successfully!'))
}

async function promptConfig () : Promise<ShelfConfig> {
  const result = Object.assign({}, oldConfig)

  for (const item of INIT_QUESTIONS) {
    console.log(chalk.cyan('Shelf CLI initalization'))
    const answers = await inquirer.prompt({
      ...item,
      default: result[item.name],
    } as QuestionCollection)

    if (answers[item.name] !== '') {
      Object.assign(result, answers)
    }

    clear()
  }

  return result
}

async function saveConfig (config: ShelfConfig) {
  const newConfig = {
    ...oldConfig,
    ...config,
  }

  const output = JSON.stringify(newConfig, null, 2)
  await writeFile(CONFIG_PATH, output)
}
