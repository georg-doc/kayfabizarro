import fs from 'node:fs';
import {measureLoudness} from '../dist/experience/loudness.js';
const file=process.argv[2],wav=fs.readFileSync(file);let channels,rate,bits,data;
for(let p=12;p+8<wav.length;){const id=wav.toString('ascii',p,p+4),size=wav.readUInt32LE(p+4);if(id==='fmt '){channels=wav.readUInt16LE(p+10);rate=wav.readUInt32LE(p+12);bits=wav.readUInt16LE(p+22);}if(id==='data'){data=wav.subarray(p+8,p+8+size);break;}p+=8+size+(size%2);}
if(bits!==16)throw Error('Expected PCM16 WAV');
const count=data.length/2/channels,pcm=Array.from({length:channels},()=>new Float32Array(count));for(let i=0;i<count;i++)for(let c=0;c<channels;c++)pcm[c][i]=data.readInt16LE((i*channels+c)*2)/32768;
console.log(JSON.stringify({file,...measureLoudness(pcm,rate)},null,2));
