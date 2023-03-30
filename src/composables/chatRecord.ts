import type { MaybeRef } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { generateId } from '~/utils'

export function useChatRecord() {
  const chatDB = useChatDB()
  const recordStore = useChatRecordStore()

  const { recordList } = storeToRefs(recordStore)

  async function loadChatRecord() {
    const recordListRaw = await chatDB.get('recordList')
    recordStore.initRecordList(recordListRaw || [])
  }

  function createChatRecord(
    record: MaybeRef<Partial<ChatRecord>> = {},
  ): ChatRecord {
    const raw = resolveUnref(record)
    raw.id ??= generateId()
    raw.createTime ??= Date.now()
    raw.lastTime ??= raw.createTime
    raw.type ??= 'active'
    raw.title ??= 'New Chat'
    return raw as ChatRecord
  }

  async function addChatRecord(record: MaybeRef<ChatRecord>) {
    const raw = resolveUnref(record)
    if (recordList.value.some((item) => item.id === raw.id)) return
    recordStore.addChatRecord(raw)
    await chatDB.put('recordList', toRaw(recordList.value))
  }

  async function updateChatRecord(record: MaybeRef<Partial<ChatRecord>>) {
    const raw = resolveUnref(record)
    recordStore.updateChatRecord(raw)
    await chatDB.put('recordList', toRaw(recordList.value))
  }

  async function deleteChatRecord(id: string) {
    recordStore.deleteChatRecord(id)
    await chatDB.put('recordList', toRaw(recordList.value))
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
