import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mountHudV2 } from './hud-rig-v2-embed.mjs';

const DONOR_PIN='5650b6c54d8789b20ea80abe857688173d506d3b';
const RAW=`https://raw.githubusercontent.com/georg-doc/kayfabizarro/${DONOR_PIN}/`;
const SOURCES=Object.freeze({
  radio:RAW+'media/3D_Assets/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/radio.gltf',
  arrow:RAW+'media/3D_Assets/Platformer%20Game%20Kit%20-%20Dec%202021/Level%20and%20Mechanics/glTF/Arrow.gltf',
  gear:RAW+'media/3D_Assets/GEAR_ICON.glb'
});
const params=new URLSearchParams(location.search);
const proof=(params.get('proof')||'').toLowerCase();
const requestedView=(params.get('view')||'front').toLowerCase();
const frame=document.getElementById('driveHost');
const canvas=document.getElementById('proofView');
const meta=document.getElementById('proofMeta');
const boot=document.getElementById('bootState');
const failure=document.getElementById('failure');

function fail(message){failure.textContent='HUD V2 SOURCE/SEAM FAILED · '+String(message);failure.classList.add('on');boot.style.display='none'}

if(proof){
  frame.style.display='none';canvas.style.display='block';meta.style.display='block';boot.style.display='none';
  runSourceProof();
}else{
  runComposition();
}

async function runComposition(){
  const sameOriginStage=/kayfabizarro\.pages\.dev$|georg-doc\.github\.io$/.test(location.hostname);
  const defaultHost=sameOriginStage
    ? '../runtime/ChatGPT_web/osm-city-drive/?city=ehrenfeld-huerth-corridor-v0&look=grotesque'
    : 'https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/runtime/ChatGPT_web/osm-city-drive/?city=ehrenfeld-huerth-corridor-v0&look=grotesque';
  const hostUrl=params.get('host')||defaultHost;
  const wrapperState={ready:false,sameOrigin:false,host:hostUrl,error:null,embedSeen:false};
  window.__KFB_HUD_V2_WRAPPER__={version:'2.0.0-stage-wrapper',donorPin:DONOR_PIN,sources:SOURCES,snapshot:()=>({...wrapperState})};
  const onHostLoad=()=>{
    try{
      const w=frame.contentWindow,d=frame.contentDocument;
      if(!w||!d)throw new Error('same-origin host document unavailable');
      if(w.location.href==='about:blank')return;
      frame.removeEventListener('load',onHostLoad);
      wrapperState.sameOrigin=true;
      const style=d.createElement('style');
      style.id='kfb-hud-v2-host-style';
      style.textContent=`#topbar,#hud{display:none!important}html.kfb-hud-v2-tools #topbar{display:flex!important}`;
      d.head.appendChild(style);
      mountHudV2({
        parentWindow:window,parentDocument:document,hostWindow:w,hostDocument:d,
        config:{donorPin:DONOR_PIN,sources:SOURCES,bearing:Number(params.get('bearing')||32),debug:params.get('debug')==='1'}
      }).then(api=>{wrapperState.embedSeen=true;wrapperState.ready=api.ready;boot.style.display='none'})
        .catch(error=>{wrapperState.error=String(error);fail('overlay mount failed; '+error)});

    }catch(error){wrapperState.error=String(error);fail('composition requires the same-origin Stage host; '+error)}
  };
  frame.addEventListener('load',onHostLoad);
  frame.src=hostUrl;
}

function runSourceProof(){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0xb9c8c4);scene.add(new THREE.HemisphereLight(0xfff7df,0x6b7d80,2.6));
  const key=new THREE.DirectionalLight(0xffe5af,3.4);key.position.set(-4,6,5);scene.add(key);const fill=new THREE.DirectionalLight(0xaed9e2,1.8);fill.position.set(5,2,-3);scene.add(fill);
  const camera=new THREE.PerspectiveCamera(42,1,.01,100);
  const state={ready:false,proof,view:requestedView,source:null,nodeNames:[],box:null,error:null,audioContextCreated:false,keyboardKeysOwned:[]};
  let objectRoot=null,box=new THREE.Box3(),center=new THREE.Vector3(),size=new THREE.Vector3(),radius=1;
  function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
  function sourceFail(message){state.error=String(message);failure.textContent='SOURCE ASSET FAILED · '+state.error;failure.classList.add('on');state.ready=true}
  function computeBounds(){box.setFromObject(objectRoot);box.getCenter(center);box.getSize(size);radius=Math.max(.001,size.length()*.5);state.box={min:box.min.toArray(),max:box.max.toArray(),center:center.toArray(),size:size.toArray()}}
  function cameraVector(kind,view){
    if(kind==='radio'){if(view==='side')return new THREE.Vector3(3.2,.75,0);if(view==='threequarter'||view==='3q')return new THREE.Vector3(2.4,1.45,2.9);return new THREE.Vector3(0,.55,3.4)}
    if(kind==='arrow'){if(view==='side')return new THREE.Vector3(0,.55,3.2);if(view==='threequarter'||view==='3q')return new THREE.Vector3(2.4,2.6,2.4);return new THREE.Vector3(0,3.5,.05)}
    if(view==='side')return new THREE.Vector3(3,0,0);if(view==='threequarter'||view==='3q')return new THREE.Vector3(2.4,2.2,2.6);return new THREE.Vector3(0,.2,3.2)
  }
  function setProofView(view){state.view=view;const dir=cameraVector(proof,view).normalize();camera.position.copy(center).add(dir.multiplyScalar(radius*2.65));camera.near=Math.max(.001,radius*.01);camera.far=Math.max(20,radius*20);camera.updateProjectionMatrix();camera.lookAt(center);meta.textContent=`source proof · ${proof} · ${view} · ${DONOR_PIN.slice(0,8)}`}
  async function load(){if(!SOURCES[proof])return sourceFail('unknown proof asset '+proof);state.source=SOURCES[proof];try{const gltf=await new GLTFLoader().loadAsync(SOURCES[proof]);objectRoot=gltf.scene;scene.add(objectRoot);objectRoot.traverse(o=>state.nodeNames.push(o.name||o.type));computeBounds();setProofView(requestedView);state.ready=true}catch(error){sourceFail(error?.message||error)}}
  function snapshot(){return JSON.parse(JSON.stringify(state))}
  window.__KFB_HUD_V2__={version:'2.0.0-source-proof',get ready(){return state.ready},donorPin:DONOR_PIN,sources:SOURCES,snapshot,setProofView};
  function frameProof(){renderer.render(scene,camera);requestAnimationFrame(frameProof)}requestAnimationFrame(frameProof);load();
}
