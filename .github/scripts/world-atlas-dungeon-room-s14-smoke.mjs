import fs from 'node:fs';
import { chromium } from 'playwright';

const out = 'artifacts/world-atlas-dungeon-room-s14';
fs.mkdirSync(out, { recursive: true });
const url = 'http://127.0.0.1:4173/tools/world_atlas/source/KayKit_Dungeon_Room_Blueprint_S14.html';
const report = { url, checks: [], errors: [] };
const check = (name, pass, detail = null) => {
  report.checks.push({ name, pass: !!pass, detail });
  if (!pass) process.exitCode = 1;
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 820 } });
page.on('pageerror', e => report.errors.push('pageerror: ' + String(e)));
page.on('console', m => { if (m.type() === 'error') report.errors.push('console: ' + m.text()); });

try {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  check('local page HTTP response', !!response && response.ok(), response?.status());

  await page.waitForFunction(() =>
    !!window.__S14?.root && document.getElementById('hud')?.style.display === 'none',
    {}, { timeout: 180000 });

  const state = await page.evaluate(() => ({
    roomId: window.__S14.room?.id,
    rootChildren: window.__S14.root?.children?.length ?? 0,
    failedChecks: [...document.querySelectorAll('#checks .no')].map(x => x.textContent.trim()),
    visibleProps: window.__S14.root.children.filter(x => x.visible && x.userData.recipe?.layer === 'prop').length
  }));
  report.initialState = state;
  check('R02 room booted', state.roomId === 'R02', state.roomId);
  check('real room instances loaded', state.rootChildren >= 20, state.rootChildren);
  check('visible props loaded', state.visibleProps >= 8, state.visibleProps);
  check('S21 room checks have no red failures', state.failedChecks.length === 0, state.failedChecks);

  const before = await page.evaluate(() => {
    const n = window.__S14.root.children.find(x => x.visible && x.userData.recipe?.propId === 'truhe_auf');
    return n ? n.position.toArray() : null;
  });
  check('roundtrip test prop present', Array.isArray(before), before);

  const moved = await page.evaluate(() => window.__S14.editor.nudgeByPropId('truhe_auf', 0.1, 0, 0));
  report.editorMove = moved;
  check('editor patch emitted', /chest_gold/.test(moved.patch) && /id: 'truhe_auf'/.test(moved.patch), moved.patch);

  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() =>
    !!window.__S14?.root && document.getElementById('hud')?.style.display === 'none',
    {}, { timeout: 180000 });
  const after = await page.evaluate(() => {
    const n = window.__S14.root.children.find(x => x.visible && x.userData.recipe?.propId === 'truhe_auf');
    return {
      p: n ? n.position.toArray() : null,
      patch: window.__S14.editor.patchText()
    };
  });
  report.editorReload = after;
  check('editor correction survives reload',
    Array.isArray(after.p) && Math.abs((after.p[0] - before[0]) - 0.1) < 0.001,
    { before, after: after.p });
  check('reload reproduces recipe patch', /chest_gold/.test(after.patch), after.patch);

  await page.evaluate(() => localStorage.removeItem('kfb-world-atlas-s14-room-editor'));
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() =>
    !!window.__S14?.root && document.getElementById('hud')?.style.display === 'none',
    {}, { timeout: 180000 });

  const manifest = await page.evaluate(() => window.__S14.blenderManifest());
  report.manifest = {
    schema: manifest.schema,
    roomId: manifest.room?.id,
    instances: manifest.instances?.length,
    hiddenInstances: manifest.hiddenInstances?.length,
    assetSource: manifest.assetSources?.dungeon?.base
  };
  check('Blender manifest schema', manifest.schema === 'kfb.blender-room-manifest.v1', manifest.schema);
  check('Blender manifest room', manifest.room?.id === 'R02', manifest.room);
  check('Blender manifest carries real instances', manifest.instances?.length >= 20, manifest.instances?.length);
  check('asset source remains commit-pinned',
    /\/8948a06b75cb18c970599afb29b6a772315fad0e\//.test(manifest.assetSources?.dungeon?.base || ''),
    manifest.assetSources?.dungeon?.base);

  fs.writeFileSync(out + '/KFB_R02_blender_manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  await page.screenshot({ path: out + '/browser-r02.png', fullPage: true });
} catch (e) {
  report.errors.push(String(e?.stack || e));
  process.exitCode = 1;
} finally {
  check('no browser console/page errors', report.errors.length === 0, report.errors);
  fs.writeFileSync(out + '/browser-report.json', JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
