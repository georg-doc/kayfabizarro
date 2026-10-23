// MVP-Kritiker, Kampfbilder (Georg 23.10.: seitliche Schützenhaltung aus Ranged_1H_Shoot bleibt – Rumpf 30–45° eingedreht, Kopf und Mündung aufs Ziel):
//   09 eigene Kamera beim Abgang, von der Brustseite des Schützen (Haltung lesbar), Ziel mit im Bild (Spielkamera reicht nicht weit genug zurück)
//   10 eigene Kamera seitlich auf die Linie Schütze–Gegner im K.o. (Gegner fällt um, nicht der erste Treffer; keiner angeschnitten)
// Aufruf allein: PW_GPU-Chromium, node test/criticShots-kampf.mjs (OUT wie criticShots.mjs); wird am Ende von criticShots.mjs mit aufgerufen.
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const OUT = process.env.OUT || path.resolve(process.env.HOME, 'kfb-ws1/research/audits/mvp-r1-critic/bilder'); fs.mkdirSync(OUT, { recursive: true })
const W = 1440, H = 900
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: W, height: H } })
await p.goto('file://' + path.resolve('dist/index.html') + '#m1,debug,clean,harvest,look=terrain3,patrol')
await p.waitForFunction(() => { const M = window.__kfbM1; return M?.status().player?.status === 'OK' && M.combat?.()?.status.status === 'OK' && (M.groups?.()?.status?.status ?? 'LOADING') !== 'LOADING' && M.harvest().bagWeapons }, null, { timeout: 300000 })
const wait = (ms) => p.waitForTimeout(ms)
await p.keyboard.press('Digit2'); await wait(500)
await p.evaluate(() => { const M = window.__kfbM1; M.player().teleport([-40, M.terrainH(-40, 30) + 1.2, 30], Math.PI) }); await wait(4000)
await p.evaluate(() => { const M = window.__kfbM1, m = M.mods.groups.debug()[0].members[0], x = m.x + Math.sin(m.yaw) * 6, z = m.z + Math.cos(m.yaw) * 6; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], m.yaw + Math.PI) })
await wait(1500)
// Schuss auf das erste stehende Mitglied; Spielkamera hinter der Figur (Ziel im Blickkegel), Ziellage für das Bild merken, etwas erhöht
const fire = () => p.evaluate(() => { const M = window.__kfbM1, f = M.feet(), m = M.mods.groups.debug()[0].members.find((x) => !x.ko); if (!m) return null
  const dx = m.x - f[0], dz = m.z - f[2], l = Math.hypot(dx, dz) || 1, yaw = Math.atan2(dx, dz), c = M.player().camera()
  c.rotateTo?.(yaw + Math.PI, 1.2, false); window.__aim = { f, m: [m.x, m.z], yaw }
  window.__rel0 = M.mods.combat.debug().lastRelease; M.mods.combat.holdFlash(0.6); return M.mods.combat.fire({ from: f, dir: [dx / l, 0, dz / l] }) })
// eigene Kamera: Bild aus Position from auf Punkt at (Weltkoordinaten), Rückgabe Rohpixel base64 (Y gespiegelt)
await p.evaluate(({ W, H }) => { window.__ownShot = (from, at, fov = 45) => { const M = window.__kfbM1, gl = M.renderer(), scene = M.scene(), T = M.three(), c = new T.PerspectiveCamera(fov, W / H, 0.1, 2000)
  c.position.set(...from); c.lookAt(...at); c.updateMatrixWorld()
  const rt = new T.WebGLRenderTarget(W, H, { samples: 4, colorSpace: T.SRGBColorSpace }), buf = new Uint8Array(W * H * 4); gl.setRenderTarget(rt); gl.render(scene, c); gl.readRenderTargetPixels(rt, 0, 0, W, H, buf); gl.setRenderTarget(null); rt.dispose()
  let s = ''; for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode.apply(null, buf.subarray(i, i + 8192)); return btoa(s) } }, { W, H })
const savePng = (file, raw) => sharp(Buffer.from(raw, 'base64'), { raw: { width: W, height: H, channels: 4 } }).flip().png().toFile(file)
const log = []
await fire(); await p.waitForFunction(() => window.__kfbM1.mods.combat.debug().lastRelease !== window.__rel0, null, { timeout: 5000 }).catch(() => {}); await wait(50)
// 09 auf der Brustseite (gemessen 23.10.: Brust ≈ yaw + 40°): Kamera bei yaw + 72° vom Schützen, Blick auf die Mitte Schütze–Ziel
const raw09 = await p.evaluate(() => { const M = window.__kfbM1, { f, m, yaw } = window.__aim, a = yaw + 1.25, d = 8.5, cx = f[0] + Math.sin(a) * d, cz = f[2] + Math.cos(a) * d, mx = f[0] + (m[0] - f[0]) * 0.56, mz = f[2] + (m[1] - f[2]) * 0.56
  return window.__ownShot([cx, M.terrainH(cx, cz) + 1.9, cz], [mx, M.terrainH(mx, mz) + 0.7, mz], 50) })
const f09 = `${OUT}/09-kampf-schuss.png`; await savePng(f09, raw09); log.push(f09)
let ko = null
for (let n = 0; n < 16 && !ko; n++) { await wait(900); await fire(); await wait(700); ko = await p.evaluate(() => { const M = window.__kfbM1, e = M.groups().events.find((x) => x.type === 'ko'); if (!e) return null; const m = M.mods.groups.debug()[0].members.find((x) => x.id === e.id) || M.mods.groups.debug()[0].members.find((x) => x.ko); return { ...e, at: m ? [m.x, m.z] : e.at } }) }
await wait(900) // Skeletons_Death liegt (clamp)
if (ko) {
  const raw = await p.evaluate((at) => { const M = window.__kfbM1, f = M.feet()
    const ex = at[0], ez = at[1], mx = (ex + f[0]) / 2, mz = (ez + f[2]) / 2, dx = ex - f[0], dz = ez - f[2], l = Math.hypot(dx, dz) || 1, px = -dz / l, pz = dx / l, d = Math.max(7.5, l * 1.6), cx = mx + px * d, cz = mz + pz * d
    return window.__ownShot([cx, M.terrainH(cx, cz) + 2.4, cz], [mx, M.terrainH(mx, mz) + 0.6, mz], 45) }, ko.at)
  const f10 = `${OUT}/10-kampf-ko.png`; await savePng(f10, raw); log.push(f10)
}
console.log(JSON.stringify({ kampf: log, ko: !!ko }))
await b.close()
