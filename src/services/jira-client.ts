import { Version2Client } from 'jira.js'
import { config } from '../config'

export const jiraClient = new Version2Client({
  host: 'https://shelf.atlassian.net',
  authentication: {
    basic: {
      email: config.jiraEmail,
      apiToken: config.jiraToken,
    },
  },
})

