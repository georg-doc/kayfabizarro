// MVP-Kritiker (Lead 22.10.): feste Bilder aus der Spielkamera für den blinden Kritiker (CRITIC_3D_R1). Nur im Test-Slot.
// Ausgabe: OUT/*.png (1440×900 CSS, dpr 1) + Pflicht-Pässe (Graustufen, Thumbnail) für die Spielkamera-Bilder.
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const OUT = process.env.OUT || path.resolve(process.env.HOME, 'kfb-ws1/research/audits/mvp-r1-critic/bilder'); fs.mkdirSync(OUT, { recursive: true })
const BASE = 'file://' + path.resolve('dist/index.html') + '#m1,debug,clean,harvest,look=terrain3,world=probe'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const ready = (p) => p.waitForFunction(() => window.__kfbM1?.status?.().player?.status === 'OK', null, { timeout: 300000 }).catch(() => {})
async function open(extra) { const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto(BASE + extra); await ready(p); await p.waitForTimeout(4000); return p }
const cam = (p, az, polar, d) => p.evaluate(([az, polar, d]) => { const c = window.__kfbM1.player().camera(); c.rotateTo?.(az, polar, false); if (d) c.dollyTo?.(d, false) }, [az, polar, d])
const shot = async (p, n) => { const f = `${OUT}/${n}.png`; await p.screenshot({ path: f }); return f }

// eigene Kamera rendern (Übersicht/Fuß/Seite/Silhouette): Szene in ein Render-Ziel, Pixel zurück, PNG über sharp (Y gespiegelt)
async function camShot(p, name, { from, at, fov = 40, silhouette = false }) {
  const W = 1440, Hh = 900
  const raw = await p.evaluate(({ from, at, fov, silhouette, W, Hh }) => {
    const M = window.__kfbM1, gl = M.renderer(), scene = M.scene(), T = M.three()
    const f = M.feet(), P = (v) => [f[0] + v[0], (M.terrainH(f[0] + v[0], f[2] + v[2]) ?? 0) + v[1], f[2] + v[2]]
    const c = new T.PerspectiveCamera(fov, W / Hh, 0.1, 2000), a = P(from), b = P(at); c.position.set(...a); c.lookAt(...b); c.updateMatrixWorld()
    const rt = new T.WebGLRenderTarget(W, Hh, { samples: 4, colorSpace: T.SRGBColorSpace }) /* sRGB wie die Spielausgabe – ohne war das Bild zu dunkel (23.10.) */, buf = new Uint8Array(W * Hh * 4)
    const bg = scene.background, fog = scene.fog, ov = scene.overrideMaterial
    if (silhouette) { scene.background = new T.Color('#9a9a9a'); scene.fog = null; scene.overrideMaterial = new T.MeshBasicMaterial({ color: 0x000000 }) }
    gl.setRenderTarget(rt); gl.render(scene, c); gl.readRenderTargetPixels(rt, 0, 0, W, Hh, buf); gl.setRenderTarget(null)
    scene.background = bg; scene.fog = fog; scene.overrideMaterial = ov; rt.dispose()
    let s = ''; for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode.apply(null, buf.subarray(i, i + 8192)); return btoa(s)
  }, { from, at, fov, silhouette, W, Hh })
  const f = `${OUT}/${name}.png`; await sharp(Buffer.from(raw, 'base64'), { raw: { width: W, height: Hh, channels: 4 } }).flip().png().toFile(f); return f
}
const log = []
// 1 Spawn bei Tag (Spielkamera), 2 Übersicht schräg ~35°, 3 Nacht
{ const p = await open(''); log.push(await shot(p, '01-spawn-tag-spielkamera'))
  log.push(await camShot(p, '02-kamera1-uebersicht-35grad', { from: [-30, 28, -30], at: [0, 0, 8] }))
  log.push(await camShot(p, '02b-kamera4-seite-rand', { from: [-60, 4, 20], at: [0, 2, 20], fov: 35 }))
  log.push(await camShot(p, '02c-pass-silhouette', { from: [0, 1.6, -7], at: [0, 1, 8], silhouette: true }))
  const tree = await p.evaluate(() => { const t = window.__kfbM1.mods?.orchard?.trees?.()[0]; const f = window.__kfbM1.feet(); return t ? [t.pos[0] - f[0], t.pos[2] - f[2]] : null })
  if (tree) log.push(await camShot(p, '02d-kamera3-fuss-baum', { from: [tree[0] + 2.2, 0.9, tree[1] + 2.2], at: [tree[0], 0.3, tree[1]], fov: 45 }))
  await p.close() }
{ const p = await open(',tod=gold'); log.push(await shot(p, '03-spawn-gold')); await p.close() }
{ const p = await open(',tod=night'); log.push(await shot(p, '04-spawn-nacht')); await p.close() }
// 5 Bewohner/Band/Patrouille: Spieler an die Band
{ const p = await open(',npc,patrol,band'); const at = await p.evaluate(() => window.__kfbM1.band?.()?.debug?.at || null)
  if (at) { await p.evaluate((a) => { const M = window.__kfbM1, x = a[0] + 6, z = a[1] + 6; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], Math.atan2(a[0] - x, a[1] - z)) }, at); await p.waitForTimeout(4000)
    await p.evaluate((a) => { const M = window.__kfbM1, f = M.feet(); M.player().camera().rotateAzimuthTo(Math.atan2(a[0] - f[0], a[1] - f[2]) + Math.PI, false) }, at); await p.waitForTimeout(2000) }
  log.push(await shot(p, '05-band-bewohner')); await p.close() }
// 6 Disco nachts
{ const p = await open(',disco,tod=night'); const at = await p.evaluate(() => window.__kfbM1.disco?.()?.debug?.at || null)
  if (at) { await p.evaluate((a) => { const M = window.__kfbM1, x = a[0] + 9, z = a[1] + 9; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], 0) }, at); await p.waitForTimeout(4000)
    await p.evaluate((a) => { const M = window.__kfbM1, f = M.feet(); M.player().camera().rotateAzimuthTo(Math.atan2(a[0] - f[0], a[1] - f[2]) + Math.PI, false) }, at); await p.waitForTimeout(2500) }
  log.push(await shot(p, '06-disco-nacht')); await p.close() }
// 7 Fahrt im Racer (Spieltempo)
{ const p = await open(',car'); await p.evaluate(() => window.__kfbM1.input?.({ forward: true })); await p.waitForTimeout(3500); log.push(await shot(p, '07-fahrt')); await p.waitForTimeout(1500); log.push(await shot(p, '08-fahrt-2')); await p.close() }
await b.close()
// 9/10 Kampf: eigenes Skript (Georg 23.10.: Schützenhaltung bleibt, Bild von der Brustseite, 10 = K.o.)
{ const { execFileSync } = await import('child_process'); execFileSync(process.execPath, ['test/criticShots-kampf.mjs'], { stdio: 'inherit', env: { ...process.env, OUT } }) }
// Pflicht-Pässe zur Spielkamera (01): Graustufen + Thumbnail (klein, leicht unscharf)
await sharp(`${OUT}/01-spawn-tag-spielkamera.png`).grayscale().toFile(`${OUT}/01b-pass-graustufen.png`)
await sharp(`${OUT}/01-spawn-tag-spielkamera.png`).resize(240).blur(1.2).toFile(`${OUT}/01c-pass-thumbnail.png`)
await sharp(`${OUT}/07-fahrt.png`).grayscale().toFile(`${OUT}/07b-pass-graustufen.png`)
console.log(JSON.stringify({ out: OUT, files: fs.readdirSync(OUT) }))
