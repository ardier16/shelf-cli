import chalk from 'chalk'

import { gitClient } from '../services/git-client'
import { gitlabClient } from '../services/gitlab-client'
import { spinner } from '../services/spinner'

import { matchRegex } from './regex'

export async function getGitlabProject () {
  const remoteUrl = await gitClient.getRemoteUrl()
  const projectName = matchRegex(remoteUrl, /\/([A-z-_]+)\.git/)

  spinner.start(`Finding Gitlab project ${chalk.yellow(projectName)}`)
  const projects = await gitlabClient.Projects.all({
    membership: true,
    perPage: 100,
    search: projectName,
  })
  const project = projects.find(item => item.ssh_url_to_repo === remoteUrl)

  if (project === undefined) {
    spinner.fail()
    console.log(`${chalk.red('Project not found:')} ${chalk.cyan(projectName)}`)
    process.exit(0)
  }

  spinner.succeed()
  return project
}
