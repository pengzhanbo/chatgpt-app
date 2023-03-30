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
  accessToken: string
  apiModel: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'
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

interface ChatGPTMessage {
  id: string
  role: 'assistant' | 'user' | 'system'
  text: string
  rendered?: string
  type: 'success' | 'error'
  errorMessage?: string
  createTime: number
  parentMessageId?: string
  conversationId?: string
  retryList?: Omit<ChatGPTMessage, 'retryList'>[]
  original?: any
}

type SendMessageResponse = SendMessageResponseSuccess | SendMessageResponseError

interface SendMessageResponseSuccess {
  type: 'success'
  payload: Omit<ChatGPTMessage, 'retryList'>
}

interface SendMessageResponseError {
  type: 'error'
  code: number
  message: string
  payload: Partial<ChatGPTMessage>
}
