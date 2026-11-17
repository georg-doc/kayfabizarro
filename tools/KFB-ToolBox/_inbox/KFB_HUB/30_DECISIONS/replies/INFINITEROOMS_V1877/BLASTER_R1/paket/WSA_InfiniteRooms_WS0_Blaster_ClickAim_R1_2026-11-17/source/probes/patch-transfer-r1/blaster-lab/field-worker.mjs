import {weaponImpact} from './native/cascade/r4/impact-mask.mjs';
import {createFieldEngine} from './field-engine.mjs';
const run=createFieldEngine();self.onmessage=({data})=>{try{const result=run(data);self.postMessage(result,result.field?[result.field.d.buffer,result.field.data.buffer]:[]);}catch(error){self.postMessage({type:'error',generation:data.generation,id:data.id,error:String(error?.stack||error)});}};
// Pure derived-mask preflight, never a game hit, receipt, effect or collision query.
const warmFields=[],impacts=[];for(let k=0;k<3;k++){impacts.push(weaponImpact('gatling',[k===0?0:k===1?.08:-.12,1.5],k+1,[.2,.1],{salt:1337}));const f=run({type:'field',generation:-1,id:-k-1,surface:{id:'preflight',width:5,height:3,seed:1339},impacts}).field;warmFields.push({...f,graph:structuredClone(f.graph)});}run({type:'reset',generation:0});self.postMessage({type:'ready',warmFields},warmFields.flatMap(f=>[f.d.buffer,f.data.buffer]));

warmFields.length=0;impacts.length=0;
