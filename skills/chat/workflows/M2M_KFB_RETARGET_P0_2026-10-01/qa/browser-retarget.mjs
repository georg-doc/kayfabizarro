import { chromium } from 'playwright'
import { readFileSync, writeFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const baseUrl = process.env.M2M_URL || 'http://127.0.0.1:4173/retarget/index.html'
const kfbRepo = process.env.KFB_REPO || process.cwd()
const gothPath = resolve(
  kfbRepo,
  'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb'
)
const outDir = resolve(kfbRepo, 'm2m-kfb-browser-evidence')
const downloadPath = resolve(outDir, 'gothgirl-m2m-retarget.glb')

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl']
})
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  acceptDownloads: true
})
const page = await context.newPage()

const pageErrors = []
const consoleErrors = []
const failedRequests = []
page.on('pageerror', error => pageErrors.push(String(error)))
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})
page.on('requestfailed', request => {
  if (request.url().startsWith('http://127.0.0.1:4173/')) {
    failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' })
  }
})

await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 })

await page.waitForFunction(() => {
  const count = Number(document.querySelector('#source-bone-count')?.textContent || 0)
  return count > 0
}, null, { timeout: 30_000 })

const sourceBones = Number(await page.locator('#source-bone-count').textContent())
if (sourceBones !== 66) throw new Error(`Expected 66 Mesh2Motion Human bones, got ${sourceBones}`)

await page.locator('#upload-file').setInputFiles(gothPath)

await page.waitForFunction(() => {
  const count = Number(document.querySelector('#target-bone-count')?.textContent || 0)
  return count > 0
}, null, { timeout: 30_000 })

const targetBones = Number(await page.locator('#target-bone-count').textContent())
if (targetBones !== 23) throw new Error(`Expected 23 GothGirl bones, got ${targetBones}`)

await page.locator('#auto-map-button').click()
await page.waitForFunction(() => {
  const button = document.querySelector('#continue-to-listing-button')
  return button instanceof HTMLButtonElement && !button.disabled
}, null, { timeout: 10_000 })

await page.screenshot({
  path: resolve(outDir, '01-gothgirl-source-isolation.png'),
  fullPage: false
})

await page.locator('#continue-to-listing-button').click()

await page.waitForFunction(() => {
  const text = document.querySelector('#animation-listing-count')?.textContent || ''
  return /^\d+ animations$/.test(text) && !text.startsWith('0 ')
}, null, { timeout: 60_000 })

const animationCountText = await page.locator('#animation-listing-count').textContent()
const animationCount = Number((animationCountText || '').split(' ')[0])
if (!(animationCount > 0)) throw new Error('Mesh2Motion animation library did not load')

const playButtons = page.locator('#animations-items .play')
await playButtons.first().waitFor({ state: 'visible', timeout: 20_000 })
await playButtons.first().click()
await page.waitForTimeout(800)

await page.screenshot({
  path: resolve(outDir, '02-gothgirl-retarget-preview.png'),
  fullPage: false
})

const checkboxes = page.locator('#animations-items input[type="checkbox"]')
const checkboxCount = await checkboxes.count()
if (checkboxCount < 1) throw new Error('No animation selection checkboxes found')
await checkboxes.first().check()

const exportButton = page.locator('#export-retargeting-button')
await exportButton.waitFor({ state: 'visible', timeout: 10_000 })
if (await exportButton.isDisabled()) throw new Error('Retarget export button stayed disabled')

const downloadPromise = page.waitForEvent('download', { timeout: 90_000 })
await exportButton.click()
const download = await downloadPromise
await download.saveAs(downloadPath)

const glb = parseGlb(downloadPath)
const animatedNodeNames = new Set()
for (const animation of glb.json.animations || []) {
  for (const channel of animation.channels || []) {
    const nodeIndex = channel.target?.node
    if (Number.isInteger(nodeIndex)) {
      animatedNodeNames.add(glb.json.nodes?.[nodeIndex]?.name || `#${nodeIndex}`)
    }
  }
}
const normalizedAnimatedNodeNames = new Set(
  [...animatedNodeNames].map(normalizeBoneName)
)

const expectedDrivenBones = [
  'root', 'hips',
  'upperlegl', 'lowerlegl', 'footl', 'toesl',
  'upperlegr', 'lowerlegr', 'footr', 'toesr',
  'spine', 'chest', 'head',
  'upperarml', 'lowerarml', 'wristl', 'handl', 'handslotl',
  'upperarmr', 'lowerarmr', 'wristr', 'handr', 'handslotr'
]
const missingDrivenBones = expectedDrivenBones.filter(name => !normalizedAnimatedNodeNames.has(name))

const report = {
  donorHead: '79f3f61a9852ef70234a5a4a7c13ed87f7a71833',
  kfbHeadAtSliceStart: '1c9c9706764ce41ce1282f60e358195afed207e5',
  source: {
    gothGirlPath: 'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb',
    sourceBones,
    targetBones,
    originalBytes: statSync(gothPath).size
  },
  ui: {
    animationCount,
    canvasCount: await page.locator('canvas').count()
  },
  export: {
    suggestedFilename: download.suggestedFilename(),
    bytes: statSync(downloadPath).size,
    animations: glb.json.animations?.length || 0,
    channels: (glb.json.animations || []).reduce((n, a) => n + (a.channels?.length || 0), 0),
    skins: glb.json.skins?.length || 0,
    meshes: glb.json.meshes?.length || 0,
    images: glb.json.images?.length || 0,
    textures: glb.json.textures?.length || 0,
    materials: glb.json.materials?.length || 0,
    animatedNodeNames: [...animatedNodeNames].sort(),
    normalizedAnimatedNodeNames: [...normalizedAnimatedNodeNames].sort(),
    missingDrivenBones
  },
  errors: {
    pageErrors,
    consoleErrors,
    failedRequests
  }
}

writeFileSync(resolve(outDir, 'browser-result.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))

if (report.ui.canvasCount < 1) throw new Error('No Three.js canvas found')
if (report.export.animations !== 1) throw new Error(`Expected one exported animation, got ${report.export.animations}`)
if (report.export.channels !== 24) throw new Error(`Expected 24 animation channels, got ${report.export.channels}`)
if (report.export.skins < 1) throw new Error('Exported GLB has no skin')
if (report.export.meshes !== 6) throw new Error(`Expected 6 GothGirl meshes, got ${report.export.meshes}`)
if (report.export.images < 1 || report.export.textures < 1 || report.export.materials < 1) {
  throw new Error('Exported GLB did not preserve embedded material/texture data')
}
if (missingDrivenBones.length > 0) {
  throw new Error(`Exported animation misses KayKit driven bones: ${missingDrivenBones.join(', ')}`)
}
if (pageErrors.length > 0) throw new Error(`Page errors: ${pageErrors.join(' | ')}`)
if (consoleErrors.length > 0) throw new Error(`Console errors: ${consoleErrors.join(' | ')}`)
if (failedRequests.length > 0) throw new Error(`Failed local requests: ${JSON.stringify(failedRequests)}`)

await browser.close()

function normalizeBoneName (name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]/g, '')
}

function parseGlb (path) {
  const data = readFileSync(path)
  if (data.readUInt32LE(0) !== 0x46546c67) throw new Error('Downloaded file is not GLB')
  const total = data.readUInt32LE(8)
  let offset = 12
  while (offset < total) {
    const length = data.readUInt32LE(offset)
    const type = data.readUInt32LE(offset + 4)
    offset += 8
    if (type === 0x4E4F534A) {
      const json = JSON.parse(
        data.subarray(offset, offset + length).toString('utf8').replace(/\u0000+$/g, '').trim()
      )
      return { json }
    }
    offset += length
  }
  throw new Error('Downloaded GLB has no JSON chunk')
}
