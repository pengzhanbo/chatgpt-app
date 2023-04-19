<script lang="ts" setup>
import { useCodeMessage, useMonaco } from '~/composables/monaco'

const { editorEl, setLanguage, updateCode, onMonacoAction } = useMonaco()
const { codeOptimizer } = useCodeMessage()

onMonacoAction(async ({ action, content, selection }) => {
  const response = await codeOptimizer(
    action,
    'typescript',
    content,
    ({ text }) => updateCode(text),
  )
  updateCode(response.text)
})
</script>

<template>
  <div class="coder-container">
    <div class="coder-header"></div>
    <div class="coder-content">
      <div ref="editorEl" class="coder-editor"></div>
    </div>
    <div class="coder-footer"></div>
  </div>
</template>

<style scoped>
.coder-container {
  @apply flex flex-col w-full h-full overflow-hidden;
}
.coder-content {
  @apply flex-1 pt-2;
}
.coder-editor {
  @apply w-full h-full;
}
</style>
