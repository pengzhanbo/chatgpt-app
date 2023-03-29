import { invoke } from '~/common/electron'

export interface BatchOperation {
  type: 'put' | 'get' | 'del'
  key: string
  value?: any
}

const CHAT_GPT = 'chat_GPT'
const CHAT_GPT_HISTORY = 'history'

export function useDB(dbName: string, subName?: string) {
  const name = `db:${dbName}${subName ? `:${subName}` : ''}`

  const get = <T = any>(key: string): Promise<T> => invoke(`${name}:get`, key)

  const put = (key: string, value: any): Promise<void> =>
    invoke(`${name}:put`, key, toRaw(value))

  const del = (key: string): Promise<void> => invoke(`${name}:del`, key)

  const batch = async (operations: BatchOperation[]): Promise<void> => {
    operations = operations.map((operation) => {
      if (operation.type === 'put' && operation.value)
        operation.value = toRaw(operation.value)
      return operation
    })
    await invoke(`${name}:batch`, operations)
  }

  const clear = (): Promise<void> => invoke(`${name}:clear`)

  return { get, put, del, batch, clear }
}

export const useChatDB = () => useDB(CHAT_GPT)
export const useChatHistoryDB = () => useDB(CHAT_GPT, CHAT_GPT_HISTORY)
