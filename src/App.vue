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

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9feaf9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
