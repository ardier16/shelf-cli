# 🚀 Shelf.Network CLI

CLI tools designed specially for Shelf.Network members. Gitlab, Jira & Slack integration provided.

## 🛠 Installation

```bash
yarn global add shelf-cli
```
or

```bash
npm i -g shelf-cli
```

Then initialize CLI by running:

```bash
shelf init
```

## 💻 Usage 

CLI contains commands for easier integration with Gitlab, Jira & Slack.

### ⚙️ Commands

|      | Command           | Description  
| ---- | ----------------- | ---------------
| ✅   | `init`            | Initializes CLI with third-party services
| ✅   | `push-mr`         | Create new branch and related merge request on Gitlab
| ✅   | `slack-mr`        | Remove WIP badge and send merge request message to Slack
| ✅   | `clone`           | Search and clone Gitlab project
| ✅   | `log-work`        | Add worklog for current task to Jira
| ✅   | `today-worklog`   | Get today's total worklog for current user
| 🧑‍💻   | `merge-requests`  | Get user's open merge requests list
| 🧑‍💻   | `issues`          | Get user's issues

### 😎 Cool things

- ✅ TypeScript
- ✅ Shelf.Network logo
- 🧑‍💻 Terminal autocomplete
  - ✅ zsh
  - 🧑‍💻 bash
- 🧑‍💻 Extended help
- 🧑‍💻 NPM package

## Running locally

You should have Node.js 12+ and Yarn installed globally.

### Install dependencies 

```bash
yarn
```

### Run in watch mode 

```bash
yarn start
```

### Build lib

```bash
yarn build
```

### Run linter

```bash
yarn lint
```
