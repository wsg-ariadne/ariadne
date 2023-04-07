<template>
  <main class="bg-adn-light min-w-[22rem] max-w-[24rem]">
    <!-- Header -->
    <Header />

    <!-- Router view -->
    <div id="route-wrapper" class="px-6 pb-6 pt-3 font-sans">
      <RouterView />
    </div>
  </main>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>

<script>
import { defineComponent } from 'vue'
import { useAriadneStore } from '@/stores/ariadne'
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'

export default defineComponent({
  name: 'App',
  components: {
    RouterView,
    Header
  },
  mounted() {
    // Check if we're running in Chrome in the first place
    const store = useAriadneStore()
    if (chrome && chrome.tabs) {
      store.setRunningInExtension(true)

      // Save favicon URL to store
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const faviconUrl = tabs[0].favIconUrl
        store.setFavicon(faviconUrl)
      })

      // Save URL to store
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url

        // Extract domain and path from URL
        const urlObject = new URL(url)
        const domain = urlObject.hostname
        const path = urlObject.pathname

        // Set domain and path in store
        store.setDomain(domain)
        store.setPath(path)
      })
    } else {
      store.setRunningInExtension(false)
      store.setDomain('example.com')
      store.setFavicon('/assets/logomark.svg')
      store.setPath('/example/subpage?x=3')
    }
  },
})
</script>
