const child_process = require('child_process')
const fs = require('fs')
const kill = require('tree-kill')

// Clean build directory
const buildDir = process.env.MANIFEST_V3 === 'true' ? 'dist-v3' : 'dist'
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true })
}
fs.mkdirSync(buildDir)

// Spawn vite for .config
const mainChild = child_process.spawn('npx', [
  'vite',
  'build',
  '--config',
  'vite.config.js',
  '--watch',
  '--mode',
  'development'
], { stdio: 'inherit' })
const mainBuild = new Promise((res, rej) => {
  mainChild.on('close', code => {
    if (code !== 0) {
      rej(code)
    } else {
      res()
    }
  })
})

// Spawn vite for .bg.config
const bgChild = child_process.spawn('npx', [
  'vite',
  'build',
  '--config',
  'vite.bg.config.js',
  '--watch',
  '--mode',
  'development'
], { stdio: 'inherit' })
const bgBuild = new Promise((res, rej) => {
  bgChild.on('close', code => {
    if (code !== 0) {
      rej(code)
    } else {
      res()
    }
  })
})

// Spawn vite for .content.config
const contentChild = child_process.spawn('npx', [
  'vite',
  'build',
  '--config',
  'vite.content.config.js',
  '--watch',
  '--mode',
  'development'
], { stdio: 'inherit' })
const contentBuild = new Promise((res, rej) => {
  contentChild.on('close', code => {
    if (code !== 0) {
      rej(code)
    } else {
      res()
    }
  })
})

// Kill all children on exit and ctrl-C
const killAllChildren = () => {
  kill(mainChild.pid)
  kill(bgChild.pid)
  kill(contentChild.pid)
}
process.on('exit', killAllChildren)
process.on('SIGINT', killAllChildren)

// Wait for all builds to finish
Promise.all([mainBuild, bgBuild, contentBuild])
  .then(() => {
    console.log('All builds finished')
  })
  .catch((code) => {
    if (code !== null) {
      console.error(`Build failed with code ${code}`)
    }
    process.exit(code)
  })
