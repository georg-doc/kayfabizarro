import { faceShells, buildStripped } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@5650b6c54d8789b20ea80abe857688173d506d3b/media/3D_Assets/build/pet-library.v6.js';

export const SOURCE_FACE_SCHEMA = 'kfb.source-face-report/0.1-candidate';

function findHeadMesh(figure, preferredName) {
  let exact = null;
  let fallback = null;
  figure.traverse((node) => {
    if (!node.isSkinnedMesh || !node.geometry) return;
    if (node.name === preferredName) exact = node;
    if (!fallback && /head/i.test(node.name || '')) fallback = node;
  });
  return exact || fallback;
}

export function prepareVerifiedGothGirlCleanup({
  figure,
  preferredHeadMesh = 'GothGirl_Head',
  expectedConnectedComponents = 12,
  eyeComponents = [6, 7],
  log = () => {}
} = {}) {
  if (!figure) {
    return {
      status: 'UNSUPPORTED',
      report: { schema: SOURCE_FACE_SCHEMA, status: 'UNSUPPORTED', reason: 'missing figure' },
      apply() { return false; },
      dispose() {}
    };
  }

  const headMesh = findHeadMesh(figure, preferredHeadMesh);
  if (!headMesh) {
    return {
      status: 'UNSUPPORTED',
      report: { schema: SOURCE_FACE_SCHEMA, status: 'UNSUPPORTED', reason: 'head skinned mesh not found' },
      apply() { return false; },
      dispose() {}
    };
  }

  const original = headMesh.geometry;
  const shells = faceShells(original);
  const guardOk = shells.length === expectedConnectedComponents &&
    eyeComponents.length === 2 &&
    eyeComponents.every((i) => Number.isInteger(i) && i >= 0 && i < shells.length);

  const report = {
    schema: SOURCE_FACE_SCHEMA,
    headMesh: headMesh.name,
    connectedComponents: shells.length,
    expectedConnectedComponents,
    eyeCandidates: guardOk ? eyeComponents.map((i) => ({
      component: i,
      triangles: shells[i].count,
      bounds: {
        x: [+shells[i].xmin.toFixed(4), +shells[i].xmax.toFixed(4)],
        y: [+shells[i].ymin.toFixed(4), +shells[i].ymax.toFixed(4)],
        z: [+shells[i].zmin.toFixed(4), +shells[i].zmax.toFixed(4)]
      }
    })) : [],
    pairConfidence: guardOk ? 1 : 0,
    femaleOuterLashCandidate: 'VISUAL_REVIEW_REQUIRED',
    removalMode: guardOk ? 'mesh-components' : 'none',
    guard: `connectedComponents === ${expectedConnectedComponents}`,
    status: guardOk ? 'AUTO_CANDIDATE' : 'HUMAN_REQUIRED',
    sourceGeometryUuid: original.uuid,
    materialGroups: original.groups ? original.groups.length : 0
  };

  if (!guardOk) {
    log(`source-face guard failed · ${shells.length} components; expected ${expectedConnectedComponents}; no geometry hidden`);
    return {
      status: 'HUMAN_REQUIRED',
      headMesh,
      report,
      apply() { headMesh.geometry = original; return false; },
      dispose() { headMesh.geometry = original; }
    };
  }

  const stripTris = eyeComponents.flatMap((i) => shells[i].tris);
  const stripped = buildStripped(original, stripTris, false);
  stripped.name = `${original.name || headMesh.name || 'head'}__KFB_EYES_HIDDEN_RUNTIME`;
  let active = false;

  function apply(on = true) {
    active = !!on;
    headMesh.geometry = active ? stripped : original;
    headMesh.geometry.computeBoundingBox?.();
    headMesh.geometry.computeBoundingSphere?.();
    return active;
  }

  log(`source-face guard OK · ${shells.length} components · runtime hide islands ${eyeComponents.join('+')}`);

  return {
    status: 'AUTO_CANDIDATE',
    headMesh,
    report,
    get active() { return active; },
    apply,
    dispose() {
      headMesh.geometry = original;
      stripped.dispose();
    }
  };
}

export default prepareVerifiedGothGirlCleanup;
