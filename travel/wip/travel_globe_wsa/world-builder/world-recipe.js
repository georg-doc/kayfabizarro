export const WORLD_RECIPE_SCHEMA = 'kfb.world-recipe.v0';
export const WORLD_RECIPE_KEY = 'kfb.world-recipe.wb0.v0';

export function blankRecipe() {
  return {
    schema: WORLD_RECIPE_SCHEMA,
    status: 'WB0_IMPLEMENTATION_WIP',
    base: {
      runtime: 'KFB-Travel-Globe/B0',
      authoringMode: 'PLAY',
      locomotionMode: 'GROUND',
      timeOfDay: 'day',
    },
    zones: [],
    instances: [],
    splines: [],
    voxelChunks: [],
    portals: [],
    calibrationFamilies: {},
    meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  };
}

function normalizeRecipe(value) {
  const r = value && typeof value === 'object' ? value : blankRecipe();
  r.schema = WORLD_RECIPE_SCHEMA;
  r.base ||= blankRecipe().base;
  r.instances = Array.isArray(r.instances) ? r.instances : [];
  r.splines = Array.isArray(r.splines) ? r.splines : [];
  r.voxelChunks = Array.isArray(r.voxelChunks) ? r.voxelChunks : [];
  r.zones = Array.isArray(r.zones) ? r.zones : [];
  r.portals = Array.isArray(r.portals) ? r.portals : [];
  r.calibrationFamilies ||= {};
  r.meta ||= {};
  return r;
}

export function loadRecipe() {
  try {
    const raw = localStorage.getItem(WORLD_RECIPE_KEY);
    if (!raw) return blankRecipe();
    return normalizeRecipe(JSON.parse(raw));
  } catch (error) {
    console.warn('[wb0 recipe] load failed; using blank recipe', error);
    return blankRecipe();
  }
}

export function saveRecipe(recipe) {
  const r = normalizeRecipe(structuredClone(recipe));
  r.meta.updatedAt = new Date().toISOString();
  localStorage.setItem(WORLD_RECIPE_KEY, JSON.stringify(r));
  return r;
}

export function clearRecipe() {
  localStorage.removeItem(WORLD_RECIPE_KEY);
}

export function exportRecipe(recipe, filename = 'kfb-world-recipe-wb0.json') {
  const text = JSON.stringify(normalizeRecipe(structuredClone(recipe)), null, 2);
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function importRecipeFile(file) {
  const text = await file.text();
  const parsed = normalizeRecipe(JSON.parse(text));
  saveRecipe(parsed);
  return parsed;
}

export function makeId(prefix = 'item') {
  if (globalThis.crypto && crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function surfaceAnchorFromWorld(THREE, worldPosition, radiusAt) {
  const dir = worldPosition.clone().normalize();
  const r = radiusAt(dir);
  const radialOffset = worldPosition.length() - r;
  return {
    direction: [dir.x, dir.y, dir.z],
    radialOffset: Number.isFinite(radialOffset) ? radialOffset : 0,
  };
}

export function worldFromSurfaceAnchor(THREE, anchor, radiusAt, out = new THREE.Vector3()) {
  const d = anchor && anchor.direction ? anchor.direction : [0, 1, 0];
  out.set(d[0] || 0, d[1] || 0, d[2] || 0).normalize();
  const r = radiusAt(out);
  return out.multiplyScalar(r + Number(anchor && anchor.radialOffset || 0));
}
