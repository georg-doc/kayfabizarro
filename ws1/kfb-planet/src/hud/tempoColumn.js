// HUD 3D Tempo-Säule (R2 Georg 25.10.: Säule, keine Strichlein; R3 Georg 25.10.: klassische Cartoon-Tacho-Logik). Eine Knet-Röhre aus einem Guss,
// drei Zonen als ruhige, aufgedruckte Farbbänder mit weichem Übergang: grün (gemütlich) → gelb/orange (schnell) → rot (am Limit, Ende der Skala);
// leer blass, gefüllt satt. Füllung innen mit eigenem Rand. Boost ist keine Zone, sondern ein Effekt über dem Roten: „Überkochen“ – die Füllung
// schießt blubbernd über die Kappe (Georg 25.10.: Variante A gewählt). Stall im Flug: die leere Säule blinkt kühl.
// Zonen und Tempo kommen vom Fahrzeug (telemetry.zones: [Zone, Obergrenze m/s]); das HUD rechnet nur Anteile. Keine React-/Store-Imports.
import * as THREE from 'three'

export const ZONE_COLOR = { norm: '#4fb648', fast: '#f2b230', red: '#d9453a' }
// Röhre: Radius R, Zylinderlänge FULL; Füllung Ri vorn in der Röhre, Rand RIM dahinter; HEAD = Kopfraum über der Kappe für den Boost-Effekt
export const COLUMN = { R: 0.2, FULL: 1.4, Ri: 0.142, RIM: 0.02, SOFT: 0.06, MUTE: 0.42, HEAD: 0.26 }
const CREAM = new THREE.Color('#efe5d2'), INK = new THREE.Color('#2a2230')

export function createTempoColumn(clay) {
  const { R, FULL, Ri, RIM, SOFT, MUTE, HEAD } = COLUMN
  const g = new THREE.Group()
  const matTube = clay('#ffffff', { vertexColors: true, emissive: '#ffffff', emissiveIntensity: 0 }), matFill = clay('#ffffff', { vertexColors: true, emissive: '#ff6a2a', emissiveIntensity: 0 })
  const matRim = clay('#' + INK.getHexString())
  const tube = new THREE.Mesh(new THREE.BufferGeometry(), matTube), fill = new THREE.Mesh(new THREE.BufferGeometry(), matFill), rim = new THREE.Mesh(new THREE.BufferGeometry(), matRim)
  const zF = R - Ri * 0.5 // Füllung wölbt sich vorn aus der Röhre (sichtbar innen), Rand um seine Breite dahinter
  fill.position.z = zF; rim.position.z = zF - RIM - 0.012; g.add(tube, rim, fill)
  let Z = [], key = '', built = -1, over = 0
  const tOf = (y) => Math.max(0, Math.min(1, (y + FULL / 2) / FULL))
  const _c = new THREE.Color(), _n = new THREE.Color()
  function colorAt(t, full) { // Zonenfarbe mit weichem Übergang (smoothstep über ±SOFT) an jeder Grenze
    _c.set(ZONE_COLOR[Z[0].z] || '#ccc')
    for (let i = 1; i < Z.length; i++) { const b = Z[i].t0, u = Math.max(0, Math.min(1, (t - (b - SOFT)) / (2 * SOFT))); if (u > 0) _c.lerp(_n.set(ZONE_COLOR[Z[i].z] || '#ccc'), u * u * (3 - 2 * u)) }
    return full ? _c : _c.lerp(CREAM, MUTE)
  }
  function paint(geo, y0, full) { const pos = geo.getAttribute('position'), col = new Float32Array(pos.count * 3)
    for (let i = 0; i < pos.count; i++) colorAt(tOf(pos.getY(i) + y0), full).toArray(col, i * 3)
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); return geo }
  function setZones(zones) {
    const k2 = zones?.map((z) => z[0] + (+z[1]).toFixed(2)).join('|'); if (!k2 || k2 === key) return false; key = k2
    const max = zones[zones.length - 1][1]; let t0 = 0; Z = zones.map(([z, hi]) => { const r = { z, t0, t1: hi / max }; t0 = r.t1; return r })
    tube.geometry.dispose(); tube.geometry = paint(new THREE.CapsuleGeometry(R, FULL, 12, 40, 64), 0, false); built = -1
    return true
  }
  function buildFill(f) { // Füllung von unten bis f (über 1 = schießt im Boost über die Kappe hinaus), eigene runde Enden
    const on = f >= 0.01; fill.visible = rim.visible = on; if (!on) return
    const L0 = FULL * f, y0 = -FULL / 2 + L0 / 2, Lr = Math.min(L0, FULL)
    fill.geometry.dispose(); fill.geometry = paint(new THREE.CapsuleGeometry(Ri, L0, 10, 32, Math.max(2, Math.round(48 * f))), y0, true); fill.position.y = y0
    rim.geometry.dispose(); rim.geometry = new THREE.CapsuleGeometry(Ri + RIM, Lr, 10, 32, 1); rim.position.y = -FULL / 2 + Lr / 2
  }
  function setFrac(f) { f = Math.max(0, Math.min(1, f)) + over; if (Math.abs(f - built) < 0.004 || !Z.length) return false; built = f; buildFill(f); return true }
  // Boost-Effekt je Bild: on = Boost aktiv, rm = reduzierte Bewegung. Ein- 0,18 s, aus 0,3 s. Gibt true zurück, wenn neu gezeichnet werden muss.
  let fx = 0, tAll = 0
  function stepBoost(dt, on, rm) {
    tAll += dt; const was = fx; fx = Math.max(0, Math.min(1, fx + (on ? dt / 0.18 : -dt / 0.3)))
    if (fx === 0 && was === 0) return false
    // Überkochen: ~15 % über die Kappe (bleibt im Kopfraum), blubbert mit 6 Hz um ±4 %
    over = rm ? 0.15 * fx : fx * (0.15 + 0.04 * Math.sin(tAll * 2 * Math.PI * 6)); matFill.emissiveIntensity = 0.18 * fx; built = -1; return true
  }
  let stallOn = false
  function setStall(on, t, rm) { // eigenes Signal: leere Säule blinkt kühl (2,5 Hz), keine Farbzone
    if (!on && !stallOn) return false; stallOn = on
    matTube.emissive.set('#9fb8d8'); matTube.emissiveIntensity = on ? (rm ? 0.25 : 0.32 * (0.5 + 0.5 * Math.sin(t * 2 * Math.PI * 2.5))) : 0; return true
  }
  const zoneAt = (f) => (Z.find((s) => f <= s.t1 + 1e-6) || Z[Z.length - 1] || {}).z || null
  const box = () => new THREE.Box3(new THREE.Vector3(-R, -FULL / 2 - R, -R), new THREE.Vector3(R, FULL / 2 + R + HEAD, R)) // feste Hülle samt Kopfraum für den Boost
  function dispose() { for (const m of [tube, fill, rim]) m.geometry.dispose(); for (const m of [matTube, matFill, matRim]) m.dispose() }
  return { group: g, setZones, setFrac, stepBoost, setStall, zoneAt, box, zones: () => Z, fx: () => fx, over: () => over, dispose }
}

// Flughöhe über Grund (Georg 25.10.): schmale Knet-Säule links neben der Tempo-Säule, gleiche Gesamthöhe (eine Flucht). Unten die Grund-Platte,
// Himmelblau von unten bis zur Marke, die Marke als grüner Knet-Ball. Skala wurzelförmig bis ALT.max m (tiefe Höhen – Landen, Tiefflug – fein aufgelöst).
export const ALT = { R: 0.1, FULL: 1.6, max: 120 }
export function createAltBand(clay) {
  const { R, FULL } = ALT, g = new THREE.Group()
  const matTube = clay('#efe5d2'), matSky = clay('#8cc4ea'), matMark = clay('#58be4e', { emissive: '#58be4e', emissiveIntensity: 0.15 }), matGround = clay('#7a5a3a')
  const tube = new THREE.Mesh(new THREE.CapsuleGeometry(R, FULL, 10, 28, 1), matTube)
  const ground = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.05, R * 1.05, 0.05, 28), matGround); ground.position.set(0, -FULL / 2 - R * 0.55, 0.004)
  const sky = new THREE.Mesh(new THREE.BufferGeometry(), matSky), mark = new THREE.Mesh(new THREE.SphereGeometry(R * 1.12, 22, 14), matMark)
  sky.position.z = R * 0.35; mark.position.z = R * 0.3; g.add(tube, ground, sky, mark)
  let built = -1
  const fracOf = (m) => Math.max(0, Math.min(1, Math.sqrt(Math.max(0, m) / ALT.max)))
  function setFrac(f) { f = Math.max(0, Math.min(1, f)); if (Math.abs(f - built) < 0.003) return false; built = f
    const y = -FULL / 2 + FULL * f, L0 = Math.max(0.001, FULL * f)
    sky.geometry.dispose(); sky.geometry = new THREE.CapsuleGeometry(R * 0.72, L0, 8, 20, 1); sky.position.y = -FULL / 2 + L0 / 2; sky.visible = f > 0.01
    mark.position.y = y; return true }
  const box = () => new THREE.Box3(new THREE.Vector3(-R * 1.12, -FULL / 2 - R, -R), new THREE.Vector3(R * 1.12, FULL / 2 + R, R))
  function dispose() { for (const m of [tube, ground, sky, mark]) m.geometry.dispose(); for (const m of [matTube, matSky, matMark, matGround]) m.dispose() }
  return { group: g, setFrac, fracOf, box, dispose }
}
