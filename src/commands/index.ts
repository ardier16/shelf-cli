import { init } from './init'
import { logWork } from './log-work'
import { pushMergeRequest } from './push-mr'
import { sendMRToSlack } from './slack-mr'
import { clone } from './clone'
import { getTodayWorklog } from './today-worklog'

type Command = {
  name: string,
  description: string,
  arguments: string,
  action: (...args: string[]) => void
}

export const COMMANDS : Command[] = [
  {
    name: 'init',
    description: 'Initialize CLI',
    arguments: '',
    action: init,
  },
  {
    name: 'clone',
    arguments: '[search]',
    description: 'Search and clone GitLab project',
    action: clone,
  },
  {
    name: 'push-mr',
    arguments: '[issueLink]',
    description: 'Create new branch and related merge request',
    action: pushMergeRequest,
  },
  {
    name: 'slack-mr',
    arguments: '[search]',
    description: 'Send merge request message to Slack',
    action: sendMRToSlack,
  },
  {
    name: 'log-work',
    arguments: '[timeSpent]',
    description: 'Log work time for current issue',
    action: logWork,
  },
  {
    name: 'today-worklog',
    arguments: '',
    description: 'Get today\'s total worklog time',
    action: getTodayWorklog,
  },
]

