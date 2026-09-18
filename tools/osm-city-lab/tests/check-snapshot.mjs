import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { normalizeOverpass } from '../src/osm/normalize.js';
import { buildConsumerScene } from '../src/export/scene-recipe.js';
const DATA=new URL('../data/ehrenfeld-v0/',import.meta.url);
const [raw,spec,prov,norm,scene]=await Promise.all([
  fs.readFile(new URL('source.overpass.json',DATA),'utf8').then(JSON.parse),
  fs.readFile(new URL('SOURCE_SPEC.json',DATA),'utf8').then(JSON.parse),
  fs.readFile(new URL('PROVENANCE.json',DATA),'utf8').then(JSON.parse),
  fs.readFile(new URL('normalized.json',DATA),'utf8').then(JSON.parse),
  fs.readFile(new URL('../scenes/ehrenfeld-v0.json',import.meta.url),'utf8').then(JSON.parse)
]);
const rebuilt=normalizeOverpass(raw,spec,prov);
assert.deepEqual(rebuilt,norm);
assert.deepEqual(buildConsumerScene(rebuilt),scene);
assert.ok(norm.features.roads.length>0,'roads missing');
assert.ok(norm.features.buildings.length>0,'buildings missing');
assert.equal(norm.frame.units,'metre');
assert.equal(prov.attribution.license,'ODbL 1.0');
for(const b of norm.features.buildings) assert.ok(Number.isFinite(b.heightM) && b.heightM>0);
console.log(`PASS check-snapshot: ${norm.features.roads.length} roads, ${norm.features.buildings.length} buildings, deterministic cached regeneration`);
