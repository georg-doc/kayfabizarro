import * as THREE from 'three';
import { makeIslandCore } from '../procedural-test-world-01/r2d-island-core.v1.js';
import { makeArchipelago } from '../procedural-test-world-01/r2d-archipelago.v1.js';
import { mountR2DPresentation } from '../procedural-test-world-01/r2d-presentation.v1.js';
import { mountR2DBuildings } from '../procedural-test-world-01/r2d-buildings.v1.js';

const TRACK_PIN='64d8597c3dad1dc9814c794d4a566d589e1e1a25';
const R2C_PIN='927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f';
const TRACK_DIR='skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/BUILDER_2026-09-27/';
const R2C_DIR='tools/KFB-ToolBox/_inbox/KFB World Core R2C · Hex-Archipel Katalog/WORLD_CORE_R2C_2026-10-01/';
const RECIPE_URL=new URL('../procedural-test-world-01/WORLD_RECIPES.json',import.meta.url).href;
const REPO='georg-doc/kayfabizarro';
const enc=p=>p.split('/').map(encodeURIComponent).join('/');
const jsd=(pin,p)=>'https://cdn.jsdelivr.net/gh/'+REPO+'@'+pin+'/'+enc(p);
const raw=(pin,p)=>'https://raw.githubusercontent.com/'+REPO+'/'+pin+'/'+enc(p);

async function imp(pin,path){
  try{return await import(jsd(pin,path))}
  catch(e1){
    const res=await fetch(raw(pin,path));if(!res.ok)throw e1;
    const txt=await res.text(),base=raw(pin,path).slice(0,raw(pin,path).lastIndexOf('/')+1);
    const fixed=txt.replace(/(from\s+|import\s*\()(['"])(\.\.?\/[^'"]+)\2/g,(m,a,q,p)=>a+q+new URL(p,base).href+q);
    return import(URL.createObjectURL(new Blob([fixed],{type:'text/javascript'})));
  }
}

export const ZONES=Object.freeze({
  r2d3:{label:'R2D · Insel #3 · Burg',seed:3,biome:'burg',shape:'frei'},
  r2d4:{label:'KFB MVP · Town + Dystopia + Utopia + Protopia',archipelago:true}
});
export const PROVIDER='kfb.r2d-worldbuilder-adapter/2';

function chooseSpawn(P){
  const s=P.stream?.samples||[];
  const q=s[Math.max(0,Math.min(s.length-1,Math.floor(s.length*.32)))]||null;
  if(q?.p&&q?.T)return{x:q.p[0],z:q.p[2],heading:Math.atan2(q.T[0],q.T[2]),road:'R2D Track Core'};
  return{x:P.c0[0],z:P.c0[1],heading:0,road:'island centre'};
}
const pip=(x,z,poly)=>{let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if(((a[1]>z)!==(b[1]>z))&&(x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0]))inside=!inside}return inside};

function singleWorld({id,Z,TC,ST,R2C,core}){
  const P=core.plan,F=core.field,pal=R2C.PAL[Z.biome]||R2C.PAL.burg;
  const maxR=Math.max(...P.edgeR),spawn=chooseSpawn(P);
  const tile={cx:+P.c0[0].toFixed(3),cz:+P.c0[1].toFixed(3),size:Math.ceil(maxR*2+28),seg:256};
  const group=new THREE.Group();group.name='R2D WorldBuilder presentation';
  let presentation=null,buildings=null;
  const zone={id:'r2d-island-'+Z.seed,status:'SOURCE_DERIVED_R2D_V0',
    counts:{buildings:P.pads.length,roadParts:1,landuse:1},
    provenance:{source:'R2D v0 Claude Design donor',commit:'74f7a690fbec88cf98ce0936f31b72ad3f1148f5',blob:'6952697d7d3c9cd159ac3fdd924f24fa333c904d'}};
  const inside=(x,z)=>P.sdf(x,z)<=0;
  const baseHeightAt=(x,z)=>{const d=P.sdf(x,z);if(d<=0)return F.heightAt(x,z);return F.heightAt(x,z)-4-Math.min(32,d*1.45)};
  const W={
    id,zone,spawn,tile,log:[],docId:'r2d-world-'+Z.seed,storageKey:'kfb-r2d-world.'+Z.seed,
    SKY_MODES:[['day','Day']],skyMode:'day',landmarks:[],worldGraph:null,
    get inkOn(){return false},get inkReport(){return null},get namesOn(){return false},
    get presentationReport(){return presentation?.report||null},
    get buildingReport(){return buildings?.report||null},
    get city(){return buildings?.city||null},
    get supportReport(){return buildings?.report?.support||null},
    baseHeightAt,maskAt:(x,z)=>inside(x,z)?F.maskAt(x,z):'under',
    groundAt(x,z,terrainHeight){return P.roadDist(x,z)<=P.hw+.2?Math.max(terrainHeight,P.roadY):terrainHeight},
    solidAt(x,z){return buildings?.at(x,z)?.height||0},buildingAt(x,z){return buildings?.at(x,z)||null},
    patchDoc(doc){
      doc.id=W.docId;doc.terrain={seed:Z.seed,height:10,macroScale:3.2,detail:.55,tile:{...tile},sculpt:{version:1,strokes:[]}};doc.objects=[];
      doc.world={format:'kfb.r2d.world-ref/1',provider:PROVIDER,seed:Z.seed,biome:Z.biome,shape:Z.shape,source:zone.provenance,player:{position:[+spawn.x.toFixed(3),0,+spawn.z.toFixed(3)],heading:+spawn.heading.toFixed(5)}};
      doc.sources.world={owner:'KFB WorldBuilder',sourceDonor:'R2D v0',terrain:'r2d-island-core.v1.js',track:'Track Core @ '+TRACK_PIN.slice(0,7),buildings:'Registry native building families → K2/v10'};return doc;
    },
    stage({camera,controls,fog}){camera.near=.1;camera.far=1800;camera.updateProjectionMatrix();controls.maxDistance=700;controls.minDistance=.3;controls.maxPolarAngle=Math.PI;controls.minPolarAngle=0;if(fog){fog.near=100;fog.far=650}},
    async mount({scene,renderer}){const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0});const road=ST.buildTrack(THREE,P.stream,mat);road.name='R2D Track Core road';road.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});group.add(road);buildings=await mountR2DBuildings({group,plan:P,field:F,renderer});scene.add(group)},
    dressTerrain(mesh){const pos=mesh.geometry.getAttribute('position'),colors=mesh.geometry.getAttribute('color'),C={veg:new THREE.Color(pal.grass),edge:new THREE.Color(pal.rock||pal.lip),walk:new THREE.Color(pal.paved),interact:new THREE.Color(pal.paved),building:new THREE.Color(pal.paved),water:new THREE.Color(pal.sand),under:new THREE.Color(pal.rock||'#6b6f78'),road:new THREE.Color(pal.paved)};for(let i=0;i<pos.count;i++){const m=W.maskAt(pos.getX(i),pos.getZ(i)),col=C[m]||C.veg;colors.setXYZ(i,col.r,col.g,col.b)}colors.needsUpdate=true;mesh.material.vertexColors=true;mesh.material.needsUpdate=true;mesh.name='R2D source-derived heightfield · seed '+Z.seed;if(!presentation)presentation=mountR2DPresentation({group,supportTerrain:mesh,plan:P,field:F,palette:pal})},
    onTerrain(){return buildings?.report?.support||null},frameEdit(camera,controls){controls.target.set(P.c0[0],1.5,P.c0[1]);camera.position.set(P.c0[0]+maxR*1.15,Math.max(18,maxR*.55),P.c0[1]+maxR*1.45);controls.update()},
    tick(){},render(){return false},setVisible(v){group.visible=!!v},setInk(){},setNames(){},setScanRoots(){},async setSky(v){W.skyMode=v;return v}
  };return W;
}

function archipelagoWorld({id,TC,ST,R2C,arch}){
  const group=new THREE.Group();group.name='R2D MVP archipelago';
  const presentations=new Map(),buildingSets=new Map(),nodeGroups=new Map(),collisionBounds=new WeakMap();let editedBuildings=null,heightReader=null;
  const tile={cx:+arch.bounds.cx.toFixed(3),cz:+arch.bounds.cz.toFixed(3),size:arch.bounds.size,seg:256};
  const spawnAnchor=arch.anchorMap.get('town.spawn.market');
  const spawn={x:spawnAnchor.position[0],z:spawnAnchor.position[2],heading:spawnAnchor.heading||0,road:'Golden Journey · Town market'};
  const zone={
    id:'kfb-mvp-archipelago-01',status:'WORLD_MULTI_ISLAND_CORRIDOR_CANDIDATE',
    counts:{buildings:arch.nodes.reduce((n,x)=>n+x.plan.pads.length,0),roadParts:arch.nodes.length+arch.connections.length,landuse:arch.nodes.length},
    provenance:{source:'R2D v0 + current MVP world recipes',blob:'6952697d7d3c9cd159ac3fdd924f24fa333c904d',recipeSet:arch.recipeSet.id}
  };
  const insideNode=(x,z)=>arch.nodes.find(n=>n.plan.sdf(x,z)<=0)||null;
  const nearestBridge=(x,z)=>{
    let best=null,bd=Infinity;
    for(const c of arch.connections)for(const q of c.stream.samples||[]){const d=Math.hypot(q.p[0]-x,q.p[2]-z);if(d<bd){bd=d;best={c,q,d}}}
    return best;
  };
  const baseHeightAt=(x,z)=>{const n=insideNode(x,z);return n?n.field.heightAt(x,z):-44};
  const aggregateSupport=()=>{const rs=[...buildingSets.values()].map(x=>x.report?.support).filter(Boolean);return rs.length?{moved:rs.reduce((a,r)=>a+(r.moved||0),0),maxOffsetM:Math.max(...rs.map(r=>r.maxOffsetM||0)),maxFootprintSpanM:Math.max(...rs.map(r=>r.maxFootprintSpanM||0)),islands:rs.length}:null};
  const W={
    id,zone,spawn,tile,log:[],docId:'kfb-mvp-archipelago-01',storageKey:'kfb-mvp-archipelago.01',
    SKY_MODES:[['day','Day']],skyMode:'day',landmarks:[],worldGraph:arch.worldGraph,
    get archipelago(){return arch},
    get bridgeSupportSamples(){return arch.connections.map(c=>{const s=c.stream.samples,i=Math.floor(s.length/2);return {id:c.id,point:[...s[i].p],next:[...s[Math.min(i+1,s.length-1)].p]}})},
    get inkOn(){return false},get inkReport(){return null},get namesOn(){return false},
    get presentationReport(){return Object.fromEntries([...presentations].map(([k,v])=>[k,v.report]))},
    get buildingReport(){return Object.fromEntries([...buildingSets].map(([k,v])=>[k,v.report]))},
    get city(){return buildingSets.get('world.kfb-town')?.city||null},
    get supportReport(){return aggregateSupport()},
    baseHeightAt,
    maskAt(x,z){const n=insideNode(x,z);return n?n.field.maskAt(x,z):'under'},
    groundAt(x,z,terrainHeight){const b=nearestBridge(x,z);const width=(b?.q?.prm?.width||0)/2+.5;if(b&&b.d<=width)return b.q.p[1];const n=insideNode(x,z);if(n&&n.plan.roadDist(x,z)<=n.plan.hw+.2)return Math.max(terrainHeight,n.plan.roadY);return terrainHeight},
    solidAt(x,z){if(editedBuildings){for(const root of editedBuildings()){if(!root.visible)continue;root.updateWorldMatrix(true,false);const key=root.matrixWorld.elements.join(','),old=collisionBounds.get(root);let b=old?.bounds;if(!old||old.key!==key||old.model!==root.userData.model){b=new THREE.Box3().setFromObject(root);collisionBounds.set(root,{key,bounds:b,model:root.userData.model})}if(x>=b.min.x&&x<=b.max.x&&z>=b.min.z&&z<=b.max.z)return b.max.y-b.min.y}return 0}for(const b of buildingSets.values()){const q=b.at(x,z);if(q)return q.height||0}return 0},
    adoptBuildingObjects(provider){editedBuildings=provider;for(const b of buildingSets.values())b.root.visible=false;},
    buildingSceneRecords(){return [...buildingSets.values()].flatMap(b=>b.report.placed.map(p=>({id:p.id,name:p.assetId.split('/').pop(),kind:'prop',registeredAssetId:p.assetId,worldId:b.report.worldId,source:{...p.source,path:p.assetId},transform:{position:p.position,rotation:p.rotation,scale:[p.fitScale,p.fitScale,p.fitScale]}})))},
    buildingAt(x,z){for(const b of buildingSets.values()){const q=b.at(x,z);if(q)return q}return null},
    patchDoc(doc){
      doc.id=W.docId;
      doc.terrain={seed:3,height:10,macroScale:3.2,detail:.55,tile:{...tile},sculpt:{version:1,strokes:[]}};
      doc.objects=[];
      doc.world={format:'kfb.r2d.archipelago-ref/1',provider:PROVIDER,recipeSet:arch.recipeSet.id,source:zone.provenance,graph:arch.worldGraph,player:{anchor:'town.spawn.market',position:[spawn.x,0,spawn.z],heading:spawn.heading}};
      doc.sources.world={owner:'KFB WorldBuilder / WB2',terrain:'r2d-island-core.v1.js + r2d-archipelago.v1.js',track:'Track Core @ '+TRACK_PIN.slice(0,7),buildings:'Registry native RED / Industrial / Space Base / GREEN',goldenJourney:'GOLDEN_JOURNEY_MVP_2026-10-04.json'};
      return doc;
    },
    stage({camera,controls,fog}){camera.near=.1;camera.far=2400;camera.updateProjectionMatrix();controls.maxDistance=1100;controls.minDistance=.3;controls.maxPolarAngle=Math.PI;controls.minPolarAngle=0;if(fog){fog.near=260;fog.far=1150}},
    async mount({scene,renderer,heightAt}){
      heightReader=heightAt;
      for(const n of arch.nodes){
        const ng=new THREE.Group();ng.name='R2D island · '+n.id;nodeGroups.set(n.id,ng);group.add(ng);
        const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0});
        const road=ST.buildTrack(THREE,n.plan.stream,mat);road.name='R2D Track Core road · '+n.id;road.userData.sourceRecord={assetId:road.name,packId:'Track Core',source:{commit:TRACK_PIN,path:TRACK_DIR+'stream-to-three.mjs'}};road.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});ng.add(road);
        const b=await mountR2DBuildings({group:ng,plan:n.plan,field:n.field,renderer});buildingSets.set(n.id,b);
      }
      for(const c of arch.connections){
        const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0});
        const road=ST.buildTrack(THREE,c.stream,mat);road.name='R2D ROAD_BRIDGE · '+c.id;road.userData.sourceRecord={assetId:road.name,packId:'Track Core',source:{commit:TRACK_PIN,path:TRACK_DIR+'stream-to-three.mjs'}};road.userData.worldConnectionId=c.id;road.userData.kind='ROAD_BRIDGE';road.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});group.add(road);
      }
      scene.add(group);
      W.log.push('R2D archipelago · '+arch.nodes.length+' islands · '+arch.connections.length+' Track Core bridges');
    },
    dressTerrain(mesh){
      // WB2 rebuilds this collision/sculpt heightfield after scene edits. The native
      // island surface remains the sole visible terrain, including after remount.
      mesh.visible=false;
      const pos=mesh.geometry.getAttribute('position'),colors=mesh.geometry.getAttribute('color');
      const under=new THREE.Color('#4b4038');
      for(let i=0;i<pos.count;i++){
        const x=pos.getX(i),z=pos.getZ(i),n=insideNode(x,z),pal=n?(R2C.PAL[n.recipe.biome]||R2C.PAL.burg):null,col=pal?new THREE.Color(pal.grass):under;
        colors.setXYZ(i,col.r,col.g,col.b);
      }
      colors.needsUpdate=true;mesh.material.vertexColors=true;mesh.material.needsUpdate=true;mesh.name='R2D archipelago support heightfield';
      for(const n of arch.nodes){
        const ng=nodeGroups.get(n.id),pal=R2C.PAL[n.recipe.biome]||R2C.PAL.burg;
        if(!presentations.has(n.id))presentations.set(n.id,mountR2DPresentation({group:ng,supportTerrain:mesh,plan:n.plan,field:n.field,palette:pal}));
        if(heightReader)presentations.get(n.id).refreshSurface(heightReader);
      }
    },
    onTerrain(){if(heightReader)for(const p of presentations.values())p.refreshSurface(heightReader);return aggregateSupport()},
    frameEdit(camera,controls){const {cx,cz,size}=arch.bounds;controls.target.set(cx,0,cz);camera.position.set(cx+size*.52,Math.max(150,size*.36),cz+size*.58);controls.update()},
    tick(){},render(){return false},setVisible(v){group.visible=!!v},setInk(){},setNames(){},setScanRoots(){},async setSky(v){W.skyMode=v;return v}
  };
  return W;
}

export async function prepare(id){
  const Z=ZONES[id];if(!Z)throw new Error('unknown R2D world '+id);
  const [TC,ST,R2C]=await Promise.all([imp(TRACK_PIN,TRACK_DIR+'track-core.mjs'),imp(TRACK_PIN,TRACK_DIR+'stream-to-three.mjs'),imp(R2C_PIN,R2C_DIR+'lab-world/hex-archipel.r2c.js')]);
  if(Z.archipelago){
    const res=await fetch(RECIPE_URL);if(!res.ok)throw new Error('world recipes '+res.status);
    const recipeSet=await res.json();
    return archipelagoWorld({id,TC,ST,R2C,arch:makeArchipelago(recipeSet,TC)});
  }
  return singleWorld({id,Z,TC,ST,R2C,core:makeIslandCore(Z.seed,TC,Z.shape)});
}
