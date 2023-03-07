import { defineStore } from 'pinia'

export const useAriadneStore = defineStore('ariadne', {
  state: () => ({
    url: '',
    isRunningInExtension: false
  }),
  actions: {
    setUrl(url) {
      this.url = url;
    },
    setRunningInExtension(isRunningInExtension) {
      this.isRunningInExtension = isRunningInExtension;
    }
  }
})
