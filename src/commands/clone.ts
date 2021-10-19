import chalk from 'chalk'
import clear from 'clear'
import inquirer from 'inquirer'
import { Types as GitlabTypes } from '@gitbeaker/node'

import { gitClient } from '../services/git-client'
import { gitlabClient } from '../services/gitlab-client'
import { spinner } from '../services/spinner'

export async function clone (search?: string) {
  if (!search) {
    console.log(chalk.red(`Please provide ${chalk.cyan('[search]')} param`))
    process.exit(0)
  }

  try {
    spinner.start(`Searching for projects: ${chalk.yellow(search)}`)
    const projects = await gitlabClient.Projects.search(search)
    const shelfProjects = projects
      .filter(item => item.namespace.full_path.startsWith('eAuction'))

    spinner.succeed()

    clear()
    const { project } = await inquirer.prompt({
      type: 'list',
      name: 'project',
      message: 'Choose GitLab Project',
      choices: shelfProjects.map(item => ({
        name: `${chalk.yellow(item.name)} (${item.path_with_namespace})`,
        value: item,
      })),
    }) as { project: GitlabTypes.ProjectSchema }

    spinner.start('Cloning GitLab repository')
    await gitClient.clone(project.ssh_url_to_repo)

    spinner.succeed()
    console.log(`Project ${chalk.yellow(project.name)} ${chalk.green('successfully cloned')}`)

    console.log('\nNavigate to project directory:')
    console.log(chalk.cyan(`cd ${project.path}\n`))
  } catch (err) {
    spinner.fail()
    console.error(chalk.red(err))
    process.exit(0)
  }
}
