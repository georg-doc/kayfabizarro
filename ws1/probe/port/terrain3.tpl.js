// #439 · look=terrain3 (Georg 21.10.: „das neue Terrain-Konzept als Basis statt der grünen Wiese“): Malweise der Gelände-Probe im Spiel.
// Fließfarben (70er, Domain Warping, lose an der Höhe, Biom-Paletten) als Farbe des Knet-Geländes; Licht bleibt das eine Rig (LIGHT_MODEL_R2),
// Schatten im Palettenton des Empfängers wie terrain2 (V-564, castShadowTint, kein schwarzer Multiply). Shader-Bausteine 1:1 aus der Probe
// (GLSL_NOISE, GLSL_FLOW, erzeugt von probe/port/gen_terrain3.py); Geländeform bleibt die von M1. Werte in kfb-terrain3.r1.json.
import * as THREE from 'three'
import CFG from '../data/looks/kfb-terrain3.r1.json' with { type: 'json' }

export const TERRAIN3_CFG = CFG
export const isTerrain3 = (hash = typeof location !== 'undefined' ? location.hash : '') => /(^|[#,])look=terrain3(,|$)/.test(hash)
const ROLES = ['water', 'sand', 'low', 'mid', 'high', 'peak', 'cliff']
export const NOISE_GLSL = `/*@NOISE@*/`
const FLOW_GLSL = `
uniform vec3 /*@UA@*/;
uniform vec3 /*@UB@*/;
uniform vec2 uSeed; uniform float uScale, uMix, uTimeT, uFlow, uBands, uFlowDown;
uniform vec2 uT3H; uniform float uT3S; uniform vec3 uT3Shadow; uniform vec2 uT3Toon; uniform float uT3Mix, uT3Keep;
/*@FLOW@*/`

// Maßstab: die Spielwelt ist viel kleiner als die Probe (Bänder dort ≈ 210 m) → flow.scale vergrößert die Koordinaten (mehr Bänder je Meter)
// opts: { palette, paletteB, mix, hMin, hMax } · Rückgabe: { uniforms, palette, update(dt, speed) }
export function applyTerrain3(mat, { palette = CFG.palette, paletteB = CFG.paletteB, mix = CFG.mix, hMin = 0, hMax = 10 } = {}) {
  const A = CFG.palettes[palette] || CFG.palettes.mesa, B = CFG.palettes[paletteB] || CFG.palettes.moos
  const U = { uSeed: { value: new THREE.Vector2(0, 0) }, uScale: { value: 180 }, uMix: { value: mix ? 1 : 0 }, uTimeT: { value: 0 }, uFlow: { value: CFG.flow.speed }, uBands: { value: CFG.flow.bands }, uFlowDown: { value: CFG.flow.downhill ? 1 : 0 },
    uT3H: { value: new THREE.Vector2(hMin, hMax) }, uT3S: { value: CFG.flow.scale ?? 2.5 }, uT3Shadow: { value: new THREE.Color(A.cliff).lerp(new THREE.Color('#5a6f9a'), 0.45).multiplyScalar(0.7) },   /* kühler Palettenschatten, nur leicht beigemischt (kein Rotsaum am Rand) */
    uT3Toon: { value: new THREE.Vector2(0.3, 0.7) }, uT3Mix: { value: 0.18 }, uT3Keep: { value: 0.78 } }
  for (const r of ROLES) { U['uA_' + r] = { value: new THREE.Color(A[r]) }; U['uB_' + r] = { value: new THREE.Color(B[r]) } }
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => {
    prev?.call(mat, sh, r)
    Object.assign(sh.uniforms, U)
    sh.vertexShader = 'varying vec3 vT3W;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
  vT3W = (modelMatrix * vec4(transformed, 1.0)).xyz;`)
    sh.fragmentShader = 'varying vec3 vT3W;\n' + NOISE_GLSL + '\n' + FLOW_GLSL + '\n' + sh.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>
  diffuseColor.rgb = flowBands(vT3W.xz * uT3S, clamp((vT3W.y - uT3H.x) / max(1e-3, uT3H.y - uT3H.x), 0.0, 1.0));`)
      .replace('#include <lights_fragment_begin>', `#include <lights_fragment_begin>
  float t3V = 1.0;
  #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
  { DirectionalLightShadow t3s = directionalLightShadows[ 0 ];
    t3V = receiveShadow ? getShadow( directionalShadowMap[ 0 ], t3s.shadowMapSize, t3s.shadowIntensity, t3s.shadowBias, t3s.shadowRadius, vDirectionalShadowCoord[ 0 ] ) : 1.0; }
  #endif`)
      .replace('#include <opaque_fragment>', `{ /* Schatten im Palettenton des Empfängers (V-564): Helligkeit aus der echten Beleuchtung, Farbton aus Rolle + Palette */
    vec3 lw = vec3(0.2126, 0.7152, 0.0722);
    vec3 shc = mix(diffuseColor.rgb * uT3Keep, uT3Shadow, uT3Mix);
    vec3 remap = shc * (dot(outgoingLight, lw) / max(dot(shc, lw), 1e-3));
    outgoingLight = mix(remap, outgoingLight, smoothstep(uT3Toon.x, uT3Toon.y, t3V)); }
  #include <opaque_fragment>`)
  }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|terrain3'
  mat.needsUpdate = true
  // Fließuhr wie in der Probe: im Stand sanft, mit Tempo schneller (CFG.flow.tempoCoupling)
  return { uniforms: U, palette: A, update(dt, speed = 0) { U.uTimeT.value += dt * (1 + (CFG.flow.tempoCoupling ? Math.min(6, speed / 8) : 0)) } }
}

// Palettenschatten allein (ohne Fließfarben) für weitere Böden des Looks, z. B. den Weg (V-564: Schatten im Ton des Empfängers)
export function applyShadowTone3(mat, { palette = CFG.palette } = {}) {
  const A = CFG.palettes[palette] || CFG.palettes.mesa
  const U = { uT3Shadow: { value: new THREE.Color(A.cliff).lerp(new THREE.Color('#5a6f9a'), 0.45).multiplyScalar(0.7) }, uT3Toon: { value: new THREE.Vector2(0.3, 0.7) }, uT3Mix: { value: 0.18 }, uT3Keep: { value: 0.78 } }
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); Object.assign(sh.uniforms, U)
    sh.fragmentShader = 'uniform vec3 uT3Shadow; uniform vec2 uT3Toon; uniform float uT3Mix, uT3Keep;\n' + sh.fragmentShader
      .replace('#include <lights_fragment_begin>', `#include <lights_fragment_begin>
  float t3V = 1.0;
  #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
  { DirectionalLightShadow t3s = directionalLightShadows[ 0 ];
    t3V = receiveShadow ? getShadow( directionalShadowMap[ 0 ], t3s.shadowMapSize, t3s.shadowIntensity, t3s.shadowBias, t3s.shadowRadius, vDirectionalShadowCoord[ 0 ] ) : 1.0; }
  #endif`)
      .replace('#include <opaque_fragment>', `{ vec3 lw = vec3(0.2126, 0.7152, 0.0722); vec3 shc = mix(diffuseColor.rgb * uT3Keep, uT3Shadow, uT3Mix);
    vec3 remap = shc * (dot(outgoingLight, lw) / max(dot(shc, lw), 1e-3)); outgoingLight = mix(remap, outgoingLight, smoothstep(uT3Toon.x, uT3Toon.y, t3V)); }
  #include <opaque_fragment>`) }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|t3shadow'; mat.needsUpdate = true
  return { uniforms: U, palette: A }
}

// Dunkler Fuß wie KayKit (Schattenkonzept R1, Georg 21.10.: „wie Kay Lousberg“), aber zur Laufzeit aus dem echten Bodenabstand statt in die Farbe
// gebacken: weicher Verlauf, zum Boden hin dunkler (nie schwarz, keine Kante). uniforms.uFootY setzt der Host je Bild (Bodenhöhe unter der Figur).
export function applyFootShade(mat, uniforms) {
  if (!mat || mat.userData?.footShade) return; mat.userData.footShade = true
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); Object.assign(sh.uniforms, uniforms)
    sh.vertexShader = 'varying float vFootW;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
  { vec4 fw = vec4(transformed, 1.0);
  #ifdef USE_SKINNING
  #endif
  #ifdef USE_INSTANCING
    fw = instanceMatrix * fw;
  #endif
    vFootW = (modelMatrix * fw).y; }`)
    sh.fragmentShader = 'uniform float uFootY, uFootH, uFootK; varying float vFootW;\n' + sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
  { float hf = max(vFootW - uFootY, 0.0);
    diffuseColor.rgb *= mix(1.0 - uFootK, 1.0, smoothstep(0.0, uFootH, hf)); }`) }                          /* nur weicher Verlauf zum Boden (keine harte Stufe – las sich als Schuhsohle, Georg 21.10.) */
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|foot'; mat.needsUpdate = true
}

// Selbstschatten an Figuren gedämpft (Georg 21.10.: harte Schattenkante am Arm; KayKit: Figuren bleiben hell und lesbar): der echte Schatten der
// einen Sonne wirkt auf Figuren nur mit uFigShadowK (0 = keiner, 1 = voll). Ersetzt im Licht-Chunk nur den Faktor der Richtungslicht-Schatten.
export function applyFigureShadow(mat, uniforms) {
  if (!mat || mat.userData?.figShadow) return; mat.userData.figShadow = true
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); Object.assign(sh.uniforms, uniforms)
    const chunk = THREE.ShaderChunk.lights_fragment_begin.replace(/directLight\.color \*= \( directLight\.visible && receiveShadow \) \? (getShadow\( directionalShadowMap\[ i \][^;]*?) : 1\.0;/,
      'directLight.color *= ( directLight.visible && receiveShadow ) ? mix( 1.0, $1, uFigShadowK ) : 1.0;')
    sh.fragmentShader = 'uniform float uFigShadowK;\n' + sh.fragmentShader.replace('#include <lights_fragment_begin>', chunk) }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|figshadow'; mat.needsUpdate = true
}
