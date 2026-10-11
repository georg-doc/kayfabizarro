// what is hit at screen pixels in the delivery 'drive_straight' camera (same framing as delivery-stills.mjs): object path, material, distance
import { chromium } from 'playwright-core';
const pts = JSON.parse(process.argv[2] ?? '[[1065,355],[1040,340],[1080,370]]');
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2000);
const R = await p.evaluate((pts) => { const O = window.__kfb.organ(), T = window.__kfb.three(), td = O.td, S = td.samples, N = S.length, tun = td.tunnels, inT = (i) => tun.some((t) => i >= t.i0 - 60 && i <= t.i1 + 60);
  let bs = 1e9, bestS = 0; for (let i = 200; i < N - 200; i += 10) { if (inT(i)) continue; const a = S[i - 20].T, c = S[i + 20].T, U = S[i].U; if (U[1] < 0.97 || Math.abs(a[1]) > 0.08 || Math.abs(c[1]) > 0.08) continue; const k = Math.abs(Math.atan2(a[0] * c[2] - a[2] * c[0], a[0] * c[0] + a[2] * c[2])); if (k < bs && Math.hypot(S[i].p[0] * 1.46 - O.hubCentre.x, S[i].p[2] * 1.46 - O.hubCentre.z) > 600) { bs = k; bestS = i; } }
  const q = S[bestS], V = (a) => new T.Vector3(...a), P = V(q.p), cam = P.clone().addScaledVector(V(q.T), -9).addScaledVector(V(q.U), 3.4), look = P.clone().addScaledVector(V(q.T), 18).addScaledVector(V(q.U), 1.5);
  const c = new T.PerspectiveCamera(38, 1.6, 0.5, 9000); c.position.copy(cam.multiplyScalar(1.46)); c.lookAt(look.multiplyScalar(1.46)); c.updateMatrixWorld(true);
  let sc = O.W.world; while (sc.parent) sc = sc.parent; const rc = new T.Raycaster();
  return pts.map(([x, y]) => { rc.setFromCamera(new T.Vector2(x / 800 - 1, -y / 500 + 1), c); const h = rc.intersectObjects(sc.children, true).filter((h) => h.object.visible !== false && h.object.isMesh)[0]; if (!h) return { x, y, hit: null };
    const path = []; for (let o = h.object; o && path.length < 6; o = o.parent) path.unshift(o.name || o.type); const m = Array.isArray(h.object.material) ? h.object.material[0] : h.object.material;
    return { x, y, d: +h.distance.toFixed(1), path: path.join('/'), mat: m?.type, matName: m?.name, color: m?.color?.getHexString?.(), transparent: m?.transparent, vc: !!h.object.geometry.attributes.color }; }); }, pts);
console.log(JSON.stringify(R, null, 1)); await b.close();
