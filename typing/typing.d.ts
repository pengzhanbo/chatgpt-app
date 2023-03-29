type ChatModel = 'gpt-4' | 'gpt-4-0314' | 'gpt-4-32k' | 'gpt-4-32k-0314' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301' | string

type Locales = 'zh-CN' | 'en-US' | string

type Preference = 'dark' | 'light' | 'system'

interface AppConfig {
  // normal
  preference: Preference
  locale: Locales
  // proxy
  httpProxy: string
  socksProxyHost: string
  socksProxyPort: string
  // openai chatGPT
  openAIApiKey: string
  chatModel: ChatModel
  timeout: number
}

interface ChatRecord {
  id: string
  createTime: number
  lastTime: number
  title: string
  type: 'active' | 'history'
}
