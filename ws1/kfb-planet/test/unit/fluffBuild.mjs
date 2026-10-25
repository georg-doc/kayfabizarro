// Richtung build in kfb-fluff-suck (V-533, S1 Fortbewegung V-746) ohne Browser: Kugel startet in der Düse, endet am Ziel, Cues build-emit → build-fly →
// build-plop → build-land in ≈ 1,1 s, onLand je Kugel, Wolke über der Obergrenze, keine Saug-Cues und active() bleibt 0 (Saug-Ton unberührt),
// gemischt mit suck: Saug-Ablauf unverändert, gleiche Kugeln (ein InstancedMesh, kein neues Material).
import { report } from './_report.mjs'
import * as THREE from 'three'
import { createFluffSuck, SUCK, BUILD } from '../../src/modules/fluffSuck.js'
const noz = { pos: new THREE.Vector3(0, 1.5, 0), dir: new THREE.Vector3(0, 0, 1) }, target = [2, 0.4, -1]
const cues = [], S = createFluffSuck({ maxJobs: 4, onCue: (c) => cues.push(c) })
const mats0 = []; S.object3d.traverse((o) => { if (o.material) mats0.push(o.material) })
let landed = 0, startDist = null, endDist = null, tLand = null, activeMax = 0, buildingMax = 0, countMax = 0
const J = S.build({ pos: target, r: 0.15, color: '#ffd21f' }, () => noz, 'ground', { onLand: () => { landed++ } })
const tv = new THREE.Vector3(...target)
for (let i = 0; i < 120; i++) { S.update(1 / 60); if (J.render && startDist == null) startDist = J.render.p.distanceTo(noz.pos)
  if (S.building()) endDist = J.render.p.distanceTo(tv); if (landed && tLand == null) tLand = (i + 1) / 60
  activeMax = Math.max(activeMax, S.active()); buildingMax = Math.max(buildingMax, S.building()); countMax = Math.max(countMax, S.object3d.children[0].count) }
const total = BUILD.emit + BUILD.fly + BUILD.plop + BUILD.settle
// Obergrenze: 6 Bau-Aufträge bei maxJobs 4 → 2 Wolken, alle landen
let landed2 = 0; for (let i = 0; i < 6; i++) S.build({ pos: [i, 0, 0], r: 0.1 }, () => noz, 'ground', { onLand: () => { landed2++ } }); for (let i = 0; i < 120; i++) S.update(1 / 60)
// gemischt: Saug-Ablauf mit gleichzeitig laufendem Bau
const runSuck = (withBuild) => { const c = [], M = createFluffSuck({ maxJobs: 8, onCue: (x) => c.push(x) }); if (withBuild) M.build({ pos: [3, 0, 3], r: 0.1 }, () => noz)
  M.suck({ pos: [1, 0.2, 1], r: 0.12 }, () => noz, 'tree'); for (let i = 0; i < 120; i++) M.update(1 / 60); return { c: c.filter((x) => !x.startsWith('build')).join(), st: M.stats() } }
const a = runSuck(false), b = runSuck(true)
const mats1 = []; S.object3d.traverse((o) => { if (o.material) mats1.push(o.material) })
const order = cues.filter((c) => c.startsWith('build')).slice(0, 4).join()
process.exit(report('unit-fluffBuild (V-533)', {
  cueOrder: order === 'build-emit,build-fly,build-plop,build-land',
  noSuckCues: !cues.some((c) => ['charge', 'stretch', 'plop', 'fly', 'swallow-start', 'swallow', 'cloud'].includes(c)),
  startsAtNozzle: startDist != null && startDist < 0.05,
  endsAtTarget: endDist != null && endDist < 0.15 * 0.5,
  duration: tLand != null && Math.abs(tLand - total) < 0.04,
  onLandOnce: landed === 1,
  cloudOverCap: landed2 === 6 && S.buildStats().clouded === 2,
  suckAudioUntouched: activeMax === 0 && buildingMax === 1,
  sameInstancedMesh: countMax === 1 && mats0.length === mats1.length && mats0.every((m, i) => m === mats1[i]),
  suckUnchangedWithBuild: a.c === b.c && a.st.swallowed === b.st.swallowed && a.st.started === b.st.started && b.st.active === 0,
}, { order, startDist, endDist, tLand, total, landed2, bstats: S.buildStats(), a: a.c }))
