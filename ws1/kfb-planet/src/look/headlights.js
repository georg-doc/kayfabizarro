// V-631 · Front-Scheinwerfer der Racer im Spiel: ESM-Hülle um kfb-headlights.v1.js (Modul aus der Gelände-Probe, 1:1, UMD → globalThis.KFBHeadlights).
// Drei Schichten ohne echte Lichter (V-385): Glas-Glühen + Blendstern am Wagen, Lichtkegel in der Szene, Lichtfleck über kfb-groundfx (Kanal 'headlights').
// Anpassungen nur hier, nicht im Modul:
//   Farbraum r186: der Kegel-Shader legte die Farbe roh ab (r147: Hex-Werte als sRGB-Zahlen). Unter r186 ist THREE.Color linear – ohne Umrechnung
//   wäre der Kegel dunkler und satter als in der Probe. Die Hülle gibt die Farbe über linearToOutputTexel als sRGB aus (gleiches Bild wie die Probe).
//   Maße: Modul-Werte sind Probe-Meter (Rig × 0,616); im Spiel × (Rig-Maß des Spiels / 0,616).
//   Tageslicht: aus der Tageszeit des Licht-Rigs (headlightDaylight); HEADLIGHTS.dark (0..1, z. B. Tunnel der Biom-Fahrt V-619) dunkelt zusätzlich ab.
import * as THREE from 'three'
import './kfb-headlights.v1.js'

export const HEADLIGHTS = { on: !/(^|[#,])hl=0(,|$)/.test(typeof location !== 'undefined' ? location.hash : ''), dark: 0, daylight: null, inst: null, ms: 0, n: 0 }
const PROBE_UNIT = 0.616381042

export function createHeadlights({ car, anchors, color, core, scene, pools, ground, unit = PROBE_UNIT }) {
  const f = unit / PROBE_UNIT, O = { beamLen: 22 * f, poolDist: 7 * f, beamDist: 15 * f, poolRange: 19 * f }
  const hl = globalThis.KFBHeadlights.createHeadlights({ THREE, car, scene, anchors, color, core, lightPools: pools, ground, options: O })
  const m = hl.materials.beam
  m.fragmentShader = m.fragmentShader.replace('gl_FragColor = vec4(uCol * a, a);', 'gl_FragColor = vec4(linearToOutputTexel(vec4(uCol, 1.0)).rgb * a, a);'); m.needsUpdate = true
  return hl
}

// 0 = Nacht … 1 = Mittag, aus timeOfDay (0 Nacht, 0,5 Gold, 1 Tag) und Sonnenhöhe; wie die Probe: Gold 0,35, Tag 0,55 + (Höhe − 4°) / 30 (Georgs 12° → 0,82)
export function headlightDaylight(tod = 1, elevDeg = 49) {
  const e = (u) => u * u * (3 - 2 * u), t = Math.min(1, Math.max(0, tod)), day = Math.min(1, 0.55 + Math.max(0, elevDeg - 4) / 30)
  const d = t <= 0.5 ? 0.35 * e(t / 0.5) : 0.35 + (day - 0.35) * e((t - 0.5) / 0.5)
  return Math.min(d, 1 - Math.min(1, Math.max(0, HEADLIGHTS.dark)))
}
