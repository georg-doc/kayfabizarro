// PondLand pond: rays straight down through the pond area, every hit (mesh, y, uv) — is there a basin under the water surface?
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&almanac=0&sky=0'); await p.waitForFunction(() => window.__kfb?.stage?.(), null, { timeout: 180000 });
const r = await p.evaluate(() => {
  const st = window.__kfb.stageOwner(), g = st.group, k = st.scale, out = [];
  const rc = new (window.__kfb.three().Raycaster)();
  for (const [ux, uz] of [[6, -0.6], [4, 2], [8, -3], [2, -4], [9, 1]]) { const o = new (window.__kfb.three().Vector3)(ux * k, 200, uz * k); rc.set(o, new (window.__kfb.three().Vector3)(0, -1, 0));
    const hits = rc.intersectObject(g, true).slice(0, 5).map((h) => ({ mesh: h.object.name, y: +h.point.y.toFixed(2), uv: h.uv ? [+h.uv.x.toFixed(3), +h.uv.y.toFixed(3)] : null, face: h.faceIndex })); out.push({ at: [ux, uz], hits }); }
  return out; });
console.log(JSON.stringify(r, null, 0)); await b.close();
