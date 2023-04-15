type ChatModel =
  | 'gpt-4'
  | 'gpt-4-0314'
  | 'gpt-4-32k'
  | 'gpt-4-32k-0314'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-0301'

type Role = 'assistant' | 'user' | 'system'

type Locales = 'zh-CN' | 'en-US'

type Preference = 'dark' | 'light' | 'system'

interface AppConfig {
  apiBaseUrl: string
  apiKey: string
  chatModel: ChatModel
  theme: Preference
  locale: Locales
}

interface ChatRecord {
  id: string
  createTime: number
  lastTime: number
  title: string
  pinTitle: boolean
  memoryMode: boolean
  act: string
  prompt?: string
}

interface ChatGPTMessage {
  sendId: string
  id: string
  role: Role
  text: string
  rendered?: string
  type: 'success' | 'error'
  errorCode?: number
  errorMessage?: string
  createTime: number
  retryList?: Omit<ChatGPTMessage, 'retryList'>[]
}
