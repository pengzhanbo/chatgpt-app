import type { InjectionKey, WritableComputedRef } from 'vue'
import { invoke } from '~/common/electron'

export type DarkModeRef = WritableComputedRef<boolean>

export const darkModeSymbol: InjectionKey<DarkModeRef> = Symbol('')

export const updateHtmlDarkClass = (isDarkMode: DarkModeRef): void => {
  const update = (value = isDarkMode.value): void => {
    // set `class="dark"` on `<html>` element
    const htmlEl = window?.document.querySelector('html')
    htmlEl?.classList.toggle('dark', value)
  }

  onMounted(() => {
    watch(isDarkMode, update, { immediate: true })
  })

  onUnmounted(() => update())
}

/**
 * Inject dark mode global computed
 */
export const useDarkMode = (): DarkModeRef => {
  const isDarkMode = inject(darkModeSymbol)
  if (!isDarkMode) {
    throw new Error('useDarkMode() is called without provider.')
  }
  return isDarkMode
}

/**
 * Create dark mode ref and provide as global computed in setup
 */
export const setupDarkMode = () => {
  const isDarkPreferred = usePreferredDark()
  const { appConfig } = useAppConfig()

  const isDarkMode = computed<boolean>(() => {
    const preference = appConfig.value?.preference
    // auto detected from prefers-color-scheme
    if (preference === 'system') {
      return isDarkPreferred.value
    }
    return preference === 'dark'
  })
  provide(darkModeSymbol, isDarkMode)

  updateHtmlDarkClass(isDarkMode)
  return isDarkMode
}

export const updateNativeTheme = async (
  preference: AppConfig['preference'],
) => {
  await invoke('darkMode:update', preference)
}
