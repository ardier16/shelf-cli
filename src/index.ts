#!/usr/bin/env node

import chalk from 'chalk'
import { program } from 'commander'
import figlet from 'figlet'

import { init } from './commands/init'
import { logWork } from './commands/log-work'
import { pushMergeRequest } from './commands/push-mr'
import { sendMRToSlack } from './commands/slack-mr'
import { clone } from './commands/clone'
import { getTodayWorklog } from './commands/today-worklog'

program
  .name('shelf')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  .version(require('../package.json').version)
  .usage('<command> [options]')
  .description('Shelf.Network CLI')

program
  .command('init')
  .description('Initialize CLI')
  .action(init)

program
  .command('clone [search]')
  .description('Search and clone GitLab project')
  .action(clone)

program
  .command('push-mr [issueLink]')
  .description('Create new branch and related merge request')
  .action(pushMergeRequest)

program
  .command('slack-mr [search]')
  .description('Send merge request message to Slack')
  .action(sendMRToSlack)

program
  .command('log-work [timeSpent]')
  .description('Log work time for current issue')
  .action(logWork)

program
  .command('today-worklog')
  .description('Get today\'s total worklog time')
  .action(getTodayWorklog)

if (!process.argv.slice(2).length) {
  const figletBanner = figlet.textSync('Shelf CLI', {
    horizontalLayout: 'full',
  })
  console.log(chalk.red(figletBanner))

  program.outputHelp()
  process.exit(0)
}

program.parse(process.argv)
