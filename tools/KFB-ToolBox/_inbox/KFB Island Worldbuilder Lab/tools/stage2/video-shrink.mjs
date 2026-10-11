// Smaller copy of a recorded video (same take, lower bitrate) for phone viewers: played in the browser, re-recorded with
// MediaRecorder. node tools/stage2/video-shrink.mjs <in.mp4> <out.mp4> [Mbit/s]
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [inp, outp, mbit = '8'] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await (await browser.newContext({ viewport: { width: 1600, height: 1000 } })).newPage();
const fd = fs.openSync(outp, 'w'); let bytes = 0;
await page.exposeFunction('__chunk', (b64) => { const b = Buffer.from(b64, 'base64'); fs.writeSync(fd, b); bytes += b.length; });
await page.setContent('<html><body style="margin:0"></body></html>');
const res = await page.evaluate(async ({ b64, bps }) => {
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)), v = document.createElement('video');
  v.src = URL.createObjectURL(new Blob([bin], { type: 'video/mp4' })); v.muted = true; document.body.appendChild(v);
  await new Promise((r) => (v.onloadeddata = r));
  const st = v.captureStream(), mime = ['video/mp4;codecs=avc1.640028', 'video/mp4'].find((t) => MediaRecorder.isTypeSupported(t));
  const rec = new MediaRecorder(st, { mimeType: mime, videoBitsPerSecond: bps }); let chain = Promise.resolve();
  rec.ondataavailable = (e) => { if (!e.data.size) return; chain = chain.then(() => new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(window.__chunk(String(fr.result).split(',')[1])); fr.readAsDataURL(e.data); })); };
  const done = new Promise((r) => (rec.onstop = () => chain.then(r)));
  rec.start(1000); await v.play(); await new Promise((r) => (v.onended = r)); rec.stop(); await done;
  return { mime, dur: v.duration };
}, { b64: fs.readFileSync(inp).toString('base64'), bps: Number(mbit) * 1e6 });
fs.closeSync(fd);
console.log(JSON.stringify({ ...res, bytes, MiB: +(bytes / 1048576).toFixed(1) }));
await browser.close();
