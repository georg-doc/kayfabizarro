import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=(p)=>fs.readFileSync(new URL(p,root),'utf8');
const catalog=JSON.parse(read('data/rig-legacy-heads.v0.json'));
const seed=JSON.parse(read('data/rig-legacy-default.v0.json'));
const persisted=JSON.parse(read('data/rig-legacy-auto.v1.json'));
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
ok(persisted.schema==='kfb.eye-profile-batch/0.2-candidate'&&persisted.rigClass==='Rig_Legacy','persisted batch uses shared batch schema');
ok(persisted.profiles.length===17,'17 persisted Legacy candidate profiles');
ok(persisted.evidence.measuredCount===16&&persisted.evidence.humanRequiredCount===1,'persisted classification is 16 measured + 1 human required');
ok(persisted.profiles.every(p=>p.evidence?.eyeProfileVisuallyApproved===false),'no persisted Legacy profile claims visual approval');
ok(persisted.profiles.find(p=>p.actorId==='skull')?.status==='HUMAN_REQUIRED_FALLBACK_CANDIDATE','Skull remains explicit manual-review fallback');
ok(adapter.includes("PROFILE_SCHEMA='kfb.eye-profile/0.1-candidate'"),'shared EyeProfile schema retained');
ok(adapter.includes('pet-eye-rig.v6.js')&&!adapter.includes('class EyeRig'),'existing EyeRig v6 reused, not rewritten');
ok(adapter.includes('eyeoval.v1.js'),'existing EyeOval reused');
ok(app.includes('44d595bc60259f4a74da7043df13582f1b5ccd89'),'browser-proven Legacy assembly/FaceHost runtime pinned');
ok(app.includes('rig-legacy-auto.v1.json')&&app.includes('mountPersisted:async'),'persisted Legacy profiles are loadable through the batch lane');
ok(app.includes('source isolate required before EyeRig mount'),'source isolation is a hard precondition');
ok(app.includes('buildLegacyFaceHost')&&app.includes('measureLegacyEyeCandidates'),'LegacyFaceHost measurement reused');
ok(app.includes('setLegacySourceEyeVisibility')&&app.includes("measurement.status==='MEASURED_CANDIDATE'"),'source-eye hiding only follows measured candidate');
ok(app.includes('profile.evidence.eyeProfileVisuallyApproved')===false,'app does not hardcode visual approval');
ok(html.includes('Exact KayKit Dungeon 1.0 head source first'),'source-first rule visible');
ok(html.includes('data-view="front"')&&html.includes('data-view="three-left"')&&html.includes('data-view="three-right"'),'Front + 3/4 review views present');
ok(html.includes('id="sourceEyesBtn"')&&app.includes('setLegacySourceEyeVisibility(state.headPart,state.sourceEyesVisible)'),'source-eye cleanup comparison control present');
ok(['dx','dy','ring','inset'].every(k=>html.includes(`data-tune="${k}"`))&&app.includes('function applyTune'),'minimal placement tuning exposes X/Y/size/inset');
ok(['APPROVED','ADJUSTED_APPROVED','REJECTED'].every(s=>html.includes(`data-review="${s}"`))&&app.includes('function setReviewState'),'approve / adjusted approve / reject workflow present');
ok(app.includes("REVIEW_KEY='kfb.toolbox.eye-rig-legacy-review.v1'")&&app.includes('localStorage.setItem(REVIEW_KEY'),'review progress persists additively');
ok(app.includes("const profile=state.reviews[id]?.profile||state.persistedById.get(id)")&&app.includes('mountCandidate(id,{profileOverride:profile})'),'head selection remounts reviewed or persisted profile');
ok(adapter.includes('setAnchor(patch){rig.setAnchor(patch);}')&&adapter.includes('setEye(patch){rig.setEye(patch);}'),'adapter forwards tuning to existing EyeRig v6');
ok(html.includes('id="exportReviewBtn"')&&app.includes("eye-rig-legacy.review.json"),'review JSON export present');
ok(!app.includes('localStorage.clear'),'no shared storage destruction');
for(const f of ['legacy/app.js','lib/legacy-eye-adapter.v1.js']){
  try{new vm.SourceTextModule(read(f));ok(true,f+' module parses')}catch(e){console.error(e);ok(false,f+' module parses')}
}
console.log(`LEGACY_EYE_STATIC_RESULT ${pass}/${pass+fail} PASS`);
if(fail)process.exit(1);
