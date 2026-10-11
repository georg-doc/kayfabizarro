// Stufe 2 · Laufen: scripted walk from the game camera (stills) + measurements: speed per gait vs profile, foot slip
// (horizontal speed of a planted foot), edge stop. node tools/stage2/walk-probe.mjs <outDir> [island]
import fs from 'node:fs';
import path from 'node:path';
import { openLab } from '../stage1/browser.mjs';
const [outDir, island = 'protopia'] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const { page, errors, close } = await openLab(`world=mvp1&shot=1&bg=b0c6d8&play=walk&island=${island}`);
await page.waitForFunction(() => window.__kfb?.play?.(), null, { timeout: 120000 });
await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)));
// in-page sampler: every frame, foot positions + gait
await page.evaluate(() => {
  const pl = window.__kfb.play(), THREE = pl.root.children[0].constructor;
  const feet = ['footl', 'footr'].map((n) => pl.root.getObjectByName(n));
  const prev = feet.map(() => null), log = (window.__walkLog = []);
  const tick = (t0) => (t) => {
    const s = pl.state(), now = performance.now(), dt = log.length ? Math.max(1e-3, (now - log[log.length - 1].t) / 1000) : 1 / 60;
    const fw = feet.map((b) => { const v = b.getWorldPosition(new b.position.constructor()); return v; });
    const rootY = pl.root.position.y;
    const slip = fw.map((v, i) => { const p = prev[i]; prev[i] = v.clone(); if (!p) return null; return { h: Math.hypot(v.x - p.x, v.z - p.z) / dt, y: v.y - rootY }; });
    log.push({ t: now, gait: s.gait, speed: s.speed, blocked: s.blocked, slip, pos: s.pos });
    requestAnimationFrame(tick(t0));
  };
  requestAnimationFrame(tick(performance.now()));
});
const keys = async (k, sec, shot) => {
  await page.evaluate((k) => { const pl = window.__kfb.play(); for (const key of Object.keys(pl.keys)) pl.keys[key] = false; Object.assign(pl.keys, k); }, k);
  const t0 = Date.now(); await page.evaluate((ms) => new Promise((r) => setTimeout(r, ms)), sec * 1000 - 300);
  if (shot) await page.screenshot({ path: path.join(outDir, shot + '.jpg'), type: 'jpeg', quality: 88 });
  return Date.now() - t0;
};
const marks = [];
const seg = async (name, k, sec) => { const a = await page.evaluate(() => window.__walkLog.length); await keys(k, sec, name); const b = await page.evaluate(() => window.__walkLog.length); marks.push([name, a, b]); };
await seg('01_idle', {}, 1.5);
await seg('02_walk', { fwd: true }, 4);
await seg('03_run', { fwd: true, run: true }, 3);
await seg('04_turn_walk', { fwd: true, left: true }, 3);
await seg('05_run_to_edge', { fwd: true, run: true }, 26);
await seg('06_jump', { jump: true }, 1.2);
const res = await page.evaluate((marks) => {
  const L = window.__walkLog, pl = window.__kfb.play(), prof = pl.profiles.profiles;
  const med = (a) => { const s = a.filter((x) => x != null).sort((x, y) => x - y); return s.length ? +s[Math.floor(s.length / 2)].toFixed(3) : null; };
  return marks.map(([name, a, b]) => {
    const seg = L.slice(a + 20, b), gaits = [...new Set(seg.map((x) => x.gait))];
    // planted foot: the lower foot of the two in this frame (its height over the root within 0.03 H of the segment minimum)
    // planted: this foot within 0.01 H of its own lowest height in this frame AND the previous one (lift-off / touch-down excluded)
    const planted = [];
    for (const f of [0, 1]) { const ys = seg.map((x) => x.slip[f]?.y).filter((v) => v != null), yMin = Math.min(...ys), on = (x) => x.slip[f] && x.slip[f].y <= yMin + 0.01 * 3.64;
      for (let i = 1; i < seg.length; i++) if (on(seg[i]) && on(seg[i - 1])) planted.push(seg[i].slip[f].h); }
    const sp = med(seg.map((x) => x.speed));
    return { seg: name, gaits, speedMedian: sp, speedH: sp != null ? +(sp / 3.64).toFixed(3) : null, profile: gaits.map((g) => [g, prof[g]?.worldSpeed]), plantedFootSpeedMedian: med(planted), blockedShare: +(seg.filter((x) => x.blocked).length / Math.max(1, seg.length)).toFixed(2), end: seg[seg.length - 1]?.pos };
  });
}, marks);
const st = await page.evaluate(() => window.__kfb.play().state());
fs.writeFileSync(path.join(outDir, 'walk-probe.json'), JSON.stringify({ island, state: st, segments: res }, null, 1));
console.log(JSON.stringify({ state: st, segments: res }, null, 1));
console.log('errors', errors.filter((e) => !e.includes('404')).slice(0, 5));
await close();
