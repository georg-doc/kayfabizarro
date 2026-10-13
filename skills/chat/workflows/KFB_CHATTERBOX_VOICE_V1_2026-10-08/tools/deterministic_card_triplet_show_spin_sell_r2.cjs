/* KFB CARD Triplet R2 — one-card SHOW / SPIN / SELL gate.
 * This is not the general source-span R1 emitter, a plugin replacement, a joke generator,
 * or a permission to publish. Requires original source Card and pre-curated recipe.
 * No network, LLM, Audio, stage or clock.
 */
'use strict';
const SCHEMA = 'kfb.triplets.card-show-spin-sell-candidate/0.2';
const PERMITTED_JOINERS = new Set([' ', ' over ', ' at ', ', but ', '.']);
const OPERATORS = Object.freeze({
  RESTART_WITH_PERSISTENT_DAMAGE: Object.freeze({
    powerMechanism: 'Restart the game from Turn 1',
    powerCost: 'Keep all damage',
    loreOrigin: 'a snickerdoodle',
    requiredRoles: ['show', 'spin', 'sell']
  })
});
// Morphology is *closed*: each surface transform has an exact source and output.
// Widen only after a separate source- and grammar-verified editorial fixture.
const MORPH = Object.freeze({
  identity: s => s,
  restart_3s: s => { if (s !== 'Restart') throw Error('BAD_MORPH_SOURCE'); return 'restarts'; },
  lower_war: s => { if (s !== 'The war') throw Error('BAD_MORPH_SOURCE'); return 'the war'; },
  turn_one: s => { if (s !== 'Turn 1') throw Error('BAD_MORPH_SOURCE'); return 'Turn One'; },
  keep_3s_article: s => { if (s !== 'Keep all damage') throw Error('BAD_MORPH_SOURCE'); return 'keeps all the damage'; }
});
function assert(ok,msg){ if (!ok) throw Error(msg); }
function fail(reason,cardId){ return {schema:SCHEMA,kind:'NO_TRIPLET',reason,cardId,admitted:false}; }
function sourceSpan(card,meta,item){
  assert(['cardName','power','lore'].includes(item.field),'BAD_SOURCE_FIELD');
  assert(Number(item.cardNumber ?? meta.cardNumber)===Number(meta.cardNumber),'CROSS_CARD_SOURCE_FORBIDDEN');
  const original=card[item.field];
  assert(typeof original==='string'&&original.length,'SOURCE_FIELD_MISSING:'+item.field);
  const index=original.indexOf(item.quote);
  assert(index>=0,'SOURCE_FRAGMENT_NOT_FOUND:'+item.field);
  assert(original.indexOf(item.quote,index+1)<0,'AMBIGUOUS_SOURCE_FRAGMENT');
  const morph=MORPH[item.morph ?? 'identity'];
  assert(typeof morph==='function','UNAPPROVED_INFLECTION');
  const value=morph(item.quote);
  return {kind:'source',role:item.role,field:item.field,verbatim:item.quote,
    start:index,end:index+item.quote.length,value,transform:item.morph??'identity',
    cardRef:{deckId:meta.deckId,cardNumber:meta.cardNumber,sourceRevision:meta.sourceRevision}};
}
function compile(deck,meta,recipe){
  assert(meta?.deckId&&meta?.sourceRevision&&Number.isInteger(meta.cardNumber),'PINNED_CARD_REQUIRED');
  assert(deck&&Array.isArray(deck.cards),'SOURCE_DECK_MISSING');
  const card=deck.cards.find(c=>Number(c.cardNumber)===meta.cardNumber);
  assert(card,'SOURCE_CARD_NOT_FOUND');
  const cardId=meta.deckId+':'+meta.cardNumber;
  if(!recipe) return fail('NO_CURATED_CARD_RECIPE',cardId);
  assert(recipe.deckId===meta.deckId&&recipe.cardNumber===meta.cardNumber,'CARD_RECIPE_REF_MISMATCH');
  const op=OPERATORS[recipe.operatorId];
  assert(op,'UNSUPPORTED_SEMANTIC_OPERATOR');
  assert(card.power?.includes(op.powerMechanism)&&card.power?.includes(op.powerCost)&&
    card.lore?.includes(op.loreOrigin),'OPERATOR_NOT_GROUNDED_IN_SOURCE');
  assert(recipe.reviewStatus==='EDITORIAL_CANDIDATE','REVIEW_STATE_NOT_CANDIDATE');
  assert(Array.isArray(recipe.surface)&&recipe.surface.length>0,'EMPTY_SURFACE');
  const pieces=recipe.surface.map((s)=>{
    if('glue' in s){
      assert(PERMITTED_JOINERS.has(s.glue),'UNAPPROVED_GLUE');
      return {kind:'glue',value:s.glue};
    }
    assert(['show','spin','sell'].includes(s.role),'MISSING_SEMANTIC_ROLE');
    return sourceSpan(card,meta,s);
  });
  const refs=pieces.filter(x=>x.kind==='source');
  const first=pieces[0];
  assert(first?.field==='cardName'&&first.role==='show'&&first.verbatim===card.cardName&&
    first.value===card.cardName,'SHOW_IT_TITLE_MUST_START_EXACTLY');
  const spin=refs.filter(x=>x.role==='spin');
  const sell=refs.filter(x=>x.role==='sell');
  assert(spin.some(x=>x.field==='power'&&x.verbatim==='Restart') &&
    spin.some(x=>x.field==='power'&&x.verbatim==='Turn 1') &&
    spin.some(x=>x.field==='lore'&&x.verbatim==='The war') &&
    spin.some(x=>x.field==='lore'&&x.verbatim==='a snickerdoodle'),
    'SPIN_IT_REQUIRES_POWER_LORE_MECHANISM');
  assert(sell.some(x=>x.field==='power'&&x.verbatim==='Keep all damage'),
    'SELL_IT_REQUIRES_SOURCE_COST');
  assert(refs.some(x=>x.field==='cardName')&&refs.some(x=>x.field==='power')&&
    refs.some(x=>x.field==='lore'),'ALL_THREE_CARD_FIELDS_REQUIRED');
  const text=pieces.map(x=>x.value).join('');
  assert(text.startsWith(card.cardName+' '),'SHOW_IT_NOT_AUDIBLE');
  assert(text.endsWith('.')&&!text.slice(0,-1).includes('.'),'ONE_SENTENCE_ONLY');
  assert(text.includes(', but keeps all the damage'),'NO_AUDIBLE_COST_REVERSAL');
  const audit={
    before:'Resetting an event might imply erasing prior consequences',
    after:'The source rule restarts the game but keeps all damage',
    powerMechanism:op.powerMechanism,powerCost:op.powerCost,
    loreOrigin:op.loreOrigin,
    linkage:'The rule for restarting the game is applied to the lore war over a snickerdoodle',
    newFactsAdded:false,
    creativeAcceptance:'UNREVIEWED'
  };
  return {schema:SCHEMA,kind:'CARD_TRIPLET_CANDIDATE',cardId,cardName:card.cardName,
    text,pieces,audit,operatorId:recipe.operatorId,sourceRevision:meta.sourceRevision,
    usedFields:['cardName','power','lore'],reviewStatus:recipe.reviewStatus,admitted:false};
}
module.exports=Object.freeze({SCHEMA,OPERATORS,compile});
