<script lang="ts" setup>
import format from 'date-fns/format'
const props = defineProps<{
  message: ChatGPTMessage
  index: number
  chatId?: string
}>()

const { t } = useI18n()
const isDark = useDarkMode()

const totalRetry = computed(() => {
  if (props.message?.retryList?.length) {
    return props.message.retryList.length + 1
  }
  return 1
})
const retryIndex = ref(totalRetry.value)

watch(
  totalRetry,
  (nowTotal, oldTotal) => {
    if (retryIndex.value === oldTotal) {
      retryIndex.value = nowTotal
    }
  },
  { immediate: true },
)
const currentMessage = computed(() => {
  if (retryIndex.value === totalRetry.value) {
    return props.message
  } else {
    return props.message.retryList?.[retryIndex.value - 1] || props.message
  }
})

const onChooseRetry = (num: 1 | -1) => {
  let current = retryIndex.value + num
  if (current < 1) current = 1
  if (current > totalRetry.value) current = totalRetry.value
  retryIndex.value = current
}

const localeDate = computed(() =>
  currentMessage.value?.createTime
    ? format(currentMessage.value.createTime, 'yyyy-MM-dd HH:mm:ss')
    : '',
)
const rendered = computed(() =>
  currentMessage.value
    ? renderMarkdown(currentMessage.value.text, isDark.value)
    : '',
)
const errorMessage = computed(() => currentMessage.value?.errorMessage)
</script>

<template>
  <div
    class="chat-message"
    :class="{
      reverse: message.role === 'user',
    }"
  >
    <div class="w-10">
      <ChatAvatar :role="message.role" />
      <div
        v-if="message.role === 'assistant' && message.retryList?.length"
        class="retry-content"
      >
        <NIcon class="icon" size="16" @click="onChooseRetry(-1)"
          ><ArrowLeftIcon
        /></NIcon>
        <span class="content">{{ retryIndex }}/{{ totalRetry }}</span>
        <NIcon class="icon" size="16" @click="onChooseRetry(1)"
          ><ArrowRightIcon
        /></NIcon>
      </div>
    </div>
    <div class="message-container">
      <p class="createTime">{{ localeDate }}</p>
      <div
        class="flex"
        :class="{
          'flex-row-reverse': message.role === 'user',
        }"
      >
        <div v-if="rendered || errorMessage" class="message-content">
          <div
            v-if="rendered"
            class="markdown-body"
            :class="[message.role]"
            v-html="rendered"
          ></div>
          <div v-if="errorMessage" class="flex items-center">
            <NAlert type="error">{{ errorMessage }}</NAlert>
          </div>
        </div>
        <div v-else class="message-content">
          <div class="flex items-center">
            <NSpin size="small" />
            <span class="ml-4">{{ t('chat.waiting') }}</span>
          </div>
        </div>
        <ChatMessageControl
          v-if="retryIndex === totalRetry"
          :message="message"
          :index="index"
          :chat-id="chatId"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  @apply flex items-start mb-5;
}

.retry-content {
  @apply flex justify-center items-center -mx-2 pt-1;
  @apply text-gray-500;
}
.retry-content .content {
  font-size: 12px;
}
.retry-content .icon {
  @apply cursor-pointer hover:text-gray-800;
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
  top: 5px;
  left: -12px;
  border: solid 6px transparent;
  @apply border-r-light-50 dark:border-r-dark-500;
  @apply inline-block absolute w-0 h-0;
}

.createTime {
  @apply text-gray-500 text-xs pb-1;
}

.chat-message.reverse {
  @apply flex-row-reverse;
}
.reverse .message-container {
  @apply text-right;
}
.reverse .message-content {
  @apply text-left;
}

.reverse .message-content::before {
  right: -12px;
  left: unset;
  @apply border-r-transparent;
}
</style>
