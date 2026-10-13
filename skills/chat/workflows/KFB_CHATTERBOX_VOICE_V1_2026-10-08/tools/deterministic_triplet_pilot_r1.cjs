/* KFB Triplets · Source-spans + approved typed micro-operators · proof-only v0.1
 * Exact original Card JSON and revision are supplied by callers, not rehosted here.
 * Candidate output is NEVER human accepted by this module.
 * Runtime uses zero network/LLM; no Audio or ChatterBox engine created.
 */
'use strict';

const SCHEMA = 'kfb.triplets.source-span-pilot/0.1';
const ALLOWED_GLUE = new Set(['', ' ', ', ', '; ', '. ', '.',
  ' because ', ', but ', ', so ', 'It ', ' and ', ' not ', ' but ']);
const OPERATORS = Object.freeze({
  SOURCE_CONTRAST: 'Explicit source contrast alters the stake',
  SAFETY_CAUSAL_IRONY: 'Source assertion recast by a sourced confinement effect',
  NEGATED_EXPECTATION: 'Explicit negation redirects expected object',
  SOURCE_RECLASSIFICATION: 'Sourced target recategorized against original expectation',
  SOURCE_APPROPRIATION: 'Source language repurposed with a changed agent/claim'
});
const BRIDGE_OPERATORS = Object.freeze({
  MISSED_DEADLINE_RENEWED_ALARM: 'Prior failure to arrive triggers next alarm',
  SOURCE_COST_ROLLOVER: 'Source-tagged prior cost becomes next trigger'
});
const trim = value => String(value ?? '').trim();
function assert(condition, message) { if (!condition) throw Error(message); }
function words(value) { return String(value).match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || []; }
function cardFor(deck, number) {
  assert(Array.isArray(deck?.cards), 'SOURCE_DECK_REQUIRED');
  const card = deck.cards.find(c => Number(c.cardNumber) === Number(number));
  assert(card, 'SOURCE_CARD_NOT_FOUND:' + number);
  return card;
}
function extractSpan(deck, number, field, verbatim, deckId, revision) {
  assert(['cardName', 'power', 'lore'].includes(field), 'UNSUPPORTED_SOURCE_FIELD:' + field);
  const source = cardFor(deck, number)[field];
  assert(typeof source === 'string' && source.length, 'EMPTY_SOURCE_FIELD:' + field);
  assert(typeof verbatim === 'string' && verbatim.length, 'EMPTY_SOURCE_QUOTE');
  const start = source.indexOf(verbatim);
  assert(start >= 0, 'SOURCE_QUOTE_MISSING:' + number + ':' + field + ':' + verbatim);
  assert(source.indexOf(verbatim, start + 1) === -1, 'AMBIGUOUS_SOURCE_QUOTE:' + verbatim);
  return Object.freeze({ deckId, cardNumber: Number(number), revision, field,
    start, end: start + verbatim.length, verbatim });
}
function resolvePart(deck, meta, item) {
  if ('glue' in item) {
    assert(ALLOWED_GLUE.has(item.glue), 'UNAPPROVED_GLUE:' + item.glue);
    return { type: 'GLUE', value: item.glue };
  }
  const sp = extractSpan(deck, item.cardNumber ?? meta.cardNumber, item.field,
    item.quote, meta.deckId, meta.revision);
  return { type: 'SOURCE', value: sp.verbatim, source: sp };
}
function fail(kind, reason, context = {}) {
  return { kind, reason, ...context, admitted: false };
}
function compileTriplet(deck, meta, recipe) {
  assert(meta?.deckId && meta?.revision, 'PINNED_DECK_METADATA_REQUIRED');
  cardFor(deck, meta.cardNumber);
  if (!recipe) return fail('NO_TRIPLET', 'NO_CURATED_SEMANTIC_RECIPE',
    { deckId: meta.deckId, cardNumber: meta.cardNumber });
  assert(recipe.deckId === meta.deckId && recipe.cardNumber === meta.cardNumber,
    'RECIPE_CARD_MISMATCH');
  assert(Object.hasOwn(OPERATORS, recipe.operatorId), 'NO_SEMANTIC_OPERATOR');
  assert(recipe.reviewStatus === 'EDITORIAL_CANDIDATE' ||
    recipe.reviewStatus === 'REVIEWED', 'UNVERIFIED_REVIEW_STATUS');
  const p = recipe.proof;
  for (const k of ['subjectEvidence', 'predicateClaim', 'reframeEvidence',
    'interpretationBefore', 'interpretationAfter', 'changedStake']) {
    assert(typeof p?.[k] === 'string' && p[k].trim(), 'MISSING_SEMANTIC_PROOF:' + k);
  }
  assert(p.interpretationBefore !== p.interpretationAfter, 'NO_SEMANTIC_REFRAME');
  assert(Array.isArray(recipe.surface) && recipe.surface.length > 0, 'NO_SURFACE');
  const parts = recipe.surface.map(it => resolvePart(deck, meta, it));
  const source = parts.filter(p => p.type === 'SOURCE');
  assert(source.length >= 2 && source.every(p =>
    p.source.cardNumber === Number(meta.cardNumber)), 'TOO_FEW_SOURCE_ANCHORS');
  for (const role of ['subject', 'predicate', 'reframe']) {
    const expected = p[role === 'subject' ? 'subjectEvidence' :
      role === 'predicate' ? 'predicateClaim' : 'reframeEvidence'];
    assert(expected && (source.some(x => x.value.includes(expected)) ||
      (role === 'predicate' && recipe.operatorId === 'SAFETY_CAUSAL_IRONY'
        && expected === 'because')), 'SLOT_NOT_GROUNDED:' + role);
  }
  const text = parts.map(x => x.value).join('').replace(/\s+/g, ' ').trim();
  assert(words(text).length > 0 && /[.!?]$/.test(text), 'BAD_UTTERANCE_FORM');
  const sourceWords = source.reduce((n,x)=>n+words(x.value).length,0);
  const addedWords = parts.filter(x=>x.type==='GLUE').reduce((n,x)=>n+words(x.value).length,0);
  return { schema: SCHEMA, kind: 'TRIPLET_CANDIDATE', deckId: meta.deckId,
    cardNumber: meta.cardNumber, revision: meta.revision, operatorId: recipe.operatorId,
    text, pieces: parts, proof: p, sourceWords, glueWords: addedWords,
    reviewStatus: recipe.reviewStatus, admitted: false };
}
function compileBridge(fromDeck, toDeck, fromMeta, toMeta, recipe) {
  const anchor = { from: { deckId: fromMeta.deckId, cardNumber: fromMeta.cardNumber },
    to: { deckId: toMeta.deckId, cardNumber: toMeta.cardNumber } };
  if (!recipe) return fail('NO_EDGE', 'NO_CURATED_COMPATIBLE_EDGE', anchor);
  assert(Object.hasOwn(BRIDGE_OPERATORS, recipe.operatorId), 'UNKNOWN_BRIDGE_OPERATOR');
  assert(recipe.fromCard === fromMeta.cardNumber &&
    recipe.toCard === toMeta.cardNumber, 'BRIDGE_CARDS_MISMATCH');
  const proof = recipe.proof;
  for (const k of ['beforeState', 'trigger', 'afterState', 'changedStake']) {
    assert(typeof proof?.[k] === 'string' && proof[k].trim(), 'MISSING_BRIDGE_PROOF:' + k);
  }
  assert(proof.beforeState !== proof.afterState, 'NO_STATE_CHANGE');
  const spanBefore = extractSpan(fromDeck, fromMeta.cardNumber,
    recipe.before.field, recipe.before.quote, fromMeta.deckId, fromMeta.revision);
  const spanAfter = extractSpan(toDeck, toMeta.cardNumber,
    recipe.after.field, recipe.after.quote, toMeta.deckId, toMeta.revision);
  assert(proof.beforeState.includes(spanBefore.verbatim) ||
    spanBefore.verbatim.includes(proof.beforeState), 'UNSUPPORTED_BEFORE_STATE');
  assert(proof.afterState.includes(spanAfter.verbatim) ||
    spanAfter.verbatim.includes(proof.afterState), 'UNSUPPORTED_AFTER_STATE');
  const parts = recipe.surface.map(x => {
    if ('glue' in x) return resolvePart(null, {}, x);
    const isBefore = x.side === 'before';
    assert(x.side === 'before' || x.side === 'after','MISSING_BRIDGE_SIDE');
    return resolvePart(isBefore ? fromDeck : toDeck, isBefore ? fromMeta : toMeta, x);
  });
  assert(parts.some(x => x.type === 'SOURCE' &&
    x.source.cardNumber === fromMeta.cardNumber) &&
    parts.some(x => x.type === 'SOURCE' &&
    x.source.cardNumber === toMeta.cardNumber), 'BRIDGE_NEEDS_BOTH_SOURCE_SIDES');
  const text = parts.map(x=>x.value).join('').replace(/\s+/g,' ').trim();
  assert(/[.!?]$/.test(text), 'BAD_BRIDGE_FORM');
  return { schema: SCHEMA, kind: 'BRIDGE_CANDIDATE', operatorId: recipe.operatorId,
    from: anchor.from, to: anchor.to, text, proof, pieces: parts,
    reviewStatus: 'EDITORIAL_CANDIDATE', pseudoCausal: !!recipe.pseudoCausal,
    admitted: false };
}
function deckScope(deck, deckId, revision, requested) {
  assert(deckId && revision,'PINNED_DECK_METADATA_REQUIRED');
  assert(Array.isArray(deck?.cards) && deck.cards.length>0,'EMPTY_DECK');
  const all = deck.cards.map(c => Number(c.cardNumber));
  assert(new Set(all).size===all.length,'DUPLICATE_CARD_ID');
  if (requested === 'deck') return {deckId,revision,requested,total:all.length,
    selected:all,omitted:[],kind:'DECK_SCOPE_PLAN',admitted:false};
  assert(Array.isArray(requested) && requested.length>0,'SCOPE_MUST_BE_EXPLICIT');
  const selected=requested.map(Number);
  assert(selected.every(id=>all.includes(id))&&new Set(selected).size===selected.length,
    'MISSING_OR_DUPLICATE_CARD_IN_SCOPE');
  return {deckId,revision,requested,total:all.length,selected,
    omitted:all.filter(x=>!selected.includes(x)),kind:'SELECTED_SCOPE',admitted:false};
}
function seededPick(entries, seed) {
  assert(Array.isArray(entries),'CHOICES_REQUIRED');
  if (!entries.length) return null;
  let n = 2166136261;
  for(const char of String(seed)) n = Math.imul(n ^ char.charCodeAt(0),16777619)>>>0;
  return entries[n%entries.length];
}
module.exports = Object.freeze({SCHEMA, OPERATORS, BRIDGE_OPERATORS,extractSpan,
  compileTriplet,compileBridge,deckScope,seededPick});
