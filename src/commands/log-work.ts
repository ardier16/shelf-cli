import chalk from 'chalk'
import { gitClient } from '../services/git-client'
import { jiraClient } from '../services/jira-client'

export async function logWork(timeSpent?: string) {
  if (timeSpent === undefined) {
    console.log(chalk.red('Log time is not provided'))
    return
  }

  try {
    const issueId = await gitClient.getCurrentBranch()
    console.log(`Finding issue ${chalk.yellow(issueId)}`)
    await jiraClient.issues.getIssue({ issueIdOrKey: issueId })

    console.log(`Logging work for issue ${chalk.yellow(issueId)}`)
    await jiraClient.issueWorklogs.addWorklog({
      issueIdOrKey: issueId,
      timeSpent: timeSpent,
    })
    console.log(chalk.green('Worklog added successfully!'))
  } catch (err) {
    console.error(chalk.red(err))
    process.exit(0)
  }
}
