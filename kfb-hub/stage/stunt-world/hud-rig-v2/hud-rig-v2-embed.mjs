import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function mountHudV2({parentWindow, parentDocument, hostWindow, hostDocument, config={}}){
  const SOURCES=config.sources||{};
  const DONOR_PIN=config.donorPin||'UNPINNED';
  let width=parentWindow.innerWidth,height=parentWindow.innerHeight,mobile=false;
  let bearing=Number.isFinite(config.bearing)?config.bearing:32;
  let ready=false,error=null,disposed=false;
  const rigs=new Map(),actions=[];
  const assetStatus={radio:{loaded:false,nodeNames:[]},arrow:{loaded:false,nodeNames:[]},gear:{loaded:false,nodeNames:[]}};
  const RADIO_ZONES={
    'radio.next':{x:.17,y:.40,w:.43,h:.16},
    'radio.volDown':{x:.61,y:.54,w:.105,h:.20},
    'radio.volUp':{x:.715,y:.54,w:.105,h:.20},
    'radio.play':{x:.76,y:.71,w:.16,h:.19}
  };

  const canvas=parentDocument.createElement('canvas');
  canvas.id='kfbHudV2Canvas';
  canvas.setAttribute('aria-label','KFB HUD Rig v2');
  Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',zIndex:'12',pointerEvents:'none'});
  parentDocument.body.appendChild(canvas);

  const failure=parentDocument.createElement('div');
  failure.id='kfbHudV2Failure';
  Object.assign(failure.style,{display:'none',position:'fixed',left:'12px',top:'12px',zIndex:'40',padding:'10px 12px',background:'#6b1713',color:'#fff0e8',font:'700 12px system-ui',borderRadius:'8px'});
  parentDocument.body.appendChild(failure);

  const fovDebug=parentDocument.createElement('div');
  Object.assign(fovDebug.style,{display:config.debug?'block':'none',position:'fixed',zIndex:'11',pointerEvents:'none',border:'2px dashed #ffce55aa',background:'#ffce5508'});
  parentDocument.body.appendChild(fovDebug);

  const hitRoot=hostDocument.createElement('div');
  hitRoot.id='kfbHudV2Hits';
  Object.assign(hitRoot.style,{position:'fixed',inset:'0',zIndex:'1000',pointerEvents:'none'});
  hostDocument.body.appendChild(hitRoot);

  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(parentWindow.devicePixelRatio||1,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1;
  renderer.setClearColor(0,0);

  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,-1000,1000);
  camera.position.z=100;
  scene.add(new THREE.AmbientLight(0xffffff,2.5));
  const key=new THREE.DirectionalLight(0xffe7bd,4);key.position.set(-200,250,500);scene.add(key);
  const fill=new THREE.DirectionalLight(0x98d5df,1.8);fill.position.set(250,-90,400);scene.add(fill);

  function fail(id,reason){
    error=String(id)+': '+String(reason);
    failure.textContent='SOURCE ASSET FAILED · '+error;
    failure.style.display='block';
  }
  function centerObject(root,orientation=null){
    const oriented=new THREE.Group();oriented.add(root);
    if(orientation)orientation(oriented,root);
    oriented.updateMatrixWorld(true);
    const box=new THREE.Box3().setFromObject(oriented),center=new THREE.Vector3(),size=new THREE.Vector3();
    box.getCenter(center);box.getSize(size);
    const centered=new THREE.Group();centered.add(oriented);oriented.position.sub(center);oriented.updateMatrixWorld(true);
    return {centered,size};
  }
  function register(id,root,size){
    const holder=new THREE.Group(),motion=new THREE.Group();holder.add(motion);motion.add(root);scene.add(holder);
    const rig={id,holder,motion,root,naturalW:Math.max(.0001,size.x),naturalH:Math.max(.0001,size.y),rect:null,clickUntil:0};
    rigs.set(id,rig);return rig;
  }
  function rectsIntersect(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
  function layoutSpec(){
    return mobile?{
      radio:{cx:56,cy:116,w:96},arrow:{cx:width-54,cy:126,w:68},gear:{cx:width-34,cy:36,w:40},
      fov:{x:width*.28,y:height*.17,w:width*.44,h:height*.40},
      touchBand:{x:0,y:height-122,w:width,h:122}
    }:{
      radio:{cx:width-142,cy:height-104,w:218},arrow:{cx:width-86,cy:160,w:86},gear:{cx:width-42,cy:44,w:52},
      fov:{x:width*.28,y:height*.12,w:width*.44,h:height*.54},
      touchBand:null
    };
  }
  function place(id,spec){
    const rig=rigs.get(id);if(!rig)return null;
    const scale=spec.w/rig.naturalW,h=rig.naturalH*scale;
    rig.holder.scale.setScalar(scale);
    rig.holder.position.set(spec.cx-width/2,height/2-spec.cy,0);
    rig.rect={x:spec.cx-spec.w/2,y:spec.cy-h/2,w:spec.w,h};
    return rig.rect;
  }
  function updateHit(el,rect){
    Object.assign(el.style,{left:rect.x+'px',top:rect.y+'px',width:rect.w+'px',height:rect.h+'px'});
  }
  function makeHit(action){
    const el=hostDocument.createElement('div');
    el.dataset.action=action;el.setAttribute('role','button');el.setAttribute('aria-label',action);
    Object.assign(el.style,{position:'fixed',pointerEvents:'auto',background:'transparent',touchAction:'manipulation'});
    el.addEventListener('pointerdown',ev=>{ev.preventDefault();fire(action)});
    return el;
  }
  function refreshHits(){
    hitRoot.replaceChildren();
    const radio=rigs.get('radio')?.rect,gear=rigs.get('gear')?.rect;
    if(radio)for(const [action,z] of Object.entries(RADIO_ZONES)){
      const el=makeHit(action);
      updateHit(el,{x:radio.x+radio.w*z.x,y:radio.y+radio.h*z.y,w:radio.w*z.w,h:radio.h*z.h});
      hitRoot.appendChild(el);
    }
    if(gear){
      const el=makeHit('settings.toggle');
      updateHit(el,{x:gear.x-7,y:gear.y-7,w:gear.w+14,h:gear.h+14});
      hitRoot.appendChild(el);
    }
  }
  function fire(action){
    actions.push({action,t:parentWindow.performance.now()});if(actions.length>30)actions.shift();
    const id=action.startsWith('radio.')?'radio':'gear',rig=rigs.get(id);
    if(rig)rig.clickUntil=parentWindow.performance.now()+140;
    if(action==='settings.toggle'){
      const open=hostDocument.documentElement.classList.toggle('kfb-hud-v2-tools');
      const topbar=hostDocument.getElementById('topbar');
      if(topbar)topbar.style.setProperty('display',open?'flex':'none','important');
    }
    hostWindow.dispatchEvent(new hostWindow.CustomEvent('kfb-hud-action',{detail:{action,source:'HUD_RIG_V2'}}));
    hostDocument.getElementById('view')?.focus({preventScroll:true});
  }
  function applyLayout(){
    width=parentWindow.innerWidth;height=parentWindow.innerHeight;
    mobile=width<=620||parentWindow.matchMedia('(pointer:coarse)').matches;
    renderer.setSize(width,height,false);
    camera.left=-width/2;camera.right=width/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();
    const s=layoutSpec();place('radio',s.radio);place('arrow',s.arrow);place('gear',s.gear);
    Object.assign(fovDebug.style,{left:s.fov.x+'px',top:s.fov.y+'px',width:s.fov.w+'px',height:s.fov.h+'px'});
    refreshHits();
  }
  function setBearing(v){
    bearing=Number(v)||0;const rig=rigs.get('arrow');
    if(rig)rig.motion.rotation.z=Math.PI/2-THREE.MathUtils.degToRad(bearing);
  }
  async function loadAsset(id,url,orientation){
    try{
      const gltf=await new GLTFLoader().loadAsync(url),root=gltf.scene;
      root.traverse(o=>assetStatus[id].nodeNames.push(o.name||o.type));
      const {centered,size}=centerObject(root,orientation);register(id,centered,size);assetStatus[id].loaded=true;
    }catch(e){fail(id,e?.message||e)}
  }
  function snapshot(){
    const s=layoutSpec(),rigRects=Object.fromEntries([...rigs].map(([id,r])=>[id,r.rect?{...r.rect}:null]));
    const fovClear=Object.values(rigRects).filter(Boolean).every(r=>!rectsIntersect(r,s.fov));
    const touchClear=!s.touchBand||Object.values(rigRects).filter(Boolean).every(r=>!rectsIntersect(r,s.touchBand));
    return {
      ready,error,donorPin:DONOR_PIN,assets:JSON.parse(JSON.stringify(assetStatus)),bearing,mobile,
      composition:{fov:{...s.fov},touchBand:s.touchBand?{...s.touchBand}:null,rigRects,fovClear,touchBandClear:touchClear},
      inputOwnership:{keyboardKeysOwned:[],pointerOnly:true,audioContextCreated:false,questTruthOwned:false},
      hostUi:{toolsOpen:hostDocument.documentElement.classList.contains('kfb-hud-v2-tools')},
      actions:[...actions]
    };
  }
  function dispose(){
    disposed=true;parentWindow.removeEventListener('resize',applyLayout);canvas.remove();failure.remove();fovDebug.remove();hitRoot.remove();renderer.dispose();
    try{if(parentWindow.__KFB_HUD_V2__===api)delete parentWindow.__KFB_HUD_V2__}catch{}
    try{if(hostWindow.__KFB_HUD_V2__===api)delete hostWindow.__KFB_HUD_V2__}catch{}
  }
  const api={version:'2.0.0-stage',get ready(){return ready||!!error},snapshot,setBearing,dispose};
  // Overlay state belongs to the Stage wrapper realm; mirror the API into the same-origin host only for integration/debug consumers.
  parentWindow.__KFB_HUD_V2__=api;
  hostWindow.__KFB_HUD_V2__=api;

  parentWindow.addEventListener('resize',applyLayout);
  let start=parentWindow.performance.now();
  function frame(now){
    if(disposed)return;
    const t=(now-start)/1000,arrow=rigs.get('arrow');
    if(arrow){const s=layoutSpec().arrow;arrow.holder.position.y=height/2-s.cy+Math.sin(t*3.1)*2}
    for(const rig of rigs.values()){const pressed=now<rig.clickUntil;rig.motion.scale.setScalar(pressed?.95:1)}
    renderer.render(scene,camera);parentWindow.requestAnimationFrame(frame);
  }
  parentWindow.requestAnimationFrame(frame);

  await Promise.all([
    loadAsset('radio',SOURCES.radio),
    loadAsset('arrow',SOURCES.arrow,g=>{g.rotation.x=-Math.PI/2}),
    loadAsset('gear',SOURCES.gear)
  ]);
  if(!error){applyLayout();setBearing(bearing);ready=true}
  return api;
}
