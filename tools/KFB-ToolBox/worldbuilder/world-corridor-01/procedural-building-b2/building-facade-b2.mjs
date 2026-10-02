import * as THREE from 'three';
import * as CC from '../../../../osm-city-lab/src/style/cartoon-city.js';
import * as EG from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@0c59e92d9d8688f5a88cd309ae8891dcd174c2fc/tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs';
import {
  loadZone
} from '../../../_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/wd1-seam.js';
import {
  buildCityLayer,
  FACADE_RULE,
  pointInPoly
} from '../../../_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/wd1-city.js';
import {
  loadB1Corpus
} from '../procedural-building-b1/building-family-b1.mjs';

export const B2_SOURCE=Object.freeze({
  owner:{
    path:'tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/wd1-city.js',
    blob:'c11b6f7156eaee808fe4689ee406f9b3480b6f0b',
    export:'buildCityLayer',
    facadeRule:FACADE_RULE.id
  },
  seam:{
    path:'tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/wd1-seam.js',
    blob:'95c6bfa04a4dd2106039db600b1e826ef48f4490'
  },
  fixture:{
    path:'tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/fixtures/huerth-crop-v0.json',
    blob:'c242f09421a72249edb9c9ba8e431532666ab321',
    buildings:700,
    roads:164,
    landuse:22
  },
  elasticHead:'0c59e92d9d8688f5a88cd309ae8891dcd174c2fc'
});

const FIXTURE_URL='/tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/fixtures/huerth-crop-v0.json';
const STYLE_URL='/tools/osm-city-lab/styles/kfb-city-v0.json';

const DRIVE=new Set(['primary','primary_link','secondary','secondary_link','tertiary','tertiary_link','residential','service','living_street','unclassified']);
const FOOT=new Set(['footway','path','cycleway','steps','corridor','platform','track']);

function openSourceFootprint(fp){
  const p=(fp||[]).map(q=>({x:Number(q.x),z:Number(q.z)}));
  if(p.length>1&&Math.hypot(p[0].x-p.at(-1).x,p[0].z-p.at(-1).z)<.001)p.pop();
  return p;
}
function sourceToWorldFootprint(fp){
  return openSourceFootprint(fp).map(p=>({x:p.x,z:-p.z}));
}
function centroid(fp){
  return fp.reduce((a,p)=>({x:a.x+p.x/fp.length,z:a.z+p.z/fp.length}),{x:0,z:0});
}

function replaceSibling(zone,entry){
  const idx=zone.buildings.findIndex(b=>b.id===entry.topology.id);
  if(idx<0)throw new Error('B2 topology donor missing in seam '+entry.topology.id);
  const original=zone.buildings[idx];
  const replacement={
    ...original,
    id:entry.sibling.id,
    h:Number(entry.sibling.heightM),
    roof:{...(entry.sibling.roof||original.roof)},
    mc:entry.sibling.materialClass||original.mc,
    fp:sourceToWorldFootprint(entry.sibling.footprint),
    b2SourceTopology:entry.topology.id,
    b2SourceEnvelope:entry.envelope.id,
    b2Lane:entry.lane.id
  };
  zone.buildings[idx]=replacement;
  if(zone.conflicts?.has(original.id)){
    zone.conflicts.delete(original.id);
    zone.conflicts.add(replacement.id);
  }
  return {original,replacement};
}

export async function prepareB2(){
  const [zone,corpus,style]=await Promise.all([
    loadZone({kind:'frozen-fixture',url:FIXTURE_URL}),
    loadB1Corpus(),
    fetch(STYLE_URL,{cache:'no-store'}).then(r=>{
      if(!r.ok)throw new Error('style HTTP '+r.status);
      return r.json();
    })
  ]);

  const replacements=[];
  for(const entry of corpus.lanes)replacements.push({...replaceSibling(zone,entry),entry});

  return {zone,corpus,style,replacements};
}

export function buildB2OwnerOutput(prepared,{renderer=null}={}){
  const output=buildCityLayer(prepared.zone,{
    mode:'elastic',
    style:prepared.style,
    CC,
    EG,
    ghosts:true,
    renderer,
    extraBase:new Set(),
    facade:'rule-v1'
  });
  return output;
}

function segmentDistance(px,pz,a,b){
  const dx=b.x-a.x,dz=b.z-a.z,l2=dx*dx+dz*dz||1;
  const t=Math.max(0,Math.min(1,((px-a.x)*dx+(pz-a.z)*dz)/l2));
  return Math.hypot(px-(a.x+dx*t),pz-(a.z+dz*t));
}
function outwardEdge(fp,i){
  const a=fp[i],b=fp[(i+1)%fp.length],dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz)||1;
  let nx=-dz/len,nz=dx/len;
  const mx=(a.x+b.x)/2,mz=(a.z+b.z)/2;
  if(pointInPoly(mx+nx*.3,mz+nz*.3,fp)){nx=-nx;nz=-nz;}
  return {i,a,b,len,nx,nz,mx,mz};
}
function edgeParty(zone,building,edge){
  let hits=0;
  for(const u of [.25,.5,.75]){
    const x=edge.a.x+(edge.b.x-edge.a.x)*u+edge.nx;
    const z=edge.a.z+(edge.b.z-edge.a.z)*u+edge.nz;
    if(zone.buildings.some(o=>o.id!==building.id&&pointInPoly(x,z,o.fp)))hits++;
  }
  return hits>=2;
}
function distanceToRoads(zone,x,z){
  let best=Infinity;
  for(const r of zone.roads){
    if(r.tunnel==='yes'||r.layer<0||!(DRIVE.has(r.cls)||FOOT.has(r.cls)||r.cls==='pedestrian'))continue;
    for(let i=1;i<r.line.length;i++)best=Math.min(best,segmentDistance(x,z,r.line[i-1],r.line[i]));
  }
  return best;
}
function edgeSemanticFacts(zone,building){
  const fp=building.fp;
  return fp.map((_,i)=>{
    const e=outwardEdge(fp,i);
    const party=edgeParty(zone,building,e);
    const roadDist=distanceToRoads(zone,e.mx+e.nx*FACADE_RULE.roadProbeM,e.mz+e.nz*FACADE_RULE.roadProbeM);
    return {...e,party,roadDist};
  });
}

function detailCentroid(output,tuple){
  const [key,start,count]=tuple,mesh=output.detailMeshes?.[key];
  if(!mesh)throw new Error('detail mesh missing '+key);
  const p=mesh.geometry.getAttribute('position');
  let x=0,y=0,z=0;
  for(let i=start;i<start+count;i++){x+=p.getX(i);y+=p.getY(i);z+=p.getZ(i);}
  return {key,start,count,kind:key.split(':')[0],x:x/count,y:y/count,z:z/count};
}
function nearestEdgeIndex(fp,p){
  let best={i:-1,d:Infinity};
  for(let i=0;i<fp.length;i++){
    const d=segmentDistance(p.x,p.z,fp[i],fp[(i+1)%fp.length]);
    if(d<best.d)best={i,d};
  }
  return best;
}

export function siblingFacadeFacts(prepared,output,replacement){
  const building=replacement.replacement;
  const rec=output.support.records.find(r=>r.id===building.id);
  if(!rec)throw new Error('support record missing '+building.id);

  const details=rec.det.map(t=>detailCentroid(output,t));
  const edges=edgeSemanticFacts(prepared.zone,building);

  const mapped=details.map(d=>{
    const nearest=nearestEdgeIndex(building.fp,d);
    return {...d,edgeIndex:nearest.i,edgeDistance:nearest.d,edgeParty:edges[nearest.i]?.party??false,edgeRoadDist:edges[nearest.i]?.roadDist??Infinity};
  });
  const doors=mapped.filter(d=>d.kind==='door');
  const windows=mapped.filter(d=>d.kind==='window');
  const eligible=edges.filter(e=>!e.party&&e.len>=FACADE_RULE.minEdge);
  const minRoad=Math.min(...eligible.map(e=>e.roadDist));
  const doorBest=Math.min(...doors.map(d=>d.edgeRoadDist));
  const windowYs=windows.map(d=>d.y);
  const shapedDetails=mapped.filter(d=>d.count>18).length;

  return {
    lane:replacement.entry.lane.id,
    siblingId:building.id,
    topologyId:replacement.entry.topology.id,
    envelopeId:replacement.entry.envelope.id,
    footprintCorners:building.fp.length,
    supportRecord:true,
    wallVertexCount:rec.walls[1],
    roofVertexCount:rec.roof[1],
    detailCount:mapped.length,
    doors:doors.length,
    windows:windows.length,
    shapedDetails,
    partyEdges:edges.filter(e=>e.party).length,
    windowsOnParty:windows.filter(d=>d.edgeParty).length,
    doorsOnParty:doors.filter(d=>d.edgeParty).length,
    minEligibleRoadDistance:Number.isFinite(minRoad)?minRoad:null,
    doorEdgeRoadDistance:Number.isFinite(doorBest)?doorBest:null,
    doorWithinRoadRange:Number.isFinite(doorBest)&&doorBest<=FACADE_RULE.roadMaxM+1,
    doorNearBestRoadEdge:Number.isFinite(doorBest)&&Number.isFinite(minRoad)&&doorBest<=minRoad+4,
    windowVerticalSpan:windowYs.length?Math.max(...windowYs)-Math.min(...windowYs):0,
    multiFloorWindows:windowYs.length>=2&&(Math.max(...windowYs)-Math.min(...windowYs))>FACADE_RULE.floorH*.8,
    details:mapped,
    edges:edges.map(e=>({i:e.i,len:e.len,party:e.party,roadDist:Number.isFinite(e.roadDist)?e.roadDist:null}))
  };
}

function extractRange(mesh,start,count){
  if(!mesh||!mesh.geometry)return null;
  const src=mesh.geometry, out=new THREE.BufferGeometry();
  for(const [name,a] of Object.entries(src.attributes)){
    const ctor=a.array.constructor;
    const slice=a.array.slice(start*a.itemSize,(start+count)*a.itemSize);
    out.setAttribute(name,new THREE.BufferAttribute(new ctor(slice),a.itemSize,a.normalized));
  }
  if(src.index){
    const ix=src.index.array, dst=[];
    for(let i=0;i<ix.length;i+=3){
      const a=ix[i],b=ix[i+1],c=ix[i+2];
      if(a>=start&&a<start+count&&b>=start&&b<start+count&&c>=start&&c<start+count){
        dst.push(a-start,b-start,c-start);
      }
    }
    out.setIndex(dst);
  }
  if(!out.getAttribute('normal'))out.computeVertexNormals();
  out.computeBoundingBox();out.computeBoundingSphere();
  return out;
}

export function extractSiblingGroup(output,siblingId){
  const rec=output.support.records.find(r=>r.id===siblingId);
  if(!rec)throw new Error('support record missing '+siblingId);
  const group=new THREE.Group();
  group.name='B2 evidence '+siblingId;

  const wallG=extractRange(output.blocks,rec.walls[0],rec.walls[1]);
  const roofG=extractRange(output.roofs,rec.roof[0],rec.roof[1]);
  const wall=new THREE.Mesh(wallG,output.blocks.material.clone());wall.name='walls';wall.castShadow=wall.receiveShadow=true;group.add(wall);
  const roof=new THREE.Mesh(roofG,output.roofs.material.clone());roof.name='roof';roof.castShadow=roof.receiveShadow=true;group.add(roof);

  for(const [key,start,count] of rec.det){
    const src=output.detailMeshes[key];
    const g=extractRange(src,start,count);
    const m=new THREE.Mesh(g,src.material.clone());
    m.name=key.split(':')[0];
    m.castShadow=m.receiveShadow=true;
    group.add(m);
  }
  return group;
}

export function b2Summary(prepared,output){
  return {
    owner:B2_SOURCE.owner,
    seam:B2_SOURCE.seam,
    fixture:B2_SOURCE.fixture,
    zone:{
      id:prepared.zone.id,
      buildings:prepared.zone.buildings.length,
      roads:prepared.zone.roads.length,
      landuse:prepared.zone.landuse.length
    },
    presenter:{
      facadeRule:output.stats.facade.rule,
      buildings:output.stats.buildings,
      details:output.stats.details,
      windows:output.stats.facade.windows,
      doors:output.stats.facade.doors,
      partyEdges:output.stats.facade.partyEdges,
      bare:output.stats.facade.bare,
      wallNormalsOnly:output.stats.wallNormalsOnly
    },
    siblings:prepared.replacements.map(r=>siblingFacadeFacts(prepared,output,r)),
    materialDecision:false,
    ownerModified:false
  };
}
