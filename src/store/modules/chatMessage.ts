import { defineStore } from 'pinia'
import { generateId } from '~/utils'

export interface ChatMessageStore {
  messageList: ChatGPTMessage[]
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
    addUserMessage(id: string, text: string) {
      this.messageList.push({
        sendId: id,
        id,
        text,
        type: 'success',
        role: 'user',
        createTime: Date.now(),
      })
    },
    addAssistantEmptyMessage() {
      this.messageList.push({
        sendId: generateId(),
        id: '',
        role: 'assistant',
        type: 'success',
        text: '',
      } as ChatGPTMessage)
      return this.messageList.length - 1
    },
    updateAssistantMessage(sendId: number, message: Partial<ChatGPTMessage>) {
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
