import { defineStore } from 'pinia'

export const useAriadneStore = defineStore('ariadne', {
  state: () => ({ url: '' }),
  actions: {
    setUrl(url) {
      this.url = url;
    }
  }
})
