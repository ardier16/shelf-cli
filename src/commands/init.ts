import { writeFile } from 'fs/promises'

import chalk from 'chalk'
import clear from 'clear'
import inquirer, { QuestionCollection } from 'inquirer'

import { config as oldConfig, CONFIG_PATH } from '../config'

type InitConfig = Record<string, string> & {
  gitlabToken?: string,
  slackToken?: string,
  jiraEmail?: string,
  jiraToken?: string,
}

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
  let config : InitConfig = oldConfig

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
    } as QuestionCollection)

    if (answers[item.name] !== '') {
      Object.assign(result, answers)
    }

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
  await writeFile(CONFIG_PATH, output)
}
