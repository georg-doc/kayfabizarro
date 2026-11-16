// The page's side of fill-worker.ts. Results are kept for the visit where the same fill comes up again.
import { toTriangleMesh, type SDFData, type VoxelizeOptions, type VoxelizeResult } from 'threejs-particle-fluids';
import type { BufferGeometry } from 'three';

let worker: Worker | undefined;
let nextId = 0;
const waiting = new Map<number, { resolve(value: { shape: VoxelizeResult; radius: number }): void; reject(error: Error): void }>();

function ask(job: Record<string, unknown>): Promise<{ shape: VoxelizeResult; radius: number }> {
  if (!worker) {
    worker = new Worker(new URL('./fill-worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event) => {
      const { id, ...result } = event.data;
      waiting.get(id)?.resolve(result);
      waiting.delete(id);
    };
    worker.onerror = (event) => {
      for (const call of waiting.values()) call.reject(new Error(`Filling a shape with particles failed: ${event.message}`));
      waiting.clear();
    };
  }
  const id = nextId++;
  return new Promise((resolve, reject) => {
    waiting.set(id, { resolve, reject });
    worker!.postMessage({ id, ...job });
  });
}

/** Fills a mesh with particles. */
export async function fillMesh(geometry: BufferGeometry, options: VoxelizeOptions): Promise<VoxelizeResult> {
  const { vertices, indices } = toTriangleMesh(geometry);
  return (await ask({ kind: 'fill', shape: { vertices, indices }, options })).shape;
}

const bodies = new Map<number, Promise<{ shape: VoxelizeResult; radius: number }>>();

/** Fills a distance field with close to `count` particles. */
export function fillField(sdf: SDFData, count: number): Promise<{ shape: VoxelizeResult; radius: number }> {
  let found = bodies.get(count);
  if (!found) {
    found = ask({ kind: 'search', sdf, count });
    bodies.set(count, found);
  }
  return found;
}
