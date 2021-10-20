import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { resolve } from 'path'

const script = `
#compdef shelf

local -a commands
commands=(
  'push-mr:Push merge request'
  'slack-mr:Send merge request to Slack'
  'log-work:Log work time'
  'today-worklog:Get worklog for today'
)

_describe 'command' commands
`

const ZSH_FUNCTIONS_FPATH = 'fpath=(~/.zsh/functions $fpath)'
const AUTOLOAD_COMMAND = 'autoload -Uz compinit && compinit'

const HOME = homedir()
const ZSH_FUNCTIONS_PATH = resolve(HOME, '.zsh/functions')
const ZSHRC_PATH = resolve(HOME, '.zshrc')

const SHELF_SCRIPT_PATH = resolve(ZSH_FUNCTIONS_PATH, '_shelf')

export function initAutocomplete () {
  try {
    if (!existsSync(ZSHRC_PATH)) return

    if (!existsSync(ZSH_FUNCTIONS_PATH)) {
      mkdirSync(ZSH_FUNCTIONS_PATH, { recursive: true })
    }

    if (!existsSync(ZSH_FUNCTIONS_PATH)) {
      mkdirSync(ZSH_FUNCTIONS_PATH)
    }

    if (existsSync(SHELF_SCRIPT_PATH)) {
      writeFileSync(SHELF_SCRIPT_PATH, script)
    } else {
      appendFileSync(SHELF_SCRIPT_PATH, script)
    }

    let zshConfig = readFileSync(ZSHRC_PATH).toString()
    if (!zshConfig.includes(ZSH_FUNCTIONS_FPATH)) {
      zshConfig += `\n${ZSH_FUNCTIONS_FPATH}\n`
    }

    if (!zshConfig.includes(AUTOLOAD_COMMAND)) {
      zshConfig += `${AUTOLOAD_COMMAND}\n`
    }

    writeFileSync(ZSHRC_PATH, zshConfig)
  } catch (err) {
    process.exit()
  }
}
