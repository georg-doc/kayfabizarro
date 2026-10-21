// WS-NPC Phase D · Takt und Aufstellung der Ork-Band (src/npc/bandClock.js), ohne Browser:
//   Formel des Scenelets (beatPos, clipTime) · Clip-Zeit stetig im Fenster [0, duration) und periodisch über beats · gleiche Weltzeit = gleiches Bild
//   (weggehen/zurückkommen) · Aufstellung um den Anker: Abstände bleiben (Drehung), Drehung ry addiert, Daten (residents.r1.json bands) gültig
import { report } from './_report.mjs'
import W from '../../src/data/npc/residents.r1.json' with { type: 'json' }
import { beatPos, clipTimeAt, placeActor } from '../../src/npc/bandClock.js'

const B = W.bands[0], clock = B.fallback.timeline.clock, A = B.fallback.actors, C = {}
C.formula = Math.abs(beatPos(clock, clock.phaseOffset_s + 0.6) - 1) < 1e-9 && Math.abs(clipTimeAt(1, 8, 8.04) - 1.005) < 1e-9 && clipTimeAt(-0.5, 2, 2) === 1.5
let maxJump = 0, wraps = 0, inRange = true, prev = null, prev0End = 0
for (let t = 0; t < 60; t += 1 / 60) { const ct = clipTimeAt(beatPos(clock, t), 8, 8.04); inRange &&= ct >= 0 && ct < 8.04; if (prev !== null) { const d = ct - prev; if (d < -4) wraps++; else maxJump = Math.max(maxJump, Math.abs(d)) } prev = ct; prev0End = t }
C.continuousAndPeriodic = inRange && maxJump < (100 / 60) * (8.04 / 8) / 60 + 1e-9 && wraps === Math.floor(beatPos(clock, prev0End) / 8) - Math.floor(beatPos(clock, 0) / 8) // ein Umlauf je 8 Schläge (auch vor dem Phasen-Versatz)
C.sameTimeSameFrame = clipTimeAt(beatPos(clock, 1234.5), 8, 8.04) === clipTimeAt(beatPos(clock, 1234.5), 8, 8.04)
const s = 1.3, at = B.at, yaw = (B.yawDeg * Math.PI) / 180, P = A.map((a) => placeActor(a, at, yaw, s))
const dist = (i, k, f) => Math.hypot(f[i].x - f[k].x, f[i].z - f[k].z)
const P0 = A.map((a) => placeActor(a, [0, 0], 0, s))
C.rigidPlacement = A.every((_, i) => A.every((__, k) => Math.abs(dist(i, k, P) - dist(i, k, P0)) < 1e-9)) && Math.abs(P[0].x - at[0]) < 1e-9 && Math.abs(P[0].z - at[1]) < 1e-9
C.yawAdds = Math.abs(P[3].yaw - (yaw - (24 * Math.PI) / 180)) < 1e-9
// Blickrichtung: +z der Band (Publikum) zeigt bei yaw 90° nach +x
C.facesAudience = Math.abs(placeActor({ p: [0, 0, 1] }, [0, 0], yaw, 1).x - 1) < 1e-9
C.dataValid = B.schema === 'kfb.npc-band/1' && A.length === 4 && A.every((a) => a.clip && a.beats > 0) && Array.isArray(B.at) && Number.isFinite(B.yawDeg)
process.exit(report('unit-bandClock (WS-NPC Phase D, Ork-Band Takt und Aufstellung)', C, { maxJump: +maxJump.toFixed(5), wraps, P: P.map((p) => [+p.x.toFixed(2), +p.z.toFixed(2)]) }))
