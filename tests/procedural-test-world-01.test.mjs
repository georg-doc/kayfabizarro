import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root=new URL('../tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/',import.meta.url);
const html=fs.readFileSync(new URL('PROCEDURAL_TEST_WORLD_01_SOURCE.html',root),'utf8');
const profile=JSON.parse(fs.readFileSync(new URL('WORLD_PROFILE.json',root),'utf8'));
const recipes=JSON.parse(fs.readFileSync(new URL('WORLD_RECIPES.json',root),'utf8'));
const app=fs.readFileSync(new URL('../tools/KFB-ToolBox/worldbuilder/wb2-design-01/wb2d-app.js',import.meta.url),'utf8');
const adapter=fs.readFileSync(new URL('../tools/KFB-ToolBox/worldbuilder/world-integration-01/r2d-world.js',import.meta.url),'utf8');
const arch=fs.readFileSync(new URL('r2d-archipelago.v1.js',root),'utf8');
const core=fs.readFileSync(new URL('r2d-island-core.v1.js',root),'utf8');
const pres=fs.readFileSync(new URL('r2d-presentation.v1.js',root),'utf8');
const buildings=fs.readFileSync(new URL('r2d-buildings.v1.js',root),'utf8');

test('current host is the four-island WB2 profile and not Travel',()=>{
  assert.match(html,/world:'r2d4'/);assert.match(html,/play:true/);
  assert.doesNotMatch(html,/travel|globe-v13|card-start/i);
  assert.equal(profile.world.travelHost,false);assert.equal(profile.world.cardSystem,false);assert.equal(profile.world.play,true);
});
test('world recipe set has exactly four stable nodes and three Track Core road bridges',()=>{
  assert.equal(recipes.schema,'kfb.world-recipe-set/0.1');
  assert.deepEqual(recipes.nodes.map(x=>x.id),['world.kfb-town','world.dystopia','world.utopia','world.protopia']);
  assert.equal(recipes.connections.length,3);
  assert.ok(recipes.connections.every(x=>x.kind==='ROAD_BRIDGE'&&x.from==='world.kfb-town'));
  assert.ok(recipes.connections.every(x=>x.trackCore==='64d8597c3dad1dc9814c794d4a566d589e1e1a25'));
});
test('satellite deck and first-card seeds are canonical',()=>{
  const by=Object.fromEntries(recipes.nodes.map(x=>[x.id,x]));
  assert.equal(by['world.dystopia'].deckId,'ignore_dystopia');
  assert.equal(by['world.dystopia'].cardRefs[0],'ignore_dystopia:1');
  assert.equal(by['world.utopia'].deckId,'forget_utopia');
  assert.equal(by['world.utopia'].cardRefs[0],'forget_utopia:1');
  assert.equal(by['world.protopia'].deckId,'embrace_protopia');
  assert.equal(by['world.protopia'].cardRefs[0],'embrace_protopia:1');
});
test('Golden Journey anchors are data fixtures, not mounted Residents',()=>{
  const ids=recipes.nodes.flatMap(x=>x.anchors.map(a=>a.id));
  for(const id of ['town.spawn.market','town.resident.clown.onboarding','town.resident.driver.taxi','town.vehicle.taxi.01','dystopia.party.pentagram','dystopia.party.orc-singer','utopia.monstrosity.throne','utopia.robot.works','protopia.farm.social-core','protopia.lorekeeper.plateau','billboard.town','billboard.dystopia','billboard.utopia','billboard.protopia'])assert.ok(ids.includes(id),id);
});
test('archipelago is pure world data and delegates bridges to Track Core CONNECT',()=>{
  assert.match(arch,/makeIslandCore/);assert.match(arch,/TC\.compileRecipe\(recipe\)/);assert.match(arch,/type:'CONNECT'/);assert.match(arch,/ROAD_BRIDGE/);
  assert.doesNotMatch(arch,/WebGLRenderer|new THREE\.Scene|requestAnimationFrame|setAnimationLoop/);
});
test('R2D core remains exact pure donor seam',()=>{
  assert.match(core,/donorBlob:'6952697d7d3c9cd159ac3fdd924f24fa333c904d'/);
  assert.match(core,/export function planIsland/);assert.match(core,/export function fields/);
  assert.doesNotMatch(core,/WebGLRenderer|new THREE\.Scene|requestAnimationFrame/);
});
test('WB2 remains renderer/world owner and the KayKit entry bypasses legacy play',()=>{
  assert.match(app,/const PLAY_ENABLED=/);assert.match(app,/if\(PLAY_ENABLED\)\{/);assert.match(app,/locomotion intentionally detached/);
  assert.match(adapter,/archipelagoWorld/);assert.match(adapter,/ST\.buildTrack\(THREE,c\.stream/);
  assert.doesNotMatch(adapter,/WebGLRenderer|new THREE\.Scene|requestAnimationFrame/);
  assert.equal(profile.futureMotionDock.pr,344);assert.equal(profile.futureMotionDock.legacyWi1Play,'DISABLED_IN_THIS_ENTRY');
});
test('presentation and building owners are reused rather than rebuilt',()=>{
  assert.match(pres,/environment-family-p1\.mjs/);assert.match(pres,/environment-family-p2\.mjs/);
  assert.match(buildings,/loadRegistered\(record\)/);assert.match(buildings,/adaptRegistered\(model/);assert.doesNotMatch(buildings,/huerth-b1|osm-city-lab|elastic-grotesque/);
  assert.match(buildings,/plan\.worldId/);assert.doesNotMatch(buildings,/new THREE\.BoxGeometry|new THREE\.ShapeGeometry|WebGLRenderer|requestAnimationFrame/);
});
test('global bigger-picture reference is routed into the world recipe fixture',()=>{
  assert.equal(recipes.globalReference,'skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md');
  assert.equal(recipes.layout.pullDontGate,true);
});

// Execute the actual archipelago support reader without constructing a renderer.
const archSupportBody=adapter.slice(adapter.indexOf('function archipelagoWorld')).match(/groundAt\(x,z,terrainHeight\)\{([\s\S]*?)\},\n    solidAt/)[1];
const supportReader=new Function('arch','nearestBridge','insideNode','x','z','terrainHeight',archSupportBody);
test('visible Track bridgehead remains supported beyond the island SDF',()=>{
  const arch={nodes:[{plan:{hw:5,roadY:-8.4,roadDist:(x,z)=>Math.abs(x-73)}}]};
  const absentIsland=()=>null,bridge=()=>null;
  for(const z of [140.207,146,146.125,150])assert.equal(supportReader(arch,bridge,absentIsland,73,z,-44),-8.4);
  assert.equal(supportReader(arch,bridge,absentIsland,80,146,-44),-44,'water outside the actual road remains unsupported');
});
test('bridge deck priority and sculpted island height remain owned by the same Ground reader',()=>{
  const arch={nodes:[{plan:{hw:5,roadY:.6,roadDist:()=>0}}]};
  assert.equal(supportReader(arch,()=>({d:0,q:{p:[0,4,0],prm:{width:10.8}}}),()=>null,0,0,-44),4);
  assert.equal(supportReader(arch,()=>null,()=>null,0,0,1.2),1.2);
});
