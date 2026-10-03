import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const lab=fs.readFileSync(new URL('./lab.mjs',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');

test('Motion Lab imports the central motion-state owner',()=>{
  assert.match(lab,/createMotionStateMachine/);
  assert.match(lab,/\.\.\/kfb-lib\/motion-state-machine\.v1\.js/);
});

test('old local speed-band threshold formula is gone',()=>{
  assert.doesNotMatch(lab,/function speedBandProposal/);
  assert.doesNotMatch(lab,/idleExit=w\*\.25/);
  assert.doesNotMatch(lab,/runExit=runEnter\*\.82/);
});

test('auto-state button delegates to the central state machine',()=>{
  assert.match(lab,/applyCentralAutoState/);
  assert.match(lab,/motionMachine\.update/);
  assert.match(lab,/document\.getElementById\('applyAuto'\)\.onclick=\(\)=>applyCentralAutoState\(\)/);
});

test('Motion Lab snapshot exposes the SSOT owner explicitly',()=>{
  assert.match(lab,/motionState:'kfb-lib\/motion-state-machine\.v1\.js'/);
  assert.match(lab,/stateMachine:\{schema:MOTION_STATE_SCHEMA/);
});

test('UI no longer presents hysteresis as a local tunable owner',()=>{
  assert.match(html,/SSOT measured-window hysteresis/);
  assert.match(html,/id="hysteresis"[^>]*disabled/);
  assert.match(html,/Apply central motion state/);
});
