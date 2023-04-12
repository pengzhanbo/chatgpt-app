import { useDB } from './db'

const db = useDB()

const appConfig = ref<AppConfig>()

const getConfig = async (): Promise<AppConfig> => {
  if (appConfig.value) return appConfig.value
  return (await db.get<AppConfig>('app_setting')) as AppConfig
}

const updateConfig = async (): Promise<void> => {
  await db.set('app_setting', appConfig.value)
  await db.save()
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

export function checkAppConfig() {
  const { appConfig, initAppConfig } = useAppConfig()
  const dialog = useDialog()
  const router = useRouter()
  const { t } = useI18n()

  onBeforeMount(async () => {
    await initAppConfig()
    const goSetting = () => router.push({ name: 'setting' })
    !appConfig.value?.apiKey &&
      dialog.warning({
        title: t('dialog.appConfig.check.title'),
        positiveText: t('dialog.appConfig.check.submit'),
        onPositiveClick: goSetting,
        onMaskClick: goSetting,
        onClose: goSetting,
        onEsc: goSetting,
      })
  })
}
