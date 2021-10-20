import chalk from 'chalk'
import { jiraClient } from '../services/jira-client'
import { spinner } from '../services/spinner'
import { formatTimePeriod, getDayStartDate } from '../utils/datetime'

export async function getTodayWorklog () {
  try {
    spinner.start('Finding today\'s worklogs')
    const worklogIds = await jiraClient.issueWorklogs
      .getIdsOfWorklogsModifiedSince({
        since: getDayStartDate(new Date()).getTime(),
      })

    if (worklogIds.values === undefined) {
      spinner.fail()
      console.log(chalk.red('No worklog values found'))
      return
    }

    const worklogs = await jiraClient.issueWorklogs.getWorklogsForIds({
      ids: worklogIds.values.map(item => item.worklogId || 0),
    })
    spinner.succeed()

    const totalSpentTimeSeconds = worklogs
      .map(item => item.timeSpentSeconds || 0)
      .reduce((acc, item) => acc + item, 0)

    const formattedLogTime = formatTimePeriod(totalSpentTimeSeconds)
    console.log(`Logged today: ${chalk.yellow(formattedLogTime)}`)
  } catch (err) {
    spinner.fail()
    console.error(chalk.red(err))
    process.exit(0)
  }
}
