<script setup>
import { RouterLink } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <header class="flex p-2 justify-between items-center">
    <!-- App logo -->
    <div v-if="$route.path == '/'" class="flex flex-1 items-center justify-center">
      <img class="h-4 m-auto dark:brightness-0 dark:invert" src="@/assets/logotype.svg" alt="Logo" />
    </div>

    <div v-else>
      <!-- Back icon that only appears when not at root -->
      <RouterLink to="/">
        <ArrowLeftIcon class="h-4 w-4 m-2 flex-none text-white" />
      </RouterLink>
      
      <!-- Page title -->
      <div class="flex flex-1 items-center ml-2">
        <h1 class="text-white align-middle text-lg font-bold">{{ $route.meta.title }}</h1>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  background: var(--color-background);
  height: 2.5rem;
}
</style>
