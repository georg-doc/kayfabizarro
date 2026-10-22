// Wasser R1 (V-631) · gemeinsame Prüfhilfe: Spiel world=probe mit Georgs Werten öffnen (look=terrain3, Sonne ≈ 12° über tod=0.557 im Satz mesa,
// Wasser 0,06 = PROBE_WATER, Island-Kit-Fluid = Standard), feste Kameras rendern, Prüfstellen (kleine Seen, Bergsee, Fall, Mündung) suchen.
import fs from 'node:fs'
import { openPage } from './_page.mjs'
export const GEORG = 'tod=0.557' // Satz mesa: gold 11° … day 38° → 12°
export async function openWater(extra = '', { viewport = { width: 1280, height: 800 } } = {}) {
  const r = await openPage(`#m1,harvest,look=terrain3,world=probe,debug,${GEORG}${extra ? ',' + extra : ''}`, { viewport })
  await r.page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().amphTris > 0 && window.__kfbM1.state.phase === 'free', null, { timeout: 240000 })
  await r.page.waitForTimeout(2500)
  return r
}
// Bild aus fester Kamera (eigene Kamera, Zeit läuft weiter); fog=false: ohne Dunst (Übersicht)
// settle (ms): Kamera erst als Prüfkamera ans Wasser geben (Unterwasser-Zustand, Nebel des Hosts) und so lange warten
export async function shoot(page, file, pos, look, { fog = true, fov = 50, W = 1280, H = 800, settle = 0, ground = true } = {}) {
  await page.evaluate(({ pos, look, fov, W, H, settle, ground }) => { const M = window.__kfbM1, T = M.three(), t = M.mods.terrain
    const cam = new T.PerspectiveCamera(fov, W / H, 0.1, 3000); cam.position.set(...pos); if (ground) cam.position.y = Math.max(cam.position.y, t.height(pos[0], pos[2]) + 1.2)
    cam.lookAt(...look); cam.updateMatrixWorld(); window.__shotCam = cam; if (settle) t.probeCam?.(cam) }, { pos, look, fov, W, H, settle, ground })
  if (settle) await page.waitForTimeout(settle)
  const url = await page.evaluate(({ fog, W, H }) => { const M = window.__kfbM1, T = M.three(), gl = M.renderer(), scene = M.scene(), cam = window.__shotCam
    const rt = new T.WebGLRenderTarget(W, H, { colorSpace: T.SRGBColorSpace }), buf = new Uint8Array(W * H * 4), f = scene.fog, f0 = f && { near: f.near, far: f.far, density: f.density }
    if (!fog) { if (f?.isFog) { f.near = 1e4; f.far = 2e4 } else if (f?.isFogExp2) f.density = 0 }
    gl.setRenderTarget(rt); gl.render(scene, cam); gl.readRenderTargetPixels(rt, 0, 0, W, H, buf); gl.setRenderTarget(null); rt.dispose(); if (f0) Object.assign(f, f0)
    M.mods.terrain.probeCam?.(null)
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'), im = g.createImageData(W, H)
    for (let y = 0; y < H; y++) im.data.set(buf.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4)
    g.putImageData(im, 0, 0); return cv.toDataURL('image/png') }, { fog, W, H })
  fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'))
}
// Prüfstellen: Seen = zusammenhängende Flächen unter dem Meeresspiegel (2-m-Raster bis 150 m), klein = 30–600 m²; Bergsee = hydro.lakes; Fall; Mündung
export async function waterSpots(page) {
  return page.evaluate(() => { const t = window.__kfbM1.mods.terrain, h = t.hydro(), H = t.height, sea = h.seaY, G = 2, R = 150, N = Math.floor(2 * R / G) + 1
    const lab = new Int32Array(N * N).fill(-1), comps = []
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const k = j * N + i; if (lab[k] !== -1) continue; const x = -R + i * G, z = -R + j * G; if (H(x, z) >= sea) { lab[k] = -2; continue }
      const c = { n: 0, sx: 0, sz: 0, minH: 1e9, deep: null, cells: [] }, st = [k]; lab[k] = comps.length
      while (st.length) { const q = st.pop(), qi = q % N, qj = (q - qi) / N, qx = -R + qi * G, qz = -R + qj * G, hq = H(qx, qz); c.n++; c.sx += qx; c.sz += qz; if (hq < c.minH) { c.minH = hq; c.deep = [qx, qz] }
        if (c.cells.length < 4000) c.cells.push([qx, qz])
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ni = qi + di, nj = qj + dj; if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue; const nk = nj * N + ni; if (lab[nk] !== -1) continue
          if (H(-R + ni * G, -R + nj * G) < sea) { lab[nk] = comps.length; st.push(nk) } else lab[nk] = -2 } }
      comps.push(c) }
    const lakes = comps.map((c) => { const cx = c.sx / c.n, cz = c.sz / c.n; let rad = 0; for (const [x, z] of c.cells) rad = Math.max(rad, Math.hypot(x - cx, z - cz)); return { area: c.n * G * G, c: [cx, sea, cz], deep: c.deep, depth: +(sea - c.minH).toFixed(2), rad: +rad.toFixed(1) } }).sort((a, b) => a.area - b.area)
    const small = lakes.filter((l) => l.area >= 30 && l.area <= 600), big = lakes.filter((l) => l.area > 600)
    const mouths = []; for (const L of h.lines) { const p = L.pts[L.pts.length - 1]; if (p && sea != null && Math.abs(p.lv - sea) < 0.6) mouths.push([p.x, p.lv, p.z]) }
    return { seaY: sea, nLakes: lakes.length, small: small.slice(0, 6), big: big.slice(-3), mountain: h.lakes.map((l) => { const g = h.grid; let sx = 0, sz = 0; for (const c of l.cells) { sx += g.o + (c % g.HN) * g.HG; sz += g.o + Math.floor(c / g.HN) * g.HG } return { c: [sx / l.cells.length, l.lv, sz / l.cells.length], area: l.cells.length * g.HG * g.HG } }),
      falls: h.falls.map((f) => ({ top: [f.a.x, f.top, f.a.z], bot: [f.b.x, f.bot, f.b.z] })), mouths, lines: h.lines.map((l) => l.pts.length) } })
}
// Kamera auf ein Ziel aus Richtung (Grad), Abstand d, Höhe y über dem Ziel
export const around = (c, deg, d, y) => [c[0] + Math.cos(deg * Math.PI / 180) * d, c[1] + y, c[2] + Math.sin(deg * Math.PI / 180) * d]
// Kamera zwischen Ziel und Weltmitte (nie außerhalb des Randwalls): Abstand d zur Mitte hin, Höhe y, seitlich um deg gedreht
export const inward = (c, d, y, deg = 0) => { const a = Math.atan2(-c[2], -c[0]) + deg * Math.PI / 180; return [c[0] + Math.cos(a) * d, c[1] + y, c[2] + Math.sin(a) * d] }
