import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { normalizeOverpass } from '../src/osm/normalize.js';
import { buildConsumerScene } from '../src/export/scene-recipe.js';

const id=process.argv[2];
if(!id||!/^[a-z0-9-]+$/.test(id)) throw new Error('Usage: node check-city-snapshot.mjs <city-id>');
const DATA=new URL(`../data/${id}/`,import.meta.url);
const [raw,spec,prov,norm,scene]=await Promise.all([
  fs.readFile(new URL('source.overpass.json',DATA),'utf8').then(JSON.parse),
  fs.readFile(new URL('SOURCE_SPEC.json',DATA),'utf8').then(JSON.parse),
  fs.readFile(new URL('PROVENANCE.json',DATA),'utf8').then(JSON.parse),
  fs.readFile(new URL('normalized.json',DATA),'utf8').then(JSON.parse),
  fs.readFile(new URL(`../scenes/${id}.json`,import.meta.url),'utf8').then(JSON.parse)
]);
const rebuilt=normalizeOverpass(raw,spec,prov);
assert.deepEqual(rebuilt,norm);
assert.deepEqual(buildConsumerScene(rebuilt),scene);
assert.ok(norm.features.roads.length>0,'roads missing');
assert.ok(norm.features.buildings.length>0,'buildings missing');
assert.equal(norm.frame.units,'metre');
assert.ok(norm.bounds.sizeM.x <= spec.approxSizeM.eastWest + 1,`x bounds escaped bbox: ${norm.bounds.sizeM.x}`);
assert.ok(norm.bounds.sizeM.z <= spec.approxSizeM.northSouth + 1,`z bounds escaped bbox: ${norm.bounds.sizeM.z}`);
assert.equal(prov.attribution.license,'ODbL 1.0');
for(const b of norm.features.buildings) assert.ok(Number.isFinite(b.heightM)&&b.heightM>0);
console.log(`PASS check-city-snapshot ${id}: ${norm.features.roads.length} roads, ${norm.features.buildings.length} buildings`);
