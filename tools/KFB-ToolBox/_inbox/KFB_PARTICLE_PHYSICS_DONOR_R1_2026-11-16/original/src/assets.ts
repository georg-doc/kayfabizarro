// The two models the scenes use, loaded once for the whole visit: the rubber duck (Poly Haven, CC0) and the block's own
// bunny (make-bunny.mjs, CC0). The bunny's mesh format and its reader are the library demo's (demo/presets/honey.ts, MIT).
import { BufferAttribute, BufferGeometry, Float32BufferAttribute, type MeshStandardMaterial, type Mesh } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { decodeSdfBinary, type SDFData } from 'threejs-particle-fluids';

export interface Assets {
  duck: { geometry: BufferGeometry; material: MeshStandardMaterial };
  bunny: { geometry: BufferGeometry; sdf: SDFData };
}

const MESH_MAGIC = 0x4e554242;

async function bytes(file: string): Promise<ArrayBuffer> {
  const response = await fetch(new URL(`${import.meta.env.BASE_URL}models/${file}`, location.href));
  if (!response.ok) throw new Error(`Could not load ${file}: ${response.status}`);
  return response.arrayBuffer();
}

function readMesh(buffer: ArrayBuffer): BufferGeometry {
  const view = new DataView(buffer);
  if (view.getUint32(0, true) !== MESH_MAGIC) throw new Error('The bunny mesh is invalid.');
  const vertices = view.getUint32(4, true);
  const indexCount = view.getUint32(8, true);
  const min = [0, 1, 2].map((k) => view.getFloat32(12 + k * 4, true));
  const max = [0, 1, 2].map((k) => view.getFloat32(24 + k * 4, true));
  const quantized = new Uint16Array(buffer, 36, vertices * 3);
  const positions = new Float32Array(vertices * 3);
  for (let i = 0; i < positions.length; i++) positions[i] = min[i % 3]! + (quantized[i]! / 65535) * (max[i % 3]! - min[i % 3]!);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(new BufferAttribute(new Uint16Array(buffer, 36 + vertices * 6, indexCount), 1));
  geometry.computeVertexNormals();
  return geometry;
}

export async function loadAssets(): Promise<Assets> {
  const [model, mesh, field] = await Promise.all([
    new GLTFLoader().loadAsync(new URL(`${import.meta.env.BASE_URL}models/rubber-duck.glb`, location.href).href),
    bytes('bunny.mesh.bin'),
    bytes('bunny.sdf.bin'),
  ]);
  model.scene.updateMatrixWorld(true);
  const source = model.scene.getObjectByProperty('isMesh', true) as Mesh<BufferGeometry, MeshStandardMaterial> | undefined;
  if (!source) throw new Error('The rubber duck has no mesh.');
  const duck = source.geometry.clone().applyMatrix4(source.matrixWorld);
  return { duck: { geometry: duck, material: source.material }, bunny: { geometry: readMesh(mesh), sdf: decodeSdfBinary(field) } };
}
