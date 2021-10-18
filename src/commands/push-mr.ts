import chalk from 'chalk'

import { gitSdk } from '../services/git-sdk'
import { gitlabSdk } from '../services/gitlab-sdk'
import { jiraSdk } from '../services/jira-sdk'

import { matchRegex } from '../utils/regex'

const JIRA_ISSUE_REGEX = /https:\/\/shelf\.atlassian\.net\/browse\/(SHF-\d+)/

export async function pushMergeRequest(issueLink: string) {
  if (!testIssueLink(issueLink)) {
    console.log(`${chalk.red('Invalid issue link:')} ${issueLink}`)
    console.log(`Please follow ${chalk.cyan('https://shelf.atlassian.net/browse/SHF-XXX')} format`)
    process.exit(0)
  }

  const issueName = matchRegex(issueLink, JIRA_ISSUE_REGEX)
  try {
    console.log(`Finding issue ${chalk.yellow(issueName)}`)
    const issue = await jiraSdk.issues.getIssue({ issueIdOrKey: issueName })

    console.log(`Creating branch ${chalk.yellow(issueName)}`)
    await gitSdk.checkout('master')
    await gitSdk.createBranch(issueName)
    await gitSdk.pushOrigin(issueName)

    const remoteUrl = await gitSdk.getRemoteUrl()
    const projectName = matchRegex(remoteUrl, /\/(.+)\.git/)

    console.log(`Finding Gitlab project ${chalk.yellow(projectName)}`)
    const projects = await gitlabSdk.Projects.search(projectName)
    const project = projects.find(item => item.ssh_url_to_repo === remoteUrl)
    if (project === undefined) {
      console.log(`${chalk.red('Project not found:')} ${chalk.cyan(projectName)}`)
      process.exit(0)
    }

    console.log(`Creating merge request for ${chalk.yellow(issueName)}`)
    const mr = await gitlabSdk.MergeRequests.create(
      project.id,
      issueName,
      'master',
      `WIP: [${issueName}] ${issue.fields.summary}`
    )
    console.log(`Merge request created for the issue ${chalk.yellow(issueName)}`)
    console.log(chalk.green(mr.web_url))
  } catch (err) {
    if (typeof err !== 'string' || !err.startsWith('Already on \'master\'')) {
      console.error(chalk.red(err))
      process.exit(0)
    }
  }
}

function testIssueLink (link?: string): boolean {
  return link !== undefined && JIRA_ISSUE_REGEX.test(link)
}
