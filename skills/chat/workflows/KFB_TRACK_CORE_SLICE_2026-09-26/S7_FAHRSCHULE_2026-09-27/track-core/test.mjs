// node test.mjs  -> runs the positive fixture and the edge-case (negative) fixtures; exits 1 on any unexpected result
import fs from 'node:fs';
import { compileRecipe, runChecks, SLOTS, compileGraph, runGraphChecks, PHYS, SKINS, BAR_TAPER } from './track-core.mjs';
import { recipe as td03Recipe } from './layout/td03.mjs';
import { recipe as td04Recipe, K3, balcony as td04Balcony } from './layout/td04.mjs';
import { recipe as td05Recipe, TWIST } from './layout/td05.mjs';
import { END_TAPER, compileGraph as cg6, runGraphChecks as rgc6 } from './track-core.mjs';
import { graph as fs01Graph } from './layout/fs01.mjs';
const rec = JSON.parse(fs.readFileSync(new URL('./fixtures/td_showcase_seed.recipe.json', import.meta.url)));
let failures = 0; const log = [];
const expect = (name, cond, info = '') => { log.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${info ? '  · ' + info : ''}`); if (!cond) failures++; };

// 1 · positive fixture: every check green
const A = compileRecipe(rec), B = compileRecipe(rec);
const ck = runChecks(A);
for (const r of ck.results) expect(`seed · ${r.id}`, r.pass, `${r.value}${r.note ? ' · ' + r.note : ''}`);
expect('seed · deterministic fingerprint', A.fingerprint === B.fingerprint, A.fingerprint);
expect('seed · slot count constant', A.samples.every((q) => q.slots.length === SLOTS.length), `${SLOTS.length} slots`);
const loopS = A.samples.filter((q) => q.law === 'loop');
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


// 1b · jump chain in the seed: kicker -> designed air -> landing
{ const airS = A.samples.filter((q) => q.tags.includes('air'));
  expect('seed · air span has no driving surface', airS.length > 10 && airS.every((q) => q.prm.surface === 0), `${airS.length} samples`);
  const v = airS[0]?.designSpeed ?? 0;
  expect('seed · jump reachable without boost (≤ 27 m/s)', v > 0 && v <= PHYS.vMax, `${v.toFixed(2)} m/s`);
  const li = A.samples.findIndex((q) => q.tags.includes('landing')); const a = A.samples[li - 1], b = A.samples[li];
  const ang = Math.acos(Math.min(1, a.T[0] * b.T[0] + a.T[1] * b.T[1] + a.T[2] * b.T[2])) * 180 / Math.PI;
  expect('seed · touchdown is tangent to the landing (≤ 1°)', ang < 1, `${ang.toFixed(3)}°`); }
{ const r = variant((x) => { const k = x.pieces.find((p) => p.id === 'air'); k.gap = 40; });
  const j = r.results.find((q) => q.id === 'jump_speed');
  expect('edge · 40 m gap needs boost (warning, not a failure)', j && !j.pass && j.severity === 'warn' && r.pass, `${j?.value} m/s`); }

// 4 · route graph: split by halving, lifted branch, connector, merge
const gsrc = JSON.parse(fs.readFileSync(new URL('./fixtures/split_merge_seed.graph.json', import.meta.url)));
const G = compileGraph(gsrc), gck = runGraphChecks(G);
for (const [rid, rc] of Object.entries(gck.routes)) for (const r of rc.results) if (!r.pass && r.severity !== 'warn') expect(`graph ${rid} · ${r.id}`, false, `${r.value} ${r.note ?? ''}`);
for (const [rid, rc] of Object.entries(gck.routes)) expect(`graph ${rid} · all route checks`, rc.pass, `${rc.results.length} checks`);
for (const r of gck.results) expect(`graph · ${r.id}`, r.pass, `${r.value} · ${r.note}`);
{ const T = G.routes.T.samples, L = G.routes.L.samples;
  const pre = T.find((q) => q.tags.includes('SPLIT_HALF'));
  expect('graph · lanes are exactly half of HERO at the split', Math.abs(pre.prm.width - 10.8) < 1e-9 && Math.abs(L[0].prm.width - 10.8) < 1e-9, `${pre.prm.width} | ${L[0].prm.width}`);
  const after = T[T.length - 1];
  expect('graph · through road is HERO again after the merge', Math.abs(after.prm.width - 21.6) < 1e-9 && after.prm.offset === 0, `${after.prm.width}`);
  const top = Math.max(...L.map((q) => q.p[1]));
  expect('graph · branch lifts 13 m (10 + crest 3)', Math.abs(top - 13) < 0.05, top.toFixed(2)); }
{ const bad = structuredClone(gsrc); bad.routes[1].pieces[0].shift = 6; bad.routes[1].pieces[1].rise = 0; bad.routes[1].pieces[2].height = 0.5; bad.routes[1].pieces[3].rise = 0;
  const r = runGraphChecks(compileGraph(bad)); const c = r.results.find((q) => q.id.startsWith('cross_clearance'));
  expect('edge · branch veering into the through lane is caught', !c.pass, `${c.value} m`); }

// 5 · style layer: skins blend across the seam, staggered per role; magnet bars start as an arrow tip
{ expect('style · every sample carries a paint set', A.samples.every((q) => q.paint && q.paint.road && q.paint.barrier_cap), `${A.samples.length}`);
  const ci = A.samples.findIndex((q, i) => i > 0 && q.skin !== A.samples[i - 1].skin);
  const q = A.samples[ci], from = SKINS[A.samples[ci - 1].skin], to = SKINS[q.skin];
  const w = (role) => { const d = to[role].map((x, k) => x - from[role][k]); const m = d.reduce((a, b, k) => Math.abs(b) > Math.abs(d[a]) ? k : a, 0); return (q.paint[role][m] - from[role][m]) / (d[m] || 1); };
  expect('style · at the seam the barrier cap has already turned, the road has not (staggered)', w('barrier_cap') > 0.6 && w('road') < 0.2, `cap ${w('barrier_cap').toFixed(2)} · road ${w('road').toFixed(2)} at s ${q.s.toFixed(1)} (${A.samples[ci - 1].skin} → ${q.skin})`);
  const before = A.samples.find((x) => x.s > q.s - 8.5 && x.s < q.s - 7.5);
  const cb = before.paint.barrier_cap.some((v, k) => Math.abs(v - from.barrier_cap[k]) > 1e-3);
  expect('style · the colour change starts before the seam (spread over the joint)', cb, `cap already blending 8 m before the seam`);
  const bars = A.markings.filter((b) => b.at === 'bars').sort((a, b) => a.s0 - b.s0);
  const sp = bars.slice(0, BAR_TAPER + 2).map((b) => b.span);
  expect('style · magnet bars grow from a narrow tip over the first bars', sp.every((v, k) => k === 0 || v >= sp[k - 1]) && sp[0] < 0.3 * bars[BAR_TAPER + 1].spanFull && Math.abs(sp[BAR_TAPER + 1] - bars[BAR_TAPER + 1].spanFull) < 1e-3, sp.join(' → '));
  const tail = bars.slice(-3).map((b) => b.span);
  expect('style · and taper out at the end of the run', tail[2] < tail[0], tail.join(' → ')); }

// 6 · S3 showcase: Tokyo Drift at the Uni-Center (layout/td03.mjs), every core check green
{ const T3 = compileRecipe(td03Recipe()), c3 = runChecks(T3);
  for (const r of c3.results) expect(`td03 · ${r.id}`, r.pass, `${r.value}${r.note ? ' · ' + r.note : ''}`);
  const loop = T3.samples.filter((q) => q.law === 'loop');
  expect('td03 · roof loop is 26 m tall', Math.abs(Math.max(...loop.map((q) => q.p[1])) - loop[0].p[1] - 26) < 0.1, (Math.max(...loop.map((q) => q.p[1])) - loop[0].p[1]).toFixed(2));
  const hx = T3.samples.filter((q) => q.tags.includes('SPIRAL'));
  expect('td03 · helix climbs three floors of 5 m', Math.abs(hx[hx.length - 1].p[1] - hx[0].p[1] - 15.3) < 0.05, (hx[hx.length - 1].p[1] - hx[0].p[1]).toFixed(2));
  fs.writeFileSync(new URL('./out/td03.stream.json', import.meta.url), JSON.stringify(T3)); }

// 7 · S5 circuit: TD04 = TD03 + balcony climb round the yellow wing + finale jump + street return, closed
{ const T4 = compileRecipe(td04Recipe()), c4 = runChecks(T4), S = T4.samples;
  for (const r of c4.results) expect(`td04 · ${r.id}`, r.pass, `${r.value}${r.note ? ' · ' + r.note : ''}`);
  expect('td04 · is a closed circuit (closure check present)', c4.results.some((r) => r.id === 'closure' && r.pass));
  const bal = S.filter((q) => q.tags.includes('balcony'));
  const z0 = bal[0].p[1], z1 = bal[bal.length - 1].p[1];
  const KB = td04Balcony(z0);
  expect('td04 · balcony climbs as designed (two floors less the eased ends)', Math.abs(z1 - z0 - KB.rise) < 0.02 && KB.rise > 11 && KB.rise <= 12, `${z0.toFixed(2)} → ${z1.toFixed(2)} m (design ${KB.rise.toFixed(2)})`);
  // lap 2 sits exactly above lap 1 in plan, one floor higher (same pieces, one lap later)
  const lap1 = bal.filter((q) => q.tags.includes('balcony') && q.s < bal[0].s + 120 && q.s > bal[0].s + 60);
  const lapLen = S.find((q) => q.tags.includes('balcony') && q.s > bal[0].s + 1 && Math.hypot(q.p[0] - bal[0].p[0], q.p[2] - bal[0].p[2]) < 0.26 && q.s > bal[0].s + 100)?.s - bal[0].s;
  let dPlan = 0, dRise = [];
  for (const q of lap1) { const t = S.reduce((b, x) => (Math.abs(x.s - q.s - lapLen) < Math.abs(b.s - q.s - lapLen) ? x : b));
    dPlan = Math.max(dPlan, Math.hypot(t.p[0] - q.p[0], t.p[2] - q.p[2])); dRise.push(t.p[1] - q.p[1]); }
  expect('td04 · lap 2 stacks on lap 1 in plan (< 0.3 m), one floor up (6 m)', dPlan < 0.3 && dRise.every((d) => Math.abs(d - K3.lapRise) < 0.05), `plan ${dPlan.toFixed(3)} m · rise ${Math.min(...dRise).toFixed(2)}–${Math.max(...dRise).toFixed(2)} m · lap ${lapLen.toFixed(1)} m`);
  // one continuous climb: grade continuous over the piece joints (half ramps at the two outer ends only)
  let gj = 0; for (let i = 1; i < bal.length; i++) gj = Math.max(gj, Math.abs(bal[i].grade - bal[i - 1].grade));
  expect('td04 · balcony grade has no step at the piece joints', gj < 2e-3, `max grade step ${gj.toExponential(2)} · grade ${(100 * Math.max(...bal.map((q) => q.grade))).toFixed(2)} %`);
  fs.writeFileSync(new URL('./out/td04.stream.json', import.meta.url), JSON.stringify(T4)); }

// 8 · S6: TD05 twisted balcony (tilted, lifted corners; twisting straights; 9 m floors) + barriers thinning at open ends
{ const T5 = compileRecipe(td05Recipe()), c5 = runChecks(T5), S = T5.samples, D = 180 / Math.PI;
  for (const r of c5.results) expect(`td05 · ${r.id}`, r.pass, `${r.value}${r.note ? ' · ' + r.note : ''}`);
  const bal = S.filter((q) => q.tags.includes('balcony'));
  const bmax = Math.max(...bal.map((q) => q.bank)) * D, bmin = Math.min(...bal.map((q) => q.bank)) * D;
  expect('td05 · corners tilt both ways (banked into the turn and off-camber)', bmax > 12 && bmin < -3, `bank ${bmin.toFixed(1)}° … ${bmax.toFixed(1)}°`);
  // the laps are no longer parallel: height gap between lap 1 and lap 2 varies along the lap (bumps), mean = one floor
  const lap = 269.7, gaps = [];
  for (const q of bal.filter((x) => x.s < bal[0].s + lap - 5)) { const t = S.reduce((b, x) => (Math.abs(x.s - q.s - lap) < Math.abs(b.s - q.s - lap) ? x : b)); if (t.tags.includes('balcony')) gaps.push(t.p[1] - q.p[1]); }
  const gmin = Math.min(...gaps), gmax = Math.max(...gaps);
  expect('td05 · lap 2 is not a parallel copy of lap 1 (floor gap varies)', gmax - gmin > 1 && Math.abs(gaps.reduce((a, b) => a + b, 0) / gaps.length - TWIST.lapRise) < 0.6, `gap ${gmin.toFixed(2)} … ${gmax.toFixed(2)} m around ${TWIST.lapRise} m`);
  // barriers run out thin at the lip and grow back after touchdown, without a step
  const kick = S.filter((q) => q.tags.includes('kicker')), land = S.filter((q) => q.tags.includes('landing'));
  const lipQ = kick[kick.length - 1], tdQ = land[0], full = kick[0];
  let step = 0; for (const seg of [kick, land]) for (let i = 1; i < seg.length; i++) step = Math.max(step, Math.abs(seg[i].prm.barrierT - seg[i - 1].prm.barrierT), Math.abs(seg[i].prm.barrierVisL - seg[i - 1].prm.barrierVisL));
  expect('taper · barriers thin out to the lip and grow back after touchdown (no step)',
    Math.abs(lipQ.prm.barrierT - END_TAPER.t) < 1e-6 && Math.abs(lipQ.prm.barrierVisL - END_TAPER.vis) < 1e-6 && Math.abs(tdQ.prm.barrierT - END_TAPER.t) < 2e-3
      && full.prm.barrierT > 1 && land[land.length - 1].prm.barrierT > 1.5 && step < 0.12,
    `lip T ${lipQ.prm.barrierT} vis ${lipQ.prm.barrierVisL} · touchdown T ${tdQ.prm.barrierT} · full ${full.prm.barrierT.toFixed(2)} → ${land[land.length - 1].prm.barrierT.toFixed(2)} · max step ${step.toFixed(3)}`);
  fs.writeFileSync(new URL('./out/td05.stream.json', import.meta.url), JSON.stringify(T5)); }

// 9 · S7: FS01 Fahrschule (practice pad, Weiche, lifebuoy hops, assisted mini loop, magnet catch), closed
{ const G = cg6(fs01Graph()), C = rgc6(G), M = G.routes.M.samples, J = G.routes.J.samples;
  for (const [rid, r] of Object.entries(C.routes)) for (const c of r.results) expect(`fs01 · ${rid} · ${c.id}`, c.pass || c.severity === 'warn', `${c.value}${c.note ? ' · ' + c.note : ''}`);
  for (const c of C.results) expect(`fs01 · ${c.id}`, c.pass, `${c.value}${c.note ? ' · ' + c.note : ''}`);
  expect('fs01 · main route is a closed circuit', C.routes.M.results.some((r) => r.id === 'closure' && r.pass));
  const pad = G.pads[0], kinds = pad.stations.map((x) => x.type);
  expect('fs01 · practice pad with slalom, parking boxes, brake line', ['cones', 'parking_box', 'brake_line'].every((k) => kinds.includes(k)) && pad.outline.length > 20, kinds.join(', '));
  const modes = new Set(M.filter((q) => q.drive).map((q) => q.drive.mode)), fx = new Set(M.flatMap((q) => q.drive?.fx ?? []));
  expect('fs01 · every drive mode is taught (free, assist, locked; bounce, magnet catch)', ['free', 'assist', 'locked'].every((m) => modes.has(m)) && fx.has('bounce') && fx.has('magnet_catch'), `${[...modes].join('/')} · ${[...fx].join('/')}`);
  const wmax = Math.max(...M.filter((q) => q.tags.includes('switch')).map((q) => q.prm.width));
  const lane = M.find((q) => q.tags.includes('SPLIT_HALF') && q.tags.includes('switch'));
  expect('fs01 · Weiche widens to 28.8 and splits into two full 14.4 lanes', Math.abs(wmax - 28.8) < 1e-6 && Math.abs(lane.prm.width - 14.4) < 1e-6 && J.every((q) => q.prm.width >= 14.4 - 1e-6), `max ${wmax} · lane ${lane.prm.width}`);
  const buoys = M.filter((q) => q.skin === 'buoy');
  const road = Math.min(...buoys.map((q) => q.p[1])), under = Math.min(...buoys.map((q) => q.p[1] - q.prm.deckDepth));
  expect('fs01 · lifebuoys float: road stays dry (> 0.5 m over the water), underside dips into it', road > -1.2 + 0.5 && under < -1.2, `lowest road ${road.toFixed(2)} m · lowest underside ${under.toFixed(2)} m · water -1.2`);
  fs.writeFileSync(new URL('./out/fs01.graph.stream.json', import.meta.url), JSON.stringify(G)); }

// 3 · stream stats
const L = A.samples[A.samples.length - 1].s;
log.push(`\nseed stream: ${A.samples.length} samples · ${L.toFixed(1)} m · ${A.joints.length} pieces · ${A.markings.length} marking bands · fingerprint ${A.fingerprint}`);
fs.mkdirSync(new URL('./out/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('./out/td_showcase_seed.stream.json', import.meta.url), JSON.stringify(A));
fs.writeFileSync(new URL('./out/split_merge_seed.graph.stream.json', import.meta.url), JSON.stringify(G));
fs.writeFileSync(new URL('./out/test-report.txt', import.meta.url), log.join('\n') + `\n\n${failures} unexpected result(s)\n`);
console.log(log.join('\n')); console.log(`\n${failures} unexpected result(s)`);
process.exit(failures ? 1 : 0);
