// V-347: Wendekreis und Drift von k2b (k2t.js) auf ebenem Boden, ohne Browser. Wagenlänge aus M2CAR.box (2 × h.z × Bühnenmaßstab S).
//   wende180/360: aus dem Stand Vollgas + voller Einschlag (A), größte Ausdehnung der Spur bis 180° bzw. 360° Drehung
//   steadyV: festes Tempo V, voller Einschlag, eine volle Drehung · drift: 20 m/s, A + Q, Heckrutschen und Gierung gegen ohne Q
import { createK2t, stepK2t, TURN } from '../../src/m2/k2t.js'
import { K } from '../../src/m1/m1Scale.js'
// V-345: Fahrzeug Rig × 0,947 × K (J17-Meter); Tempi der Dauerfahrt und des Drifts in alten Werten × K
const STEP = 1 / 60, S = Number(process.env.S || 0.947 * K), LEN = 2 * 4.0339 * S
if (process.env.TURN) Object.assign(TURN, JSON.parse(process.env.TURN))
const env = { ground: () => ({ y: 0, n: [0, 1, 0], floor: 0 }), sweep: (p, dl) => ({ delta: dl, hit: false }) }
const span = (pts) => { let D = 0; for (let i = 0; i < pts.length; i += 2) for (let j = i; j < pts.length; j += 2) D = Math.max(D, Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1])); return D }
function turn(inp, angle, hold) {
  const d = createK2t(0, 0.045 * K, 0, 0), pts = []; let t = 0
  while (Math.abs(d.yaw) < angle && t < 1200) { if (hold) d.speed = hold; stepK2t(d, inp, STEP, env); pts.push([d.x, d.z]); t++ }
  const D = span(pts); return { diameter: +D.toFixed(1), carLengths: +(D / LEN).toFixed(2), seconds: +(t * STEP).toFixed(2), endSpeed: +Math.abs(d.speed).toFixed(1) }
}
function drift(q) { const d = createK2t(0, 0.045 * K, 0, 0); let lat = 0, yaw = 0
  for (let t = 0; t < 60; t++) { d.speed = 20 * K; stepK2t(d, { gas: true, left: true, driftL: q }, STEP, env); lat = Math.max(lat, Math.abs(d.latV)) } yaw = d.yaw
  return { yawIn1s: +yaw.toFixed(2), maxSlide: +lat.toFixed(2), signal: +d.signals.drift.toFixed(2) } }
const out = { carLength: +LEN.toFixed(2), TURN, wende180: turn({ gas: true, left: true }, Math.PI), wende360: turn({ gas: true, left: true }, 2 * Math.PI) }
for (const v of [6, 10, 20, 30]) out['steady' + v] = turn({ left: true }, 2 * Math.PI, v * K)
out.driftQ = drift(true); out.noDrift = drift(false)
console.log(JSON.stringify(out))
// Überschlag-Raster (V-347 (3) auf K2B): 20 Vollgas-Läufe auf ebener Fläche je 10 s mit wechselndem Lenken/Driften (fester Zufall), größte Lage
{ let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); const runs = []
  for (let r = 0; r < 20; r++) { const d = createK2t(0, 0.045 * K, 0, 0); let maxTilt = 0, inp = {}
    for (let t = 0; t < 600; t++) { if (t % 40 === 0) { const a = rnd(); inp = { gas: true, left: a < 0.3, right: a > 0.7, driftL: a < 0.15, driftR: a > 0.85 } }
      stepK2t(d, inp, STEP, env); maxTilt = Math.max(maxTilt, Math.abs(d.roll), Math.abs(d.pitch)) }
    runs.push(+(maxTilt * 180 / Math.PI).toFixed(1)) }
  console.log(JSON.stringify({ fullGas20: { overturns: runs.filter((x) => x > 60).length, maxTiltDeg: Math.max(...runs) } })) }
