// V-157 gait values of the Medium rig (Farmer A), measured in the real game: profile set (measureClip on the rig: stride, stance speed,
// playback rate) + walker parameters + real jumps with keys (standing / jog / sprint): take-off → landing distance and apex rise, per frame
// from inside the game loop. Output in lab units and H (1 H = 3.64 lab). node tools/track/gait-probe.mjs <out.json> [query]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, q = ''] = process.argv.slice(2), H = 3.64;
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1200, height: 750 } }), errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://127.0.0.1:5192/?play=game&almanac=0&dynres=0&sound=0' + q); await p.waitForFunction(() => window.__kfb?.travel?.(), null, { timeout: 180000 });
await p.waitForTimeout(2500); await p.mouse.click(600, 375);
const R = { at: new Date().toISOString(), H, unit: 'lab', errs };
R.rig = await p.evaluate(() => { const W = window.__kfb.travel().walk, P = W.walker.params, pr = W.profiles?.profiles ?? {};
  const prof = Object.fromEntries(Object.entries(pr).map(([k, v]) => [k, v && v.clip ? { clip: v.clip, worldSpeed: v.worldSpeed, playbackRate: v.playbackRate, measured: v.measured ? Object.fromEntries(Object.entries(v.measured).filter(([, x]) => typeof x === 'number' || typeof x === 'string')) : null, dur: W.clipMap.get(v.clip)?.duration } : null]));
  return { actor: W.profiles?.actor, rigFamily: W.profiles?.rigFamily, params: Object.fromEntries(Object.entries(P).filter(([, x]) => typeof x === 'number')), profiles: prof }; });
const start = await p.evaluate(() => { const w = window.__kfb.travel().walk.walker.state; return { x: w.position.x, z: w.position.z, h: w.heading }; });
const home = () => p.evaluate((s) => { const W = window.__kfb.travel().walk; W.walker.reset(s.x, s.z, W.heightAt(s.x, s.z), s.h); }, start);
// per-frame log inside the loop
const logOn = () => p.evaluate(() => { const L = (window.__gl = []); window.__gu = window.__kfb.onFrame((dt) => { const t = window.__kfb.travel(), w = t.walk.walker.state, s = t.state(); L.push({ dt, x: w.position.x, y: w.position.y, z: w.position.z, g: w.onGround, sp: w.speed, clip: s.clip, rate: s.rate, gy: t.walk.heightAt(w.position.x, w.position.z) }); }); });
const logOff = () => p.evaluate(() => { window.__gu(); return window.__gl; });
const gait = async (name, keys, sec = 2.2) => { await home(); await p.waitForTimeout(500); await logOn(); for (const k of keys) await p.keyboard.down(k); await p.waitForTimeout(sec * 1000); for (const k of [...keys].reverse()) await p.keyboard.up(k); const L = await logOff(); await p.waitForTimeout(700);
  const tail = L.slice(Math.floor(L.length * 0.45)).filter((f) => f.g); let d = 0, t = 0; for (let i = 1; i < tail.length; i++) { d += Math.hypot(tail[i].x - tail[i - 1].x, tail[i].z - tail[i - 1].z); t += tail[i].dt; }
  const clip = tail.at(-1)?.clip; return { name, clip, rate: tail.at(-1)?.rate, speedLab: +(d / t).toFixed(3), speedH: +(d / t / H).toFixed(3), frames: L.length }; };
const jump = async (name, keys, lead) => { await home(); await p.waitForTimeout(500); await logOn(); for (const k of keys) await p.keyboard.down(k); await p.waitForTimeout(lead);
  const iSp = await p.evaluate(() => window.__gl.length); await p.keyboard.down('Space'); await p.waitForTimeout(50); await p.keyboard.up('Space'); await p.waitForTimeout(1800); for (const k of [...keys].reverse()) await p.keyboard.up(k); const L = await logOff(); await p.waitForTimeout(700);
  // take-off = the first air phase after the Space press that lasts ≥ 0.2 s (small terrain bumps before it are not the jump)
  let i0 = -1, i1 = -1; for (let i = Math.max(1, iSp); i < L.length; i++) { if (!(L[i - 1].g && !L[i].g)) continue; let j = i, t = 0; while (j < L.length && !L[j].g) t += L[j++].dt; if (t >= 0.2 && j < L.length) { i0 = i; i1 = j; break; } }
  if (i0 < 0) return { name, error: 'no jump ≥ 0.2 s after Space', frames: L.length };
  const A = L[i0 - 1], B = L[i1]; let top = -1e9, tFl = 0; for (let i = i0; i <= i1; i++) { top = Math.max(top, L[i].y); tFl += L[i].dt; }
  return { name, clip: L[i0 + 2]?.clip, gapLab: +Math.hypot(B.x - A.x, B.z - A.z).toFixed(3), riseLab: +(top - A.y).toFixed(3), landDy: +(B.y - A.y).toFixed(3), flightS: +tFl.toFixed(3), speedLab: +A.sp.toFixed(3), airSpeedLab: +(Math.hypot(B.x - A.x, B.z - A.z) / tFl).toFixed(3), fps: +(1 / (L.slice(i0, i1).reduce((a, f) => a + f.dt, 0) / Math.max(1, i1 - i0))).toFixed(1) }; };
R.gaits = [await gait('walk', ['ControlLeft', 'KeyW']), await gait('jog', ['KeyW']), await gait('sprint', ['ShiftLeft', 'KeyW'])];
R.jumps = [];
for (let r = 0; r < 2; r++) R.jumps.push(await jump('stand', [], 0), await jump('jog', ['KeyW'], 1100), await jump('sprint', ['ShiftLeft', 'KeyW'], 1300));
fs.writeFileSync(out, JSON.stringify(R, null, 1)); console.log(JSON.stringify({ gaits: R.gaits, jumps: R.jumps }));
await b.close();
