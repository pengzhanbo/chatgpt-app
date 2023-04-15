import { defineStore } from 'pinia'

export interface ChatRecordStore {
  recordList: ChatRecord[]
}

export const useChatRecordStore = defineStore('chat-record', {
  state(): ChatRecordStore {
    return {
      recordList: [],
    }
  },
  actions: {
    initRecordList(list: ChatRecord[]) {
      this.recordList = list
    },
    addChatRecord(record: ChatRecord) {
      this.recordList.unshift(record)
    },
    updateChatRecord(record: Partial<ChatRecord>) {
      record.lastTime = Date.now()
      const { id, title, ...other } = record
      const index = this.recordList.findIndex((item) => item.id === id)
      if (index !== -1) {
        const raw = this.recordList[index]
        this.recordList[index] = {
          ...raw,
          title: raw.pinTitle ? raw.title : title || raw.title,
          ...other,
        }
      }
    },
    deleteChatRecord(id: string) {
      const index = this.recordList.findIndex((item) => item.id === id)
      if (index !== -1) {
        this.recordList.splice(index, 1)
      }
    },
  },
})
