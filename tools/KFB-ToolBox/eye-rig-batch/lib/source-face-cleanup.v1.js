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
  eyeComponents = [2, 3],
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
  const eyeIdentityOk = guardOk &&
    eyeComponents[0] === 2 && eyeComponents[1] === 3 &&
    shells[2].count === 69 && shells[3].count === 69 &&
    shells[2].xmin > 0.1 && shells[2].xmax < 0.3 &&
    shells[3].xmin > -0.3 && shells[3].xmax < -0.1 &&
    Math.abs(shells[2].ymin - shells[3].ymin) < 0.002 &&
    Math.abs(shells[2].ymax - shells[3].ymax) < 0.002 &&
    Math.abs(shells[2].zmin - shells[3].zmin) < 0.002 &&
    Math.abs(shells[2].zmax - shells[3].zmax) < 0.002;

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
    pairConfidence: eyeIdentityOk ? 1 : 0,
    femaleOuterLashCandidate: 'EYE_ASSEMBLY_OR_TEXTURE_UNRESOLVED',
    removalMode: eyeIdentityOk ? 'mesh-components' : 'none',
    guard: `connectedComponents === ${expectedConnectedComponents}`,
    status: eyeIdentityOk ? 'SOURCE_IDENTITY_VERIFIED_AUTO_CANDIDATE' : 'HUMAN_REQUIRED',
    sourceGeometryUuid: original.uuid,
    materialGroups: original.groups ? original.groups.length : 0,
    components: shells.map((s, component) => ({
      component,
      triangles: s.count,
      bounds: {
        x: [+s.xmin.toFixed(4), +s.xmax.toFixed(4)],
        y: [+s.ymin.toFixed(4), +s.ymax.toFixed(4)],
        z: [+s.zmin.toFixed(4), +s.zmax.toFixed(4)]
      }
    })),
    componentDiagnostic: { status: 'OFF', selected: null },
    sourceMeasuredSeed: null
  };

  if (!eyeIdentityOk) {
    log(`source-face identity guard failed · ${shells.length} components; expected current GothGirl eye pair 2+3; no geometry hidden`);
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
  const originalMaterial = headMesh.material;
  const materialSource = Array.isArray(originalMaterial) ? originalMaterial[0] : originalMaterial;
  const debugMaterial = materialSource?.clone ? materialSource.clone() : materialSource;
  if (debugMaterial && debugMaterial !== materialSource) {
    debugMaterial.name = 'KFB_SOURCE_COMPONENT_DIAGNOSTIC';
    debugMaterial.color?.setHex?.(0xff3b72);
    debugMaterial.emissive?.setHex?.(0x4a081d);
    if ('map' in debugMaterial) debugMaterial.map = null;
    if ('emissiveMap' in debugMaterial) debugMaterial.emissiveMap = null;
    debugMaterial.transparent = false;
    debugMaterial.opacity = 1;
    debugMaterial.depthTest = true;
    debugMaterial.depthWrite = true;
    debugMaterial.needsUpdate = true;
  }
  const componentGeometries = new Map();
  let active = false;
  let isolatedComponent = null;

  function componentGeometry(component) {
    if (componentGeometries.has(component)) return componentGeometries.get(component);
    const shell = shells[component];
    if (!shell) return null;
    const keep = new Set(shell.tris);
    const triCount = original.index ? original.index.count / 3 : original.attributes.position.count / 3;
    const remove = [];
    for (let t = 0; t < triCount; t++) if (!keep.has(t)) remove.push(t);
    const geo = buildStripped(original, remove, false);
    geo.clearGroups();
    geo.name = `${original.name || headMesh.name || 'head'}__KFB_COMPONENT_${String(component).padStart(2, '0')}`;
    componentGeometries.set(component, geo);
    return geo;
  }

  function renderHeadGeometry() {
    if (isolatedComponent != null) {
      headMesh.geometry = componentGeometry(isolatedComponent);
      if (debugMaterial) headMesh.material = debugMaterial;
    } else {
      headMesh.geometry = active ? stripped : original;
      headMesh.material = originalMaterial;
    }
    headMesh.geometry?.computeBoundingBox?.();
    headMesh.geometry?.computeBoundingSphere?.();
  }

  function apply(on = true) {
    active = !!on;
    renderHeadGeometry();
    return active;
  }

  function setComponentIsolation(component) {
    const i = Number(component);
    if (!Number.isInteger(i) || i < 0 || i >= shells.length) return null;
    isolatedComponent = i;
    renderHeadGeometry();
    const detail = report.components[i];
    report.componentDiagnostic = { status: 'ISOLATED_SOURCE_COMPONENT', selected: i, ...detail };
    log(`source component ${i} isolated · ${detail.triangles} tris · original source geometry`);
    return report.componentDiagnostic;
  }

  function clearComponentIsolation() {
    isolatedComponent = null;
    report.componentDiagnostic = { status: 'OFF', selected: null };
    renderHeadGeometry();
    log('source component diagnostic off');
    return true;
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
    get isolatedComponent() { return isolatedComponent; },
    apply,
    setComponentIsolation,
    clearComponentIsolation,
    measureOnFaceHost,
    dispose() {
      isolatedComponent = null;
      headMesh.geometry = original;
      headMesh.material = originalMaterial;
      stripped.dispose();
      componentGeometries.forEach((geo) => geo.dispose());
      if (debugMaterial && debugMaterial !== materialSource) debugMaterial.dispose?.();
    }
  };
}

export default prepareVerifiedGothGirlCleanup;
