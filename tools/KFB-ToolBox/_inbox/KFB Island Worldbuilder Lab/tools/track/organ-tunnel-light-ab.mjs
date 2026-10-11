// tunnel interior light A/B: as is / scene.environment off / hemisphere ×2 / TC1 meshes receive no fog. node tools/track/organ-tunnel-light-ab.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1000, height: 640 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&organTier=hero'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2500);
await p.evaluate(() => { for (const id of ['panel', 'showPanel', 'toast']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } const O = window.__kfb.organ(), T = window.__kfb.three(), td = O.td, t = td.tunnels[1], q = td.samples[Math.round((t.i0 + t.i1) / 2)], V = (a) => new T.Vector3(...a);
  const P = V(q.p), cam = P.clone().addScaledVector(V(q.U), 3).addScaledVector(V(q.T), -6), look = P.clone().addScaledVector(V(q.U), 3).addScaledVector(V(q.T), 30); window.__kfb.camOverride(cam.multiplyScalar(1.46).toArray(), look.multiplyScalar(1.46).toArray());
  let sc = O.W.world; while (sc.parent) sc = sc.parent; window.__sc = sc; const L = []; sc.traverse((o) => { if (o.isLight) L.push(o.type + ':' + (o.color?.getHexString()) + ':' + (o.groundColor?.getHexString() ?? '') + ':' + o.intensity.toFixed(2) + ':' + o.visible); }); window.__lights = L; });
await p.waitForTimeout(1500); await p.screenshot({ path: `${out}/ab_0_asis.jpg`, type: 'jpeg', quality: 88 });
console.log(await p.evaluate(() => JSON.stringify({ lights: window.__lights, env: !!window.__sc.environment, envI: window.__sc.environmentIntensity, fog: window.__sc.fog && window.__sc.fog.color.getHexString() })));
await p.evaluate(() => { window.__envSave = window.__sc.environment; window.__sc.environment = null; }); await p.waitForTimeout(800); await p.screenshot({ path: `${out}/ab_1_noenv.jpg`, type: 'jpeg', quality: 88 });
await p.evaluate(() => { window.__sc.environment = window.__envSave; window.__sc.fog = null; }); await p.waitForTimeout(800); await p.screenshot({ path: `${out}/ab_2_nofog.jpg`, type: 'jpeg', quality: 88 });
await b.close();
