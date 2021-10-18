import chalk from 'chalk'

import { gitSdk } from '../services/git-sdk'
import { gitlabSdk } from '../services/gitlab-sdk'
import { getGitlabProject } from '../utils/gitlab'

export async function sendMRToSlack() {
  try {
    const branchName = await gitSdk.getCurrentBranch()
    const project = await getGitlabProject()

    console.log(`Finding open merge request for ${chalk.yellow(branchName)}`)
    const mergeRequests = await gitlabSdk.MergeRequests.all({
      projectId: project.id,
      sourceBranch: branchName,
      targetBranch: 'master',
      state: 'opened',
    })

    if (mergeRequests.length === 0) {
      console.log(chalk.red(`No opened merge requests found for ${branchName}`))
      process.exit(0)
    }

    const mergeRequest = mergeRequests[0]
    if (mergeRequest.title.startsWith('WIP:')) {
      await gitlabSdk.MergeRequests.edit(project.id, mergeRequest.iid, {
        title: mergeRequest.title.replace('WIP: ', ''),
      })
      console.log(chalk.cyan(`Merge request WIP badge removed`))
    }

    const message = composeIssueMessage(
      `<!here> *${mergeRequest.title}*\n<${mergeRequest.web_url}>`
    )
    console.log(message)
  } catch (err) {
    console.error(chalk.red(err))
    process.exit(0)
  }
}


function composeIssueMessage (message: string): string {
  const TASK_REGEX = /((SHF-\d+))/
  const TASK_LINK_REPLACER = '<https://shelf.atlassian.net/browse/$1|$1>'

  return message.replace(TASK_REGEX, TASK_LINK_REPLACER)
}
