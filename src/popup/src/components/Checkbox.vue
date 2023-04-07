<script setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div
    @click="handleChange"
    class="group rounded-lg box-border border-2 
      px-6 py-4 flex flex-row justify-between items-start
      transition-colors cursor-pointer select-none"
    :class="{
      'bg-adn-dark border-adn-dark': isChecked,
      'bg-white border-adn-border': !isChecked
    }"
  >
    <div :class="isChecked ? 'text-white' : 'text-adn-dark'">
      <h1 class="font-bold font-mono text-xl transition-colors">
        <slot />
      </h1>
      <p class="mt-2 transition-colors">
        <slot name="description" />
      </p>
    </div>
    <div class="shrink-0 ml-2">
      <MinusIcon v-if="isChecked" class="h-6 w-6 text-white" />
      <PlusIcon v-else class="h-6 w-6 text-adn-dark" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Checkbox',
  data() {
    return {
      isChecked: false
    }
  },
  props: {
    checkboxKey: {
      type: String,
      required: true
    }
  },
  emits: ['update:value'],
  methods: {
    handleChange(e) {
      this.isChecked = !this.isChecked
      this.$emit('update:value', {
        key: this.checkboxKey,
        checked: this.isChecked
      })
    }
  }
})
</script>
