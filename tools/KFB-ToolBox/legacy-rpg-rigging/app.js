import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {assembleLegacy,replaceHead,mountHeldProp,playClip} from './lib/legacy-rig-adapter.v1.js';
import {buildLegacyFaceHost,measureLegacyEyeCandidates,setLegacySourceEyeVisibility} from './lib/legacy-facehost.v1.js';
import {EyeRig} from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@5650b6c54d8789b20ea80abe857688173d506d3b/tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js';

const $=q=>document.querySelector(q), $$=q=>[...document.querySelectorAll(q)];
const loader=new GLTFLoader();
const SOURCE_PIN='eb48f50489b9e4903ec1e3d2fb1837605ce7d792';
const RIG_PIN='10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0';
const CORE_PIN='5650b6c54d8789b20ea80abe857688173d506d3b';
const ROOT='media/3D_Assets/KayKit Legacy/KayKit Dungeon Pack 1.0 2/Models/';
const RIG_PATH='media/3D_Assets/KayKit Legacy/KayKit Character Animations 1.2 - legacy/Animations/gltf/KayKit_AnimatedCharacter_v1.2.glb';
const url=(pin,path)=>encodeURI(`https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@${pin}/${path}`);
const sourceUrl=path=>url(SOURCE_PIN,path.startsWith('media/')?path:`${ROOT}${path}`);
const rigUrl=url(RIG_PIN,RIG_PATH);
const PACK_SHEET=url(SOURCE_PIN,'media/3D_Assets/KayKit Legacy/KayKit Dungeon Pack 1.0 2/CharacterOverview.png');
const STORAGE='kfb.toolbox.legacy-rpg-rigging.v0';
const EXPR={neutral:{lidUpper:0,lidLower:0,slant:0,pupil:'normal',gaze:'front'},happy:{lidUpper:.22,lidLower:.08,slant:-.14,pupil:'normal',gaze:'front'},angry:{lidUpper:.32,lidLower:.05,slant:.34,pupil:'normal',gaze:'front'},sad:{lidUpper:.2,lidLower:.12,slant:-.3,pupil:'normal',gaze:'down'},surprised:{lidUpper:-.18,lidLower:-.12,slant:0,pupil:'wide',gaze:'front'},thinking:{lidUpper:.3,lidLower:.05,slant:.12,pupil:'normal',gaze:'away'}};

const state={catalog:null,tab:'characters',mode:'source',selected:null,sourceNode:null,actor:null,headPart:null,faceHost:null,eyes:null,mixer:null,scene:null,camera:null,renderer:null,controls:null,clock:new THREE.Clock(),profiles:{},reviews:{},eyeVisible:false,sourceEyesVisible:true,currentMotion:null,assemblyGeneration:0,assemblyRequestToken:null,assemblyReadyToken:null};
function loadSaved(){try{const x=JSON.parse(localStorage.getItem(STORAGE)||'{}');state.profiles=x.profiles||{};state.reviews=x.reviews||{};}catch{}}
function save(){localStorage.setItem(STORAGE,JSON.stringify({profiles:state.profiles,reviews:state.reviews}));}
function setBadge(text,kind='candidate'){$('#rigStatus').textContent=text;$('#rigStatus').className='badge '+kind;}
function logReport(obj){$('#assemblyReport').textContent=typeof obj==='string'?obj:JSON.stringify(obj,null,2);}
function markAssembly(request,status){
  const root=document.documentElement;
  root.dataset.assemblyState=status;
  root.dataset.assemblyGeneration=String(request.generation);
  root.dataset.assemblyRequest=request.token;
  root.dataset.assemblyBody=request.bodyId;
  root.dataset.assemblyHead=request.headId;
  if(status==='ready'){root.dataset.assemblyReady=request.token;state.assemblyReadyToken=request.token;}
  else if(status==='assembling')root.dataset.assemblyReady='';
  window.dispatchEvent(new CustomEvent('kfb:legacy-assembly',{detail:{...request,status}}));
}
function profileFor(headId){return state.profiles[headId] ||= {schema:'kfb.eye-profile/0.1-candidate',headId,sourceRevision:SOURCE_PIN,rigClass:'Rig_Legacy',eye:{anchor:{dx:.40,dy:.05,ring:.15,track:.12},inset:.18,pupilSize:.38,lidFit:.9,splay:.04},blink:{minGap:2.5,maxGap:6.5,dur:.12},life:{on:true,wander:.35,tremor:.18},status:'AUTO_CANDIDATE'};}
function updateReviewProgress(){const n=state.catalog.heads.length,done=state.catalog.heads.filter(h=>state.reviews[h.id]).length;$('#reviewProgress').textContent=`${done}/${n} reviewed`;}

async function boot(){
  loadSaved(); const res=await fetch('./data/catalog.v1.json'); state.catalog=await res.json();
  $('#packSheet').src=PACK_SHEET; buildSelects(); renderCatalog(); initThree(); wire(); updateReviewProgress();
  $('#propBridge').textContent=`Rig_Legacy donor\n6 bones: Body · Head · armLeft · handSlotLeft · armRight · handSlotRight\n30 clips: ${state.catalog.motions.join(' · ')}\n\nConsumer proposal only → Pencil / CapsuleCarl / Eraser / KFB prop rigs`;
  $('#bootBadge').textContent='READY';$('#bootBadge').className='badge ok';$('#runtimeMarker').textContent='candidate · source '+SOURCE_PIN.slice(0,7)+' · rig '+RIG_PIN.slice(0,7);
  await isolate(state.catalog.characters[0],'characters');
}

function buildSelects(){
  $('#bodySelect').innerHTML=state.catalog.characters.map(c=>`<option value="${c.id}">${c.label}</option>`).join('');
  $('#headSelect').innerHTML=state.catalog.heads.map(h=>`<option value="${h.id}">${h.label}</option>`).join('');
  const choices=[...state.catalog.weapons,...state.catalog.accessories.filter(a=>a.path)];
  const opts='<option value="">None</option>'+choices.map(w=>`<option value="${w.id}">${w.label}</option>`).join('');$('#rightWeapon').innerHTML=opts;$('#leftWeapon').innerHTML=opts;
  const quick=['idle','walk','run','wave','attack','combo','heavy','block','shoot','bow','throw','jump','roll'];$('#motionQuick').innerHTML=quick.map(k=>`<button data-motion="${state.catalog.semantic[k]}">${k}</button>`).join('');
  $('#motionAll').innerHTML='<option value="">All 30 clips…</option>'+state.catalog.motions.map(m=>`<option>${m}</option>`).join('');
}

function catalogEntries(){return state.catalog[state.tab]||[];}
function renderCatalog(){const q=$('#search').value.trim().toLowerCase();const rows=catalogEntries().filter(x=>!q||`${x.label} ${x.family||''} ${x.tier||''}`.toLowerCase().includes(q));$('#catalogList').innerHTML=rows.map(x=>`<button class="catalog-item ${state.selected?.id===x.id?'active':''}" data-id="${x.id}"><b>${x.label}</b><small>${entryHint(x)}</small></button>`).join('');$$('.catalog-item').forEach(b=>b.onclick=()=>{const item=catalogEntries().find(x=>x.id===b.dataset.id);isolate(item,state.tab);});}
function entryHint(x){if(state.tab==='characters')return `${x.bodyMaterials.length} body/clothing materials · static modular source`;if(state.tab==='heads')return x.kind==='embedded'?`embedded source head · ${x.character}`:'separate interchangeable head';if(state.tab==='weapons')return `${x.family} · ${x.tier}`;if(x.kind==='embedded-head-gear')return `${x.character} · embedded source node`;return x.kind||'prop';}
function entryPath(item,tab){if(tab==='characters')return item.path;if(item.path)return item.path.startsWith('media/')?item.path:`${ROOT}${item.path}`;if(tab==='heads'&&item.kind==='embedded')return state.catalog.characters.find(c=>c.id===item.character)?.path;if(tab==='accessories'&&item.kind==='embedded-head-gear')return state.catalog.characters.find(c=>c.id===item.character)?.path;return null;}

function initThree(){
  const stage=$('#stage');const scene=new THREE.Scene();state.scene=scene;scene.fog=new THREE.Fog(0x0d0d0c,7,16);scene.add(new THREE.HemisphereLight(0xfff5df,0x342f2a,2.1));const key=new THREE.DirectionalLight(0xffe4c7,4.5);key.position.set(4,7,6);scene.add(key);const fill=new THREE.DirectionalLight(0x8f7cff,2.4);fill.position.set(-5,3,3);scene.add(fill);
  const ground=new THREE.Mesh(new THREE.CircleGeometry(7,64),new THREE.MeshStandardMaterial({color:0x171715,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.015;scene.add(ground);
  const camera=new THREE.PerspectiveCamera(34,1,.01,100);camera.position.set(3.4,2.5,5.4);scene.add(camera);state.camera=camera;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;stage.insertBefore(renderer.domElement,stage.firstChild);state.renderer=renderer;
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,1,0);state.controls=controls;
  const resize=()=>{const r=stage.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(stage);resize();
  const loop=()=>{requestAnimationFrame(loop);const dt=Math.min(1/20,state.clock.getDelta());state.mixer?.update(dt);state.eyes?.update(dt);controls.update();renderer.render(scene,camera);};loop();
}
function clearStageObject(){state.eyes?.dispose?.();state.eyes=null;state.faceHost?.dispose?.();state.faceHost=null;if(state.sourceNode)state.sourceNode.removeFromParent();state.sourceNode=null;if(state.actor?.root)state.actor.root.removeFromParent();state.actor=null;state.headPart=null;state.mixer=null;state.eyeVisible=false;$('#eyeRigBtn').disabled=true;$('#sourceEyesBtn').disabled=true;}
function normalizeAndAdd(root){const box=new THREE.Box3().setFromObject(root),s=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3());root.position.x-=c.x;root.position.z-=c.z;root.position.y-=box.min.y;const max=Math.max(s.x,s.y,s.z);if(max>0){const k=2.2/max;root.scale.multiplyScalar(k);}root.updateMatrixWorld(true);state.scene.add(root);frame(root);}
function frame(root){const box=new THREE.Box3().setFromObject(root);if(box.isEmpty())return;const s=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3()),r=Math.max(s.x,s.y,s.z);state.controls.target.copy(c);const v=viewVector(state.currentView||'front');state.camera.position.copy(c).add(v.multiplyScalar(r*2.7));state.camera.near=Math.max(.01,r/100);state.camera.far=r*30;state.camera.updateProjectionMatrix();state.controls.update();}
function viewVector(v){return v==='side'?new THREE.Vector3(1,.25,0).normalize():v==='three'?new THREE.Vector3(1,.3,1).normalize():v==='top'?new THREE.Vector3(.1,1,.1).normalize():new THREE.Vector3(0,.22,1).normalize();}

async function isolate(item,tab){
  state.selected=item;state.tab=tab;renderCatalog();clearStageObject();$('#loading').hidden=false;$('#stageMode').textContent='SOURCE';$('#stageObject').textContent=item.label;$('#sourcePath').textContent=entryPath(item,tab)||'embedded part';setBadge('SOURCE','candidate');
  try{
    const p=entryPath(item,tab);if(!p)throw new Error('no exact source path');const g=await loader.loadAsync(sourceUrl(p));const root=g.scene.clone(true);
    if(tab==='heads'&&item.kind==='embedded'){const ch=state.catalog.characters.find(c=>c.id===item.character);let head=root.getObjectByName(ch.headNode);const group=new THREE.Group();group.name=item.id; if(head){head.removeFromParent();group.add(head);} for(const n of ch.headExtras||[]){const e=root.getObjectByName(n);if(e){e.removeFromParent();group.add(e);}}state.sourceNode=group;normalizeAndAdd(group);}
    else if(tab==='accessories'&&item.kind==='embedded-head-gear'){const part=root.getObjectByName(item.node);if(!part)throw new Error('embedded source node not found: '+item.node);part.removeFromParent();const group=new THREE.Group();group.name=item.id;group.add(part);state.sourceNode=group;normalizeAndAdd(group);}
    else {state.sourceNode=root;normalizeAndAdd(root);}
    $('#modeHint').textContent='Real source shown alone. Assemble only after inspection.';state.mode='source';syncModeButtons();
  }catch(e){console.error(e);$('#modeHint').textContent='SOURCE LOAD FAILED: '+e.message;}
  $('#loading').hidden=true;
}

async function assemble(){
  const body=state.catalog.characters.find(c=>c.id===$('#bodySelect').value), head=state.catalog.heads.find(h=>h.id===$('#headSelect').value);
  const generation=++state.assemblyGeneration;
  const request={generation,bodyId:body.id,headId:head.id,token:`${generation}:${body.id}:${head.id}`};
  state.assemblyRequestToken=request.token;
  const current=()=>state.assemblyRequestToken===request.token;

  clearStageObject();$('#loading').hidden=false;
  setBadge('ASSEMBLING','pending');$('#stageMode').textContent='ASSEMBLING';$('#stageObject').textContent=`${body.label} + ${head.label}`;$('#motionStatus').textContent='Assembly in progress…';
  markAssembly(request,'assembling');

  try{
    const actor=await assembleLegacy({THREE,loader,rigUrl,partsUrl:sourceUrl(body.path),catalogCharacter:body,log:console.log});
    if(!current())return;
    state.actor=actor;state.scene.add(actor.root);normalizeAndAddExisting(actor.root);

    let headPart=actor.parts.Head?.node;
    if(head.kind==='asset'){
      const repl=await replaceHead({loader,character:actor,headUrl:sourceUrl(head.path),log:console.log});
      if(!current())return;
      headPart=repl.headPart;
    } else if(head.character!==body.id){
      const sourceChar=state.catalog.characters.find(c=>c.id===head.character),g=await loader.loadAsync(sourceUrl(sourceChar.path));
      if(!current())return;
      const tmp=g.scene;tmp.updateMatrixWorld(true);
      const h=tmp.getObjectByName(sourceChar.headNode), group=new THREE.Group(); group.name='kfb-cross-class-head';
      const headWorld=h?.matrixWorld?.clone(), headInv=headWorld?.clone().invert(); const pieces=[];if(h)pieces.push(h); for(const n of sourceChar.headExtras||[]){const e=tmp.getObjectByName(n);if(e)pieces.push(e);}
      const matrices=new Map(pieces.map(e=>[e,e.matrixWorld.clone()])); for(const e of pieces){e.removeFromParent();e.matrixAutoUpdate=false;e.matrix.identity();if(e!==h&&headInv)e.matrix.copy(headInv).multiply(matrices.get(e));e.matrixWorldNeedsUpdate=true;group.add(e);}
      actor.parts.Head.node.visible=false;for(const e of actor.extras)if(e.bone==='Head')e.node.visible=false;actor.headBone.add(group);actor.headReplacement=group;headPart=h||group;
    }

    if(!current())return;
    state.headPart=headPart;
    if(!$('#headExtrasToggle').checked){for(const e of actor.extras)if(e.bone==='Head')e.node.visible=false;actor.headReplacement?.traverse?.(o=>{if(/hair|hat|helmet|visor/i.test(o.name||''))o.visible=false;});}
    state.mixer=new THREE.AnimationMixer(actor.root);state.mode='assembled';syncModeButtons();setBadge('RIG_LEGACY','ok');$('#stageMode').textContent='ASSEMBLED';$('#stageObject').textContent=`${body.label} + ${head.label}`;$('#motionStatus').textContent=`${actor.animations.length} native legacy clips · one mixer`;$('#eyeRigBtn').disabled=false;$('#sourceEyesBtn').disabled=false;
    buildFaceAndEyeCandidate(head);await applyWeapons();
    if(!current())return;
    playMotion('Idle');frame(actor.root);logReport({request:request.token,bodyId:body.id,placed:actor.report.placed,extras:actor.report.extraPlaced,missing:actor.report.missing,clips:actor.animations.length,head:head.label,bodyMaterials:body.bodyMaterials});
    markAssembly(request,'ready');
  }catch(e){
    if(current()){console.error(e);logReport('ASSEMBLY FAILED\n'+e.message);setBadge('FAILED','danger');markAssembly(request,'error');}
  }finally{
    if(current())$('#loading').hidden=true;
  }
}
function normalizeAndAddExisting(root){const box=new THREE.Box3().setFromObject(root),c=box.getCenter(new THREE.Vector3());root.position.x-=c.x;root.position.z-=c.z;root.position.y-=box.min.y;root.updateMatrixWorld(true);frame(root);}
function buildFaceAndEyeCandidate(head){state.faceHost?.dispose?.();state.faceHost=buildLegacyFaceHost({THREE,figure:state.actor.root,headBone:state.actor.headBone,headPart:state.headPart,log:console.log});const measured=measureLegacyEyeCandidates({THREE,headPart:state.headPart,faceHost:state.faceHost});const p=profileFor(head.id);if(measured.status==='MEASURED_CANDIDATE'&&!p.measured){p.measured=measured;p.eye.anchor={...p.eye.anchor,...measured.anchor};save();}$('#eyeSourceReport').textContent=JSON.stringify({faceHost:state.faceHost.report,sourceEyes:measured,profileStatus:p.status},null,2);bindEyeUi(p);}
function bindEyeUi(p){const a=p.eye.anchor;for(const [k,v] of Object.entries({dx:a.dx,dy:a.dy,ring:a.ring,inset:p.eye.inset})){const el=$(`[data-eye="${k}"]`);if(el)el.value=v;const out=$(`#out${k[0].toUpperCase()+k.slice(1)}`);if(out)out.value=Number(v).toFixed(3);}}
function mountEyes(){if(!state.actor||state.faceHost?.status!=='OK')return;state.eyes?.dispose?.();const head=state.catalog.heads.find(h=>h.id===$('#headSelect').value),p=profileFor(head.id),ctx=state.faceHost.faceCtx();const base=state.faceHost.report.baseColor;const rig=new EyeRig(ctx,{anchor:{...p.eye.anchor},pupilSize:p.eye.pupilSize,inset:p.eye.inset,lidFit:p.eye.lidFit,splay:p.eye.splay,baseColor:base,blink:p.blink,life:p.life,lashes:{length:0,density:0,width:1}});rig.build();rig.applyEmote(EXPR.neutral);for(let i=0;i<16;i++)rig.update(1/60);state.eyes={rig,update:dt=>rig.update(dt),dispose:()=>rig.dispose()};state.eyeVisible=true;$('#eyeRigBtn').textContent='Hide KFB EyeRig';state.mode='eyes';syncModeButtons();$('#stageMode').textContent='EYERIG';}
function toggleEyes(){if(!state.eyes){mountEyes();return;}state.eyeVisible=!state.eyeVisible;if(state.eyes.rig.rig)state.eyes.rig.rig.visible=state.eyeVisible;$('#eyeRigBtn').textContent=state.eyeVisible?'Hide KFB EyeRig':'Show KFB EyeRig';}
function toggleSourceEyes(){state.sourceEyesVisible=!state.sourceEyesVisible;const n=setLegacySourceEyeVisibility(state.headPart,state.sourceEyesVisible);$('#sourceEyesBtn').textContent=state.sourceEyesVisible?'Hide source eyes':'Show source eyes';$('#eyeSourceReport').textContent+=`\nsource black-face materials toggled: ${n}`;}
async function applyWeapons(){if(!state.actor)return;const scale=Number($('#weaponScale').value),roll=THREE.MathUtils.degToRad(Number($('#weaponRoll').value));for(const side of ['right','left']){const id=$(side==='right'?'#rightWeapon':'#leftWeapon').value;const item=[...state.catalog.weapons,...state.catalog.accessories.filter(a=>a.path)].find(x=>x.id===id);if(!item){state.actor.held?.[side]?.removeFromParent?.();continue;}await mountHeldProp({THREE,loader,character:state.actor,url:sourceUrl(item.path),side,scale,rotation:[0,0,side==='left'?-roll:roll],log:console.log});}}
function playMotion(name){if(!state.actor||!state.mixer)return;const clip=playClip(state.actor,state.mixer,name);if(!clip){$('#motionStatus').textContent=`${name}: unavailable`;return;}state.currentMotion=name;$$('[data-motion]').forEach(b=>b.classList.toggle('active',b.dataset.motion===name));$('#motionStatus').textContent=`${name} · native Rig_Legacy · ${clip.duration.toFixed(2)} s`;}
function eyeParam(k,v){const head=state.catalog.heads.find(h=>h.id===$('#headSelect').value),p=profileFor(head.id);if(k==='inset')p.eye.inset=v;else p.eye.anchor[k]=v;p.status='ADJUSTED_CANDIDATE';save();bindEyeUi(p);if(state.eyes){if(k==='inset'){state.eyes.rig.inset=v;state.eyes.rig.build();}else state.eyes.rig.setAnchor({[k]:v});}}
function review(status){const id=$('#headSelect').value,p=profileFor(id);p.status=status;state.reviews[id]=status;save();updateReviewProgress();setBadge(status,status.includes('APPROVED')?'ok':'candidate');}
function nextHead(){const hs=state.catalog.heads;const i=hs.findIndex(h=>!state.reviews[h.id]);if(i>=0){$('#headSelect').value=hs[i].id;assemble();}}
function syncModeButtons(){$$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));}
function setMode(m){if(m==='sheet'){state.mode='sheet';syncModeButtons();$('#packSheet').hidden=false;state.renderer.domElement.style.display='none';$('#stageMode').textContent='PACK SHEET';return;}$('#packSheet').hidden=true;state.renderer.domElement.style.display='block';if(m==='source'){isolate(state.catalog.characters.find(c=>c.id===$('#bodySelect').value),'characters');return;}if(!state.actor){assemble();return;}state.mode=m;syncModeButtons();if(m==='eyes'&&!state.eyes)mountEyes();$('#stageMode').textContent=m.toUpperCase();}

function wire(){
  $$('[data-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;$$('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));renderCatalog();});$('#search').oninput=renderCatalog;
  $$('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));$$('[data-view]').forEach(b=>b.onclick=()=>{state.currentView=b.dataset.view;$$('[data-view]').forEach(x=>x.classList.toggle('active',x===b));frame(state.actor?.root||state.sourceNode);});$('#frameBtn').onclick=()=>frame(state.actor?.root||state.sourceNode);
  $('#assembleBtn').onclick=assemble;$('#bodySelect').onchange=()=>{const preferred=state.catalog.heads.find(h=>h.character===$('#bodySelect').value&&h.kind==='embedded');if(preferred)$('#headSelect').value=preferred.id;};$('#headSelect').onchange=()=>{if(state.actor)assemble();};$('#headExtrasToggle').onchange=()=>{if(state.actor)assemble();};
  $('#rightWeapon').onchange=applyWeapons;$('#leftWeapon').onchange=applyWeapons;$('#weaponScale').oninput=applyWeapons;$('#weaponRoll').oninput=applyWeapons;
  $$('[data-motion]').forEach(b=>b.onclick=()=>playMotion(b.dataset.motion));$('#motionAll').onchange=e=>{if(e.target.value)playMotion(e.target.value);};
  $('#eyeRigBtn').onclick=toggleEyes;$('#sourceEyesBtn').onclick=toggleSourceEyes;$$('[data-eye]').forEach(el=>el.oninput=()=>eyeParam(el.dataset.eye,Number(el.value)));$$('[data-expr]').forEach(b=>b.onclick=()=>{if(!state.eyes)mountEyes();$$('[data-expr]').forEach(x=>x.classList.toggle('active',x===b));state.eyes?.rig.applyEmote(EXPR[b.dataset.expr]);});$('#blinkBtn').onclick=()=>state.eyes?.rig.blinkNow();$$('[data-review]').forEach(b=>b.onclick=()=>review(b.dataset.review));$('#nextHeadBtn').onclick=nextHead;
}

boot().catch(e=>{console.error(e);$('#bootBadge').textContent='BOOT FAIL';$('#bootBadge').className='badge danger';$('#modeHint').textContent=e.message;});
