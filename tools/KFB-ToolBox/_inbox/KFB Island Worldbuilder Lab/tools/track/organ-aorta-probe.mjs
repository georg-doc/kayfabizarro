// V-116 diagnosis: ray from the probe camera through screen points onto the Herz light body (SN), field values around the hit (field coords, cells).
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1000, height: 700 } });
await p.goto(`http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&organTier=light&mesher=sn`); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2000);
const r = await p.evaluate(() => { const O = window.__kfb.organ(), T = window.__kfb.three(), B = O.W.built.find((x) => x.id === 'herz'), c = B.I.Cw.clone().multiplyScalar(1.46), a = new T.Vector3(-1832, 158, 1445), dir = a.clone().sub(c).normalize();
  const cam = new T.PerspectiveCamera(38, 1000 / 700, 0.5, 9000); cam.position.copy(a.clone().addScaledVector(dir, 450).add(new T.Vector3(0, 112.5, 0))); cam.lookAt(a); cam.updateMatrixWorld(true);
  const Tr = B.tiers.light, ms = []; Tr.g.traverse((x) => { if (x.isMesh) ms.push(x); }); const body = ms[0], G = Tr.TT.GT, h = G.h, out = [];
  for (const [px, py] of [[281, 416], [260, 300], [300, 500], [250, 600]]) { const rc = new T.Raycaster(); rc.setFromCamera(new T.Vector2(px / 500 - 1, -py / 350 + 1), cam); const hit = rc.intersectObject(body, false)[0]; if (!hit) { out.push({ px, py, hit: null }); continue; }
    const inv = body.matrixWorld.clone().invert(), L = hit.point.clone().applyMatrix4(inv), dl = rc.ray.direction.clone().transformDirection(inv).normalize(), line = [];
    for (let k = -4; k <= 12; k++) { const q = L.clone().addScaledVector(dl, k * h * 0.5); line.push(+(O.debugField.samp(G, q.x, q.y, q.z) / h).toFixed(2)); }
    const gi = [(L.x - G.o[0]) / h, (L.y - G.o[1]) / h, (L.z - G.o[2]) / h].map((x) => +x.toFixed(1));
    out.push({ px, py, world: hit.point.toArray().map((x) => +x.toFixed(1)), grid: gi, dims: [G.nx, G.ny, G.nz], h, fieldAlongRay_cells_step_half: line }); }
  return out; });
console.log(JSON.stringify(r, null, 1)); await b.close();
