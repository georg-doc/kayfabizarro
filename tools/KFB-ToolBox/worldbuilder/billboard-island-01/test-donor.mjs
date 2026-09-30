import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
const root = new URL('./', import.meta.url);
const original = await readFile(new URL('../../_inbox/KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r2/briefd/billboard-clay.js', root), 'utf8');
const source = await readFile(new URL('./body-donor.generated.js', root), 'utf8');
// Execute the actual pure resolver extracted from the donor, not a test facsimile.
function resolver(text) {
  const styles = text.slice(text.indexOf('export const STYLES ='), text.indexOf('const cornerOf ='));
  const anchor = text.slice(text.indexOf('const toW ='), text.indexOf('\n// ── Billboard-Instanz') > 0 ? text.indexOf('\n// ── Billboard-Instanz') : text.length);
  return vm.runInNewContext(styles.replaceAll('export ', '') + '\n' + anchor.replaceAll('export ', '') + '\nresolveAnchor;');
}
const resolve = resolver(source), old = resolver(original);
const spec = (bodyStyle = 'plain', extra = {}) => ({ bodyStyle, faceSize: {w:12,h:6}, scale:1, position:[0,0,0], rotation:[0,0,0], islandAnchor:{mode:'xz',x:0,z:0,groundSnap:{mode:'mean-of-posts'}}, ...extra });
const island = H => ({H, roadR:()=>25, ROAD_W:5, R_ISLAND:46});
test('original source SHA is locked and untouched', async () => {
  assert.equal(createHash('sha256').update(original).digest('hex'), '7d225a768a82b611b3bc303f88e44101437e1772f4b0a209701896254b58665d');
});
test('original defect reproduced: plain on 10m terrain lands at 5m', () => assert.equal(old(spec(),island(()=>10)).y,5));
for (const style of ['plain','tv','highway']) {
  test(style+' flat positive terrain mean is 10m', () => {
    const pose = resolve(spec(style),island(()=>10));
    assert.equal(pose.y,10); assert.equal(pose.ground.footDeltaMax,0);
  });
  test(style+' negative terrain mean is -6m', () => assert.equal(resolve(spec(style),island(()=>-6)).y,-6));
  test(style+' authored vertical offset retained', () => assert.equal(resolve(spec(style,{position:[0,2,0]}),island(()=>10)).y,12));
}
test('missing bodyStyle retains highway behaviour', () => {
  const s=spec(); delete s.bodyStyle;
  assert.equal(resolve(s,island(()=>7)).y,7);
});
test('plain slope evaluated at both feet, not only centre', () => {
  const p=resolve(spec(),island(x=>10+x)); assert.equal(p.y,10); assert.equal(p.ground.footDeltaMax,3.6); assert.equal(p.ground.spread,7.2);
});
test('TV scaled footprint retained', () => {
  const p=resolve(spec('tv',{scale:2}),island(x=>10+x)); assert.equal(p.y,10); assert.equal(p.ground.footDeltaMax,6);
});
test('explicit flat anchor override retained', () => assert.equal(resolve(spec('plain',{islandAnchor:{mode:'xz',y:3,groundSnap:{mode:'flat'}}}),island(()=>10)).y,3));
test('road anchor samples terrain at real foot count', () => {
  const p=resolve(spec('plain',{islandAnchor:{mode:'road',t:0.1,side:1,offsetFromKerb:9,groundSnap:{autoNudge:false}}}),island(()=>10));
  assert.equal(p.y,10); assert.ok(Number.isFinite(p.yaw)); assert.equal(p.ground.footDeltaMax,0);
});
test('rotation changes foot locations without corrupting mean', () => assert.equal(resolve(spec('plain',{rotation:[0,90,0]}),island(()=>10)).y,10));
test('only the one foot-mean line differs in the anchor', () => {
  const part=t=>t.slice(t.indexOf('const toW =')).split('// ── Billboard-Instanz')[0].trim();
  assert.equal(part(source),part(original).replace('0) / 4,','0) / feet.length,'));
});
test('no copied timing/material/content/terrain owner', () => {
  for (const forbidden of ['makeClayFamily','BillboardScheduler','paintFace','loadContent','buildIsland','requestAnimationFrame','setInterval']) assert.ok(!source.includes(forbidden),forbidden);
});
test('no font binary in runtime adapter', async () => {
  assert.ok(!(await readdir(root)).some(p=>/\.(otf|ttf|woff2?)$/.test(p)));
});
