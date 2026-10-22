// V-631 · Front-Scheinwerfer der Racer im Spiel: ESM-Hülle um kfb-headlights.v1.js (Modul aus der Gelände-Probe, 1:1, UMD → globalThis.KFBHeadlights).
// Drei Schichten ohne echte Lichter (V-385): Glas-Glühen + Blendstern am Wagen, Lichtkegel in der Szene, Lichtfleck über kfb-groundfx (Kanal 'headlights').
// Anpassungen nur hier, nicht im Modul:
//   Farbraum r186: der Kegel-Shader legte die Farbe roh ab (r147: Hex-Werte als sRGB-Zahlen). Unter r186 ist THREE.Color linear – ohne Umrechnung
//   wäre der Kegel dunkler und satter als in der Probe. Die Hülle gibt die Farbe über linearToOutputTexel als sRGB aus (gleiches Bild wie die Probe).
//   Maße: Modul-Werte sind Probe-Meter (Rig × 0,616); im Spiel × (Rig-Maß des Spiels / 0,616).
//   Tageslicht: aus der Tageszeit des Licht-Rigs (headlightDaylight); HEADLIGHTS.dark (0..1, z. B. Tunnel der Biom-Fahrt V-619) dunkelt zusätzlich ab.
import * as THREE from 'three'
import './kfb-headlights.v1.js'

// Scheinwerfer-Stufen (Georg 22.10.): hlt=0 = ALT (Probe-Werte), hlt=v2 = Ansatz an der Lampe + getrennte Flecken, Standard v3 = geometrisch gekoppelt.
//   v2: sichtbarer Kegel mit Glasbreite an der Lampe; Bodenfleck elliptisch (senkrecht poolV, waagrecht poolH, um poolH nach außen gedreht: Innenkante
//       parallel, die Flecken überlagern sich nie), Spitze zurückversetzt (poolStart). Georg: „besser“, aber seitlich nicht glaubwürdig auf den Boden gerichtet.
//   v3: Kegelachse aus dem Lampen-Anker nach unten geneigt; je Bild 3 Geländeproben (unter der Lampe, nah, fern) bestimmen Neigung und senkrechten Winkel so,
//       dass die untere Kegelkante knapp vor der Lampe (near) den Boden trifft; das Ende bei far macht die Reichweite (weich, rund) – der Fleck ist der echte Schnitt mit dem Gelände
//       (Schwebehöhe und Hang eingerechnet). Waagrecht wie v2 (Kegelstumpf mit Startbreite, Innenkante parallel). Der sichtbare Kegel folgt derselben
//       Achse und endet am Bodentreffpunkt. Steht die Lampe weit über dem Boden (Sprung, Flug), blendet der Fleck weich aus.
//   HEADLIGHTS.rebuild() baut die Scheinwerfer des aktuellen Wagens mit HEADLIGHT_TUNE.mode neu (Prüfbilder).
const HLT = (/(^|[#,])hlt=(0|v2|v3)(,|$)/.exec(typeof location !== 'undefined' ? location.hash : '') || [])[2]
export const HEADLIGHT_TUNE = { mode: HLT === '0' ? 'alt' : HLT === 'v2' ? 'v2' : 'v3', poolV: 0.5, poolH: 0.15, poolStart: 0.35, beamStartK: 1.1, near: 0.7, far: 16, fadeFrom: 3, fadeTo: 7, beamFade: 0.82, soft3: 0.35 }
export const HEADLIGHTS = { on: !/(^|[#,])hl=0(,|$)/.test(typeof location !== 'undefined' ? location.hash : ''), dark: 0, daylight: null, inst: null, ms: 0, n: 0 }
const PROBE_UNIT = 0.616381042

export function createHeadlights({ car, anchors, color, core, scene, pools, ground, unit = PROBE_UNIT }) {
  const T = HEADLIGHT_TUNE, M = T.mode, f = unit / PROBE_UNIT, O = { beamLen: 22 * f, poolDist: 7 * f, beamDist: 15 * f, poolRange: 19 * f }, BEAM = 0.2 /* Modul-Standard beamAngle */
  let spacing = 1, hl = null, last = []
  const inner = pools, Y = new THREE.Vector3(0, 1, 0)
  if (M === 'v2') pools = { setPools: (list) => inner.setPools(list.map((p, i) => { const sd = hl?.sides[i], side = sd ? (sd.pos.x >= 0 ? 1 : -1) : 0   // Modell +X = links; Drehung + um die Hochachse = nach links
    const dir = p.dir.clone().applyAxisAngle(Y, side * T.poolH), back = (T.poolStart * spacing * 0.5) / Math.tan(T.poolH), origin = p.origin.clone().addScaledVector(dir, -back)
    return { ...p, origin, dir, angleH: T.poolH, angleV: T.poolV, range: p.range + back } })) }
  if (M === 'v3') pools = { setPools: (list) => { last = list } }   // v3 baut die Flecken selbst nach dem Modul-Schritt (Farbe/Stärke vom Modul)
  hl = globalThis.KFBHeadlights.createHeadlights({ THREE, car, scene, anchors, color, core, lightPools: pools, ground, options: O })
  const m = hl.materials.beam
  m.fragmentShader = m.fragmentShader.replace('gl_FragColor = vec4(uCol * a, a);', 'gl_FragColor = vec4(linearToOutputTexel(vec4(uCol, 1.0)).rgb * a, a);'); m.needsUpdate = true
  if (hl.sides.length > 1) spacing = Math.abs(hl.sides[0].pos.x - hl.sides[1].pos.x) * unit
  const up = hl.update, ax = new THREE.Vector3(), q = new THREE.Quaternion(), hz = new THREE.Vector3(), rx = new THREE.Vector3(), rz = new THREE.Vector3(), mtx = new THREE.Matrix4()
  if (M === 'v2') hl.update = (dt, st) => { up(dt, st); if (!hl.on) return
    // sichtbarer Kegel: Spitze um d = Glasradius / tan(Kegelwinkel) hinter die Lampe – an der Lampe so breit wie das Glas
    for (const sd of hl.sides) { const b = sd.beam, d = (sd.r * unit * T.beamStartK) / Math.tan(BEAM); ax.set(0, 1, 0).applyQuaternion(b.quaternion)
      b.position.addScaledVector(ax, -d); const len = b.scale.y + d, r = Math.tan(BEAM) * len; b.scale.set(r, len, r) } }
  if (M === 'v3') hl.update = (dt, st) => { up(dt, st); if (!hl.on) return
    const near = T.near * f, far = T.far * f, aH = T.poolH, r0 = T.poolStart * spacing * 0.5, out = []
    car.getWorldQuaternion(q); hz.set(0, 0, 1).applyQuaternion(q).setY(0); if (hz.lengthSq() < 1e-6) hz.set(0, 0, 1); hz.normalize()
    hl.sides.forEach((sd, i) => { const P = sd.wp, side = sd.pos.x >= 0 ? 1 : -1, src = last[i] || last[0]
      const g0 = ground ? ground(P.x, P.z) : P.y - 1, gn = ground ? ground(P.x + hz.x * near, P.z + hz.z * near) : g0, gf = ground ? ground(P.x + hz.x * far, P.z + hz.z * far) : g0
      const en = Math.atan2(P.y - gn, near), pitch = Math.max(0.02, Math.atan2(P.y - gf, far)), aV = Math.max(0.03, en - pitch)   // Achse zielt aufs Fleckende, Unterkante trifft bei near; nach oben keine Winkelgrenze (lowerOnly), das Ende macht die Reichweite
      const h = P.y - g0, fade = 1 - Math.min(1, Math.max(0, (h - T.fadeFrom * f) / ((T.fadeTo - T.fadeFrom) * f)))
      ax.copy(hz).multiplyScalar(Math.cos(pitch)).setY(-Math.sin(pitch))   // Achse: nach unten geneigt; der Fleck zusätzlich um aH nach außen (Innenkante parallel), der sichtbare Kegel geradeaus
      if (src) out.push({ form: 'cone', flat: true, origin: P.clone(), dir: ax.clone().applyAxisAngle(Y, side * aH), angleH: aH, angleV: aV, lowerOnly: true, startH: r0, soft: T.soft3, color: src.color, intensity: (src.intensity ?? 1) * fade, range: Math.hypot(far, P.y - gf) * 1.1 })
      // sichtbarer Kegel auf derselben Achse, endet am Bodentreffpunkt der Achse (Höhe dort aus einer weiteren Probe); Glasbreite an der Lampe (Spitze zurück)
      const dh = Math.min(far, Math.max(near, (P.y - g0) / Math.max(0.05, Math.tan(pitch)))), gm = ground ? ground(P.x + hz.x * dh, P.z + hz.z * dh) : g0
      const len = Math.max(0.3 * f, (P.y - gm) / Math.max(0.05, Math.sin(pitch))), rH = r0 * 0.5 + Math.tan(0.12) * len, rV = Math.max(0.05, Math.tan(Math.min(aV, BEAM)) * len)   // sichtbarer Kegel höchstens alte Weite (0,2 rad), sonst überdeckt er bei hohen Lampen den Fleck
      const d = (sd.r * unit * T.beamStartK) * len / rV, L = len + d, b = sd.beam
      rx.crossVectors(ax, Y).normalize(); rz.crossVectors(rx, ax); mtx.makeBasis(rx, ax, rz); b.quaternion.setFromRotationMatrix(mtx)
      b.position.copy(P).addScaledVector(ax, -d); b.scale.set(rH * L / len, L, rV * L / len) })
    hl.materials.beam.uniforms.uFade.value = T.beamFade
    HEADLIGHTS.lastPools = out; inner.setPools(out) }   // lastPools: Prüfhilfe
  return hl
}

// 0 = Nacht … 1 = Mittag, aus timeOfDay (0 Nacht, 0,5 Gold, 1 Tag) und Sonnenhöhe; wie die Probe: Gold 0,35, Tag 0,55 + (Höhe − 4°) / 30 (Georgs 12° → 0,82)
export function headlightDaylight(tod = 1, elevDeg = 49) {
  const e = (u) => u * u * (3 - 2 * u), t = Math.min(1, Math.max(0, tod)), day = Math.min(1, 0.55 + Math.max(0, elevDeg - 4) / 30)
  const d = t <= 0.5 ? 0.35 * e(t / 0.5) : 0.35 + (day - 0.35) * e((t - 0.5) / 0.5)
  return Math.min(d, 1 - Math.min(1, Math.max(0, HEADLIGHTS.dark)))
}
