<template>
  <main>
    <h1 class="text-2xl text-white">Select reasons</h1>

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
            v-model="customReason"
            ref="customReasonArea"
          ></textarea>
        </div>
      </div>

      <!-- Form controls -->
      <div class="mt-4 grid gap-4 grid-rows-1 grid-cols-2">
        <!-- Submission button -->
        <BigButton
          :disabled="selectedReasons.length === 0 || (selectedReasons.includes('Others') && customReason.length === 0)"
          @click="submitReport">
          Submit
        </BigButton>

        <!-- Cancel button -->
        <BigButton @click="submitReport">
          Cancel
        </BigButton>
      </div>
    </div>
  </main>
</template>

<script>
import { defineComponent } from 'vue'
import { useAriadneStore } from '@/stores/ariadne';
import BigButton from '@/components/BigButton.vue'
import Checkbox from '@/components/Checkbox.vue'

export default defineComponent({
  name: 'FalseNegativeView',
  components: {
    BigButton,
    Checkbox
  },
  data() {
    return {
      selectedReasons: [],
      customReason: '',
    }
  },
  setup() {
    return {
      store: useAriadneStore(),
      reasons: [
        'Unclear language on cookie banner',
        'Weighted options',
        'Pre-filled options',
        'Others'
      ]
    }
  },
  methods: {
    handleReasonChange(args) {
      if (args.checked) {
        this.selectedReasons.push(args.reason)

        // If "Others" is selected, clear the custom reason and focus the textarea
        if (args.reason === 'Others') {
          this.customReason = ''
          setTimeout(() => {
            this.$refs.customReasonArea.focus()
          }, 100)
        }
      } else {
        this.selectedReasons = this.selectedReasons.filter(
          (r) => r !== args.reason
        )
      }
    },
    submitReport(e) {
      e.preventDefault()
      console.log('Submitting report', {
        selectedReasons: this.selectedReasons,
        customReason: this.customReason,
        url: this.store.url,
        isRunningInExtension: this.store.isRunningInExtension
      })
    }
  }
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
