// Coloured pencil, made in code. A pencil drawing is colour laid in strokes, lightly, in layers: the thing's own
// colour first, all over (over a touch of warm yellow where the sun is on it); then more of it, harder, where the
// form turns from the light; then a blue-violet pencil across those strokes in the shade. The white of the paper is the light, and the paper's tooth shows
// through everything, because wax only catches on its high places.
//
// Nothing here is a filter over a finished picture. Every surface carries two "fields" (numbers that change
// smoothly over it) and its strokes lie along their level lines: so the strokes belong to the thing and stay on
// it as it and the eye move. What follows the eye is only how many are drawn: they are kept about so many pixels
// apart on the paper by drawing every stroke, every second, every fourth... and the ones between come in from
// nothing as a thing comes nearer. No stroke ever slides along its surface or is swapped for another.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const PENCIL = /* glsl */ `
uniform float uPx; // how far apart the strokes are, in pixels
float pcHash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float pcHash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float pcNoise(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(pcHash3(i), pcHash3(i + vec3(1, 0, 0)), f.x), mix(pcHash3(i + vec3(0, 1, 0)), pcHash3(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(pcHash3(i + vec3(0, 0, 1)), pcHash3(i + vec3(1, 0, 1)), f.x), mix(pcHash3(i + vec3(0, 1, 1)), pcHash3(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
// the tooth of the paper as the thing meets it: 0 a valley the wax skips, 1 a height it catches on.
// (Far off, where its grain would be finer than a pixel, it is evened out.)
float pcTooth(vec3 at) {
  float fine = length(fwidth(at));
  return mix(0.5, pcNoise(at * 19.0), clamp(1.0 - fine * 14.0, 0.0, 1.0)) * 0.6 + mix(0.5, pcNoise(at * 47.0 + 5.0), clamp(1.0 - fine * 35.0, 0.0, 1.0)) * 0.4;
}
// one soft stroke W pixels wide, d pixels from its middle
float pcStroke(float W, float d) { return smoothstep(W * 0.5 + 1.0, W * 0.5 - 1.0, d) * min(1.0, W * 0.6); }
// A layer of strokes along the level lines of h, covering "cover" of the paper: how much wax, 0 to 1.
float pcStrokes(float h, float cover) {
  float g = length(vec2(dFdx(h), dFdy(h))) + 1e-9;
  float k = -log2(g * uPx), kf = floor(k), t = k - kf, s = exp2(kf), P = 1.0 / (g * s), x = h * s;
  float ic = floor(x + 0.5), im = floor(x) + 0.5;
  float W = cover * P / (1.0 + t) * 1.3;
  // (no two strokes are pressed alike, or are quite as wide)
  float a = pcStroke(W * (0.65 + 0.7 * pcHash(ic / s + 3.7)), abs(x - ic) * P) * (0.55 + 0.45 * pcHash(ic / s));
  float b = pcStroke(W * t * (0.65 + 0.7 * pcHash(im / s + 3.7)), abs(x - im) * P) * (0.55 + 0.45 * pcHash(im / s));
  return max(a, b);
}
// What is left of the paper's white once a thing is drawn. local: its own pencil. D: 0 in the light to 1 in the dark.
vec3 pcDraw(vec3 local, float D, vec2 h, vec3 at) {
  float tooth = pcTooth(at);
  vec2 wob = vec2(0.012 * sin(at.x * 5.0 + at.y * 3.0) + 0.01 * sin(at.z * 6.3 - at.y * 4.1), 0.012 * sin(at.z * 4.6 + at.x * 2.7) + 0.01 * sin(at.y * 5.9 + at.x * 3.3));
  // the shadow pencil: the thing's own colour gone dark and cool
  vec3 shade = mix(local * 0.5, vec3(0.24, 0.2, 0.62), 0.55);
  vec3 left = vec3(1.0);
  // sunlight first: a warm yellow, very lightly, wherever the light falls
  left *= mix(vec3(1.0), vec3(1.0, 0.9, 0.56), clamp((1.0 - smoothstep(0.0, 0.4, D)) * 0.34 * (0.45 + 0.9 * tooth), 0.0, 1.0));
  // its own colour laid lightly all over, less where the light is strongest
  left *= mix(vec3(1.0), local, clamp((0.36 + 0.45 * smoothstep(0.0, 0.7, D)) * (0.5 + 0.85 * tooth), 0.0, 1.0));
  // then strokes of it, pressed harder into the shade
  left *= mix(vec3(1.0), local, clamp(pcStrokes(h.x + wob.x, 0.45 + 0.4 * D) * (0.62 + 0.5 * D) * (0.55 + 0.8 * tooth), 0.0, 1.0));
  // and across them, where the light doesn't reach, the shadow pencil
  left *= mix(vec3(1.0), shade, clamp(pcStrokes(h.y + wob.y, clamp((D - 0.24) * 1.35, 0.0, 0.82)) * (0.5 + 0.75 * tooth) * 0.95, 0.0, 1.0));
  return left;
}`;

const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Color();
/** The fields of a piece, as two flat slicings: its strokes lie where planes square to `a` (and, in shade, to `b`) meet it. The usual pair is the slant of a right hand. */
export function field(g, a = [0.62, 1, 0.34], b = [-0.78, 1, 0.22]) {
  A.set(...a).normalize(); B.set(...b).normalize();
  const p = g.attributes.position, h = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) { h[i * 2] = p.getX(i) * A.x + p.getY(i) * A.y + p.getZ(i) * A.z; h[i * 2 + 1] = p.getX(i) * B.x + p.getY(i) * B.y + p.getZ(i) * B.z; }
  g.setAttribute('hatch', new THREE.BufferAttribute(h, 2));
  return g;
}
/** The fields of a piece from any rule: fn(x, y, z, i) gives [h1, h2]. */
export function fieldBy(g, fn) {
  const p = g.attributes.position, h = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) h.set(fn(p.getX(i), p.getY(i), p.getZ(i), i), i * 2);
  g.setAttribute('hatch', new THREE.BufferAttribute(h, 2));
  return g;
}
/** Which pencil a piece is drawn with: a colour, or fn(x, y, z, i, nx, ny, nz) giving one. */
export function hue(g, value) {
  const p = g.attributes.position, n = g.attributes.normal, c = new Float32Array(p.count * 3);
  if (typeof value !== 'function') C.set(value);
  for (let i = 0; i < p.count; i++) {
    if (typeof value === 'function') C.set(value(p.getX(i), p.getY(i), p.getZ(i), i, n?.getX(i) ?? 0, n?.getY(i) ?? 1, n?.getZ(i) ?? 0));
    c.set([C.r, C.g, C.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  return g;
}

export function createPencil() {
  const px = { value: 5 };
  /** A material that draws what it is on in coloured pencil. flat: one even line of its colour (a string, a rope). */
  const make = ({ side = THREE.FrontSide, flat = false } = {}) => {
    const m = new THREE.MeshLambertMaterial({ vertexColors: true, side, depthWrite: !flat });
    m.onBeforeCompile = (s) => {
      s.uniforms.uPx = px;
      s.vertexShader = 'attribute vec2 hatch; varying vec2 vHatch; varying vec3 vAt;\n' + s.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vHatch = hatch; vAt = position;');
      s.fragmentShader = 'varying vec2 vHatch; varying vec3 vAt;\n' + PENCIL + '\n' + s.fragmentShader.replace('#include <opaque_fragment>', flat ? 'gl_FragColor = vec4(mix(vec3(1.0), diffuseColor.rgb, 0.8), 1.0);'
        : 'float pcLit = dot(outgoingLight, vec3(0.3333)) / max(dot(diffuseColor.rgb, vec3(0.3333)), 0.03);\n  gl_FragColor = vec4(pcDraw(diffuseColor.rgb, 1.0 - clamp(pow(pcLit, 0.8), 0.0, 1.0), vHatch, vAt), 1.0);');
    };
    m.customProgramCacheKey = () => (flat ? 'pencil-flat' : 'pencil');
    return m;
  };
  return { px, make, line: make(), both: make({ side: THREE.DoubleSide }), flat: make({ flat: true, side: THREE.DoubleSide }) };
}

/** Collects pieces and makes one mesh of them. */
export function createBatch(material) {
  const parts = [];
  return {
    /** colour: its pencil; a, b: which way its strokes lie (see field); skipped for a piece that has its own. */
    add(g, colour = '#cccccc', a, b) {
      if (!g.attributes.normal) g.computeVertexNormals();
      if (!g.attributes.hatch) field(g, a, b);
      if (!g.attributes.color) hue(g, colour);
      g.deleteAttribute('uv');
      parts.push(g.index ? g.toNonIndexed() : g);
      return g;
    },
    build() {
      const mesh = new THREE.Mesh(mergeGeometries(parts), material);
      mesh.castShadow = mesh.receiveShadow = true;
      if (!material.depthWrite) mesh.renderOrder = 10;
      return mesh;
    },
    get count() { return parts.length; },
  };
}
