import { Version2Client } from 'jira.js'
import config from '../config.json'

export const jiraSdk = new Version2Client({
  host: 'https://shelf.atlassian.net',
  authentication: {
    basic: {
      email: config.jiraEmail,
      apiToken: config.jiraToken,
    },
  },
})

