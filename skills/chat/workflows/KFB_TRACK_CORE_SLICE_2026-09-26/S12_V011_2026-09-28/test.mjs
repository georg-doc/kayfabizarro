// node test.mjs  -> runs the positive fixture and the edge-case (negative) fixtures; exits 1 on any unexpected result
import fs from 'node:fs';
import { compileRecipe, runChecks, SLOTS, compileGraph, runGraphChecks, PHYS, SKINS, BAR_TAPER } from './track-core.mjs';
import { recipe as td03Recipe } from './layout/td03.mjs';
import { recipe as td04Recipe, K3, balcony as td04Balcony } from './layout/td04.mjs';
import { recipe as td05Recipe, TWIST } from './layout/td05.mjs';
import { END_TAPER, compileGraph as cg6, runGraphChecks as rgc6 } from './track-core.mjs';
import { graph as fs01Graph } from './layout/fs01.mjs';
import { graph as tn01Graph, TN } from './layout/tn01.mjs';
import { graph as tn02Graph } from './layout/tn02.mjs';
import { compileRecipe as cr7, runChecks as rc7, attachRings, TUNNEL_N, VEHICLE_ENVELOPE, VEHICLE_HEADROOM, TUNNEL_DEFAULTS, tunnelSpec, tunnelSection, profileSlots, PROFILE_DEFAULTS, WIDTHS } from './track-core.mjs';
const add = (a, b) => a.map((v, i) => v + b[i]), sub = (a, b) => a.map((v, i) => v - b[i]), mul = (a, k) => a.map((v) => v * k), len = (a) => Math.hypot(...a);
const rec = JSON.parse(fs.readFileSync(new URL('./fixtures/td_showcase_seed.recipe.json', import.meta.url)));
let failures = 0; const log = [];
const expect = (name, cond, info = '') => { log.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${info ? '  · ' + info : ''}`); if (!cond) failures++; };

// 1 · positive fixture: every check green
const A = compileRecipe(rec), B = compileRecipe(rec);
const ck = runChecks(A);
for (const r of ck.results) expect(`seed · ${r.id}`, r.pass || r.severity === 'warn', `${r.value}${r.note ? ' · ' + r.note : ''}`);
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
  for (const r of c3.results) expect(`td03 · ${r.id}`, r.pass || r.severity === 'warn', `${r.pass ? '' : 'WARN · '}${r.value}${r.note ? ' · ' + r.note : ''}`);
  const loop = T3.samples.filter((q) => q.law === 'loop');
  expect('td03 · roof loop is 26 m tall', Math.abs(Math.max(...loop.map((q) => q.p[1])) - loop[0].p[1] - 26) < 0.1, (Math.max(...loop.map((q) => q.p[1])) - loop[0].p[1]).toFixed(2));
  const hx = T3.samples.filter((q) => q.tags.includes('SPIRAL'));
  expect('td03 · helix climbs three floors of 5 m', Math.abs(hx[hx.length - 1].p[1] - hx[0].p[1] - 15.3) < 0.05, (hx[hx.length - 1].p[1] - hx[0].p[1]).toFixed(2));
  fs.writeFileSync(new URL('./out/td03.stream.json', import.meta.url), JSON.stringify(T3)); }

// 7 · S5 circuit: TD04 = TD03 + balcony climb round the yellow wing + finale jump + street return, closed
{ const T4 = compileRecipe(td04Recipe()), c4 = runChecks(T4), S = T4.samples;
  for (const r of c4.results) expect(`td04 · ${r.id}`, r.pass || r.severity === 'warn', `${r.pass ? '' : 'WARN · '}${r.value}${r.note ? ' · ' + r.note : ''}`);
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
  for (const r of c5.results) expect(`td05 · ${r.id}`, r.pass || r.severity === 'warn', `${r.pass ? '' : 'WARN · '}${r.value}${r.note ? ' · ' + r.note : ''}`);
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
  let step = 0; for (const seg of [kick, land]) for (let i = 1; i < seg.length; i++) step = Math.max(step, Math.abs(seg[i].prm.barrierT - seg[i - 1].prm.barrierT));
  expect('round ends · v0.9 lip and touchdown close as a rounded nose (sides + deck -> 0), barriers keep their thickness',
    lipQ.prm.sideL < 0.02 && lipQ.prm.deckDepth < 0.05 && tdQ.prm.sideL < 0.4 && Math.abs(lipQ.prm.barrierT - full.prm.barrierT) < 1e-6
      && land[land.length - 1].prm.sideL > 0.99 && land[land.length - 1].prm.deckDepth > 2 && step < 1e-6,
    `lip side ${lipQ.prm.sideL} deck ${lipQ.prm.deckDepth} T ${lipQ.prm.barrierT} · touchdown side ${tdQ.prm.sideL} · landing end side ${land[land.length - 1].prm.sideL} deck ${land[land.length - 1].prm.deckDepth}`);
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
  expect('fs01 · Weiche widens to 28.8 and splits into two full 14.4 lanes', Math.abs(wmax - 28.8) < 1e-6 && Math.abs(lane.prm.width - 14.4) < 1e-6 && J.every((q) => q.prm.width >= 14.4 - 1e-6 || q.tags.includes('kicker') || q.tags.includes('landing') || q.tags.includes('air')), `max ${wmax} · lane ${lane.prm.width}`);
  const buoys = M.filter((q) => q.skin === 'buoy');
  const road = Math.min(...buoys.map((q) => q.p[1])), under = Math.min(...buoys.map((q) => q.p[1] - q.prm.deckDepth));
  expect('fs01 · lifebuoys float: road stays dry (> 0.5 m over the water), underside dips into it', road > -1.2 + 0.5 && under < -1.2, `lowest road ${road.toFixed(2)} m · lowest underside ${under.toFixed(2)} m · water -1.2`);
  fs.writeFileSync(new URL('./out/fs01.graph.stream.json', import.meta.url), JSON.stringify(G)); }

// 10 · S8: TN01 tunnels (mountain round -> oval, building rect, hexagon shaft down into the hollow earth, braid of two
// tube strands over / under, round shaft up), closed. Plus one broken fixture per tunnel check.
{ const G = cg6(tn01Graph()), C = rgc6(G), M = G.routes.M, J = G.routes.J;
  for (const [rid, r] of Object.entries(C.routes)) for (const c of r.results) expect(`tn01 · ${rid} · ${c.id}`, c.pass || c.severity === 'warn', `${c.value}${c.note ? ' · ' + c.note : ''}`);
  for (const c of C.results) expect(`tn01 · ${c.id}`, c.pass, `${c.value}${c.note ? ' · ' + c.note : ''}`);
  expect('tn01 · main route is a closed circuit', C.routes.M.results.some((r) => r.id === 'closure' && r.pass));
  const tubes = [...(M.tunnels ?? []), ...(J.tunnels ?? [])], shapes = new Set(tubes.flatMap((t) => t.shapes)), hosts = new Set(tubes.map((t) => t.host));
  expect('tn01 · all four section shapes are used (round, oval, rect, poly)', ['round', 'oval', 'rect', 'poly'].every((k) => shapes.has(k)), [...shapes].join(', '));
  expect('tn01 · tubes through a mountain, a building, shafts and a labyrinth', ['mountain', 'building', 'shaft', 'labyrinth'].every((k) => hosts.has(k)), [...hosts].join(', '));
  const mt = M.tunnels.find((t) => t.host === 'mountain');
  expect('tn01 · the mountain tube morphs round -> oval inside, portals keep their own shape', mt.shapeIn === 'round' && mt.shapeOut === 'oval', `${mt.shapeIn} -> ${mt.shapeOut} over ${mt.length} m`);
  const floor = Math.min(...M.samples.map((q) => q.p[1]));
  expect('tn01 · the shaft goes deep: cavern floor > 200 m under ground', floor < -200, `lowest road ${floor.toFixed(1)} m`);
  const rings = M.samples.filter((q) => q.tunnel).every((q) => q.tunnel.ring.length === TUNNEL_N);
  expect('tn01 · every tube sample carries a full ring (palette, ringId)', rings && M.tunnelRings.length < 1000, `${M.tunnelRings.length} distinct rings for ${M.samples.filter((q) => q.tunnel).length} samples`);
  const back = attachRings(JSON.parse(JSON.stringify(M)));
  expect('tn01 · rings survive JSON (attachRings)', back.samples.filter((q) => q.tunnel).every((q, i) => q.tunnel.ring.length === TUNNEL_N));
  // the braid: where the two strands cross in plan, one runs under the other with rock between the shells
  const cr = C.results.find((r) => r.id === 'tunnel_shell M|J');
  expect('tn01 · braid strands cross over / under with rock between the tubes', cr.pass && cr.value >= 1, `${cr.value} m`);
  // broken fixtures: each must be caught by the check that owns it
  const base = (extra) => ({ id: 'neg', pieces: [{ type: 'STRAIGHT', length: 40 }, { type: 'STRAIGHT', length: 60, tunnel: { shape: 'round' } }, ...extra, { type: 'STRAIGHT', length: 40 }, { type: 'STRAIGHT', length: 20, tunnel: null }] });
  const chk = (r, id) => rc7(cr7(r)).results.find((x) => x.id === id);
  { const c = chk(base([{ type: 'STRAIGHT', length: 8, tunnel: { shape: 'rect' } }]), 'tunnel_morph');
    expect('edge · round -> rect over 8 m is a step, not a morph', !c.pass, `${c.value} m/m`); }
  { const c = chk(base([{ type: 'STRAIGHT', length: 60, tunnel: { shape: 'rect', h: 5 } }]), 'tunnel_clearance');
    expect('edge · a 5 m rect tube is too low for barriers + car', !c.pass, `${c.value} m`); }
  { const c = chk({ id: 'neg', pieces: [{ type: 'STRAIGHT', length: 40 }, { type: 'STRAIGHT', length: 4, tunnel: { shape: 'round' } }, { type: 'STRAIGHT', length: 60, tunnel: { shape: 'oval' } }, { type: 'STRAIGHT', length: 30, tunnel: null }] }, 'portal_match');
    expect('edge · a morph that starts at the portal: collar would not match the tube', !c.pass, `${c.value} m`); }
  { const c = chk({ id: 'neg', ground: 0, pieces: [{ type: 'STRAIGHT', length: 40 }, { type: 'SPIRAL', turn: 720, radius: 60, rise: -80, riseEase: 'ramp' }, { type: 'STRAIGHT', length: 40 }] }, 'buried_open');
    expect('edge · a shaft without a tunnel spec is open road inside the rock', !c.pass, c.note); }
  { const c = chk({ id: 'neg', pieces: [{ type: 'STRAIGHT', length: 40 }, { type: 'SPIRAL', turn: 720, radius: 60, rise: -40, riseEase: 'ramp', tunnel: { shape: 'poly', n: 6 } }, { type: 'STRAIGHT', length: 40, tunnel: null }] }, 'tunnel_shell');
    expect('edge · spiral laps 20 m apart: the tube shells cut into each other', !c.pass, c.note); }
  { const G2 = cg6(tn01Graph({ braid: { ...TN.braid, dip: 3 } })), c = rgc6(G2).results.find((r) => r.id === 'tunnel_shell M|J');
    expect('edge · braid dip 3 m: the strands hit each other', !c.pass, `${c.value} m`); }
  G.meta = tn01Graph().meta; fs.writeFileSync(new URL('./out/tn01.graph.stream.json', import.meta.url), JSON.stringify(G)); }

// 11 · v0.7.1 vehicle envelope: tunnels are built for it; the older showcase crossings are measured against it (warning)
{ expect('vehicles · tunnel headroom comes from the vehicle envelope', TUNNEL_DEFAULTS.headroom === VEHICLE_HEADROOM && VEHICLE_HEADROOM === 7, `${VEHICLE_ENVELOPE.height} + ${VEHICLE_ENVELOPE.reserve} = ${VEHICLE_HEADROOM} m`);
  const G = cg6(tn01Graph()); let roof = Infinity;
  for (const r of Object.values(G.routes)) for (const q of r.samples) if (q.tunnel) { const w = q.prm.width / 2;
    roof = Math.min(roof, Math.max(...q.tunnel.ring.filter(([l]) => Math.abs(l) < w).map(([, h]) => h))); }
  expect('vehicles · every TN01 tube clears the tallest truck with reserve', roof >= VEHICLE_HEADROOM, `lowest roof over the road ${roof.toFixed(2)} m`);
  const vh = [['td03', compileRecipe(td03Recipe())], ['td04', compileRecipe(td04Recipe())], ['td05', compileRecipe(td05Recipe())]]
    .map(([n, st]) => [n, runChecks(st).results.find((r) => r.id === 'vehicle_headroom')]);
  expect('vehicles · showcase crossings measured against the envelope (known: trucks do not fit under the balconies)',
    vh.every(([, r]) => r && r.severity === 'warn'), vh.map(([n, r]) => `${n} ${r.value} m${r.pass ? '' : ' < ' + VEHICLE_HEADROOM}`).join(' · ')); }

// 12 · S9 responsive sections: tubes size themselves from the profile they carry; presets; forks inside tunnels = halls
{ const G = cg6(tn02Graph()), C = rgc6(G), M = G.routes.M, J = G.routes.J;
  for (const [rid, r] of Object.entries(C.routes)) for (const c of r.results) expect(`tn02 · ${rid} · ${c.id}`, c.pass || c.severity === 'warn', `${c.value}${c.note ? ' · ' + c.note : ''}`);
  for (const c of C.results) expect(`tn02 · ${c.id}`, c.pass, `${c.value}${c.note ? ' · ' + c.note : ''}`);
  const g = M.samples.filter((q) => q.tunnel?.host === 'mountain'), byW = new Map();
  for (const q of g) byW.set(+q.prm.width.toFixed(1), q.tunnel.w);
  const ws = [10.8, 18, 21.6].map((w) => byW.get(w));
  expect('tn02 · the Gotthard tube follows the road width (NARROW < WIDE < HERO)', ws.every(Number.isFinite) && ws[0] < ws[1] && ws[1] < ws[2], ws.map((x) => x.toFixed(1)).join(' < ') + ' m');
  const halls = M.tunnels.filter((t) => t.kind === 'hall');
  expect('tn02 · the Weiche inside the bunker becomes two junction halls (fork, join)', halls.length === 2, halls.map((h) => `${h.id} ${h.length} m`).join(' · '));
  const hq = M.samples[halls[0].i0 + 5].tunnel, jq = J.samples.find((q) => q.tags.includes('SPLIT_HALF'));
  expect('tn02 · the branch has no tube of its own inside the hall', !jq.tunnel && hq.w > 50, `hall w ${hq.w} m`);
  const hosts = new Set([...M.tunnels, ...J.tunnels].map((t) => t.host));
  expect('tn02 · presets used: gotthard (arch), dumb bunker, alien, toy, hangar', ['mountain', 'bunker', 'alien', 'toy', 'hangar'].every((h) => hosts.has(h)), [...hosts].join(', '));
  expect('tn02 · the toy branch wears the toy skin', J.samples.some((q) => q.skin === 'toy'));
  const hg = M.samples.find((q) => q.tunnel?.host === 'hangar').tunnel;
  expect('tn02 · the hangar is 70 m high and wide enough for a ship beside the track', hg.h === 70 && hg.w > 80 && hg.fill < 2.5, `${hg.w} x ${hg.h} m, floor ${hg.fill} m under the road`);
  // every shape and preset sizes itself for every width class, with the vehicle envelope inside
  let worst = Infinity, n = 0;
  for (const W of Object.values(WIDTHS)) { const sl = profileSlots({ ...PROFILE_DEFAULTS, width: W });
    for (const p of [{ shape: 'round' }, { shape: 'oval' }, { shape: 'rect' }, { shape: 'poly' }, { shape: 'arch' }, { preset: 'gotthard' }, { preset: 'dumb' }, { preset: 'alien' }, { preset: 'toy' }, { preset: 'hangar' }]) {
      const sp = tunnelSpec(p), sec = tunnelSection({ A: sp, B: sp, t: 1 }, sl); worst = Math.min(worst, sec.margin); n++; } }
  expect('responsive · 10 shapes / presets x 5 widths size themselves and clear the envelope', worst >= TUNNEL_DEFAULTS.margin - 1e-3, `${n} sections, worst margin ${worst.toFixed(3)} m`);
  G.meta = { note: 'TN02 responsive' }; fs.writeFileSync(new URL('./out/tn02.graph.stream.json', import.meta.url), JSON.stringify(G)); }

// 13 · v0.8.1 loop_envelope (Georg 27.09: trucks drive through loops too)
{ const mk = (H, wc) => ({ schema: 'kfb.route-recipe/0.1-draft', id: 'LOOP_ENV', start: { p: [0, 0, 0], headingDeg: 0 }, defaults: { widthClass: wc, markings: 'TRACK' },
    pieces: [{ id: 'a', type: 'STRAIGHT', length: 40 }, { id: 'l', type: 'LOOP', height: H, side: 1 }, { id: 'b', type: 'STRAIGHT', length: 40 }] });
  const le = (H, wc) => runChecks(compileRecipe(mk(H, wc))).results.find((r) => r.id === 'loop_envelope');
  const all = ['NARROW', 'STANDARD', 'WIDE', 'HERO'].map((wc) => [wc, le(16, wc)]);
  expect('loop_envelope · a 16 m loop clears the 7 m truck envelope at every width class', all.every(([, r]) => r.pass), all.map(([w, r]) => `${w} ${r.value}`).join(' · '));
  const small = le(10, 'STANDARD');
  expect('loop_envelope · a 10 m loop fails it (negative control)', !small.pass, `${small.value} m`); }

// 14 · v0.9: loop size, width tapers, pit lane
{ const mk = (pieces) => ({ schema: 'kfb.route-recipe/0.1-draft', id: 'V09', start: { p: [0, 0, 0], headingDeg: 0 }, defaults: { widthClass: 'STANDARD', markings: 'TRACK' }, pieces });
  const chk = (s, id) => runChecks(s).results.find((r) => r.id === id);
  const big = compileRecipe(mk([{ id: 'a', type: 'STRAIGHT', length: 40 }, { id: 'l', type: 'LOOP', side: 1 }, { id: 'b', type: 'STRAIGHT', length: 40 }]));
  const small = compileRecipe(mk([{ id: 'a', type: 'STRAIGHT', length: 40 }, { id: 'l', type: 'LOOP', height: 30, side: 1 }, { id: 'b', type: 'STRAIGHT', length: 40 }]));
  const lb = chk(big, 'loop_scale'), ls = chk(small, 'loop_scale');
  expect('loop · a LOOP without height is 100 m high and passes loop_scale; 30 m warns', lb.pass && Math.abs(lb.value - 100) < 0.6 && !ls.pass && ls.severity === 'warn', `${lb.value} m ok · ${ls.value} m warn`);
  const auto = compileRecipe(mk([{ id: 'a', type: 'STRAIGHT', length: 30 }, { id: 'w', type: 'WIDTH_STEP', widthTo: 'HERO' }, { id: 'b', type: 'STRAIGHT', length: 30 }]));
  const wj = auto.joints; const wlen = auto.samples[wj[2].index].s - auto.samples[wj[1].index].s;
  const short = compileRecipe(mk([{ id: 'a', type: 'STRAIGHT', length: 30 }, { id: 'w', type: 'WIDTH_STEP', length: 30, widthTo: 'HERO' }, { id: 'b', type: 'STRAIGHT', length: 30 }]));
  expect('width · WIDTH_STEP without length takes 25 m per metre and side (STANDARD -> HERO = 90 m) and passes width_taper; 30 m warns',
    Math.abs(wlen - 90) < 1.1 && chk(auto, 'width_taper').pass && !chk(short, 'width_taper').pass, `auto ${wlen.toFixed(1)} m 1:${chk(auto, 'width_taper').value} · 30 m 1:${chk(short, 'width_taper').value}`);
  const G = cg6({ id: 'PIT', defaults: { widthClass: 'STANDARD', markings: 'TRACK' }, routes: [{ id: 'M', start: { p: [0, 0, 0], headingDeg: 0 }, pieces: [{ id: 'a', type: 'STRAIGHT', length: 80 }, { id: 'pit', type: 'PIT_LANE', side: -1, length: 120, boxes: 4 }, { id: 'b', type: 'STRAIGHT', length: 80 }] }] });
  const RC = rgc6(G); const A = G.routes.pit?.anchors ?? [];
  for (const [rid, r] of Object.entries(RC.routes)) for (const c of r.results) expect(`pit · ${rid} · ${c.id}`, c.pass || c.severity === 'warn', `${c.value}${c.note ? ' · ' + c.note : ''}`);
  for (const c of RC.results) expect(`pit · ${c.id}`, c.pass, `${c.value}${c.note ? ' · ' + c.note : ''}`);
  const pitS = G.routes.pit.samples, boxQ = pitS.filter((q) => q.tags.includes('pit_boxes'));
  expect('pit · v0.10 PIT_LANE gives a 7.2 m pit lane with 4 box anchors on the outer side, outer barrier open at the building, assist + pit_limiter',
    A.length === 4 && A.every((a) => a.kind === 'pit_box' && a.lat < -10) && boxQ.filter((q) => !q.brk).every((q) => Math.abs(q.prm.width - 7.2) < 1e-3 && q.prm.sideL < 1e-3 && q.drive?.fx?.includes('pit_limiter')),
    `${A.length} boxes at lat ${A.map((a) => a.lat).join(', ')} · lane ${boxQ[1]?.prm.width} m`);
  const MW = G.routes.M.samples.map((q) => q.prm.width), straight = G.routes.M.samples.every((q) => Math.abs(q.kappa) < 1e-9);
  expect('pit · the main road keeps its width and runs straight through the whole pit (no bulge)', Math.max(...MW) - Math.min(...MW) < 1e-6 && straight, `main width ${Math.min(...MW)}…${Math.max(...MW)} m`);
  // v0.10 concept: no sunk barriers, hand-over of the outer barrier, deck layer
  const allQ = [...G.routes.M.samples, ...pitS];
  expect('pit · v0.10 no barrier is sunk anywhere (visibility is 0 only where the side is bare)', allQ.every((q) => (q.prm.barrierVisL > 0.999 || q.prm.sideL < 1e-6) && (q.prm.barrierVisR > 0.999 || q.prm.sideR < 1e-6)));
  const slotW = (q, k) => add(q.p, mul(q.R, q.slots[SLOTS.indexOf(k)][0]));
  const mDiv = G.routes.M.samples.findIndex((q) => q.tags.includes('pit_diverge')), mEnd = G.routes.M.samples[mDiv - 1], bStart = pitS[0];
  const hand = len(sub(slotW(mEnd, 'barrier_out_top_L'), slotW(bStart, 'barrier_out_top_L')));
  const mCl = G.routes.M.samples.find((q) => q.brk && q.tags.includes('pit') && q.prm.sideL > 0.999), bEnd = pitS[pitS.length - 1];
  const hand2 = len(sub(slotW(mCl, 'barrier_out_top_L'), slotW(bEnd, 'barrier_out_top_L')));
  expect('pit · v0.10 the pit lane takes over the main outer barrier seamlessly at entry and hands it back at the exit', hand < 0.05 && hand2 < 0.05, `entry ${hand.toFixed(3)} m · exit ${hand2.toFixed(3)} m`);
  const D = G.deck ?? { zones: [], furniture: [] }, fk = (k) => D.furniture.filter((f) => f.kind === k).length;
  const gore = D.zones.find((z) => z.kind === 'gore'), gmax = gore ? Math.max(...gore.rows.map(([a, b]) => len(sub(a, b)))) : 0;
  expect('pit · v0.10 deck layer: gore up to 5 m, wall + 2 cushions, apron, 4 garages + 4 box marks, 2 barrier caps',
    Math.abs(gmax - 5) < 0.05 && fk('wall') === 1 && fk('cushion') === 2 && D.zones.some((z) => z.kind === 'apron') && fk('garage') === 4 && fk('boxmark') === 4 && fk('cap') === 2,
    `gore max ${gmax.toFixed(2)} m · ${D.furniture.map((f) => f.kind).join(', ')}`);
  const GR = G.routes.pit.samples.filter((q) => q.tags.includes('pit_boxes') && !q.brk).map((q) => len(sub(slotW(q, 'road_R'), q.p)));
  // pit on the right: mirror
  const GRr = cg6({ id: 'PITR', defaults: { widthClass: 'STANDARD', markings: 'TRACK' }, routes: [{ id: 'M', start: { p: [0, 0, 0], headingDeg: 0 }, pieces: [{ id: 'a', type: 'STRAIGHT', length: 80 }, { id: 'pit', type: 'PIT_LANE', side: 1, length: 120, boxes: 4 }, { id: 'b', type: 'STRAIGHT', length: 80 }] }] });
  const Ar = GRr.routes.pit.anchors ?? [];
  expect('pit · side 1 mirrors the module to the right (box anchors at positive lat, same deck layer)', Ar.length === 4 && Ar.every((a) => Math.abs(a.lat + A[0].lat) < 1e-3) && GRr.deck.furniture.length === D.furniture.length, `${Ar.map((a) => a.lat).join(', ')}`);
  // Weiche: the branch leaves the main edge; U barrier + cushion at the nose; main unchanged
  const GW = cg6({ id: 'WEI', defaults: { widthClass: 'STANDARD', markings: 'TRACK' }, routes: [{ id: 'M', start: { p: [0, 0, 0], headingDeg: 0 }, pieces: [{ id: 'a', type: 'STRAIGHT', length: 60 }, { id: 'w', type: 'WEICHE', side: -1 }, { id: 'b', type: 'STRAIGHT', length: 150 }] }] });
  const RW = rgc6(GW);
  for (const [rid, r] of Object.entries(RW.routes)) for (const c of r.results) expect(`weiche · ${rid} · ${c.id}`, c.pass || c.severity === 'warn', `${c.value}${c.note ? ' · ' + c.note : ''}`);
  for (const c of RW.results) expect(`weiche · ${c.id}`, c.pass, `${c.value}${c.note ? ' · ' + c.note : ''}`);
  const WM = GW.routes.M.samples, WB = GW.routes.w.samples, wlast = WB[WB.length - 1], mAtEnd = WM.reduce((a, q) => (Math.abs(q.s - wlast.s) < Math.abs(a.s - wlast.s) ? q : a), WM[0]);
  const sepEnd = len(sub(slotW(mAtEnd, 'road_L'), slotW(wlast, 'road_R')));
  const fw = GW.deck.furniture.map((f) => f.kind);
  expect('weiche · v0.10 the branch has the main width, ends 10.2 m apart edge to edge, main straight and unchanged, U barrier + cushion at the nose',
    Math.abs(wlast.prm.width - 14.4) < 1e-3 && Math.abs(sepEnd - 10.2) < 0.05 && WM.every((q) => Math.abs(q.prm.width - 14.4) < 1e-6 && Math.abs(q.kappa) < 1e-9) && fw.includes('uturn') && fw.includes('cushion') && GW.deck.zones.some((z) => z.kind === 'gore'),
    `branch ${wlast.prm.width} m · gap ${sepEnd.toFixed(2)} m · ${fw.join(', ')}`); }

// 15 · v0.11 transition zones (T3 transition grammar v1): data only, drive geometry untouched, staggered layers
{ const C11 = await import('./track-core.mjs');
  const base = { id: 'TZ', defaults: { widthClass: 'STANDARD', markings: 'TRACK' }, start: { p: [0, 0, 0], headingDeg: 0 } };
  const plain = C11.compileRecipe({ ...base, pieces: [{ id: 'a', type: 'STRAIGHT', length: 60 }, { id: 'z1', type: 'STRAIGHT', length: 80 }, { id: 'b', type: 'CURVE_EASE', turn: 60, radius: 80 }, { id: 'z2', type: 'STRAIGHT', length: 80 }, { id: 'c', type: 'STRAIGHT', length: 60 }] });
  const zoned = C11.compileRecipe({ ...base, pieces: [{ id: 'a', type: 'STRAIGHT', length: 60 }, { id: 'z1', type: 'TRANSITION', to: 'city', length: 80 }, { id: 'b', type: 'CURVE_EASE', turn: 60, radius: 80, transition: { to: 'nature' } }, { id: 'z2', type: 'TRANSITION', to: 'track', length: 80 }, { id: 'c', type: 'STRAIGHT', length: 60 }] });
  const geo = (q) => JSON.stringify([q.s, q.p, q.T, q.U, q.R, q.slots, q.prm, q.kappa, q.bank]);
  const same = plain.samples.length === zoned.samples.length && plain.samples.every((q, i) => geo(q) === geo(zoned.samples[i]));
  expect('transition · v0.11 zones are data only: every sample has the same s, frame, slots and profile as the plain route', same, `${zoned.samples.length} samples`);
  const T = zoned.transitions ?? [];
  expect('transition · three zones track→city (leave), city→nature (across), nature→track (enter), carriers TRANSITION and piece.transition',
    T.map((t) => `${t.from}>${t.to}:${t.kind}`).join(' ') === 'track>city:leave city>nature:across nature>track:enter', T.map((t) => `${t.id} ${t.from}>${t.to} ${t.length} m`).join(' · '));
  // staggering: at no u do more than two layers sit in the middle of their change together, and the windows start at different u
  // the half-way point of each main layer (light / vfx are secondary): never more than 3 inside any 0.1 of u, spread over ≥ 0.3
  const MAIN = ['surface', 'markings', 'barrier', 'pit', 'curb', 'nature', 'props'];
  let worst = 0, spread = 1; for (const t of T) { const mids = MAIN.map((k) => (t.windows[k][0] + t.windows[k][1]) / 2);
    for (let u = 0; u <= 0.9001; u += 0.01) worst = Math.max(worst, mids.filter((m) => m >= u && m <= u + 0.1).length); spread = Math.min(spread, Math.max(...mids) - Math.min(...mids)); }
  const starts = T.map((t) => new Set(Object.values(t.windows).map(([a]) => a)).size);
  expect('transition · layers are staggered: no 0.1 of u holds the half-way point of more than 3 main layers, half-way points spread ≥ 0.3, windows start at ≥ 7 different u', worst <= 3 && spread >= 0.3 && starts.every((k) => k >= 7), `max together ${worst} · spread ${spread.toFixed(2)} · distinct starts ${starts.join('/')}`);
  const lv = C11.TRANSITION_WINDOWS.leave, en = C11.TRANSITION_WINDOWS.enter;
  const mirror = Object.keys(lv).every((k) => Math.abs(en[k][0] - (1 - lv[k][1])) < 1e-9 && Math.abs(en[k][1] - (1 - lv[k][0])) < 1e-9);
  expect('transition · returning to the track is not the mirror of leaving it: markings last, the barrier gathers late, props clear first', !mirror && en.markings[0] > en.barrier[0] && en.props[1] < en.markings[0], `enter markings ${en.markings} · barrier ${en.barrier} · props ${en.props}`);
  const q1 = zoned.samples.filter((q) => q.zone?.id === 'z1'), mono = q1.every((q, i) => !i || Object.keys(q.zone.w).every((k) => q.zone.w[k] >= q1[i - 1].zone.w[k] - 1e-9));
  expect('transition · per-sample layer weights run 0 → 1 without going back, u 0 → 1', mono && q1[0].zone.u === 0 && Math.abs(q1[q1.length - 1].zone.u - 1) < 1e-9 && Object.values(q1[q1.length - 1].zone.w).every((v) => v === 1), `${q1.length} samples in z1`);
  const segs = zoned.markings.filter((b) => b.zone), cross = zoned.markings.filter((b) => !b.zone && T.some((t) => b.s0 < t.s1 - 1e-3 && b.s1 > t.s0 + 1e-3));
  const z1 = T[0], inZ1 = segs.filter((b) => b.zone === 'z1'), lastOut = Math.max(...inZ1.filter((b) => b.seg === 'out').map((b) => b.s1)), firstIn = Math.min(...inZ1.filter((b) => b.seg === 'in').map((b) => b.s0));
  expect('transition · markings rebuild as clay segments (≥ 0.6 m, none across a zone border); old rhythm and new rhythm overlap in the middle instead of switching at one line',
    segs.length > 20 && segs.every((b) => b.s1 - b.s0 >= 0.6 - 1e-6) && !cross.length && firstIn < lastOut && inZ1.some((b) => b.style === 'STREET' && b.id === 'centre'),
    `${segs.length} segments · z1 old ends ${lastOut.toFixed(1)} · new starts ${firstIn.toFixed(1)} (zone ${z1.s0}–${z1.s1})`);
  const names = Object.keys(T[0].sockets), need = ['centerline_in', 'centerline_out', 'surface_left_in', 'surface_right_out', 'barrier_left_in', 'curb_right_out', 'sidewalk_left_in', 'nature_right_out', 'pit_in', 'pit_out'];
  const cin = T[0].sockets.centerline_in, q0 = zoned.samples.find((q) => Math.abs(q.s - T[0].s0) < 1e-9);
  expect('transition · contract sockets present (centreline, surface, barrier, curb, sidewalk, nature per side, in and out; pit reserved) and the centreline socket sits on the route with its frame',
    need.every((k) => names.includes(k)) && q0 && len(sub(cin.p, q0.p)) < 1e-3 && cin.forward && cin.up && cin.right, `${names.length} sockets`);
  const sA = C11.zoneSeeds('TZ:z1'), sB = C11.zoneSeeds('TZ:z1');
  expect('transition · one zone seed gives six reproducible, distinct role seeds (track / terrain palette, K2 profile, light, VFX, WFC)', JSON.stringify(sA) === JSON.stringify(sB) && new Set(Object.values(sA)).size === 6 && JSON.stringify(T[0].seeds) === JSON.stringify(sA), Object.entries(sA).map(([k, v]) => `${k} ${v}`).join(' · '));
  const rcz = C11.runChecks(zoned).results, tl = rcz.find((r) => r.id === 'transition_length');
  const short = C11.compileRecipe({ ...base, pieces: [{ id: 'a', type: 'STRAIGHT', length: 60 }, { id: 'z', type: 'TRANSITION', to: 'city', length: 30 }] });
  expect('transition · all other checks pass on the zoned route; transition_length warns under 60 m', rcz.filter((r) => r.id !== 'transition_length').every((r) => r.pass || r.severity === 'warn') && !C11.runChecks(short).results.find((r) => r.id === 'transition_length').pass,
    `${tl.note}`); }

// 3 · stream stats
const L = A.samples[A.samples.length - 1].s;
log.push(`\nseed stream: ${A.samples.length} samples · ${L.toFixed(1)} m · ${A.joints.length} pieces · ${A.markings.length} marking bands · fingerprint ${A.fingerprint}`);
fs.mkdirSync(new URL('./out/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('./out/td_showcase_seed.stream.json', import.meta.url), JSON.stringify(A));
fs.writeFileSync(new URL('./out/split_merge_seed.graph.stream.json', import.meta.url), JSON.stringify(G));
fs.writeFileSync(new URL('./out/test-report.txt', import.meta.url), log.join('\n') + `\n\n${failures} unexpected result(s)\n`);
console.log(log.join('\n')); console.log(`\n${failures} unexpected result(s)`);
process.exit(failures ? 1 : 0);
