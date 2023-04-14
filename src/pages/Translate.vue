<script lang="ts" setup>
import { Pane, Splitpanes } from 'splitpanes'
import { chatMessageError, languageOptions } from '~/common/constants'
import { copyToClipboard } from '~/composables/copyCode'
import { renderText } from '~/composables/markdown'
import { useTranslate } from '~/composables/translate'
import type { TranslateType } from '~/composables/translate'
const languageList = [...languageOptions]
const { t } = useI18n()
const { type, targetLang, translateText } = useTranslate()
const loading = ref(false)
const text = ref('')
const result = ref<Omit<ChatGPTMessage, 'sendId'>>({
  id: '',
  type: 'success',
  text: '',
  rendered: '',
  role: 'assistant',
  createTime: 0,
})

const rendered = computed(() => result.value.rendered)

const onTranslate = async (current: TranslateType) => {
  if (!text.value) return
  type.value = current
  result.value.rendered = ''
  loading.value = true
  const response = await translateText(text.value, (res) => {
    result.value = res
  })

  result.value = response
  result.value.errorMessage =
    response.errorCode && response.errorCode in chatMessageError
      ? t(chatMessageError[response.errorCode])
      : response.errorMessage

  loading.value = false
}

const message = useMessage()

const onCopy = async () => {
  if (!result.value.text) return
  await copyToClipboard(result.value.text)
  message.success(t('translate.copied'))
}
</script>

<template>
  <div class="translate-container">
    <div class="flex items-end">
      <div class="flex items-center w-96 pl-4">
        <NSelect
          v-model:value="targetLang"
          :options="languageList"
          :render-label="({ label }) => t(label)"
        />
        <div class="ml-4">
          <NButton
            type="primary"
            :loading="type === 'translate' ? loading : false"
            :disabled="loading"
            @click="onTranslate('translate')"
            >{{ t('translate.translate') }}</NButton
          >
        </div>
        <div class="ml-4">
          <NButton
            type="primary"
            :loading="type === 'polish' ? loading : false"
            :disabled="loading"
            @click="onTranslate('polish')"
            >{{ t('translate.polish') }}</NButton
          >
        </div>
      </div>
      <div class="flex-1 flex justify-end pr-5">
        <NButton @click="onCopy">{{ t('translate.copy') }}</NButton>
      </div>
    </div>
    <Splitpanes class="translate-content">
      <Pane class="translate-source" size="50" min-size="10">
        <textarea
          v-model="text"
          class="textarea"
          :disabled="loading"
          :placeholder="t('translate.placeholder')"
          @keypress.ctrl.enter.exact.prevent="onTranslate('translate')"
        ></textarea>
      </Pane>
      <Pane class="translate-target" min-size="10">
        <div class="translated-content">
          <div v-if="rendered" class="markdown-body" v-html="rendered"></div>
          <div v-if="result.errorMessage">
            <NAlert type="error">{{ result.errorMessage }}</NAlert>
          </div>
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>

<style scoped>
.translate-container {
  @apply flex flex-1 flex-col pt-5;
}

.translate-content {
  @apply flex flex-1 h-full py-5 overflow-auto;
}

.translate-source,
.translate-target {
  @apply h-full border-r border-dashed border-r-gray-300 px-5;
}

.translate-source .textarea {
  @apply w-full h-full m-0 px-5 py-3 rounded-md;
  @apply overflow-auto dark: text-gray-400;
  @apply outline-transparent bg-light-600 dark: bg-dark-800;
  @apply resize-none focus: outline-none leading-7;
  font-size: 15px;
}

.translated-content {
  @apply w-full h-full m-0 px-5 py-3 rounded-md;
  @apply bg-light-600 dark: bg-dark-800;
}

.translate-content .markdown-body :deep(p) {
  @apply mb-0;
}
</style>
