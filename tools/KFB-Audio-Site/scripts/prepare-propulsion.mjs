// Extend existing private Racer manifest; never rewrite the admitted26 baseline files.
import fs from 'node:fs';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
const [ffmpeg,rawRoot]=process.argv.slice(2),root=new URL('../dist/racer/',import.meta.url),manifest=JSON.parse(fs.readFileSync(new URL('manifest.json',root))),source=JSON.parse(fs.readFileSync(new URL('propulsion-source.json',root))),sr=32000;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');manifest.assets=manifest.assets.filter(a=>!/^P0/.test(a.id));
for(const a of source.files){const raw=fs.readFileSync(rawRoot+'/'+a.file);if(hash(raw)!==a.sourceSha256)throw Error('Private source mismatch '+a.id);
 const decoded=execFileSync(ffmpeg,['-v','error','-i',rawRoot+'/'+a.file,'-ar',String(sr),'-ac','2','-af','highpass=f=45,lowpass=f=11000','-f','f32le','pipe:1'],{maxBuffer:5000000}),pcm=new Float32Array(decoded.buffer,decoded.byteOffset,decoded.byteLength/4),loop=/^P0[1235]/.test(a.id);let data=pcm;
 const trimSeconds=/^P05/.test(a.id)?.3:0,stable=pcm.subarray(Math.round(trimSeconds*sr)*2,pcm.length-Math.round(trimSeconds*sr)*2);
 if(loop){const n=1600,total=stable.length/2;data=new Float32Array(stable.length-n*2);data.set(stable.subarray(n*2));for(let i=0;i<n;i++)for(let c=0;c<2;c++){const f=i/(n-1);data[(total-2*n+i)*2+c]=stable[(total-n+i)*2+c]*Math.cos(f*Math.PI/2)+stable[i*2+c]*Math.sin(f*Math.PI/2);}}
 let peak=0,sum=0;for(const x of data){peak=Math.max(peak,Math.abs(x));sum+=x*x;}const gain=Math.min(10**((loop?-25:-27)/20)/Math.sqrt(sum/data.length),.20/Math.max(peak,1e-9));
 for(let i=0;i<data.length;i++){const t=(i>>1)/sr,len=data.length/2/sr;data[i]*=gain*(loop?1:Math.max(0,Math.min(1,t/.006,(len-t)/.045)));}
 const file='private-assets/'+a.id+'.ogg',path=new URL(file,root).pathname;execFileSync(ffmpeg,['-v','error','-y','-f','f32le','-ar',String(sr),'-ac','2','-i','pipe:0','-c:a','libvorbis','-q:a','4',path],{input:Buffer.from(data.buffer)});
 const encoded=fs.readFileSync(path),actual=execFileSync(ffmpeg,['-v','error','-i',path,'-ar',String(sr),'-ac','2','-f','f32le','pipe:1'],{maxBuffer:5000000});
 manifest.assets.push({id:a.id,file,sha256:hash(encoded),bytes:encoded.length,duration:actual.length/8/sr,role:loop?'loop':'event',loop,source:'propulsion_r1_norm/'+a.file,dropboxPath:a.dropboxPath,sourceSha256:a.sourceSha256,license:'LicenseRef-ElevenLabs-PaidPlan-Commercial',publicAudio:false,processing:{rmsTargetDbfs:loop?-25:-27,preEncodePeakCap:.20,gain,trimStartSeconds:trimSeconds,trimEndSeconds:trimSeconds,loopCrossfadeSeconds:loop?.05:0,pitchFactor:1},pitchStatus:'SOURCE_UNTUNED_EAR_REVIEW_OPEN'});
}
manifest.propulsion={sourceManifest:'propulsion-source.json',sourceHead:source.sourceHead,admitted:12,loopSeamSeconds:.05,humanEar:'OPEN'};fs.writeFileSync(new URL('manifest.json',root),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({baseline:26,added:12,total:manifest.assets.length}));
