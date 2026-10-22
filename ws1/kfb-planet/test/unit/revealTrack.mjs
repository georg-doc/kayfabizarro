// WS-NPC E3 · Geschenk-Enthüllung (src/npc/revealTrack.js, Daten src/data/npc/reveal.toy-soldier.json), ohne Browser:
//   Daten = Original-Spur (12 Spuren, 4,8 s, Herkunft mit Commit/Blob) · Easing wortgleich studio.js (Stichwerte) · Box sichtbar bis 1,0 s, Papier ab 1,0 s
//   · Antizipation (Box staucht 1,12/0,84 bei 0,64 s, kippt −7° bei 0,62 s) · Soldat überschwingt (> 1,1) und landet (y 0) ab 1,5 s · Ruhestand 2,05 s
import { report } from './_report.mjs'
import R from '../../src/data/npc/reveal.toy-soldier.json' with { type: 'json' }
import { EASE, trackValue, nodeAt, restTime, phaseAt } from '../../src/npc/revealTrack.js'

const C = {}, near = (a, b, e = 1e-9) => Math.abs(a - b) <= e
C.dataOriginal = R.schema === 'kfb.reveal/1' && R.duration === 4.8 && R.tracks.length === 12 && /^[0-9a-f]{40}$/.test(R.source.commit) && /^[0-9a-f]{40}$/.test(R.source.blob)
C.easeExact = near(EASE.outBack(0.5), 1 + 2.2 * -0.125 + 1.5 * 0.25) && near(EASE.inOutQuad(0.25), 0.125) && near(EASE.outQuad(0.5), 0.75) && EASE.outElastic(0) === 0 && EASE.outElastic(1) === 1
const box = (t) => nodeAt(R, 'present', t), paper = (t) => nodeAt(R, 'unwrapped', t), sol = (t) => nodeAt(R, 'soldier', t)
C.boxThenPaper = box(0.99).visible === true && box(1.0).visible === false && paper(0.99).visible === false && paper(1.0).visible === true
C.anticipation = box(0.64).scale.every((v, i) => near(v, [1.12, 0.84, 1.12][i])) && near(box(0.62).rz, -7) && near(box(0.3).rz, 0)
// studio.js outBack(0) = 0,3 (nicht 0): am Segmentanfang springt der Wert schon um 30 % zum nächsten Schlüssel – 1:1 übernommen, daher Überschwingen als Maximum geprüft
let over = 0; for (let t = 1.0; t <= 1.72; t += 0.005) over = Math.max(over, sol(t).scaleAll)
C.soldierPops = near(sol(0.5).scaleAll, 0.001) && over > 1.1 && near(sol(1.73).scaleAll, 1) && near(sol(1.5).y, 0) && near(sol(0.5).y, 0.3) && near(sol(1.0).ry, -40) && near(sol(1.7).ry, 0)
C.restAndPhases = near(restTime(R), 2.05) && phaseAt(R, 0.2) === 'Box geschlossen' && phaseAt(R, 1.0) === 'Pop' && phaseAt(R, 3) === 'Idle'
C.boolJumps = trackValue({ keys: [[0, true], [1, false]] }, 0.999) === true
process.exit(report('unit-revealTrack (WS-NPC E3, Geschenk-Enthüllung 1:1)', C, { rest: restTime(R), over: +over.toFixed(3), s13: sol(1.3), b064: box(0.64) }))
