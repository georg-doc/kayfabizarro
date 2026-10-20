// R1a Abnahme (V-487 Stufe 1): je Racer ein Bild in Fahrt (¾ von hinten, eigene Kamera, Vollgas + Boost), dazu eine Bildfolge Boost → Stauchen → Strecken
// als animierte WebP. Ausgabe test/out/r1a/racers.png (Tafel 3 × 2) und test/out/r1a/boost-<id>.webp. Nur lokal (Georgs private Meshy-Modelle).
// node scripts/r1a/racer-shots.mjs [ids] [boostId]
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const sharp = (await import('sharp')).default
fs.mkdirSync('test/out/r1a', { recursive: true })
const IDS = (process.argv[2] || 'rustwing_cruiser,graffiti_jet_cruiser,street_racer_hoverbeast,crimson_flame_dragster,crimson_thunderjet,ironclad_skycruiser').split(',')
const BOOST = process.argv[3] || 'crimson_flame_dragster'
const W = 800, H = 450
const shot = (page, { az = 0.62, dist = 2.6, up = 0.55 } = {}) => page.evaluate(({ az, dist, up, W, H }) => {
  const M = window.__kfbM1, M2 = window.__kfbM2, gl = M.renderer(), scene = M.scene(), T = M.three(), car = M2.car(); if (!gl || !car) return null
  const p = car.pos(), yaw = car.yaw(), L = M2.spec.box.h[2] * 2, fwd = new T.Vector3(Math.sin(yaw), 0, Math.cos(yaw))
  const back = fwd.clone().multiplyScalar(-1).applyAxisAngle(new T.Vector3(0, 1, 0), az), cam = new T.PerspectiveCamera(36, W / H, 0.05, 400)
  cam.position.set(p.x, p.y, p.z).addScaledVector(back, L * dist).add(new T.Vector3(0, L * up, 0)); cam.lookAt(p.x, p.y + L * 0.12, p.z); cam.updateMatrixWorld()
  const rt = new T.WebGLRenderTarget(W, H, { colorSpace: T.SRGBColorSpace, samples: 4 }), buf = new Uint8Array(W * H * 4)
  gl.setRenderTarget(rt); gl.render(scene, cam); gl.readRenderTargetPixels(rt, 0, 0, W, H, buf); gl.setRenderTarget(null); rt.dispose()
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), im = g.createImageData(W, H)
  for (let y = 0; y < H; y++) im.data.set(buf.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4)
  g.putImageData(im, 0, 0); return c.toDataURL('image/png')
}, { az, dist, up, W, H }).then((u) => (u ? Buffer.from(u.split(',')[1], 'base64') : null))
const tiles = []
for (const id of IDS) {
  const { browser, page } = await openPage(`#m1,car,debug,mute,racer=${id}`, { viewport: { width: 960, height: 540 } })
  await page.waitForFunction(() => window.__kfbM2?.stats?.rig && window.__kfbM1?.renderer?.(), null, { timeout: 300000 }).catch(() => {})
  await page.waitForTimeout(1500)
  await page.evaluate(() => window.__kfbM1.input({ forward: true })); await page.waitForTimeout(2200)
  await page.evaluate(() => window.__kfbM1.input({ forward: true, run: true })); await page.waitForTimeout(700)
  const png = await shot(page); if (png) tiles.push(await sharp(png).composite([{ input: Buffer.from(`<svg width="${W}" height="40"><rect width="${W}" height="40" fill="rgba(0,0,0,.45)"/><text x="14" y="27" font-family="sans-serif" font-size="20" fill="#fff">${id}</text></svg>`), top: H - 40, left: 0 }]).png().toBuffer())
  if (id === BOOST) { // Bildfolge: Gas halten, dann Boost auslösen, 24 Bilder à 50 ms
    await page.evaluate(() => window.__kfbM1.input({ forward: true })); await page.waitForTimeout(1500)
    const frames = []; await page.evaluate(() => window.__kfbM1.input({ forward: true, run: true }))
    for (let i = 0; i < 24; i++) { const f = await shot(page, { az: 1.35, dist: 2.2, up: 0.3 }); if (f) frames.push(await sharp(f).resize(560, 315).png().toBuffer()); await page.waitForTimeout(50) }
    if (frames.length) await sharp(frames, { join: { animated: true } }).webp({ loop: 0, delay: 80, quality: 80 }).toFile(`test/out/r1a/boost-${id}.webp`)
    const stretch = await page.evaluate(() => window.__kfbM2.stats.rig.info().stretch); console.log('boost stretch now', stretch, 'frames', frames.length)
  }
  await browser.close(); console.log(id, png ? 'ok' : 'kein Bild')
}
const cols = 3, rows = Math.ceil(tiles.length / cols)
if (tiles.length) await sharp({ create: { width: W * cols, height: H * rows, channels: 3, background: '#222' } }).composite(tiles.map((b, i) => ({ input: b, left: (i % cols) * W, top: Math.floor(i / cols) * H }))).png().toFile('test/out/r1a/racers.png')
console.log(JSON.stringify({ tiles: tiles.length, sheet: 'test/out/r1a/racers.png' }))
