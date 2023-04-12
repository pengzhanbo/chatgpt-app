import { Store } from '~/modules/tauri-store/store'

export const db = new Store('./chatgpt.db')

export const historyDB = new Store('./chat-history.db')

export const useDB = () => db

export const useChatHistoryDB = () => historyDB

export async function setupDB() {
  if (await initAppConfig()) {
    await db.save()
  }

  // await historyDB.save()
}

async function initAppConfig() {
  const has = await db.has('app_setting')
  if (!has) {
    await db.set<AppConfig>('app_setting', {
      apiBaseUrl: 'https://api.openai.com',
      apiKey: '',
      chatModel: 'gpt-3.5-turbo',
      theme: 'system',
      locale: 'zh-CN',
    })
  }
  return !has
}
