import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mountKayKitEyes } from './lib/kaykit-eye-adapter.v1.js';
import { prepareMediumActorCleanup } from './lib/medium-source-eye-cleanup.v1.js';

const DONOR_PIN = '5650b6c54d8789b20ea80abe857688173d506d3b';
const DONOR_CDN = `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@${DONOR_PIN}/`;
const ANIM_PIN = 'aa16a777a970f23d3f11fb3c23dc40718b04fa88';
const ANIM_CDN = `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@${ANIM_PIN}/`;
const CLASS_CONFIG = {
  Rig_Medium:{
    label:'Medium',
    catalogUrl:'./data/rig-medium-actors.v0.json',
    seedUrl:'./data/rig-medium-default.v0.json',
    defaultActor:'gothgirl',
    generalUrl:ANIM_CDN+'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_General.glb',
    moveUrl:ANIM_CDN+'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb',
    requiredClips:['Idle_A','Walking_A','Running_A','Jump_Full_Short']
  },
  Rig_Large:{
    label:'Large',
    catalogUrl:'./data/rig-large-actors.v0.json',
    seedUrl:'./data/rig-large-default.v0.json',
    defaultActor:'monstrosity',
    generalUrl:ANIM_CDN+'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Large/Rig_Large_General.glb',
    moveUrl:ANIM_CDN+'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Large/Rig_Large_MovementBasic.glb',
    requiredClips:['Idle_A','Walking_A','Running_A']
  }
};
const CONTRACT_URL = DONOR_CDN + 'tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json';
function actorUrl(actor){ return encodeURI(`https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@${actor.revision}/${actor.path}`); }
function classConfig(rigClass=state.rigClass){ return CLASS_CONFIG[rigClass] || CLASS_CONFIG.Rig_Medium; }
const STORAGE_KEY = 'kfb.toolbox.eye-rig-batch.v0';
const $ = (q) => document.querySelector(q);
const $$ = (q) => [...document.querySelectorAll(q)];
const clone = (v) => JSON.parse(JSON.stringify(v));
const logLines = [];
let bootError = null;

const state = {
  seed:null, classSeeds:{}, catalogs:{}, rigClass:'Rig_Medium', catalog:[],
  profile:null, profiles:{}, approvedProfiles:{}, pendingImport:null,
  currentActor:null, currentActorId:null, currentActorByClass:{}, rosterFilter:'all', switching:false, loader:null,
  figure:null, stageRoot:null, cleanup:null, eyes:null, mixer:null,
  componentDiagnosticRestore:null, qaLast:null, savedLegacyDefault:false,
  selectedByClass:{Rig_Medium:new Set(['gothgirl']),Rig_Large:new Set(['monstrosity'])},
  selectedActors:new Set(['gothgirl']), trackingMode:'life', fixedGaze:[0,0],
  clips:new Map(), currentAction:null, currentMotion:'bind', currentView:'front',
  expression:'neutral', sourceReady:false, cleanupReady:false, hostReady:false, eyeReady:false, motionReady:false
};

function log(msg) {
  const line = `${new Date().toISOString().slice(11, 19)}  ${msg}`;
  logLines.push(line); if (logLines.length > 80) logLines.shift();
  console.log('[EyeRigBatch]', msg);
  renderReport();
}
function setBadge(el, text, kind) { el.textContent = text; el.className = `badge ${kind}`; }
function gate(id, status) { const el = $(id); el.className = `gate ${status}`; }
function sourceRef() {
  return { repo:'georg-doc/kayfabizarro', path:state.currentActor?.path || state.profile?.source?.path, revision:state.currentActor?.revision || state.profile?.source?.revision };
}
function readSaved() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; } }
function save() {
  if(state.profile?.actorId) state.profiles[state.profile.actorId]=clone(state.profile);
  state.selectedByClass[state.rigClass]=state.selectedActors;
  const classDefaults={};
  for(const [k,v] of Object.entries(state.classSeeds)) classDefaults[k]=v?.authoringDefault||null;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    profiles:state.profiles,
    approvedProfiles:state.approvedProfiles,
    classDefaults,
    selectedByClass:Object.fromEntries(Object.entries(state.selectedByClass).map(([k,v])=>[k,[...v]])),
    currentRigClass:state.rigClass,
    currentActorByClass:state.currentActorByClass,
    rosterFilter:state.rosterFilter
  }));
}
function value(v, digits=3) { return Number(v).toFixed(digits).replace(/0+$/,'').replace(/\.$/,''); }
function near(a,b,eps=1e-6){ return Number.isFinite(+a) && Math.abs(+a-b)<=eps; }
function isLegacyUntunedProfile(p) {
  return p?.actorId==='gothgirl' && p?.status==='AUTO_CANDIDATE' &&
    near(p?.eye?.anchor?.ring,0.30) && near(p?.eye?.pupilSize,0.50) && !p?.eye?.baseColor;
}
function currentClassSeed(){ return state.classSeeds[state.rigClass] || null; }
function classEyeDefault() {
  const seed=currentClassSeed();
  return clone(seed?.authoringDefault?.eye || seed?.calibrationStart?.eye || state.seed?.eye || {});
}
function hasAcceptedClassDefault(rigClass=state.rigClass){ return !!state.classSeeds[rigClass]?.authoringDefault?.eye; }
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
    rigClass:profile.rigClass || state.rigClass,
    classSeed:classConfig(profile.rigClass || state.rigClass).seedUrl.replace('./',''),
    characterId:profile.actorId,
    sessionAdjusted:!!markSession
  };
  profile.status='AUTO_CANDIDATE';
  return profile;
}
function actorById(id){ return state.catalog.find((a)=>a.id===id) || null; }
function makeActorProfile(actor) {
  const p=clone(state.seed);
  const d=classEyeDefault();
  p.actorId=actor.id;
  p.source={repo:'georg-doc/kayfabizarro',path:actor.path,revision:actor.revision};
  p.rigClass=actor.rigClass;
  p.sourceFace={
    headMesh:null, expectedConnectedComponents:null, connectedComponents:null, eyeComponents:[],
    pairConfidence:0, femaleOuterLashCandidate:'UNRESOLVED', removalMode:actor.cleanup?.mode||'auto-mirrored-front-pair',
    guard:'generic cleanup must pass fail-closed detector', status:'PENDING_AUTO_DETECT',
    faceColor:actor.faceColor||null, faceColorSource:actor.faceColor?'catalog-explicit':'generic-fallback-unverified'
  };
  p.eye={
    anchor:clone(d.anchor||{}),
    pupilStyle:d.pupilStyle||'matte-cute',
    pupilSize:d.pupilSize??0.34, gloss:d.gloss??0.1, inset:d.inset??0.4,
    lidFit:d.lidFit??0.9, converge:d.converge??0.18, splay:d.splay??0,
    baseColor:actor.faceColor||'#b58f83', lidColorMode:d.lidColorMode||'face-base-darkened',
    trackingMode:d.trackingMode||'life', fixedGaze:clone(d.fixedGaze||[0,0]),
    oval:clone(d.oval||{w:1,h:1,d:1,tilt:0})
  };
  p.status='AUTO_CANDIDATE';
  p.reviewState='UNREVIEWED';
  p.inheritance={order:['rigClass','character','session'],rigClass:actor.rigClass,classSeed:classConfig(actor.rigClass).seedUrl.replace('./',''),characterId:actor.id,sessionAdjusted:false};
  p.evidence={camera:'front',motionClip:'bind',sourceEyeCleanupVisuallyAccepted:false,eyeProfileVisuallyApproved:false};
  return p;
}
function ensureProfile(actor) {
  if(!actor) return null;
  const existing=state.profiles[actor.id];
  if(existing) return clone(existing);
  const p=makeActorProfile(actor); state.profiles[actor.id]=clone(p); return p;
}
function currentReviewState(actorId) {
  return state.profiles[actorId]?.reviewState || 'UNREVIEWED';
}
function reviewClass(stateName) {
  if(['APPROVED','ADJUSTED_APPROVED'].includes(stateName)) return 'approved';
  if(stateName==='UNSUPPORTED') return 'unsupported';
  if(stateName==='REJECTED') return 'rejected';
  if(stateName==='ADJUSTED') return 'adjusted';
  return 'candidate';
}
function isReviewedState(v){ return ['APPROVED','ADJUSTED_APPROVED','UNSUPPORTED','REJECTED'].includes(v); }
function renderRoster() {
  const all=state.catalog || [];
  const filter=state.rosterFilter;
  const visible=all.filter((a)=>{
    const rs=currentReviewState(a.id);
    if(filter==='unreviewed') return rs==='UNREVIEWED';
    if(filter==='adjusted') return rs==='ADJUSTED'||rs==='ADJUSTED_APPROVED';
    if(filter==='unsupported') return rs==='UNSUPPORTED';
    return true;
  });
  const list=$('#actorList');
  if(list) list.innerHTML=visible.map((a)=>{
    const rs=currentReviewState(a.id), current=a.id===state.currentActorId, checked=state.selectedActors.has(a.id);
    return `<div class="actor-row ${current?'current':''}" data-row-id="${a.id}">
      <input class="actor-select" data-select-id="${a.id}" type="checkbox" ${checked?'checked':''} aria-label="Select ${a.label}">
      <button class="actor-card ${current?'selected':''}" data-actor-id="${a.id}" type="button">
        <span class="actor-icon">${a.initials||a.label.slice(0,2).toUpperCase()}</span>
        <span class="actor-copy"><strong>${a.label}</strong><small>${a.rigClass} · ${rs.replaceAll('_',' ')}</small></span>
        <span class="dot ${reviewClass(rs)}" title="${rs}"></span>
      </button>
    </div>`;
  }).join('');
  const reviewed=all.filter((a)=>isReviewedState(currentReviewState(a.id))).length;
  const adjusted=all.filter((a)=>['ADJUSTED','ADJUSTED_APPROVED'].includes(currentReviewState(a.id))).length;
  const unsupported=all.filter((a)=>currentReviewState(a.id)==='UNSUPPORTED').length;
  const count=$('#rosterCount'); if(count) count.textContent=`${reviewed}/${all.length} reviewed`;
  const stats=$('#rosterStats'); if(stats) stats.textContent=`${visible.length} shown · ${adjusted} adjusted · ${unsupported} unsupported`;
  $$('[data-roster-filter]').forEach((b)=>b.classList.toggle('active',b.dataset.rosterFilter===filter));
  updateBatchUi();
}
function nextUnreviewed() {
  const all=state.catalog||[]; if(!all.length) return null;
  const start=Math.max(0,all.findIndex((a)=>a.id===state.currentActorId));
  for(let step=1;step<=all.length;step++){
    const a=all[(start+step)%all.length];
    if(currentReviewState(a.id)==='UNREVIEWED') return a;
  }
  return null;
}
function updateActorAudit() {
  const a=state.currentActor;
  if(!a) return;
  $('#sourceActor').textContent=a.revision.slice(0,7);
  $('#sourceActorName').textContent=a.label;
  $('#sourceCleanup').textContent=state.cleanupReady ? (state.cleanup.report?.removalMode||'candidate') : 'manual / unsupported';
  $('#sourcePath').textContent=a.path.split('/').pop();
  const info=$('#actorTechHint');
  if(info) info.textContent=`${a.provenance} · ${a.path}`;
}
function storeCurrentProfile() {
  if(!state.profile?.actorId) return;
  try{ profileFromRig(); }catch{}
  state.profiles[state.profile.actorId]=clone(state.profile);
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
function updateClassUi() {
  const cfg=classConfig();
  const title=$('#rigClassTitle'); if(title) title.textContent=state.rigClass;
  const marker=$('#rigClassMarker'); if(marker) marker.textContent=state.rigClass==='Rig_Large'
    ? 'Rig_Large · calibrate Monstrosity first · PR #104'
    : 'Rig_Medium · 27 actor review · PR #104';
  const hint=$('#classStatusHint');
  if(hint) hint.textContent=state.rigClass==='Rig_Large'
    ? (hasAcceptedClassDefault('Rig_Large') ? 'Large default set from Monstrosity · review the other Large actors' : 'No Large default yet · tune Monstrosity, then Set as Large default')
    : 'Medium default set · review and save character overrides';
  const seedHint=$('#mediumSeedHint');
  if(seedHint) seedHint.textContent=state.rigClass==='Rig_Large'
    ? (hasAcceptedClassDefault('Rig_Large') ? 'Rig_Large default active · source measurement remains optional' : 'Large calibration start only · tune Monstrosity before setting the class default')
    : 'Rig_Medium authoring default active · source measurement remains suggestion only';
  $$('[data-rig-class]').forEach((b)=>b.classList.toggle('active',b.dataset.rigClass===state.rigClass));
  const promote=$('#promoteClassDefaultBtn');
  if(promote){
    promote.hidden=state.rigClass!=='Rig_Large';
    promote.disabled=state.rigClass!=='Rig_Large' || state.currentActorId!=='monstrosity';
    promote.textContent=hasAcceptedClassDefault('Rig_Large')?'Update Large default':'Set as Large default';
  }
}
function updateBatchUi() {
  const selected=state.selectedActors.size;
  const reviewed=(state.catalog||[]).filter((a)=>isReviewedState(currentReviewState(a.id))).length;
  const el=$('#batchSelectionStatus'); if(el) el.textContent=`${classConfig().label} · ${selected} selected · ${reviewed}/${state.catalog.length||0} reviewed · ${state.currentActor?.label || 'loading'}`;
  const btn=$('#batchApplySelectedBtn'); if(btn) btn.disabled=selected===0 || !hasAcceptedClassDefault();
  updateClassUi();
}
function promoteCurrentAsClassDefault(){
  if(state.rigClass!=='Rig_Large' || state.currentActorId!=='monstrosity' || !state.profile) return false;
  profileFromRig();
  const seed=currentClassSeed();
  seed.authoringDefault={source:'Monstrosity human calibration',eye:clone(state.profile.eye)};
  seed.status='AUTHORING_DEFAULT_FROM_MONSTROSITY';
  state.profile.inheritance={...(state.profile.inheritance||{}),rigClass:'Rig_Large',classSeed:'data/rig-large-default.v0.json',sessionAdjusted:true};
  state.profiles[state.profile.actorId]=clone(state.profile);
  save(); updateBatchUi(); renderRoster();
  log('Rig_Large default set from current Monstrosity profile');
  return true;
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
  $('#runtimeLine').textContent = bootError ? `FAIL · ${bootError.message}` : `${on}/5 gates · ${state.currentActor?.label||'no actor'} · ${state.currentMotion} · ${state.currentView}`;
}

function setReviewStatus(status) {
  state.profile.status=status;
  const map={
    EYE_PROFILE_VISUALLY_APPROVED:'APPROVED',
    ADJUSTED_APPROVED:'ADJUSTED_APPROVED',
    REJECTED:'REJECTED',
    UNSUPPORTED:'UNSUPPORTED'
  };
  if(map[status]) state.profile.reviewState=map[status];
  if(status==='EYE_PROFILE_VISUALLY_APPROVED'||status==='ADJUSTED_APPROVED'){
    profileFromRig(); state.approvedProfiles[state.profile.actorId]=clone(state.profile);
  }
  state.profiles[state.profile.actorId]=clone(state.profile);
  save();
  $('#reviewStatus').textContent=state.profile.reviewState || status;
  $('#reviewStatus').className=`badge ${reviewClass(state.profile.reviewState)}`;
  renderRoster();
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
  const exportCharacter=()=>{ profileFromRig(); state.profiles[state.profile.actorId]=clone(state.profile); downloadJson(`${state.profile.actorId}.eye-profile.json`,state.profile); };
  const exportBatch=()=>{
    storeCurrentProfile();
    const ids=state.selectedActors.size?[...state.selectedActors]:state.catalog.map((a)=>a.id);
    const profiles=ids.map((id)=>ensureProfile(actorById(id))).filter(Boolean);
    const seed=currentClassSeed();
    downloadJson(`eye-rig-${classConfig().label.toLowerCase()}.batch.json`,{
      schema:'kfb.eye-profile-batch/0.2-candidate',
      rigClass:state.rigClass,
      inheritanceOrder:['rigClass','character','session'],
      classDefault:clone(seed?.authoringDefault||null),
      calibrationStart:clone(seed?.calibrationStart||null),
      selectedActorIds:ids,
      profiles
    });
  };
  const resetCurrent=()=>{
    const actor=state.currentActor;if(!actor)return;
    state.profile=applyAuthoringDefaultToProfile(makeActorProfile(actor),{markSession:false});
    state.profile.reviewState='UNREVIEWED';state.profiles[actor.id]=clone(state.profile);
    applyProfileToRig(state.profile);save();renderRoster();log(`reset ${actor.label} to ${state.rigClass} class start`);
  };
  $('#exportBtn').onclick=exportCharacter;
  $('#exportBatchBtn').onclick=exportBatch;
  $('#copyBtn').onclick=async()=>{profileFromRig();await navigator.clipboard?.writeText(JSON.stringify(state.profile,null,2));log('profile copied');};
  $('#importBtn').onclick=()=>$('#importInput').click();
  $('#batchImportBtn').onclick=()=>$('#importInput').click();
  $('#batchExportCharacterBtn').onclick=exportCharacter;
  $('#batchExportBatchBtn').onclick=exportBatch;
  $('#batchResetBtn').onclick=resetCurrent;
  $('#batchApproveBtn').onclick=()=>setReviewStatus(state.profile.reviewState==='ADJUSTED'?'ADJUSTED_APPROVED':'EYE_PROFILE_VISUALLY_APPROVED');
  $('#promoteClassDefaultBtn').onclick=()=>promoteCurrentAsClassDefault();
  $('#batchApplySelectedBtn').onclick=()=>{
    if(!hasAcceptedClassDefault()) return;
    storeCurrentProfile();
    for(const id of state.selectedActors){
      const actor=actorById(id);if(!actor)continue;
      const p=applyAuthoringDefaultToProfile(ensureProfile(actor),{markSession:true});
      p.reviewState='UNREVIEWED';state.profiles[id]=clone(p);
    }
    state.profile=clone(state.profiles[state.currentActorId]);applyProfileToRig(state.profile);save();renderRoster();
    log(`${state.rigClass} default applied to ${state.selectedActors.size} selected actor(s)`);
  };
  $('#importInput').onchange=async(e)=>{
    try{
      const data=JSON.parse(await e.target.files[0].text());
      if(data?.schema==='kfb.eye-profile/0.1-candidate'){
        if(!actorById(data.actorId))throw new Error('actorId not in current class catalog');
        state.pendingImport={kind:'profile',data};
      }else if(data?.schema==='kfb.eye-profile-batch/0.2-candidate'){
        if(data.rigClass!==state.rigClass||!Array.isArray(data.profiles))throw new Error('batch rig class does not match current tab');
        state.pendingImport={kind:'batch',data};
      }else throw new Error('unsupported import schema');
      $('#importPreview').hidden=false;
      $('#importPreviewTitle').textContent=state.pendingImport.kind==='batch'?`${state.rigClass} batch · ${data.profiles.length} profile(s)`:`${data.actorId} · ${data.status}`;
      $('#importPreviewText').textContent='Validated structure. Nothing has been applied yet.';
    }catch(err){alert(`Import rejected: ${err.message}`);}
    e.target.value='';
  };
  $('#acceptImportBtn').onclick=async()=>{
    if(!state.pendingImport)return;
    const imp=state.pendingImport;state.pendingImport=null;$('#importPreview').hidden=true;
    if(imp.kind==='profile'){
      state.profiles[imp.data.actorId]=clone(imp.data);
      if(imp.data.actorId===state.currentActorId){state.profile=clone(imp.data);applyProfileToRig(state.profile);}
    }else{
      if(imp.data.classDefault) currentClassSeed().authoringDefault=clone(imp.data.classDefault);
      for(const p of imp.data.profiles||[])if(actorById(p.actorId))state.profiles[p.actorId]=clone(p);
      state.selectedActors=new Set((imp.data.selectedActorIds||[]).filter((id)=>actorById(id)));
      if(state.profiles[state.currentActorId]){state.profile=clone(state.profiles[state.currentActorId]);applyProfileToRig(state.profile);}
    }
    save();renderRoster();updateBatchUi();log(`validated ${imp.kind} import accepted`);
  };
  $('#cancelImportBtn').onclick=()=>{state.pendingImport=null;$('#importPreview').hidden=true;};
  $('#resetSeedBtn').onclick=resetCurrent;
  $('#revertApprovedBtn').onclick=()=>{
    const approved=state.approvedProfiles[state.currentActorId];if(!approved)return;
    state.profile=clone(approved);state.profiles[state.profile.actorId]=clone(state.profile);applyProfileToRig(state.profile);save();renderRoster();log('reverted current actor to approved profile');
  };
  $$('[data-review]').forEach((b)=>b.onclick=()=>setReviewStatus(b.dataset.review));
}
function wireRoster() {
  $('#actorList').onclick=async(e)=>{
    const button=e.target.closest('[data-actor-id]');
    if(button)await loadActor(button.dataset.actorId);
  };
  $('#actorList').onchange=(e)=>{
    const box=e.target.closest('[data-select-id]');if(!box)return;
    if(box.checked)state.selectedActors.add(box.dataset.selectId);else state.selectedActors.delete(box.dataset.selectId);
    state.selectedByClass[state.rigClass]=state.selectedActors;save();updateBatchUi();
  };
  $$('[data-roster-filter]').forEach((b)=>b.onclick=()=>{state.rosterFilter=b.dataset.rosterFilter;save();renderRoster();});
  $$('[data-rig-class]').forEach((b)=>b.onclick=()=>switchRigClass(b.dataset.rigClass));
  $('#nextUnreviewedBtn').onclick=async()=>{const a=nextUnreviewed();if(a)await loadActor(a.id);};
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
  const cfg=classConfig();
  state.currentAction?.stop?.(); state.currentAction=null; state.clips.clear(); state.currentMotion='bind';
  const [general,movement]=await Promise.all([loader.loadAsync(cfg.generalUrl),loader.loadAsync(cfg.moveUrl)]);
  [...general.animations,...movement.animations].forEach((c)=>{if(!state.clips.has(c.name))state.clips.set(c.name,c);});
  state.motionReady=cfg.requiredClips.every((n)=>state.clips.has(n));
  gate('#gateMotion',state.motionReady?'pass':'fail');
  $('#motionStatus').textContent=state.motionReady?`1 mixer · ${state.clips.size} ${cfg.label} clips loaded`:'required clips missing';
  $$('.motion').forEach((b)=>{const n=b.dataset.motion;b.disabled=n!=='bind'&&!state.clips.has(n);});
  log(`${state.rigClass} motion packs loaded · ${state.clips.size} unique clips · required ${state.motionReady?'OK':'MISSING'}`);
}

async function switchRigClass(rigClass){
  if(!CLASS_CONFIG[rigClass] || state.switching || rigClass===state.rigClass) return false;
  storeCurrentProfile();
  if(state.currentActorId) state.currentActorByClass[state.rigClass]=state.currentActorId;
  state.selectedByClass[state.rigClass]=state.selectedActors;
  state.rigClass=rigClass;
  state.catalog=state.catalogs[rigClass]||[];
  state.selectedActors=state.selectedByClass[rigClass] || new Set([classConfig(rigClass).defaultActor]);
  state.rosterFilter='all';
  updateClassUi(); renderRoster();
  await loadMotion(state.loader);
  const target=actorById(state.currentActorByClass[rigClass])||actorById(classConfig(rigClass).defaultActor)||state.catalog[0];
  if(target) await loadActor(target.id,{preserve:false});
  save();
  return !!target;
}

function wireComponentDiagnostic(camera,controls) {
  const select=$('#componentSelect'),isolateBtn=$('#isolateComponentBtn'),exitBtn=$('#exitComponentBtn'),hint=$('#componentHint');
  if(!select||!isolateBtn||!exitBtn||!hint)return;
  select.innerHTML=''; select.disabled=true; isolateBtn.disabled=true; exitBtn.disabled=true;
  const components=state.cleanup?.report?.components||[];
  if(!components.length){
    hint.textContent=state.cleanupReady?'Generic cleanup active · component isolation available only for verified-source actors':'Cleanup requires manual review · no source components hidden';
    return;
  }
  select.innerHTML=components.map((c)=>`<option value="${c.component}">#${c.component} · ${c.triangles} tris</option>`).join('');
  select.disabled=false; isolateBtn.disabled=false;
  hint.textContent=`${components.length} measured head components · source-only diagnostic · no profile change`;
  const isolateSelected=()=>{
    const component=+select.value;
    if(!state.componentDiagnosticRestore){
      state.componentDiagnosticRestore={cleanup:!!state.cleanup.active,eyeRig:!!$('#eyeRigToggle').checked,hostDebug:!!$('#hostDebugToggle').checked,motion:state.currentMotion};
      poseBind(); $('#cleanupToggle').checked=false; state.cleanup.apply(false); $('#eyeRigToggle').checked=false; state.eyes.setVisible(false);
      $('#hostDebugToggle').checked=false; $('#hostDebugToggle').dispatchEvent(new Event('change')); setView('front',camera,controls);
    }
    const detail=state.cleanup.setComponentIsolation(component); if(!detail)return;
    exitBtn.disabled=false; hint.textContent=`Component #${component} · ${detail.triangles} tris · source-only isolation`; renderReport();
  };
  isolateBtn.onclick=isolateSelected;
  select.onchange=()=>{if(state.cleanup.isolatedComponent!=null)isolateSelected();};
  exitBtn.onclick=()=>{
    state.cleanup.clearComponentIsolation();
    const restore=state.componentDiagnosticRestore||{cleanup:true,eyeRig:true,hostDebug:false,motion:'bind'};
    $('#cleanupToggle').checked=!!restore.cleanup;state.cleanup.apply(!!restore.cleanup);
    $('#eyeRigToggle').checked=!!restore.eyeRig;state.eyes.setVisible(!!restore.eyeRig);
    $('#hostDebugToggle').checked=!!restore.hostDebug;$('#hostDebugToggle').dispatchEvent(new Event('change'));
    if(restore.motion&&restore.motion!=='bind')playMotion(restore.motion);else poseBind();
    state.componentDiagnosticRestore=null;exitBtn.disabled=true;hint.textContent=`${components.length} measured head components · source-only diagnostic`;renderReport();
  };
}

async function loadActor(actorId,{preserve=true}={}) {
  const actor=actorById(actorId); if(!actor||state.switching)return false;
  state.switching=true;
  const loading=$('#loadingCard');
  try{
    if(preserve) storeCurrentProfile();
    if(loading){loading.hidden=false;$('#loadingDetail').textContent=`Loading ${actor.label}…`;}
    state.currentAction?.stop?.(); state.currentAction=null;
    state.mixer?.stopAllAction?.(); state.eyes?.dispose?.(); state.cleanup?.dispose?.();
    if(state.figure?.parent) state.figure.parent.remove(state.figure);
    state.figure=null; state.eyes=null; state.cleanup=null; state.mixer=null; state.componentDiagnosticRestore=null;
    state.currentActor=actor; state.currentActorId=actor.id; state.currentActorByClass[state.rigClass]=actor.id; state.profile=ensureProfile(actor);
    state.sourceReady=state.cleanupReady=state.hostReady=state.eyeReady=false;
    gate('#gateSource','pending');gate('#gateCleanup','pending');gate('#gateHost','pending');gate('#gateEye','pending');
    renderRoster(); updateActorAudit();

    const gltf=await state.loader.loadAsync(actorUrl(actor));
    const figure=gltf.scene; state.figure=figure; state.stageRoot.add(figure);
    const norm=normalizeActor(figure); figure.visible=false; state.sourceReady=true; gate('#gateSource','pass');
    log(`${actor.label} loaded · ${norm.sourceHeight} → ${norm.normalizedHeight} high`);

    const cleanup=prepareMediumActorCleanup({THREE,figure,actor,log}); state.cleanup=cleanup;
    state.cleanupReady=['AUTO_CANDIDATE','SOURCE_IDENTITY_VERIFIED_AUTO_CANDIDATE','AUTO_CANDIDATE_GENERIC'].includes(cleanup.status);
    gate('#gateCleanup',state.cleanupReady?'pass':'fail'); if(state.cleanupReady) cleanup.apply(true);
    state.profile.sourceFace={...state.profile.sourceFace,...clone(cleanup.report)};
    if(!state.cleanupReady && state.profile.reviewState==='UNREVIEWED') state.profile.technicalNote='source-eye cleanup requires manual review';

    state.mixer=new THREE.AnimationMixer(figure);
    const eyes=await mountKayKitEyes({THREE,figure,sourceRef:sourceRef(),profile:state.profile,expressionContract:window.__EYE_RIG_CONTRACT,camera:window.__EYE_RIG_BATCH.camera,log});
    state.eyes=eyes;
    const measured=cleanup.measureOnFaceHost?.(eyes.faceHost); if(measured) recordMeasuredSuggestion(measured);
    state.hostReady=eyes.faceHost.status==='OK'; state.eyeReady=!!eyes.eyeFrame();
    gate('#gateHost',state.hostReady?'pass':'fail');gate('#gateEye',state.eyeReady?'pass':'fail');
    figure.visible=true;
    bindUiFromProfile(); setView('front',window.__EYE_RIG_BATCH.camera,window.__EYE_RIG_BATCH.controls); poseBind();
    wireComponentDiagnostic(window.__EYE_RIG_BATCH.camera,window.__EYE_RIG_BATCH.controls);
    updateActorAudit(); renderRoster(); save();
    if(loading)loading.hidden=true;
    setBadge($('#bootBadge'),state.sourceReady&&state.hostReady&&state.eyeReady?'READY':'CHECK',state.sourceReady&&state.hostReady&&state.eyeReady?'pass':'candidate');
    return true;
  }catch(err){
    console.error(err); log(`actor load failed · ${actor.label} · ${err.message}`);
    const p=ensureProfile(actor); p.status='UNSUPPORTED'; p.reviewState='UNSUPPORTED'; p.technicalNote=`load failed: ${err.message}`; state.profiles[actor.id]=clone(p); state.profile=p;
    renderRoster(); save(); if(loading){loading.hidden=false;$('#loadingDetail').textContent=`Unsupported · ${err.message}`;}
    setBadge($('#bootBadge'),'CHECK','candidate'); return false;
  }finally{ state.switching=false; }
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
  const a=document.createElement('a'); a.href=sheet.toDataURL('image/png'); a.download=`${state.currentActorId||'actor'}-qa-front-3q-side.png`; a.click();
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
    state.profile.status='AUTO_CANDIDATE'; state.profile.reviewState='ADJUSTED'; state.profiles[state.profile.actorId]=clone(state.profile); save(); renderRoster();
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
  $('#captureBtn').onclick=()=>{ renderer.render(window.__EYE_RIG_BATCH.scene,camera); const a=document.createElement('a'); a.href=renderer.domElement.toDataURL('image/png'); a.download=`${state.currentActorId||'actor'}-${state.currentView}-${state.currentMotion}.png`; a.click(); };
  $('#qaCaptureBtn').onclick=()=>captureQaContactSheet(renderer,camera,controls);
}

async function boot() {
  const [seed,mediumSeed,mediumCatalog,largeSeed,largeCatalog,contract]=await Promise.all([
    fetch('./data/gothgirl.seed.json').then((r)=>{if(!r.ok)throw new Error(`seed ${r.status}`);return r.json();}),
    fetch(CLASS_CONFIG.Rig_Medium.seedUrl).then((r)=>{if(!r.ok)throw new Error(`medium seed ${r.status}`);return r.json();}),
    fetch(CLASS_CONFIG.Rig_Medium.catalogUrl).then((r)=>{if(!r.ok)throw new Error(`medium catalog ${r.status}`);return r.json();}),
    fetch(CLASS_CONFIG.Rig_Large.seedUrl).then((r)=>{if(!r.ok)throw new Error(`large seed ${r.status}`);return r.json();}),
    fetch(CLASS_CONFIG.Rig_Large.catalogUrl).then((r)=>{if(!r.ok)throw new Error(`large catalog ${r.status}`);return r.json();}),
    fetch(CONTRACT_URL).then((r)=>{if(!r.ok)throw new Error(`contract ${r.status}`);return r.json();})
  ]);
  state.seed=seed;
  state.classSeeds={Rig_Medium:mediumSeed,Rig_Large:largeSeed};
  state.catalogs={Rig_Medium:mediumCatalog.actors||[],Rig_Large:largeCatalog.actors||[]};
  window.__EYE_RIG_CONTRACT=contract;

  const saved=readSaved();
  if(saved?.classDefault&&!saved?.classDefaults) state.classSeeds.Rig_Medium.authoringDefault=clone(saved.classDefault);
  for(const [k,v] of Object.entries(saved?.classDefaults||{})) if(state.classSeeds[k]&&v) state.classSeeds[k].authoringDefault=clone(v);
  state.profiles=clone(saved?.profiles||{});
  if(saved?.profile?.actorId&&!state.profiles[saved.profile.actorId])state.profiles[saved.profile.actorId]=clone(saved.profile);
  state.approvedProfiles=clone(saved?.approvedProfiles||{});
  if(saved?.approved?.actorId&&!state.approvedProfiles[saved.approved.actorId])state.approvedProfiles[saved.approved.actorId]=clone(saved.approved);

  state.rigClass=CLASS_CONFIG[saved?.currentRigClass]?saved.currentRigClass:'Rig_Medium';
  state.catalog=state.catalogs[state.rigClass]||[];
  state.currentActorByClass=clone(saved?.currentActorByClass||{});
  state.selectedByClass={
    Rig_Medium:new Set(saved?.selectedByClass?.Rig_Medium?.length?saved.selectedByClass.Rig_Medium:['gothgirl']),
    Rig_Large:new Set(saved?.selectedByClass?.Rig_Large?.length?saved.selectedByClass.Rig_Large:['monstrosity'])
  };
  state.selectedActors=state.selectedByClass[state.rigClass];
  state.rosterFilter=saved?.rosterFilter||'all';

  state.savedLegacyDefault=isLegacyUntunedProfile(state.profiles.gothgirl);
  if(state.savedLegacyDefault){
    const oldClass=state.rigClass,oldCatalog=state.catalog;
    state.rigClass='Rig_Medium';state.catalog=state.catalogs.Rig_Medium;
    const g=actorById('gothgirl');state.profiles.gothgirl=applyAuthoringDefaultToProfile(state.profiles.gothgirl||makeActorProfile(g),{markSession:false});state.profiles.gothgirl.reviewState='UNREVIEWED';
    state.rigClass=oldClass;state.catalog=oldCatalog;
  }

  const {renderer,scene,camera,controls,ro}=configureRenderer();
  state.loader=new GLTFLoader();THREE.Cache.enabled=true;
  window.__EYE_RIG_BATCH={state,scene,camera,controls,renderer,logLines,
    report:()=>({profile:profileFromRig(),profiles:clone(state.profiles),currentActor:state.currentActor,rigClass:state.rigClass,classSeed:clone(currentClassSeed()),cleanup:state.cleanup?.report,eyes:state.eyes?.report(),qa:state.qaLast,selectedActors:[...state.selectedActors],roster:{count:state.catalog.length,filter:state.rosterFilter},clips:[...state.clips.keys()],gates:{source:state.sourceReady,cleanup:state.cleanupReady,host:state.hostReady,eye:state.eyeReady,motion:state.motionReady},error:bootError?.message||null})
  };

  wireProfileIo();wireRuntimeControls(camera,controls,renderer);wireRoster();
  updateClassUi();renderRoster();
  await loadMotion(state.loader);

  const cfg=classConfig();
  const first=actorById(state.currentActorByClass[state.rigClass])||actorById(cfg.defaultActor)||state.catalog[0];
  if(!first)throw new Error(`no actors in ${state.rigClass} catalog`);
  await loadActor(first.id,{preserve:false});

  let last=performance.now();
  function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;state.mixer?.update(dt);state.eyes?.update(dt,camera);controls.update();renderer.render(scene,camera);requestAnimationFrame(frame);}
  requestAnimationFrame(frame);renderReport();
}

boot().catch((err)=>{
  bootError=err; console.error(err); setBadge($('#bootBadge'),'FAIL','fail'); $('#loadingDetail').textContent=err.message; gate('#gateSource',state.sourceReady?'pass':'fail'); renderReport(); window.__EYE_RIG_BATCH={state,error:err,report:()=>({error:err.message,gates:{source:state.sourceReady,cleanup:state.cleanupReady,host:state.hostReady,eye:state.eyeReady,motion:state.motionReady}})};
});
