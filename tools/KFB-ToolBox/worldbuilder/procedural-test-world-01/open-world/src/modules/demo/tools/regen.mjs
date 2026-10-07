#!/usr/bin/env node
// One-command regeneration after world changes (terrain / roads / villages / nature):
//   node src/modules/demo/tools/regen.mjs [--seeds 50,123,42,7,1337] [--scan] [--out tools/out/demo/regen]
// 1. (--scan) rescans seeds 1–150 + 1337 with the offline scorer → <out>/scan.jsonl (≈ 15–50 min)
// 2. dumps the live plan of every --seeds seed (dump.mjs) → <out>/plan_<seed>.json + scripts
// 3. bakes presets.ts (BEST from the newest scan, FIXED from the dumped plans)
// 4. copies the route scripts to src/modules/demo/scripts/route_<seed>_{demo,bridge,forest}_run.json
// Run with Chrome outside the shell sandbox. Then re-measure: see NOTES.md (shoot.mjs --script ...).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const T = path.join(ROOT, 'src/modules/demo/tools');
const a = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, arr) => (v.startsWith('--') ? [...acc, [v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : acc), []));
const seeds = String(a.seeds ?? '50,123,42,7,1337').split(',').map(Number);
const out = a.out ?? 'tools/out/demo/regen';
fs.mkdirSync(path.join(ROOT, out), { recursive: true });
const run = (args) => {
  const r = spawnSync(process.execPath, args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error(`failed: ${args.join(' ')}`);
  return r.stdout;
};
let scan = a.scanFile ?? null;
if (a.scan) {
  scan = `${out}/scan.jsonl`;
  const all = [...Array.from({ length: 150 }, (_, i) => i + 1), 1337].join(',');
  run([path.join(T, 'scan.mjs'), '--seeds', all, '--batch', '10', '--out', scan, '--maxMs', '7200000']);
}
if (!scan) {
  // newest existing scan
  const c = ['tools/out/demo/regen/scan.jsonl', 'tools/out/demo/scan_int2.jsonl', 'tools/out/demo/scan_r2.jsonl'].filter((f) => fs.existsSync(path.join(ROOT, f)));
  c.sort((x, y) => fs.statSync(path.join(ROOT, y)).mtimeMs - fs.statSync(path.join(ROOT, x)).mtimeMs);
  scan = c[0];
}
// BEST only first (FIXED emptied), so the dumps choose villages from the fresh scan, not from a stale FIXED table
run([path.join(T, 'presets.mjs'), '--scan', scan]);
for (const s of seeds) {
  for (const f of fs.readdirSync(path.join(ROOT, out))) if (f.startsWith(`plan_${s}.`) || f.startsWith(`script_${s}_`)) fs.unlinkSync(path.join(ROOT, out, f));
  const o = JSON.parse(run([path.join(T, 'dump.mjs'), '--seed', String(s), '--out', out]));
  console.log(`seed ${s}: ${o.village} spawn ${JSON.stringify(o.spawn.world)} heading ${(o.spawn.heading * 180 / Math.PI).toFixed(1)}° road bridge ${o.distances.road.toBridge} m forest ${o.distances.road.toForest} m`);
}
console.log(run([path.join(T, 'presets.mjs'), '--scan', scan, '--fixed', seeds.join(','), '--plans', out]).trim());
for (const s of seeds)
  for (const g of ['demo_run', 'bridge_run', 'forest_run']) {
    const src = path.join(ROOT, out, `script_${s}_${g}.json`);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(ROOT, 'src/modules/demo/scripts', `route_${s}_${g}.json`));
  }
console.log('scripts copied → src/modules/demo/scripts/');
