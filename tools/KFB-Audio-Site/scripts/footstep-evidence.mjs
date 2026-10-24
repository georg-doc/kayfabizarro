import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),passed=[];
const check=(name,fn)=>{fn();passed.push(name);};
const sources=JSON.parse(await readFile(new URL('dist/footsteps/sources.json',root),'utf8'));
for(const row of sources.rows){const b=await readFile(new URL(`dist/footsteps/assets/${row.file}`,root));check(`pinned donor bytes: ${row.file}`,()=>assert.equal(createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex'),row.gitBlob));}
const evidence=JSON.parse(await readFile(new URL('dist/footsteps/proof/browser-fixture.json',root),'utf8'));
check('15 real audio decodes',()=>assert.equal(evidence.decode.length,15));
check('one host AudioContext',()=>assert.equal(evidence.hostContexts,1));
check('no duplicate event keys',()=>assert.equal(evidence.counts.duplicateKeys,0));
check('one support landing',()=>assert.equal(evidence.counts.landings,1));
check('all three material banks sounded',()=>assert.deepEqual([...new Set(evidence.events.filter(e=>e.kind==='footstep').map(e=>e.surface))].sort(),['concrete','grass','gravel']));
check('walk 112.5 qualified contacts/min',()=>assert.ok(Math.abs(evidence.profiles.Walking_A.qualifiedCadenceSpm-112.5)<.001));
check('run 150 qualified contacts/min',()=>assert.ok(Math.abs(evidence.profiles.Running_A.qualifiedCadenceSpm-150)<.001));
check('source-onset scheduling bound <40ms',()=>assert.ok(evidence.contactToSourceOnsetMs.max<40));
check('no immediate same-bank sample repeat',()=>{let previous={};for(const e of evidence.events){const b=e.kind==='land'?'land':e.surface;assert.notEqual(e.file,previous[b]);previous[b]=e.file;}});
let maxPhaseIntervalError=0;
for(let i=1;i<evidence.events.length;i++){const a=evidence.events[i-1],b=evidence.events[i];if(a.kind==='footstep'&&b.kind==='footstep'&&a.key.split(':').slice(0,2).join(':')===b.key.split(':').slice(0,2).join(':')){const p=evidence.profiles[a.key.split(':')[0]],delta=(b.phase-a.phase+1)%1*p.duration;maxPhaseIntervalError=Math.max(maxPhaseIntervalError,Math.abs(b.time-a.time-delta));}}
check('no accumulated within-gait phase drift',()=>assert.ok(maxPhaseIntervalError<1e-8));
for(const file of ['contact-core.mjs','audio.mjs']){const text=await readFile(new URL(`dist/footsteps/${file}`,root),'utf8');check(`${file}: zero context construction`,()=>assert.ok(!/new\s+(?:AudioContext|webkitAudioContext|Context)\s*\(/.test(text)));check(`${file}: DOM-free`,()=>assert.ok(!/\b(?:document|window)\s*\./.test(text)));}
const report={status:'PASS',checks:passed.length,passed,fixture:evidence.counts,decode:evidence.decode.length,contactToScheduleMs:evidence.contactToScheduleMs,contactToSourceOnsetMs:evidence.contactToSourceOnsetMs,maxPhaseIntervalErrorSeconds:maxPhaseIntervalError,limitations:['Scheduling/source threshold only, not acoustic output latency or filter group delay.','Raw contacts sampled at approximately 60Hz.','Sonic character not HUMAN_ACCEPTED.']};
await writeFile(new URL('dist/footsteps/proof/source-evidence-report.json',root),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
