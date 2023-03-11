<template>
    <label class="flex items-center">
        <input
        type="checkbox"
        v-model="value"
        @change="handleChange"
        class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-lg
          focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
          focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <span
          class="ml-3 text-md leading-5 text-white select-none"
          :class="{
            'font-bold text-cyan-300': value,
            'font-normal': !value
          }"
        >{{ label }}</span>
    </label>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Checkbox',
  data() {
    return {
      value: false
    }
  },
  props: {
    label: {
      type: String,
      required: true
    }
  },
  emits: ['update:value'],
  methods: {
    handleChange(e) {
      this.$emit('update:value', {
        reason: this.label,
        checked: e.target.checked
      })
    }
  }
})
</script>
