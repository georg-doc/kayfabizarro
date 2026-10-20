/* clay-eyelid.v3.js — KFB Clay-Lid E2, same skin as v2 (V-348 PASS), plus the one attribute the KFB clay shader reads.
   WHY: clay-material v10 (ToolBox kfb-lib/clay/clay-material.v10.js) declares `attribute vec3 claySeed` and shades in
   object space (vClayP = position). It does NOT read `uv`. The E2 geometry from v2 has only position + normal, so a
   clay makeMat on the lid would run with claySeed = (0,0,0) for every lid. v3 adds a constant per-geometry claySeed
   (same hash as clay-material.v10 seedGeometry), nothing else. No uv on purpose: no KFB lid shader reads it, and a
   uv on this closed sphere would need a seam that nobody has approved.
   Geometry, topology, defaults and the aperture mapping are v2 byte for byte (v2 is imported, not copied).
   v2 stays unchanged (repo e1e60edff, sha256 7f1cf72f…). */
import {
  clayEyelidSkinData, clayEyelidSkinGeometry as skinGeometryV2, updateClayEyelidSkin as updateSkinV2,
  apertureV6, DEFAULTS2, CLAY_SKIN_SCHEMA, V6,
} from './clay-eyelid.v2.js';
export { clayEyelidSkinData, apertureV6, DEFAULTS2, CLAY_SKIN_SCHEMA, V6 };
export const CLAY_EYELID_V3 = 'kfb.clay-eyelid-skin/3 (v2 geometry + claySeed)';

/* Same hash as clay-material.v10 seedGeometry(THREE, g, seed). */
export function claySeedTriple(seed = 0) {
  return [Math.sin(seed * 12.9898) * 43758.5453, Math.sin(seed * 78.233) * 12345.678, Math.sin(seed * 39.425) * 24634.6345]
    .map((v) => v - Math.floor(v));
}

/* Largest radius of the skin in units of R (outer surface incl. rim bulge): (1 + clearance) + thickness·(1 + bulge).
   Defaults: 1.012 + 0.10·1.12 = 1.124 R (ALIEN_STALK_E2_PLAN §5). Upper bound; sampled vertices stay at or below it. */
export function skinOuterMax(opt = {}) {
  const o = Object.assign({}, DEFAULTS2, opt);
  return (1 + o.clearance) + o.thickness * (1 + o.bulge);
}

export function clayEyelidSkinGeometry(THREE, opt = {}) {
  const g = skinGeometryV2(THREE, opt);
  const n = g.attributes.position.count, r = claySeedTriple(opt.claySeed || 0), a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = r[0]; a[i * 3 + 1] = r[1]; a[i * 3 + 2] = r[2]; }
  g.setAttribute('claySeed', new THREE.BufferAttribute(a, 3));
  return g;
}

/* Positions + normals only; claySeed and the index stay as they are (topology is constant in every lid state). */
export function updateClayEyelidSkin(g, opt = {}) { return updateSkinV2(g, opt); }
