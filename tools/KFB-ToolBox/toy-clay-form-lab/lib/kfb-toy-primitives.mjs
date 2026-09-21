import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const TOY_STYLE_DEFAULTS = Object.freeze({
  cornerRatio: 0.14,
  roundedSegments: 5,
  roughness: 0.84,
  metalness: 0,
  minimumFeatureRatio: 0.08,
  maxHeroParts: 16,
});

export function toyMaterial(THREE, color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? TOY_STYLE_DEFAULTS.roughness,
    metalness: options.metalness ?? TOY_STYLE_DEFAULTS.metalness,
    flatShading: false,
  });
}

export function markToyPart(mesh, name) {
  mesh.name = name;
  mesh.userData.kfbToyPart = true;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function roundedBox(THREE, {
  name='rounded-box', size=[1,1,1], radius=null,
  segments=TOY_STYLE_DEFAULTS.roundedSegments, material,
  position=[0,0,0], rotation=[0,0,0],
} = {}) {
  const minDim = Math.min(...size);
  const r = Math.min(radius ?? minDim * TOY_STYLE_DEFAULTS.cornerRatio, minDim * 0.45);
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(size[0], size[1], size[2], segments, r), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  return markToyPart(mesh, name);
}

export function capsuleBeam(THREE, {
  name='capsule-beam', start=[0,0,0], end=[0,1,0], radius=.12,
  material, capSegments=6, radialSegments=12,
} = {}) {
  const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
  const delta = b.clone().sub(a), distance = delta.length();
  const r = Math.min(radius, Math.max(.01, distance * .22));
  const cylinderLength = Math.max(.001, distance - r * 2);
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(r, cylinderLength, capSegments, radialSegments), material);
  mesh.position.copy(a).add(b).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), delta.normalize());
  return markToyPart(mesh, name);
}

export function softSpire(THREE, {
  name='soft-spire', radius=.7, height=2.4, material,
  position=[0,0,0], radialSegments=20,
} = {}) {
  const points = [
    [0,0],[radius*.72,0],[radius,height*.10],[radius*.90,height*.28],
    [radius*.72,height*.50],[radius*.45,height*.72],[radius*.20,height*.90],
    [radius*.06,height*.98],[0,height],
  ].map(([x,y])=>new THREE.Vector2(x,y));
  const mesh = new THREE.Mesh(new THREE.LatheGeometry(points, radialSegments), material);
  mesh.position.set(...position);
  return markToyPart(mesh, name);
}

export function softArch(THREE, {
  name='soft-arch', radius=1.4, tube=.16, material,
  position=[0,0,0], rotation=[0,0,0], arc=Math.PI,
} = {}) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 28, arc), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  return markToyPart(mesh, name);
}

export function toyStats(root) {
  let parts=0, triangles=0;
  root.traverse(o=>{
    if(!o.isMesh || !o.userData.kfbToyPart) return;
    parts++;
    const g=o.geometry;
    triangles += (g.index?.count ?? g.attributes.position.count) / 3;
  });
  return {parts,triangles:Math.round(triangles)};
}
