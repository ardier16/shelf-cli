import { Gitlab } from '@gitbeaker/node'
import { config } from '../config'

export const gitlabSdk = new Gitlab({
  token: config.gitlabToken,
})
