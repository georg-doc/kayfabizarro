// ============================================================================
// rim-light.js — Fresnel-Rand, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/RimLight.ts (gelesen 27.8.2026).
// Patcht MeshPhongMaterial: ein Fresnel-Saum, injiziert in den Fragment-Shader — null zusätzliche
// Draw-Calls. Das ist die halbe Ursache dafür, dass der Teppich im Vorbild „gezeichnet" wirkt und
// nicht wie ein Klotz.
// ============================================================================

const RIM_DITHERING_PATCH = `vec3 rimViewDir = normalize(vViewPosition);
vec3 rimNormal = normalize(normal);
float rimFresnel = 1.0 - abs(dot(rimViewDir, rimNormal));
vec3 rim = rimColor * rimIntensity * pow(rimFresnel, rimPower);
gl_FragColor.rgb += rim;
#include <dithering_fragment>`;

function appendRimToFragmentShader(fragmentShader) {
  return fragmentShader
    .replace('uniform vec3 emissive;',
      'uniform vec3 emissive;\nuniform vec3 rimColor;\nuniform float rimIntensity;\nuniform float rimPower;')
    .replace('#include <dithering_fragment>', RIM_DITHERING_PATCH);
}

/** Geteilter Fresnel-Ton für alle Rand-Materialien — im Original aus dem Tageszeit-Preset. */
export let globalRimColor = null;
export function initRimLight(THREE) {
  if (!globalRimColor) globalRimColor = new THREE.Color(0xffeebb);
  return globalRimColor;
}

export function addRimLight(mat, _color, intensity, power) {
  const rimIntensityUniform = { value: intensity != null ? intensity : 0.6 };
  const p = power != null ? power : 2.5;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.rimColor = { value: globalRimColor };
    shader.uniforms.rimIntensity = rimIntensityUniform;
    shader.uniforms.rimPower = { value: p };
    shader.fragmentShader = appendRimToFragmentShader(shader.fragmentShader);
  };
  mat.needsUpdate = true;
  return rimIntensityUniform;
}
