import type { MaybeRef } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { renderMarkdown } from './markdown'
import { generateId } from '~/utils'

export function useChatMessage(id: MaybeRef<string>) {
  const chatId = resolveRef(id)
  const history = useChatHistoryDB()
  const messageStore = useChatMessageStore()
  const { messageList } = storeToRefs(messageStore)

  async function loadChatMessage(id: string) {
    if (id) {
      const rawList = await history.get<ChatGPTMessage[]>(id)
      messageStore.initMessageList(rawList || [])
    } else {
      messageStore.initMessageList([])
    }
  }

  async function updateHistory() {
    await history.set(chatId.value, toRaw(messageList.value))
    await history.save()
  }

  async function updateAssistantMessage(
    sendId: number,
    message: MaybeRef<Partial<ChatGPTMessage>>,
    updateDB = false,
  ) {
    const raw = resolveUnref(message)
    messageStore.updateAssistantMessage(sendId, raw)
    updateDB && (await updateHistory())
    return messageList.value[sendId]
  }

  async function addUserMessage(text: string) {
    const rendered = renderMarkdown(text)
    messageStore.addUserMessage(generateId(), text, rendered)
    await updateHistory()
    return messageList.value[messageList.value.length - 1]
  }

  function addAssistantEmptyMessage() {
    messageStore.addAssistantEmptyMessage()
    return messageList.value.length - 1
  }

  async function deleteChatMessage(id: number) {
    messageStore.deleteMessage(id)
    await updateHistory()
  }

  async function clearChatMessage(id: string, clearStore = false) {
    await history.delete(id || chatId.value)
    clearStore && messageStore.initMessageList([])
  }

  return {
    messageList,
    loadChatMessage,
    addUserMessage,
    addAssistantEmptyMessage,
    updateAssistantMessage,
    deleteChatMessage,
    clearChatMessage,
  }
}
