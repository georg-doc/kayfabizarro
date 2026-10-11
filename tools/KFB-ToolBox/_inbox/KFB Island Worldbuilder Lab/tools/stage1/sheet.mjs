// Contact sheet + per-pair pixel statistics in headless Chrome (no Python imaging on this machine).
// node tools/stage1/sheet.mjs out.jpg cols "label|a.jpg|b.jpg|c.jpg" ...   (each row: label + images; diff a↔b reported)
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [out, cols, ...rows] = process.argv.slice(2);
const R = rows.map((r) => { const [label, ...imgs] = r.split('|'); return { label, imgs: imgs.map((p) => p ? 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64') : null), names: imgs }; });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
const res = await page.evaluate(async ({ R, cols }) => {
  const W = 640, H = 400, C = Number(cols), cv = document.createElement('canvas'); cv.width = W * C; cv.height = (H + 24) * R.length;
  const x = cv.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, cv.width, cv.height);
  const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  const stats = [];
  for (let ri = 0; ri < R.length; ri++) {
    const px = [];
    for (let ci = 0; ci < R[ri].imgs.length; ci++) {
      if (!R[ri].imgs[ci]) continue;
      const im = await load(R[ri].imgs[ci]); x.drawImage(im, ci * W, ri * (H + 24) + 24, W, H);
      x.fillStyle = '#000'; x.font = '14px sans-serif'; x.fillText(R[ri].label + ' · ' + R[ri].names[ci].split('/').slice(-2).join('/'), ci * W + 6, ri * (H + 24) + 17);
      const c2 = document.createElement('canvas'); c2.width = im.width; c2.height = im.height; const g = c2.getContext('2d'); g.drawImage(im, 0, 0); px.push(g.getImageData(0, 0, im.width, im.height).data);
    }
    if (px.length >= 2) { let d = 0, ma = [0, 0, 0], mb = [0, 0, 0]; const n = px[0].length / 4; for (let i = 0; i < px[0].length; i += 4) for (let k = 0; k < 3; k++) { d += Math.abs(px[0][i + k] - px[1][i + k]); ma[k] += px[0][i + k]; mb[k] += px[1][i + k]; }
      stats.push({ row: R[ri].label, meanAbsDiff: +(d / n / 3).toFixed(2), meanA: ma.map((v) => +(v / n).toFixed(1)), meanB: mb.map((v) => +(v / n).toFixed(1)) }); }
  }
  return { url: cv.toDataURL('image/jpeg', 0.86), stats };
}, { R, cols });
fs.writeFileSync(out, Buffer.from(res.url.split(',')[1], 'base64'));
console.log(JSON.stringify(res.stats));
await browser.close();
