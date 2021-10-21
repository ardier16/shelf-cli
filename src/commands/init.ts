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
    suffix: '\nhttps://api.slack.com/authentication/basics\n',
  },
  {
    type: 'input',
    name: 'jiraEmail',
    message: 'Jira email',
    suffix: '\n',
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
  let config = Object.assign({}, oldConfig)

  do {
    clear()
    config = await promptConfig(config)
    const isValid = await checkServices(config)
    if (!isValid) continue

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

async function promptConfig (config: ShelfConfig) : Promise<ShelfConfig> {
  const result = Object.assign({}, oldConfig)

  for (const item of INIT_QUESTIONS) {
    console.log(chalk.cyan('Shelf CLI initalization'))
    const answers = await inquirer.prompt({
      ...item,
      default: config[item.name] || result[item.name],
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

async function checkServices (config: ShelfConfig): Promise<boolean> {
  const [isGitlabValid, isJiraValid, isSlackValid] = await Promise.all([
    checkGitlab(config),
    checkJira(config),
    checkSlack(config),
  ])

  if (!isGitlabValid) {
    console.error(chalk.red('Invalid Gitlab token'))
  }

  if (!isJiraValid) {
    console.error(chalk.red('Invalid Jira email:token pair'))
  }

  if (!isSlackValid) {
    console.error(chalk.red('Invalid Slack token'))
  }

  const isValid = isGitlabValid && isJiraValid && isSlackValid
  if (isValid) return true

  const { isContinue } = await inquirer.prompt({
    name: 'isContinue',
    type: 'confirm',
    default: true,
    message: 'Try again?',
  })

  if (!isContinue) {
    process.exit()
  }

  return false
}

async function checkGitlab (config: ShelfConfig): Promise<boolean> {
  if (config.gitlabToken === '') return false
  return true
}

async function checkJira (config: ShelfConfig): Promise<boolean> {
  if (config.jiraEmail === '' || config.jiraToken === '') return false
  return true
}

async function checkSlack (config: ShelfConfig): Promise<boolean> {
  if (config.slackToken === '') return false
  return true
}
