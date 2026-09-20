import assert from 'node:assert/strict';
import {
  SCHEMA,
  RACE_FIELDS,
  sampleRaceSecondaryFacts,
} from './race-secondary-facts.v1.js';

const checks=[];
function check(name, fn){
  try{
    fn();
    checks.push({name,pass:true});
    console.log('PASS',name);
  }catch(error){
    checks.push({name,pass:false,error:String(error)});
    console.error('FAIL',name,error);
    throw error;
  }
}

const rest={speedNormalized:0,relativeAirflowVector:{x:0,y:0,z:0},timeSeconds:999,seed:'rest'};
const r0=sampleRaceSecondaryFacts(rest);

check('schema exact',()=>assert.equal(r0.schema,SCHEMA));
check('all current Race fields declared',()=>assert.deepEqual(RACE_FIELDS,[
  'longitudinalAcceleration','lateralAcceleration','angularVelocity','impactImpulse',
  'relativeAirflowVector','speedNormalized','stuntState'
]));
check('rest energy zero',()=>assert.equal(r0.energy,0));
check('rest root pitch zero',()=>assert.equal(r0.root.pitch,0));
check('rest root roll zero',()=>assert.equal(r0.root.roll,0));
check('rest root yaw zero',()=>assert.equal(r0.root.yaw,0));
check('rest tip pitch zero',()=>assert.equal(r0.tip.pitch,0));
check('rest tip roll zero',()=>assert.equal(r0.tip.roll,0));
check('rest tip yaw zero',()=>assert.equal(r0.tip.yaw,0));
check('rest flutter amplitude zero',()=>assert.equal(r0.flutter.amplitude,0));
check('rest flutter value zero',()=>assert.equal(r0.flutter.value,0));

const drive={
  speedNormalized:.78,
  relativeAirflowVector:{x:3,y:-1,z:-31},
  longitudinalAcceleration:6.5,
  lateralAcceleration:-4.2,
  angularVelocity:{x:.18,y:-.42,z:.12},
  impactImpulse:{strength:.3,side:-1},
  stuntState:{airborne:false,driftActive:true},
  timeSeconds:1.2345,
  seed:'frizzlebob-race',
};
const before=JSON.stringify(drive);
const a=sampleRaceSecondaryFacts(drive);
const b=sampleRaceSecondaryFacts(drive);

check('pure deterministic JSON',()=>assert.equal(JSON.stringify(a),JSON.stringify(b)));
check('input not mutated',()=>assert.equal(JSON.stringify(drive),before));
check('energy in range',()=>assert.ok(a.energy>=0&&a.energy<=1));
check('root bounded',()=>assert.ok(Object.values(a.root).every(v=>v>=-1&&v<=1)));
check('tip bounded',()=>assert.ok(Object.values(a.tip).every(v=>v>=-1&&v<=1)));
check('flutter bounded',()=>assert.ok(a.flutter.value>=-1&&a.flutter.value<=1&&a.flutter.amplitude>=0&&a.flutter.amplitude<=1));
check('stunt state cloned',()=>{
  assert.deepEqual(a.stuntState,drive.stuntState);
  assert.notEqual(a.stuntState,drive.stuntState);
});
check('forward travel airflow bends backward',()=>{
  const x=sampleRaceSecondaryFacts({speedNormalized:1,relativeAirflowVector:{x:0,y:0,z:-41},timeSeconds:0,seed:'x'});
  assert.ok(x.airflow.drag>.99);
  assert.ok(x.root.pitch>0);
});
check('reverse airflow reverses drag sign',()=>{
  const f=sampleRaceSecondaryFacts({speedNormalized:1,relativeAirflowVector:{x:0,y:0,z:-41},timeSeconds:0,seed:'x'});
  const r=sampleRaceSecondaryFacts({speedNormalized:1,relativeAirflowVector:{x:0,y:0,z:41},timeSeconds:0,seed:'x'});
  assert.equal(Math.sign(f.airflow.drag),1);
  assert.equal(Math.sign(r.airflow.drag),-1);
  assert.ok(f.root.pitch>r.root.pitch);
});
check('crosswind roll symmetry',()=>{
  const l=sampleRaceSecondaryFacts({speedNormalized:.8,relativeAirflowVector:{x:-20,y:0,z:-20},timeSeconds:0,seed:'sym'});
  const r=sampleRaceSecondaryFacts({speedNormalized:.8,relativeAirflowVector:{x:20,y:0,z:-20},timeSeconds:0,seed:'sym'});
  assert.ok(Math.abs(l.root.roll + r.root.roll)<1e-6);
});
check('airflow alone can energize stationary actor',()=>{
  const x=sampleRaceSecondaryFacts({speedNormalized:0,relativeAirflowVector:{x:0,y:0,z:-20},timeSeconds:0,seed:'wind'});
  assert.ok(x.energy>0);
});
check('seed changes flutter but not root target',()=>{
  const common={speedNormalized:.85,relativeAirflowVector:{x:0,y:0,z:-35},timeSeconds:.321};
  const x=sampleRaceSecondaryFacts({...common,seed:'ear-L'});
  const y=sampleRaceSecondaryFacts({...common,seed:'ear-R'});
  assert.equal(JSON.stringify(x.root),JSON.stringify(y.root));
  assert.notEqual(x.flutter.value,y.flutter.value);
});
check('time changes flutter without hidden state',()=>{
  const common={speedNormalized:.9,relativeAirflowVector:{x:0,y:0,z:-38},seed:'time'};
  const x=sampleRaceSecondaryFacts({...common,timeSeconds:.1});
  const y=sampleRaceSecondaryFacts({...common,timeSeconds:.2});
  const x2=sampleRaceSecondaryFacts({...common,timeSeconds:.1});
  assert.notEqual(x.flutter.value,y.flutter.value);
  assert.equal(JSON.stringify(x),JSON.stringify(x2));
});
check('scalar angular velocity maps to yaw',()=>{
  const x=sampleRaceSecondaryFacts({angularVelocity:2});
  assert.equal(x.normalized.angularVelocity.pitch,0);
  assert.ok(x.normalized.angularVelocity.yaw>0);
  assert.equal(x.normalized.angularVelocity.roll,0);
});
check('vector angular velocity maps all axes',()=>{
  const x=sampleRaceSecondaryFacts({angularVelocity:{x:1,y:-2,z:.5}});
  assert.ok(x.normalized.angularVelocity.pitch>0);
  assert.ok(x.normalized.angularVelocity.yaw<0);
  assert.ok(x.normalized.angularVelocity.roll>0);
});
check('impact clamps strength',()=>{
  const x=sampleRaceSecondaryFacts({impactImpulse:{strength:4,side:-1}});
  assert.equal(x.impact.strength,1);
  assert.equal(x.impact.side,-1);
});
check('extreme numeric input remains finite and bounded',()=>{
  const x=sampleRaceSecondaryFacts({
    speedNormalized:99,
    relativeAirflowVector:{x:1e9,y:-1e9,z:-1e9},
    longitudinalAcceleration:1e9,
    lateralAcceleration:-1e9,
    angularVelocity:{x:1e9,y:-1e9,z:1e9},
    impactImpulse:1e9,
    timeSeconds:1e9,
    seed:'extreme'
  });
  const values=[
    x.energy,x.root.pitch,x.root.roll,x.root.yaw,x.tip.pitch,x.tip.roll,x.tip.yaw,
    x.flutter.value,x.flutter.amplitude,x.flutter.frequencyHz
  ];
  assert.ok(values.every(Number.isFinite));
  assert.ok(Object.values(x.root).every(v=>Math.abs(v)<=1));
  assert.ok(Object.values(x.tip).every(v=>Math.abs(v)<=1));
});

console.log('KCC1A_TEST_RESULT',checks.filter(x=>x.pass).length+'/'+checks.length,'PASS');
