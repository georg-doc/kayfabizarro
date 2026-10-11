// V-115 A/B cost at the near camera, alternating on/off 4 × 2 s per suspect (robust against background load). Visible window 1600×1000.
// node tools/track/ab-cost.mjs [query]
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: false, args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--window-size=1600,1000'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&' + (process.argv[2] ?? '')); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(4000);
const R = await p.evaluate(async () => { const k = window.__kfb, O = k.organ(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)); let sc = O.W.world; while (sc.parent) sc = sc.parent;
  const med = async () => { const L = []; let l = performance.now(); const off = k.onFrame(() => { const n = performance.now(); L.push(n - l); l = n; }); await sleep(2000); off(); L.sort((a, b) => a - b); return L[L.length >> 1]; };
  const pts = [], dirs = []; sc.traverse((o) => { if (o.isPointLight && o.visible) pts.push(o); if (o.isDirectionalLight && o.castShadow) dirs.push(o); });
  const hud = document.getElementById('hud'), sf = sc.getObjectByName('starfield');
  const S = { world: [() => (O.W.world.visible = false), () => (O.W.world.visible = true)], points: [() => pts.forEach((l) => (l.visible = false)), () => pts.forEach((l) => (l.visible = true))],
    shadow: [() => dirs.forEach((l) => (l.castShadow = false)), () => dirs.forEach((l) => (l.castShadow = true))], hud: [() => hud && (hud.style.display = 'none'), () => hud && (hud.style.display = '')],
    starfield: [() => sf && (sf.visible = false), () => sf && (sf.visible = true)],
    pr075: [() => { k.renderer().setPixelRatio(0.75); k.renderer().setSize(innerWidth, innerHeight); }, () => { k.renderer().setPixelRatio(1); k.renderer().setSize(innerWidth, innerHeight); }],
    pr085: [() => { k.renderer().setPixelRatio(0.85); k.renderer().setSize(innerWidth, innerHeight); }, () => { k.renderer().setPixelRatio(1); k.renderer().setSize(innerWidth, innerHeight); }] };
  const only = (new URLSearchParams(location.search)).get('ab'); if (only) for (const n of Object.keys(S)) if (!only.split(',').includes(n)) delete S[n];
  const out = { starfieldVisible: sf?.visible ?? null };
  for (const [name, [off, on]] of Object.entries(S)) { const a = [], c = []; for (let r = 0; r < 4; r++) { on(); await sleep(200); a.push(await med()); off(); await sleep(200); c.push(await med()); } on();
    const m = (x) => +(x.reduce((s, v) => s + v, 0) / x.length).toFixed(1); out[name] = { on: m(a), off: m(c), saves: +(m(a) - m(c)).toFixed(1) }; }
  return out; });
console.log(JSON.stringify(R)); await b.close();
