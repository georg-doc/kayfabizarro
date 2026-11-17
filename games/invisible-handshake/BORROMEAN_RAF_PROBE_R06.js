/* THE INVISIBLE HANDSHAKE R0.6: exhaustive static state test (not played games).
   3 physical dice (R/A/F), 3 corners (RESOURCES/RULES/INFLUENCE).
   One die is in each corner. Unique highest top face activates its corner.
   On tie, central EYE is CONTESTED and no type has a cost discount.
   Costs only 0/1 FAVOR; after +1 on a player's turn, RECRUIT is affordable.
   Run: node BORROMEAN_RAF_PROBE_R06.js
 */
'use strict';
const assert=require('node:assert/strict');
const CHANNELS=['RESOURCES','RULES','INFLUENCE'];
const DICE=['R','A','F'];
const P=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
function focus(faces, corners) {
  const highest=Math.max(...faces);
  const leaders=faces.map((v,i)=>v===highest ? i : -1).filter(i=>i>=0);
  return leaders.length===1 ? corners[leaders[0]] : null;
}
function cost(faces,corners,supply) {
  const f=focus(faces,corners);
  assert.ok(CHANNELS.includes(supply));
  return f===null || supply!==CHANNELS[f] ? 1 : 0;
}
function rotate(faces,die,step) {
  if(![1,-1].includes(step)) throw Error('rotate only exactly one pip');
  const n=faces[die]+step;
  if(n<1||n>6)return null;
  const next=[...faces];next[die]=n;return next;
}
function swap(corners,die1,die2) {
  assert.ok(die1!==die2 && die1>=0 && die1<3 && die2>=0 && die2<3);
  const next=[...corners];[next[die1],next[die2]]=[next[die2],next[die1]];
  return next;
}
let states=0,unique=0,contested=0,affordabilityCases=0,free=0,paid=0;
let legalRotations=0,blockedRotations=0,legalSwaps=0;
let cornerHighs=[0,0,0];
for(const corners of P){
  assert.equal(new Set(corners).size,3);
  for(let R=1;R<=6;R++)for(let A=1;A<=6;A++)for(let F=1;F<=6;F++){
    const faces=[R,A,F],f=focus(faces,corners);
    states++;
    if(f===null)contested++;else{unique++;cornerHighs[f]++}
    for(const channel of CHANNELS){
      const expense=cost(faces,corners,channel);
      for(let previousFavor=0;previousFavor<=3;previousFavor++){
        const earned=Math.min(previousFavor+1,3);
        assert.ok(expense===0 || expense===1);
        assert.ok(earned>=expense);
        const after=earned-expense;assert.ok(after>=0&&after<=3);
        affordabilityCases++;if(expense===0)free++;else paid++;
      }
    }
    for(let die=0;die<3;die++)for(const direction of [-1,1]){
      const next=rotate(faces,die,direction);
      if(next===null){blockedRotations++;continue;}
      legalRotations++;
      assert.equal(next[die],faces[die]+direction);
      assert.ok(next.every(x=>x>=1&&x<=6));
      assert.equal(next.filter((x,i)=>x!==faces[i]).length,1);
    }
    for(let die=0;die<3;die++)for(let other=die+1;other<3;other++){
      const next=swap(corners,die,other);
      assert.equal(new Set(next).size,3);
      assert.equal(next[die],corners[other]);assert.equal(next[other],corners[die]);
      legalSwaps++;
    }
  }
}
assert.deepEqual({states,unique,contested,affordabilityCases,free,paid,legalRotations,blockedRotations,legalSwaps,cornerHighs},
 {states:1296,unique:990,contested:306,affordabilityCases:15552,free:3960,paid:11592,legalRotations:6480,blockedRotations:1296,legalSwaps:3888,cornerHighs:[330,330,330]});
assert.equal(focus([3,3,3],[0,1,2]),null);
assert.equal(focus([4,3,3],[0,1,2]),0);
assert.equal(focus([4,3,3],swap([0,1,2],0,2)),2);
assert.equal(cost([4,3,3],[0,1,2],'RESOURCES'),0);
assert.equal(cost([4,3,3],swap([0,1,2],0,2),'RESOURCES'),1);
assert.equal(cost([4,3,3],swap([0,1,2],0,2),'INFLUENCE'),0);
console.log(JSON.stringify({status:'PASS',source:'static R0.6 candidate, not a playtest',states,unique,contested,affordabilityCases,free,paid,legalRotations,blockedRotations,legalSwaps,cornerHighs,limits:'No 8-round game simulation, no test of narrative legibility or player enjoyment'},null,2));
