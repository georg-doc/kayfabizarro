/* KFB Card Performance Standalone Solo Cuts R1.1
 * One card = one independent spoken line (potentially two sentences).
 * Blank line = editable cut boundary; it is NOT verified audio timing.
 * Source title/POWER/LORE preserved in compiled core; optional matched comedy opener.
 * Zero network, model or extra AudioContext.
 */
'use strict';
const SCHEMA='kfb.triplets.standalone-card-beat-set/0.1';
const MAX_SCRIPT_CHARS=5000;
const ONLY_CARD='CARD_TRIPLET_CANDIDATE';
const OPENERS=Object.freeze({
 DIRECT: {kind:'SOURCE_ONLY'},
 HEARD_OF: {kind:'AUDIENCE_ADDRESS',prefix:'Ever heard of ',suffix:'?'},
 DO_YOU_KNOW: {kind:'AUDIENCE_ADDRESS',prefix:'Do you know ',suffix:'?'},
 EVER_TASTED: {kind:'FOOD_AUDIENCE_ADDRESS',prefix:'Ever tasted ',suffix:'?',requires:'FOOD'},
 I_ONCE_MET: {kind:'PERFORMER_FICTION',prefix:'I once met ',suffix:'.',requires:'PERSON',fiction:true},
 RESTAURANT_ORDERED: {kind:'PERFORMER_FICTION',prefix:'I went to a restaurant and ordered ',suffix:'.',requires:'FOOD',fiction:true}
});
function requireTrue(ok,why){if(!ok)throw Error(why);}
const tokenize=text=>[...String(text??'').matchAll(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)].map(m=>({start:m.index,end:m.index+m[0].length,word:m[0]}));
function sourceCoverage(entry,card){
 if(!card) return {kind:'NOT_MEASURED',reason:'FULL_ORIGINAL_CARD_REQUIRED',contentCoveragePct:null};
 requireTrue(card.cardName===entry.cardName,'SOURCE_TITLE_DRIFT');
 for(const field of ['cardName','power','lore'])requireTrue(typeof card[field]==='string'&&card[field].length,'ORIGINAL_FIELD_MISSING:'+field);
 const parts=entry.pieces.filter(p=>p.kind==='source');
 const fields={};let total=0,covered=0;
 for(const field of ['cardName','power','lore']){
  const raw=card[field],all=tokenize(raw),refs=parts.filter(x=>x.field===field);
  for(const p of refs)requireTrue(raw.slice(p.start,p.end)===p.verbatim,'SOURCE_SPAN_DRIFT:'+field);
  const hits=all.filter(t=>refs.some(p=>t.start>=p.start&&t.end<=p.end));
  total+=all.length;covered+=hits.length;
  fields[field]={originalTokens:all.length,referencedTokens:hits.length,
    pct:all.length?Math.round(10000*hits.length/all.length)/100:0};
 }
 return {kind:'EXACT_ORIGINAL_TOKEN_COVERAGE',fields,
   originalTokens:total,referencedOriginalTokens:covered,
   contentCoveragePct:total?Math.round(10000*covered/total)/100:0,
   semanticInformationCoveragePct:null,
   caution:'Word-token field coverage is NOT automatically semantic/information coverage.'};
}
function renderBeat(core,openerMode,opts){
 const opener=OPENERS[openerMode];
 requireTrue(opener,'UNKNOWN_OPENER_MODE');
 if(openerMode==='DIRECT')return {text:core.text,openerText:null,openerKind:'SOURCE_ONLY',performerFiction:false};
 if(opener.requires==='FOOD'){
  requireTrue(opts.sourceClass==='FOOD'&&/cookie|snickerdoodle/i.test(
   core.cardName+' '+core.pieces.filter(p=>p.kind==='source').map(p=>p.verbatim).join(' ')),
   'OPENER_NOT_SUPPORTED_BY_CARD_SOURCE');
 }
 if(opener.requires==='PERSON')
  requireTrue(opts.sourceClass==='PERSON'&&['He','She','They'].includes(opts.referentPronoun),
    'PERSON_REFERENCE_AND_PRONOUN_REQUIRED');
 if(opener.fiction)requireTrue(opts.allowPerformerFiction===true,
   'FICTIONAL_STAGE_FRAMING_REQUIRES_EXPLICIT_OPT_IN');
 const pronoun=opts.referentPronoun??'It';
 requireTrue(['It','He','She','They'].includes(pronoun),'UNAPPROVED_REFERENT_PRONOUN');
 const tail=core.text.slice(core.cardName.length).trimStart();
 requireTrue(core.text.startsWith(core.cardName+' ')&&tail,'TITLE_CORE_MISMATCH');
 const opening=opener.prefix+core.cardName+opener.suffix;
 const line=opening+' '+pronoun+' '+tail;
 requireTrue(line.split(core.cardName).length===2,'ORIGINAL_CARD_TITLE_MUST_BE_SPOKEN_ONCE');
 return {text:line,openerText:opening,openerKind:opener.kind,
   performerFiction:!!opener.fiction};
}
function toBeat(entry,opts={}){
 requireTrue(entry?.kind===ONLY_CARD&&entry.admitted===false,
  'SOURCE_LOCKED_UNREVIEWED_CANDIDATE_REQUIRED');
 requireTrue(typeof entry.cardName==='string'&&entry.text.startsWith(entry.cardName+' '),
  'SHOW_TITLE_MISSING');
 requireTrue(entry.usedFields?.includes('cardName')&&entry.usedFields?.includes('power')&&
  entry.usedFields?.includes('lore'),'POWER_LORE_SOURCE_PROOF_REQUIRED');
 requireTrue(typeof entry.text==='string'&&!/[\r\n]/.test(entry.text),
  'CORE_MUST_BE_ONE_LINE');
 requireTrue(entry.text.endsWith('.')&&!entry.text.slice(0,-1).includes('.'),
  'SOURCE_CARD_TRIPLET_MUST_BE_ONE_SENTENCE');
 requireTrue(entry.audit?.newFactsAdded===false&&entry.pieces?.length>0,
  'SOURCE_PROOF_REQUIRED');
 requireTrue(entry.audit?.creativeAcceptance==='UNREVIEWED','HUMAN_ACCEPTANCE_NOT_PROVEN');
 const openerMode=opts.openerMode??'DIRECT';
 const surface=renderBeat(entry,openerMode,opts);
 requireTrue(!/[\r\n]/.test(surface.text),'BEAT_ONE_LINE_REQUIRED');
 const coverage=sourceCoverage(entry,opts.originalCard);
 const goal=opts.targetOriginalTokenCoveragePct;
 if(goal!==undefined){
  requireTrue(typeof goal==='number'&&goal>=0&&goal<=100,'BAD_COVERAGE_TARGET');
  requireTrue(coverage.contentCoveragePct!==null&&coverage.contentCoveragePct>=goal,
   'ORIGINAL_CONTENT_COVERAGE_TARGET_UNMET');
 }
 const pauseBeforeMs=Number(opts.pauseBeforeMs??300);
 const pauseAfterMs=Number(opts.pauseAfterMs??700);
 const rate=Number(opts.rate??0.93);
 requireTrue([pauseBeforeMs,pauseAfterMs,rate].every(Number.isFinite)&&
  pauseBeforeMs>=0&&pauseAfterMs>=0&&rate>=0.5&&rate<=1.5,
  'INVALID_DELIVERY_TIMING');
 return Object.freeze({
  kind:'STANDALONE_CARD_BEAT_CANDIDATE',id:entry.cardId+'@'+entry.sourceRevision,
  deckId:entry.cardId.split(':')[0],cardNumber:Number(entry.cardId.split(':').at(-1)),
  originalCardName:entry.cardName,cardSourceRevision:entry.sourceRevision,
  text:surface.text,coreTriplet:entry.text,openerMode,openerText:surface.openerText,
  openerKind:surface.openerKind,performerFiction:surface.performerFiction,
  originalFields:['cardName','power','lore'],sourcePieces:entry.pieces.filter(x=>x.kind==='source'),
  sourceCoverage:coverage,extraPunchlineAdded:false,
  startCue:'beat:'+entry.cardId+':start',endCue:'beat:'+entry.cardId+':end',
  optionalBridgeAfter:null,
  delivery:Object.freeze({tone:opts.tone||'deadpan',pauseBeforeMs,pauseAfterMs,rate,
    emphasis:opts.emphasis||'source absurdity can stand without extra punchline'}),
  admitted:false,productionStatus:'EDITORIAL_CANDIDATE_NOT_AUDIO_RENDERED'
 });
}
/* Verbatim-heavy fallback: full original Card information, no compulsory final joke.
 * Deliberately NOT a validated semantic Triplet or a Title+Power+Lore quality PASS.
 * Title is spoken once; POWER and LORE are each spoken completely, under a matched opener.
 */
function toFullSourceBeat(card,meta,opts={}){
 requireTrue(meta&&meta.deckId&&Number.isInteger(meta.cardNumber)&&
  typeof meta.sourceRevision==='string'&&/^[0-9a-f]{40}$/.test(meta.sourceRevision),
  'PINNED_SOURCE_CARD_ID_REQUIRED');
 requireTrue(card?.cardNumber===meta.cardNumber,'CARD_ID_MISMATCH');
 for(const field of ['cardName','power','lore']){
  requireTrue(typeof card[field]==='string'&&card[field].trim()&&
   !/[\r\n]/.test(card[field]),'COMPLETE_SOURCE_FIELD_REQUIRED:'+field);
 }
 const openerMode=opts.openerMode??'HEARD_OF';
 requireTrue(OPENERS[openerMode],'UNKNOWN_OPENER_MODE');
 // Subject/title source proof plus a non-semantic probe text; opener syntax is curated.
 const core={cardName:card.cardName,text:card.cardName+'.',
  pieces:[{kind:'source',field:'cardName',verbatim:card.cardName,start:0,end:card.cardName.length}]};
 const opener=openerMode==='DIRECT'
  ?{openerText:card.cardName+'.',openerKind:'SOURCE_ONLY',performerFiction:false}
  :renderBeat({...core,text:card.cardName+' is here.'},openerMode,opts);
 const opening=openerMode==='DIRECT'?card.cardName+'.':opener.openerText;
 const text=opening+' '+card.power+' '+card.lore;
 requireTrue(!/[\r\n]/.test(text),'ONE_CARD_ONE_LINE');
 const rate=Number(opts.rate??0.93);
 const pauseBeforeMs=Number(opts.pauseBeforeMs??300);
 const pauseAfterMs=Number(opts.pauseAfterMs??900);
 requireTrue([rate,pauseBeforeMs,pauseAfterMs].every(Number.isFinite)&&
  rate>=0.5&&rate<=1.5&&pauseBeforeMs>=0&&pauseAfterMs>=0,'INVALID_DELIVERY_TIMING');
 const total=['cardName','power','lore'].reduce((sum,field)=>sum+tokenize(card[field]).length,0);
 const fields=Object.fromEntries(['cardName','power','lore'].map(field=>[field,{
  originalTokens:tokenize(card[field]).length,referencedTokens:tokenize(card[field]).length,pct:100
 }]));
 return Object.freeze({
  kind:'STANDALONE_CARD_BEAT_CANDIDATE',
  beatType:'ORIGINAL_CARD_FULL_RECITAL_NOT_PROVEN_SEMANTIC_TRIPLET',
  id:meta.deckId+':'+meta.cardNumber+'@'+meta.sourceRevision,
  deckId:meta.deckId,cardNumber:meta.cardNumber,
  originalCardName:card.cardName,cardSourceRevision:meta.sourceRevision,
  text,coreTriplet:null,openerMode,
  openerText:opening,openerKind:opener.openerKind,
  performerFiction:opener.performerFiction,extraPunchlineAdded:false,
  originalFields:['cardName','power','lore'],
  sourcePieces:['cardName','power','lore'].map(field=>({
   kind:'source',field,verbatim:card[field],start:0,end:card[field].length,
   cardRef:{deckId:meta.deckId,cardNumber:meta.cardNumber,
    sourceRevision:meta.sourceRevision}})),
  sourceCoverage:{kind:'EXACT_ORIGINAL_TOKEN_COVERAGE',fields,originalTokens:total,
   referencedOriginalTokens:total,contentCoveragePct:100,
   semanticInformationCoveragePct:null,
   caution:'100% word retention proves faithful copy, NOT an engaging semantic Triplet.'},
  startCue:'beat:'+meta.deckId+':'+meta.cardNumber+':start',
  endCue:'beat:'+meta.deckId+':'+meta.cardNumber+':end',
  optionalBridgeAfter:null,
  delivery:Object.freeze({tone:opts.tone??'deadpan',
   pauseBeforeMs,pauseAfterMs,rate,
   emphasis:opts.emphasis??'let original lore land; additional punchline not required'}),
  admitted:false,productionStatus:'EDITORIAL_CANDIDATE_SOURCE_RECITAL_NO_AUDIO'
 });
}

function assembleSolo(entries,opts={}){
 requireTrue(Array.isArray(entries)&&entries.length>0,'AT_LEAST_ONE_BEAT_REQUIRED');
 const items=entries.map(x=>x.kind==='STANDALONE_CARD_BEAT_CANDIDATE'?x:toBeat(x,opts));
 requireTrue(items.every(x=>x.admitted===false&&x.kind==='STANDALONE_CARD_BEAT_CANDIDATE'&&
  x.text.includes(x.originalCardName)&&!/[\r\n]/.test(x.text)),
  'UNSAFE_OR_MALFORMED_BEAT');
 const keys=items.map(x=>x.id);
 requireTrue(new Set(keys).size===keys.length,'DUPLICATE_BEAT_ID');
 const ordered=[...items];
 if(opts.order==='seeded_shuffle'){
  let seed=2166136261;
  for(const c of String(opts.seed??'kfb'))seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
  for(let i=ordered.length-1;i>0;i--){
   seed=(Math.imul(seed,1664525)+1013904223)>>>0;
   const j=seed%(i+1);[ordered[i],ordered[j]]=[ordered[j],ordered[i]];
  }
 }else requireTrue(!opts.order||opts.order==='source','UNSUPPORTED_SEQUENCE_MODE');
 const intro=opts.intro===undefined?'Welcome, dear Fluffheads!':opts.intro;
 const outro='Stay Fluffy!';
 requireTrue(intro===null||(typeof intro==='string'&&!/[\r\n]/.test(intro)),
  'INTRO_MUST_BE_ONE_LINE_OR_NULL');
 const rows=[...(intro?[intro]:[]),...ordered.map(x=>x.text),outro];
 const text=rows.join('\n\n');
 requireTrue(!/\n\n\n/.test(text),'INVALID_CARD_CUT_DELIMITER');
 requireTrue(text.length<=(opts.maxChars??MAX_SCRIPT_CHARS),
  'SCRIPT_OVER_CHARACTER_LIMIT_SPLIT_INTO_EXPLICIT_PARTS');
 return Object.freeze({
  schema:SCHEMA,kind:'SOLO_VOICE_ONLY_SCRIPT_CANDIDATE',
  text,lines:rows,cardBeatCount:ordered.length,
  beatRefs:ordered.map((x,index)=>({position:index,
   cardId:x.deckId+':'+x.cardNumber,beatId:x.id,startCue:x.startCue,endCue:x.endCue,
   openerMode:x.openerMode,text:x.text,cardTitle:x.originalCardName,
   pauseBeforeMs:x.delivery.pauseBeforeMs,pauseAfterMs:x.delivery.pauseAfterMs,
   recommendedDelivery:x.delivery,sourceRevision:x.cardSourceRevision,
   sourceCoverage:x.sourceCoverage,performerFiction:x.performerFiction})),
  intro:intro||null,outro,bridgesUsed:0,soundbed:'NONE',outputMode:'VOICE_ONLY_DRY',
  transcriptFormat:'ONE_PHYSICAL_LINE_PER_CARD_BLANK_LINE_BETWEEN',
  timingStatus:'ONLY_RECOMMENDED_PAUSES_NOT_MEASURED_AUDIO_TIMESTAMPS',
  sunoStyle:'Solo stand-up spoken word, completely dry a cappella voice, no music, no instruments, no singing, clear natural delivery, independent comedic beats, varied short pauses between cards. No chorus.',
  noMusicGuaranteedBySuno:false,isLlmFree:true,
  dataStatus:'EDITORIAL_CANDIDATE_NOT_HUMAN_ACCEPTED',admitted:false
 });
}
module.exports=Object.freeze({SCHEMA,OPENERS,sourceCoverage,toBeat,toFullSourceBeat,assembleSolo});
