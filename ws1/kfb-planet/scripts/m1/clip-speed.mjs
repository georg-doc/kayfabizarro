// M1 · V-248: Eigentempo je Clip auf FrizzleBob v5b – das Tempo, mit dem der aufgesetzte Fußpunkt im (am Ort laufenden) Clip nach hinten wandert.
// Läuft die Figur genau so schnell, steht der Fuß. Fußpunkte = Ferse/Ballen aus dem Netz (src/modules/m1-sole.js, Prüfer M1-3 Befund 3/5), nicht die
// Knochen-Ursprünge. Je Abtastung (240 Hz, Clip-Zeit, timeScale 1) zählt je Fuß der Punkt (Ferse oder Ballen), der bis 1,5 cm über SEINEM tiefsten
// Stand liegt (beide: der nähere), wenn derselbe Punkt schon in der Abtastung davor Kontakt hatte; Eigentempo = Median seiner Rückwärtsgeschwindigkeit.
// Gleiche Kontaktdefinition wie test/m1-feet.mjs analyse. Gegenprobe: Motion-SSOT LOCO (Coworker, eigener Auswerter) 0,98/3,303/5,255 Rig-Einheiten.
// node scripts/m1/clip-speed.mjs
import fs from 'fs'
import path from 'path'
const T = new URL('../../node_modules/three/', import.meta.url).href
const THREE = await import(T + 'build/three.module.js')
const { GLTFLoader } = await import(T + 'examples/jsm/loaders/GLTFLoader.js')
const { soleOffsets, solePoints } = await import(new URL('../../src/modules/m1-sole.js', import.meta.url).href)
globalThis.self = globalThis
const load = (f) => new Promise((res, rej) => { const b = fs.readFileSync(f); new GLTFLoader().parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.length), '', res, rej) })
const warn = console.warn; console.warn = () => {}
const A = path.resolve('src/assets/actors'), fb = await load(path.join(A, 'FB_TEMPLATE_LOOK_v5b.glb')), mv = await load(path.join(A, 'Rig_Medium_MovementBasic.glb'))
console.warn = warn
const scale = JSON.parse(fs.readFileSync('src/data/actors/frizzlebob-v5b.recipe.json', 'utf8')).stage?.scale ?? 1
const root = new THREE.Group(), fig = fb.scene; root.add(fig); root.scale.setScalar(scale); root.updateMatrixWorld(true)
const soles = soleOffsets(THREE, fig)
const mixer = new THREE.AnimationMixer(fig), DT = 1 / 240
function nativeSpeed(clip) {
  mixer.stopAllAction(); mixer.clipAction(clip).reset().play(); mixer.update(0)
  const n = Math.round(clip.duration / DT) * 2, rec = []
  for (let i = 0; i < n; i++) { if (i) mixer.update(DT); root.updateMatrixWorld(true); const P = solePoints(THREE, soles); rec.push(Object.fromEntries(Object.entries(P).map(([k, v]) => [k, [v.x, v.y, v.z]]))) }
  const speeds = []
  for (const s of ['l', 'r']) {
    const H = rec.map((r) => r['foot.' + s]), B = rec.map((r) => r['toes.' + s]), minH = Math.min(...H.map((p) => p[1])), minB = Math.min(...B.map((p) => p[1]))
    let prev = null
    for (let i = 0; i < rec.length; i++) {
      const dh = H[i][1] - minH, db = B[i][1] - minB, cur = dh <= 0.015 || db <= 0.015 ? (dh <= 0.015 && (db > 0.015 || dh <= db) ? 'h' : 'b') : null
      if (cur && prev === cur) { const P = cur === 'h' ? H : B; speeds.push(-(P[i][2] - P[i - 1][2]) / DT) }
      prev = cur
    }
  }
  speeds.sort((a, b) => a - b)
  return { native: speeds[speeds.length >> 1], samples: speeds.length }
}
const out = { scale, clips: {} }
for (const c of ['Walking_A', 'Walking_B', 'Walking_C', 'Running_A', 'Running_B']) {
  const clip = mv.animations.find((x) => x.name === c), r = nativeSpeed(clip)
  out.clips[c] = { nativeMps: +r.native.toFixed(3), nativeRig: +(r.native / scale).toFixed(3), samples: r.samples, cycleS: +clip.duration.toFixed(3) }
}
console.log(JSON.stringify(out, null, 1))
