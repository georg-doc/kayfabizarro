import * as THREE from 'three';

export function visibleMeshBounds(root) {
  if (!root) return new THREE.Box3();
  root.updateWorldMatrix(true, true);
  const box = new THREE.Box3().makeEmpty();
  const scratch = new THREE.Box3();
  root.traverse((object) => {
    if (!object.visible || !(object.isMesh || object.isSkinnedMesh || object.isPoints || object.isLine)) return;
    scratch.makeEmpty().setFromObject(object, true);
    if (!scratch.isEmpty()) box.union(scratch);
  });
  if (box.isEmpty()) box.setFromObject(root, true);
  return box;
}

export function paddedFramingBounds(box, { headroom = 0.14, footroom = 0.05, side = 0.06, depth = 0.06 } = {}) {
  const framed = box.clone();
  if (framed.isEmpty()) return framed;
  const size = framed.getSize(new THREE.Vector3());
  const sx = Math.max(size.x, 0.001), sy = Math.max(size.y, 0.001), sz = Math.max(size.z, 0.001);
  framed.min.x -= sx * side;
  framed.max.x += sx * side;
  framed.min.y -= sy * footroom;
  framed.max.y += sy * headroom;
  framed.min.z -= sz * depth;
  framed.max.z += sz * depth;
  return framed;
}

export function framePerspectiveCamera(camera, box, {
  controls = null,
  padding = 1.16,
  direction = new THREE.Vector3(1, 0.38, 1),
  headroom = 0.14,
  footroom = 0.05,
  side = 0.06,
  depth = 0.06,
} = {}) {
  if (!camera || !box || box.isEmpty()) return null;
  const framed = paddedFramingBounds(box, { headroom, footroom, side, depth });
  const sphere = framed.getBoundingSphere(new THREE.Sphere());
  const radius = Math.max(sphere.radius, 0.01);
  const vfov = THREE.MathUtils.degToRad(camera.fov);
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * Math.max(camera.aspect, 0.01));
  const limiting = Math.max(0.01, Math.min(vfov, hfov));
  const distance = (radius / Math.sin(limiting / 2)) * padding;
  const target = sphere.center.clone();
  const dir = direction.clone().normalize();
  camera.position.copy(target).add(dir.multiplyScalar(distance));
  camera.near = Math.max(radius / 120, distance - radius * 3.5, 0.001);
  camera.far = Math.max(distance + radius * 12, 100);
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  if (controls) {
    controls.target.copy(target);
    controls.update();
  }
  return { framed, sphere, target, distance };
}

export function projectedBounds(camera, box) {
  if (!camera || !box || box.isEmpty()) return null;
  camera.updateMatrixWorld(true);
  const min = box.min, max = box.max;
  const corners = [
    [min.x,min.y,min.z],[min.x,min.y,max.z],[min.x,max.y,min.z],[min.x,max.y,max.z],
    [max.x,min.y,min.z],[max.x,min.y,max.z],[max.x,max.y,min.z],[max.x,max.y,max.z],
  ].map(([x,y,z]) => new THREE.Vector3(x,y,z).project(camera));
  return {
    minX: Math.min(...corners.map((p) => p.x)), maxX: Math.max(...corners.map((p) => p.x)),
    minY: Math.min(...corners.map((p) => p.y)), maxY: Math.max(...corners.map((p) => p.y)),
    minZ: Math.min(...corners.map((p) => p.z)), maxZ: Math.max(...corners.map((p) => p.z)),
  };
}
