<script setup lang="ts">
import { NConfigProvider, darkTheme } from 'naive-ui'
import { setupDarkMode } from './composables/colorTheme'
import { useCopyCode } from './composables/copyCode'
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
      <NMessageProvider>
        <Layout>
          <RouterView />
        </Layout>
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
