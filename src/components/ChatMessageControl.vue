<script lang="ts" setup>
import { messageControlOptions } from '~/common/constants'
const props = defineProps<{
  message: ChatGPTMessage
  index: number
  chatId?: string
}>()

const { t } = useI18n()
const tips = useMessage()
const dialog = useDialog()

const chatId = computed(() => props.chatId || '')

const { updateAssistantMessage, deleteChatMessage } = useChatMessage(chatId)

const onRetry = async () => {
  const { retryList = [], ...message } = props.message
  retryList.push(message)
  await updateAssistantMessage(props.index, {
    text: '',
    rendered: '',
    errorMessage: '',
    retryList,
  })
  const response = await sendMessage({
    stream: true,
    memory: true,
    historyId: chatId.value,
    retryIndex: props.index,
    onMessage(res) {
      updateAssistantMessage(props.index, { ...res })
    },
  })
  await updateAssistantMessage(props.index, { ...response }, true)
}

const onCopyText = async () => {
  await copyToClipboard(props.message.text)
  tips.success(t('translate.copied'))
}

const onDeleteChat = () => {
  dialog.info({
    title: t('dialog.deleteMessage.title'),
    content: t('dialog.deleteMessage.content'),
    positiveText: t('dialog.deleteMessage.submit'),
    negativeText: t('dialog.deleteMessage.cancel'),
    onPositiveClick: async () => {
      await deleteChatMessage(props.index)
    },
  })
}

const onSelectController = async (key: 'copy' | 'retry' | 'delete') => {
  switch (key) {
    case 'retry':
      await onRetry()
      break
    case 'copy':
      await onCopyText()
      break
    case 'delete':
      onDeleteChat()
      break
  }
}
</script>

<template>
  <div
    v-if="message.role === 'assistant'"
    class="message-control self-end -mr-4"
  >
    <NDropdown
      :options="messageControlOptions"
      size="small"
      :render-label="({ label }) => t(label as string)"
      @select="onSelectController"
    >
      <NIcon class="cursor-pointer text-gray-400" size="20">
        <MoreIcon />
      </NIcon>
    </NDropdown>
  </div>
</template>
