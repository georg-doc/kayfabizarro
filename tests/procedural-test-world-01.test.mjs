import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root=new URL('../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/',import.meta.url);
const html=fs.readFileSync(new URL('PROCEDURAL_TEST_WORLD_01_SOURCE.html',root),'utf8');
const profile=JSON.parse(fs.readFileSync(new URL('WORLD_PROFILE.json',root),'utf8'));
const app=fs.readFileSync(new URL('../tools/KFB-ToolBox/worldbuilder/wb2-design-01/wb2d-app.js',import.meta.url),'utf8');
const adapterSource=fs.readFileSync(new URL('../tools/KFB-ToolBox/worldbuilder/world-integration-01/r2d-world.js',import.meta.url),'utf8');

test('procedural test world uses stable WorldBuilder and no Travel host',()=>{
  assert.match(html,/\.\.\/wb2-design-01\/wb2d-app\.js/);
  assert.doesNotMatch(html,/travel|globe-v13|card-start/i);
  assert.equal(profile.world.travelHost,false);
  assert.equal(profile.world.cardSystem,false);
});

test('legacy play owner is disabled only for this host profile',()=>{
  assert.match(html,/play:false/);
  assert.match(app,/const PLAY_ENABLED=/);
  assert.match(app,/if\(PLAY_ENABLED\)\{/);
  assert.match(app,/locomotion intentionally detached/);
});

test('test world boots source-derived R2D island profile',()=>{
  assert.match(html,/world:'r2d3'/);
  assert.equal(profile.r2d.seed,3);
  assert.equal(profile.r2d.donorBlob,'6952697d7d3c9cd159ac3fdd924f24fa333c904d');
});

test('future motion dock points to current KayKit-native Motion lane, not wi1-play',()=>{
  assert.equal(profile.futureMotionDock.pr,344);
  assert.equal(profile.futureMotionDock.legacyWi1Play,'DISABLED_IN_THIS_ENTRY');
});

test('source-proven procedural nature families are routed without claiming placement',()=>{
  assert.equal(profile.proceduralDesign.natureModules.length,2);
  assert.equal(profile.proceduralDesign.natureMountStatus,'SOURCE_PROVEN_P1_P2_GROUPING_MOUNTED_AND_BROWSER_VERIFIED');
});


test('R2D integration consumes pure source-derived world data and does not create a second renderer owner',()=>{
  const core=fs.readFileSync(new URL('../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/r2d-island-core.v1.js',import.meta.url),'utf8');
  const adapter=fs.readFileSync(new URL('../tools/KFB-ToolBox/worldbuilder/world-integration-01/r2d-world.js',import.meta.url),'utf8');
  assert.match(core,/donorBlob:'6952697d7d3c9cd159ac3fdd924f24fa333c904d'/);
  assert.match(core,/export function planIsland/);
  assert.match(core,/export function fields/);
  assert.doesNotMatch(core,/WebGLRenderer|new THREE\.Scene|requestAnimationFrame/);
  assert.doesNotMatch(adapter,/WebGLRenderer|new THREE\.Scene|requestAnimationFrame/);
  assert.match(adapter,/ST\.buildTrack\(THREE,P\.stream/);
  assert.match(app,/WORLD_ID\.startsWith\('r2d'\)/);
  assert.match(app,/WORLD\.baseHeightAt/);
});


test('R2D presentation adds floating body water and source-proven nature without a second renderer',()=>{
  const presentation=fs.readFileSync(new URL('../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/r2d-presentation.v1.js',import.meta.url),'utf8');
  assert.match(presentation,/buildIslandBody/);
  assert.match(presentation,/R2D floating island underside/);
  assert.match(presentation,/R2D pond/);
  assert.match(presentation,/R2D creek/);
  assert.match(presentation,/R2D waterfall/);
  assert.match(presentation,/environment-family-p1\.mjs/);
  assert.match(presentation,/environment-family-p2\.mjs/);
  assert.doesNotMatch(presentation,/WebGLRenderer|new THREE\.Scene|requestAnimationFrame|setAnimationLoop/);
  assert.match(adapterSource,/mountR2DPresentation/);
});


test('R2D building pads consume exact B1 donors through the existing facade owner',()=>{
  const b=fs.readFileSync(new URL('../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/r2d-buildings.v1.js',import.meta.url),'utf8');
  assert.match(b,/fixtureBlob:'1452f44920239e870091b1803c0d2bd183679881'/);
  assert.match(b,/b1\/compact-simple\/371401529-to-371401477/);
  assert.match(b,/b1\/ordinary-notched\/371401481-to-371401497/);
  assert.match(b,/b1\/large-complex\/371401488-to-371401495/);
  assert.match(b,/CITY\.buildCityLayer\(zone/);
  assert.match(b,/conflicts:new Set\(\)/);
  assert.match(b,/kfb-facade-rule-v1/);
  assert.doesNotMatch(b,/new THREE\.BoxGeometry|new THREE\.ShapeGeometry|WebGLRenderer|requestAnimationFrame/);
  assert.match(adapterSource,/mountR2DBuildings/);
});

test('R2D building adapter exposes support and collision facts without enabling a Player',()=>{
  const b=fs.readFileSync(new URL('../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/r2d-buildings.v1.js',import.meta.url),'utf8');
  assert.match(b,/city\.support\?\.apply/);
  assert.match(b,/const at=\(x,z\)=>/);
  assert.match(adapterSource,/solidAt\(x,z\)/);
  assert.match(adapterSource,/buildingAt\(x,z\)/);
  assert.equal(profile.world.play,false);
});
