<template>
  <div id="app" class="bg-light-50 dark:bg-dark-900 relative">
    <div class="region absolute w-full h-4 z-10"></div>
    <div class="flex w-full h-full justify-start">
      <Navbar />
      <slot class="flex-1" />
    </div>
  </div>
</template>
