// node test.mjs  -> runs the positive fixture and the edge-case (negative) fixtures; exits 1 on any unexpected result
import fs from 'node:fs';
import { compileRecipe, runChecks, SLOTS } from './track-core.mjs';
const rec = JSON.parse(fs.readFileSync(new URL('./fixtures/td_showcase_seed.recipe.json', import.meta.url)));
let failures = 0; const log = [];
const expect = (name, cond, info = '') => { log.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${info ? '  · ' + info : ''}`); if (!cond) failures++; };

// 1 · positive fixture: every check green
const A = compileRecipe(rec), B = compileRecipe(rec);
const ck = runChecks(A);
for (const r of ck.results) expect(`seed · ${r.id}`, r.pass, `${r.value}${r.note ? ' · ' + r.note : ''}`);
expect('seed · deterministic fingerprint', A.fingerprint === B.fingerprint, A.fingerprint);
expect('seed · slot count constant', A.samples.every((q) => q.slots.length === SLOTS.length), `${SLOTS.length} slots`);
const loopS = A.samples.filter((q) => q.law === 'rmf');
const top = Math.max(...loopS.map((q) => q.p[1])) - loopS[0].p[1];
expect('seed · loop apex height ≈ 18 m', Math.abs(top - 18) < 0.2, top.toFixed(2));
const after = A.samples[A.samples.indexOf(loopS[loopS.length - 1]) + 1];
expect('seed · road up after loop = world up', after.U[1] > 0.9999, after.U.map((v) => v.toFixed(4)).join(','));
const apex = loopS.reduce((a, b) => (b.p[1] > a.p[1] ? b : a));
expect('seed · upside down at apex (U.y < -0.99)', apex.U[1] < -0.99, apex.U[1].toFixed(4));
const hp = A.samples.filter((q) => q.tags.includes('HAIRPIN_180'));
expect('seed · hairpin runs at WIDE 18', hp.every((q) => Math.abs(q.prm.width - 18) < 1e-9), `${hp.length} samples`);
const tap = A.samples.filter((q) => q.tags.includes('WIDTH_STEP') && q.prm.barrierVisL < 1 && q.prm.barrierVisL > 0);
expect('seed · barrier taper is a blend, not a step', tap.length > 10, `${tap.length} blended samples`);
expect('seed · markings are bands, no mesh cuts', A.markings.length > 0 && A.markings.every((b) => b.s1 > b.s0), `${A.markings.length} bands`);

// 2 · edge cases: each broken fixture must be caught by exactly the check that owns it
const variant = (patch) => { const r = structuredClone(rec); patch(r); return runChecks(compileRecipe(r)); };
const failed = (res, id) => res.results.find((r) => r.id === id);
{ const r = variant((x) => { x.pieces.find((p) => p.id === 'hairpin').radius = 10; });
  expect('edge · too-tight WIDE hairpin folds the inner edge', !failed(r, 'inner_edge_fold').pass, failed(r, 'inner_edge_fold').note); }
{ const r = variant((x) => { x.pieces.find((p) => p.id === 'loop').drift = 0; });
  expect('edge · loop without lateral drift hits itself', !failed(r, 'self_clearance').pass, failed(r, 'self_clearance').note + ' · ' + failed(r, 'self_clearance').value + ' m'); }
{ const r = variant((x) => { x.pieces.find((p) => p.id === 'spiral').rise = 3; });
  expect('edge · spiral with 3 m rise has no headroom', !failed(r, 'self_clearance').pass, failed(r, 'self_clearance').value + ' m'); }
{ const r = variant((x) => { x.pieces.find((p) => p.id === 'c1').ease = 0.01; });
  expect('edge · corner without clothoid ease = curvature jump', !failed(r, 'curvature_step').pass, String(failed(r, 'curvature_step').value)); }
{ const r = variant((x) => { x.pieces.find((p) => p.id === 'taper').params.barrierVisL.ease = 'step'; x.pieces.find((p) => p.id === 'taper').params.barrierVisL.zone = [0.5, 0.5]; });
  const c = compileRecipe((() => { const q = structuredClone(rec); const t = q.pieces.find((p) => p.id === 'taper'); t.params.barrierVisL = { to: 0, ease: 'step', zone: [0.5, 0.5] }; return q; })());
  const i = c.samples.findIndex((q, k) => k > 0 && c.samples[k - 1].prm.barrierVisL === 1 && q.prm.barrierVisL === 0);
  expect('edge · hard barrier step is visible in the stream (review flag)', i > 0, `step at s ${c.samples[i]?.s.toFixed(1)}`); }

// 3 · stream stats
const L = A.samples[A.samples.length - 1].s;
log.push(`\nseed stream: ${A.samples.length} samples · ${L.toFixed(1)} m · ${A.joints.length} pieces · ${A.markings.length} marking bands · fingerprint ${A.fingerprint}`);
fs.mkdirSync(new URL('./out/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('./out/td_showcase_seed.stream.json', import.meta.url), JSON.stringify(A));
fs.writeFileSync(new URL('./out/test-report.txt', import.meta.url), log.join('\n') + `\n\n${failures} unexpected result(s)\n`);
console.log(log.join('\n')); console.log(`\n${failures} unexpected result(s)`);
process.exit(failures ? 1 : 0);
