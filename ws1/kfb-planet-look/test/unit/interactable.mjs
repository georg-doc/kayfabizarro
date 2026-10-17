// Slice 1 · Interaktions-Vertrag: nächstes Ziel, Gleichstand, außer Reichweite → null, Abmelden, Hysterese, bewegte Ziele, trigger. Ohne Browser.
import { report } from './_report.mjs'
import { createInteractables } from '../../src/world/interactable.js'

const log = []
const I = createInteractables()
const offA = I.register({ id: 'npcA', pos: [2, 0, 0], radius: 3, label: 'Reden', action: () => log.push('A') })
I.register({ id: 'chest', pos: [0, 0, 2.5], radius: 3, label: 'Öffnen', action: () => log.push('C') })
I.register({ id: 'far', pos: [50, 0, 0], radius: 5, label: 'weit', action: () => log.push('F') })
const n1 = I.nearest([0, 0, 0], { hysteresis: false }) // A 2 m, chest 2,5 m
const n2 = I.nearest([0, 0, 3], { hysteresis: false }) // chest 0,5 m
const none = I.nearest([20, 0, 20], { hysteresis: false })

// Gleichstand: gleich weit → zuerst angemeldet gewinnt, auch nach erneutem Anmelden mit gleicher id
const T = createInteractables()
T.register({ id: 'first', pos: [1, 0, 0], radius: 2, label: '1' }); T.register({ id: 'second', pos: [-1, 0, 0], radius: 2, label: '2' })
const tie1 = T.nearest([0, 0, 0], { hysteresis: false }).id
T.register({ id: 'first', pos: [1, 0, 0], radius: 2, label: '1b' }) // ersetzt, Reihenfolge bleibt
const tie2 = T.nearest([0, 0, 0], { hysteresis: false })

// Abmelden: Rückgabefunktion und unregister; aktuelles Ziel fällt weg
I.nearest([1.5, 0, 0]); const curBefore = I.current(); offA(); const afterOff = I.nearest([1.5, 0, 0], { hysteresis: false }); const curAfter = I.current()
const unregTwice = I.unregister('npcA')

// Hysterese: zwischen zwei Nachbarn kein Flackern; erst wenn das andere deutlich näher ist, wird gewechselt
const H = createInteractables()
H.register({ id: 'L', pos: [-1, 0, 0], radius: 2, label: 'L' }); H.register({ id: 'R', pos: [1, 0, 0], radius: 2, label: 'R' })
const hs = [-0.3, -0.05, 0.05, 0.1, 0.4].map((x) => H.nearest([x, 0, 0]).id) // ab x > 0,125 ist R um mehr als 0,25 m näher
const keepOut = H.nearest([-2.2, 0, 0]).id // L: 1,2 m (im Radius); dann knapp außerhalb von L, aber innerhalb keep (2 × 1,15 = 2,3)
const hOut = H.nearest([-3.2, 0, 0]) // L 2,2 m: außerhalb Radius, aber innerhalb keep → bleibt
const hGone = H.nearest([-3.5, 0, 0]) // 2,5 m > 2,3 → weg

// bewegte Ziele, when(), enabled, flach (xz), {x,y,z}-Positionen
let npc = { x: 10, y: 0, z: 0 }
const M = createInteractables({ flat: true })
M.register({ id: 'walker', pos: () => npc, radius: 1.5, label: 'Hallo', action: () => log.push('W') })
M.register({ id: 'locked', pos: [0, 0, 0.5], radius: 2, label: 'zu', when: () => false })
M.register({ id: 'off', pos: [0, 0, 0.2], radius: 2, label: 'aus', enabled: false })
M.register({ id: 'high', pos: [0, 5, 1.2], radius: 1.5, label: 'oben' }) // flach: Höhe zählt nicht
const m1 = M.nearest({ x: 0, y: 0, z: 0 })?.id; npc = { x: 0.3, y: 0, z: 0 }; const m2 = M.nearest({ x: 0, y: 0, z: 0 }, { hysteresis: false })?.id

// trigger und prompt: genau eine Aktion
log.length = 0
const trig = I.trigger([0, 0, 2.6]), trigNone = I.trigger([30, 0, -30]), pr = I.prompt([0, 0, 2.6]), prNone = I.prompt([30, 0, -30])
let threw = 0; try { I.register({ pos: [0, 0, 0], radius: 1 }) } catch { threw++ } try { I.register({ id: 'x', pos: [0, 0, 0], radius: 0 }) } catch { threw++ }

process.exit(report('unit-interactable', {
  nearestSelection: n1?.id === 'npcA' && Math.abs(n1.distance - 2) < 1e-9 && n2?.id === 'chest',
  outOfRangeNull: none === null && I.nearest(null) === null,
  tiesFirstRegistered: tie1 === 'first' && tie2.id === 'first' && tie2.label === '1b' && T.size() === 2,
  unregister: curBefore === 'npcA' && afterOff?.id === 'chest' && curAfter === 'chest' && unregTwice === false && !I.has('npcA'),
  hysteresisNoFlicker: hs.join() === 'L,L,L,L,R',
  hysteresisKeepRadius: keepOut === 'L' && hOut?.id === 'L' && hGone === null,
  movingTarget: m1 === 'high' && m2 === 'walker',
  whenAndEnabled: ![m1, m2].includes('locked') && ![m1, m2].includes('off'),
  triggerOne: trig === true && trigNone === false && log.join() === 'C',
  promptOne: pr?.id === 'chest' && pr.label === 'Öffnen' && prNone === null,
  validation: threw === 2,
}, { hs, m1, m2 }))
