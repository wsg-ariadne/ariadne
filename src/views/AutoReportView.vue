<template>
  <main>
    <!-- Overlay for loading icon -->
    <Overlay :visible="isLoading" />

    <!-- Title -->
    <h1 class="text-2xl font-mono font-bold mb-4">Submit detection feedback</h1>

    <!-- Page details -->
    <h4 class="font-bold text-sm">Domain</h4>
    <p class="font-mono text-base w-full truncate">{{ store.currentDomain }}</p>
    <h4 class="mt-4 font-bold text-sm">Path</h4>
    <p class="font-mono text-base w-full truncate">{{ store.currentPath }}</p>

    <!-- Report details -->
    <h4 class="mt-4 font-bold text-sm">Reporting as</h4>
    <p class="font-mono text-base w-full truncate mb-2">{{ reportType }}</p>
    <textarea
      class="w-full h-24 p-2 box-border rounded-lg bg-white"
      placeholder="Tell us more..."
      v-model="remarks"
    ></textarea>

    <!-- Report attachments -->
    <h4 class="mt-4 font-bold text-sm">Attachments</h4>
    <p>
      You can choose to include the items below in your report by clicking them.
      This will help us improve Ariadne in the future.
    </p>
    <Checkbox
      checkbox-key="attachment-text"
      :value="attachText"
      class="my-2"
      @update:value="handleCheckboxChange"
      :disabled="this.store.calliopeText === ''"
    >
      <template #default>Cookie banner text</template>
      <template #description>{{ truncatedText }}</template>
    </Checkbox>
    <Checkbox
      checkbox-key="attachment-image"
      :value="attachImage"
      class="mb-4"
      @update:value="handleCheckboxChange"
      :disabled="this.store.janusScreenshot === ''"
    >
      <template #default>Screenshot</template>
      <template #description>
        <img
          class="w-full h-auto"
          :src="store.janusScreenshot"
          alt="Screenshot"
        />
      </template>
    </Checkbox>

    <!-- Form controls -->
    <div class="mt-8 grid gap-4 grid-rows-1 grid-cols-2">
      <!-- Submission button -->
      <BigButton
        centered-text
        @click="submitReport"
      >
        Submit
      </BigButton>

      <!-- Cancel button -->
      <BigButton centered-text @click="$router.go(-1)">
        Cancel
      </BigButton>
    </div>
  </main>
</template>

<script>
import { defineComponent } from 'vue'
import { useAriadneStore } from '@/stores/ariadne'
import { useRoute } from 'vue-router'
import BigButton from '../components/BigButton.vue'
import Checkbox from '../components/Checkbox.vue'
import Overlay from '../components/Overlay.vue'

export default defineComponent({
  name: 'AutoReportView',
  components: {
    BigButton,
    Checkbox,
    Overlay
  },
  setup() {
    const route = useRoute()

    return {
      vote: route.query.vote === 'true',
      store: useAriadneStore()
    }
  },
  data() {
    return {
      isLoading: false,
      remarks: '',
      attachText: false,
      attachImage: false
    }
  },
  computed: {
    reportType() {
      return this.vote ? 'Correct' : 'Incorrect'
    },
    truncatedText() {
      return this.store.calliopeText.length > 100
        ? this.store.calliopeText.substring(0, 100) + '...'
        : this.store.calliopeText
    }
  },
  methods: {
    handleCheckboxChange(e) {
      if (e.key === 'attachment-text') {
        this.attachText = e.checked
      } else if (e.key === 'attachment-image') {
        this.attachImage = e.checked
      }
    },
    submitReport(e) {
      e.preventDefault()

      // Assemble request body
      const body = {
        page_url: 'http://' + this.store.currentDomain + this.store.currentPath,
        calliope_tripped: this.store.calliopeTripped,
        janus_result: this.store.janusResult,
        vote: this.vote
      }
      console.log(body)
      if (this.remarks !== '') body.remarks = this.remarks
      if (this.attachText) body.calliope_text = this.store.calliopeText
      if (this.attachImage) body.janus_screenshot = this.store.janusScreenshot

      // Send report to backend via POST
      this.isLoading = true
      fetch(import.meta.env.VITE_API_URL + '/api/v1/classify/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
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