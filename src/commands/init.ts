import { writeFile } from 'fs/promises'

import chalk from 'chalk'
import clear from 'clear'
import inquirer, { QuestionCollection } from 'inquirer'

import { Gitlab } from '@gitbeaker/node'
import { WebClient } from '@slack/web-api'
import { Version2Client } from 'jira.js'

import { config as oldConfig, CONFIG_PATH, ShelfConfig } from '../config'
import { SLACK_SCOPES } from '../services/slack-client'
import { JIRA_HOST } from '../services/jira-client'
import { spinner } from '../services/spinner'

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
    suffix: `\nhttps://api.slack.com/authentication/basics\nRequired scopes: ${JSON.stringify(SLACK_SCOPES, null, 2)}\n`,
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
  spinner.start('Checking services')
  const [isGitlabValid, isJiraValid, isSlackValid] = await Promise.all([
    checkGitlab(config),
    checkJira(config),
    checkSlack(config),
  ])

  const isValid = isGitlabValid && isJiraValid && isSlackValid
  if (isValid) {
    spinner.succeed()
    return true
  }

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
  try {
    if (config.gitlabToken === '') throw new Error()

    const gitlabClient = new Gitlab({ token: config.gitlabToken })
    await gitlabClient.Users.current()
    return true
  } catch (err) {
    spinner.fail()
    console.error(chalk.red('Invalid Gitlab token'))
    return false
  }
}

async function checkJira (config: ShelfConfig): Promise<boolean> {
  try {
    if (config.jiraEmail === '' || config.jiraToken === '') throw new Error()

    const jiraClient = new Version2Client({
      host: JIRA_HOST,
      authentication: {
        basic: {
          email: config.jiraEmail,
          apiToken: config.jiraToken,
        },
      },
    })

    await jiraClient.jiraSettings.getConfiguration()
    return true
  } catch (err) {
    spinner.fail()
    console.error(chalk.red('Invalid Jira email:token pair'))
    return false
  }
}

async function checkSlack (config: ShelfConfig): Promise<boolean> {
  try {
    if (config.slackToken === '') throw new Error()

    const slackClient = new WebClient(config.slackToken)
    const response = await slackClient.api.test()

    const isSlackScopesValid = SLACK_SCOPES
      .every(scope => response.response_metadata?.scopes?.includes(scope))
    if (isSlackScopesValid) return true

    spinner.fail()
    console.error(chalk.red('Invalid Slack scopes. Required:'))
    console.error(chalk.red(JSON.stringify(SLACK_SCOPES, null, 2)))
    return false
  } catch (err) {
    spinner.fail()
    console.error(chalk.red('Invalid Slack token'))
    return false
  }
}
