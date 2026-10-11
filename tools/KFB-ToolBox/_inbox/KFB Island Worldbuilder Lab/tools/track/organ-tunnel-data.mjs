// C1b · tunnel data of the organ world: Track Core tunnels, rings per look, O1 portals per organ. node tools/track/organ-tunnel-data.mjs <out.json>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 600, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0'); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
const R = await p.evaluate(() => { const O = window.__kfb.organ(), td = O.td, S = td.samples, J = td.joints || [];
  const pieceAt = (i) => { let pc = ''; for (const j of J) if (j.index <= i) pc = j.piece; return pc; };
  const tunnels = (td.tunnels || []).map((t) => ({ ...t, len: +(S[t.i1].s - S[t.i0].s).toFixed(1), piece0: pieceAt(t.i0), piece1: pieceAt(t.i1), tun0: S[t.i0].tunnel, slots0: S[t.i0].slots }));
  const looks = td.tunnelLooks ? Object.fromEntries(Object.entries(td.tunnelLooks.looks || {}).map(([k, v]) => [k, { ring: v.ring, keys: Object.keys(v) }])) : null;
  const ringStat = (r) => r && { n: r.length, xMin: Math.min(...r.map((p) => p[0])), xMax: Math.max(...r.map((p) => p[0])), yMin: Math.min(...r.map((p) => p[1])), yMax: Math.max(...r.map((p) => p[1])) };
  return { N: S.length, ds: td.ds, closed: td.closed, tunnels, tunnelRings: (td.tunnelRings || []).map(ringStat), looks: looks && Object.fromEntries(Object.entries(looks).map(([k, v]) => [k, { ...ringStat(v.ring), keys: v.keys }])), tunnelLooksKeys: td.tunnelLooks ? Object.keys(td.tunnelLooks) : null,
    portals: O.W.built.map((B) => ({ id: B.id, mm: B.spec.mm, portals: (B.portals || []).map((q) => ({ p: q.p.toArray().map((x) => +x.toFixed(1)), piece: q.piece })), cutSpan: B.cutSpan })), tunLights: O.W.tunLights.length,
    pieces: [...new Set(J.map((j) => j.piece))].filter((x) => /tunnel/.test(x)) }; });
fs.writeFileSync(process.argv[2], JSON.stringify(R, null, 1)); console.log(JSON.stringify({ ...R, tunnels: R.tunnels.map((t) => ({ i0: t.i0, i1: t.i1, len: t.len, p0: t.piece0, p1: t.piece1, tun0: t.tun0 })) }, null, 1).slice(0, 5000));
await b.close();
