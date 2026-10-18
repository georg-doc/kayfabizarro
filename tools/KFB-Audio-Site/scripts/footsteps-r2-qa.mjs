import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {SURFACES,createFootstepAudio} from '../dist/footsteps/audio.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const manifest=JSON.parse(readFileSync(new URL('../dist/footsteps/sources.json',import.meta.url))),rows=[...manifest.rows,...manifest.r2Rows];
for(const [name,c] of Object.entries(SURFACES)){
 const bank=rows.filter(r=>r.file.startsWith(c.prefix));check(bank.length===5,name+' count');check(new Set(bank.map(r=>r.gitBlob)).size===5,name+' unique');
 for(const r of bank){const bytes=readFileSync(new URL('../dist/footsteps/assets/'+r.file,import.meta.url));check(createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex')===r.gitBlob,r.file+' exact bytes');}
 check(c.cutoff<=1100&&c.tail<=.24,name+' restraint');
}
const panel=readFileSync(new URL('../dist/footsteps/panel.mjs',import.meta.url),'utf8'),preview=readFileSync(new URL('../dist/footsteps/preview.mjs',import.meta.url),'utf8'),audio=readFileSync(new URL('../dist/footsteps/audio.mjs',import.meta.url),'utf8');
for(const id of ['footPlay','footStop','footLoad','footGait','footSurface','footTempo','footFigure','footJump','footDemo','footRecord','footReset','footExport'])check(panel.includes(id),id+' present and routed');
check(!/new\s+(?:window\.)?(?:AudioContext|OfflineAudioContext)/.test(audio+preview),'injected context only');
check(!/setInterval|setTimeout/.test(audio),'no audio timer');
check(preview.includes('loops+active.time/duration'),'native action time owns cadence');
check(preview.includes('duration:duration/rate'),'tempo changes contact spacing with clip');
check(!audio.includes('impactSoft_heavy'),'no heavy impact');
check(audio.includes('env.gain.linearRampToValueAtTime(gain,when+.01)'),'soft attack');
check(audio.includes('.97+Math.random()*.06'),'pitch variation');
check(preview.includes("timeline.support(true"),'support-owned landing');
check(preview.includes("document.hidden"),'background stop');
// Rejection behavior, not a browser decode test.
await assert.rejects(createFootstepAudio({}));checks++;
console.log(JSON.stringify({status:'PASS',checks,scope:'Source / provenance assertions; browser behavior separately recorded'}));
