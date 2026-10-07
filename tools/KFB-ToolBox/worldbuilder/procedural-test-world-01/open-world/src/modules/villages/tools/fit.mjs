// Debug placement geometry offline: node src/modules/villages/tools/fit.mjs
import { createServer } from 'vite';
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
const f = await server.ssrLoadModule('/src/modules/villages/fit.ts');
const cat = await server.ssrLoadModule('/src/modules/villages/catalog.ts');
for (const [dA, dB] of [[0, 1], [0, 2]]) {
  const uA = f.faceVec(dA), uB = f.faceVec(dB);
  let best = null;
  for (let sA = -3; sA <= 4; sA += 0.25) for (let lat = -2; lat <= 6; lat += 0.25) for (const margin of [0.3, 0]) {
    let px = -uA.z, pz = uA.x; if (px * (uA.x - uB.x) + pz * (uA.z - uB.z) < 0) { px = -px; pz = -pz; }
    let qx = -uB.z, qz = uB.x; if (qx * (uB.x - uA.x) + qz * (uB.z - uA.z) < 0) { qx = -qx; qz = -qz; }
    const a = { x: uA.x * sA + px * lat, z: uA.z * sA + pz * lat }, b = { x: uB.x * sA + qx * lat, z: uB.z * sA + qz * lat };
    const rA = cat.rotForDoor('home_A', dA), rB = cat.rotForDoor('home_A', dB);
    if (!f.insideHex(f.corners('home_A', rA, a.x, a.z), margin) || !f.insideHex(f.corners('home_A', rB, b.x, b.z), margin)) continue;
    if (f.overlaps(f.corners('home_A', rA, a.x, a.z, 0.2), f.corners('home_A', rB, b.x, b.z, 0.2))) continue;
    if (!best || sA > best.sA) best = { sA, lat, margin };
  }
  console.log(dA, dB, JSON.stringify(best));
}
await server.close();
