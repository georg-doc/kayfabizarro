// M1 · Takt der Szene: genau ein Logik-Durchlauf je Physik-Schritt (1/60 s), live wie im Replay (Prüfer M1-2, Befunde 3, 7, 9).
// Die Szene läuft mit Canvas frameloop="never"; M1Loop ruft R3F advance() einmal je fälligem Schritt mit künstlicher Zeit (+1/60 s). Damit sehen
// ecctrl (Impulse je Bild mit world.timestep), alle Module (dt) und Rapier (ein Schritt je Durchlauf, Physics pausiert, Stepper) dieselbe Zeit –
// unabhängig davon, ob der Bildschirm mit 30, 60 oder 120 Hz läuft.
//   live                  Schritte nach echter Zeit (Akkumulator, höchstens 8 je Bild, M3 Stufe A; versteckter Tab pausiert)
//   #m1,debug,replay      genau ein Schritt je Bild (Tests, bildzeitunabhängig)
//   #m1,debug,replay=120  ein Schritt je zweitem Bild (Bildschirm 120 Hz)
//   #m1,debug,replay=30   zwei Schritte je Bild (Bildschirm 30 Hz)
// Die Varianten müssen dieselben Ergebnisse liefern wie replay (Test m1-move @120/@30).
import { DEBUG } from '../debug'
const h = typeof location !== 'undefined' ? location.hash : ''
const m = /#m1\b.*\breplay(?:=(\d+))?/.exec(h)
const hz = m ? +(m[1] || 60) : 60
export const STEP = 1 / 60
// onStep: Prüf-Haken (nur Tests mit Debug-Schalter) – wird nach JEDEM Schritt gerufen, auch wenn ein Bildschirm-Bild mehrere Schritte macht;
// onDraw: Prüf-Haken im Zeichenmoment (interpolierter Stand, siehe interpDraw)
// nodraw (nur mit debug): Physik-Tests ohne Zeichnen – der Takt bleibt replay-fest, der Software-Renderer des Test-Browsers (≈ 8 Bilder/s) entfällt
// norender (nur mit debug): wie gezeichnet – Interpolation, Kamera, onDraw je Bild –, nur renderer.render entfällt (Jitter-Messung im echten Bildtakt
// ohne den langsamen Software-Renderer); fps=30 (nur mit debug): nur jedes zweite Bildschirm-Bild wird verarbeitet (gedrosselt)
export const M1CLOCK = { replay: !!(DEBUG && m), nodraw: !!(DEBUG && /(^|[#,])nodraw(,|$)/.test(h)), norender: !!(DEBUG && /(^|[#,])norender(,|$)/.test(h)), half: !!(DEBUG && /(^|[#,])fps=30(,|$)/.test(h)), hz, stepsPerFrame: hz === 30 ? 2 : 1, framesPerStep: hz === 120 ? 2 : 1, frame: 0, steps: 0, t: 0, draw: true, hidden: false, onStep: null, onDraw: null, stats: { stepMs: 0, drawMs: 0, steps: 0, draws: 0, multi: 0, dropped: 0 } }
export function resetClock() { Object.assign(M1CLOCK, { frame: 0, steps: 0, t: 0, draw: true, hidden: false, onStep: null, onDraw: null, stats: { stepMs: 0, drawMs: 0, steps: 0, draws: 0, multi: 0, dropped: 0 } }) }

// Bild-Interpolation (Georg 16.10.: „ruckelt sehr stark beim Fliegen“; Sonde probe-judder: auf 120-Hz-Bildschirmen stand die Figur in jedem zweiten Bild
// still – im Flug 23 cm je Doppelbild). Die Physik bleibt bei festen 1/60-s-Schritten; gezeichnet wird je Bildschirm-Bild der Zwischenstand
// zwischen den letzten zwei Schritten (α = Rest des Akkumulators / Schritt). Verfolgt werden nur die von der Physik bewegten Wurzeln (Figur-Halter,
// später Fahrzeug) und die Kamera. Nach dem Zeichnen wird der echte Stand zurückgesetzt – Logik und Tests sehen nie einen Zwischenwert.
// Sprünge über 4 m (Teleport, Zurücksetzen) werden nicht gemischt.
const _pv = new Map(), _cv = new Map()
// frameCam: Kamera-Besitzer im Bildtakt (C1, V-408) – fn(dt) läuft je Bild NACH der Interpolation, vor dem Zeichnen; solange gesetzt, wird die Kamera
// nicht zwischen Physik-Schritten interpoliert (sie wird je Bild aus dem interpolierten Ziel neu gerechnet)
export const M1INTERP = { objs: new Set(), camera: null, on: true, frameCam: null }
const snap = (o) => ({ p: o.position.clone(), q: o.quaternion.clone(), fov: o.isPerspectiveCamera ? o.fov : 0 })
export function interpTrack(o) { M1INTERP.objs.add(o); return () => { M1INTERP.objs.delete(o); _pv.delete(o); _cv.delete(o) } }
// nach jedem Physik-Schritt: vorigen Stand merken, aktuellen aufnehmen
export function interpAfterStep() {
  const all = [...M1INTERP.objs]; if (M1INTERP.camera && !M1INTERP.frameCam) all.push(M1INTERP.camera)
  for (const o of all) { const c = snap(o), prev = _cv.get(o); _pv.set(o, prev && prev.p.distanceTo(c.p) < 4 ? prev : c); _cv.set(o, c) }
}
// zeichnen mit α ∈ [0, 1]: draw() rendert; danach echter Stand zurück
export function interpDraw(alpha, draw) {
  if (!M1INTERP.on) { M1INTERP.frameCam?.(); draw(); return }
  const all = [...M1INTERP.objs]; if (M1INTERP.camera && !M1INTERP.frameCam) all.push(M1INTERP.camera)
  const used = []
  for (const o of all) { const a = _pv.get(o), b = _cv.get(o); if (!a || !b) continue
    used.push([o, snap(o)]); o.position.lerpVectors(a.p, b.p, alpha); o.quaternion.slerpQuaternions(a.q, b.q, alpha)
    if (o.isPerspectiveCamera && a.fov !== b.fov) { o.fov = a.fov + (b.fov - a.fov) * alpha; o.updateProjectionMatrix() } }
  M1INTERP.frameCam?.() // Kamera nach der Interpolation (gleicher Transform wie gezeichnet)
  draw()
  for (const [o, s] of used) { o.position.copy(s.p); o.quaternion.copy(s.q); if (o.isPerspectiveCamera && o.fov !== s.fov) { o.fov = s.fov; o.updateProjectionMatrix() } }
}
