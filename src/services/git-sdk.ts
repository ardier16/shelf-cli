import { exec } from 'child_process'

export class GitSdk {
  checkout (branch: string): Promise<string> {
    return this._execCommand(`git checkout ${branch}`)
  }

  createBranch (branch: string): Promise<string> {
    return this._execCommand(`git checkout -b ${branch}`)
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

export const gitSdk = new GitSdk()
