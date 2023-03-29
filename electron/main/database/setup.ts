import { ipcMain } from 'electron'
import type { Level } from 'level'
import { DB_NAME, defaultAppConfig } from '../constants'
import { chatDB, historyDB, installDB } from './db'

export async function setupDatabase() {
  installDB()
  setupDBHandler(chatDB, `db:${DB_NAME.CHAT_GPT}`)
  setupDBHandler(
    historyDB,
    `db:${DB_NAME.CHAT_GPT}:${DB_NAME.CHAT_GPT_HISTORY}`,
  )

  await setupDefaultData(chatDB, {
    app_setting: defaultAppConfig,
  })
}

async function setupDefaultData(db: Level, defaultData: Record<string, any>) {
  let count = 0
  const keys = Object.keys(defaultData)
  const result = await db.getMany(keys)
  let batch = db.batch()
  for (const [index, key] of keys.entries()) {
    if (typeof result[index] === 'undefined') {
      batch = batch.put(key, defaultData[key])
      count++
    }
  }
  if (count > 0) await batch.write()
}

function setupDBHandler(db: Level, channel: string) {
  const { handle } = ipcMain
  handle(`${channel}:get`, async (_, key: string) => {
    try {
      return await db.get(key)
    } catch {}
    return undefined
  })
  handle(`${channel}:put`, (_, key: string, value: any) => db.put(key, value))
  handle(`${channel}:del`, (_, key: string) => db.del(key))
  handle(`${channel}:batch`, (_, operations: any) => db.batch(operations))
  handle(`${channel}:clear`, () => db.clear())
}
