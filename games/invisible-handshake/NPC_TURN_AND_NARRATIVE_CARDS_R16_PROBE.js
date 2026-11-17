/* R16 static tests. NOT a full game AI / human playtest.
 * Six outer faction narratives at setup, 2..6 humans, NPC other seats, center die-free.
 * One shared NPC pulse after a human circuit; C1 Lenses affect a die, a draw or a hand exchange.
 * Run: node NPC_TURN_AND_NARRATIVE_CARDS_R16_PROBE.js
 */
'use strict';
const assert=require('node:assert/strict');
const cp=o=>JSON.parse(JSON.stringify(o));
const count=s=>s.stock+s.hands.reduce((a,b)=>a+b,0)+s.board.filter(Boolean).length+
 (s.focus?1:0)+s.discard+s.trophies;
function check(s){assert.equal(count(s),50);assert.equal(new Set(s.dice.filter(x=>x!==null)).size,s.dice.filter(x=>x!==null).length);
 assert.ok(s.dice.every(x=>x===null||(x>=0&&x<6&&s.board[x])));assert.ok(s.faces.every(x=>x>=1&&x<=6));
 assert.deepEqual(s.hands,s.handIDs.map(h=>h.length));}
function make(n){return {n,board:Array(6).fill(true),hands:Array(n).fill(3),
 handIDs:Array.from({length:n},(_,i)=>[0,1,2].map(j=>'P'+i+'-'+j)),
 focus:true,stock:43-3*n,discard:0,trophies:0,dice:[0,1,2],faces:[3,3,3]};}
function reframeNPC(s,seat){assert.ok(seat>=s.n&&s.board[seat]);if(s.stock===0)return 'SKIP';
 s.stock--;s.discard++;check(s);return 'REFRAME';}
function refillNPC(s,seat){assert.ok(seat>=s.n&&!s.board[seat]);if(s.stock===0)return 'SKIP';
 s.stock--;s.board[seat]=true;check(s);return 'REFILL';}
function pulseB(s,seat){assert.ok(seat>=s.n);
 if(!s.board[seat])return refillNPC(s,seat);
 const i=s.dice.indexOf(seat);if(i===-1)return reframeNPC(s,seat);
 for(let shift=1;shift<6;shift++){const target=(seat+shift)%6;
  if(s.board[target]&&!s.dice.includes(target)){s.dice[i]=target;check(s);return 'MOVE';}}
 return 'SKIP';}
function rewrite(s,p){assert.ok(s.board[p]&&s.hands[p]>0);
 s.handIDs[p].shift();s.hands[p]--;s.discard++;check(s);}
function enter(s,p){assert.ok(!s.board[p]&&s.hands[p]>0);
 s.handIDs[p].shift();s.hands[p]--;s.board[p]=true;check(s);}
function lens(s,type,player){
 if(type==='FEAR'){const i=s.faces.findIndex(v=>v<6);if(i>=0)s.faces[i]++;}
 else if(type==='HOPE'){if(s.hands[player]<6&&s.stock>0){s.stock--;s.hands[player]++;s.handIDs[player].push('DRAWN-'+s.stock);}}
 else if(type==='HATE'){const rival=(player+1)%s.n;
  if(s.hands[player]>0&&s.hands[rival]>0){
   // Fixed index 0 is a deterministic fixture for a real uniform random rival-hand index.
   const own=s.handIDs[player][0],theirs=s.handIDs[rival][0];
   s.handIDs[player][0]=theirs;s.handIDs[rival][0]=own;
  }}
 check(s);
}
let cases=0,checks=0;let exchangeCases=0,drawCases=0;
for(let n=2;n<=6;n++){
 const initial=make(n);check(initial);assert.equal(initial.stock,43-3*n);checks+=2;cases++;
 let x=cp(initial);rewrite(x,0);assert.equal(x.hands[0],2);checks++;cases++;
 for(const type of ['FEAR','HOPE','HATE']){
  x=cp(initial);rewrite(x,0);
  const before=cp(x);lens(x,type,0);
  if(type==='FEAR'){assert.equal(x.faces[0],before.faces[0]+1);}
  if(type==='HOPE'){assert.equal(x.hands[0],before.hands[0]+1);assert.equal(x.stock,before.stock-1);drawCases++;}
  if(type==='HATE'){assert.equal(x.handIDs[0][0],before.handIDs[1][0]);assert.equal(x.handIDs[1][0],before.handIDs[0][0]);exchangeCases++;}
  checks++;cases++;
 }
 x=cp(initial);x.board[0]=false;x.trophies++;const i=x.dice.indexOf(0);
 if(i>=0)x.dice[i]=3;check(x);enter(x,0);checks++;cases++;
 if(n<6){
  const slot=n;
  let a=cp(initial);assert.equal(reframeNPC(a,slot),'REFRAME');assert.equal(a.stock,initial.stock-1);checks++;cases++;
  let b=cp(initial);b.dice=[0,1,slot];check(b);assert.equal(pulseB(b,slot),'MOVE');checks++;cases++;
  let c=cp(initial);c.board[slot]=false;c.discard++;const di=c.dice.indexOf(slot);
  if(di>=0)c.dice[di]=null;check(c);assert.equal(refillNPC(c,slot),'REFILL');checks++;cases++;
  let d=cp(initial);assert.equal(pulseB(d,slot),slot===2?'MOVE':'REFRAME');checks++;cases++;
 }
}
assert.equal(cases,46);assert.equal(exchangeCases,5);assert.equal(drawCases,5);
console.log(JSON.stringify({status:'PASS',cases,assertionGroups:checks,exchangeCases,drawCases,
 stocks:[2,3,4,5,6].map(n=>({human:n,npc:6-n,stock:43-3*n})),
 scope:'Static conserved card moves, one-die capacities; not full NPC play or gameplay balance'},null,2));
