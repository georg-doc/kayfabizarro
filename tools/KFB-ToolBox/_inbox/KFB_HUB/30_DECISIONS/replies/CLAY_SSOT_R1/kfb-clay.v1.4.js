/* KFB Clay v1.4 · kfb.clay/1 · v1.1 + optional stage "Koernung" (grain) · WS-Design for WS0, 16.11.2026 (Georg: v1.1 stays, grain x3; V-1853)
 *
 * v1.4 = kfb-clay v1.1 unchanged (profiles, relief, colour and matte rules, bands, seed, API) plus ONE optional stage, off by default:
 *   applyClay(target, THREE, { ..., koernung: true, koernungMap: <url | THREE.Texture>, koernungSkip?: RegExp | (mesh) => bool })
 * Without `koernung` the material and shader are exactly v1.1 (same GLSL, same uniforms): renders are pixel-identical to v1.1.
 * With `koernung` (profile character only; kit-figure = character + the game's uniform override, so it is included; midground,
 * background and the terrain adapter ignore it) three things are added on top of the v1.1 relief:
 *   1. Grain: a normal map (ambientCG Ground026, CC0; credit in replies/CLAY_REFERENZ_R2/assets/CREDITS.md) triplanar in object space,
 *      no UV, tile 1.5 figure heights, strength 0.35 (whiteout blend, weights |N|^8: a projection that would stretch the grain on a
 *      slanted face fades out early, so the grain stays round and directionless; G2). The grain feature is ~0.25 % of the tile (measured, 2-3 px of
 *      1024), i.e. ~0.4 % of the figure. It fades with distance like the bands: full when a grain is >= 2.5 px at 1080p, gone at <= 1.25 px (no shimmer; G2).
 *   2. Speckles: dark specks in 5 % of the cells, cell 1.05 % of the figure height, 30 % darker; they fade out below ~1 px.
 *   3. Colour shift inside the material: OKLab hue rotation up to +-0.14 rad and lightness +-5 %, in large and medium patches
 *      (0.22 and 0.09 figure heights). Rotation by a polynomial, no sin/cos (bit-exact across GPUs, as the v1 hash rules).
 * Hashes use the per-mesh seed (claySeed from the figure card, V-429): two loads give identical speckles and patches.
 * Exceptions: everything SKIP_DEFAULT skips (eyes, lids, mouth, ...) gets no clay at all, as in v1.1; KOERN_SKIP additionally keeps the
 * grain off brows, nose, hair tufts, shirt and cloth (they keep their v1.1 clay). koernungSkip from the figure card adds to it.
 * The map is loaded from the address the caller passes (no fixed path in the module). clayBake is unaffected (the stage runs live:
 * three texture lookups per pixel). Light: the one rig; no rim, no fresnel (V-385).
 *
 * API (v1.1 plus the koernung options and handle.setKoernung(on)):
 *   applyClay(target, THREE, { profile, seed, scaleRef, palette, pull, relief, skip, koernung, koernungMap, koernungSkip }) -> handle
 *   removeClay(target) · clayOptionsFromCard(card) · resolveProfile(name) · seedFrom(value) · measureHeight(target, THREE)
 *   CLAY_PROFILES · PROFILE_ALIASES · MAX_PULL · SKIP_DEFAULT · KOERNUNG · KOERN_SKIP
 */

export const SCHEMA = 'kfb.clay/1';
export const VERSION = 'kfb-clay.v1.4';
export const MAX_PULL = 0.18;          // V-340: at most 18 % palette pull
export const SHEEN_MAX = 0.05;         // V-385
export const ROUGH_FLOOR = 0.6;        // WSB proposal "Knete-Look R2"

const F = Object.freeze;
/* Sizes are in units of scaleRef (1 = one reference length, for figures the figure height). slope = typical normal tilt.
 * dent / dent2: size = cell size, density = mean dents per cell (before the cluster field), slope = steepest tilt of a median dent,
 *   rim = raised rim height relative to the bowl depth, elong = largest length/width ratio, sigma = log-normal spread of the radius,
 *   radius = median radius in cells.
 * bands: [gone, full] = share of the viewport height one feature must cover to be invisible / fully visible.
 * v1 -> v1.1 (character): lump slope 0.07 -> 0.16, dents: one layer (cell 0.034, 45 %, slope 0.075) -> two overlapping layers
 * (cell 0.03 at 80 %, slope 0.15, broad and oval; cell 0.075 at 65 %, slope 0.19; both x cluster field 0.35..2), grain 0.028 -> 0.02,
 * maxSlope 0.2 -> 0.42. midground/background: proportional only = the same relief gain as character (~1.5x: lump x1.55,
 * dent slopes x1.4-1.55 of their v1 dent), the same new dent structure, sizes x their v1 size ratio. Numbers: RETURN.md. */
export const CLAY_PROFILES = F({
  character: F({
    id: 'character', label: 'Figuren · fein (V-053) · v1.1 mehr Knete', scaleRef: 'object',
    lump: F({ size: 0.085, slope: 0.16 }),
    dent: F({ size: 0.03, density: 0.8, slope: 0.15, rim: 0.06, elong: 2.6, sigma: 0.4, radius: 0.42 }),
    dent2: F({ size: 0.075, density: 0.65, slope: 0.19, rim: 0.1, elong: 2.8, sigma: 0.35, radius: 0.34 }),
    grain: F({ size: 0.0055, slope: 0.02 }),
    facet: F({ size: 0.0, slope: 0.0 }),
    bands: F({ lump: F([1 / 160, 1 / 50]), dent: F([1 / 480, 1 / 150]), dent2: F([1 / 480, 1 / 150]), grain: F([1 / 520, 1 / 190]), facet: F([1, 1]) }),
    mottle: 0.025, maxSlope: 0.42, roughMin: 0.72, sheen: 0.04, srcNormalK: 0.5, emissive: false,
  }),
  midground: F({
    id: 'midground', label: 'Dioramen · Requisiten', scaleRef: 'object',
    lump: F({ size: 0.12, slope: 0.11 }),
    dent: F({ size: 0.044, density: 0.8, slope: 0.15, rim: 0.05, elong: 2.6, sigma: 0.4, radius: 0.42 }),
    dent2: F({ size: 0.11, density: 0.6, slope: 0.17, rim: 0.07, elong: 2.8, sigma: 0.35, radius: 0.34 }),
    grain: F({ size: 0.008, slope: 0.028 }),
    facet: F({ size: 0.09, slope: 0.05 }),
    bands: F({ lump: F([1 / 200, 1 / 60]), dent: F([1 / 480, 1 / 150]), dent2: F([1 / 480, 1 / 150]), grain: F([1 / 520, 1 / 190]), facet: F([1 / 400, 1 / 120]) }),
    mottle: 0.03, maxSlope: 0.4, roughMin: 0.82, sheen: 0.02, srcNormalK: 0.6, emissive: true,
  }),
  background: F({
    id: 'background', label: 'Gelände · Ferne (ruhig)', scaleRef: 'object',
    lump: F({ size: 0.45, slope: 0.09 }),
    dent: F({ size: 0.18, density: 0.62, slope: 0.11, rim: 0.04, elong: 2.6, sigma: 0.4, radius: 0.42 }),
    dent2: F({ size: 0.44, density: 0.5, slope: 0.12, rim: 0.06, elong: 2.8, sigma: 0.35, radius: 0.34 }),
    grain: F({ size: 0.0, slope: 0.0 }),
    facet: F({ size: 0.3, slope: 0.045 }),
    bands: F({ lump: F([1 / 300, 1 / 80]), dent: F([1 / 500, 1 / 160]), dent2: F([1 / 500, 1 / 160]), grain: F([1, 1]), facet: F([1 / 400, 1 / 120]) }),
    mottle: 0.035, maxSlope: 0.28, roughMin: 0.9, sheen: 0.0, srcNormalK: 0.4, emissive: true,
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

/* v1.4 stage "Koernung" (Georg 16.11., grain x3; values from replies/CLAY_REFERENZ_R2/AN_WS0_KNETE_KOERNUNG.md). Lengths in figure heights.
 * Materialantwort character (V-566), addition: fine pores and crumbs (normal map), sparse dark specks and a soft in-material colour shift,
 * near only; roughness and sheen unchanged (0.72 / 0.04). */
export const KOERNUNG = F({
  profiles: F(['character']),
  tile: 1.5, strength: 0.35, grainShare: 0.0025,
  speck: F({ cell: 0.0105, cover: 0.05, dark: 0.3 }),
  colour: F({ hue: 0.14, lum: 0.05, big: 0.22, mid: 0.09 }),
  fade: F({ grainGonePx: 1.25, grainFullPx: 2.5, speckGonePx: 1.2, speckFullPx: 2.4, refHeightPx: 1080 }),
});
export const KOERN_SKIP = /eye|pupil|iris|(^|[^a-z])lid|mouth|mund|teeth|tongue|lash|brow|nose|hair|tuft|shirt|cloth|kfb-lid|clay-lid|decal/i;

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
/* v1.1 dents. x in cells. P = (cell size, density, slope, rim), E = (elongMax, sigma, median radius in cells, unused).
   Per cell (3x3x3 window around x): presence from a cluster field (two coarse octaves, 2 and 4 cells), fully random centre,
   log-normal radius, random axis a and elongation e (most near round), depth from the median slope x 0.65..1.35.
   Height of one dent with u = q - (1 - 1/e) a (a.q) (compressed along a), rr = |u| / R, t = (a.q) / (R e), g(t) = t / (1 + |t|):
     h = D * ( -exp(-2.5 rr^2) (1 - 0.5 g)  +  rim exp(-((rr - 1.0) / 0.26)^2) (1 + g)^2 / 4 ),  cut at rr = 1.5 (both terms < 0.5 % there)
   i.e. a soft Gaussian bowl, deeper at the push end (teardrop), and a low, wide rim only on the far end where the clay was pushed
   (a crescent, never a closed ring: closed rims read as moon craters). Dense, overlapping, oval dents make the kneaded surface. */
float kfbG( float t ) { return t / ( 1.0 + abs( t ) ); }
vec3 kfbDentLayer( vec3 x, uvec3 s, vec4 P, vec4 E ) {
  vec3 b = floor( x ); vec3 grad = vec3( 0.0 );
  float dens = P.y, slope = P.z, rim = P.w, eMax = max( 1.0, E.x ), sig = E.y, R0 = E.z;
  for ( int kk = - 1; kk <= 1; kk ++ ) for ( int jj = - 1; jj <= 1; jj ++ ) for ( int ii = - 1; ii <= 1; ii ++ ) {
    ivec3 c = ivec3( b ) + ivec3( ii, jj, kk );
    float q2 = kfbH1( c >> 1, s ^ uvec3( 0x2C1Bu, 0x3C6Eu, 0x0F11u ) ), q4 = kfbH1( c >> 2, s ^ uvec3( 0x1B87u, 0x7F4Au, 0x2545u ) );
    float field = 0.35 + 1.65 * smoothstep( 0.15, 0.85, 0.5 * ( q2 + q4 ) );      // 0.35 = calm area, 2 = dense patch, mean ~1.2
    vec3 r = kfbH3( c, s ); if ( r.x >= dens * field ) continue;
    vec3 r2 = kfbH3( c, s ^ uvec3( 0x9E37u, 0x79B9u, 0x7F4Au ) );                 // centre, fully random in the cell
    vec3 r3 = kfbH3( c, s ^ uvec3( 0x85EBu, 0xCA6Bu, 0xC2B2u ) );                 // axis
    vec3 r4 = kfbH3( c, s ^ uvec3( 0x27D4u, 0xEB2Fu, 0x1656u ) );                 // elongation, depth
    vec3 r5 = kfbH3( c, s ^ uvec3( 0x61C8u, 0x8647u, 0x3B9Fu ) );                 // size
    vec3 o = vec3( c ) + r2;
    vec3 q = x - o;
    float e = 1.0 + ( eMax - 1.0 ) * sqrt( r4.y );                                  // thumb dents are oval; a few drawn out to eMax
    float nrm = 2.0 * ( r5.x + r5.y + r5.z - 1.5 );                                // ~standard normal (Irwin-Hall, no trig)
    float R = R0 * exp( sig * clamp( nrm, - 2.2, 2.2 ) );
    R = min( R, 0.98 / ( 1.5 * e ) );                                               // stays inside the 3x3x3 window
    if ( dot( q, q ) > 2.25 * R * R * e * e ) continue;                             // rr > 1.5 along the long axis
    vec3 a = normalize( r3 - 0.5 + 1e-4 );
    float aq = dot( a, q ), k = 1.0 - 1.0 / e;
    vec3 u = q - k * a * aq; float lu = length( u ), rr = lu / R; if ( rr > 1.5 ) continue;
    float t = aq / ( R * e ), gt = kfbG( t ), dg = 1.0 / ( ( 1.0 + abs( t ) ) * ( 1.0 + abs( t ) ) );
    float D = slope * R / 1.356 * ( 0.65 + 0.7 * r4.z );
    float E1 = exp( - 2.5 * rr * rr ), zr = ( rr - 1.0 ) / 0.26, E2 = exp( - zr * zr );
    float cr = 0.25 * ( 1.0 + gt ) * ( 1.0 + gt ), dcr = 0.5 * ( 1.0 + gt );       // rim only on the push end (crescent, never a ring)
    float dhdr = 5.0 * rr * E1 * ( 1.0 - 0.5 * gt ) + rim * ( - 2.0 * zr / 0.26 ) * E2 * cr;
    vec3 gradR = ( u - k * a * dot( a, u ) ) / ( max( lu, 1e-6 ) * R );           // grad rr = M u / (|u| R), M symmetric
    grad += D * ( dhdr * gradR + ( 0.5 * E1 + rim * E2 * dcr ) * dg * a / ( R * e ) );
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
    if ( w > 0.0 ) g += w * kfbDentLayer( p / uClayDent2.x, s ^ uvec3( 51u, 52u, 53u ), uClayDent2, uClayDent2E ); }
  if ( uClayDent.z > 0.0 ) { w = smoothstep( uClayBandD.x, uClayBandD.y, uClayDent.x * vh );
    if ( w > 0.0 ) g += w * kfbDentLayer( p / uClayDent.x, s ^ uvec3( 31u, 32u, 33u ), uClayDent, uClayDentE ); }
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
const KOERN_DECL = /* glsl */`
uniform sampler2D uKoernMap;
uniform float uKoernOn, uKoernAll, uKoernT, uKoernK, uKoernShare, uKoernSpk, uKoernSpkCov, uKoernSpkDark, uKoernHue, uKoernLum, uKoernBig, uKoernMid;
uniform vec4 uKoernFade;
vec3 kfbKoernTri( vec3 p, vec3 N ) {
  vec3 w = N * N; w = w * w; w = w * w; w /= ( w.x + w.y + w.z );
  vec3 tx = texture( uKoernMap, p.zy / uKoernT ).xyz * 2.0 - 1.0, ty = texture( uKoernMap, p.xz / uKoernT ).xyz * 2.0 - 1.0, tz = texture( uKoernMap, p.xy / uKoernT ).xyz * 2.0 - 1.0;
  tx.xy *= uKoernK; ty.xy *= uKoernK; tz.xy *= uKoernK;
  tx = vec3( tx.xy + N.zy, abs( tx.z ) * N.x ); ty = vec3( ty.xy + N.xz, abs( ty.z ) * N.y ); tz = vec3( tz.xy + N.xy, abs( tz.z ) * N.z );
  return normalize( tx.zyx * w.x + ty.xzy * w.y + tz.xyz * w.z );
}
`;
const KOERN_COLOR = /* glsl */`
if ( uClayOn > 0.5 && uKoernOn * uKoernAll > 0.5 ) {
  uvec3 ks = uvec3( uClaySeed );
  float m1 = kfbNoiseD( vClayP / uKoernBig, ks ^ uvec3( 71u, 72u, 73u ) ).x, m2 = kfbNoiseD( vClayP / uKoernMid + 5.3, ks ^ uvec3( 74u, 75u, 76u ) ).x;
  vec3 kL = kfbToOk( max( diffuseColor.rgb, vec3( 0.0 ) ) );
  float ka = uKoernHue * ( 0.7 * m1 + 0.3 * m2 ), ka2 = ka * ka, kc = 1.0 - ka2 * 0.5 + ka2 * ka2 / 24.0, kss = ka * ( 1.0 - ka2 / 6.0 + ka2 * ka2 / 120.0 );
  kL.yz = vec2( kc * kL.y - kss * kL.z, kss * kL.y + kc * kL.z ); kL.x *= 1.0 + uKoernLum * ( 0.5 * m1 + 0.5 * m2 );
  diffuseColor.rgb = max( kfbFromOk( kL ), vec3( 0.0 ) );
  float kvis = smoothstep( uKoernFade.z, uKoernFade.w, uKoernSpk * vClayVH );
  if ( kvis > 0.0 ) { vec3 kq = vClayP / uKoernSpk; ivec3 kcell = ivec3( floor( kq ) ); vec3 kr = kfbH3( kcell, ks ^ uvec3( 81u, 82u, 83u ) );
    if ( kr.x < uKoernSpkCov ) { vec3 ko = vec3( kcell ) + 0.3 + 0.4 * kfbH3( kcell, ks ^ uvec3( 84u, 85u, 86u ) ); float kd = length( kq - ko ) / ( 0.12 + 0.18 * kr.y );
      diffuseColor.rgb *= 1.0 - uKoernSpkDark * kvis * ( 1.0 - smoothstep( 0.6, 1.0, kd ) ); } }
}
`;
const KOERN_NORMAL = /* glsl */`
if ( uClayOn > 0.5 && uKoernOn * uKoernAll > 0.5 ) {
  float kw = smoothstep( uKoernFade.x, uKoernFade.y, uKoernT * uKoernShare * vClayVH );
  if ( kw > 0.0 ) { vec3 kN0 = normalize( vClayN ); vec3 kN = normalize( mix( kN0, kfbKoernTri( vClayP, kN0 ), kw ) );
    vec3 kDV = normalize( vClayNM * kN ) - normalize( vClayNM * kN0 );
    #ifdef DOUBLE_SIDED
      kDV *= faceDirection;
    #endif
    normal = normalize( normal + kDV ); }
}
`;
export const GLSL = F({ VERT_DECL, VERT_MAIN, FRAG_DECL, FRAG_COLOR, FRAG_NORMAL, FRAG_ROUGH, FRAG_METAL, KOERN_DECL, KOERN_COLOR, KOERN_NORMAL });

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
    uClayDent: { value: new THREE.Vector4(P.dent.size || 1, P.dent.density, P.dent.slope, P.dent.rim) }, uClayDentE: { value: new THREE.Vector4(P.dent.elong, P.dent.sigma, P.dent.radius, 0) },
    uClayDent2: { value: new THREE.Vector4(P.dent2.size || 1, P.dent2.density, P.dent2.slope, P.dent2.rim) }, uClayDent2E: { value: new THREE.Vector4(P.dent2.elong, P.dent2.sigma, P.dent2.radius, 0) },
    uClayBandL: { value: new THREE.Vector2(...P.bands.lump) }, uClayBandD: { value: new THREE.Vector2(...P.bands.dent) }, uClayBandD2: { value: new THREE.Vector2(...P.bands.dent2) },
    uClayBandG: { value: new THREE.Vector2(...P.bands.grain) }, uClayBandF: { value: new THREE.Vector2(...P.bands.facet) },
  };
}

/* v1.4: shared uniforms of the stage "Koernung"; the map comes from the caller (url or THREE.Texture). */
function koernUniforms(THREE, map) {
  let tex = map;
  if (typeof map === 'string') { tex = new THREE.TextureLoader().load(map); }
  if (tex && tex.isTexture) { tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.colorSpace = THREE.NoColorSpace ?? ''; tex.needsUpdate = true; }
  const K = KOERNUNG, f = K.fade, px = (n) => n / f.refHeightPx;
  return {
    uKoernMap: { value: tex || null }, uKoernAll: { value: 1 }, uKoernT: { value: K.tile }, uKoernK: { value: K.strength }, uKoernShare: { value: K.grainShare },
    uKoernSpk: { value: K.speck.cell }, uKoernSpkCov: { value: K.speck.cover }, uKoernSpkDark: { value: K.speck.dark },
    uKoernHue: { value: K.colour.hue }, uKoernLum: { value: K.colour.lum }, uKoernBig: { value: K.colour.big }, uKoernMid: { value: K.colour.mid },
    uKoernFade: { value: new THREE.Vector4(px(f.grainGonePx), px(f.grainFullPx), px(f.speckGonePx), px(f.speckFullPx)) },
  };
}

function convertible(m) {
  return !!m && !m.isShaderMaterial && !m.isMeshBasicMaterial && !m.isSpriteMaterial && !m.isPointsMaterial && !m.isLineBasicMaterial && !m.isShadowMaterial &&
    (m.isMeshStandardMaterial || m.isMeshPhongMaterial || m.isMeshLambertMaterial || m.isMeshToonMaterial) && !(m.transparent && (m.opacity == null || m.opacity < 0.98)) && m.alphaHash !== true;
}

function makeClayMaterial(THREE, src, P, shared, mine, koern = null) {
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
  m.userData.kfbClay = { schema: SCHEMA, version: VERSION, profile: P.id, src, k: mine.uClayK.value, seed: mine.uClaySeed.value.toArray(), ...(koern ? { koernung: mine.uKoernOn.value > 0.5 } : {}) };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, shared, mine, koern || {});
    sh.vertexShader = VERT_DECL + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n' + VERT_MAIN);
    sh.fragmentShader = FRAG_DECL + (koern ? KOERN_DECL : '') + sh.fragmentShader
      .replace('#include <color_fragment>', '#include <color_fragment>\n' + FRAG_COLOR + (koern ? KOERN_COLOR : ''))
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n' + FRAG_ROUGH)
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\n' + FRAG_METAL)
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + FRAG_NORMAL + (koern ? KOERN_NORMAL : ''));
  };
  m.customProgramCacheKey = () => VERSION + (koern ? '|koernung' : '');
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
 * opts.koernung      v1.4: true = stage "Koernung" on (profile character only; default off -> exactly v1.1)
 * opts.koernungMap   v1.4: url or THREE.Texture of the grain normal map (Ground026, CC0); required when koernung is on
 * opts.koernungSkip  v1.4: extra RegExp / (mesh) => boolean of meshes without grain (adds to KOERN_SKIP, tested on path and material name)
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
  const koernOn = !!opts.koernung && KOERNUNG.profiles.includes(P.id);
  if (opts.koernung && koernOn && !opts.koernungMap) throw new Error('kfb-clay v1.4: koernung needs koernungMap (url or THREE.Texture)');
  const koern = koernOn ? koernUniforms(THREE, opts.koernungMap) : null;
  const kSkip = (o, path) => { const mn = [].concat(o.material).map((m) => (m && m.name) || '').join('|'); const t = (re) => re.test(path) || re.test(mn);
    if (t(KOERN_SKIP)) return true; const x = opts.koernungSkip; return x ? (x instanceof RegExp ? t(x) : !!x(o)) : false; };
  const pathOf = (o) => { const a = []; for (let n = o; n && n !== target.parent; n = n.parent) a.push(n.name || ''); return a.reverse().join('/'); };
  const meshes = [], skipped = []; let idx = 0;
  target.traverse((o) => {
    if (!o.isMesh) return;
    const key = o.name || '#' + idx; idx++;
    const path = pathOf(o);
    if ((skip instanceof RegExp ? skip.test(path) : skip(o)) || !o.geometry || !o.geometry.attributes.position || !o.geometry.attributes.normal) { skipped.push(path); return; }
    const k = meshWorldScale(THREE, o) / ref;
    const mine = { uClayK: { value: k }, uClaySeed: { value: new THREE.Vector3(...seedVec(seed, key)) } };
    if (koern) mine.uKoernOn = { value: kSkip(o, path) ? 0 : 1 };
    const before = o.material, conv = (m) => (convertible(m) ? makeClayMaterial(THREE, m, P, shared, mine, koern) : m);
    const after = Array.isArray(before) ? before.map(conv) : conv(before);
    if ([].concat(after).some((m, i) => m !== [].concat(before)[i])) { o.userData.kfbClayOrig = before; o.material = after; meshes.push({ path, k: +k.toPrecision(6), ...(koern ? { koernung: mine.uKoernOn.value > 0.5 } : {}) }); }
    else skipped.push(path);
  });
  return {
    schema: SCHEMA, version: VERSION, profile: P.id, seed, scaleRef: ref, uniforms: shared, meshes, skipped,
    info: () => ({ schema: SCHEMA, version: VERSION, profile: P.id, seed, scaleRef: +ref.toPrecision(6), meshes: meshes.length, skipped: skipped.length, k: meshes.map((m) => m.k), koernung: koern ? meshes.filter((m) => m.koernung).length : (opts.koernung ? 'profile ' + P.id + ': not used' : false) }),
    koernUniforms: koern,
    setKoernung: (on) => { if (koern) koern.uKoernAll.value = on ? 1 : 0; },
    setRelief: (on) => { shared.uClayRelief.value = on ? 1 : 0; },
    setEnabled: (on) => { shared.uClayOn.value = on ? 1 : 0; },
    remove: () => removeClay(target),
  };
}
