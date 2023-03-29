<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <div class="setting-container">
    <div class="setting-content">
      <div class="setting-header">
        <NH2>{{ t('navbar.setting') }}</NH2>
      </div>
      <SettingForm></SettingForm>
    </div>
  </div>
</template>

<style scoped>
.setting-container {
  @apply flex-1 h-full pt-10 px-5 pb-5 flex items-center justify-center overflow-auto;
}
.setting-content {
  @apply inline-block max-w-full min-w-96 m-auto py-5;
}
.setting-header {
  @apply mb-10 border-b border-b-light-800;
}
</style>
