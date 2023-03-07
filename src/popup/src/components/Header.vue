<script setup>
import { RouterLink } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <!-- Header for root path -->
  <header v-if="$route.path === '/'" class="flex justify-center items-center">
    <!-- App logo -->
    <img class="h-4 m-auto dark:brightness-0 dark:invert" src="@/assets/logotype.svg" alt="ariadne" />
  </header>

  <!-- Header for non-root paths -->
  <header v-else class="flex p-2 justify-between items-center">
    <!-- Back icon -->
    <RouterLink to="/" class="flex-none">
      <ArrowLeftIcon class="h-4 w-4 m-2 text-white" />
    </RouterLink>
    
    <!-- Page title -->
    <h1 class="flex-1 items-center ml-2 text-white align-middle text-lg font-bold">{{ $route.meta.title }}</h1>
  </header>
</template>

<style scoped>
header {
  background: var(--color-background);
  height: 2.5rem;
}
</style>
