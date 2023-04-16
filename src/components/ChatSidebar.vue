<script lang="ts" setup>
import { estimateTokens } from '~/utils'
const router = useRouter()
const { t } = useI18n()
const { recordList, createChatRecord, addChatRecord, updateChatRecord } =
  useChatRecord()

const { loadPrompt, promptList } = usePrompt()
loadPrompt()

const record = ref<{ title: string; act: string; prompt: string }>({
  title: '',
  act: 'Default',
  prompt: '',
})

const modalType = ref<'create' | 'edit'>('create')
const modalShow = ref(false)
const placeholder = computed(() =>
  record.value.act === 'Default' ? 'New Chat' : record.value.act,
)
const modalTitle = computed(() =>
  modalType.value === 'create' ? t('sidebar.addChat') : t('sidebar.editChat'),
)
const recordItem = ref<ChatRecord | null>()

const newChatRecord = async () => {
  modalShow.value = true
  modalType.value = 'create'
  record.value = { title: '', act: 'Default', prompt: '' }
}
const editRecord = (item: ChatRecord) => {
  modalShow.value = true
  modalType.value = 'edit'
  recordItem.value = item
  record.value = {
    title: item.title,
    act: item.act || 'Default',
    prompt: item.prompt || '',
  }
}

const onSubmit = async () => {
  const { title, act, prompt } = record.value
  if (modalType.value === 'create') {
    const raw = createChatRecord({
      title: title || placeholder.value,
      act,
      prompt,
      pinTitle: !!title,
    })
    await addChatRecord(raw)
    router.push({ name: 'chat', params: { id: raw.id } })
  } else {
    const raw = toRaw(recordItem.value!)
    raw.pinTitle = raw.pinTitle || title !== raw.title
    raw.title = title
    await updateChatRecord(raw)
  }
  modalShow.value = false
}

const onSelect = (act: string) => {
  const item = promptList.value.find((item) => item.act === act)
  record.value.prompt = item?.prompt || ''
}
</script>

<template>
  <div class="chat-sidebar" size="23" min-size="10" max-size="23">
    <div class="chat-sidebar-container">
      <ChatSidebarItem
        v-for="record in recordList"
        :key="record.id"
        :record="record"
        @on-edit="editRecord"
      />
    </div>
    <div class="chat-sidebar-footer">
      <n-button type="primary" dashed @click="newChatRecord">
        {{ t('sidebar.addChat') }}
      </n-button>
    </div>
  </div>
  <NModal
    v-model:show="modalShow"
    preset="card"
    closable
    :bordered="false"
    :style="{ width: '50%' }"
    :title="modalTitle"
  >
    <NForm v-model="record" label-placement="left" label-width="60px">
      <NFormItem label="Title" path="title">
        <NInput v-model:value="record.title" :placeholder="placeholder" />
      </NFormItem>
      <NFormItem label="Act to" path="Act">
        <NSelect
          v-model:value="record.act"
          :options="promptList"
          label-field="act"
          :disabled="modalType === 'edit'"
          filterable
          value-field="act"
          @update:value="onSelect"
        ></NSelect>
      </NFormItem>
      <NFormItem v-if="record.prompt" label="Prompt">
        <NInput
          v-model:value="record.prompt"
          type="textarea"
          autosize
          show-count
          :count-graphemes="estimateTokens"
        />
        <!-- <p class="break-words leading-6 py-2 px-2 bg-light-300">
          {{ record.prompt }}
        </p> -->
      </NFormItem>
    </NForm>
    <template #footer>
      <div class="flex justify-end">
        <NButton type="primary" @click="onSubmit">{{
          t('sidebar.submit')
        }}</NButton>
      </div>
    </template>
  </NModal>
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
