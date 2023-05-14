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
    <h4 class="mt-4 font-bold text-sm">Calliope result</h4>
    <p class="font-mono text-base w-full truncate mb-2">Likely {{ calliopeResult }}</p>
    <h4 class="mt-2 font-bold text-sm">Janus result</h4>
    <p class="font-mono text-base w-full truncate mb-2">Likely {{ store.janusResult || 'no banner present' }}</p>
    <h4 class="mt-2 font-bold text-sm">Reporting as</h4>
    <p class="font-mono text-base w-full truncate mb-4">{{ reportType }} detection</p>
    <textarea
      class="w-full h-24 p-2 box-border rounded-lg bg-white"
      placeholder="Tell us more..."
      v-model="remarks"
    ></textarea>

    <!-- Report attachments -->
    <div class="mt-4" v-show="attachmentsPresent">
      <h4 class="font-bold text-sm">Attachments</h4>
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
        <template #default>Text content</template>
        <template #description>{{ store.calliopeText }}</template>
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
            v-show="store.janusScreenshot !== ''"
            class="w-full h-auto"
            :src="store.janusScreenshot"
            alt="Screenshot"
          />
        </template>
      </Checkbox>

      <p class="mt-4 text-xs">
        As the extracted cookie banner text and screenshot may contain personal
        information, Ariadne will only submit them if you explicitly allow it to do so.
      </p>
    </div>

    <!-- Privacy statement -->
    <p class="mt-2 text-xs">
      By clicking Submit, you allow Ariadne to submit a report to the Dionysus server
      at {{ dionysusUrl }} containing information about this page,
      along with any attachments and remarks you have provided.
      <a href="https://wsg-ariadne.github.io/privacy" class="underline" target="_blank">
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
    attachmentsPresent() {
      return this.store.calliopeText !== '' || this.store.janusScreenshot !== ''
    },
    calliopeResult() {
      console.log(this.store.calliopeTripped)
      if (this.store.calliopeTripped !== '') {
        return this.store.calliopeTripped === 'true' ? 'unclear language' : 'clear language'
      } else {
        return 'no banner present'
      }
    },
    reportType() {
      return this.vote ? 'Correct' : 'Incorrect'
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