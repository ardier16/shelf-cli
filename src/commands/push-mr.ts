import chalk from 'chalk'
import { gitSdk } from '../services/git-sdk'
import { gitlabSdk } from '../services/gitlab-sdk'
import { jiraSdk } from '../services/jira-sdk'

const JIRA_TASK_REGEX = /https:\/\/shelf\.atlassian\.net\/browse\/(SHF-\d+)/

export async function pushMergeRequest(taskLink: string) {
  if (!testTaskLink(taskLink)) {
    console.log(`${chalk.red('Invalid task link:')} ${taskLink}`)
    console.log(`Please follow ${chalk.cyan('https://shelf.atlassian.net/browse/SHF-XXX')} format`)
    process.exit(0)
  }

  const taskName = (taskLink.match(JIRA_TASK_REGEX) || [])[1]
  console.log(`Creating merge request for ${chalk.bold.blue(taskName)}`)
  
  try {
    // const issue = await jiraSdk.issues.getIssue({ issueIdOrKey: taskName })

    // await gitSdk.checkout('master')
    // await gitSdk.createBranch(taskName)
    // await gitSdk.pushOrigin(taskName)

    // const remoteUrl = await gitSdk.getRemoteUrl()
    const remoteUrl = 'git@gitlab.com:eAuction/copart-bidder-extension.git'
    const projectName = remoteUrl.trim().match(/\/(.+)\.git/)[1]
    const projects = await gitlabSdk.Projects.search(projectName)
    console.log(projects.map(p => p.ssh_url_to_repo))

    // await gitlabSdk.MergeRequests.create(
    //   '',
    //   taskName,
    //   'master',
    //   `WIP: [${taskName}] ${issue.fields.summary}`
    // )
  } catch (err) {
    if (typeof err !== 'string' || !err.startsWith('Already on \'master\'')) {
      console.error(chalk.red(err))
      process.exit(0)
    }
  }
}

function testTaskLink (link?: string): boolean {
  return link !== undefined && JIRA_TASK_REGEX.test(link)
}
