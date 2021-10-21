#!/usr/bin/env node

import chalk from 'chalk'
import { program } from 'commander'
import figlet from 'figlet'

import { ShelfCommandAction, COMMANDS, ShelfCommand } from './commands'
import { config } from './config'
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
  .showHelpAfterError()

COMMANDS.forEach(command => {
  program
    .command([command.name, command.arguments].join(' ').trim())
    .description(command.description)
    .action(wrapAction(command))
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

function wrapAction (command: ShelfCommand): ShelfCommandAction {
  return (...args: string[]) => {
    const isInitialized = Object.values(config)
      .every(item => item !== '')

    if (!isInitialized && command.name !== 'init') {
      console.log(chalk.red('CLI is not initialized yet'))
      console.log(`Run ${chalk.yellow('shelf init')} to initialize CLI`)
      process.exit()
    }

    command.action(...args)
  }
}
