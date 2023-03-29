import { useChatDB } from './db'

const db = useChatDB()

const appConfig = ref<AppConfig>()

const getConfig = async (): Promise<AppConfig> => {
  if (appConfig.value) return appConfig.value
  return await db.get('app_setting')
}

const updateConfig = async (): Promise<void> => {
  await db.put('app_setting', appConfig.value)
}

const setConfig = async (config: Partial<AppConfig>): Promise<void> => {
  appConfig.value = {
    ...appConfig.value,
    ...(config as AppConfig),
  }
  await updateConfig()
}

let waiting: Promise<AppConfig> | null = null
async function initAppConfig() {
  if (waiting) return waiting
  waiting = getConfig()
  appConfig.value = await waiting
  waiting = null
}

export function useAppConfig() {
  initAppConfig()
  return { initAppConfig, getConfig, setConfig, appConfig, updateConfig }
}
