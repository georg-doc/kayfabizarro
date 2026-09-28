import * as THREE from 'three';
import {loadResidentSceneModule,mountResidentSceneModule} from '../../../../tools/resident_atlas/modules/runtime/s6-resident-module.js';

export const RESIDENT_SOCIAL_SOURCE=Object.freeze({
  schema:'kfb.resident-social-memory-source/1',
  contractPr:272,
  contractHead:'d48289a13fe63bab0e2226c67302210472b4c390',
  worldOwner:{pullRequest:267,head:'4e9096681b4f563c13a0bb71c27f83e6d1df3aeb'},
  residentModule:'tools/resident_atlas/modules/runtime/s6-resident-module.js',
  clownModule:'tools/resident_atlas/modules/clown-juggling-island.module.json',
  clownRuntimePin:'be4843354c5cf420ddecbb25ed5a51aa5f21ca18',
  residentAssetPin:'891eadf01e218f5fc21387e64cea1fec8332c5b6',
  animationPin:'aa16a777a970f23d3f11fb3c23dc40718b04fa88',
  dialogueOwner:'ChatterBox / semantic Triplets',
  persistenceOwner:'Journey / Almanac / receiving session owner',
  reactionOwner:'ToolBox Resident Reaction Choreography candidate PR #256'
});

export const AIDA_SEQUENCE=Object.freeze([
  'attention',
  'curiosity_interest',
  'expectation',
  'interaction',
  'reaction',
  'interpret_remember',
  'return_resume_retarget'
]);

const LOCAL_GOTH_DEF=Object.freeze({
  schema:'kfb.resident-scene-module/1',
  id:'world-m2a-goth-girl',
  title:'Goth Girl · World M2A consumer fixture',
  status:'consumer-local-source-backed',
  source:{residentId:'goth-girl'},
  scene:{position:[0,0,0],rotationYDeg:0,scale:1},
  support:{owner:'consumer',collisionOwnedByConsumer:true}
});

const CONFIG=Object.freeze({
  scanEverySec:.12,
  attentionRadiusM:15,
  expectationRadiusM:8,
  interactionRadiusM:4.8,
  leaveRadiusM:18,
  attentionDwellSec:.35,
  expectationTimeoutSec:5,
  interactionCooldownSec:2.4,
  routinePauseSec:.28,
  rememberDelaySec:.38,
  returnDelaySec:1.15,
  routineDelaySec:1.55,
  memoryPerResident:4,
  threadTurns:3
});

const SPEECH=Object.freeze({
  clown:{
    first:{
      triplet:['Three pins. Still airborne.','You interrupted the easy part.','Stay. I may need a witness.'],
      retorts:['Keep juggling.','Need a fourth?','I saw nothing.']
    },
    recall:{
      triplet:['Same Fluff. Same three pins.','You came back on purpose.','That makes this a pattern.'],
      retorts:['I remember.','Still no fourth pin.','Carry on.'],
      fluff:{surface:'Same Fluff. Same three pins.',omitted:'juggling routine',recoverableFrom:['visible:juggle-cascade-v1','memory:prior witnessed interaction']}
    }
  },
  'goth-girl':{
    first:{
      triplet:['The stool is not the stage.','You are standing in my light.','Fine. Make the interruption useful.'],
      retorts:['I can move.','I came for the show.','Point taken.']
    },
    recall:{
      triplet:['Same Fluff. Same bad angle.','You remembered the stage.','I noticed.'],
      retorts:['Better angle this time.','I remember.','No promises.'],
      fluff:{surface:'Same Fluff. Same bad angle.',omitted:'stage interruption',recoverableFrom:['visible:Goth Girl stage routine','memory:prior witnessed interaction']}
    }
  }
});

const MOTIVATIONS=Object.freeze({
  clown:{stable:'perform',goal:'finish the current three-club number',salience:{player:.78,event:.8,card:.55,prop:.65}},
  'goth-girl':{stable:'perform_and_socialize',goal:'hold the stage without losing the audience',salience:{player:.86,resident:.6,card:.62,event:.72}}
});

const v3=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function openAnchor(app,{ahead,side},fallbackIndex=0){
  const p=app.play.position,h=app.play.walker?.state?.heading||0;
  const f={x:Math.sin(h),z:Math.cos(h)},r={x:-Math.cos(h),z:Math.sin(h)};
  const attempts=[
    [ahead,side],[ahead+3,side],[ahead,side+(side>=0?3:-3)],[ahead-2,side*1.25],
    [10+fallbackIndex*3,(fallbackIndex?1:-1)*9]
  ];
  for(const [a,s] of attempts){
    const x=p.x+f.x*a+r.x*s,z=p.z+f.z*a+r.z*s;
    if(!app.world.solidAt(x,z))return {x,y:app.terrainHeightAt(x,z)+.02,z};
  }
  const x=p.x+r.x*(side||6),z=p.z+r.z*(side||6);
  return {x,y:app.terrainHeightAt(x,z)+.02,z};
}

function speechRequest(resident,hasMemory){
  const set=SPEECH[resident.id]?.[hasMemory?'recall':'first'];
  return {
    schema:'kfb.chatterbox-request/1-adapter',
    owner:'ChatterBox / semantic Triplets',
    speakerId:resident.id,
    language:'en',
    mode:'semantic-triplet',
    triplet:set?.triplet||[],
    selectableRetorts:set?.retorts||[],
    fluffOlect:set?.fluff||null,
    context:{
      aidaState:resident.state,
      motivation:resident.motivation.stable,
      goal:resident.motivation.goal,
      visibleActivity:resident.activityKind,
      priorWitnessedMemory:hasMemory
    }
  };
}

function emit(name,detail){
  window.dispatchEvent(new CustomEvent(name,{detail}));
}

export async function mountResidentSocialMemory({app,mobility}={}){
  if(!app?.scene||!app?.play||!mobility?.registerInteractionResolver)throw Error('RESIDENT-SOCIAL-MEMORY-01 needs World M2A + shared interaction resolver');

  const sourceBase='../../../../tools/resident_atlas/modules/';
  const clownDef=await loadResidentSceneModule(sourceBase+'clown-juggling-island.module.json');
  const anchors={
    clown:openAnchor(app,{ahead:11,side:-7},0),
    'goth-girl':openAnchor(app,{ahead:12,side:8},1)
  };
  const clownModule=await mountResidentSceneModule(clownDef,{parent:app.scene,anchor:{position:[anchors.clown.x,anchors.clown.y,anchors.clown.z],rotationYDeg:18}});
  const gothModule=await mountResidentSceneModule(LOCAL_GOTH_DEF,{parent:app.scene,anchor:{position:[anchors['goth-girl'].x,anchors['goth-girl'].y,anchors['goth-girl'].z],rotationYDeg:-20}});

  let time=0,scanClock=0,interactionSeq=0,disposed=false;
  const frustum=new THREE.Frustum(),proj=new THREE.Matrix4(),tmp=v3();
  const residents=[
    makeResident('clown','Clown',clownModule),
    makeResident('goth-girl','Goth Girl',gothModule)
  ];

  function makeResident(id,name,module){
    return {
      id,name,module,
      activityKind:module.activity?.kind||(id==='goth-girl'?'sit-wave-performance':'source-backed-routine'),
      motivation:MOTIVATIONS[id],
      state:'routine',stateSince:0,visible:false,distanceM:Infinity,interestScore:0,
      memory:[],thread:null,history:[{state:'routine',at:0,reason:'source-backed activity'}],
      cooldownUntil:0,activityResumeAt:0,rememberAt:0,returnAt:0,routineAt:0,
      pendingInteraction:null,interactions:0,meaningfulReceipts:0
    };
  }

  function transition(r,next,reason){
    if(r.state===next)return;
    r.state=next;r.stateSince=time;
    r.history.push({state:next,at:+time.toFixed(2),reason});
    if(r.history.length>16)r.history.shift();
    emit('kfb-resident-aida',{schema:'kfb.resident-aida-event/1',residentId:r.id,state:next,reason,at:+time.toFixed(2)});
  }

  function scan(){
    app.camera.updateMatrixWorld(true);
    proj.multiplyMatrices(app.camera.projectionMatrix,app.camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(proj);
    for(const r of residents){
      r.module.root.getWorldPosition(tmp);
      r.distanceM=tmp.distanceTo(app.play.position);
      r.visible=r.distanceM<=CONFIG.attentionRadiusM&&frustum.containsPoint(tmp);
      const motivationBias=r.motivation.salience.player||.5;
      r.interestScore=clamp((1-r.distanceM/CONFIG.attentionRadiusM)*.62+motivationBias*.38,0,1);
    }
  }

  function writeReceipt(r){
    if(!r.pendingInteraction||r.pendingInteraction.remembered)return null;
    const prior=r.memory.length>0;
    const receipt={
      schema:'kfb.journey-event-receipt/0.1-adapter',
      id:'resident-'+r.id+'-'+String(r.pendingInteraction.seq).padStart(3,'0'),
      eventType:'resident.interaction.witnessed',
      residentId:r.id,
      witnesses:['player',r.id],
      knowledge:'witnessed',
      meaningful:true,
      topic:r.id==='clown'?'juggling-interruption':'stage-interruption',
      motivation:r.motivation.stable,
      goal:r.motivation.goal,
      aida:AIDA_SEQUENCE,
      activity:r.activityKind,
      socialThread:{topic:r.thread?.topic||null,turn:r.thread?.turns||1},
      speech:speechRequest(r,prior),
      source:{contractPr:272,worldPr:267,residentAtlas:true}
    };
    r.memory.unshift(receipt);
    if(r.memory.length>CONFIG.memoryPerResident)r.memory.length=CONFIG.memoryPerResident;
    r.pendingInteraction.remembered=true;r.meaningfulReceipts++;
    emit('kfb-journey-event',receipt);
    return receipt;
  }

  function reactionRequest(r){
    const detail={
      schema:'kfb.resident-reaction-request/1-adapter',
      owner:'ToolBox Resident Reaction Choreography candidate PR #256',
      event:'social.interaction',
      residentId:r.id,
      context:{activity:r.activityKind,aidaState:r.state,motivation:r.motivation.stable},
      requestedLayers:['body','face','ears-if-present','emanata-if-present'],
      appliedByThisAdapter:['bounded routine pause/resume only'],
      noSecondMixer:true
    };
    emit('kfb-resident-reaction-request',detail);
    return detail;
  }

  function interactResident(residentId,meta={}){
    const r=residents.find(x=>x.id===residentId);
    if(!r)return {handled:false,reason:'RESIDENT_NOT_FOUND'};
    if(time<r.cooldownUntil)return {handled:true,action:'RESIDENT_ROUTINE_PRIORITY',residentId:r.id,cooldownSec:+(r.cooldownUntil-time).toFixed(2),memoryWrite:false};
    const prior=r.memory.length>0;
    interactionSeq++;r.interactions++;r.cooldownUntil=time+CONFIG.interactionCooldownSec;
    r.thread=r.thread&&time-r.thread.lastAt<30?r.thread:{topic:r.id==='clown'?'juggling witness':'stage interruption',turns:0,lastAt:time};
    r.thread.turns=Math.min(CONFIG.threadTurns,r.thread.turns+1);r.thread.lastAt=time;
    r.pendingInteraction={seq:interactionSeq,startedAt:time,remembered:false,meta};
    transition(r,'interaction','player used shared E interaction');
    r.module.setActivityEnabled(false);r.activityResumeAt=time+CONFIG.routinePauseSec;
    r.rememberAt=time+CONFIG.rememberDelaySec;r.returnAt=time+CONFIG.returnDelaySec;r.routineAt=time+CONFIG.routineDelaySec;
    const speech=speechRequest(r,prior);
    emit('kfb-chatterbox-request',speech);
    const reaction=reactionRequest(r);
    return {handled:true,action:'RESIDENT_INTERACTION',residentId:r.id,speech,reaction,memoryWrite:'scheduled'};
  }

  function updateState(r){
    if(r.activityResumeAt&&time>=r.activityResumeAt){r.module.setActivityEnabled(true);r.activityResumeAt=0;}
    if(r.pendingInteraction){
      const elapsed=time-r.pendingInteraction.startedAt;
      if(r.state==='interaction'&&elapsed>=.08)transition(r,'reaction','semantic reaction request emitted');
      if(r.rememberAt&&time>=r.rememberAt){
        transition(r,'interpret_remember','meaningful witnessed interaction qualifies for Lean Memory');
        writeReceipt(r);r.rememberAt=0;
      }
      if(r.returnAt&&time>=r.returnAt){transition(r,'return_resume_retarget','resume source-backed routine');r.returnAt=0;}
      if(r.routineAt&&time>=r.routineAt){transition(r,'routine','consumer returns resident to prior activity');r.routineAt=0;r.pendingInteraction=null;}
      return;
    }
    if(!r.visible||r.distanceM>CONFIG.leaveRadiusM){
      if(r.state!=='routine'&&r.state!=='return_resume_retarget')transition(r,'return_resume_retarget','attention target left bounded field');
      if(r.state==='return_resume_retarget'&&time-r.stateSince>.25)transition(r,'routine','resume prior path/activity');
      return;
    }
    if(r.state==='routine')transition(r,'attention','player entered visible attention field');
    else if(r.state==='attention'&&time-r.stateSince>=CONFIG.attentionDwellSec)transition(r,'curiosity_interest','player remains salient to current motivation');
    else if(r.state==='curiosity_interest'&&r.distanceM<=CONFIG.expectationRadiusM)transition(r,'expectation','player close enough for possible interaction');
    else if(r.state==='expectation'&&time-r.stateSince>=CONFIG.expectationTimeoutSec)transition(r,'return_resume_retarget','no interaction; routine wins');
  }

  function nearestInteraction(){
    scan();
    return residents.filter(r=>r.distanceM<=CONFIG.interactionRadiusM).sort((a,b)=>a.distanceM-b.distanceM)[0]||null;
  }

  const unregister=mobility.registerInteractionResolver({
    id:'resident-social-memory-01',
    priority:0,
    probe(){
      if(mobility.mode!=='ground')return null;
      const r=nearestInteraction();
      return r?{available:true,id:'resident:'+r.id,kind:'resident',residentId:r.id,label:'talk to '+r.name,distanceM:r.distanceM}:null;
    },
    interact({candidate,meta}){return interactResident(candidate.residentId,meta);}
  });

  const previousUpdate=app.play.update.bind(app.play);
  app.play.update=dt=>{
    const out=previousUpdate(dt);
    const step=Math.max(0,Number(dt)||0);time+=step;scanClock+=step;
    for(const r of residents)r.module.update(step);
    if(scanClock>=CONFIG.scanEverySec){scanClock=0;scan();for(const r of residents)updateState(r);}
    return out;
  };

  function report(){
    scan();
    return {
      schema:'kfb.resident-social-memory/1',
      source:RESIDENT_SOCIAL_SOURCE,
      config:{...CONFIG},
      ownerBoundaries:{world:'World M2A / World r2',actors:'Resident Atlas scene module',movement:'World consumer',dialogue:'ChatterBox request only',persistence:'Journey event receipt request + bounded session cache',reaction:'Reaction Choreography semantic request; no second mixer'},
      residents:residents.map(r=>({
        id:r.id,name:r.name,state:r.state,distanceM:+r.distanceM.toFixed(2),visible:r.visible,interestScore:+r.interestScore.toFixed(2),
        motivation:r.motivation,activity:r.activityKind,activityEnabled:r.module.activity?.enabled!==false,
        memoryCount:r.memory.length,thread:r.thread?{topic:r.thread.topic,turns:r.thread.turns}:null,
        interactions:r.interactions,meaningfulReceipts:r.meaningfulReceipts,history:r.history.slice(-8)
      })),
      poiKinds:['player','resident','vehicle'],
      aida:AIDA_SEQUENCE,
      externalOwners:{chatterboxEvent:'kfb-chatterbox-request',journeyEvent:'kfb-journey-event',reactionEvent:'kfb-resident-reaction-request'}
    };
  }

  scan();
  emit('kfb-resident-social-ready',report());
  return {
    report,residents,interactResident,
    dispose(){
      if(disposed)return;disposed=true;unregister?.();
      clownModule.dispose();gothModule.dispose();
    }
  };
}
