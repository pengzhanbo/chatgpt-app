import type { ChatMessage, SendMessageOptions } from 'chatgpt'
import { ipcRenderer } from '~/common/electron'

export function useChatApi() {
  const sendMessage = async (
    prompt: string,
    options: SendMessageOptions & { conversationId?: string },
    senderId: number | string,
  ): Promise<SendMessageResponse> => {
    return await ipcRenderer.invoke(
      'chatGPT:sendMessage',
      prompt,
      options,
      senderId,
    )
  }

  const onMessageProgress = (
    cb: (
      res: ChatGPTMessage & { original?: ChatMessage },
      senderId: string | number,
    ) => void,
  ) => {
    const listener = (
      _: Event,
      res: ChatGPTMessage & { original?: ChatMessage },
      senderId: string | number,
    ) => cb(res, senderId)
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
