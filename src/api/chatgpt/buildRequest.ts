import type { ChatMessage, SendMessageRequest } from './types'
import { estimateTokens } from '~/utils'

const MAX_REQUEST_TOKEN = 2048
const MAX_TOKEN = 4000

export function buildRequest({
  baseUrl = 'https://api.openai.com',
  apiKey = '',
  systemMessage,
  ...body
}: Partial<SendMessageRequest> = {}) {
  const url = `${baseUrl}/v1/chat/completions`
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  }
  if (!systemMessage) {
    const currentDate = new Date().toISOString().split('T')[0]
    systemMessage = `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.\nKnowledge cutoff: 2021-09-01\nCurrent date: ${currentDate}`
  }

  const headMessage: ChatMessage = {
    role: 'system',
    content: systemMessage,
  }
  const messages: ChatMessage[] = []
  const bodyMessages = body.messages || []
  let numToken = estimateTokens(systemMessage)
  let item: ChatMessage | undefined
  // eslint-disable-next-line no-cond-assign
  while ((item = bodyMessages.pop())) {
    numToken += estimateTokens(item.content)
    if (numToken > MAX_REQUEST_TOKEN) break
    messages.unshift(item)
  }
  messages.unshift(headMessage)

  body = {
    model: 'gpt-3.5-turbo',
    stream: false,
    temperature: 0.8,
    top_p: 1.0,
    presence_penalty: 1.0,
    max_tokens: MAX_TOKEN - numToken,
    ...body,
    messages,
  }

  return { url, headers, body }
}
