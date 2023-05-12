<template>
  <div>
    <!-- Parent element, whose hover state triggers tooltip -->
    <div
      :data-tooltip-target="tooltipId"
      :data-tooltip-placement="placement"
    >
      <slot name="parent"></slot>
    </div>

    <!-- Tooltip -->
    <div
      :id="tooltipId"
      role="tooltip"
      class="absolute z-10 invisible inline-block px-3 py-2 text-sm
        font-medium rounded-lg shadow-sm opacity-0 tooltip"
      :class="colorClasses"
    >
      <span><slot name="tooltip"></slot></span>
      <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { initTooltips } from 'flowbite'

export default defineComponent({
  name: 'Tooltip',
  mounted() {
    initTooltips()
  },
  props: {
    tooltipId: {
      type: String,
      required: true
    },
    bgColorClass: {
      type: String,
      default: 'bg-gray-900'
    },
    textColorClass: {
      type: String,
      default: 'text-white'
    },
    placement: {
      type: String,
      default: 'top'
    }
  },
  computed: {
    colorClasses() {
      return `${this.bgColorClass} ${this.textColorClass}`
    }
  }
})
</script>