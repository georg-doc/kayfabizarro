// Watercolour, made in code, on a pencil drawing that is there first.
//
// Before the paint a thing is only its underdrawing: bare paper, a light hatching of graphite where it will be in
// shade, and (drawn by the page) a pencil line round it. The paint comes as a wash. Paint is pigment in water, and
// what it leaves is the paper's white seen through it: thin where the light falls (the paper is the light), deeper
// where it pooled, settled into the valleys of the paper's grain, uneven in big soft patches because no wash dries
// flat. Shade is a second, cool violet glaze laid over the first.
//
// Where the wash has got to is kept in a map of the ground: for every spot, when the wash reached it. A thing is
// painted by how long ago that was at its foot (its "root"), less the time the colour takes to climb it; so a tree
// takes its colour from the roots up, and a flower bed all at once. The front of a wash is never even, it is
// darker while wet and darkest at its creeping edge, and it dries paler.
//
// Leaves, grass and flowers are touches of the brush ("dabs"): small marks that face the eye. One touch of a brush
// loaded for foliage leaves several leaves at once, each its own shape and a little more or less full of pigment;
// one touch for grass leaves a tuft of blades; one for a flower, its ring of petals. A tree is tens of thousands
// of leaves put down this way, darkest inside and underneath, lightest where the sun is, and scattered singly
// round the edge. Before the paint only some touches are there, as pencil; each leaf arrives in its own moment.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PENCIL, field, hue } from './pencil.js';

export const NOISE = /* glsl */ `
float wcHash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float wcNoise(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(wcHash3(i), wcHash3(i + vec3(1, 0, 0)), f.x), mix(wcHash3(i + vec3(0, 1, 0)), wcHash3(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(wcHash3(i + vec3(0, 0, 1)), wcHash3(i + vec3(1, 0, 1)), f.x), mix(wcHash3(i + vec3(0, 1, 1)), wcHash3(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}`;

// How long ago the wash reached a point: below 0 it has not yet. root: the foot of the thing the point belongs to,
// and (w) how many seconds the colour takes to travel a metre of it; a root of w = 0 is the ground itself.
export const AGE = /* glsl */ `
uniform sampler2D uMap; uniform vec4 uRect; uniform float uNow;
// the last wash: where it starts (x, z), when, and how many seconds it takes to go sixty metres (0: there is none yet)
uniform vec4 uFinale;
float wcAge(vec3 at, vec4 root) {
  float T = texture2D(uMap, (root.xz - uRect.xy) * uRect.zw).r;
  // the edge of a wash runs ahead along the grain here and hangs back there
  float n = (wcNoise(at * 0.42) - 0.5) * 0.42 + (wcNoise(at * 1.5 + 3.0) - 0.5) * 0.16 + (wcNoise(at * 5.5 + 7.0) - 0.5) * 0.05;
  float climb = distance(at, root.xyz) * root.w, rag = n * (root.w > 0.0 ? 0.9 : 1.0);
  float age = uNow - T - climb - rag;
  // The last wash is a wave of its own, going out from where it began; colour climbs things four times as fast
  // in it. A place takes whichever reaches it first. (It is never a hurrying-up of the wash that was already on
  // its way: that would make what was half way there jump.)
  if (uFinale.w > 0.0) age = max(age, uNow - uFinale.z - uFinale.w * pow(min(distance(root.xz, uFinale.xy) / 60.0, 1.5), 0.8) - climb * 0.25 - rag);
  return age;
}`;

export const PAINT = /* glsl */ `
uniform vec3 uHaze; uniform float uHazeK;
// What is left of the paper's white. local: the pigment. D: 0 in the light to 1 in the dark. hatch: 1 to hatch the
// underdrawing's shade. age: see wcAge. pool: how much the paint has pooled here. far: how much air is between.
vec3 wcPaint(vec3 local, float D, vec2 h, float hatch, vec3 at, float age, float pool, float far, float glare) {
  float tooth = pcTooth(at);
  float graphite = pcStrokes(h.x, clamp((D - 0.26) * 1.2, 0.0, 0.55) * hatch) * (0.45 + 0.7 * tooth);
  vec3 sketch = mix(vec3(1.0), vec3(0.36, 0.34, 0.4), graphite * 0.5);
  float P = smoothstep(0.0, 0.25, age), wet = 1.0 - smoothstep(0.0, 4.5, age), rim = 1.0 - smoothstep(0.04, 0.9, age);
  // no wash dries flat: big soft patches of more and less pigment
  float bloom = wcNoise(at * 0.3 + 11.0) * 0.6 + wcNoise(at * 1.3 + 2.0) * 0.4;
  // the light is paper left nearly bare, under a warm glaze
  float lit = 1.0 - smoothstep(0.1, 0.42, D + (bloom - 0.5) * 0.14);
  float density = (0.74 + 0.52 * bloom) * (0.72 + 0.56 * tooth) * mix(1.0, 0.68, lit) * pool * (1.0 + 0.32 * wet + 0.7 * rim * smoothstep(0.1, 0.5, dot(local, vec3(0.3333))));
  vec3 left = pow(max(local, vec3(0.012)), vec3(density));
  left *= mix(vec3(1.0), vec3(1.0, 0.88, 0.56), lit * 0.42 * (0.7 + 0.5 * tooth));
  // the shade: a cool violet glaze over it, its edge as uneven as any wash's
  float sh = smoothstep(0.3, 0.55, D + (bloom - 0.5) * 0.22);
  left *= mix(vec3(1.0), vec3(0.45, 0.42, 0.78), sh * 0.76 * (0.75 + 0.45 * tooth));
  // far things are paler and cooler, as if lifted with a damp brush
  left = mix(left, uHaze, far);
  // and toward the low sun everything is veiled in gold
  left = mix(left, vec3(1.0, 0.89, 0.6), glare);
  return mix(sketch, left, P);
}`;

// A dab is four corners at one place; the corners are set out toward the eye here.
// Its kinds: 0 a soft mass (what is behind the leaves of a bough); 1 a tuft of grass; 2 a flower; 3 a petal
// falling; 4 a butterfly; 5 a touch of leaves; 6 the first pale wet wash of a bough; 7 a mote of dust in a
// sunbeam; 8 one stem.
const dabVertex = (aged) => /* glsl */ `
  vec4 dab = vec4(position.xy, dabS);
  vec3 wcPos = transformed;
  float wcKind = dabB.z, wcSeed = fract(dabB.y);
  if (wcKind > 2.5 && wcKind < 3.5) {
    // it falls from the tree, turning, and drifts downwind; and then another does
    float fall = fract(uNow * (0.06 + 0.05 * wcSeed) + wcSeed * 7.0);
    wcPos += vec3(sin(uNow * 1.3 + wcSeed * 30.0 + fall * 9.0) * 0.45 + fall * 1.6, -fall * dabB.w, cos(uNow * 1.1 + wcSeed * 17.0) * 0.4 + fall * 1.0);
  } else if (wcKind > 3.5 && wcKind < 4.5) {
    // it wanders about its flower bed
    float a = uNow * (0.45 + 0.35 * wcSeed) + wcSeed * 40.0;
    wcPos += vec3(cos(a) * dabB.w + sin(a * 2.7) * 0.4, 0.3 * sin(a * 3.1) + 0.16 * sin(a * 7.0), sin(a * 1.3) * dabB.w + cos(a * 2.3) * 0.4);
  } else if (wcKind > 6.5 && wcKind < 7.5) {
    // it hangs in the light, turning over
    wcPos += vec3(sin(uNow * 0.31 + wcSeed * 40.0), 0.7 * sin(uNow * 0.23 + wcSeed * 17.0), cos(uNow * 0.27 + wcSeed * 29.0)) * 0.5;
  }
  vec4 mvPosition = modelViewMatrix * vec4(wcPos, 1.0);
  {
    vec3 wcAt = (modelMatrix * vec4(transformed, 1.0)).xyz;
    bool wcFlick = (wcKind > 0.5 && wcKind < 1.5) || wcKind > 7.5;
    float wcLive = 0.0, wcStir = (wcKind < 0.5 || (wcKind > 4.5 && wcKind < 6.5)) ? dabB.w : 0.0;
    ${aged ? 'vAge = wcAge(wcAt, root) - wcSeed * 0.5; wcLive = smoothstep(0.0, 2.5, vAge);' : ''}
    // (a touch right against the lens would fill the page: it isn't drawn)
    vec2 c = dab.xy * smoothstep(0.7, 1.7, -mvPosition.z);
    if (wcKind > 6.5 && wcKind < 7.5) c *= smoothstep(2.5, 7.0, -mvPosition.z);
    ${aged ? '' : '// (what grows low, and what flies, throws no shadow of its own)\n    if ((wcKind > 0.5 && wcKind < 4.5) || wcKind > 6.5) c *= 0.0;'}
    if (!wcFlick) {
      // a mark that may lie any way round, stirring a little once it is painted
      float a = dabB.x + wcLive * wcStir * 0.2 * sin(uNow * 1.3 + wcSeed * 40.0) + (wcKind > 2.5 && wcKind < 3.5 ? uNow * (1.0 + wcSeed) : 0.0);
      vec2 o = vec2(c.x * dab.z * (wcKind > 3.5 && wcKind < 4.5 ? 0.25 + 0.75 * abs(sin(uNow * 13.0 + wcSeed * 9.0)) : 1.0), c.y * dab.w);
      mvPosition.xy += vec2(cos(a) * o.x - sin(a) * o.y, sin(a) * o.x + cos(a) * o.y);
      mvPosition.x += wcLive * wcStir * 0.09 * sin(uNow * 0.9 + wcAt.x * 0.35 + wcAt.z * 0.2 + wcAt.y * 0.3);
    } else {
      // a mark standing on its foot: grass, a stem. It leans, and sways once painted.
      vec3 upV = normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
      // (looked down on, grass is drawn leaning back toward the eye: nobody paints it end-on)
      if (wcKind < 1.5) upV = normalize(mix(upV, vec3(0.0, 1.0, 0.0), 0.5));
      vec3 rightV = normalize(cross(upV, vec3(0.0, 0.0, 1.0)));
      float t = (c.y + 1.0) * 0.5;
      float lean = dabB.x + wcLive * dabB.w * 0.3 * sin(uNow * 1.7 + wcAt.x * 0.5 + wcAt.z * 0.4 + wcSeed * 6.0);
      mvPosition.xyz += rightV * (c.x * dab.z + lean * t * t * dab.w * 2.0) + upV * (t * 2.0 * dab.w);
    }
    vCorner = dab.xy; vDabB = dabB;
    ${aged ? 'vAt = (inverse(viewMatrix) * mvPosition).xyz;' : ''}
  }
  gl_Position = projectionMatrix * mvPosition;`;
// The shape of a touch. wcR: 0 at the middle of the nearest mark in it and 1 at that mark's edge. wcE: the same for
// its outline in the underdrawing. wcTone: how full of pigment that mark is, -1 to 1. wcDelay: how late it arrives.
// wcU: how far up a blade. wcEye: 1 in the eye of a flower.
const dabShape = /* glsl */ `
  vec2 wcP = vCorner; float wcSeed = fract(vDabB.y), wcK = vDabB.z, wcR = 2.0, wcE = 2.0, wcTone = 0.0, wcDelay = 0.0, wcU = 0.0, wcEye = 0.0;
  if (wcK > 4.5 && wcK < 5.5) {
    // leaves: four to seven of them, each pointed at both ends and a little bent, lying roughly one way
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      if (fi > 3.5 + wcSeed * 3.5) break;
      vec3 h = fract(sin(vec3(fi * 12.9898 + wcSeed * 91.7, fi * 78.233 + wcSeed * 47.3, fi * 37.719 + wcSeed * 13.1)) * 43758.5453);
      vec2 q = wcP - (h.xy - 0.5) * 1.05;
      float a = (h.z - 0.5) * 1.7, ca = cos(a), sa = sin(a);
      q = vec2(ca * q.x - sa * q.y, sa * q.x + ca * q.y);
      float s = 0.28 + 0.16 * h.x, y = q.y / s;
      float r = abs(y) < 1.0 ? abs(q.x + 0.1 * s * sin(y * 2.5 + h.y * 9.0)) / (s * 0.44 * pow(1.0 - y * y, 0.7) + 0.004) : 2.0;
      if (r < wcR) { wcR = r; wcTone = h.z * 2.0 - 1.0; wcDelay = h.y; }
    }
    wcE = wcR;
  } else if (wcK > 7.5) {
    float t = (wcP.y + 1.0) * 0.5;
    wcR = abs(wcP.x) / (0.95 - 0.5 * t); wcE = wcR; wcU = t;
  } else if (wcK > 0.5 && wcK < 1.5) {
    // grass: a tuft of blades from one foot, each its own length, bending over toward its tip
    float t = (wcP.y + 1.0) * 0.5;
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      vec3 h = fract(sin(vec3(fi * 12.9898 + wcSeed * 91.7, fi * 78.233 + wcSeed * 47.3, fi * 37.719 + wcSeed * 13.1)) * 43758.5453);
      bool seeded = i == 0 && wcSeed > 0.8;
      float len = seeded ? 0.86 : 0.4 + 0.6 * h.y, u = t / len, x0 = (h.x - 0.5) * 0.7, bend = (h.z - 0.5) * 1.0 * len;
      float hw = 0.075 * (1.0 - u) * (0.45 + 0.55 * smoothstep(0.0, 0.12, u)) + 0.012;
      float r = u < 1.0 ? abs(wcP.x - x0 - bend * u * u) / hw : 2.0;
      // where the grass has gone to seed, a head on the tallest
      if (seeded) r = min(r, length(vec2((wcP.x - x0 - bend * 0.8) / 0.075, (t - 0.84) / 0.14)));
      if (r < wcR) { wcR = r; wcTone = h.x * 2.0 - 1.0; wcU = min(u, 1.0); wcDelay = h.y * 0.5; }
    }
    wcE = wcR;
  } else if (wcK > 1.5 && wcK < 2.5) {
    float N = vDabB.w, rad = length(wcP), ang = atan(wcP.y, wcP.x);
    if (N < 1.5) {
      // a bell, hanging, wider at its mouth
      wcR = length(vec2(wcP.x / (0.5 + 0.34 * smoothstep(0.3, -0.9, wcP.y)), wcP.y / 0.95));
    } else {
      // petals round an eye. k: 0 down the middle of a petal, 1 between two
      float turn = ang / 6.2832 * N + wcSeed, k = abs(fract(turn) - 0.5) * 2.0;
      float L = N > 9.5 ? 0.76 + 0.2 * fract(sin(floor(turn) * 91.3 + wcSeed * 7.0) * 437.5)
              : N > 6.5 ? 0.5 + 0.44 * (1.0 - k) + 0.07 * sin(k * 19.0)
              : 0.7 + 0.26 * sqrt(1.0 - k * k);
      float wide = N > 9.5 ? 0.66 * sin(3.1416 * clamp(rad / L, 0.0, 1.0)) + 0.1 : 2.0;
      wcR = max(rad / L, k / wide);
      wcTone = k * 2.0 - 1.0;
      wcEye = step(rad, N > 9.5 ? 0.27 : 0.2);
      if (wcEye > 0.5) wcR = rad;
    }
    wcE = wcR;
  } else if (wcK > 3.5 && wcK < 4.5) { wcR = length(vec2(abs(wcP.x) - 0.5, wcP.y * 0.72)) / 0.5; wcE = wcR; }
  else if (wcK > 6.5) { wcR = length(wcP); wcE = wcR; }
  else {
    // a soft ragged mass
    float ang = atan(wcP.y, wcP.x);
    wcE = length(wcP) * (1.0 + 0.13 * sin(ang * 3.0 + wcSeed * 40.0) + 0.07 * sin(ang * 5.0 + wcSeed * 91.0)) + 0.12 * (wcNoise(vec3(wcP * 1.6, wcSeed * 17.0)) - 0.5);
    wcR = wcE;
    // (the first wash is put on wet, and its edge breaks up on the grain)
    if (wcK > 5.5) wcR += (wcNoise(vec3(wcP * 6.5, wcSeed * 31.0)) - 0.5) * 0.6 * smoothstep(0.3, 1.0, wcE);
  }
  if (min(wcR, wcE) > 1.0) discard;`;

/** The materials, and the map of where the wash has got to. rect: the ground the map covers. */
export function createWash({ x0 = -46, z0 = -50, size = 92, cells = 256, reach = 14, speed = 11 } = {}) {
  const NEVER = 1e5, data = new Float32Array(cells * cells).fill(NEVER);
  const map = new THREE.DataTexture(data, cells, cells, THREE.RedFormat, THREE.FloatType);
  map.minFilter = map.magFilter = THREE.LinearFilter;
  map.needsUpdate = true;
  const uniforms = {
    uPx: { value: 5 }, uFinale: { value: new THREE.Vector4(0, 0, 0, 0) }, uMap: { value: map }, uRect: { value: new THREE.Vector4(x0, z0, 1 / size, 1 / size) }, uNow: { value: 0 },
    uHaze: { value: new THREE.Color(0.9, 0.86, 0.92) }, uHazeK: { value: 0.0022 },
  };
  let dirty = false;
  const paint = {
    reach, speed,
    /** Paint is put down at (x, z): from there the wash spreads, slowing, to about `reach` metres. */
    touch(x, z, now, reach = paint.reach, speed = paint.speed) {
      const far = reach * 1.6, cell = size / cells;
      const i0 = Math.max(0, Math.floor((x - far - x0) / cell)), i1 = Math.min(cells - 1, Math.ceil((x + far - x0) / cell));
      const j0 = Math.max(0, Math.floor((z - far - z0) / cell)), j1 = Math.min(cells - 1, Math.ceil((z + far - z0) / cell));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const d = Math.hypot(x0 + (i + 0.5) * cell - x, z0 + (j + 0.5) * cell - z);
        if (d > far) continue;
        const over = Math.max(0, (d - reach) / (0.6 * reach)), at = now - 0.9 + d / speed + 400 * over * over, k = j * cells + i;
        if (at < data[k]) { data[k] = at; dirty = true; }
      }
    },
    /** When the wash reached (x, z), or NEVER. */
    at(x, z) { const i = Math.floor(((x - x0) / size) * cells), j = Math.floor(((z - z0) / size) * cells); return i < 0 || j < 0 || i >= cells || j >= cells ? NEVER : data[j * cells + i]; },
    /** The last wash: from (x, z) it goes out over the whole page, everywhere, quickly at first and then more slowly, and reaches a place `span` metres off after `seconds`. Nothing is left out. */
    flood(x, z, now, seconds = 7, span = 60) {
      const cell = size / cells;
      for (let j = 0; j < cells; j++) for (let i = 0; i < cells; i++) {
        const d = Math.hypot(x0 + (i + 0.5) * cell - x, z0 + (j + 0.5) * cell - z), at = now + seconds * Math.min(d / span, 1.5) ** 0.8, k = j * cells + i;
        if (at < data[k]) { data[k] = at; dirty = true; }
      }
    },
    /** How much of the page is painted by `now`, 0 to 1. */
    done(now) { let n = 0; for (let k = 0; k < data.length; k++) if (data[k] <= now) n++; return n / data.length; },
    all(when = -100) { data.fill(when); dirty = true; },
    none() { data.fill(NEVER); dirty = true; },
    sync() { if (dirty) { map.needsUpdate = true; dirty = false; } },
    NEVER,
  };

  const share = (s) => { for (const k of Object.keys(uniforms)) s.uniforms[k] = uniforms[k]; };
  const LIT = 'float wcLit = dot(outgoingLight, vec3(0.3333)) / max(dot(diffuseColor.rgb, vec3(0.3333)), 0.03);\n  float wcD = 1.0 - clamp(pow(wcLit, 0.8), 0.0, 1.0);\n  float wcFar = (1.0 - exp(-length(vViewPosition) * uHazeK)) * 0.9;\n  float wcGlare = pow(max(dot(-normalize(vViewPosition), directionalLights[0].direction), 0.0), 4.0) * (1.0 - exp(-length(vViewPosition) * 0.025)) * 0.14;\n';
  /** What a solid thing is painted with. always: it was painted before the page was begun (the wanderer). water: the stream. */
  const make = ({ side = THREE.FrontSide, always = false, water = false } = {}) => {
    const m = new THREE.MeshLambertMaterial({ vertexColors: true, side });
    m.onBeforeCompile = (s) => {
      share(s);
      s.vertexShader = 'attribute vec2 hatch; attribute vec4 root; varying vec2 vHatch; varying vec3 vAt; varying vec3 vWorld; varying vec4 vRoot;\n'
        + s.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vHatch = hatch; vAt = position; vWorld = (modelMatrix * vec4(transformed, 1.0)).xyz; vRoot = root;');
      const age = always ? 'float wcA = 100.0;' : water ? 'float wcA = max(wcAge(vWorld, vRoot), wcAge(vWorld, vec4(vWorld, 0.0)));' : 'float wcA = wcAge(vWorld, vRoot);';
      // (once a thing is painted, the pencil round it is all but lost under the paint: the fourth number says how much is left)
      const line = '\n  float wcLine = mix(1.0, 0.3, smoothstep(0.0, 0.4, wcA));';
      // The stream. Its pencil lines run with it. Painted, it moves, and it shows what is over it: the sky's light
      // down its middle, the dark of the banks and the trees along its edges and in bands, all in level streaks;
      // and where the sun catches a ripple the paper is left bare.
      const body = water ? `
  float wcGo = smoothstep(0.0, 2.5, wcA), wcT = uNow * wcGo, wcAcross = abs(vHatch.y) / 2.6;
  float wcStreak = wcNoise(vec3(vHatch.x * 0.55 - wcT * 0.35, vHatch.y * 5.0, 1.0)), wcBroad = wcNoise(vec3(vHatch.x * 0.11, vHatch.y * 0.5, 5.0));
  float wcDark = max(smoothstep(0.3, 0.92, wcAcross + (wcStreak - 0.5) * 0.75), smoothstep(0.5, 0.7, wcBroad + (wcStreak - 0.5) * 0.5) * 0.85);
  vec3 wcPig = mix(mix(vec3(0.26, 0.5, 0.68), vec3(0.8, 0.84, 0.8), smoothstep(0.5, 0.8, wcNoise(vec3(vHatch.x * 0.3 + 9.0, vHatch.y * 2.5, 2.0)) + (wcStreak - 0.5) * 0.5)), vec3(0.03, 0.1, 0.06), wcDark * 0.92);
  vec3 wcC = wcPaint(wcPig, 0.34 + 0.1 * wcD, vec2(vHatch.y * 0.55, 0.0), 1.0, vAt, wcA, 1.1, wcFar * 0.5, wcGlare * 0.4);
  float wcGlint = smoothstep(0.7, 0.82, wcNoise(vec3(vHatch.x * 1.2 - wcT * 0.9, vHatch.y * 7.0, wcT * 0.5)));
  wcC = mix(wcC, vec3(1.0, 0.97, 0.88), wcGlint * 0.9 * smoothstep(0.0, 0.25, wcA));
  gl_FragColor = vec4(wcC, wcLine);` : `
  vec3 wcPig = diffuseColor.rgb;
  // Where the ground is grass, it is not left as a flat wash: it is gone over in short strokes, lighter and
  // yellower or darker and cooler than what is under them, each lying away from the eye as grass is drawn.
  float wcGrass = smoothstep(0.0, 0.05, wcPig.g - max(wcPig.r, wcPig.b)) * step(vRoot.w, 0.0) * (1.0 - smoothstep(16.0, 42.0, length(vViewPosition)));
  if (wcGrass > 0.0) {
    vec2 gp = vWorld.xz, gf = normalize(gp - cameraPosition.xz + 1e-4), gs = vec2(-gf.y, gf.x);
    float hit = 0.0, tone = 0.0;
    for (int L = 0; L < 2; L++) {
      float sc = L == 0 ? 5.0 : 11.0;
      vec2 cell = floor(gp * sc);
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 c = cell + vec2(float(i), float(j));
        vec3 h = fract(sin(vec3(dot(c, vec2(127.1, 311.7)), dot(c, vec2(269.5, 183.3)), dot(c, vec2(419.2, 371.9))) + float(L) * 17.0) * 43758.5453);
        vec2 q = gp - (c + h.xy) / sc;
        float al = dot(q, gf) / ((0.7 + 1.1 * h.z) / sc * 1.5), ac = dot(q, gs + gf * (h.x - 0.5) * 0.7) / (0.2 / sc);
        if (al > 0.0 && al < 1.0 && abs(ac) < 1.0 - al) { hit = 1.0; tone = h.x * 2.0 - 1.0; }
      }
    }
    wcPig = mix(wcPig, wcPig * (tone > 0.0 ? mix(vec3(1.0), vec3(1.55, 1.38, 0.7), tone) : mix(vec3(1.0), vec3(0.42, 0.6, 0.6), -tone)), hit * wcGrass * 0.85);
  }
  gl_FragColor = vec4(wcPaint(wcPig, wcD, vHatch, 1.0, vAt, wcA, 1.0, wcFar, wcGlare), wcLine);`;
      s.fragmentShader = 'varying vec2 vHatch; varying vec3 vAt; varying vec3 vWorld; varying vec4 vRoot;\n' + PENCIL + NOISE + AGE + PAINT + '\n'
        + s.fragmentShader.replace('#include <opaque_fragment>', LIT + '  ' + age + line + body);
    };
    m.customProgramCacheKey = () => `wash-${always}-${water}`;
    return m;
  };

  // --- the dabs ---
  const DAB_PARS = 'attribute vec3 offset; attribute vec2 dabS; attribute vec4 dabB; attribute vec4 root; varying vec2 vCorner; flat varying vec4 vDabB;\n';
  const dab = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
  dab.onBeforeCompile = (s) => {
    share(s);
    s.vertexShader = DAB_PARS + 'varying float vAge; varying vec3 vAt;\n' + NOISE + AGE + '\n' + s.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = offset;').replace('#include <project_vertex>', dabVertex(true));
    s.fragmentShader = 'varying vec2 vCorner; flat varying vec4 vDabB; varying float vAge; varying vec3 vAt;\n' + PENCIL + NOISE + AGE + PAINT + '\n'
      + s.fragmentShader.replace('void main() {', `void main() {${dabShape}
  // before the paint, only the touches that were pencilled in are there, as their outlines
  bool wcLoop = vDabB.y >= 1.0 && wcE <= 1.0 && (((wcK > 0.5 && wcK < 1.5) || wcK > 7.5) ? true : wcE > (wcK < 0.5 ? 0.935 : 0.82));
  // and then each mark comes in its own moment, from its middle out
  float wcMine = vAge - wcDelay * 0.7;
  bool wcBody = wcMine > 0.0 && wcR < mix(0.3, 1.001, smoothstep(0.0, 0.5, wcMine));
  if (!wcLoop && !wcBody) discard;
  // (a blade of grass has no foot to see: it comes up out of the wash it stands in)
  if (wcK > 0.5 && wcK < 1.5 && wcU < 0.34 * wcNoise(vAt * 45.0) + 0.04) discard;`)
        .replace('#include <opaque_fragment>', LIT + `
  float wcSh = smoothstep(0.3, 0.6, wcD);
  // leaves with the sun behind them glow
  float wcGlow = pow(max(dot(-normalize(vViewPosition), directionalLights[0].direction), 0.0), 2.0) * (1.0 - wcSh);
  vec3 wcPig = diffuseColor.rgb; float wcUse = wcD, wcPool = 1.0;
  if (wcK < 0.5 || (wcK > 5.5 && wcK < 6.5)) {
    // the masses behind the leaves: in shade they go deep and cool, not grey
    wcPig = mix(wcPig, wcPig * vec3(0.66, 0.8, 0.82), wcSh); wcUse = 0.3; wcPool = wcK < 0.5 ? 0.85 + 0.2 * smoothstep(0.5, 1.0, wcR) : 0.6;
  } else if (wcK < 1.5 || wcK > 7.5) {
    // grass: fullest of pigment at its foot
    wcPig = mix(wcPig, wcPig * vec3(0.5, 0.66, 0.62), wcSh); wcUse = wcD * 0.4; wcPool = (0.86 + 0.5 * sin(3.1416 * min(wcU * 1.2, 1.0))) * (1.0 + 0.22 * wcTone);
  } else if (wcK < 4.5) {
    // petals, of strong pigment, a little deeper between them; and the flower's eye
    float N = vDabB.w;
    wcPig = mix(wcPig, N > 9.5 ? vec3(0.88, 0.52, 0.03) : N > 6.5 ? vec3(0.05, 0.04, 0.2) : N > 4.5 ? vec3(0.8, 0.42, 0.02) : vec3(0.03, 0.02, 0.05), wcEye);
    wcUse = 0.2 + 0.35 * wcD; wcPool = 1.25 + 0.3 * smoothstep(0.4, 1.0, wcR) + 0.22 * wcTone;
  } else if (wcK < 5.5) {
    // leaves: each a little more or less full, darker and cooler in shade, thin and yellow against the sun
    wcPig = mix(wcPig, wcPig * vec3(0.62, 0.78, 0.8), wcSh); wcUse = 0.3; wcPool = (1.0 + 0.22 * wcTone + 0.18 * smoothstep(0.5, 1.0, wcR)) * (1.0 - 0.3 * wcGlow);
  } else { wcUse = 0.0; wcPool = 0.16; }
  vec3 wcC = wcPaint(wcPig, wcUse, vec2(0.0), 0.0, vAt, wcBody ? wcMine : -1.0, wcPool, wcFar, wcGlare);
  if (wcLoop) wcC *= wcBody ? vec3(0.95, 0.94, 0.96) : vec3(0.74, 0.72, 0.76);
  gl_FragColor = vec4(wcC, 0.0);`);
  };
  dab.customProgramCacheKey = () => 'wash-dab';
  // (their shadows are the whole crown's from the first, as the one who sketched it knew where the shade would fall)
  const dabDepth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, side: THREE.DoubleSide });
  dabDepth.onBeforeCompile = (s) => {
    s.uniforms.uNow = uniforms.uNow;
    s.vertexShader = DAB_PARS + 'uniform float uNow;\n' + s.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = offset;').replace('#include <project_vertex>', dabVertex(false));
    s.fragmentShader = 'varying vec2 vCorner; flat varying vec4 vDabB;\n' + NOISE + '\n' + s.fragmentShader.replace('void main() {', `void main() {${dabShape}`);
  };
  dabDepth.customProgramCacheKey = () => 'wash-dab-depth';

  // A shaft of sunlight: a long strip turned toward the eye, which lifts the paint under it toward the paper's
  // light. It is only there once the ground it falls on is painted.
  const beam = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    blending: THREE.CustomBlending, blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
    uniforms: { uMap: uniforms.uMap, uRect: uniforms.uRect, uNow: uniforms.uNow, uFinale: uniforms.uFinale },
    vertexShader: /* glsl */ `
      attribute vec3 axis; attribute vec4 beam; attribute vec4 root;
      varying vec2 vBeam; varying float vSeed; varying float vAge; varying float vDeep;
      ${NOISE}${AGE}
      void main() {
        vec3 across = normalize(cross(axis, normalize(cameraPosition - position)));
        vBeam = beam.xy; vSeed = beam.w; vAge = wcAge(root.xyz, root);
        vec4 seen = viewMatrix * vec4(position + across * beam.x * beam.z * (0.5 + 0.5 * beam.y), 1.0);
        vDeep = -seen.z;
        gl_Position = projectionMatrix * seen;
      }`,
    fragmentShader: /* glsl */ `
      varying vec2 vBeam; varying float vSeed; varying float vAge; varying float vDeep; uniform float uNow;
      ${NOISE}
      void main() {
        float x = vBeam.x, t = vBeam.y;
        float a = pow(max(1.0 - x * x, 0.0), 1.5) * smoothstep(0.0, 0.35, t) * (1.0 - smoothstep(0.88, 1.0, t));
        // a shaft is streaked: brighter threads in it, shifting slowly
        a *= 0.5 + 0.7 * wcNoise(vec3(x * 3.5 + vSeed * 30.0, t * 1.2, uNow * 0.1 + vSeed * 9.0));
        // (a shaft the eye is standing in is not seen as one)
        gl_FragColor = vec4(1.0, 0.95, 0.72, a * 0.26 * smoothstep(0.8, 4.5, vAge) * smoothstep(2.5, 9.0, vDeep));
      }`,
  });

  // A range of hills, as a watercolourist lays one in: one wash for the whole ridge, deepest along its crest, where
  // the trees on it show as a darker, broken edge, and thinning as it comes down until it is lost in mist, out of
  // which the next ridge stands. The wash is uneven in big soft clouds; the spurs that run down from the crest
  // have a cooler second wash on their shaded side. Toward the low sun it is all warmed.
  const hill = new THREE.ShaderMaterial({
    side: THREE.DoubleSide, vertexColors: true,
    uniforms: { uMap: uniforms.uMap, uRect: uniforms.uRect, uNow: uniforms.uNow, uFinale: uniforms.uFinale, uPx: uniforms.uPx, uSun: { value: new THREE.Vector3(0, 1, 0) } },
    vertexShader: /* glsl */ `
      attribute vec4 root; attribute vec4 hill; attribute vec2 hillB;
      varying vec3 vPig; varying vec4 vRoot; varying vec4 vHill; varying vec2 vHillB; varying vec3 vWorld;
      void main() {
        vPig = color; vRoot = root; vHill = hill; vHillB = hillB; vWorld = position;
        gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vPig; varying vec4 vRoot; varying vec4 vHill; varying vec2 vHillB; varying vec3 vWorld;
      uniform vec3 uSun;
      ${PENCIL}${NOISE}${AGE}
      void main() {
        // where on the ridge: round it (as a place on a circle, so that there is no seam), and how far down from its crest
        vec2 c = vHill.xy * 14.0; float t = clamp(vHill.z, 0.0, 1.0), L = vHill.w, mist = vHillB.x;
        // (the wash comes along a ridge raggedly, running ahead here and hanging back there, and from its crest down)
        float age = wcAge(vWorld, vRoot) + ((wcNoise(vec3(c * 0.5, L * 5.0)) - 0.5) * 3.2 + (wcNoise(vec3(c * 2.2, L * 9.0 + t * 2.0)) - 0.5) * 1.3 - 0.5 * t - 0.9) * 0.6;
        float P = smoothstep(0.0, 1.5, age), wet = 1.0 - smoothstep(0.0, 5.0, age), rim = 1.0 - smoothstep(0.05, 2.2, age);
        float cloud = wcNoise(vec3(c * 0.8, L * 7.0 + t * 1.5)) * 0.6 + wcNoise(vec3(c * 2.4 + 3.0, L * 3.0 + t * 4.0)) * 0.4;
        // the wash thins as it comes down, into the mist
        float fade = mix(mist, 1.0, pow(1.0 - clamp(t + (cloud - 0.5) * 0.22, 0.0, 1.0), 1.6));
        // the trees along the crest
        float trees = (1.0 - smoothstep(0.0, 0.13, t + (wcNoise(vec3(c * 5.0, L)) - 0.5) * 0.08)) * (0.4 + 0.6 * wcNoise(vec3(c * 11.0, L + 4.0)));
        // the spurs: streaks that slant as they come down
        float spur = smoothstep(0.42, 0.7, wcNoise(vec3(c * 1.7 + vec2(-vHill.y, vHill.x) * t * 2.2, L * 3.0 + 1.0))) * (1.0 - smoothstep(0.25, 0.8, t));
        float density = fade * (0.88 + 0.24 * cloud) * (1.0 + 0.45 * trees + 0.22 * spur) * (1.0 + 0.3 * wet + 0.6 * rim);
        vec3 left = pow(max(vPig, vec3(0.012)), vec3(density));
        left *= mix(vec3(1.0), vec3(0.6, 0.64, 0.86), spur * 0.3 * fade);
        // warmed toward the sun
        float toSun = pow(max(dot(normalize(vWorld - cameraPosition), uSun), 0.0), 3.0);
        left = mix(left, vec3(1.0, 0.86, 0.56), toSun * 0.42);
        // before the paint: a few slanting strokes of pencil under the crest
        vec3 sketch = mix(vec3(1.0), vec3(0.4, 0.38, 0.44), pcStrokes(vHillB.y, (0.1 + 0.22 * spur) * (1.0 - t)) * 0.42);
        gl_FragColor = vec4(mix(sketch, left, P), 1.0 - P);
      }`,
  });

  return { hill, beam, px: uniforms.uPx, uniforms, paint, solid: make(), both: make({ side: THREE.DoubleSide }), always: make({ always: true }), alwaysBoth: make({ always: true, side: THREE.DoubleSide }), water: make({ water: true, side: THREE.DoubleSide }), dab, dabDepth };
}

/** Collects solid pieces and makes one mesh of them. root: [x, y, z, seconds a metre] the piece takes its paint from; without one, each point from the ground it is on. */
export function createBatch(material) {
  const parts = [];
  return {
    add(g, colour = '#cccccc', a, b, root = null) {
      if (!g.attributes.normal) g.computeVertexNormals();
      if (!g.attributes.hatch) field(g, a, b);
      if (!g.attributes.color) hue(g, colour);
      const p = g.attributes.position, r = new Float32Array(p.count * 4);
      for (let i = 0; i < p.count; i++) r.set(root ?? [p.getX(i), p.getY(i), p.getZ(i), 0], i * 4);
      g.setAttribute('root', new THREE.BufferAttribute(r, 4));
      g.deleteAttribute('uv');
      parts.push(g.index ? g.toNonIndexed() : g);
      return g;
    },
    build() {
      const mesh = new THREE.Mesh(mergeGeometries(parts), material);
      mesh.castShadow = mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      return mesh;
    },
    get count() { return parts.length; },
  };
}

const UP = new THREE.Vector3(0, 1, 0);
/** Collects touches of the brush and makes one mesh of them: one square, drawn once for each. */
export function createDabs(material, depth) {
  const c = new THREE.Color();
  let cap = 1 << 16, n = 0;
  const cols = { offset: 3, normal: 3, color: 3, dabS: 2, dabB: 4, root: 4 }, data = {};
  for (const k of Object.keys(cols)) data[k] = new Float32Array(cap * cols[k]);
  const grow = () => { cap *= 2; for (const k of Object.keys(cols)) { const more = new Float32Array(cap * cols[k]); more.set(data[k]); data[k] = more; } };
  return {
    /** One touch at (x, y, z). w, h: half its width and height. kind: see the list of kinds (for a flower, `sway` is
     *  how many petals). turn: which way round it lies, or for grass its lean. line: it is in the underdrawing.
     *  at: its root. */
    add(x, y, z, { w, h = w, turn = 0, seed = 0.5, kind = 0, colour, normal = UP, at = null, line = false, sway = 0 }) {
      if (n === cap) grow();
      c.set(colour);
      data.offset.set([x, y, z], n * 3); data.normal.set([normal.x, normal.y, normal.z], n * 3); data.color.set([c.r, c.g, c.b], n * 3);
      data.dabS.set([w, h], n * 2); data.dabB.set([turn, Math.min(seed, 0.999) + (line ? 2 : 0), kind, sway], n * 4);
      data.root.set(at ?? [x, y, z, 0], n * 4);
      n++;
    },
    build() {
      const g = new THREE.InstancedBufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], 3));
      g.setIndex([0, 1, 2, 0, 2, 3]);
      for (const k of Object.keys(cols)) g.setAttribute(k, new THREE.InstancedBufferAttribute(data[k].slice(0, n * cols[k]), cols[k]));
      g.instanceCount = n;
      const mesh = new THREE.Mesh(g, material);
      mesh.customDepthMaterial = depth;
      mesh.castShadow = mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      return mesh;
    },
    get count() { return n; },
  };
}
