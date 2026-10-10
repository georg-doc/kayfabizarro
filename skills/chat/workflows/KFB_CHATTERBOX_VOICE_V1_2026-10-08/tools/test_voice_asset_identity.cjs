'use strict';
const assert = require('node:assert/strict');
const A = require('../runtime/voice-asset-identity.v1.js');
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('PASS', name); }
const request = {
  text: 'Freedom is ultimately the greatest virtue.', voicePreset: 'demon_lord', emotion: 'calm',
  sourceRefs: [{ sourceId: 'donor:audition:demon_lord_01', sourceRevision: 'e30dc9b7eb020dbdaf9cc346cc3d4cf0feef77f9', textRevision: 'source-fixture-r1'}]
};
const recipe = {
  segmentRole: 'whole', locale: 'en', provider: 'espeak', model: 'espeak-1.48.15',
  voiceId: 'en+m7', recipeRevision: 'r1', settingsRevision: 's135-p34'
};
const key = A.makeKey(request, recipe);
const changed = (obj, field, value) => ({...obj, [field]: value});
const asset = {identityKey:key, sourceStatus:'AUTHORING_CANDIDATE',rightsStatus:'UNREVIEWED',castingStatus:'HEURISTIC_CANDIDATE'};
test('stable same inputs',()=>assert.equal(A.makeKey(request,recipe),key));
test('source id changes key',()=>assert.notEqual(A.makeKey({...request,sourceRefs:[{...request.sourceRefs[0],sourceId:'other'}]},recipe),key));
test('source revision changes key',()=>assert.notEqual(A.makeKey({...request,sourceRefs:[{...request.sourceRefs[0],sourceRevision:'new'}]},recipe),key));
test('text revision changes key',()=>assert.notEqual(A.makeKey({...request,sourceRefs:[{...request.sourceRefs[0],textRevision:'new'}]},recipe),key));
test('visible text changes key',()=>assert.notEqual(A.makeKey(changed(request,'text','Different line.'),recipe),key));
test('emotion changes key',()=>assert.notEqual(A.makeKey(changed(request,'emotion','angry'),recipe),key));
test('preset changes key',()=>assert.notEqual(A.makeKey(changed(request,'voicePreset','robot'),recipe),key));
test('provider changes key',()=>assert.notEqual(A.makeKey(request,changed(recipe,'provider','piper')),key));
test('model changes key',()=>assert.notEqual(A.makeKey(request,changed(recipe,'model','new')),key));
test('voice ID changes key',()=>assert.notEqual(A.makeKey(request,changed(recipe,'voiceId','en+m3')),key));
test('render recipe changes key',()=>assert.notEqual(A.makeKey(request,changed(recipe,'recipeRevision','r2')),key));
test('settings changes key',()=>assert.notEqual(A.makeKey(request,changed(recipe,'settingsRevision','s155-p50')),key));
test('locale changes key',()=>assert.notEqual(A.makeKey(request,changed(recipe,'locale','de')),key));
test('whole differs from subject part',()=>assert.notEqual(A.makeKey(request,changed(recipe,'segmentRole','subject')),key));
test('missing source revision refuses identity',()=>assert.throws(()=>A.makeKey({...request,sourceRefs:[{...request.sourceRefs[0],sourceRevision:null}]},recipe),/sourceRevision required/));
test('missing text revision refuses identity',()=>assert.throws(()=>A.makeKey({...request,sourceRefs:[{...request.sourceRefs[0],textRevision:null}]},recipe),/textRevision required/));
test('missing source ref refuses identity',()=>assert.throws(()=>A.makeKey({...request,sourceRefs:[]},recipe),/sourceRefs required/));
test('candidate allowed to audition privately',()=>assert.equal(A.evaluateAsset(asset,key,{mode:'audition'}).eligible,true));
test('candidate NEVER allowed to ship public',()=>assert.deepEqual(A.evaluateAsset(asset,key,{mode:'public'}).reasons,['SOURCE_NOT_APPROVED','RIGHTS_NOT_CLEARED','CAST_NOT_APPROVED']));
test('wrong key never allowed to audition',()=>assert.deepEqual(A.evaluateAsset(asset,'other').reasons,['IDENTITY_MISMATCH']));
test('cleared public asset can play',()=>assert.equal(A.evaluateAsset({...asset,sourceStatus:'APPROVED',rightsStatus:'CLEARED',castingStatus:'KEEP'},key,{mode:'public'}).eligible,true));
test('unknown mode fails closed',()=>assert.deepEqual(A.evaluateAsset(asset,key,{mode:'world'}).reasons,['INVALID_MODE']));
test('text containing delimiters does not alias',()=>assert.notEqual(A.makeKey({...request,text:'a|b'},recipe),A.makeKey({...request,text:'a||b'},recipe)));
test('multiple source refs preserve order',()=>{const x=request.sourceRefs[0];assert.notEqual(A.makeKey({...request,sourceRefs:[x,{...x,sourceId:'b'}]},recipe),A.makeKey({...request,sourceRefs:[{...x,sourceId:'b'},x]},recipe));});
console.log('TOTAL',passed,'PASS');
