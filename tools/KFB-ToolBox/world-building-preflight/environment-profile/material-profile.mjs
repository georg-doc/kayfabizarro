export const MATERIAL_PROFILE_SOURCE = 'SOURCE_MATERIAL';
export const MATERIAL_PROFILE_MATTE = 'WHACKMAN_MATTE_CANDIDATE';

const originals = new WeakMap();

function materialsOf(root) {
  const out = [];
  root?.traverse?.((object) => {
    if (!object?.isMesh || !object.material) return;
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      if (material && !out.includes(material)) out.push(material);
    }
  });
  return out;
}

function capture(material) {
  if (originals.has(material)) return originals.get(material);
  const state = {
    roughness: material.roughness,
    metalness: material.metalness,
    envMapIntensity: material.envMapIntensity,
    clearcoat: material.clearcoat,
    roughnessMap: material.roughnessMap,
    metalnessMap: material.metalnessMap
  };
  originals.set(material, state);
  return state;
}

function restore(material) {
  const state = originals.get(material);
  if (!state) return;
  for (const [key, value] of Object.entries(state)) {
    if (key in material || value !== undefined) material[key] = value;
  }
  if ('needsUpdate' in material) material.needsUpdate = true;
}

export function applyMaterialProfile(root, profileRef = MATERIAL_PROFILE_SOURCE) {
  const materials = materialsOf(root);
  for (const material of materials) {
    capture(material);
    restore(material);
    if (profileRef === MATERIAL_PROFILE_MATTE && (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial || 'roughness' in material)) {
      material.roughness = Math.max(material.roughness ?? 1, 0.94);
      material.metalness = 0;
      material.envMapIntensity = 0.15;
      if ('clearcoat' in material) material.clearcoat = 0;
      if ('roughnessMap' in material) material.roughnessMap = null;
      if ('metalnessMap' in material) material.metalnessMap = null;
      if ('needsUpdate' in material) material.needsUpdate = true;
    }
  }
  return { profileRef, materialCount: materials.length };
}
