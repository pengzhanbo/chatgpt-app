<script lang="ts" setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  (event: 'message', message: string): void
  (event: 'update:modelValue', message: string): void
}>()

const { loading } = toRefs(props)

const message = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const onMessage = () => {
  !loading.value && emit('message', message.value)
}
</script>

<template>
  <div class="chat-textarea">
    <textarea
      v-model="message"
      class="textarea"
      @keypress.ctrl.enter.exact.prevent="onMessage"
    />
    <div class="chat-textarea-footer">
      <p class="footer-tips">Ctrl + Enter 发送</p>
      <NButton
        type="primary"
        size="small"
        :loading="loading"
        @click="onMessage"
      >
        <template #icon>
          <NIcon><SendIcon /></NIcon>
        </template>
      </NButton>
    </div>
  </div>
</template>

<style scoped>
.chat-textarea {
  @apply flex flex-col h-40 flex-shrink-0 box-border;
  @apply border-t-1 border-t-light-800 dark:border-t-dark-300;
}

.chat-textarea .textarea {
  @apply w-full flex-1 m-0 px-5 py-3 bg-transparent;
  @apply overflow-auto dark:text-gray-400;
  @apply outline-transparent;
  @apply resize-none focus:outline-none;
}
.chat-textarea-footer {
  @apply flex flex-shrink-0 items-end justify-between px-5 pb-2 pt-1;
}
.footer-tips {
  @apply text-xs text-gray-400 dark:text-gray-700;
}
</style>
