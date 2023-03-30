import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const cache: Record<string, any> = {
  'zh-CN': {
    locale: zhCN,
    dateLocale: dateZhCN,
  },
  'en-US': {
    locale: enUS,
    dateLocale: dateEnUS,
  },
}

export function setupLocale() {
  const { appConfig, setConfig } = useAppConfig()
  const { locale } = useI18n()
  const naiveLocale = computed(() => {
    return cache[locale.value].locale || zhCN
  })

  const naiveDateLocale = computed(() => {
    return cache[locale.value].dateLocale || dateZhCN
  })

  watch(
    appConfig,
    (config) => {
      config?.locale && (locale.value = config?.locale)
    },
    { immediate: true },
  )

  watch(locale, async (currentLocale) => {
    if (currentLocale !== appConfig.value?.locale) {
      await setConfig({ locale: currentLocale })
    }
  })

  return { locale, naiveLocale, naiveDateLocale }
}
