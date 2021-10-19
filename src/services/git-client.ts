import { exec } from 'child_process'

export class GitClient {
  async checkout (branch: string): Promise<void> {
    try {
      await this._execCommand(`git checkout ${branch}`)
    } catch (err) {
      if (!String(err).startsWith('Already on')) {
        throw err
      }
    }
  }

  createBranch (branch: string): Promise<string> {
    return this._execCommand(`git checkout -b ${branch}`)
  }

  getCurrentBranch (): Promise<string> {
    return this._execCommand('git branch --show-current')
  }

  pushOrigin (branch: string): Promise<string> {
    return this._execCommand(`git push --set-upstream origin ${branch}`)
  }

  getRemoteUrl (): Promise<string> {
    return this._execCommand('git remote get-url --push origin')
  }

  _execCommand (command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error)
        }

        const output = stdout || stderr || ''
        resolve(output.trim())
      })
    })
  }
}

export const gitClient = new GitClient()
