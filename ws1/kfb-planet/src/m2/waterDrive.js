// WS1c (V-631, V-621) · Fahren im, unter und über Wasser für K2B – einfache Kräfte am Wagen statt zweiter Physik (Brief WS1 Wasser R1, KISS).
// Rein (ohne three/React): Eingang = K2B-Zustand d, Wasserspiegel level(x, z) (m1-terrain waterActive), Ausgang = Änderungen an d, Ereignisse, Kamerawerte.
//   über   (skim)  ab planeOn gleitet der Schwebe-Racer auf dem Spiegel (Boden = Wasserfläche, Fahrhöhe × ride), bis er unter planeOff fällt
//   im     (wade)  Unterseite unter dem Spiegel, Dach darüber: Widerstand nach Eintauchtiefe, Höchsttempo sinkt
//   unter  (under) ganz unter Wasser: Fahrt auf dem Grund, Widerstand voll; in der Luft (sinkend/steigend) Auftrieb gegen die Schwerkraft + Dämpfung
//   Sprung unter Wasser = Schwimmstoß: kickVy × Absprung, bis zum Spiegel (höchstens kickS) ohne Dämpfung und Sinken getragen → verlässt das Wasser
//   aus jeder Tiefe mit demselben Schwung (Sprung aus dem Wasser ≈ 2 m), oben normale Schwerkraft
// Ereignisse (d.events, type 'water'): enter { strength } · exit · dive · surface · skim · kick – für VFX (waterFx) und Ton (WS-Audio, Liste an WS0).
import { K } from '../m1/m1Scale.js'

export const WATER_DRIVE = { planeOn: 18 * K, planeOff: 13 * K, ride: 0.55, sinkG: 0.18, vyDrag: 2.2, drag: 1.0, maxUnder: 0.42, kickVy: 1.2, kickS: 1.6,
  camLift: 0.9 * K, camUnderDist: 0.74, camUnderLift: -0.25 * K, camT: 0.45, camGap: 0.3 }

export const createWaterDrive = () => ({ mode: 'dry', planing: false, sub: 0, level: null, depth: 0, kickHeld: false, kickT: 0, cam: { lift: 0, dist: 1, under: 0 }, stats: { enters: 0, exits: 0, dives: 0, surfaces: 0, skims: 0, kicks: 0, maxSub: 0 } })

// Boden-Hülle um env.ground: gleitet der Wagen, ist der Spiegel der Boden (nie unter dem echten Boden); floor bleibt das Gelände (K2B-Sicherung)
export function waterGround(W, g, x, z, level, rideH) {
  if (!g || !W.planing || !level) return g
  const lv = level(x, z); if (lv == null) return g
  const y = lv + rideH * WATER_DRIVE.ride; return y > g.y ? { y, n: [0, 1, 0], floor: g.floor, water: true } : g
}

// nach stepK2t: Kräfte, Modus, Ereignisse. o: { level, carH (Rumpfhöhe m), rideH, maxF, jumpImpulse, gravity }
export function waterAfter(W, d, inp, dt, o) {
  const D = WATER_DRIVE, lv = o.level ? o.level(d.x, d.z) : null, s = lv == null ? -1 : lv - d.y   // s = Eintauchtiefe der Unterseite (m)
  const sub = s <= 0 ? 0 : Math.min(1, s / o.carH), v = Math.abs(d.speed), prev = W.mode
  W.level = lv; W.depth = Math.max(0, s); W.sub = sub; W.stats.maxSub = Math.max(W.stats.maxSub, sub)
  if (lv == null) W.planing = false
  else if (!W.planing && v > D.planeOn && s < o.carH * 0.6 && !(d.air && d.vy > 0)) W.planing = true
  else if (W.planing && (v < D.planeOff || s > o.carH * 0.8)) W.planing = false
  // Kräfte im Wasser (nicht beim Gleiten): Längs-/Querwiderstand nach Eintauchtiefe, Höchsttempo sinkt bis maxUnder
  if (sub > 0 && !W.planing) {
    d.speed *= Math.exp(-D.drag * sub * dt); d.latV *= Math.exp(-D.drag * 2 * sub * dt)
    const cap = o.maxF * (1 - (1 - D.maxUnder) * sub); if (Math.abs(d.speed) > cap) d.speed -= Math.sign(d.speed) * (Math.abs(d.speed) - cap) * Math.min(1, 3 * dt)
    if (d.air && W.kickT > 0 && d.vy > 0) d.vy += o.gravity * dt   // Schwimmstoß trägt bis zum Spiegel
    else if (d.air) { d.vy += o.gravity * (1 - D.sinkG) * sub * dt; d.vy *= Math.exp(-D.vyDrag * sub * dt) }   // Auftrieb hebt den größten Teil der Schwerkraft auf, Wasser dämpft
  }
  // Schwimmstoß: Sprungtaste unter Wasser (auch sinkend) → kräftig nach oben; K2B-Sprung am Grund wird ebenso verstärkt
  const edge = !!inp.jump && !W.kickHeld; W.kickHeld = !!inp.jump; W.kickT = sub > 0 ? Math.max(0, W.kickT - dt) : 0
  if (edge && sub > 0.5 && !W.planing) { d.vy = Math.max(d.vy, o.jumpImpulse * D.kickVy); d.air = true; W.kickT = D.kickS; W.stats.kicks++; d.events.push({ type: 'water', kind: 'kick', x: d.x, y: d.y, z: d.z }) }
  W.mode = lv == null ? 'dry' : W.planing ? 'skim' : s <= 0 ? 'dry' : sub < 0.85 ? 'wade' : 'under'   // gleitend liegt die Unterseite über dem Spiegel
  if (prev !== W.mode) { const e = (kind, extra) => d.events.push({ type: 'water', kind, x: d.x, y: lv ?? d.y, z: d.z, speed: v, vy: d.vy, ...extra })
    if (prev === 'dry') { W.stats.enters++; e('enter', { strength: Math.min(1, (Math.abs(d.vy) / (8 * K) + v / (30 * K)) * 0.7) }) }
    if (W.mode === 'dry') { W.stats.exits++; e('exit', { strength: Math.min(1, v / (25 * K) + Math.max(0, d.vy) / (8 * K)) }) }
    if (W.mode === 'under') { W.stats.dives++; e('dive') }
    if (prev === 'under' && W.mode !== 'under') { W.stats.surfaces++; e('surface') }
    if (W.mode === 'skim') { W.stats.skims++; e('skim') } }
  // Kamera: über Wasser etwas höher, unter Wasser näher (weich über camT)
  const k = 1 - Math.exp(-dt / D.camT), uw = W.mode === 'under' ? 1 : 0, ow = W.mode === 'skim' || W.mode === 'wade' ? 1 : 0
  W.cam.under += (uw - W.cam.under) * k; W.cam.lift += (ow * D.camLift + uw * D.camUnderLift - W.cam.lift) * k; W.cam.dist += (1 + (D.camUnderDist - 1) * uw - W.cam.dist) * k
  return W
}

// Kamera nie in der Wasserhaut: Wagen unter Wasser → Kamera unter dem Spiegel, sonst darüber (Abstand camGap); trocken unverändert
export function waterCamClamp(W, level, x, z, y, ground = null) {
  const lv = level ? level(x, z) : null; if (lv == null) return y
  if (W.mode !== 'under') return Math.max(y, lv + WATER_DRIVE.camGap)
  const g = ground ? ground(x, z) + 0.4 : -Infinity   // nie unter den Boden: ist es an der Kamera zu flach, bleibt sie über dem Boden (Ufer)
  return Math.max(g, Math.min(y, lv - WATER_DRIVE.camGap))   // Seite folgt dem Wagen sofort; weich macht es das Overlay (ein/aus 9/s bzw. 5/s)
}
