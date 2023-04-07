<script setup>
import BigButton from '@/components/BigButton.vue'
import PillCount from '@/components/PillCount.vue'
import { useAriadneStore } from '@/stores/ariadne'

const store = useAriadneStore()
</script>

<template>
  <main>
    <!-- Favicon and domain name -->
    <div class="mb-4 flex justify-between items-center">
      <img
        class="w-6 h-6 mr-6 shrink-0"
        :src="store.currentFavicon"
        alt="Favicon"
      />
      <h1 class="grow font-mono font-bold text-3xl truncate">
        {{ store.currentDomain }}
      </h1>
    </div>

    <!-- Statistics -->
    <div class="mb-8">
      <!-- Report count -->
      <div class="flex flex-row justify-between items-center">
        <!-- Specific reports -->
        <div>
          <h2 class="text-2xl font-bold">{{ specificReports }} report{{ specificReports != 1 ? 's' : '' }}</h2>
          <p>for this webpage</p>
        </div>

        <!-- Vertical divider -->
        <div class="h-14 w-px bg-adn-border"></div>

        <!-- General reports -->
        <div class="text-right">
          <h2 class="text-2xl font-bold">{{ generalReports }} report{{ generalReports != 1 ? 's' : '' }}</h2>
          <p>for this domain</p>
        </div>
      </div>

      <!-- Report types -->
      <div class="mt-4">
        <div
          v-for="reportType in types"
          :key="reportType.name"
          class="flex flex-row justify-between items-center mb-2"
        >
          <h3 class="text-lg">{{ reportType.name }}</h3>
          <PillCount
            :highlighted="reportType.count > 0"
          >
            {{ reportType.count }}
          </PillCount>
        </div>
      </div>
    </div>

    <!-- Report buttons -->
    <div>
      <!-- Report positive -->
      <RouterLink to="/report-positive">
        <BigButton arrow class="w-full mb-4">
          There is deceptive design on this page
        </BigButton>
      </RouterLink>

      <!-- Report negative -->
      <BigButton arrow class="w-full">
        No deceptive design on this page
      </BigButton>
    </div>
  </main>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      'specificReports': 3,
      'generalReports': 3,
      'types': {
        'unclear_language': {
          'name': 'Unclear language',
          'count': 1
        },
        'prefilled_options': {
          'name': 'Pre-filled options',
          'count': 2
        },
        'weighted_options': {
          'name': 'Weighted options',
          'count': 0
        },
        'other': {
          'name': 'Others',
          'count': 0
        }
      }
    }
  }
})
</script>
