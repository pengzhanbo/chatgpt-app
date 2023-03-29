import type { Level } from 'level'
import { DB_NAME } from '../constants'
import { createDB, createSubDB } from './create'

// eslint-disable-next-line import/no-mutable-exports
export let chatDB!: Level<string, any>
// eslint-disable-next-line import/no-mutable-exports
export let historyDB!: Level<string, any>

export function installDB() {
  chatDB = createDB(DB_NAME.CHAT_GPT)
  historyDB = createSubDB(chatDB, DB_NAME.CHAT_GPT_HISTORY)
}
