#!/usr/bin/env node

import chalk from 'chalk'
import { program } from 'commander'
import figlet from 'figlet'

import { init } from './commands/init'
import { logWork } from './commands/log-work'
import { pushMergeRequest } from './commands/push-mr'
import { sendMRToSlack } from './commands/slack-mr'

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
  .command('push-mr [issueLink]')
  .description('Create new branch and related merge request')
  .action(pushMergeRequest)

program
  .command('log-work [timeSpent]')
  .description('Log work time for current issue')
  .action(logWork)

program
  .command('slack-mr [search]')
  .description('Send merge request message to Slack')
  .action(sendMRToSlack)

if (!process.argv.slice(2).length) {
  const figletBanner = figlet.textSync('Shelf CLI', {
    horizontalLayout: 'full',
  })
  console.log(chalk.red(figletBanner))

  program.outputHelp()
  process.exit(0)
}

program.parse(process.argv)
