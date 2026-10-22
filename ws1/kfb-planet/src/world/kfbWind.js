// V-605 / V-619 · Geteilter Wind (Vorschlag kfb.wind/1, Besitz WS1-Lead): EIN Windfeld für alle Windgruppen (Gras, Büsche, Bäume; später Staub,
// Fluff, Regen). Richtung + Stärke 0..1 (setzt das Wetter), Böen als Wellen, die mit dem Wind über die Welt laufen (weltfest, keine Gleichtakt-Wippe).
// GPU: sway(material, { k }) hängt einen Vertex-Schritt an (nach der Instanz-/Modell-Matrix, in Welt-Metern), Kosten je Eckpunkt ≈ 2 sin + 1 Rauschen.
// CPU: at(x, z) liefert dieselbe Auslenkung (für Prüfungen und Teilchen). Kein Licht, kein Ton – der Ton liest strength().
import * as THREE from 'three'

export const WIND = { dir: new THREE.Vector2(0.8, 0.6).normalize(), strength: 0.2, gust: 0.35, time: 0 }
const U = { uWindDir: { value: WIND.dir }, uWindStr: { value: WIND.strength }, uWindGust: { value: WIND.gust }, uWindTime: { value: 0 } }
export const windUniforms = U

export const WIND_GLSL = `
uniform vec2 uWindDir; uniform float uWindStr, uWindGust, uWindTime;
float kfbWindH(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
// Auslenkung in Weltmetern je Meter Höhe² (Aufrufer skaliert mit Höhe und k)
vec2 kfbWind(vec2 wp){
  float along = dot(wp, uWindDir);
  float gust = 0.5 + 0.5 * sin(along * 0.045 - uWindTime * 1.7) * sin(along * 0.011 - uWindTime * 0.53 + 1.3);   /* Böen laufen mit dem Wind */
  float flut = sin(uWindTime * 2.3 + kfbWindH(floor(wp * 0.5)) * 6.28) * 0.35 + sin(uWindTime * 3.7 + dot(wp, vec2(0.37, 0.21))) * 0.2;
  float s = uWindStr * (0.55 + uWindGust * gust * 1.6);
  return uWindDir * s * (0.6 + 0.4 * flut) + vec2(-uWindDir.y, uWindDir.x) * s * 0.18 * flut;
}`

// Material wiegt im Wind: Höhe über dem Modell-Fuß (lokal y) bestimmt die Auslenkung (Fuß fest, Spitze am meisten). k = Meter je (Meter Höhe)²
export function sway(mat, { k = 0.02, maxH = 8 } = {}) {
  if (!mat || mat.userData?.kfbWind) return; mat.userData.kfbWind = true
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); Object.assign(sh.uniforms, U); sh.uniforms.uWindK = { value: k }; sh.uniforms.uWindMaxH = { value: maxH }
    sh.vertexShader = WIND_GLSL + '\nuniform float uWindK, uWindMaxH;\n' + sh.vertexShader.replace('#include <project_vertex>', `
  vec4 kfbWp = vec4(transformed, 1.0);
  #ifdef USE_BATCHING
  kfbWp = batchingMatrix * kfbWp;
  #endif
  #ifdef USE_INSTANCING
  kfbWp = instanceMatrix * kfbWp;
  #endif
  kfbWp = modelMatrix * kfbWp;
  { float hh = clamp(transformed.y, 0.0, uWindMaxH); kfbWp.xz += kfbWind(kfbWp.xz) * hh * hh * uWindK; }
  vec4 mvPosition = viewMatrix * kfbWp;
  gl_Position = projectionMatrix * mvPosition;`) }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|kfbWind'; mat.needsUpdate = true
}

// je Bild: Zeit und Werte in die Uniforms (das Wetter setzt strength/dir/gust)
export function windTick(dt) { WIND.time += dt; U.uWindTime.value = WIND.time; U.uWindStr.value = WIND.strength; U.uWindGust.value = WIND.gust }
export function setWind({ strength, dir, gust } = {}) { if (strength != null) WIND.strength = strength; if (gust != null) WIND.gust = gust; if (dir) WIND.dir.set(dir[0], dir[1]).normalize() }
// gleiche Formel auf der CPU (Prüfungen)
export function windAt(x, z) {
  const d = WIND.dir, along = x * d.x + z * d.y, t = WIND.time, fr = (v) => v - Math.floor(v)
  const gust = 0.5 + 0.5 * Math.sin(along * 0.045 - t * 1.7) * Math.sin(along * 0.011 - t * 0.53 + 1.3)
  const h = fr(Math.sin(Math.floor(x * 0.5) * 41.3 + Math.floor(z * 0.5) * 289.1) * 43758.5453)
  const flut = Math.sin(t * 2.3 + h * 6.28) * 0.35 + Math.sin(t * 3.7 + x * 0.37 + z * 0.21) * 0.2, s = WIND.strength * (0.55 + WIND.gust * gust * 1.6)
  return [d.x * s * (0.6 + 0.4 * flut) - d.y * s * 0.18 * flut, d.y * s * (0.6 + 0.4 * flut) + d.x * s * 0.18 * flut]
}
