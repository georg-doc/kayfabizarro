import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const SOURCE_PIN='13bee1bb6db0f27fbd13da2a3750f19859ca58af';
const RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+SOURCE_PIN+'/';
const ASSETS=Object.freeze({
  radio:RAW+'media/3D_Assets/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/radio.gltf',
  arrow:RAW+'media/3D_Assets/Platformer%20Game%20Kit%20-%20Dec%202021/Level%20and%20Mechanics/glTF/Arrow.gltf',
  gear:RAW+'media/3D_Assets/GEAR_ICON.glb'
});
const FONT_URL='https://raw.githubusercontent.com/mrdoob/three.js/r160/examples/fonts/helvetiker_bold.typeface.json';
const LAYOUT_KEY='kfb.hud-rig-layout.v1';
const DEFAULT_LAYOUT=Object.freeze({
  pop:{x:.135,y:.095,scale:1},
  hanger:{x:.50,y:.085,scale:1},
  nav:{x:.50,y:.225,scale:1},
  gear:{x:.945,y:.095,scale:1},
  radio:{x:.855,y:.825,scale:1},
  tacho:{x:.105,y:.825,scale:1}
});
const TARGETS=Object.freeze({
  quest:{color:0xf05d6b,label:'QUEST'},
  card:{color:0xf0ca59,label:'CARD'},
  npc:{color:0x63d7cf,label:'NPC STOP'},
  poi:{color:0x9bcc6b,label:'POI'}
});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;

const canvas=document.getElementById('gl');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;

const worldScene=new THREE.Scene();
worldScene.background=new THREE.Color(0x83c8cc);
worldScene.fog=new THREE.Fog(0x83c8cc,26,88);
const worldCamera=new THREE.PerspectiveCamera(48,1,.1,140);
worldCamera.position.set(0,7.4,14.5);
worldCamera.lookAt(0,1,-22);
worldScene.add(new THREE.HemisphereLight(0xfff0ca,0x355f63,2.15));
const sun=new THREE.DirectionalLight(0xffe0a1,3.2);sun.position.set(-12,22,8);worldScene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(160,170),new THREE.MeshStandardMaterial({color:0x73966d,roughness:1}));
ground.rotation.x=-Math.PI/2;ground.position.set(0,-.05,-50);worldScene.add(ground);
const road=new THREE.Mesh(new THREE.PlaneGeometry(15,150),new THREE.MeshStandardMaterial({color:0x393932,roughness:.92}));
road.rotation.x=-Math.PI/2;road.position.set(0,0,-55);worldScene.add(road);
const laneMat=new THREE.MeshBasicMaterial({color:0xe8d77a});
const laneMarkers=[];
for(let i=0;i<22;i++){
  const m=new THREE.Mesh(new THREE.PlaneGeometry(.18,2.8),laneMat);
  m.rotation.x=-Math.PI/2;m.position.set(0,.015,10-i*7);worldScene.add(m);laneMarkers.push(m);
}
const railMat=new THREE.MeshStandardMaterial({color:0xb65e45,roughness:.75});
for(const x of [-7.8,7.8]){
  const rail=new THREE.Mesh(new THREE.BoxGeometry(.35,.55,150),railMat);
  rail.position.set(x,.25,-55);worldScene.add(rail);
}
const propMat=new THREE.MeshStandardMaterial({color:0xd6b858,roughness:.88});
for(let i=0;i<26;i++){
  const h=2+(i*17%7)*.55;
  const b=new THREE.Mesh(new THREE.BoxGeometry(1.6+(i%3)*.45,h,1.8),propMat.clone());
  b.material.color.offsetHSL((i%5)*.035,0,0);
  b.position.set((i%2?-1:1)*(11+(i%4)*2.6),h/2,-8-i*5.6);
  b.rotation.y=(i%4)*.22;worldScene.add(b);
}

const hudScene=new THREE.Scene();
const hudCamera=new THREE.OrthographicCamera(-1,1,1,-1,-1000,1000);
hudCamera.position.z=100;
hudScene.add(new THREE.AmbientLight(0xffffff,2.4));
const hudKey=new THREE.DirectionalLight(0xffedc5,4.0);hudKey.position.set(-200,300,500);hudScene.add(hudKey);
const hudFill=new THREE.DirectionalLight(0x91d7ef,2.1);hudFill.position.set(250,-120,300);hudScene.add(hudFill);

let width=innerWidth,height=innerHeight;
let layout=loadLayout();
let editMode=false,reducedMotion=false,showHitZones=false;
let score=1250,hangerMode='wordmark';
let telemetry={lateral:.18,longitudinal:.12,speedNorm:.42,bank:0};
let beat={available:false,pulse:0,phase:0,source:'none'};
let nav={active:true,type:'quest',bearing:32,distance:480,resolvedType:'quest'};
let currentHover=null,drag=null,pointerDownAction=null;
let radioState={playing:false,trackIndex:0,volume:.45,title:'ROADTRIP'};
const actions=[];
const assetStatus={
  sourcePin:SOURCE_PIN,
  radio:{url:ASSETS.radio,loaded:false,handleRemoved:false},
  arrow:{url:ASSETS.arrow,loaded:false},
  gear:{url:ASSETS.gear,loaded:false},
  wordmarkFont:{url:FONT_URL,loaded:false}
};

function cloneLayout(source){return Object.fromEntries(Object.entries(source).map(([k,v])=>[k,{...v}]))}
function loadLayout(){
  try{
    const parsed=JSON.parse(localStorage.getItem(LAYOUT_KEY)||'null');
    const out=cloneLayout(DEFAULT_LAYOUT);
    for(const id of Object.keys(out))if(parsed?.[id]){
      out[id].x=clamp(Number(parsed[id].x)||out[id].x,.03,.97);
      out[id].y=clamp(Number(parsed[id].y)||out[id].y,.03,.97);
      out[id].scale=clamp(Number(parsed[id].scale)||1,.5,1.8);
    }
    return out;
  }catch{return cloneLayout(DEFAULT_LAYOUT)}
}
function saveLayout(){localStorage.setItem(LAYOUT_KEY,JSON.stringify(layout))}

function canvasPlane(w,h,draw){
  const c=document.createElement('canvas');c.width=Math.max(2,Math.round(w*2));c.height=Math.max(2,Math.round(h*2));
  const g=c.getContext('2d');draw(g,c.width,c.height);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.minFilter=THREE.LinearFilter;
  const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthTest:false,depthWrite:false});
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);plane.renderOrder=30;
  return {plane,canvas:c,ctx:g,texture:tex,material:mat};
}
function redrawCanvasTexture(surface,draw){
  const {ctx,canvas,texture}=surface;ctx.clearRect(0,0,canvas.width,canvas.height);draw(ctx,canvas.width,canvas.height);texture.needsUpdate=true;
}
function invisibleHit(w,h,z=12){
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthTest:false,depthWrite:false,side:THREE.DoubleSide}));
  m.position.z=z;m.renderOrder=40;return m;
}
function fitObject(object,targetWidth){
  const box=new THREE.Box3().setFromObject(object),size=new THREE.Vector3(),center=new THREE.Vector3();
  box.getSize(size);box.getCenter(center);
  const holder=new THREE.Group();holder.add(object);object.position.sub(center);
  holder.scale.setScalar(targetWidth/Math.max(.0001,size.x));
  return {holder,size,scale:targetWidth/Math.max(.0001,size.x)};
}
function cloneMaterials(root){
  root.traverse(o=>{if(o.isMesh){
    if(Array.isArray(o.material))o.material=o.material.map(m=>m.clone());
    else if(o.material)o.material=o.material.clone();
  }});
}
function setEmissive(root,intensity,color=0xffd45d){
  root.traverse(o=>{if(!o.isMesh)return;const mats=Array.isArray(o.material)?o.material:[o.material];
    for(const m of mats)if(m&&'emissive' in m){if(!m.userData.__baseEmissive){m.userData.__baseEmissive=m.emissive.clone();m.userData.__baseEmissiveIntensity=m.emissiveIntensity||0}
      if(intensity>0){m.emissive.setHex(color);m.emissiveIntensity=intensity}else{m.emissive.copy(m.userData.__baseEmissive);m.emissiveIntensity=m.userData.__baseEmissiveIntensity}
    }
  });
}

const rigs=new Map(),actionMeshes=[],dragMeshes=[];
function registerRig(id,object,{w,h,kinetic=1,beatWeight=.025,visible=true}){
  const root=new THREE.Group(),motion=new THREE.Group();root.add(motion);motion.add(object);hudScene.add(root);
  const dragHit=invisibleHit(w,h,8);dragHit.userData.dragRig=id;motion.add(dragHit);dragMeshes.push(dragHit);
  const rig={id,root,motion,object,dragHit,w,h,kinetic,beatWeight,visible,hover:false,clickUntil:0,
    roll:0,rollVel:0,pitch:0,pitchVel:0,scale:1,scaleVel:0};
  rigs.set(id,rig);root.visible=visible;applyLayout(id);return rig;
}
function applyLayout(id){
  const rig=rigs.get(id);if(!rig)return;const p=layout[id]||DEFAULT_LAYOUT[id],s=p.scale||1,margin=8;
  const halfW=Math.min(width*.48,rig.w*s*.5+margin),halfH=Math.min(height*.48,rig.h*s*.5+margin);
  const sx=clamp(p.x*width,halfW,width-halfW),sy=clamp(p.y*height,halfH,height-halfH);
  rig.root.position.set(sx-width/2,height/2-sy,0);rig.root.scale.setScalar(s);
}
function applyAllLayouts(){for(const id of rigs.keys())applyLayout(id)}
function registerAction(mesh,action,rigId){
  mesh.userData.hudAction=action;mesh.userData.rigId=rigId;actionMeshes.push(mesh);return mesh;
}
function fireAction(action,detail={}){
  actions.push({action,t:performance.now(),...detail});if(actions.length>40)actions.shift();
  window.dispatchEvent(new CustomEvent('kfb-hud-action',{detail:{action,...detail}}));
  const rigId=detail.rigId;const rig=rigs.get(rigId);if(rig)rig.clickUntil=performance.now()+175;
  if(action==='settings.open')openSettings();
  if(action==='radio.play'){radioState.playing=!radioState.playing;radioState.title=radioState.playing?'ROADTRIP · PLAY':'ROADTRIP · PAUSED';updateRadioDisplay()}
  if(action==='radio.next'){radioState.trackIndex++;radioState.title='ROADTRIP · TRACK '+(radioState.trackIndex+1);updateRadioDisplay()}
  if(action==='radio.volDown'){radioState.volume=clamp(radioState.volume-.08,0,1);updateRadioDisplay()}
  if(action==='radio.volUp'){radioState.volume=clamp(radioState.volume+.08,0,1);updateRadioDisplay()}
}

let popSurface,popRig;
function buildPop(){
  const surface=canvasPlane(210,72,(g,w,h)=>drawPop(g,w,h));popSurface=surface;
  popRig=registerRig('pop',surface.plane,{w:210,h:72,kinetic:.5,beatWeight:.018});
  surface.plane.position.z=1;
}
function drawPop(g,w,h){
  g.save();g.scale(w/420,h/144);
  g.font="72px Bangers, Impact, sans-serif";g.textBaseline='middle';
  g.lineWidth=10;g.strokeStyle='rgba(24,21,16,.95)';g.fillStyle='#f5dc70';
  g.strokeText('POP',14,57);g.fillText('POP',14,57);
  g.font="64px Bangers, Impact, sans-serif";g.textAlign='right';g.strokeText(String(score),408,91);g.fillStyle='#f4edda';g.fillText(String(score),408,91);
  g.restore();
}
function setPop(value){score=Math.max(0,Math.round(value));if(popSurface)redrawCanvasTexture(popSurface,drawPop);if(popRig)popRig.clickUntil=performance.now()+260}

let navRig,arrowModel,navSurface;
function buildNavPlaceholder(){
  const group=new THREE.Group();
  const cone=new THREE.Mesh(new THREE.ConeGeometry(22,70,4),new THREE.MeshStandardMaterial({color:TARGETS.quest.color,roughness:.5}));
  cone.rotation.z=-Math.PI/2;group.add(cone);
  navSurface=makeNavLabel();navSurface.plane.position.set(0,-73,3);group.add(navSurface.plane);
  navRig=registerRig('nav',group,{w:155,h:150,kinetic:.3,beatWeight:.05});
  arrowModel=cone;applyNavVisual();
}
function makeNavLabel(){
  return canvasPlane(155,36,(g,w,h)=>{g.font='700 26px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#181510cc';g.fillRect(26,6,w-52,h-12);g.fillStyle='#f4edda';g.fillText('QUEST · 480m',w/2,h/2)});
}
function redrawNavLabel(){
  const state=TARGETS[nav.resolvedType];redrawCanvasTexture(navSurface,(g,w,h)=>{
    g.font='700 26px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#181510d9';g.fillRect(12,5,w-24,h-10);
    g.fillStyle='#f4edda';g.fillText(state.label+' · '+Math.max(1,Math.round(nav.distance))+'m',w/2,h/2);
  });
}
function applyNavVisual(){
  if(!arrowModel||!navSurface)return;nav.resolvedType=nav.active?(nav.type in TARGETS?nav.type:'quest'):'poi';
  const state=TARGETS[nav.resolvedType];
  arrowModel.traverse?.(o=>{if(o.isMesh){const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats)if(m?.color)m.color.setHex(state.color)}});
  if(arrowModel.material?.color)arrowModel.material.color.setHex(state.color);
  arrowModel.rotation.z=-Math.PI/2-THREE.MathUtils.degToRad(nav.bearing);
  redrawNavLabel();
}
function setNavigation(next={}){
  if('active' in next)nav.active=!!next.active;if(next.type)nav.type=next.type;if(Number.isFinite(next.bearing))nav.bearing=next.bearing;if(Number.isFinite(next.distance))nav.distance=next.distance;
  applyNavVisual();return nav.resolvedType;
}

let gearRig,gearVisual;
function buildGearPlaceholder(){
  const mesh=new THREE.Mesh(new THREE.TorusGeometry(31,9,8,12),new THREE.MeshStandardMaterial({color:0xa54c2e,roughness:.78,metalness:.25}));
  gearVisual=mesh;gearRig=registerRig('gear',mesh,{w:86,h:86,kinetic:.2,beatWeight:.02});
  const hit=registerAction(invisibleHit(86,86,16),'settings.open','gear');gearRig.motion.add(hit);
}

let radioRig,radioHolder,radioDisplay,radioHitZoneMeshes=[];
function buildRadioPlaceholder(){
  const group=new THREE.Group();
  const body=new THREE.Mesh(new RoundedBoxGeometry(270,154,28,4,10),new THREE.MeshStandardMaterial({color:0x6e7964,roughness:.72}));
  group.add(body);
  radioDisplay=canvasPlane(128,30,(g,w,h)=>drawRadioDisplay(g,w,h));radioDisplay.plane.position.set(0,28,18);group.add(radioDisplay.plane);
  addRadioZones(group);
  radioHolder=group;radioRig=registerRig('radio',group,{w:290,h:190,kinetic:1.0,beatWeight:.035});
}
function drawRadioDisplay(g,w,h){
  g.fillStyle='#16170f';g.fillRect(0,0,w,h);g.font='700 22px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#d9c675';
  const t=(radioState.playing?'▶ ':'')+radioState.title+' · '+Math.round(radioState.volume*100)+'%';g.fillText(t.slice(0,31),w/2,h/2);
}
function updateRadioDisplay(){if(radioDisplay)redrawCanvasTexture(radioDisplay,drawRadioDisplay)}
function zoneMaterial(){
  return new THREE.MeshBasicMaterial({color:0xffd45d,transparent:true,opacity:showHitZones?.24:0,depthTest:false,depthWrite:false,side:THREE.DoubleSide});
}
function addRadioZones(group){
  for(const old of radioHitZoneMeshes){const i=actionMeshes.indexOf(old);if(i>=0)actionMeshes.splice(i,1);old.removeFromParent();old.geometry.dispose();old.material.dispose()}
  radioHitZoneMeshes=[];
  // Model-space hit zones follow visible Tiny Treats controls, never the speaker grille:
  // NEXT = red tuning slider, PLAY = small lower-right button,
  // VOL− / VOL+ = left/right halves of the large upper-right knob.
  const defs=[
    ['radio.next',-73,19,66,28],
    ['radio.play',88,-51,42,40],
    ['radio.volDown',55,-10,28,44],
    ['radio.volUp',78,-10,28,44]
  ];
  for(const [action,x,y,w,h] of defs){
    const m=registerAction(invisibleHit(w,h,24),action,'radio');m.material.dispose();m.material=zoneMaterial();m.position.set(x,y,24);
    group.add(m);radioHitZoneMeshes.push(m);
  }
}
function setHitZoneVisibility(v){showHitZones=!!v;for(const m of radioHitZoneMeshes)m.material.opacity=showHitZones?.24:0}

let hangerRig,hangerVariants={},wordPivots=[],dicePivots=[],discoCore=null,discoLights=[];
function buildHangers(){
  const root=new THREE.Group();
  const wordmark=new THREE.Group(),dice=new THREE.Group(),disco=new THREE.Group();
  root.add(wordmark,dice,disco);hangerVariants={wordmark,dice,disco};
  buildWordmarkFallback(wordmark);buildDiceCradle(dice);buildDisco(disco);
  hangerRig=registerRig('hanger',root,{w:350,h:190,kinetic:1.25,beatWeight:.045});
  setHanger('wordmark');
}
function buildWordmarkFallback(parent){
  const left=new THREE.Group(),right=new THREE.Group();left.position.x=-88;right.position.x=73;parent.add(left,right);wordPivots=[left,right];
  const make=(text,w,color)=>{
    const box=new THREE.Mesh(new RoundedBoxGeometry(w,42,12,3,5),new THREE.MeshStandardMaterial({color,roughness:.48,metalness:.12}));
    box.position.y=-62;const label=canvasPlane(w*.92,34,(g,cw,ch)=>{g.font='70px Bangers, Impact, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#17140f';g.fillText(text,cw/2,ch/2)});
    label.plane.position.set(0,-62,7);return [box,label.plane];
  };
  for(const m of make('Kayfa',135,0xe4bd4d))left.add(m);for(const m of make('Bizarro',174,0xb64e39))right.add(m);
}
function pipPattern(n){
  const a=[[-.48,-.48],[0,-.48],[.48,-.48],[-.48,0],[0,0],[.48,0],[-.48,.48],[0,.48],[.48,.48]];
  const map={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};return map[n].map(i=>a[i]);
}
function addDieFace(die,value,pos,rot){
  const face=new THREE.Group();face.position.copy(pos);face.rotation.set(rot.x,rot.y,rot.z);die.add(face);
  const mat=new THREE.MeshStandardMaterial({color:0xf7f0df,roughness:.5});
  for(const [x,y] of pipPattern(value)){
    const p=new THREE.Mesh(new THREE.CircleGeometry(3.4,16),mat);p.position.set(x*27,y*27,.5);face.add(p);
  }
}
function createDie(color,values=[1,6,3,4,2,5]){
  const die=new THREE.Group();die.add(new THREE.Mesh(new RoundedBoxGeometry(43,43,43,5,7),new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.04})));
  const h=21.65;
  addDieFace(die,values[0],new THREE.Vector3(0,0,h),new THREE.Euler());
  addDieFace(die,values[1],new THREE.Vector3(0,0,-h),new THREE.Euler(0,Math.PI,0));
  addDieFace(die,values[2],new THREE.Vector3(h,0,0),new THREE.Euler(0,Math.PI/2,0));
  addDieFace(die,values[3],new THREE.Vector3(-h,0,0),new THREE.Euler(0,-Math.PI/2,0));
  addDieFace(die,values[4],new THREE.Vector3(0,h,0),new THREE.Euler(-Math.PI/2,0,0));
  addDieFace(die,values[5],new THREE.Vector3(0,-h,0),new THREE.Euler(Math.PI/2,0,0));
  return die;
}
function buildDiceCradle(parent){
  const colors=[0xe05e50,0x55a9b0,0xd9b94f];dicePivots=[];
  for(let i=0;i<3;i++){
    const pivot=new THREE.Group();pivot.position.x=(i-1)*54;const die=createDie(colors[i],[i+1,6-i,3,4,2,5]);die.position.y=-72;die.rotation.y=i*.28;pivot.add(die);parent.add(pivot);dicePivots.push(pivot);
  }
}
function buildDisco(parent){
  const mat=new THREE.MeshPhysicalMaterial({color:0xe6e4df,metalness:1,roughness:.12,clearcoat:1,clearcoatRoughness:.08});
  const ball=new THREE.Mesh(new THREE.SphereGeometry(33,20,14),mat);ball.position.y=-68;parent.add(ball);discoCore=ball;
  const wire=new THREE.Mesh(new THREE.SphereGeometry(33.3,12,8),new THREE.MeshBasicMaterial({color:0x554d48,wireframe:true,transparent:true,opacity:.27,depthWrite:false}));ball.add(wire);
  const colors=[0xff4f6d,0x4fd7e0,0xffd25a];discoLights=[];
  for(let i=0;i<3;i++){const l=new THREE.PointLight(colors[i],75,145,1.3);l.position.set(Math.cos(i*2.1)*55,-68+Math.sin(i*2.1)*35,55);parent.add(l);discoLights.push(l)}
}
function setHanger(mode){
  if(!(mode in hangerVariants))mode='wordmark';hangerMode=mode;
  for(const [k,g] of Object.entries(hangerVariants))g.visible=k===mode;
  const el=document.getElementById('hangerMode');if(el&&el.value!==mode)el.value=mode;
}

let tachoRig;
function buildTachoSocket(){
  const root=new THREE.Group();
  const ring=new THREE.Mesh(new THREE.TorusGeometry(44,2.2,8,42),new THREE.MeshBasicMaterial({color:0xe4c86f,transparent:true,opacity:.72,depthTest:false}));root.add(ring);
  const label=canvasPlane(116,44,(g,w,h)=>{g.font='700 21px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#17140fcc';g.fillRect(0,0,w,h);g.fillStyle='#e9d47f';g.fillText('TACHO SOCKET',w/2,h*.38);g.font='500 14px system-ui';g.fillStyle='#ddd2bc';g.fillText('3D MODEL OPEN',w/2,h*.72)});
  root.add(label.plane);tachoRig=registerRig('tacho',root,{w:130,h:110,kinetic:.7,beatWeight:.015,visible:false});
}

function replaceRadioWithAsset(scene){
  let handle=null;scene.traverse(o=>{if((o.name||'').toLowerCase()==='radio_handle')handle=o});
  if(handle?.parent){handle.parent.remove(handle);assetStatus.radio.handleRemoved=true}
  cloneMaterials(scene);
  const fitted=fitObject(scene,270),group=new THREE.Group();group.add(fitted.holder);
  fitted.holder.position.y=-2;
  radioDisplay=canvasPlane(142,27,(g,w,h)=>drawRadioDisplay(g,w,h));radioDisplay.plane.position.set(0,44,36);group.add(radioDisplay.plane);
  addRadioZones(group);
  radioRig.object.removeFromParent();radioRig.object=group;radioRig.motion.add(group);radioHolder=group;
  assetStatus.radio.loaded=true;
}
function replaceGearWithAsset(scene){
  cloneMaterials(scene);const fitted=fitObject(scene,78);gearRig.object.removeFromParent();gearRig.object=fitted.holder;gearRig.motion.add(fitted.holder);gearVisual=fitted.holder;assetStatus.gear.loaded=true;
}
function replaceArrowWithAsset(scene){
  cloneMaterials(scene);const fitted=fitObject(scene,112),orient=new THREE.Group();
  fitted.holder.rotation.x=-Math.PI/2;orient.add(fitted.holder);
  const old=arrowModel;old.removeFromParent();navRig.object.add(orient);arrowModel=orient;assetStatus.arrow.loaded=true;applyNavVisual();
}
async function replaceWordmarkWithText(){
  try{
    const font=await new FontLoader().loadAsync(FONT_URL);assetStatus.wordmarkFont.loaded=true;
    const parent=hangerVariants.wordmark;parent.clear();wordPivots=[];
    const specs=[['Kayfa',-108,0xe2bc4d],['Bizarro',102,0xb64b36]];
    for(const [word,x,color] of specs){
      const pivot=new THREE.Group();pivot.position.x=x;parent.add(pivot);wordPivots.push(pivot);
      const geo=new TextGeometry(word,{font,size:37,depth:8,curveSegments:4,bevelEnabled:true,bevelThickness:1.7,bevelSize:1.25,bevelSegments:2});
      geo.computeBoundingBox();const box=geo.boundingBox,center=(box.max.x+box.min.x)/2;
      geo.translate(-center,-17,0);
      const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,roughness:.42,metalness:.12}));
      mesh.position.y=-69;mesh.rotation.x=-.08;pivot.add(mesh);
    }
  }catch(err){assetStatus.wordmarkFont.error=String(err)}
}

const loader=new GLTFLoader();
async function loadExactAssets(){
  const tasks=[
    loader.loadAsync(ASSETS.radio).then(g=>replaceRadioWithAsset(g.scene)).catch(e=>assetStatus.radio.error=String(e)),
    loader.loadAsync(ASSETS.arrow).then(g=>replaceArrowWithAsset(g.scene)).catch(e=>assetStatus.arrow.error=String(e)),
    loader.loadAsync(ASSETS.gear).then(g=>replaceGearWithAsset(g.scene)).catch(e=>assetStatus.gear.error=String(e)),
    replaceWordmarkWithText()
  ];
  await Promise.all(tasks);
  const ok=assetStatus.radio.loaded&&assetStatus.arrow.loaded&&assetStatus.gear.loaded;
  document.getElementById('loadState').textContent=ok?'exact assets loaded · source-pinned':'asset fallback active · inspect diagnostics';
  window.__KFB_HUD_RIG_V1__.ready=true;
}

function updateMotion(dt,t){
  const h=Math.min(.04,dt),lat=reducedMotion?0:clamp(telemetry.lateral,-1,1),lon=reducedMotion?0:clamp(telemetry.longitudinal,-1,1);
  const beatPulse=reducedMotion?0:(beat.available?clamp(beat.pulse,0,1):0);
  for(const rig of rigs.values()){
    if(!rig.root.visible)continue;
    const rollGoal=-lat*.095*rig.kinetic,pitchGoal=lon*.055*rig.kinetic;
    rig.rollVel+=((rollGoal-rig.roll)*82-rig.rollVel*14)*h;rig.roll+=rig.rollVel*h;
    rig.pitchVel+=((pitchGoal-rig.pitch)*70-rig.pitchVel*13)*h;rig.pitch+=rig.pitchVel*h;
    const now=performance.now(),hoverBoost=rig.hover?1.055:1,clickBoost=now<rig.clickUntil ? .93 : 1;
    const scaleGoal=hoverBoost*clickBoost*(1+beatPulse*rig.beatWeight);
    rig.scaleVel+=((scaleGoal-rig.scale)*95-rig.scaleVel*16)*h;rig.scale+=rig.scaleVel*h;
    rig.motion.rotation.z=rig.roll;rig.motion.rotation.x=rig.pitch;rig.motion.scale.setScalar(rig.scale);
  }
  if(gearVisual)gearVisual.rotation.z+=h*(rigs.get('gear')?.hover?2.4:.34);
  if(arrowModel){const base=-Math.PI/2-THREE.MathUtils.degToRad(nav.bearing);arrowModel.rotation.z=base+Math.sin(t*4.3)*(.025+.025*beatPulse);arrowModel.position.y=Math.sin(t*3.4)*4}
  const pendBias=-lat*.11+lon*.035;
  if(wordPivots.length===2){
    wordPivots[0].rotation.z=pendBias+Math.sin(t*1.9)*.035;wordPivots[1].rotation.z=pendBias*.82+Math.sin(t*1.72+.8)*.044;
    wordPivots[0].rotation.y=Math.sin(t*1.37)*.06;wordPivots[1].rotation.y=Math.sin(t*1.21+.9)*.07;
  }
  if(dicePivots.length===3){
    const wave=Math.sin(t*2.05),amp=.29;
    dicePivots[0].rotation.z=pendBias+(wave>0?wave*amp:wave*.04);
    dicePivots[1].rotation.z=pendBias*.75+Math.sin(t*4.1)*.014;
    dicePivots[2].rotation.z=pendBias+(wave<0?wave*amp:wave*.04);
  }
  if(discoCore){discoCore.rotation.y+=h*(.8+beatPulse*1.6);discoCore.rotation.x=.1*Math.sin(t*.7);
    discoCore.parent.rotation.z=pendBias+Math.sin(t*1.25)*.06;
    for(let i=0;i<discoLights.length;i++){const a=t*(.8+i*.13)+i*2.1;discoLights[i].position.x=Math.cos(a)*58;discoLights[i].position.z=38+Math.sin(a)*30}
  }
}

function rayFromPointer(clientX,clientY){
  const p=new THREE.Vector2(clientX/width*2-1,-clientY/height*2+1),r=new THREE.Raycaster();r.setFromCamera(p,hudCamera);return r;
}
function nearestHit(clientX,clientY,list){
  hudScene.updateMatrixWorld(true);const hits=rayFromPointer(clientX,clientY).intersectObjects(list,false);return hits.find(h=>h.object.visible&&h.object.parent?.visible!==false)?.object||null;
}
function setHover(rigId){
  if(currentHover===rigId)return;currentHover=rigId;
  for(const rig of rigs.values()){rig.hover=rig.id===rigId;setEmissive(rig.object,rig.hover ? .35 : 0)}
}
canvas.addEventListener('pointermove',e=>{
  if(drag){
    const p=layout[drag.id];p.x=clamp(e.clientX/width,.03,.97);p.y=clamp(e.clientY/height,.03,.97);applyLayout(drag.id);drag.moved=true;return;
  }
  const a=nearestHit(e.clientX,e.clientY,actionMeshes),d=nearestHit(e.clientX,e.clientY,dragMeshes);
  setHover(a?.userData.rigId||d?.userData.dragRig||null);canvas.style.cursor=(editMode&&d)?'grab':a?'pointer':'default';
});
canvas.addEventListener('pointerleave',()=>{if(!drag)setHover(null)});
canvas.addEventListener('pointerdown',e=>{
  canvas.setPointerCapture?.(e.pointerId);
  if(editMode){
    const d=nearestHit(e.clientX,e.clientY,dragMeshes);if(d){drag={id:d.userData.dragRig,pointerId:e.pointerId,moved:false};canvas.style.cursor='grabbing';e.preventDefault();return}
  }
  const hit=nearestHit(e.clientX,e.clientY,actionMeshes);if(hit){pointerDownAction=hit.userData.hudAction;hit.userData.downAt=performance.now();e.preventDefault()}
});
canvas.addEventListener('pointerup',e=>{
  if(drag&&drag.pointerId===e.pointerId){saveLayout();const id=drag.id;drag=null;canvas.style.cursor='grab';rigs.get(id).clickUntil=performance.now()+150;return}
  const hit=nearestHit(e.clientX,e.clientY,actionMeshes);if(hit&&hit.userData.hudAction===pointerDownAction)fireAction(hit.userData.hudAction,{rigId:hit.userData.rigId});
  pointerDownAction=null;
});

const settingsBackdrop=document.getElementById('settingsBackdrop');
function openSettings(){settingsBackdrop.classList.add('open');settingsBackdrop.setAttribute('aria-hidden','false')}
function closeSettings(){settingsBackdrop.classList.remove('open');settingsBackdrop.setAttribute('aria-hidden','true')}
document.getElementById('closeSettings').addEventListener('click',closeSettings);
settingsBackdrop.addEventListener('pointerdown',e=>{if(e.target===settingsBackdrop)closeSettings()});
document.getElementById('hangerMode').addEventListener('change',e=>setHanger(e.target.value));
document.getElementById('editMode').addEventListener('change',e=>{
  editMode=e.target.checked;document.getElementById('editTip').classList.toggle('show',editMode);tachoRig.root.visible=editMode;
});
document.getElementById('showHitZones').addEventListener('change',e=>setHitZoneVisibility(e.target.checked));
document.getElementById('reducedMotion').addEventListener('change',e=>reducedMotion=e.target.checked);
document.getElementById('beatDemo').addEventListener('change',()=>{});
document.getElementById('targetType').addEventListener('change',e=>setNavigation({active:e.target.value!=='poi',type:e.target.value}));
document.getElementById('bearing').addEventListener('input',e=>{const v=Number(e.target.value);document.getElementById('bearingValue').textContent=v+'°';setNavigation({bearing:v})});
for(const [id,key] of [['lateral','lateral'],['longitudinal','longitudinal']]){
  document.getElementById(id).addEventListener('input',e=>{telemetry[key]=Number(e.target.value);document.getElementById(id+'Value').textContent=telemetry[key].toFixed(2)});
}
document.getElementById('resetLayout').addEventListener('click',()=>{layout=cloneLayout(DEFAULT_LAYOUT);saveLayout();applyAllLayouts()});
document.getElementById('exportLayout').addEventListener('click',async e=>{const txt=JSON.stringify(layout,null,2);try{await navigator.clipboard.writeText(txt);e.target.textContent='Copied';setTimeout(()=>e.target.textContent='Copy layout JSON',900)}catch{e.target.textContent='Copy unavailable'}});
document.getElementById('popMinus').addEventListener('click',()=>setPop(score-25));
document.getElementById('popPlus').addEventListener('click',()=>setPop(score+100));

function resize(){
  width=innerWidth;height=innerHeight;renderer.setSize(width,height,false);
  worldCamera.aspect=width/height;worldCamera.updateProjectionMatrix();
  hudCamera.left=-width/2;hudCamera.right=width/2;hudCamera.top=height/2;hudCamera.bottom=-height/2;hudCamera.updateProjectionMatrix();
  applyAllLayouts();
}
addEventListener('resize',resize);

buildPop();buildNavPlaceholder();buildGearPlaceholder();buildRadioPlaceholder();buildHangers();buildTachoSocket();resize();
document.fonts?.ready?.then(()=>{if(popSurface)redrawCanvasTexture(popSurface,drawPop)});

let last=performance.now(),worldTime=0;
function frame(now){
  const dt=Math.min(.05,(now-last)/1000||.016);last=now;worldTime+=dt;
  for(const m of laneMarkers){m.position.z+=dt*(11+telemetry.speedNorm*15);if(m.position.z>14)m.position.z-=154}
  worldCamera.position.x=Math.sin(worldTime*.35)*.22;worldCamera.lookAt(Math.sin(worldTime*.22)*.3,1,-22);
  const beatOn=document.getElementById('beatDemo').checked;
  if(beatOn){const bpm=112,phase=(worldTime*bpm/60)%1;beat={available:true,phase,pulse:Math.exp(-phase*9),source:'LAB_112_BPM'}}else beat={available:false,phase:0,pulse:0,source:'none'};
  updateMotion(dt,worldTime);
  renderer.autoClear=true;renderer.render(worldScene,worldCamera);renderer.autoClear=false;renderer.clearDepth();renderer.render(hudScene,hudCamera);renderer.autoClear=true;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function pointForObject(obj){const p=new THREE.Vector3();obj.getWorldPosition(p);return {x:p.x+width/2,y:height/2-p.y}}
function actionPoints(){const out={};for(const m of actionMeshes)if(m.userData.hudAction)out[m.userData.hudAction]=pointForObject(m);return out}
function rigPoint(id){const r=rigs.get(id);return r?pointForObject(r.root):null}

function snapshot(){
  return {
    ready:window.__KFB_HUD_RIG_V1__.ready,
    sourcePin:SOURCE_PIN,assets:JSON.parse(JSON.stringify(assetStatus)),layout:JSON.parse(JSON.stringify(layout)),layoutKey:LAYOUT_KEY,
    editMode,reducedMotion,showHitZones,hangerMode,score,nav:{...nav},radio:{...radioState},
    beat:{...beat},telemetry:{...telemetry},settingsOpen:settingsBackdrop.classList.contains('open'),
    inputOwnership:{keyboardKeysOwned:[],pointerOnly:true,audioContextCreated:false,questTruthOwned:false},
    rigs:Object.fromEntries([...rigs].map(([id,r])=>[id,{visible:r.root.visible,x:r.root.position.x,y:r.root.position.y,hover:r.hover,roll:r.roll,pitch:r.pitch,scale:r.scale}])),
    radioHitZones:radioHitZoneMeshes.map(m=>({action:m.userData.hudAction,visibleOpacity:m.material.opacity})),
    actions:[...actions]
  };
}
window.__KFB_HUD_RIG_V1__={
  version:'1.0.0-stage',ready:false,sourcePin:SOURCE_PIN,assets:ASSETS,layoutKey:LAYOUT_KEY,
  snapshot,actionPoints,rigPoint,setTelemetry(next={}){telemetry={...telemetry,...next}},
  setNavigation,setHanger,setPop,setBeat(next={}){beat={...beat,...next}},
  openSettings,closeSettings,
  resetLayout(){layout=cloneLayout(DEFAULT_LAYOUT);saveLayout();applyAllLayouts()},
  setEditMode(v){editMode=!!v;document.getElementById('editMode').checked=editMode;document.getElementById('editTip').classList.toggle('show',editMode);tachoRig.root.visible=editMode},
  setHitZones(v){document.getElementById('showHitZones').checked=!!v;setHitZoneVisibility(v)}
};
loadExactAssets();
