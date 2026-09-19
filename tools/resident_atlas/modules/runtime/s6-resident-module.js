/* Thin consumer adapter for Resident Atlas S6 vignettes.
   It mounts presentation only. World support/collision/camera/movement remain consumer-owned. */

import { buildVignette } from '../../../resident_atlas_s6/lib/atlas.js';
import { RESIDENTS } from '../../../resident_atlas_s6/data/cast.js';

const rad = (d) => d * Math.PI / 180;

export async function mountResidentSceneModule(def, { parent, anchor = {}, onProgress } = {}) {
  if (!def || def.schema !== 'kfb.resident-scene-module/1') throw new Error('resident module schema mismatch');
  if (!parent || typeof parent.add !== 'function') throw new Error('parent Object3D is required');

  const residentId = def.source?.residentId;
  const recipe = RESIDENTS.find((r) => r.residentId === residentId);
  if (!recipe) throw new Error('resident recipe not found: ' + residentId);

  const built = await buildVignette(recipe, onProgress);
  const root = built.root;
  root.name = 'resident-module:' + def.id;

  const p = anchor.position || def.scene?.position || [0, 0, 0];
  root.position.set(p[0] || 0, p[1] || 0, p[2] || 0);
  root.rotation.y = rad(anchor.rotationYDeg ?? def.scene?.rotationYDeg ?? 0);
  root.scale.setScalar(anchor.scale ?? def.scene?.scale ?? 1);
  parent.add(root);

  const mixers = [];
  if (built.mixer && !built.mixer.action.paused) mixers.push(built.mixer.mixer);
  for (const m of built.extraMixers || []) if (m && m.action && !m.action.paused) mixers.push(m.mixer);

  let disposed = false;
  return {
    id: def.id,
    residentId,
    root,
    built,
    support: def.support,
    activity: built.activity || null,
    update(dt) {
      if (disposed) return;
      const step = Math.max(0, Number(dt) || 0);
      for (const m of mixers) m.update(step);
      if (built.activity && built.activity.enabled !== false) built.activity.update(step);
    },
    setActivityEnabled(on) {
      if (built.activity) built.activity.enabled = !!on;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const m of mixers) {
        try { m.stopAllAction(); m.uncacheRoot?.(root); } catch {}
      }
      if (root.parent) root.parent.remove(root);
    }
  };
}

export async function loadResidentSceneModule(url) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`resident module HTTP ${r.status}: ${url}`);
  return r.json();
}
