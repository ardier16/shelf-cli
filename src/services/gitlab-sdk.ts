import { Gitlab } from '@gitbeaker/node'
import config from '../config.json'

export const gitlabSdk = new Gitlab({
  token: config.gitlabToken,
}) 
