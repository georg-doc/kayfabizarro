/* KFB WB-DESIGN-PARALLEL-01 · Wasser-Presets (App-Einstellung, nicht Chat-Tweak)
   Zwei Wasserklassen, je eine eigene Einstellung: river (Rhein) · still (Becken/Seen). Meer: im
   Crop nicht vorhanden — Slot vorbereitet, gleiche Presets.

   Presets
   · cz2-source  Card Zone Lab v2 Fluid WÖRTLICH (card-zone-v2-fluid-source.js · blob 43eea82f).
                 Vergleichsanker: exakt der Lab-Shader, Maßstab des Wassergrabens (~11 m Wellen).
   · cz2-scaled  derselbe Fragment-Shader WÖRTLICH; DELTA nur im Vertex-Shader, benannt:
                 vW.xz × uScale (Weltmaßstab) und aFlow × uFlowGain (Strömungsstärke).
   · oc-rhine    Option C `buildRhine` (lab-v9/cologne-world.v1.js) — Material übernommen, auf
                 dieselbe Geometrie gelegt. Nur für den Rhein.
   Schaum ist in der Quelle konstruktiv aus (u = 0.5) und bleibt aus (Post Mortem 2026-09-21). */
import * as THREE from 'three';

export const PRESETS = [
  ['cz2-scaled', 'CZ2 · scaled'],
  ['cz2-source', 'CZ2 · source'],
  ['oc-rhine', 'OC · buildRhine']
];
export const DEFAULTS = {
  river: { preset: 'cz2-scaled', fluid: 'wasser', scale: 0.15, flow: 1, textures: true },
  still: { preset: 'cz2-scaled', fluid: 'wasser', scale: 0.4, flow: 0, textures: true },
  sea: { preset: 'cz2-scaled', fluid: 'wasser', scale: 0.08, flow: 0, textures: true }
};
const KEY = 'kfb-wd1-water-v1';
export function loadSettings() {
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) return { river: { ...DEFAULTS.river, ...s.river }, still: { ...DEFAULTS.still, ...s.still }, sea: { ...DEFAULTS.sea, ...s.sea } }; } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULTS));
}
export function saveSettings(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

function scaledMaterial(FL, fluid) {
  const api = FL.createCardZoneV2FluidMaterial(THREE, { fluid });
  const V = FL.CARD_ZONE_V2_FLUID_VERTEX_SHADER;
  if (!V.includes('vW = wp.xyz;') || !V.includes('vFlow = aFlow;')) throw new Error('cz2 vertex shader changed upstream — scaled delta refused');
  api.material.vertexShader = 'uniform float uScale, uFlowGain;\n' + V.replace('vW = wp.xyz;', 'vW = vec3(wp.x * uScale, wp.y, wp.z * uScale);').replace('vFlow = aFlow;', 'vFlow = aFlow * uFlowGain;');
  api.uniforms.uScale = api.material.uniforms.uScale = { value: 1 };
  api.uniforms.uFlowGain = api.material.uniforms.uFlowGain = { value: 1 };
  api.material.needsUpdate = true;
  return api;
}

export function makeWater({ FL, WORLD, waters, log = () => {} }) {
  let tex = { dudv: null, water: null }, texState = 'loading …';
  const texReady = FL.loadCardZoneV2FluidTextures(THREE).then((t) => { tex = t; texState = (t.dudv ? 'dudv' : '—') + '+' + (t.water ? 'map' : '—') + (t.dudv && t.water ? ' geladen' : ' FEHLEN'); return texState; });
  const cur = new Map();       // mesh → { preset, api | oc }
  function build(w, s) {
    const old = cur.get(w.mesh);
    if (old && old.preset === s.preset && old.fluid === s.fluid && old.api) { tune(old, s); return; }
    let rec;
    if (s.preset === 'oc-rhine' && w.river && WORLD) {
      const rh = WORLD.buildRhine(THREE, { water: { surfaces: [{ id: w.id, polygon: w.src }] } });
      rh.mat.polygonOffset = true; rh.mat.polygonOffsetFactor = -2; rh.mat.polygonOffsetUnits = -4;
      rec = { preset: s.preset, fluid: s.fluid, oc: rh.mat, material: rh.mat };
      rh.mesh.geometry.dispose();
    } else {
      const p = s.preset === 'oc-rhine' ? 'cz2-scaled' : s.preset;       // OC gibt es nur für den Rhein
      const api = p === 'cz2-source' ? FL.createCardZoneV2FluidMaterial(THREE, { fluid: s.fluid }) : scaledMaterial(FL, s.fluid);
      rec = { preset: p, fluid: s.fluid, api, material: api.material };
    }
    if (old) old.material.dispose();
    w.mesh.material = rec.material; cur.set(w.mesh, rec); tune(rec, s);
  }
  function tune(rec, s) {
    if (!rec.api) return;
    rec.api.setFluid(s.fluid);
    rec.api.setTextures(s.textures ? tex : {});
    if (rec.api.uniforms.uScale) { rec.api.uniforms.uScale.value = s.scale; rec.api.uniforms.uFlowGain.value = s.flow; }
  }
  const W = {
    settings: loadSettings(),
    get textures() { return texState; },
    classOf: (w) => (w.river ? 'river' : w.sea ? 'sea' : 'still'),
    apply() { for (const w of waters) build(w, W.settings[W.classOf(w)]); saveSettings(W.settings); },
    set(cls, patch) { Object.assign(W.settings[cls], patch); W.apply(); },
    reset() { W.settings = JSON.parse(JSON.stringify(DEFAULTS)); W.apply(); },
    update(t) { for (const r of cur.values()) { if (r.api) r.api.update(t); else if (r.oc) r.oc.uniforms.uTime.value = t; } },
    present: () => ({ river: waters.some((w) => w.river), still: waters.some((w) => !w.river && !w.sea), sea: waters.some((w) => w.sea) }),
    report: () => ({ textures: texState, settings: W.settings, meshes: waters.map((w) => ({ id: w.id, cls: W.classOf(w), preset: cur.get(w.mesh)?.preset })) })
  };
  texReady.then(() => { W.apply(); log('water · textures ' + texState, / FEHLEN/.test(texState)); });
  W.apply();
  return W;
}
