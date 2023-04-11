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
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'

export default defineComponent({
  name: 'App',
  components: {
    RouterView,
    Header
  }
})
</script>
