import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const f=JSON.parse(readFileSync(new URL('../dist/footsteps/proof/wood-carpet-fixture.json',import.meta.url)));
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
check(f.revision==='0.7.6-sole-contact-r3','correct revision');check(f.hostContexts===1,'one existing context');check(f.decode.length===58,'all retained/imported bank variants');check(f.counts.duplicateKeys===0,'no doubled contact');check(f.avSamples.length>=25,'actual rendered contact samples');
check(f.renderedSoleToEstimatedOnsetMs.max<1000/60,'rendered sole vs source-onset estimate within one 60Hz frame');
check(f.events.every(e=>!e.late),'no missed audio pre-roll');
check(f.decode.filter(e=>e.surface==='wet-clay').every(e=>e.levelDb===-6),'former Cozy attenuated');
check(!f.playing&&!f.audioState.armed&&f.audioState.activeSources===0&&f.audioState.rms===0,'actual output meter silent after Stop');
for(const e of f.avSamples){check(e.soleClearance<=.004,'actual rendered sole near support');check(Math.abs(e.avErrorMs)<1000/60,'contact AV estimate');}
for(const surface of ['wood','carpet-wood','foley-carpet','digital-wood'])check(f.events.some(e=>e.surface===surface),'surface played '+surface);
for(const d of f.decode)check(Math.abs(20*Math.log10(d.processedRms/(.010*Math.pow(10,d.levelDb/20))))<.1,'calibrated post-shaping energy');
for(const [surface,attack] of [['wood',10],['carpet-wood',28],['foley-carpet',22],['digital-wood',20]])check(f.events.filter(e=>e.surface===surface).every(e=>e.attackMs===attack),'attack '+surface);
console.log(JSON.stringify({status:'PASS',checks,scheduledSteps:f.counts.steps,renderedContacts:f.avSamples.length,maxEstimatedAVMs:f.renderedSoleToEstimatedOnsetMs.max,limits:'Audio onset is an estimate; no human or microphone listening acceptance.'}));
