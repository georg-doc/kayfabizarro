/* KFB World Atlas · generic browser -> Blender room manifest bridge
   The browser/editor remains the layout owner. Blender consumes world transforms only. */
import * as THREE from 'three';

const r6 = (v) => Math.round(v * 1e6) / 1e6;
const vec = (v) => v.toArray().map(r6);

function matrixArray(m) {
  return m.toArray().map(r6); // THREE column-major Matrix4.toArray()
}

function recordNode(node, index) {
  const rec = node.userData && node.userData.recipe;
  if (!rec || !rec.a) return null;
  node.updateMatrixWorld(true);
  const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
  node.matrixWorld.decompose(p, q, s);
  const [pack, name] = String(rec.a).split(':');
  return {
    index,
    asset: rec.a,
    pack,
    name,
    layer: rec.layer || null,
    group: rec.g || null,
    state: rec.zs || null,
    visible: node.visible !== false,
    positionThree: vec(p),
    quaternionThree: [q.x, q.y, q.z, q.w].map(r6),
    scaleThree: vec(s),
    matrixWorldThree: matrixArray(node.matrixWorld)
  };
}

export function makeBlenderManifest({ root, room, camera, controls, assetSources, source = {} }) {
  if (!root) throw new Error('Blender export requires a built room root');
  root.updateMatrixWorld(true);
  const all = root.children.map(recordNode).filter(Boolean);
  camera.updateMatrixWorld(true);
  return {
    schema: 'kfb.blender-room-manifest.v1',
    coordinateSystem: 'threejs-y-up-right-handed',
    transformConvention: 'matrixWorldThree is THREE.Matrix4.toArray() column-major; Blender adapter applies basis conversion',
    units: 'source-units-1to1',
    room: {
      id: room && room.id || null,
      title: room && room.titel || null,
      sourceReference: room && room.vorlage || null
    },
    source,
    assetSources,
    instances: all.filter((x) => x.visible),
    hiddenInstances: all.filter((x) => !x.visible),
    camera: {
      matrixWorldThree: matrixArray(camera.matrixWorld),
      verticalFovDegrees: r6(camera.fov),
      near: r6(camera.near),
      far: r6(camera.far),
      targetThree: controls && controls.target ? vec(controls.target) : null
    }
  };
}

export function downloadBlenderManifest(manifest, filename = 'KFB_room_blender_manifest.json') {
  const blob = new Blob([JSON.stringify(manifest, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
