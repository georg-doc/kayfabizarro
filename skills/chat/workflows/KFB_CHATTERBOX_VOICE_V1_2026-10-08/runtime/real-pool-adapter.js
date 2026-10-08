/* KFB ChatterBox Voice · canonical pool adapter R1
 * Output-only adapter. Does not select dialogue, create AudioContext or own Resident state.
 */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.KFBChatterVoicePoolAdapter=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const FAMILY_REGISTER={
    idle:'speech',ueber:'speech',antwort:'speech',frage:'speech',
    philo:'thought',spott:'speech',handel:'speech'
  };

  function normText(t){
    return String(t||'').toLowerCase().replace(/’/g,"'").trim()
      .replace(/[.!?,]+$/,'').split(/\s+/).filter(Boolean).join(' ');
  }

  function fnv1a(s){
    let h=0x811c9dc5;
    s=String(s||'');
    for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}
    return h.toString(16).padStart(8,'0');
  }

  function listPhraseRecords(phrases,sourceRevision){
    if(!phrases||!phrases.version||!phrases.F)throw new Error('OW_PHRASES source required');
    const out=[];
    for(const faction of Object.keys(phrases.F)){
      const f=phrases.F[faction]||{};
      for(const family of Object.keys(FAMILY_REGISTER)){
        const arr=f[family];
        if(!Array.isArray(arr))continue;
        arr.forEach((text,index)=>out.push({
          sourceId:`${phrases.version}:F:${faction}:${family}:${index}`,
          sourceVersion:phrases.version,
          sourceRevision:sourceRevision||null,
          sourceKind:'FACTION_PHRASE',
          faction,family,index,
          textTemplate:String(text),
          templateSlots:String(text).includes('{X}')?['X']:[],
          register:FAMILY_REGISTER[family],
          playbackPolicy:family==='philo'?'silent':'auto'
        }));
      }
    }
    for(const key of Object.keys(phrases.SYNTHESE||{})){
      (phrases.SYNTHESE[key]||[]).forEach((text,index)=>out.push({
        sourceId:`${phrases.version}:S:${key}:${index}`,
        sourceVersion:phrases.version,
        sourceRevision:sourceRevision||null,
        sourceKind:'SYNTHESIS',
        faction:key,index,
        textTemplate:String(text),templateSlots:[],
        register:'speech',playbackPolicy:'auto'
      }));
    }
    for(const key of Object.keys(phrases.TAETIGKEIT||{})){
      (phrases.TAETIGKEIT[key]||[]).forEach((text,index)=>out.push({
        sourceId:`${phrases.version}:T:${key}:${index}`,
        sourceVersion:phrases.version,
        sourceRevision:sourceRevision||null,
        sourceKind:'ACTIVITY_THOUGHT',
        activity:key,index,
        textTemplate:String(text),templateSlots:[],
        register:'thought',playbackPolicy:'silent'
      }));
    }
    return out;
  }

  function instantiate(record,bindings){
    if(!record)return null;
    bindings=bindings||{};
    let text=String(record.textTemplate||'');
    for(const slot of record.templateSlots||[]){
      if(bindings[slot]==null)return null;
      text=text.split(`{${slot}}`).join(String(bindings[slot]));
    }
    return Object.assign({},record,{text,textRevision:fnv1a(text)});
  }

  function tripletToSegments(entry,opt){
    if(!entry||!entry.tripletId)throw new Error('tripletId required');
    opt=opt||{};
    const ns=opt.sourceNamespace||'kfb.semantic-triplet';
    const rev=opt.sourceRevision||null;
    const status=opt.sourceStatus||null;
    return [['subject',entry.subject],['connector',entry.connector],['reframe',entry.reframe]]
      .map(([role,text],slot)=>({
        sourceId:`${ns}:${entry.tripletId}:${role}`,
        sourceRevision:rev,
        sourceStatus:status,
        sourceKind:'SEMANTIC_TRIPLET_PART',
        tripletId:entry.tripletId,role,slot,
        textTemplate:String(text||''),templateSlots:[],
        register:'speech',playbackPolicy:'auto'
      }));
  }

  function buildVoiceRequest(args){
    args=args||{};
    const record=args.record;
    const resolved=args.text!=null
      ?Object.assign({},record,{text:String(args.text),textRevision:fnv1a(String(args.text))})
      :instantiate(record,args.bindings||{});
    if(!resolved)return null;
    const emotion=args.emotion||'calm';
    const voicePreset=args.voicePreset||'browser';
    const slot=args.slot||0;
    return {
      utteranceId:args.utteranceId||null,
      residentId:args.residentId||null,
      voicePreset,
      emotion,
      intensity:args.intensity==null?null:args.intensity,
      register:resolved.register||'speech',
      playbackPolicy:args.playbackPolicy||resolved.playbackPolicy||'auto',
      segments:[resolved.text],
      text:resolved.text,
      sourceRefs:[{
        sourceId:resolved.sourceId,
        sourceRevision:resolved.sourceRevision||null,
        sourceStatus:resolved.sourceStatus||null,
        textRevision:resolved.textRevision
      }],
      voiceAssetKey:`${resolved.sourceId}|${voicePreset}|${emotion}|${slot}|${fnv1a(normText(resolved.text))}`
    };
  }

  return {FAMILY_REGISTER,normText,fnv1a,listPhraseRecords,instantiate,tripletToSegments,buildVoiceRequest};
});
