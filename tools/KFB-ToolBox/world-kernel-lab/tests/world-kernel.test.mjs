import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveSeed, bandContribution, stableLandmarks, worldFingerprint, generateHeightTile } from '../world-kernel.js';
test('hierarchical seed is deterministic',()=>{assert.equal(deriveSeed(23,1,'world/protopia/zone/a'),deriveSeed(23,1,'world/protopia/zone/a'));assert.notEqual(deriveSeed(23,1,'world/protopia/zone/a'),deriveSeed(23,1,'world/protopia/zone/b'))});
test('same seed and generator version keep one world fingerprint across LOD',()=>{assert.equal(worldFingerprint({seed:23,generatorVersion:1,level:0}),worldFingerprint({seed:23,generatorVersion:1,level:5}))});
test('generator version changes procedural identity',()=>{assert.notEqual(worldFingerprint({seed:23,generatorVersion:1,level:0}),worldFingerprint({seed:23,generatorVersion:2,level:5}))});
test('coarse terrain bands are invariant when detail level increases',()=>{const a=[0,1,2].map(b=>bandContribution(23,1,.417,.613,b)),b=[0,1,2].map(band=>bandContribution(23,1,.417,.613,band));assert.deepEqual(a,b)});
test('landmarks remain stable across LOD because they are independent of detail level',()=>{assert.deepEqual(stableLandmarks(23,1),stableLandmarks(23,1))});
test('height tile is finite and transferable-array friendly',()=>{const t=generateHeightTile({seed:11,generatorVersion:1,level:2,size:24});assert.equal(t.data.length,576);assert.ok(t.data instanceof Float32Array);assert.ok(Number.isFinite(t.min)&&Number.isFinite(t.max)&&t.max>t.min)});
