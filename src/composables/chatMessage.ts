import type { MaybeRef } from '@vueuse/core'
import type { ChatMessage } from 'chatgpt'
import { escape } from 'html-escaper'
import { storeToRefs } from 'pinia'
import { markdownRender } from './markdown'
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
    const rendered = await markdownRender(text)
    messageStore.addUserMessage(generateId(), text, rendered)
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

  async function clearChatMessage(id: string, clearStore = false) {
    await history.del(id || chatId.value)
    clearStore && messageStore.initMessageList([])
  }

  function getLastContext() {
    const assistantList = messageList.value.filter(
      (item) => item.role === 'assistant',
    )
    const lastContext = assistantList[assistantList.length - 1]
    const parentMessageId = lastContext?.parentMessageId
    const conversationId = lastContext?.conversationId

    return { parentMessageId, conversationId }
  }

  return {
    messageList,
    loadChatMessage,
    addUserMessage,
    addAssistantEmptyMessage,
    updateAssistantMessage,
    deleteChatMessage,
    clearChatMessage,
    getLastContext,
  }
}

export function transformUserMessage(text: string): string {
  return escape(text)
    .replace(/^\n+|\n+$/g, '')
    .split(/\n+/)
    .map((str) => `<p>${str}</p>`)
    .join('')
}
