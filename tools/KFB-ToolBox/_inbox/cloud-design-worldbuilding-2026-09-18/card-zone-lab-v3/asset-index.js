// ============================================================================
// asset-index.js — KFB 3D Asset Repo · Slice 0 Runtime-API
// ----------------------------------------------------------------------------
// Ein Laufzeit-Index ueber drei Ebenen:
//   1. Kenney-GLBs    (asset-repo.json)   — Streuung / Requisiten / Detail
//   2. KFB-Texturen   (kfb-textures.json) — das Material
//   3. Voxel-Konstrukte (constructs.json) — native Architektur
// Jede id loest zu einer kanonischen RAW-URL auf. Keine relativen Asset-Pfade.
// Vertrag: docs/SPRINT_3D-AssetRepo.md §6. WebGL / three 0.160, ein Build.
// ============================================================================

export const RAW_BASE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';

const DEFAULT_MANIFESTS = {
  assets: './asset-repo.json',
  textures: './kfb-textures.json',
  constructs: './constructs.json',
};

let _db = null;

/** Laedt die drei Manifeste einmalig. Idempotent. */
export async function loadIndex(manifests = {}) {
  if (_db) return _db;
  const m = { ...DEFAULT_MANIFESTS, ...manifests };
  const [assets, textures, constructs] = await Promise.all([
    fetch(m.assets).then((r) => r.json()),
    fetch(m.textures).then((r) => r.json()),
    fetch(m.constructs).then((r) => r.json()),
  ]);
  const byId = new Map(assets.assets.map((a) => [a.id, a]));
  const byName = new Map();
  for (const a of assets.assets) if (!byName.has(a.name)) byName.set(a.name, a);
  _db = { assets, textures, constructs, byId, byName };
  return _db;
}

export function isReady() { return !!_db; }
function db() { if (!_db) throw new Error('asset-index: loadIndex() zuerst awaiten'); return _db; }

// ---------------------------------------------------------------- Ebene 1: Kenney
/** getAsset('GLB_graveyard/coffin') oder getAsset('coffin') → Record inkl. ghUrl */
export function getAsset(id) {
  const d = db();
  return d.byId.get(id) || d.byName.get(String(id).split('/').pop()) || null;
}
export function getUrl(id) { const a = getAsset(id); return a ? a.ghUrl : null; }

/**
 * getSet({biome, storyMode, role, pack, sub, animated, maxFootprint, limit, seed})
 * → gefilterte, deterministisch gemischte Asset-Liste (Rezept-Basis fuer asset-scatter).
 */
export function getSet(q = {}) {
  const d = db();
  const { biome, storyMode, role, pack, sub, animated, maxFootprint, limit, seed } = q;
  let out = d.assets.assets.filter((a) => {
    const p = d.assets.packs[a.pack];
    if (pack && a.pack !== pack) return false;
    if (role && a.role !== role) return false;
    if (sub && a.sub !== sub) return false;
    if (animated != null && !!a.anim !== !!animated) return false;
    if (maxFootprint && Math.max(a.fp[0], a.fp[1]) > maxFootprint) return false;
    if (biome && p && !(p.biomes.includes('*') || p.biomes.includes(biome))) return false;
    if (storyMode && p && !(p.storyModes.includes('*') || p.storyModes.includes(storyMode))) return false;
    return true;
  });
  if (seed != null) out = shuffle(out, seed);
  return limit ? out.slice(0, limit) : out;
}

export function packInfo(pack) { return db().assets.packs[pack] || null; }
export function pendingPacks() { return db().assets.pending; }

// ---------------------------------------------------------------- Ebene 2: Texturen
/**
 * getTexture('edge1') · getTexture('brick') · getTexture('water')
 * → { id, urls:{<mapRole>:url}, files:[…] }  — mapRole = three.js-Slot (map/bumpMap/…)
 */
export function getTexture(name) {
  const t = db().textures;
  const base = t.rawBase;
  const set = t.sets[name];
  if (set) {
    const list = set.variants || set.maps;
    const urls = {};
    for (const e of list) urls[e.id] = base + e.file;
    return { id: name, set: name, role: set.role, urls, maps: list.map((e) => ({ ...e, url: base + e.file })) };
  }
  for (const [sn, s] of Object.entries(t.sets)) {
    const list = s.variants || s.maps;
    const hit = list.find((e) => e.id === name || e.file === name);
    if (hit) return { id: hit.id, set: sn, role: s.role, url: base + hit.file, map: hit.map, colorSpace: hit.colorSpace };
  }
  return null;
}
/** Eine deterministische edge-Variante pro Instanz/Flaeche (Slice 1: Variation). */
export function edgeVariant(seed) {
  const v = getTexture('edge').maps;
  return v[Math.abs(hash32(seed)) % v.length];
}

// ---------------------------------------------------------------- Ebene 3: Konstrukte
export function getBlueprint(id) {
  return db().constructs.blueprints.find((b) => b.id === id) || null;
}
/**
 * buildConstruct(blueprintId, {anchor:[x,y,z], rotation, palette, seed})
 * → { cells:[{box, position, colorRole, color, texture, variationSeed}], footprintXZ, navigation }
 * Reine Daten — der Terrain-Backer instanziert daraus (gleicher Shader/Palette/Fog).
 */
export function buildConstruct(blueprintId, opts = {}) {
  const bp = getBlueprint(blueprintId);
  if (!bp) return null;
  const { anchor = [0, 0, 0], rotation = 0, palette = null, seed = 0 } = opts;
  const cos = Math.cos(rotation), sin = Math.sin(rotation);
  const cells = bp.grid.map((c, i) => {
    const x = c.x * cos - c.z * sin, z = c.x * sin + c.z * cos;
    return {
      box: c.box || [1, 1, 1],
      position: [anchor[0] + x, anchor[1] + c.y, anchor[2] + z],
      colorRole: c.colorRole,
      color: palette ? palette[c.colorRole] ?? null : null,
      texture: c.texture || 'edge',
      variationSeed: hash32(blueprintId + ':' + i + ':' + seed),
    };
  });
  return { id: bp.id, cells, footprintXZ: bp.footprintXZ, navigation: bp.navigation, rotation, anchor };
}

// ---------------------------------------------------------------- deterministisch
export function hash32(v) {
  let h = 0x811c9dc5 >>> 0; const s = String(v);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
function shuffle(arr, seed) {
  const a = arr.slice(); let h = hash32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default { loadIndex, isReady, getAsset, getUrl, getSet, packInfo, pendingPacks, getTexture, edgeVariant, getBlueprint, buildConstruct, hash32, RAW_BASE };
