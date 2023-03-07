<script setup>
import { RouterView } from 'vue-router'
import { useAriadneStore } from '@/stores/ariadne'
import Header from './components/Header.vue'

const store = useAriadneStore()
</script>

<template>
  <!-- Header -->
  <Header />

  <!-- Router view -->
  <div id="route-wrapper" class="p-4">
    <RouterView />
  </div>
</template>

<style>
#app {
  width: 350px;
  margin: 0 auto;
  font-weight: normal;
}
</style>

<script>
import { defineComponent } from 'vue'
import { useAriadneStore } from '@/stores/ariadne'

export default defineComponent({
  name: 'App',

  // Detect current tab's URL on load using Chrome's API
  mounted() {
    // Check if we're running in Chrome in the first place
    if (!chrome || !chrome.tabs) {
      return
    }

    const store = useAriadneStore()
    store.setRunningInExtension(true)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url
      store.setUrl(url)
    })
  },
})
</script>
