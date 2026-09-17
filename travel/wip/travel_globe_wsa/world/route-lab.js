import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

const view=document.querySelector('#view'), recipeEl=document.querySelector('#recipe'), statsEl=document.querySelector('#stats');
const STORAGE_KEY='kfb.route-lab.poc.v0';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x11151c);scene.fog=new THREE.FogExp2(0x11151c,.008);
const camera=new THREE.PerspectiveCamera(46,1,.05,500);camera.position.set(12,10,14);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;view.prepend(renderer.domElement);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.target.set(0,0,0);orbit.maxPolarAngle=Math.PI*.495;
scene.add(new THREE.HemisphereLight(0xe9f1ff,0x3b2f28,2));const key=new THREE.DirectionalLight(0xffd4a8,2.6);key.position.set(-8,14,9);scene.add(key);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshStandardMaterial({color:0x2a3037,roughness:1}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(80,80,0x647080,0x39414b);grid.position.y=.003;scene.add(grid);

const roadColor=0xd9b66f, pointColor=0x9b8cff, selectedColor=0x66d6ba;
let roads=[],draft=null,selectedPoint=null,idCounter=1;
const transform=new TransformControls(camera,renderer.domElement);transform.setMode('translate');transform.setSize(.7);scene.add(transform);
transform.addEventListener('dragging-changed',e=>orbit.enabled=!e.value);
transform.addEventListener('objectChange',()=>{if(selectedPoint){selectedPoint.position.y=.03;rebuildRoad(selectedPoint.userData.road);refresh()}});
transform.addEventListener('mouseUp',refresh);

function resize(){const r=view.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=Math.max(.1,r.width/Math.max(1,r.height));camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
(function animate(){requestAnimationFrame(animate);orbit.update();renderer.render(scene,camera)})();

function makeRoad(id=`road-${idCounter++}`){const group=new THREE.Group();group.name=id;scene.add(group);return{id,kind:'ROAD',profile:'road-default',closed:false,coordinateSpace:'poc-local',terrainConform:'preview-only',points:[],markers:[],line:null,group}}
function makeMarker(road,p){const m=new THREE.Mesh(new THREE.SphereGeometry(.16,14,10),new THREE.MeshStandardMaterial({color:pointColor,roughness:.65}));m.position.copy(p);m.position.y=.03;m.userData.routePoint=true;m.userData.road=road;road.group.add(m);road.markers.push(m);return m}
function updateMarkerColors(){for(const r of roads.concat(draft?[draft]:[])){for(const m of r.markers)m.material.color.set(m===selectedPoint?selectedColor:pointColor)}}
function rebuildRoad(road){road.points=road.markers.map(m=>m.position.clone());if(road.line){road.group.remove(road.line);road.line.geometry.dispose();road.line.material.dispose();road.line=null}if(road.points.length<2)return;const curve=new THREE.CatmullRomCurve3(road.points.map(p=>p.clone()),false,'centripetal',.35),pts=curve.getPoints(Math.max(24,road.points.length*18));const geo=new THREE.BufferGeometry().setFromPoints(pts),mat=new THREE.LineBasicMaterial({color:roadColor});road.line=new THREE.Line(geo,mat);road.line.position.y=.025;road.group.add(road.line)}
function startRoad(){cancelDraft();draft=makeRoad();setSelected(null);setDrawState();refresh()}
function finishRoad(){if(!draft)return;if(draft.markers.length<2){cancelDraft();return}roads.push(draft);draft=null;setSelected(null);setDrawState();refresh()}
function cancelDraft(){if(!draft)return;scene.remove(draft.group);draft=null;setSelected(null);setDrawState();refresh()}
function undoPoint(){const road=draft||selectedPoint?.userData.road;if(!road||!road.markers.length)return;const m=road.markers.pop();road.group.remove(m);m.geometry.dispose();m.material.dispose();if(selectedPoint===m)setSelected(null);rebuildRoad(road);refresh()}
function deleteSelectedPoint(){if(!selectedPoint)return;const road=selectedPoint.userData.road,idx=road.markers.indexOf(selectedPoint);if(idx>=0)road.markers.splice(idx,1);road.group.remove(selectedPoint);selectedPoint.geometry.dispose();selectedPoint.material.dispose();setSelected(null);rebuildRoad(road);if(!draft&&road.markers.length<2){roads=roads.filter(r=>r!==road);scene.remove(road.group)}refresh()}
function clearRoads(){setSelected(null);if(draft){scene.remove(draft.group);draft=null}for(const r of roads)scene.remove(r.group);roads=[];setDrawState();refresh()}
function setSelected(marker){selectedPoint=marker;transform.detach();if(marker)transform.attach(marker);updateMarkerColors();refreshStats()}
function setDrawState(){const b=document.querySelector('#drawState');b.textContent=draft?`Drawing ${draft.id}`:'Idle';b.classList.toggle('active',!!draft)}
function currentRoads(){return [...roads,...(draft&&draft.markers.length?[draft]:[])]}
function serialize(){return{schema:'kfb.world-recipe.v0-poc',status:'candidate-only',purpose:'Spline authoring UX POC; requires Travel validation/promotion',coordinateSpace:'poc-local',ownerBoundary:{runtimeSSOT:'georg-doc/KFB-Travel-Globe',terrainRoadMeshNavigationSave:'NOT OWNED HERE'},updated:new Date().toISOString(),splines:currentRoads().map(r=>({id:r.id,kind:'ROAD',profile:r.profile,closed:false,coordinateSpace:'poc-local',terrainConform:'preview-only',points:r.markers.map(m=>({type:'poc-local',position:[m.position.x,0,m.position.z]}))}))}}
function refreshRecipe(){recipeEl.textContent=JSON.stringify(serialize(),null,2)}
function refreshStats(){const all=currentRoads(),points=all.reduce((n,r)=>n+r.markers.length,0);statsEl.innerHTML=all.length?`<b>${all.length}</b> road candidate${all.length===1?'':'s'} · <b>${points}</b> control point${points===1?'':'s'}${selectedPoint?`<br>selected point ${selectedPoint.position.x.toFixed(2)}, ${selectedPoint.position.z.toFixed(2)}`:''}`:'No road yet.'}
function refresh(){updateMarkerColors();refreshStats();refreshRecipe()}
async function restore(data){clearRoads();for(const s of data.splines||[]){const r=makeRoad(s.id||`road-${idCounter++}`);for(const p of s.points||[]){const v=p.position||p.pocLocal||[0,0,0];makeMarker(r,new THREE.Vector3(v[0],.03,v[2]??v[1]??0))}rebuildRoad(r);if(r.markers.length>=2)roads.push(r);else scene.remove(r.group)}refresh()}
function frameRoad(){const rs=currentRoads();if(!rs.length)return;const pts=rs.flatMap(r=>r.markers.map(m=>m.position));const box=new THREE.Box3().setFromPoints(pts),center=box.getCenter(new THREE.Vector3()),size=Math.max(3,box.getSize(new THREE.Vector3()).length());camera.position.copy(center).add(new THREE.Vector3(1,.9,1).normalize().multiplyScalar(size*1.4));orbit.target.copy(center);orbit.update()}
function topView(){const rs=currentRoads(),pts=rs.flatMap(r=>r.markers.map(m=>m.position)),box=pts.length?new THREE.Box3().setFromPoints(pts):new THREE.Box3(new THREE.Vector3(-5,0,-5),new THREE.Vector3(5,0,5)),center=box.getCenter(new THREE.Vector3()),size=Math.max(10,box.getSize(new THREE.Vector3()).length());camera.position.set(center.x,size*1.25,center.z+.001);orbit.target.copy(center);orbit.update()}

const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
renderer.domElement.addEventListener('pointerdown',e=>{if(transform.dragging)return;const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;ray.setFromCamera(pointer,camera);const markers=currentRoads().flatMap(x=>x.markers),mh=ray.intersectObjects(markers,false)[0];if(mh){setSelected(mh.object);return}if(draft){const gh=ray.intersectObject(ground,false)[0];if(!gh)return;makeMarker(draft,gh.point);rebuildRoad(draft);refresh();return}setSelected(null)});

addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(e.key==='Enter')finishRoad();if(e.key==='Escape')cancelDraft();if((e.key==='Delete'||e.key==='Backspace')&&selectedPoint)deleteSelectedPoint()});
document.querySelector('#newRoad').onclick=startRoad;document.querySelector('#finishRoad').onclick=finishRoad;document.querySelector('#cancelRoad').onclick=cancelDraft;document.querySelector('#undoPoint').onclick=undoPoint;document.querySelector('#removePoint').onclick=deleteSelectedPoint;document.querySelector('#clearRoads').onclick=clearRoads;document.querySelector('#frameRoad').onclick=frameRoad;document.querySelector('#topView').onclick=topView;
document.querySelector('#copy').onclick=async()=>navigator.clipboard.writeText(JSON.stringify(serialize(),null,2));
document.querySelector('#download').onclick=()=>{const blob=new Blob([JSON.stringify(serialize(),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='kfb-road-spline-poc.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
document.querySelector('#save').onclick=()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(serialize()));
document.querySelector('#load').onclick=()=>{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return alert('No local Route Lab recipe saved.');restore(JSON.parse(raw)).catch(err=>{console.error(err);alert(err.message||err)})};

setDrawState();refresh();
