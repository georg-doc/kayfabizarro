import fs from 'node:fs';
import crypto from 'node:crypto';

const read=(p)=>fs.readFileSync(p,'utf8');
const baseline=read('tools/KFB-ToolBox/stage-first/src/KFB ToolBox Stage-First v1.dc.html');
const candidate=read('tools/KFB-ToolBox/stage-first/src/TOOLBOX_COHERENT_INTEGRATION_01.html');
const adapter=read('tools/KFB-ToolBox/stage-first/coherent-integration-01.js');
const edit=read('tools/KFB-ToolBox/lib/edit-layer.js');
const driver=read('tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js');
const contract=JSON.parse(read('tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json'));
const cast=read('tools/resident_atlas_s6/data/cast.js');
const atlas=read('tools/resident_atlas_s6/lib/atlas.js');
const poseOwner=read('tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v13/pose-rig.v1.js');
const poseMirror=read('tools/KFB-ToolBox/stage-first/src/petstudio-v9/studio-v13/pose-rig.v1.js');
const locomotionProfiles=read('tools/KFB-ToolBox/stage-first/src/lab/locomotion-profiles.v1.js');
const locomotionFixture=JSON.parse(read('tools/KFB-ToolBox/stage-first/profiles/locomotion/kfb-locomotion-profiles.Rig_Medium.frizzlebob-earrig-v5.consumer.json'));

let pass=0;
const checks=[];
function ok(name,cond){
  if(!cond) throw new Error('FAIL '+name);
  pass++;checks.push(name);console.log('ok '+pass+' - '+name);
}
const hash=crypto.createHash('sha256').update(Buffer.from(baseline,'utf8')).digest('hex');
ok('accepted Stage-First donor SHA-256',hash==='08f9108a6a2a556d0e1e2e34ce564842062a4fdd77a80fb1020a8e723b688fba');
ok('candidate differs only by coherent module injection',candidate.replace('<script type="module" src="../coherent-integration-01.js"></script>\n','')===baseline);
ok('candidate injects coherent adapter exactly once',(candidate.match(/coherent-integration-01\.js/g)||[]).length===1);
ok('shared edit-layer is imported',adapter.includes("from '../lib/edit-layer.js'"));
ok('Resident Atlas builder is reused',adapter.includes("buildVignette")&&adapter.includes("../../resident_atlas_s6/lib/atlas.js"));
ok('Resident Atlas database is reused',adapter.includes("RESIDENTS")&&adapter.includes("../../resident_atlas_s6/data/cast.js"));
ok('all three mandated Resident targets are wired',['goth-girl','orc-warband','animatronic'].every((id)=>adapter.includes("'"+id+"'")));
ok('current Driver Graft owner is imported',adapter.includes("../kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js"));
ok('current Driver Graft mount API exists',driver.includes('export async function mountGraft'));
ok('current Driver contract contains graft-driver',(contract.pets||[]).some((p)=>p.id==='graft-driver'&&p.module==='Graft'));
ok('scene-patch schema is preserved',adapter.includes("const PATCH_SCHEMA='kfb.scene-patch.v1'"));
ok('scene patch source is pinned to current Resident Atlas',adapter.includes("10f661a542e2553b4d3433bfc5b45dfc1401e660"));
ok('patch validation resolves all ops before mutation',adapter.indexOf('const plan=validatePatch(p,resident)')<adapter.indexOf('for(const {n,op} of plan)'));
ok('missing mandated sources fail visibly',adapter.includes('SOURCE FAIL')&&adapter.includes('mandated source node(s) missing'));
ok('no fallback box geometry is introduced',!adapter.includes('BoxGeometry(')&&!adapter.includes('BoxBufferGeometry('));
ok('no second renderer is introduced',!adapter.includes('new THREE.WebGLRenderer'));
ok('shared editor exposes free scale mode',edit.includes("gizmo.setMode(m)")&&edit.includes("'scale'"));
ok('shared editor exposes support-aware Drop',edit.includes('drop()')&&edit.includes('ray.intersectObjects'));
ok('real Resident ids exist in current cast source',['goth-girl','orc-warband','animatronic'].every((id)=>cast.includes("residentId: '"+id+"'")));
ok('current Atlas exports the real vignette builder',atlas.includes('export async function buildVignette'));
ok('Save and Reload use localStorage scene patches',adapter.includes('localStorage.setItem')&&adapter.includes('reloadResident'));
ok('review probe exposes current owner and editor state',adapter.includes('window.__KFB_COHERENT')&&adapter.includes('actorOwnerSchema'));

ok('PoseRig owner and Stage mirror are byte-identical',poseOwner===poseMirror);
ok('PoseRig owner contains wrist/intermediate-bone chain fix',poseOwner.includes('OWNER FIX 2026-09-25')&&poseOwner.includes('getWorldPosition'));
ok('PoseRig exposes shared IK API',['ikChain(','effector(','solveIK(','chainReport('].every((s)=>poseOwner.includes(s)));
ok('canonical locomotion profile schema is present',locomotionProfiles.includes("export const SCHEMA = 'kfb.locomotion-profile-set/0.1'"));
ok('locomotion profile owner is ToolBox Motion',locomotionProfiles.includes('Owner: Animation Lab / ToolBox Motion'));
ok('locomotion module exposes consumer view without movement ownership',locomotionProfiles.includes('export function consumerView')&&locomotionProfiles.includes('NOT a movement controller'));
ok('measured locomotion consumer fixture schema',locomotionFixture.schema==='kfb.locomotion-profile-set/0.1#consumer'&&locomotionFixture.rigFamily==='Rig_Medium');
ok('consumer fixture carries core semantic roles',['idle','walk','walk.fast','run','sprint','backward','strafe.left','strafe.right','jump.start','jump.air','jump.land','crouch','sneak','crawl'].every((id)=>locomotionFixture.roles[id]));
ok('sprint fixture is source-backed Running_B',locomotionFixture.roles.sprint.clip==='Running_B'&&locomotionFixture.roles.sprint.sourceBacked===true);

console.log('STATIC PASS '+pass+'/'+pass);
