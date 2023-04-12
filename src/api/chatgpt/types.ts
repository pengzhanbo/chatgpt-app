export interface ChatMessage {
  role: Role
  content: string
}

export interface SendMessageRequest {
  baseUrl: string
  apiKey: string
  model: ChatModel
  messages: ChatMessage[]
  stream: boolean
  temperature: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  n: number
  max_tokens: number
  systemMessage: string
}

export interface SendMessageResponse {
  role: Role
  text: string
  created: number
  id: string
}

export class SendMessageError extends Error {
  statusCode?: number
  statusText?: string
  isFinal?: boolean
  accountId?: string
}

export interface CompletionResponse {
  id: string
  created: number
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  choices: {
    message: ChatMessage
    finish_reason: string
    index: number
  }[]
}

export interface CompletionDeltaResponse {
  id: string
  object: 'chat.completion.chunk'
  created: number
  model: string
  choices: [
    {
      delta: {
        role: Role
        content?: string
      }
      index: number
      finish_reason: string | null
    },
  ]
}
