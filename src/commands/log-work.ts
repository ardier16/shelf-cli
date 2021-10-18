import chalk from 'chalk'
import { gitSdk } from '../services/git-sdk'

import { jiraSdk } from '../services/jira-sdk'

export async function logWork(timeSpent?: string) {
  if (timeSpent === undefined) {
    console.log(chalk.red('Log time is not provided'))
    return
  }

  try {
    const issueId = await gitSdk.getCurrentBranch()
    console.log(`Finding issue ${chalk.yellow(issueId)}`)
    await jiraSdk.issues.getIssue({ issueIdOrKey: issueId })

    console.log(`Logging work for issue ${chalk.yellow(issueId)}`)
    await jiraSdk.issueWorklogs.addWorklog({
      issueIdOrKey: issueId,
      timeSpent: timeSpent,
    })
    console.log(chalk.green('Worklog added successfully!'))
  } catch (err) {
    console.error(chalk.red(err))
    process.exit(0)
  }
}
