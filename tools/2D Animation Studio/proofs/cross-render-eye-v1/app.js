(async()=>{
const $=q=>document.querySelector(q);
const NS='http://www.w3.org/2000/svg';
const DONOR_PIN='6f099649e4c833ef8d7822a1663f2348c412bd4c';
const EMBED='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+DONOR_PIN+'/tools/KFB-ToolBox/kfb-rigs-embed-v3/';
const SVG_URL='../../labs/eumel-rig-lab/source-assets/EUMEL_SOURCE_COMPONENTS.svg';
const CLIPS_URL='../../shared/eye-rig/eye-clips.v1.json';

const logLines=[];
function log(msg){const line=new Date().toISOString().slice(11,19)+'  '+msg;logLines.push(line);if(logLines.length>80)logLines.shift();$('#log').textContent=logLines.join('\n');}
function status(id,text,kind='pending'){const el=$(id);el.textContent=text;el.className='target-status '+kind;}
function cleanFrame(frame){
  if(!frame)return null;
  const p=v=>v&&typeof v==='object'&&'x'in v?{x:+v.x.toFixed(3),y:+v.y.toFixed(3),z:v.z==null?undefined:+v.z.toFixed(3)}:v;
  return {left:p(frame.left),right:p(frame.right),radius:+(frame.radius||0).toFixed(3),unit:+(frame.unit||0).toFixed(3),gen:frame.gen||0};
}
function wrapSvgGroup(svg,id,newId){
  const target=svg.querySelector('#'+id);if(!target)throw new Error('missing '+id);
  const g=document.createElementNS(NS,'g');g.id=newId;target.parentNode.insertBefore(g,target);g.appendChild(target);return g;
}
function apply2D(node,p={}){
  if(!node)return;const b=node.getBBox(),cx=b.x+b.width/2,cy=b.y+b.height/2;
  const x=p.x||0,y=p.y||0,r=p.r||0,sx=p.sx==null?1:p.sx,sy=p.sy==null?1:p.sy;
  node.setAttribute('transform','translate('+x+' '+y+') translate('+cx+' '+cy+') rotate('+r+') scale('+sx+' '+sy+') translate('+(-cx)+' '+(-cy)+')');
}

// ---- 2D Eumel --------------------------------------------------------------
async function mountEumel(){
  const text=await fetch(SVG_URL).then(r=>{if(!r.ok)throw new Error('SVG '+r.status);return r.text()});
  const host=$('#eumelMount');host.innerHTML=text;const svg=host.querySelector('svg');svg.id='proof-eumel';
  const parent=svg.querySelector('#page-normalizer');
  const eyeA=wrapSvgGroup(svg,'rig-eye-A','proof-eye-A');
  const eyeB=wrapSvgGroup(svg,'rig-eye-B','proof-eye-B');
  const pupilA=wrapSvgGroup(svg,'rig-pupil-A','proof-pupil-A');
  const pupilB=wrapSvgGroup(svg,'rig-pupil-B','proof-pupil-B');
  const bA=eyeA.getBBox(),bB=eyeB.getBBox();
  const frame={
    left:{x:bB.x+bB.width/2,y:bB.y+bB.height/2},
    right:{x:bA.x+bA.width/2,y:bA.y+bA.height/2},
    radius:(bA.width+bB.width)/4,
    parent,rig:parent,unit:((bA.width+bB.width)/4)/.3
  };
  const rig=new KFBEyeRig2D({nodes:{eyeA,eyeB,pupilA,pupilB},frame,applyTransform:apply2D,maxTrack:2.2});
  rig.setBlink({minGap:999,maxGap:999,dur:.12});rig.setLife({on:false,wander:0,tremor:0});rig.setKinetics({enabled:false,gain:0,a:0,c:0,j:0});
  if('_blinkT'in rig)rig._blinkT=999;
  const debug=document.createElementNS(NS,'g');debug.id='frame-debug-2d';debug.style.display='none';
  const line=document.createElementNS(NS,'line');line.setAttribute('x1',frame.left.x);line.setAttribute('y1',frame.left.y);line.setAttribute('x2',frame.right.x);line.setAttribute('y2',frame.right.y);line.setAttribute('class','frame-debug-line-2d');debug.appendChild(line);
  for(const p of [frame.left,frame.right]){const c=document.createElementNS(NS,'circle');c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',1.5);c.setAttribute('class','frame-debug-2d');debug.appendChild(c)}
  parent.appendChild(debug);
  status('#status2d','READY · SVG2D','pass');$('#frame2d').textContent=JSON.stringify(cleanFrame(rig.eyeFrame()),null,2);log('2D Eumel mounted · source-exact eye/pupil groups');
  return {rig,update:dt=>rig.update(dt),setDebug:on=>debug.style.display=on?'':'none'};
}

// ---- 3D Rig_Medium / ToolBox Graft -----------------------------------------
async function mountThree(){
  const THREE=await import('three');const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
  const host=$('#threeStage');
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(30,1,.01,100);camera.position.set(0,1.25,4.4);camera.lookAt(0,1.05,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x667080,1.15));const key=new THREE.DirectionalLight(0xffffff,1.55);key.position.set(3,5,4);scene.add(key);const fill=new THREE.DirectionalLight(0xffe6df,.55);fill.position.set(-4,2,2);scene.add(fill);
  const holder=new THREE.Group();scene.add(holder);
  const mod=await import(EMBED+'frizzlegraft-v1/graft-mount.v1.js');
  const contract=await fetch(EMBED+'contracts/kfb-pet-graft-driver.v4.json').then(r=>{if(!r.ok)throw new Error('contract '+r.status);return r.json()});
  const sourcePet=mod.pickGraftPet(contract,'graft-driver');const pet=JSON.parse(JSON.stringify(sourcePet));
  if(pet.graft&&pet.graft.weapon)pet.graft.weapon.on=false;if(pet.cardRider)pet.cardRider.on=false;
  const graft=await mod.mountGraft({THREE,loader:new GLTFLoader(),parent:holder,pet,lib:contract,camera,animation:'own'});
  const box=new THREE.Box3().setFromObject(holder),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),scale=2.45/Math.max(.001,size.y);
  holder.scale.setScalar(scale);holder.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);
  graft.rig.setBlink({minGap:999,maxGap:999,dur:.12});graft.rig.setLife({on:false,wander:0,tremor:0});graft.rig.setKinetics({enabled:false,gain:0,a:0,c:0,j:0});
  if('_blinkT'in graft.rig)graft.rig._blinkT=999;
  let debugGroup=null;
  function setDebug(on){
    if(!debugGroup){
      const f=graft.rig.eyeFrame();debugGroup=new THREE.Group();debugGroup.name='KFB proof eyeFrame debug';
      const mat=new THREE.MeshBasicMaterial({color:0xcc0033,depthTest:false});const geo=new THREE.SphereGeometry(Math.max(.01,f.radius*.11),12,8);
      for(const p of [f.left,f.right]){const m=new THREE.Mesh(geo,mat);m.position.copy(p);m.renderOrder=999;debugGroup.add(m)}
      const pts=[f.left.clone(),f.right.clone()];const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xcc0033,depthTest:false}));line.renderOrder=999;debugGroup.add(line);
      f.parent.add(debugGroup);
    }
    debugGroup.visible=!!on;
  }
  const ro=new ResizeObserver(()=>{const r=host.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(.1,r.width/Math.max(1,r.height));camera.updateProjectionMatrix()});ro.observe(host);
  status('#status3d','READY · EyeRig v6','pass');$('#frame3d').textContent=JSON.stringify(cleanFrame(graft.rig.eyeFrame()),null,2);log('3D Graft mounted · Rig_Medium / 23 joints / EyeRig v6');
  return {rig:graft.rig,update:(dt)=>{graft.update?.(dt,camera);renderer.render(scene,camera)},setDebug,dispose:()=>{ro.disconnect();graft.dispose?.();renderer.dispose()}};
}

// ---- Shared semantic sequence -----------------------------------------------
const clips=await fetch(CLIPS_URL).then(r=>r.json());
const sequence=clips.sequence||['neutral','blink','look_left','look_right','surprised','thinking','neutral'];
const seqHost=$('#sequence');sequence.forEach((name,i)=>{const s=document.createElement('span');s.className='step';s.dataset.index=i;s.textContent=name.replace('_',' ');seqHost.appendChild(s)});
function showStep(ev){$('#stepTitle').textContent=(ev.index+1)+' / '+sequence.length+' · '+ev.name.replace('_',' ');for(const el of seqHost.children)el.classList.toggle('active',+el.dataset.index===ev.index);log('STEP '+ev.index+' · '+ev.name)}
function showCommand(ev){log('  '+ev.cmd.method+(ev.cmd.args===undefined?'':' '+JSON.stringify(ev.cmd.args)))}

let two=null,three=null,runner=null,playing=true,debug=false;
try{two=await mountEumel()}catch(e){status('#status2d','FAIL · '+e.message,'fail');log('2D FAIL '+e.stack)}
try{three=await mountThree()}catch(e){status('#status3d','FAIL · '+e.message,'fail');log('3D FAIL '+e.stack)}

if(two&&three){
  runner=new KFBEyeSequenceRunner({targets:[two.rig,three.rig],library:clips,sequence,loop:true,onStep:showStep,onCommand:showCommand,onError:e=>log('COMMAND ERROR '+e.error)});
  runner.restart();$('#readyState').textContent='READY · SAME RUNNER';$('#readyState').className='ready pass';
}else{$('#readyState').textContent='PARTIAL / LOAD FAIL';$('#readyState').className='ready fail'}

$('#restart').onclick=()=>runner?.restart();
$('#playPause').onclick=()=>{if(!runner)return;playing=!playing;playing?runner.play():runner.pause();$('#playPause').textContent=playing?'Pause':'Play'};
$('#next').onclick=()=>runner?.next();
$('#frameDebug').onchange=e=>{debug=e.target.checked;two?.setDebug(debug);three?.setDebug(debug)};

let last=performance.now();
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;runner?.update(dt);two?.update(dt);three?.update(dt);requestAnimationFrame(frame)}
requestAnimationFrame(frame);
})();