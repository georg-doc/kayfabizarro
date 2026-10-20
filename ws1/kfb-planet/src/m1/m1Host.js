// M1 · Host-Hilfen ohne React (Szene M1World): Trimesh aus einem geladenen Modell, Weltlage eines Moduls, Dialog-Zeiger, Tastenliste.
// Liegt getrennt von M1World.jsx, damit die React-Hülle keine Modul-Interna berührt.
import * as THREE from 'three'
import { K } from './m1Scale.js'

// Trimesh in Weltkoordinaten aus allen Meshes eines Objekts (nach dem Laden; Theater ist statisch)
export function trimeshOf(root) {
  root.updateWorldMatrix(true, true)
  const verts = [], idx = []; let base = 0
  const p = new THREE.Vector3()
  root.traverse((o) => {
    if (!o.isMesh || !o.geometry?.attributes?.position) return
    const g = o.geometry, pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) { p.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld); verts.push(p.x, p.y, p.z) }
    if (g.index) for (let i = 0; i < g.index.count; i++) idx.push(base + g.index.getX(i)); else for (let i = 0; i < pos.count; i++) idx.push(base + i)
    base += pos.count
  })
  return { vertices: new Float32Array(verts), indices: new Uint32Array(idx) }
}
export const amphModelOf = (amph) => amph?.object3d?.getObjectByName('amphitheater-model') || null
export const worldPosOf = (m, out = new THREE.Vector3()) => (m?.object3d ? m.object3d.getWorldPosition(out) : null)

// Dialog-Modul so einpacken, dass der Host nach dem Abbau nicht mehr auf den entsorgten Dialog schaut (Prüfer M1, Befund 8)
export function trackDialog(d, holder) {
  const own = d.dispose
  d.dispose = () => { if (holder.dialog === d) holder.dialog = null; own() }
  holder.dialog = d
  return d
}

// Tastenliste (Briefing: „eine Datei mit der Tastenliste“; V-020 Strg = gehen, V-257 Dialog-Kamera). Georg 16.10.: nicht dauerhaft über dem Bild,
// sondern ein dezentes Info-Symbol unten links; die Liste erscheint erst beim Klick (oder H) und schließt beim zweiten Klick. Kein HUD – das liefert
// Georg nach (fraktaler Almanach). Host-DOM außerhalb des Canvas.
export function keyList() {
  if (typeof document === 'undefined') return { remove() {}, toggle() {}, shown: () => false }
  const box = document.createElement('div'); box.id = 'm1-keys-box'; box.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:5'   // rechts unten: links unten sitzt die Rucksack-Taste des HUD (Georg 20.10.)
  const btn = document.createElement('button'); btn.id = 'm1-keys-info'; btn.type = 'button'; btn.textContent = 'i'; btn.title = 'Tasten'; btn.setAttribute('aria-label', 'Tasten anzeigen')
  btn.style.cssText = "width:30px;height:30px;border-radius:50%;border:0;background:rgba(255,250,240,.55);color:#1f1a14;font:italic 700 16px/30px Georgia,serif;cursor:pointer;opacity:.75;box-shadow:0 1px 4px rgba(42,26,12,.25)"
  const el = document.createElement('div'); el.id = 'm1-keys'
  el.style.cssText = "display:none;position:absolute;right:0;bottom:38px;padding:10px 12px;border-radius:12px;background:rgba(255,250,240,.92);color:#1f1a14;font:14px/1.45 'Shantell Sans',system-ui,sans-serif;box-shadow:0 3px 8px rgba(42,26,12,.25);width:320px"
  el.innerHTML = '<b>FrizzleBob · Bewegung</b><br>W vorwärts · S rückwärts · A / D drehen · Q / E seitwärts<br>Shift · sprinten &nbsp;·&nbsp; G · gehen ein/aus<br>Leertaste · springen (Stand · aus dem Lauf · mit Shift Weitsprung)<br>2× Leertaste schnell · abheben<br>&nbsp;&nbsp;im Flug: W vorwärts · A / D drehen · Q / E seitwärts · Leertaste steigen · X sinken · Shift schnell<br>&nbsp;&nbsp;G im Flug · Schwungflug ein/aus: W / S Nase runter / hoch · A / D kurven · Leertaste steigen (dann A / D · Fassrolle) · Shift Schub · Perlen links = Ladungen · Ringe gelb/blau · K Komfort<br>Maus: links ziehen · Kamera &nbsp;·&nbsp; rechts ziehen · Figur lenken (A / D dann seitwärts) &nbsp;·&nbsp; beide · vorwärts &nbsp;·&nbsp; Rad · Abstand<br>R · zurück zum Start &nbsp;·&nbsp; H · diese Liste<br>Bühne: vorn über die Rampe hinein · Dialog (1–4 wählen, Esc beendet)<br>&nbsp;&nbsp;im Dialog: ziehen · drehen, Rad · Zoom zum Zeiger, rechte Taste · verschieben, Doppelklick · Fokus, Knöpfe Standard / Nah'
  const toggle = () => { const on = el.style.display === 'none'; el.style.display = on ? '' : 'none'; btn.style.opacity = on ? '1' : '.75' }
  btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); btn.blur() })
  box.append(el, btn); document.body.appendChild(box)
  return { remove: () => box.remove(), toggle, shown: () => el.style.display !== 'none' }
}

// Ränge = Kulisse ohne Begehen (V-283, WS0 15.10.: „die Kollision soll das Betreten verhindern“; Fuß-IK/Stufen erst MVP-1). Bis das vereinfachte
// Kollisionsnetz von WS0 kommt: ein geschlossener, unsichtbarer Zaun um die Ränge, so hoch wie die Flugobergrenze – man kommt weder zu Fuß noch im
// Flug hinauf; Bühne und Gelände bleiben frei. Grundriss = ein geschlossenes Vieleck (Winkel von −Z über ±X, Bühnenmitte im Ursprung):
//   innen  RANK_PROFILE: je 2,5° von −150° bis +150° der Radius der ersten Stufe (≥ 0,2 m) minus 0,05 m, gemessen aus der Höhenkarte des Modells
//          (scripts/m1/rank-fence.mjs --emit; Prüfer M1-4 Befund 1: kein Bühnenboden hinter der Wand). Hinten ≈ 7,2 m, seitlich ≈ 8 m, Flügel ≈ 9 m.
//   Stirn  von (±150°, innen) schräg nach (±155°, außen): deckt die Flügelspitzen bis 152,6° (Befund 2b). Der Ring vor der Bühne (0,79 m, r 9,5–10,5,
//          |Winkel| > 150°) bleibt frei – ob er als Rang zählt, entscheidet WS0.
//   außen  RANK_PROFILE_OUT: je 2,5° von −155° bis +155° die äußerste Theatergeometrie über dem Gelände plus 0,05 m (Maximum über ±2,5°), gemessen wie
//          innen (Prüfer M1-5, Befund N4: der frühere Bogen r 19 sperrte an den Flügeln ≈ 100 m² freies Gras).
// Kollider siehe rankFence (Tortenstücke). Nur für die Physik: Strahlen (Bodenangleich, Landung, Kamera) und ecctrl schauen
// vorbei (isFence, userData.ecctrl.excludeRay).
// V-345: Radien, Höhen und Rampe unten sind alte WS1-Bühnenmeter (gemessen am Modell ohne worldK) und werden hier × K (m1Scale) in J17-Meter gerechnet
export const RANK_FENCE = Object.freeze({ a0Deg: 150, capDeg: 155, profileStep: 1.25, top: 420 * K, bottom: -2 * K })
// prettier-ignore
export const RANK_PROFILE = Object.freeze([9.43,9.39,9.35,9.29,9.29,9.29,9.29,9.27,9.19,9.17,9.15,9.09,9.09,9.03,8.97,8.91,8.91,8.91,8.91,8.81,8.79,8.77,8.77,8.79,8.73,8.69,8.67,8.63,8.63,8.57,8.49,8.45,8.45,8.41,8.35,8.35,8.35,8.31,8.27,8.23,8.21,8.19,8.15,8.15,8.13,8.11,8.11,8.11,8.01,8.01,8.01,8.01,8.03,7.97,7.89,7.89,7.91,7.87,7.83,7.83,7.81,7.77,7.77,7.75,7.73,7.73,7.65,7.59,7.55,7.55,7.55,7.55,7.55,7.49,7.47,7.45,7.41,7.41,7.39,7.35,7.35,7.33,7.33,7.33,7.33,7.25,7.25,7.21,7.21,7.21,7.19,7.15,7.15,7.13,7.13,7.11,7.11,7.11,7.11,7.11,7.11,7.05,7.03,7.03,7.01,7.01,7.01,7.01,7.01,6.97,6.97,6.97,6.99,6.97,6.95,6.95,6.95,7.01,7.01,7.01,7.01,7.01,7.01,7.01,6.95,6.95,6.95,6.97,6.95,6.95,6.91,6.91,6.91,6.93,6.93,6.93,6.95,6.95,6.99,6.97,6.97,6.95,6.95,6.97,6.97,6.99,6.97,6.97,6.99,7.01,7.03,6.99,6.99,6.97,6.97,6.97,7.05,7.03,6.97,6.97,6.99,6.99,7.03,7.03,7.07,7.07,7.09,7.09,7.11,7.11,7.13,7.19,7.19,7.19,7.19,7.21,7.23,7.23,7.27,7.27,7.27,7.29,7.27,7.27,7.31,7.31,7.37,7.37,7.43,7.41,7.41,7.41,7.51,7.51,7.51,7.51,7.53,7.53,7.65,7.61,7.61,7.63,7.65,7.69,7.73,7.77,7.81,7.81,7.83,7.89,7.95,7.95,7.99,8.07,8.15,8.17,8.23,8.23,8.29,8.31,8.39,8.45,8.49,8.53,8.57,8.65,8.69,8.75,8.75,8.79,8.87,8.89,8.97,8.99,8.99,9.03,9.07,9.11,9.11,9.11,9.15].map((r) => +(r * K).toFixed(4)))
// prettier-ignore
export const RANK_PROFILE_OUT = Object.freeze([10.71,10.69,10.69,10.69,10.67,10.65,14.77,15.23,15.47,15.57,15.57,15.57,15.67,15.87,15.95,15.95,15.95,15.95,15.95,15.87,15.81,15.57,15.57,15.57,15.53,15.49,15.53,15.61,15.73,16.03,16.07,16.07,16.01,15.89,15.93,15.97,16.01,16.51,16.87,17.07,17.29,17.29,17.37,17.47,17.53,17.53,17.81,17.97,18.05,18.05,18.03,17.81,17.79,17.79,17.59,17.45,17.59,17.61,17.61,17.45,17.53,17.55,17.55,17.59,17.61,17.69,17.69,17.67,17.67,17.73,17.91,18.19,18.27,18.27,18.25,18.13,18.01,17.93,17.81,17.81,17.77,17.75,17.87,17.93,18.01,18.01,18.01,18.01,17.97,17.93,17.67,17.77,17.79,18.03,18.21,18.23,18.27,18.31,18.31,18.31,18.11,18.13,18.17,18.19,18.19,18.17,18.15,18.31,18.33,18.33,18.25,18.21,18.29,18.29,18.21,18.07,18.03,18.05,18.19,18.29,18.29,18.25,18.13,18.01,17.69,17.81,17.83,17.85,17.87,17.95,18.21,18.47,18.53,18.53,18.45,18.39,18.37,18.31,18.25,18.29,18.29,18.07,18.23,18.27,18.39,18.43,18.43,18.41,18.43,18.43,18.37,18.55,18.83,18.89,18.89,18.69,18.69,18.63,18.31,18.21,18.25,18.29,18.29,18.29,18.25,18.63,18.83,18.95,18.95,18.91,18.79,18.79,18.69,18.61,18.61,18.59,18.49,18.45,18.33,18.09,18.17,18.17,18.33,18.33,18.33,18.31,18.39,18.39,18.35,18.27,18.11,18.05,17.89,17.71,17.71,17.79,17.89,17.91,17.91,17.81,17.79,17.81,17.81,17.75,17.63,17.57,17.43,17.09,16.95,16.95,16.95,16.91,16.89,16.79,16.81,16.81,16.83,17.01,17.19,17.19,17.19,16.93,16.83,16.75,16.51,16.49,16.47,16.55,16.61,16.61,16.59,16.39,16.59,16.59,16.59,16.61,16.61,16.71,16.83,16.83,16.83,16.83,16.81,16.69,16.27,16.15,15.83,15.21,10.49].map((r) => +(r * K).toFixed(4)))
const D2R = Math.PI / 180
// Innen- bzw. Außenradius des Zauns bei Winkel a (rad), lineare Zwischenwerte; außerhalb ±150° bzw. ±155° nicht definiert (null)
const lerpProfile = (P, lim, step, a) => { const d = a / D2R; if (Math.abs(d) > lim + 1e-9) return null; const u = (d + lim) / step, i = Math.min(P.length - 2, Math.floor(u)), k = u - i; return P[i] + (P[i + 1] - P[i]) * k }
export const rankInnerR = (a, F = RANK_FENCE, P = RANK_PROFILE) => lerpProfile(P, F.a0Deg, F.profileStep, a)
export const rankOuterR = (a, F = RANK_FENCE, Q = RANK_PROFILE_OUT) => lerpProfile(Q, F.capDeg, F.profileStep, a)
// Rampe zur Bühne (V-331 Punkt 3): unsichtbarer Kollider über den vorderen Ring auf der START-Achse (x = 0), 3 m breit. Ring vermessen (Höhenkarte,
// 16.10.): z 9,5–10,6, oben 0,79 m; draußen Gelände −0,125, drinnen Bühnenboden 0. Profil (z, y): außen hinauf 14,2 → 10,6 (≈ 14°), oben flach 1 cm
// über dem Ring bis 9,4, innen hinab bis 6,8 (≈ 17°, außerhalb des Dialog-Auslösers r < 6,2). Ein konvexes Prisma (Unterseite unter Boden und Gelände).
export const STAGE_RAMP = Object.freeze({ halfW: 1.5 * K, profile: [[14.2, -0.125], [10.6, 0.8], [9.4, 0.8], [6.8, 0], [6.8, -0.4], [14.2, -0.4]].map(([z, y]) => [z * K, y * K]) })
export const rampVerts = (R = STAGE_RAMP) => new Float32Array(R.profile.flatMap(([z, y]) => [-R.halfW, y, z, R.halfW, y, z]))
// Abstand eines Punkts (x, z) zur Zaunfläche (Grundriss-Kante), positiv außerhalb des gesperrten Bereichs, negativ darin (Tests)
export function rankFenceClear(x, z, O = OUTLINE) {
  const P = O.pts; let d = Infinity
  for (let i = 0; i < P.length; i++) { const [x0, z0] = P[i], [x1, z1] = P[(i + 1) % P.length], vx = x1 - x0, vz = z1 - z0, t = Math.max(0, Math.min(1, ((x - x0) * vx + (z - z0) * vz) / (vx * vx + vz * vz))); d = Math.min(d, Math.hypot(x - x0 - vx * t, z - z0 - vz * t)) }
  return inRankFence(x, z, O) ? -d : d
}
const atR = (deg, r) => [Math.sin(deg * D2R) * r, -Math.cos(deg * D2R) * r]
// Grundriss als geschlossenes Vieleck [[x, z], …] mit Kantenart je Kante (in | cap | out)
export function rankFenceOutline(F = RANK_FENCE, P = RANK_PROFILE, Q = RANK_PROFILE_OUT) {
  const pts = [], kind = []
  P.forEach((r, i) => { pts.push(atR(-F.a0Deg + i * F.profileStep, r)); kind.push(i < P.length - 1 ? 'in' : 'cap') })
  for (let i = Q.length - 1; i >= 0; i--) { pts.push(atR(-F.capDeg + i * F.profileStep, Q[i])); kind.push(i > 0 ? 'out' : 'cap') }
  return { pts, kind }
}
const OUTLINE = rankFenceOutline()
// Kollider = der ganze gesperrte Bereich, in Tortenstücke zu je 2,5° zerlegt (Prüfer M1-5, Befund N4: mit dem zackigen Außenprofil ragten Kanten-Prismen
// mit Gehrung an spitzen Ecken in den freien Bereich). Je Stück zwei Dreiecke (innen_k, innen_k+1, außen_k+1) und (innen_k, außen_k+1, außen_k), an
// den Stirnseiten ein Fächer von innen(±150°) zu außen(±150…155°); jedes Dreieck als senkrechtes Prisma (konvex, Rapier-Hülle = das Prisma selbst).
// Die Vereinigung ist genau der Grundriss: Außenflächen liegen auf den Kanten, nichts ragt hinaus, und der Zaun ist so tief wie die Ränge (kein
// Durchtunneln). Rückgabe [{ tri: [[x,z]×3], verts: Float32Array (6 Ecken, für ConvexHullCollider) }]
export function rankFence(F = RANK_FENCE, P = RANK_PROFILE, Q = RANK_PROFILE_OUT) {
  const off = Math.round((F.capDeg - F.a0Deg) / F.profileStep) // Index des Außenprofils bei −150°
  const inn = (k) => atR(-F.a0Deg + k * F.profileStep, P[k]), out = (i) => atR(-F.capDeg + i * F.profileStep, Q[i])
  const tris = []
  for (let k = 0; k < P.length - 1; k++) { tris.push([inn(k), inn(k + 1), out(k + 1 + off)]); tris.push([inn(k), out(k + 1 + off), out(k + off)]) }
  const last = P.length - 1
  for (let i = last + off; i < Q.length - 1; i++) tris.push([inn(last), out(i), out(i + 1)]) // Stirn rechts (+)
  for (let i = off; i > 0; i--) tris.push([inn(0), out(i), out(i - 1)]) // Stirn links (−)
  return tris.map((tri) => { const verts = new Float32Array(18); tri.forEach(([x, z], k) => { verts.set([x, F.bottom, z], k * 3); verts.set([x, F.top, z], 9 + k * 3) }); return { tri, quad: tri, verts } })
}
// liegt (x, z) im umzäunten Bereich der Ränge? (Strahlwurf gegen den Grundriss)
export function inRankFence(x, z, O = OUTLINE) {
  const P = O.pts; let inside = false
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, zi] = P[i], [xj, zj] = P[j]; if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside }
  return inside
}
export const FENCE_TAG = 'm1-rank-fence'
export const isFence = (collider) => collider?.parent?.()?.userData?.tag === FENCE_TAG
