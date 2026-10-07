#!/usr/bin/env node
// Real-input A1 measurement for seeds whose plans/scripts were dumped (regen.mjs / dump.mjs), one shoot at a time.
//   node src/modules/demo/tools/a1.mjs --seeds 50,123 [--dir tools/out/demo/regen] [--legs bridge_run,forest_run,bridge_jog,forest_jog]
// Per seed: shoot.mjs with script_<seed>_<leg>.json (spawn shot = <seed>_bridge_run__start.jpg), then times.mjs.
// Prints one JSON line per leg and a summary table row per seed (A1: run bridge ≤ 25 s, run forest ≤ 18 s).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const a = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, arr) => (v.startsWith('--') ? [...acc, [v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : acc), []));
const seeds = String(a.seeds ?? '50').split(',').map(Number);
const dir = a.dir ?? 'tools/out/demo/regen';
const legs = String(a.legs ?? 'bridge_run,forest_run,bridge_jog,forest_jog').split(',');
const node = process.execPath;
for (const s of seeds) {
  const plan = JSON.parse(fs.readFileSync(path.join(ROOT, dir, `plan_${s}.json`), 'utf8'));
  const res = {};
  for (const leg of legs) {
    const script = path.join(dir, `script_${s}_${leg}.json`);
    if (!fs.existsSync(path.join(ROOT, script))) { res[leg] = null; continue; }
    const name = `a1_${s}_${leg}`;
    spawnSync(node, ['tools/shoot.mjs', '--url', `/?seed=${s}&hint=0`, '--name', name, '--out', dir, '--script', script, '--timeout', '300000', '--maxMs', '900000'], { cwd: ROOT, stdio: 'ignore' });
    const t = spawnSync(node, ['src/modules/demo/tools/times.mjs', path.join(dir, `${name}.json`)], { cwd: ROOT, encoding: 'utf8' }).stdout.trim();
    console.log(t);
    try { res[leg] = JSON.parse(t); } catch { res[leg] = null; }
  }
  const r = plan.distances_m?.road ?? {};
  const sec = (l) => (res[l]?.arrived === 'met' ? res[l].seconds : null);
  const ok = sec('bridge_run') !== null && sec('bridge_run') <= 25 && sec('forest_run') !== null && sec('forest_run') <= 18;
  console.log(`| ${s} | ${plan.village?.id} | ${r.toBridge} m | ${sec('bridge_run')} s | ${sec('bridge_jog')} s | ${r.toForest} m | ${sec('forest_run')} s | ${sec('forest_jog')} s | ${ok ? 'A1 ✓' : 'A1 ✗'} |`);
}
