import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { registerHooks } from 'node:module';
import { createHash } from 'node:crypto';
import { rotateEdges, rotateVerticalTopology, measuredSlope, extendHexCatalog,
  compareVerticalEdges, reportMeasuredSeam } from '../../../../world_atlas/source/lib/hex-levels.mjs';
const parent = 'fe45e3fbafec9180cd41a15ae824ee55af74e084';
const handoff = 'tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/';
const gridPath = 'tools/world_atlas/source/lib/hex-grid.js';
const bundlePath = handoff + 'data/HEX_BROWSER_MEASUREMENTS.json';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const originalText = execFileSync('git', ['show', parent + ':' + bundlePath], { maxBuffer: 4e6 }).toString();
const original = JSON.parse(originalText);
const candidate = read(bundlePath);
const measurements = read(handoff + 'BLENDER_RETURN/BLENDER_MEASUREMENTS.json');
const recipe = read(handoff + 'BLENDER_RETURN/SCENELET_RECIPE_2CELL.json');
const report = read(handoff + 'LEVEL_SLOPE/SEAM_REPORT.json');
const slopes = candidate.hexTiles.tiles.filter(t => t.verticalTopology);
// These are pure topology tests. No Three renderer is created/tested; the unused
// graphics dependency is isolated explicitly, never substituted in a runtime build.
const graphicsHook = registerHooks({ resolve(specifier, context, next) {
  if (specifier === 'three') return { url: 'data:text/javascript,export%20const%20TEST_ONLY_NO_RENDERER%3Dtrue', shortCircuit: true };
  return next(specifier, context);
} });
const grid = await import('../../../../world_atlas/source/lib/hex-grid.js');
const oldGrid = await import('data:text/javascript;base64,' + execFileSync('git', ['show', parent + ':' + gridPath]).toString('base64'));
graphicsHook.deregister();
const byKey = key => slopes.find(t => t.key === key);
// Synthetic flat fixtures test the contract; they are NOT catalog/asset replacements.
const flat = (height = 0, kinds = 'gggggg') => ({ topology: { kinds }, verticalTopology: {
  units: 'hex-native', frame: 'three.js-y-up', tileFlatToFlat: 2,
  edgeDeckY: Array(6).fill(height), centerDeckY: height, levelLow: height, levelHigh: height,
  slopeAxisLowEdge: null, fullEdgeProfilesMeasured: true,
  edgeProfilesY: Array.from({length:6}, () => [height,height,height]), profileSampleOffsets: [-0.4,0,0.4],
} });

test('Only four measured slope rows receive the additive field', () => {
  assert.equal(slopes.length, 4);
  assert.deepEqual(slopes.map(t=>t.key).sort(), Object.keys(measurements.slopes.rows).sort());
});
for (const tile of slopes) {
  test(`${tile.key}: exact measured heights, axis, centre, source and preparation`, () => {
    const v=tile.verticalTopology, m=measurements.slopes.rows[tile.key];
    assert.deepEqual(v.edgeDeckY,m.edgeMid0to5); assert.equal(v.centerDeckY,m.centre);
    assert.equal(v.slopeAxisLowEdge,3); assert.equal(v.levelLow,Math.min(...m.edgeMid0to5));
    assert.equal(v.levelHigh,Math.max(...m.edgeMid0to5)); assert.equal(v.admission,'PREPARE');
    assert.equal(v.source.commit,parent); assert.deepEqual(v.source.asset,tile.source);
    assert.equal(v.rotationalSymmetry,6); assert.equal(v.fullEdgeProfilesMeasured,false);
  });
  for(let n=0;n<6;n++) test(`${tile.key}: turn ${n} follows existing edge/grid convention`, () => {
    const v=rotateVerticalTopology(tile.verticalTopology,n);
    assert.equal(rotateEdges([...tile.topology.kinds],n).join(''),grid.rotKinds(tile.topology.kinds,n));
    for(let d=0;d<6;d++) assert.equal(v.edgeDeckY[(d+n)%6],tile.verticalTopology.edgeDeckY[d]);
    assert.equal(v.slopeAxisLowEdge,(3+n)%6); assert.equal(v.centerDeckY,tile.verticalTopology.centerDeckY);
    assert.deepEqual(rotateVerticalTopology(v,6-n),tile.verticalTopology);
  });
}
test('All 447 inventory records, source pins, topology and original fields are preserved', () => {
  const stripped=structuredClone(candidate); delete stripped.hexTiles.verticalContract;
  for(const tile of stripped.hexTiles.tiles) delete tile.verticalTopology;
  assert.deepEqual(stripped,original);
  assert.equal(candidate.s0.rows.length,447); assert.equal(candidate.hexTiles.inventory.length,447);
  assert.equal(candidate.hexTiles.tiles.length,256); assert.equal(new Set(candidate.s0.rows.map(t=>t.key)).size,447);
});
test('Historical 15/15 browser facts and 32 canonical edge rows remain unchanged', () => {
  assert.equal(candidate.provenance.browserTests,'15/15 PASS');
  assert.deepEqual(candidate.hexTiles.runtime,original.hexTiles.runtime);
  assert.deepEqual(grid.TILE_EDGES,oldGrid.TILE_EDGES); assert.equal(Object.keys(grid.TILE_EDGES).length,32);
  assert.equal(candidate.hexTiles.runtime.s1.measured,176);
  assert.equal(candidate.hexTiles.runtime.s1.coverage.partial,17);
  assert.equal(candidate.hexTiles.runtime.s1.coverage.unclassified,1);
});
test('Legacy placement audit output unchanged when no vertical records are provided', () => {
  const list=[{col:0,row:0,a:'a',open:1},{col:1,row:0,a:'b',open:8}];
  assert.deepEqual(grid.auditTileFit(list),oldGrid.auditTileFit(list));
});
test('Existing audit rejects the measured slope even when the open-edge mask fits', () => {
  const slope=byKey('hex|hex_grass_sloped_high');
  const result=grid.auditTileFit([{...flat(1),col:0,row:0,open:0}, {...slope,col:1,row:0,open:0}]);
  assert.equal(result.clean,false); assert.ok(result.bad.every(r=>r.vertical && !r.vertical.safeToPlace));
});
test('Explicit strict audit rejects missing vertical evidence', () => {
  const result=grid.auditTileFit([{col:0,row:0,open:0},{col:1,row:0,open:0}],{requireVertical:true});
  assert.equal(result.clean,false);
});
test('Flat full-edge equality matches at a known level', () => {
  for(const y of [0,0.5,1]) assert.equal(compareVerticalEdges(flat(y),flat(y),0).safeToPlace,true);
});
test('Flat edges at different levels are incompatible, not auto-lifted', () => {
  for(const y of [0.5,1]) assert.equal(compareVerticalEdges(flat(0),flat(y),0).status,'INCOMPATIBLE');
});
test('Low and high slope side heights cannot meet a flat floor', () => {
  for(const t of slopes) for(const d of [2,4]) for(const y of [0,0.5,1])
    assert.equal(compareVerticalEdges(t,flat(y,t.topology.kinds[d].repeat(6)),d).status,'INCOMPATIBLE');
});
test('Equal high midpoint does not falsely grant full-edge placement', () => {
  const r=compareVerticalEdges(byKey('hex|hex_grass_sloped_high'),flat(1),0);
  assert.equal(r.status,'MATCHED'); assert.equal(r.safeToPlace,false);
  assert.equal(r.reason,'MIDPOINT_ONLY_FULL_EDGE_UNPROVEN');
});
test('Source low-road midpoint matches zero but remains preparation only', () => {
  const r=compareVerticalEdges(byKey('hex|hex_road_A_sloped_low'),flat(0,'ssssss'),3);
  assert.equal(r.midpointGap,0); assert.equal(r.safeToPlace,false);
});
test('Explicit transition is required, never applied silently', () => {
  const r=compareVerticalEdges(flat(0),flat(1),0,{transition:{id:'measured-transition'}});
  assert.equal(r.status,'TRANSITION_REQUIRED'); assert.equal(r.safeToPlace,false); assert.equal(r.maxGap,1);
});
test('Facing edge profiles reverse the opposite tangent exactly once', () => {
  const a=flat(),b=flat(); a.verticalTopology.edgeProfilesY[0]=[0.1,0,0.2];
  b.verticalTopology.edgeProfilesY[3]=[0.2,0,0.1]; assert.equal(compareVerticalEdges(a,b,0).safeToPlace,true);
  b.verticalTopology.edgeProfilesY[3]=[0.1,0,0.2]; assert.equal(compareVerticalEdges(a,b,0).status,'INCOMPATIBLE');
});
test('Profile shape mismatch or a missing sample cannot grant placement', () => {
  const a=flat(), b=flat(); b.verticalTopology.edgeProfilesY[3]=[0,0];
  assert.equal(compareVerticalEdges(a,b,0).safeToPlace,false);
  b.verticalTopology.edgeProfilesY[3]=[0,null,0]; assert.equal(compareVerticalEdges(a,b,0).safeToPlace,false);
});
test('Edge classes still win over height equality', () => {
  assert.equal(compareVerticalEdges(flat(0,'gggggg'),flat(0,'ssssss'),0).status,'INCOMPATIBLE');
  assert.equal(compareVerticalEdges(flat(0,'??????'),flat(),0).status,'UNPROVEN');
});
test('Different scale/frame cannot be compared or implicitly rescaled', () => {
  const b=flat(); b.verticalTopology.units='WC1-metres';
  assert.equal(compareVerticalEdges(flat(),b,0).status,'INCOMPATIBLE');
});
test('Missing and non-finite evidence never becomes a pass', () => {
  assert.equal(compareVerticalEdges(flat(),{topology:{kinds:'gggggg'}},0).status,'UNPROVEN');
  const b=flat(); b.level=NaN; assert.equal(compareVerticalEdges(flat(),b,0).status,'UNPROVEN');
  assert.throws(()=>measuredSlope({edgeMid0to5:[0,0,NaN,0,0,0],centre:0},{}));
});
test('Tolerance cannot be enlarged to hide the known lip', () => {
  assert.throws(()=>compareVerticalEdges(flat(),flat(),0,{tolerance:0.2}));
  assert.throws(()=>compareVerticalEdges(flat(),flat(),0,{tolerance:NaN}));
});
test('Negative/multiple turns normalize; fractional turns and wrong size reject', () => {
  assert.deepEqual(rotateEdges([0,1,2,3,4,5],-1),rotateEdges([0,1,2,3,4,5],5));
  assert.deepEqual(rotateEdges([0,1,2,3,4,5],12),[0,1,2,3,4,5]);
  assert.throws(()=>rotateEdges([0,1],0)); assert.throws(()=>rotateEdges([0,1,2,3,4,5],0.5));
});
test('Two-cell seam preserves measured 0.09 centre / 0.199 worst gap without moving geometry', () => {
  assert.deepEqual(report.seams,reportMeasuredSeam(recipe,report.seams[0].source));
  const seam=report.seams[0]; assert.equal(seam.centreStep,0.09); assert.equal(seam.maxStep,0.199);
  assert.equal(seam.status,'TRANSITION_REQUIRED'); assert.equal(seam.safeToTraverse,false);
  assert.equal(seam.geometryChanged,false); assert.equal(seam.recommendation,'MEASURED_TRANSITION_WITH_COLLISION_SURFACE');
});
test('Incomplete seam probes cannot be called matched', () => {
  const r=structuredClone(recipe); r.seams[0].deckStepAlongEdge[0]=null;
  assert.equal(reportMeasuredSeam(r,{} )[0].status,'UNPROVEN');
});
test('Catalog rebake is deterministic and additive after source agreement', () => {
  const source=candidate.hexTiles.verticalContract.source;
  const result=extendHexCatalog(original.hexTiles,measurements,source);
  for(const tile of result.tiles.filter(t=>t.verticalTopology)) tile.verticalTopology.contractStatus='PASS_ADDITIVE_DATA';
  assert.deepEqual(result,candidate.hexTiles);
  assert.equal(createHash('sha256').update(JSON.stringify(result)).digest('hex'),
    createHash('sha256').update(JSON.stringify(candidate.hexTiles)).digest('hex'));
});
