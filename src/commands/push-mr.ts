import chalk from 'chalk'

import { gitSdk } from '../services/git-sdk'
import { gitlabSdk } from '../services/gitlab-sdk'
import { jiraSdk } from '../services/jira-sdk'

import { getGitlabProject } from '../utils/gitlab'
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
    const project = await getGitlabProject()

    console.log(`Creating branch ${chalk.yellow(issueName)}`)
    await gitSdk.checkout('master')
    await gitSdk.createBranch(issueName)
    await gitSdk.pushOrigin(issueName)

    console.log(`Creating merge request for ${chalk.yellow(issueName)}`)
    const gitlabUser = await gitlabSdk.Users.current()
    const mr = await gitlabSdk.MergeRequests.create(
      project.id,
      issueName,
      'master',
      `WIP: [${issueName}] ${issue.fields.summary}`,
      {
        assigneeId: gitlabUser.id,
        description: issueLink,
        squash: true,
        removeSourceBranch: true,
      }
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
