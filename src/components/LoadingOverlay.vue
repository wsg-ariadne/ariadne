<script setup>
import { ArrowPathIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <div
    v-show="visible"
    class="fixed inset-0 bg-black bg-opacity-50 z-10 select-none"
  >
    <div class="absolute inset-0 flex items-center justify-center">
      <ArrowPathIcon
        class="h-16 w-16 animate-spin text-white"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoadingOverlay',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  }
})
</script>
