<script lang="ts" setup>
import { Pane } from 'splitpanes'

withDefaults(
  defineProps<{
    list: ChatGPTMessage[]
    loading: boolean
    chatId?: string
  }>(),
  {
    list: () => [],
  },
)

const el = ref<HTMLElement | null>(null)
const showToBottom = ref(false)

const onScroll = () => {
  showToBottom.value =
    !!el.value &&
    el.value.scrollTop + el.value.offsetHeight <=
      el.value.scrollHeight - el.value.offsetHeight / 2
}
const scrollToBottom = () => {
  el.value?.scrollTo({
    top: el.value.scrollHeight,
    behavior: 'smooth',
  })
}
onMounted(() => onScroll())
</script>

<template>
  <Pane class="chat-message-list-container">
    <div ref="el" class="chat-message-list" @scroll="onScroll">
      <ChatMessage
        v-for="(item, index) in list"
        :key="item.sendId"
        :message="item"
        :chat-id="chatId"
        :index="index"
      />
    </div>
    <Transition name="fade">
      <div v-show="showToBottom" class="to-bottom" @click="scrollToBottom">
        <NIcon size="20"><ArrowBottomIcon /></NIcon>
      </div>
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

.to-bottom {
  @apply absolute bottom-3 right-4 flex items-center justify-center w-8 h-8 rounded-1;
  @apply bg-light-50 shadow shadow-gray-300 cursor-pointer text-gray-600 opacity-100;
  @apply dark:bg-dark-400 dark:shadow-dark-900 text-gray-500;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
