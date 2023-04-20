<script lang="ts" setup>
import { Pane, Splitpanes } from 'splitpanes'
import type { CodeAction } from '~/composables/coder'

const { t } = useI18n()
const { codeOptimizer, coderActions } = useCodeMessage()

const action = ref<CodeAction>(coderActions[0] as CodeAction)
const loading = ref(false)
const rendered = ref('')
const errorMessage = ref('')
const content = ref('')

const onMessage = async (code: string) => {
  loading.value = true
  rendered.value = ''
  errorMessage.value = ''
  const response = await codeOptimizer(action.value, code, ({ text }) => {
    rendered.value = renderMarkdown(text)
    loading.value = false
  })
  loading.value = false
  if (response.type === 'success') {
    rendered.value = renderMarkdown(response.text)
  } else {
    errorMessage.value = response.errorMessage || ''
  }
}
</script>

<template>
  <Splitpanes class="coder-wrapper" horizontal>
    <Pane class="coder-container">
      <div class="coder-content">
        <div class="markdown-body" v-html="rendered"></div>
        <div v-if="errorMessage" class="flex items-center">
          <NAlert type="error">{{ errorMessage }}</NAlert>
        </div>
        <div v-if="loading" class="flex items-center">
          <NSpin size="small" />
          <span class="ml-4">{{ t('chat.waiting') }}</span>
        </div>
      </div>
    </Pane>
    <ChatTextArea
      v-model="content"
      class="bg-light-50 dark:bg-dark-700"
      :loading="loading"
      @message="onMessage"
    >
      <div class="flex justify-start items-center">
        <NRadioGroup v-model:value="action">
          <NSpace>
            <NRadio v-for="item in coderActions" :key="item" :value="item">{{
              t(`coder.${item}`)
            }}</NRadio>
          </NSpace>
        </NRadioGroup>
      </div>
    </ChatTextArea>
  </Splitpanes>
</template>

<style scoped>
.coder-wrapper {
  @apply flex flex-col w-full h-full overflow-hidden;
}
.coder-container {
  @apply flex-1 bg-white dark:bg-dark-700 dark:text-gray-400;
}

.coder-content {
  @apply h-full p-4 pt-6 overflow-auto;
}
.coder-editor {
  @apply w-full h-full outline-none p-4;
}
</style>
