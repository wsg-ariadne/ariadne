import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import * as fs from 'node:fs'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'

const outDir = process.env.MANIFEST_V3 == 'true' ? './dist-v3/' : './dist/'

const copyManifest = () => {
  return {
    name: 'copy-manifest',
    buildStart() {
      if (fs.existsSync(outDir)) {
        fs.rmSync(outDir, { recursive: true, force: true });
      }
      fs.mkdirSync(outDir);

      const sourceFilename = process.env.MANIFEST_V3 == 'true' ? 'v3.json' : 'v2.json'
      const destPath = resolve(outDir, 'manifest.json')
      fs.copyFileSync(resolve('./manifest', sourceFilename), destPath)
      console.log(`Copied ${sourceFilename} to ${destPath}`)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), copyManifest()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    emptyOutDir: false,
    outDir,
    rollupOptions: {
      input: {
        index: new URL('./index.html', import.meta.url).pathname
      },
      output: {
        entryFileNames: '[name].global.js',
      }
    }
  }
})
