// M2 zone measurement against J17 (concept C1b_C3 R1 table: "J17-Stream p1b.v2: markings / pads je 100 m zählen"): J17 donor stream vs the
// organ world's Track Core stream (td) as loaded in the game. node tools/track/m2-density.mjs <out.json>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2], J = JSON.parse(fs.readFileSync('donors/joyride-j17-staged/lab-track/data/p1b.v2.stream.json', 'utf8'));
const sum = (st) => { const S = st.samples, L = S[S.length - 1].s, per = (n) => +(n / L * 100).toFixed(2), by = {}, len = {};
  for (const m of st.markings || []) { by[m.at] = (by[m.at] ?? 0) + 1; len[m.at] = (len[m.at] ?? 0) + ((m.s1 ?? m.s0) - m.s0); }
  const bars = (st.markings || []).filter((m) => m.at === 'bars'), gaps = []; let prev = null; for (const m of [...bars].sort((a, b) => a.s0 - b.s0)) { if (prev != null) gaps.push(m.s0 - prev); prev = m.s0; }
  gaps.sort((a, b) => a - b); const pads = st.pads ?? [], surf = S.filter((q) => (q.prm?.surface ?? 1) >= 1).length / S.length;
  return { length_m: +L.toFixed(1), markings: by, markingsPer100m: Object.fromEntries(Object.entries(by).map(([k, v]) => [k, per(v)])), coverage_m: Object.fromEntries(Object.entries(len).map(([k, v]) => [k, +v.toFixed(1)])),
    bars: bars.length ? { per100m: per(bars.length), gapMed_m: +gaps[gaps.length >> 1]?.toFixed(1), gapMin_m: +gaps[0]?.toFixed(1), barLen: [...new Set(bars.map((b) => b.barLen))].slice(0, 6), span: [...new Set(bars.map((b) => b.span))].slice(0, 6), w: [...new Set(bars.map((b) => b.w))].slice(0, 6), styles: [...new Set(bars.map((b) => b.style))] } : null,
    pads: { n: pads.length, per100m: per(pads.length), sample: pads.slice(0, 2) }, styles: [...new Set((st.markings || []).map((m) => m.style))], roadShare: +surf.toFixed(3), transitions: (st.transitions || []).length };
};
const R = { at: new Date().toISOString(), j17: sum(J) };
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0'); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
const td = await p.evaluate(() => { const t = window.__kfb.organ().td; return { samples: t.samples.map((q) => ({ s: q.s, prm: { surface: q.prm?.surface } })), markings: t.markings, pads: t.pads, transitions: t.transitions, info: window.__kfb.organ().info?.markings }; });
await b.close(); R.organ = sum(td); R.organMarkInfo = td.info;
fs.writeFileSync(out, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R, null, 1).slice(0, 4000));
