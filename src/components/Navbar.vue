<script lang="ts" setup>
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

type HistoryRoutes = Record<
  string | symbol,
  { params: RouteLocationNormalizedLoaded['params'] }
>

const historyRoutes = ref<HistoryRoutes>({})

const updateHistoryRoutes = () => {
  historyRoutes.value[route.name!] = { params: toRaw(route.params) }
}

const goChat = () => {
  updateHistoryRoutes()
  const params = historyRoutes.value.chat
    ? historyRoutes.value.chat.params
    : undefined
  router.push({ name: 'chat', params })
}

const goSetting = () => {
  updateHistoryRoutes()
  router.push({ name: 'setting' })
}

const iconSize = 28
const popoverStyles = {
  padding: '2px 4px',
}
</script>

<template>
  <div class="navbar">
    <div class="navbar-content flex flex-col">
      <div class="icon" @click="goChat">
        <NPopover :style="popoverStyles" placement="bottom" :delay="300">
          <template #trigger>
            <NIcon :size="iconSize"><OpenAIIcon /></NIcon>
          </template>
          <span class="text-xs">{{ t('navbar.chatGPT') }}</span>
        </NPopover>
      </div>
    </div>
    <div class="region flex-1"></div>
    <div class="navbar-footer flex flex-col">
      <div class="icon" @click="goSetting">
        <NPopover :style="popoverStyles" :delay="300">
          <template #trigger>
            <NIcon :size="iconSize"><SettingIcon /></NIcon>
          </template>
          <span class="text-xs">{{ t('navbar.setting') }}</span>
        </NPopover>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  @apply flex flex-col flex-shrink-0 w-17 pt-8 bg-light-600 dark:bg-dark-800;
}
.icon {
  @apply text-center py-3 cursor-pointer text-gray-500 dark:text-gray-600;
  @apply hover:text-gray-800 hover:dark:text-gray-300 transition-colors;
}
</style>
