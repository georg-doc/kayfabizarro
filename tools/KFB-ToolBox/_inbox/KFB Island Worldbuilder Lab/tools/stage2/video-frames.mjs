// Frames from a recorded probe video (checking it before it goes out): a contact sheet every `step` s + full frames at given times.
// node tools/stage2/video-frames.mjs <video.mp4> <outDir> [step] [t1,t2,…]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
const [file, outDir, step = '1', at = ''] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true });
const page = await (await browser.newContext({ viewport: { width: 1600, height: 1000 } })).newPage();
const b64 = fs.readFileSync(file).toString('base64');
await page.setContent('<html><body style="margin:0;background:#000"></body></html>');
const res = await page.evaluate(async ({ b64, step, at }) => {
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)), url = URL.createObjectURL(new Blob([bin], { type: 'video/mp4' }));
  const v = document.createElement('video'); v.src = url; v.muted = true; document.body.appendChild(v);
  await new Promise((r, j) => { v.onloadeddata = r; v.onerror = () => j(new Error('video error ' + v.error?.code)); });
  const seek = (t) => new Promise((r) => { v.onseeked = r; v.currentTime = t; });
  const W = v.videoWidth, H = v.videoHeight, dur = v.duration, cols = 5, tw = 320, th = Math.round((tw * H) / W);
  const times = []; for (let t = 0.2; t < dur; t += step) times.push(t);
  const sheet = document.createElement('canvas'); sheet.width = cols * tw; sheet.height = Math.ceil(times.length / cols) * (th + 18); const g = sheet.getContext('2d'); g.fillStyle = '#111'; g.fillRect(0, 0, sheet.width, sheet.height);
  for (let i = 0; i < times.length; i++) { await seek(times[i]); const x = (i % cols) * tw, y = Math.floor(i / cols) * (th + 18); g.drawImage(v, x, y, tw, th); g.fillStyle = '#fff'; g.font = '14px sans-serif'; g.fillText(times[i].toFixed(1) + ' s', x + 4, y + th + 14); }
  const full = []; const c = document.createElement('canvas'); c.width = W; c.height = H;
  for (const t of at ? at.split(',').map(Number) : []) { await seek(Math.min(dur - 0.05, t)); c.getContext('2d').drawImage(v, 0, 0); full.push([t, c.toDataURL('image/jpeg', 0.9)]); }
  return { W, H, dur, sheet: sheet.toDataURL('image/jpeg', 0.9), full };
}, { b64, step: Number(step), at });
fs.writeFileSync(path.join(outDir, 'sheet.jpg'), Buffer.from(res.sheet.split(',')[1], 'base64'));
for (const [t, d] of res.full) fs.writeFileSync(path.join(outDir, 'f_' + String(t).replace('.', '_') + '.jpg'), Buffer.from(d.split(',')[1], 'base64'));
console.log(JSON.stringify({ W: res.W, H: res.H, dur: res.dur, full: res.full.length }));
await browser.close();
