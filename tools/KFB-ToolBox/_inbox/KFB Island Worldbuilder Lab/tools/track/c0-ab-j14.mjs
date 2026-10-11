// Phase C · C0 (V-095, Steuerung 11.10.): research A/B of the ground transition city ↔ track, shown in the ORIGINAL J14 renderer
// (KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1, three 0.160 from unpkg as the cut ships it). Read only: no file of the
// cut is changed — Playwright serves the cut from disk (joins the stream / print parts in memory) and swaps
// lab-track/transition-profiles.v1.json per variant in the response.
// Where: the authored ground zone ZA (A_track_city, s 1470–1570, both sides) — T4's only ground-level city/track handoff. The
// research families are city→track; at ZA they are applied time-reversed (windows u → 1 − u, from/to swapped), because a zone's
// family also sets the region after it (transition-atlas.v1.js:58). Cameras: J14's own chase camera (placeCar(s, 0), mode fahren)
// at first / middle / last of the zone — identical per variant. No tuning.
// node tools/track/c0-ab-j14.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const HOME = process.env.HOME, J = path.join(HOME, 'Dropbox/CLAUDE/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1');
const RS = path.join(process.argv[3] ?? path.join(out, 'fixtures'));
const fix = (n) => JSON.parse(fs.readFileSync(path.join(RS, n), 'utf8'));
const FA = fix('KFB_T4_CITY_TRACK_GROUND_CANDIDATE_2026-10-10.json').family, FB = fix('KFB_T4_CITY_TRACK_GROUND_VARIANT_B_EXTENDED_HANDOFF_2026-10-10.json').family;
const TP0 = JSON.parse(fs.readFileSync(path.join(J, 'lab-track/transition-profiles.v1.json'), 'utf8'));
const reverse = (f) => ({ ...f, from: f.to, to: f.from, windows: Object.fromEntries(Object.entries(f.windows).map(([k, [a, b]]) => [k, [+(1 - b).toFixed(3), +(1 - a).toFixed(3)]])), notes: 'C0: research family applied time-reversed at ZA' });
const variants = {
  orig: TP0,
  A: { ...TP0, families: { ...TP0.families, X_research: reverse(FA) }, zones: TP0.zones.map((z) => (z.id === 'ZA' ? { ...z, family: 'X_research' } : z)) },
  B: { ...TP0, families: { ...TP0.families, X_research: reverse(FB) }, zones: TP0.zones.map((z) => (z.id === 'ZA' ? { ...z, family: 'X_research' } : z)) },
};
const joined = (rel) => Buffer.concat(fs.readdirSync(path.join(J, path.dirname(rel))).filter((f) => f.startsWith(path.basename(rel) + '.part')).sort().map((f) => fs.readFileSync(path.join(J, path.dirname(rel), f))));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.glb': 'model/gltf-binary', '.bin': 'application/octet-stream' };
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const S_AT = { first: 1478, middle: 1520, last: 1562 };
const report = { zone: TP0.zones.find((z) => z.id === 'ZA'), families: { A: reverse(FA), B: reverse(FB) }, shots: {} };
for (const [v, TP] of Object.entries(variants)) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); const logs = [];
  p.on('pageerror', (e) => logs.push('pageerror ' + e.message));
  await p.route('http://j14.local/**', async (r) => {
    const u = decodeURIComponent(new URL(r.request().url()).pathname).slice(1);
    if (u.startsWith('lab-track/transition-profiles.v1.json')) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(TP) });
    const f = path.join(J, u);
    if (fs.existsSync(f)) return r.fulfill({ status: 200, contentType: MIME[path.extname(f)] ?? 'application/octet-stream', body: fs.readFileSync(f) });
    if (fs.existsSync(f + '.part01')) return r.fulfill({ status: 200, contentType: MIME[path.extname(f)] ?? 'application/octet-stream', body: joined(u) });
    return r.fulfill({ status: 404, body: 'nf' });
  });
  await p.goto('http://j14.local/' + encodeURIComponent('KFB Joyride J14 · Travel Modes.dc.html'));
  await p.waitForFunction(() => window.__j12?.T?.S?.length, null, { timeout: 240000 }); await p.waitForTimeout(4000);
  const za = await p.evaluate(() => { const z = window.__j12.T.atlas?.Z?.ZA ?? null; return z ? { family: z.family, from: z.fam?.from, to: z.fam?.to } : null; });
  report.shots[v] = { atlasZA: za, logs };
  for (const [k, s] of Object.entries(S_AT)) {
    await p.evaluate((s) => { const a = window.__j12; a.setMode('fahren'); a.placeCar(s, 0, 0); }, s); await p.waitForTimeout(2500);
    const cv = await p.evaluateHandle(() => [...document.querySelectorAll('canvas')].sort((x, y) => y.width * y.height - x.width * x.height)[0]);
    await cv.asElement().screenshot({ path: `${out}/${v}_${k}.jpg`, type: 'jpeg', quality: 88 });
  }
  console.log(v, JSON.stringify(report.shots[v]));
  await p.close();
}
fs.writeFileSync(`${out}/c0-ab.json`, JSON.stringify(report, null, 1));
await b.close();
