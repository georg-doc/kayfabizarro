// contact sheet of a video (any Chrome-playable format): N frames evenly spread by playback, 2 columns.
// node tools/stage2/video-sheet.mjs <video> <out.jpg> [n=6] [durationS]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [inp, out, nArg, dArg] = process.argv.slice(2), N = Number(nArg ?? 6);   // dArg: known duration in s (fragmented mp4)
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.route('http://conv.local/v', (r) => r.fulfill({ body: fs.readFileSync(inp), contentType: inp.endsWith('.mp4') ? 'video/mp4' : 'video/webm' }));
await page.route(/^http:\/\/conv\.local\/(\?.*)?$/, (r) => r.fulfill({ body: '<!doctype html><body></body>', contentType: 'text/html' }));
await page.goto('http://conv.local/' + (dArg ? '?d=' + dArg : ''));
const b64 = await page.evaluate(async (N) => {
  const v = document.createElement('video'); v.src = '/v'; v.muted = true; document.body.append(v);
  await new Promise((r) => (v.onloadeddata = r));
  // play through (fragmented mp4 / Playwright webm do not seek reliably); sample N frames by playback time
  const D = Number(new URLSearchParams(location.search).get('d')) || v.duration;
  const W = 640, H = Math.round(W * v.videoHeight / v.videoWidth), cols = 2, rows = Math.ceil(N / cols);
  const c = document.createElement('canvas'); c.width = W * cols; c.height = H * rows; const g = c.getContext('2d'); g.font = '20px sans-serif';
  let i = 0; await v.play();
  await new Promise((done) => { const f = () => { const t = (D * (i + 0.5)) / N; if (v.currentTime >= t) { const x = (i % cols) * W, y = Math.floor(i / cols) * H; g.drawImage(v, x, y, W, H); g.fillStyle = '#000a'; g.fillRect(x, y, 70, 28); g.fillStyle = '#fff'; g.fillText(v.currentTime.toFixed(1) + 's', x + 6, y + 21); i++; }
    if (i >= N || v.ended) done(); else v.requestVideoFrameCallback(f); }; v.requestVideoFrameCallback(f); });
  return c.toDataURL('image/jpeg', 0.88).split(',')[1];
}, N);
fs.writeFileSync(out, Buffer.from(b64, 'base64')); await browser.close(); console.log('sheet', out);
