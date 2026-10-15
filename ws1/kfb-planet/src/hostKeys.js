// Host-Vertrag R1.2 §4 · eine Tastatur-Map, ein keydown-Listener am window.
// Bewegung liest ecctrl über drei-KeyboardControls (MOVE_MAP, Falle 3). Alle übrigen Tasten
// laufen durch genau diesen Router. Module hängen nie eigene Listener an window.
import { useEffect, useRef } from 'react'
import { DEBUG } from './debug'

export const MOVE_MAP = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['Shift'] },
  // Gehen (V-020: Strg+W = Gehen). Achtung: Strg+W schließt unter Windows/Linux den Tab (nicht abfangbar) – für MVP-3 eine andere Taste wählen (WS1_STATUS §31.3)
  { name: 'walk', keys: ['ControlLeft', 'ControlRight'] },
]

// Aktionstasten, an einer Stelle festgelegt (e.code bzw. Ziffern 1–9 für Auswahlen).
export const ACTION_KEYS = {
  talk: 'KeyE', close: 'Escape', fly: 'KeyF', reset: 'KeyR',
  buildDelete: ['Delete', 'Backspace'], buildDeselect: 'Escape',
  gizmo: { Digit1: 'translate', Digit2: 'rotate', Digit3: 'scale' },
}

// Rangfolge: wer zuerst gefragt wird. Wer die Taste nutzt, ruft e.preventDefault(); dann ist Schluss.
export const PRIO = { playerChoice: 35, choice: 30, dialog: 20, editor: 15, player: 10 } // playerChoice = S5c, choice = Spike-Dialog-Auswahlen

const handlers = []
let installed = false
function route(e) {
  for (const h of handlers.slice()) {
    h.fn.current(e)
    if (e.defaultPrevented) return
  }
}
export function addHostKeyHandler(fnRef, prio = 0) {
  if (!installed && typeof window !== 'undefined') { window.addEventListener('keydown', route); installed = true }
  const h = { fn: fnRef, prio }
  handlers.push(h); handlers.sort((a, b) => b.prio - a.prio)
  return () => { const i = handlers.indexOf(h); if (i >= 0) handlers.splice(i, 1) }
}
// React-Hülle: der Handler darf sich bei jedem Render ändern, angemeldet wird nur einmal.
export function useHostKeys(fn, prio = 0) {
  const ref = useRef(fn)
  ref.current = fn
  useEffect(() => addHostKeyHandler(ref, prio), [prio])
}
export const hostKeyStats = () => ({ installed, handlers: handlers.length, prios: handlers.map((h) => h.prio) })
if (DEBUG) window.__kfbHostKeys = hostKeyStats
