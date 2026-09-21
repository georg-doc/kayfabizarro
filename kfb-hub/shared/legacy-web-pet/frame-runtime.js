import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {assembleLegacy} from './legacy-rig-adapter.v1.js';
import {CHARACTERS,CAMP,CHARACTER_PIN,LEGACY_PIN,RIG_URL,CLICK_CLIPS,LOCOMOTION,rawUrl} from './sources.js';

const TYPE='kfb-legacy-web-pet';
const loader=new GLTFLoader();
const post=(type,payload={})=>window.parent.postMessage({type:TYPE+':'+type,...payload},'*');
const rand=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;

function markShadows(root){
  root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
}
function normalizeHeight(root,target){
  root.updateMatrixWorld(true);
  let box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3());
  if(size.y>1e-6)root.scale.multiplyScalar(target/size.y);
  root.updateMatrixWorld(true);box=new THREE.Box3().setFromObject(root);
  root.position.y-=box.min.y;root.updateMatrixWorld(true);
}
function hash(s){
  let h=2166136261>>>0;
  for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}
  return h>>>0;
}
function chooseProps(hostname){
  const p=CAMP.props.slice(),h=hash(hostname);
  const a=h%p.length,b=(Math.floor(h/p.length)+1)%p.length;
  return [p[a],p[b===a?(b+1)%p.length:b]];
}

export function startLegacyWebPetFrame(){
  document.documentElement.style.background='transparent';
  document.body.style.cssText='margin:0;overflow:hidden;background:transparent';

  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-6,6,7,-1,.1,50);
  camera.position.set(0,3.2,10);camera.lookAt(0,2.6,0);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,premultipliedAlpha:true});
  renderer.setClearColor(0x000000,0);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.domElement.style.cssText='display:block;width:100%;height:100%;pointer-events:none';
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xfff7e6,0x26304a,1.8));
  const key=new THREE.DirectionalLight(0xfff0d0,3.1);key.position.set(-3,7,5);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-12,right:12,top:8,bottom:-2,near:.1,far:30});scene.add(key);

  const ground=new THREE.Mesh(new THREE.PlaneGeometry(40,5),new THREE.ShadowMaterial({color:0x000000,opacity:.22}));
  ground.rotation.x=-Math.PI/2;ground.position.set(0,0,.1);ground.receiveShadow=true;scene.add(ground);

  const home=new THREE.Group();scene.add(home);
  const homeRing=new THREE.Mesh(new THREE.RingGeometry(.56,.78,40),new THREE.MeshBasicMaterial({color:0xd09a45,transparent:true,opacity:.19,depthWrite:false,side:THREE.DoubleSide}));
  homeRing.rotation.x=-Math.PI/2;homeRing.position.y=.012;home.add(homeRing);

  let actor=null,mixer=null,currentClip='',petX=0,targetX=0,homeX=4,baseY=0,nextDecision=0,lockUntil=0,hopStart=-1,hopDuration=.56,lastBounds=0,currentCharacter='rogue',campProps=[],hostname='kfb-hub';
  const vfx=[];

  function resize(){
    const w=innerWidth||1,h=innerHeight||1,halfH=4,halfW=halfH*w/h;
    camera.left=-halfW;camera.right=halfW;camera.top=7;camera.bottom=-1;camera.updateProjectionMatrix();
    renderer.setSize(w,h,false);homeX=halfW-1.05;home.position.x=homeX;
    if(actor){petX=THREE.MathUtils.clamp(petX,-halfW+.8,homeX-.5);actor.root.position.x=petX;}
  }
  addEventListener('resize',resize);resize();

  async function loadStatic(url,height){
    const g=await loader.loadAsync(url),root=g.scene.clone(true);markShadows(root);normalizeHeight(root,height);return root;
  }
  async function rebuildCamp(){
    for(const x of [...home.children])if(x!==homeRing)home.remove(x);
    campProps=chooseProps(hostname);
    try{
      const [banner,a,b]=await Promise.all([
        loadStatic(rawUrl(LEGACY_PIN,CAMP.banner.path),1.15),
        loadStatic(rawUrl(LEGACY_PIN,campProps[0].path),.48),
        loadStatic(rawUrl(LEGACY_PIN,campProps[1].path),.48)
      ]);
      banner.position.set(.28,0,.12);banner.rotation.y=-.32;home.add(banner);
      a.position.set(-.42,0,.18);a.rotation.y=.52;home.add(a);
      b.position.set(.42,0,-.28);b.rotation.y=-.7;home.add(b);
    }catch(e){post('error',{message:'camp '+e.message});}
  }

  function play(name,{once=false,fade=.11}={}){
    if(!actor||!mixer)return null;
    if(!once&&currentClip===name)return actor.animations.find(c=>c.name===name)||null;
    const clip=actor.animations.find(c=>c.name===name);if(!clip)return null;
    const next=mixer.clipAction(clip,actor.root);next.reset();next.enabled=true;next.clampWhenFinished=once;
    next.setLoop(once?THREE.LoopOnce:THREE.LoopRepeat,once?1:Infinity);next.play();
    if(actor.action&&actor.action!==next)actor.action.crossFadeTo(next,fade,false);
    actor.action=next;currentClip=name;return clip;
  }

  async function loadActor(id){
    currentCharacter=CHARACTERS[id]?id:'rogue';
    if(actor?.root)actor.root.removeFromParent();mixer=null;actor=null;currentClip='';
    try{
      const cfg=CHARACTERS[currentCharacter];
      actor=await assembleLegacy({
        THREE,loader,rigUrl:RIG_URL,partsUrl:rawUrl(CHARACTER_PIN,cfg.path),catalogCharacter:cfg
      });
      markShadows(actor.root);normalizeHeight(actor.root,1.55);scene.add(actor.root);
      baseY=actor.root.position.y;petX=Math.min(homeX-.9,homeX);actor.root.position.x=petX;actor.root.position.z=0;
      mixer=new THREE.AnimationMixer(actor.root);play(LOCOMOTION.idle);nextDecision=performance.now()+800;
      post('ready',{character:currentCharacter,props:campProps.map(x=>x.id)});
    }catch(e){post('error',{message:'actor '+e.message});}
  }

  function spawnBurst(){
    if(!actor)return;
    const n=16,pos=new Float32Array(n*3),vel=[];
    for(let i=0;i<n;i++){
      pos[i*3]=(rand()-.5)*.28;pos[i*3+1]=.72+rand()*.65;pos[i*3+2]=(rand()-.5)*.25;
      vel.push(new THREE.Vector3((rand()-.5)*1.8,.7+rand()*1.8,(rand()-.5)*.7));
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const mat=new THREE.PointsMaterial({color:rand()>.5?0xffce58:0xb692ff,size:.10,transparent:true,opacity:.9,depthWrite:false});
    const pts=new THREE.Points(geo,mat);pts.position.x=petX;scene.add(pts);vfx.push({pts,vel,life:.7});
  }

  function trigger(){
    if(!actor)return;
    const available=CLICK_CLIPS.filter(n=>actor.animations.some(c=>c.name===n));
    const name=available[Math.floor(rand()*available.length)]||'Wave',clip=play(name,{once:true,fade:.06});
    if(!clip)return;
    const now=performance.now();lockUntil=now+Math.min(2600,Math.max(500,clip.duration*1000));
    if(name==='Hop'){hopStart=now;hopDuration=Math.min(.8,clip.duration||.56);}
    spawnBurst();post('clip',{clip:name});
  }

  function goHome(){targetX=homeX-.92;nextDecision=performance.now()+10000;}
  function chooseTarget(now){
    const halfW=Math.max(2.4,camera.right);
    targetX=rand()<.22?homeX-.92:THREE.MathUtils.lerp(-halfW+.8,homeX-1.2,rand());
    nextDecision=now+1500+rand()*2800;
  }

  function updateVfx(dt){
    for(let i=vfx.length-1;i>=0;i--){
      const fx=vfx[i],p=fx.pts.geometry.attributes.position.array;fx.life-=dt;
      for(let j=0;j<fx.vel.length;j++){const v=fx.vel[j];p[j*3]+=v.x*dt;p[j*3+1]+=v.y*dt;p[j*3+2]+=v.z*dt;v.y-=3.2*dt;}
      fx.pts.geometry.attributes.position.needsUpdate=true;fx.pts.material.opacity=Math.max(0,fx.life/.7);
      if(fx.life<=0){scene.remove(fx.pts);fx.pts.geometry.dispose();fx.pts.material.dispose();vfx.splice(i,1);}
    }
  }

  function rectFor(obj){
    if(!obj)return null;
    const b=new THREE.Box3().setFromObject(obj);if(b.isEmpty())return null;
    const min=b.min,max=b.max,pts=[];
    for(const x of [min.x,max.x])for(const y of [min.y,max.y])for(const z of [min.z,max.z])pts.push(new THREE.Vector3(x,y,z).project(camera));
    const xs=pts.map(p=>(p.x*.5+.5)*innerWidth),ys=pts.map(p=>(-.5*p.y+.5)*innerHeight);
    const l=Math.min(...xs),r=Math.max(...xs),t=Math.min(...ys),bo=Math.max(...ys);
    return {left:l,top:t,width:r-l,height:bo-t};
  }
  function publishBounds(now){
    if(now-lastBounds<110)return;lastBounds=now;
    post('bounds',{pet:rectFor(actor?.root),home:rectFor(home)});
  }

  addEventListener('message',e=>{
    const d=e.data;if(!d||typeof d.type!=='string'||!d.type.startsWith(TYPE+':'))return;
    const kind=d.type.slice(TYPE.length+1);
    if(kind==='init'){hostname=d.hostname||hostname;rebuildCamp().then(()=>loadActor(d.character||'rogue'));}
    if(kind==='character')loadActor(d.character);
    if(kind==='trigger')trigger();
    if(kind==='home')goHome();
  });

  const clock=new THREE.Clock();
  function loop(now){
    requestAnimationFrame(loop);const dt=Math.min(.05,clock.getDelta());mixer?.update(dt);updateVfx(dt);
    if(actor){
      let y=baseY;
      if(hopStart>=0){const t=(now-hopStart)/(hopDuration*1000);if(t<1)y+=Math.sin(Math.PI*t)*.42;else hopStart=-1;}
      actor.root.position.y=y;
      if(now>=lockUntil){
        const dist=targetX-petX;
        if(Math.abs(dist)>.055){
          const speed=Math.abs(dist)>2.3?1.9:1.15;petX+=Math.sign(dist)*Math.min(Math.abs(dist),speed*dt);
          actor.root.position.x=petX;actor.root.rotation.y=Math.sign(dist)>0?Math.PI/2:-Math.PI/2;
          play(speed>1.5?LOCOMOTION.run:LOCOMOTION.walk);
          if(hopStart<0&&rand()<dt*.22){hopStart=now;hopDuration=.5;play(LOCOMOTION.hop,{once:true,fade:.05});}
        }else{
          actor.root.rotation.y=0;play(LOCOMOTION.idle);
          if(now>nextDecision)chooseTarget(now);
        }
      }
    }
    publishBounds(now);renderer.render(scene,camera);
  }
  requestAnimationFrame(loop);
  post('frame-loaded');
  setTimeout(()=>{if(!actor){rebuildCamp().then(()=>loadActor('rogue'));}},1200);
}
