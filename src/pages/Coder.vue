<script lang="ts" setup>
import { Pane, Splitpanes } from 'splitpanes'
import { coderActions } from '~/common/constants'
import type { CodeAction } from '~/composables/coder'
import { useCodeMessage } from '~/composables/coder'

const action = ref<CodeAction>(coderActions[0] as CodeAction)
const loading = ref(false)
const rendered = ref('')
const content = ref('')
const { t } = useI18n()

const { codeOptimizer } = useCodeMessage()

const onMessage = async (code: string) => {
  loading.value = true
  const response = await codeOptimizer(action.value, code, ({ text }) => {
    rendered.value = renderMarkdown(text)
  })
  loading.value = false
  if (response.type === 'success') {
    rendered.value = renderMarkdown(response.text)
  }
}
</script>

<template>
  <Splitpanes class="coder-container" horizontal>
    <Pane class="coder-content">
      <div
        class="markdown-body h-full p-4 overflow-auto"
        v-html="rendered"
      ></div>
    </Pane>
    <ChatTextArea v-model="content" :loading="loading" @message="onMessage">
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
.coder-container {
  @apply flex flex-col w-full h-full overflow-hidden;
}
.coder-content {
  @apply flex-1 pt-2;
}
.coder-editor {
  @apply w-full h-full outline-none p-4;
}
</style>
