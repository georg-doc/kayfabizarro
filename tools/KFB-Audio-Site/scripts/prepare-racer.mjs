// Private build output only. Never include private-assets/ in the public GitHub mirror.
import fs from 'node:fs';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
const [ffmpeg,rawRoot]=process.argv.slice(2),base=new URL('../dist/racer/',import.meta.url),plan=JSON.parse(fs.readFileSync(new URL('source-plan.json',base))),assets=[];
fs.mkdirSync(new URL('private-assets/',base),{recursive:true});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),sr=32000;
const decode=(a,factor=1)=>{const filter='aresample=32000,highpass=f=45'+(factor===1?'':',asetrate='+Math.round(sr*factor)+',aresample='+sr+',atempo='+(1/factor));const b=execFileSync(ffmpeg,['-v','error','-i',rawRoot+'/'+a.set+'/'+a.file,'-ar',String(sr),'-ac','2','-af',filter,'-f','f32le','pipe:1'],{maxBuffer:12000000});return new Float32Array(b.buffer,b.byteOffset,b.byteLength/4);};
function write(id,a,p,{loop=false,factor=1,window=null,role='event'}={}){const raw=fs.readFileSync(rawRoot+'/'+a.set+'/'+a.file),originalPeak=Math.max(0,...p.subarray(0,Math.min(p.length,1000)).map(Math.abs));let data=p;
 if(window)data=p.slice(Math.floor(window.start*sr)*2,Math.floor((window.start+window.seconds)*sr)*2);
 if(loop){const n=1600,total=data.length/2,out=new Float32Array(data.length-n*2);out.set(data.subarray(n*2));for(let i=0;i<n;i++)for(let c=0;c<2;c++){const f=i/(n-1),index=(total-2*n+i)*2+c;out[index]=data[(total-n+i)*2+c]*Math.cos(f*Math.PI/2)+data[i*2+c]*Math.sin(f*Math.PI/2);}data=out;}
 let peak=0,sum=0;for(const x of data){peak=Math.max(peak,Math.abs(x));sum+=x*x;}const rms=Math.sqrt(sum/data.length),target=10**((loop?-25:-26)/20),gain=Math.min(target/Math.max(rms,1e-9),.24/Math.max(peak,1e-9));
 for(let i=0;i<data.length;i++){const frame=i>>1,t=frame/sr,len=data.length/2/sr,fade=loop?1:Math.min(1,t/.005,(len-t)/.04);data[i]*=gain*Math.max(0,fade);}
 const file=new URL('private-assets/'+id+'.ogg',base);execFileSync(ffmpeg,['-v','error','-y','-fflags','+bitexact','-f','f32le','-ar',String(sr),'-ac','2','-i','pipe:0','-c:a','libvorbis','-q:a','4',file.pathname],{input:Buffer.from(data.buffer,data.byteOffset,data.byteLength)});
 const bytes=fs.readFileSync(file);assets.push({id,file:'private-assets/'+id+'.ogg',sha256:hash(bytes),bytes:bytes.length,duration:data.length/2/sr,role,loop,source:a.path,sourceSha256:hash(raw),dropboxPath:'ns:1174592111//CLAUDE/KFB_HUB/40_AUDIO/elevenlabs_r1/'+a.set+'/'+a.file,license:'LicenseRef-ElevenLabs-PaidPlan-Commercial',publicAudio:false,processing:{rmsTargetDbfs:loop?-25:-26,preEncodePeakCap:.24,gain,loopCrossfadeSeconds:loop?.05:0,pitchFactor:factor,sourceWindow:window},pitchStatus:factor===1?'SOURCE_UNTUNED': 'MEASUREMENT_DERIVED_CANDIDATE_EAR_REVIEW_OPEN'});}
for(const a of plan.files){if(a.id==='O2_backfire')continue;const loop=/^(L[1-5]|F[123]|H3)/.test(a.id),reference=/^S[12]/.test(a.id),factor=a.id==='L3_mid'?.93:a.id==='L4_high'?1.35:1,p=decode(a,factor);
 if(a.id==='O3_crackle_series'){// Four non-overlapping donor excerpts, NOT four independently generated takes.
  for(let i=0;i<4;i++)write('crackle-'+(i+1),a,p,{window:{start:i*.55,seconds:.45},role:'crackle'});continue;}
 write(a.id,a,p,{loop,factor,role:reference?'reference':loop?'loop':'event'});
 if(factor!==1)write(a.id+'_original',a,decode(a),{loop:true,role:'loop-original'});
}
for(const a of assets){const pcm=execFileSync(ffmpeg,['-v','error','-i',new URL(a.file,base).pathname,'-ar',String(sr),'-ac','2','-f','f32le','pipe:1'],{maxBuffer:12000000});a.duration=pcm.length/8/sr;}
const manifest={schema:'kfb.racer-gears/1',privateAudio:true,sourceCommit:plan.sourceCommit,rightsEvidence:'WS0 paid-plan assertion; Georg 2026-10-18 public Code+Manifest/private Dropbox decision',assets,excluded:[{id:'O2_backfire',reason:'WS0 weak candidate; never scheduled'}],donor:{repo:'KhazP/rwanda-f1-2026-sim',commit:'b57d085750513e00e83f6e03f81d3dedea1f1eec',file:'src/lib/sim/vf26-audio.ts',license:'MIT',scope:'Equal-power LoopGrid logic only; no donor audio / GPL CarAudio import'}};
fs.writeFileSync(new URL('manifest.json',base),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({assets:assets.length,bytes:assets.reduce((s,a)=>s+a.bytes,0),private:true}));
