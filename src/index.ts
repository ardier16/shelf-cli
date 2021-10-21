#!/usr/bin/env node

import chalk from 'chalk'
import { program } from 'commander'
import figlet from 'figlet'

import { COMMANDS } from './commands'
import { initAutocomplete } from './utils/autocomplete'

if (process.argv.includes('--init-autocomplete')) {
  initAutocomplete()
  process.exit()
}

program
  .name('shelf')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  .version(require('../package.json').version)
  .usage('<command> [options]')
  .description('Shelf.Network CLI')

COMMANDS.forEach(command => {
  program
    .command([command.name, command.arguments].join(' ').trim())
    .description(command.description)
    .action(command.action)
})

if (!process.argv.slice(2).length) {
  const figletBanner = figlet.textSync('Shelf CLI', {
    horizontalLayout: 'full',
  })
  console.log(chalk.red(figletBanner))

  program.outputHelp()
  process.exit(0)
}

program.parse(process.argv)
