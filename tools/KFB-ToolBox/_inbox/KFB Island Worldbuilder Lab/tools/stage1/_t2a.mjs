import { openLab } from './browser.mjs';
const { page, close } = await openLab('shot=1&hub=1&solo=rkit_hub');
await page.evaluate(() => new Promise((r) => setTimeout(r, 2000)));
console.log(JSON.stringify(await page.evaluate(() => {
  const isl = window.__kfb.app.islands.get('rkit_hub'), f = isl.field, rb = isl.roadSpec, out = [];
  for (const r of rb.roads) for (const S of r.sections) for (const [k, side] of [['L', S.L], ['R', S.R]]) {
    const p = side[side.length - 1]; if (f.sd(p[0], p[2]) <= 0) continue;
    const top6 = Math.max(...side.slice(4).map((q) => q[1])), b = top6 - f.height(p[0], p[2]);
    if (b < 0.06) { const q = f.roadQ(p[0], p[2]); out.push([r.id, S.s, k, +b.toFixed(3), S.bedTarget?.[k], top6, +f.height(p[0], p[2]).toFixed(3), q.d.toFixed(2), q.y.toFixed(3), q.hw.toFixed(2)]); }
  }
  return out.slice(0, 20);
})));
await close();
