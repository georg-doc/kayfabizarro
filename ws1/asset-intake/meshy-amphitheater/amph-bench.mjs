import { chromium } from 'playwright'
const mode = process.argv[2] || 'gpu'
const args = mode === 'gpu' ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] : ['--use-gl=swiftshader', '--enable-unsafe-swiftshader']
const b = await chromium.launch({ args }); const p = await b.newPage({ viewport: { width: 1536, height: 864 } })
await p.goto('http://127.0.0.1:8743/tools/amph.html'); await p.waitForFunction(() => window.ready && window.bench)
await p.evaluate(() => window.load('/assets/meshy/Meshy_AI_Claymation_Amphitheat_1014024048_image-to-3d-texture.glb'))
const res = {}
for (const k of ['orig', 'tex1k', 'notex', 'orig']) { await p.evaluate((k) => window.variant(k), k); res[k + (res[k] ? '_again' : '')] = await p.evaluate(() => window.bench(120)) }
console.log(mode, JSON.stringify(res, null, 1)); await b.close()
