#!/usr/bin/env node

import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'

clear()
console.log(
  chalk.yellow(
    figlet.textSync('Shelf CLI', { horizontalLayout: 'full' })
  )
)
