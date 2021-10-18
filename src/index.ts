#!/usr/bin/env node

import chalk from 'chalk'
import clear from 'clear'
import { program } from 'commander'
import figlet from 'figlet'

import { init } from './commands/init'
import { pushMergeRequest } from './commands/push-mr'

// ts-ignore
import packageJson from '../package.json'

clear()

program
  .name('shelf')
  .version(packageJson.version)
  .usage('<command> [options]')
  .description("Shelf.Network CLI")

program
  .command('init')
  .description('Initialize CLI')
  .action(init)

program
  .command('push-mr [taskLink]')
  .description('Create new branch and related merge request')
  .action(pushMergeRequest)

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  const figletBanner = figlet.textSync('Shelf CLI', {
    horizontalLayout: 'full',
  })
  console.log(chalk.red(figletBanner))

  program.outputHelp()
  process.exit(0)
}
