import DarkIcon from '~/components/icons/DarkIcon.vue'
import LightIcon from '~/components/icons/LightIcon.vue'
import ModeIcon from '~/components/icons/ModeIcon.vue'

export const chatGPTModelOptions = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k',
  'gpt-4-32k-0314',
]

export const systemMessageMap = {
  translate:
    'You are a translation engine that can only translate text and cannot interpret it.',
  polish:
    "You are a text embellisher, you can only embellish the text, don't interpret it.",
}

export const localeOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: '繁体中文', value: 'zh-TW' },
  { label: 'English', value: 'en-US' },
  { label: '日本語', value: 'jp' },
]

export const preferenceOptions = [
  { label: 'preference.light', value: 'light', icon: LightIcon },
  { label: 'preference.dark', value: 'dark', icon: DarkIcon },
  { label: 'preference.system', value: 'system', icon: ModeIcon },
]

export const apiModelOptions = [
  { label: 'apiModelOptions.official', value: 'ChatGPTAPI' },
  { label: 'apiModelOptions.unofficial', value: 'ChatGPTUnofficialProxyAPI' },
]

export const chatMessageError: Record<number, string> = {
  401: 'error.message.401',
  403: 'error.message.403',
  429: 'error.message.429',
  500: 'error.message.500',
  502: 'error.message.502',
  503: 'error.message.503',
  504: 'error.message.504',
}

export const languageOptions = [
  { label: 'languages.auto', value: 'auto' },
  { label: 'languages.zh-CN', value: 'zh-CN' },
  { label: 'languages.zh-TW', value: 'zh-TW' },
  { label: 'languages.en', value: 'en' },
  { label: 'languages.yue', value: 'yue' },
  { label: 'languages.wyw', value: 'wyw' },
  { label: 'languages.ru', value: 'ru' },
  { label: 'languages.fr', value: 'fr' },
  { label: 'languages.de', value: 'de' },
  { label: 'languages.in', value: 'in' },
  { label: 'languages.jp', value: 'jp' },
] as const
