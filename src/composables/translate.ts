import { useChatApi } from './chatApi'
import type { languageOptions } from '~/common/constants'
import { systemMessageMap } from '~/common/constants'

export type TranslateType = 'translate' | 'polish'

type LanguageUnion<T extends typeof languageOptions = typeof languageOptions> =
  T[number]['value']

const realLang: Record<string, string> = {
  yue: '粤语',
  wyw: '文言文',
}

export function useTranslate() {
  const storage = useLocalStorage<{
    source: LanguageUnion
    target: LanguageUnion
  }>('translate', {
    source: 'auto',
    target: 'auto',
  })

  const sourceLang = ref<LanguageUnion>(storage.value.source)
  const targetLang = ref<LanguageUnion>(storage.value.target)

  watch(sourceLang, (source) => (storage.value.source = source))
  watch(targetLang, (target) => (storage.value.target = target))

  const type = computed<TranslateType>(() =>
    sourceLang.value &&
    targetLang.value &&
    sourceLang.value === targetLang.value
      ? 'polish'
      : 'translate',
  )

  const systemMessage = computed(() => systemMessageMap[type.value])

  const { sendMessage, onMessageProgress } = useChatApi(systemMessage)

  const translateText = async (text: string) => {
    const source = sourceLang.value
    const target = targetLang.value
    let message!: string

    if (type.value === 'translate') {
      if (source === 'auto') {
        message = `Translate to ${realLang[target] || target}`
      } else {
        message = `Translate from ${realLang[source] || source} to ${
          realLang[target] || target
        }`
      }

      if (target === 'yue') message = '翻译成粤语'
      if (target === 'wyw') message = '翻译成文言文'
      if (['wyw', 'zh-CN', 'zh-TW'].includes(sourceLang.value)) {
        if (target === 'yue') message = '翻译成粤语白话文'
        if (target === 'zh-CN') message = '翻译成简体白话文'
        if (target === 'zh-TW') message = '翻译成繁体白话文'
      }
    } else {
      if (['wyw', 'zh-CN', 'zh-TW'].includes(sourceLang.value)) {
        message = '润色此句'
      } else {
        message = 'polish this sentence'
      }
    }
    text = text
      .trim()
      .replace(/^\n+|\n+$/g, '')
      .trim()
      .replace(/[\n\t\r]+/g, '\n')
    message = `${message}:\n\n${text}`
    return await sendMessage(message)
  }

  return {
    sourceLang,
    targetLang,
    type,
    translateText,
    onMessageProgress,
  }
}
