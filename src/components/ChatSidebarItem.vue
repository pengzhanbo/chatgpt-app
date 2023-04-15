<script lang="ts" setup>
import { sidebarOptions } from '~/common/constants'
const props = defineProps<{
  record: ChatRecord
}>()
const emit = defineEmits<{
  (event: 'on-edit', record: ChatRecord): void
}>()

const route = useRoute()
const router = useRouter()
const chatId = computed(() => route.params.id)
const dialog = useDialog()
const { t } = useI18n()

const toggleChat = () => {
  router.push({ name: 'chat', params: { id: props.record.id } })
}
const { deleteChatRecord, recordList } = useChatRecord()
const { clearChatMessage } = useChatMessage('')

const deleteRecord = async () => {
  dialog.info({
    title: t('dialog.deleteRecord.title'),
    content: t('dialog.deleteRecord.content'),
    positiveText: t('dialog.deleteRecord.submit'),
    negativeText: t('dialog.deleteRecord.cancel'),
    onPositiveClick: async () => {
      await deleteChatRecord(props.record.id)
      await clearChatMessage(props.record.id, true)
      const first = recordList.value[0]
      if (first) {
        router.push({ name: 'chat', params: { id: first.id } })
      } else {
        router.push({ name: 'chat' })
      }
    },
  })
}

const onSelect = async (key: 'edit' | 'delete') => {
  if (key === 'edit') emit('on-edit', props.record)
  if (key === 'delete') await deleteRecord()
}
</script>

<template>
  <div
    class="chat-sidebar-item"
    :class="{
      active: record.id === chatId,
    }"
  >
    <div class="flex-1 flex items-center cursor-pointer" @click="toggleChat">
      <NIcon size="16"><MessageIcon /></NIcon>
      <NEllipsis class="ml-3 flex-1 w-0">{{ record.title }}</NEllipsis>
    </div>
    <NDropdown
      :options="sidebarOptions"
      size="small"
      :render-label="({ label }) => t(label as string)"
      @select="onSelect"
    >
      <NIcon class="icon" size="20">
        <MoreIcon />
      </NIcon>
    </NDropdown>
  </div>
</template>

<style scoped>
.chat-sidebar-item {
  @apply h-12 flex items-center border-b border-b-light-800;
  @apply pl-3 dark:border-b-dark-300 dark:text-gray-500;
  @apply transition-colors bg-transparent;
}
.chat-sidebar-item.active {
  @apply bg-light-400 dark:bg-dark-600 dark:text-gray-400;
}
.chat-sidebar-item:last-of-type {
  @apply border-none;
}
.icon {
  @apply mr-1 text-gray-500 cursor-pointer;
}
</style>
