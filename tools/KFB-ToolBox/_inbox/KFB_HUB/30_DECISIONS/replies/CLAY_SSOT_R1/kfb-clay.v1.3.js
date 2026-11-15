/* KFB Clay v1.3 · kfb.clay/1 · CANDIDATE (no release before Georg's PASS on in-game images) · WS-Design CLAY_REFERENZ_R2, 16.11.2026
 *
 * Why: v1.2 "Lichtkante" was TUNE in the game (Georg q718): "looks as if FB was shot full of holes by a machine gun; that is no
 * claymation look". Real clay has no holes: large calm areas, soft round edges, very fine finger grooves, thin crease lines, a light
 * sheen. The form carries the detail, the surface only a little. v1.3 starts again from v1.1 (v1.2 is not continued) and is measured on
 * replies/CLAY_REFERENZ_R2 (Claybound stills + clay balls). Numbers and the picture each value was read from: RETURN_v13_stilbild.md.
 * Unchanged from v1.1 (byte for byte): seed handling, scale relative to the object (through the skin), no UV / texture / sin / fwidth,
 * distance bands in viewport shares, colour rules (V-346, V-340), matte rules (V-385: roughness and sheen per profile as v1.1), lump and
 * facet layers, material build, API. The three profiles stay character / midground / background (V-662: kit-figure stays the game's
 * uniform override on top of character and is not changed here).
 * The same five layer slots as v1.1 (so clayBake and kit-figure keep working), three of them with a new building block:
 *   dent2 = THUMB PRESS (Daumenflaeche), replaces the large bowls. A press flattens a cap of the surface: relative to the curved surface a
 *           flat cut is a paraboloid, so its slope grows linearly from 0 in the centre to the rim and then fades over a soft knee. On a
 *           curved form this cancels the curvature (the press reads as a flat facet with a soft edge, like the BlenderKit clay ball); on a
 *           flat form it is a very shallow dish. No wall, no rim ridge, no crater. Fewer and larger than v1.1.
 *   dent  = CREASE (Knickfalte), replaces the small dents (the "machine gun"). A few short, thin, slightly bent lines where the clay was
 *           compressed or folded (orange Claybound rocks): a narrow Gaussian groove that tapers at both ends.
 *   grain = FINGER GROOVES (Fingerrillen), replaces the value-noise grain. Patches of very fine, shallow, wavy parallel grooves, one random
 *           direction per patch in the surface plane (purple Claybound slab, fingerprints on the clay ball). Near only (distance band).
 *           The wave is a smooth periodic polynomial of fract(), not sin (bit-exact across GPUs).
 * All three live in object space (3D, no UV): they lie seamlessly on every form, which is what triplanar mapping buys a texture workflow.
 * Uniform slots: uClayDent2 = (cell, density, slope at the rim, knee), uClayDent2E = (elongMax, sigma, median radius in cells, -);
 *   uClayDent = (cell, density, side slope, -), uClayDentE = (half length, width, bend; all in cells, -);
 *   uClayGrain = (wavelength, slope), uClayGrooveX = (patch cell in wavelengths, patch cover, warp) (new uniform).
 *
 * API (identical to v1.1; three.js r180, WebGL2; THREE is passed in):
 *   applyClay(target, THREE, { profile, seed, scaleRef, palette, pull, relief, skip }) -> handle
 *   removeClay(target) · clayOptionsFromCard(card) · resolveProfile(name) · seedFrom(value) · measureHeight(target, THREE)
 *   CLAY_PROFILES · PROFILE_ALIASES · MAX_PULL · SKIP_DEFAULT
 */

export const SCHEMA = 'kfb.clay/1';
export const VERSION = 'kfb-clay.v1.3';
export const MAX_PULL = 0.18;          // V-340: at most 18 % palette pull
export const SHEEN_MAX = 0.05;         // V-385
export const ROUGH_FLOOR = 0.6;        // WSB proposal "Knete-Look R2"

const F = Object.freeze;
/* Sizes are in units of scaleRef (1 = one reference length, for figures the figure height). slope = steepest normal tilt of a median feature.
 * dent2 (thumb press): size = cell, density = presses per cell (before the cluster field), slope = tilt at the rim, knee = soft edge width
 *   (share of the radius), elong = largest length/width, sigma = log-normal spread of the radius, radius = median radius in cells.
 * dent (crease): size = cell, density = creases per cell, slope = side tilt of the groove, len = half length, width = groove width,
 *   bend = sideways bow (len, width, bend in cells).
 * grain (finger grooves): size = groove wavelength, slope = groove tilt, patch = patch cell in wavelengths, cover = share of patch cells
 *   that hold grooves, warp = waviness (in wavelengths).
 * bands: [gone, full] = share of the viewport height one feature must cover to be invisible / fully visible. Creases and grooves are keyed
 *   so that the line is at least ~1.5 px wide (1080p) when full and fades out below ~0.6 px (no shimmer).
 * v1.1 -> v1.3: the lump stays (character quieter: slope 0.16 -> 0.08), facets stay (midground, background), colour and matte rules stay. */
export const CLAY_PROFILES = F({
  character: F({
    id: 'character', label: 'Figuren · am glattesten (Claybound) · v1.3', scaleRef: 'object',
    lump: F({ size: 0.085, slope: 0.08 }),
    dent: F({ size: 0.12, density: 0.12, slope: 0.10, len: 0.36, width: 0.03, bend: 0.25 }),
    dent2: F({ size: 0.1, density: 0.3, slope: 0.12, knee: 0.18, elong: 1.6, sigma: 0.3, radius: 0.35 }),
    grain: F({ size: 0.0045, slope: 0.05, patch: 10, cover: 0.35, warp: 0.35 }),
    facet: F({ size: 0.0, slope: 0.0 }),
    bands: F({ lump: F([1 / 160, 1 / 50]), dent: F([1 / 54, 1 / 22]), dent2: F([1 / 480, 1 / 150]), grain: F([1 / 300, 1 / 120]), facet: F([1, 1]) }),
    mottle: 0.025, maxSlope: 0.34, roughMin: 0.72, sheen: 0.04, srcNormalK: 0.5, emissive: false,
  }),
  midground: F({
    id: 'midground', label: 'Dioramen · Requisiten · Fels · v1.3', scaleRef: 'object',
    lump: F({ size: 0.12, slope: 0.09 }),
    dent: F({ size: 0.14, density: 0.35, slope: 0.16, len: 0.38, width: 0.035, bend: 0.3 }),
    dent2: F({ size: 0.16, density: 0.3, slope: 0.10, knee: 0.18, elong: 1.8, sigma: 0.3, radius: 0.35 }),
    grain: F({ size: 0.006, slope: 0.06, patch: 12, cover: 0.4, warp: 0.35 }),
    facet: F({ size: 0.09, slope: 0.05 }),
    bands: F({ lump: F([1 / 200, 1 / 60]), dent: F([1 / 63, 1 / 25]), dent2: F([1 / 480, 1 / 150]), grain: F([1 / 300, 1 / 120]), facet: F([1 / 400, 1 / 120]) }),
    mottle: 0.03, maxSlope: 0.36, roughMin: 0.82, sheen: 0.02, srcNormalK: 0.6, emissive: true,
  }),
  background: F({
    id: 'background', label: 'Gelände · Ferne (ruhig) · v1.3', scaleRef: 'object',
    lump: F({ size: 0.45, slope: 0.07 }),
    dent: F({ size: 0.5, density: 0.2, slope: 0.08, len: 0.38, width: 0.04, bend: 0.3 }),
    dent2: F({ size: 0.5, density: 0.3, slope: 0.08, knee: 0.2, elong: 1.8, sigma: 0.3, radius: 0.35 }),
    grain: F({ size: 0.0, slope: 0.0, patch: 12, cover: 0.0, warp: 0.0 }),
    facet: F({ size: 0.3, slope: 0.045 }),
    bands: F({ lump: F([1 / 300, 1 / 80]), dent: F([1 / 72, 1 / 29]), dent2: F([1 / 500, 1 / 160]), grain: F([1, 1]), facet: F([1 / 400, 1 / 120]) }),
    mottle: 0.035, maxSlope: 0.24, roughMin: 0.9, sheen: 0.0, srcNormalK: 0.4, emissive: true,
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
uniform vec4 uClayDent, uClayDentE, uClayDent2, uClayDent2E;
uniform vec2 uClayBandD2;
uniform vec3 uClayGrooveX;
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
/* v1.3 cluster field: the chance that a cell holds a feature (two coarse octaves, 2 and 4 cells; 0.35 = calm area, 2 = dense patch). As v1.1. */
float kfbField( ivec3 c, uvec3 s ) {
  float q2 = kfbH1( c >> 1, s ^ uvec3( 0x2C1Bu, 0x3C6Eu, 0x0F11u ) ), q4 = kfbH1( c >> 2, s ^ uvec3( 0x1B87u, 0x7F4Au, 0x2545u ) );
  return 0.35 + 1.65 * smoothstep( 0.15, 0.85, 0.5 * ( q2 + q4 ) );
}
/* v1.3 THUMB PRESS. x in cells. P = (cell, density, slope at rim S, knee k), E = (elongMax, sigma, median radius in cells, -).
   Oval support: u = q - (1 - 1/e) a (a.q), rr = |u| / R. A flat cut relative to the curved surface is a paraboloid:
     dh/drr = S R rr W(rr),  W = 1 - smoothstep(1 - k, 1 + k, rr)   ->   grad h = S rr W (M u / |u|)
   slope 0 in the centre, S at the rim, then a soft knee to 0 (soft convex edge). No wall, no rim ridge, no crater. */
vec3 kfbPressLayer( vec3 x, uvec3 s, vec4 P, vec4 E ) {
  vec3 b = floor( x ); vec3 grad = vec3( 0.0 );
  float dens = P.y, S = P.z, kn = clamp( P.w, 0.02, 0.6 ), eMax = max( 1.0, E.x ), sig = E.y, R0 = E.z;
  for ( int kk = - 1; kk <= 1; kk ++ ) for ( int jj = - 1; jj <= 1; jj ++ ) for ( int ii = - 1; ii <= 1; ii ++ ) {
    ivec3 c = ivec3( b ) + ivec3( ii, jj, kk );
    vec3 r = kfbH3( c, s ); if ( r.x >= dens * kfbField( c, s ) ) continue;
    vec3 r2 = kfbH3( c, s ^ uvec3( 0x9E37u, 0x79B9u, 0x7F4Au ) );                 // centre
    vec3 r3 = kfbH3( c, s ^ uvec3( 0x85EBu, 0xCA6Bu, 0xC2B2u ) );                 // axis
    vec3 r4 = kfbH3( c, s ^ uvec3( 0x27D4u, 0xEB2Fu, 0x1656u ) );                 // elongation, strength
    vec3 r5 = kfbH3( c, s ^ uvec3( 0x61C8u, 0x8647u, 0x3B9Fu ) );                 // size
    vec3 q = x - ( vec3( c ) + r2 );
    float e = 1.0 + ( eMax - 1.0 ) * sqrt( r4.y );
    float nrm = 2.0 * ( r5.x + r5.y + r5.z - 1.5 );
    float R = R0 * exp( sig * clamp( nrm, - 2.2, 2.2 ) );
    R = min( R, 0.98 / ( ( 1.0 + kn ) * e ) );                                      // stays inside the 3x3x3 window
    float rmax = ( 1.0 + kn ) * R * e; if ( dot( q, q ) > rmax * rmax ) continue;
    vec3 a = normalize( r3 - 0.5 + 1e-4 );
    float k = 1.0 - 1.0 / e;
    vec3 u = q - k * a * dot( a, q ); float lu = length( u ), rr = lu / R; if ( rr >= 1.0 + kn ) continue;
    float W = 1.0 - smoothstep( 1.0 - kn, 1.0 + kn, rr );
    vec3 dir = ( u - k * a * dot( a, u ) ) / max( lu, 1e-6 );
    grad += S * ( 0.7 + 0.6 * r4.z ) * rr * W * dir;
  }
  return grad;
}
/* v1.3 CREASE. x in cells. P = (cell, density, side slope S, -), E = (half length L, width w, bend b, -), all in cells.
   Line through the centre along a, bowed sideways along p: v = q - a t - p b' L tau^2, t = a.q, tau = t / L, d = |v|.
     h = -D exp(-(d/w)^2) (1 - tau^2)^2,  D = S w / 0.858 (steepest side = S)
   A thin groove that tapers at both ends; it lies on the surface, never a pit. */
vec3 kfbCreaseLayer( vec3 x, uvec3 s, vec4 P, vec4 E ) {
  vec3 b = floor( x ); vec3 grad = vec3( 0.0 );
  float dens = P.y, S = P.z, L0 = E.x, w = max( E.y, 1e-4 ), bend = E.z;
  for ( int kk = - 1; kk <= 1; kk ++ ) for ( int jj = - 1; jj <= 1; jj ++ ) for ( int ii = - 1; ii <= 1; ii ++ ) {
    ivec3 c = ivec3( b ) + ivec3( ii, jj, kk );
    vec3 r = kfbH3( c, s ); if ( r.x >= dens * kfbField( c, s ) ) continue;
    vec3 r2 = kfbH3( c, s ^ uvec3( 0x9E37u, 0x79B9u, 0x7F4Au ) );
    vec3 r3 = kfbH3( c, s ^ uvec3( 0x85EBu, 0xCA6Bu, 0xC2B2u ) );
    vec3 r4 = kfbH3( c, s ^ uvec3( 0x27D4u, 0xEB2Fu, 0x1656u ) );
    vec3 r5 = kfbH3( c, s ^ uvec3( 0x61C8u, 0x8647u, 0x3B9Fu ) );
    vec3 q = x - ( vec3( c ) + r2 );
    vec3 a = normalize( r3 - 0.5 + 1e-4 );
    vec3 p = cross( a, r5 - 0.5 ); float lp = length( p ); p = lp > 1e-3 ? p / lp : normalize( cross( a, vec3( 0.0, 1.0, 0.3 ) ) );
    float L = L0 * ( 0.7 + 0.6 * r4.x ), be = bend * ( 2.0 * r4.y - 1.0 );
    float t = dot( a, q ), tau = t / L; if ( abs( tau ) >= 1.0 ) continue;
    vec3 v = q - a * t - p * ( be * L * tau * tau ); float d = length( v ); if ( d > 3.0 * w ) continue;
    float T = ( 1.0 - tau * tau ) * ( 1.0 - tau * tau ), dT = - 4.0 * tau * ( 1.0 - tau * tau );
    float Ed = exp( - ( d * d ) / ( w * w ) ), D = S * ( 0.7 + 0.6 * r4.z ) * w / 0.858;
    vec3 gd = ( v - a * dot( a, v ) - 2.0 * be * tau * a * dot( p, v ) ) / max( d, 1e-6 );
    grad += - D * ( ( - 2.0 * d / ( w * w ) ) * Ed * T * gd + Ed * dT * a / L );
  }
  return grad;
}
/* v1.3 FINGER GROOVES. x in wavelengths, n = object normal. S = groove slope, X = (patch cell in wavelengths, cover, warp).
   Patches (Gaussian window, radius 0.45 patch cells) of parallel grooves; direction random per patch, projected into the surface plane.
   phase = (x - o).dir + warp * noise (one smooth warp field for all patches: wavy, not ruler-straight).
   wave(phase) = 1 - 2 smoothstep(u), u = 2 |fract(phase) - 0.5|: periodic, C1, polynomial only (bit-exact). Max slope of the wave = 6 per wavelength. */
vec3 kfbGrooveLayer( vec3 x, vec3 n, uvec3 s, float S, vec3 X ) {
  float Pc = max( X.x, 2.0 ), cover = X.y, warp = X.z, Rp = 0.45;
  vec4 nw = kfbNoiseD( x / ( 0.7 * Pc ), s ^ uvec3( 0x3A1Fu, 0x5C2Du, 0x7E4Bu ) );
  vec3 gw = warp * nw.yzw / ( 0.7 * Pc );
  vec3 xp = x / Pc, b = floor( xp ); vec3 grad = vec3( 0.0 );
  for ( int kk = - 1; kk <= 1; kk ++ ) for ( int jj = - 1; jj <= 1; jj ++ ) for ( int ii = - 1; ii <= 1; ii ++ ) {
    ivec3 c = ivec3( b ) + ivec3( ii, jj, kk );
    vec3 r = kfbH3( c, s ); if ( r.x >= cover ) continue;
    vec3 o = vec3( c ) + kfbH3( c, s ^ uvec3( 0x9E37u, 0x79B9u, 0x7F4Au ) );
    vec3 qp = xp - o; float rr2 = dot( qp, qp ) / ( Rp * Rp ); if ( rr2 > 2.25 ) continue;
    vec3 dir = normalize( kfbH3( c, s ^ uvec3( 0x85EBu, 0xCA6Bu, 0xC2B2u ) ) - 0.5 + 1e-4 );
    dir -= n * dot( n, dir ); float ld = length( dir ); if ( ld < 0.3 ) continue; dir /= ld;   // nearly along the normal: no grooves here
    float Wn = exp( - 2.5 * rr2 ); vec3 gWn = Wn * ( - 5.0 * qp / ( Rp * Rp ) ) / Pc;
    float ph = dot( qp * Pc, dir ) + warp * nw.x; vec3 gph = dir + gw;
    float t = fract( ph ) - 0.5, u = 2.0 * abs( t );
    float wv = 1.0 - 2.0 * u * u * ( 3.0 - 2.0 * u ), dwv = - 24.0 * u * ( 1.0 - u ) * sign( t );
    grad += ( S / 6.0 ) * ( dwv * gph * Wn + wv * gWn );
  }
  return grad;
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
  if ( uClayDent2.z > 0.0 ) { w = smoothstep( uClayBandD2.x, uClayBandD2.y, uClayDent2.x * vh );
    if ( w > 0.0 ) g += w * kfbPressLayer( p / uClayDent2.x, s ^ uvec3( 51u, 52u, 53u ), uClayDent2, uClayDent2E ); }
  if ( uClayDent.z > 0.0 ) { w = smoothstep( uClayBandD.x, uClayBandD.y, uClayDent.x * vh );
    if ( w > 0.0 ) g += w * kfbCreaseLayer( p / uClayDent.x, s ^ uvec3( 31u, 32u, 33u ), uClayDent, uClayDentE ); }
  if ( uClayGrain.y > 0.0 ) { w = smoothstep( uClayBandG.x, uClayBandG.y, uClayGrain.x * vh );
    if ( w > 0.0 ) g += w * kfbGrooveLayer( p / uClayGrain.x, normalize( vClayN ), s ^ uvec3( 41u, 42u, 43u ), uClayGrain.y, uClayGrooveX ); }
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
    uClayDent: { value: new THREE.Vector4(P.dent.size || 1, P.dent.density, P.dent.slope, 0) }, uClayDentE: { value: new THREE.Vector4(P.dent.len, P.dent.width, P.dent.bend, 0) },
    uClayDent2: { value: new THREE.Vector4(P.dent2.size || 1, P.dent2.density, P.dent2.slope, P.dent2.knee) }, uClayDent2E: { value: new THREE.Vector4(P.dent2.elong, P.dent2.sigma, P.dent2.radius, 0) },
    uClayGrooveX: { value: new THREE.Vector3(P.grain.patch ?? 10, P.grain.cover ?? 0, P.grain.warp ?? 0) },
    uClayBandL: { value: new THREE.Vector2(...P.bands.lump) }, uClayBandD: { value: new THREE.Vector2(...P.bands.dent) }, uClayBandD2: { value: new THREE.Vector2(...P.bands.dent2) },
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
