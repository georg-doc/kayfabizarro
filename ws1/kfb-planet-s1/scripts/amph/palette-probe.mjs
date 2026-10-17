// Prüfsonde für WS0 (kein Spielverhalten): Amphitheater in der Cartoon-Palette des Bioms, nur zur Laufzeit im Prüf-Browser umgefärbt.
// Helligkeit der Meshy-Textur → Drei-Stufen-Verlauf [dunkel, mitte, hell] des Bioms (wie world-palettes „dunkles Tal → Mitte → Spitze“);
// die Textur-Zeichnung bleibt über die Helligkeit erhalten. Biome = BIOMES aus billboard.js (Spender billboard-stage.js).
// node scripts/amph/palette-probe.mjs [out-ordner]   → je Biom ein Bild + Original
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
// BIOMES aus billboard.js als Text gelesen (das Modul selbst braucht den Browser)
const BIOMES = [...fs.readFileSync('src/modules/billboard.js', 'utf8').matchAll(/\{ name: '([^']+)', top: '(#\w+)', rock: '(#\w+)', road: '(#\w+)', accent: '(#\w+)', paper: '(#\w+)' \}/g)].map((m) => ({ name: m[1], top: m[2], rock: m[3], road: m[4], accent: m[5], paper: m[6] }))
const OUT = process.argv[2] || 'test/out/palette'; fs.mkdirSync(OUT, { recursive: true })
const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('') }
// Stufen je Biom: dunkel = Fels in Straße gemischt, mitte = Fels, hell = Boden-Oberfläche in Papier gemischt (Steinkronen hell, Fugen dunkel)
const stopsOf = (b) => [mix(b.rock, b.road, 0.55), b.rock, mix(b.top, b.paper, 0.45)]
const runs = [{ name: 'original', biome: BIOMES[1], recolor: false }, ...BIOMES.map((b) => ({ name: b.name, biome: b, recolor: true }))]
const report = []
for (const r of runs) {
  const { browser, page, errs } = await openPage(`#stage,debug,actors=none,biome=${encodeURIComponent(r.biome.name)}`, { viewport: { width: 1280, height: 720 } })
  await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' }, null, { timeout: 240000 })
  if (r.recolor) await page.evaluate((stops) => {
    const root = window.__kfbStageMods.amph.object3d.getObjectByName('amphitheater-model'); let C = null
    root.traverse((o) => { if (!o.isMesh) return; for (const m of [].concat(o.material)) { C = C || m.color.constructor
      const u = { c0: { value: new C(stops[0]) }, c1: { value: new C(stops[1]) }, c2: { value: new C(stops[2]) }, amt: { value: 0.85 } }
      m.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, { pc0: u.c0, pc1: u.c1, pc2: u.c2, pamt: u.amt })
        sh.fragmentShader = 'uniform vec3 pc0; uniform vec3 pc1; uniform vec3 pc2; uniform float pamt;\n' + sh.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
  { float L = clamp((dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)) - 0.04) / 0.45, 0.0, 1.0);
    vec3 ramp = L < 0.5 ? mix(pc0, pc1, L * 2.0) : mix(pc1, pc2, (L - 0.5) * 2.0);
    diffuseColor.rgb = mix(diffuseColor.rgb, ramp, pamt); }`) }
      m.customProgramCacheKey = () => 'kfb-palette-probe'; m.needsUpdate = true } })
  }, stopsOf(r.biome))
  await page.waitForTimeout(2500)
  const f = `${OUT}/amph_${r.recolor ? r.name.replace(/[^\w-]+/g, '_') : 'original'}.png`
  fs.writeFileSync(f, await page.screenshot()); report.push({ run: r.name, biome: r.biome.name, stops: r.recolor ? stopsOf(r.biome) : null, file: f, errs })
  await browser.close()
}
fs.writeFileSync(`${OUT}/palette-probe.json`, JSON.stringify(report, null, 1)); console.log(JSON.stringify(report.map((x) => [x.run, x.stops, x.errs.length])))
