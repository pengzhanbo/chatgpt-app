import { createParser } from 'eventsource-parser'
import { buildRequest } from './buildRequest'
import type {
  CompletionDeltaResponse,
  SendMessageRequest,
  SendMessageResponse,
} from './types'
import { SendMessageError } from './types'
import { generateId } from '~/utils'

export function sendMessageStream({
  abortSignal,
  onProgress,
  ...sendRequest
}: Partial<Omit<SendMessageRequest, 'stream'>> & {
  abortSignal?: AbortSignal
  onProgress?: (res: SendMessageResponse) => void
} = {}): Promise<SendMessageResponse> {
  const { url, headers, body } = buildRequest({ ...sendRequest, stream: true })

  let controller: AbortController | null = null
  if (!abortSignal) {
    controller = new AbortController()
    abortSignal = controller.signal
  }
  const result: SendMessageResponse = {
    id: generateId(),
    role: 'assistant',
    created: Date.now(),
    text: '',
  }
  return new Promise<SendMessageResponse>((resolve, reject) => {
    fetchSSE(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: abortSignal,
      onMessage: (data: string) => {
        if (data === '[DONE]') {
          result.text = result.text.trim()
          return resolve(result)
        }
        try {
          const response: CompletionDeltaResponse = JSON.parse(data)
          if (response.id) {
            result.id = response.id
          }
          if (response.choices?.length) {
            const delta = response.choices[0].delta
            if (delta?.content) result.text += delta.content

            if (delta.role) {
              result.role = delta.role
            }
            onProgress?.(result)
          }
        } catch (e) {
          console.warn('OpenAI stream SEE event unexpected error', e)
          return reject(e)
        }
      },
    }).catch(reject)
  })
}

async function fetchSSE(
  url: string,
  options: RequestInit & {
    onMessage: (data: string) => void
    onError?: (error: any) => void
  },
) {
  const { onMessage, onError, ...fetchOptions } = options
  const res = await fetch(url, fetchOptions)

  if (!res.ok) {
    let reason: string

    try {
      reason = await res.text()
    } catch (err) {
      reason = res.statusText
    }

    const msg = `ChatGPT error ${res.status}: ${reason}`
    const error = new SendMessageError(msg, { cause: res })
    error.statusCode = res.status
    error.statusText = res.statusText
    throw error
  }

  const parser = createParser((event) => {
    if (event.type === 'event') {
      onMessage(event.data)
    }
  })

  const feed = (chunk: string) => {
    let response = null

    try {
      response = JSON.parse(chunk)
    } catch {
      // ignore
    }

    if (response?.detail?.type === 'invalid_request_error') {
      const msg = `ChatGPT error ${response.detail.message}: ${response.detail.code} (${response.detail.type})`
      const error = new SendMessageError(msg, { cause: response })
      error.statusCode = response.detail.code
      error.statusText = response.detail.message

      if (onError) {
        onError(error)
      } else {
        console.error(error)
      }

      // don't feed to the event parser
      return
    }

    parser.feed(chunk)
  }

  for await (const chunk of streamAsyncIterable(res.body!)) {
    const str = new TextDecoder().decode(chunk)
    feed(str)
  }
}

async function* streamAsyncIterable<T>(stream: ReadableStream<T>) {
  const reader = stream.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        return
      }
      yield value
    }
  } finally {
    reader.releaseLock()
  }
}
