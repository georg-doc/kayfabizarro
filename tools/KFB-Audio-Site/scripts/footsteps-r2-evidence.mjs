import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const base=new URL('../dist/footsteps/proof/',import.meta.url),fixture=JSON.parse(readFileSync(new URL('footsteps-r2-fixture.json',base))),controls=JSON.parse(readFileSync(new URL('footsteps-r2-controls.json',base)));
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
check(fixture.revision==='0.7.3-footsteps-r2-v430','exact revision');
check(fixture.hostContexts===1,'one context');
check(fixture.decode.length===20,'20 actual browser decodes');
check(fixture.counts.steps===30,'recorded 30 steps');
check(fixture.counts.duplicateKeys===0,'zero duplicate keys');
check(fixture.contactToScheduleMs.max<=1000/60,'contact-to-scheduled source start <= one 60 Hz frame');
for(const surface of ['sand','stone','wood','wet-clay']){
 check(fixture.events.some(e=>e.surface===surface),surface+' played');
 check(fixture.decode.filter(e=>e.surface===surface).length===5,surface+' five decoded variants');
}
const previous={};for(const e of fixture.events){check(e.pitchRate>=.97&&e.pitchRate<=1.03,'pitch range');check(previous[e.surface]!==e.file,'no immediate sample repeat');previous[e.surface]=e.file;}
check(controls.checks.length===23&&controls.checks.every(e=>e.pass),'23 observed browser checks');
check(controls.contexts===1&&controls.ttsObservation.voiceActive===true,'TTS coexistence');
const wav=readFileSync(new URL('footsteps-r2.wav',base));let fmt,data;
for(let at=12;at+8<wav.length;){const id=wav.toString('ascii',at,at+4),n=wav.readUInt32LE(at+4);if(id==='fmt ')fmt=wav.subarray(at+8,at+8+n);if(id==='data')data=wav.subarray(at+8,at+8+n);at+=8+n+(n%2);}
check(fmt.readUInt16LE(0)===1&&fmt.readUInt16LE(14)===16,'PCM16 recording');let peak=0,sum=0,clipped=0;
for(let i=0;i<data.length;i+=2){const v=data.readInt16LE(i)/32768;peak=Math.max(peak,Math.abs(v));sum+=v*v;if(Math.abs(v)>=.999)clipped++;}
const channels=fmt.readUInt16LE(2),sampleRate=fmt.readUInt32LE(4),duration=data.length/2/channels/sampleRate,rms=Math.sqrt(sum/(data.length/2));
check(duration>15&&duration<17,'actual clip duration');check(peak>0&&peak<.055,'quiet non-silent peak');check(clipped===0,'no clipping');
console.log(JSON.stringify({status:'PASS',checks,browserChecks:23,duration,channels,sampleRate,peak,peakDb:20*Math.log10(peak),rms,rmsDb:20*Math.log10(rms),clipped,contactToScheduleMs:fixture.contactToScheduleMs,renderToEnvelopeEstimateMs:fixture.visibleContactToAttackEndMs,limits:'Schedule and fade estimates only; no physical output-latency measurement. WS0 sonic/AV review pending.'},null,2));
