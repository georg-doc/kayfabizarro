import { openLab } from './browser.mjs';
import { camsInPage } from './cams.mjs';
const [id, x0, y0, y1] = process.argv.slice(2).map((v, i) => (i ? Number(v) : v));
const { page, close } = await openLab('world=mvp1&shot=1&bg=b0c6d8');
const cams = await page.evaluate(`(${camsInPage.toString()})(${JSON.stringify(id)})`);
const r = await page.evaluate(async ({ c, id, x0, y0, y1 }) => {
  const THREE = await import('/node_modules/.vite/deps/three.js');
  const isl = window.__kfb.app.islands.get(id), g = isl.group; g.updateMatrixWorld(true);
  const C = new THREE.PerspectiveCamera(c.fov ?? 38, 1.6, 0.1, 3000); C.position.fromArray(c.pos); C.lookAt(new THREE.Vector3().fromArray(c.look)); C.updateMatrixWorld();
  const rc = new THREE.Raycaster(), out = [], NA = isl.r2d.terrain.NA, inv = g.matrixWorld.clone().invert();
  for (let y = y0; y <= y1; y += 4) {
    rc.setFromCamera(new THREE.Vector2(x0 / 800 - 1, 1 - y / 500), C);
    const h = rc.intersectObjects(g.children, true).filter((h) => h.object.visible && h.object.isMesh)[0];
    if (!h) { out.push([y, null]); continue; }
    const p = h.point.clone().applyMatrix4(inv), n = h.face.normal.clone().transformDirection(h.object.matrixWorld);
    const row = h.object.name === 'ground' ? Math.floor(h.face.a / NA) + '/' + Math.floor(h.face.c / NA) : '';
    out.push([y, h.object.name, row, p.toArray().map((v) => +v.toFixed(2)), n.toArray().map((v) => +v.toFixed(2))]);
  }
  return out;
}, { c: cams[process.env.CAM ?? "N2_kante_unten"], id, x0, y0, y1 });
for (const l of r) console.log(JSON.stringify(l));
await close();
