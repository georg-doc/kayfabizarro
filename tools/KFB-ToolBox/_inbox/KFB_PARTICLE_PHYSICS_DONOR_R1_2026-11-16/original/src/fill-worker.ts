// Fills shapes with particles off the page's thread: at thousands of particles a fill takes long enough to be seen.
import { voxelize, type VoxelizeOptions } from '../vendor/threejs-particle-fluids/src/softbody/voxelize.ts';
import type { SDFData, TriangleMesh } from 'threejs-particle-fluids';

type Job =
  | { id: number; kind: 'fill'; shape: TriangleMesh | SDFData; options: VoxelizeOptions }
  /** Finds the particle radius that fills a distance field with close to `count` particles. */
  | { id: number; kind: 'search'; sdf: SDFData; count: number };

self.onmessage = (event: MessageEvent<Job>) => {
  const job = event.data;
  if (job.kind === 'fill') {
    self.postMessage({ id: job.id, shape: voxelize(job.shape, job.options) });
    return;
  }
  // Keeps the largest connected piece. A slight dilation keeps thin parts such as ears on. Lattice counts fall as the spacing grows, so it bisects.
  const fill = (radius: number) => voxelize(job.sdf, { particleRadius: radius, largestPiece: true, dilation: 0.4 * radius });
  let low = 0.0015, high = 0.05;
  for (let step = 0; step < 24; step++) {
    const mid = (low + high) / 2;
    if (fill(mid).count > job.count) low = mid;
    else high = mid;
  }
  self.postMessage({ id: job.id, shape: fill(low), radius: low });
};
