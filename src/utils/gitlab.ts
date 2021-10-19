import chalk from 'chalk'
import { gitClient } from '../services/git-client'
import { gitlabClient } from '../services/gitlab-client'
import { matchRegex } from './regex'

export async function getGitlabProject () {
  const remoteUrl = await gitClient.getRemoteUrl()
  const projectName = matchRegex(remoteUrl, /\/([A-z-_]+)\.git/)

  console.log(`Finding Gitlab project ${chalk.yellow(projectName)}`)
  const projects = await gitlabClient.Projects.search(projectName)
  const project = projects.find(item => item.ssh_url_to_repo === remoteUrl)

  if (project === undefined) {
    console.log(`${chalk.red('Project not found:')} ${chalk.cyan(projectName)}`)
    process.exit(0)
  }

  return project
}
