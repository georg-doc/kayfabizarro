import { cardSemanticVector, hashStr, joinSeeds, mulberry32 } from '../../../travel/travel-v16/terrain-v16/world-context.js';

export const PROTOTYPE_GRAMMARS=['G1','G3','G5','G8','G9','G10'];
export const PROTOTYPE_FAMILIES=['P1','P3','P4','P5','P7','P10','P12'];

export const GRAMMAR_NAMES={
  G1:'Pocket Funk',
  G3:'Interlocking Cycle',
  G5:'Modal Drone / Pedal',
  G8:'Surf / Rockabilly Drive',
  G9:'Electro-Funk / Boogie',
  G10:'Free Ambient / Negative Space'
};

export const FAMILY_NAMES={
  P1:'Interlocking Resonators',
  P3:'Surf / Twang Guitar',
  P4:'Keys / Electric Keys / Organ',
  P5:'Bass Family',
  P7:'Kit / Brushes / Rockabilly Drums',
  P10:'Electronic Synth / Sequencer',
  P12:'Environmental Musical Texture'
};

export const COMPAT={
  G1:{G3:2,G5:1,G8:2,G9:3,G10:1},
  G3:{G1:2,G5:3,G8:1,G9:2,G10:2},
  G5:{G1:1,G3:3,G8:1,G9:1,G10:3},
  G8:{G1:2,G3:1,G5:1,G9:2,G10:1},
  G9:{G1:3,G3:2,G5:1,G8:2,G10:1},
  G10:{G1:1,G3:2,G5:3,G8:1,G9:1}
};

export const FAMILY_WEIGHTS={
  G1:{P1:1,P3:2,P4:3,P5:3,P7:3,P10:3,P12:1},
  G3:{P1:3,P3:0,P4:2,P5:1,P7:1,P10:2,P12:2},
  G5:{P1:2,P3:0,P4:1,P5:1,P7:0,P10:2,P12:3},
  G8:{P1:0,P3:3,P4:2,P5:3,P7:3,P10:2,P12:1},
  G9:{P1:1,P3:1,P4:3,P5:3,P7:3,P10:3,P12:1},
  G10:{P1:2,P3:0,P4:1,P5:0,P7:0,P10:3,P12:3}
};

const GRAMMAR_AXIS={
  G1:{cozy:.35,playful:.80,mechanical:.45,motion:.70,shadow:.10,weirdness:.25},
  G3:{cozy:.72,playful:.48,mechanical:.08,motion:.20,shadow:.18,weirdness:.52},
  G5:{cozy:.48,playful:.08,mechanical:.06,motion:.08,shadow:.62,weirdness:.38},
  G8:{cozy:.18,playful:.68,mechanical:.28,motion:1.00,shadow:.08,weirdness:.18},
  G9:{cozy:.16,playful:.46,mechanical:1.00,motion:.92,shadow:.18,weirdness:.38},
  G10:{cozy:.58,playful:.08,mechanical:.08,motion:.04,shadow:1.00,weirdness:.62}
};

const FAMILY_AXIS={
  P1:{cozy:.60,playful:.45,mechanical:.05,motion:.10,shadow:.18,weirdness:.55},
  P3:{cozy:.20,playful:.55,mechanical:.18,motion:.88,shadow:.18,weirdness:.30},
  P4:{cozy:.62,playful:.50,mechanical:.32,motion:.38,shadow:.18,weirdness:.28},
  P5:{cozy:.28,playful:.22,mechanical:.48,motion:.72,shadow:.18,weirdness:.18},
  P7:{cozy:.16,playful:.48,mechanical:.42,motion:.90,shadow:.08,weirdness:.24},
  P10:{cozy:.18,playful:.36,mechanical:.92,motion:.62,shadow:.52,weirdness:.68},
  P12:{cozy:.58,playful:.12,mechanical:.24,motion:.10,shadow:.62,weirdness:.42}
};

const PITCH_SYSTEMS=[
  {id:'major-pentatonic',steps:[0,2,4,7,9]},
  {id:'dorian',steps:[0,2,3,5,7,9,10]},
  {id:'minor-pentatonic',steps:[0,3,5,7,10]},
  {id:'mixolydian',steps:[0,2,4,5,7,9,10]}
];

const BASE_BPM={G1:92,G3:82,G5:72,G8:104,G9:100,G10:68};

export function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,Number(v)||0));}

export function averageDeck(cards,role){
  const keys=['power','lore','name','chaos','wonder','threat','humor','melancholy'];
  const out=Object.fromEntries(keys.map((k)=>[k,0]));
  const list=Array.isArray(cards)?cards:[];
  if(!list.length)return out;
  for(const card of list){
    const v=cardSemanticVector(card,role);
    for(const k of keys)out[k]+=v[k];
  }
  for(const k of keys)out[k]=Number((out[k]/list.length).toFixed(4));
  return out;
}

export function baselineDelta(a,b){
  let max=0;
  for(const k of Object.keys(b||{}))max=Math.max(max,Math.abs((a?.[k]||0)-(b?.[k]||0)));
  return Number(max.toFixed(6));
}

function dotAxes(axes,weights){
  let total=0,den=0;
  for(const [k,w] of Object.entries(weights)){
    total+=(axes?.[k]||0)*w;
    den+=w;
  }
  return den?total/den:0;
}

function seededUnit(...parts){
  return mulberry32(joinSeeds(...parts))();
}

function grammarScore(deck,id){
  const axes=deck.audioDna.axes||{};
  const prior=deck.audioDna.grammarPriors?.[id]||0;
  const jitter=(seededUnit('audio-grammar-jitter',deck.audioDna.seed,id)-.5)*.06;
  return dotAxes(axes,GRAMMAR_AXIS[id]) + prior*.48 + jitter;
}

function familyScore(deck,primary,secondary,id){
  const core=(FAMILY_WEIGHTS[primary]?.[id]||0)/3;
  const secondaryInfluence=(FAMILY_WEIGHTS[secondary]?.[id]||0)/3*.18;
  const semantic=dotAxes(deck.audioDna.axes||{},FAMILY_AXIS[id])*.35;
  const prior=(deck.audioDna.familyPriors?.[id]||0)*.35;
  const jitter=(seededUnit('audio-family-jitter',deck.audioDna.seed,id)-.5)*.04;
  return core+secondaryInfluence+semantic+prior+jitter;
}

function chooseMotif(deck,pitch){
  const rng=mulberry32(joinSeeds('audio-motif',deck.audioDna.motifSeed,pitch.id));
  const len=8;
  let i=Math.floor(rng()*pitch.steps.length);
  const out=[];
  for(let n=0;n<len;n++){
    out.push(pitch.steps[i]);
    const r=rng();
    const move=r<.16?-2:r<.42?-1:r<.67?0:r<.91?1:2;
    i=Math.max(0,Math.min(pitch.steps.length-1,i+move));
  }
  return out;
}

export function selectIdentity(deck,semanticBaseline=null){
  const scores=Object.fromEntries(PROTOTYPE_GRAMMARS.map((id)=>[id,grammarScore(deck,id)]));
  const primary=[...PROTOTYPE_GRAMMARS].sort((a,b)=>scores[b]-scores[a])[0];

  let secondary=null,secondaryScore=-Infinity;
  for(const id of PROTOTYPE_GRAMMARS){
    if(id===primary)continue;
    const c=COMPAT[primary]?.[id]||0;
    if(!c)continue;
    const s=scores[id]*(c/3);
    if(s>secondaryScore){secondaryScore=s;secondary=id;}
  }
  const compatibility=secondary?COMPAT[primary][secondary]:0;
  const cap=compatibility===3?.35:compatibility===2?.22:compatibility===1?.10:0;
  const secondaryWeight=Number((cap*(.72+.28*(deck.audioDna.axes?.weirdness||0))).toFixed(3));

  const familyScores=Object.fromEntries(PROTOTYPE_FAMILIES.map((id)=>[id,familyScore(deck,primary,secondary,id)]));
  const foreground=PROTOTYPE_FAMILIES.filter((id)=>id!=='P12'&&(FAMILY_WEIGHTS[primary]?.[id]||0)>0)
    .sort((a,b)=>familyScores[b]-familyScores[a]).slice(0,3);
  const families=[...foreground];
  if((FAMILY_WEIGHTS[primary]?.P12||0)>0)families.push('P12');

  const pitchIndex=Math.floor(seededUnit('audio-pitch',deck.audioDna.seed)*PITCH_SYSTEMS.length)%PITCH_SYSTEMS.length;
  const pitch=PITCH_SYSTEMS[pitchIndex];
  const rootMidi=47+(hashStr(deck.audioDna.identityId)%6);
  const motif=chooseMotif(deck,pitch);

  const signatureSource=[
    deck.packId,primary,secondary||'none',families.join(','),pitch.id,rootMidi,motif.join(',')
  ].join('|');

  return {
    packId:deck.packId,
    role:deck.role,
    title:deck.title,
    seed:deck.audioDna.seed,
    motifSeed:deck.audioDna.motifSeed,
    axes:{...deck.audioDna.axes},
    transformAffinity:{...deck.audioDna.transformAffinity},
    continuity:{...deck.audioDna.continuity},
    semanticBaseline:semanticBaseline?{...semanticBaseline}:null,
    primary,
    primaryName:GRAMMAR_NAMES[primary],
    secondary,
    secondaryName:secondary?GRAMMAR_NAMES[secondary]:null,
    compatibility,
    secondaryWeight,
    families,
    familyNames:families.map((id)=>FAMILY_NAMES[id]),
    pitch:{id:pitch.id,steps:[...pitch.steps]},
    rootMidi,
    motif,
    identitySignature:hashStr(signatureSource).toString(16).padStart(8,'0')
  };
}

export function deriveRuntime(identity,context={}){
  const mode=context.mode==='road'?'road':'world';
  const speed=clamp(context.speed);
  const night=clamp(context.night);
  const rain=clamp(context.rain);
  const psychedelic=clamp(context.psychedelic);
  const shadow=clamp(context.shadow);
  const road=mode==='road'?1:0;
  const subdivisionLevel=road?(speed<.34?0:speed<.67?1:2):0;
  const bpm=BASE_BPM[identity.primary]+(road?[2,4,7][subdivisionLevel]:0);
  const affinity=identity.transformAffinity||{};
  const effectiveRain=rain*(.5+.5*(affinity.rain??.5));
  const effectivePsychedelic=psychedelic*(.5+.5*(affinity.psychedelic??.5));
  const effectiveShadow=shadow*(.5+.5*(affinity.shadow??.5));
  const density=clamp(
    .31 + road*.18 + subdivisionLevel*.12 - night*.10 +
    (identity.axes?.playful||0)*.10 + (identity.axes?.motion||0)*.08 -
    (identity.continuity?.silenceBudget||.35)*.10,
    .14,.95
  );
  return {
    mode,speed,night,rain,psychedelic,shadow,subdivisionLevel,bpm,density,
    effectiveRain,effectivePsychedelic,effectiveShadow,
    cutoff:Math.round(2600-night*950-effectiveShadow*650+road*380),
    delayWet:clamp(.06+effectivePsychedelic*.48+effectiveRain*.08,0,.62),
    delayFeedback:clamp(.08+effectivePsychedelic*.46,0,.58),
    musicGain:context.ducked?.42:1,
    ambienceGain:context.ducked?.68:1
  };
}

function rAt(identity,ns,index){
  return seededUnit('audio-step',identity.seed,ns,index);
}

function motifDegree(identity,step,offset=0){
  const i=((Math.floor(step/2)+offset)%identity.motif.length+identity.motif.length)%identity.motif.length;
  return identity.motif[i];
}

export function eventsForStep(identity,context,step){
  const r=deriveRuntime(identity,context);
  const pos=((step%16)+16)%16;
  const out=[];
  const push=(type,degree=0,accent=1)=>{
    const shadowAlter=(type==='motif'||type==='answer'||type==='chord') &&
      rAt(identity,'shadow-omit',step)<r.effectiveShadow*.16;
    if(shadowAlter&&rAt(identity,'shadow-drop',step)<.55)return;
    out.push({
      type,
      degree:degree+(shadowAlter?(rAt(identity,'shadow-dir',step)<.5?-1:1):0),
      accent:Number(accent.toFixed(3)),
      altered:shadowAlter
    });
  };

  if(identity.primary==='G1'){
    if([0,3,6,8,11,14].includes(pos))push('bass',motifDegree(identity,step)-12,.70);
    if([2,7,10,15].includes(pos)&&rAt(identity,'g1-chord',step)<r.density+.12)push('chord',motifDegree(identity,step),.42);
    if((r.mode==='road'||r.density>.52)&&[0,8].includes(pos))push('kick',0,.72);
    if((r.mode==='road'||r.density>.58)&&[4,12].includes(pos))push('snare',0,.46);
  }else if(identity.primary==='G3'){
    const g3Steps=r.mode==='road'
      ? (r.subdivisionLevel===2?[0,3,6,8,11,14]:[0,4,8,12])
      : [0,5,10,14];
    const g3Chance=r.mode==='road' ? .30+r.density*.42 : .24+r.density*.24;
    if(g3Steps.includes(pos)&&rAt(identity,'g3-motif',step)<g3Chance)push('motif',motifDegree(identity,step),r.mode==='road'?.38:.28);
    if([6,14].includes(pos)&&rAt(identity,'g3-answer',step)<.18+r.density*.18)push('answer',motifDegree(identity,step,2),.20);
    if(r.mode==='road'&&[0,8].includes(pos))push('bass',motifDegree(identity,step)-12,.48);
  }else if(identity.primary==='G5'){
    if(pos===0)push('pad',0,.38);
    if([4,12].includes(pos)&&rAt(identity,'g5-motif',step)<.48+r.density*.25)push('motif',motifDegree(identity,step),.34);
    if(r.mode==='road'&&[0,8].includes(pos))push('bass',0,.42);
  }else if(identity.primary==='G8'){
    const guitarSteps=r.mode==='road'?(r.subdivisionLevel===2?[0,2,3,4,6,7,8,10,11,12,14,15]:[0,2,4,6,8,10,12,14]):[0,4,8,12];
    if(guitarSteps.includes(pos)&&rAt(identity,'g8-guitar',step)<r.density+.35)push('guitar',motifDegree(identity,step),.54);
    if(r.mode==='road'&&[0,4,8,12].includes(pos))push('bass',0,.58);
    if(r.mode==='road'&&[0,8].includes(pos))push('kick',0,.72);
    if(r.mode==='road'&&[4,12].includes(pos))push('snare',0,.52);
  }else if(identity.primary==='G9'){
    if([0,3,6,8,11,14].includes(pos))push('bass',motifDegree(identity,step)-12,.66);
    if([2,6,10,14].includes(pos)&&rAt(identity,'g9-chord',step)<r.density+.18)push('chord',motifDegree(identity,step),.40);
    if([0,8].includes(pos))push('kick',0,.72);
    if([4,12].includes(pos))push('snare',0,.48);
  }else{
    if(pos===0)push('pad',0,.34);
    if([4,12].includes(pos)&&rAt(identity,'g10-motif',step)<.34+r.density*.18)push('motif',motifDegree(identity,step),.30);
    if(r.mode==='road'&&[0,8].includes(pos))push('bass',0,.34);
  }

  if(r.mode==='road'&&r.subdivisionLevel>=1&&pos%2===0)push('hat',0,r.subdivisionLevel===2?.26:.18);
  if(r.mode==='road'&&r.subdivisionLevel===2&&pos%2===1&&rAt(identity,'fast-hat',step)<.70)push('hat',0,.13);

  const secondarySlots=r.mode==='road'?[6,14]:[14];
  if(identity.secondary&&secondarySlots.includes(pos)&&rAt(identity,'secondary',step)<.04+identity.secondaryWeight*.55){
    push('answer',motifDegree(identity,step,3),.16+identity.secondaryWeight*.22);
  }
  return out;
}

export function previewStructure(identity,context={},steps=64){
  const events=[];
  for(let step=0;step<steps;step++){
    for(const ev of eventsForStep(identity,context,step))events.push([step,ev.type,ev.degree,ev.altered?1:0]);
  }
  return events;
}

export function structureFingerprint(identity,context={},steps=64){
  return hashStr(JSON.stringify(previewStructure(identity,context,steps))).toString(16).padStart(8,'0');
}

export function identityCompatibility(identity){
  return identity.secondary?(COMPAT[identity.primary]?.[identity.secondary]||0):0;
}
