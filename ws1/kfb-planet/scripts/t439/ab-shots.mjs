// #439 Nachweis A/B: gleiche Kameras, gleiche Lage, echte Figur bzw. Racer; A = Standard, B = look=terrain2. Ausgabe test/out/t439/ab-<szene>.png (oben A, unten B).
// node scripts/t439/ab-shots.mjs
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
const sharp = (await import('sharp')).default
fs.mkdirSync('test/out/t439', { recursive: true })
const W = 900, H = 506
const SCENES = [
  { id: 'figur', hash: '#m1,debug,tod=gold', cams: [{ back: 7, up: 3.2, az: 0.5, look: 1.0 }, { back: 70, up: 34, az: 2.2, look: 0 }] },
  { id: 'racer', hash: '#m1,debug,car,mute,racer=crimson_flame_dragster,tod=gold', cams: [{ back: 11, up: 4.5, az: 0.7, look: 1.0 }] },
]
const shot = (page, c) => page.evaluate(({ c, W, H }) => {
  const M = window.__kfbM1, gl = M.renderer(), scene = M.scene(), T = M.three(), M2 = window.__kfbM2
  const car = M2?.car?.(); const p = car ? car.pos() : M.mods.player.object3d.getWorldPosition(new T.Vector3())
  const P = new T.Vector3(p.x, p.y, p.z), cam = new T.PerspectiveCamera(40, W / H, 0.1, 2000)
  cam.position.set(P.x + Math.sin(c.az) * c.back, P.y + c.up, P.z + Math.cos(c.az) * c.back); cam.lookAt(P.x, P.y + c.look, P.z); cam.updateMatrixWorld()
  const rt = new T.WebGLRenderTarget(W, H, { colorSpace: T.SRGBColorSpace, samples: 4 }), buf = new Uint8Array(W * H * 4)
  gl.setRenderTarget(rt); gl.render(scene, cam); gl.readRenderTargetPixels(rt, 0, 0, W, H, buf); gl.setRenderTarget(null); rt.dispose()
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'), im = g.createImageData(W, H)
  for (let y = 0; y < H; y++) im.data.set(buf.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4)
  g.putImageData(im, 0, 0); return cv.toDataURL('image/png')
}, { c, W, H }).then((u) => Buffer.from(u.split(',')[1], 'base64'))
const out = {}
for (const S of SCENES) {
  const rows = []
  for (const look of ['', ',look=terrain2']) {
    const { browser, page, errs } = await openPage(S.hash + look, { viewport: { width: 1100, height: 650 } })
    await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.renderer?.(), null, { timeout: 300000 })
    await page.waitForTimeout(4000)
    const info = await page.evaluate(() => window.__kfbM1.mods.terrain?.info?.())
    const imgs = []; for (const c of S.cams) imgs.push(await shot(page, c))
    rows.push(imgs); out[S.id + (look ? '-B' : '-A')] = { look: info?.look, palette: info?.palette, errs: errs.slice(0, 3) }
    await browser.close()
  }
  const n = S.cams.length
  const tiles = []; rows.forEach((imgs, r) => imgs.forEach((b, i) => tiles.push({ input: b, left: i * W, top: r * H })))
  await sharp({ create: { width: W * n, height: H * 2, channels: 3, background: '#222' } }).composite(tiles).png().toFile(`test/out/t439/ab-${S.id}.png`)
}
console.log(JSON.stringify(out))
