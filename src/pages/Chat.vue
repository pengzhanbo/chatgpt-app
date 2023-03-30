<script lang="ts" setup>
import { chatMessageError } from '~/common/constants'

checkAppConfig()

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

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
  getLastContext,
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

async function checkChatRecord(title: string) {
  if (!chatId.value) {
    // 如果当前页面没有 chatId,则说明是新建状态，
    // 直接根据用户输入生成一个新的记录
    const record = createChatRecord({ title })
    await addChatRecord(record)
    router.replace({ name: 'chat', params: { id: record.id } })
  } else {
    // 以最新用户发送的消息作为记录的标题
    updateChatRecord({ id: chatId.value, title })
  }
}

const loading = ref(false)
let assistantWaiting: number | undefined

const onMessage = async (message: string) => {
  if (!message || message === '') return

  await checkChatRecord(message)

  loading.value = true

  await addUserMessage(message)
  // 用户发送的消息，直接将列表滚动到底部
  scrollToBottom()
  // 创建一个新的消息容器，但置空，等待服务器消息流填充内容
  assistantWaiting = addAssistantEmptyMessage()

  const response = await sendMessage(message, {
    ...getLastContext(),
  })

  if (response.type === 'success') {
    await updateAssistantMessage(assistantWaiting, response.payload, true)
    messageText.value = ''
  } else {
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
