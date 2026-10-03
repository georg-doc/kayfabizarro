import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  buildForwardProfileFromLadder,
  ladderCrossCheckMeasurement,
} from '../kfb-lib/locomotion-ladder-profile.v1.js';
import {
  compileForwardBands,
  createMotionStateMachine,
  profileHealth,
} from '../kfb-lib/motion-state-machine.v1.js';
import { reconcileMeasurements } from '../kfb-lib/motion-measurement-reconcile.v1.js';

const ladder=JSON.parse(fs.readFileSync(new URL('./evidence/blender-ladder-02/LOCOMOTION_LADDER_02.json',import.meta.url),'utf8'));
const existing=JSON.parse(fs.readFileSync(new URL('./evidence/KCL_M1_MEASURED_PROFILE_CANDIDATE.json',import.meta.url),'utf8'));
const profile=buildForwardProfileFromLadder(ladder,{rigFamily:'Rig_Medium',speedSpace:'world'});

test('Ladder 02 becomes the exact five-rung technical forward profile',()=>{
  assert.deepEqual(profile.forwardOrder,['walk','jog','run.easy','run','sprint']);
  assert.equal(profile.states.walk.clip,'kfb_locomotion_walking_c');
  assert.equal(profile.states.jog.clip,'kfb_locomotion_jog_forward_a');
  assert.equal(profile.states['run.easy'].clip,'kfb_locomotion_slow_run_a');
  assert.equal(profile.states.run.clip,'kfb_locomotion_medium_run_a');
  assert.equal(profile.states.sprint.clip,'kfb_locomotion_sprint_a');
  assert.equal(profile.technicalForwardReady,true);
  assert.equal(profile.humanAccepted,false);
});

test('central handoff compiler reproduces Ladder 02 world-space handoffs from measured rate windows',()=>{
  const compiled=compileForwardBands(profile);
  const source=ladder.ladders.kfb_ladder_v2.Rig_Medium.forwardBands;
  assert.equal(Object.keys(compiled.transitions).length,4);
  for(const band of source){
    const state={walk:'walk',jog:'jog',runEasy:'run.easy',run:'run',sprint:'sprint'};
    const key=state[band.from]+'→'+state[band.to];
    const got=compiled.transitions[key];
    assert.equal(got.status,'MEASURED_OVERLAP_HYSTERESIS');
    assert.ok(Math.abs(got.downExit-band.handoffSpeedMs.world)<0.002,key+' lower');
    assert.ok(Math.abs(got.upEnter-band.handoffSpeedMs.world)<0.002,key+' upper');
  }
});

test('state machine can traverse the five-rung ladder without a consumer-local threshold table',()=>{
  const sm=createMotionStateMachine(profile);
  let r=sm.update({actualSpeed:0.8,localForwardSpeed:0.8,grounded:true,sprintIntent:false});
  assert.equal(r.semanticState,'walk');
  r=sm.update({actualSpeed:1.1,localForwardSpeed:1.1,grounded:true,sprintIntent:false});
  assert.equal(r.semanticState,'jog');
  r=sm.update({actualSpeed:1.5,localForwardSpeed:1.5,grounded:true,sprintIntent:false});
  assert.equal(r.semanticState,'run.easy');
  r=sm.update({actualSpeed:2.0,localForwardSpeed:2.0,grounded:true,sprintIntent:false});
  assert.equal(r.semanticState,'run');
  r=sm.update({actualSpeed:3.0,localForwardSpeed:3.0,grounded:true,sprintIntent:false});
  assert.equal(r.semanticState,'run');
  r=sm.update({actualSpeed:3.0,localForwardSpeed:3.0,grounded:true,sprintIntent:true});
  assert.equal(r.semanticState,'sprint');
});

test('phase offsets and human look choices remain explicit evidence',()=>{
  assert.ok(Number.isFinite(profile.transitions['walk→jog'].phaseOffset));
  assert.equal(profile.transitions['walk→jog'].sameFootAlignable,true);
  assert.equal(profile.lookChoices.jog.selected,'kfb_locomotion_jog_forward_a');
  assert.ok(profile.lookChoices.jog.alternatives.some((x)=>x.clip==='kfb_locomotion_jogging_a'));
  assert.equal(profile.lookChoices.run.humanAccepted,false);
  assert.equal(profile.lookChoices.sprint.humanAccepted,false);
});

test('old KCL same-clip values remain an unresolved cross-check, not an automatic winner',()=>{
  const cross=ladderCrossCheckMeasurement(ladder,'Rig_Medium');
  const required=cross.clips.map((x)=>x.clip);
  const scoped={...existing,clips:Object.fromEntries(required.filter((n)=>existing.clips[n]).map((n)=>[n,existing.clips[n]]))};
  const report=reconcileMeasurements(scoped,cross,required);
  assert.deepEqual(required.sort(),['Running_A','Walking_A']);
  assert.equal(report.clips.Walking_A.comparisons.referenceSpeed.status,'BOTH_MEASURED_DELTA');
  assert.equal(report.clips.Running_A.comparisons.referenceSpeed.status,'BOTH_MEASURED_DELTA');
  assert.equal(report.clips.Walking_A.candidate,null);
  assert.equal(report.clips.Running_A.candidate,null);
  assert.equal(report.readyForProfile,false);
});

test('forward evidence is technically ready but whole-character prototype health stays blocked by directional gaps',()=>{
  const h=profileHealth(profile);
  assert.equal(profile.technicalForwardReady,true);
  assert.equal(h.readyForPrototype,false);
  assert.ok(h.missing.includes('backward'));
  assert.ok(h.missing.includes('strafe.left'));
  assert.ok(h.missing.includes('strafe.right'));
});
