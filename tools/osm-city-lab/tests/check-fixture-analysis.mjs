import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const id=process.argv[2];
if(!id||!/^[a-z0-9-]+$/.test(id)) throw new Error('Usage: node check-fixture-analysis.mjs <city-id>');
const analysis=JSON.parse(await fs.readFile(new URL(`../evidence/${id}-fixture-analysis.json`,import.meta.url),'utf8'));
assert.equal(analysis.fixtureSignals.residentialContext,true,'residential context missing');
assert.equal(analysis.fixtureSignals.intersection,true,'intersection missing');
assert.equal(analysis.fixtureSignals.accelerationCorridor,true,'>=120 m drive corridor missing');
assert.equal(analysis.fixtureSignals.roadTerrainEdge,true,'road/green edge signal missing');
console.log(`PASS check-fixture-analysis ${id}: residential + intersection + corridor + road/green edge`);
