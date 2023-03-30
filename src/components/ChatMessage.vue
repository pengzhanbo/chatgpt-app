<script lang="ts" setup>
import { type ChatMessage } from 'chatgpt'
const props = defineProps({
  message: {
    type: Object as PropType<ChatGPTMessage & { original?: ChatMessage }>,
    default: () => ({}),
  },
})
</script>

<template>
  <div
    v-show="message.rendered || message.errorMessage"
    class="chat-message"
    :class="{
      reverse: message.role === 'user',
    }"
  >
    <NAvatar v-if="message.role === 'user'" color="transparent">
      <NIcon><UserIcon /></NIcon>
    </NAvatar>
    <NAvatar v-else color="rgb(16, 163, 127)">
      <NIcon><OpenAIIcon /></NIcon>
    </NAvatar>
    <div class="message-container">
      <div class="message-content">
        <div
          v-if="message.rendered"
          class="markdown-body"
          v-html="message.rendered"
        ></div>
        <div v-if="message.errorMessage">
          <NAlert type="error">{{ message.errorMessage }}</NAlert>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  @apply flex items-start mb-5;
}
.message-container {
  @apply flex-1 mx-3 w-0;
}
.message-content {
  @apply box-border relative inline-block max-w-full px-3 py-2 bg-light-50 rounded-md;
  @apply dark:bg-dark-700 dark:text-gray-400;
}

.message-content::before {
  content: '';
  display: inline-block;
  position: absolute;
  top: 5px;
  left: -12px;
  width: 0;
  height: 0;
  border: solid 6px transparent;
  @apply border-r-light-50 dark:border-r-dark-500;
}

.chat-message.reverse {
  @apply flex-row-reverse;
}
.reverse .message-container {
  @apply text-right;
}
.reverse .message-content {
  @apply text-left bg-green-400 dark:bg-green-900 dark:text-gray-200;
}

.reverse .message-content::before {
  right: -12px;
  left: unset;
  @apply border-r-transparent border-l-green-400 dark:border-l-green-900;
}
</style>
