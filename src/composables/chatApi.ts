import type { ChatMessage, SendMessageOptions } from 'chatgpt'
import { ipcRenderer } from '~/common/electron'
import { generateId } from '~/utils'

export function useChatApi(systemMessage?: string) {
  let senderId!: string
  const sendMessage = async (
    prompt: string,
    options: SendMessageOptions & { conversationId?: string },
  ): Promise<SendMessageResponse> => {
    senderId = generateId()
    if (systemMessage) {
      options.systemMessage = systemMessage
    }
    return await ipcRenderer.invoke(
      'chatGPT:sendMessage',
      prompt,
      options,
      senderId,
    )
  }

  const onMessageProgress = (
    cb: (res: ChatGPTMessage & { original?: ChatMessage }) => void,
  ) => {
    const listener = (
      _: Event,
      res: ChatGPTMessage & { original?: ChatMessage },
      _senderId: string | number,
    ) => {
      _senderId === senderId && cb(res)
    }
    ipcRenderer.on('chatGPT:onProgress', listener)
    const remove = () => ipcRenderer.off('chatGPT:onProgress', listener)
    tryOnScopeDispose(remove)
    return remove
  }

  return {
    sendMessage,
    onMessageProgress,
  }
}
