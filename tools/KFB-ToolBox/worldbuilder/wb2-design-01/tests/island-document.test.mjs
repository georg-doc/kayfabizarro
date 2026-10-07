import assert from 'node:assert/strict';
import {test} from 'node:test';
import {islandIdentity,islandRecipe,validateIslandRecipe} from '../island-document.v1.mjs';
import {makeIslandCore} from '../../procedural-test-world-01/r2d-island-core.v1.js';
import * as TC from '../../procedural-test-world-01/open-world/src/owners/track-core/track-core.mjs';
test('same-seed islands have distinct Scene/store identities and detached recipes',()=>{
 const core=makeIslandCore(3,TC,'frei');
 const a=islandRecipe({id:'a',seed:3,shape:'frei',biome:'burg',route:core.plan.recipe});
 const b=islandRecipe({id:'b',seed:3,shape:'frei',biome:'burg',route:core.plan.recipe});
 assert.notEqual(a.docId,b.docId);assert.notEqual(a.storageKey,b.storageKey);a.route.label='edited';assert.notEqual(a.route.label,b.route.label);
 assert.deepEqual(validateIslandRecipe(b),b);
});
test('fresh core consumes exact finalized Track recipe and reconstructs sampled field',()=>{
 const first=makeIslandCore(3,TC,'frei');const saved=JSON.parse(JSON.stringify(first.plan.recipe));
 const second=makeIslandCore(3,TC,'frei',saved);
 assert.deepEqual(second.plan.recipe,saved);
 assert.deepEqual(second.plan.stream.samples,first.plan.stream.samples);
 for(let x=-40;x<40;x+=3)for(let z=-40;z<40;z+=3)assert.equal(second.field.heightAt(x,z),first.field.heightAt(x,z));
});
test('unknown generator or local-frame drift is rejected',()=>{const c=makeIslandCore(3,TC);const d=islandRecipe({id:'a',seed:3,shape:'frei',biome:'burg',route:c.plan.recipe});d.origin[0]=1e9;assert.throws(()=>validateIslandRecipe(d));assert.throws(()=>islandIdentity('../a'));});
