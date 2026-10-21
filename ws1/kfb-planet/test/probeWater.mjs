// world=probe · Wasser (kfbWater aus der Probe): Meer/Flüsse/Seen/Fälle vorhanden, Shader ohne Fehler, Bilder aus festen Kameras (ohne Dunst)
import fs from 'node:fs'
import { openPage } from './_page.mjs'
const OUT = 'test/out/probe-water'; fs.mkdirSync(OUT, { recursive: true })
const { browser, page, errs } = await openPage('#m1,harvest,look=terrain3,world=probe,debug', { viewport: { width: 1280, height: 800 } })
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().amphTris > 0 && window.__kfbM1.state.phase === 'free', null, { timeout: 240000 })
await page.waitForTimeout(2500)
const info = await page.evaluate(() => { const M = window.__kfbM1, scene = M.scene(); let water = null; scene.traverse((o) => { if (o.name === 'kfb-water') water = o })
  const t = M.mods.terrain, i = t.info(), U = water?.children?.[0]?.material?.uniforms, seaY = U ? U.uWater.value + 0.15 : null; let below = 0, n = 0
  for (let k = 0; k < 4000; k++) { const a = k * 2.399963, r = 140 * Math.sqrt((k + 0.5) / 4000), x = Math.cos(a) * r, z = Math.sin(a) * r; n++; if (seaY != null && t.height(x, z) < seaY) below++ }
  return { water: i.water, seaY, belowSeaPct: +(100 * below / n).toFixed(1), meshes: water ? water.children.map((c) => [c.type, c.geometry?.attributes?.position?.count]) : null, hRange: i.hRange } })
const shoot = async (name, pos, look) => { const url = await page.evaluate(({ pos, look }) => { const M = window.__kfbM1, T = M.three(), gl = M.renderer(), scene = M.scene(), W = 1280, H = 800
    const cam = new T.PerspectiveCamera(50, W / H, 0.3, 3000); cam.position.set(...pos); cam.lookAt(...look); cam.updateMatrixWorld()
    const rt = new T.WebGLRenderTarget(W, H, { colorSpace: T.SRGBColorSpace }), buf = new Uint8Array(W * H * 4), f = scene.fog, f0 = f && { near: f.near, far: f.far, density: f.density }
    if (f?.isFog) { f.near = 1e4; f.far = 2e4 } else if (f?.isFogExp2) f.density = 0
    gl.setRenderTarget(rt); gl.render(scene, cam); gl.readRenderTargetPixels(rt, 0, 0, W, H, buf); gl.setRenderTarget(null); rt.dispose(); if (f0) Object.assign(f, f0)
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'), im = g.createImageData(W, H)
    for (let y = 0; y < H; y++) im.data.set(buf.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4)
    g.putImageData(im, 0, 0); return cv.toDataURL('image/png') }, { pos, look }); fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(url.split(',')[1], 'base64')) }
await shoot('overview', [110, 150, 230], [0, -15, -20])
const spots = await page.evaluate(() => { const M = window.__kfbM1, t = M.mods.terrain; return { fall: t.waterSpots?.() ?? null } })
if (spots.fall?.fall) { const f = spots.fall.fall; await shoot('fall', [f[0] + 18, f[1] + 6, f[2] + 18], [f[0], f[1] - 2, f[2]]) }
if (spots.fall?.river) { const q = spots.fall.river; await shoot('river', [q[0] + 22, q[1] + 12, q[2] + 22], q) }
if (spots.fall?.sea) { const q = spots.fall.sea; await shoot('sea', [q[0] + 40, q[1] + 25, q[2] + 40], q); await shoot('sea-top', [q[0] + 0.1, q[1] + 70, q[2] + 0.1], q) }
console.log(JSON.stringify({ info, spots, errs: errs.slice(0, 4) }))
const ok = !errs.length && info.water && info.meshes && info.meshes.length >= 2
console.log(ok ? 'PASS probeWater' : 'FAIL probeWater'); await browser.close(); process.exit(ok ? 0 : 1)
