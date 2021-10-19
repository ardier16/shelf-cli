import { Gitlab } from '@gitbeaker/node'
import { config } from '../config'

export const gitlabClient = new Gitlab({
  token: config.gitlabToken,
})
