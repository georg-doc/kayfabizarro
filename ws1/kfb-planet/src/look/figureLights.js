// Figurenlicht R1 (Georg 23.10., docs/FIGURENLICHT_KONZEPT_R1.md): je Figur ein weiches, warmes, schattenloses Licht für den Spieler und die drei
// nächsten Figuren, immer an, Stärke und Farbe aus der laufenden Stimmung des einen Rigs (figI, figColor; folgt TOD bzw. Biom-Fahrt). Das Licht sitzt
// schräg vorn-oben auf der Kameraseite (kein Saum, V-392) und hellt den Boden um die Füße als Lichtkreis auf (sichtbare Begründung und Erdung, keine Scheibe).
// Immer genau FIG_LIGHT.count Lichter in der Szene (ungenutzte auf 0): three.js übersetzt die Materialien nicht neu, wenn eine Figur wechselt.
import * as THREE from 'three'

export const FIGLIGHT_ON = typeof location !== 'undefined' && /(^|[#,])figlight=1(,|$)/.test(location.hash) // A/B für Georg; Standard erst nach seiner Wahl
// Weg 1 (Georg 23.10.): Vorderlicht nur für Gesicht und Körper – 1,2 h zur Kamera, 1,3 h hoch, 35° zur sonnen- bzw. mondabgewandten Seite (hellt die
// Schattenseite auf, Figur behält ihre Form; nie von hinten), kurze Reichweite 2,0 h. Den Lichtkreis zeichnet der Boden selbst (patchFigurePool), genau um die Füße.
export const FIG_LIGHT = Object.freeze({ count: 4, radiusM: 14, hysteresisM: 1.5, fadeS: 0.4, upH: 1.3, frontH: 1.2, faceH: 0.8, reachH: 2.0, sideDeg: 35, scanS: 0.5, color: '#ffd9b0',
  poolR: 1.1, poolGain: 0.4 }) // Lichtkreis (Weg 1, Georg 23.10.): Radius 1,1 h um die Füße, Stärke 0,4 · figI · (0,25 + 0,75 · glow) – tags kaum, nachts deutlich
export const FIG_LIGHT_TEST = { off: false } // Prüfhilfe: A/B im selben Moment (Stärke 0, Lichterzahl bleibt)

const NPC = /^npc:/, UP = new THREE.Vector3(0, 1, 0)

// Lichtkreis im Boden: ein Uniform-Satz für alle Boden-Materialien (Mitte xyz + Radius, Stärke je Figur, warme Farbe), runder weicher Abfall
const PU = { uFigPool: { value: Array.from({ length: FIG_LIGHT.count }, () => new THREE.Vector4(0, -1e4, 0, 1)) }, uFigPoolK: { value: new Array(FIG_LIGHT.count).fill(0) }, uFigPoolCol: { value: new THREE.Color(FIG_LIGHT.color) } }
const GROUND_ROOT = /terrain/i
export function patchFigurePool(m) {
  if (!m || m.userData?.figPool || m.isShaderMaterial || !('roughness' in m || 'shininess' in m)) return false
  m.userData.figPool = true
  const prev = m.onBeforeCompile, prevKey = m.customProgramCacheKey, N = FIG_LIGHT.count
  m.onBeforeCompile = (sh, r) => { prev?.call(m, sh, r); Object.assign(sh.uniforms, PU)
    sh.vertexShader = 'varying vec3 vFigW;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
  vFigW = (modelMatrix * vec4(transformed, 1.0)).xyz;`)
    sh.fragmentShader = `varying vec3 vFigW;\nuniform vec4 uFigPool[${N}];\nuniform float uFigPoolK[${N}];\nuniform vec3 uFigPoolCol;\n` + sh.fragmentShader.replace('#include <opaque_fragment>', `{ float fp = 0.0;
    for (int i = 0; i < ${N}; i++) { vec2 d = vFigW.xz - uFigPool[i].xz; float r = uFigPool[i].w; float dy = abs(vFigW.y - uFigPool[i].y);
      fp += uFigPoolK[i] * (1.0 - smoothstep(0.3 * r, r, length(d))) * (1.0 - smoothstep(0.6 * r, 1.2 * r, dy)); }
    outgoingLight += diffuseColor.rgb * uFigPoolCol * min(fp, 1.2); }
  #include <opaque_fragment>`) }
  m.customProgramCacheKey = () => (prevKey ? prevKey.call(m) : '') + '|figPool'; m.needsUpdate = true; return true
}
export function scanFigurePool(scene) { let n = 0
  for (const root of scene.children) { if (!GROUND_ROOT.test(root.name || '')) continue; root.traverse((o) => { if (o.isMesh) for (const m of [].concat(o.material)) if (patchFigurePool(m)) n++ }) }
  return n }
function shown(o) { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true }

// scene, player() / partner() → Objekt der Figur (Wurzel an den Füßen), mood() → { figI, figColor }, K = Weltmaßstab (Meter)
export function createFigureLights({ scene, player, partner = () => null, mood, K = 1 }) {
  const C = FIG_LIGHT, root = new THREE.Group(); root.name = 'figure-lights'
  const slots = Array.from({ length: C.count }, (_, i) => { const l = new THREE.PointLight(C.color, 0, 0, 2); l.name = 'figure-light#' + i; l.castShadow = false; root.add(l); return { l, obj: null, w: 0, want: false } })
  const H = new WeakMap(), box = new THREE.Box3(), feet = new THREE.Vector3(), cam = new THREE.Vector3(), dir = new THREE.Vector3(), face = new THREE.Vector3(), tmp = new THREE.Vector3(), alt = new THREE.Vector3()
  let npcs = [], scanT = 0, groundT = 0
  const stats = { candidates: 0, lit: [], figI: 0 }
  const heightOf = (o) => { let h = H.get(o); if (!h) { box.setFromObject(o); h = box.isEmpty() ? 0 : box.max.y - box.min.y; if (h > 0.2 * K) H.set(o, h) } return h || 1.6 * K }
  function scan() { npcs = []; scene.traverse((o) => { if (NPC.test(o.name || '')) npcs.push(o) }) }

  // Auswahl: Spieler immer, dazu die drei nächsten sichtbaren Figuren im Umkreis; eine bereits beleuchtete bleibt, bis eine andere 1,5 m näher ist
  function choose(pl) {
    const pp = pl.getWorldPosition(tmp).clone(), others = []
    for (const o of [partner(), ...npcs]) { if (!o || o === pl || !shown(o)) continue; const d = o.getWorldPosition(feet).distanceTo(pp); if (d <= C.radiusM * K) others.push({ o, d }) }
    const held = new Set(slots.filter((s) => s.want && s.obj).map((s) => s.obj))
    others.forEach((x) => { if (held.has(x.o)) x.d -= C.hysteresisM * K })
    others.sort((a, b) => a.d - b.d); stats.candidates = others.length
    return [pl, ...others.slice(0, C.count - 1).map((x) => x.o)]
  }

  return {
    object3d: root,
    update(dt, camera) {
      const pl = player(); const m = mood?.()
      if ((scanT -= dt) <= 0) { scanT = C.scanS; scan() }
      if ((groundT -= dt) <= 0) { groundT = 1; stats.groundPatched = (stats.groundPatched || 0) + scanFigurePool(scene) }
      const want = pl && m ? choose(pl) : []
      // Zuordnung: gleiche Figur behält ihr Licht; frei werdende blenden aus, neue nehmen ein Licht mit Stärke 0
      for (const s of slots) s.want = !!s.obj && want.includes(s.obj)
      for (const o of want) if (!slots.some((s) => s.obj === o)) { const s = slots.find((x) => !x.want && x.w <= 0.001); if (s) { s.obj = o; s.want = true; s.w = 0 } }
      const figI = FIG_LIGHT_TEST.off || !m ? 0 : m.figI ?? 0; stats.figI = figI; stats.lit = []
      if (camera) camera.getWorldPosition(cam)
      const poolK = FIG_LIGHT_TEST.off || !m ? 0 : C.poolGain * (m.figI ?? 0) * (0.25 + 0.75 * (m.glow ?? 0)); PU.uFigPoolCol.value.set(m?.figColor || C.color)
      slots.forEach((s, i) => { PU.uFigPoolK.value[i] = 0 })
      for (const [i, s] of slots.entries()) {
        s.w = THREE.MathUtils.clamp(s.w + (s.want ? 1 : -1) * dt / C.fadeS, 0, 1)
        if (!s.obj || (!s.want && s.w <= 0)) { s.l.intensity = 0; if (!s.want) s.obj = null; continue }
        const h = heightOf(s.obj); s.obj.getWorldPosition(feet)
        dir.copy(cam).sub(feet).setY(0); if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1); dir.normalize()
        if (m?.az != null) { const a = THREE.MathUtils.degToRad(m.az), sx = Math.sin(a), sz = Math.cos(a), r = THREE.MathUtils.degToRad(C.sideDeg) // Richtung zur Sonne (sunDirection)
          alt.copy(dir).applyAxisAngle(UP, r); dir.applyAxisAngle(UP, -r); if (alt.x * sx + alt.z * sz < dir.x * sx + dir.z * sz) dir.copy(alt) } // die sonnenfernere Seite
        s.l.position.copy(feet).addScaledVector(dir, C.frontH * h); s.l.position.y = feet.y + h * C.upH
        face.copy(feet); face.y += h * C.faceH
        const d = s.l.position.distanceTo(face)
        s.l.color.set(m?.figColor || C.color); s.l.intensity = figI * d * d * s.w; s.l.distance = h * C.reachH
        PU.uFigPool.value[i].set(feet.x, feet.y, feet.z, h * C.poolR); PU.uFigPoolK.value[i] = poolK * s.w
        stats.lit.push({ name: s.obj.name || (s.obj === pl ? 'player' : '?'), w: +s.w.toFixed(2), h: +h.toFixed(2) })
      }
    },
    status: () => ({ count: slots.length, poolK: PU.uFigPoolK.value.map((v) => +v.toFixed(3)), ...stats }),
    dispose() { for (const s of slots) s.l.dispose(); root.clear() },
  }
}

// Für den Wirt (React-Komponente): einhängen und wieder lösen, ohne dass der Wirt selbst Szene oder Lichter verwaltet
export function attachFigureLights(scene, opts) {
  const F = createFigureLights({ scene, ...opts }); scene.add(F.object3d)
  return { lights: F, detach: () => { scene.remove(F.object3d); F.dispose() } }
}
