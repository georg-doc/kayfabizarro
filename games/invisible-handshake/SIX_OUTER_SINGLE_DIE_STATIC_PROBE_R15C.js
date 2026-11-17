/* R15C STATIC PROBE. Six faction narrative cards are ALWAYS dealt at setup
   (n humans + 6-n NPC), plus one die-free center FOCUS. Three distinct Fear/Hope/Hate
   dice can occupy at most one die per active outer narrative card. No gameplay bot.
   node SIX_OUTER_SINGLE_DIE_STATIC_PROBE_R15C.js
*/
'use strict';
const assert=require('node:assert/strict');
const permutations=[];
for(let a=0;a<6;a++)for(let b=0;b<6;b++)for(let c=0;c<6;c++){
  if(new Set([a,b,c]).size===3)permutations.push([a,b,c]);
}
assert.equal(permutations.length,120);
const check=ds=>assert.equal(new Set(ds.filter(x=>x!==null)).size,ds.filter(x=>x!==null).length);
const stock=n=>50-6-1-3*n;
let setup=0, moves=0, swaps=0, relocations=0, collapses=0;
let reserveChecks=0, noCenterChecks=0;
for(let humans=2;humans<=6;humans++){
  assert.equal(humans+(6-humans),6);
  assert.equal(stock(humans),43-3*humans);
  for(const dice of permutations){
    const all=[0,1,2,3,4,5];
    const outer=all.map(() => true);
    const total=stock(humans)+3*humans+outer.filter(Boolean).length+1;
    assert.equal(total,50);
    check(dice);
    setup++;
    noCenterChecks++;
    for(let d=0;d<3;d++){
      const empty=all.filter(j=>!dice.includes(j));
      assert.equal(empty.length,3);
      for(const target of empty){
        const next=dice.slice();next[d]=target;check(next);
        assert.equal(next[d],target);moves++;
      }
    }
    for(let i=0;i<3;i++)for(let j=i+1;j<3;j++){
      const next=dice.slice();[next[i],next[j]]=[next[j],next[i]];
      check(next);swaps++;
    }
    // Actor captures card at the first die's slot; it is not implicitly refilled.
    const removed=dice[0],remaining=all.filter(p=>p!==removed);
    const other=[dice[1],dice[2]];
    assert.equal(new Set(other).size,2);
    const choices=remaining.filter(p=>!other.includes(p));
    assert.equal(choices.length,3);
    const totalAfter=stock(humans)+3*humans+5+1+1; // actor's trophy + 5 outer + focus
    assert.equal(totalAfter,50);
    collapses++;
    for(const destination of choices){
      const relocated=[destination,...other];check(relocated);
      assert.ok(relocated.every(x=>remaining.includes(x)));
      relocations++;
    }
  }
}
const reserveDice=[0,1,null],twoRemaining=[true,true,false,false,false,false];
check(reserveDice);assert.ok(reserveDice.filter(x=>x!==null).every(x=>twoRemaining[x]));
reserveChecks++;
const out={status:'PASS',permutations_per_player_count:permutations.length,player_counts:[2,3,4,5,6],
 setup_cases:setup,move_cases:moves,swap_cases:swaps,collapse_cases:collapses,
 relocation_cases:relocations,reserve_checks:reserveChecks,center_never_holds_die:noCenterChecks,
 stocks:[2,3,4,5,6].map(n=>({humans:n,npc:6-n,stock:stock(n)})),
 caveat:'Six static outer-card occupancy proof only; NPC turns/refill, Focus rewards, 5->6 incentives and full-game balance are NOT tested.'};
assert.deepEqual([setup,moves,swaps,collapses,relocations,noCenterChecks],[600,5400,1800,600,1800,600]);
console.log(JSON.stringify(out,null,2));
