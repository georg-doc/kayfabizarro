'use strict';
// R23 candidate only: 6 occupied outer slots, one die per slot; focus is die-free.
const assert=require('node:assert/strict');
const roles=['HATE','FEAR','HOPE'];
const six=Array.from({length:6},(_,i)=>i);
const starts=[]; for(let h=0;h<6;h++)for(let f=0;f<6;f++)for(let o=0;o<6;o++)if(new Set([h,f,o]).size===3)starts.push([h,f,o]);
const orientation=(a,b,c)=> (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const coords=six.map(i=>[Math.cos(i*Math.PI/3),Math.sin(i*Math.PI/3)]);
function triangleClass(indices){const [a,b,c]=indices.map(i=>coords[i]);const signs=[orientation(a,b,[0,0]),orientation(b,c,[0,0]),orientation(c,a,[0,0])];const eps=1e-9;
 if(signs.every(v=>v>=-eps)||signs.every(v=>v<=eps))return signs.some(v=>Math.abs(v)<eps)?'boundary':'inside';return 'outside';}
const types={inside:0,boundary:0,outside:0};for(let a=0;a<6;a++)for(let b=a+1;b<6;b++)for(let c=b+1;c<6;c++)types[triangleClass([a,b,c])]++;
assert.deepEqual(types,{inside:2,boundary:12,outside:6});
let transitionChecks=0, initialChecks=0, ends=[];
for(const start of starts){let positions=start.slice();let faces=[1,1,1];for(let beat=1;beat<=19;beat++){
 const die=(beat-1)%3;
 if(beat<=3){assert.equal(faces[die],1);initialChecks++;continue;}
 if(beat===19){assert.equal(die,0);assert.equal(faces[die],6);ends.push('HATE');continue;}
 const free=six.filter(k=>!positions.includes(k));assert.equal(free.length,3);
 for(const target of free){const next=positions.slice();next[die]=target;assert.equal(new Set(next).size,3);assert.ok(faces[die]>=1&&faces[die]<6);assert.ok(!next.includes(6));transitionChecks++;}
 positions[die]=free[0];faces[die]++;
 assert.equal(faces.reduce((a,b)=>a+b,0),beat);
 }
 assert.deepEqual(faces,[6,6,6]);
}
assert.equal(starts.length,120);assert.equal(initialChecks,360);assert.equal(transitionChecks,5400);assert.equal(ends.length,120);
const seats={};for(const n of [2,3,4,5,6]){seats[n]=Array.from({length:n},(_,start)=>((start+18)%n));}
console.log(JSON.stringify({startingOrderedPlacements:starts.length,initialSetChecks:initialChecks,legalMoveTargetsChecked:transitionChecks,firstTiltBeat:19,firstTiltRole:'HATE',tensionAfterBeat18:18,triangleGeometryUnique20:types,tiltSeatByRotatingStart:seats,humanGames:0,completeGames:0},null,2));
