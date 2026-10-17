// Editorial data adapter only. Playback remains with KFBCardPerformance.
export const POOL_SCHEMA = 'kfb.voice.triplet-opener-pool/1';
export const PACKET_SCHEMA = 'kfb.voice.card-performance-packet/1';
export const STATES = ['PROPOSED','EDITORIAL_CANDIDATE','REVIEWED','ACCEPTED','QUARANTINED'];
const assert = (ok, reason) => { if (!ok) throw Error(reason); };
const nonempty = x => typeof x === 'string' && !!x.trim();
const sha = x => /^[a-f0-9]{40}$/.test(x || '');
const words = x => [...String(x || '').matchAll(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)];
export function validateSource(deck, meta) {
  assert(nonempty(meta?.packId) && Number.isInteger(meta.cardCount), 'REGISTRY_METADATA_REQUIRED');
  assert(Array.isArray(deck?.cards) && deck.cards.length === meta.cardCount, 'SOURCE_CARD_COUNT_MISMATCH');
  const ids = deck.cards.map(c => c.cardNumber);
  assert(ids.every(n => Number.isInteger(n) && n > 0) && new Set(ids).size === ids.length, 'SOURCE_CARD_ID_MISMATCH');
  for (const c of deck.cards) {
    assert(nonempty(c.cardName), 'SOURCE_TITLE_MISSING');
    for (const f of ['power','lore']) assert(c[f] == null || typeof c[f] === 'string', 'INVALID_SOURCE_FIELD');
  }
  return deck;
}
export const missingFields = card => ['cardName','power','lore'].filter(f => !nonempty(card?.[f]));
export function validateOpener(o) {
  assert(nonempty(o?.openerId) && Number.isInteger(o.version) && o.version > 0, 'OPENER_ID_VERSION_REQUIRED');
  assert(STATES.includes(o.status) && nonempty(o.owner) && Array.isArray(o.history), 'OPENER_REVIEW_METADATA_REQUIRED');
  assert(o.kind === 'OPENER' && ['SOURCE_NEUTRAL','FOOD','PERSON','ACTION','CONDITION'].includes(o.sourceClass), 'OPENER_CLASS_REQUIRED');
  assert(nonempty(o.pattern) && !/[\r\n]/.test(o.pattern) && o.pattern.split('{title}').length === 2 && !/[{}]/.test(o.pattern.replace('{title}','')), 'OPENER_TITLE_PATTERN_REQUIRED');
  assert(typeof o.performerFiction === 'boolean' && Array.isArray(o.requiredEvidence) && o.source?.path && sha(o.source.revision), 'OPENER_SOURCE_METADATA_REQUIRED');
  if (['REVIEWED','ACCEPTED'].includes(o.status)) assert(nonempty(o.reviewer), 'REVIEWER_REQUIRED');
  if (o.status === 'ACCEPTED') assert(o.humanApproval?.authority === 'Georg' && nonempty(o.humanApproval.evidence), 'HUMAN_ACCEPTANCE_REQUIRED');
  return o;
}
export function validatePool(p) {
  assert(p?.schema === POOL_SCHEMA && nonempty(p.contentRevision) && p.canonicalDefault === false, 'POOL_SCHEMA_OR_PREVIEW_BOUNDARY');
  for (const k of ['openers','beats','bridges','sets']) assert(Array.isArray(p[k]), 'POOL_ARRAY_REQUIRED:'+k);
  p.openers.forEach(validateOpener);
  assert(new Set(p.openers.map(o=>o.openerId)).size === p.openers.length, 'DUPLICATE_OPENER_ID');
  assert(new Set(p.beats.map(b=>b.beatId)).size === p.beats.length, 'DUPLICATE_BEAT_ID');
  for (const b of p.beats) assert(nonempty(b.beatId) && sha(b.cardBlob) && nonempty(b.deckId) && Number.isInteger(b.cardNumber) && STATES.includes(b.status), 'BEAT_ID_SOURCE_STATUS_REQUIRED');
  return p;
}
export function openerAllowed(o, card, opts = {}) {
  validateOpener(o);
  if (o.retired || ['QUARANTINED','PROPOSED'].includes(o.status) || o.enabled !== true) return false;
  if (['ACTION','CONDITION'].includes(o.sourceClass)) return false; // Separate admitted grammar required.
  if (o.performerFiction && opts.allowPerformerFiction !== true) return false;
  if (o.sourceClass === 'SOURCE_NEUTRAL') return true;
  const evidence = opts.classEvidence;
  if (!evidence || evidence.field === 'cardName' && !nonempty(evidence.quote)) return false;
  if (!['cardName','power','lore'].includes(evidence.field) || !nonempty(evidence.quote) || !card[evidence.field]?.includes(evidence.quote)) return false;
  if (o.sourceClass === 'FOOD') return /cookie|snickerdoodle|food|soup|bread|cake|salad|meal|eat|taste/i.test(evidence.quote);
  return o.sourceClass === 'PERSON' && opts.sourceClass === 'PERSON' && ['He','She','They'].includes(opts.pronoun);
}
export function fullSourceBeat(card, meta) {
  assert(!missingFields(card).length, 'NO_BEAT_SOURCE_INCOMPLETE');
  assert(sha(meta.cardBlob), 'CARD_BLOB_REQUIRED');
  return {beatId:`${meta.deckId}:${card.cardNumber}:full`, version:1, deckId:meta.deckId, cardNumber:card.cardNumber, cardBlob:meta.cardBlob,
    mode:'FULL_SOURCE_RECITAL', surfaceText:`${card.cardName}. ${card.power} ${card.lore}`.replace(/[\r\n]+/g,' '),
    status:'EDITORIAL_CANDIDATE', owner:'KFB Voice / PR #379', reviewer:null, humanAcceptance:'PENDING',
    evidence:['cardName','power','lore'].map(field=>({field,quote:card[field],start:0,end:card[field].length,spoken:card[field]})),
    semanticCoverage:{power:'SOURCE_RECITAL',lore:'SOURCE_RECITAL',reframe:'NOT_CLAIMED',newClaims:'NONE_IN_SOURCE_RECITAL',humanAcceptance:'PENDING'},
    speaker:{id:'lorekeeper'},delivery:{pauseBeforeMs:300,pauseAfterMs:800,rate:0.93,pitch:1,emphasis:'source absurdity'},
    performerFictionApproval:false,openerId:'DIRECT',openerVersion:1,history:[]};
}
export function validateBeat(b, card, meta) {
  assert(!missingFields(card).length, 'NO_BEAT_SOURCE_INCOMPLETE');
  assert(b.deckId === meta.deckId && b.cardBlob === meta.cardBlob && b.cardNumber === card.cardNumber, 'BEAT_SOURCE_REVISION_CONFLICT');
  assert(nonempty(b.beatId) && Number.isInteger(b.version) && STATES.includes(b.status), 'BEAT_METADATA_REQUIRED');
  assert(nonempty(b.surfaceText) && !/[\r\n]/.test(b.surfaceText) && b.surfaceText.includes(card.cardName), 'SPOKEN_ORIGINAL_TITLE_ONE_LINE_REQUIRED');
  assert(Array.isArray(b.evidence), 'BEAT_EVIDENCE_REQUIRED');
  for (const field of ['cardName','power','lore']) {
    const refs=b.evidence.filter(e=>e.field===field);
    assert(refs.length > 0, 'SOURCE_EVIDENCE_MISSING:'+field);
    for (const e of refs) {
      assert(Number.isInteger(e.start) && Number.isInteger(e.end) && e.start >= 0 && e.end > e.start && card[field].slice(e.start,e.end) === e.quote, 'SOURCE_SPAN_DRIFT:'+field);
      assert(nonempty(e.spoken) && b.surfaceText.includes(e.spoken), 'EVIDENCE_NOT_AUDIBLE:'+field);
    }
  }
  assert(b.delivery && ['pauseBeforeMs','pauseAfterMs','rate','pitch'].every(k=>Number.isFinite(b.delivery[k])) && b.delivery.pauseBeforeMs>=0 && b.delivery.pauseAfterMs>=0 && b.delivery.pauseAfterMs<=5000 && b.delivery.rate>=0.5 && b.delivery.rate<=1.5 && b.delivery.pitch>=0.5 && b.delivery.pitch<=1.5,'INVALID_DELIVERY');
  assert(b.semanticCoverage && b.semanticCoverage.humanAcceptance, 'SEMANTIC_REVIEW_REQUIRED');
  if (b.mode === 'COMPACT') assert(nonempty(b.semanticCoverage.power) && nonempty(b.semanticCoverage.lore) && nonempty(b.semanticCoverage.reframe), 'COMPACT_SEMANTIC_MECHANISM_REQUIRED');
  if (['REVIEWED','ACCEPTED'].includes(b.status)) assert(nonempty(b.reviewer), 'BEAT_REVIEWER_REQUIRED');
  if (b.status === 'ACCEPTED') assert(b.humanApproval?.authority === 'Georg' && nonempty(b.humanApproval.evidence), 'HUMAN_ACCEPTANCE_REQUIRED');
  return b;
}
export function retention(b, card) {
  const fields={}; let total=0, retained=0;
  for(const field of ['cardName','power','lore']) {
    const all=words(card[field]); const refs=(b.evidence||[]).filter(e=>e.field===field && card[field]?.slice(e.start,e.end)===e.quote && b.surfaceText.includes(e.spoken));
    const hits=all.filter(t=>refs.some(e=>t.index>=e.start && t.index+t[0].length<=e.end));
    total+=all.length;retained+=hits.length;
    fields[field]={originalTokens:all.length,referencedTokens:hits.length};
  }
  return {method:'ORIGINAL_TOKEN_POSITIONS_REFERENCED_BY_AUDIBLE_EVIDENCE',fields,originalTokens:total,referencedTokens:retained,pct:total?Math.round(10000*retained/total)/100:0,semanticCoveragePct:null};
}
export function applyOpener(b, o, card, opts={}) {
  assert(openerAllowed(o,card,opts), 'OPENER_NOT_ELIGIBLE');
  const opening=o.pattern.replace('{title}',card.cardName);
  if(o.openerId==='DIRECT') return {...b,openerId:o.openerId,openerVersion:o.version,performerFictionApproval:false};
  const tail=b.surfaceText.startsWith(card.cardName)?b.surfaceText.slice(card.cardName.length).replace(/^[. ]+/,''):b.surfaceText;
  assert(tail && !tail.includes(card.cardName), 'RESET_TO_CORE_BEFORE_OPENER');
  const text=opening+' '+(b.mode==='COMPACT'?(opts.pronoun||'It')+' ':'')+tail;
  return {...b,surfaceText:text,openerId:o.openerId,openerVersion:o.version,performerFictionApproval:o.performerFiction && opts.allowPerformerFiction===true,
    sourceClass:opts.sourceClass,classEvidence:opts.classEvidence,pronoun:opts.pronoun,evidence:b.evidence.map(e=>e.field==='cardName'?{...e,spoken:card.cardName}:e),status:'EDITORIAL_CANDIDATE',reviewer:null};
}
export function seededOrder(ids, seed) {
  const out=[...ids];let h=2166136261;for(const c of String(seed))h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;
  for(let i=out.length-1;i>0;i--){h=(Math.imul(h,1664525)+1013904223)>>>0;const j=h%(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;
}
export function makePacket({pool,meta,deck,beats,selection,intro='',preview=true,contentBlob,registryBlob}) {
  assert(selection.length && new Set(selection).size===selection.length, 'NONEMPTY_UNIQUE_SELECTION_REQUIRED');
  const chosen=selection.map(n=>{const card=deck.cards.find(c=>c.cardNumber===n);assert(card,'SOURCE_CARD_MISSING');const b=beats[n];assert(b,'NO_CURATED_BEAT');validateBeat(b,card,meta);const o=pool.openers.find(o=>o.openerId===b.openerId);assert(o && o.version===b.openerVersion,'OPENER_VERSION_CONFLICT');assert(openerAllowed(o,card,{allowPerformerFiction:b.performerFictionApproval,sourceClass:b.sourceClass,classEvidence:b.classEvidence,pronoun:b.pronoun}),'OPENER_NOT_ELIGIBLE');if(!preview)assert(o.status==='ACCEPTED','ACCEPTED_OPENER_ONLY');assert(!['QUARANTINED','PROPOSED'].includes(b.status),'BEAT_NOT_PLAYABLE');if(!preview)assert(b.status==='ACCEPTED','ACCEPTED_ONLY');return {...b,sourceRetention:retention(b,card)};});
  const set={setId:`${meta.deckId}:selection`,orderedBeatIds:chosen.map(b=>b.beatId),bridgeIds:[],intro,outro:'Stay Fluffy!',cutBoundary:'BLANK_LINE',timing:'NO_RENDERED_CLIP_TIMES'};
  return {schema:PACKET_SCHEMA,preview,contentRevision:pool.contentRevision,contentBlob,registryBlob,Openers:pool.openers.filter(o=>chosen.some(b=>b.openerId===o.openerId)),CardBeats:chosen,PerformanceSet:set,VoiceClips:[],CardVisuals:chosen.map(b=>({deckId:b.deckId,cardNumber:b.cardNumber,cardBlob:b.cardBlob,pdfPath:meta.pdfPath,pdfRevision:meta.pdfRevision||null,page:meta.coverOffset+1+Math.floor((b.cardNumber-1)/4),quadrant:['TL','TR','BL','BR'][(b.cardNumber-1)%4],status:'ORIGINAL_PDF_GRID_REFERENCE_CROP_NOT_YET_RENDERED'})),originalCards:chosen.map(b=>deck.cards.find(c=>c.cardNumber===b.cardNumber)),text:[...(intro?[intro]:[]),...chosen.map(b=>b.surfaceText),'Stay Fluffy!'].join('\n\n')};
}
export function consumePacket(packet,{preview=false}={}) {
  assert(packet?.schema===PACKET_SCHEMA,'PACKET_SCHEMA_REQUIRED');
  assert(preview || !packet.preview,'EXPLICIT_PREVIEW_REQUIRED');
  assert(Array.isArray(packet.CardBeats) && Array.isArray(packet.originalCards) && Array.isArray(packet.Openers),'SOURCE_AND_OPENER_RECORDS_REQUIRED');
  for(const b of packet.CardBeats){assert(!['QUARANTINED','PROPOSED'].includes(b.status),'BEAT_NOT_PLAYABLE');const card=packet.originalCards.find(c=>c.cardNumber===b.cardNumber);assert(card,'ORIGINAL_CARD_REQUIRED');validateBeat(b,card,{deckId:b.deckId,cardBlob:b.cardBlob});const o=packet.Openers.find(o=>o.openerId===b.openerId && o.version===b.openerVersion);assert(o,'PINNED_OPENER_REQUIRED');validateOpener(o);assert(openerAllowed(o,card,{allowPerformerFiction:b.performerFictionApproval,sourceClass:b.sourceClass,classEvidence:b.classEvidence,pronoun:b.pronoun}),'OPENER_NOT_ELIGIBLE');if(!preview)assert(o.status==='ACCEPTED','ACCEPTED_OPENER_ONLY');}
  const beats=packet.CardBeats.filter(b=>preview || b.status==='ACCEPTED');
  assert(preview || beats.length===packet.CardBeats.length,'ACCEPTED_ONLY');
  return {beats,set:packet.PerformanceSet,voiceClips:packet.VoiceClips,visuals:packet.CardVisuals};
}
