import * as THREE from 'three';

// WB0 support-surface seam.
// Terrain remains the base height truth. Registered cards/props may only raise the walkable
// support at a direction; they do not replace terrain, movement, collision or the renderer.
export function createSupportSurfaceResolver({ terrainRadiusAt, bodyHeight = 0.022 } = {}) {
  const entries = new Map();
  const ray = new THREE.Raycaster();
  const origin = new THREE.Vector3();
  const inward = new THREE.Vector3();
  const n = new THREE.Vector3();
  const worldNormal = new THREE.Vector3();
  const normalMatrix = new THREE.Matrix3();

  const params = { probeHeight: bodyHeight * 14, belowTolerance: bodyHeight * 0.08, minUpDot: 0.24 };
  const stats = { queries: 0, objectTests: 0, hits: 0, supportHits: 0, last: null };

  function registerObject(id, object, options = {}) {
    if (!id || !object) return () => {};
    const entry = {
      id: String(id), object, kind: options.kind || 'prop', enabled: options.enabled !== false,
      minUpDot: Number.isFinite(options.minUpDot) ? options.minUpDot : params.minUpDot,
      maxRise: Number.isFinite(options.maxRise) ? options.maxRise : params.probeHeight,
      priority: Number.isFinite(Number(options.priority)) ? Number(options.priority) : 0,
      roles: Array.isArray(options.roles) ? [...options.roles] : [],
      normalPolicy: options.normalPolicy ?? null, surfaceId: options.surfaceId ?? null, recipeId: options.recipeId ?? null,
    };
    entries.set(entry.id, entry); return () => entries.delete(entry.id);
  }
  function unregister(id) { return entries.delete(String(id)); }
  function terrainRadius(direction) { const value = typeof terrainRadiusAt === 'function' ? terrainRadiusAt(direction) : 5; return Number.isFinite(value) ? value : 5; }
  function faceUpDot(hit, direction) {
    if (!hit.face || !hit.object) return 1;
    normalMatrix.getNormalMatrix(hit.object.matrixWorld); worldNormal.copy(hit.face.normal).applyMatrix3(normalMatrix).normalize();
    return worldNormal.dot(direction);
  }
  function resolve(direction, baseRadius = null) {
    stats.queries++; n.copy(direction).normalize();
    const terrain = Number.isFinite(baseRadius) ? baseRadius : terrainRadius(n), top = terrain + params.probeHeight;
    origin.copy(n).multiplyScalar(top); inward.copy(n).multiplyScalar(-1); ray.set(origin, inward); ray.near = 0; ray.far = params.probeHeight + params.belowTolerance;
    let best = { radius: terrain, terrainRadius: terrain, delta: 0, source: 'terrain', kind: 'terrain', id: 'terrain', point: n.clone().multiplyScalar(terrain), priority: Number.NEGATIVE_INFINITY, roles: ['support','walkable'], normalPolicy: 'baked-terrain', surfaceId: 'terrain', recipeId: null };
    for (const entry of entries.values()) {
      if (!entry.enabled || !entry.object || !entry.object.parent || !entry.object.visible) continue;
      stats.objectTests++; entry.object.updateWorldMatrix(true, true); const hits = ray.intersectObject(entry.object, true); stats.hits += hits.length;
      for (const hit of hits) {
        const radius = hit.point.length();
        if (radius < terrain - params.belowTolerance) continue;
        if (radius > terrain + Math.min(entry.maxRise, params.probeHeight) + 1e-6) continue;
        if (faceUpDot(hit, n) < entry.minUpDot) continue;
        if (radius <= terrain + 1e-6) continue;
        const higher = radius > best.radius + 1e-6;
        const tied = Math.abs(radius - best.radius) <= 1e-6 && entry.priority > (best.priority ?? 0);
        if (!higher && !tied) continue;
        best = { radius, terrainRadius: terrain, delta: radius - terrain, source: entry.id, kind: entry.kind, id: entry.id, point: hit.point.clone(), object: hit.object, priority: entry.priority, roles: [...entry.roles], normalPolicy: entry.normalPolicy, surfaceId: entry.surfaceId, recipeId: entry.recipeId };
        break;
      }
    }
    if (best.kind !== 'terrain') stats.supportHits++;
    stats.last = { radius: best.radius, terrainRadius: terrain, delta: best.delta, source: best.source, kind: best.kind, priority: best.priority, roles: [...(best.roles || [])], surfaceId: best.surfaceId, recipeId: best.recipeId };
    return best;
  }
  return {
    name: 'wb0-support-surface-resolver', params, registerObject, unregister, resolve,
    clear() { entries.clear(); },
    report() { return { registered: entries.size, entries: [...entries.values()].map((entry) => ({ id: entry.id, kind: entry.kind, enabled: entry.enabled, priority: entry.priority, roles: [...entry.roles], normalPolicy: entry.normalPolicy, surfaceId: entry.surfaceId, recipeId: entry.recipeId })), ...stats }; },
  };
}
