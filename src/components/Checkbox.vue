<script setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div
    @click="handleChange"
    class="group rounded-lg box-border border-2 
      px-4 py-3 flex flex-row justify-between items-start
      transition-colors select-none"
    :class="{
      'bg-adn-dark border-adn-dark': isChecked,
      'bg-white border-adn-border': !isChecked,
      'cursor-not-allowed opacity-30': disabled,
      'cursor-pointer': !disabled
    }"
  >
    <div :class="isChecked ? 'text-white' : 'text-adn-dark'">
      <h1 class="font-bold font-mono text-lg transition-colors">
        <slot />
      </h1>
      <p class="mt-2 transition-colors text-sm">
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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:value'],
  methods: {
    handleChange(e) {
      if (this.disabled) { return }
      this.isChecked = !this.isChecked
      this.$emit('update:value', {
        key: this.checkboxKey,
        checked: this.isChecked
      })
    }
  }
})
</script>
