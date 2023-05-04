import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: process.env.MANIFEST_V3 == 'true' ? './dist-v3/' : './dist/',
    lib: {
      formats: ['iife'],
      entry: './background/background.js',
      name: 'Ariadne'
    },
    rollupOptions: {
      output: {
        entryFileNames: 'background.global.js',
        extend: true,
      }
    }
  }
})
