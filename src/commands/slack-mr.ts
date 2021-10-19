import chalk from 'chalk'
import clear from 'clear'
import inquirer from 'inquirer'

import { gitClient } from '../services/git-client'
import { gitlabClient } from '../services/gitlab-client'
import { slackClient } from '../services/slack-client'
import { getGitlabProject } from '../utils/gitlab'

type SlackConversation = {
  id: string,
  name: string,
  fullName: string,
  displayName: string,
  isChannel: boolean,
}

export async function sendMRToSlack(search: string) {
  try {
    if (!search) {
      console.log(chalk.red(`Please provide ${chalk.cyan('[search]')} param`))
      process.exit(0)
    }

    const conversation = await chooseSlackConversation(search)
    if (conversation === undefined) {
      console.log(chalk.red(`No Slack conversations found for ${search}`))
      process.exit(0)
    }

    const branchName = await gitClient.getCurrentBranch()
    const project = await getGitlabProject()

    console.log(`Finding open merge request for ${chalk.yellow(branchName)}`)
    const mergeRequests = await gitlabClient.MergeRequests.all({
      projectId: project.id,
      sourceBranch: branchName,
      targetBranch: 'master',
      state: 'opened',
    })

    if (mergeRequests.length === 0) {
      console.log(chalk.red(`No opened merge requests found for ${branchName}`))
      process.exit(0)
    }

    const mergeRequest = mergeRequests[0]
    if (mergeRequest.title.startsWith('WIP:')) {
      await gitlabClient.MergeRequests.edit(project.id, mergeRequest.iid, {
        title: mergeRequest.title.replace('WIP: ', ''),
      })
      console.log(chalk.cyan('Merge request WIP badge removed'))
    }

    const messageNotifier = conversation.isChannel ? '<!here> ' : ''
    const message = composeIssueMessage(
      `${messageNotifier}*${mergeRequest.title}*\n<${mergeRequest.web_url}>`
    )

    await slackClient.chat.postMessage({
      channel: conversation.id,
      text: message,
    })
    console.log(chalk.green('Message is successfully sent to Slack'))

  } catch (err) {
    console.error(chalk.red(err))
    process.exit(0)
  }
}

function composeIssueMessage (message: string): string {
  const TASK_REGEX = /((SHF-\d+))/
  const TASK_LINK_REPLACER = '<https://shelf.atlassian.net/browse/$1|$1>'

  return message.replace(TASK_REGEX, TASK_LINK_REPLACER)
}

async function searchSlackConversations (search: string):
  Promise<SlackConversation[]> {
  const conversations : SlackConversation[] = []

  console.log(`Searching Slack channels: ${chalk.yellow(search)}`)
  const { channels } = await slackClient.conversations.list({ limit: 100 })
  if (channels !== undefined) {
    const mapped = channels.map(item => ({
      id: item.id || '',
      name: item.name || '',
      fullName: item.name || '',
      displayName: item.name || '',
      isChannel: true,
    }))
    conversations.push(...mapped)
  }

  console.log(`Searching Slack members: ${chalk.yellow(search)}`)
  const { members } = await slackClient.users.list({ limit: 100 })
  if (members !== undefined) {
    const mapped = members
      .filter(item => !item.deleted)
      .map(item => ({
        id: item.id || '',
        name: item.name || '',
        displayName: item.profile?.display_name || item.name || '',
        fullName: item.real_name || '',
        isChannel: false,
      }))
    conversations.push(...mapped)
  }

  return conversations.filter(item => {
    const normalizedSearch = search.toLowerCase()
    return item.name.toLowerCase().includes(normalizedSearch) ||
      item.fullName.toLowerCase().includes(normalizedSearch) ||
      item.displayName.toLowerCase().includes(normalizedSearch)
  })
}

async function chooseSlackConversation (search: string):
  Promise<SlackConversation | undefined> {
  const conversations = await searchSlackConversations(search)
  if (conversations.length === 0) return undefined
  if (conversations.length === 1) return conversations[0]

  clear()
  const { conversationId } = await inquirer.prompt({
    type: 'list',
    name: 'conversationId',
    message: 'Choose Slack conversation',
    choices: conversations.map(item => ({
      name: item.isChannel
        ? `#${item.name}`
        : `${item.fullName} (@${item.displayName})`,
      value: item.id,
    })),
  })

  return conversations.find(item => item.id === conversationId)
}
