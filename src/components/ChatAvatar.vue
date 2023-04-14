<script lang="ts" setup>
defineProps<{
  role: Role
}>()
</script>

<template>
  <div class="avatar" :class="[role === 'user' ? 'user' : 'assistant']">
    <NIcon size="30">
      <UserIcon v-if="role === 'user'" />
      <OpenAIIcon v-else />
    </NIcon>
  </div>
</template>

<style scoped>
.avatar {
  @apply flex justify-center items-center w-10 h-10 rounded-md;
}

.avatar.user {
  @apply bg-light-100 dark:bg-gray-800;
}

.avatar.assistant {
  background-color: rgb(16, 163, 127);
  color: #eee;
}
</style>
