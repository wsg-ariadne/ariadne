<script setup>
import { ref } from 'vue'
import BigButton from '@/components/BigButton.vue'
import Checkbox from '@/components/Checkbox.vue'

const reasons = [
  'Unclear language on cookie banner',
  'Weighted options',
  'Pre-filled options',
  'Others'
]

const selectedReasons = ref([])

const handleReasonChange = (args) => {
  console.log('Called handleReasonChange', { args })
  if (args.checked) {
    selectedReasons.value.push(args.reason)
  } else {
    selectedReasons.value = selectedReasons.value.filter(
      (r) => r !== args.reason
    )
  }
}
</script>

<template>
  <main>
    <h1 class="text-2xl text-white ml-8">Select reasons</h1>

    <!-- Types of deceptive design -->
    <div class="mt-4">
      <Checkbox
        v-for="reason in reasons"
        :key="reason"
        :label="reason"
        :value="selectedReasons.includes(reason)"
        @update:value="handleReasonChange"
        class="mb-2"
      />

      <!-- Textarea for "others" option -->
      <div v-show="selectedReasons.includes('Others')">
        <div class="relative ml-8">
          <textarea
            class="w-full h-24 p-2 box-border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            placeholder="Please specify"
          ></textarea>
        </div>
      </div>

      <!-- Form controls -->
      <div class="mt-4">
        <!-- Submission button -->
        <BigButton
          :disabled="selectedReasons.length === 0"
          @click="() => console.log('Submit')">
          Submit
        </BigButton>
      </div>
    </div>
  </main>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FalseNegativeView'
})
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
