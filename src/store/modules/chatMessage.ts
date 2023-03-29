import { type ChatMessage } from 'chatgpt'
import { defineStore } from 'pinia'

export interface ChatMessageStore {
  messageList: ChatMessage[]
}

export const useChatMessageStore = defineStore('chat-message', {
  state(): ChatMessageStore {
    return {
      messageList: [],
    }
  },
  actions: {
    initMessageList(list: ChatMessage[]) {
      this.messageList = list
    },
    addUserMessage(id: string, text: string) {
      this.messageList.push({
        id,
        text,
        role: 'user',
      })
    },
    addAssistantEmptyMessage() {
      this.messageList.push({
        role: 'assistant',
      } as ChatMessage)
      return this.messageList.length - 1
    },
    updateAssistantMessage(sendId: number, message: ChatMessage) {
      this.messageList[sendId] = { ...message }
    },
    deleteMessage(index: number) {
      this.messageList.splice(index, 1)
    },
  },
})
