import assert from 'node:assert/strict';
import { EncounterBeatBus, createEncounterHost, ENCOUNTER_BEATS } from '../encounter-bus.js';
import { createMotionBeatAdapter, createChatterBeatAdapter, createResidentOfferProvider } from '../npc-life-01.adapters.js';

let assertions = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); assertions++; };
const eq = (a,b,msg) => { assert.deepEqual(a,b,msg); assertions++; };

function run({decision='accept', context={}}={}) {
  const bus = new EncounterBeatBus();
  const beats=[];
  bus.subscribe(e => beats.push(e.beat));
  const offerProvider = () => ({type:'kfb.resident.offer-ref', assetPath:'real/source.gltf'});
  const movement=[];
  const host=createEncounterHost({bus,offerProvider,movement:e=>movement.push([e.beat,e.progress]),durations:{approach:.1,greet:.1,offer:.1,react:.1,accept:.1,decline:.1,leave:.1}});
  const start=host.start({actorId:'toy-soldier',targetId:'goth-girl',targetKind:'resident',relationship:'neutral',decision,context});
  if(start.ok) for(let i=0;i<20 && host.isActive;i++) host.update(.11);
  return {beats,movement,start,host};
}

const accepted=run({decision:'accept'});
ok(accepted.start.ok,'accept encounter starts');
eq(accepted.beats,['approach','greet','offer','react','accept','leave'],'accept path is one linear beat chain');
ok(!accepted.host.isActive,'accept path releases host');
eq(accepted.host.busyIds,[],'accept path releases participants');
ok(accepted.movement.some(([b,p])=>b==='approach'&&p===1),'host owns approach movement progress');
ok(accepted.movement.some(([b,p])=>b==='leave'&&p===1),'host owns leave movement progress');

const declined=run({decision:'decline'});
eq(declined.beats,['approach','greet','offer','react','decline','leave'],'decline is the only branch');

const illegalBus=new EncounterBeatBus();
const illegalHost=createEncounterHost({bus:illegalBus});
eq(illegalHost.start({actorId:'a',targetId:'a'}),{ok:false,reason:'illegal'},'self encounter illegal');
eq(illegalHost.start({actorId:'a',targetId:'b',context:{combatLocked:true}}),{ok:false,reason:'illegal'},'combat lock blocks social encounter');

const busyBus=new EncounterBeatBus();
const busyHost=createEncounterHost({bus:busyBus,durations:{approach:10}});
ok(busyHost.start({actorId:'a',targetId:'b'}).ok,'first encounter reserves participants');
eq(busyHost.start({actorId:'c',targetId:'d'}),{ok:false,reason:'host-busy'},'single host refuses concurrent encounter');

const offers=createResidentOfferProvider({residentRecipes:[
  {residentId:'toy-soldier',signatureProps:[{id:'present_side',a:'present.gltf',role:'Sozial / zweites Präsent'}]},
  {residentId:'goth-girl',signatureProps:[]}
]});
const offer=offers({actorId:'toy-soldier'});
eq(offer.assetPath,'present.gltf','offer references resident source prop');
eq(offer.owner,'gift/reward-consumer','offer explicitly stays reward-owned');
eq(offers({actorId:'goth-girl'}),null,'resident without source offer returns none');

const motionCalls=[];
const motion=createMotionBeatAdapter({availableFor:()=>['Idle_A','Walking_A','Interact'],play:x=>motionCalls.push(x)});
eq(motion({beat:'approach',speakerId:'toy-soldier',actorId:'toy-soldier',encounterId:'e'}),'Walking_A','motion chooses compatible approach clip independently');
eq(motion({beat:'greet',speakerId:'toy-soldier',actorId:'toy-soldier',encounterId:'e'}),'Interact','motion chooses compatible greet clip independently');
eq(motionCalls.map(x=>x.clip),['Walking_A','Interact'],'motion transport receives chosen clips');

const chatterCalls=[];
const fakePhrases={zeile:(profile,field)=>`${profile}:${field}`};
const chatter=createChatterBeatAdapter({phrases:fakePhrases,profileFor:()=> 'townsfolk',showLine:x=>chatterCalls.push(x),rng:()=>0});
eq(chatter({beat:'greet',speakerId:'goth-girl',actorId:'toy-soldier',encounterId:'e'}),'townsfolk:idle','chatter maps beat to source field independently');
eq(chatter({beat:'approach',speakerId:'goth-girl',actorId:'toy-soldier',encounterId:'e'}),null,'approach remains silent');
eq(chatterCalls.length,1,'chatter emits only configured speaking beat');
eq(ENCOUNTER_BEATS,['approach','greet','offer','react','accept','decline','leave'],'public beat vocabulary fixed');

console.log(`NPC-LIFE-01 ${assertions}/${assertions} assertions PASS`);
