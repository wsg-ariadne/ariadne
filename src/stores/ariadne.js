import { defineStore } from 'pinia'

export const useAriadneStore = defineStore('ariadne', {
  state: () => ({
    currentDomain: '',
    currentFavicon: '',
    currentPath: '',
    currentURL: '',
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
    setURL(url) {
      this.currentURL = url;
    },
    setRunningInExtension(isRunningInExtension) {
      this.isRunningInExtension = isRunningInExtension;
    }
  }
})
