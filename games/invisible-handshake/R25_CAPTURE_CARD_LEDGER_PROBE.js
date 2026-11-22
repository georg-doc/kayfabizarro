'use strict';
// R25 static probe: deterministic scenario transitions only, NOT a full game or balance simulation.
const assert = require('node:assert/strict');
const N = 50;
const outcomes = { oddsD20: {}, oddsThreeD6: {}, ledgers: 0, transitions: 0, scripts: 0, insufficientStockChecks: 0 };
const diceOutcomes=[];
for (let a=1;a<=6;a++)for(let b=1;b<=6;b++)for(let c=1;c<=6;c++)diceOutcomes.push(a+b+c);
assert.equal(diceOutcomes.length,216);
for(let sum=3;sum<=18;sum++){
 const d20=Array.from({length:20},(_,i)=>i+1).filter(x=>x<=sum).length;
 const d666=diceOutcomes.filter(x=>x<=sum).length;
 assert.equal(d20,sum);
 outcomes.oddsD20[sum]=d20+'/20';
 outcomes.oddsThreeD6[sum]=d666+'/216';
}
assert.equal(outcomes.oddsThreeD6[3],'1/216');
assert.equal(outcomes.oddsThreeD6[6],'20/216');
assert.equal(outcomes.oddsThreeD6[9],'81/216');
assert.equal(outcomes.oddsThreeD6[12],'160/216');
assert.equal(outcomes.oddsThreeD6[15],'206/216');
assert.equal(outcomes.oddsThreeD6[18],'216/216');
function setup(n){
 assert.ok(n>=2&&n<=6);
 const used=6+1+3*n;
 const state={
  n, outer:[0,1,2,3,4,5], focus:6, hands:[], stock:[],
  trophies:Array.from({length:n},()=>[]), discard:[], positions:[0,2,4], faces:[1,1,1]
 };
 for(let i=0;i<n;i++)state.hands.push(Array.from({length:3},(_,k)=>7+i*3+k));
 state.stock=Array.from({length:50-used},(_,k)=>used+k);
 assert.equal(state.stock.length,43-3*n);
 return state;
}
function audit(s){
 const all=[...s.outer,s.focus,...s.hands.flat(),...s.stock,...s.trophies.flat(),...s.discard].filter(x=>x!==null);
 assert.equal(all.length,N);
 assert.equal(new Set(all).size,N);
 assert.deepEqual(all.slice().sort((a,b)=>a-b),Array.from({length:N},(_,i)=>i));
 assert.equal(s.outer.length,6);assert.ok(s.outer.every(Number.isInteger));
 assert.ok(new Set(s.positions).size===3);
 assert.ok(s.positions.every(p=>Number.isInteger(p)&&p>=0&&p<6&&s.outer[p]!==null));
 assert.ok(s.faces.every(f=>f>=1&&f<=6));
 outcomes.ledgers++;
}
function publish(s,player){
 assert.ok(s.hands[player].length>0);
 s.discard.push(s.outer[player]);s.outer[player]=s.hands[player].shift();
 audit(s);outcomes.transitions++;
}
function moveTurn(s,role,target){
 assert.ok(role>=0&&role<3);
 assert.ok(!s.positions.includes(target));
 assert.ok(s.faces[role]<6); // TILT is a separate event
 assert.ok(s.outer[target]!==null);
 s.positions[role]=target;s.faces[role]++;
 audit(s);outcomes.transitions++;
}
function failClaim(s,player,policy){
 assert.ok(s.hands[player].length>0);
 s.discard.push(s.hands[player].shift());
 if(policy==='REPLACE') { assert.ok(s.stock.length);s.hands[player].push(s.stock.shift()); }
 else assert.equal(policy,'LOSE');
 audit(s);outcomes.transitions++;
}
function successfulClaim(s,player,activeRole,refreshCount){
 assert.ok(s.focus!==null);assert.ok([1,3].includes(refreshCount));
 if(s.stock.length < refreshCount+1) return false; // fail closed, no phantom cards
 s.trophies[player].push(s.focus);
 s.focus=s.stock.shift();
 const slots=refreshCount===1?[s.positions[activeRole]]:s.positions.slice();
 for(const slot of slots){s.discard.push(s.outer[slot]);s.outer[slot]=s.stock.shift();}
 s.faces=[1,1,1];
 audit(s);outcomes.transitions++;
 return true;
}
function drawWhenEmpty(s,player){
 assert.equal(s.hands[player].length,0);
 if(!s.stock.length)return false;
 s.hands[player].push(s.stock.shift());
 audit(s);outcomes.transitions++;return true;
}
for(const n of [2,3,4,5,6])for(const failPolicy of ['LOSE','REPLACE'])for(const refresh of [1,3]){
 const s=setup(n);audit(s);
 publish(s,0);                     // first faction public narrative replaced from hand
 moveTurn(s,0,1);                 // HATE moves to another legal public slot
 failClaim(s,0,failPolicy);       // optional human claim attempt fails
 moveTurn(s,1,3);                 // FEAR moves; HATE/FEAR/HOPE remain on 3 distinct slots
 assert.equal(successfulClaim(s,1,1,refresh),true); // focus trophy to current claimant
 assert.equal(s.trophies[1].length,1);
 assert.deepEqual(s.faces,[1,1,1]);
 assert.equal(s.stock.length,(43-3*n)-(failPolicy==='REPLACE'?1:0)-(refresh+1));
 outcomes.scripts++;
}
for(const n of [2,3,4,5,6]){
 const s=setup(n);audit(s);
 for(let k=0;k<3;k++)failClaim(s,0,'LOSE');
 assert.equal(s.hands[0].length,0);
 assert.equal(drawWhenEmpty(s,0),true);
 assert.equal(s.hands[0].length,1);
 const blocked=setup(n);
 // Artificially empty the stock ONLY to test fail-closed behavior; preserve card conservation.
 blocked.discard.push(...blocked.stock.splice(0));
 audit(blocked);
 const before=JSON.stringify(blocked);
 assert.equal(successfulClaim(blocked,0,0,1),false);
 assert.equal(JSON.stringify(blocked),before);
 outcomes.insufficientStockChecks++;
}
console.log(JSON.stringify({
 version:'R25 static fixture',
 legalSumRange:[3,18],
 oddsD20:outcomes.oddsD20,
 oddsThreeD6:outcomes.oddsThreeD6,
 completeScenarioScripts:outcomes.scripts,
 cardConservationAudits:outcomes.ledgers,
 assertedLegalTransitions:outcomes.transitions,
 insufficientStockFailClosed:outcomes.insufficientStockChecks,
 humanGames:0,fullMatches:0,publicBrowserTests:0
},null,2));
