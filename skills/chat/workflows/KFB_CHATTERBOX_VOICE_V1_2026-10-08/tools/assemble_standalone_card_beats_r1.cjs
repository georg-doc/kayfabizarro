/* KFB Card Performance Solo Cuts R1
 * Pure content assembler: compiled source-locked, self-contained one-Card beats.
 * 1 spoken line per card; exactly 1 empty line between units in the script.
 * No LLM, TTS, soundbed, timing invention or Audio engine ownership.
 */
'use strict';
const SCHEMA='kfb.triplets.standalone-card-beat-set/0.1';
const ONE_SENTENCE=/(?<=[.!?])\s+(?=\S)/u;
const MAX_SCRIPT_CHARS=5000;
const ONLY_CARD='CARD_TRIPLET_CANDIDATE';
function requireTrue(ok, why){if(!ok)throw Error(why);}
function toBeat(entry, delivery){
 requireTrue(entry?.kind===ONLY_CARD&&entry.admitted===false,
   'SOURCE_LOCKED_UNREVIEWED_CANDIDATE_REQUIRED');
 requireTrue(typeof entry.cardName==='string'&&entry.text.startsWith(entry.cardName+' '),
   'SHOW_TITLE_MISSING');
 requireTrue(entry.usedFields?.includes('cardName')&&entry.usedFields?.includes('power')&&
   entry.usedFields?.includes('lore'),'POWER_LORE_SOURCE_PROOF_REQUIRED');
 requireTrue(typeof entry.text==='string'&&entry.text.trim()===entry.text&&
   !/[\r\n]/.test(entry.text),'ONE_CARD_ONE_LINE');
 requireTrue(entry.text.endsWith('.')&&!entry.text.slice(0,-1).includes('.'),
   'CARD_BEAT_MUST_BE_ONE_SENTENCE');
 requireTrue(entry.audit?.newFactsAdded===false&&entry.pieces?.length>0,
   'NO_SOURCE_PROOF');
 requireTrue(entry.audit?.creativeAcceptance==='UNREVIEWED',
   'DO_NOT_FAKE_HUMAN_APPROVAL');
 return Object.freeze({
   kind:'STANDALONE_CARD_BEAT_CANDIDATE',id:entry.cardId+'@'+entry.sourceRevision,
   deckId:entry.cardId.split(':')[0],cardNumber:Number(entry.cardId.split(':').at(-1)),
   originalCardName:entry.cardName,cardSourceRevision:entry.sourceRevision,
   text:entry.text,originalFields:['cardName','power','lore'],
   sourcePieces:entry.pieces.filter(p=>p.kind==='source'),
   startCue:'beat:'+entry.cardId+':start',endCue:'beat:'+entry.cardId+':end',
   optionalBridgeAfter:null,
   delivery:Object.freeze({
     tone:delivery?.tone||'deadpan',
     pauseBeforeMs:Math.max(0,Number(delivery?.pauseBeforeMs??300)),
     pauseAfterMs:Math.max(0,Number(delivery?.pauseAfterMs??700)),
     rate:Math.max(0.5,Math.min(1.5,Number(delivery?.rate??0.93))),
     emphasis:delivery?.emphasis||'original punchline, unhurried landing'
   }),admitted:false,
   productionStatus:'EDITORIAL_CANDIDATE_NOT_AUDIO_RENDERED'
 });
}
function assembleSolo(entries,opts={}){
 requireTrue(Array.isArray(entries)&&entries.length>0,'AT_LEAST_ONE_BEAT_REQUIRED');
 const items=entries.map(x=>x.kind==='STANDALONE_CARD_BEAT_CANDIDATE'?x:toBeat(x,opts.delivery));
 requireTrue(items.every(x=>x.admitted===false&&x.kind==='STANDALONE_CARD_BEAT_CANDIDATE'),
   'UNSAFE_IMPORTED_BEAT');
 const keys=items.map(x=>x.id);
 requireTrue(new Set(keys).size===keys.length,'DUPLICATE_BEAT_ID');
 const ordered=[...items];
 if(opts.order==='seeded_shuffle'){
   let seed=2166136261;
   for(const c of String(opts.seed??'kfb')){
     seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
   }
   for(let i=ordered.length-1;i>0;i--){
     seed=(Math.imul(seed,1664525)+1013904223)>>>0;
     const j=seed%(i+1);[ordered[i],ordered[j]]=[ordered[j],ordered[i]];
   }
 }else requireTrue(!opts.order||opts.order==='source','UNSUPPORTED_SEQUENCE_MODE');
 const intro=opts.intro===undefined?'Welcome, dear Fluffheads!':opts.intro;
 const outro='Stay Fluffy!';
 requireTrue(intro===null||typeof intro==='string','INTRO_MUST_BE_TEXT_OR_NULL');
 requireTrue(!intro||(!intro.includes('\n')&&intro.trim()===intro),'INTRO_ONE_LINE');
 const scriptRows=[...(intro?[intro]:[]),...ordered.map(x=>x.text),outro];
 const spokenBody=scriptRows.join('\n\n');
 requireTrue(!/\n\n\n/.test(spokenBody),'EXTRA_BLANK_LINES');
 requireTrue(spokenBody.length<=(opts.maxChars??MAX_SCRIPT_CHARS),'SCRIPT_OVER_CHAR_LIMIT_SPLIT_PARTS');
 return Object.freeze({
  schema:SCHEMA,kind:'SOLO_VOICE_ONLY_SCRIPT_CANDIDATE',
  text:spokenBody,lines:scriptRows,cardBeatCount:ordered.length,
  beatRefs:ordered.map((x,index)=>({position:index,cardId:x.deckId+':'+x.cardNumber,
   beatId:x.id,startCue:x.startCue,endCue:x.endCue,text:x.text,
   pauseBeforeMs:x.delivery.pauseBeforeMs,pauseAfterMs:x.delivery.pauseAfterMs,
   recommendedDelivery:x.delivery,sourceRevision:x.cardSourceRevision})),
  intro:intro||null,outro,bridgesUsed:0,soundbed:'NONE',outputMode:'VOICE_ONLY_DRY',
  timingStatus:'GAPS_REQUESTED_NOT_AUDIO_MEASURED',transcriptFormat:'ONE_LINE_PER_CARD_BLANK_LINE_BETWEEN',
  sunoStyle:'Solo spoken-word stand-up, dry character voice, no singing, a cappella, no instruments, no soundtrack, crisp articulation, short comedic pauses between each independent beat. No chorus.',
  sunoNoMusicGuaranteed:false,
  dataStatus:'EDITORIAL_CANDIDATE_NOT_HUMAN_ACCEPTED',
  isLlmFree:true,admitted:false
 });
}
module.exports=Object.freeze({SCHEMA,toBeat,assembleSolo});
