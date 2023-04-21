import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: process.env.OUT_DIR || './dist/',
    lib: {
      formats: ['iife'],
      entry: './content/content.js',
      name: 'Ariadne'
    },
    rollupOptions: {
      output: {
        entryFileNames: 'content.global.js',
        extend: true,
      }
    }
  }
})
