#!/usr/bin/env node

import chalk from 'chalk'
import { program } from 'commander'
import figlet from 'figlet'

import { init } from './commands/init'
import { pushMergeRequest } from './commands/push-mr'

program
  .name('shelf')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  .version(require('../package.json').version)
  .usage('<command> [options]')
  .description("Shelf.Network CLI")

program
  .command('init')
  .description('Initialize CLI')
  .action(init)

program
  .command('push-mr [issueLink]')
  .description('Create new branch and related merge request')
  .action(pushMergeRequest)

if (!process.argv.slice(2).length) {
  const figletBanner = figlet.textSync('Shelf CLI', {
    horizontalLayout: 'full',
  })
  console.log(chalk.red(figletBanner))

  program.outputHelp()
  process.exit(0)
}

program.parse(process.argv)
