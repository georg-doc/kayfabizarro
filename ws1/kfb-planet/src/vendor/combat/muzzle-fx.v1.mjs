import { auditMuzzleEffects } from './muzzle-sources.v1.mjs';

/**
 * Host supplies verified private GLTF roots and its existing KFB_Muzzle node.
 * No loader, renderer, mixer, world transform, projectile, sound or release owner.
 * Call fire at the existing once-per-action release AFTER mixer/world evaluation.
 */
export function create({ anchor, assets, muzzle }) {
  // Snapshot data so a shared profile cannot change the admitted references later.
  muzzle = structuredClone(muzzle);
  const issues = auditMuzzleEffects(muzzle);
  if (issues.length) throw new TypeError(issues.join(','));
  if (!anchor?.isObject3D || anchor.name !== 'KFB_Muzzle') throw new TypeError('KFB_MUZZLE_NODE_REQUIRED');
  // V-579: both originals and the source anchor point along glTF +Z.
  // Keep rejecting historical r3b +Y; r3c fixes its source, never the adapter.
  if (!Array.isArray(muzzle.forwardLocal) || muzzle.forwardLocal.length !== 3 ||
      !muzzle.forwardLocal.every((n, i) => Number.isFinite(n) && Math.abs(n - [0, 0, 1][i]) <= 1e-6)) {
    throw new TypeError('MUZZLE_FX_ATTACHMENT_BASIS_REQUIRED');
  }
  for (const slot of ['primary', 'secondary']) {
    if (!assets?.[muzzle[slot].ref]?.isObject3D) throw new TypeError(`PRIVATE_${slot.toUpperCase()}_ASSET_REQUIRED`);
  }
  const nodes = {}, ownedMaterials = new Map();
  for (const slot of ['primary', 'secondary']) {
    const node = assets[muzzle[slot].ref].clone(true);
    node.traverse(o => {
      if (!o.material) return;
      const cloneMaterial = original => {
        if (!ownedMaterials.has(original)) ownedMaterials.set(original, {
          material: original.clone(), color: original.color?.clone()
        });
        return ownedMaterials.get(original).material;
      };
      o.material = Array.isArray(o.material) ? o.material.map(cloneMaterial) : cloneMaterial(o.material);
    });
    node.visible = false;
    anchor.add(node); // Preserve every authored local transform; never fit/rotate the flash.
    nodes[slot] = node;
  }
  let remaining = 0, disposed = false;
  const hide = () => { for (const node of Object.values(nodes)) node.visible = false; };
  return {
    object3d: anchor,
    fire({ slot = 'primary', variant = null } = {}) {
      if (disposed) throw new Error('MUZZLE_FX_DISPOSED');
      const v = variant === null ? null : muzzle.variants.find(v => v.id === variant);
      if (variant !== null && !v) throw new TypeError('UNKNOWN_MUZZLE_VARIANT');
      if (v) slot = v.source;
      if (!Object.hasOwn(nodes, slot)) throw new TypeError('UNKNOWN_MUZZLE_SOURCE');
      for (const { material, color } of ownedMaterials.values()) {
        if (color) material.color.copy(color);
        if (v?.color && material.color) material.color.set(v.color);
      }
      hide();
      nodes[slot].visible = true;
      remaining = v?.vfx?.durationSeconds ?? 0.06;
      // A new release restarts the flash immediately. No queue or input cooldown.
    },
    update(dt) {
      if (disposed) return;
      if (!Number.isFinite(dt) || dt < 0) throw new TypeError('FINITE_NONNEGATIVE_DT_REQUIRED');
      remaining = Math.max(0, remaining - dt);
      if (remaining === 0) hide();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const node of Object.values(nodes)) anchor.remove(node);
      for (const { material } of ownedMaterials.values()) material.dispose();
      // Shared source geometry/textures remain owned by the host's private asset cache.
    }
  };
}

/** Read the current evaluated source frame into host-owned vectors; no aim fallback. */
export function readMuzzlePose(anchor, position, direction) {
  if (!anchor?.isObject3D || anchor.name !== 'KFB_Muzzle') throw new TypeError('KFB_MUZZLE_NODE_REQUIRED');
  anchor.updateWorldMatrix(true, false);
  position.setFromMatrixPosition(anchor.matrixWorld);
  direction.set(0, 0, 1).transformDirection(anchor.matrixWorld);
  return { position, direction };
}
