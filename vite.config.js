import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import * as fs from 'node:fs'
import { resolve } from 'node:path'
import child_process from 'node:child_process'
import vue from '@vitejs/plugin-vue'

const outDir = process.env.MANIFEST_V3 == 'true' ? './dist-v3/' : './dist/'

const copyManifest = () => {
  return {
    name: 'copy-manifest',
    buildStart() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }

      // Read source manifest
      const sourceFilename = process.env.MANIFEST_V3 == 'true' ? 'v3' : 'v2'
      let source = fs.readFileSync(`./manifest/${sourceFilename}.json`, 'utf8')

      // Replace __PKG_version__ with package version from package.json
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
      source = source.replace(/__PKG_version__/g, packageJson.version)

      // Replace __PKG_versionName__ with date, git branch, and commit hash
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      let versionName = `${date} dev`
      try {
        const commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim()
        const branchName = child_process.execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
        versionName = `${date} ${branchName}@${commitHash}`
      } catch (e) {
        console.log('Failed to get git branch and commit hash.')
      }
      source = source.replace(/__PKG_versionName__/g, `${packageJson.version} (${versionName})`)

      // Write manifest to build directory
      const destPath = resolve(outDir, 'manifest.json')
      fs.writeFileSync(destPath, source)

      console.log(`\nCopied ${sourceFilename} to ${destPath}\n`)
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
