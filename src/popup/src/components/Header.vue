<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <header class="flex items-center bg-adn-indigo h-12"
    :class="{
      'justify-center': $route.path === '/',
      'justify-between p-2': $route.path !== '/'
    }">
    <!-- App logo -->
    <img v-show="$route.path === '/'"
    class="h-4 m-auto dark:brightness-0 dark:invert"
    src="@/assets/logotype.svg"
    alt="ariadne"
    />

    <!-- Back icon -->
    <ArrowLeftIcon v-show="$route.path !== '/'"
    @click="goBack"
    class="h-6 w-6 p-1 m-2 flex-none text-white cursor-pointer"
    />
    
    <!-- Page title -->
    <h1 v-show="$route.path !== '/'"
    class="flex-1 items-center ml-2 text-white align-middle text-lg font-bold"
    >
      {{ $route.meta.title }}
    </h1>
  </header>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Header',

  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
})
</script>
