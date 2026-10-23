// V-631 · Front-Scheinwerfer der Racer im Spiel: ESM-Hülle um kfb-headlights.v1.js (Modul aus der Gelände-Probe, 1:1, UMD → globalThis.KFBHeadlights).
// Drei Schichten ohne echte Lichter (V-385): Glas-Glühen + Blendstern am Wagen, Lichtkegel in der Szene, Lichtfleck über kfb-groundfx (Kanal 'headlights').
// Anpassungen nur hier, nicht im Modul:
//   Farbraum r186: der Kegel-Shader legte die Farbe roh ab (r147: Hex-Werte als sRGB-Zahlen). Unter r186 ist THREE.Color linear – ohne Umrechnung
//   wäre der Kegel dunkler und satter als in der Probe. Die Hülle gibt die Farbe über linearToOutputTexel als sRGB aus (gleiches Bild wie die Probe).
//   Maße: Modul-Werte sind Probe-Meter (Rig × 0,616); im Spiel × (Rig-Maß des Spiels / 0,616).
//   Tageslicht: aus der Tageszeit des Licht-Rigs (headlightDaylight); HEADLIGHTS.dark (0..1, z. B. Tunnel der Biom-Fahrt V-619) dunkelt zusätzlich ab.
import * as THREE from 'three'
import './kfb-headlights.v1.js'
import { createHeadBeams, beamFrame } from './kfb-headbeam.v1.js'

// Scheinwerfer-Stufen (Georg 22.10.): hlt=0 = ALT (Probe-Werte), Standard v2 = Ansatz an der Lampe + getrennte Flecken, hlt=v3 = geometrisch gekoppelt (ohne sichtbaren Kegel, abgelehnt).
//   v2: sichtbarer Kegel mit Glasbreite an der Lampe; Bodenfleck elliptisch (senkrecht poolV, waagrecht poolH, um poolH nach außen gedreht: Innenkante
//       parallel, die Flecken überlagern sich nie), Spitze zurückversetzt (poolStart). Georg: „besser“, aber seitlich nicht glaubwürdig auf den Boden gerichtet.
//   v3: Kegelachse aus dem Lampen-Anker nach unten geneigt; je Bild 3 Geländeproben (unter der Lampe, nah, fern) bestimmen Neigung und senkrechten Winkel so,
//       dass die untere Kegelkante knapp vor der Lampe (near) den Boden trifft; das Ende bei far macht die Reichweite (weich, rund) – der Fleck ist der echte Schnitt mit dem Gelände
//       (Schwebehöhe und Hang eingerechnet). Waagrecht wie v2 (Kegelstumpf mit Startbreite, Innenkante parallel). Der sichtbare Kegel folgt derselben
//       Achse und endet am Bodentreffpunkt. Steht die Lampe weit über dem Boden (Sprung, Flug), blendet der Fleck weich aus.
//   cone (Georg 22.10., nach Recherche HEADLIGHTS_RESEARCH_R1, hlt=cone, Standard erst nach Abnahme): je Lampe ein echter Kegelstumpf (kfb-headbeam.v1, 1 Mesh für
//       beide Lampen), an der Lampe glasbreit, Achse geradeaus und leicht nach unten, fest am Wagen (rollt und nickt mit). Kontaktfläche = Schnitt GENAU DIESES
//       Kegels mit dem Gelände (groundfx beam2, 1 Platz, dieselben Zahlen): beginnt, wo die Unterkante (unterer Glasrand) den Boden trifft, endet an der
//       Oberkante bzw. Reichweite. Neigung und Öffnung einmal je Wagen aus der Lampenhöhe im Stand (restH). Überlappung beider Kegel gewollt, weich gekappt.
//       Tageslicht (Recherche §3.5): Kegel 0,04 + 0,36·n^1,5, Boden 0,15 + 0,95·n^1,2 (n = 1 − Tag). Glas-Glühen und Blendstern bleiben aus dem Modul.
//   HEADLIGHTS.rebuild() baut die Scheinwerfer des aktuellen Wagens mit HEADLIGHT_TUNE.mode neu (Prüfbilder).
const HLT = (/(^|[#,])hlt=(0|v2|v3|cone)(,|$)/.exec(typeof location !== 'undefined' ? location.hash : '') || [])[2]
export const HEADLIGHT_TUNE = { mode: HLT === '0' ? 'alt' : HLT === 'v3' ? 'v3' : HLT === 'v2' ? 'v2' : 'cone', /* Georg 23.10.: Kegel (Variante A, r2) ist Standard; hlt=v2 = alter Stand zum Vergleich */ /* Georg 22.10.: v3 verlor den sichtbaren Kegel → Standard zurück auf v2, bis das recherchierte Konzept steht */ poolV: 0.5, poolH: 0.15, poolStart: 0.35, beamStartK: 1.1, near: 0.7, far: 16, fadeFrom: 3, fadeTo: 7, beamFade: 0.82, soft3: 0.35,
  cone: { topDeg: 2.0, lowDeg: 12, Lmax: 45, spreadDeg: 10, deformK: 0.3, glassK: 1.1, op0: 0.04, op1: 0.36, g0: 0.15, g1: 0.95 } }   // Lead 23.10. Variante A (Winkel): Hell-Dunkel-Grenze 2° (real 0,69°, ×3), Unterkante 12°, L = h/tan 2° ≤ 45 m Welt
export const HEADLIGHTS = { on: !/(^|[#,])hl=0(,|$)/.test(typeof location !== 'undefined' ? location.hash : ''), dark: 0, daylight: null, inst: null, ms: 0, n: 0 }
const PROBE_UNIT = 0.616381042

export function createHeadlights({ car, anchors, color, core, scene, pools, ground, unit = PROBE_UNIT, restH }) {
  const T = HEADLIGHT_TUNE, M = T.mode, f = unit / PROBE_UNIT, O = { beamLen: 22 * f, poolDist: 7 * f, beamDist: 15 * f, poolRange: 19 * f }, BEAM = 0.2 /* Modul-Standard beamAngle */
  let spacing = 1, hl = null, last = []
  const inner = pools, Y = new THREE.Vector3(0, 1, 0)
  if (M === 'v2') pools = { setPools: (list) => inner.setPools(list.map((p, i) => { const sd = hl?.sides[i], side = sd ? (sd.pos.x >= 0 ? 1 : -1) : 0   // Modell +X = links; Drehung + um die Hochachse = nach links
    const dir = p.dir.clone().applyAxisAngle(Y, side * T.poolH), back = (T.poolStart * spacing * 0.5) / Math.tan(T.poolH), origin = p.origin.clone().addScaledVector(dir, -back)
    return { ...p, origin, dir, angleH: T.poolH, angleV: T.poolV, range: p.range + back } })) }
  if (M === 'v3' || M === 'cone') pools = { setPools: (list) => { last = list } }   // v3 baut die Flecken selbst nach dem Modul-Schritt (Farbe/Stärke vom Modul)
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
  if (M === 'cone') coneMode(hl, { car, scene, ground, unit, restH, inner, getLast: () => last })
  return hl
}

// Modus cone: Kegel-Geometrie einmal je Wagen, Lage jedes Bild aus der Wagenlage (Szenen-Koordinaten); 12 Geländeproben je Bild für den Bodenübergang des Meshes
function coneMode(hl, { car, scene, ground, unit, restH, inner, getLast }) {
  const C = HEADLIGHT_TUNE.cone, sides = hl.sides, a = sides[0], b = sides[1] || sides[0], cl = (x, lo, hi) => Math.min(hi, Math.max(lo, x))
  const h = restH ?? ((a.pos.y + b.pos.y) / 2) * unit, r0 = Math.max(a.r, b.r) * unit * C.glassK
  // Lichtbild (Lead 23.10., Winkel statt Verhältnis; HEADLIGHTS_PHYSIK_R2): Oberkante = Hell-Dunkel-Grenze topDeg unter der Waagerechten (ab oberem Glasrand),
  // Unterkante lowDeg (ab unterem Glasrand). Auf ebenem Boden: Fleck beginnt bei ≈ h/tan 12°, Grenze bei L ≈ h/tan 2° (≤ Lmax Welt-Meter); bergab ab ≈ 3,5 % kein Fleck.
  const D2R = Math.PI / 180, al = (C.lowDeg + C.topDeg) / 2 * D2R, vv = (C.lowDeg - C.topDeg) / 2 * D2R
  const hits = (al, v) => { const c = Math.cos(al), sn = Math.sin(al), tv = Math.tan(v)
    const tl = (h - r0 * c) / (sn + tv * c), tu = (h + r0 * c) / Math.max(1e-4, sn - tv * c)
    return [tl * c - (r0 + tl * tv) * sn, tu * c + (r0 + tu * tv) * sn, tu] }   // waagrechter Abstand Unter-/Oberkante bis Bodenhöhe (U zeigt nach oben UND vorn), Achsenlänge bis zur Oberkante
  const tv = Math.tan(vv), th = Math.tan(C.spreadDeg * D2R), [dl, du, tUp] = hits(al, vv), len = Math.min(tUp * 1.03, C.Lmax / Math.cos(al)), L = Math.min(du, C.Lmax)   // Kegel endet knapp hinter dem Treffpunkt der Grenze, höchstens Lmax
  const B = createHeadBeams({ THREE }); scene.add(B.mesh)
  let chassis = car; while (chassis && chassis.name !== 'vehicle-rig') chassis = chassis.parent; chassis = chassis?.parent || null   // Physik-Körper über dem Antriebs-Rig (Deformer sitzt darunter)
  const qs = new THREE.Quaternion(), qc = new THREE.Quaternion(), qb = new THREE.Quaternion(), qv = new THREE.Quaternion(), ax = new THREE.Vector3(), Rc = new THREE.Vector3(), R = new THREE.Vector3(), Uv = new THREE.Vector3()
  const pa = new THREE.Vector3(), pb = new THREE.Vector3(), org = new THREE.Vector3(), hz = new THREE.Vector3(), P = new THREE.Vector3(), col = new THREE.Color(), core = new THREE.Color()
  const NP = B.NP, gr = [new Array(NP).fill(0), new Array(NP).fill(0)], item = { form: 'beam2', origin: org, dir: ax, half: 0, r0, tanH: th, tanV: tv, len, roll: 0, color: col, intensity: 1 }
  const geo = { h, r0, L, startFlat: dl, endFlat: du, alpha: al, tanV: tv, tanH: th, len, chassis: !!chassis }
  const up = hl.update, setOn = hl.setOn, dispose = hl.dispose
  let n = 0
  hl.update = (dt, st = {}) => { up(dt, st); for (const sd of sides) sd.beam.visible = false
    B.mesh.visible = hl.on; n = 1 - Math.min(1, Math.max(0, st.daylight ?? 1)) }
  // Lage erst beim Zeichnen (Szene.onBeforeRender, nach allen useFrame und der Matrix-Aktualisierung): sonst hinkt der Kegel dem Wagen ein Bild hinterher
  const pose = () => { if (!hl.on) return; const src = getLast()[0]
    car.updateWorldMatrix(true, false); for (const sd of sides) { sd.wp.copy(sd.pos); car.localToWorld(sd.wp) }
    // Richtung (Lead 23.10.): Wagenlage der Physik + deformK des Cartoon-Nickens/-Rollens; Ursprung bleibt an den sichtbaren Lampen
    scene.getWorldQuaternion(qs).invert(); car.getWorldQuaternion(qv); if (chassis) { chassis.getWorldQuaternion(qb); qc.slerpQuaternions(qb, qv, C.deformK) } else qc.copy(qv); qs.multiply(qc)
    ax.set(0, -Math.sin(al), Math.cos(al)).applyQuaternion(qs); Rc.set(-1, 0, 0).applyQuaternion(qs)   // Modell +X = links → R = rechts (wie cross(Achse, oben))
    const { R: R0, U: U0 } = beamFrame(THREE, ax, 0, R, Uv), roll = Math.atan2(Rc.dot(U0), Rc.dot(R0))
    scene.worldToLocal(pa.copy(a.wp)); scene.worldToLocal(pb.copy(b.wp)); org.addVectors(pa, pb).multiplyScalar(0.5)
    const half = pa.distanceTo(pb) / 2; beamFrame(THREE, ax, roll, R, Uv)
    hz.set(ax.x, 0, ax.z).normalize()
    for (let s = 0; s < 2; s++) { P.copy(org).addScaledVector(R, s ? -half : half)
      for (let i = 0; i < NP; i++) { const d = (i / (NP - 1)) * len; gr[s][i] = ground ? ground(P.x + hz.x * d, P.z + hz.z * d) : -1e3 } }
    if (src?.color) col.copy(src.color); core.copy(col).lerp(WHITE, 0.6)
    B.set({ origin: org, axis: ax, roll, half, r0, tanH: th, tanV: tv, len, ground: gr, profLen: len, color: col, core, opacity: C.op0 + C.op1 * Math.pow(n, 1.5) })
    item.half = half; item.roll = roll; item.intensity = (C.g0 + C.g1 * Math.pow(n, 1.2)) * (HEADLIGHTS.groundK ?? 1)   // groundK: Prüfhilfe (Fleck allein an/aus)
    HEADLIGHTS.lastPools = [item]; HEADLIGHTS.lastBeam = { ...geo, origin: org.clone(), axis: ax.clone(), roll, half, R: R.clone(), U: Uv.clone() }
    // Bodeneintrag nur bei Änderung neu schreiben (der Mischer baut dann die Zellenkarte neu); steht der Wagen, kostet die Kontaktfläche nichts auf der CPU
    const sig = [org.x, org.y, org.z, ax.x, ax.y, ax.z, roll, half, item.intensity, col.r, col.g, col.b]
    if (!flushed || sig.some((v, i) => Math.abs(v - flushed[i]) > 1e-4) || inner.list !== listRef) { inner.setPools(listRef); flushed = sig } }
  const listRef = [item]; let flushed = null
  const pre = scene.userData.kfbPreRender ||= new Set()
  if (!scene.userData.kfbPreHook) { const prev = scene.onBeforeRender; scene.onBeforeRender = function (...a) { prev.apply(this, a); for (const f of pre) f() }; scene.userData.kfbPreHook = true }
  pre.add(pose)
  hl.setOn = (on) => { setOn(on); B.mesh.visible = !!on; if (!on) { inner.setPools([]); flushed = null } }
  hl.dispose = () => { pre.delete(pose); dispose(); scene.remove(B.mesh); B.dispose() }
  hl.headbeam = B; hl.coneGeo = geo
}
const WHITE = new THREE.Color(1, 1, 1)

// 0 = Nacht … 1 = Mittag, aus timeOfDay (0 Nacht, 0,5 Gold, 1 Tag) und Sonnenhöhe; wie die Probe: Gold 0,35, Tag 0,55 + (Höhe − 4°) / 30 (Georgs 12° → 0,82)
export function headlightDaylight(tod = 1, elevDeg = 49) {
  const e = (u) => u * u * (3 - 2 * u), t = Math.min(1, Math.max(0, tod)), day = Math.min(1, 0.55 + Math.max(0, elevDeg - 4) / 30)
  const d = t <= 0.5 ? 0.35 * e(t / 0.5) : 0.35 + (day - 0.35) * e((t - 0.5) / 0.5)
  return Math.min(d, 1 - Math.min(1, Math.max(0, HEADLIGHTS.dark)))
}
