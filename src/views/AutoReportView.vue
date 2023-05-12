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

    <!-- Privacy statement -->
    <p class="mt-4 text-xs">
      As the extracted cookie banner text and screenshot may contain personal
      information, Ariadne will only submit them if you explicitly allow it to do so.
    </p>
    <p class="mt-1 text-xs">
      By clicking Submit, you allow Ariadne to submit a report to the Dionysus server
      at {{ dionysusUrl }} containing information about this page,
      along with any attachments and remarks you have provided.
      <a href="https://ariadne.dantis.me/privacy" class="underline" target="_blank">
        Click here to view our privacy policy.
      </a>
    </p>

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
      dionysusUrl: import.meta.env.VITE_API_URL,
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
        vote: this.vote
      }
      if (this.store.calliopeTripped !== '') {
        body.calliope_tripped = this.store.calliopeTripped === 'true'
      }
      if (this.store.janusResult !== '') body.janus_result = this.store.janusResult
      if (this.attachText && this.store.calliopeText !== '') body.calliope_text = this.store.calliopeText
      if (this.attachImage && this.store.janusScreenshot !== '') body.janus_screenshot = this.store.janusScreenshot
      if (this.remarks !== '') body.remarks = this.remarks

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