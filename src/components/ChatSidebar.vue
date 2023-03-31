<script lang="ts" setup>
const router = useRouter()
const { recordList, createChatRecord, addChatRecord } = useChatRecord()

const newChatRecord = async () => {
  const record = createChatRecord()
  await addChatRecord(record)
  router.push({ name: 'chat', params: { id: record.id } })
}
</script>

<template>
  <div class="chat-sidebar" size="23" min-size="10" max-size="23">
    <div class="chat-sidebar-container">
      <ChatSidebarItem
        v-for="record in recordList"
        :key="record.id"
        :record="record"
      />
    </div>
    <div class="chat-sidebar-footer">
      <n-button type="primary" dashed @click="newChatRecord">
        Add New Chat
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.chat-sidebar {
  @apply w-56 flex flex-col flex-shrink-0 h-full pb-4;
  @apply border-r-1 border-r-light-800 dark:border-r-dark-300;
}
.chat-sidebar-container {
  @apply flex-1 overflow-auto pt-8;
}
.chat-sidebar-footer {
  @apply flex-shrink-0 flex items-center justify-center pt-4;
}
</style>
