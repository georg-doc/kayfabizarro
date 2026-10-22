// Schattenseite aller Nicht-Gelände-Objekte (WS0 V-683, Georg 22.10.): eine Regel im einen Rig, als Materialantwort – kein Füll- oder Rim-Licht.
// Die Schattenseite bekommt wie das Gelände (V-564) einen Boden im Farbton des Rigs: outgoingLight ≥ Albedo × Rig-Ton × K.
// K = Untergrenze aus WS1bs Fundsachen (0,34 Tag → 0,50 Nacht nach mood.glow), Ton = Himmelsfüllung des Rigs (nur Farbton, Helligkeit fest),
// damit die Aufhellung nachts nicht mit dem dunklen Himmel selbst dunkel wird. Ein Uniform-Satz für alle Materialien, ein Programm-Zusatz (Cache-Schlüssel).
// Gilt für Figuren, Bewohner, Bäume, Props, Racer, Laternen; nicht für Gelände, Himmel, Wasser, Weg, Erdkeile, Effekte (Shader- bzw. additive Materialien).
import * as THREE from 'three'

export const SHADE_FLOOR = Object.freeze({ day: 0.34, night: 0.5 })
export const SHADE_ON = typeof location !== 'undefined' && /(^|[#,])shade=1(,|$)/.test(location.hash) // A/B für Georg; Standard erst nach seiner Wahl

const U = { uShadeCol: { value: new THREE.Color('#eef0ff') }, uShadeK: { value: SHADE_FLOOR.day } }
const SKIP_ROOT = /terrain|sky|water|river|lake|demo-path|grounding|fluff-suck|dust|found-items|groundfx|headlight|beam|hud/i
const SKIP_NODE = /clay-ground|ground$|ground-skirt|skirt|contact-pebble|shadow|flame|glow|flare/i

export function patchShadeFloor(m) {
  if (!m || m.userData?.shadeFloor || m.userData?.foundLift || m.isShaderMaterial || m.blending === THREE.AdditiveBlending || !('roughness' in m || 'shininess' in m)) return false
  m.userData.shadeFloor = true
  const prev = m.onBeforeCompile, prevKey = m.customProgramCacheKey
  m.onBeforeCompile = (sh, r) => { prev?.call(m, sh, r); Object.assign(sh.uniforms, U)
    sh.fragmentShader = 'uniform vec3 uShadeCol; uniform float uShadeK;\n' + sh.fragmentShader.replace('#include <opaque_fragment>', `outgoingLight = max(outgoingLight, diffuseColor.rgb * uShadeCol * uShadeK);
  #include <opaque_fragment>`) }
  m.customProgramCacheKey = () => (prevKey ? prevKey.call(m) : '') + '|shadeFloor'; m.needsUpdate = true; return true
}

// Szene durchgehen (je Sekunde): neue Materialien anhängen; Wurzel = direktes Kind der Szene
export function scanShadeFloor(scene) {
  let n = 0
  for (const root of scene.children) {
    if (SKIP_ROOT.test(root.name || '')) continue
    root.traverse((o) => { if (!o.isMesh || SKIP_NODE.test(o.name || '')) return; for (const m of [].concat(o.material)) if (patchShadeFloor(m)) n++ })
  }
  return n
}

// Prüfhilfe (A/B im selben Moment): off = Regel aus (K = 0), sonst Rig-Wert
export const SHADE_TEST = { off: false }
// Rig-Ton je Bild: tone = { color: hemiSky, glow }
export function updateShadeFloor(tone) {
  if (SHADE_TEST.off) { U.uShadeK.value = 0; return }
  if (!tone) return
  const c = U.uShadeCol.value.set(tone.color || '#eef0ff'), hsl = {}; c.getHSL(hsl); c.setHSL(hsl.h, Math.min(0.45, hsl.s * 0.6), 0.82)
  U.uShadeK.value = SHADE_FLOOR.day + (SHADE_FLOOR.night - SHADE_FLOOR.day) * Math.min(1, tone.glow || 0)
}
