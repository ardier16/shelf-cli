import { WebClient } from '@slack/web-api'
import { config } from '../config'

export const SLACK_SCOPES = Object.freeze([
  'identify',
  'channels:history',
  'im:history',
  'channels:read',
  'groups:read',
  'search:read',
  'users:read',
  'chat:write',
])

export const slackClient = new WebClient(config.slackToken)
