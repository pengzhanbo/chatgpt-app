<script setup lang="ts">
import { NConfigProvider, darkTheme } from 'naive-ui'
import { useCopyCode } from './composables/copyCode'
import { setupDarkMode } from './composables/darkMode'
import { setupLocale } from './composables/locale'

useCopyCode()

const isDark = setupDarkMode()
const { naiveLocale, naiveDateLocale } = setupLocale()
const theme = computed(() => (isDark.value ? darkTheme : undefined))
</script>

<template>
  <NConfigProvider
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
    :theme="theme"
  >
    <NDialogProvider>
      <Layout>
        <RouterView />
      </Layout>
    </NDialogProvider>
  </NConfigProvider>
</template>
