<template>
  <main>
    <!-- Loading overlay -->
    <Overlay :visible="isLoading">
      <div v-if="isDisabled" class="text-center">
        <NoSymbolIcon class="w-16 h-16 text-white inline-block mb-4" />
        <p class="text-white">Disabled on internal browser pages</p>
      </div>
      <div v-else class="text-center">
        <ArrowPathIcon class="h-16 w-16 animate-spin text-white inline-block mb-4" />
        <p class="text-white">Loading stats</p>
      </div>
    </Overlay>

    <!-- Favicon and domain name -->
    <div class="mb-4 flex justify-between items-center" v-show="!isDisabled">
      <img
        class="w-6 h-6 mr-4 shrink-0"
        :src="store.currentFavicon"
        alt="Favicon"
      />
      <h1 class="grow font-mono font-bold text-2xl truncate">
        {{ store.currentDomain }}
      </h1>
    </div>

    <!-- Detection result -->
    <div class="mb-4 mx-[-2rem] px-8 py-4 text-adn-light"
      :class="{
        'bg-adn-purple-dark': tripped,
        'bg-adn-dark': !tripped
      }">
      <div class="flex justify-between items-start mb-4">
        <!-- Yes/no result -->
        <h2 class="text-lg font-bold font-mono">{{ tripped ? 'D' : 'No d' }}eceptive design<br>detected here</h2>

        <!-- Rating buttons -->
        <div>
          <Tooltip
            tooltip-id="upvote-tooltip"
            placement="left"
          >
            <template #parent>
              <RouterLink
                :to="{
                  name: 'report-auto',
                  query: {
                    vote: 'true'
                  }
                }"
              >
                <div class="cursor-pointer mb-2">
                  <HandThumbUpIcon class="w-6 h-6"></HandThumbUpIcon>
                </div>
              </RouterLink>
            </template>
            <template #tooltip>
              Report correct detection
            </template>
          </Tooltip>
          <Tooltip
            tooltip-id="downvote-tooltip"
            placement="left"
          >
            <template #parent>
              <RouterLink
                :to="{
                  name: 'report-auto',
                  query: {
                    vote: 'false'
                  }
                }"
              >
                <div class="cursor-pointer">
                  <HandThumbDownIcon class="w-6 h-6"></HandThumbDownIcon>
                </div>
              </RouterLink>
            </template>
            <template #tooltip>
              Report incorrect detection
            </template>
          </Tooltip>
        </div>
      </div>
      <p v-if="tripped" class="text-sm">
        Ariadne's automated detector determined that the cookie banner on this page might
        be making use of <span class="font-bold">{{ trippedText }}.</span>
      </p>
      <p v-else class="text-sm">
        Ariadne's automated detector determined that cookie banners on this page,
        if any, are not making use of deceptive design.
      </p>
    </div>

    <!-- Statistics -->
    <div class="mb-8">
      <!-- Report count -->
      <div class="flex flex-row justify-between items-center">
        <!-- Specific reports -->
        <div>
          <h2 class="text-xl font-bold">{{ specificReports }} report{{ specificReports != 1 ? 's' : '' }}</h2>
          <p class="text-sm">for this webpage</p>
        </div>

        <!-- Vertical divider -->
        <div class="h-14 w-px bg-adn-border"></div>

        <!-- General reports -->
        <div class="text-right">
          <h2 class="text-xl font-bold">{{ generalReports }} report{{ generalReports != 1 ? 's' : '' }}</h2>
          <p class="text-sm">for this domain</p>
        </div>
      </div>

      <!-- Report types -->
      <div class="mt-4">
        <div
          v-for="reportType in types"
          :key="reportType.name"
          class="flex flex-row justify-between items-center mb-2"
        >
          <h3 class="text-base">{{ reportType.name }}</h3>
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
      <RouterLink to="/report-manual">
        <BigButton arrow class="w-full mb-4">
          Report deceptive design on this page
        </BigButton>
      </RouterLink>
    </div>

    <p class="mt-4 text-xs">
      By clicking the thumbs buttons or the report button above, you allow Ariadne to submit a report
      to the remote Ariadne server containing information about this page.
      <a href="https://ariadne.dantis.me/privacy" class="underline" target="_blank">
        Click here to view our privacy policy.
      </a>
    </p>
  </main>
</template>

<script>
import { defineComponent } from 'vue'
import { ArrowPathIcon, NoSymbolIcon, HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/vue/24/outline'
import { useAriadneStore } from '@/stores/ariadne'
import BigButton from '@/components/BigButton.vue'
import Overlay from '@/components/Overlay.vue'
import PillCount from '@/components/PillCount.vue'
import Tooltip from '@/components/Tooltip.vue'
import * as browser from 'webextension-polyfill'

export default defineComponent({
  name: 'HomeView',
  components: {
    ArrowPathIcon,
    BigButton,
    HandThumbDownIcon,
    HandThumbUpIcon,
    NoSymbolIcon,
    Overlay,
    PillCount,
    Tooltip
  },
  setup() {
    return {
      store: useAriadneStore()
    }
  },
  data() {
    return {
      isDisabled: false,
      isLoading: true,
      specificReports: 0,
      generalReports: 0,
      types: {
        unclearLanguage: {
          name: 'Unclear language',
          count: 0
        },
        prefilledOptions: {
          name: 'Pre-filled options',
          count: 0
        },
        weightedOptions: {
          name: 'Weighted options',
          count: 0
        },
        other: {
          name: 'Others',
          count: 0
        }
      },
    }
  },
  computed: {
    janusTripped() {
      return this.store.janusResult === 'weighted'
    },
    tripped() {
      return this.store.calliopeTripped || this.janusTripped
    },
    trippedText() {
      if (this.store.calliopeTripped) {
        if (this.janusTripped) {
          return 'unclear language and weighted options'
        }
        return 'unclear language'
      }
      if (this.janusTripped) { return 'weighted options' }
    }
  },
  mounted() {
    // Check if we're running in Chrome in the first place
    if (browser && browser.tabs) {
      this.store.setRunningInExtension(true)
      
      browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => {
          // Save favicon URL to store
          this.store.setFavicon(tabs[0].favIconUrl)

          // Save URL, domain, and path in store
          const url = tabs[0].url
          const urlObject = new URL(url)

          // Disable if we're on an internal browser page, e.g. chrome://*
          if (urlObject.protocol === 'chrome:') {
            this.isDisabled = true
            return
          }
          this.store.setURL(url)
          this.store.setDomain(urlObject.hostname)
          this.store.setPath(urlObject.pathname)

          // Request stats from Dionysus API
          browser.runtime.sendMessage({
            action: 'requestStats',
            args: { url }
          })
            .then((response) => {
              this.store.setDetectionData({
                calliopeTripped: response.calliopeResult,
                calliopeText: response.cookieBannerText,
                janusResult: response.janusResult,
                janusScreenshot: response.imageData
              })
              return response.stats
            })
            .then((stats) => {
              this.generalReports = stats.general_reports.count
              this.specificReports = stats.specific_reports.count
              this.types.unclearLanguage.count = stats.specific_reports.by_type.unclear_language
              this.types.prefilledOptions.count = stats.specific_reports.by_type.prefilled_options
              this.types.weightedOptions.count = stats.specific_reports.by_type.weighted_options
              this.types.other.count = stats.specific_reports.by_type.other
              this.isLoading = false
            })
        })
    } else {
      this.isLoading = false
    }
  }
})
</script>
