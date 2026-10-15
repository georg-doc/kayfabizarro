import * as THREE from 'three';
import { createEnvironmentHost } from '../../../../tools/KFB-ToolBox/_inbox/KFB Skydome Gates SKY3/KFB_SKYDOME_SKY3_SESSION_CUT_2026-10-01_r1/lab-sky/env-host.v3.js';

const canvas=document.getElementById('sky-canvas'), panel=document.getElementById('sky-state'), status=document.getElementById('status');
const exposure={ready:false,error:null,source:{sky:'SKY3 env-host.v3.js',vfx:'whitePuff00.png',audio:'ambient_wind.wav'},steps:0};
window.__KFB_WORLDLAB_SOURCE_AUDIT__=exposure;
let renderer, host, scene, camera;
function resize(){
  if(!renderer)return;
  const w=canvas.clientWidth||800,h=canvas.clientHeight||420;
  renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
}
function draw(){
  renderer.render(scene,camera);host.after();
  const p=host.probe(); panel.textContent=JSON.stringify({weather:p.weather,rain:p.rain,rainStreaks:p.rainStreaks,opaqueShells:p.opaqueShells,fog:p.fog,sun:p.sun,dtSteps:exposure.steps,glCalls:renderer.info.render.calls,rendererRevision:THREE.REVISION},null,2);
}
try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:false,preserveDrawingBuffer:true,powerPreference:'low-power'});
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(52,16/9,0.1,6000);
  camera.position.set(1,2,24);camera.lookAt(0,0,0);
  resize();
  host=await createEnvironmentHost({THREE,renderer,scene,camera,radius:1400,minutes:6});
  await host.setShell('tiny');host.setTime('day');
  const step=(weather,frames)=>{
    if(!['clear','rain'].includes(weather)||!Number.isInteger(frames)||frames<0||frames>1200)throw Error('invalid fixture args');
    host.setWeather(weather);
    for(let i=0;i<frames;i++){host.update(1/60);exposure.steps++;}
    draw();return exposure.snapshot();
  };
  const snapshot=()=>({weather:host.probe().weather,rain:host.state.rain,rainStreaks:host.rain.streaks,opaqueShells:host.opaqueShells(),fogReferenceStable:host.scene.fog===exposure.initialFog,rendererRevision:THREE.REVISION,dtSteps:exposure.steps,originalRain:host.rain.name});
  exposure.initialFog=scene.fog;exposure.step=step;exposure.snapshot=snapshot;exposure.redraw=draw;exposure.ready=true;exposure.sourceIsolate=()=>({loaded:document.getElementById('vfx-original').complete&&document.getElementById('vfx-original').naturalWidth>0,width:document.getElementById('vfx-original').naturalWidth,src:document.getElementById('vfx-original').currentSrc});
  document.getElementById('dry').onclick=()=>step('clear',420);
  document.getElementById('rain').onclick=()=>step('rain',120);
  document.getElementById('reset').onclick=()=>{step('clear',420);step('rain',120);step('clear',420);};
  window.addEventListener('resize',()=>{resize();draw()});
  draw(); status.textContent='Existing KFB source modules loaded · not a product/runtime acceptance.';
}catch(e){exposure.error=String(e.stack||e);status.textContent='SOURCE/WEBGL FAILURE · '+e.message;console.error(e);}
