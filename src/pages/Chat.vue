<script lang="ts" setup>
import { useDialog } from 'naive-ui'
import { useChatApi } from '~/composables/chatApi'
import { useChatMessage } from '~/composables/chatMessage'
import { useChatRecord } from '~/composables/chatRecord'
import { useScroll } from '~/composables/scroll'

const dialog = useDialog()
const router = useRouter()
const route = useRoute()

const chatId = computed(() => route.params.id as string)
const messageText = ref('')

const { sendMessage, onChatGPTUpdate, onMessageProgress, hasApiKey } =
  useChatApi()
const { createChatRecord, addChatRecord, loadChatRecord, updateChatRecord } =
  useChatRecord()

const {
  messageList,
  loadChatMessage,
  addAssistantEmptyMessage,
  updateAssistantMessage,
  addUserMessage,
  deleteChatMessage,
} = useChatMessage(chatId)

const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()

watch(
  chatId,
  async (chatId) => {
    if (chatId) {
      await loadChatMessage()
    }
    await loadChatRecord()
  },
  { immediate: true },
)

const loading = ref(false)
let sendId: number | undefined

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
  loading.value = true
  await addUserMessage(message)
  scrollToBottom()
  // 创建一个新的消息容器，但置空，等待服务器消息流填充内容
  sendId = addAssistantEmptyMessage()
  const {
    payload,
    code,
    type,
    message: errorMessage,
  } = await sendMessage(message, {
    parentMessageId,
  })
  if (type === 'Success') {
    await updateAssistantMessage(sendId, payload!, true)
    messageText.value = ''
  } else {
    await deleteChatMessage(sendId)
  }
  sendId = undefined
  loading.value = false
  scrollToBottomIfAtBottom()
}

/**
 * 当发送消息后，AI模拟正在输入的效果，连续返回响应报文
 */
onMessageProgress(async (response) => {
  if (typeof sendId !== 'undefined') {
    await updateAssistantMessage(sendId, response)
    scrollToBottomIfAtBottom()
  }
})

/**
 * 检查 chatGPT API 配置更新时是否发生错误
 */
onChatGPTUpdate((response) => {})

onBeforeMount(async () => {
  const has = await hasApiKey()
  const goSetting = () => router.push({ name: 'setting' })
  !has &&
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
