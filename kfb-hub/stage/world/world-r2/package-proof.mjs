import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const stage=path.resolve('kfb-hub/stage/world/world-r2');
const source=path.resolve('tools/KFB-ToolBox');
let count=0;
function ok(name,condition,detail=''){
  if(!condition) throw new Error(`FAIL ${name}${detail?` · ${detail}`:''}`);
  count++; console.log(`ok ${count} - ${name}${detail?` · ${detail}`:''}`);
}
const pairs=[
  ['worldbuilder/world-integration-01/w0-ink.js','runtime/worldbuilder/world-integration-01/w0-ink.js'],
  ['worldbuilder/world-integration-01/wd-donors.js','runtime/worldbuilder/world-integration-01/wd-donors.js'],
  ['worldbuilder/world-integration-01/wd-registry.js','runtime/worldbuilder/world-integration-01/wd-registry.js'],
  ['worldbuilder/world-integration-01/wd-sky.js','runtime/worldbuilder/world-integration-01/wd-sky.js'],
  ['worldbuilder/world-integration-01/wd1-city.js','runtime/worldbuilder/world-integration-01/wd1-city.js'],
  ['worldbuilder/world-integration-01/wd1-landmark.js','runtime/worldbuilder/world-integration-01/wd1-landmark.js'],
  ['worldbuilder/world-integration-01/wd1-names.js','runtime/worldbuilder/world-integration-01/wd1-names.js'],
  ['worldbuilder/world-integration-01/wd1-seam.js','runtime/worldbuilder/world-integration-01/wd1-seam.js'],
  ['worldbuilder/world-integration-01/wi1-actor.js','runtime/worldbuilder/world-integration-01/wi1-actor.js'],
  ['worldbuilder/world-integration-01/wi1-locomotion-contract.mjs','runtime/worldbuilder/world-integration-01/wi1-locomotion-contract.mjs'],
  ['worldbuilder/world-integration-01/wi1-play.js','runtime/worldbuilder/world-integration-01/wi1-play.js'],
  ['worldbuilder/world-integration-01/wi1-selftest.js','runtime/worldbuilder/world-integration-01/wi1-selftest.js'],
  ['worldbuilder/world-integration-01/wi1-world.js','runtime/worldbuilder/world-integration-01/wi1-world.js'],
  ['worldbuilder/world-integration-01/fixtures/huerth-crop-v0.json','runtime/worldbuilder/world-integration-01/fixtures/huerth-crop-v0.json'],
  ['worldbuilder/world-integration-01/fixtures/huerth-alstaedten-v0.json','runtime/worldbuilder/world-integration-01/fixtures/huerth-alstaedten-v0.json'],
  ['worldbuilder/world-integration-01/fixtures/cologne-dom-crop-v0.json','runtime/worldbuilder/world-integration-01/fixtures/cologne-dom-crop-v0.json'],
  ['worldbuilder/wb2-design-01/wb2d-app.js','runtime/worldbuilder/wb2-design-01/wb2d-app.js'],
  ['worldbuilder/wb2-design-01/wb2d-presentation.js','runtime/worldbuilder/wb2-design-01/wb2d-presentation.js'],
  ['worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_SOURCE.html','runtime/worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_SOURCE.html'],
  ['worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js','runtime/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js'],
  ['worldbuilder/presentation/wd-light.js','runtime/worldbuilder/presentation/wd-light.js'],
  ['worldbuilder/presentation/wd-look.js','runtime/worldbuilder/presentation/wd-look.js'],
  ['lib/edit-layer.js','runtime/lib/edit-layer.js']
];
const digest=(p)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const [a,b] of pairs) ok(`byte-identical ${b}`,digest(path.join(source,a))===digest(path.join(stage,b)));
const entry=fs.readFileSync(path.join(stage,'index.html'),'utf8');
ok('Stage source marker',entry.includes('58028b07d7618926c40ffaec3bd4053dc88c0efd'));
ok('Stage entry owns no replacement runtime',entry.includes('./runtime/worldbuilder/wb2-design-01/wb2d-app.js'));
const manifest=JSON.parse(fs.readFileSync(path.join(stage,'SOURCE.json'),'utf8'));
ok('SOURCE pins PR 190',manifest.source.pullRequest===190);
ok('SOURCE pins exact World r2 head',manifest.source.head==='58028b07d7618926c40ffaec3bd4053dc88c0efd');
ok('Clay/texture work is not a Stage blocker',manifest.scope.excluded.includes('Clay/texture source work'));
console.log(`WORLD R2 PACKAGE PASS ${count}/${count}`);
