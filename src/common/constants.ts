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

export const localeOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
]

export const preferenceOptions = [
  { label: 'preference.light', value: 'light', icon: LightIcon },
  { label: 'preference.dark', value: 'dark', icon: DarkIcon },
  { label: 'preference.system', value: 'system', icon: ModeIcon },
]
