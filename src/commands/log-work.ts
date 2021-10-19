import chalk from 'chalk'
import { gitClient } from '../services/git-client'
import { jiraClient } from '../services/jira-client'
import { spinner } from '../services/spinner'

export async function logWork(timeSpent?: string) {
  if (timeSpent === undefined) {
    console.log(chalk.red('Log time is not provided'))
    return
  }

  try {
    const issueId = await gitClient.getCurrentBranch()
    spinner.start(`Finding issue ${chalk.yellow(issueId)}`)
    await jiraClient.issues.getIssue({ issueIdOrKey: issueId })

    spinner.succeed().start(`Logging work for issue ${chalk.yellow(issueId)}`)
    await jiraClient.issueWorklogs.addWorklog({
      issueIdOrKey: issueId,
      timeSpent: timeSpent,
    })

    spinner.succeed()
    console.log(chalk.green('Worklog added successfully!'))
  } catch (err) {
    spinner.fail()
    console.error(chalk.red(err))
    process.exit(0)
  }
}
