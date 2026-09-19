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

function geometryVertexIndex(geo, triangle, corner) {
  return geo.index ? geo.index.getX(triangle * 3 + corner) : triangle * 3 + corner;
}

function roundVec(v) {
  return [v.x, v.y, v.z].map((n) => +n.toFixed(5));
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
      measureOnFaceHost() { return null; },
      dispose() {}
    };
  }

  const headMesh = findHeadMesh(figure, preferredHeadMesh);
  if (!headMesh) {
    return {
      status: 'UNSUPPORTED',
      report: { schema: SOURCE_FACE_SCHEMA, status: 'UNSUPPORTED', reason: 'head skinned mesh not found' },
      apply() { return false; },
      measureOnFaceHost() { return null; },
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
    materialGroups: original.groups ? original.groups.length : 0,
    sourceMeasuredSeed: null
  };

  if (!guardOk) {
    log(`source-face guard failed · ${shells.length} components; expected ${expectedConnectedComponents}; no geometry hidden`);
    return {
      status: 'HUMAN_REQUIRED',
      headMesh,
      report,
      apply() { headMesh.geometry = original; return false; },
      measureOnFaceHost() { return null; },
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

  function measureOnFaceHost(faceHost) {
    const hostBox = faceHost?.box;
    const V3 = headMesh.position?.constructor;
    if (!hostBox || !hostBox.geometry || !headMesh.getVertexPosition || !V3) return null;

    figure.updateMatrixWorld(true);
    hostBox.updateMatrixWorld(true);
    if (!hostBox.geometry.boundingBox) hostBox.geometry.computeBoundingBox();
    const hostBounds = hostBox.geometry.boundingBox;
    const hostCenter = hostBounds.getCenter(new V3());
    const hostSize = hostBounds.getSize(new V3());
    const unit = hostSize.y / 2;
    if (!(unit > 0)) return null;

    const measureShell = (component) => {
      const shell = shells[component];
      const min = new V3(Infinity, Infinity, Infinity);
      const max = new V3(-Infinity, -Infinity, -Infinity);
      const p = new V3();
      const world = new V3();
      for (const triangle of shell.tris) {
        for (let corner = 0; corner < 3; corner++) {
          const vi = geometryVertexIndex(original, triangle, corner);
          headMesh.getVertexPosition(vi, p);
          world.copy(p);
          headMesh.localToWorld(world);
          hostBox.worldToLocal(world);
          min.min(world); max.max(world);
        }
      }
      const center = min.clone().add(max).multiplyScalar(0.5);
      const size = max.clone().sub(min);
      return {
        component,
        center: roundVec(center),
        size: roundVec(size),
        radiusXY: +(Math.max(size.x, size.y) * 0.5).toFixed(5)
      };
    };

    const measured = eyeComponents.map(measureShell).sort((a, b) => a.center[0] - b.center[0]);
    const meanAbsX = measured.reduce((sum, eye) => sum + Math.abs(eye.center[0] - hostCenter.x), 0) / measured.length;
    const meanY = measured.reduce((sum, eye) => sum + (eye.center[1] - hostCenter.y), 0) / measured.length;
    const meanRadius = measured.reduce((sum, eye) => sum + eye.radiusXY, 0) / measured.length;
    const left = measured[0], right = measured[1];
    const result = {
      method: 'verified-source-components→skinned-vertex→world→FaceHost-local',
      eyeComponents: measured,
      hostUnit: +unit.toFixed(5),
      sourcePairSpanX: +(right.center[0] - left.center[0]).toFixed(5),
      sourceVerticalAsymmetry: +Math.abs(right.center[1] - left.center[1]).toFixed(5),
      anchorCandidate: {
        dx: +(meanAbsX / unit).toFixed(5),
        dy: +(meanY / unit).toFixed(5),
        ring: +(meanRadius / unit).toFixed(5)
      },
      status: 'MEASURED_NOT_APPLIED'
    };
    report.sourceMeasuredSeed = result;
    log(`source-measured seed · dx ${result.anchorCandidate.dx} · dy ${result.anchorCandidate.dy} · ring ${result.anchorCandidate.ring} · NOT APPLIED`);
    return result;
  }

  log(`source-face guard OK · ${shells.length} components · runtime hide islands ${eyeComponents.join('+')}`);

  return {
    status: 'AUTO_CANDIDATE',
    headMesh,
    report,
    get active() { return active; },
    apply,
    measureOnFaceHost,
    dispose() {
      headMesh.geometry = original;
      stripped.dispose();
    }
  };
}

export default prepareVerifiedGothGirlCleanup;
