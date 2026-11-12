import test from "node:test";
import assert from "node:assert/strict";
import { DAY_SIGNS, kinAt, mod, fractalAddress, shiftLevel, planTimeMove } from "./chronoloom-core.mjs";
import { MOTIF_PATHS, chronoglyphSvg } from "./chronoglyphs.mjs";

test("20 day-sign entries", () => assert.equal(DAY_SIGNS.length, 20));
test("260 distinct tone/sign pairings", () => assert.equal(new Set(Array.from({length:260},(_,i)=>{const k=kinAt(i);return k.tone+":"+k.signId;})).size, 260));
test("1 Imix at zero", () => assert.deepEqual([kinAt(0).tone,kinAt(0).signId,kinAt(0).kin],[1,"imix",1]));
test("13-step change preserves tone", () => { assert.equal(kinAt(13).tone,1); assert.notEqual(kinAt(13).signId,kinAt(0).signId); });
test("20-step change preserves sign", () => { assert.equal(kinAt(20).signId,"imix"); assert.notEqual(kinAt(20).tone,1); });
test("260-step return preserves pair, advances era", () => assert.deepEqual([kinAt(260).kin,kinAt(260).cycle],[1,1]));
test("negative year cycle works", () => assert.deepEqual([kinAt(-1).signId,kinAt(-1).tone,kinAt(-1).cycle],["ajaw",13,-1]));
test("all 260 states recur after cycle", () => {
 for (let i=-260;i<520;i++){ assert.equal(kinAt(i).tone,kinAt(i+260).tone); assert.equal(kinAt(i).signId,kinAt(i+260).signId); }
});
test("nonpositive modulus rejected", () => assert.throws(()=>mod(1,0),RangeError));
test("fractional input rejected", () => assert.throws(()=>kinAt(1.5),RangeError));
test("four-level address scopes", () => assert.deepEqual(fractalAddress([0,1,2,3]).nodes.map(x=>x.scope),["world","diorama","card","memory"]));
test("fractal path move changes one level", () => {
 const shifted=shiftLevel([0,1,2,3],2,20);
 assert.equal(shifted.nodes[2].absoluteStep,22);
 assert.equal(shifted.nodes[0].absoluteStep,0);
 assert.equal(shifted.nodes[3].absoluteStep,3);
});
test("resonance is a request, not world mutation", () => assert.equal(planTimeMove({mode:"resonance",fromStep:13,delta:20,sourceRef:"test:source"}).execution,"REQUEST_ONLY"));
test("memory revisit requires authoritative snapshot", () => assert.throws(()=>planTimeMove({mode:"memory-revisit",fromStep:0,delta:1,sourceRef:"test:source"}),TypeError));
test("chrono portal requires destination", () => assert.throws(()=>planTimeMove({mode:"chrono-portal",fromStep:0,delta:1,sourceRef:"test:source"}),TypeError));
test("20 distinct authored source silhouettes", () => assert.equal(new Set(MOTIF_PATHS).size,20));
test("all 20 SVG sources render transparent roots", () => {
 for(let i=0;i<20;i++){
  const s=chronoglyphSvg(i,1);
  assert.match(s,/^<svg /);
  assert.match(s,/<\/svg>$/);
  assert.doesNotMatch(s,/<rect/);
 }
});
test("exact 13 KFB phase markers", () => assert.equal((chronoglyphSvg(0,13).match(/<circle /g)||[]).length,13));
test("bad palette injection rejected", () => assert.throws(()=>chronoglyphSvg(0,1,{accent:"red<script>"}),TypeError));
