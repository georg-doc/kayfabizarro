import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const repo=path.resolve(root,'../../..');
const original=path.join(repo,'tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/TOOLBOX_SOURCE_CUT_2026-10-14_r1');
const candidate=path.join(root,'dist/production-08');
const lock=JSON.parse(fs.readFileSync(path.join(root,'SOURCE.json')));
let passed=0,failed=0; const checks=[];
function check(name,ok,detail=''){checks.push({name,ok,detail});ok?passed++:failed++;}
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
for(const row of fs.readFileSync(path.join(original,'CHECKSUMS.sha256'),'utf8').trim().split('\n')){
 const m=row.match(/^([a-f0-9]{64})\s+(.+)$/);const rel=m[2];
 check('source checksum: '+rel,sha(fs.readFileSync(path.join(original,rel)))===m[1]);
 let expected=fs.readFileSync(path.join(original,rel),'utf8');
 if(rel==='kfb-lib/pet-library.v6.js')expected=expected.replaceAll('/kayfabizarro/main/','/kayfabizarro/'+lock.sourceHead+'/');
 if(rel==='kfb-lib/body-surface.v2.js'){
  const fp=lock.records.find(x=>x.path.endsWith('/external/Fingerprints01_3K.png'));
  expected=expected.replace("new URL('./clay/Fingerprints01_3K.png', import.meta.url).href",JSON.stringify(fp.url));
 }
 check('port source identity: '+rel,fs.readFileSync(path.join(candidate,rel),'utf8')===expected);
}
const html=fs.readFileSync(path.join(candidate,'index.html'),'utf8');
const originalHtml=fs.readFileSync(path.join(original,'KFB ToolBox Production-08.dc.html'),'utf8');
const normalized=s=>s.replace(/<script type="importmap">[\s\S]*?<\/script>/,'<script type="importmap"></script>');
check('entry unchanged outside import map',normalized(html)===normalized(originalHtml));
const im=JSON.parse(html.match(/<script type="importmap">\s*([\s\S]*?)<\/script>/)[1]);
check('Three remains 0.160.0',im.imports.three==='https://unpkg.com/three@0.160.0/build/three.module.js');
check('owner module redirects preserve pinned path',Object.entries(im.imports).filter(([k])=>k.includes('kayfabizarro')).length===2);
for(const r of lock.records.filter(x=>x.local)){
 const source=spawnSync('git',['show',r.commit+':'+r.path],{cwd:repo,encoding:'utf8'});
 const expected=source.stdout.replaceAll('/kayfabizarro/main/','/kayfabizarro/'+lock.sourceHead+'/').replaceAll('/kayfabizarro@main/','/kayfabizarro@'+lock.sourceHead+'/');
 check('owner code unchanged except asset freeze: '+r.local,source.status===0&&fs.readFileSync(path.join(candidate,r.local),'utf8')===expected);
}
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(dir,d.name)):[path.join(dir,d.name)]);
for(const f of walk(candidate).filter(x=>x.endsWith('.js'))){
 const result=spawnSync(process.execPath,['--check','--input-type=module'],{input:fs.readFileSync(f),encoding:'utf8'});
 check('JS syntax: '+path.relative(candidate,f),result.status===0,result.status===0?'':result.stderr);
}
const logic=html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
try{new vm.Script(logic);check('DC Component syntax',true);}catch(e){check('DC Component syntax',false,String(e));}
const recipe=JSON.parse(fs.readFileSync(path.join(candidate,'data/kfb-pet-frizzlebob-earrig-v5.georg-2026-10-14.json')));
check('Georg actor recipe schema and v5b source retained',recipe.schema==='kfb.pets/1'&&recipe.pets[0].source.commit==='23615cffb515d03d2b6a0164b896dd08e3bc1bed');
check('source actor uses existing EyeRig shells',recipe.pets[0].parts.eyes==='rig'&&recipe.pets[0].clayLids.on===false);
check('model binaries remain remote',!walk(candidate).some(f=>/\.(glb|gltf|fbx)$/i.test(f)));
const report={schema:'kfb.toolbox-port-check/1',passed,failed,checks,notRun:['HTTP boot','WebGL','visual parity front/three-quarter/side','ToolBox self-test','Library self-test','rigging acceptance','E1-E9','hosted app consent/read/write','independent critic']};
fs.writeFileSync(path.join(root,'TEST_RESULTS.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed,failed,notRun:report.notRun}));process.exitCode=failed?1:0;
