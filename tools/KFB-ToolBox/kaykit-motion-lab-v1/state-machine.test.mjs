import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deriveHandoff,
  compileForwardBands,
  createMotionStateMachine,
  profileHealth,
} from '../kfb-lib/motion-state-machine.v1.js';

const measuredMedium={
  preferredPhaseFoot:'left',
  warpDuringGaitCrossfade:true,
  forwardOrder:['walk','walk.fast','run','sprint'],
  transitions:{
    'walk→walk.fast':{fade:0.2,syncPhase:true},
    'walk.fast→run':{fade:0.2,syncPhase:true},
    'run→sprint':{fade:0.15,syncPhase:true},
    'any→jump.start':{fade:0.08}
  },
  states:{
    idle:{role:'idle',clip:'Idle_A',status:'SOURCE'},
    start:{role:'start',clip:null,status:'TRANSITION_ONLY'},
    walk:{role:'walk',clip:'Walking_A',status:'MEASURED_TECHNICAL_CANDIDATE',referenceSpeed:0.610950956910957,playbackRange:[0.45,1.8]},
    'walk.fast':{role:'walk.fast',clip:'Walking_A',status:'PROFILE_VARIANT',referenceSpeed:0.610950956910957,playbackRange:[0.45,1.8]},
    run:{role:'run',clip:'Running_A',status:'MEASURED_TECHNICAL_CANDIDATE',referenceSpeed:2.480274167012876,playbackRange:[0.45,1.8]},
    sprint:{role:'sprint',clip:'Running_A',status:'PROFILE_VARIANT_PENDING_BLENDER_VALIDATION',referenceSpeed:2.480274167012876,playbackRange:[0.45,1.8]},
    stop:{role:'stop',clip:null,status:'TRANSITION_ONLY'},
    backward:{role:'backward',clip:'Walking_Backwards',status:'PENDING_BLENDER_VALIDATION'},
    'strafe.left':{role:'strafe.left',clip:'Running_Strafe_Left',status:'PENDING_BLENDER_VALIDATION'},
    'strafe.right':{role:'strafe.right',clip:'Running_Strafe_Right',status:'PENDING_BLENDER_VALIDATION'},
    turn:{role:'turn',clip:null,status:'PENDING_SOURCE'},
    'jump.start':{role:'jump.start',clip:'Jump_Start',status:'PENDING_BLENDER_VALIDATION'},
    'jump.air':{role:'jump.air',clip:'Jump_Idle',status:'PENDING_BLENDER_VALIDATION'},
    'jump.land':{role:'jump.land',clip:'Jump_Land',status:'PENDING_BLENDER_VALIDATION'},
  }
};

test('measured Walk/Run technical windows expose the known narrow gap instead of inventing overlap',()=>{
  const h=deriveHandoff(measuredMedium.states.walk,measuredMedium.states.run);
  assert.equal(h.status,'MEASURED_GAP_NO_SAFE_OVERLAP');
  assert.ok(h.gap>0.015 && h.gap<0.018, String(h.gap));
});

test('overlapping measured windows become a data-derived hysteresis band',()=>{
  const h=deriveHandoff(
    {referenceSpeed:1,playbackRange:[0.8,1.4]},
    {referenceSpeed:1.2,playbackRange:[0.8,1.4]}
  );
  assert.equal(h.status,'MEASURED_OVERLAP_HYSTERESIS');
  assert.ok(h.downExit<h.upEnter);
  assert.equal(h.downExit,0.96);
  assert.equal(h.upEnter,1.4);
});

test('missing measurements stay pending',()=>{
  const h=deriveHandoff({referenceSpeed:null,playbackRange:null},measuredMedium.states.run);
  assert.equal(h.status,'PENDING_MEASUREMENT');
  assert.equal(h.upEnter,null);
});

test('state machine uses actual speed and emits start transition below measured walk window',()=>{
  const sm=createMotionStateMachine(measuredMedium);
  const r=sm.update({actualSpeed:0.05,localForwardSpeed:0.05,grounded:true});
  assert.equal(r.semanticState,'start');
  assert.equal(r.presentationState,'walk');
  assert.equal(r.clip,'Walking_A');
});

test('state machine chooses backward and strafe from real local velocity direction',()=>{
  const sm=createMotionStateMachine(measuredMedium);
  let r=sm.update({actualSpeed:0.5,localForwardSpeed:-0.5,localSideSpeed:0,grounded:true});
  assert.equal(r.semanticState,'backward');
  r=sm.update({actualSpeed:0.5,localForwardSpeed:0.1,localSideSpeed:-0.5,grounded:true});
  assert.equal(r.semanticState,'strafe.left');
});

test('sprint intent gates sprint; no number-key or consumer clip table is involved',()=>{
  const synthetic=structuredClone(measuredMedium);
  synthetic.states.walk={...synthetic.states.walk,referenceSpeed:1,playbackRange:[0.5,2]};
  synthetic.states['walk.fast']={...synthetic.states['walk.fast'],referenceSpeed:1.3,playbackRange:[0.5,2]};
  synthetic.states.run={...synthetic.states.run,referenceSpeed:2,playbackRange:[0.5,2]};
  synthetic.states.sprint={...synthetic.states.sprint,referenceSpeed:3,playbackRange:[0.5,2]};
  const sm=createMotionStateMachine(synthetic);
  let r=sm.update({actualSpeed:5,localForwardSpeed:5,grounded:true,sprintIntent:false});
  assert.equal(r.semanticState,'run');
  r=sm.update({actualSpeed:5,localForwardSpeed:5,grounded:true,sprintIntent:true});
  assert.equal(r.semanticState,'sprint');
});

test('jump lifecycle overrides horizontal gait while consumer keeps trajectory ownership',()=>{
  const sm=createMotionStateMachine(measuredMedium);
  sm.update({actualSpeed:1,localForwardSpeed:1,grounded:true});
  let r=sm.update({actualSpeed:1,localForwardSpeed:1,grounded:false,verticalVelocity:2,jumpPhase:'start'});
  assert.equal(r.semanticState,'jump.start');
  r=sm.update({actualSpeed:1,localForwardSpeed:1,grounded:false,verticalVelocity:-1,jumpPhase:'air'});
  assert.equal(r.semanticState,'jump.air');
  r=sm.update({actualSpeed:0.5,localForwardSpeed:0.5,grounded:true});
  assert.equal(r.semanticState,'jump.land');
});

test('health report refuses to call the current profile prototype-ready while Blender/human evidence is open',()=>{
  const h=profileHealth(measuredMedium);
  assert.equal(h.readyForPrototype,false);
  assert.ok(h.pendingMeasurements.includes('sprint'));
  assert.ok(h.missing.includes('turn')===false);
});

test('forward-band compiler contains only profile-derived thresholds',()=>{
  const b=compileForwardBands(measuredMedium);
  assert.deepEqual(b.order,['walk','walk.fast','run','sprint']);
  assert.equal(Object.keys(b.transitions).length,3);
});
