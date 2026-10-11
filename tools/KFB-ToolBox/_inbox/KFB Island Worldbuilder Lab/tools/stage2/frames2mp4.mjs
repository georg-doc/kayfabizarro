// screencast frames (frames/frames.json: [{name, t}] in seconds) → mp4 (H.264) at their original timing, no ffmpeg:
// Chrome draws each JPEG onto a canvas at its time and MediaRecorder writes mp4/avc1. Optional sound track: an audio file that
// starts with the first frame (e.g. the game's master mix from __kfb.audioOwner().recordStart/Stop).
// node tools/stage2/frames2mp4.mjs <framesDir> <out.mp4> [audioFile]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [dir, out, audioFile] = process.argv.slice(2);
const list = JSON.parse(fs.readFileSync(`${dir}/frames.json`, 'utf8'));
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.route('http://conv.local/f/*', (r) => r.fulfill({ body: fs.readFileSync(`${dir}/${r.request().url().split('/').pop()}`), contentType: 'image/jpeg' }));
if (audioFile) await page.route('http://conv.local/a', (r) => r.fulfill({ body: fs.readFileSync(audioFile), contentType: audioFile.endsWith('.webm') ? 'audio/webm' : 'audio/mp4' }));
await page.route('http://conv.local/', (r) => r.fulfill({ body: '<!doctype html><body></body>', contentType: 'text/html' }));
await page.goto('http://conv.local/');
const b64 = await page.evaluate(async ({ list, withAudio }) => {
  const load = (n) => fetch('/f/' + n).then((r) => r.blob()).then(createImageBitmap);
  const first = await load(list[0].name);
  const c = document.createElement('canvas'); c.width = first.width; c.height = first.height; const g = c.getContext('2d');
  const stream = c.captureStream(0), track = stream.getVideoTracks()[0];
  let snd = null; if (withAudio) { snd = new Audio('/a'); await new Promise((r) => (snd.oncanplaythrough = r)); stream.addTrack(snd.captureStream().getAudioTracks()[0]); }
  const mime = (withAudio ? ['video/mp4;codecs=avc1.640028,mp4a.40.2', 'video/mp4;codecs=avc1,opus', 'video/mp4'] : ['video/mp4;codecs=avc1.640028', 'video/mp4;codecs=avc1', 'video/mp4']).find((m) => MediaRecorder.isTypeSupported(m));
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8e6 }), parts = [];
  rec.ondataavailable = (e) => e.data.size && parts.push(e.data);
  g.drawImage(first, 0, 0); rec.start(500); track.requestFrame(); if (snd) await snd.play();
  const t0 = performance.now(), base = list[0].t; let next = load(list[1]?.name ?? list[0].name);
  for (let i = 1; i < list.length; i++) {
    const bmp = await next; if (i + 1 < list.length) next = load(list[i + 1].name);
    const due = t0 + (list[i].t - base) * 1000, wait = due - performance.now(); if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    g.drawImage(bmp, 0, 0); bmp.close(); track.requestFrame();
  }
  await new Promise((r) => setTimeout(r, 400)); track.requestFrame();
  rec.stop(); await new Promise((r) => (rec.onstop = r));
  const buf = new Uint8Array(await new Blob(parts, { type: 'video/mp4' }).arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000)); return btoa(s);
}, { list, withAudio: !!audioFile });
fs.writeFileSync(out, Buffer.from(b64, 'base64')); await browser.close();
console.log('mp4', out, fs.statSync(out).size, 'frames', list.length, 'seconds', (list[list.length - 1].t - list[0].t).toFixed(1));
