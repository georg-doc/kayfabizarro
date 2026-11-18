/* The Invisible Handshake R17: exhaustive static semantic routing test.
 * NOT a full round/games script, not a source of empirical persuasion truth.
 * Dice order HATE (Problem), FEAR (Reaction), HOPE (Solution).
 * Each die on a different one of six outer public narrative slots, center die-free.
 * Variant A does not change payoff; variant B routes an available focus to
 * the human faction under HOPE, provided different from the acting human.
 * Run: node THREE_DIE_NARRATIVE_CHAIN_R17_PROBE.js
 */
'use strict';
const assert=require('node:assert/strict');
const layouts=[];
for(let h=0;h<6;h++)for(let f=0;f<6;f++)for(let o=0;o<6;o++){
  if(new Set([h,f,o]).size===3)layouts.push([h,f,o]);
}
assert.equal(layouts.length,120);
const stats={};
let cases=0,totalHumanFocus=0,totalNpcReframe=0,totalActorSame=0,totalNegative=0,totalRefills=0;
for(let n=2;n<=6;n++){
 const row={n,cases:0,positive:0,humanFocus:0,npcReframe:0,actorSame:0,negative:0};
 for(const dice of layouts)for(let actor=0;actor<n;actor++)for(let trigger=0;trigger<3;trigger++)
 for(const edge of ['UP','DOWN']){
   let board=Array(6).fill(true), focus=true,stock=43-3*n,discard=0,trophies=0;
   const removed=dice[trigger],hopeSeat=dice[2];
   // All narrative cards have one owner-by-location; NPC if seat>=n.
   board[removed]=false;
   if(edge==='UP'){
     trophies++;row.positive++;
     if(hopeSeat>=n){focus=false;discard++;row.npcReframe++;totalNpcReframe++;}
     else if(hopeSeat!==actor){focus=false;trophies++;row.humanFocus++;totalHumanFocus++;}
     else {row.actorSame++;totalActorSame++;}
   }else{discard+=2;focus=false;row.negative++;totalNegative++;}
   assert.equal(stock+3*n+board.filter(Boolean).length+Number(focus)+discard+trophies,50);
   const untouched=dice.filter((_,i)=>i!==trigger);
   const relocation=board.map((v,i)=>v&&!untouched.includes(i)?i:-1).filter(i=>i!==-1);
   assert.equal(relocation.length,3);
   for(const seat of relocation)assert.equal(new Set([...untouched,seat]).size,3);
   if(!focus&&stock>0){focus=true;stock--;totalRefills++;}
   assert.equal(stock+3*n+board.filter(Boolean).length+Number(focus)+discard+trophies,50);
   row.cases++;cases++;
 }
 stats[n]=row;
}
assert.equal(cases,14400);
assert.deepEqual([totalHumanFocus,totalNpcReframe,totalActorSame,totalNegative,totalRefills],
 [4200,1800,1200,7200,13200]);
console.log(JSON.stringify({status:'PASS',layouts:layouts.length,static_cases:cases,
 human_focus_awards:totalHumanFocus,npc_focus_reframes:totalNpcReframe,
 same_actor_no_bonus:totalActorSame,negative_reframes:totalNegative,
 hypothetical_next_round_refills:totalRefills,by_humans:stats,
 warning:'No full games, no narrations, no action choices, no NPC refill policy or fairness proof.'},null,2));
