/* Source-clean WB2 building adapter. CONTENT comes only from existing Registry records.
 * Seam: native meshes → authored island pads → existing WB2 ground/collision reader.
 * Legacy fixture/data/presenter are never imported or fetched. */
import * as THREE from 'three';
import {manifest,loadRegistered,adaptRegistered} from './wb2-source-evidence.v1.js';
export const SCHEMA='kfb.r2d-building-family-adapter/2';
export const SOURCE=Object.freeze({owner:'Asset Librarian / Registry',manifest:'VISIBLE_SOURCE_MANIFEST.json',presentation:'K2 / clay-material.v10.js'});

export async function mountR2DBuildings({group,plan,field}){
  const worldId=plan.worldId||'world.kfb-town',records=manifest.families[worldId];
  if(!records?.length)throw Error('Missing registered visible family: '+worldId);
  const root=new THREE.Group();root.name='Registered building family · '+worldId;group.add(root);
  const centre=plan.plazas.find(p=>p.kind==='big')||{x:plan.c0[0],z:plan.c0[1]},placed=[];
  for(let i=0;i<records.length;i++){
    const record=records[i],model=await loadRegistered(record);
    const sourceBox=new THREE.Box3().setFromObject(model),nativeSize=sourceBox.getSize(new THREE.Vector3());
    // Scale is authored world composition, never a replacement mesh/palette. Preserve relative anatomy.
    const pad=plan.pads[i]||null,a=(i-records.length*.15)*Math.PI*2/Math.max(4,records.length),ring=11;
    const x=pad?pad.x:centre.x+Math.cos(a)*ring,z=pad?pad.z:centre.z+Math.sin(a)*ring;
    const radius=Math.hypot(nativeSize.x,nativeSize.z)/2;
    const scale=Math.min(4,pad?pad.r*.75/Math.max(radius,.01):4/Math.max(radius,.01));
    model.scale.setScalar(scale);model.rotation.y=Math.atan2(centre.x-x,centre.z-z);
    model.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(model);
    const offsets=[[0,0],[b.min.x,b.min.z],[b.max.x,b.min.z],[b.min.x,b.max.z],[b.max.x,b.max.z]];
    const heights=offsets.map(([dx,dz])=>field.heightAt(x+dx,z+dz)),base=Math.max(...heights);
    model.position.set(x,base-b.min.y,z);await adaptRegistered(model,plan.seed*101+i);
    model.name=worldId+' · '+record.assetId.split('/').pop();model.userData.sourceRecord=record;model.userData.worldId=worldId;
    root.add(model);model.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(model);
    placed.push({id:worldId+'/building/'+i,assetId:record.assetId,source:record.source,packId:record.packId,fitScale:scale,x,z,height:bounds.max.y-base,base,top:bounds.max.y,bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},nativeSize:nativeSize.toArray(),footprintSpan:Math.max(...heights)-Math.min(...heights)});
  }
  const at=(x,z)=>placed.find(p=>x>=p.bounds.min[0]&&x<=p.bounds.max[0]&&z>=p.bounds.min[2]&&z<=p.bounds.max[2])||null;
  const report={schema:SCHEMA,owner:SOURCE.owner,presentation:SOURCE.presentation,worldId,sourceFamily:records[0].packId,placed,support:{moved:placed.length,maxOffsetM:Math.max(...placed.map(p=>Math.abs(p.base))),maxFootprintSpanM:Math.max(...placed.map(p=>p.footprintSpan))},stats:{buildings:placed.length},sourceStatus:'NATIVE_MESHES_SOURCE_PROVEN_ADAPTED_REVIEW_PENDING'};
  return{root,city:null,at,report,zone:{buildings:placed}};
}
