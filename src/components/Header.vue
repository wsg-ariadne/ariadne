<script setup>
import PillCount from '@/components/PillCount.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <header class="flex justify-between items-center h-16 mx-6">
    <!-- Navigation -->
    <div>
      <!-- Back icon -->
      <div
        v-show="$route.path !== '/'"
        @click="goBack"
        class="p-2 m-[-0.5rem] mr-2 inline-block align-middle rounded-lg 
        hover:bg-adn-turquoise transition-colors cursor-pointer"
      >
        <ArrowLeftIcon
          class="h-6 w-6 flex-none text-adn-dark"
        />
      </div>
      
      <!-- App logo -->
      <img v-show="$route.path === '/'"
        class="h-4 inline-block"
        src="/assets/logotype.svg"
        alt="ariadne"
      />
    </div>
    
    <!-- Controls -->
    <div class="flex flex-row items-center justify-between">
      <!-- Settings shortcut -->
      <!-- <div
        v-show="$route.path === '/'"
        @click="$router.push('/settings')"
        class="p-2 m-[-0.5rem] mr-1 rounded-lg 
        hover:bg-adn-turquoise transition-colors cursor-pointer"
      >
        <Cog6ToothIcon
          class="h-6 w-6 flex-none text-adn-dark"
        />
      </div> -->

      <!-- Beta indicator -->
      <PillCount compact>ALPHA</PillCount>
    </div>
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
