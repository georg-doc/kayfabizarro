// C4c Teil-0 proof (Steuerung 11.10.: as C4b): the organ ring WITH the exit / entry graph (LAB PATCH 16) against the ring without it (?c4c=0),
// both on Track Core 0.16.8. B is read at each A sample's arc length s (linear between B's stations; the graph adds joint samples). Outside the new pieces (c4_off_div / _nose,
// c4_on_conv / _close and the re-targeted …_home_run) p / T / U / R / all slots must stay ≤ 1 mm; inside, the differences are listed (the barrier
// side opens there by design). node tools/track/c4c-main-compare.mjs <out.json>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const dump = async (q) => { const p = await b.newPage({ viewport: { width: 640, height: 400 } }), errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&${q}`); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
  const d = await p.evaluate(() => { const O = window.__kfb.organ(), td = O.td, S = td.samples, J = td.joints || [], piece = []; for (let k = 0; k < J.length; k++) { const e = k + 1 < J.length ? J[k + 1].index : S.length; for (let i = J[k].index; i < e; i++) piece[i] = J[k].piece; }
    return { ti: O.W.trackInfo, S: S.map((q, i) => [q.s, ...q.p, ...q.T, ...q.U, ...q.R]), SL: S.map((q) => Object.keys(q.slots).sort().map((k) => q.slots[k])), piece }; });
  d.errs = errs; await p.close(); return d; };
const A = await dump('c4c=0'), B = await dump('c4c=1');
const NEW = /^c4_|_home_run$/;
// B read at A's arc length: linear between B's neighbouring stations (exact on straights; the split pieces shift B's stations by a fraction of ds)
const sB = B.S.map((r) => r[0]); let j = 0;
const acc = { out: { n: 0, dp: 0, dv: 0, dsl: 0 }, in: { n: 0, dp: 0, dv: 0, dsl: 0, slotKeys: new Set() } }; let missing = 0;
for (let i = 0; i < A.S.length; i++) { const a = A.S[i], s0 = a[0]; while (j + 1 < sB.length && sB[j + 1] <= s0 + 1e-9) j++; if (Math.abs(sB[j] - s0) > 1e-9 && j + 1 >= sB.length) { missing++; continue; }
  const j1 = Math.min(sB.length - 1, j + 1), t = sB[j1] > sB[j] ? Math.min(1, Math.max(0, (s0 - sB[j]) / (sB[j1] - sB[j]))) : 0, c = B.S[j].map((v, k) => v + (B.S[j1][k] - v) * t);
  const zone = NEW.test(B.piece[j] ?? '') || NEW.test(B.piece[j1] ?? '') || NEW.test(A.piece[i] ?? '') ? acc.in : acc.out; zone.n++;
  for (let k = 1; k < 4; k++) zone.dp = Math.max(zone.dp, Math.abs(a[k] - c[k])); for (let k = 4; k < a.length; k++) zone.dv = Math.max(zone.dv, Math.abs(a[k] - c[k]));
  A.SL[i].forEach((sa, k) => { const s0b = B.SL[j][k] || [], s1b = B.SL[j1][k] || []; sa.forEach((x, m) => { const y = (s0b[m] ?? NaN) + ((s1b[m] ?? NaN) - (s0b[m] ?? NaN)) * t, d = Math.abs(x - y); if (!(d <= 1e-9)) { zone.dsl = Math.max(zone.dsl, isNaN(d) ? 1e9 : d); if (zone === acc.in) zone.slotKeys.add(k); } }); }); }
acc.in.slotKeys = [...acc.in.slotKeys];
const R = { at: new Date().toISOString(), a: { q: 'c4c=0', ti: A.ti, n: A.S.length, errs: A.errs }, b: { q: 'c4c=1', ti: B.ti, n: B.S.length, errs: B.errs }, missing, outside: acc.out, newPieces: acc.in,
  lengthSame: Math.abs(A.S.at(-1)[0] - B.S.at(-1)[0]) < 1e-6 };
R.pass = R.lengthSame && missing === 0 && acc.out.dp <= 1e-3 && acc.out.dv <= 1e-6 && acc.out.dsl <= 1e-3 && B.ti.pass;
fs.writeFileSync(out, JSON.stringify(R, null, 1)); console.log(JSON.stringify({ pass: R.pass, lengthSame: R.lengthSame, missing, outside: acc.out, newPieces: acc.in, ringChecks: B.ti.pass, c4c: B.ti.c4c }));
await b.close();
