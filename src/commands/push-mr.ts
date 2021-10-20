import chalk from 'chalk'

import { gitClient } from '../services/git-client'
import { gitlabClient } from '../services/gitlab-client'
import { jiraClient } from '../services/jira-client'
import { spinner } from '../services/spinner'

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
    spinner.start(`Finding issue ${chalk.yellow(issueName)}`)
    const issue = await jiraClient.issues.getIssue({ issueIdOrKey: issueName })
    spinner.succeed()

    const project = await getGitlabProject()
    spinner.succeed().start(`Creating branch ${chalk.yellow(issueName)}`)

    await gitClient.checkout('master')
    await gitClient.createBranch(issueName)
    await gitClient.pushOrigin(issueName)

    spinner.succeed()
      .start(`Creating merge request for ${chalk.yellow(issueName)}`)
    const gitlabUser = await gitlabClient.Users.current()
    const mr = await gitlabClient.MergeRequests.create(
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

    spinner.succeed()
    console.log(`Merge request created for the issue ${chalk.yellow(issueName)}`)
    console.log(chalk.green(mr.web_url))
  } catch (err) {
    spinner.fail()
    console.error(chalk.red(err))
    process.exit(0)
  }
}

function testIssueLink (link?: string): boolean {
  return link !== undefined && JIRA_ISSUE_REGEX.test(link)
}
