import chalk from 'chalk'
import { gitSdk } from '../services/git-sdk'
import { gitlabSdk } from '../services/gitlab-sdk'
import { jiraSdk } from '../services/jira-sdk'
import { matchRegex } from '../utils/regex'

const JIRA_TASK_REGEX = /https:\/\/shelf\.atlassian\.net\/browse\/(SHF-\d+)/

export async function pushMergeRequest(taskLink: string) {
  if (!testTaskLink(taskLink)) {
    console.log(`${chalk.red('Invalid task link:')} ${taskLink}`)
    console.log(`Please follow ${chalk.cyan('https://shelf.atlassian.net/browse/SHF-XXX')} format`)
    process.exit(0)
  }

  const taskName = matchRegex(taskLink, JIRA_TASK_REGEX)
  console.log(`Creating merge request for ${chalk.bold.blue(taskName)}`)

  try {
    // const issue = await jiraSdk.issues.getIssue({ issueIdOrKey: taskName })

    // await gitSdk.checkout('master')
    // await gitSdk.createBranch(taskName)
    // await gitSdk.pushOrigin(taskName)

    // const remoteUrl = await gitSdk.getRemoteUrl()
    const remoteUrl = 'git@gitlab.com:eAuction/copart-bidder-extension.git'
    const projectName = matchRegex(remoteUrl.trim(), /\/(.+)\.git/)

    const projects = await gitlabSdk.Projects.search(projectName)
    const project = projects.find(itemm => itemm.ssh_url_to_repo === remoteUrl)
    console.log(project)

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
