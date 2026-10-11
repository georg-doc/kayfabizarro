// B2 · every catalogue figure as the player on PondLand: swap via the travel core (__kfb.setFigure), short run (W), front +
// 3/4 stills near the game camera, the figure table (rig, variants, eyes + source, clips, unmapped roles, measured run speed),
// and the picker overlay (real click on FIGUR). node tools/b2/figures-probe.mjs <outDir> [id,id…]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2], only = process.argv[3]?.split(','); fs.mkdirSync(out + '/shots', { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); const logs = [], external = new Set();
p.on('pageerror', (e) => logs.push('pageerror ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' || (m.type() === 'warning' && /figure-b2|eye/i.test(m.text()))) logs.push(m.type() + ' ' + m.text().slice(0, 300)); });
p.on('response', (r) => { if (r.status() >= 400) logs.push('http ' + r.status() + ' ' + r.url().slice(0, 160)); });
p.on('request', (r) => { const u = new URL(r.url()); if (!/^(127\.0\.0\.1|localhost)$/.test(u.hostname) && /^https?:$/.test(u.protocol)) external.add(u.hostname + u.pathname.slice(0, 50)); });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&dynres=0&almanac=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.figure?.(), null, { timeout: 180000 }); await p.waitForTimeout(2500);
const pickerOnly = only?.[0] === 'picker';
const cat = pickerOnly ? [] : (await p.evaluate(() => fetch('/assets/figures-b2/catalog.json').then((r) => r.json()))).figures.filter((e) => !only || only.includes(e.id));
const table = [];
const home = await p.evaluate(() => { const w = window.__kfb.travel().walk; const s = w.walker.state; return [s.position.x, s.position.z, s.heading]; });
for (const e of cat) {
  const t0 = Date.now(), n0 = logs.length;
  await p.evaluate((h) => { const w = window.__kfb.travel().walk; w.walker.reset(h[0], h[1], w.heightAt(h[0], h[1]), h[2]); }, home);
  const info = await p.evaluate((id) => window.__kfb.setFigure(id), e.id).catch((err) => ({ error: String(err) }));
  // short run forward and back to standing: the role clips play on this rig
  await p.evaluate(() => { window.__kfb.travel().keys.fwd = true; }); await p.waitForTimeout(700);
  const run = await p.evaluate(() => { const s = window.__kfb.travel().state(); return { gait: s.gait, clip: s.clip }; });
  await p.evaluate(() => { window.__kfb.travel().keys.fwd = false; }); await p.waitForTimeout(500);
  await p.evaluate((h) => { const w = window.__kfb.travel().walk; w.walker.reset(h[0], h[1], w.heightAt(h[0], h[1]), h[2]); }, home); await p.waitForTimeout(600);
  const fr = await p.evaluate(() => { const T = window.__kfb.three(), tr = window.__kfb.travel(), r = tr.walk.root, B = new T.Box3().setFromObject(r), s = B.getSize(new T.Vector3());
    return { p: r.position.toArray(), yaw: tr.state().yaw, h: s.y, top: B.max.y }; });
  const H = fr.h, [x, y, z] = fr.p, fx = Math.sin(fr.yaw), fz = Math.cos(fr.yaw), sx = Math.cos(fr.yaw), sz = -Math.sin(fr.yaw);
  const tgt = [x, y + H * 0.55, z], d = Math.max(2.2 * H, 7.5);
  const shots = [['front', [x + fx * d, y + H * 0.75, z + fz * d]], ['34', [x + (fx * 0.7 + sx * 0.7) * d, y + H * 0.85, z + (fz * 0.7 + sz * 0.7) * d]]];
  for (const [k, pos] of shots) { await p.evaluate(({ pos, tgt }) => window.__kfb.camOverride(pos, tgt), { pos, tgt }); await p.waitForTimeout(450); await p.screenshot({ path: `${out}/shots/${e.group}_${e.id}_${k}.jpg`, type: 'jpeg', quality: 82 }); }
  await p.evaluate(() => window.__kfb.camOverride(null));
  table.push({ id: e.id, group: e.group, rig: e.rig, variants: e.variants.length, bindTexture: !!e.bindTexture, heightH: +(H / 3.64).toFixed(2), info, run, ms: Date.now() - t0, logs: logs.slice(n0) });
  console.log(e.id, info?.eyes?.status ?? info?.eyes?.mode, run.clip, (H / 3.64).toFixed(2), logs.length - n0);
}
// picker overlay: real click on FIGUR, group B (dx/dy) tab, select DemonLord
if (!only || pickerOnly) {
  await p.evaluate(() => window.__kfb.setFigure('farmer_a'));
  await p.locator('button[title="Figur wählen (C)"]').click(); await p.waitForTimeout(6000);
  await p.screenshot({ path: `${out}/picker_A.jpg`, type: 'jpeg', quality: 88 });
  await p.locator('[data-kfb-figures] button', { hasText: 'B · VORLÄUFIG' }).click(); await p.waitForTimeout(5000);
  await p.locator('[data-kfb-figures] button[data-fig="demonlord"]').click(); await p.waitForTimeout(4000);
  await p.screenshot({ path: `${out}/picker_B_demonlord.jpg`, type: 'jpeg', quality: 88 });
  await p.locator('[data-kfb-figures] button', { hasText: 'D · ORIGINAL-AUGEN' }).click(); await p.waitForTimeout(16000);
  await p.screenshot({ path: `${out}/picker_D.jpg`, type: 'jpeg', quality: 88 });
}
const errors = await p.evaluate(() => window.__kfb.errors);
if (!pickerOnly) fs.writeFileSync(`${out}/figures-probe.json`, JSON.stringify({ n: table.length, table, errors, logs, external: [...external] }, null, 1));
console.log('done', table.length, 'logs', logs.length, 'external', [...external]);
await b.close();
