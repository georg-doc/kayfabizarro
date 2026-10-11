// C1b+C3 diagnosis: barrier visibility / skin / slots per piece of the O1 ring (from the running page)
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0'); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(() => { const td = window.__kfb.organ().td, S = td.samples, J = td.joints, out = [];
  J.forEach((j, k) => { const e = (J[k + 1]?.index ?? S.length) - 1, q = S[(j.index + e) >> 1]; out.push({ piece: j.piece, s: Math.round(S[j.index].s), skin: q.skin, visL: q.prm.barrierVisL, visR: q.prm.barrierVisR, H: +q.slots[10][1].toFixed(2), D: +q.slots[13][1].toFixed(2), road: +(q.slots[7][0] - q.slots[6][0]).toFixed(1), deck: q.prm.deckDepth }); });
  return out; })));
await b.close();
