<script lang="ts" setup>
import { type ChatMessage } from 'chatgpt'

const props = defineProps({
  list: {
    type: Array as PropType<ChatMessage[]>,
    default: () => [],
  },
})
</script>

<template>
  <div class="chat-message-list">
    <ChatMessage v-for="item in list" :key="item.id" :message="item" />
  </div>
</template>

<style scoped>
.chat-message-list {
  @apply flex-1 px-5 pb-3 pt-8 overflow-auto;
}
</style>
