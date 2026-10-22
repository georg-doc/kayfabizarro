// V-654 C6 · Vorher/Nachher-Bilder der Erdung (Lead 22.10.): Spielkamera am Start + feste Nahkameras auf den Fuß von Kristall-Laterne, Baum, Fundsache,
// Amphitheater-Fuß und Weg, dazu die Übersicht 35°. Hash wie der MVP-Kritiker (#m1,debug,clean,harvest,look=terrain3,world=probe). Nur im Test-Slot.
// OUT=<Ordner> (Standard test/out/grounding/<tag>), TAG=vorher|nachher. Läuft gegen dist/ des aktuellen Ordners.
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const TAG = process.env.TAG || 'nachher', OUT = process.env.OUT || path.resolve('test/out/grounding', TAG); fs.mkdirSync(OUT, { recursive: true })
const BASE = 'file://' + path.resolve('dist/index.html') + '#m1,debug,clean,harvest,look=terrain3,world=probe'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
await p.goto(BASE); await p.waitForFunction(() => window.__kfbM1?.status?.().player?.status === 'OK' && window.__kfbM1.mods.found?.stats?.().status === 'OK' && window.__kfbM1.mods.amph?.status?.().status === 'OK', null, { timeout: 300000 }).catch(() => {}); await p.waitForTimeout(5000)
async function camShot(name, { from, at, fov = 40 }) {   // Lagen absolut in xz, Höhe über dem Gelände an der jeweiligen Stelle
  const W = 1440, Hh = 900
  const raw = await p.evaluate(({ from, at, fov, W, Hh }) => { const M = window.__kfbM1, gl = M.renderer(), scene = M.scene(), T = M.three(), H = (x, z) => M.terrainH(x, z) ?? 0
    const c = new T.PerspectiveCamera(fov, W / Hh, 0.05, 2000); c.position.set(from[0], H(from[0], from[2]) + from[1], from[2]); c.lookAt(at[0], H(at[0], at[2]) + at[1], at[2]); c.updateMatrixWorld()
    const rt = new T.WebGLRenderTarget(W, Hh, { samples: 4 }), buf = new Uint8Array(W * Hh * 4); gl.setRenderTarget(rt); gl.render(scene, c); gl.readRenderTargetPixels(rt, 0, 0, W, Hh, buf); gl.setRenderTarget(null); rt.dispose()
    let s = ''; for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode.apply(null, buf.subarray(i, i + 8192)); return btoa(s) }, { from, at, fov, W, Hh })
  const f = `${OUT}/${name}.png`; await sharp(Buffer.from(raw, 'base64'), { raw: { width: W, height: Hh, channels: 4 } }).flip().png().toFile(f); return f }
const T = await p.evaluate(() => { const M = window.__kfbM1, L = M.mods.lanterns?.object3d?.children?.[1]?.position?.toArray(), tr = M.mods.orchard?.trees?.(), f = M.mods.found?.items?.().filter((i) => i.here), feet = M.feet()
  const goblin = tr?.find((t) => t.zone === 'goblin') || tr?.[0]; return { lantern: L, tree: goblin?.pos, item: f?.[0] && [f[0].x, f[0].z], feet } })
const out = []
await p.screenshot({ path: `${OUT}/01-spawn-spielkamera.png` }); out.push('01-spawn-spielkamera')
out.push(await camShot('02-uebersicht-35grad', { from: [-30, 28, -30], at: [0, 0, 8] }))
if (T.lantern) out.push(await camShot('03-fuss-kristall', { from: [T.lantern[0] + 1.3, 0.55, T.lantern[2] + 1.1], at: [T.lantern[0], 0.15, T.lantern[2]], fov: 45 }))
if (T.tree) out.push(await camShot('04-fuss-baum', { from: [T.tree[0] + 2.2, 0.9, T.tree[2] + 2.2], at: [T.tree[0], 0.3, T.tree[2]], fov: 45 }))
if (T.item) out.push(await camShot('05-fuss-fundsache', { from: [T.item[0] + 0.9, 0.5, T.item[1] + 0.8], at: [T.item[0], 0.02, T.item[1]], fov: 45 }))
out.push(await camShot('06-fuss-amphitheater', { from: [9, 1.4, 11], at: [5.2, 0.4, 4.5], fov: 50 }))
out.push(await camShot('07-weg-start', { from: [1.5, 1.6, 15.5], at: [0, 0.2, 21], fov: 50 }))
await b.close()
console.log(JSON.stringify({ TAG, OUT, shots: out.length, targets: T, errs: errs.slice(0, 3) }))
