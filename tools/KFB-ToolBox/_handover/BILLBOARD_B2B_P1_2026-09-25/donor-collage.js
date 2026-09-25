import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {HERO_DONORS,loadHero,buildStage,BillboardContent} from './bb-scene.js';
const errors=[]; addEventListener('error',e=>errors.push(String(e.message||e.error)));
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true}); renderer.setPixelRatio(Math.min(2,devicePixelRatio||1)); renderer.outputColorSpace=THREE.SRGBColorSpace; document.body.prepend(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,16/9,.1,100); buildStage(scene,renderer);
let content=null,hero=null,last=performance.now();
async function boot(){
 hero=await loadHero(GLTFLoader,HERO_DONORS[0].file,4.2);
 const box=new THREE.Box3().setFromObject(hero.group),c=box.getCenter(new THREE.Vector3());
 hero.group.position.x-=c.x; hero.group.position.z-=c.z; hero.group.position.y-=box.min.y; scene.add(hero.group);
 content=new BillboardContent(hero.panel); content.setMode('COLLAGE'); content.setInspect('REVEAL');
 window.__donor={report:()=>({ready:!!content,mode:content?.mode,cardReady:!!content?.cardResult,errors,source:'Gate-1 BillboardContent'}),content};
}
boot().catch(e=>errors.push(String(e.stack||e)));
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/Math.max(1,innerHeight);camera.updateProjectionMatrix();}addEventListener('resize',resize);resize();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.1,(now-last)/1000);last=now;camera.position.set(0,3.3,7.0);camera.lookAt(0,2.0,0);if(content)content.update(dt);renderer.render(scene,camera);}requestAnimationFrame(loop);