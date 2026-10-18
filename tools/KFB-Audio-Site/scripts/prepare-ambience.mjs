import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
const [ffmpeg,rawRoot]=process.argv.slice(2);if(!ffmpeg||!rawRoot)throw Error('Pass existing ffmpeg and downloaded source folder');
const base=new URL('../dist/ambience/',import.meta.url),plan=JSON.parse(fs.readFileSync(new URL('source-plan.json',base))),out=new URL('assets/',base);fs.mkdirSync(out,{recursive:true});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),sourceRows=plan.rows.map(r=>({...r,sha256:hash(fs.readFileSync(path.join(rawRoot,r.file)))})),assets=[];
const duration=f=>{try{execFileSync(ffmpeg,['-hide_banner','-i',f],{stdio:['ignore','ignore','pipe']});}catch(e){const m=e.stderr.toString().match(/Duration: (\d+):(\d+):([\d.]+)/);if(m)return +m[1]*3600 + +m[2]*60 + +m[3];}throw Error('Duration unavailable '+f);};
for(let i=1;i<=4;i++)fs.writeFileSync(path.join(rawRoot,'rain-'+i+'.ogg'),execFileSync('unzip',['-p',path.join(rawRoot,'rain.zip'),i+'.ogg']));
function add(id,source,start,seconds,role,extra={}){const row=sourceRows.find(r=>r.id===source),file=path.join(rawRoot,source==='rain'?extra.input:row.file),available=duration(file),length=Math.min(seconds,available-start);if(length<.1)throw Error('Empty '+id);
 const target=new URL(id+'.ogg',out),loudness=role==='thunder'?-20:-26;
 execFileSync(ffmpeg,['-v','error','-y','-ss',String(start),'-i',file,'-t',String(length),'-af','highpass=f=45,loudnorm=I='+loudness+':TP=-9:LRA=11,afade=t=in:d=0.04,afade=t=out:st='+Math.max(0,length-.12)+':d=0.12','-ar','32000','-ac','2','-c:a','libvorbis','-q:a','3',target.pathname]);
 const bytes=fs.readFileSync(target),a={id,file:'assets/'+id+'.ogg',sha256:hash(bytes),bytes:bytes.length,duration:duration(target.pathname),role,source:row.id,sourceSha256:row.sha256,sourceWindow:{start,seconds:length},license:row.license,licenseUrl:row.page,author:row.author,status:'SOURCE_VERIFIED_RUNTIME_UNVERIFIED',...extra};delete a.input;assets.push(a);}
for(const [id,src,starts,len] of [['meadow','park-birds',[10,100],60],['forest','park-birds',[40,140],60],['wind','park-wind',[5,55],45],['pond','frogs',[5,100],60],['jungle','jungle',[1,16],40]])for(let i=0;i<starts.length;i++)add(id+'-'+(i+1),src,starts[i],len,'bed',{note:id==='jungle'?'Overlapping excerpts of morning recording; authentic night variant remains a gap':'Distinct source windows, not separate recording sessions'});
for(let i=1;i<=4;i++)add('wave-'+i,'wave-'+i,0,15,'water');
add('river-long','park-river',15,60,'water');add('waterfall','waterfall',0,10,'water');
for(let i=1;i<=4;i++)add('rain-'+i,'rain',0,60,'weather',{input:'rain-'+i+'.ogg'});
for(let i=0;i<6;i++)add('bird-'+(i+1),'birds',i*3.4,2.5,'event',{pool:'birds',species:'unidentified field-recorded bird phrase'});
for(let i=0;i<3;i++)add('chirp-'+(i+1),'bird-chirp',i*.9,.85,'event',{pool:'birds',species:'unidentified field-recorded bird phrase'});
for(let i=0;i<3;i++)add('cricket-'+(i+1),'crickets',i*2.7,2.1,'event',{pool:'crickets'});
for(let i=0;i<3;i++)add('frog-'+(i+1),'frogs',20+i*37,4,'event',{pool:'frogs'});
// Anchor arrival to the first substantial thunder envelope, not the rain pre-roll.
const thunderPcm=execFileSync(ffmpeg,['-v','error','-i',path.join(rawRoot,'thunder.mp3'),'-ar','8000','-ac','1','-f','f32le','pipe:1']);
const samples=new Float32Array(thunderPcm.buffer,thunderPcm.byteOffset,thunderPcm.byteLength/4),envelope=[];
for(let i=0;i<samples.length;i+=160){let sum=0;for(let j=i;j<Math.min(samples.length,i+160);j++)sum+=samples[j]**2;envelope.push(Math.sqrt(sum/160));}
const onset=envelope.findIndex(x=>x>=Math.max(...envelope)*.35)*.02;
add('thunder','thunder',Math.max(0,onset-.02),Math.min(12,20.9-onset),'thunder',{arrivalAnchorSeconds:.02,onsetDetection:{windowSeconds:.02,thresholdFractionOfPeakRms:.35,sourceOnsetSeconds:onset},note:'Single rain/thunder recording, cropped at first substantial envelope; dry alternative claps remain a gap; physical perceptual onset needs ear review'});
const manifest={schema:'kfb-ambience.v1',sourceCommit:plan.sourceCommit||'c746a9567e0ea20a24b8969fe9130ac0756e7a7e',checked:'2026-10-18',sources:sourceRows,assets,quarantined:plan.quarantined,excluded:plan.excluded};
fs.writeFileSync(new URL('licence-register.json',base),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({sources:sourceRows.length,assets:assets.length,bytes:assets.reduce((n,a)=>n+a.bytes,0),beds:assets.filter(a=>a.role==='bed').map(a=>({id:a.id,duration:a.duration}))},null,2));
