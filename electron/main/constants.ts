import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

export const appDir = join(getTmpDir(), '.chatGPT_app_5f2664478b5160b6')

function getTmpDir() {
  if (process.env.NODE_ENV === 'development') {
    return join(process.cwd(), 'node_modules/.chatgpt')
  }
  return tmpdir ? tmpdir() : homedir()
}

export const DB_NAME = {
  CHAT_GPT: 'chat_GPT',
  CHAT_GPT_HISTORY: 'history',
}

export const defaultAppConfig: AppConfig = {
  preference: 'system',
  locale: 'zh-CN',
  apiModel: 'ChatGPTAPI',
  accessToken: '',
  openAIApiKey: '',
  chatModel: 'gpt-3.5-turbo',
  timeout: 60 * 1000,
  httpProxy: '',
  socksProxyHost: '',
  socksProxyPort: '',
}

export const codeLanguageAlias = {
  bash: 'sh',
  shell: 'sh',
  zsh: 'sh',
  csharp: 'cs',
  fsharp: 'fs',
  dockerfile: 'docker',
  javascript: 'js',
  typescript: 'ts',
  kotlin: 'kt',
  markdown: 'md',
  python: 'py',
  ruby: 'rb',
  rust: 'rs',
  stylus: 'styl',
  yaml: 'yml',
}
