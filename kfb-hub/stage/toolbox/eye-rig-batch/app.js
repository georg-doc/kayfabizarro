import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mountKayKitEyes } from './lib/kaykit-eye-adapter.v1.js';
import { prepareVerifiedGothGirlCleanup } from './lib/source-face-cleanup.v1.js';

const PIN = '5650b6c54d8789b20ea80abe857688173d506d3b';
const CDN = `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@${PIN}/`;
const ACTOR_URL = CDN + 'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb';
const GENERAL_URL = CDN + 'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/Animations/gltf/Rig_Medium/Rig_Medium_General.glb';
const MOVE_URL = CDN + 'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb';
const CONTRACT_URL = CDN + 'tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json';
const STORAGE_KEY = 'kfb.toolbox.eye-rig-batch.v0';
const MEDIUM_SEED_URL = './data/rig-medium-default.v0.json';
const $ = (q) => document.querySelector(q);
const $$ = (q) => [...document.querySelectorAll(q)];
const clone = (v) => JSON.parse(JSON.stringify(v));
const logLines = [];
let bootError = null;

const state = {
  seed: null, mediumSeed: null, profile: null, approved: null, pendingImport: null,
  figure: null, stageRoot: null, cleanup: null, eyes: null, mixer: null,
  componentDiagnosticRestore: null, qaLast: null, savedLegacyDefault: false,
  selectedActors: new Set(['gothgirl']), trackingMode: 'life', fixedGaze: [0,0],
  clips: new Map(), currentAction: null, currentMotion: 'bind', currentView: 'front',
  expression: 'neutral', sourceReady: false, cleanupReady: false, hostReady: false, eyeReady: false, motionReady: false
};

function log(msg) {
  const line = `${new Date().toISOString().slice(11, 19)}  ${msg}`;
  logLines.push(line); if (logLines.length > 80) logLines.shift();
  console.log('[EyeRigBatch]', msg);
  renderReport();
}
function setBadge(el, text, kind) { el.textContent = text; el.className = `badge ${kind}`; }
function gate(id, status) { const el = $(id); el.className = `gate ${status}`; }
function sourceRef() { return { repo:'georg-doc/kayfabizarro', path:state.profile.source.path, revision:PIN }; }
function readSaved() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; } }
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile: state.profile, approved: state.approved, classDefault: state.mediumSeed?.authoringDefault || null, selectedActors:[...state.selectedActors] })); }
function value(v, digits=3) { return Number(v).toFixed(digits).replace(/0+$/,'').replace(/\.$/,''); }
function near(a,b,eps=1e-6){ return Number.isFinite(+a) && Math.abs(+a-b)<=eps; }
function isLegacyUntunedProfile(p) {
  return p?.actorId==='gothgirl' && p?.status==='AUTO_CANDIDATE' &&
    near(p?.eye?.anchor?.ring,0.30) && near(p?.eye?.pupilSize,0.50) && !p?.eye?.baseColor;
}
function classEyeDefault() {
  return clone(state.mediumSeed?.authoringDefault?.eye || state.seed?.eye || {});
}
function applyAuthoringDefaultToProfile(profile=state.profile, { markSession=true }={}) {
  if (!profile) return null;
  const d=classEyeDefault(), actorBase=profile.eye?.baseColor || profile.sourceFace?.faceColor || state.seed?.sourceFace?.faceColor;
  profile.eye={
    ...(profile.eye||{}),
    anchor:{...(profile.eye?.anchor||{}),...(d.anchor||{})},
    pupilStyle:d.pupilStyle || profile.eye?.pupilStyle || 'matte-cute',
    pupilSize:d.pupilSize ?? profile.eye?.pupilSize ?? 0.34,
    gloss:d.gloss ?? profile.eye?.gloss ?? 0.1,
    inset:d.inset ?? profile.eye?.inset ?? 0,
    lidFit:d.lidFit ?? profile.eye?.lidFit ?? 0.9,
    converge:d.converge ?? profile.eye?.converge ?? 0,
    splay:d.splay ?? profile.eye?.splay ?? 0,
    trackingMode:d.trackingMode || 'life',
    fixedGaze:clone(d.fixedGaze || [0,0]),
    oval:clone(d.oval || {w:1,h:1,d:1,tilt:0}),
    baseColor:actorBase,
    lidColorMode:d.lidColorMode || 'face-base-darkened'
  };
  profile.inheritance={
    order:['rigClass','character','session'],
    rigClass:profile.rigClass || 'Rig_Medium',
    classSeed:'data/rig-medium-default.v0.json',
    characterId:profile.actorId,
    sessionAdjusted:!!markSession
  };
  profile.status='AUTO_CANDIDATE';
  return profile;
}
function recordMeasuredSuggestion(measured) {
  const m=measured?.anchorCandidate;
  if(!m) return null;
  state.seed.calibration={...(state.seed.calibration||{}),measuredSuggestion:clone(m),sourceMeasuredPlacementPolicy:'EXPLICIT_SUGGESTION_ONLY_NEVER_AUTO_APPLY'};
  const d=classEyeDefault();
  const hint=$('#mediumSeedHint');
  if(hint) hint.textContent=`Rig_Medium default · dx ${value(d.anchor?.dx)} · dy ${value(d.anchor?.dy)} · ring ${value(d.anchor?.ring)} · pupil ${value(d.pupilSize)} · measured source kept as suggestion`;
  log(`source measurement retained as suggestion · dx ${value(m.dx)} · dy ${value(m.dy)} · ring ${value(m.ring)} · authoring default unchanged`);
  return clone(m);
}
function setTrackingMode(mode, persist=true) {
  mode=['life','pointer','fixed'].includes(mode) ? mode : 'life';
  state.trackingMode=mode;
  if(state.profile?.eye) state.profile.eye.trackingMode=mode;
  $$('#trackingModes [data-tracking-mode]').forEach((b)=>b.classList.toggle('active',b.dataset.trackingMode===mode));
  if(state.eyes){
    if(mode==='life') state.eyes.setGazeFollow(false);
    else {
      state.eyes.setGazeFollow(true);
      if(mode==='fixed'){
        const g=state.profile?.eye?.fixedGaze || state.fixedGaze || [0,0];
        state.fixedGaze=clone(g); state.eyes.setPointer(g[0],g[1]);
      }
    }
  }
  if(persist) save();
}
function updateBatchUi() {
  const selected=state.selectedActors.size;
  const el=$('#batchSelectionStatus'); if(el) el.textContent=`${selected} selected · Rig_Medium · ${state.profile?.actorId || 'loading'}`;
  const btn=$('#batchApplySelectedBtn'); if(btn) btn.disabled=selected===0;
}

function profileFromRig() {
  if (!state.eyes) return state.profile;
  const r = state.eyes.rig, report=state.eyes.report(), oldEye=state.profile.eye || {};
  state.profile.faceHost = {
    status:'OK', headBone:state.eyes.faceHost.report.head, headSize:clone(state.eyes.faceHost.report.headSize), facingSource:state.eyes.faceHost.report.facing
  };
  state.profile.sourceFace = { ...state.profile.sourceFace, ...clone(state.cleanup.report), connectedComponents: state.cleanup.report.connectedComponents };
  state.profile.eye = {
    anchor: clone(r.anchor), pupilStyle:r.pupilStyle, pupilSize:r.pupilSize, gloss:r.gloss,
    inset:r.inset, lidFit:r.lidFit, converge:r.converge, splay:r.splay,
    baseColor: report.controls.baseColor, lidColorMode: oldEye.lidColorMode || 'face-base-darkened',
    oval: clone(report.controls.oval || oldEye.oval || {w:1,h:1,d:1,tilt:0}),
    trackingMode: state.trackingMode || oldEye.trackingMode || 'life',
    fixedGaze: clone(state.fixedGaze || oldEye.fixedGaze || [0,0])
  };
  state.profile.blink = clone(r.blink);
  state.profile.life = clone(r.life);
  state.profile.kinetics = { enabled:r.kinetics.enabled, gain:r.kinetics.gain, ...clone(r._kinT || {a:0,c:0,j:0}) };
  state.profile.evidence = { ...state.profile.evidence, camera:state.currentView, motionClip:state.currentMotion, sourceEyeCleanupVisuallyAccepted:false, eyeProfileVisuallyApproved:state.profile.status === 'EYE_PROFILE_VISUALLY_APPROVED' || state.profile.status === 'ADJUSTED_APPROVED' };
  return state.profile;
}

function renderReport() {
  const chunks = [];
  if (state.cleanup?.report) chunks.push(`SOURCE FACE\n${JSON.stringify(state.cleanup.report, null, 2)}`);
  if (state.eyes) chunks.push(`\nFACE / EYE\n${JSON.stringify(state.eyes.report(), null, 2)}`);
  if (logLines.length) chunks.push(`\nLOG\n${logLines.slice(-8).join('\n')}`);
  $('#sourceReport').textContent = chunks.join('\n') || 'Waiting for source…';
  const on = ['sourceReady','cleanupReady','hostReady','eyeReady','motionReady'].filter((k)=>state[k]).length;
  $('#runtimeLine').textContent = bootError ? `FAIL · ${bootError.message}` : `${on}/5 technical gates · source ${PIN.slice(0,7)} · ${state.currentMotion} · ${state.currentView}`;
}

function setReviewStatus(status) {
  state.profile.status = status;
  if (status === 'EYE_PROFILE_VISUALLY_APPROVED' || status === 'ADJUSTED_APPROVED') {
    profileFromRig(); state.approved = clone(state.profile);
  }
  save();
  $('#reviewStatus').textContent = status;
  $('#reviewStatus').className = `badge ${status.includes('APPROVED') ? 'approved' : status === 'REJECTED' ? 'rejected' : 'candidate'}`;
  $('#actorStatusDot').className = `dot ${status.includes('APPROVED') ? 'approved' : status === 'REJECTED' ? 'rejected' : 'candidate'}`;
}

function bindUiFromProfile() {
  const e = state.profile.eye, a = e.anchor, oval=e.oval || {w:1,h:1,d:1,tilt:0};
  const values = { dx:a.dx, dy:a.dy, ring:a.ring, track:a.track, pupilSize:e.pupilSize, gloss:e.gloss, inset:e.inset, lidFit:e.lidFit, converge:e.converge, splay:e.splay,
    ovalW:oval.w, ovalH:oval.h, ovalD:oval.d, ovalTilt:oval.tilt,
    wander:state.profile.life.wander, tremor:state.profile.life.tremor, a:state.profile.kinetics.a||0, c:state.profile.kinetics.c||0, j:state.profile.kinetics.j||0 };
  for (const [k,v] of Object.entries(values)) {
    const input = $(`[data-param="${k}"]`); if (input) input.value = v;
    const out = $(`[data-out="${k}"]`); if (out) out.value = value(v);
  }
  $('#lifeToggle').checked = !!state.profile.life.on;
  $('#kineticsToggle').checked = !!state.profile.kinetics.enabled;
  $('#cleanupToggle').checked = state.cleanup ? state.cleanup.active : true;
  $('#eyeRigToggle').checked = state.eyes ? state.eyes.visible : true;
  $('#matteBtn').classList.toggle('active', e.pupilStyle !== 'glossy-googly');
  $('#googlyBtn').classList.toggle('active', e.pupilStyle === 'glossy-googly');
  const select=$('#actorSelectToggle'); if(select) select.checked=state.selectedActors.has(state.profile.actorId);
  state.fixedGaze=clone(e.fixedGaze || [0,0]);
  setTrackingMode(e.trackingMode || 'life', false);
  updateBatchUi();
  setReviewStatus(state.profile.status || 'AUTO_CANDIDATE');
}

function applyProfileToRig(profile) {
  if (!state.eyes) return;
  const e = profile.eye || {}, a = e.anchor || {};
  if(e.baseColor) state.eyes.setBaseColor(e.baseColor);
  state.eyes.setAnchor({dx:a.dx,dy:a.dy,ring:a.ring,track:a.track});
  state.eyes.setEye({pupilSize:e.pupilSize,gloss:e.gloss,inset:e.inset,lidFit:e.lidFit,converge:e.converge,splay:e.splay});
  state.eyes.setOval(e.oval || {w:1,h:1,d:1,tilt:0});
  state.eyes.setPupilStyle(e.pupilStyle || 'matte-cute');
  state.eyes.rig.setBlink(clone(profile.blink || {}));
  state.eyes.setLife(clone(profile.life || {}));
  state.eyes.setKinetics(clone(profile.kinetics || {}));
  state.fixedGaze=clone(e.fixedGaze || [0,0]);
  state.eyes.applyExpression(state.expression || 'neutral');
  state.eyes.setVisible($('#eyeRigToggle').checked);
  bindUiFromProfile();
  setTrackingMode(e.trackingMode || 'life', false);
  renderReport();
}

function validateProfile(p) {
  if (!p || p.schema !== 'kfb.eye-profile/0.1-candidate') throw new Error('schema mismatch');
  if (p.actorId !== state.seed.actorId) throw new Error('actorId mismatch');
  if (p.source?.revision !== state.seed.source.revision || p.source?.path !== state.seed.source.path) throw new Error('source revision/path mismatch');
  return p;
}
function validateImport(data) {
  if(data?.schema==='kfb.eye-profile/0.1-candidate') return {kind:'profile',data:validateProfile(data)};
  if(data?.schema==='kfb.eye-profile-batch/0.2-candidate'){
    if(data.rigClass!=='Rig_Medium') throw new Error('batch rigClass mismatch');
    if(!Array.isArray(data.profiles)) throw new Error('batch profiles missing');
    const current=data.profiles.find((p)=>p?.actorId===state.seed.actorId);
    if(current) validateProfile(current);
    return {kind:'batch',data};
  }
  throw new Error('unsupported import schema');
}

function downloadJson(name, data) {
  const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}

function wireProfileIo() {
  const exportCharacter=()=>{ profileFromRig(); downloadJson(`${state.profile.actorId}.eye-profile.json`, state.profile); };
  const exportBatch=()=>{
    profileFromRig();
    downloadJson('eye-rig-medium.batch.json',{
      schema:'kfb.eye-profile-batch/0.2-candidate',
      rigClass:'Rig_Medium',
      inheritanceOrder:['rigClass','character','session'],
      classDefault:clone(state.mediumSeed.authoringDefault),
      selectedActorIds:[...state.selectedActors],
      profiles:[clone(state.profile)]
    });
  };
  const resetCurrent=()=>{ state.profile=applyAuthoringDefaultToProfile(clone(state.seed),{markSession:false}); applyProfileToRig(state.profile); save(); log('reset to Rig_Medium authoring default + actor identity'); };
  $('#exportBtn').onclick=exportCharacter;
  $('#exportBatchBtn').onclick=exportBatch;
  $('#copyBtn').onclick=async()=>{ profileFromRig(); await navigator.clipboard?.writeText(JSON.stringify(state.profile,null,2)); log('profile copied'); };
  $('#importBtn').onclick=()=>$('#importInput').click();
  $('#batchImportBtn').onclick=()=>$('#importInput').click();
  $('#batchExportCharacterBtn').onclick=exportCharacter;
  $('#batchExportBatchBtn').onclick=exportBatch;
  $('#batchResetBtn').onclick=resetCurrent;
  $('#batchApproveBtn').onclick=()=>setReviewStatus('ADJUSTED_APPROVED');
  $('#batchApplySelectedBtn').onclick=()=>{
    if(!state.selectedActors.has(state.profile.actorId)) return;
    applyAuthoringDefaultToProfile(state.profile,{markSession:true});
    applyProfileToRig(state.profile); save(); log(`Rig_Medium authoring default applied to selected · ${[...state.selectedActors].join(', ')}`);
  };
  $('#actorSelectToggle').onchange=(e)=>{
    if(e.target.checked) state.selectedActors.add(state.profile.actorId); else state.selectedActors.delete(state.profile.actorId);
    updateBatchUi(); save();
  };
  $('#importInput').onchange=async(e)=>{
    try{
      const parsed=validateImport(JSON.parse(await e.target.files[0].text()));
      state.pendingImport=clone(parsed);
      $('#importPreview').hidden=false;
      $('#importPreviewTitle').textContent=parsed.kind==='batch' ? `Rig_Medium batch · ${parsed.data.profiles.length} profile(s)` : `${parsed.data.actorId} · ${parsed.data.status}`;
      $('#importPreviewText').textContent=parsed.kind==='batch'
        ? 'Validated batch import. Class default / selected actor list / matching current actor profile are still preview-only.'
        : `Validated ${parsed.data.schema}; source ${parsed.data.source.revision.slice(0,7)}. Nothing has been applied yet.`;
    }catch(err){ alert(`Import rejected: ${err.message}`); }
    e.target.value='';
  };
  $('#acceptImportBtn').onclick=()=>{
    if(!state.pendingImport) return;
    const imp=state.pendingImport; state.pendingImport=null; $('#importPreview').hidden=true;
    if(imp.kind==='profile'){
      state.profile=clone(imp.data);
    } else {
      if(imp.data.classDefault) state.mediumSeed.authoringDefault=clone(imp.data.classDefault);
      state.selectedActors=new Set(imp.data.selectedActorIds || ['gothgirl']);
      const current=imp.data.profiles.find((p)=>p.actorId===state.seed.actorId);
      state.profile=current ? clone(current) : applyAuthoringDefaultToProfile(clone(state.seed),{markSession:false});
    }
    applyProfileToRig(state.profile); save(); log(`validated ${imp.kind} import accepted`);
  };
  $('#cancelImportBtn').onclick=()=>{ state.pendingImport=null; $('#importPreview').hidden=true; };
  $('#resetSeedBtn').onclick=resetCurrent;
  $('#revertApprovedBtn').onclick=()=>{ if(!state.approved)return; state.profile=clone(state.approved); applyProfileToRig(state.profile); save(); log('reverted to last approved profile'); };
  $$('[data-review]').forEach((b)=>b.onclick=()=>setReviewStatus(b.dataset.review));
}

function configureRenderer() {
  const stage = $('#stage');
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false, preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  stage.prepend(renderer.domElement);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0xd8d2c8);
  const camera = new THREE.PerspectiveCamera(28, 1, .01, 100);
  const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor=.08; controls.target.set(0,1.35,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x6c6973,2.1));
  const key = new THREE.DirectionalLight(0xffffff,2.5); key.position.set(3.4,5.8,4.2); key.castShadow=true; scene.add(key);
  const fill = new THREE.DirectionalLight(0xffdeda,1.2); fill.position.set(-4,2.6,2.2); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xdde7ff,1.0); rim.position.set(1.5,3,-5); scene.add(rim);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(2.5,64), new THREE.ShadowMaterial({color:0x382f2a, opacity:.16, transparent:true})); ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; ground.position.y=.002; scene.add(ground);
  const stageRoot = new THREE.Group(); scene.add(stageRoot); state.stageRoot=stageRoot;
  const ro = new ResizeObserver(()=>{ const r=stage.getBoundingClientRect(); renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false); camera.aspect=Math.max(.1,r.width/Math.max(1,r.height)); camera.updateProjectionMatrix(); }); ro.observe(stage);
  return {renderer,scene,camera,controls,ro};
}

function normalizeActor(figure) {
  figure.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(figure), size=box.getSize(new THREE.Vector3());
  const scale = 2.65 / Math.max(.001, size.y);
  figure.scale.multiplyScalar(scale); figure.updateMatrixWorld(true);
  const b2 = new THREE.Box3().setFromObject(figure), center=b2.getCenter(new THREE.Vector3());
  figure.position.x -= center.x; figure.position.z -= center.z; figure.position.y -= b2.min.y;
  figure.updateMatrixWorld(true);
  return { sourceHeight:+size.y.toFixed(3), normalizedHeight:+new THREE.Box3().setFromObject(figure).getSize(new THREE.Vector3()).y.toFixed(3), scale:+scale.toFixed(5) };
}

function setView(name, camera, controls) {
  state.currentView=name; const t = new THREE.Vector3(0,1.42,0); let p;
  const R=5.25;
  if(name==='front') p=new THREE.Vector3(0,1.48,R);
  if(name==='three-left') p=new THREE.Vector3(-3.4,1.6,4.0);
  if(name==='three-right') p=new THREE.Vector3(3.4,1.6,4.0);
  if(name==='side-left') p=new THREE.Vector3(-R,1.5,0);
  if(name==='side-right') p=new THREE.Vector3(R,1.5,0);
  if(name==='face') { p=new THREE.Vector3(0,2.14,2.15); t.set(0,2.12,0); }
  camera.position.copy(p); controls.target.copy(t); controls.update(); $('#viewBadge').textContent=name.replace('-',' ');
  $$('.tool[data-view]').forEach((b)=>b.classList.toggle('active',b.dataset.view===name));
}

function poseBind() {
  state.mixer?.stopAllAction(); state.currentAction=null;
  const skels=new Set(); state.figure.traverse((n)=>{ if(n.isSkinnedMesh&&n.skeleton)skels.add(n.skeleton); }); skels.forEach((s)=>s.pose()); state.figure.updateMatrixWorld(true);
  state.currentMotion='bind'; $('#motionBadge').textContent='Bind / T Pose'; $('#motionStatus').textContent='1 mixer · bind pose';
  $$('.motion').forEach((b)=>b.classList.toggle('active',b.dataset.motion==='bind'));
}

function playMotion(name) {
  if(name==='bind') return poseBind();
  const clip=state.clips.get(name); if(!clip) { log(`motion missing: ${name}`); return; }
  const mixer=state.mixer; if(state.currentAction) state.currentAction.fadeOut(.15);
  const action=mixer.clipAction(clip,state.figure); action.reset(); action.enabled=true; action.setLoop(THREE.LoopRepeat,Infinity); action.fadeIn(.15).play(); state.currentAction=action; state.currentMotion=name;
  $('#motionBadge').textContent=name; $('#motionStatus').textContent=`1 mixer · ${name} · ${clip.tracks.length} tracks`;
  $$('.motion').forEach((b)=>b.classList.toggle('active',b.dataset.motion===name));
}

async function loadMotion(loader) {
  const [general,movement] = await Promise.all([loader.loadAsync(GENERAL_URL),loader.loadAsync(MOVE_URL)]);
  [...general.animations,...movement.animations].forEach((c)=>{ if(!state.clips.has(c.name)) state.clips.set(c.name,c); });
  const required=['Idle_A','Walking_A','Running_A','Jump_Full_Short'];
  state.motionReady=required.every((n)=>state.clips.has(n)); gate('#gateMotion',state.motionReady?'pass':'fail');
  $('#motionStatus').textContent=state.motionReady?`1 mixer · ${state.clips.size} clips loaded`:'required clips missing';
  log(`motion packs loaded · ${state.clips.size} unique clips · required ${state.motionReady?'OK':'MISSING'}`);
}

function wireComponentDiagnostic(camera, controls) {
  const select=$('#componentSelect'), isolateBtn=$('#isolateComponentBtn'), exitBtn=$('#exitComponentBtn'), hint=$('#componentHint');
  const components=state.cleanup?.report?.components || [];
  if(!select || !isolateBtn || !exitBtn || !hint || !components.length) return;

  select.innerHTML=components.map((c)=>`<option value="${c.component}">#${c.component} · ${c.triangles} tris</option>`).join('');
  select.disabled=false; isolateBtn.disabled=false;
  hint.textContent=`${components.length} measured head components · source-only diagnostic · no profile change`;

  const isolateSelected=()=>{
    const component=+select.value;
    if(!state.componentDiagnosticRestore){
      state.componentDiagnosticRestore={
        cleanup:!!state.cleanup.active,
        eyeRig:!!$('#eyeRigToggle').checked,
        hostDebug:!!$('#hostDebugToggle').checked,
        motion:state.currentMotion
      };
      poseBind();
      $('#cleanupToggle').checked=false; state.cleanup.apply(false);
      $('#eyeRigToggle').checked=false; state.eyes.setVisible(false);
      $('#hostDebugToggle').checked=false; $('#hostDebugToggle').dispatchEvent(new Event('change'));
      setView('front',camera,controls);
    }
    const detail=state.cleanup.setComponentIsolation(component);
    if(!detail) return;
    exitBtn.disabled=false;
    hint.textContent=`Component #${component} · ${detail.triangles} tris · source-only isolation · use Front / ¾ / Side`;
    renderReport();
  };

  isolateBtn.onclick=isolateSelected;
  select.onchange=()=>{ if(state.cleanup.isolatedComponent != null) isolateSelected(); };
  exitBtn.onclick=()=>{
    state.cleanup.clearComponentIsolation();
    const restore=state.componentDiagnosticRestore || {cleanup:true,eyeRig:true,hostDebug:false,motion:'bind'};
    $('#cleanupToggle').checked=!!restore.cleanup; state.cleanup.apply(!!restore.cleanup);
    $('#eyeRigToggle').checked=!!restore.eyeRig; state.eyes.setVisible(!!restore.eyeRig);
    $('#hostDebugToggle').checked=!!restore.hostDebug; $('#hostDebugToggle').dispatchEvent(new Event('change'));
    if(restore.motion && restore.motion!=='bind') playMotion(restore.motion); else poseBind();
    state.componentDiagnosticRestore=null;
    exitBtn.disabled=true;
    hint.textContent=`${components.length} measured head components · source-only diagnostic · no profile change`;
    renderReport();
  };
}

async function captureQaContactSheet(renderer,camera,controls) {
  const views=['front','three-left','three-right','side-right'];
  const prior=state.currentView;
  const tileW=800,tileH=500;
  const sheet=document.createElement('canvas'); sheet.width=tileW*2; sheet.height=tileH*2;
  const ctx=sheet.getContext('2d');
  for(let i=0;i<views.length;i++){
    const name=views[i]; setView(name,camera,controls); controls.update();
    renderer.render(window.__EYE_RIG_BATCH.scene,camera);
    const x=(i%2)*tileW,y=Math.floor(i/2)*tileH;
    ctx.drawImage(renderer.domElement,x,y,tileW,tileH);
    ctx.fillStyle='rgba(20,16,14,.72)'; ctx.fillRect(x+12,y+tileH-42,250,28);
    ctx.fillStyle='#fff'; ctx.font='18px system-ui,sans-serif';
    ctx.fillText(name.replaceAll('-',' '),x+22,y+tileH-22);
  }
  setView(prior,camera,controls); renderer.render(window.__EYE_RIG_BATCH.scene,camera);
  const controlsReport=state.eyes?.report()?.controls || {};
  state.qaLast={views:[...views],ring:controlsReport.anchor?.ring,pupilSize:controlsReport.pupilSize,baseColor:controlsReport.baseColor,motion:state.currentMotion,expression:state.expression};
  const a=document.createElement('a'); a.href=sheet.toDataURL('image/png'); a.download='gothgirl-qa-front-3q-side.png'; a.click();
  log(`QA contact sheet captured · ${views.join(' / ')} · ring ${value(state.qaLast.ring)} · pupil ${value(state.qaLast.pupilSize)}`);
  renderReport();
}

function wireRuntimeControls(camera,controls,renderer) {
  $$('.tool[data-view]').forEach((b)=> b.onclick=()=>setView(b.dataset.view,camera,controls));
  $$('.motion').forEach((b)=> b.onclick=()=>playMotion(b.dataset.motion));
  $('#cleanupToggle').onchange=(e)=>{ const on=state.cleanup.apply(e.target.checked); state.profile.sourceFace.status=on?'AUTO_CANDIDATE':'SOURCE_VISIBLE'; renderReport(); };
  $('#eyeRigToggle').onchange=(e)=>state.eyes.setVisible(e.target.checked);
  $('#hostDebugToggle').onchange=(e)=>{ const m=state.eyes.faceHost.box.material; m.opacity=e.target.checked?.16:0; m.wireframe=!!e.target.checked; m.color?.set(0xc93a36); m.depthTest=!e.target.checked; state.eyes.faceHost.box.renderOrder=e.target.checked?998:0; };
  $('#stage').onpointermove=(e)=>{ if(state.trackingMode!=='pointer')return; const r=e.currentTarget.getBoundingClientRect(); const nx=((e.clientX-r.left)/r.width)*2-1, ny=-(((e.clientY-r.top)/r.height)*2-1); state.eyes.setPointer(nx,ny); };
  $('#blinkBtn').onclick=()=>state.eyes.blinkNow();
  $$('.expr').forEach((b)=>b.onclick=()=>{ state.expression=b.dataset.expression; state.eyes.applyExpression(state.expression); $$('.expr').forEach((x)=>x.classList.toggle('active',x===b)); });
  $$('#trackingModes [data-tracking-mode]').forEach((b)=>b.onclick=()=>setTrackingMode(b.dataset.trackingMode));
  $$('.gaze-buttons .seg').forEach((b)=>b.onclick=()=>{ const [x,y]=b.dataset.gaze.split(',').map(Number); state.fixedGaze=[x,y]; state.profile.eye.fixedGaze=[x,y]; setTrackingMode('fixed'); state.eyes.setPointer(x,y); });
  $('#matteBtn').onclick=()=>{ state.profile.eye.pupilStyle='matte-cute'; state.eyes.setPupilStyle('matte-cute'); bindUiFromProfile(); };
  $('#googlyBtn').onclick=()=>{ state.profile.eye.pupilStyle='glossy-googly'; state.eyes.setPupilStyle('glossy-googly'); bindUiFromProfile(); };
  $('#lifeToggle').onchange=(e)=>{ state.profile.life.on=e.target.checked; state.eyes.setLife({on:e.target.checked}); };
  $('#kineticsToggle').onchange=(e)=>{ state.profile.kinetics.enabled=e.target.checked; state.eyes.setKinetics({enabled:e.target.checked}); };
  $$('[data-param]').forEach((input)=> input.oninput=()=>{
    const k=input.dataset.param, v=+input.value; const out=$(`[data-out="${k}"]`); if(out)out.value=value(v);
    if(['dx','dy','ring','track'].includes(k)){state.profile.eye.anchor[k]=v; state.eyes.setAnchor({[k]:v});}
    else if(['pupilSize','gloss','inset','lidFit','converge','splay'].includes(k)){state.profile.eye[k]=v; state.eyes.setEye({[k]:v});}
    else if(['ovalW','ovalH','ovalD','ovalTilt'].includes(k)){
      const map={ovalW:'w',ovalH:'h',ovalD:'d',ovalTilt:'tilt'}, ok=map[k];
      state.profile.eye.oval={...(state.profile.eye.oval||{w:1,h:1,d:1,tilt:0}),[ok]:v}; state.eyes.setOval({[ok]:v});
    }
    else if(['wander','tremor'].includes(k)){state.profile.life[k]=v; state.eyes.setLife({[k]:v});}
    else if(['a','c','j'].includes(k)){state.profile.kinetics[k]=v; state.eyes.setKinetics({[k]:v});}
    if(state.profile.status==='EYE_PROFILE_VISUALLY_APPROVED'||state.profile.status==='ADJUSTED_APPROVED')setReviewStatus('AUTO_CANDIDATE'); else save();
  });
  const measured=state.cleanup?.report?.sourceMeasuredSeed?.anchorCandidate;
  const measuredBtn=$('#useMeasuredBtn'), measuredHint=$('#measuredSeedHint');
  if(measuredBtn&&measuredHint&&measured){
    for(const k of ['dx','dy','ring']){
      const input=$(`[data-param="${k}"]`), v=+measured[k];
      if(input&&Number.isFinite(v)){ if(v<+input.min)input.min=String(v); if(v>+input.max)input.max=String(v); }
    }
    measuredHint.textContent=`Measured source suggestion · dx ${value(measured.dx)} · dy ${value(measured.dy)} · ring ${value(measured.ring)} · never auto-applied`;
    measuredBtn.disabled=false;
    measuredBtn.onclick=()=>{
      state.profile.eye.anchor={...state.profile.eye.anchor,dx:measured.dx,dy:measured.dy,ring:measured.ring};
      state.profile.status='AUTO_CANDIDATE';
      state.eyes.setAnchor({dx:measured.dx,dy:measured.dy,ring:measured.ring});
      bindUiFromProfile(); save(); renderReport();
      log(`source-measured suggestion applied explicitly · dx ${measured.dx} · dy ${measured.dy} · ring ${measured.ring}`);
    };
  }
  $('#captureBtn').onclick=()=>{ renderer.render(window.__EYE_RIG_BATCH.scene,camera); const a=document.createElement('a'); a.href=renderer.domElement.toDataURL('image/png'); a.download=`gothgirl-${state.currentView}-${state.currentMotion}.png`; a.click(); };
  $('#qaCaptureBtn').onclick=()=>captureQaContactSheet(renderer,camera,controls);
}

async function boot() {
  const [seed,mediumSeed] = await Promise.all([
    fetch('./data/gothgirl.seed.json').then((r)=>{if(!r.ok)throw new Error(`seed ${r.status}`);return r.json();}),
    fetch(MEDIUM_SEED_URL).then((r)=>{if(!r.ok)throw new Error(`medium seed ${r.status}`);return r.json();})
  ]);
  state.seed=seed; state.mediumSeed=mediumSeed;
  const saved=readSaved();
  if(saved?.classDefault) state.mediumSeed.authoringDefault=clone(saved.classDefault);
  state.selectedActors=new Set(saved?.selectedActors?.length ? saved.selectedActors : ['gothgirl']);
  state.savedLegacyDefault=isLegacyUntunedProfile(saved?.profile);
  state.profile = saved?.profile ? validateProfile(saved.profile) : clone(seed);
  state.approved=saved?.approved||null;
  if(state.savedLegacyDefault) applyAuthoringDefaultToProfile(state.profile,{markSession:false});
  if(!state.profile.eye.baseColor){
    state.profile.eye.baseColor=seed.sourceFace.faceColor || mediumSeed.reference.actorFaceColor;
    state.profile.eye.lidColorMode=mediumSeed.authoringDefault?.eye?.lidColorMode || 'face-base-darkened';
  }
  state.profile.eye.oval=clone(state.profile.eye.oval || mediumSeed.authoringDefault?.eye?.oval || {w:1,h:1,d:1,tilt:0});
  state.profile.eye.trackingMode=state.profile.eye.trackingMode || mediumSeed.authoringDefault?.eye?.trackingMode || 'life';
  state.profile.eye.fixedGaze=clone(state.profile.eye.fixedGaze || [0,0]);
  state.trackingMode=state.profile.eye.trackingMode; state.fixedGaze=clone(state.profile.eye.fixedGaze);
  const contract=await fetch(CONTRACT_URL).then((r)=>{if(!r.ok)throw new Error(`contract ${r.status}`);return r.json();});
  const {renderer,scene,camera,controls,ro}=configureRenderer();
  window.__EYE_RIG_BATCH={state,scene,camera,controls,renderer,logLines,report:()=>({profile:profileFromRig(),cleanup:state.cleanup?.report,eyes:state.eyes?.report(),qa:state.qaLast,mediumSeed:state.mediumSeed,selectedActors:[...state.selectedActors],clips:[...state.clips.keys()],gates:{source:state.sourceReady,cleanup:state.cleanupReady,host:state.hostReady,eye:state.eyeReady,motion:state.motionReady},error:bootError?.message||null})};
  const loader=new GLTFLoader();
  const gltf=await loader.loadAsync(ACTOR_URL); const figure=gltf.scene; state.figure=figure; state.stageRoot.add(figure);
  const norm=normalizeActor(figure); figure.visible=false; state.sourceReady=true; gate('#gateSource','pass'); log(`GothGirl source loaded · ${norm.sourceHeight} → ${norm.normalizedHeight} high · 1 figure`);
  const cleanup=prepareVerifiedGothGirlCleanup({figure,preferredHeadMesh:seed.sourceFace.headMesh,expectedConnectedComponents:seed.sourceFace.expectedConnectedComponents,eyeComponents:seed.sourceFace.eyeComponents,log}); state.cleanup=cleanup;
  state.cleanupReady=['AUTO_CANDIDATE','SOURCE_IDENTITY_VERIFIED_AUTO_CANDIDATE'].includes(cleanup.status); gate('#gateCleanup',state.cleanupReady?'pass':'fail'); if(state.cleanupReady)cleanup.apply(true);
  state.mixer=new THREE.AnimationMixer(figure);
  const eyes=await mountKayKitEyes({THREE,figure,sourceRef:sourceRef(),profile:state.profile,expressionContract:contract,camera,log}); state.eyes=eyes;
  const measured=cleanup.measureOnFaceHost?.(eyes.faceHost); recordMeasuredSuggestion(measured);
  state.hostReady=eyes.faceHost.status==='OK'; state.eyeReady=!!eyes.eyeFrame(); gate('#gateHost',state.hostReady?'pass':'fail'); gate('#gateEye',state.eyeReady?'pass':'fail');
  figure.visible=true; bindUiFromProfile(); wireProfileIo(); wireRuntimeControls(camera,controls,renderer); wireComponentDiagnostic(camera,controls); setView('front',camera,controls); poseBind();
  await loadMotion(loader);
  $('#loadingCard').remove(); setBadge($('#bootBadge'),'READY',state.sourceReady&&state.cleanupReady&&state.hostReady&&state.eyeReady&&state.motionReady?'pass':'candidate');
  let last=performance.now(); function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now; state.mixer?.update(dt); state.eyes?.update(dt,camera); controls.update(); renderer.render(scene,camera); requestAnimationFrame(frame);} requestAnimationFrame(frame);
  renderReport();
}

boot().catch((err)=>{
  bootError=err; console.error(err); setBadge($('#bootBadge'),'FAIL','fail'); $('#loadingDetail').textContent=err.message; gate('#gateSource',state.sourceReady?'pass':'fail'); renderReport(); window.__EYE_RIG_BATCH={state,error:err,report:()=>({error:err.message,gates:{source:state.sourceReady,cleanup:state.cleanupReady,host:state.hostReady,eye:state.eyeReady,motion:state.motionReady}})};
});
