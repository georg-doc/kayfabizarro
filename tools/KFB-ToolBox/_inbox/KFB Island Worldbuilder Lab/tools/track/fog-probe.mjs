// fog state in the organ world over a short day-night span: scene.fog type / colour / near / far / density, background, sky horizon
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(2000);
const R = await p.evaluate(() => { const O = window.__kfb.organ(); let sc = O.W.world; while (sc.parent) sc = sc.parent; const f = sc.fog;
  return { fog: f ? { type: f.type ?? (f.isFogExp2 ? 'FogExp2' : 'Fog'), color: f.color.getHexString(), near: f.near, far: f.far, density: f.density } : null, bg: sc.background?.isColor ? sc.background.getHexString() : typeof sc.background, sky: Object.keys(window.__kfb.sky?.() ?? {}).slice(0, 30), camFar: null }; });
console.log(JSON.stringify(R)); await b.close();
