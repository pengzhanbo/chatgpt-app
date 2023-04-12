import { buildRequest } from './buildRequest'
import type {
  CompletionResponse,
  SendMessageRequest,
  SendMessageResponse,
} from './types'
import { SendMessageError } from './types'
import { generateId } from '~/utils'

export async function sendMessage({
  abortSignal,
  ...sendRequest
}: Partial<Omit<SendMessageRequest, 'stream'>> & {
  abortSignal?: AbortSignal
} = {}): Promise<SendMessageResponse> {
  const { url, headers, body } = buildRequest(sendRequest)

  let controller: AbortController | null = null
  if (!abortSignal) {
    controller = new AbortController()
    abortSignal = controller.signal
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: abortSignal,
    })
    if (!res.ok) {
      const reason = await res.text()
      const msg = `OpenAI error [${res.status} ${res.statusText}]: ${reason}`
      const error = new SendMessageError(msg, { cause: res })
      error.statusCode = res.status
      error.statusText = res.statusText
      throw error
    }
    const response: CompletionResponse = await res.json()
    let text = ''
    let role: Role = 'assistant'
    if (response?.choices?.length) {
      const first = response.choices[0]
      text = first.message.content
      role = first.message.role || role
    }
    return {
      id: response?.id ?? generateId(),
      created: response?.created,
      text,
      role,
    }
  } catch (e: any) {
    console.error(e)
    throw e
  }
}
