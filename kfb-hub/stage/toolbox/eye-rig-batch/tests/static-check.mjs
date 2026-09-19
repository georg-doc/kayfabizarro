import fs from 'node:fs'; import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const files=['index.html','styles.css','app.js','lib/kaykit-eye-adapter.v1.js','lib/source-face-cleanup.v1.js','lib/medium-source-eye-cleanup.v1.js','data/gothgirl.seed.json','data/rig-medium-default.v0.json','data/rig-medium-actors.v0.json','data/rig-large-default.v0.json','data/rig-large-actors.v0.json','docs/SOURCE_AUDIT.md','docs/SOURCE_COMPONENT_IDENTITY_2026-09-19.md','docs/source-components-0-11.html','docs/QA_EYE_CALIBRATION_LOOP_2026-09-19.md','docs/BATCH_FEATURE_BACKLOG_2026-09-19.md','docs/RIG_LARGE_MONSTROSITY_CALIBRATION_2026-09-19.md'];
let pass=0, fail=0; const results=[];
function check(name,ok,detail=''){(ok?pass++:fail++);results.push({name,status:ok?'PASS':'FAIL',detail});}
for(const f of files)check(`file:${f}`,fs.existsSync(path.join(root,f)),fs.existsSync(path.join(root,f))?'present':'missing');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8'); const html=fs.readFileSync(path.join(root,'index.html'),'utf8'); const cleanup=fs.readFileSync(path.join(root,'lib/source-face-cleanup.v1.js'),'utf8'); const mediumCleanup=fs.readFileSync(path.join(root,'lib/medium-source-eye-cleanup.v1.js'),'utf8'); const adapter=fs.readFileSync(path.join(root,'lib/kaykit-eye-adapter.v1.js'),'utf8'); const seed=JSON.parse(fs.readFileSync(path.join(root,'data/gothgirl.seed.json'),'utf8')); const medium=JSON.parse(fs.readFileSync(path.join(root,'data/rig-medium-default.v0.json'),'utf8')); const actors=JSON.parse(fs.readFileSync(path.join(root,'data/rig-medium-actors.v0.json'),'utf8')); const large=JSON.parse(fs.readFileSync(path.join(root,'data/rig-large-default.v0.json'),'utf8')); const largeActors=JSON.parse(fs.readFileSync(path.join(root,'data/rig-large-actors.v0.json'),'utf8')); const identity=fs.readFileSync(path.join(root,'docs/SOURCE_COMPONENT_IDENTITY_2026-09-19.md'),'utf8'); const componentHtml=fs.readFileSync(path.join(root,'docs/source-components-0-11.html'),'utf8'); const qa=fs.readFileSync(path.join(root,'docs/QA_EYE_CALIBRATION_LOOP_2026-09-19.md'),'utf8'); const backlog=fs.readFileSync(path.join(root,'docs/BATCH_FEATURE_BACKLOG_2026-09-19.md'),'utf8'); const largeDoc=fs.readFileSync(path.join(root,'docs/RIG_LARGE_MONSTROSITY_CALIBRATION_2026-09-19.md'),'utf8');
check('one-localStorage-namespace',app.includes("kfb.toolbox.eye-rig-batch.v0"));
check('never-localStorage-clear',!app.includes('localStorage.clear'));
check('pinned-source-revision',(app.match(/5650b6c54d8789b20ea80abe857688173d506d3b/g)||[]).length>=1);
check('eye-update-render-loop',/state\.eyes\?\.update\(dt,camera\)/.test(app));
check('single-animation-mixer',(app.match(/new THREE\.AnimationMixer/g)||[]).length===1,`${(app.match(/new THREE\.AnimationMixer/g)||[]).length} constructors`);
check('cleanup-fail-closed',cleanup.includes("status: 'HUMAN_REQUIRED'")&&cleanup.includes('expectedConnectedComponents = 12'));
check('cleanup-reuses-donor',cleanup.includes('faceShells, buildStripped'));
check('no-source-GLB-write',!app.includes('GLTFExporter')&&!cleanup.includes('GLTFExporter'));
check('lashes-off',adapter.includes("length: 0")&&adapter.includes("density: 0"));
check('neutral-settle-before-ready',adapter.includes("applyExpression('neutral')")&&adapter.includes('for (let i = 0; i < 16; i++) rig.update(1 / 60)'));
check('six-expression-buttons',['neutral','happy','angry','sad','surprised','thinking'].every((x)=>html.includes(`data-expression="${x}"`)));
check('standard-camera-views',['front','three-left','three-right','side-left','side-right','face'].every((x)=>html.includes(`data-view="${x}"`)));
check('motion-regression-buttons',['Idle_A','Walking_A','Running_A','Jump_Full_Short'].every((x)=>html.includes(`data-motion="${x}"`)));
check('profile-import-preview',html.includes('importPreview')&&app.includes('Nothing has been applied yet'));
check('source-measured-explicit-candidate',html.includes('Use source-measured baseline')&&app.includes("$('#useMeasuredBtn')")&&app.includes("state.profile.status='AUTO_CANDIDATE'"));
check('source-component-isolation-diagnostic',html.includes('id="componentSelect"')&&html.includes('id="isolateComponentBtn"')&&cleanup.includes('setComponentIsolation')&&cleanup.includes('clearComponentIsolation')&&app.includes('wireComponentDiagnostic'));
check('current-source-eye-components-2-3',JSON.stringify(seed.sourceFace.eyeComponents)===JSON.stringify([2,3])&&cleanup.includes('eyeComponents = [2, 3]')&&cleanup.includes('eyeIdentityOk'));
check('source-component-identity-evidence',identity.includes('| 2 | eye')&&identity.includes('| 3 | eye')&&(componentHtml.match(/data-component=/g)||[]).length===12);
check('medium-seed-reference',medium.reference?.blob==='e87e6337a6db67096a9577335f36d60672aa389e'&&medium.reference?.actorId==='gothgirl');
check('medium-authoring-default-screenshot',
  medium.authoringDefault?.eye?.anchor?.dx===0.295 &&
  medium.authoringDefault?.eye?.anchor?.dy===0.045 &&
  medium.authoringDefault?.eye?.anchor?.ring===0.153 &&
  medium.authoringDefault?.eye?.anchor?.track===0.15 &&
  medium.authoringDefault?.eye?.pupilSize===0.34 &&
  medium.authoringDefault?.eye?.inset===0.4 &&
  medium.authoringDefault?.eye?.converge===0.18);
check('measurement-suggestion-only',medium.measurementSuggestion?.policy==='EXPLICIT_SUGGESTION_ONLY_NEVER_AUTO_APPLY'&&!app.includes('calibrateRigMediumDefault'));
check('gothgirl-authoring-seed',seed.eye?.anchor?.dx===0.295&&seed.eye?.anchor?.dy===0.045&&seed.eye?.anchor?.ring===0.153&&seed.eye?.anchor?.track===0.15&&seed.eye?.pupilSize===0.34&&seed.eye?.inset===0.4&&seed.eye?.converge===0.18);
check('lids-face-base-darkened',seed.eye?.baseColor==='#e6cbc3'&&seed.eye?.lidColorMode==='face-base-darkened'&&adapter.includes('baseColor,')&&adapter.includes('setBaseColor(hex)'));
check('legacy-default-migration',app.includes('isLegacyUntunedProfile')&&app.includes('state.savedLegacyDefault')&&app.includes('applyAuthoringDefaultToProfile(state.profile'));
check('eyeoval-donor-reuse',adapter.includes('frizzlegraft-v1/eyeoval.v1.js')&&adapter.includes('attachEyeOval')&&adapter.includes('setOval(patch)')&&['ovalW','ovalH','ovalD','ovalTilt'].every((k)=>html.includes(`data-param="${k}"`)));
check('pupil-tracking-modes',['life','pointer','fixed'].every((k)=>html.includes(`data-tracking-mode="${k}"`))&&app.includes('function setTrackingMode')&&!html.includes('id="gazeFollowToggle"'));
check('persistent-batchbar',['batchImportBtn','batchExportCharacterBtn','batchExportBatchBtn','batchApplySelectedBtn','batchResetBtn','batchApproveBtn'].every((id)=>html.includes(`id="${id}"`)));
check('batch-import-export-v02',app.includes('kfb.eye-profile-batch/0.2-candidate')&&app.includes('rigClass:state.rigClass')&&app.includes('classDefault:clone(seed?.authoringDefault||null)')&&app.includes('selectedActorIds:ids')&&app.includes('profiles'));
check('inheritance-class-character-session',JSON.stringify(medium.inheritance?.order)===JSON.stringify(['rigClass','character','session'])&&app.includes("order:['rigClass','character','session']"));
check('deferred-feature-backlog',backlog.includes('top / bottom eye contour')&&backlog.includes('Mouth Batch')&&backlog.includes('Vehicle EyeRig')&&backlog.includes('headlight'));
check('corrected-cleanup-status-accepted',app.includes("'SOURCE_IDENTITY_VERIFIED_AUTO_CANDIDATE'"));
check('qa-four-key-views',html.includes('id="qaCaptureBtn"')&&app.includes("['front','three-left','three-right','side-right']")&&app.includes("-qa-front-3q-side.png")&&app.includes("state.currentActorId||'actor'")&&qa.includes('Front')&&qa.includes('¾ L')&&qa.includes('¾ R')&&qa.includes('Side'));
check('medium-actor-catalog-27',actors.actorCount===27&&actors.actors?.length===27);
check('medium-actor-catalog-unique',new Set(actors.actors.map((a)=>a.id)).size===27);
check('medium-actor-catalog-rig-boundary',actors.actors.every((a)=>a.rigClass==='Rig_Medium'&&a.jointCount===23));
check('medium-actor-catalog-diverse',['gothgirl','clown','farmer-b','lorekeeper','skeleton-warrior','magical-girl','driver','mannequin-medium'].every((id)=>actors.actors.some((a)=>a.id===id)));
check('medium-actor-gothgirl-exact-cleanup',actors.actors.find((a)=>a.id==='gothgirl')?.cleanup?.mode==='verified-components');
check('medium-generic-cleanup-donor',mediumCleanup.includes('donoreyes.v1.js')&&mediumCleanup.includes('findDonorEyes')&&mediumCleanup.includes('stripDonorEyes'));
check('medium-generic-cleanup-fail-closed',mediumCleanup.includes("status:'HUMAN_REQUIRED'")&&mediumCleanup.includes('no head-named indexed skinned mesh')&&mediumCleanup.includes('no mirrored front eye pair'));
check('dynamic-actor-loader',app.includes('async function loadActor')&&app.includes('actorUrl(actor)')&&app.includes('prepareMediumActorCleanup'));
check('shared-medium-motion-owner',app.includes('ANIM_PIN')&&app.includes('KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/')&&(app.match(/new THREE\.AnimationMixer/g)||[]).length===1);
check('per-actor-profile-store',app.includes('profiles:state.profiles')&&app.includes('function ensureProfile')&&app.includes('state.profiles[actor.id]'));
check('review-state-model',['UNREVIEWED','ADJUSTED','APPROVED','ADJUSTED_APPROVED','UNSUPPORTED','REJECTED'].every((x)=>app.includes(x)));
check('roster-filters',['all','unreviewed','adjusted','unsupported'].every((x)=>html.includes(`data-roster-filter="${x}"`))&&app.includes('function renderRoster'));
check('next-unreviewed',html.includes('id="nextUnreviewedBtn"')&&app.includes('function nextUnreviewed')&&app.includes("$('#nextUnreviewedBtn').onclick"));
check('actor-selection-list',html.includes('id="actorList"')&&app.includes('data-select-id')&&app.includes('selectedActors'));
check('dynamic-source-audit',['sourceActor','sourceActorName','sourcePath','sourceCleanup','actorTechHint'].every((id)=>html.includes(`id="${id}"`)));
check('large-actor-catalog-4',largeActors.actorCount===4&&largeActors.actors?.length===4);
check('large-actor-catalog-unique',new Set(largeActors.actors.map((a)=>a.id)).size===4);
check('large-actor-catalog-rig-boundary',largeActors.actors.every((a)=>a.rigClass==='Rig_Large'&&a.jointCount===23));
check('large-actor-catalog-known-set',['monstrosity','black-knight','demon-lord','orc-brute'].every((id)=>largeActors.actors.some((a)=>a.id===id)));
check('large-actor-blobs-pinned',largeActors.actors.every((a)=>typeof a.blob==='string'&&a.blob.length===40));
check('large-calibration-not-default',large.status==='CALIBRATION_START_ONLY'&&large.authoringDefault===null&&large.reference?.actorId==='monstrosity');
check('large-calibration-start-present',large.calibrationStart?.eye?.anchor?.dx===0.295&&large.calibrationStart?.eye?.anchor?.ring===0.153);
check('large-explicit-default-promotion',large.promotion?.action==='Set as Large default'&&large.promotion?.policy==='human explicit only'&&app.includes('function promoteCurrentAsClassDefault'));
check('rig-class-switch-ui',html.includes('data-rig-class="Rig_Medium"')&&html.includes('data-rig-class="Rig_Large"')&&html.includes('id="rigClassTitle"'));
check('large-default-button',html.includes('id="promoteClassDefaultBtn"')&&app.includes("currentActorId!=='monstrosity'"));
check('per-class-catalog-config',app.includes("Rig_Medium:{")&&app.includes("Rig_Large:{")&&app.includes("catalogUrl:'./data/rig-large-actors.v0.json'"));
check('large-motion-owner',app.includes('Rig_Large/Rig_Large_General.glb')&&app.includes('Rig_Large/Rig_Large_MovementBasic.glb'));
check('large-required-clips-honest',app.includes("requiredClips:['Idle_A','Walking_A','Running_A']")&&!app.includes("Rig_Large:{\n    label:'Large',\n    catalogUrl:'./data/rig-large-actors.v0.json',\n    seedUrl:'./data/rig-large-default.v0.json',\n    defaultActor:'monstrosity',\n    generalUrl:ANIM_CDN+'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Large/Rig_Large_General.glb',\n    moveUrl:ANIM_CDN+'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Large/Rig_Large_MovementBasic.glb',\n    requiredClips:['Idle_A','Walking_A','Running_A','Jump_Full_Short']"));
check('class-switch-runtime',app.includes('async function switchRigClass')&&app.includes('state.catalog=state.catalogs[rigClass]||[]')&&app.includes('await loadMotion(state.loader)'));
check('per-class-persistence',app.includes('classDefaults')&&app.includes('selectedByClass')&&app.includes('currentActorByClass')&&app.includes('currentRigClass'));
check('large-batch-no-fake-default',app.includes('classDefault:clone(seed?.authoringDefault||null)')&&app.includes('calibrationStart:clone(seed?.calibrationStart||null)'));
check('large-doc',largeDoc.includes('Monstrosity')&&largeDoc.includes('Black Knight')&&largeDoc.includes('Demon Lord')&&largeDoc.includes('Orc Brute')&&largeDoc.includes('Set as Large default'));
check('no-global-schema-promotion',!app.includes('kfb.eye-profile/1'));
console.log(JSON.stringify({pass,fail,total:pass+fail,results},null,2)); if(fail)process.exit(1);
