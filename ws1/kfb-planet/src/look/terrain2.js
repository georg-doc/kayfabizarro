// #439 (V-561) · Look-Variante terrain2: kleiner Zusatz an der bestehenden Material-Naht (kein zweiter Renderer, kein neues Licht).
// Probe 1 – Farbflächen: Farbrolle aus einem eigenen, niederfrequenten Feld in Weltkoordinaten (Domain Warp nur an den Grenzen), unabhängig von der Höhe;
//   steile Flächen über eine Wand-Projektion (horizontal entlang der Wand × Höhe), 3–4 Rollen aus dem Farbdrehbuch (kfb-colorscript.r1, V-305/V-406).
// Probe 2 – Schatten: die vorhandene Shadow Map (Sonne = erstes schattenwerfendes Richtungslicht des Licht-Rigs) liefert die Sichtbarkeit V; im Schatten
//   wird nicht schwarz/grau multipliziert, sondern in den Schattenton des Empfängers umgefärbt (Helligkeit aus der echten Beleuchtung, Farbton aus der
//   Palette), mit kompakter Stufe T(V). Werte in src/data/looks/kfb-terrain2.r1.json.
import * as THREE from 'three'
import SCRIPT from '../data/looks/kfb-colorscript.r1.json' with { type: 'json' }
import CFG from '../data/looks/kfb-terrain2.r1.json' with { type: 'json' }

export const TERRAIN2_CFG = CFG
export const isTerrain2 = (hash = typeof location !== 'undefined' ? location.hash : '') => /(^|[#,])look=terrain2(,|$)/.test(hash)
export function terrain2Palette(world = CFG.world) {
  const rows = (SCRIPT.worlds[world] || SCRIPT.worlds[CFG.world]).harmony.rows
  return { world, surfaces: CFG.surfaceRoles.map((r) => rows[r].hex), shadow: rows[CFG.shadow.role].hex }
}

// Erdwall um den Fuß des Dioramas (rein, auch für Node-Tests): Höhe, die das Gelände zusätzlich bekommt; vorne (Fuß < entranceBelow) offen
const DIO = CFG.diorama, FOOT = DIO.foot
const footAt = (x, z) => { const a = ((Math.atan2(z, x) / (2 * Math.PI)) + 1) % 1 * 64, i = Math.floor(a) % 64, f = a - Math.floor(a); return FOOT[i] * (1 - f) + FOOT[(i + 1) % 64] * f }
const openAt = (x, z) => { const a = ((Math.atan2(z, x) / (2 * Math.PI)) + 1) % 1 * 64, i = Math.floor(a) % 64; let m = 1; for (let k = -2; k <= 2; k++) if (FOOT[(i + k + 64) % 64] < DIO.entranceBelow) m = Math.min(m, Math.abs(k) / 3); return m } // 0 = Öffnung, 1 = Wall
const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
export function terrain2Berm(x, z) {
  const B = DIO.berm, r = Math.hypot(x, z), d = r - footAt(x, z); if (d < -B.tuck || d > B.width) return 0
  const ang = Math.atan2(z, x), vary = 1 + B.vary * (Math.sin(ang * 3 + 1.3) * 0.6 + Math.sin(ang * 7 - 0.4) * 0.4)
  return B.height * vary * (d < 0 ? 1 : 1 - sm(0, B.width, d)) * openAt(x, z)
}
export const terrain2Foot = () => FOOT.slice()

const GLSL = /* glsl */`
uniform vec3 uT2S0, uT2S1, uT2S2, uT2S3, uT2Shadow; uniform vec4 uT2Field; uniform vec2 uT2Share, uT2Wall, uT2Toon; uniform float uT2Mix, uT2Keep; uniform float uT2Foot[64]; uniform vec3 uT2Ring, uT2Rock; uniform vec3 uT2RingP; // RingP: Breite, Zungen, Öffnung-unter
varying vec3 vT2W; varying vec3 vT2N;
float t2h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float t2n(vec2 p){ vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(t2h(i), t2h(i + vec2(1.0, 0.0)), u.x), mix(t2h(i + vec2(0.0, 1.0)), t2h(i + vec2(1.0, 1.0)), u.x), u.y) * 2.0 - 1.0; }
float t2f(vec2 p){ return t2n(p) * 0.65 + t2n(p * 2.03 + 5.1) * 0.35; }
// breite geschlossene Flächen: zwei niederfrequente Felder, Grenzen per Domain Warp verbogen, Kanten auf ~1 px geglättet (kein Verlauf, kein Sprenkel)
float t2FootAt(vec2 p){ float a = fract(atan(p.y, p.x) / 6.2831853 + 1.0) * 64.0; int i = int(floor(a)) % 64; float f = fract(a); return mix(uT2Foot[i], uT2Foot[(i + 1) % 64], f); }
// Bühnenfuß: Ring in der Bühnenrolle mit organischen Zungen nach außen (Kante ~1 px), Felsrolle als zweite Zunge; vorne (Öffnung) schmaler
vec3 t2Stage(vec3 col, vec3 w){
  float fr = t2FootAt(w.xz), d = length(w.xz) - fr; if (d > uT2RingP.x * 2.5) return col;
  float ang = atan(w.z, w.x), tz = t2f(vec2(ang * 3.0, d * 0.15) + 21.0), open = fr < uT2RingP.z ? 0.55 : 1.0;
  float reach = uT2RingP.x * open * (1.0 + uT2RingP.y * tz), e = d - reach, ew = fwidth(e) * 1.2 + 1e-4;
  float k = 1.0 - smoothstep(-ew, ew, e);
  float rk = 1.0 - smoothstep(-ew, ew, d - reach * 0.45 * (1.0 + 0.8 * t2f(vec2(ang * 5.0, 3.0))));
  return mix(col, mix(uT2Ring, uT2Rock, rk * 0.6), k);
}
vec3 t2Region(vec2 c){
  vec2 w = vec2(t2f(c / uT2Field.y + 3.7), t2f(c / uT2Field.y - 8.3)) * uT2Field.z * 2.0;
  vec2 q = c / uT2Field.x + uT2Field.w * 0.013 + w;
  float a = t2f(q), b = t2f(q * 0.8 + vec2(13.0, -7.0));
  float aw = fwidth(a) * 1.2 + 1e-4, bw = fwidth(b) * 1.2 + 1e-4;
  vec3 col = mix(uT2S1, uT2S0, smoothstep(-aw, aw, a));
  col = mix(col, uT2S2, smoothstep(uT2Share.x - bw, uT2Share.x + bw, b));
  col = mix(col, uT2S3, 1.0 - smoothstep(uT2Share.y - bw, uT2Share.y + bw, b));
  return col;
}`

export function applyTerrain2(mat, { world, ring = null } = {}) { // ring: { stage, rock } Farben der Bühnenrollen (aus der Amphitheater-Palette)
  const P = terrain2Palette(world), F = CFG.field
  const U = {
    uT2S0: { value: new THREE.Color(P.surfaces[0]) }, uT2S1: { value: new THREE.Color(P.surfaces[1]) }, uT2S2: { value: new THREE.Color(P.surfaces[2]) }, uT2S3: { value: new THREE.Color(P.surfaces[3]) },
    uT2Shadow: { value: new THREE.Color(P.shadow) }, uT2Field: { value: new THREE.Vector4(F.wavelength, F.warpWave, F.warp, F.seed) },
    uT2Share: { value: new THREE.Vector2(F.roleShare.third, F.roleShare.accent) }, uT2Wall: { value: new THREE.Vector2(CFG.wall.slopeStart, CFG.wall.slopeEnd) },
    uT2Toon: { value: new THREE.Vector2(...CFG.shadow.toon) }, uT2Mix: { value: CFG.shadow.mix }, uT2Keep: { value: CFG.shadow.albedoKeep },
    uT2Foot: { value: FOOT.slice() }, uT2Ring: { value: new THREE.Color(ring?.stage || '#e2d0bc') }, uT2Rock: { value: new THREE.Color(ring?.rock || '#cdb48c') },
    uT2RingP: { value: new THREE.Vector3(DIO.ring.width, DIO.ring.tongue, DIO.entranceBelow) },
  }
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => {
    prev?.call(mat, sh, r)
    Object.assign(sh.uniforms, U)
    sh.vertexShader = 'varying vec3 vT2W; varying vec3 vT2N;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
  vT2W = (modelMatrix * vec4(transformed, 1.0)).xyz; vT2N = normalize(mat3(modelMatrix) * objectNormal);`)
    sh.fragmentShader = GLSL + '\n' + sh.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>
  { vec3 n = normalize(vT2N);
    vec2 wallChart = abs(n.x) > abs(n.z) ? vec2(vT2W.z, vT2W.y) : vec2(vT2W.x, vT2W.y);
    float wk = smoothstep(uT2Wall.x, uT2Wall.y, 1.0 - n.y);
    diffuseColor.rgb = t2Stage(mix(t2Region(vT2W.xz), t2Region(wallChart + vec2(97.0, 41.0)), wk), vT2W); }`)
      .replace('#include <lights_fragment_begin>', `#include <lights_fragment_begin>
  float t2V = 1.0;
  #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
  { DirectionalLightShadow t2s = directionalLightShadows[ 0 ];
    t2V = receiveShadow ? getShadow( directionalShadowMap[ 0 ], t2s.shadowMapSize, t2s.shadowIntensity, t2s.shadowBias, t2s.shadowRadius, vDirectionalShadowCoord[ 0 ] ) : 1.0; }
  #endif`)
      .replace('#include <opaque_fragment>', `{ // Schatten im Palettenton des Empfängers: Helligkeit aus der echten Beleuchtung, Farbton aus der Rolle (kein schwarzer Multiply)
    vec3 lw = vec3(0.2126, 0.7152, 0.0722);
    vec3 shc = mix(diffuseColor.rgb * uT2Keep, uT2Shadow, uT2Mix);
    vec3 remap = shc * (dot(outgoingLight, lw) / max(dot(shc, lw), 1e-3));
    outgoingLight = mix(remap, outgoingLight, smoothstep(uT2Toon.x, uT2Toon.y, t2V)); }
  #include <opaque_fragment>`)
  }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|terrain2'
  mat.needsUpdate = true
  return { uniforms: U, palette: P }
}
