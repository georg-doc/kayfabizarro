// Private preparation. Public mirrors receive only code and manifests.
import fs from 'node:fs';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
const [ffmpeg,auditFile,rawRoot]=process.argv.slice(2),audit=JSON.parse(fs.readFileSync(auditFile)),root=new URL('../dist/combat/',import.meta.url),sr=32000,assets=[];
fs.mkdirSync(new URL('private-assets/',root),{recursive:true});const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const a of audit.variants){
 const raw=fs.readFileSync(rawRoot+'/'+a.file);if(hash(raw)!==a.sha256)throw Error('Private source mismatch '+a.id);
 const bytes=execFileSync(ffmpeg,['-v','error','-i',rawRoot+'/'+a.file,'-ar',String(sr),'-ac','1','-af','highpass=f=45,lowpass=f=11000','-f','f32le','pipe:1']),pcm=new Float32Array(bytes.buffer,bytes.byteOffset,bytes.byteLength/4);
 const start=Math.max(0,a.activeAt-.003),end=Math.min(pcm.length/sr,Math.max(start+.12,a.energyTimes['0.99']+.12)),data=pcm.slice(Math.floor(start*sr),Math.ceil(end*sr));
 let peak=0,sum=0,count=0;const from=Math.max(0,Math.floor((a.energyTimes['0.1']-start)*sr)),to=Math.min(data.length,Math.ceil((a.energyTimes['0.9']-start)*sr));
 for(let i=0;i<data.length;i++){peak=Math.max(peak,Math.abs(data[i]));if(i>=from&&i<to){sum+=data[i]*data[i];count++;}}
 const gain=Math.min(1,.20/Math.max(peak,1e-9),10**(-25/20)/Math.max(Math.sqrt(sum/Math.max(1,count)),1e-9));
 for(let i=0;i<data.length;i++)data[i]*=gain*Math.min(1,i/(sr*.001),(data.length-1-i)/(sr*.03));
 const file='private-assets/'+a.id+'.ogg',path=new URL(file,root).pathname;
 execFileSync(ffmpeg,['-v','error','-y','-f','f32le','-ar',String(sr),'-ac','1','-i','pipe:0','-c:a','libvorbis','-q:a','4',path],{input:Buffer.from(data.buffer)});
 const encoded=fs.readFileSync(path),decoded=execFileSync(ffmpeg,['-v','error','-i',path,'-ar',String(sr),'-ac','1','-f','f32le','pipe:1']);
 const duration=decoded.length/4/sr,family=a.id.slice(0,3),q=a.energyTimes,bodyEnd=Math.min(duration,Math.max(.04,q['0.9']-start)),attackEnd=Math.min(bodyEnd,Math.max(.025,q['0.5']-start));
 assets.push({id:a.id,family,file,sha256:hash(encoded),bytes:encoded.length,duration,sourceDropboxPath:a.sourceDropboxPath,sourceSha256:a.sha256,licence:'LicenseRef-ElevenLabs-PaidPlan-Commercial',publicAudio:false,processing:{gain,trimStart:start,peakCap:.20,activeEnergyRmsTargetDbfs:-25,neverBoost:true},windows:{attack:{offset:0,duration:attackEnd},body:{offset:Math.max(0,attackEnd-.01),duration:Math.max(.01,bodyEnd-attackEnd+.01)},tail:{offset:Math.max(0,bodyEnd-.02),duration:Math.max(.01,duration-bodyEnd+.02)}},layerStatus:'DERIVED_COMPOSITE_EXCERPTS_NOT_INDEPENDENT_TAKES_EAR_OPEN'});
}
const manifest={schema:'kfb.combat-sfx/1',privateAudio:true,sourceHead:audit.sourceHead,rights:'WS0 paid-plan assertion; Georg private Dropbox/public code-only decision',assets,excludedSuperseded:audit.excludedSuperseded,notes:['C18 chain only: never per-domino contact','C07 finite fuse shot: no unverified looping','Derived layers are experimental composite excerpts, not independent recordings']};
fs.writeFileSync(new URL('manifest.json',root),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({assets:assets.length,bytes:assets.reduce((s,a)=>s+a.bytes,0)}));
