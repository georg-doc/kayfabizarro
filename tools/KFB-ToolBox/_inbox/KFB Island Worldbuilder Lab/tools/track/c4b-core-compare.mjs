// C4b Teil-0 proof (Steuerung 11.10.): the organ world's ring compiled by Track Core v0.12 (?core=012) and by RKIT's 0.16.x (?core=169), same
// layout search, same recipe. Compares the chosen recipe, sample count, every sample's s / p / T / U / R / all slots / prm, joints, tunnels and the
// core checks. Pass = same recipe and pieces, same counts, max |Δ| ≤ 1 mm (0.001 track m) on p / slots and ≤ 1e-6 on the unit vectors.
// node tools/track/c4b-core-compare.mjs <out.json> [coreA=012] [coreB=169]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const dump = async (core) => { const p = await b.newPage({ viewport: { width: 640, height: 400 } }), errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&c4c=0&core=${core}`); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
  const d = await p.evaluate(() => { const O = window.__kfb.organ(), td = O.td, S = td.samples, f = (a) => (a ? Array.from(a) : []);
    const keys = new Set(); S.forEach((q) => Object.keys(q.slots || {}).forEach((k) => keys.add(k)));
    return { core: O.W?.trackInfo?.core ?? null, trackInfo: O.W?.trackInfo ?? null, recipe: td.recipe ? { id: td.recipe.id, pieces: (td.recipe.pieces || []).map((x) => [x.id, x.type, x.length ?? x.turn ?? null]) } : null, length: td.length, ds: td.ds, n: S.length,
      slotKeys: [...keys].sort(), joints: (td.joints || []).map((j) => [j.index, j.piece]), tunnels: (td.tunnels || []).map((t) => [t.i0, t.i1]),
      S: S.map((q) => [q.s, ...f(q.p), ...f(q.T), ...f(q.U), ...f(q.R)]), SL: S.map((q) => [...keys].sort().map((k) => (q.slots?.[k] ?? []).join(','))), PRM: S.map((q) => JSON.stringify(q.prm ?? {})) }; });
  d.errs = errs; await p.close(); return d; };
const [ca = '012', cb = '169'] = process.argv.slice(3), A = await dump(ca), B = await dump(cb);
const R = { at: new Date().toISOString(), a: { core: A.trackInfo?.corePick, trackInfo: A.trackInfo, n: A.n, length: A.length, errs: A.errs }, b: { core: B.trackInfo?.corePick, trackInfo: B.trackInfo, n: B.n, length: B.length, errs: B.errs } };
R.sameRecipe = !!A.trackInfo?.recipeSig && A.trackInfo.recipeSig === B.trackInfo?.recipeSig; R.recipe = A.trackInfo?.recipe; R.pieces = A.trackInfo?.pieces; R.recipeSig = [A.trackInfo?.recipeSig, B.trackInfo?.recipeSig];
R.sameCount = A.n === B.n; R.sameJoints = JSON.stringify(A.joints) === JSON.stringify(B.joints); R.sameTunnels = JSON.stringify(A.tunnels) === JSON.stringify(B.tunnels); R.slotKeys = [A.slotKeys, B.slotKeys];
let dS = 0, dP = 0, dV = 0, dSl = 0, slotDiffN = 0, prmDiffN = 0, prmCommonDiff = 0; const prmEx = [], prmAdded = {};
for (let i = 0; i < Math.min(A.n, B.n); i++) { const a = A.S[i], c = B.S[i]; dS = Math.max(dS, Math.abs(a[0] - c[0])); for (let k = 1; k < 4; k++) dP = Math.max(dP, Math.abs(a[k] - c[k])); for (let k = 4; k < a.length; k++) dV = Math.max(dV, Math.abs(a[k] - c[k]));
  A.SL[i].forEach((sa, k) => { const sb = B.SL[i][k] ?? ''; if (sa !== sb) { const va = sa.split(',').map(Number), vb = sb.split(',').map(Number); if (va.length !== vb.length) slotDiffN++; else va.forEach((x, j) => (dSl = Math.max(dSl, Math.abs(x - vb[j])))); } });
  if (A.PRM[i] !== B.PRM[i]) { prmDiffN++; if (prmEx.length < 3) prmEx.push({ i, a: A.PRM[i].slice(0, 300), b: B.PRM[i].slice(0, 300) });
    const pa = JSON.parse(A.PRM[i]), pb = JSON.parse(B.PRM[i]); for (const k of Object.keys(pa)) if (JSON.stringify(pa[k]) !== JSON.stringify(pb[k])) prmCommonDiff++; for (const k of Object.keys(pb)) if (!(k in pa)) prmAdded[k] = (prmAdded[k] ?? new Set()).add(JSON.stringify(pb[k])); } }
Object.assign(R, { maxDs: dS, maxDp: dP, maxDunit: dV, maxDslot: dSl, slotShapeDiff: slotDiffN, prmDiff: prmDiffN, prmCommonDiff, prmAdded: Object.fromEntries(Object.entries(prmAdded).map(([k, v]) => [k, [...v]])), prmExamples: prmEx });
R.pass = R.sameRecipe && R.sameCount && R.sameJoints && R.sameTunnels && dS <= 1e-3 && dP <= 1e-3 && dV <= 1e-6 && dSl <= 1e-3 && slotDiffN === 0 && prmCommonDiff === 0;   // 0.16.x may ADD prm keys (lane layout), never change existing ones
fs.writeFileSync(out, JSON.stringify(R, null, 1)); console.log(JSON.stringify((({ prmExamples, ...r }) => r)(R)), prmEx.length ? 'prm example: ' + JSON.stringify(prmEx[0]).slice(0, 500) : '');
await b.close();
