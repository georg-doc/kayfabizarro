import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'../../../..');
const lock=JSON.parse(readFileSync(resolve(here,'INTEGRATION_LOCK.json'),'utf8'));
const checks=[];
const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail});
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
const blob=spec=>git('rev-parse',spec);
const sha256=data=>createHash('sha256').update(data).digest('hex');

check('schema',lock.schema==='kfb.mobility.integration-lock.v1');
check('status',lock.status==='G0_SOURCE_LOCK_COMPLETE');
check('base head exists',git('cat-file','-t',lock.receiver.baseHead)==='commit');
check('Ground PR head exists',git('cat-file','-t',lock.owners.ground.head)==='commit');
check('Ground tested head exists',git('cat-file','-t',lock.owners.ground.testedRuntimeHead)==='commit');
check('planning head exists',git('cat-file','-t',lock.planning.head)==='commit');

for(const file of lock.planning.files) check(`planning blob ${file.path}`,blob(`${lock.planning.head}:${file.path}`)===file.gitBlob);
for(const file of lock.owners.ground.files) check(`Ground blob ${file.path}`,blob(`${lock.owners.ground.head}:${file.path}`)===file.gitBlob);

const car=lock.donors.vehicleVisual;
for(const key of ['gltf','bin','texture']){
  const file=car[key];
  const bytes=execFileSync('git',['cat-file','blob',`${car.head}:${file.path}`],{cwd:root,maxBuffer:32*1024*1024});
  check(`KayKit ${key} blob`,blob(`${car.head}:${file.path}`)===file.gitBlob);
  check(`KayKit ${key} sha256`,sha256(bytes)===file.sha256);
}
const gltf=JSON.parse(execFileSync('git',['cat-file','blob',`${car.head}:${car.gltf.path}`],{cwd:root,encoding:'utf8'}));
const nodeNames=(gltf.nodes||[]).map(n=>n.name).filter(Boolean);
check('KayKit source node list',JSON.stringify(nodeNames)===JSON.stringify(car.sourceInspection.nodes),nodeNames.join(', '));
check('KayKit has no animations',(gltf.animations||[]).length===0);
check('KayKit has no skins',(gltf.skins||[]).length===0);
check('KayKit has no occupant node',!nodeNames.some(n=>/driver|occupant|character|seat/i.test(n)));

const j14=lock.donors.j14;
const j14Path=suffix=>`${j14.head}:${j14.root}/${suffix}`;
const j14Expected={
  'START_HERE.md':j14.files.start,
  'CURRENT_STATE.md':j14.files.current,
  'RETURN.md':j14.files.return,
  'TEST_REPORT.md':j14.files.test,
  'SOURCE.json':j14.files.source,
  'lab-track/core/track-core.v012.mjs':j14.files.trackCore,
  'lab-track/core/stream-to-three.v5.mjs':j14.files.streamToThree,
  'lab-track/parcours/p1-recipes.js':j14.files.p1Recipes
};
for(const [path,expected] of Object.entries(j14Expected)) check(`J14 blob ${path}`,blob(j14Path(path))===expected);
for(let i=0;i<j14.p1aStream.parts.length;i++){
  const part=`lab-track/data/p1a-j14.stream.json.part${String(i+1).padStart(2,'0')}`;
  check(`J14 stream ${i+1}`,blob(j14Path(part))===j14.p1aStream.parts[i]);
}

const j15=lock.donors.j15;
check('J15 ZIP blob',blob(`${j15.head}:${j15.path}`)===j15.gitBlob);
const j15Bytes=execFileSync('git',['cat-file','blob',`${j15.head}:${j15.path}`],{cwd:root,maxBuffer:32*1024*1024});
check('J15 ZIP size',j15Bytes.length===j15.size,String(j15Bytes.length));
check('J15 ZIP sha256',sha256(j15Bytes)===j15.sha256);

check('one Ground writer',lock.owners.ground.acceptedFacts.positionWriterCount===1);
check('KayKit-only vehicle',car.decision==='KAYKIT_ONLY');
check('J14 not physics owner',j14.rejectedAuthority.includes('drive physics'));
check('J15 deferred',j15.classification.startsWith('DEFERRED_AFTER_G3'));
check('I enter/exit',lock.owners.modeBridge.inputs.interact==='KeyI');
check('Space remains Ground jump',lock.owners.modeBridge.inputs.groundJump==='Space');
check('Space remains Drive jump',lock.owners.modeBridge.inputs.driveJump==='Space');
check('Drive-to-Flight blocked',lock.owners.modeBridge.inputs.driveToFlight==='DISALLOWED');
check('G0 has no runtime',lock.receiver.runtimeStatus==='NOT_CREATED_IN_G0');

const failed=checks.filter(c=>!c.ok);
console.log(JSON.stringify({total:checks.length,passed:checks.length-failed.length,failed:failed.length,checks},null,2));
if(failed.length) process.exitCode=1;
