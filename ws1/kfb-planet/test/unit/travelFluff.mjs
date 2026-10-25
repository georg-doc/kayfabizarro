// S1 Fortbewegung (V-746) · Wagen entsteht/verschwindet über kfb-fluff-suck (build/suck) ohne Browser: Maßstab steigt mit gelandeten Kugeln 0 → 1 innerhalb
// der Rufzeit (travelState summon 1,4 s), fällt beim Einsaugen 1 → 0 innerhalb der Verschwinde-Zeit, monoton; stop() beendet; keine Fluff-Phase → null.
import { report } from './_report.mjs'
import * as THREE from 'three'
import { createTravelFluff } from '../../src/m1/travelFluff.js'
import { TRAVEL } from '../../src/m1/travelState.js'
const T = createTravelFluff({ n: 16, stagger: 0.3 }), noz = () => ({ pos: new THREE.Vector3(3, 1.2, 0), dir: new THREE.Vector3(0, 1, 0) }), size = { half: 2.6, h: 1.8 }
const idle = T.grow()
const run = (sec) => { const g = []; for (let i = 0; i < Math.round(sec * 60); i++) { T.update(1 / 60); g.push(T.grow()) } return g }
T.start('build', { x: 0, y: 0, z: 0 }, 0.4, size, noz); const g0 = T.grow(), gb = run(TRAVEL.summon)
T.start('suck', { x: 0, y: 0, z: 0 }, 0.4, size, noz); const gs = run(TRAVEL.vanish)
const mono = (a, up) => a.every((x, i) => i === 0 || (up ? x >= a[i - 1] : x <= a[i - 1]))
T.stop(); const stopped = T.grow()
process.exit(report('unit-travelFluff', {
  idleNull: idle === null, buildStartsAtZero: g0 === 0, buildReachesOneInSummon: gb[gb.length - 1] === 1 && gb.some((x) => x > 0 && x < 1), buildMonotone: mono(gb, true),
  suckReachesZeroInVanish: gs[gs.length - 1] === 0 && gs.some((x) => x > 0 && x < 1), suckMonotone: mono(gs, false), stopNull: stopped === null,
}, { firstFull: gb.indexOf(1) / 60, firstEmpty: gs.indexOf(0) / 60, info: T.info() }))
