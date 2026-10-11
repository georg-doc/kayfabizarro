// Stufe 1 · measured before any image leaves this session (STAGE1_R2D_PORT_PLAN §6 + QA_CRITIC_PROTOCOL_R1 §1b Q1–Q8).
// One headless Chrome at a time (watchdog in browser.mjs). Writes <run>/qcheck.json and <run>/shots/*.jpg.
//   . tools/env.sh && node tools/stage1/qcheck.mjs docs/critic/lab-stage1/2026-10-10_01
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { openLab } from './browser.mjs';
import { camsInPage, camS3InPage } from './cams.mjs';
import { seamScanInPage } from './seam-scan.mjs';

const RUN = process.argv[2] ?? 'docs/critic/lab-stage1/' + new Date().toISOString().slice(0, 10) + '_01';
const SHOTS = path.join(RUN, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });
const H = 3.64, r3 = (v) => +(+v).toFixed(3);
const df = execSync('df -g /System/Volumes/Data').toString().trim().split('\n').pop().split(/\s+/);
const freeGB = +df[3];
if (freeGB < 40) { console.error('ABORT: only', freeGB, 'GB free (rule §0.8: no run under 40 GB)'); process.exit(4); }
const Q = { schema: 'kfb.qcheck/1', slice: 'lab-stage1', run: path.basename(RUN), at: new Date().toISOString(), machine: execSync('sysctl -n hw.model').toString().trim(), diskFreeGB: freeGB,
  swap: execSync('sysctl vm.swapusage').toString().trim(), hard: {}, Q: {}, islands: {}, recipe: {}, adapter: {}, errors: {}, shots: [] };

const SIG = () => { const k = window.__kfb, out = {};
  for (const [id, isl] of k.app.islands) { let h = 0; for (const n of ['ground', 'under']) { const p = isl.group.getObjectByName(n)?.geometry.attributes.position.array ?? []; for (let i = 0; i < p.length; i += 7) h = (h * 31 + Math.round(p[i] * 1000)) | 0; } out[id] = h; }
  return out; };

// ---------------------------------------------------------------- A · MVP-1 world: measurements + shots
{
  const notFound = [];
  const { page, errors, close } = await openLab('world=mvp1&shot=1&bg=b0c6d8');
  page.on('response', (r) => { if (r.status() === 404) notFound.push(r.url()); });
  await page.reload({ waitUntil: 'load' }); await page.waitForFunction(() => window.__kfb?.ready, null, { timeout: 180000 });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)));
  for (const id of ['kfb_town', 'protopia']) Q.islands[id] = await page.evaluate((id) => ({ info: window.__kfb.r2d(id), qcheck: window.__kfb.qcheck(id) }), id);
  Q.placeholders = await page.evaluate(() => window.__kfb.placeholders());
  Q.fragments = await page.evaluate(() => ['kfb_town', 'protopia'].flatMap((id) => window.__kfb.qcheckFragments(id)));
  Q.recipe.exported = await page.evaluate(() => ({ kfb_town: window.__kfb.exportRecipe('kfb_town'), protopia: window.__kfb.exportRecipe('protopia') }));
  Q.recipe.sigBefore = await page.evaluate(SIG);
  const sets = { kfb_town: ['I1', 'I2', 'I3', 'I4', 'I5', 'N1_kante_lauf', 'N2_kante_unten', 'N3_scholle_unten', 'N4_wegrand_lauf', 'N5_platzhalter_fuss', 'N6_bruch'], protopia: ['I1', 'I2', 'I3', 'I4', 'I5', 'N1_kante_lauf', 'N2_kante_unten', 'N3_scholle_unten', 'N4_wegrand_lauf', 'N6_bruch'] };
  for (const [id, names] of Object.entries(sets)) {
    // solo per island so the other island never stands in the frame
    await page.evaluate((id) => { for (const [k, isl] of window.__kfb.app.islands) isl.group.visible = k === id; }, id);
    const cams = await page.evaluate(`(${camsInPage.toString()})(${JSON.stringify(id)})`);
    for (const n of names) {
      // G5: labelled scale reference (figure 1 H + K2 door) in I2 and I5, 15–22 ahead of the camera and to one side, facing
      // it, never on a building's pad or path (first free spot)
      if (n === 'I2' || n === 'I5') await page.evaluate(([id, c]) => { const isl = window.__kfb.app.islands.get(id), P = isl.spec.pos, dx = c.look[0] - c.pos[0], dz = c.look[2] - c.pos[2], l = Math.hypot(dx, dz) || 1, ux = dx / l, uz = dz / l;
        const cx = c.pos[0] - P[0], cz = c.pos[2] - P[2], free = (x, z) => isl.spec.buildings.every((b) => Math.hypot(x - b.x, z - b.z) > b.pad + 5) && isl.field.paths.every((pp, k) => pp.every((q) => Math.hypot(x - q[0], z - q[1]) > isl.field.pathW[k] / 2 + 3)) && isl.field.sd(x, z) > 6;
        let best = [cx + ux * 16 + uz * 4, cz + uz * 16 - ux * 4];
        outer: for (const d of [21, 18, 25, 15]) for (const s of [4, -4, 7, -7]) { const x = cx + ux * d + uz * s, z = cz + uz * d - ux * s; if (free(x, z)) { best = [x, z]; break outer; } }
        return window.__kfb.scaleRef(id, best[0], best[1], Math.atan2(-ux, -uz)); }, [id, cams[n]]);
      else await page.evaluate(() => window.__kfb.scaleRef(null));
      await page.evaluate((c) => window.__kfb.setCamera(c), cams[n]);
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 300)))));
      const file = `${id}_${n}.jpg`;
      await page.screenshot({ path: path.join(SHOTS, file), type: 'jpeg', quality: 92 });
      Q.shots.push({ file, island: id, camera: n, pos: cams[n].pos.map(r3), look: cams[n].look.map(r3), fov: cams[n].fov });
      if (id === 'kfb_town' && (n === 'N4_wegrand_lauf' || n === 'I5' || n === 'N1_kante_lauf')) {
        Q.chroma ??= {};
        Q.chroma[n] = await page.evaluate((id) => window.__kfb.chroma(id, [0, 0.45, 1, 1]), id);
      }
    }
  }
  await page.evaluate(() => window.__kfb.scaleRef(null));
  // Fugen-Test (Steuerung 10.10., hard rule): pixel scan across the joint top net ↔ body (end of the roll, wall foot, shared
  // seam ring) from N1, N2, I3, I4 per island, solo. Luminance step beyond the local gradient and thin-line contrast, p95
  // per camera (cameras with < 5 visible samples count as not applicable); ≥ 30 samples per island.
  Q.fuge = { thresholds: { stepP95: 0.04, lineP95: 0.03, minSamplesPerCam: 5, minSamplesPerIsland: 30 }, islands: {} };
  for (const id of ['kfb_town', 'protopia']) {
    await page.evaluate((id) => { for (const [k, isl] of window.__kfb.app.islands) isl.group.visible = k === id; }, id);
    const cams = await page.evaluate(`(${camsInPage.toString()})(${JSON.stringify(id)})`), res = {};
    for (const c of ['N1_kante_lauf', 'N2_kante_unten', 'I3', 'I4']) res[c] = await page.evaluate(`(${seamScanInPage.toString()})(${JSON.stringify(id)}, ${JSON.stringify(cams[c])})`);
    const T = Q.fuge.thresholds, used = Object.values(res).filter((r) => r.samples >= T.minSamplesPerCam), n = Object.values(res).reduce((a, r) => a + r.samples, 0);
    Q.fuge.islands[id] = { cams: res, samples: n, pass: n >= T.minSamplesPerIsland && used.every((r) => r.stepP95 <= T.stepP95 && r.lineP95 <= T.lineP95) };
  }
  // Silhouette set (QA §3, Georg 10.10.): S1 flight distance, S2 race-track height, S3 both side by side; black on white, no landmark
  await page.evaluate(() => window.__kfb.silhouette(true));
  for (const id of ['kfb_town', 'protopia']) {
    await page.evaluate((id) => { for (const [k, isl] of window.__kfb.app.islands) isl.group.visible = k === id; }, id);
    const cams = await page.evaluate(`(${camsInPage.toString()})(${JSON.stringify(id)})`);
    for (const n of ['S1_flug', 'S2_racetrack']) {
      await page.evaluate((c) => window.__kfb.setCamera(c), cams[n]); await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 300)))));
      await page.screenshot({ path: path.join(SHOTS, `${id}_${n}.jpg`), type: 'jpeg', quality: 92 }); Q.shots.push({ file: `${id}_${n}.jpg`, island: id, camera: n, pos: cams[n].pos.map(r3), look: cams[n].look.map(r3), fov: cams[n].fov });
    }
  }
  await page.evaluate(() => { for (const isl of window.__kfb.app.islands.values()) isl.group.visible = true; });
  { const c = await page.evaluate(`(${camS3InPage.toString()})()`); await page.evaluate((c) => window.__kfb.setCamera(c), c); await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
    await page.screenshot({ path: path.join(SHOTS, 'S3_beide.jpg'), type: 'jpeg', quality: 92 }); Q.shots.push({ file: 'S3_beide.jpg', island: 'beide', camera: 'S3', pos: c.pos.map(r3), look: c.look.map(r3), fov: c.fov }); }
  await page.evaluate(() => window.__kfb.silhouette(false));
  // frame budget: whole MVP-1 world in view, 3 s
  await page.evaluate(() => { for (const isl of window.__kfb.app.islands.values()) isl.group.visible = true; window.__kfb.setCamera({ pos: [150, 260, 700], look: [150, -40, -20], fov: 38 }); });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));
  Q.frame = await page.evaluate(() => window.__kfb.stats());
  Q.errors.mvp1 = { page: errors.filter((e) => !e.includes('404')), kfb: await page.evaluate(() => window.__kfb.errors), notFound: [...new Set(notFound)] };
  await close();
}
// ---------------------------------------------------------------- B · recipe: reload, import, same ids + same island
{
  const { page, close } = await openLab('world=mvp1&shot=1');
  const res = await page.evaluate(async (rec) => {
    const k = window.__kfb;
    for (const id of [...k.app.islands.keys()]) k.app.removeIsland(id);
    const ids = [];
    for (const r of Object.values(rec)) ids.push(await k.importRecipe(JSON.parse(JSON.stringify(r))));
    return { ids, recipesAgain: { kfb_town: k.exportRecipe('kfb_town'), protopia: k.exportRecipe('protopia') } };
  }, Q.recipe.exported);
  Q.recipe.sigAfter = await page.evaluate(SIG);
  Q.recipe.idsAfter = res.ids;
  Q.recipe.sameRecipe = JSON.stringify(res.recipesAgain) === JSON.stringify(Q.recipe.exported);
  Q.recipe.sameIsland = JSON.stringify(Q.recipe.sigAfter) === JSON.stringify(Q.recipe.sigBefore);
  const R = Q.recipe.exported;
  Q.recipe.fields = Object.fromEntries(Object.entries(R).map(([id, r]) => [id, { worldId: r.worldId, decks: r.decks, residents: r.residents.map((x) => x.id), anchors: r.anchors.map((a) => a.id + ':' + a.kind), nodes: r.nodes.length, sizeMC: r.sizeMC, playerState: Object.keys(r).filter((k) => /wallet|collection|reputation|access|encounter|save/i.test(k)) }]));
  Q.recipe.pass = Q.recipe.sameRecipe && Q.recipe.sameIsland && Q.recipe.idsAfter.join() === 'kfb_town,protopia';
  await close();
}
// ---------------------------------------------------------------- C · road bed T1/T2 on rkit_hub (the only island with a kfb.road-bed/1)
{
  const { page, errors, close } = await openLab('shot=1&hub=1&solo=rkit_hub');
  Q.islands.rkit_hub = await page.evaluate(() => ({ info: window.__kfb.r2d('rkit_hub'), qcheck: window.__kfb.qcheck('rkit_hub') }));
  Q.errors.rkit_hub = errors.filter((e) => !e.includes('404'));
  await close();
}
// ---------------------------------------------------------------- D · Georg's world on R2D with the Environment kit (adapter, K2, sizes)
{
  const { page, errors, close } = await openLab('shot=1&env=kit');
  await page.evaluate(() => new Promise((r) => setTimeout(r, 2500)));
  Q.adapter.envCheck = await page.evaluate(() => window.__kfb.envCheck());
  Q.adapter.k2Doors = await page.evaluate(() => window.__kfb.k2Doors());
  Q.adapter.sizes = await page.evaluate(() => window.__kfb.sizes());
  Q.adapter.contacts = await page.evaluate(() => Object.fromEntries([...window.__kfb.app.islands.keys()].map((id) => [id, window.__kfb.qcheck(id).contacts])));
  Q.adapter.terrain = await page.evaluate(() => window.__kfb.terrainMode());
  Q.errors.world = { page: errors.filter((e) => !e.includes('404')), kfb: await page.evaluate(() => window.__kfb.errors) };
  await close();
}
// ---------------------------------------------------------------- E · probes still run on the facade
for (const p of ['probe.html', 'probe2.html']) {
  try { const { errors, close } = await openLab('shot=1', { path: p }); Q.errors[p] = errors.filter((e) => !e.includes('404')); await close(); }
  catch (e) { Q.errors[p] = ['load: ' + String(e).slice(0, 200)]; }
}

// ---------------------------------------------------------------- verdicts
const T = Q.islands.kfb_town.qcheck, P = Q.islands.protopia.qcheck, RH = Q.islands.rkit_hub.qcheck;
const env = Q.adapter.envCheck, envBad = Object.entries(env).filter(([, c]) => c && (c.floating || c.inRoadBed || c.inPath || c.inWater || c.sinkOut));
// Stufe-1 islands decide Q1/Q3; Georg's world is reported as info (legacy buildings, seated figures sit on their host)
const contactsAllK = [...T.contacts, ...P.contacts], contactsAll = contactsAllK.filter((c) => c.kind !== 'fragment'), fragGaps = contactsAllK.filter((c) => c.kind === 'fragment');
const worldContacts = Object.values(Q.adapter.contacts).flat();
const sizes = Object.entries(Q.adapter.sizes).filter(([k]) => k.startsWith('r-')).map(([k, v]) => [k, +(v[1] / H).toFixed(2)]);
const ch = Q.chroma ?? {};
const errs = Object.values(Q.errors).flatMap((e) => Array.isArray(e) ? e : [...(e.page ?? []), ...(e.kfb ?? [])]);
Q.hard = {
  noGradients: { shader: 'Übergänge nur über kfbSpeckleLayer (2D Oberseite) bzw. kfbSpeckleLayer3 (Scholle); kein transparent/alpha an Gelände-Materialien',
    pixelTest: ch,
    rule: 'Mischung zweier Rollen erzeugt einen Farbton, den keine Rolle hat (Licht/Relief ändern nur Helligkeit und Sättigung). offHueAreaPct = Fläche (≥ 8 von 9 Nachbarn) mit Farbton > 12° neben jeder Rolle; Übergangsbilder ≤ reines Gras + 0,1 %-Punkte. offHuePct (inkl. 1–2-px-Kantenglättung) nur zur Info',
    pass: ['N4_wegrand_lauf', 'I5'].every((k) => (ch[k]?.offHueAreaPct ?? 99) <= (ch.N1_kante_lauf?.offHueAreaPct ?? 0) + 0.1) },
  noHardCut: { town: T.hard.edge, protopia: P.hard.edge, rkit_hub: RH.hard.edge, pass: T.hard.edge.pass && P.hard.edge.pass && RH.hard.edge.pass },
  scholle: { town: T.hard.scholle, protopia: P.hard.scholle, rkit_hub: RH.hard.scholle, pass: T.hard.scholle.pass && P.hard.scholle.pass && RH.hard.scholle.pass },
  road: { island: 'rkit_hub', ...RH.road, pass: RH.road.T1.pass && RH.road.T2.pass },
  scale: { doors: Q.adapter.k2Doors.min, residentsInH: sizes, pass: Q.adapter.k2Doors.pass && sizes.every(([, h]) => h >= 0.8 && h <= 1.1) },
  budget: { terrainMeshes: { town: T.hard.budget.terrainMeshes, protopia: P.hard.budget.terrainMeshes }, frame: Q.frame, machine: Q.machine, pass: T.hard.budget.pass && P.hard.budget.pass && Q.frame.fps >= 30 },
  adapter: { envCheckBad: envBad.map(([k]) => k), errors: errs, pass: envBad.length === 0 && errs.length === 0 },
};
const placeholderOk = Q.placeholders.unlabelled.length === 0;
const sharp = [T.q5, P.q5].flatMap((x) => Object.values(x));
Q.Q = {
  Q1: { what: 'nichts schwebt (Gebäude, Platzhalter, Brückenkopf, Bewohner, Natur, Relikte + Geröll); Brocken schweben gewollt mit klarem Abstand ≥ 1,5', limit: '≤ 0,02 H', maxGap: r3(Math.max(...contactsAll.map((c) => c.minGap))),
    relics: contactsAll.filter((c) => c.kind === 'relic'), fragments: fragGaps, worldInfo: worldContacts, envFloating: Object.values(env).reduce((a, c) => a + (c?.floating ?? 0), 0),
    pass: contactsAll.every((c) => c.minGap <= 0.02 * H) && fragGaps.every((c) => c.minGap >= 1.5) && envBad.length === 0 },
  Q2: { value: 'n/a', reason: 'Stufe 1 hat keine Mauer-, Pflaster- oder Bogenverbände; Pflaster ist Sprenkel auf dem Gelände', pass: true },
  Q3: { what: 'keine Durchdringung', limit: '≤ 0,05 H', maxSink: r3(Math.max(...contactsAll.map((c) => c.maxSink))), exceptions: 'Platzhalter 0,15 eingelassen (Fundament, Brückenkopf am Hang tiefer); Relikte und Geröll absichtlich in den Körper gesetzt; Oberring der Scholle hinter der Rundung (ein Körper)', pass: contactsAll.every((c) => c.maxSink <= 0.05 * H || c.kind === 'placeholder' || c.kind === 'relic') },
  Q4: { value: 'n/a', reason: 'keine Bogensteine, Platten oder Kantensteine in Stufe 1', pass: true },
  Q5: { what: 'Steuerung 10.10. (a): Übergangszonen (Oberseite, Rundung, Wand, Lippe unter der Rundung) 0 Kanten > 45°; gestaltete Formkanten (Zapfen, v7-Facetten) ≤ 75°; 0 Falten',
    q5_transition: [T, P, RH].reduce((a, x) => a + (x.q5.ground.transitionOver45 ?? 0) + (x.q5.under.transitionOver45 ?? 0), 0),
    q5_designed: { over45: [T, P, RH].reduce((a, x) => a + (x.q5.under.designedOver45 ?? 0), 0), maxDeg: Math.max(...[T, P, RH].map((x) => x.q5.under.designedMaxDeg ?? 0)) },
    folds: sharp.reduce((a, x) => a + (x.folds ?? 0), 0), town: T.q5, protopia: P.q5, rkit_hub: RH.q5,
    get pass() { return this.q5_transition === 0 && this.q5_designed.maxDeg <= 75 && this.folds === 0; } },
  Q6: { what: 'Anschluss Straßenbett ↔ Gelände (rkit_hub), Höhensprung/Spalt ≤ 0,02 H bzw. Schürze', T1: RH.road.T1.aboveRoadKerbWalk, T2: RH.road.T2, pass: RH.road.T1.pass && RH.road.T2.pass },
  Q7: { what: 'keine unbeschrifteten Platzhalter', scan: Q.placeholders, pass: placeholderOk },
  Q8: { value: 'n/a', reason: 'keine Mauer- oder Pflastersteine, die vom Gelände angeschnitten werden könnten', pass: true },
};
// fragments (form §2b): same rim / Scholle / Q5 rules, plus star shape of the polar net (from run 03 on part of the verdict)
Q.fragmentsSummary = Q.fragments.map((f) => ({ id: f.id, starBad: f.star.bad, edge: f.hard.edge.pass, scholle: f.hard.scholle.pass,
  q5Transition: f.q5.ground.transitionOver45 + f.q5.under.transitionOver45, q5DesignedMax: f.q5.under.designedMaxDeg, folds: f.q5.ground.folds + f.q5.under.folds,
  pass: f.star.bad === 0 && f.hard.edge.pass && f.hard.scholle.pass && f.q5.ground.transitionOver45 + f.q5.under.transitionOver45 === 0 && f.q5.under.designedMaxDeg <= 75 && f.q5.ground.folds + f.q5.under.folds === 0 }));
Q.hard.fragments = { list: Q.fragmentsSummary, pass: Q.fragmentsSummary.every((f) => f.pass) };
Q.hard.fuge = { ...Q.fuge, pass: Object.values(Q.fuge.islands).every((i) => i.pass) };
Q.pass = Object.values(Q.hard).every((h) => h.pass) && Object.values(Q.Q).every((q) => q.pass) && Q.recipe.pass;
fs.writeFileSync(path.join(RUN, 'qcheck.json'), JSON.stringify(Q, null, 1));
console.log(JSON.stringify({ pass: Q.pass, hard: Object.fromEntries(Object.entries(Q.hard).map(([k, v]) => [k, v.pass])), Q: Object.fromEntries(Object.entries(Q.Q).map(([k, v]) => [k, v.pass])), recipe: Q.recipe.pass, chroma: Q.chroma, frame: Q.frame, notFound: Q.errors.mvp1.notFound, errs }, null, 1));
