<script setup>
import BigButton from '@/components/BigButton.vue'
import { useAriadneStore } from '@/stores/ariadne'

const store = useAriadneStore()
</script>

<template>
  <main>
    <p class="text-center mb-4">Actions for
      <span class="font-bold text-white">{{ store.isRunningInExtension ? store.url : "(site name)" }}</span>
    </p>

    <!-- Report false negative -->
    <RouterLink to="/false-negative">
      <BigButton class="w-full mb-4">
        Report Deceptive Design
      </BigButton>
    </RouterLink>

    <!-- Report false positive -->
    <BigButton class="w-full">
      Report Incorrect Detection
    </BigButton>
  </main>
</template>
