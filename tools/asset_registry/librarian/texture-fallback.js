export function textureFallbackUrls(record, materialName) {
  const src = record?.source?.rawPinned || record?.source?.rawLatest;
  if (!src || !materialName) return [];
  const file = encodeURIComponent(String(materialName) + '.png');
  const rels = [
    `../textures/${file}`,
    `../../textures/${file}`,
    `./textures/${file}`,
    `../texture/${file}`,
    `../../texture/${file}`,
  ];
  const out = [];
  for (const rel of rels) {
    try {
      const url = new URL(rel, src).href;
      if (!out.includes(url)) out.push(url);
    } catch {
      // Invalid source URL: leave this candidate out and fail closed.
    }
  }
  return out;
}

export async function repairMissingTextureMaps(THREE, record, node) {
  const need = new Map();
  node?.traverse((obj) => {
    if (!(obj.isMesh || obj.isSkinnedMesh)) return;
    for (const mat of (Array.isArray(obj.material) ? obj.material : [obj.material]).filter(Boolean)) {
      if (mat.map || !mat.name || !/texture|_A$|_B$/i.test(mat.name)) continue;
      if (!need.has(mat.name)) need.set(mat.name, []);
      need.get(mat.name).push(mat);
    }
  });
  if (!need.size) return 0;

  const loader = new THREE.TextureLoader();
  let repaired = 0;
  for (const [name, mats] of need) {
    let tex = null;
    for (const url of textureFallbackUrls(record, name)) {
      try {
        tex = await loader.loadAsync(url);
        break;
      } catch {
        // Try the next nearby pack texture location.
      }
    }
    if (!tex) continue;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = false;
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    for (const mat of mats) {
      mat.map = tex;
      mat.needsUpdate = true;
    }
    repaired += 1;
  }
  return repaired;
}
