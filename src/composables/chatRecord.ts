import type { MaybeRef } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useDB } from './db'
import { useChatRecordStore } from '~/store'
import { generateId } from '~/utils'

export function useChatRecord() {
  const chatDB = useDB()
  const recordStore = useChatRecordStore()

  const { recordList } = storeToRefs(recordStore)

  async function loadChatRecord() {
    const recordListRaw = await chatDB.get<ChatRecord[]>('chat_record_list')
    recordStore.initRecordList(recordListRaw || [])
  }

  function createChatRecord(
    record: MaybeRef<Partial<ChatRecord>> = {},
  ): ChatRecord {
    const raw = resolveUnref(record)
    raw.id ??= generateId()
    raw.createTime ??= Date.now()
    raw.lastTime ??= raw.createTime
    raw.title ??= 'New Chat'
    raw.memoryMode ??= true
    return raw as ChatRecord
  }

  async function addChatRecord(record: MaybeRef<ChatRecord>) {
    const raw = resolveUnref(record)
    if (recordList.value.some((item) => item.id === raw.id)) return
    recordStore.addChatRecord(raw)
    await chatDB.set('chat_record_list', toRaw(recordList.value))
    await chatDB.save()
  }

  async function updateChatRecord(record: MaybeRef<Partial<ChatRecord>>) {
    const raw = resolveUnref(record)
    recordStore.updateChatRecord(raw)
    await chatDB.set('chat_record_list', toRaw(recordList.value))
    await chatDB.save()
  }

  async function deleteChatRecord(id: string) {
    recordStore.deleteChatRecord(id)
    await chatDB.set('chat_record_list', toRaw(recordList.value))
    await chatDB.save()
  }

  return {
    recordList,
    loadChatRecord,
    createChatRecord,
    addChatRecord,
    updateChatRecord,
    deleteChatRecord,
  }
}
