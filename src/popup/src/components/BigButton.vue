<script setup>
import { ArrowSmallRightIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <button class="group rounded-lg box-border border-2 border-adn-border select-none
    bg-white transition-colors px-4 py-3 flex flex-row justify-between items-center
    "
    :class="{
      'text-center': centeredText,
      'text-left': !centeredText,
      'opacity-50 cursor-not-allowed': disabled,
      'hover:border-adn-turquoise hover:bg-adn-turquoise active:border-adn-teal active:bg-adn-teal cursor-pointer': !disabled,
    }"
  >
    <div class="grow">
      <h1 class="text-lg font-bold font-mono text-adn-dark"><slot></slot></h1>
      <p><slot name="description"></slot></p>
    </div>
    <div
      v-show="arrow"
      class="h-8 w-8 ml-2 shrink-0 bg-adn-turquoise
        rounded-full flex justify-center items-center transition-colors">
      <ArrowSmallRightIcon
        class="h-6 w-6 text-adn-dark transition-colors"
      />
    </div>
  </button>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BigButton',
  props: {
    arrow: {
      type: Boolean,
      default: false
    },
    centeredText: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
</script>
