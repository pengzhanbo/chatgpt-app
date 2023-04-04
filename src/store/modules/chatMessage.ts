import { type ChatMessage } from '@pengzhanbo/chatgpt'
import { defineStore } from 'pinia'

export interface ChatMessageStore {
  messageList: (ChatGPTMessage & { original?: ChatMessage })[]
}

export const useChatMessageStore = defineStore('chat-message', {
  state(): ChatMessageStore {
    return {
      messageList: [],
    }
  },
  actions: {
    initMessageList(list: ChatGPTMessage[]) {
      this.messageList = list || []
    },
    addUserMessage(id: string, text: string, rendered: string) {
      this.messageList.push({
        id,
        text,
        rendered,
        type: 'success',
        role: 'user',
        createTime: Date.now(),
      })
    },
    addAssistantEmptyMessage() {
      this.messageList.push({
        role: 'assistant',
        type: 'success',
        text: '',
        rendered: '',
      } as ChatGPTMessage)
      return this.messageList.length - 1
    },
    updateAssistantMessage(
      sendId: number,
      message: Partial<ChatGPTMessage & { original: ChatMessage }>,
    ) {
      this.messageList[sendId] = {
        ...this.messageList[sendId],
        ...message,
      }
    },
    deleteMessage(index: number) {
      this.messageList.splice(index, 1)
    },
  },
})
