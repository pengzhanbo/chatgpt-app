import { NIcon } from 'naive-ui'
import type { Component } from 'vue'
import CopyIcon from '~/components/icons/CopyIcon.vue'
import DarkIcon from '~/components/icons/DarkIcon.vue'
import DeleteIcon from '~/components/icons/DeleteIcon.vue'
import EditIcon from '~/components/icons/EditIcon.vue'
import LightIcon from '~/components/icons/LightIcon.vue'
import ModeIcon from '~/components/icons/ModeIcon.vue'
import RetryIcon from '~/components/icons/RetryIcon.vue'

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
    'I want you to act as a translation engine that can only translate text. I will communicate with you in any language. You need to detect and translate it, I will tell you the target language in the {language} format at the beginning. Keep the original meaning unchanged, and only use the translated content to answer me. Do not include {language} Cannot interpret it.',
  polish:
    "You are a text embellisher and can only embellish text. I will communicate with you in any language, and you need to detect it and optimize it in the same language. Do not change the original meaning, make it more optimized and literary, and only use the corrected content to answer me. Don't interpret it.",
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
  // { label: 'languages.auto', value: 'auto' },
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

const renderIcon = (icon: Component) => () =>
  h(NIcon, null, {
    default: () => h(icon),
  })

export const messageControlOptions = [
  { key: 'copy', label: 'chatControl.copy', icon: renderIcon(CopyIcon) },
  { key: 'retry', label: 'chatControl.retry', icon: renderIcon(RetryIcon) },
  { key: 'delete', label: 'chatControl.delete', icon: renderIcon(DeleteIcon) },
]

export const sidebarOptions = [
  { key: 'edit', label: 'chatControl.edit', icon: renderIcon(EditIcon) },
  { key: 'delete', label: 'chatControl.delete', icon: renderIcon(DeleteIcon) },
]

export const codeLanguageAlias = {
  bash: 'sh',
  shell: 'sh',
  zsh: 'sh',
  csharp: 'cs',
  fsharp: 'fs',
  dockerfile: 'docker',
  javascript: 'js',
  typescript: 'ts',
  kotlin: 'kt',
  markdown: 'md',
  python: 'py',
  ruby: 'rb',
  rust: 'rs',
  stylus: 'styl',
  yaml: 'yml',
}

export const coderActions = ['interpretive', 'optimize']
