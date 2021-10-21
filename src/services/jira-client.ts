import { Version2Client } from 'jira.js'
import { config } from '../config'

export const JIRA_HOST = 'https://shelf.atlassian.net'

export const jiraClient = new Version2Client({
  host: JIRA_HOST,
  authentication: {
    basic: {
      email: config.jiraEmail,
      apiToken: config.jiraToken,
    },
  },
})
