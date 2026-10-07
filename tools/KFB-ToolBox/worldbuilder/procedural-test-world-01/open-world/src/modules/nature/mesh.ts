// Per-chunk merging of nature placements (one mesh per material) + the calm wind-sway material.
import * as THREE from 'three';
import type { Proto } from './protos';

export interface Placement {
  proto: Proto;
  x: number;
  y: number;
  z: number;
  rot: number;
  s: number;
  /** Wind amplitude in metres at the top of the piece (0 = static). */
  wind: number;
  phase: number;
  /** Near-only detail (bushes, small rocks): hidden beyond the detail radius. */
  detail?: boolean;
  /** Foliage tint −1 (bluer) … +1 (yellower), per cluster. */
  tint?: number;
}

/** Shared uniforms for every nature material (updated once per frame by the module). */
export const natUniforms = {
  uWindTime: { value: 0 },
  uNatCam: { value: new THREE.Vector3() },
  uNatPlayer: { value: new THREE.Vector3() },
  uNatPlayerOn: { value: 0 },
};
/** Back-compat alias. */
export const windTime = natUniforms.uWindTime;

const natMats = new Map<THREE.Material, THREE.Material>();
const grassMats = new Map<THREE.Material, THREE.Material>();

/**
 * Nature clone of a canonical pack material (built-in MeshStandardMaterial → fog, lights and shadows unchanged):
 *  - calm wind sway: vertices move along a fixed breeze by aNat.x (m, height-weighted), two slow sines, per-piece phase;
 *  - per-cluster foliage tint (aNat.w, ±): slightly yellower / bluer greens so stands are not one flat colour;
 *  - camera-friendly foliage: foliage fragments (aNat.z = 1; trunks/rocks never) are screen-door dithered out
 *    (a) within ~1.3–2.4 m of the camera and (b) inside a cylinder around the camera → player line (radius ~1.1 → 2 m
 *    soft edge), so crowns never hide the player or slice the near plane. Shadows use the default depth material →
 *    the full tree still casts its shadow.
 */
export function windMaterial(base: THREE.Material, grass = false): THREE.Material {
  const cache = grass ? grassMats : natMats;
  let m = cache.get(base);
  if (m) return m;
  const c = (base as THREE.MeshStandardMaterial).clone();
  c.name = (base.name || 'mat') + '-nature';
  c.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, natUniforms);
    // instanced grass has no aNat attribute: it counts as small detail (flag 2), no wind, no tint
    const natDecl = grass
      ? 'const vec4 aNat = vec4(0.0, 0.0, 2.0, 0.0);\n#define NAT_ANCHOR vec4((modelMatrix * NAT_INST * vec4(0.0, 0.3, 0.0, 1.0)).xyz, 0.45)'
      : 'attribute vec4 aNat;\nattribute vec4 aAnchor;\n#define NAT_ANCHOR aAnchor';
    const worldPos = '(modelMatrix * NAT_INST * vec4(transformed, 1.0)).xyz';
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>\n${natDecl}\n#ifdef USE_INSTANCING\n#define NAT_INST instanceMatrix\n#else\n#define NAT_INST mat4(1.0)\n#endif\nuniform float uWindTime;\nuniform vec3 uNatCam;\nuniform vec3 uNatPlayer;\nuniform float uNatPlayerOn;\nvarying vec3 vNatW;\nvarying vec2 vNatF;\nvarying float vNatA;`)
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          float t = uWindTime;
          float w = sin(t * 0.9 + aNat.y) * 0.7 + sin(t * 2.1 + aNat.y * 1.7) * 0.3;
          transformed.xz += vec2(0.8, 0.6) * (w * aNat.x);
          vNatF = aNat.zw;
          vNatW = ${worldPos};
          // whole-instance fade (trunks, branches, bushes, rocks, grass): one alpha per instance from its anchor sphere
          // (xyz centre, w radius) — never a hole. Fades when the instance crosses the camera→Knight line in front of
          // him, or when the camera is (nearly) inside it.
          vec4 A = NAT_ANCHOR;
          float fade = 1.0 - smoothstep(0.5, 1.5, distance(A.xyz, uNatCam) - A.w);
          if (uNatPlayerOn > 0.5) {
            vec3 P = uNatPlayer + vec3(0.0, 0.95, 0.0);
            vec3 d = P - uNatCam;
            float L = max(length(d), 0.001);
            vec3 dir = d / L;
            float t = dot(A.xyz - uNatCam, dir);
            float dp = length(A.xyz - (uNatCam + dir * t));
            float along = smoothstep(0.0, 0.6, t) * (1.0 - smoothstep(L - 0.6, L + 0.1, t));
            fade = max(fade, 0.8 * along * (1.0 - smoothstep(A.w + 0.25, A.w + 0.9, dp)));
          }
          vNatA = 1.0 - fade;
        }`,
      );
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform vec3 uNatCam;
        uniform vec3 uNatPlayer;
        uniform float uNatPlayerOn;
        varying vec3 vNatW;
        varying vec2 vNatF;
        varying float vNatA;`,
      )
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
        // Occlusion cut-out (no veil): fragments are removed completely (a = 0) only
        //  (a) within 1.0–1.4 m of the camera (near-plane slicing), and
        //  (b) inside a cone from the camera to the Knight's body: radius grows linearly with the distance along the
        //      line (= a constant screen-space circle around the Knight; 1.1 m at the Knight for foliage, 0.75 m for
        //      trunks/rocks/bushes), ending just before him — nothing beside or behind him is touched.
        // The 0.1–0.2 m edge is a real alpha ramp resolved by alpha-to-coverage on the MSAA target (smooth, not dotted).
        // screen-space anti-aliased step: a 1–2 pixel ramp (resolved by alpha-to-coverage), never a wide translucent band
        #define NAT_AASTEP(e, v) clamp(((v) - (e)) / max(fwidth(v), 1e-4) + 0.5, 0.0, 1.0)
        // crowns (flag 1) keep the cone cut-out above the Knight; everything else uses its whole-instance alpha
        bool natCrown = vNatF.x > 0.5 && vNatF.x < 1.5;
        float camD = distance(vNatW, uNatCam);
        // small detail (bushes, grass: flag 2) clears a wider near-camera bubble — they sit at camera height under canopies
        float natSmall = step(1.5, vNatF.x);
        float natA = NAT_AASTEP(mix(1.2, 2.3, natSmall), camD);
        if (uNatPlayerOn > 0.5) {
          vec3 P = uNatPlayer + vec3(0.0, 0.95, 0.0);
          vec3 d = P - uNatCam;
          float L = max(length(d), 0.001);
          vec3 dir = d / L;
          float t = dot(vNatW - uNatCam, dir);
          float fol = step(0.5, vNatF.x);
          float tEnd = L - mix(0.45, 0.25, fol);
          float r = length(vNatW - (uNatCam + dir * t));
          // crowns: 1.1 m at the Knight. Trunks/branches: 0.42 m far from him, widening to 0.9 m within the last ~2.5 m
          // before him (a trunk or low broad-leaf branch he runs past), with a soft 0.3 m world-space ramp there so it
          // fades in over a few frames instead of popping.
          float nearK = (1.0 - fol) * smoothstep(L - 3.0, L - 1.0, t);
          float R = mix(mix(0.42, 1.1, fol) * max(t, 0.0) / L + 0.05, 0.9, nearK);
          float soft = 0.3 * nearK;
          float radial = soft > 0.01 ? smoothstep(R, R + soft, r) : NAT_AASTEP(R, r);
          // inside = within the cone radius AND in front of the Knight
          float outside = max(radial, NAT_AASTEP(tEnd, t));
          if (t > 0.0) natA = min(natA, outside);
        }
        if (!natCrown) natA = vNatA;
        if (natA < 0.02) discard;`,
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        if (vNatF.x > 0.5) diffuseColor.rgb *= mix(vec3(0.93, 0.97, 1.03), vec3(1.07, 1.05, 0.9), vNatF.y * 0.5 + 0.5);
        diffuseColor.a *= natA;`,
      );
  };
  // alpha → MSAA sample coverage: the thin cut-out edge resolves smoothly; the shadow pass keeps the default depth
  // material (no fade) — three clones a plain MeshDepthMaterial for alphaToCoverage materials, so shadows stay whole.
  c.alphaToCoverage = true;
  c.customProgramCacheKey = () => (grass ? 'nature-grass-v13' : 'nature-v13');
  cache.set(base, c);
  return c;
}

/** Merge placements into one BufferGeometry per material. */
export function mergePlacements(list: Placement[], wind: boolean, far = false): { material: THREE.Material; geometry: THREE.BufferGeometry }[] {
  const byMat = new Map<THREE.Material, { v: number; i: number; items: Placement[] }>();
  const protoOf = (p: Placement) => (far && p.proto.far) || p.proto;
  for (const p of list)
    for (const part of protoOf(p).parts) {
      let e = byMat.get(part.material);
      if (!e) byMat.set(part.material, (e = { v: 0, i: 0, items: [] }));
      e.v += part.pos.length / 3;
      e.i += part.idx.length;
      if (e.items[e.items.length - 1] !== p) e.items.push(p);
    }
  const out: { material: THREE.Material; geometry: THREE.BufferGeometry }[] = [];
  for (const [mat, e] of byMat) {
    const pos = new Float32Array(e.v * 3), nor = new Float32Array(e.v * 3), uv = new Float32Array(e.v * 2);
    const aw = wind ? new Float32Array(e.v * 4) : null;
    const an = wind ? new Float32Array(e.v * 4) : null;
    const idx = new Uint32Array(e.i);
    let vo = 0, io = 0;
    for (const p of e.items) {
      const cs = Math.cos(p.rot), sn = Math.sin(p.rot), s = p.s;
      // instance anchor sphere (whole-instance fade): trunk mid-height for trees (broad: wider for low branches)
      const pr = p.proto, k0 = pr.kind;
      const tree = k0 === 'pine' || k0 === 'broad' || k0 === 'bare';
      const ah = tree ? Math.min(pr.canopyBottom * s, 3.2) * 0.5 : pr.height * s * 0.5;
      const ar = k0 === 'broad' ? 1.3 : tree ? Math.max(0.25, pr.trunkR * s) + 0.1 : Math.max(0.3, pr.footR * s * 0.75);
      for (const part of protoOf(p).parts) {
        if (part.material !== mat) continue;
        const n = part.pos.length / 3;
        for (let k = 0; k < n; k++) {
          const lx = part.pos[k * 3], ly = part.pos[k * 3 + 1], lz = part.pos[k * 3 + 2];
          // three.js rotation.y: x' = x cos + z sin, z' = -x sin + z cos
          pos[(vo + k) * 3] = p.x + s * (lx * cs + lz * sn);
          pos[(vo + k) * 3 + 1] = p.y + s * ly;
          pos[(vo + k) * 3 + 2] = p.z + s * (-lx * sn + lz * cs);
          const nx = part.nor[k * 3], ny = part.nor[k * 3 + 1], nz = part.nor[k * 3 + 2];
          nor[(vo + k) * 3] = nx * cs + nz * sn;
          nor[(vo + k) * 3 + 1] = ny;
          nor[(vo + k) * 3 + 2] = -nx * sn + nz * cs;
          if (part.uv) { uv[(vo + k) * 2] = part.uv[k * 2]; uv[(vo + k) * 2 + 1] = part.uv[k * 2 + 1]; }
          if (aw) {
            const h = part.hf[k];
            aw[(vo + k) * 4] = p.wind * h * h;
            aw[(vo + k) * 4 + 1] = p.phase;
            aw[(vo + k) * 4 + 2] = part.fol[k] * (p.detail ? 2 : 1);
            aw[(vo + k) * 4 + 3] = p.tint ?? 0;
            an![(vo + k) * 4] = p.x; an![(vo + k) * 4 + 1] = p.y + ah; an![(vo + k) * 4 + 2] = p.z; an![(vo + k) * 4 + 3] = ar;
          }
        }
        for (let k = 0; k < part.idx.length; k++) idx[io + k] = part.idx[k] + vo;
        vo += n;
        io += part.idx.length;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    if (aw) g.setAttribute('aNat', new THREE.BufferAttribute(aw, 4));
    if (an) g.setAttribute('aAnchor', new THREE.BufferAttribute(an, 4));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeBoundingSphere();
    g.computeBoundingBox();
    out.push({ material: wind ? windMaterial(mat) : mat, geometry: g });
  }
  return out;
}
