#!/usr/bin/env node
// Bake the offline scan into src/modules/demo/presets.ts: BEST (seed → crossing of the scorer's best village) for
// every scanned seed, FIXED (full spawn constants) for the seeds given with --fixed (plan_<seed>.json from dump.mjs).
//   node src/modules/demo/tools/presets.mjs --scan tools/out/demo/scan_r2.jsonl --fixed 34,1337 --plans tools/out/demo/r2
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const a = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, arr) => (v.startsWith('--') ? [...acc, [v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : acc), []));
const rows = fs.readFileSync(path.resolve(ROOT, a.scan ?? 'tools/out/demo/scan_r2.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const best = {};
for (const r of rows) if (r.best && r.village?.id === r.best.id) best[r.seed] = [r.best.centre.q, r.best.centre.r];
const fixed = {};
for (const s of String(a.fixed ?? '').split(',').filter(Boolean)) {
  const p = JSON.parse(fs.readFileSync(path.resolve(ROOT, a.plans ?? 'tools/out/demo/r2', `plan_${s}.json`), 'utf8'));
  fixed[s] = { id: p.village.id, centre: [p.village.centre.q, p.village.centre.r], spawn: p.spawn.world, heading: +p.spawn.heading.toFixed(4) };
}
const keys = Object.keys(best).map(Number).sort((x, y) => x - y);
const src = `// Precomputed by the OFFLINE scorer (src/modules/demo/tools/scan.mjs → ${a.scan ?? 'tools/out/demo/scan_r2.jsonl'}, ${rows.length} seeds).
// Regenerate with src/modules/demo/tools/presets.mjs when terrain / roads / villages / nature change the world.
import type { V3 } from './graph';

/** Seeds with a fully precomputed spawn (no world lookup at boot). */
export const FIXED: Record<number, { id: string; centre: [number, number]; spawn: V3; heading: number }> = {
${Object.entries(fixed).map(([s, f]) => `  ${s}: ${JSON.stringify(f)},`).join('\n')}
};

/** Scorer's best spawn village (crossing cell) per scanned seed. */
export const BEST: Record<number, [number, number]> = {
${keys.map((k) => `${k}: [${best[k].join(', ')}]`).reduce((lines, e) => { const l = lines[lines.length - 1]; if (l && l.length + e.length < 112) lines[lines.length - 1] = l + ', ' + e; else lines.push('  ' + e); return lines; }, []).join(',\n')},
};
`;
fs.writeFileSync(path.resolve(ROOT, 'src/modules/demo/presets.ts'), src);
console.log(`BEST ${keys.length} seeds, FIXED ${Object.keys(fixed).join(',')}`);
