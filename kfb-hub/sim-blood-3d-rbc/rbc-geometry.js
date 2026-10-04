/**
 * SimBlood · 3D Morphology Lab · RBC geometry v0.2
 * Deterministic parametric RBC geometry (single source of truth for the browser proof).
 *
 * Units: 1 scene unit = 1 µm.
 * Determinism: every variation derives from (preset + parameters + seed). No Math.random().
 *
 * v0.2 (2026-09-18) — Quick wins Q1 + Q3 from docs/3D_LANE_MASTERPLAN_v0.1.md
 *   Q1  The morphology family is now driven by two PHYSICAL controls instead of three
 *       invented visual ones:
 *         membraneArea  A    [µm²]  membrane surface area
 *         reducedVolume ν    [-]    V / volume of a sphere with the same area
 *         areaDifference Δa₀ [-]    reduced area difference between the bilayer leaflets
 *       This follows the bilayer-couple parameterization used in the
 *       stomatocyte–discocyte–echinocyte (SDE) literature
 *       (Geekiyanage et al., PLOS ONE 2019, doi:10.1371/journal.pone.0215447;
 *        LBM-IBM-DEM formulation, PMC9132841).
 *       ν drives size/thickness/depression, Δa₀ drives crenation (positive) or
 *       invagination (negative). The old keys (diameter, thickness,
 *       centralDepression, spicule*) remain — they are now DERIVED values and stay
 *       in the record so every earlier preset/manifest keeps reading.
 *
 *       HONEST LIMIT: this is a documented phenomenological MAPPING from (A, ν, Δa₀)
 *       to shape, not an energy minimization. It reproduces the published shape
 *       sequence qualitatively. Calibration against solver-generated target shapes
 *       (e.g. MemRBC, GPL-3.0-or-later, offline) is an open task.
 *
 *   Q3  Explicit LOD tiers so a runtime-weight mesh exists next to the authoring mesh.
 *
 * The same profile math is re-implemented in
 *   authoring/blender/rbc_base_v01.py
 * so Blender and browser produce comparable geometry.
 *
 * NOT a medical ground truth. Shape corridors are didactic approximations.
 */

import * as THREE from 'three';

/* ---------- deterministic RNG (mulberry32) ---------- */
export function rng(seed) {
  let a = (seed | 0) >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- profile ----------
 * Biconcave half-height profile over normalized radius rho = r / (D/2):
 *   zBi(rho) = sqrt(1 - rho^2) * (c0 + c1*rho^2 + c2*rho^4)
 * Coefficients tuned so a D = 7.8 µm disc reaches ~2.45 µm max thickness at
 * rho ~ 0.72 and ~1.0 µm central thickness — the textbook corridor for a
 * normal erythrocyte. Analytic form follows the Evans/Fung biconcave family.
 *
 * A domed (near-spherical, oblate) profile is blended in as centralDepression
 * falls towards 0 — that blend is the spherocyte transformation.
 */
const C0 = 0.5, C1 = 2.984, C2 = -1.0;
const DOME_PEAK = 1.232; // matches zBi peak so thickness stays comparable

function zBi(rho) {
  const s = Math.sqrt(Math.max(0, 1 - rho * rho));
  const r2 = rho * rho;
  return s * (C0 + C1 * r2 + C2 * r2 * r2);
}
function zDome(rho) {
  return DOME_PEAK * Math.pow(Math.max(0, 1 - rho * rho), 0.42);
}
function halfHeight(rho, centralDepression) {
  const t = Math.min(1, Math.max(0, centralDepression));
  return (1 - t) * zDome(rho) + t * zBi(rho);
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const clamp01 = (v) => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- Q1 · physical parameterization ----------
 * Anchors are calibrated so ν = 0.60 reproduces the v0.1 normal disc and
 * ν = 0.95 reproduces the v0.1 spherocyte profile.
 *
 * R_eq = sqrt(A / 4π) is the radius of the sphere with the same membrane area.
 * diameterFactor maps ν to D / (2·R_eq): a discocyte spreads wider than its
 * equivalent sphere, a spherocyte converges on it.
 */
const NU_DISC = 0.60;
const NU_SPHERE_LIMIT = 1.0;

function diameterFactor(nu) {
  if (nu <= NU_DISC) return 1.19;
  if (nu >= 0.95) return lerp(1.0, 1.0, 1);
  return lerp(1.19, 1.0, (nu - NU_DISC) / (0.95 - NU_DISC));
}
function thicknessFactor(nu) {
  if (nu <= NU_DISC) return 1.0;
  if (nu <= 0.95) return lerp(1.0, 2.05, (nu - NU_DISC) / (0.95 - NU_DISC));
  return lerp(2.05, 2.66, clamp01((nu - 0.95) / (NU_SPHERE_LIMIT - 0.95)));
}

/**
 * Map the physical record to the derived shape values the mesh builder consumes.
 * phys: { membraneArea, reducedVolume, areaDifference, ellipticity?, edgeIrregularity?,
 *         surfaceVariation?, spiculeDistribution? }
 */
export function deriveValues(phys) {
  const A = phys.membraneArea ?? 135;
  const nu = clamp(phys.reducedVolume ?? NU_DISC, 0.45, 1.0);
  const da = clamp(phys.areaDifference ?? 0, -0.8, 0.8);

  const Req = Math.sqrt(A / (4 * Math.PI));
  const diameter = 2 * Req * diameterFactor(nu);
  const thickness = thicknessFactor(nu);

  // depression: maximal for the discocyte, lost as ν → 1, reduced by crenation
  const depNu = clamp01((1 - nu) / (1 - NU_DISC));
  const crenation = clamp01(da / 0.6);
  const centralDepression = clamp01(depNu * (1 - 0.45 * crenation));

  // positive Δa₀ → spicules; grading follows echinocyte I / II / III in the literature
  const spiculeCount = da > 0.06 ? Math.round(lerp(10, 34, crenation)) : 0;
  const spiculeLength = da > 0.06 ? lerp(0.18, 0.62, crenation) : 0;
  const spiculeIntensity = da > 0.06 ? lerp(0.55, 0.92, crenation) : 0;

  // negative Δa₀ → invagination: one face cups inward (stomatocytic direction).
  // Deliberately NOT exposed as a named morphology — no preset claims it.
  const asymmetry = clamp01(-da / 0.6) * 0.55;

  return {
    membraneArea: A,
    reducedVolume: nu,
    areaDifference: da,
    diameter,
    thickness,
    centralDepression,
    asymmetry,
    ellipticity: phys.ellipticity ?? 0.03,
    edgeIrregularity: phys.edgeIrregularity ?? 0.012,
    surfaceVariation: phys.surfaceVariation ?? 0.05,
    spiculeCount,
    spiculeLength,
    spiculeIntensity,
    spiculeDistribution: phys.spiculeDistribution ?? (spiculeCount ? 'surface-even' : 'none'),
    equivalentRadius: Req
  };
}

/* ---------- parameter contract ---------- */
export const PARAM_DEFS = [
  { key: 'membraneArea',   label: 'Membranfläche',        unit: 'µm²', min: 95,    max: 165, step: 0.5,  physical: true },
  { key: 'reducedVolume',  label: 'Reduziertes Volumen ν',unit: '',    min: 0.5,   max: 1.0, step: 0.005, physical: true },
  { key: 'areaDifference', label: 'Flächendifferenz Δa₀', unit: '',    min: -0.6,  max: 0.7, step: 0.005, physical: true },
  { key: 'ellipticity',      label: 'Elliptizität',       unit: '',    min: 0,   max: 0.35, step: 0.01 },
  { key: 'edgeIrregularity', label: 'Randunruhe',         unit: '',    min: 0,   max: 0.35, step: 0.005 },
  { key: 'surfaceVariation', label: 'Oberflächenvarianz', unit: '',    min: 0,   max: 0.3,  step: 0.005 }
];

/** Read-only derived values shown next to the sliders. */
export const DERIVED_DEFS = [
  { key: 'diameter',          label: 'Durchmesser',         unit: 'µm', digits: 2 },
  { key: 'thickness',         label: 'Dickenfaktor',        unit: '×',  digits: 2 },
  { key: 'centralDepression', label: 'Zentrale Eindellung', unit: '',   digits: 2 },
  { key: 'spiculeCount',      label: 'Fortsätze',           unit: '',   digits: 0 },
  { key: 'spiculeLength',     label: 'Fortsatzlänge',       unit: 'µm', digits: 2 }
];

export const BASE_MESH_ID = 'rbc-base-v02';

/* ---------- Q3 · LOD tiers ----------
 * triangles = 4 · rings · segments
 */
export const LODS = {
  authoring: { id: 'authoring', label: 'Authoring', rings: 52, segments: 112 },
  runtime:   { id: 'runtime',   label: 'Runtime',   rings: 26, segments: 56 },
  embed:     { id: 'embed',     label: 'Embed',     rings: 18, segments: 40 }
};
export const TESSELLATION = LODS.authoring;
export function triangleCount(lod) { return 4 * lod.rings * lod.segments; }

/** Bounded presets. The physical block is the record; values are derived from it. */
const PRESET_SPEC = {
  normal: {
    id: 'rbc3d-norm-v02',
    morphologyId: 'RBC-NORM',
    label: 'Normaler Erythrozyt',
    short: 'Normal',
    seed: 10111,
    note: 'Bikonkave Scheibe, axial weitgehend symmetrisch, geringe natürliche Varianz.',
    physical: {
      membraneArea: 135, reducedVolume: 0.60, areaDifference: 0,
      ellipticity: 0.03, edgeIrregularity: 0.012, surfaceVariation: 0.05
    }
  },
  spherocyte: {
    id: 'rbc3d-spher-v02',
    morphologyId: 'RBC-SPH',
    label: 'Sphärozyt',
    short: 'Sphärozyt',
    seed: 20222,
    note: 'Membranverlust bei erhaltenem Volumen: ν steigt, Eindellung geht verloren, Durchmesser sinkt.',
    physical: {
      membraneArea: 124, reducedVolume: 0.95, areaDifference: 0,
      ellipticity: 0.02, edgeIrregularity: 0.01, surfaceVariation: 0.06
    }
  },
  echinocyte: {
    id: 'rbc3d-echino-v02',
    morphologyId: 'RBC-ECHINO',
    label: 'Echinozyt',
    short: 'Echinozyt',
    seed: 30333,
    note: 'Positive Flächendifferenz der Doppelschicht: multiple kurze, relativ regelmäßige Fortsätze. Bewusst nicht Akanthozyt.',
    physical: {
      membraneArea: 135, reducedVolume: 0.62, areaDifference: 0.42,
      ellipticity: 0.02, edgeIrregularity: 0.015, surfaceVariation: 0.05
    }
  }
};

export const PRESETS = Object.fromEntries(
  Object.entries(PRESET_SPEC).map(([k, p]) => [k, Object.assign({}, p, { values: deriveValues(p.physical) })])
);

/** Physical record + overrides → derived values. Overrides may be physical or derived keys. */
export function resolveParams(preset, overrides) {
  const phys = Object.assign({}, PRESET_SPEC[preset].physical, overrides || {});
  return Object.assign(deriveValues(phys), pickDerivedOverrides(overrides));
}
function pickDerivedOverrides(o) {
  if (!o) return {};
  const out = {};
  for (const k of ['spiculeDistribution']) if (k in o) out[k] = o[k];
  return out;
}

/* ---------- spicule seeding: deterministic golden-angle spiral per face ---------- */
function spiculeCenters(count, distribution, params, seed) {
  if (!count || distribution === 'none') return [];
  const rand = rng(seed + 977);
  const out = [];
  const R = params.diameter / 2;
  const GA = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const face = i % 2 === 0 ? 1 : -1;
    const k = Math.floor(i / 2);
    const n = Math.ceil(count / 2);
    // sqrt spacing keeps areal density even; bias slightly outward (echinocyte crenation)
    let rho = Math.sqrt((k + 0.45) / n);
    rho = 0.16 + 0.82 * rho;
    let theta = i * GA + (face > 0 ? 0 : GA * 0.5);
    if (distribution === 'surface-jittered') {
      rho = Math.min(0.94, rho + (rand() - 0.5) * 0.12);
      theta += (rand() - 0.5) * 0.35;
    }
    const z = face * faceHalfHeight(rho, face, params) * params.thickness;
    out.push(new THREE.Vector3(
      Math.cos(theta) * rho * R * (1 + params.ellipticity),
      Math.sin(theta) * rho * R * (1 - params.ellipticity),
      z
    ));
  }
  return out;
}

/** Face-dependent profile: asymmetry (from negative Δa₀) cups one face inward. */
function faceHalfHeight(rho, face, params) {
  const asym = params.asymmetry || 0;
  const dep = clamp01(params.centralDepression + face * asym * 0.6);
  return halfHeight(rho, dep) * (1 - face * asym * 0.12);
}

/** Low-frequency deterministic rim modulation (3 seeded harmonics). */
function rimHarmonics(seed) {
  const rand = rng(seed + 131);
  return [
    { k: 5,  a: 0.55, p: rand() * Math.PI * 2 },
    { k: 8,  a: 0.30, p: rand() * Math.PI * 2 },
    { k: 13, a: 0.15, p: rand() * Math.PI * 2 }
  ];
}

/**
 * Build the RBC mesh geometry.
 * Topology: sphere-equivalent polar grid — two stacked surfaces sharing rim + pole vertices.
 * Same vertex count for every morphology at a given LOD, so states are morph-target compatible.
 */
export function buildRBCGeometry(params, seed, tess = TESSELLATION) {
  const rings = tess.rings, segs = tess.segments;
  const R = params.diameter / 2;
  const harm = rimHarmonics(seed);
  const svRand = rng(seed + 613);
  const svPhase = [svRand() * 6.283, svRand() * 6.283, svRand() * 6.283];

  const rowCount = 2 * rings + 1; // top pole -> rim -> bottom pole
  const positions = [];
  const index = [];
  const thick = []; // local optical path (µm) per vertex -> drives the projection stain

  for (let row = 0; row < rowCount; row++) {
    // row 0 = top pole (rho 0), row rings = rim (rho 1), row 2*rings = bottom pole
    const face = row <= rings ? 1 : -1;
    const t = row <= rings ? row / rings : (2 * rings - row) / rings;
    const rho = t;
    for (let s = 0; s < segs; s++) {
      const theta = (s / segs) * Math.PI * 2;
      let rimMod = 0;
      for (const h of harm) rimMod += h.a * Math.sin(h.k * theta + h.p);
      const rEff = R * rho * (1 + params.edgeIrregularity * rimMod * Math.pow(rho, 3));
      let x = Math.cos(theta) * rEff * (1 + params.ellipticity);
      let y = Math.sin(theta) * rEff * (1 - params.ellipticity);
      let z = face * faceHalfHeight(rho, face, params) * params.thickness;

      if (params.surfaceVariation > 0) {
        const v =
          0.6 * Math.sin(3 * theta + svPhase[0] + 4.1 * rho) +
          0.3 * Math.sin(6 * theta + svPhase[1] - 2.7 * rho) +
          0.1 * Math.sin(11 * theta + svPhase[2] + 1.3 * rho);
        const env = Math.sin(Math.PI * Math.min(1, rho * 1.02)); // fades at pole and rim
        const amp = params.surfaceVariation * 0.22 * env;
        z += face * amp * v;
        x *= 1 + amp * 0.12 * v;
        y *= 1 + amp * 0.12 * v;
      }
      positions.push(x, y, z);
      thick.push(2 * Math.abs(z));
    }
  }

  for (let row = 0; row < rowCount - 1; row++) {
    for (let s = 0; s < segs; s++) {
      const s2 = (s + 1) % segs;
      const a = row * segs + s, b = row * segs + s2;
      const c = (row + 1) * segs + s, d = (row + 1) * segs + s2;
      index.push(a, c, d, a, d, b);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(index);
  geo.computeVertexNormals();

  // spicules: displace along the smooth normal, gaussian falloff around seeded centers
  const centers = spiculeCenters(params.spiculeCount, params.spiculeDistribution, params, seed);
  if (centers.length && params.spiculeLength > 0) {
    const pos = geo.attributes.position, nrm = geo.attributes.normal;
    const width = 0.78 - 0.34 * params.spiculeIntensity; // µm — sharper = narrower base
    const p = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i);
      let disp = 0;
      for (const c of centers) {
        const d = p.distanceTo(c);
        if (d > width * 2.2) continue;
        const g = Math.exp(-4.4 * (d / width) * (d / width));
        disp += g;
      }
      if (disp > 0) {
        disp = Math.min(1.35, disp) * params.spiculeLength;
        thick[i] += disp;
        pos.setXYZ(i,
          pos.getX(i) + nrm.getX(i) * disp,
          pos.getY(i) + nrm.getY(i) * disp,
          pos.getZ(i) + nrm.getZ(i) * disp);
      }
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  /* Beer-Lambert-like stain proxy: thicker cell body = more hemoglobin = deeper stain.
     This is what produces central pallor in the projection mode. */
  const ref = 2 * DOME_PEAK * params.thickness;
  const pale = [0.969, 0.890, 0.851], deep = [0.706, 0.325, 0.286];
  const colors = new Float32Array(thick.length * 3);
  for (let i = 0; i < thick.length; i++) {
    const t = Math.pow(Math.min(1, Math.max(0, thick[i] / ref)), 1.4);
    for (let c = 0; c < 3; c++) colors[i * 3 + c] = pale[c] + (deep[c] - pale[c]) * t;
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  // symmetry axis Z -> Y, so the disc lies flat in a y-up scene / GLB
  geo.rotateX(-Math.PI / 2);
  geo.computeBoundingSphere();
  return geo;
}

/** Schema-compliant manifest entry (doccheck.simblood.cell-3d-asset/0.1).
 *  mod: null for an untouched preset, or { t, target } / { t: null } when the parameters were
 *  changed by hand or by the transition — a modified shape must never keep the preset identity. */
export function manifestEntry(presetKey, params, seed, lod = TESSELLATION, mod = null) {
  const p = PRESETS[presetKey];
  const modified = !!mod;
  const assetId = modified ? 'rbc3d-custom' : p.id;
  const phys = {
    membraneArea: params.membraneArea,
    reducedVolume: params.reducedVolume,
    areaDifference: params.areaDifference
  };
  const parameters = {
    seed,
    preset: modified ? null : presetKey,
    derivedFrom: modified ? p.id : undefined,
    transition: modified && mod.t != null ? { target: mod.target, t: +Number(mod.t).toFixed(3) } : undefined,
    physical: phys,
    parameterization: 'bilayer-couple (A, nu, da0) -> derived shape; phenomenological mapping, not an energy minimization',
    values: params
  };
  return {
    schema: 'doccheck.simblood.cell-3d-asset/0.1',
    status: modified ? 'DRAFT_RND_MODIFIED' : 'DRAFT_RND',
    id: assetId,
    family: 'rbc',
    morphologyId: modified ? 'RBC-CUSTOM' : p.morphologyId,
    authoring: {
      tool: 'parametric-js + blender-script',
      sourceBlend: 'authoring/blender/rbc_base_v01.py',
      baseMeshId: BASE_MESH_ID,
      authoringVersion: '0.2',
      lod: lod.id,
      tessellation: { rings: lod.rings, segments: lod.segments },
      triangles: triangleCount(lod),
      unitScale: '1 unit = 1 µm'
    },
    runtime: {
      glb: `runtime/glb/${assetId}-${lod.id}.glb`,
      glbSource: 'browser GLTFExporter (deterministic rebuild)',
      webReady: !modified
    },
    parameters,
    references: [
      { kind: 'literature', id: 'doi:10.1371/journal.pone.0215447', role: 'SDE parameterization (bilayer-couple, area difference)' },
      { kind: 'literature', id: 'PMC9132841', role: 'local area-difference / curvature terms for stomatocyte + echinocyte' }
    ],
    review: { morphology: 'RND_ONLY', educational: 'UNREVIEWED', runtime: 'UNREVIEWED' },
    provenance: {
      selfAuthored: true,
      externalAssetDependencies: ['three.js 0.184.0 (runtime only, no geometry donor)'],
      notes: (modified ? 'Parameter wurden gegenüber dem Preset verändert — kein Preset-Asset, keine Preset-Identität. ' : '') +
        'Shape corridors informed by textbook morphology and the published SDE parameterization; no third-party mesh, scan or image was used as geometry donor.'
    }
  };
}
