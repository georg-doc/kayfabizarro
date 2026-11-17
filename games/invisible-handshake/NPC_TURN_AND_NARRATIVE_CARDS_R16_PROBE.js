/* R16 static checks, NOT a full game AI or human playtest.
 * Run: node NPC_TURN_AND_NARRATIVE_CARDS_R16_PROBE.js
 * Six public faction cards; n=2..6 humans and 6-n NPCs; centre always die-free.
 * NPC A replaces one public card; NPC B moves a die if present else replaces.
 * Human PLAY/REWRITE consumes a held card; card Lens prep cannot cross 0/7.
 */
'use strict';
const assert=require('node:assert/strict');
const cp=o=>JSON.parse(JSON.stringify(o));
const count=s=>s.stock+s.hands.reduce((a,b)=>a+b,0)+s.board.filter(Boolean).length+
  (s.focus?1:0)+s.discard+s.trophies;
const dieOK=s=>s.dice.filter(x=>x!==null).every((x,i,arr)=>
  s.board[x]&&arr.indexOf(x)===i)&&s.dice.every(x=>x===null||x>=0&&x<6);
function make(n){
  return {n,board:[true,true,true,true,true,true],hands:Array(n).fill(3),
    focus:true,stock:43-3*n,discard:0,trophies:0,dice:[0,1,2],faces:[3,3,3]};
}
function assertState(s){assert.equal(count(s),50);assert.equal(dieOK(s),true);}
function reframe(s,target){assert.equal(s.board[target],true);if(s.stock<=0)return false;
  s.stock--;s.discard++;assertState(s);return true;}
function refill(s,target){assert.equal(s.board[target],false);if(s.stock<=0)return false;
  s.stock--;s.board[target]=true;assertState(s);return true;}
function npcB(s,target){
  assert.equal(target>=s.n,true);
  if(!s.board[target])return refill(s,target);
  const die=s.dice.indexOf(target);
  if(die<0)return reframe(s,target);
  for(let offset=1;offset<6;offset++){
    const next=(target+offset)%6;
    if(s.board[next]&&!s.dice.includes(next)){
      s.dice[die]=next;assertState(s);return 'MOVE';
    }
  }return 'SKIP';
}
function spin(s,player){
  assert.equal(s.board[player],true);assert.ok(s.hands[player]>0);
  s.hands[player]--;s.discard++;assertState(s);
}
function enter(s,player){
  assert.equal(s.board[player],false);assert.ok(s.hands[player]>0);
  s.hands[player]--;s.board[player]=true;assertState(s);
}
function lens(s,type){
  if(type==='FEAR'){const i=s.faces.findIndex(v=>v<6);if(i>=0)s.faces[i]++; }
  if(type==='HOPE'){const i=s.faces.findIndex(v=>v>1);if(i>=0)s.faces[i]--; }
  if(type==='HATE'){
    const i=s.dice.findIndex(v=>v!==null);
    if(i>=0){const dest=s.board.findIndex((b,j)=>b&&!s.dice.includes(j));if(dest>=0)s.dice[i]=dest;}
  }
  assert.equal(s.faces.every(v=>v>=1&&v<=6),true);assertState(s);
}
let cases=0,assertionGroups=0;
for(let n=2;n<=6;n++){
  const s=make(n);assertState(s);assert.equal(s.stock,43-3*n);cases++;assertionGroups+=2;
  // Human REWRITE: old outer to discard, one held replacement enters, die does not stack.
  let h=cp(s);spin(h,0);assert.equal(h.hands[0],2);cases++;assertionGroups++;
  for(const type of ['FEAR','HOPE','HATE']){h=cp(s);spin(h,0);lens(h,type);cases++;assertionGroups++;}
  // Capture a human outer card and force next-turn entry
  h=cp(s);h.board[0]=false;h.trophies++;
  const i=h.dice.indexOf(0);if(i>=0)h.dice[i]=3;assertState(h);
  enter(h,0);cases++;assertionGroups++;
  if(n<6){
    const slot=n;
    let a=cp(s);reframe(a,slot);assert.equal(a.stock,s.stock-1);cases++;assertionGroups++;
    let b=cp(s);b.dice=[0,1,slot];assertState(b);
    assert.equal(npcB(b,slot),'MOVE');cases++;assertionGroups++;
    let c=cp(s);c.dice=[0,1,slot];assertState(c);
    c.board[slot]=false;c.discard++;const die=c.dice.indexOf(slot);c.dice[die]=null;assertState(c);
    assert.equal(refill(c,slot),true);cases++;assertionGroups++;
    // NPC B chooses a die-free occupied narrative -> A-style reframe
    let d=cp(s);assert.equal(npcB(d,slot),slot===2?'MOVE':true);
    // n=2 slot2 has a die by default, n>=3 no die: both legal.
    cases++;assertionGroups++;
  }
}
assert.equal(cases,46);
console.log(JSON.stringify({status:'PASS',cases,assertionGroups,
 fixed_six_outer:true,hand_deck_conservation:true,single_die_capacity:true,
 notes:'NPC A/B transitions and C1 lens action boundary only; no stochastic full-game simulation, no human fun or endgame tested.'},null,2));
