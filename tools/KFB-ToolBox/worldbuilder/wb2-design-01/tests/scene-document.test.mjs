import assert from 'node:assert/strict';
import {test} from 'node:test';
import {validateSceneDocument,sceneReplacementQueue} from '../scene-document.v1.mjs';
const fixture=()=>({format:'kfb-worldbuilder-scene',version:1,id:'island-a',terrain:{seed:97,height:10,macroScale:3.2,detail:.55,sculpt:{version:1,strokes:[{mode:'raise',radius:2,strength:.12,falloff:'smooth-c2',points:[[1,2],[1.5,2]]},{mode:'lower',radius:1,strength:.03,falloff:'smooth-c2',points:[[1,2]]}]}},sources:{},objects:[{id:'source-rock',name:'Rock',kind:'prop',source:{path:'rock.glb',commit:'a'.repeat(40)},transform:{position:[1,2,3],rotation:[0,0,0],scale:[1,1,1]}}]});
test('native ordered overlapping sculpt and pinned object roundtrip without mutation',()=>{const d=fixture();const r=validateSceneDocument(d,'island-a');assert.deepEqual(r,d);r.objects[0].transform.position[0]=3;assert.equal(d.objects[0].transform.position[0],1);});
test('invalid inputs are rejected before touching the live owner',async()=>{
 let current=fixture(),calls=0;const replace=sceneReplacementQueue({read:()=>current,validate:d=>validateSceneDocument(d,'island-a'),rebuild:async d=>{calls++;current=d;}});
 const cases=[d=>d.objects.push(structuredClone(d.objects[0])),d=>d.objects[0].transform.position[0]=NaN,d=>d.objects[0].source.commit='main',d=>d.terrain.sculpt.strokes[0].points[0][0]=Infinity,d=>d.id='island-b',d=>d.objects[0].transform.scale[1]=0,d=>d.terrain.sculpt.strokes[0].radius=-1];
 for(const mutate of cases){const d=fixture();mutate(d);await assert.rejects(replace(d));assert.deepEqual(current,fixture());}
 assert.equal(calls,0);
});
test('failed reconstruction rolls back complete document and mode before next queued load',async()=>{
 let current=fixture(),playing=true;const seen=[];
 const replace=sceneReplacementQueue({read:()=>current,begin:()=>{const old=playing;playing=false;return old;},end:old=>{playing=old;},rebuild:async d=>{current=d;seen.push(d.objects[0].transform.position[0]);await Promise.resolve();if(d.objects[0].transform.position[0]===9)throw Error('source load failed');}});
 const bad=fixture();bad.objects[0].transform.position[0]=9;
 await assert.rejects(replace(bad),/source load failed/);assert.deepEqual(current,fixture());assert.equal(playing,true);assert.deepEqual(seen,[9,1]);
 const good=fixture();good.objects[0].transform.position[0]=7;await replace(good);assert.deepEqual(current,good);
});
test('queued callers cannot mutate their submitted snapshot',async()=>{let current=fixture();const replace=sceneReplacementQueue({read:()=>current,rebuild:async d=>{await Promise.resolve();current=d;}});const d=fixture();d.objects[0].transform.position[0]=4;const pending=replace(d);d.objects[0].transform.position[0]=99;await pending;assert.equal(current.objects[0].transform.position[0],4);});
