import type { MaybeRef } from '@vueuse/core'
import type { ChatMessage } from 'chatgpt'
import { escape } from 'html-escaper'
import { storeToRefs } from 'pinia'
import { useChatHistoryDB } from './db'
import { useChatMessageStore } from '~/store'
import { generateId } from '~/utils'

export function useChatMessage(id: MaybeRef<string>) {
  const chatId = resolveRef(id)
  const history = useChatHistoryDB()
  const messageStore = useChatMessageStore()
  const { messageList } = storeToRefs(messageStore)

  async function loadChatMessage() {
    const rawList = await history.get(chatId.value)
    messageStore.initMessageList(rawList || [])
  }

  async function updateHistory() {
    await history.put(chatId.value, toRaw(messageList.value))
  }

  async function addUserMessage(text: string) {
    messageStore.addUserMessage(generateId(), text, transformUserMessage(text))
    await updateHistory()
    return messageList.value[messageList.value.length - 1]
  }

  async function updateAssistantMessage(
    sendId: number,
    message: MaybeRef<Partial<ChatGPTMessage & { original?: ChatMessage }>>,
    updateDB = false,
  ) {
    const raw = resolveUnref(message)
    messageStore.updateAssistantMessage(sendId, raw)
    updateDB && (await updateHistory())
    return messageList.value[sendId]
  }

  function addAssistantEmptyMessage() {
    messageStore.addAssistantEmptyMessage()
    return messageList.value.length - 1
  }

  async function deleteChatMessage(id: number) {
    messageStore.deleteMessage(id)
    await updateHistory()
  }

  async function deleteAllChatMessage(id: string) {
    await history.del(id)
  }

  return {
    messageList,
    loadChatMessage,
    addUserMessage,
    addAssistantEmptyMessage,
    updateAssistantMessage,
    deleteChatMessage,
    deleteAllChatMessage,
  }
}

function transformUserMessage(text: string): string {
  return escape(text)
    .split(/\n+/)
    .map((str) => `<p>${str}</p>`)
    .join('')
}
