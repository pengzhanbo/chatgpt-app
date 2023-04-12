<script lang="ts" setup>
import { Pane } from 'splitpanes'

defineProps({
  list: {
    type: Array as PropType<ChatGPTMessage[]>,
    default: () => [],
  },
})
</script>

<template>
  <Pane class="chat-message-list">
    <ChatMessage v-for="item in list" :key="item.id" :message="item" />
  </Pane>
</template>

<style scoped>
.chat-message-list {
  @apply flex-1 px-5 pb-3 pt-8 overflow-auto;
}
</style>
