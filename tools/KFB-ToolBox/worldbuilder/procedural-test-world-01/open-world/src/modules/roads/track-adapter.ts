// Coworker supplies intent only. All final road/bridge/race/junction construction is Track Core 0.12.
import * as THREE from 'three';
import {compileGraph} from '../../owners/track-core/track-core.mjs';
import {buildTrack} from '../../owners/track-core/stream-to-three.mjs';
import type {CoreContext,ChunkInfo} from '../../core/types';
import type {ChunkBuilder} from '../../core/chunks';
import {hexToWorld,worldToHex,hexToChunk,chunkKey} from '../../core/hex';
import {surfaceFor} from '../../core/surface';
import {roadNetOf} from './layers';
import {objectsFor} from '../../core/objects';
type V3=[number,number,number];
export class TrackConstruction {
 readonly recipes=new Map<string,any>();
 readonly streams=new Map<string,any>();
 private regions=new Map<string,string[]>();
 private geometries=new Map<string,THREE.Group>();
 private samples=new Map<string,any[]>();
 private bins=new Map<string,any[]>();
 private material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.94});
 constructor(private ctx:CoreContext){
   const surface=surfaceFor(ctx.world.seed);
   surface.contribute({id:'20-track-core-roadbeds',owner:'track-core',sample:(x,z,base)=>{
     const near=this.near(x,z);let hit:null|{height:number;weight:number}=null;
     for(const q of this.bins.get(Math.floor(x/20)+','+Math.floor(z/20))??[]) {
       const dx=x-q.p[0],dz=z-q.p[2],along=dx*q.T[0]+dz*q.T[2],lat=Math.abs(dx*q.R[0]+dz*q.R[2]);
       if(Math.abs(along)>3 ||lat>q.prm.width/2+6)continue;
       // Bridges retain the river valley. Approach grade enters through the same declared kit recipe.
       if(q.tags?.includes('bridge'))continue;
       const t=Math.max(0,Math.min(1,(q.prm.width/2+6-lat)/6));
       const height=q.p[1]-.08;if(!hit||t>hit.weight)hit={height,weight:t*t*(3-2*t)};
     }return hit;
   }});
 }
 private near(x:number,z:number):string[] {
   const h=worldToHex(x,z),key=Math.floor(h.q/16)+','+Math.floor(h.r/16);
   const known=this.regions.get(key);if(known)return known;
   const net=roadNetOf(this.ctx.world.seed);if(!net)return [];
   const ids=new Set<string>();
   for(const {node} of net.nodesNear(Math.floor(h.q/16)*16+8,Math.floor(h.r/16)*16+8,48)) {
     for(const k of net.allDirs(node.i,node.j)) {
       if(!net.alive(node.i,node.j,k))continue;const path=net.pathAny(node.i,node.j,k);if(!path)continue;
       const ends=[`${path.a.i},${path.a.j}`,`${path.b.i},${path.b.j}`].sort();const id='road:'+ends.join('/');
       ids.add(id);if(this.recipes.has(id))continue;
       const pts=path.steps.map(st=>hexToWorld(st.q,st.r));if(pts.length<2)continue;
       const S=surfaceFor(this.ctx.world.seed),point=(w:{x:number;z:number}):V3=>[w.x,S.designHeightAt(w.x,w.z)+.08,w.z];
       const heading=(a:{x:number;z:number},b:{x:number;z:number})=>Math.atan2(-(b.x-a.x),b.z-a.z)*180/Math.PI;
       const selected=pts.filter((_p,i)=>i===0||i===pts.length-1||i%5===0);
       const pieces=selected.slice(1).map((w,i)=>({id:`${id}/segment:${i}`,type:'CONNECT',to:{p:point(w),headingDeg:heading(selected[Math.max(0,i)],selected[Math.min(selected.length-1,i+2)]),grade:0},tags:[path.steps.some(st=>this.ctx.world.cellAt(3,st.q,st.r).riverMask)?'bridge':'ordinary']}));
       const recipe={schema:'kfb.track-core.graph/0.3',id,ds:2,defaults:{widthClass:'NARROW',markings:'STREET',biome:'city',autoBank:{gain:0,limitDeg:0}},routes:[{id:'main',start:{p:point(selected[0]),headingDeg:heading(selected[0],selected[1])},pieces}]};
       const stream=compileGraph(recipe);this.recipes.set(id,recipe);this.streams.set(id,stream);
       const samples=Object.values(stream.routes).flatMap((r:any)=>r.samples);this.samples.set(id,samples);
       for(const q of samples){const radius=q.prm.width/2+9;for(let bz=Math.floor((q.p[2]-radius)/20);bz<=Math.floor((q.p[2]+radius)/20);bz++)for(let bx=Math.floor((q.p[0]-radius)/20);bx<=Math.floor((q.p[0]+radius)/20);bx++){const key=bx+','+bz;let l=this.bins.get(key);if(!l)this.bins.set(key,l=[]);l.push(q);}}
       const group=buildTrack(THREE,stream,this.material,{contact:true});group.userData.sourceOwner='Track Core 0.12';this.geometries.set(id,group);
       const c=hexToChunk(path.a.q,path.a.r);
       for(const piece of pieces){const m=new THREE.Matrix4().makeTranslation(...piece.to.p);objectsFor(this.ctx.world.seed).register({id:piece.id,source:'KFB Track Core 0.12',recipe:id,chunk:chunkKey(c.cx,c.cz),role:'road-segment',matrix:m.toArray(),origin:'procedural',parent:id,stateRef:piece.id});}
     }
   }
   const out=[...ids].sort();this.regions.set(key,out);return out;
 }
 build(chunk:ChunkInfo,out:ChunkBuilder){
   const centre=this.ctx.chunks.chunkCenter(chunk.cx,chunk.cz),ids=this.near(centre.x,centre.z);
   for(const id of ids){const group=this.geometries.get(id);if(!group)continue;
     group.traverse(o=>{const m=o as THREE.Mesh;if(!m.isMesh||!m.geometry.index)return;
       const geo=m.geometry,P=geo.attributes.position,I=geo.index!,pos:number[]=[],col:number[]=[],idx:number[]=[];
       for(let k=0;k<I.count;k+=3){const a=I.getX(k),b=I.getX(k+1),c=I.getX(k+2),x=(P.getX(a)+P.getX(b)+P.getX(c))/3,z=(P.getZ(a)+P.getZ(b)+P.getZ(c))/3,h=worldToHex(x,z),ch=hexToChunk(h.q,h.r);
         if(ch.cx!==chunk.cx||ch.cz!==chunk.cz)continue;
         for(const v of [a,b,c]){idx.push(pos.length/3);pos.push(P.getX(v),P.getY(v),P.getZ(v));const C=geo.attributes.color;col.push(C?.getX(v)??1,C?.getY(v)??1,C?.getZ(v)??1);}}
       if(!idx.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
       const mesh=new THREE.Mesh(g,m.material);mesh.name=id;mesh.castShadow=mesh.receiveShadow=true;mesh.userData.recipe=id;out.addObject(mesh);
       // Contact geometry is built by the same pinned kit, not a bespoke sweep or fallback collider.
       out.addCollider(this.ctx.rapier.ColliderDesc.trimesh(new Float32Array(pos),new Uint32Array(idx)));
     });
   }
 }
 stats(){return {constructionOwner:'KFB Track Core 0.12',recipes:this.recipes.size,streams:this.streams.size};}
}
