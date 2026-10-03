import * as THREE from 'three';
import { makeIslandCore } from '../procedural-test-world-01/r2d-island-core.v1.js';

const TRACK_PIN='64d8597c3dad1dc9814c794d4a566d589e1e1a25';
const R2C_PIN='927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f';
const TRACK_DIR='skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/BUILDER_2026-09-27/';
const R2C_DIR='tools/KFB-ToolBox/_inbox/KFB World Core R2C · Hex-Archipel Katalog/WORLD_CORE_R2C_2026-10-01/';
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
  r2d3:{label:'R2D · Insel #3 · Burg',seed:3,biome:'burg',shape:'frei'}
});
export const PROVIDER='kfb.r2d-worldbuilder-adapter/1';

function chooseSpawn(P){
  const s=P.stream?.samples||[];
  const q=s[Math.max(0,Math.min(s.length-1,Math.floor(s.length*.32)))]||null;
  if(q?.p&&q?.T)return{x:q.p[0],z:q.p[2],heading:Math.atan2(q.T[0],q.T[2]),road:'R2D Track Core'};
  return{x:P.c0[0],z:P.c0[1],heading:0,road:'island centre'};
}

function makeWorld({id,Z,TC,ST,R2C,core}){
  const P=core.plan,F=core.field,pal=R2C.PAL[Z.biome]||R2C.PAL.burg;
  const maxR=Math.max(...P.edgeR),spawn=chooseSpawn(P);
  const tile={cx:+P.c0[0].toFixed(3),cz:+P.c0[1].toFixed(3),size:Math.ceil(maxR*2+28),seg:256};
  const group=new THREE.Group();group.name='R2D WorldBuilder presentation';
  const zone={id:'r2d-island-'+Z.seed,status:'SOURCE_DERIVED_R2D_V0',
    counts:{buildings:P.pads.length,roadParts:1,landuse:1},
    provenance:{source:'R2D v0 Claude Design donor',commit:'74f7a690fbec88cf98ce0936f31b72ad3f1148f5',blob:'6952697d7d3c9cd159ac3fdd924f24fa333c904d'}};
  const inside=(x,z)=>P.sdf(x,z)<=0;
  const baseHeightAt=(x,z)=>{
    const d=P.sdf(x,z);
    if(d<=0)return F.heightAt(x,z);
    return F.heightAt(x,z)-4-Math.min(32,d*1.45);
  };
  const W={
    id,zone,spawn,tile,log:[],docId:'r2d-world-'+Z.seed,storageKey:'kfb-r2d-world.'+Z.seed,
    SKY_MODES:[['day','Day']],skyMode:'day',city:null,supportReport:null,landmarks:[],
    get inkOn(){return false},get inkReport(){return null},get namesOn(){return false},
    baseHeightAt,
    maskAt:(x,z)=>inside(x,z)?F.maskAt(x,z):'under',
    groundAt(x,z,terrainHeight){return P.roadDist(x,z)<=P.hw+.2?Math.max(terrainHeight,P.roadY):terrainHeight},
    solidAt(){return 0},buildingAt(){return null},
    patchDoc(doc){
      doc.id=W.docId;
      doc.terrain={seed:Z.seed,height:10,macroScale:3.2,detail:.55,tile:{...tile},sculpt:{version:1,strokes:[]}};
      doc.objects=[];
      doc.world={format:'kfb.r2d.world-ref/1',provider:PROVIDER,seed:Z.seed,biome:Z.biome,shape:Z.shape,source:zone.provenance,
        player:{position:[+spawn.x.toFixed(3),0,+spawn.z.toFixed(3)],heading:+spawn.heading.toFixed(5)}};
      doc.sources.world={owner:'KFB WorldBuilder',sourceDonor:'R2D v0',terrain:'r2d-island-core.v1.js',track:'Track Core @ '+TRACK_PIN.slice(0,7)};
      return doc;
    },
    stage({camera,controls,fog}){camera.near=.1;camera.far=1800;camera.updateProjectionMatrix();controls.maxDistance=700;controls.minDistance=.3;controls.maxPolarAngle=Math.PI;controls.minPolarAngle=0;if(fog){fog.near=100;fog.far=650}},
    async mount({scene}){
      const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0});
      const road=ST.buildTrack(THREE,P.stream,mat);road.name='R2D Track Core road';
      road.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
      group.add(road);scene.add(group);
      W.log.push('R2D road · '+(TC.CORE_VERSION||'Track Core')+' · '+P.stream.samples.length+' samples');
    },
    dressTerrain(mesh){
      const pos=mesh.geometry.getAttribute('position'),colors=mesh.geometry.getAttribute('color');
      const C={veg:new THREE.Color(pal.grass),edge:new THREE.Color(pal.rock||pal.lip),walk:new THREE.Color(pal.paved),
        interact:new THREE.Color(pal.paved),building:new THREE.Color(pal.paved),water:new THREE.Color(pal.sand),
        under:new THREE.Color(pal.rock||'#6b6f78'),road:new THREE.Color(pal.paved)};
      for(let i=0;i<pos.count;i++){const m=W.maskAt(pos.getX(i),pos.getZ(i)),col=C[m]||C.veg;colors.setXYZ(i,col.r,col.g,col.b)}
      colors.needsUpdate=true;mesh.material.vertexColors=true;mesh.material.needsUpdate=true;mesh.name='R2D source-derived heightfield · seed '+Z.seed;
    },
    onTerrain(){return null},
    frameEdit(camera,controls){controls.target.set(P.c0[0],1.5,P.c0[1]);camera.position.set(P.c0[0]+maxR*1.15,Math.max(18,maxR*.55),P.c0[1]+maxR*1.45);controls.update()},
    tick(){},render(){return false},setVisible(v){group.visible=!!v},setInk(){},setNames(){},setScanRoots(){},
    async setSky(v){W.skyMode=v;return v}
  };
  return W;
}

export async function prepare(id){
  const Z=ZONES[id];if(!Z)throw new Error('unknown R2D world '+id);
  const [TC,ST,R2C]=await Promise.all([
    imp(TRACK_PIN,TRACK_DIR+'track-core.mjs'),
    imp(TRACK_PIN,TRACK_DIR+'stream-to-three.mjs'),
    imp(R2C_PIN,R2C_DIR+'lab-world/hex-archipel.r2c.js')
  ]);
  return makeWorld({id,Z,TC,ST,R2C,core:makeIslandCore(Z.seed,TC,Z.shape)});
}
