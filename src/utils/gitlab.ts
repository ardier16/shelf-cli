import chalk from 'chalk'
import { gitSdk } from '../services/git-sdk'
import { gitlabSdk } from '../services/gitlab-sdk'
import { matchRegex } from './regex'

export async function getGitlabProject () {
  const remoteUrl = await gitSdk.getRemoteUrl()
  const projectName = matchRegex(remoteUrl, /\/([A-z-_]+)\.git/)

  console.log(`Finding Gitlab project ${chalk.yellow(projectName)}`)
  const projects = await gitlabSdk.Projects.search(projectName)
  const project = projects.find(item => item.ssh_url_to_repo === remoteUrl)

  if (project === undefined) {
    console.log(`${chalk.red('Project not found:')} ${chalk.cyan(projectName)}`)
    process.exit(0)
  }

  return project
}
