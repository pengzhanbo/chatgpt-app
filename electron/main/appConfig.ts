import { defaultAppConfig } from './constants'
import { chatDB } from './database'

export async function getAppConfig(): Promise<AppConfig> {
  try {
    return await chatDB.get('app_setting')
  } catch {}
  return defaultAppConfig
}
