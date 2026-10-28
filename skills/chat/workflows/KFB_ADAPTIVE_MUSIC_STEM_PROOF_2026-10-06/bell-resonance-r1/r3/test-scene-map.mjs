import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readEnvelope,modeToGeometry,sourceIntegrity} from './bell-r3-scene-map.mjs';
const data=JSON.parse(readFileSync(new URL('./analysis.json',import.meta.url)));
let n=0;const pass=(v)=>{assert.ok(v);n++};
pass(data.schema==='bell-r3-envelope.v1');
pass(Object.keys(data.samples).length===3);
for(const id of ['bell','egregore','bowl']){
 const s=data.samples[id],e=readEnvelope(data,id,1.8),g=modeToGeometry(e,{narrativeField:true});
 pass(sourceIntegrity(data,id,s.sha256));
 pass(e.bands.length===8);
 pass(e.rms>0);
 pass(g.arcs.every(x=>x.radiusX>0 && x.opacity>=0 && x.frequencyHz>0));
 pass(g.speculativeField?.artisticOnly===true);
 pass(modeToGeometry(e,{reducedMotion:true}).arcs.every(x=>x.deformAmount===0));
}
pass(readEnvelope(data,'bell',-1).timeSec===0);
pass(modeToGeometry(readEnvelope(data,'bell',0)).sourceLevel===0);
pass(modeToGeometry(readEnvelope(data,'bell',3),{narrativeField:false}).speculativeField===null);
try{readEnvelope({...data,schema:'bad'},'bell',1)}catch(e){pass(e.message==='Unknown bell-envelope schema')}
try{modeToGeometry({bands:[]})}catch(e){pass(e.message==='Expected eight partial amplitudes')}
console.log(n+'/'+n+' PASS');
