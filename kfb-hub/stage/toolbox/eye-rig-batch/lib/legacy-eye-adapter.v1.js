import { EyeRig } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@5650b6c54d8789b20ea80abe857688173d506d3b/tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js';
import { attach as attachEyeOval, applyOval as applyEyeOval, detach as detachEyeOval, DEFAULTS as EYE_OVAL_DEFAULTS } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@5650b6c54d8789b20ea80abe857688173d506d3b/tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/eyeoval.v1.js';

export const ADAPTER_SCHEMA='kfb.legacy-eye-adapter/0.1-candidate';
export const PROFILE_SCHEMA='kfb.eye-profile/0.1-candidate';

const clone=(v)=>JSON.parse(JSON.stringify(v));
function colorHex(THREE,value){try{return '#'+new THREE.Color(value).getHexString();}catch{return null;}}
const NEUTRAL={lidUpper:0,lidLower:0,slant:0,pupil:'normal',gaze:'front'};

function sourceRecord(actor,catalog){
  return {
    repo:'georg-doc/kayfabizarro',
    path:actor.sourcePath,
    node:actor.sourceNode||null,
    revision:catalog.source.partsRevision,
    rigRevision:catalog.source.rigRevision,
    kind:actor.kind
  };
}

export function makeLegacyEyeProfile({actor,catalog,seed,faceHost,measurement}={}){
  if(!actor||!catalog||!seed||faceHost?.status!=='OK') throw new Error('makeLegacyEyeProfile requires actor/catalog/seed/OK faceHost');
  const base=clone(seed.calibrationStart||{});
  const eye=clone(base.eye||{});
  const measured=measurement?.status==='MEASURED_CANDIDATE';
  if(measured) eye.anchor={...(eye.anchor||{}),...(measurement.anchor||{})};
  eye.baseColor=faceHost.report?.baseColor||eye.baseColor||null;
  eye.lidColorMode=eye.lidColorMode||'face-base-darkened';
  eye.oval={...EYE_OVAL_DEFAULTS,...(eye.oval||{})};

  const sourceFace={
    schema:'kfb.source-face-report/0.1-candidate',
    status:measurement?.status||'UNSUPPORTED',
    method:measurement?.method||null,
    anchorCandidate:measurement?.anchor||null,
    pair:measurement?.pair||null,
    confidence:measurement?.confidence??null,
    candidateCount:measurement?.candidateCount??measurement?.candidates?.length??0,
    candidates:measurement?.status==='HUMAN_REQUIRED'?clone(measurement.candidates||[]):[],
    faceColor:faceHost.report?.baseColor||null,
    faceColorSource:'legacy-facehost-material',
    removalMode:'runtime-black-material-visibility-only',
    sourceEyeCleanupVisuallyAccepted:false
  };

  return {
    schema:PROFILE_SCHEMA,
    actorId:actor.id,
    label:actor.label,
    source:sourceRecord(actor,catalog),
    rigClass:'Rig_Legacy',
    faceHost:clone(faceHost.report),
    sourceFace,
    eye,
    blink:clone(base.blink||{}),
    life:clone(base.life||{}),
    kinetics:clone(base.kinetics||{}),
    status:measured?'AUTO_CANDIDATE':'HUMAN_REQUIRED_FALLBACK_CANDIDATE',
    evidence:{
      camera:'front',
      motionClip:'Idle',
      sourceIsolationRequired:true,
      sourceIsolationPassed:false,
      automatedMountPassed:false,
      eyeProfileVisuallyApproved:false
    },
    calibration:{
      schema:'kfb.eye-legacy-auto/0.1-candidate',
      method:measured?'source black-eye geometry measurement':'Legacy calibrationStart fallback',
      sourceRuntimeRevision:catalog.source.legacyRuntimeRevision,
      generatedDate:'2026-09-21'
    },
    reviewState:'UNREVIEWED',
    inheritance:{
      order:['rigClass','character','session'],
      rigClass:'Rig_Legacy',
      classSeed:'data/rig-legacy-default.v0.json',
      characterId:actor.id,
      sessionAdjusted:false
    }
  };
}

export function mountLegacyEyeProfile({THREE,faceHost,profile,log=()=>{}}={}){
  if(!THREE||faceHost?.status!=='OK'||!profile?.eye) throw new Error('mountLegacyEyeProfile requires THREE + OK faceHost + profile');
  const eye=profile.eye;
  const rig=new EyeRig(faceHost.faceCtx(),{
    anchor:clone(eye.anchor||{}),
    pupilStyle:eye.pupilStyle||'matte-cute',
    pupilSize:eye.pupilSize??0.38,
    gloss:eye.gloss??0.1,
    inset:eye.inset??0.18,
    lidFit:eye.lidFit??0.9,
    converge:eye.converge??0.18,
    splay:eye.splay??0.04,
    baseColor:eye.baseColor||faceHost.report?.baseColor||'#d7a17d',
    blink:clone(profile.blink||{}),
    life:clone(profile.life||{}),
    kinetics:clone(profile.kinetics||{}),
    lashes:{length:0,density:0,width:1}
  });
  rig.build();
  rig.setLashes({length:0,density:0,width:1});
  const oval={...EYE_OVAL_DEFAULTS,...clone(eye.oval||{})};
  attachEyeOval(rig,()=>oval);
  applyEyeOval(rig,oval);
  rig.applyEmote(NEUTRAL);
  rig.setGazeFollow(false);
  for(let i=0;i<16;i++)rig.update(1/60);

  const api={
    schema:ADAPTER_SCHEMA,
    rig,
    faceHost,
    profile,
    update(dt){rig.update(dt);},
    blinkNow(){rig.blinkNow();},
    eyeFrame(){return rig.eyeFrame();},
    report(){
      const f=rig.eyeFrame();
      const vec=(p)=>p?[p.x,p.y,p.z].map(n=>+n.toFixed(4)):null;
      return {
        schema:ADAPTER_SCHEMA,
        actorId:profile.actorId,
        faceHost:clone(faceHost.report),
        eyeFrame:f?{left:vec(f.left),right:vec(f.right),radius:+f.radius.toFixed(4),unit:+f.unit.toFixed(4),gen:f.gen}:null,
        anchor:clone(rig.anchor),
        baseColor:colorHex(THREE,rig.baseColor),
        oval:clone(oval)
      };
    },
    dispose(){detachEyeOval(rig);rig.dispose();}
  };
  log(`Legacy EyeRig v6 mounted · ${profile.actorId} · ${profile.status}`);
  return api;
}

export default mountLegacyEyeProfile;
