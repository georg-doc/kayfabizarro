/* KFB · apply-island-palette.v1 (WS0 ISLAND_PALETTES_R1, 18.10.2026)
 *
 * Applies one island palette (kfb.island-palettes/1) at RUNTIME, by material name, to a loaded glTF scene.
 * The GLBs are never changed. Materials are named kfb_role_<role>_<tone> (B27, tone 0 light / 1 mid / 2 dark).
 *
 *   import { applyIslandPalette, patchGLTFLoader } from './apply-island-palette.v1.js';
 *   const report = applyIslandPalette(gltf.scene, palettes.islands['06_Iceland']);       // sets material.color (sRGB hex)
 *   patchGLTFLoader(GLTFLoader, () => entry);    // every loadAsync()/load() result gets the palette BEFORE anything else
 *                                                // touches it (e.g. the proof stage's clay pass copies material.color)
 *
 * Rules:
 *   - only materials whose name matches /^kfb_role_([a-z]+)_([0-2])$/ are touched; everything else stays as authored;
 *   - a role missing in the palette leaves the material as authored and is reported in `missing`;
 *   - colours are sRGB hex; THREE.Color.set() converts them into the linear working space (ColorManagement on, three r152+);
 *   - idempotent: each material is recoloured once per call (shared materials are not counted twice).
 */
export const VERSION = 'apply-island-palette.v1';
export const ROLE_RE = /^kfb_role_([a-z]+)_([0-2])$/;

/** applyIslandPalette(root, entry) -> { version, island, touched, materials: {name: hex}, missing: [names], untouched: [names] } */
export function applyIslandPalette(root, entry) {
  if (!root || !entry || !entry.roles) throw new Error(VERSION + ': need a scene and an island entry with roles');
  const seen = new Set(), materials = {}, missing = new Set(), untouched = new Set();
  root.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of [].concat(o.material)) {
      if (!m || seen.has(m)) continue; seen.add(m);
      const k = ROLE_RE.exec(m.name || '');
      if (!k) { untouched.add(m.name || '(unnamed)'); continue; }
      const tones = entry.roles[k[1]], hex = tones && tones[Number(k[2])];
      if (!hex) { missing.add(m.name); continue; }
      m.color.set(hex);
      m.userData.kfbIslandPalette = { version: VERSION, island: entry.id || null, role: k[1], tone: Number(k[2]), hex };
      materials[m.name] = hex;
    }
  });
  return { version: VERSION, island: entry.id || null, touched: Object.keys(materials).length, materials, missing: [...missing], untouched: [...untouched] };
}

/** patchGLTFLoader(GLTFLoader, getEntry) – wraps GLTFLoader.prototype.parse so every loaded scene is recoloured first.
 *  getEntry() returns the current island entry (or null = leave as authored). Returns an unpatch() function. */
export function patchGLTFLoader(GLTFLoader, getEntry, onReport = null) {
  const proto = GLTFLoader.prototype;
  if (proto.__kfbIslandPalette) proto.__kfbIslandPalette.unpatch();
  const orig = proto.parse;
  proto.parse = function (data, path, onLoad, onError) {
    return orig.call(this, data, path, (gltf) => {
      const e = getEntry();
      if (e) { const r = applyIslandPalette(gltf.scene, e); if (onReport) onReport(r); }
      onLoad(gltf);
    }, onError);
  };
  const unpatch = () => { proto.parse = orig; delete proto.__kfbIslandPalette; };
  proto.__kfbIslandPalette = { unpatch };
  return unpatch;
}
