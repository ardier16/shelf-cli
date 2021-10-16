#!/usr/bin/env node

import chalk from 'chalk'
import clear from 'clear'
import { program } from 'commander'
import figlet from 'figlet'

import { init } from './commands/init'
import config from './config.json'

clear()

program
  .name('shelf')
  .version(config.version)
  .usage('<command> [options]')
  .description("Shelf.Network CLI")

program
  .command('init')
  .description('Initialize CLI')
  .action(init)

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  const figletBanner = figlet.textSync('Shelf CLI', {
    horizontalLayout: 'full',
  })
  console.log(chalk.red(figletBanner))

  program.outputHelp()
  process.exit(0)
}
