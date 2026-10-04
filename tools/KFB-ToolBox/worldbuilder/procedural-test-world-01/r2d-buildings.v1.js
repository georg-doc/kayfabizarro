/* Source-clean WB2 building adapter. CONTENT comes only from existing Registry records.
 * Seam: native meshes → authored island pads → existing WB2 ground/collision reader.
 * Legacy fixture/data/presenter are never imported or fetched. */
import * as THREE from 'three';
import {manifest,loadRegistered,adaptRegistered} from './wb2-source-evidence.v1.js';
import {hull,findPlacement,checkFootprint} from './world-clearance.v1.mjs';
export const SCHEMA='kfb.r2d-building-family-adapter/3';
export const SOURCE=Object.freeze({owner:'Asset Librarian / Registry',manifest:'VISIBLE_SOURCE_MANIFEST.json',presentation:'K2 / clay-material.v10.js'});

export async function mountR2DBuildings({group,plan,field,corridors=[],anchors=[],roots=[]}){
  const worldId=plan.worldId||'world.kfb-town',records=manifest.families[worldId];
  if(!records?.length)throw Error('Missing registered visible family: '+worldId);
  const root=new THREE.Group();root.name='Registered building family · '+worldId;group.add(root);
  const centre=plan.plazas.find(p=>p.kind==='big')||{x:plan.c0[0],z:plan.c0[1]},placed=[];
  for(let i=0;i<records.length;i++){
    const record=records[i],model=await loadRegistered(record);
    const sourceBox=new THREE.Box3().setFromObject(model),nativeSize=sourceBox.getSize(new THREE.Vector3());
    // Scale is authored world composition, never a replacement mesh/palette. Preserve relative anatomy.
    // Golden Journey reserves the first Utopia/Protopia pad for its native Resident set.
    const pads=['world.utopia','world.protopia'].includes(worldId)?plan.pads.slice(1):plan.pads;
    const pad=pads[i]||null;
    const radius=Math.hypot(nativeSize.x,nativeSize.z)/2;
    const scale=Math.min(4,pad?pad.r*.75/Math.max(radius,.01):4/Math.max(radius,.01));
    model.scale.setScalar(scale);model.updateMatrixWorld(true);
    const points=[],v=new THREE.Vector3();model.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let k=0;k<p.count;k++){v.fromBufferAttribute(p,k).applyMatrix4(o.matrixWorld);points.push([v.x,v.z])}}});
    const angle=(i-records.length*.15)*Math.PI*2/Math.max(4,records.length),oldX=pad?pad.x:centre.x+Math.cos(angle)*16,oldZ=pad?pad.z:centre.z+Math.sin(angle)*16;
    model.rotation.y=Math.atan2(centre.x-oldX,centre.z-oldZ);model.updateMatrixWorld(true);const oldBox=new THREE.Box3().setFromObject(model);
    const oldBase=Math.max(...[[0,0],[oldBox.min.x,oldBox.min.z],[oldBox.max.x,oldBox.min.z],[oldBox.min.x,oldBox.max.z],[oldBox.max.x,oldBox.max.z]].map(([dx,dz])=>field.heightAt(oldX+dx,oldZ+dz)));
    const legacyTransform={position:[oldX,oldBase-oldBox.min.y,oldZ],rotation:[0,model.rotation.y,0],scale:[scale,scale,scale]};model.rotation.y=0;
    const localFootprint=hull(points),preferred=pad?[pad.x,pad.z]:[centre.x+(i%3-1)*9,centre.z+(Math.floor(i/3)+1)*10];
    const rotation=Math.atan2(centre.x-preferred[0],centre.z-preferred[1]);
    const constraints={corridors,anchors,roots,buildings:placed,setback:1};
    const fit=findPlacement({localFootprint,preferred,centre:[centre.x,centre.z],plan,field,constraints,rotation});
    const {x,z,base}=fit;model.rotation.y=rotation;model.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(model);
    model.position.set(x,base-b.min.y,z);await adaptRegistered(model,plan.seed*101+i);
    model.name=worldId+' · '+record.assetId.split('/').pop();model.userData.sourceRecord=record;model.userData.worldId=worldId;
    root.add(model);model.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(model);
    placed.push({id:worldId+'/building/'+i,assetId:record.assetId,source:record.source,packId:record.packId,fitScale:scale,legacyTransform,x,z,position:model.position.toArray(),rotation:[0,model.rotation.y,0],height:bounds.max.y-base,base,top:bounds.max.y,bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},nativeSize:nativeSize.toArray(),footprintSpan:fit.span,footprint:fit.footprint,clearance:{rejectedCandidates:fit.rejected,hits:checkFootprint(fit.footprint,constraints)}});
  }
  const at=(x,z)=>placed.find(p=>x>=p.bounds.min[0]&&x<=p.bounds.max[0]&&z>=p.bounds.min[2]&&z<=p.bounds.max[2])||null;
  const report={schema:SCHEMA,owner:SOURCE.owner,presentation:SOURCE.presentation,worldId,sourceFamily:records[0].packId,placed,support:{moved:placed.length,maxOffsetM:Math.max(...placed.map(p=>Math.abs(p.base))),maxFootprintSpanM:Math.max(...placed.map(p=>p.footprintSpan))},stats:{buildings:placed.length},sourceStatus:'NATIVE_MESHES_SOURCE_PROVEN_ADAPTED_REVIEW_PENDING'};
  return{root,city:null,at,report,zone:{buildings:placed}};
}

