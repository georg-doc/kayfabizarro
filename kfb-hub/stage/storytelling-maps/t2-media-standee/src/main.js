import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const BUILD='storytelling-maps-t2-r1';
const KFB_PIN='a6b9220a0b42d50a9de9804fad22e84dde2c322c';
const BASE='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+KFB_PIN+'/media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/';
const STAND='playerstand_red.gltf';
const CARD='playercard_knight_red.gltf';

const loader=new GLTFLoader();
const labs={};
const state={
  portrait:{ready:false,orientation:'portrait',mediaOn:true,error:null},
  landscape:{ready:false,orientation:'landscape',mediaOn:true,error:null}
};

function allMaterials(root){
  const out=[];
  root.traverse(o=>{
    if(!o.isMesh)return;
    const arr=Array.isArray(o.material)?o.material:[o.material];
    for(const m of arr) if(m) out.push(m);
  });
  return out;
}

function makeTexture(orientation){
  const c=document.createElement('canvas');
  c.width=768;c.height=960;
  const x=c.getContext('2d');

  const drawFace=(w,h,label)=>{
    x.fillStyle='#efe2c7';x.fillRect(-w/2,-h/2,w,h);
    x.fillStyle='#d8c6a6';
    for(let i=0;i<100;i++){
      const yy=-h/2+((i*97)%h);
      x.fillRect(-w/2,yy,w,1);
    }
    x.strokeStyle='#1f1a14';x.lineWidth=Math.max(8,w*.018);x.strokeRect(-w/2+18,-h/2+18,w-36,h-36);
    x.fillStyle='#b3311f';x.fillRect(-w/2+38,-h/2+42,w*.42,h*.11);
    x.fillStyle='#f6efd9';x.font='900 '+Math.round(h*.07)+'px Georgia,serif';x.textAlign='center';x.textBaseline='middle';
    x.fillText('KFB',-w/2+38+w*.21,-h/2+42+h*.055);
    x.fillStyle='#1f1a14';
    x.font='900 '+Math.round(h*.065)+'px system-ui,sans-serif';
    x.fillText(label,0,-h*.12);
    x.font='700 '+Math.round(h*.035)+'px ui-monospace,monospace';
    x.fillText('CALIBRATION FACE',0,h*.02);
    x.font='600 '+Math.round(h*.03)+'px system-ui,sans-serif';
    x.fillText('front material only',0,h*.10);

    // simple ink character mark — diagnostic content, not a product illustration
    x.save();
    x.translate(0,h*.25);
    x.strokeStyle='#1f1a14';x.lineWidth=Math.max(8,w*.018);x.lineCap='round';x.lineJoin='round';
    x.beginPath();x.arc(0,0,Math.min(w,h)*.105,0,Math.PI*2);x.stroke();
    x.beginPath();x.moveTo(-w*.06,-h*.05);x.lineTo(-w*.09,-h*.16);x.moveTo(w*.06,-h*.05);x.lineTo(w*.09,-h*.16);x.stroke();
    x.beginPath();x.moveTo(-w*.055,h*.02);x.lineTo(w*.055,h*.02);x.stroke();
    x.restore();

    x.font='600 '+Math.round(h*.024)+'px ui-monospace,monospace';
    x.fillText(orientation==='portrait'?'native UV':'counter-rotated media',0,h*.43);
  };

  x.save();
  x.translate(c.width/2,c.height/2);
  if(orientation==='landscape'){
    x.rotate(-Math.PI/2);
    drawFace(c.height*.92,c.width*.92,'LANDSCAPE');
  }else{
    drawFace(c.width*.92,c.height*.92,'PORTRAIT');
  }
  x.restore();

  const t=new THREE.CanvasTexture(c);
  t.colorSpace=THREE.SRGBColorSpace;
  t.flipY=false;
  t.anisotropy=4;
  return t;
}

function makeScene(id){
  const host=document.querySelector('#view-'+id);
  const canvas=document.createElement('canvas');
  host.prepend(canvas);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.02,100);
  camera.position.set(3.7,2.8,5.1);
  const controls=new OrbitControls(camera,canvas);
  controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=2.4;controls.maxDistance=12;
  scene.add(new THREE.HemisphereLight(0xfff1d7,0x322a38,2.0));
  const key=new THREE.DirectionalLight(0xffe4c7,3.4);key.position.set(-4,7,5);key.castShadow=true;scene.add(key);
  const rim=new THREE.DirectionalLight(0x85adff,1.0);rim.position.set(5,3,-4);scene.add(rim);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(3.8,64),new THREE.MeshStandardMaterial({color:0x28222d,roughness:1}));
  floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
  labs[id]={host,canvas,renderer,scene,camera,controls,root:null,bindings:[],frameRefs:new Set(),sourceMaterialNames:[],baseCamera:null,baseTarget:null};
  resize(id);
  return labs[id];
}

function resize(id){
  const s=labs[id];if(!s)return;
  const r=s.host.getBoundingClientRect(),w=Math.max(1,Math.floor(r.width)),h=Math.max(1,Math.floor(r.height));
  s.renderer.setSize(w,h,false);s.camera.aspect=w/h;s.camera.updateProjectionMatrix();
}

function replaceArt(card,orientation,lab){
  const sourceMats=allMaterials(card);
  lab.sourceMaterialNames=[...new Set(sourceMats.map(m=>m.name||'(unnamed)'))].sort();
  const mediaTex=makeTexture(orientation);
  const replacement=new THREE.MeshStandardMaterial({
    name:'kfb_t2_media_'+orientation,
    map:mediaTex,
    roughness:.72,
    metalness:0,
    side:THREE.DoubleSide
  });

  const beforeFrames=new Set(sourceMats.filter(m=>/boardgame/i.test(m.name||'')));
  beforeFrames.forEach(m=>lab.frameRefs.add(m));

  card.traverse(o=>{
    if(!o.isMesh)return;
    if(Array.isArray(o.material)){
      const next=o.material.slice();
      let changed=false;
      for(let i=0;i<next.length;i++){
        const m=next[i];
        if(/red_knight/i.test(m?.name||'')){
          lab.bindings.push({mesh:o,index:i,original:m,replacement});
          next[i]=replacement;changed=true;
        }
      }
      if(changed)o.material=next;
    }else if(/red_knight/i.test(o.material?.name||'')){
      lab.bindings.push({mesh:o,index:null,original:o.material,replacement});
      o.material=replacement;
    }
  });

  const currentFrames=new Set(allMaterials(card).filter(m=>/boardgame/i.test(m.name||'')));
  const framePreserved=[...lab.frameRefs].every(m=>currentFrames.has(m));
  return {framePreserved,replaced:lab.bindings.length};
}

function setMedia(id,on){
  const lab=labs[id];if(!lab)return;
  for(const b of lab.bindings){
    if(b.index==null){
      b.mesh.material=on?b.replacement:b.original;
    }else{
      const arr=(Array.isArray(b.mesh.material)?b.mesh.material:[b.mesh.material]).slice();
      arr[b.index]=on?b.replacement:b.original;
      b.mesh.material=arr;
    }
  }
  state[id].mediaOn=on;
  updateMeta(id);
  const btn=document.querySelector('[data-media="'+id+'"]');
  if(btn){btn.textContent='FRONT: '+(on?'MEDIA':'ORIGINAL');btn.classList.toggle('active',on);}
}

function seatCard(stand,card,orientation){
  if(orientation==='landscape')card.rotation.z=Math.PI/2;
  stand.updateMatrixWorld(true);card.updateMatrixWorld(true);
  const sb=new THREE.Box3().setFromObject(stand),cb=new THREE.Box3().setFromObject(card);
  const sc=sb.getCenter(new THREE.Vector3()),cc=cb.getCenter(new THREE.Vector3());
  card.position.x+=sc.x-cc.x;
  card.position.z+=sc.z-cc.z;
  card.position.y+=(sb.max.y-.11)-cb.min.y;
  card.updateMatrixWorld(true);
}

function fitRoot(root,lab){
  root.updateMatrixWorld(true);
  let box=new THREE.Box3().setFromObject(root);
  const size=box.getSize(new THREE.Vector3());
  const target=3.55;
  const k=target/Math.max(size.x,size.y,size.z,.001);
  root.scale.multiplyScalar(k);
  root.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(root);
  const center=box.getCenter(new THREE.Vector3());
  root.position.x-=center.x;
  root.position.z-=center.z;
  root.position.y-=box.min.y;
  root.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(root);
  const sz=box.getSize(new THREE.Vector3());
  lab.controls.target.set(0,Math.max(.6,sz.y*.48),0);
  const d=Math.max(sz.x,sz.y)*1.9+2.2;
  lab.camera.position.set(sz.x*.85+1.8,sz.y*.82+1.6,d);
  lab.baseCamera=lab.camera.position.clone();lab.baseTarget=lab.controls.target.clone();lab.controls.update();
  return sz;
}

function updateMeta(id){
  const lab=labs[id],st=state[id];if(!lab)return;
  const framePreserved=[...lab.frameRefs].every(m=>allMaterials(lab.root).includes(m));
  const frame=document.querySelector('#frame-'+id),front=document.querySelector('#front-'+id);
  if(frame)frame.textContent=(framePreserved?'preserved · ':'CHECK FAILED · ')+([...lab.frameRefs].map(m=>m.name).join(', ')||'none');
  if(front)front.textContent=(st.mediaOn?'MEDIA':'ORIGINAL')+' · bindings '+lab.bindings.length;
  const status=document.querySelector('#status-'+id);
  if(status)status.textContent=
    'ready '+id+'\nmaterials: '+lab.sourceMaterialNames.join(' / ')+'\nframe preserved: '+framePreserved+'\nfront bindings: '+lab.bindings.length;
  return framePreserved;
}

async function build(id){
  const lab=makeScene(id);
  try{
    const [sg,cg]=await Promise.all([loader.loadAsync(BASE+STAND),loader.loadAsync(BASE+CARD)]);
    const stand=sg.scene,card=cg.scene;
    for(const obj of [stand,card])obj.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
    const proof=replaceArt(card,id,lab);
    seatCard(stand,card,id);
    const root=new THREE.Group();root.name='KFB_T2_'+id;root.add(stand,card);lab.scene.add(root);lab.root=root;
    const size=fitRoot(root,lab);
    state[id].ready=proof.framePreserved&&proof.replaced>0;
    state[id].sourceMaterialNames=lab.sourceMaterialNames.slice();
    state[id].framePreserved=proof.framePreserved;
    state[id].mediaMaterialReplaced=proof.replaced>0;
    state[id].replacementBindings=proof.replaced;
    state[id].bounds={x:+size.x.toFixed(3),y:+size.y.toFixed(3),z:+size.z.toFixed(3)};
    updateMeta(id);
  }catch(err){
    state[id].error=String(err?.message||err);
    const status=document.querySelector('#status-'+id);if(status)status.textContent='ERROR · '+state[id].error;
  }
}

function resetView(id){
  const lab=labs[id];if(!lab?.baseCamera)return;
  lab.camera.position.copy(lab.baseCamera);lab.controls.target.copy(lab.baseTarget);lab.controls.update();
}
document.querySelectorAll('[data-media]').forEach(b=>b.addEventListener('click',()=>{
  const id=b.dataset.media;setMedia(id,!state[id].mediaOn);
}));
document.querySelectorAll('[data-reset]').forEach(b=>b.addEventListener('click',()=>resetView(b.dataset.reset)));

window.KFBStorytellingT2={
  report(){
    const out={build:BUILD,kaykitPin:KFB_PIN,standAsset:STAND,cardAsset:CARD,ready:true};
    for(const id of ['portrait','landscape']){
      if(labs[id]?.root)state[id].framePreserved=[...labs[id].frameRefs].every(m=>allMaterials(labs[id].root).includes(m));
      out[id]=JSON.parse(JSON.stringify(state[id]));
      out.ready=out.ready&&!!state[id].ready;
    }
    return out;
  },
  setMedia(on){setMedia('portrait',!!on);setMedia('landscape',!!on);return this.report();},
  setMediaFor(id,on){setMedia(id,!!on);return this.report();}
};

await Promise.all([build('portrait'),build('landscape')]);

function loop(){
  requestAnimationFrame(loop);
  for(const lab of Object.values(labs)){lab.controls.update();lab.renderer.render(lab.scene,lab.camera);}
}
loop();
addEventListener('resize',()=>Object.keys(labs).forEach(resize));
