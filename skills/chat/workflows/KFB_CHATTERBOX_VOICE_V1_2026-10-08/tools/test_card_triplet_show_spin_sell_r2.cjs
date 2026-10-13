/* KFB Show/Spin/Sell single Card R2 regression.
 * Run from georg-doc/kayfabizarro repository root:
 * node skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/tools/test_card_triplet_show_spin_sell_r2.cjs
 */
'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const path=require('node:path');
const {compile}=require('./deterministic_card_triplet_show_spin_sell_r2.cjs');
const BASE='skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/';
const raw=p=>fs.readFileSync(path.join(process.cwd(),p),'utf8');
const fixture=JSON.parse(raw(BASE+'data/KFB_TRIPLETS_SHOW_SPIN_SELL_CARD10_R2_FIXTURE_2026-10-13.json'));
const content=raw(fixture.originalSource.path);
const sha=crypto.createHash('sha1').update('blob '+Buffer.byteLength(content)+'\0').update(content).digest('hex');
assert.equal(sha,fixture.originalSource.revision,'SOURCE_BLOB_UNPINNED');
const deck=JSON.parse(content),card=deck.cards.find(c=>c.cardNumber===10);
assert.equal(card.cardName,fixture.originalSource.title);
assert.equal(card.power,fixture.originalSource.power);
assert.equal(card.lore,fixture.originalSource.lore);
const meta={deckId:fixture.deckId,cardNumber:fixture.cardNumber,
 sourceRevision:fixture.originalSource.revision};
const checks=[];
function check(label,fn){fn();checks.push(label);}
function reject(label,modification,pattern){
 check(label,()=>assert.throws(()=>compile(deck,meta,modification),pattern));
}
let good;
check('EXACT_ONE_CARD_SHOW_SPIN_SELL',()=>{
 good=compile(deck,meta,fixture);
 assert.equal(good.text,fixture.expectedSpoken);
 assert.equal(good.admitted,false);
});
check('SHOW_EXACT_TITLE_AUDIBLE',()=>{
 assert.ok(good.text.startsWith(card.cardName+' '));
 assert.equal(good.pieces[0].field,'cardName');
 assert.equal(good.pieces[0].role,'show');
});
check('SPIN_POWER_WITH_LORE',()=>{
 assert.ok(good.pieces.some(x=>x.role==='spin'&&x.field==='power'));
 assert.ok(good.pieces.some(x=>x.role==='spin'&&x.field==='lore'));
});
check('SELL_SOURCE_DERIVED_POWER_COST',()=>{
 assert.ok(good.pieces.some(x=>x.role==='sell'&&x.field==='power'&&x.verbatim==='Keep all damage'));
 assert.ok(good.text.endsWith('but keeps all the damage.'));
});
check('PINNED_CHAR_OFFSETS',()=>{
 for(const part of good.pieces.filter(x=>x.kind==='source')){
  const orig=card[part.field];
  assert.equal(orig.slice(part.start,part.end),part.verbatim);
  assert.equal(part.cardRef.sourceRevision,sha);
 }
});
check('ONE_SENTENCE',()=>assert.equal((good.text.match(/[.!?]/g)||[]).length,1));
check('NO_DRAFT_AUTO_ADMISSION',()=>assert.equal(good.reviewStatus,'EDITORIAL_CANDIDATE'));
check('NO_UNCURATED_CARD',()=>{
 const g=compile(deck,{deckId:fixture.deckId,cardNumber:11,sourceRevision:sha},null);
 assert.equal(g.kind,'NO_TRIPLET');
});
const del=p=>fixture.surface.filter(x=>!(x.field===p));
reject('MISSING_SPOKEN_TITLE',{...fixture,surface:del('cardName')},/SHOW_IT_TITLE_MUST_START_EXACTLY/);
reject('MISSING_POWER',{...fixture,surface:del('power')},/SPIN_IT_REQUIRES_POWER_LORE_MECHANISM/);
reject('MISSING_LORE',{...fixture,surface:del('lore')},/SPIN_IT_REQUIRES_POWER_LORE_MECHANISM/);
reject('MISSING_SELL_COST',{...fixture,surface:fixture.surface.filter(x=>x.role!=='sell')},/SELL_IT_REQUIRES_SOURCE_COST/);
reject('SOURCE_ONLY_SUMMARY_WITHOUT_TURN',{...fixture,surface:[
 {role:'show',field:'cardName',quote:'The Cookie of Causality'},
 {glue:' '},{role:'spin',field:'power',quote:'Inciting Incident'},
 {glue:' '},{role:'sell',field:'lore',quote:'a snickerdoodle'},
 {glue:'.'}]},/SPIN_IT_REQUIRES_POWER_LORE_MECHANISM/);
reject('WRONG_CARD_TITLE',{...fixture,surface:[{role:'show',field:'cardName',
 quote:'The Cookie'},...fixture.surface.slice(1)]},/SHOW_IT_TITLE_MUST_START_EXACTLY/);
reject('INVENTED_GLUE',{...fixture,surface:[...fixture.surface.slice(0,1),
 {glue:' attacks a moon wizard and '},...fixture.surface.slice(1)]},/UNAPPROVED_GLUE/);
reject('UNLICENSED_MORPH',{...fixture,surface:fixture.surface.map(x=>
 x.quote==='Restart'?{...x,morph:'add_sarcastic_hoho'}:x)},/UNAPPROVED_INFLECTION/);
reject('UNLICENSED_SOURCE',{...fixture,surface:fixture.surface.map(x=>
 x.quote==='a snickerdoodle'?{...x,quote:'some mythical marshmallow'}:x)},/SOURCE_FRAGMENT_NOT_FOUND/);
reject('WRONG_OPERATOR',{...fixture,operatorId:'TITLE_POWER_LORE_PARROT'},/UNSUPPORTED_SEMANTIC_OPERATOR/);
reject('WRONG_ROLE',{...fixture,surface:fixture.surface.map(x=>
 x.quote==='Keep all damage'?{...x,role:'spin'}:x)},/SELL_IT_REQUIRES_SOURCE_COST/);
reject('CROSS_CARD_SOURCE',{...fixture,surface:fixture.surface.map(x=>
 x.quote==='Turn 1'?{...x,cardNumber:11}:x)},/CROSS_CARD_SOURCE_FORBIDDEN/);
check('ORIGINAL_R1_LORE_ONLY_NEGATIVE',()=>{
 const old="The war didn't start over land or ideology, but over a snickerdoodle.";
 assert.notEqual(good.text,old);
 assert.equal(old.startsWith(card.cardName),false);
 assert.throws(()=>compile(deck,meta,{...fixture,surface:[
  {role:'spin',field:'lore',quote:'The war'},
  {glue:' '},{role:'sell',field:'lore',quote:'a snickerdoodle'},
  {glue:'.'}]}),/SHOW_IT_TITLE_MUST_START_EXACTLY/);
});
check('PREVIOUS_NEGATIVE_GOLDEN_PRESERVED',()=>{
 const name=BASE+'KFB_1001_KAYFABE_NIGHTS_5_6_7_FRIZZLEBOB_TRIPLETS_SUNO_R1_2026-10-13.md';
 const src=raw(name);
 const prev=crypto.createHash('sha1').update('blob '+Buffer.byteLength(src)+'\0').update(src).digest('hex');
 assert.equal(prev,'4d813bfd5aadf57c80552afb4960473c0558b23e');
});
console.log(JSON.stringify({status:'SOURCE_AND_SHAPE_GREEN_NOT_CREATIVE_ACCEPTANCE',
 checks:checks.length,card:meta,text:good.text,fields:good.usedFields,
 originalTitle:card.cardName,power:card.power,lore:card.lore,admitted:false},null,2));
