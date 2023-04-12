<script lang="ts" setup>
import { Pane } from 'splitpanes'

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
const { t } = useI18n()

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
  <Pane class="chat-textarea" size="22" min-size="14" max-size="50">
    <textarea
      v-model="message"
      class="textarea"
      :disabled="loading"
      @keypress.ctrl.enter.exact.prevent="onMessage"
    />
    <div class="chat-textarea-footer">
      <div class="flex-1">
        <slot></slot>
      </div>
      <div class="flex justify-start items-center">
        <p class="footer-tips">{{ t('chat.textarea.sendTips') }}</p>
        <NButton
          type="primary"
          size="small"
          :disabled="loading"
          @click="onMessage"
        >
          <template #icon>
            <NIcon><SendIcon /></NIcon>
          </template>
        </NButton>
      </div>
    </div>
  </Pane>
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
  @apply resize-none focus:outline-none leading-7;
  font-size: 15px;
}
.chat-textarea-footer {
  @apply flex flex-shrink-0 items-end px-5 pb-2 pt-1;
}
.footer-tips {
  @apply flex-shrink-0 text-xs text-gray-400 dark:text-gray-700 mr-2;
}
</style>
