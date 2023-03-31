<script lang="ts" setup>
import { type SendMessageOptions } from 'chatgpt'
import { Splitpanes } from 'splitpanes'
import { chatMessageError } from '~/common/constants'
import 'splitpanes/dist/splitpanes.css'

checkAppConfig()

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const chatId = computed<string>(() =>
  route.name === 'chat' ? (route.params.id as string) : '',
)
const messageText = ref('')

const { sendMessage, onMessageProgress } = useChatApi()
const {
  recordList,
  createChatRecord,
  addChatRecord,
  loadChatRecord,
  updateChatRecord,
} = useChatRecord()

const {
  messageList,
  loadChatMessage,
  addAssistantEmptyMessage,
  updateAssistantMessage,
  addUserMessage,
  getLastContext,
  clearChatMessage,
} = useChatMessage(chatId)

const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()

watch(
  chatId,
  async () => {
    await loadChatRecord()
    await loadChatMessage()
    messageText.value = ''
    if (scrollRef.value) scrollToBottom()
  },
  { immediate: true },
)

const memoryMode = computed<boolean>(() => {
  if (chatId.value) {
    const record = recordList.value.find((item) => item.id === chatId.value)
    return record ? record.memoryMode : true
  }
  return true
})
const toggleMemoryMode = async () => {
  await updateChatRecord({
    id: chatId.value,
    memoryMode: !memoryMode.value,
  })
}

async function checkChatRecord(title: string) {
  if (title.length > 50) {
    title = `${title.slice(0, 50)}...`
  }
  if (!chatId.value) {
    // 如果当前页面没有 chatId,则说明是新建状态，
    // 直接根据用户输入生成一个新的记录
    const record = createChatRecord({ title })
    await addChatRecord(record)
    router.replace({ name: 'chat', params: { id: record.id } })
  } else {
    // 以最新用户发送的消息作为记录的标题
    await updateChatRecord({ id: chatId.value, title })
  }
}

const loading = ref(false)
let assistantWaiting: number | undefined

const onMessage = async (message: string) => {
  message = message
    .trim()
    .replace(/^\n+|\n+$/g, '')
    .trim()
  if (message === '') return

  await checkChatRecord(message)

  loading.value = true

  await addUserMessage(message)

  const options: SendMessageOptions = memoryMode.value ? getLastContext() : {}

  // 用户发送的消息，直接将列表滚动到底部
  scrollToBottom()
  // 创建一个新的消息容器，但置空，等待服务器消息流填充内容
  assistantWaiting = addAssistantEmptyMessage()

  const response = await sendMessage(message, options)

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
    messageText.value = ''
    scrollToBottomIfAtBottom()
  }
})

const dialog = useDialog()
const clearMessageList = () => {
  dialog.info({
    title: t('dialog.clearMessage.title'),
    content: t('dialog.clearMessage.content'),
    positiveText: t('dialog.clearMessage.submit'),
    negativeText: t('dialog.clearMessage.cancel'),
    onPositiveClick: async () => {
      await clearChatMessage(chatId.value, true)
    },
  })
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="chatgpt-wrapper flex flex-1 h-full">
    <ChatSidebar />
    <Splitpanes class="chatgpt-container flex-1 flex flex-col" horizontal>
      <ChatMessageList
        :ref="(c: any) => (scrollRef = c?.$el)"
        :list="messageList"
      />
      <ChatTextArea
        v-model="messageText"
        :loading="loading"
        @message="onMessage"
      >
        <div class="flex justify-start items-center">
          <NPopover>
            {{ t('dialog.clearMessage.title') }}
            <template #trigger>
              <NIcon class="icon" size="24" @click="clearMessageList">
                <DeleteIcon
              /></NIcon>
            </template>
          </NPopover>
          <NPopover>
            <NH5>{{
              memoryMode ? t('chat.memory.enabled') : t('chat.memory.disabled')
            }}</NH5>
            <p>{{ t('chat.memory.content') }}</p>
            <template #trigger>
              <NIcon
                class="icon"
                :class="{ active: memoryMode }"
                size="18"
                @click="toggleMemoryMode"
                ><MemoryIcon
              /></NIcon>
            </template>
          </NPopover>
        </div>
      </ChatTextArea>
    </Splitpanes>
  </div>
</template>

<style scoped>
.chatgpt-container {
  @apply bg-light-600 dark:bg-dark-900 pb-2;
}
.icon {
  @apply mr-4 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors;
}
.icon.active {
  @apply text-green-500;
}
</style>
