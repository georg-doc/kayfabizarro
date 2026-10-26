// KFB Audio WS0 Immersive Sound R0 — repository-native mock WebAudio QA.
// Run: node tools/KFB-ToolBox/audio/card-performance-self-service/qa-immersive.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createImmersiveAmbience, IMMERSIVE_PALETTES } from './immersive-ambience.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const site=fs.readFileSync(path.join(root,'audio-site.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
let checks=0;const check=(name,fn)=>{assert.ok(fn(),name);checks++;};
class Param {
  constructor(){this.value=0;}
  cancelScheduledValues(){}
  setTargetAtTime(v){this.value=v;}
  setValueAtTime(v){this.value=v;}
  linearRampToValueAtTime(v){this.value=v;}
  exponentialRampToValueAtTime(v){this.value=v;}
}
class Node {
  constructor(){this.gain=new Param();this.frequency=new Param();this.detune=new Param();this.Q=new Param();this.connections=[];}
  connect(n){this.connections.push(n);return n;}
  disconnect(){this.connections=[];}
  start(){this.started=true;}
  stop(){this.onended?.();}
}
let oscillators=0,buffers=0;
const ctx={currentTime:1,sampleRate:44100,destination:new Node(),
  createGain:()=>new Node(),createBiquadFilter:()=>new Node(),
  createOscillator:()=>{oscillators++;return new Node();},
  createBufferSource:()=>new Node(),
  createBuffer:(_channels,frames)=>{buffers++;const data=new Float32Array(frames);return{getChannelData:()=>data};}
};
check('source palettes',()=>IMMERSIVE_PALETTES.join('|')==='ICEBERG|ONEIRIC|ORGANIC_AIR');
check('injected context required',()=>{try{createImmersiveAmbience({destination:new Node()});return false;}catch{return true;}});
check('existing bus required',()=>{try{createImmersiveAmbience({audioContext:ctx});return false;}catch{return true;}});
let changes=0;const s=createImmersiveAmbience({audioContext:ctx,destination:ctx.destination,onChange:()=>changes++});
check('starts idle',()=>!s.getSnapshot().active);
check('never owns context',()=>s.getSnapshot().moduleCreatedAudioContexts===0);
check('starts synthesis',()=>s.start().active&&oscillators===6&&buffers===1);
check('start idempotent',()=>{const n=oscillators;s.start();return oscillators===n;});
check('organic preset',()=>s.setPalette('ORGANIC_AIR').palette==='ORGANIC_AIR');
check('oneiric preset',()=>s.setPalette('ONEIRIC').palette==='ONEIRIC');
check('invalid preset fails',()=>{try{s.setPalette('FAKE');return false;}catch{return true;}});
check('depth clamp',()=>s.setDepth(50).depth===1&&s.setDepth(-1).depth===0);
check('physical accent',()=>s.accent()&&s.getSnapshot().accents===1);
check('stop idempotent',()=>{s.stop();s.stop();return !s.getSnapshot().active;});
check('no accent while stopped',()=>s.accent()===false);
check('fresh restart',()=>{const n=oscillators;s.start();return s.getSnapshot().active&&oscillators>n;});
check('dispose',()=>{s.dispose();return !s.getSnapshot().active;});
check('no disposed restart',()=>{try{s.start();return false;}catch{return true;}});
check('change notifications',()=>changes>=7);
check('Site injection uses GLOBAL_BED',()=>site.includes('destination:buses.GLOBAL_BED'));
check('one Site constructor retained',()=>(site.match(/new Context\(\)/g)||[]).length===1);
check('Site voice duck intact',()=>site.includes('baseAmbienceDuckDb')&&site.includes('setVoiceActive'));
check('Site public API keeps music and adaptive',()=>site.includes('immersiveSound:{start')&&site.includes('adaptiveMusic:{startDeck')&&site.includes('musicContext:{get contract'));
check('no standalone runtime owner',()=>!site.includes('new AudioContext(')&&!site.includes('setInterval('));
check('Site keeps product sections',()=>['catalog','mix','voice','soundscape','intake','prompt','brief'].every(id=>html.includes('id="'+id+'"')));
check('all immersive controls mounted',()=>['immersiveStart','immersiveStop','immersivePalette','immersiveDepth','immersiveAccent','immersiveStatus','immersiveDepthLabel'].every(id=>html.includes('id="'+id+'"')));
check('synth provenance explicitly visible',()=>html.includes('SYNTH_ONLY')&&html.includes('Conspiracy Iceberg Explorer'));
console.log('KFB immersive source/mock QA: '+checks+'/'+checks+' PASS — NOT audio render/browser/listening proof');
