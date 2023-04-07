import { defineStore } from 'pinia'

export const useAriadneStore = defineStore('ariadne', {
  state: () => ({
    currentDomain: '',
    currentFavicon: '',
    currentPath: '',
    isRunningInExtension: false
  }),
  actions: {
    setDomain(domain) {
      this.currentDomain = domain;
    },
    setFavicon(favicon) {
      this.currentFavicon = favicon;
    },
    setPath(path) {
      this.currentPath = path;
    },
    setRunningInExtension(isRunningInExtension) {
      this.isRunningInExtension = isRunningInExtension;
    }
  }
})
