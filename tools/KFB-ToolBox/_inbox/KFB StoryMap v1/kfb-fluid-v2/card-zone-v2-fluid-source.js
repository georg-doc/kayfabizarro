/**
 * KFB Card Zone Lab v2 · Fluid Shader Source Donor
 * =================================================
 *
 * SOURCE OF TRUTH — NOT THE TOOLBOX BENCH:
 *   tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/KFB Card Zone Lab v2.dc.html
 *   source blob: 43eea82f8727d3581e50374d6263e48a28241d3b
 *
 * SOURCE-EXACT SEAMS:
 * - FLUIDS: donor lines 252–258
 * - texture loading contract: donor lines 487–496 + 1013–1021
 * - ShaderMaterial flags + GLSL: donor lines 1013–1086
 * - frame-time update: donor line 473
 *
 * IMPORTANT:
 * - The GLSL below is copied verbatim from the working v2 donor.
 * - `float u = 0.5` is intentional. It keeps the source foam block constructively OFF.
 * - Lake/river SHAPE is geometry-owned. River motion enters through per-vertex `aFlow`.
 * - This file does not copy Bench v1/v1.1 wrapper behavior.
 */

export const CARD_ZONE_V2_SOURCE = Object.freeze({
  repo: 'georg-doc/kayfabizarro',
  path: 'tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/KFB Card Zone Lab v2.dc.html',
  blob: '43eea82f8727d3581e50374d6263e48a28241d3b',
  lines: Object.freeze({
    fluids: '252-258',
    loadTex: '487-496',
    frameTime: '473',
    buildFluidSurface: '1010-1114',
    layoutFluid: '1118-1204',
  }),
});

export const CARD_ZONE_V2_RAW =
  'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';
export const CARD_ZONE_V2_DUDV_URL = CARD_ZONE_V2_RAW + 'KFB/waterdudv.jpg';
export const CARD_ZONE_V2_WATER_URL = CARD_ZONE_V2_RAW + 'KFB/water.jpg';

export const CARD_ZONE_V2_FLUIDS = Object.freeze({
  wasser: { label: 'Wasser', col: [0.16, 0.42, 0.50] },
  oel: { label: 'Öl', col: [0.07, 0.06, 0.05] },
  saeure: { label: 'Säure', col: [0.46, 0.72, 0.14] },
  bubblegum: { label: 'Bubblegum', col: [0.88, 0.42, 0.62] },
  schlacke: { label: 'Schlacke', col: [0.30, 0.27, 0.25] },
});

export const CARD_ZONE_V2_FLUID_VERTEX_SHADER = [
  'attribute vec2 aFlow;',
  'varying vec3 vW;',
  'varying vec2 vFlow;',
  'void main(){',
  '  vec4 p = vec4(position, 1.0);',
  '  #ifdef USE_INSTANCING',
  '    p = instanceMatrix * p;',
  '  #endif',
  '  vec4 wp = modelMatrix * p;',
  '  vW = wp.xyz;',
  '  vFlow = aFlow;',
  '  gl_Position = projectionMatrix * viewMatrix * wp;',
  '}',
].join('\n');

export const CARD_ZONE_V2_FLUID_FRAGMENT_SHADER = [
  'uniform float uTime, uMoat, uHasMap; uniform vec3 uCol; uniform vec2 uZ;',
  'uniform sampler2D uDudv, uMap;',
  'varying vec3 vW;',
  'varying vec2 vFlow;',
  'float hh(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }',
  'float nz(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);',
  '  return mix(mix(hh(i), hh(i+vec2(1,0)), f.x), mix(hh(i+vec2(0,1)), hh(i+vec2(1,1)), f.x), f.y); }',
  'void main(){',
  '  float u = 0.5;',
  '  float fl = length(vFlow);',
  '  vec2 drift = mix(vec2(uTime * 0.02, uTime * 0.015), vFlow * uTime * 0.16, min(fl, 1.0));',
  '  vec2 duv = (texture2D(uDudv, vW.xz * 0.02 + drift).rg - 0.5) * 0.6;',
  '  vec2 adv = mix(vec2(uTime * 0.25, -uTime * 0.18), vFlow * uTime * 1.6, min(fl, 1.0));',
  '  float wave = nz(vW.xz * 0.09 + duv * 4.0 + adv);',
  '  float wave2 = nz(vW.xz * 0.31 + duv * 8.0 - adv * 1.5);',
  '  if (fl > 0.01) {',
  '    vec2 n2d = normalize(vFlow), t2d = vec2(-n2d.y, n2d.x);',
  '    float across = dot(vW.xz, t2d), along = dot(vW.xz, n2d);',
  '    float streak = nz(vec2(across * 0.5, along * 0.08 - uTime * 1.1));',
  '    wave = mix(wave, streak, 0.55);',
  '  }',
  '  vec3 mp = texture2D(uMap, vW.xz * 0.035 + duv * 0.5 + vec2(uTime * 0.012, -uTime * 0.009)).rgb;',
  '  float ml = dot(mp, vec3(0.299, 0.587, 0.114));',
  '  float tex = mix(1.0, 0.55 + ml * 0.9, uHasMap);',
  '  vec3 col = uCol * (0.55 + wave * 0.75) * tex + vec3(0.06, 0.07, 0.08) * wave2;',
  '  float shore = min(smoothstep(0.0, 0.22, u), smoothstep(1.0, 0.78, u));',
  '  float foam = smoothstep(0.55, 0.95, wave2) * (1.0 - shore);',
  '  col += vec3(0.7, 0.72, 0.7) * foam * 0.5;',
  '  float a = 0.72 + foam * 0.28;',
  '  gl_FragColor = vec4(col, a);',
  '}',
].join('\n');

/**
 * Exact texture-loader behavior used by the v2 donor:
 * RepeatWrapping, sRGB only for water.jpg, NoColorSpace for dudv, anisotropy 8.
 */
export function loadCardZoneV2FluidTextures(THREE, {
  dudvUrl = CARD_ZONE_V2_DUDV_URL,
  waterUrl = CARD_ZONE_V2_WATER_URL,
} = {}) {
  const loadOne = (url, srgb) => new Promise((resolve) => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    loader.load(url, (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      texture.anisotropy = 8;
      resolve(texture);
    }, undefined, () => resolve(null));
  });
  return Promise.all([
    loadOne(dudvUrl, false),
    loadOne(waterUrl, true),
  ]).then(([dudv, water]) => ({ dudv, water }));
}

/**
 * Consumer seam around the source-exact uniforms/material/GLSL.
 * The defaults for moat/zoneHalfX/zoneHalfZ are metadata only in the current GLSL:
 * uMoat/uZ remain declared by the v2 source but are not read after clipping moved to geometry.
 */
export function createCardZoneV2FluidMaterial(THREE, {
  fluid = 'wasser',
  moat = 3,
  zoneHalfX = 24,
  zoneHalfZ = 13.5,
  dudv = null,
  water = null,
} = {}) {
  const selected = CARD_ZONE_V2_FLUIDS[fluid] || CARD_ZONE_V2_FLUIDS.wasser;
  const uniforms = {
    uTime: { value: 0 },
    uCol: { value: new THREE.Color(selected.col[0], selected.col[1], selected.col[2]) },
    uMoat: { value: moat },
    uZ: { value: new THREE.Vector2(zoneHalfX, zoneHalfZ) },
    uDudv: { value: dudv },
    uMap: { value: water },
    uHasMap: { value: water ? 1 : 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -4,
    vertexShader: CARD_ZONE_V2_FLUID_VERTEX_SHADER,
    fragmentShader: CARD_ZONE_V2_FLUID_FRAGMENT_SHADER,
  });
  const api = {
    material,
    uniforms,
    setFluid(key) {
      const next = CARD_ZONE_V2_FLUIDS[key];
      if (!next) return api;
      uniforms.uCol.value.setRGB(next.col[0], next.col[1], next.col[2]);
      return api;
    },
    setTextures({ dudv: nextDudv = null, water: nextWater = null } = {}) {
      uniforms.uDudv.value = nextDudv;
      uniforms.uMap.value = nextWater;
      uniforms.uHasMap.value = nextWater ? 1 : 0;
      return api;
    },
    loadTextures(options = {}) {
      return loadCardZoneV2FluidTextures(THREE, options).then((textures) => {
        api.setTextures(textures);
        return api;
      });
    },
    // Source render loop writes elapsed seconds, not delta time.
    update(elapsedSeconds) {
      uniforms.uTime.value = elapsedSeconds;
      return api;
    },
    dispose() {
      material.dispose();
    },
  };
  return api;
}

/**
 * STORYTELLING-MAP ADAPTER SEAM — NOT PART OF THE ORIGINAL v2 DONOR.
 *
 * The original shader requires one vec2 aFlow per vertex:
 *   [0,0] = lake/still water
 *   normalized/tapered XZ vector = river current
 *
 * This helper only writes that required attribute to an existing geometry. It does not invent
 * river shape, shoreline, water level, bank math, or narrative routing.
 */
export function setCardZoneV2ConstantFlow(THREE, geometry, flowX = 0, flowZ = 0) {
  const position = geometry && geometry.getAttribute ? geometry.getAttribute('position') : null;
  if (!position) throw new Error('Card Zone v2 fluid requires geometry.position');
  const values = new Float32Array(position.count * 2);
  for (let i = 0; i < position.count; i++) {
    values[i * 2] = flowX;
    values[i * 2 + 1] = flowZ;
  }
  geometry.setAttribute('aFlow', new THREE.BufferAttribute(values, 2));
  return geometry;
}

export default createCardZoneV2FluidMaterial;
