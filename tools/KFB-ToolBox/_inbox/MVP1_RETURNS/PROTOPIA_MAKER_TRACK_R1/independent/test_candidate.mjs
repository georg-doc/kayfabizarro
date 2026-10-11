import fs from 'node:fs';
import crypto from 'node:crypto';
import {runChecks,VEHICLE_ENVELOPE,PROFILE_DEFAULTS} from './track-core.v012.mjs';
const driverSource=fs.readFileSync(new URL('./kfb-drive.k2b.js',import.meta.url),'utf8');
const {makeFrame,createDriver,stepDriver,pose}=await import('data:text/javascript;base64,'+Buffer.from(driverSource).toString('base64'));
const path=process.argv[2]; if(!path)throw Error('Supply exact candidate stream JSON');
const bytes=fs.readFileSync(path),stream=JSON.parse(bytes),S=stream.samples;
const coreVerdict=runChecks(stream),checks=coreVerdict.results;let maxGrade=0,minWidth=Infinity,maxDsDeviation=0;
for(let i=0;i<S.length;i++){maxGrade=Math.max(maxGrade,Math.abs(S[i].grade));minWidth=Math.min(minWidth,S[i].slots[7][0]-S[i].slots[6][0]);if(i)maxDsDeviation=Math.max(maxDsDeviation,Math.abs(S[i].s-S[i-1].s-stream.ds));}
const cases=[];
for(const fps of [30,60,120])for(const halfWidth of [1.08,2.05])for(const backwards of [false,true]){
 const F=makeFrame(S,stream.ds,!!stream.closed),d=createDriver(backwards?F.L-4:4);let elapsed=0,passed=false,maxLat=0,minReserve=Infinity,rescues=0,takeoffs=0,finite=true;const dt=1/fps;
 while(elapsed<180){const before=d.s;const q=stepDriver(d,F,backwards?{brake:true}:{gas:true},dt,{assist:.8,motorK:1,halfWidth});elapsed+=dt;maxLat=Math.max(maxLat,Math.abs(d.lat));minReserve=Math.min(minReserve,q.half-halfWidth-Math.abs(d.lat));for(const e of d.events){if(e.type==='rescue')rescues++;if(e.type==='takeoff')takeoffs++;}finite&&=[d.s,d.lat,d.psi,d.speed,...pose(d,q,.045).P].every(Number.isFinite);if((!backwards&&(d.s>=F.L-4||d.lap>1))||(backwards&&d.s<=4)){passed=true;break;}if(!finite)break; }
 cases.push({fps,halfWidth,direction:backwards?'reverse':'forward',complete:passed,seconds:+elapsed.toFixed(3),maxLat,minRoadReserve:minReserve,hits:d.hits,rescues,takeoffs,finite});
}
const out={candidate:path,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),checks,maxGrade,minWidth,maxDsDeviation,vehicleEnvelope:VEHICLE_ENVELOPE,profile:PROFILE_DEFAULTS,controller:'byte-identical original kfb-drive.k2b.js inherited J16-r2 by J17 joyride-drive.j10.js',cases,limits:['Headless original-controller test on route stream only; does not exercise rendered-world colliders, browser camera, input or imported vehicle wheels.','Original makeFrame uses uniform s/ds indexing; ds deviations are reported, not silently repaired.','Original controller road contact is prescribed by route frame rather than independent mesh collision physics.','Reverse uses original brake/reverse behavior (maxReverse 9m/s), not a replaced controller.']};
fs.writeFileSync(new URL('./controller_test.json',import.meta.url),JSON.stringify(out,null,2));console.log(JSON.stringify({checksFailed:checks.filter(x=>!x.pass),maxGrade,minWidth,maxDsDeviation,cases},null,2));
