<script lang="ts" setup>
import { Pane } from 'splitpanes'

defineProps({
  list: {
    type: Array as PropType<ChatGPTMessage[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const {t} = useI18n()

</script>

<template>
  <Pane class="chat-message-list-container">
    <div class="chat-message-list">
      <ChatMessage v-for="item in list" :key="item.id" :message="item" />
    </div>
    <Transition name="fade">
      <div v-show="loading" class="chat-loading">正在输入中...</div>
    </Transition>
  </Pane>
</template>

<style scoped>
.chat-message-list-container {
  @apply relative flex-1;
}
.chat-message-list {
  @apply h-full px-5 pb-3 pt-8 overflow-auto;
}
.chat-loading {
  @apply absolute top-1 left-50/100 transform -translate-x-50/100;
  @apply px-3 py-1 rounded-md shadow shadow-gray-300 shadow-md bg-white;
  @apply dark:bg-dark-800 dark:text-gray-400 dark:shadow-dark-400;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
