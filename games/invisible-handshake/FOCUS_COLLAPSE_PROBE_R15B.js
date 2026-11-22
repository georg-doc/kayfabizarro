/* R15B static model — outer collapse drives FOCUS, not an independent dice target.
 * Run: node FOCUS_COLLAPSE_PROBE_R15B.js
 * No human games, no R14 gameplay simulator change. */
'use strict';
const assert=require('node:assert/strict');
const clone=o=>JSON.parse(JSON.stringify(o));
const total=s=>s.stock+s.hands.reduce((a,b)=>a+b,0)+s.board.filter(Boolean).length+(s.focus?1:0)+s.trophies.reduce((a,b)=>a+b,0)+s.discard;
function init(n) {return {n,board:Array(n).fill(true),hands:Array(n).fill(3),stock:49-4*n,focus:true,
 dice:[[0,6],[0,3],[1,4]],trophies:Array(n).fill(0),discard:0};}
function collapse(s,{actor=1,contributor=0,edge='UP',variant='A',split=true}={}) {
  assert.equal(s.board[contributor],true);assert.equal(s.dice[0][0],contributor);
  s.dice[0][1]=edge==='UP'?6:1;
  s.dice[1][0]=split?contributor:actor;s.dice[2][0]=actor;
  const twoDifferent=s.dice[1][0]!==s.dice[2][0];
  const activate=variant==='A'||twoDifferent;
  const priorFocus=s.focus;
  if(edge==='UP') {s.trophies[actor]++;if(activate&&actor!==contributor&&s.focus){s.trophies[contributor]++;s.focus=false;}}
  else {s.discard++;if(activate&&s.focus){s.discard++;s.focus=false;}}
  s.board[contributor]=false;
  s.dice[0][1]=3;
  const survivors=s.board.map((v,i)=>v?i:-1).filter(i=>i!==-1);
  for(const d of s.dice) if(d[0]===contributor)d[0]=survivors[0]??null;
  if(priorFocus&&!s.focus&&s.stock>0){s.stock--;s.focus=true;}
  assert.equal(total(s),50);
  assert.ok(s.dice.every(([p,v])=>v>=1&&v<=6&&(p===null||s.board[p])));
  return s;
}
let assertions=0;const outcomes={};for(let n=2;n<=6;n++){
  const initial=init(n);assert.equal(total(initial),50);assert.equal(initial.stock,49-4*n);assertions+=2;
  for(const variant of ['A','B'])for(const edge of ['UP','DOWN'])for(const split of [true,false]){
    const s=collapse(clone(initial),{actor:1,contributor:0,edge,variant,split});
    const activate=variant==='A'||split;const expectedFocus=activate&&(edge==='DOWN'||edge==='UP');
    assert.equal(s.trophies.reduce((a,b)=>a+b,0),edge==='UP'?1+(activate?1:0):0);assertions++;
    assert.equal(s.discard,edge==='DOWN'?1+(activate?1:0):0);assertions++;
    assert.equal(s.stock,initial.stock-(activate?1:0));assertions++;
    assert.equal(s.board[0],false);assertions++;
    assert.equal(s.focus,true);assertions++;
    outcomes[[n,variant,edge,split?'split':'stacked'].join(':')]={trophies:s.trophies,discard:s.discard,stock:s.stock,focus:s.focus};
  }
  for(const variant of ['A','B']){
    const x=collapse(clone(initial),{actor:0,contributor:0,edge:'UP',variant,split:true});
    assert.equal(x.trophies[0],1);assert.equal(x.stock,initial.stock);assertions+=2;
  }
}
// Exhaustion / stock0: legal no refill, no spontaneous card.
const empty={n:2,board:[true,true],hands:[1,1],stock:0,focus:true,dice:[[0,6],[0,3],[1,4]],trophies:[23,22],discard:0};
assert.equal(total(empty),50);assertions++;
const exhausted=collapse(empty,{actor:1,contributor:0,variant:'B',edge:'UP',split:true});
assert.equal(exhausted.focus,false);assertions++;
assert.equal(exhausted.stock,0);assertions++;
console.log(JSON.stringify({status:'PASS',assertions,scenario_cases:Object.keys(outcomes).length,
 n:[2,3,4,5,6],variants:['A','B'],events:['UP','DOWN'],activation:['split','stacked'],
 note:'STATIC examples only; not 2-6 player game simulations, strategy or fun'}));
