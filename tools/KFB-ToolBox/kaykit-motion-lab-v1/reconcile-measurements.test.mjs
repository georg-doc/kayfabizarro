import test from 'node:test';
import assert from 'node:assert/strict';
import { compareNumeric, reconcileMeasurements, applyExplicitResolution } from '../kfb-lib/motion-measurement-reconcile.v1.js';

test('numeric comparison exposes deltas without choosing a winner',()=>{
  const r=compareNumeric({referenceSpeed:1},{referenceSpeed:1.1},'referenceSpeed');
  assert.equal(r.status,'BOTH_MEASURED_DELTA');
  assert.equal(r.resolution,'UNRESOLVED');
  assert.equal(r.existing,1);
  assert.equal(r.blender,1.1);
  assert.ok(r.deltaAbs>0);
  assert.ok(r.deltaRel>0);
});

test('exact numeric match can be marked matched without tolerance guessing',()=>{
  const r=compareNumeric({duration:0.8},{duration:0.8},'duration');
  assert.equal(r.status,'EXACT_MATCH');
  assert.equal(r.resolution,'MATCHED');
});

test('one-sided measurement stays unresolved',()=>{
  const r=compareNumeric({slipBody:0.02},{},'slipBody');
  assert.equal(r.status,'EXISTING_ONLY');
  assert.equal(r.resolution,'UNRESOLVED');
});

test('reconciler keeps existing HOLD semantic warning visible',()=>{
  const existing={schema:'x',clips:{Running_B:{referenceSpeed:0.28,autoStatus:'AUTO_METRIC_AMBIGUOUS_HOLD'}}};
  const blender={schema:'kfb.motion-blender-measurements/1',clips:[{clip:'Running_B',status:'MEASURED',referenceSpeed:0.3}]};
  const r=reconcileMeasurements(existing,blender,['Running_B']);
  assert.equal(r.readyForProfile,false);
  assert.ok(r.clips.Running_B.semanticWarnings.includes('EXISTING_SEMANTIC_STATUS_REQUIRES_REVIEW'));
  assert.equal(r.clips.Running_B.candidate,null);
});

test('missing required Blender measurement cannot disappear silently',()=>{
  const existing={clips:{Walking_A:{duration:1}}};
  const blender={clips:[{clip:'Walking_A',status:'FAILED_MEASUREMENT',duration:null},{clip:'Running_A',status:'UNAVAILABLE',duration:null}]};
  const r=reconcileMeasurements(existing,blender,['Walking_A','Running_A']);
  assert.ok(r.unresolved.includes('Running_A'));
  assert.equal(r.readyForProfile,false);
});

test('explicit resolution is a separate deliberate operation',()=>{
  const existing={clips:{Walking_A:{referenceSpeed:0.6}}};
  const blender={clips:[{clip:'Walking_A',status:'MEASURED',referenceSpeed:0.62}]};
  const r=reconcileMeasurements(existing,blender,['Walking_A']);
  assert.equal(r.clips.Walking_A.candidate,null);
  const resolved=applyExplicitResolution(r,{Walking_A:{referenceSpeed:'blender'}});
  assert.equal(resolved.clips.Walking_A.candidate.referenceSpeed,0.62);
  assert.equal(resolved.clips.Walking_A.resolution,'EXPLICIT_PARTIAL_RESOLUTION');
});
