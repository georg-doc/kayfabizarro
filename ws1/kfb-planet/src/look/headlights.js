// V-631 · Front-Scheinwerfer der Racer im Spiel: ESM-Hülle um kfb-headlights.v1.js (Modul aus der Gelände-Probe, 1:1, UMD → globalThis.KFBHeadlights).
// Drei Schichten ohne echte Lichter (V-385): Glas-Glühen + Blendstern am Wagen, Lichtkegel in der Szene, Lichtfleck über kfb-groundfx (Kanal 'headlights').
// Anpassungen nur hier, nicht im Modul:
//   Farbraum r186: der Kegel-Shader legte die Farbe roh ab (r147: Hex-Werte als sRGB-Zahlen). Unter r186 ist THREE.Color linear – ohne Umrechnung
//   wäre der Kegel dunkler und satter als in der Probe. Die Hülle gibt die Farbe über linearToOutputTexel als sRGB aus (gleiches Bild wie die Probe).
//   Maße: Modul-Werte sind Probe-Meter (Rig × 0,616); im Spiel × (Rig-Maß des Spiels / 0,616).
//   Tageslicht: aus der Tageszeit des Licht-Rigs (headlightDaylight); HEADLIGHTS.dark (0..1, z. B. Tunnel der Biom-Fahrt V-619) dunkelt zusätzlich ab.
import * as THREE from 'three'
import './kfb-headlights.v1.js'

// Tune v2 (Georg 22.10., nach der verworfenen Spindelform v1): Form und Werte wie ALT (Fleck 0,36 rad, sichtbarer Kegel 0,2 rad, Weichheit, Tagesstärke), nur:
//   Ansatz an der Lampe: der sichtbare Kegel beginnt mit Glasbreite an der Lampe (gedachte Spitze hinter dem Glas, im Wagen verdeckt) – keine dünne Spitze, keine Lücke;
//   der Bodenfleck ist elliptisch: senkrecht weiter (poolV), damit er knapp vor der Lampe am Boden beginnt; waagrecht poolH und um genau poolH nach außen
//   gedreht – die Innenkante läuft parallel geradeaus (die Flecken überlagern sich nie, kein Verschmelzen), der Fleck öffnet sich nur nach außen; die
//   Spitze liegt so weit hinter der Lampe, dass der Fleck am Wagen schon poolStart × Lampenabstand breit ist (kein dünner Beginn).
//   Ein Kegel aus einem Punkt kann nicht nah breit und fern schmal sein – deshalb Innenkante parallel statt schmaler Gesamtkegel (v1 und v2a verworfen).
//   hlt=0 = ALT (A/B); HEADLIGHTS.rebuild() baut die Scheinwerfer des aktuellen Wagens neu (Prüfbilder).
export const HEADLIGHT_TUNE = { on: !/(^|[#,])hlt=0(,|$)/.test(typeof location !== 'undefined' ? location.hash : ''), poolV: 0.5, poolH: 0.15, poolStart: 0.35, beamStartK: 1.1 }
export const HEADLIGHTS = { on: !/(^|[#,])hl=0(,|$)/.test(typeof location !== 'undefined' ? location.hash : ''), dark: 0, daylight: null, inst: null, ms: 0, n: 0 }
const PROBE_UNIT = 0.616381042

export function createHeadlights({ car, anchors, color, core, scene, pools, ground, unit = PROBE_UNIT }) {
  const T = HEADLIGHT_TUNE, f = unit / PROBE_UNIT, O = { beamLen: 22 * f, poolDist: 7 * f, beamDist: 15 * f, poolRange: 19 * f }, BEAM = 0.2 /* Modul-Standard beamAngle */
  let spacing = 1
  if (T.on) {
    // Bodenfleck elliptisch: waagrecht halbe Breite am Zielpunkt = widthK × Lampenabstand, senkrecht poolV (beginnt knapp vor der Lampe)
    const inner = pools, Y = new THREE.Vector3(0, 1, 0)
    pools = { setPools: (list) => inner.setPools(list.map((p, i) => { const sd = hl?.sides[i], side = sd ? (sd.pos.x >= 0 ? 1 : -1) : 0   // Modell +X = links; Drehung + um die Hochachse = nach links, für jede Fahrtrichtung
      const dir = p.dir.clone().applyAxisAngle(Y, side * T.poolH), back = (T.poolStart * spacing * 0.5) / Math.tan(T.poolH), origin = p.origin.clone().addScaledVector(dir, -back)
      return { ...p, origin, dir, angleH: T.poolH, angleV: T.poolV, range: p.range + back } })) }
  }
  let hl = null
  hl = globalThis.KFBHeadlights.createHeadlights({ THREE, car, scene, anchors, color, core, lightPools: pools, ground, options: O })
  const m = hl.materials.beam
  m.fragmentShader = m.fragmentShader.replace('gl_FragColor = vec4(uCol * a, a);', 'gl_FragColor = vec4(linearToOutputTexel(vec4(uCol, 1.0)).rgb * a, a);'); m.needsUpdate = true
  if (hl.sides.length > 1) spacing = Math.abs(hl.sides[0].pos.x - hl.sides[1].pos.x) * unit
  if (T.on) {
    // sichtbarer Kegel: Spitze um d = Glasradius / tan(Kegelwinkel) hinter die Lampe – an der Lampe so breit wie das Glas, Länge um d verlängert
    const up = hl.update, ax = new THREE.Vector3()
    hl.update = (dt, st) => { up(dt, st); if (!hl.on) return
      for (const sd of hl.sides) { const b = sd.beam, d = (sd.r * unit * T.beamStartK) / Math.tan(BEAM); ax.set(0, 1, 0).applyQuaternion(b.quaternion)
        b.position.addScaledVector(ax, -d); const len = b.scale.y + d, r = Math.tan(BEAM) * len; b.scale.set(r, len, r) } }
  }
  return hl
}

// 0 = Nacht … 1 = Mittag, aus timeOfDay (0 Nacht, 0,5 Gold, 1 Tag) und Sonnenhöhe; wie die Probe: Gold 0,35, Tag 0,55 + (Höhe − 4°) / 30 (Georgs 12° → 0,82)
export function headlightDaylight(tod = 1, elevDeg = 49) {
  const e = (u) => u * u * (3 - 2 * u), t = Math.min(1, Math.max(0, tod)), day = Math.min(1, 0.55 + Math.max(0, elevDeg - 4) / 30)
  const d = t <= 0.5 ? 0.35 * e(t / 0.5) : 0.35 + (day - 0.35) * e((t - 0.5) / 0.5)
  return Math.min(d, 1 - Math.min(1, Math.max(0, HEADLIGHTS.dark)))
}
