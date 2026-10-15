// M1 · Takt der Szene: genau ein Logik-Durchlauf je Physik-Schritt (1/60 s), live wie im Replay (Prüfer M1-2, Befunde 3, 7, 9).
// Die Szene läuft mit Canvas frameloop="never"; M1Loop ruft R3F advance() einmal je fälligem Schritt mit künstlicher Zeit (+1/60 s). Damit sehen
// ecctrl (Impulse je Bild mit world.timestep), alle Module (dt) und Rapier (ein Schritt je Durchlauf, Physics pausiert, Stepper) dieselbe Zeit –
// unabhängig davon, ob der Bildschirm mit 30, 60 oder 120 Hz läuft.
//   live                  Schritte nach echter Zeit (Akkumulator, höchstens 4 je Bild)
//   #m1,debug,replay      genau ein Schritt je Bild (Tests, bildzeitunabhängig)
//   #m1,debug,replay=120  ein Schritt je zweitem Bild (Bildschirm 120 Hz)
//   #m1,debug,replay=30   zwei Schritte je Bild (Bildschirm 30 Hz)
// Die Varianten müssen dieselben Ergebnisse liefern wie replay (Test m1-move @120/@30).
import { DEBUG } from '../debug'
const h = typeof location !== 'undefined' ? location.hash : ''
const m = /#m1\b.*\breplay(?:=(\d+))?/.exec(h)
const hz = m ? +(m[1] || 60) : 60
export const STEP = 1 / 60
// onStep: Prüf-Haken (nur Tests mit Debug-Schalter) – wird nach JEDEM Schritt gerufen, auch wenn ein Bildschirm-Bild mehrere Schritte macht
export const M1CLOCK = { replay: !!(DEBUG && m), hz, stepsPerFrame: hz === 30 ? 2 : 1, framesPerStep: hz === 120 ? 2 : 1, frame: 0, steps: 0, t: 0, draw: true, onStep: null, stats: { stepMs: 0, drawMs: 0, steps: 0, draws: 0, multi: 0 } }
export function resetClock() { Object.assign(M1CLOCK, { frame: 0, steps: 0, t: 0, draw: true, onStep: null, stats: { stepMs: 0, drawMs: 0, steps: 0, draws: 0, multi: 0 } }) }
