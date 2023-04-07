<template>
  <main>
    <!-- Overlay for submission loading icon -->
    <div
      v-show="isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 z-10 select-none"
    >
      <div class="absolute inset-0 flex items-center justify-center">
        <ArrowPathIcon
          class="h-16 w-16 animate-spin text-white-900"
        />
      </div>
    </div>

    <!-- Title -->
    <h1 class="text-2xl text-white">Select reasons</h1>

    <!-- Types of deceptive design -->
    <div class="mt-4">
      <Checkbox
        v-for="reason in reasons"
        :key="reason.key"
        :label="reason.text"
        :label-id="reason.key"
        :value="selectedReasons.includes(reason.key)"
        @update:value="handleReasonChange"
        class="mb-2"
      />

      <!-- Textarea for "others" option -->
      <div v-show="selectedReasons.includes('other')">
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
import { useAriadneStore } from '@/stores/ariadne'
import { ArrowPathIcon } from '@heroicons/vue/24/solid'
import BigButton from '@/components/BigButton.vue'
import Checkbox from '@/components/Checkbox.vue'

export default defineComponent({
  name: 'FalseNegativeView',
  components: {
    ArrowPathIcon,
    BigButton,
    Checkbox
  },
  data() {
    return {
      selectedReasons: [],
      customReason: '',
      isLoading: false
    }
  },
  setup() {
    return {
      store: useAriadneStore(),
      reasons: [
        { text: 'Unclear language on cookie banner', key: 'unclear_language' },
        { text: 'Weighted options', key: 'weighted_options' },
        { text: 'Pre-filled options', key: 'prefilled_options' },
        { text: 'Others', key: 'other' }
      ]
    }
  },
  methods: {
    handleReasonChange(args) {
      if (args.checked) {
        console.log({args})
        this.selectedReasons.push(args.reason)

        // If "Others" is selected, clear the custom reason and focus the textarea
        if (args.reason === 'other') {
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

      // Send report to backend via POST
      this.isLoading = true
      fetch(import.meta.env.VITE_API_URL + '/api/v1/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deceptive_design_types: this.selectedReasons,
          custom_deceptive_design_type: this.customReason,
          page_url: this.store.url,
          is_running_in_extension: this.store.isRunningInExtension
        })
      })
        .then((res) => res.json())
        .then((res) => {
          console.log('Report submitted', res)
          this.isLoading = false
          this.$router.push('/')
        })
        .catch((err) => {
          console.error('Error submitting report', err)
          this.isLoading = false
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
