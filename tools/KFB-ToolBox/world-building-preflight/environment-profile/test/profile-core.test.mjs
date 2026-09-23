import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SCHEMA, WHACKMAN_DUSK_CANDIDATE, diagnosticSnapshot, resolveLocalVisibility,
  selectNearestSources, torchIntensityAt
} from '../profile-core.mjs';
import {
  MATERIAL_PROFILE_SOURCE, MATERIAL_PROFILE_MATTE, applyMaterialProfile
} from '../material-profile.mjs';

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log(`PASS ${passed} · ${name}`); };

test('schema is kfb.environment-profile/1', () => assert.equal(SCHEMA, 'kfb.environment-profile/1'));
test('profile keeps material orthogonal', () => {
  assert.equal('materialProfileRef' in WHACKMAN_DUSK_CANDIDATE, false);
  assert.equal('roughness' in WHACKMAN_DUSK_CANDIDATE, false);
});
test('nearest-light pool never exceeds configured max', () => {
  const sources = Array.from({length: 12}, (_, i) => [i, 0, 0]);
  const selected = selectNearestSources(sources, [0,0,0], WHACKMAN_DUSK_CANDIDATE.torch.poolMax);
  assert.equal(selected.length, 6);
  assert.deepEqual(selected.map(x => x.index), [0,1,2,3,4,5]);
});
test('flicker is asynchronous across pool phases', () => {
  const a = torchIntensityAt(WHACKMAN_DUSK_CANDIDATE, 1.234, 0, 1);
  const b = torchIntensityAt(WHACKMAN_DUSK_CANDIDATE, 1.234, 1, 1);
  assert.notEqual(a, b);
  assert.ok(a > 0 && b > 0);
});
test('local visibility resolves independently from global dusk/fog', () => {
  const before = diagnosticSnapshot({ mode:'DUSK', localVisibility:0 });
  const after = diagnosticSnapshot({ mode:'DUSK', localVisibility:1 });
  assert.deepEqual(before.fog, after.fog);
  assert.equal(before.background, after.background);
  assert.equal(resolveLocalVisibility(WHACKMAN_DUSK_CANDIDATE, 1).intensity, 46);
});
test('matte candidate is reversible to source material', () => {
  const material = { isMeshStandardMaterial:true, roughness:.45, metalness:.2, envMapIntensity:1, clearcoat:.3, roughnessMap:{id:1}, metalnessMap:{id:2}, needsUpdate:false };
  const root = { traverse(cb){ cb({isMesh:true, material}); } };
  applyMaterialProfile(root, MATERIAL_PROFILE_MATTE);
  assert.equal(material.roughness, .94); assert.equal(material.metalness, 0); assert.equal(material.envMapIntensity, .15); assert.equal(material.clearcoat,0); assert.equal(material.roughnessMap,null);
  applyMaterialProfile(root, MATERIAL_PROFILE_SOURCE);
  assert.equal(material.roughness,.45); assert.equal(material.metalness,.2); assert.equal(material.envMapIntensity,1); assert.equal(material.clearcoat,.3); assert.deepEqual(material.roughnessMap,{id:1});
});
test('runtime has no WhackMan gameplay or MazeGraph dependency', () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(here, '..');
  const runtime = ['profile-core.mjs','material-profile.mjs','environment-rig.mjs','demo.mjs'].map(f => fs.readFileSync(path.join(root,f),'utf8')).join('\n');
  for (const forbidden of ['wm-gate-', 'wm-motor', 'MazeGraph', 'MazeMotor', 'wm-pursuers', 'wm-recipe']) assert.equal(runtime.includes(forbidden), false, forbidden);
});

test('source-truth calibration retained for P1 candidate', () => {
  assert.equal(WHACKMAN_DUSK_CANDIDATE.exposure, 1.0);
  assert.equal(WHACKMAN_DUSK_CANDIDATE.fog.density, 0.019);
  assert.equal(WHACKMAN_DUSK_CANDIDATE.torch.decay, 2);
  assert.equal(WHACKMAN_DUSK_CANDIDATE.torch.range, 18);
  assert.equal(WHACKMAN_DUSK_CANDIDATE.localVisibility.intensityMax, 46);
  assert.equal(WHACKMAN_DUSK_CANDIDATE.localVisibility.decay, 1.6);
});

console.log(`RESULT ${passed}/${passed} PASS`);
