import {
  dateEnUS,
  dateJaJP,
  dateZhCN,
  dateZhTW,
  enUS,
  jaJP,
  zhCN,
  zhTW,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useAppConfig } from './appConfig'

const cache: Record<string, any> = {
  'zh-CN': {
    locale: zhCN,
    dateLocale: dateZhCN,
  },
  'en-US': {
    locale: enUS,
    dateLocale: dateEnUS,
  },
  'zh-TW': {
    locale: zhTW,
    dateLocale: dateZhTW,
  },
  'jp': {
    locale: jaJP,
    dateLocale: dateJaJP,
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
      await setConfig({ locale: currentLocale as Locales })
    }
  })

  return { locale, naiveLocale, naiveDateLocale }
}
