// Fluff-Ernte R1 (V-479, V-487 Stufe 2) · Saug-Modul ohne Browser: Phasen-Cues in der richtigen Reihenfolge und Dauer (≈ 1,4 s), Volumen bleibt (Darstellung
// staucht/streckt, Breite × Länge² ≈ 1 bis zum Einsaugen), Kugel endet in der Düse, Plopp je Herkunft, Wolke über der Obergrenze, swallow-Rückruf zählt.
import { report } from './_report.mjs'
import * as THREE from 'three'
import { createFluffSuck, SUCK } from '../../src/modules/fluffSuck.js'
const cues = [], S = createFluffSuck({ maxJobs: 4, onCue: (c) => cues.push(c) }), noz = { pos: new THREE.Vector3(0, 1.2, 0), dir: new THREE.Vector3(0, 0, 1) }
let swallowed = 0, vol = [], endDist = null
const J = S.suck({ pos: [2, 0.2, 3], r: 0.15, color: '#93be3c' }, () => noz, 'tree', { onSwallow: () => { swallowed++ } })
let t = 0; for (let i = 0; i < 120; i++) { S.update(1 / 60); t += 1 / 60; if (J.render) { if (J.t < SUCK.charge + SUCK.stretch + SUCK.plop + SUCK.fly) vol.push(J.render.sSide * J.render.sSide * J.render.sAlong); if (S.active()) endDist = J.render.p.distanceTo(noz.pos) } }
const total = SUCK.charge + SUCK.stretch + SUCK.plop + SUCK.fly + SUCK.swallow
for (const o of ['ground', 'water']) S.suck({ pos: [1, 0, 1], r: 0.1 }, () => noz, o)
for (let i = 0; i < 120; i++) S.update(1 / 60)
// Obergrenze: 6 Kugeln bei maxJobs 4 → 2 Wolke
let sw2 = 0; for (let i = 0; i < 6; i++) S.suck({ pos: [i, 0, 2], r: 0.1 }, () => noz, 'ground', { onSwallow: () => sw2++ })
const st0 = S.stats(); for (let i = 0; i < 120; i++) S.update(1 / 60); const st = S.stats()
const order = ['charge', 'stretch', 'plop', 'fly', 'swallow-start', 'swallow'], first = order.map((c) => cues.indexOf(c))
const midVol = vol // nur bis vor dem Einsaugen (dort schrumpft die Kugel absichtlich)
process.exit(report('unit-fluffSuck (V-479)', {
  cueOrder: first.every((v, i) => v >= 0 && (i === 0 || v > first[i - 1])),
  durationAbout14s: total > 1.2 && total < 1.8,
  volumeKept: midVol.every((v) => Math.abs(v - 1) < 0.08),
  endsInNozzle: endDist != null && endDist < 0.05,
  swallowCallback: swallowed === 1,
  plopPerOrigin: st.plops.tree >= 1 && st.plops.ground >= 1 && st.plops.water >= 1,
  cloudOverCap: st0.clouded === 2 && sw2 === 6,
  idleAfter: st.active === 0,
}, { total, cues: cues.slice(0, 8), st, endDist }))
