// camera jitter diagnosis: standing still (no input) vs slow LMB orbit; frame dt distribution, per-frame camera step, pivot, arm.
import { chromium } from 'playwright-core';
const [extra] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto(process.env.URL ?? ('http://127.0.0.1:5192/?play=game&sound=0&almanac=0&dynres=0' + (extra ? '&' + extra : '')));
await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.playCam?.(), null, { timeout: 180000 }); await p.waitForTimeout(3000);
const rec = (ms) => p.evaluate((ms) => new Promise((res) => { const L = []; const t0 = performance.now(); const f = (t) => { const r = window.__kfb.travel().walk.root.position; L.push({ t, c: window.__kfb.camPos(), r: [r.x, r.y, r.z], o: window.__kfb.playCam().state.orbit.yawOff, a: window.__kfb.playCam().state.arm }); if (t - t0 < ms) requestAnimationFrame(f); else res(L); }; requestAnimationFrame(f); }), ms);
const an = (L, tag) => { const dts = [], st = [], j = [], rj = []; for (let i = 2; i < L.length; i++) { dts.push(L[i].t - L[i - 1].t); st.push(Math.hypot(...[0, 1, 2].map((k) => L[i].c[k] - L[i - 1].c[k]))); j.push(Math.hypot(...[0, 1, 2].map((k) => L[i].c[k] - 2 * L[i - 1].c[k] + L[i - 2].c[k]))); rj.push(Math.hypot(...[0, 1, 2].map((k) => L[i].r[k] - 2 * L[i - 1].r[k] + L[i - 2].r[k]))); }
  const q = (a, k) => { const s = [...a].sort((x, y) => x - y); return +s[Math.floor(k * (s.length - 1))].toFixed(4); };
  console.log(tag, JSON.stringify({ n: L.length, dt: [q(dts, 0.05), q(dts, 0.5), q(dts, 0.95)], step: [q(st, 0.5), q(st, 0.95)], jit: [q(j, 0.5), q(j, 0.95), q(j, 1)], rootJit: [q(rj, 0.5), q(rj, 0.95)], liftMax: Math.max(...L.map((x) => x.a.groundLift)), hits: L.filter((x) => x.a.hit != null).length })); };
an(await rec(3000), 'still');
const orb = p.evaluate(async () => {}); await p.mouse.move(800, 500); await p.mouse.down({ button: 'left' });
const P = rec(5000); await p.evaluate(() => new Promise((res) => { let k = 0; const t0 = performance.now(); const f = (t) => { k++; dispatchEvent(new PointerEvent('pointermove', { clientX: 800 + Math.cos(k * 0.02) * 160, clientY: 500 + Math.sin(k * 0.014) * 60, buttons: 1, bubbles: true })); if (t - t0 < 5000) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }));
await p.mouse.up({ button: 'left' }); an(await P, 'orbit');
await b.close();
