/* J14 transition-atlas.v1.js lines 194–246: curb stones and three sidewalk slab rows.
 * Bounded receiving seam: supplied Track samples; omit donor houses/end-plates/renderer.
 * Slab dimensions and native seed irregularity preserved; same visible meshes feed support. */
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {makeClayMaterial,seedGeometry,PROFILES} from '../../_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-material.v10.js';
import {TOOLMIX} from '../../_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-toolmix.v1.js';
export function buildJoyrideSidewalk(stream,U){
 const group=new THREE.Group(),S=stream.samples,L=S.at(-1).s,curb=[],slabs=[],h1=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)},at=s=>S.reduce((best,q)=>Math.abs(q.s-s)<Math.abs(best.s-s)?q:best,S[0]);
 function place(g,q,sd,d,y,twist){const m=new THREE.Matrix4().makeBasis(new THREE.Vector3(...q.R),new THREE.Vector3(...q.U),new THREE.Vector3(...q.T).negate()).multiply(new THREE.Matrix4().makeRotationY(twist));m.setPosition(...q.p.map((x,i)=>x+q.R[i]*sd*d+q.U[i]*y));g.applyMatrix4(m);return g;}
 for(let s=1;s<L-1;s+=1.05){const q=at(s);for(const sd of[-1,1]){const hh=h1(Math.floor(s*3.1)+sd*57),g=new RoundedBoxGeometry(.56,.36,.9,2,.13);g.deleteAttribute('uv');g.scale(1+.12*(hh-.5),1+.15*(h1(hh*99)-.5),1-.1*h1(hh*7));place(g,q,sd,q.prm.width/2+.62,.1,(hh-.5)*.12);seedGeometry(THREE,g,2600+curb.length);curb.push(g)}}
 for(let s=1;s<L-1;s+=2.1){const q=at(s);for(const sd of[-1,1])for(let r=0;r<3;r++){const hh=h1(Math.floor(s*4.7)*3+r+sd*91),g=new RoundedBoxGeometry(1.6,.2,1.95,2,.07);g.deleteAttribute('uv');g.scale(1+.06*(hh-.5),1+.3*(h1(hh*31)-.5),1);place(g,q,sd,q.prm.width/2+1.35+r*1.75,.22,(hh-.5)*.06);seedGeometry(THREE,g,3000+slabs.length);slabs.push(g)}}
 for(const [name,parts,color]of[['t4-bordstein',curb,'#e6ded1'],['t4-gehweg',slabs,'#cec3b0']]){if(!parts.length)continue;const material=makeClayMaterial(THREE,U,{src:new THREE.MeshStandardMaterial({color}),profile:{...PROFILES.prop,scale:1.5,print:.3,dent:0,gouge:0,crack:0,stroke:1,facet:.9,crease:.5,legacy:0,tools:TOOLMIX.rock}}),mesh=new THREE.Mesh(mergeGeometries(parts.map(g=>g.index?g.toNonIndexed():g)),material);mesh.name=name;mesh.castShadow=mesh.receiveShadow=true;group.add(mesh)}
 group.userData.sourceRecord={assetId:'Joyride native sidewalk',packId:'KFB Joyride J14',source:{commit:'927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f',path:'tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/transition-atlas.v1.js'}};return group;
}
