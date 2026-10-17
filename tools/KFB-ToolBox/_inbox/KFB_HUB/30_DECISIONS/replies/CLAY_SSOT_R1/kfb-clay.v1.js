/* KFB Clay v1 · kfb.clay/1 · the ONE clay material for every KFB stage (WS0 CLAY_SSOT_R1, 17.10.2026)
 *
 * Why this file exists (Georg 17.10., FAIL): "the claymation texture is displayed differently EVERY SINGLE TIME".
 * The audit (RETURN.md) found five clay set-ups in circulation (K1 v8 in WS1, v8 + hand factor 1/0.47 in proof pages and WSB,
 * K2 v10 in the ToolBox, v10 "fine" in the Resident Atlas, plain Principled in Blender) and six technical causes of drift.
 * This module removes the causes by construction:
 *
 *   1. Scale relative to the object, never in world units. Relief coordinates are rest-pose object coordinates divided by a
 *      reference length (scaleRef, default = the object's own height). A face always gets the same relief density, whatever
 *      the stage scale (K, wscale, HK, figureH) is. Skinned meshes are measured through the skin (bone x inverse-bind scale).
 *   2. No UV, no texture, no projection. The relief is a solid 3D field in rest-pose object space; its gradient perturbs the
 *      normal directly. Nothing can stretch into stripes on curved faces, nothing tiles, nothing depends on UV seams.
 *      The character profile has only isotropic marks (lumps, thumb dents, grain); no strokes, no fans, no drags.
 *   3. Deterministic. Integer hash (PCG3D) on integer lattice cells: bit-exact on every GPU (no sin-hash), no Math.random,
 *      no time, no load order. The seed comes from the figure card (material.claySeed, else the card id) and is a uniform,
 *      not a vertex attribute (an absent claySeed attribute in K1 v8 reads undefined GL state).
 *   4. Three fixed profiles, one file: character · midground · background (CLAY_PROFILES, frozen). Aliases map the old
 *      names (figure-fine, figure, vehicle, prop, house, terrainBg, ...). Tools pass a profile NAME, never numbers.
 *   5. Distance bands in screen space, not pixels: each relief layer fades by the share of the viewport height its features
 *      cover (projection matrix + view depth, computed per vertex). No fwidth(), so DPR 1, 1.75 or 2 and 540p or 1080p give
 *      the same look; fades are smoothsteps, so nothing pops.
 *   6. Colour is respected (V-346): mottle is mean-preserving (±2.5–3.5 %), the optional palette pull is capped at 18 %
 *      (V-340), keeps the texel's lightness and never lowers its chroma. Matte (V-385): roughness >= 0.72/0.82/0.9,
 *      sheen <= 0.04, metalness 0, no emissive on figures. Tonemapping and light are NOT owned here: use kfb-stage-light.v1
 *      (applyTone 'aces', exposure 1) like the game.
 *
 * API (three.js r180, WebGL2; THREE is passed in, so the file is vendorable unchanged into Vite/R3F/plain pages):
 *   applyClay(target, THREE, { profile, seed, scaleRef, palette, pull, relief, skip }) -> handle
 *   removeClay(target) · clayOptionsFromCard(card) · resolveProfile(name) · seedFrom(value) · measureHeight(target, THREE)
 *   CLAY_PROFILES · PROFILE_ALIASES · MAX_PULL · SKIP_DEFAULT
 */

export const SCHEMA = 'kfb.clay/1';
export const VERSION = 'kfb-clay.v1';
export const MAX_PULL = 0.18;          // V-340: at most 18 % palette pull
export const SHEEN_MAX = 0.05;         // V-385
export const ROUGH_FLOOR = 0.6;        // WSB proposal "Knete-Look R2"

const F = Object.freeze;
/* Sizes are in units of scaleRef (1 = one reference length, for figures the figure height). slope = typical normal tilt.
 * bands: [gone, full] = share of the viewport height one feature must cover to be invisible / fully visible. */
export const CLAY_PROFILES = F({
  character: F({
    id: 'character', label: 'Figuren · fein (V-053)', scaleRef: 'object',
    lump: F({ size: 0.085, slope: 0.07 }),
    dent: F({ size: 0.034, density: 0.45, slope: 0.075, rim: 0.1, elong: 0.25 }),
    grain: F({ size: 0.0055, slope: 0.028 }),
    facet: F({ size: 0.0, slope: 0.0 }),
    bands: F({ lump: F([1 / 160, 1 / 50]), dent: F([1 / 480, 1 / 150]), grain: F([1 / 520, 1 / 190]), facet: F([1, 1]) }),
    mottle: 0.025, maxSlope: 0.2, roughMin: 0.72, sheen: 0.04, srcNormalK: 0.5, emissive: false,
  }),
  midground: F({
    id: 'midground', label: 'Dioramen · Requisiten', scaleRef: 'object',
    lump: F({ size: 0.12, slope: 0.07 }),
    dent: F({ size: 0.05, density: 0.5, slope: 0.11, rim: 0.15, elong: 0.35 }),
    grain: F({ size: 0.008, slope: 0.04 }),
    facet: F({ size: 0.09, slope: 0.05 }),
    bands: F({ lump: F([1 / 200, 1 / 60]), dent: F([1 / 480, 1 / 150]), grain: F([1 / 520, 1 / 190]), facet: F([1 / 400, 1 / 120]) }),
    mottle: 0.03, maxSlope: 0.26, roughMin: 0.82, sheen: 0.02, srcNormalK: 0.6, emissive: true,
  }),
  background: F({
    id: 'background', label: 'Gelände · Ferne (ruhig)', scaleRef: 'object',
    lump: F({ size: 0.45, slope: 0.06 }),
    dent: F({ size: 0.2, density: 0.35, slope: 0.08, rim: 0.1, elong: 0.4 }),
    grain: F({ size: 0.0, slope: 0.0 }),
    facet: F({ size: 0.3, slope: 0.045 }),
    bands: F({ lump: F([1 / 300, 1 / 80]), dent: F([1 / 500, 1 / 160]), grain: F([1, 1]), facet: F([1 / 400, 1 / 120]) }),
    mottle: 0.035, maxSlope: 0.18, roughMin: 0.9, sheen: 0.0, srcNormalK: 0.4, emissive: true,
  }),
});
export const PROFILE_ALIASES = F({
  'figure-fine': 'character', fine: 'character', figure: 'character', face: 'character', actor: 'character',
  vehicle: 'midground', prop: 'midground', house: 'midground', road: 'midground', nature: 'midground', mid: 'midground', diorama: 'midground', stage: 'midground', terrainFg: 'midground',
  terrain: 'background', terrainBg: 'background', far: 'background', large: 'background', cloud: 'background', world: 'background',
});
export function resolveProfile(name = 'character') {
  if (name && typeof name === 'object' && name.id && CLAY_PROFILES[name.id]) return CLAY_PROFILES[name.id];
  const id = CLAY_PROFILES[name] ? name : PROFILE_ALIASES[name];
  if (!id) throw new Error(`kfb-clay: unknown profile "${name}" (use ${Object.keys(CLAY_PROFILES).join(' | ')})`);
  return CLAY_PROFILES[id];
}

/* Seed: number -> uint32 as is; anything else -> FNV-1a of its string. Never random. */
const fnv1a = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; };
export function seedFrom(v) { return typeof v === 'number' && Number.isFinite(v) ? (Math.floor(Math.abs(v)) >>> 0) : fnv1a(String(v ?? 'kfb')); }
const mix32 = (h) => { h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15; h = Math.imul(h, 0x846ca68b); h ^= h >>> 16; return h >>> 0; };
const seedVec = (seed, key) => { const h = fnv1a(seed + '|' + key); return [mix32(h) & 0xfffff, mix32(h ^ 0x9e3779b9) & 0xfffff, mix32(h ^ 0x85ebca6b) & 0xfffff]; }; // < 2^20: exact in float32

/* Figure card -> options. Card holds only the NAME (material.clayProfile) plus optional claySeed / clayScaleRef. */
export function clayOptionsFromCard(card) {
  const m = (card && card.material) || {};
  return { profile: resolveProfile(m.clayProfile || 'character').id, seed: m.claySeed ?? card?.id ?? 'kfb', scaleRef: m.clayScaleRef ?? 'object' };
}

export const SKIP_DEFAULT = /eye|pupil|iris|(^|[^a-z])lid|mouth|teeth|tongue|lash|kfb-lid|clay-lid|eyerig|facehost|face-host|decal|kfb_screen_slot/i;

const cbrtDet = (m) => Math.cbrt(Math.abs(m.determinant()));
/* World length of one local unit of the mesh. Skinned: three renders world = B * bindMatrix * p (attached) or
 * model * bindInv * B * bind * p (detached), B = bone.matrixWorld * boneInverse. Determinants ignore rotations, so this is pose-independent. */
function meshWorldScale(THREE, mesh) {
  if (mesh.isSkinnedMesh && mesh.skeleton && mesh.skeleton.bones.length) {
    const sk = mesh.skeleton, B = new THREE.Matrix4(), s = [];
    sk.bones.forEach((b, i) => { B.multiplyMatrices(b.matrixWorld, sk.boneInverses[i]); const d = cbrtDet(B); if (d > 1e-9 && Number.isFinite(d)) s.push(d); });
    s.sort((a, b) => a - b); const sB = s.length ? s[s.length >> 1] : 1;
    return mesh.bindMode === 'detached' ? cbrtDet(mesh.matrixWorld) * sB : sB * cbrtDet(mesh.bindMatrix);
  }
  return cbrtDet(mesh.matrixWorld);
}
/* Height of the object in world units (skin applied, current pose). Pass a fixed scaleRef if the pose at apply time can vary. */
export function measureHeight(target, THREE) {
  target.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(target, true);
  const h = b.max.y - b.min.y;
  return Number.isFinite(h) && h > 1e-6 ? h : 1;
}

const VERT_DECL = /* glsl */`
uniform float uClayK;
varying vec3 vClayP;
varying vec3 vClayN;
varying mat3 vClayNM;
varying float vClayVH;
`;
const VERT_MAIN = /* glsl */`
  vClayP = position * uClayK;                       // rest pose, object space, in reference lengths
  vClayN = normal;
  mat3 clayL = mat3( modelViewMatrix );
  mat3 clayNM = normalMatrix;
  #ifdef USE_INSTANCING
    clayL = clayL * mat3( instanceMatrix ); clayNM = clayNM * mat3( instanceMatrix );
  #endif
  #ifdef USE_SKINNING
    clayL = clayL * mat3( skinMatrix ); clayNM = clayNM * mat3( skinMatrix );
  #endif
  vClayNM = clayNM;
  float clayS = ( length( clayL[ 0 ] ) + length( clayL[ 1 ] ) + length( clayL[ 2 ] ) ) / 3.0;   // view units per local unit
  float clayD = isOrthographic ? 1.0 : max( 1e-4, - mvPosition.z );
  vClayVH = clayS / max( uClayK, 1e-9 ) * projectionMatrix[ 1 ][ 1 ] * 0.5 / clayD;          // viewport heights per reference length
`;
const FRAG_DECL = /* glsl */`
uniform float uClayOn, uClayRelief, uClayMaxSlope, uClayMinRough, uClayMottle, uClayPull;
uniform vec3 uClaySeed;
uniform vec2 uClayLump, uClayGrain, uClayFacet, uClayBandL, uClayBandD, uClayBandG, uClayBandF;
uniform vec4 uClayDent;
uniform float uClayDentE;
uniform vec3 uClayPal[ 8 ];
uniform int uClayPalN;
varying vec3 vClayP;
varying vec3 vClayN;
varying mat3 vClayNM;
varying float vClayVH;

uvec3 kfbPcg3( uvec3 v ) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  return v;
}
vec3 kfbH3( ivec3 c, uvec3 s ) { return vec3( kfbPcg3( uvec3( c + 1048576 ) ^ s ) >> 8u ) * ( 1.0 / 16777216.0 ); }
float kfbH1( ivec3 c, uvec3 s ) { return float( kfbPcg3( uvec3( c + 1048576 ) ^ s ).x >> 8u ) * ( 1.0 / 16777216.0 ); }
/* value noise with analytic derivative, value in [-1,1] (Quilez) */
vec4 kfbNoiseD( vec3 x, uvec3 s ) {
  vec3 fl = floor( x ); ivec3 i = ivec3( fl ); vec3 f = x - fl;
  vec3 u = f * f * f * ( f * ( f * 6.0 - 15.0 ) + 10.0 );
  vec3 du = 30.0 * f * f * ( f * ( f - 2.0 ) + 1.0 );
  float a = kfbH1( i, s ), b = kfbH1( i + ivec3( 1, 0, 0 ), s ), c = kfbH1( i + ivec3( 0, 1, 0 ), s ), d = kfbH1( i + ivec3( 1, 1, 0 ), s );
  float e = kfbH1( i + ivec3( 0, 0, 1 ), s ), g = kfbH1( i + ivec3( 1, 0, 1 ), s ), h = kfbH1( i + ivec3( 0, 1, 1 ), s ), k = kfbH1( i + ivec3( 1, 1, 1 ), s );
  float k1 = b - a, k2 = c - a, k3 = e - a, k4 = a - b - c + d, k5 = a - c - e + h, k6 = a - b - e + g, k7 = - a + b + c - d + e - g - h + k;
  float v = a + k1 * u.x + k2 * u.y + k3 * u.z + k4 * u.x * u.y + k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z;
  vec3 dv = du * vec3( k1 + k4 * u.y + k6 * u.z + k7 * u.y * u.z, k2 + k5 * u.z + k4 * u.x + k7 * u.z * u.x, k3 + k6 * u.x + k5 * u.y + k7 * u.x * u.y );
  return vec4( 2.0 * v - 1.0, 2.0 * dv );
}
/* thumb dents: soft Gaussian bowl + faint wide rim, randomly oriented mild ellipse, x in cells; returns height gradient (slope).
   No hard edge anywhere (a (1-r^2)^2 bowl with a narrow rim read as moon craters in the first proof). */
vec3 kfbDents( vec3 x, uvec3 s, float dens, float slope, float rim, float elong ) {
  vec3 b = floor( x - 0.5 ); vec3 g = vec3( 0.0 );
  for ( int kk = 0; kk < 2; kk ++ ) for ( int jj = 0; jj < 2; jj ++ ) for ( int ii = 0; ii < 2; ii ++ ) {
    ivec3 c = ivec3( b ) + ivec3( ii, jj, kk );
    vec3 r = kfbH3( c, s ); if ( r.x > dens ) continue;
    vec3 o = vec3( c ) + 0.25 + 0.5 * kfbH3( c, s ^ uvec3( 0x9E37u, 0x79B9u, 0x7F4Au ) );
    float R = 0.26 + 0.14 * r.y;
    vec3 a = normalize( kfbH3( c, s ^ uvec3( 0x85EBu, 0xCA6Bu, 0xC2B2u ) ) - 0.5 + 1e-4 );
    float ek = elong * r.z;
    vec3 q = x - o; vec3 u = q - ek * a * dot( a, q );
    float lu = length( u ), rr = lu / R; if ( rr > 1.6 ) continue;
    float D = slope * R / 1.356 * ( 0.7 + 0.6 * fract( r.y * 7.31 + r.z ) );
    float dh = 5.0 * D * rr * exp( - 2.5 * rr * rr );
    float zr = ( rr - 1.0 ) / 0.35; dh += rim * D * ( - 2.0 * zr / 0.35 ) * exp( - zr * zr );
    g += dh * ( u - ek * a * dot( a, u ) ) / ( max( lu, 1e-5 ) * R );
  }
  return g;
}
/* pressed facets: Voronoi cells tilted a little, tilt fades to zero at the cell border (no hard creases) */
vec3 kfbFacets( vec3 x, uvec3 s, float slope ) {
  ivec3 b = ivec3( floor( x ) ); float d1 = 1e9, d2 = 1e9; ivec3 c1 = b;
  for ( int kk = - 1; kk <= 1; kk ++ ) for ( int jj = - 1; jj <= 1; jj ++ ) for ( int ii = - 1; ii <= 1; ii ++ ) {
    ivec3 c = b + ivec3( ii, jj, kk );
    vec3 o = vec3( c ) + 0.15 + 0.7 * kfbH3( c, s ); vec3 r = x - o; float d = dot( r, r );
    if ( d < d1 ) { d2 = d1; d1 = d; c1 = c; } else if ( d < d2 ) { d2 = d; }
  }
  float edge = smoothstep( 0.0, 0.35, sqrt( d2 ) - sqrt( d1 ) );
  float press = smoothstep( 0.2, 0.7, kfbH1( c1, s ^ uvec3( 7u, 11u, 13u ) ) );
  return ( kfbH3( c1, s ^ uvec3( 0x51u, 0xA7u, 0x3Cu ) ) * 2.0 - 1.0 ) * slope * edge * press;
}
vec3 kfbClayGrad( vec3 p, float vh ) {
  uvec3 s = uvec3( uClaySeed ); vec3 g = vec3( 0.0 ); float w;
  if ( uClayLump.y > 0.0 ) { w = smoothstep( uClayBandL.x, uClayBandL.y, uClayLump.x * vh );
    if ( w > 0.0 ) { vec4 n1 = kfbNoiseD( p / uClayLump.x, s ^ uvec3( 1u, 2u, 3u ) ), n2 = kfbNoiseD( p * ( 2.07 / uClayLump.x ) + 17.3, s ^ uvec3( 4u, 5u, 6u ) );
      g += w * uClayLump.y / 1.5 * ( n1.yzw + 0.5 * n2.yzw ) / 1.5; } }
  if ( uClayFacet.y > 0.0 ) { w = smoothstep( uClayBandF.x, uClayBandF.y, uClayFacet.x * vh );
    if ( w > 0.0 ) g += w * kfbFacets( p / uClayFacet.x, s ^ uvec3( 21u, 22u, 23u ), uClayFacet.y ); }
  if ( uClayDent.z > 0.0 ) { w = smoothstep( uClayBandD.x, uClayBandD.y, uClayDent.x * vh );
    if ( w > 0.0 ) g += w * kfbDents( p / uClayDent.x, s ^ uvec3( 31u, 32u, 33u ), uClayDent.y, uClayDent.z, uClayDent.w, uClayDentE ); }
  if ( uClayGrain.y > 0.0 ) { w = smoothstep( uClayBandG.x, uClayBandG.y, uClayGrain.x * vh );
    if ( w > 0.0 ) { vec4 n = kfbNoiseD( p / uClayGrain.x, s ^ uvec3( 41u, 42u, 43u ) ); g += w * uClayGrain.y / 1.5 * n.yzw; } }
  return g;
}
vec3 kfbToOk( vec3 c ) {
  vec3 lms = vec3( 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b, 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b, 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b );
  lms = pow( max( lms, vec3( 0.0 ) ), vec3( 1.0 / 3.0 ) );
  return vec3( 0.2104542553 * lms.x + 0.7936177850 * lms.y - 0.0040720468 * lms.z, 1.9779984951 * lms.x - 2.4285922050 * lms.y + 0.4505937099 * lms.z, 0.0259040371 * lms.x + 0.7827717662 * lms.y - 0.8086757660 * lms.z );
}
vec3 kfbFromOk( vec3 L ) {
  float l = L.x + 0.3963377774 * L.y + 0.2158037573 * L.z, m = L.x - 0.1055613458 * L.y - 0.0638541728 * L.z, s = L.x - 0.0894841775 * L.y - 1.2914855480 * L.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3( 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, - 1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, - 0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s );
}
/* palette pull <= 18 %: hue toward the nearest palette colour, lightness kept, chroma never lowered (V-346) */
vec3 kfbPull( vec3 c ) {
  vec3 L = kfbToOk( c ); float C = length( L.yz ); if ( C < 0.02 ) return c;
  float best = 1e9; vec3 P = L;
  for ( int i = 0; i < 8; i ++ ) { if ( i >= uClayPalN ) break; vec3 Q = kfbToOk( uClayPal[ i ] ); vec3 d = Q - L; d.x *= 0.5; float e = dot( d, d ); if ( e < best ) { best = e; P = Q; } }
  vec2 ab = mix( L.yz, P.yz, uClayPull ); float C2 = length( ab ); if ( C2 < C && C2 > 1e-5 ) ab *= C / C2;
  return max( kfbFromOk( vec3( L.x, ab ) ), vec3( 0.0 ) );
}
`;
const FRAG_COLOR = /* glsl */`
if ( uClayOn > 0.5 ) {
  if ( uClayMottle > 0.0 ) diffuseColor.rgb *= 1.0 + uClayMottle * kfbNoiseD( vClayP / ( uClayLump.x * 1.6 ) + 31.7, uvec3( uClaySeed ) ^ uvec3( 9u, 8u, 7u ) ).x;
  if ( uClayPull > 0.0 && uClayPalN > 0 ) diffuseColor.rgb = kfbPull( diffuseColor.rgb );
}
`;
const FRAG_NORMAL = /* glsl */`
if ( uClayOn > 0.5 && uClayRelief > 0.5 ) {
  vec3 clayN0 = normalize( vClayN );
  vec3 clayG = kfbClayGrad( vClayP, vClayVH );
  clayG -= clayN0 * dot( clayG, clayN0 );
  float clayGl = length( clayG ); if ( clayGl > uClayMaxSlope ) clayG *= uClayMaxSlope / clayGl;
  vec3 clayDV = normalize( vClayNM * normalize( clayN0 - clayG ) ) - normalize( vClayNM * clayN0 );
  #ifdef DOUBLE_SIDED
    clayDV *= faceDirection;
  #endif
  normal = normalize( normal + clayDV );
}
`;
const FRAG_ROUGH = /* glsl */`
if ( uClayOn > 0.5 ) roughnessFactor = max( roughnessFactor, uClayMinRough );
`;
const FRAG_METAL = /* glsl */`
if ( uClayOn > 0.5 ) metalnessFactor = 0.0;
`;
export const GLSL = F({ VERT_DECL, VERT_MAIN, FRAG_DECL, FRAG_COLOR, FRAG_NORMAL, FRAG_ROUGH, FRAG_METAL });

function profileUniforms(THREE, P, { palette = null, pull = 0, relief = true } = {}) {
  const pal = Array.from({ length: 8 }, () => new THREE.Color());
  const cols = (palette || []).slice(0, 8);
  cols.forEach((c, i) => pal[i].set(c));
  return {
    uClayOn: { value: 1 }, uClayRelief: { value: relief ? 1 : 0 },
    uClayMaxSlope: { value: P.maxSlope }, uClayMinRough: { value: Math.max(ROUGH_FLOOR, P.roughMin) }, uClayMottle: { value: P.mottle },
    uClayPull: { value: cols.length ? Math.min(MAX_PULL, Math.max(0, +pull || 0)) : 0 }, uClayPal: { value: pal }, uClayPalN: { value: cols.length },
    uClayLump: { value: new THREE.Vector2(P.lump.size || 1, P.lump.slope) },
    uClayGrain: { value: new THREE.Vector2(P.grain.size || 1, P.grain.slope) },
    uClayFacet: { value: new THREE.Vector2(P.facet.size || 1, P.facet.slope) },
    uClayDent: { value: new THREE.Vector4(P.dent.size || 1, P.dent.density, P.dent.slope, P.dent.rim) }, uClayDentE: { value: P.dent.elong },
    uClayBandL: { value: new THREE.Vector2(...P.bands.lump) }, uClayBandD: { value: new THREE.Vector2(...P.bands.dent) },
    uClayBandG: { value: new THREE.Vector2(...P.bands.grain) }, uClayBandF: { value: new THREE.Vector2(...P.bands.facet) },
  };
}

function convertible(m) {
  return !!m && !m.isShaderMaterial && !m.isMeshBasicMaterial && !m.isSpriteMaterial && !m.isPointsMaterial && !m.isLineBasicMaterial && !m.isShadowMaterial &&
    (m.isMeshStandardMaterial || m.isMeshPhongMaterial || m.isMeshLambertMaterial || m.isMeshToonMaterial) && !(m.transparent && (m.opacity == null || m.opacity < 0.98)) && m.alphaHash !== true;
}

function makeClayMaterial(THREE, src, P, shared, mine) {
  const phys = P.sheen > 0;
  const m = phys ? new THREE.MeshPhysicalMaterial() : new THREE.MeshStandardMaterial();
  m.name = 'kfb-clay:' + P.id + ':' + (src.name || '');
  if (src.color) m.color.copy(src.color);
  m.map = src.map || null;
  m.vertexColors = !!src.vertexColors;
  if (src.normalMap) { m.normalMap = src.normalMap; m.normalMapType = src.normalMapType; m.normalScale.copy(src.normalScale).multiplyScalar(P.srcNormalK); } // multiply, never setScalar (glTF Y flip)
  if (src.aoMap) { m.aoMap = src.aoMap; m.aoMapIntensity = src.aoMapIntensity ?? 1; }
  m.roughness = Math.max(P.roughMin, src.roughness ?? 1); m.roughnessMap = src.roughnessMap || null;
  m.metalness = 0; m.metalnessMap = null;
  if (P.emissive && src.emissive) { m.emissive.copy(src.emissive); m.emissiveMap = src.emissiveMap || null; m.emissiveIntensity = src.emissiveIntensity ?? 1; }
  m.alphaTest = src.alphaTest || 0; m.side = src.side; m.flatShading = !!src.flatShading; m.fog = src.fog !== false;
  if (phys) { m.sheen = Math.min(SHEEN_MAX, P.sheen); m.sheenRoughness = 0.9; m.sheenColor.setRGB(1, 1, 1); m.specularIntensity = 0.5; m.clearcoat = 0; }
  m.userData.kfbClay = { schema: SCHEMA, version: VERSION, profile: P.id, src, k: mine.uClayK.value, seed: mine.uClaySeed.value.toArray() };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, shared, mine);
    sh.vertexShader = VERT_DECL + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n' + VERT_MAIN);
    sh.fragmentShader = FRAG_DECL + sh.fragmentShader
      .replace('#include <color_fragment>', '#include <color_fragment>\n' + FRAG_COLOR)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n' + FRAG_ROUGH)
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\n' + FRAG_METAL)
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + FRAG_NORMAL);
  };
  m.customProgramCacheKey = () => VERSION;
  return m;
}

/** Restore the original materials under target (meshes converted by applyClay). */
export function removeClay(target) {
  let n = 0;
  target.traverse((o) => {
    const orig = o.userData && o.userData.kfbClayOrig; if (!orig) return;
    [].concat(o.material).forEach((m) => { if (m && m.userData && m.userData.kfbClay) m.dispose(); });
    o.material = orig; delete o.userData.kfbClayOrig; n++;
  });
  return n;
}

/**
 * Turn every eligible mesh under target into KFB clay.
 * opts.profile   'character' | 'midground' | 'background' (aliases accepted, numbers never)
 * opts.seed      claySeed from the figure card (number or string); default = target.name. Never random.
 * opts.scaleRef  'object' (measured height, world units) or a number = reference length in world units at apply time
 *                (stages pass their figure height for props/terrain so hand marks match the cast).
 * opts.palette   up to 8 hex colours; opts.pull 0..0.18 (clamped)
 * opts.relief    false = colour/roughness only (proof switch)
 * opts.skip      RegExp on the mesh path or (mesh) => boolean; default SKIP_DEFAULT (eyes, lids, mouth, teeth, decals)
 * Call it after loading and before animation starts (or pass a fixed scaleRef): the measured height uses the current pose.
 */
export function applyClay(target, THREE, opts = {}) {
  if (!target || !THREE) throw new Error('kfb-clay: applyClay(target, THREE, opts)');
  const P = resolveProfile(opts.profile || 'character');
  removeClay(target);
  target.updateMatrixWorld(true);
  const ref = typeof opts.scaleRef === 'number' && opts.scaleRef > 0 ? opts.scaleRef : measureHeight(target, THREE);
  const seed = seedFrom(opts.seed ?? target.name ?? 'kfb');
  const skip = opts.skip || SKIP_DEFAULT;
  const shared = profileUniforms(THREE, P, opts);
  const pathOf = (o) => { const a = []; for (let n = o; n && n !== target.parent; n = n.parent) a.push(n.name || ''); return a.reverse().join('/'); };
  const meshes = [], skipped = []; let idx = 0;
  target.traverse((o) => {
    if (!o.isMesh) return;
    const key = o.name || '#' + idx; idx++;
    const path = pathOf(o);
    if ((skip instanceof RegExp ? skip.test(path) : skip(o)) || !o.geometry || !o.geometry.attributes.position || !o.geometry.attributes.normal) { skipped.push(path); return; }
    const k = meshWorldScale(THREE, o) / ref;
    const mine = { uClayK: { value: k }, uClaySeed: { value: new THREE.Vector3(...seedVec(seed, key)) } };
    const before = o.material, conv = (m) => (convertible(m) ? makeClayMaterial(THREE, m, P, shared, mine) : m);
    const after = Array.isArray(before) ? before.map(conv) : conv(before);
    if ([].concat(after).some((m, i) => m !== [].concat(before)[i])) { o.userData.kfbClayOrig = before; o.material = after; meshes.push({ path, k: +k.toPrecision(6) }); }
    else skipped.push(path);
  });
  return {
    schema: SCHEMA, version: VERSION, profile: P.id, seed, scaleRef: ref, uniforms: shared, meshes, skipped,
    info: () => ({ schema: SCHEMA, version: VERSION, profile: P.id, seed, scaleRef: +ref.toPrecision(6), meshes: meshes.length, skipped: skipped.length, k: meshes.map((m) => m.k) }),
    setRelief: (on) => { shared.uClayRelief.value = on ? 1 : 0; },
    setEnabled: (on) => { shared.uClayOn.value = on ? 1 : 0; },
    remove: () => removeClay(target),
  };
}
