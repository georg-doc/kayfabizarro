// node _ray.mjs <camsjson> <camName> x,y x,y …  → what mesh is under each screen pixel (1600×1000)
import fs from 'node:fs';
import { openLab } from './browser.mjs';
const [file, name, ...pts] = process.argv.slice(2);
const s = JSON.parse(fs.readFileSync(file, 'utf8')), c = s.cams[name];
const { page, close } = await openLab(`shot=1&hub=1&solo=${s.islandId}&bg=b0c6d8`);
await page.evaluate(() => new Promise((r) => setTimeout(r, 2000)));
const r = await page.evaluate(async ({ id, c, pts }) => {
  const THREE = await import('/node_modules/.vite/deps/three.js');
  const isl = window.__kfb.app.islands.get(id), P = isl.spec.pos, g = isl.group; g.updateMatrixWorld(true);
  const hf = 2 * Math.atan(36 / (2 * c.lens)), fov = (2 * Math.atan(Math.tan(hf / 2) / 1.6) * 180) / Math.PI;
  const C = new THREE.PerspectiveCamera(fov, 1.6, 0.1, 3000); C.position.set(c.pos[0] + P[0], c.pos[1] + P[1], c.pos[2] + P[2]); C.lookAt(c.target[0] + P[0], c.target[1] + P[1], c.target[2] + P[2]); C.updateMatrixWorld();
  const rc = new THREE.Raycaster(), inv = g.matrixWorld.clone().invert();
  return pts.map((q) => { const [x, y] = q.split(',').map(Number); rc.setFromCamera(new THREE.Vector2(x / 800 - 1, 1 - y / 500), C);
    const hs = rc.intersectObjects(g.children, true).filter((h) => h.object.visible && h.object.isMesh).slice(0, 3);
    return [q, hs.map((h) => { let n = h.object, p = []; while (n && n !== g) { p.push(n.name); n = n.parent; } return { m: p.join('<'), p: h.point.clone().applyMatrix4(inv).toArray().map((v) => +v.toFixed(2)), n: h.face.normal.clone().transformDirection(h.object.matrixWorld).toArray().map((v) => +v.toFixed(2)) }; })]; });
}, { id: s.islandId, c, pts });
for (const l of r) console.log(JSON.stringify(l));
await close();
