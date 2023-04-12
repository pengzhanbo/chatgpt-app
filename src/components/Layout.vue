<script lang="ts" setup>
import { invoke } from '@tauri-apps/api'

const onDrag = async () => await invoke('drag_window')
</script>

<template>
  <div id="app" class="bg-light-50 dark:bg-dark-900 relative">
    <div
      class="absolute w-full h-4 z-10"
      data-tauri-drag-region
      @mousedown="onDrag"
      @touchstart="onDrag"
    ></div>
    <div class="flex w-full h-full justify-start">
      <Navbar />
      <slot class="flex-1" />
    </div>
  </div>
</template>
