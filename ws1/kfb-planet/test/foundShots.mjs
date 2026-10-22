// Georg 22.10. · Fundsachen schwebend, im Cluster synchron, ausgeleuchtet: Spielkamera neben einer Fundsachen-Gruppe bei Tag, Gold und Nacht + Nahbild je Tageszeit.
// Hash wie der MVP-Kritiker (#m1,debug,clean,harvest,look=terrain3,world=probe) + tod=day|gold|night. Nur im Test-Slot. Ausgabe test/out/found-float/.
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const OUT = path.resolve('test/out/found-float'); fs.mkdirSync(OUT, { recursive: true })
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), errs = []
for (const tod of ['day', 'gold', 'night']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', (e) => errs.push(e.message))
  await p.goto('file://' + path.resolve('dist/index.html') + '#m1,debug,clean,harvest,look=terrain3,world=probe,tod=' + tod)
  await p.waitForFunction(() => window.__kfbM1?.status?.().player?.status === 'OK' && window.__kfbM1.mods.found?.stats?.().status === 'OK', null, { timeout: 300000 }).catch(() => {})
  const c = await p.evaluate(async () => { const M = window.__kfbM1, s = M.mods.found.sync(), g = s.filter((x) => x.group === s[0].group), its = M.mods.found.items().filter((i) => g.some((x) => x.key === i.key))
    const cx = its.reduce((a, i) => a + i.x, 0) / its.length, cz = its.reduce((a, i) => a + i.z, 0) / its.length
    M.player().teleport([cx + 2.6, M.terrainH(cx + 2.6, cz + 2.6) + 1.2, cz + 2.6]); await new Promise((r) => setTimeout(r, 2500)); return [cx, cz] })
  await p.waitForTimeout(2500); await p.screenshot({ path: `${OUT}/${tod}-spielkamera.png` })
  const raw = await p.evaluate(([cx, cz]) => { const M = window.__kfbM1, gl = M.renderer(), scene = M.scene(), T = M.three(), H = (x, z) => M.terrainH(x, z) ?? 0, W = 1440, Hh = 900
    const cam = new T.PerspectiveCamera(42, W / Hh, 0.05, 2000); cam.position.set(cx + 1.6, H(cx + 1.6, cz + 1.2) + 0.8, cz + 1.2); cam.lookAt(cx, H(cx, cz) + 0.2, cz); cam.updateMatrixWorld()
    const rt = new T.WebGLRenderTarget(W, Hh, { samples: 4 }), buf = new Uint8Array(W * Hh * 4); gl.setRenderTarget(rt); gl.render(scene, cam); gl.readRenderTargetPixels(rt, 0, 0, W, Hh, buf); gl.setRenderTarget(null); rt.dispose()
    let s = ''; for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode.apply(null, buf.subarray(i, i + 8192)); return btoa(s) }, c)
  await sharp(Buffer.from(raw, 'base64'), { raw: { width: 1440, height: 900, channels: 4 } }).flip().png().toFile(`${OUT}/${tod}-nah.png`)
  await p.close()
}
await b.close()
const names = ['day', 'gold', 'night'].flatMap((t) => [`${t}-spielkamera.png`, `${t}-nah.png`])
const tiles = await Promise.all(names.map(async (n, i) => ({ input: await sharp(`${OUT}/${n}`).resize(720, 450).toBuffer(), left: (i % 2) * 724, top: Math.floor(i / 2) * 454 })))
await sharp({ create: { width: 1448, height: 3 * 454, channels: 3, background: '#222' } }).composite(tiles).jpeg({ quality: 82 }).toFile(`${OUT}/uebersicht.jpg`)
console.log(JSON.stringify({ out: OUT, errs: errs.slice(0, 3) }))
