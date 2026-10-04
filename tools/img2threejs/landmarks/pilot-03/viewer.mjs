import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {buildLandmark,MODEL_IDS} from '../pilot-02/geometry.mjs';
import {ZONES} from '../pilot-01/geometry.mjs';
import {zoneColours} from '../pilot-02/presentation.mjs';
import {CITY_STYLE_URL} from '../pilot-01/presentation.mjs';
import {createLandmarkGroup,disposeLandmark} from '../pilot-01/three-adapter.mjs';
import {exportGLB} from '../pilot-01/glb.mjs';
import {shapeAsset,modeSupported} from './deform.mjs';

export async function boot(){
 const status=document.querySelector('#status'),stage=document.querySelector('#stage'),canvas=document.querySelector('#view');
 const style=window.__KFB_EMBEDDED_CITY_STYLE__||await fetch(CITY_STYLE_URL).then(r=>{if(!r.ok)throw Error('City style HTTP '+r.status);return r.json();});
 const scene=new THREE.Scene();scene.background=new THREE.Color('#d7e0e8');
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;
 const camera=new THREE.PerspectiveCamera(40,1,.1,10000);const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.495;
 scene.add(new THREE.HemisphereLight(0xffffff,0x6f776f,1.55));const sun=new THREE.DirectionalLight(0xfff2d8,2.35);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);scene.add(sun.target);
 const content=new THREE.Group();scene.add(content);
 let assets=[],roots=[],floor=null,grid=null,active='spasskaya',shapeMode='base',paletteMode='city',overrides={},wire=false;
 const params=new URLSearchParams(location.search);if(MODEL_IDS.includes(params.get('model')))active=params.get('model');if(['base','city-grotesque','soft-cubist','voxel-steps','boxel'].includes(params.get('shape')))shapeMode=params.get('shape');
 function resize(){const r=stage.getBoundingClientRect();if(r.width<1||r.height<1)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}
 function palette(a){return {...zoneColours(a,style,paletteMode),...overrides};}
 function cameraStyle(){
   camera.filmOffset=0;camera.up.set(0,1,0);camera.fov=40;
   if(shapeMode==='city-grotesque'){camera.fov=76;camera.filmOffset=10.5;camera.up.set(.085,.9964,0);}
   if(shapeMode==='soft-cubist'){camera.fov=59;camera.filmOffset=4.8;camera.up.set(.04,.9992,0);}
   camera.updateProjectionMatrix();
 }
 function frame(view='oblique'){
   cameraStyle();const box=new THREE.Box3().setFromObject(content),s=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3()),diag=s.length();
   const v={oblique:[1,.65,1.08],front:[0,.16,1],side:[1,.16,0],top:[0,1,.001]}[view]||[1,.65,1.08],dir=new THREE.Vector3(...v).normalize();
   const vf=camera.fov*Math.PI/180,hf=2*Math.atan(Math.tan(vf/2)*camera.aspect),dist=diag*.5/Math.sin(Math.min(vf,hf)/2)*1.13;
   controls.target.copy(c);camera.position.copy(c).addScaledVector(dir,dist);camera.near=Math.max(.01,diag/4000);camera.far=dist+diag*12;camera.updateProjectionMatrix();controls.update();
   sun.position.copy(c).add(new THREE.Vector3(-diag*.65,diag,diag*.75));sun.target.position.copy(c);
 }
 function makeSwatches(){
   const box=document.querySelector('#zones');box.replaceChildren();if(!assets.length)return;const used=new Set(assets.flatMap(a=>a.parts.map(p=>p.zone))),p=palette(assets[0]);
   for(const zone of ZONES){if(!used.has(zone))continue;const lab=document.createElement('label'),input=document.createElement('input');input.type='color';input.value=p[zone];input.addEventListener('input',()=>{overrides[zone]=input.value;for(const root of roots)root.traverse(o=>{if(o.isMesh&&o.userData.kfbMaterialZone===zone)o.material.color.set(input.value);});});lab.append(input,document.createTextNode(zone));box.append(lab);}
 }
 function recolour(){for(let i=0;i<roots.length;i++){const p=palette(assets[i]);roots[i].traverse(o=>{if(o.isMesh){o.material.color.set(p[o.userData.kfbMaterialZone]);o.material.wireframe=wire;}});}makeSwatches();}
 function updateModeOptions(){
   const voxel=document.querySelector('#shape option[value="voxel-steps"]'),boxel=document.querySelector('#shape option[value="boxel"]'),ok=active==='giza';
   voxel.disabled=!ok;boxel.disabled=!ok;if(!ok&&(shapeMode==='voxel-steps'||shapeMode==='boxel'))shapeMode='base';document.querySelector('#shape').value=shapeMode;
 }
 function shaped(key){
   const raw=buildLandmark(key),mode=modeSupported(key,shapeMode)?shapeMode:'base';
   return shapeAsset(raw,style,mode);
 }
 function load(){
   for(const r of roots){content.remove(r);disposeLandmark(r);}roots=[];assets=[];if(floor){scene.remove(floor);floor.geometry.dispose();floor.material.dispose();}if(grid){scene.remove(grid);grid.geometry.dispose();grid.material.dispose();}
   updateModeOptions();const ids=active==='compare'?MODEL_IDS.filter(id=>id!=='spasskaya'):[active];let cursor=0;
   for(const key of ids){const a=shaped(key),r=createLandmarkGroup(THREE,a,palette(a));if(active==='compare'){r.position.x=cursor-a.bounds.min[0];r.position.z=-(a.bounds.min[2]+a.bounds.max[2])/2;cursor+=a.bounds.size[0]+55;}assets.push(a);roots.push(r);content.add(r);}
   const box=new THREE.Box3().setFromObject(content),sz=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),radius=Math.max(sz.x,sz.z)*.68+sz.y*.25;
   floor=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius*1.025,Math.max(.3,radius*.012),48),new THREE.MeshStandardMaterial({color:active==='giza'?'#d3c5a8':style.palette.green,roughness:1}));floor.position.set(center.x,-Math.max(.3,radius*.012)/2-.05,center.z);floor.receiveShadow=true;scene.add(floor);
   grid=new THREE.GridHelper(Math.ceil(radius*2/10)*10,20,'#849382','#849382');grid.position.set(center.x,-.035,center.z);grid.visible=document.querySelector('#grid').checked;grid.material.transparent=true;grid.material.opacity=.35;scene.add(grid);
   resize();frame();recolour();document.querySelector('#model').value=active;document.querySelector('#shape').value=shapeMode;document.querySelector('#title').textContent=active==='compare'?'Same-scale lineup':assets[0].title;
   const modeText={base:'BASE', 'city-grotesque':'CITY GROTESQUE', 'soft-cubist':'SOFT CUBIST','voxel-steps':'VOXEL STEPS',boxel:'BOXEL BLOCKS'}[shapeMode];
   document.querySelector('#note').textContent=(assets[0]?.note||'')+' · Mode '+modeText+'. Presentation only; collision/export owner remains unchanged.';
   document.querySelector('#export').disabled=active==='compare';
   status.textContent=`${assets.reduce((s,a)=>s+a.triangles,0).toLocaleString('en')} triangles · ${roots.reduce((s,r)=>s+r.children.length,0)} material meshes · ${modeText} · 1 unit = 1 m · ${sz.x.toFixed(1)} × ${sz.y.toFixed(1)} × ${sz.z.toFixed(1)} m`;
   window.__KFB_LANDMARK_PILOT__={ready:true,active,shapeMode,assets:assets.map(a=>({id:a.id,mode:a.shapeMode||'base',bounds:a.bounds,triangles:a.triangles})),movementOwner:'none-viewer-only',collisionOwner:'none',styleSource:'tools/osm-city-lab/styles/kfb-city-v0.json'};
 }
 document.querySelector('#model').addEventListener('change',e=>{active=e.target.value;overrides={};load();});
 document.querySelector('#shape').addEventListener('change',e=>{shapeMode=e.target.value;overrides={};load();});
 document.querySelector('#palette').addEventListener('change',e=>{paletteMode=e.target.value;overrides={};recolour();});
 document.querySelector('#wire').addEventListener('change',e=>{wire=e.target.checked;recolour();});document.querySelector('#grid').addEventListener('change',e=>{if(grid)grid.visible=e.target.checked;});
 for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>frame(b.dataset.view));document.querySelector('#resetColours').addEventListener('click',()=>{overrides={};recolour();});
 document.querySelector('#export').addEventListener('click',()=>{const bytes=exportGLB(assets[0],palette(assets[0]));const u=URL.createObjectURL(new Blob([bytes],{type:'model/gltf-binary'})),a=document.createElement('a');a.href=u;a.download='kfb-'+active+'-'+shapeMode+'-pilot-03.glb';a.click();setTimeout(()=>URL.revokeObjectURL(u),3000);});
 new ResizeObserver(resize).observe(stage);load();renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});
}