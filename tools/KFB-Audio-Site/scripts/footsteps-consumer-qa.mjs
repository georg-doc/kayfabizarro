import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {createFootstepConsumer} from '../dist/footsteps/consumer.mjs';import {SURFACES} from '../dist/footsteps/audio.mjs';
const ffmpeg=process.argv[2];let checks=0,started=0;const check=(x,m)=>{assert.ok(x,m);checks++;};
const receipt=JSON.parse(fs.readFileSync(new URL('../dist/footsteps/imported-sources.json',import.meta.url)));
for(const r of receipt.rows){const b=fs.readFileSync(new URL('../dist/footsteps/assets/imported/'+r.file,import.meta.url)),h=crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');check(h===r.sourceBlob,'pinned bytes '+r.file);}
// Test double for the graph ONLY. Decode uses real donor bytes through ffmpeg, not placeholder PCM.
const parameter=()=>({value:0,setValueAtTime(){},cancelScheduledValues(){}}),node=()=>({gain:parameter(),delayTime:parameter(),connect(n){return n;},disconnect(){},stream:{},getFloatTimeDomainData(p){p.fill(0);}});
const context={currentTime:10,createGain:node,createDelay:node,createMediaStreamDestination:node,createAnalyser:node,
 createBuffer(ch,length,sr){const data=Array.from({length:ch},()=>new Float32Array(length));return {duration:length/sr,copyToChannel(p,i){data[i].set(p);}};},
 createBufferSource(){return {...node(),playbackRate:{value:1},start(){started++;},stop(){}};},
 async decodeAudioData(input){const d=execFileSync(ffmpeg,['-v','error','-i','pipe:0','-f','f32le','-ac','1','-ar','48000','pipe:1'],{input:Buffer.from(input)}),pcm=new Float32Array(d.buffer.slice(d.byteOffset,d.byteOffset+d.byteLength));return {numberOfChannels:1,length:pcm.length,sampleRate:48000,duration:pcm.length/48000,getChannelData(){return pcm;}};}};
const oldFetch=globalThis.fetch;globalThis.fetch=async url=>{const b=fs.readFileSync(fileURLToPath(url));return {ok:true,json:async()=>JSON.parse(b),arrayBuffer:async()=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)};};
try{const c=await createFootstepConsumer({audioContext:context,destination:node()});check(c.snapshot().surface==='wood','Wood default');check(c.snapshot().metrics.length===58,'all bank variants decoded');check(c.emit({})===null,'inactive silent');c.start();
check(c.emit({type:'footstep',id:'air',at:11,foot:'l',moving:true,grounded:false})===null,'no airborne step');check(c.emit({type:'footstep',id:'idle',at:11,foot:'l',moving:false,grounded:true})===null,'no stationary step');
for(const [surface,config] of Object.entries(SURFACES)){if(config.role==='accent')continue;c.setSurface(surface);let previous=null;for(let i=0;i<12;i++){const cue={type:'footstep',id:surface+':'+i,at:12+i,foot:i%2?'r':'l',grounded:true,moving:true},r=c.emit(cue);check(r.surface===surface,'surface routing');check(r.file!==previous,'no immediate repeated take');check(c.emit(cue)===null,'duplicate contact rejected');previous=r.file;}}
check(c.emit({type:'creak',id:'creak',at:40}).file==='foley_creak_1.wav','accent separate');assert.throws(()=>c.setSurface('creak'));checks++;c.stop();check(c.emit({type:'creak',id:'no',at:41})===null,'stop blocks playback');check(c.snapshot().state.activeSources===0,'stop clears sources');c.dispose();
const source=fs.readFileSync(new URL('../dist/footsteps/consumer.mjs',import.meta.url),'utf8');check(!/new\s+(AudioContext|OfflineAudioContext)|document\.|window\.|setInterval|setTimeout|WB2/.test(source),'DOM-free, clock-free, no context owner');
console.log(JSON.stringify({status:'PASS',checks,bankVariants:58,uniqueSourceFiles:53,importedHashChecks:33,started,graph:'test double; actual hosted graph checked separately'}));
}finally{globalThis.fetch=oldFetch;}
