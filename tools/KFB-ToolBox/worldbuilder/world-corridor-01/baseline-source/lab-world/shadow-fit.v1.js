/* KFB shadow-fit v1 (01.10.) — LESSONS_SHADOWS.md (work/clay-style-ssot-2026-10-01), Actor/Prop-Rezept, unverändert umgesetzt:
 * Frustum auf die relevanten Caster gepasst, Mitte im Lichtraum auf das Texelraster gerastet, normalBias = Texel × k, bias klein.
 * Kein Renderer-Owner: die Bühne ruft das auf. Zahlen aus dem Rezept sind Beispiel, die Invariante ist Passung + Texelbezug. */
import * as THREE from 'three';

export function fitShadow(renderer, sun, lightDir, box, { pad = 1.12, min = 0.6, k = 1.5, bias = -0.00015, size = 4096 } = {}) {
  const smax = Math.min(size, renderer.capabilities.maxTextureSize);
  if (sun.shadow.mapSize.x !== smax) { sun.shadow.mapSize.set(smax, smax); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } }
  const sph = box.getBoundingSphere(new THREE.Sphere());
  const r = Math.ceil(Math.max(min, sph.radius * pad) * 8) / 8, texel = 2 * r / smax;
  const fwd = lightDir.clone().normalize().negate(), upRef = Math.abs(fwd.y) > 0.99 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(upRef, fwd).normalize(), up = new THREE.Vector3().crossVectors(fwd, right).normalize(), c = sph.center;
  const center = right.clone().multiplyScalar(Math.round(c.dot(right) / texel) * texel)
    .add(up.clone().multiplyScalar(Math.round(c.dot(up) / texel) * texel)).add(fwd.clone().multiplyScalar(c.dot(fwd)));
  sun.position.copy(center).addScaledVector(lightDir.clone().normalize(), r + 30); sun.target.position.copy(center); sun.target.updateMatrixWorld();
  Object.assign(sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 0.1, far: 2 * r + 60 }); sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = bias; sun.shadow.normalBias = texel * k; sun.shadow.needsUpdate = true;
  return { r, texel, normalBias: sun.shadow.normalBias, smax };
}

/* Welt-Maßstab (WB-D2 shadowFollow): Feld folgt dem Blickziel, Halbgröße mit dem Kameraabstand, Mitte texelgerastet,
 * normalBias = 1,2 × Texel, bias −0,00003. Nur neu setzen, wenn sich Mitte oder Größe wirklich ändern (kein Schwimmen). */
export function makeShadowFollow(renderer, sun, lightDir, { min = 90, max = 760, k = 1.2, bias = -0.00003, depth = 900 } = {}) {
  let last = null;
  return (target, camDist) => { const smax = Math.min(4096, renderer.capabilities.maxTextureSize);
    const r = Math.ceil(Math.min(max, Math.max(min, camDist * 0.75)) / 10) * 10, texel = 2 * r / smax;
    const fwd = lightDir.clone().normalize().negate(), upRef = Math.abs(fwd.y) > 0.99 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(upRef, fwd).normalize(), up = new THREE.Vector3().crossVectors(fwd, right).normalize();
    const center = right.clone().multiplyScalar(Math.round(target.dot(right) / texel) * texel).add(up.clone().multiplyScalar(Math.round(target.dot(up) / texel) * texel)).add(fwd.clone().multiplyScalar(target.dot(fwd)));
    if (last && last.r === r && last.c.distanceToSquared(center) < 1e-6) return last;
    sun.position.copy(center).addScaledVector(lightDir.clone().normalize(), depth); sun.target.position.copy(center); sun.target.updateMatrixWorld();
    Object.assign(sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 1, far: depth * 2 }); sun.shadow.camera.updateProjectionMatrix();
    sun.shadow.bias = bias; sun.shadow.normalBias = texel * k; sun.shadow.needsUpdate = true;
    last = { r, texel, c: center, normalBias: sun.shadow.normalBias }; return last; };
}

/* Casting-Regel aus dem Rezept: DoubleSide nicht pauschal ausschließen, nur dünne Overlays */
export function applyCasting(root) {
  root.traverse(o => { if (!o.isMesh) return; const ms = [].concat(o.material);
    const thin = o.userData.petOverlay || ms.some(m => m.isShaderMaterial || (m.transparent && m.opacity < 0.98));
    o.castShadow = !thin; o.receiveShadow = !ms.some(m => m.isShaderMaterial); });
}
