// V-270 B · Vermessung des Amphitheaters für Rollen je Bühnenteil: Höhen der waagrechten Flächen (Sitzreihen, Mauerkrone) in Weltmetern,
// je Ring um die Bühnenmitte. Ausgabe: Histogramm (10 cm) der Tritthöhen außerhalb der Bühne und die Bühnenkante. node scripts/amph/band-probe.mjs
import { openPage } from '../../test/_page.mjs'
const { browser, page } = await openPage('#stage,debug,actors=none', { viewport: { width: 640, height: 360 } })
await page.waitForFunction(() => window.__kfbStageMods?.amph?.status().status === 'OK', null, { timeout: 240000 })
const r = await page.evaluate(() => {
  const m = window.__kfbStageMods.amph.object3d.getObjectByName('amphitheater-model')
  const H = {}, R = {}, W = {}; let cnt = 0
  // Weltlage ohne THREE-Import: matrixWorld-Elemente direkt (gleichmäßige Skalierung, Normale = 3×3-Teil, normiert)
  m.traverse((o) => { if (!o.isMesh) return; const p = o.geometry.attributes.position, nn = o.geometry.attributes.normal, e = o.matrixWorld.elements
    for (let i = 0; i < p.count; i += 3) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = nn.getX(i), b = nn.getY(i), c = nn.getZ(i)
      const vx = e[0] * x + e[4] * y + e[8] * z + e[12], vy = e[1] * x + e[5] * y + e[9] * z + e[13], vz = e[2] * x + e[6] * y + e[10] * z + e[14]
      const nx = e[0] * a + e[4] * b + e[8] * c, ny = e[1] * a + e[5] * b + e[9] * c, nz = e[2] * a + e[6] * b + e[10] * c, ln = Math.hypot(nx, ny, nz), ry = ny / ln
      const rr = Math.hypot(vx, vz); cnt++
      if (ry > 0.85) { const k = Math.round(vy * 10) / 10; if (rr > 7.5) H[k] = (H[k] || 0) + 1; else R[Math.round(rr * 2) / 2] = (R[Math.round(rr * 2) / 2] || 0) + 1 }
      else if (Math.abs(ry) < 0.3) { const k = Math.round(vy * 2) / 2; W[k] = (W[k] || 0) + 1 } } })
  return { cnt, treads: H, floorRings: R, walls: W }
})
const top = (o, k = 40) => Object.entries(o).map(([a, b]) => [+a, b]).sort((x, y) => x[0] - y[0]).filter(([, b]) => b > 30).slice(0, k)
console.log('verts', r.cnt); console.log('Tritte (y m, Anzahl):', JSON.stringify(top(r.treads, 120))); console.log('Bühne innen (r m):', JSON.stringify(top(r.floorRings))); console.log('Wände (y m):', JSON.stringify(top(r.walls)))
await browser.close()
