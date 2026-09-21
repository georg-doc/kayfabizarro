import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=(p)=>fs.readFileSync(new URL(p,root),'utf8');
const catalog=JSON.parse(read('data/rig-legacy-heads.v0.json'));
const seed=JSON.parse(read('data/rig-legacy-default.v0.json'));
const adapter=read('lib/legacy-eye-adapter.v1.js');
const app=read('legacy/app.js');
const html=read('legacy/index.html');

let pass=0,fail=0;
const ok=(cond,msg)=>{if(cond){pass++;console.log('PASS',msg)}else{fail++;console.error('FAIL',msg)}};

ok(catalog.schema==='kfb.eye-rig-actor-catalog/0.1-candidate','shared EyeRig actor catalog schema retained');
ok(catalog.rigClass==='Rig_Legacy','catalog is Rig_Legacy');
ok(catalog.headCount===17&&catalog.actors.length===17,'17 Legacy head identities');
ok(new Set(catalog.actors.map(a=>a.id)).size===17,'Legacy head ids unique');
ok(catalog.actors.filter(a=>a.kind==='embedded').length===4,'four embedded default heads');
ok(catalog.actors.filter(a=>a.kind==='asset').length===13,'12 alternate heads + skull are source assets');
ok(catalog.actors.every(a=>a.sourceRevision===catalog.source.partsRevision),'all heads pin exact Dungeon parts revision');
ok(catalog.actors.every(a=>a.rigClass==='Rig_Legacy'&&a.jointCount===6),'all heads bind to 6-bone Rig_Legacy family');
ok(Object.keys(catalog.bodies).length===4,'four exact Legacy body hosts');
ok(seed.schema==='kfb.eye-class-seed/0.1-candidate'&&seed.rigClass==='Rig_Legacy','shared class-seed schema retained');
ok(seed.authoringDefault===null,'no invented accepted Legacy class default');
ok(seed.measurementPolicy.visualApproval==='never automatic','automated Legacy fit never claims visual approval');
ok(adapter.includes("PROFILE_SCHEMA='kfb.eye-profile/0.1-candidate'"),'shared EyeProfile schema retained');
ok(adapter.includes('pet-eye-rig.v6.js')&&!adapter.includes('class EyeRig'),'existing EyeRig v6 reused, not rewritten');
ok(adapter.includes('eyeoval.v1.js'),'existing EyeOval reused');
ok(app.includes('44d595bc60259f4a74da7043df13582f1b5ccd89'),'browser-proven Legacy assembly/FaceHost runtime pinned');
ok(app.includes('source isolate required before EyeRig mount'),'source isolation is a hard precondition');
ok(app.includes('buildLegacyFaceHost')&&app.includes('measureLegacyEyeCandidates'),'LegacyFaceHost measurement reused');
ok(app.includes('setLegacySourceEyeVisibility')&&app.includes("measurement.status==='MEASURED_CANDIDATE'"),'source-eye hiding only follows measured candidate');
ok(app.includes('profile.evidence.eyeProfileVisuallyApproved')===false,'app does not hardcode visual approval');
ok(html.includes('Exact KayKit Dungeon 1.0 head source first'),'source-first rule visible');
ok(!app.includes('localStorage.clear'),'no shared storage destruction');
for(const f of ['legacy/app.js','lib/legacy-eye-adapter.v1.js']){
  try{new vm.SourceTextModule(read(f));ok(true,f+' module parses')}catch(e){console.error(e);ok(false,f+' module parses')}
}
console.log(`LEGACY_EYE_STATIC_RESULT ${pass}/${pass+fail} PASS`);
if(fail)process.exit(1);
