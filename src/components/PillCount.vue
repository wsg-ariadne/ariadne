<template>
  <div
    class="inline-flex align-middle justify-center items-center rounded-full px-2"
    :class="{
      'bg-adn-teal': highlighted,
      'bg-adn-dark': !highlighted,
      'py-0.5 min-w-[2rem]': compact,
      'py-1 min-w-[3rem]': !compact
    }"
  >
    <span
      class="font-mono font-bold text-adn-light"
      :class="compact ? 'text-sm' : 'text-base'"
    >
      <slot />
    </span>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PillCount',
  props: {
    compact: {
      type: Boolean,
      default: false
    },
    highlighted: {
      type: Boolean,
      default: false
    }
  }
})
</script>
