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
    target: LanguageUnion
  }>('translate', {
    target: 'auto',
  })
  const targetLang = ref<LanguageUnion>(storage.value.target)

  watch(targetLang, (target) => (storage.value.target = target))

  const type = ref<TranslateType>('translate')

  const systemMessage = computed(() => systemMessageMap[type.value])

  const { sendMessage, onMessageProgress } = useChatApi(systemMessage)

  const translateText = async (text: string) => {
    const target = targetLang.value
    let message =
      type.value === 'translate'
        ? `{translate to ${realLang[target] || target}}`
        : 'polish this sentence:'

    text = text
      .trim()
      .replace(/^\n+|\n+$/g, '')
      .trim()
      .replace(/[\n\t\r]+/g, '\n')
    message = `${message}\n\n${text}`
    return await sendMessage(message, { systemMessage: systemMessage.value })
  }

  return {
    targetLang,
    type,
    translateText,
    onMessageProgress,
  }
}
