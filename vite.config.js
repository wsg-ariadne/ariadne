import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    emptyOutDir: true,
    outDir: './dist/',
    rollupOptions: {
      input: {
        index: new URL('./index.html', import.meta.url).pathname,
        background: new URL('./background/background.html', import.meta.url).pathname,
      },
      output: {
        entryFileNames: '[name].global.js',
      }
    }
  }
})
