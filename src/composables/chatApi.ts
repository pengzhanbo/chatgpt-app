import type { ChatMessage, SendMessageOptions } from 'chatgpt'
import { ipcRenderer } from '~/common/electron'

export function useChatApi() {
  const hasApiKey = async (): Promise<boolean> => {
    const apiKey = await ipcRenderer.invoke('chatGPT:apiKey')
    return !!apiKey
  }

  const sendMessage = async (
    prompt: string,
    options: SendMessageOptions,
  ): Promise<{
    type: string
    payload?: ChatMessage
    code?: number
    message?: string
  }> => {
    return await ipcRenderer.invoke('chatGPT:sendMessage', prompt, options)
  }

  const updateChatGPT = async () => {
    await ipcRenderer.invoke('chatGPT:update')
  }

  const onMessageProgress = (cb: (res: ChatMessage) => void) => {
    const listener = (_: Event, res: ChatMessage) => cb(res)
    ipcRenderer.on('chatGPT:onProgress', listener)
    const remove = () => ipcRenderer.off('chatGPT:onProgress', listener)
    tryOnScopeDispose(remove)
    return remove
  }

  const onChatGPTUpdate = (
    cb: (res: { type: string; code?: number }) => void,
  ) => {
    const listener = (_: Event, res: any) => cb(res)
    ipcRenderer.on('chatGPT:update', listener)
    const remove = () => ipcRenderer.off('chatGPT:update', listener)
    tryOnScopeDispose(remove)
    return remove
  }

  return {
    hasApiKey,
    sendMessage,
    updateChatGPT,
    onMessageProgress,
    onChatGPTUpdate,
  }
}
