/** The Invisible Handshake R0.5: OVER-TON WINDOW micro-check; proposal, not shipped rule.
 * Four ordered public-market slots; the accepted window covers two adjacent slots.
 * Normal RECRUIT outside window costs 1 FAVOR, inside costs 0.
 * SHIFT THE WINDOW plot moves one adjacent position, then recruits inside it at 0 cost.
 * Pure exhaustive state checks (no Monte Carlo, no replay of the 56-card game).
 */
'use strict';
const assert = require('node:assert/strict');
const W=4, WIDTH=2, POSITIONS=W-WIDTH+1;
function inside(position, marketIndex) { return marketIndex>=position && marketIndex<position+WIDTH; }
function cost(position, marketIndex) { return inside(position,marketIndex) ? 0 : 1; }
function shift(position,dir) { const n=position+dir; return n>=0 && n<POSITIONS ? n : null; }
let checks=0, legal=0, free=0, paid=0, shiftPairs=0, shifts=0;
for(let pos=0;pos<POSITIONS;pos++) {
  for(let i=0;i<W;i++) {
    assert.equal([0,1].includes(cost(pos,i)),true);checks++;
    for(let previousFavor=0;previousFavor<=3;previousFavor++){
      const earned=Math.min(3,previousFavor+1);const spent=cost(pos,i);
      assert.ok(earned>=spent);assert.ok(earned-spent>=0 && earned-spent<=3);
      legal++;if(spent)paid++;else free++;
    }
  }
  for(const dir of [-1,+1]){
    const next=shift(pos,dir);
    if(next===null)continue;
    shifts++;
    for(let i=0;i<W;i++)if(inside(next,i)){assert.equal(cost(next,i),0);shiftPairs++;}
  }
}
assert.deepEqual({legal,free,paid,shifts,shiftPairs},{legal:48,free:24,paid:24,shifts:4,shiftPairs:8});
console.log(JSON.stringify({status:'PASS',checks,legal,free,paid,shifts,shiftPairs,
 caveat:'Spatial market order is NOT a political idea continuum; thematic Overton validity untested.'},null,2));
