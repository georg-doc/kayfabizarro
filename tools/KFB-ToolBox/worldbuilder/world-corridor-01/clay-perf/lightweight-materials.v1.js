/* KFB lightweight material comparators.
 * Dedicated small shaders: do not carry the v10 Clay code when testing Clay Lite / Derek / Plain.
 * Source MeshPhysicalMaterial properties remain the visual/material base.
 */

function cleanClone(src, key) {
  const m = src.clone();
  m.onBeforeCompile = () => {};
  m.customProgramCacheKey = () => key;
  m.userData = { ...(src.userData || {}), kfbComparator: key };
  m.needsUpdate = true;
  return m;
}

const VERT_DECL = /* glsl */`
varying vec3 vKfbWPos;
varying vec3 vKfbWNrm;
`;

const VERT_WRITE = /* glsl */`#include <project_vertex>
{
  vec4 kfbLocal = vec4(transformed, 1.0);
  vec3 kfbN = objectNormal;
#ifdef USE_INSTANCING
  kfbLocal = instanceMatrix * kfbLocal;
  kfbN = mat3(instanceMatrix) * kfbN;
#endif
  vKfbWPos = (modelMatrix * kfbLocal).xyz;
  vKfbWNrm = normalize(mat3(modelMatrix) * kfbN);
}
`;

export function makePlainMaterial(src) {
  return cleanClone(src, 'kfb-plain-v1');
}

export function makeGlobalClayLiteMaterial(src, shared) {
  const m = cleanClone(src, 'kfb-global-clay-lite-v1');
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, {
      uKfbLiteTex: shared.texture,
      uKfbLiteScale: shared.scale,
      uKfbLiteBump: shared.bump,
      uKfbLiteColor: shared.color,
      uKfbLiteRough: shared.rough,
    });
    sh.vertexShader = VERT_DECL + sh.vertexShader
      .replace('#include <project_vertex>', VERT_WRITE);
    sh.fragmentShader = `
uniform sampler2D uKfbLiteTex;
uniform float uKfbLiteScale, uKfbLiteBump, uKfbLiteColor, uKfbLiteRough;
varying vec3 vKfbWPos;
varying vec3 vKfbWNrm;
` + sh.fragmentShader
      .replace('#include <map_fragment>', `#include <map_fragment>
  vec3 kfbW = pow(abs(normalize(vKfbWNrm)), vec3(4.0));
  kfbW /= max(kfbW.x + kfbW.y + kfbW.z, 1e-5);
  vec4 kfbLX = texture2D(uKfbLiteTex, vKfbWPos.zy * uKfbLiteScale);
  vec4 kfbLY = texture2D(uKfbLiteTex, vKfbWPos.xz * uKfbLiteScale);
  vec4 kfbLZ = texture2D(uKfbLiteTex, vKfbWPos.xy * uKfbLiteScale);
  vec4 kfbLT = kfbLX * kfbW.x + kfbLY * kfbW.y + kfbLZ * kfbW.z;
  vec2 kfbGX = kfbLX.rg * 2.0 - 1.0;
  vec2 kfbGY = kfbLY.rg * 2.0 - 1.0;
  vec2 kfbGZ = kfbLZ.rg * 2.0 - 1.0;
  diffuseColor.rgb *= clamp(1.0 + ((kfbLT.a - 0.5) * 2.0) * uKfbLiteColor, 0.72, 1.28);
`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
  roughnessFactor = clamp(mix(roughnessFactor, kfbLT.b, uKfbLiteRough), 0.25, 1.0);
`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
  vec3 kfbG = kfbW.x * vec3(0.0, kfbGX.y, kfbGX.x)
            + kfbW.y * vec3(kfbGY.x, 0.0, kfbGY.y)
            + kfbW.z * vec3(kfbGZ.x, kfbGZ.y, 0.0);
  vec3 kfbN0 = normalize(vKfbWNrm);
  kfbG -= kfbN0 * dot(kfbG, kfbN0);
  vec3 kfbDN = normalize(kfbN0 - kfbG * uKfbLiteBump) - kfbN0;
  vec3 kfbDV = (viewMatrix * vec4(kfbDN, 0.0)).xyz;
  normal = normalize(normal + kfbDV * faceDirection);
`);
  };
  return m;
}

export function makeDerekRgbMaterial(src, shared) {
  const m = cleanClone(src, 'kfb-derek-rgb-v1');
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, {
      uKfbDerekTex: shared.texture,
      uKfbDerekScale: shared.scale,
      uKfbDerekBlend: shared.blend,
      uKfbDerekSpread: shared.spread,
      uKfbDerekHue: shared.hue,
      uKfbDerekRoughBias: shared.roughBias,
    });
    sh.vertexShader = VERT_DECL + sh.vertexShader
      .replace('#include <project_vertex>', VERT_WRITE);
    sh.fragmentShader = `
uniform sampler2D uKfbDerekTex;
uniform float uKfbDerekScale, uKfbDerekBlend, uKfbDerekSpread, uKfbDerekHue, uKfbDerekRoughBias;
varying vec3 vKfbWPos;
varying vec3 vKfbWNrm;

vec3 kfbLiteHue(vec3 c, float a){
  mat3 toY = mat3(0.299, 0.596, 0.211, 0.587, -0.274, -0.523, 0.114, -0.322, 0.312);
  mat3 toR = mat3(1.0, 1.0, 1.0, 0.956, -0.272, -1.106, 0.621, -0.647, 1.703);
  vec3 y = toY * c;
  float cs = cos(a), sn = sin(a);
  y.yz = vec2(y.y * cs - y.z * sn, y.y * sn + y.z * cs);
  return max(toR * y, 0.0);
}
` + sh.fragmentShader
      .replace('#include <map_fragment>', `#include <map_fragment>
  vec3 kfbW = pow(abs(normalize(vKfbWNrm)), vec3(uKfbDerekBlend));
  kfbW /= max(kfbW.x + kfbW.y + kfbW.z, 1e-5);
  vec3 kfbDX = texture2D(uKfbDerekTex, vKfbWPos.zy * uKfbDerekScale).rgb;
  vec3 kfbDY = texture2D(uKfbDerekTex, vKfbWPos.xz * uKfbDerekScale).rgb;
  vec3 kfbDZ = texture2D(uKfbDerekTex, vKfbWPos.xy * uKfbDerekScale).rgb;
  vec3 kfbMask = max(kfbDX * kfbW.x + kfbDY * kfbW.y + kfbDZ * kfbW.z, 0.0);
  kfbMask /= max(kfbMask.r + kfbMask.g + kfbMask.b, 1e-3);
  vec3 kfbSrc = diffuseColor.rgb;
  vec3 kfbC1 = kfbSrc;
  vec3 kfbC2 = kfbLiteHue(kfbSrc * (1.0 - uKfbDerekSpread * 0.7), uKfbDerekHue * 1.6);
  vec3 kfbC3 = min(kfbLiteHue(kfbSrc * (1.0 + uKfbDerekSpread)
    + uKfbDerekSpread * 0.16 * (normalize(kfbSrc + 0.02) * 0.6 + 0.4), -uKfbDerekHue * 1.6), 1.0);
  diffuseColor.rgb = kfbMask.r * kfbC1 + kfbMask.g * kfbC2 + kfbMask.b * kfbC3;
`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
  roughnessFactor = clamp(roughnessFactor + uKfbDerekRoughBias, 0.04, 1.0);
`);
  };
  return m;
}
