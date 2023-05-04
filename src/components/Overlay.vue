<template>
  <div
    v-show="isVisible"
    class="fixed inset-0 bg-black bg-opacity-80 z-10 select-none"
  >
    <div class="absolute inset-0 flex items-center justify-center">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Overlay',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isVisible() {
      return this.visible
    }
  }
})
</script>
