// KFB Triplets R1 self-check. Core validateBeat MUST also be called in a real Node run.
import { validateBeat } from '../../../../ws1/kfb-planet/src/vendor/triplet-pool-core.mjs';
import fs from 'node:fs';
const p=JSON.parse(fs.readFileSync(new URL('./sample-16.json',import.meta.url)));
const reasons=[];let checked=0;
const stop=new Set('a an the of to for by in on at with from and or but because as is are was were be been being it its this that these those your you who what which how why we they their i me my he she his her into through until against than not no one all any every another can cannot will would should did do does have has had over under up down if then only also each even just'.split(' '));
const tokens=s=>(String(s).toLowerCase().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)||[]).filter(x=>!stop.has(x));
const norm=x=>x.replace(/['’]s$/,'').replace(/(ing|ed|es|s)$/,'');
function ownCheck(beat,card){const e=[];const t=beat.surfaceText;
if(!t.startsWith(card.cardName+' '))e.push('V231_TITLE_NOT_FIRST_SUBJECT');
if((t.match(/[.!?](?:\s|$)/g)||[]).length!==1)e.push('SENTENCE_COUNT');
if(!['cardName','power','lore'].every(f=>typeof card[f]==='string'&&card[f].trim()))e.push('SOURCE_MISSING');
if(!beat.evidence || !['cardName','power','lore'].every(f=>beat.evidence.some(x=>x.field===f&&card[f].slice(x.start,x.end)===x.quote&&t.includes(x.spoken))))e.push('EVIDENCE');
const lex=new Set(tokens(card.cardName+' '+card.power+' '+card.lore).map(norm));const w=tokens(t);const pct=w.length?Math.round(10000*w.filter(x=>lex.has(norm(x))).length/w.length)/100:0;
if(pct<90)e.push('CONTENT_SHARE_BELOW_90'); if(beat.contentShare.pct!==pct)e.push('SHARE_DRIFT');
if(t===card.cardName+'. '+card.power+' '+card.lore||t.includes(card.power)&&t.includes(card.lore))e.push('SOURCE_RECITAL');
if(!beat.slots||!['show','spin','sell'].every(s=>t.includes(beat.slots[s])))e.push('SLOTS');
if(!beat.semanticCoverage?.reframe?.trim())e.push('TURN_ABSENT');
return e;}
for(const row of p.sampleRows){if(!row.beat)continue;try{validateBeat(row.beat,{...row.original,cardNumber:row.cardNumber},{deckId:row.deckId,cardBlob:row.beat.cardBlob});const errs=ownCheck(row.beat,row.original);if(errs.length)reasons.push({id:row.beat.beatId,errors:errs});else checked++;}catch(e){reasons.push({id:row.beat.beatId,errors:[String(e.message)]});}}
const negative=[{kind:'recital',result:ownCheck({...p.beats[0],surfaceText:p.sampleRows[0].original.cardName+'. '+p.sampleRows[0].original.power+' '+p.sampleRows[0].original.lore},p.sampleRows[0].original)},{kind:'1001 Nights #5-7 R1',result:'PENDING_EXACT_R1_FIXTURE'}];
console.log(JSON.stringify({checked,failed:reasons.length,reasons,negative},null,2));if(reasons.length)process.exitCode=1;
