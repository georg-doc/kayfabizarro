import { openLab } from './browser.mjs';
const [id, px, pz] = process.argv.slice(2);
const { page, close } = await openLab('world=mvp1&shot=1&bg=b0c6d8');
const r = await page.evaluate(async ({ id, px, pz }) => {
  const THREE = await import('/node_modules/.vite/deps/three.js');
  const isl = window.__kfb.app.islands.get(id), T = isl.r2d.terrain, c0 = isl.field.plan.c0, NA = T.NA, P = T.geo.attributes.position;
  const th = Math.atan2(pz - c0[1], px - c0[0]), a = Math.floor(((th / (2 * Math.PI)) % 1 + 1) % 1 * NA) % NA;
  const rowsOut = []; for (let row = T.rollRow - 16; row <= T.diveRow; row++) { const i = row * NA + a; rowsOut.push([row, +P.getX(i).toFixed(2), +P.getY(i).toFixed(2), +P.getZ(i).toFixed(2)]); }
  const body = isl.group.getObjectByName('under'), rc = new THREE.Raycaster(), o = new THREE.Vector3(P.getX(T.rollRow * NA + a), P.getY(T.rollRow * NA + a), P.getZ(T.rollRow * NA + a)).applyMatrix4(isl.group.matrixWorld);
  const nx = T.rimN[a * 2], nz = T.rimN[a * 2 + 1], tests = [];
  for (const [kx, ky] of [[0.6, -1], [1, -0.3], [1, 0], [0.3, -1], [1, 0.3]]) { rc.set(o, new THREE.Vector3(-nx * kx, ky, -nz * kx).normalize()); rc.far = 10; body.material.side = THREE.DoubleSide; const h = rc.intersectObject(body, false)[0]; tests.push([kx, ky, h ? +h.distance.toFixed(2) : null]); }
  return { a, rimN: [nx, nz], rows: rowsOut, tests };
}, { id, px: +px, pz: +pz });
console.log(JSON.stringify(r));
await close();
