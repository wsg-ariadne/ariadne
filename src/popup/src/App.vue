<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <main class="text-white">
    <!-- Header -->
    <Header />

    <!-- Router view -->
    <div id="route-wrapper" class="p-4">
      <RouterView />
    </div>
  </main>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  transition: color 0.5s, background-color 0.5s;
  line-height: 1.6;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
    if (chrome && chrome.tabs) {
      const store = useAriadneStore()
      store.setRunningInExtension(true)
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url
        store.setUrl(url)
      })
    }
  },
})
</script>
