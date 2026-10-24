// WS-NPC · Flächen, die Sprechblasen meiden (Lead-Auftrag chat=syl 24.10.: „nicht über Figuren und nicht über dem HUD“). Nur mit #chat=syl.
// HUD: belegte Rechtecke je Slot aus der HUD-Hülle (hudShell rects(), Knet- und 3D-HUD), vom Wirt über setHudRects() gemeldet; ohne Knet-HUD
// die sichtbaren Teile des Holz-HUD (#kfb-hud-r5f) aus dem DOM. Figuren: je Anker im Bild die Fläche zwischen Kopf (Anker) und Fuß (anchorBaseAt).
// Der Blasen-Layer (bubbleLayer update(…, avoid)) behandelt diese Flächen wie schon gesetzte Blasen.
import { Vector3 } from 'three'
import { anchorAt, anchorBaseAt, anchorIds } from './bubbleAnchors'

export const CHAT_SYL = typeof location !== 'undefined' && /(^|[#,])chat=syl(,|$)/.test(location.hash)
// Breite einer Figur im Bild als Anteil ihrer Höhe – PLATZHALTER (Schätzwert für Kit-Figuren mit großem Kopf), bis gemessen
export const FIGURE_ASPECT = 0.6
let hudSrc = null
export const setHudRects = (fn) => { hudSrc = typeof fn === 'function' ? fn : null }

function hudRects() {
  try { const R = hudSrc?.(); if (R) return Object.values(R).filter((r) => r && r.w > 0 && r.h > 0).map((r) => ({ x: r.x, y: r.y, w: r.w, h: r.h, kind: 'hud' })) } catch (e) { /* Rückfall DOM */ }
  const root = typeof document !== 'undefined' && document.getElementById('kfb-hud-r5f'), W = innerWidth, H = innerHeight, out = []
  if (!root) return out
  // Holz-HUD: Vollbild-Behälter; belegt sind seine sichtbaren Teile (kleiner als ein Fünftel des Bildes)
  for (const el of root.querySelectorAll('*')) {
    if (el.children.length > 0 && el.parentElement !== root) continue
    const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || r.width * r.height > 0.2 * W * H) continue
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue
    out.push({ x: r.left, y: r.top, w: r.width, h: r.height, kind: 'hud' })
  }
  return out
}

const TOP = new Vector3(), BASE = new Vector3()
function figureRects(camera) {
  const W = innerWidth, H = innerHeight, out = []
  for (const id of anchorIds()) {
    if (!anchorAt(id, TOP) || !anchorBaseAt(id, BASE)) continue
    const a = TOP.project(camera), b = BASE.project(camera)
    if (a.z > 1 || a.z < -1 || b.z > 1 || b.z < -1) continue
    const x = (a.x * 0.5 + 0.5) * W, y0 = (-a.y * 0.5 + 0.5) * H, y1 = (-b.y * 0.5 + 0.5) * H, h = Math.abs(y1 - y0)
    if (h < 2 || x < -W || x > 2 * W) continue
    const w = h * FIGURE_ASPECT
    out.push({ x: x - w / 2, y: Math.min(y0, y1), w, h, kind: 'figure', id })
  }
  return out
}
// Reihenfolge = Vorrang: der Blasen-Layer weicht in einem Durchgang nacheinander aus, das letzte Rechteck gewinnt – HUD zuletzt (nie überdecken)
export const avoidRects = (camera) => [...figureRects(camera), ...hudRects()]
