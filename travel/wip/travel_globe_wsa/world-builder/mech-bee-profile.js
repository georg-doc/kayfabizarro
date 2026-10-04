import * as THREE from 'three';

// WB0 Movement Lab donor adapter for the existing Stunt Race Frankenstein F1-S5 Bee Mech.
// Source of the decisions, not a second runtime owner:
//   KFB-Stunt-Car-Race/_handover/SPRINTS_2026-09-10/F2_VEHICLE_REVIEW/source/frankenstein/
// F1-S5 already established:
//   Barbara Bee shell donor + measured animal-island removal + FrizzleBob hatch/cockpit + own Mech clips.
// This module ports only the visible/animation donor into WB0. Ground world movement remains owned by
// ground-controller.js; Stunt/Rapier physics are deliberately NOT imported.

export const F1_DONOR_REV = '15e36b915c9bdfd7ff000d398418269e27c6ef9f';
export const FRIZZLE_RIG_REV = 'c4c7404a3034077d95ccfd051659bc1c05186050';

const BEE_PATH = 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Characters/GLTF/Mech_BarbaraTheBee.gltf';
const FRIZZLE_PATH = 'tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/assets/models/FrizzleBob_Yellow.gltf';
const SPACE = 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/';
const PARTS = Object.freeze({
  roof: SPACE + 'Environment/GLTF/Roof_Opening.gltf',
  sphere: SPACE + 'Items/GLTF/Pickup_Sphere.gltf',
  crate: SPACE + 'Items/GLTF/Pickup_Crate.gltf',
});
const ANIMAL_BONES = ['Head', 'Neck', 'Chest'];

function raw(pin, path) {
  return `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${pin}/`
    + path.split('/').map((part) => encodeURIComponent(part)).join('/');
}

function firstMesh(root) {
  let out = null;
  root.traverse((node) => { if (!out && node.isMesh) out = node; });
  return out;
}

function firstSkinned(root) {
  let out = null;
  root.traverse((node) => { if (!out && node.isSkinnedMesh) out = node; });
  return out;
}

function islands(geometry) {
  const pos = geometry.attributes.position;
  const n = pos.count;
  const idx = geometry.index ? geometry.index.array : Uint32Array.from({ length: n }, (_, i) => i);
  const parent = new Int32Array(n);
  for (let i = 0; i < n; i++) parent[i] = i;
  const find = (i) => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  };
  const union = (a, b) => {
    a = find(a); b = find(b);
    if (a !== b) parent[a] = b;
  };
  const byPos = new Map();
  const key = (x, y, z) => `${Math.round(x * 2000)},${Math.round(y * 2000)},${Math.round(z * 2000)}`;
  for (let i = 0; i < n; i++) {
    const k = key(pos.getX(i), pos.getY(i), pos.getZ(i));
    if (byPos.has(k)) union(i, byPos.get(k)); else byPos.set(k, i);
  }
  for (let t = 0; t < idx.length; t += 3) {
    union(idx[t], idx[t + 1]);
    union(idx[t + 1], idx[t + 2]);
  }
  const comp = new Map();
  const triComp = new Int32Array(idx.length / 3);
  for (let t = 0; t < idx.length; t += 3) {
    const r = find(idx[t]);
    if (!comp.has(r)) comp.set(r, comp.size);
    triComp[t / 3] = comp.get(r);
  }
  return { count: comp.size, triComp, idx };
}

function islandBones(mesh, isl) {
  const g = mesh.geometry;
  const skinIndex = g.attributes.skinIndex;
  const skinWeight = g.attributes.skinWeight;
  const bones = mesh.skeleton.bones;
  const acc = Array.from({ length: isl.count }, () => new Map());
  for (let t = 0; t < isl.idx.length; t++) {
    const vertex = isl.idx[t];
    const bucket = acc[isl.triComp[Math.floor(t / 3)]];
    for (let w = 0; w < 4; w++) {
      const weight = skinWeight.getComponent(vertex, w);
      if (weight <= 0) continue;
      const bone = bones[skinIndex.getComponent(vertex, w)]?.name || '?';
      bucket.set(bone, (bucket.get(bone) || 0) + weight);
    }
  }
  return acc.map((bucket) => [...bucket.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null);
}

function cutAnimalIslands(mesh) {
  const geometry = mesh.geometry.clone();
  mesh.geometry = geometry;
  const isl = islands(geometry);
  const dominant = islandBones(mesh, isl);
  const drop = dominant.map((bone) => ANIMAL_BONES.includes(bone));
  const keep = [], removed = [];
  for (let t = 0; t < isl.idx.length; t += 3) {
    const target = drop[isl.triComp[t / 3]] ? removed : keep;
    target.push(isl.idx[t], isl.idx[t + 1], isl.idx[t + 2]);
  }
  geometry.setIndex(keep);
  geometry.computeBoundingSphere();
  return {
    islands: isl.count,
    removedIslands: drop.filter(Boolean).length,
    removedIndex: removed,
    keptTriangles: keep.length / 3,
  };
}

function skinnedBox(mesh, indices) {
  mesh.updateWorldMatrix(true, false);
  mesh.skeleton.update();
  const point = new THREE.Vector3();
  const box = new THREE.Box3();
  const seen = new Set();
  for (const index of indices) {
    if (seen.has(index)) continue;
    seen.add(index);
    mesh.getVertexPosition(index, point).applyMatrix4(mesh.matrixWorld);
    box.expandByPoint(point);
  }
  return box;
}

function boxSize(root) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  return { box, size: box.getSize(new THREE.Vector3()) };
}

function openLid(mesh, yFrac = 0.55, minNy = 0.7) {
  const g = mesh.geometry.clone();
  g.computeBoundingBox();
  const bb = g.boundingBox;
  const y0 = bb.min.y + (bb.max.y - bb.min.y) * yFrac;
  const pos = g.attributes.position;
  const idx = g.index ? Array.from(g.index.array) : Array.from({ length: pos.count }, (_, i) => i);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
  const keep = [];
  for (let t = 0; t < idx.length; t += 3) {
    a.fromBufferAttribute(pos, idx[t]);
    b.fromBufferAttribute(pos, idx[t + 1]);
    c.fromBufferAttribute(pos, idx[t + 2]);
    n.copy(b).sub(a).cross(c.clone().sub(a)).normalize();
    const cy = (a.y + b.y + c.y) / 3;
    if (n.y > minNy && cy > y0) continue;
    keep.push(idx[t], idx[t + 1], idx[t + 2]);
  }
  g.setIndex(keep);
  mesh.geometry = g;
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const material of mats) if (material) material.side = THREE.DoubleSide;
}

function recolor(root, color, roughness = 0.65, metalness = 0.25) {
  root.traverse((node) => {
    if (!node.isMesh) return;
    node.material = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    node.castShadow = true;
    node.receiveShadow = true;
  });
}

async function buildHatch(loader, radius) {
  const [roofGltf, sphereGltf, crateGltf] = await Promise.all([
    loader.loadAsync(raw(F1_DONOR_REV, PARTS.roof)),
    loader.loadAsync(raw(F1_DONOR_REV, PARTS.sphere)),
    loader.loadAsync(raw(F1_DONOR_REV, PARTS.crate)),
  ]);
  const roof = roofGltf.scene;
  const sphere = sphereGltf.scene;
  const crate = crateGltf.scene;
  const group = new THREE.Group();
  group.name = 'F1-S5 Bee cockpit base';

  const collar = firstMesh(roof);
  if (collar) openLid(collar);
  const rb = new THREE.Box3().setFromObject(roof);
  const rs = rb.getSize(new THREE.Vector3());
  const collarH = 0.22;
  const k = 2 * radius / Math.max(rs.x, rs.z);
  const ky = collarH / Math.max(1e-6, rs.y);
  roof.scale.set(k, ky, k);
  roof.position.set(-(rb.min.x + rb.max.x) * 0.5 * k, -rb.min.y * ky, -(rb.min.z + rb.max.z) * 0.5 * k);
  recolor(roof, 0x9a978a, 0.55, 0.45);
  group.add(roof);

  const bowl = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 0.98, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x354238, roughness: 0.72, metalness: 0.28, side: THREE.DoubleSide }),
  );
  bowl.scale.y = 0.55 / Math.max(1e-6, radius * 0.98);
  bowl.position.y = 0.01;
  bowl.castShadow = true;
  group.add(bowl);

  const cb = new THREE.Box3().setFromObject(crate);
  const cs = cb.getSize(new THREE.Vector3());
  for (const side of [-1, 1]) {
    const padSrc = side < 0 ? crate : crate.clone(true);
    padSrc.scale.set(0.30 / cs.x, 0.09 / cs.y, 0.30 / cs.z);
    padSrc.position.set(-(cb.min.x + cb.max.x) * 0.5 * 0.30 / cs.x, -cb.min.y * 0.09 / cs.y,
      -(cb.min.z + cb.max.z) * 0.5 * 0.30 / cs.z);
    recolor(padSrc, 0x354238, 0.65, 0.25);
    const pad = new THREE.Group();
    pad.add(padSrc);
    pad.position.set(side * 0.40, collarH - 0.01, 0.34);
    group.add(pad);
  }

  const sb = new THREE.Box3().setFromObject(sphere);
  const ss = sb.getSize(new THREE.Vector3());
  const knobScale = 0.22 / Math.max(1e-6, ss.x);
  sphere.scale.setScalar(knobScale);
  sphere.position.set(-(sb.min.x + sb.max.x) * 0.5, -(sb.min.y + sb.max.y) * 0.5, -(sb.min.z + sb.max.z) * 0.5)
    .multiplyScalar(knobScale);
  recolor(sphere, 0xe96049, 0.48, 0.08);
  const knob = new THREE.Group(); knob.add(sphere); knob.position.set(0.40, 0.57, 0.34); group.add(knob);

  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.032, 0.28, 10),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.3 }));
  rod.position.set(0.40, 0.40, 0.34); group.add(rod);
  return { group, collarH, hatchTop: 0.30 + collarH };
}

function collapseDriverLegs(driver) {
  driver.traverse((node) => {
    if (node.isBone && /UpperLeg[. _]?[LR]$/i.test(node.name)) node.scale.multiplyScalar(0.02);
  });
}

export async function buildFrizzleBeeMovementDonor({ loader, bodyHeight }) {
  const [beeGltf, driverGltf] = await Promise.all([
    loader.loadAsync(raw(F1_DONOR_REV, BEE_PATH)),
    loader.loadAsync(raw(FRIZZLE_RIG_REV, FRIZZLE_PATH)),
  ]);

  const beeScene = beeGltf.scene;
  const mesh = firstSkinned(beeScene);
  if (!mesh) throw new Error('F1-S5 Bee donor has no SkinnedMesh');
  beeScene.updateMatrixWorld(true);

  const originalIndex = Array.from(mesh.geometry.index?.array || []);
  const cut = cutAnimalIslands(mesh);
  const shellBox = skinnedBox(mesh, Array.from(mesh.geometry.index?.array || []));
  const cockpitBox = cut.removedIndex.length ? skinnedBox(mesh, cut.removedIndex) : null;
  const shellSize = shellBox.getSize(new THREE.Vector3());

  const shellHolder = new THREE.Group();
  shellHolder.name = 'F1-S5 Barbara Bee shell';
  shellHolder.add(beeScene);
  const f1Scale = 2.3 / Math.max(1e-6, shellSize.x);
  shellHolder.scale.setScalar(f1Scale);
  const shellCenter = shellBox.getCenter(new THREE.Vector3());
  shellHolder.position.set(-shellCenter.x * f1Scale, -0.5 - shellBox.min.y * f1Scale, -shellCenter.z * f1Scale);
  shellHolder.updateMatrixWorld(true);

  const assembly = new THREE.Group();
  assembly.name = 'FrizzleBob · Bee Mech · F1-S5 movement donor';
  assembly.add(shellHolder);

  const driver = driverGltf.scene;
  driver.name = 'FrizzleBob Yellow · cockpit driver donor';
  collapseDriverLegs(driver);
  const driverMeasure = boxSize(driver);
  const driverTargetHeight = 1.55;
  const driverScale = driverTargetHeight / Math.max(1e-6, driverMeasure.size.y);
  const kGuess = driverTargetHeight / 3.6;
  const hatchRadius = Math.max(0.8, (0.5 * 1.38 * 1.08) / kGuess);
  const hatch = await buildHatch(loader, hatchRadius);

  const driverRoot = new THREE.Group();
  driverRoot.name = 'F1-S5 FrizzleBob cockpit adapter · movement-only';
  driverRoot.add(driver);
  driverRoot.add(hatch.group);
  hatch.group.position.y = 0.30;
  driver.scale.setScalar(1);
  driver.position.y -= driverMeasure.box.min.y;
  driverRoot.scale.setScalar(driverScale);
  const rimAboveSeat = 0.10;
  const rootY = rimAboveSeat - hatch.hatchTop * driverScale + 0.06;
  driverRoot.position.set(0, rootY, 0.05);
  assembly.add(driverRoot);

  assembly.updateMatrixWorld(true);
  const before = boxSize(assembly);
  const targetHeight = bodyHeight * 3.6;
  const labScale = targetHeight / Math.max(1e-6, before.size.y);
  assembly.scale.setScalar(labScale);
  assembly.updateMatrixWorld(true);
  const after = boxSize(assembly);
  assembly.position.y -= after.box.min.y;
  assembly.updateMatrixWorld(true);

  const animationScale = f1Scale * labScale;
  const animations = beeGltf.animations || [];
  const clipNames = animations.map((clip) => clip.name);

  return {
    model: assembly,
    animationRoot: beeScene,
    animations,
    animationScale,
    speedMul: 1.6,
    targetHeight,
    report: {
      donor: 'Stunt Race Frankenstein F1-S5',
      recipe: 'frizzle_mech_bee',
      beeAsset: BEE_PATH,
      frizzleAsset: FRIZZLE_PATH,
      sourceTriangles: originalIndex.length / 3,
      cutIslands: `${cut.removedIslands}/${cut.islands}`,
      clips: clipNames,
      targetHeight,
      speedMul: 1.6,
      cockpit: 'F1-S5-derived Roof_Opening + crate pads + sphere joystick',
      driverPresentation: 'yellow FrizzleBob donor; lower-body collapse replaces F1 clipping only in this Movement Lab',
    },
  };
}
