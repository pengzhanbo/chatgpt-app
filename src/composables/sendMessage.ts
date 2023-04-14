import { useAppConfig } from './appConfig'
import { useChatHistoryDB } from './db'
import { renderText } from './markdown'
import type { ChatMessage, SendMessageRequest } from '~/api/chatgpt'
import {
  sendMessage as sendMessageApi,
  sendMessageStream as sendMessageStreamApi,
} from '~/api/chatgpt'

export interface SendMessageOptions {
  prompt?: string
  stream?: boolean
  memory: boolean
  historyId?: string
  systemMessage?: string
  retryIndex?: number
  abortSignal?: AbortSignal
  renderType?: 'md' | 'text'
  onMessage?: (res: ChatGPTMessage) => void
}

export async function sendMessage({
  prompt = '',
  stream = false,
  memory = true,
  historyId,
  retryIndex,
  abortSignal,
  systemMessage,
  renderType = 'md',
  onMessage,
}: SendMessageOptions): Promise<Omit<ChatGPTMessage, 'sendId'>> {
  const { appConfig } = useAppConfig()
  const messages: ChatMessage[] = []

  if (historyId) {
    const db = useChatHistoryDB()
    let list = (await db.get<ChatGPTMessage[]>(historyId)) || []

    if (typeof retryIndex !== 'undefined') {
      retryIndex = Math.min(retryIndex, list.length - 1)
      retryIndex = Math.max(retryIndex, 0)
      // 如果重试位置是 user，则直接以当前信息 retry
      // 如果重试位置是 assistant, 则往上层查找最近的 user retry
      if (list[retryIndex].role === 'user') {
        prompt = list[retryIndex].text
        list = list.slice(0, retryIndex)
      } else {
        const lastUserIndex = list
          .slice(0, retryIndex)
          .findLastIndex((_) => _.role === 'user')
        prompt = list[lastUserIndex].text
        list = list.slice(0, lastUserIndex)
      }
    }

    if (memory) {
      let item: ChatGPTMessage | undefined
      // eslint-disable-next-line no-cond-assign
      while ((item = list.pop())) {
        const { role, text } = item
        messages.unshift({ role, content: text })
      }
    }
  }

  messages.push({ role: 'user', content: prompt })

  const options: Partial<SendMessageRequest> = {
    baseUrl: appConfig.value?.apiBaseUrl,
    apiKey: appConfig.value?.apiKey,
    model: appConfig.value?.chatModel,
    messages,
    systemMessage,
  }
  let result: Partial<ChatGPTMessage> = {}
  try {
    const response = stream
      ? await sendMessageStreamApi({
          ...options,
          abortSignal,
          onProgress: (response) => {
            result = {
              type: 'success',
              text: response.text,
              createTime: response.created,
              errorMessage: '',
              id: response.id,
              role: response.role,
              rendered:
                renderType === 'text'
                  ? renderText(response.text)
                  : renderMarkdown(response.text),
            }
            onMessage?.(result as ChatGPTMessage)
          },
        })
      : await sendMessageApi({ ...options, abortSignal })
    return {
      type: 'success',
      text: response.text,
      createTime: response.created,
      errorMessage: '',
      id: response.id,
      role: response.role,
      rendered:
        renderType === 'text'
          ? renderText(response.text)
          : renderMarkdown(response.text),
    }
  } catch (e: any) {
    return {
      text: '',
      role: 'assistant',
      id: '',
      createTime: Date.now(),
      ...result,
      type: 'error',
      errorCode: e.statusCode,
      errorMessage: e.message,
    }
  }
}
