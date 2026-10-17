// M1 · Fuß-Auswertung für Spiel und Referenz mit demselben Code (Prüfer M1, Befund 1).
// analyse(rec): rec = { l: [[x,y,z]…], r: […], body: [y…], bodyXZ: [[x,z]…], t: [s…] } (Kontaktpunkt je Seite = feste Sohlenmitte = Mittel von foot und toes;
//   nicht der tiefere der beiden: dessen Wechsel beim Abrollen sähe wie Rutschen aus, Prüfer M1-2 Befund 5).
//   Kontakt = bis 2 cm über dem tiefsten Punkt relativ zur Figur (Körper wippt auf der Schwebe-Feder), mindestens 2 Abtastungen.
//   Kontaktpunkt = tieferer von foot/toes; gemessen wird nur, solange derselbe Knochen Kontakt hat (siehe analyse).
//   creepCm  = größte waagrechte Spanne des Kontaktpunkts während eines Kontakts (LOCO-Handover §3).
//   slipRatio = Median der waagrechten Geschwindigkeit des Kontaktpunkts zwischen zwei Kontakt-Abtastungen / Median des Körpertempos (0 = gepflanzt, 1 = rutscht voll).
// locoReference(series): derselbe Gang-Mischer wie im Spiel (m1-gait, V-248) mit denselben Clips auf derselben Figur (FB v5b, Maßstab 0,947) – ohne Controller, ohne Physik:
//   Wurzel fährt genau mit Tempo × Maßstab geradeaus, Tempo-Parameter und Startphase aus dem Spiel-Mitschnitt. Was die Referenz an Rutschen zeigt, steckt in
//   den Clips bzw. der LOCO-Mischung (Handover); was das Spiel darüber hinaus zeigt, kommt aus der Einbindung (Controller, Takt, Figur).
import { K } from '../src/m1/m1Scale.js' // V-345: Positionen und Grenzen in alten WS1-Metern × K
import fs from 'fs'
import path from 'path'

// rec.l / rec.r: je Probe { foot:[x,y,z], toes:[x,y,z] } = Ferse/Ballen (Sohlenpunkte aus dem Netz, m1-sole) oder ein einzelner Punkt [x,y,z].
// Kontakt je Punkt wie bei der Eigentempo-Messung (scripts/m1/clip-speed.mjs): bis 1,5 cm über dem tiefsten Stand DIESES Punkts relativ zur Figur;
// haben beide Kontakt, zählt der näher an seinem Bodenstand. Rutschen und Kriechen nur zwischen Proben mit demselben Kontaktpunkt (Abrollen Ferse →
// Ballen ist kein Rutschen).
export function analyse(rec, thr = 0.015 * K) {
  let worst = 0, contacts = 0; const slips = [], bodyV = []
  for (let i = 1; i < rec.t.length; i++) { const dt = rec.t[i] - rec.t[i - 1]; if (dt > 0) bodyV.push(Math.hypot(rec.bodyXZ[i][0] - rec.bodyXZ[i - 1][0], rec.bodyXZ[i][1] - rec.bodyXZ[i - 1][1]) / dt) }
  const vb = bodyV.slice().sort((a, b) => a - b)[bodyV.length >> 1] || 0
  for (const s of ['l', 'r']) {
    const raw = rec[s], two = raw.length && !Array.isArray(raw[0])
    const pts = two ? { h: raw.map((q) => q.foot), b: raw.map((q) => q.toes) } : { o: raw }
    const rel = Object.fromEntries(Object.entries(pts).map(([k, P]) => [k, P.map((p, i) => p[1] - rec.body[i])]))
    const mins = Object.fromEntries(Object.entries(rel).map(([k, R]) => [k, Math.min(...R)]))
    let seg = []
    const flush = () => {
      if (seg.length >= 2) {
        contacts++
        for (const k of Object.keys(pts)) { const part = seg.filter((x) => x.k === k); if (part.length >= 2) { const xs = part.map((x) => x.p[0]), zs = part.map((x) => x.p[2]); worst = Math.max(worst, Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs))) } }
        for (let j = 1; j < seg.length; j++) { if (seg[j].k !== seg[j - 1].k) continue; const dt = seg[j].t - seg[j - 1].t; if (dt > 0) slips.push(Math.hypot(seg[j].p[0] - seg[j - 1].p[0], seg[j].p[2] - seg[j - 1].p[2]) / dt) }
      }
      seg = []
    }
    for (let i = 0; i < rec.t.length; i++) {
      let best = null
      for (const k of Object.keys(pts)) { const d = rel[k][i] - mins[k]; if (d <= thr && (!best || d < best.d)) best = { k, d } }
      if (best) seg.push({ k: best.k, p: pts[best.k][i], t: rec.t[i] }); else flush()
    }
    flush()
  }
  const sm = slips.length ? slips.slice().sort((a, b) => a - b)[slips.length >> 1] : null
  return { creepCm: +(worst * 100).toFixed(1), contacts, slipSpeed: sm == null ? null : +sm.toFixed(3), bodySpeed: +vb.toFixed(3), slipRatio: sm == null || vb < 0.05 * K ? null : +(sm / vb).toFixed(3) }
}

let REF = null
async function refRig() {
  if (REF) return REF
  const T = new URL('../node_modules/three/', import.meta.url).href
  const THREE = await import(T + 'build/three.module.js')
  const { GLTFLoader } = await import(T + 'examples/jsm/loaders/GLTFLoader.js')
  // m1-gait importiert „three“ als nackten Namen; Node löst ihn über das node_modules dieses Baums auf (dieselbe Datei wie oben → eine Instanz)
  const { GaitAnimator } = await import(new URL('../src/modules/m1-gait.js', import.meta.url).href)
  const { soleOffsets, solePoints } = await import(new URL('../src/modules/m1-sole.js', import.meta.url).href)
  globalThis.self = globalThis
  const load = (f) => new Promise((res, rej) => { const b = fs.readFileSync(f); new GLTFLoader().parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.length), '', res, rej) })
  const A = path.resolve('src/assets/actors')
  const warn = console.warn; console.warn = () => {} // Texturen lädt GLTFLoader in Node nicht (für die Knochen egal)
  const fb = await load(path.join(A, 'FB_TEMPLATE_LOOK_v5b.glb')), mv = await load(path.join(A, 'Rig_Medium_MovementBasic.glb')), gen = await load(path.join(A, 'Rig_Medium_General.glb'))
  console.warn = warn
  const clips = {}; for (const c of [...mv.animations, ...gen.animations]) if (!clips[c.name]) clips[c.name] = c
  const recipe = JSON.parse(fs.readFileSync('src/data/actors/frizzlebob-v5b.recipe.json', 'utf8'))
  REF = { THREE, GaitAnimator, soleOffsets, solePoints, fb, clips, scale: (recipe.stage?.scale ?? 1) * K }
  return REF
}

// series: [{ t, speedParam, phase }] je Abtastung aus dem Spiel
export async function locoReference(series) {
  const { THREE, GaitAnimator, soleOffsets, solePoints, fb, clips, scale } = await refRig()
  const root = new THREE.Group(), fig = fb.scene; root.add(fig); root.scale.setScalar(scale)
  root.updateMatrixWorld(true); const soles = soleOffsets(THREE, fig) // Ferse/Ballen aus dem Netz, wie im Spiel
  const anim = new GaitAnimator(fig, clips)
  const rec = { l: [], r: [], body: [], bodyXZ: [], t: [] }
  let x = 0
  anim.phase = series[0].phase ?? 0; anim.update(0, series[0].speedParam)
  for (let i = 0; i < series.length; i++) {
    if (i > 0) { const dt = series[i].t - series[i - 1].t; x += series[i].speedParam * scale * dt; anim.update(dt, series[i].speedParam) }
    root.position.set(0, 0, x); root.updateMatrixWorld(true) // Figur schaut nach +Z: die Wurzel fährt vorwärts
    const SP = solePoints(THREE, soles), A3 = (q) => [q.x, q.y, q.z]
    rec.l.push({ foot: A3(SP['foot.l']), toes: A3(SP['toes.l']) }); rec.r.push({ foot: A3(SP['foot.r']), toes: A3(SP['toes.r']) }); rec.body.push(0); rec.bodyXZ.push([0, x]); rec.t.push(series[i].t)
  }
  anim.dispose(); root.remove(fig)
  return analyse(rec)
}
