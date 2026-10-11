// almanac debug: canvas sizes + a pixel sample per fan card, and the quarter results. node tools/stage2/almanac-debug.mjs
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
p.on('console', (m) => { if (/card-art|pdf/i.test(m.text())) console.log('console', m.type(), m.text().slice(0, 200)); });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&dynres=0');
await p.waitForFunction(() => window.__kfb?.almanac?.()?.drawn >= 5, null, { timeout: 180000 });
await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(async () => {
  const out = [...document.querySelectorAll('[data-almanac-card]')].map((e) => { const c = e.querySelector('canvas'), x = c.getContext('2d'); const d = x.getImageData(c.width / 2 | 0, c.height / 2 | 0, 1, 1).data; return { n: e.dataset.almanacCard, w: c.width, h: c.height, mid: [...d], z: e.style.zIndex, op: e.style.opacity }; });
  const q = await window.OW_ART.quarter({ packId: 'forget_utopia', n: 12 }, 700);
  return { out, q12: q ? { w: q.canvas.width, h: q.canvas.height, page: q.page, quad: q.quad, px: [...q.canvas.getContext('2d').getImageData(q.canvas.width / 2 | 0, q.canvas.height / 2 | 0, 1, 1).data] } : null, stats: window.OW_ART.stats };
})));
await b.close();
