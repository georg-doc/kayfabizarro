/* Native Taxi and J14 Drive consumer. Exclusive handoff with WB2 Ground, existing Track samples only. */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {makeFrame,createDriver,stepDriver,pose} from '../../_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-drive/kfb-drive.k2b.js';
export const TAXI_SOURCE={commit:'64cbf1031392029f25110dd613247b32148aae42',path:'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_taxi.gltf',blobSha:'266c1113a22f85ee6851b5dab6a89fc51726f4f8'};
export async function createTaxiModel(){const g=await new GLTFLoader().loadAsync('https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+TAXI_SOURCE.commit+'/'+TAXI_SOURCE.path.split('/').map(encodeURIComponent).join('/'));const root=g.scene;root.name='KayKit Taxi';const box=new THREE.Box3().setFromObject(root);root.position.y=-box.min.y;root.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true});root.userData.sourceRecord={assetId:'car_taxi.gltf',packId:'KayKit City Builder Bits',source:TAXI_SOURCE};return root;}
function uniformFrame(samples){
  const list=[];let total=0;for(const q of samples){if(list.length){const d=Math.hypot(...q.p.map((v,i)=>v-list.at(-1).p[i]));if(d<.001)continue;total+=d}list.push({...q,s:total})}
  if(list.length<2)throw Error('Track route has no samples');const n=Math.ceil(total/.5),ds=total/n,out=[];let j=0;
  for(let i=0;i<=n;i++){const s=i*ds;while(j<list.length-2&&list[j+1].s<s)j++;const a=list[j],b=list[j+1],t=(s-a.s)/(b.s-a.s);const lerp=(u,v)=>u.map((x,k)=>x+(v[k]-x)*t);const p=lerp(a.p,b.p),T=new THREE.Vector3().fromArray(b.p).sub(new THREE.Vector3().fromArray(a.p)).normalize(),U=new THREE.Vector3().fromArray(a.U).normalize(),R=new THREE.Vector3().crossVectors(U,T).normalize();out.push({...a,s,p,T:T.toArray(),U:U.toArray(),R:R.toArray(),slots:a.slots,prm:{...a.prm,surface:1}})}
  return makeFrame(out,ds,false);
}
export function createTaxiDrive(A,{root,remember}={}){
  const keys=new Set();let active=false,driver=null,frame=null,distance=0,lastS=0,routeId=null;
  function key(e,on){if(!active||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName))return;if(['KeyW','KeyS','KeyA','KeyD','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();on?keys.add(e.code):keys.delete(e.code)}}
  addEventListener('keydown',e=>key(e,true));addEventListener('keyup',e=>key(e,false));addEventListener('blur',()=>keys.clear());
  const support=(x,z)=>A.world.groundAt(x,z,A.terrainHeightAt(x,z));
  function exit(){if(!active)return false;active=false;keys.clear();const p=root.position;let safe=null;for(const d of [2.3,-2.3,3.5,-3.5,0]){const x=p.x+Math.cos(root.rotation.y)*d,z=p.z-Math.sin(root.rotation.y)*d;if(support(x,z)>-30&&!A.world.solidAt(x,z)){safe=[x,support(x,z),z];break}}if(!safe)throw Error('Taxi has no safe Ground exit');A.doc.world.player={actorProfileId:A.play.evidence().actorProfileId,worldId:A.doc.id,position:safe,heading:root.rotation.y,speed:0,intention:'idle'};A.play.readDoc(A.doc);A.setPlay(true);A.updateRecordFromRoot(root);remember('drive:'+routeId,'town.driver','drive',{distanceM:distance,groundDriveGround:distance>=5});document.body.dataset.movementOwner='WB2 Ground';return true;}
  return{get active(){return active},enter(connectionId='route.town-dystopia'){
    if(active)return;root=A.sceneObjects.get('town.taxi');if(!root)throw Error('Native Taxi missing');const arch=A.world.archipelago,c=arch.connections.find(c=>c.id===connectionId);if(!c)throw Error('Existing Track connection required');const town=arch.nodes.find(n=>n.id===c.from),S=town.plan.stream.samples;
    const nearest=p=>S.reduce((best,q,i)=>Math.hypot(q.p[0]-p[0],q.p[2]-p[2])<best.d?{i,d:Math.hypot(q.p[0]-p[0],q.p[2]-p[2])}:best,{i:0,d:Infinity}).i;
    const start=nearest(root.position.toArray()),end=nearest(c.stream.samples[0].p),N=S.length-1,fwd=(end-start+N)%N,back=(start-end+N)%N;
    const dir=fwd<=back?1:-1,count=Math.min(fwd,back),prefix=Array.from({length:count+1},(_,i)=>S[(start+i*dir+N)%N]);
    frame=uniformFrame([...prefix,...c.stream.samples]);driver=createDriver(2);distance=0;lastS=driver.s;routeId=c.id;A.setPlay(false);A.controls.enabled=false;keys.clear();active=true;document.getElementById('dock').hidden=true;document.body.dataset.movementOwner='J14 Drive';this.update(0);
  },exit,update(dt){if(!active)return;dt=Math.min(.05,dt);const q=stepDriver(driver,frame,{gas:keys.has('KeyW'),brake:keys.has('KeyS'),left:keys.has('KeyA'),right:keys.has('KeyD'),boost:keys.has('ShiftLeft')||keys.has('ShiftRight'),driftL:false,driftR:false,jump:false},dt,{assist:.8});const P=pose(driver,q,0);root.position.fromArray(P.P);root.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3().fromArray(P.X),new THREE.Vector3().fromArray(P.U),new THREE.Vector3().fromArray(P.F)));distance+=Math.abs(driver.s-lastS);lastS=driver.s;const forward=new THREE.Vector3().fromArray(P.F),cam=root.position.clone().addScaledVector(forward,-14).addScaledVector(new THREE.Vector3().fromArray(P.U),8);A.camera.position.lerp(cam,1-Math.exp(-14*Math.max(dt,.01)));A.camera.lookAt(root.position.clone().addScaledVector(forward,5).add(new THREE.Vector3(0,2,0)));A.updateRecordFromRoot(root);
    // J14's open endpoint would loop to s=2. Stop before that seam and return to Ground.
    if(driver.s>=frame.L-5-Math.max(0,driver.speed)*dt||driver.s<=2&&driver.speed<0)exit();
  },evidence:()=>({active,owner:active?'J14 Drive':'WB2 Ground',routeId,distanceM:distance,speed:driver?.speed||0,s:driver?.s,trackOwner:'Track Core',source:TAXI_SOURCE})};
}
