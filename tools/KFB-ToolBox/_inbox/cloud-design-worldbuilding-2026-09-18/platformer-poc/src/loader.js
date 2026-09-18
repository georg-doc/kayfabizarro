/* Ein Loader, ein Cache, eine Textur-Faltung. Kein zweiter three-Build, kein zweiter Loader.

   Textur-Faltung: jede .gltf verweist RELATIV auf ihre Textur, also löst jeder Unterordner
   des Packs eine eigene URL für dieselbe Datei auf. Ohne Faltung lädt der Platformer-Atlas
   ein Dutzend Mal. Schlüssel ist Pack-Ordner + Dateiname (gleiche Faltung wie
   hexrealm/lib/atlas.js). */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as skinClone } from 'three/addons/utils/SkeletonUtils.js';
import { raw, loadLog } from './sources.js';

THREE.Cache.enabled = true;

export const textureFolds = { seen: 0, unique: 0 };
const aliases = new Map();
const manager = new THREE.LoadingManager();
manager.setURLModifier((url) => {
  const m = /\/media\/3D_Assets\/([^/]+)\/(?:.*\/)?([^/?#]+\.(?:png|jpe?g|webp|ktx2))(?:[?#].*)?$/i.exec(url);
  if (!m) return url;
  const key = m[1] + '|' + m[2];
  textureFolds.seen++;
  if (!aliases.has(key)) { aliases.set(key, url); textureFolds.unique++; }
  return aliases.get(key);
});

export const gltfLoader = new GLTFLoader(manager);
const cache = new Map();
export const measured = new Map();

export async function loadGltf(path, commit) {
  const key = commit + '|' + path;
  if (!cache.has(key)) {
    const t0 = performance.now();
    cache.set(key, gltfLoader.loadAsync(raw(commit, path)).then((g) => {
      const box = new THREE.Box3().setFromObject(g.scene);
      const size = box.getSize(new THREE.Vector3());
      let skinned = false;
      g.scene.traverse((o) => {
        if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
        if (o.isSkinnedMesh) skinned = true;
      });
      measured.set(path, { path, commit, size: size.toArray(), min: box.min.toArray(), max: box.max.toArray(),
        skinned, clips: g.animations.map((c) => c.name) });
      loadLog.set(path, { ok: true, ms: Math.round(performance.now() - t0), commit });
      return g;
    }).catch((e) => {
      loadLog.set(path, { ok: false, ms: Math.round(performance.now() - t0), commit, error: e.message });
      throw e;
    }));
  }
  return cache.get(key);
}

export async function instance(path, commit) {
  const g = await loadGltf(path, commit);
  const node = skinClone(g.scene);
  node.userData.sourcePath = path;
  return node;
}

export function measureNode(node) {
  const b = new THREE.Box3().setFromObject(node);
  return { box: b, size: b.getSize(new THREE.Vector3()), min: b.min.clone(), max: b.max.clone() };
}

/* Determinismus statt Math.random: dieselbe Insel bei jedem Laden, sonst ist ein
   Screenshot als Beleg wertlos. */
export function rng(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

export function disposeTree(root) {
  root.traverse((o) => {
    if (o.isMesh || o.isSkinnedMesh) {
      o.geometry?.dispose?.();
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      /* Texturen NICHT entsorgen: sie kommen aus dem geteilten Cache und werden von
         anderen Instanzen weiterbenutzt. Nur Materialien, die diese Instanz geklont hat. */
      for (const m of mats) if (m && m.userData?.cloned) m.dispose();
    }
  });
  root.parent?.remove(root);
}
