// Environment Kit R1 · look (spec §3): Clay K2 class 'nature' + recolouring per palette slot.
// The kit colour stays in the vertex colour; the shader replaces it by the island palette colour of its slot
// (leaf · trunk · rock · bloom; snow and birch bark keep theirs), times the kit's own shade. uEnvRecolor = 0 shows
// the raw kit colours for comparison.
// BatchedMesh: per-instance data (group id, phase, stiffness, palette slot) live in a float texture indexed by the
// instance id; the clay relief and its seed follow the instance (otherwise all rotated copies share one relief frame).
import * as THREE from 'three';
import { clayMaterial } from '../clay';
import { ENV_ROLES, type IslandPalette } from '../palettes';

export const ENV_UNIFORMS = {
  uEnvRecolor: { value: 1 },
  uEnvTime: { value: 0 },
};

export interface EnvMaterial {
  material: THREE.Material;
  /** RGBA float per instance: group id, phase, stiffness, palette slot */
  data: Float32Array;
  tex: THREE.DataTexture;
}

export interface EnvContact {
  /** ground colour the foot takes on (Etherington contact), strength 0–1; the band runs from `from` (the ground line,
   *  = sink share) up to `band`, both as share of the object height */
  ground: string;
  strength: number;
  band: number;
  from?: number;
}

/** palette slot colours, index = shader slot: leaf light/mid/dark, bark, stone, bloom, grass, accent */
export function envSlotColours(pal: IslandPalette): THREE.Color[] {
  const r = ENV_ROLES[pal.id];
  const hex = r ? [r.leaf[0], r.leaf[1], r.leaf[2], r.bark[1], r.stone[1], r.bloom[1], r.grass[1], r.accent[1]]
    : [pal.leaf[0], pal.leaf[1], pal.leaf[2], pal.trunk, pal.rock, pal.leaf[2], pal.top2, pal.tower[0]];
  return hex.map((c) => new THREE.Color(c));
}

export function envMaterial(pal: IslandPalette, maxInstances: number, contact?: EnvContact): EnvMaterial {
  const W = Math.max(1, Math.ceil(Math.sqrt(maxInstances)));
  const data = new Float32Array(W * W * 4);
  const tex = new THREE.DataTexture(data, W, W, THREE.RGBAFormat, THREE.FloatType);
  tex.needsUpdate = true;
  const m = clayMaterial('nature', new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: 0.85 }));
  const cols = envSlotColours(pal);
  const U = {
    uEnvPal: { value: cols }, uEnvInst: { value: tex }, uEnvInstW: { value: W }, ...ENV_UNIFORMS,
    uEnvGround: { value: new THREE.Color(contact?.ground ?? '#000000') }, uEnvContact: { value: contact?.strength ?? 0 }, uEnvBand: { value: contact?.band ?? 0.1 }, uEnvBand0: { value: contact?.from ?? 0 },
  };
  const prev = m.onBeforeCompile.bind(m), prevKey = m.customProgramCacheKey.bind(m);
  m.onBeforeCompile = (sh, r) => {
    prev(sh, r);
    Object.assign(sh.uniforms, U);
    sh.vertexShader = /* glsl */`
attribute float envSlot;
attribute float envShade;
attribute float envFoot;
varying float vEnvSlot;
varying float vEnvShade;
varying float vEnvLeaf;
varying float vEnvFoot;
uniform sampler2D uEnvInst;
uniform float uEnvInstW;
` + sh.vertexShader.replace(' vClayP = position; vClayN = normal; vClaySeed = claySeed;', /* glsl */`
 vEnvSlot = envSlot; vEnvShade = envShade; vEnvLeaf = 0.0; vEnvFoot = envFoot;
#ifdef USE_BATCHING
 float envI = getIndirectIndex( gl_DrawID );
 vec4 envD = texelFetch( uEnvInst, ivec2( int( mod( envI, uEnvInstW ) ), int( floor( envI / uEnvInstW ) ) ), 0 );
 vEnvLeaf = envD.w;
 vEnvShade *= 0.95 + 0.1 * fract( sin( envI * 12.9898 ) * 43758.5453 );
 vClayP = ( batchingMatrix * vec4( position, 1.0 ) ).xyz; vClayN = mat3( batchingMatrix ) * normal;
 vClaySeed = claySeed + fract( vec3( 0.6180, 0.4142, 0.7320 ) * ( envI + 1.0 ) );
#else
 vClayP = position; vClayN = normal; vClaySeed = claySeed;
#endif`);
    sh.fragmentShader = /* glsl */`
uniform vec3 uEnvPal[8];
uniform float uEnvRecolor;
uniform vec3 uEnvGround;
uniform float uEnvContact, uEnvBand, uEnvBand0;
varying float vEnvFoot;
varying float vEnvSlot;
varying float vEnvShade;
varying float vEnvLeaf;
` + sh.fragmentShader.replace('#include <color_fragment>', /* glsl */`#include <color_fragment>
{
  int sl = int( vEnvSlot + 0.5 ), lv = int( vEnvLeaf + 0.5 );
  vec3 pc = diffuseColor.rgb;
  if ( sl == 0 ) pc = lv == 0 ? uEnvPal[1] : ( lv == 1 ? uEnvPal[0] : uEnvPal[2] );
  else if ( sl == 1 ) pc = uEnvPal[3];
  else if ( sl == 2 ) pc = uEnvPal[4];
  else if ( sl == 3 ) pc = uEnvPal[5];
  else if ( sl == 5 ) pc = uEnvPal[6];
  if ( sl != 4 ) pc *= vEnvShade;
  diffuseColor.rgb = mix( diffuseColor.rgb, pc, uEnvRecolor );
  // Etherington contact: the foot takes on the ground colour and darkens a little (no hard foot line)
  float fb = ( 1.0 - smoothstep( uEnvBand0, uEnvBand, vEnvFoot ) ) * uEnvContact;
  diffuseColor.rgb = mix( diffuseColor.rgb, uEnvGround, fb * 0.75 ) * ( 1.0 - 0.3 * fb );
}`);
  };
  m.customProgramCacheKey = () => prevKey() + '-env2';
  return { material: m, data, tex };
}
