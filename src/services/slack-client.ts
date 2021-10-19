import { WebClient } from '@slack/web-api'
import { config } from '../config'

export const slackClient = new WebClient(config.slackToken)
