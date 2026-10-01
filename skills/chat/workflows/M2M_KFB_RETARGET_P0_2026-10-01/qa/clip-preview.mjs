import { chromium } from 'playwright'
import { copyFileSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const baseUrl = process.env.M2M_BASE_URL || 'http://127.0.0.1:4173'
const kfbRepo = process.env.KFB_REPO || process.cwd()
const exportedGlb = resolve(kfbRepo, 'm2m-kfb-browser-evidence/gothgirl-m2m-retarget.glb')
const donorGlb = resolve(kfbRepo, 'donor/mesh2motion/static/kfb-gothgirl-retarget.glb')
const outDir = resolve(kfbRepo, 'm2m-kfb-browser-evidence')
const zipPath = resolve(outDir, 'gothgirl-animation-previews.zip')

copyFileSync(exportedGlb, donorGlb)

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl']
})
const context = await browser.newContext({
  viewport: { width: 1200, height: 800 },
  acceptDownloads: true
})
await context.addInitScript(() => {
  const originalIsTypeSupported = MediaRecorder.isTypeSupported.bind(MediaRecorder)
  Object.defineProperty(MediaRecorder, 'isTypeSupported', {
    configurable: true,
    value: (mimeType) => String(mimeType).toLowerCase().startsWith('video/mp4')
      ? false
      : originalIsTypeSupported(mimeType)
  })
})
const page = await context.newPage()

const pageErrors = []
const consoleErrors = []
const failedRequests = []
const infoMessages = []

page.on('pageerror', error => pageErrors.push(String(error)))
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
  if (msg.type() === 'info' || msg.type() === 'log') infoMessages.push(msg.text())
})
page.on('requestfailed', request => {
  if (request.url().startsWith(baseUrl)) {
    failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' })
  }
})

await page.goto(`${baseUrl}/preview-generator/index.html`, {
  waitUntil: 'domcontentloaded',
  timeout: 30_000
})

await page.waitForFunction(() => {
  const select = document.querySelector('#animation-file-dropdown')
  return select instanceof HTMLSelectElement && select.options.length > 1
}, null, { timeout: 30_000 })

await page.evaluate(() => {
  const select = document.querySelector('#animation-file-dropdown')
  if (!(select instanceof HTMLSelectElement)) throw new Error('Preview dropdown missing')
  const option = document.createElement('option')
  option.value = '/kfb-gothgirl-retarget.glb'
  option.textContent = 'KFB GothGirl Retarget'
  select.appendChild(option)
})

const loadResponse = page.waitForResponse(
  response => response.url().endsWith('/kfb-gothgirl-retarget.glb') && response.status() === 200,
  { timeout: 30_000 }
)
await page.locator('#animation-file-dropdown').selectOption('/kfb-gothgirl-retarget.glb')
await loadResponse
await page.waitForTimeout(1000)

await page.screenshot({
  path: resolve(outDir, '03-gothgirl-clip-preview.png'),
  fullPage: false
})

const downloadPromise = page.waitForEvent('download', { timeout: 120_000 })
await page.locator('#record-button').click()
const download = await downloadPromise
await download.saveAs(zipPath)

const entries = listZipEntries(zipPath)
const videoEntries = entries.filter(entry => /\.(webm|mp4)$/i.test(entry.name))
const extensions = [...new Set(videoEntries.map(entry => entry.name.split('.').pop().toLowerCase()))]

const report = {
  donorHead: '79f3f61a9852ef70234a5a4a7c13ed87f7a71833',
  input: {
    exportedGlb: 'm2m-kfb-browser-evidence/gothgirl-m2m-retarget.glb',
    bytes: statSync(exportedGlb).size
  },
  recorder: {
    suggestedFilename: download.suggestedFilename(),
    zipBytes: statSync(zipPath).size,
    entries,
    videoEntries,
    extensions,
    infoMessages: infoMessages.filter(message =>
      /recorder|processing animation|finished successfully/i.test(message)
    )
  },
  errors: {
    pageErrors,
    consoleErrors,
    failedRequests
  }
}

writeFileSync(resolve(outDir, 'clip-result.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))

if (download.suggestedFilename() !== 'animation-previews.zip') {
  throw new Error(`Unexpected preview download name: ${download.suggestedFilename()}`)
}
if (videoEntries.length !== 2) {
  throw new Error(`Expected exactly 2 theme preview clips, got ${videoEntries.length}`)
}
if (extensions.length !== 1 || extensions[0] !== 'webm') {
  throw new Error(`Expected stable WebM fallback clips, got: ${extensions.join(', ')}`)
}
if (!report.recorder.infoMessages.some(message => /Using WebM preview recorder/i.test(message))) {
  throw new Error('Mesh2Motion did not select its WebM fallback recorder')
}
if (videoEntries.some(entry => entry.compressedSize < 1000 || entry.uncompressedSize < 1000)) {
  throw new Error('One or more recorded preview clips are implausibly small')
}
if (pageErrors.length > 0) throw new Error(`Page errors: ${pageErrors.join(' | ')}`)
if (consoleErrors.length > 0) throw new Error(`Console errors: ${consoleErrors.join(' | ')}`)
if (failedRequests.length > 0) throw new Error(`Failed local requests: ${JSON.stringify(failedRequests)}`)

await browser.close()

function listZipEntries (path) {
  const data = readFileSync(path)
  const minOffset = Math.max(0, data.length - 65557)
  let eocd = -1
  for (let offset = data.length - 22; offset >= minOffset; offset--) {
    if (data.readUInt32LE(offset) === 0x06054b50) {
      eocd = offset
      break
    }
  }
  if (eocd < 0) throw new Error('ZIP end-of-central-directory not found')

  const entryCount = data.readUInt16LE(eocd + 10)
  let offset = data.readUInt32LE(eocd + 16)
  const entries = []

  for (let index = 0; index < entryCount; index++) {
    if (data.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`ZIP central-directory entry ${index} is invalid`)
    }
    const compressedSize = data.readUInt32LE(offset + 20)
    const uncompressedSize = data.readUInt32LE(offset + 24)
    const nameLength = data.readUInt16LE(offset + 28)
    const extraLength = data.readUInt16LE(offset + 30)
    const commentLength = data.readUInt16LE(offset + 32)
    const name = data.subarray(offset + 46, offset + 46 + nameLength).toString('utf8')
    entries.push({ name, compressedSize, uncompressedSize })
    offset += 46 + nameLength + extraLength + commentLength
  }
  return entries
}
