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
    <h1 class="text-3xl font-mono font-bold mb-4">Report deceptive design</h1>

    <!-- Page details -->
    <h4 class="font-bold">Domain</h4>
    <p class="font-mono w-full truncate">{{ store.currentDomain }}</p>
    <h4 class="mt-4 font-bold">Path</h4>
    <p class="font-mono w-full truncate">{{ store.currentPath }}</p>

    <!-- Types of deceptive design -->
    <h4 class="mt-4 font-bold">Types (select all that apply)</h4>
    <div class="mt-4">
      <Checkbox
        v-for="reason in reasons"
        :key="reason.key"
        :checkbox-key="reason.key"
        :value="selectedReasons.includes(reason.key)"
        @update:value="handleReasonChange"
        class="mb-4"
      >
        <template #default>{{ reason.text }}</template>
        <template #description>{{ reason.description }}</template>
      </Checkbox>

      <!-- Textarea for "others" option -->
      <div v-show="selectedReasons.includes('other')">
        <textarea
          class="w-full h-24 p-2 box-border rounded-lg bg-white"
          placeholder="Tell us more..."
          v-model="customReason"
          ref="customReasonArea"
        ></textarea>
      </div>

      <!-- Form controls -->
      <div class="mt-8 grid gap-4 grid-rows-1 grid-cols-2">
        <!-- Submission button -->
        <BigButton centered-text
          :disabled="selectedReasons.length === 0 || (selectedReasons.includes('Others') && customReason.length === 0)"
          @click="submitReport">
          Submit
        </BigButton>

        <!-- Cancel button -->
        <BigButton centered-text @click="$router.go(-1)">
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
  name: 'ReportPositiveView',
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
        {
          key: 'unclear_language',
          text: 'Unclear language',
          description: 'The cookie banner does not explicitly or clearly ask for my consent to use cookies'
        },
        {
          key: 'prefilled_options',
          text: 'Pre-filled options',
          description: 'The cookie banner has options that were filled out for me, e.g., pre-checked checkboxes for different types of cookies'
        },
        {
          key: 'weighted_options',
          text: 'Weighted options',
          description: 'The controls on the cookie banner are weighted, i.e., designed to bring more visual emphasis on one option over another'
        },
        {
          key: 'other',
          text: 'Others',
          description: 'I noticed another type of deceptive design on the cookie banner that wasn\'t included above'
        }
      ]
    }
  },
  methods: {
    handleReasonChange(args) {
      if (args.checked) {
        console.log({args})
        this.selectedReasons.push(args.key)

        // If "Others" is selected, clear the custom reason and focus the textarea
        if (args.key === 'other') {
          this.customReason = ''
          setTimeout(() => {
            this.$refs.customReasonArea.focus()
          }, 100)
        }
      } else {
        this.selectedReasons = this.selectedReasons.filter(
          (r) => r !== args.key
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
