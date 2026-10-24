// WS-NPC chat=syl: Blasen meiden HUD (src/bubbleAvoid.js) – benachbarte HUD-Flächen werden zusammengefasst (Münzreihe HUD 3D: sonst sprang die Blase
// im einen Ausweich-Durchgang des Blasen-Layers zurück über die ersten Münzen, Abnahme S3 0b 25.10.); getrennte Flächen bleiben getrennt
import { report } from './_report.mjs'
import { mergeRects } from '../../src/bubbleAvoid.js'
const orbs = [615, 686, 758, 830, 901, 973].map((x) => ({ x, y: 18, w: 67, h: 67, kind: 'hud' }))
const m = mergeRects([...orbs, { x: 0, y: 743, w: 160, h: 160, kind: 'hud' }, { x: 1402, y: -15, w: 170, h: 170, kind: 'hud' }])
const row = m.find((r) => r.y === 18)
process.exit(report('unit-bubbleAvoid (WS-NPC, HUD-Flächen zusammenfassen)', {
  rowMerged: !!row && row.x === 615 && Math.round(row.x + row.w) === 1040 && row.kind === 'hud',
  othersKept: m.length === 3,
  inputUntouched: orbs[0].w === 67,
}, { m }))
