<script lang="ts" setup>
import { useDialog } from 'naive-ui'
import { chatMessageError } from '~/common/constants'
import { useAppConfig } from '~/composables/appConfig'
import { useChatApi } from '~/composables/chatApi'
import { useChatMessage } from '~/composables/chatMessage'
import { useChatRecord } from '~/composables/chatRecord'
import { useScroll } from '~/composables/scroll'

const dialog = useDialog()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const { appConfig, initAppConfig } = useAppConfig()

const chatId = computed(() => route.params.id as string)
const messageText = ref('')

const { sendMessage, onMessageProgress } = useChatApi()
const { createChatRecord, addChatRecord, loadChatRecord, updateChatRecord } =
  useChatRecord()

const {
  messageList,
  loadChatMessage,
  addAssistantEmptyMessage,
  updateAssistantMessage,
  addUserMessage,
} = useChatMessage(chatId)

const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()

watch(
  chatId,
  async () => {
    await loadChatMessage()
    await loadChatRecord()
    messageText.value = ''
  },
  { immediate: true },
)

const loading = ref(false)
let assistantWaiting: number | undefined

const onMessage = async (message: string) => {
  if (!message || message === '') return
  if (!chatId.value) {
    // 如果当前页面没有 chatId,则说明是新建状态，
    // 直接根据用户输入生成一个新的记录
    const record = createChatRecord({ title: message })
    await addChatRecord(record)
    router.replace({ name: 'chat', params: { id: record.id } })
  } else {
    // 以最新用户发送的消息作为记录的标题
    updateChatRecord({ id: chatId.value, title: message })
  }

  const assistantList = messageList.value.filter(
    (item) => item.role === 'assistant',
  )
  const lastContext = assistantList[assistantList.length - 1]
  const parentMessageId = lastContext?.parentMessageId
  const conversationId = lastContext?.conversationId
  loading.value = true
  await addUserMessage(message)
  scrollToBottom()
  // 创建一个新的消息容器，但置空，等待服务器消息流填充内容
  assistantWaiting = addAssistantEmptyMessage()
  const response = await sendMessage(message, {
    parentMessageId,
    conversationId,
  })
  if (response.type === 'success') {
    await updateAssistantMessage(assistantWaiting, response.payload, true)
    messageText.value = ''
  } else {
    // await deleteChatMessage(assistantWaiting)
    await updateAssistantMessage(
      assistantWaiting,
      {
        ...response.payload,
        errorMessage:
          response.code in chatMessageError
            ? t(chatMessageError[response.code])
            : response.payload.errorMessage || response.message,
      },
      true,
    )
  }
  assistantWaiting = undefined
  loading.value = false
  scrollToBottomIfAtBottom()
}

/**
 * 当发送消息后，AI模拟正在输入的效果，连续返回响应报文
 */
onMessageProgress(async (response) => {
  if (typeof assistantWaiting !== 'undefined') {
    await updateAssistantMessage(assistantWaiting, response)
    scrollToBottomIfAtBottom()
  }
})

onBeforeMount(async () => {
  await initAppConfig()
  const goSetting = () => router.push({ name: 'setting' })
  !appConfig.value?.openAIApiKey &&
    dialog.warning({
      title: '还未配置 openai api key',
      positiveText: '去配置',
      onPositiveClick: goSetting,
      onMaskClick: goSetting,
      onClose: goSetting,
      onEsc: goSetting,
    })
})
</script>

<template>
  <div class="chatgpt-wrapper flex flex-1 h-full">
    <ChatSidebar />
    <div class="chatgpt-container flex-1 flex flex-col">
      <ChatMessageList
        :ref="(c: any) => (scrollRef = c?.$el)"
        :list="messageList"
      />
      <ChatTextArea
        v-model="messageText"
        :loading="loading"
        @message="onMessage"
      />
    </div>
  </div>
</template>

<style scoped>
.chatgpt-container {
  @apply bg-light-600 dark:bg-dark-900;
}
</style>
