import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { stableHash } from '../style/cartoon-city.js';
import { cleanLine, junctionSpecs, pointSegmentDistance } from './street-surface.js';

function openPoly(poly){
  const out=(poly||[]).map(p=>({x:+p.x,z:+p.z})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.z));
  if(out.length>1&&Math.hypot(out[0].x-out.at(-1).x,out[0].z-out.at(-1).z)<.001)out.pop();
  return out;
}
function bounds(poly){
  const xs=poly.map(p=>p.x),zs=poly.map(p=>p.z);
  return {minX:Math.min(...xs),maxX:Math.max(...xs),minZ:Math.min(...zs),maxZ:Math.max(...zs)};
}
function inside(p,poly){
  let hit=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];
    const cross=((a.z>p.z)!==(b.z>p.z))&&(p.x<(b.x-a.x)*(p.z-a.z)/((b.z-a.z)||1e-12)+a.x);
    if(cross)hit=!hit;
  }
  return hit;
}
function polyDistance(p,poly){
  if(inside(p,poly))return 0;
  let best=Infinity;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++)best=Math.min(best,pointSegmentDistance(p,poly[j],poly[i]));
  return best;
}
function prepBuildings(buildings){
  return (buildings||[]).map(b=>{
    const poly=openPoly(b.footprint);
    return poly.length>=3?{poly,bounds:bounds(poly),sourceId:b.id}:null;
  }).filter(Boolean);
}
function buildingDistance(p,prepared){
  let best=Infinity;
  for(const b of prepared){
    const q=b.bounds;
    const dx=p.x<q.minX?q.minX-p.x:p.x>q.maxX?p.x-q.maxX:0;
    const dz=p.z<q.minZ?q.minZ-p.z:p.z>q.maxZ?p.z-q.maxZ:0;
    const boxD=Math.hypot(dx,dz);
    if(boxD>best)continue;
    best=Math.min(best,polyDistance(p,b.poly));
  }
  return best;
}
function lineLength(line){
  let total=0;
  for(let i=1;i<line.length;i++)total+=Math.hypot(line[i].x-line[i-1].x,line[i].z-line[i-1].z);
  return total;
}
function atDistance(line,target){
  let acc=0;
  for(let i=1;i<line.length;i++){
    const a=line[i-1],b=line[i];
    const len=Math.hypot(b.x-a.x,b.z-a.z);
    if(!len)continue;
    if(acc+len>=target){
      const t=(target-acc)/len;
      const dx=(b.x-a.x)/len,dz=(b.z-a.z)/len;
      return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,tangent:{x:dx,z:dz}};
    }
    acc+=len;
  }
  return null;
}
function roadClass(road){return String(road?.osm?.tags?.highway||'').toLowerCase();}
function localRoad(road){
  return ['residential','living_street','tertiary','tertiary_link','unclassified','service'].includes(roadClass(road));
}
function stableRank(seed,key){return stableHash(seed+':'+key)>>>0;}
function chooseSide(base,tangent,roadHalf,extra,buildings,minClearance){
  const n={x:-tangent.z,z:tangent.x};
  const choices=[-1,1].map(side=>{
    const normal={x:n.x*side,z:n.z*side};
    const p={x:base.x+normal.x*(roadHalf+extra),z:base.z+normal.z*(roadHalf+extra)};
    return {p,normal,clearance:buildingDistance(p,buildings)};
  }).sort((a,b)=>{
    if(!Number.isFinite(a.clearance)&&!Number.isFinite(b.clearance))return 0;
    if(!Number.isFinite(a.clearance))return -1;
    if(!Number.isFinite(b.clearance))return 1;
    return b.clearance-a.clearance;
  });
  return choices.find(c=>!Number.isFinite(c.clearance)||c.clearance>=minClearance)||null;
}
function makeCurbSlots(city,cfg,seed){
  const spacing=Math.max(22,Number(cfg.slotSpacingM??48));
  const extra=Math.max(.45,Number(cfg.curbExtraM??.9));
  const clearance=Math.max(.15,Number(cfg.buildingClearanceM??.65));
  const buildings=prepBuildings(city.features.buildings);
  const slots=[];
  for(const road of city.features.roads||[]){
    if(!road.driveable)continue;
    const line=cleanLine(road.centerline);
    if(line.length<2)continue;
    const total=lineLength(line);
    if(total<spacing*.7)continue;
    const phase=.3+((stableRank(seed,'phase:'+road.id)%500)/1000);
    for(let d=spacing*phase;d<total-spacing*.12;d+=spacing){
      const s=atDistance(line,d);if(!s)continue;
      const side=chooseSide(s,s.tangent,Number(road.widthM||5)/2,extra,buildings,clearance);
      if(!side)continue;
      slots.push({
        x:side.p.x,z:side.p.z,normal:side.normal,tangent:s.tangent,
        roadId:road.id,highway:roadClass(road),widthM:Number(road.widthM||5),
        buildingClearanceM:Number.isFinite(side.clearance)?side.clearance:null,
        local:localRoad(road),rank:stableRank(seed,'slot:'+road.id+':'+Math.round(d))
      });
    }
  }
  return slots.sort((a,b)=>a.rank-b.rank);
}
function selectSpaced(slots,count,minDistance,predicate=()=>true,blocked=[]){
  const out=[];
  for(const s of slots){
    if(out.length>=count)break;
    if(!predicate(s))continue;
    if(blocked.some(p=>Math.hypot(s.x-p.x,s.z-p.z)<minDistance))continue;
    if(out.some(p=>Math.hypot(s.x-p.x,s.z-p.z)<minDistance))continue;
    out.push(s);
  }
  return out;
}
function approachesForNode(roads,nodeId){
  const out=[],key=String(nodeId);
  for(const road of roads||[]){
    if(!road.driveable)continue;
    const line=cleanLine(road.centerline),ids=road.nodeIds||[];
    for(let i=0;i<Math.min(line.length,ids.length);i++){
      if(String(ids[i])!==key)continue;
      const p=line[i];
      for(const j of [i-1,i+1]){
        if(j<0||j>=line.length)continue;
        const q=line[j],dx=q.x-p.x,dz=q.z-p.z,len=Math.hypot(dx,dz);
        if(len<.05)continue;
        out.push({roadId:road.id,widthM:Number(road.widthM||5),highway:roadClass(road),dir:{x:dx/len,z:dz/len}});
      }
    }
  }
  const dedup=[];
  for(const a of out){
    if(dedup.some(b=>(a.dir.x*b.dir.x+a.dir.z*b.dir.z)>.985&&a.roadId===b.roadId))continue;
    dedup.push(a);
  }
  return dedup;
}
function signalJunctions(city,cfg,seed){
  const max=Math.max(0,Math.floor(Number(cfg.maxSignalJunctions??4)));
  if(!max)return [];
  const roads=city.features.roads||[];
  return junctionSpecs(roads,{driveableOnly:true,widthExtra:0})
    .map(j=>({...j,approaches:approachesForNode(roads,j.nodeId)}))
    .filter(j=>j.approaches.length>=3)
    .map(j=>{
      const maxWidth=Math.max(...j.approaches.map(a=>a.widthM),0);
      const major=j.approaches.filter(a=>['primary','secondary','tertiary','primary_link','secondary_link','tertiary_link'].includes(a.highway)).length;
      return {...j,maxWidth,score:j.approaches.length*100+major*25+maxWidth+(stableRank(seed,'junction:'+j.nodeId)%1000)/100000};
    })
    .sort((a,b)=>b.score-a.score).slice(0,max);
}
function signalKind(j,a){
  if(j.approaches.length>=4&&a.widthM>=8.5)return 'trafficlight_C';
  if(a.widthM>=6)return 'trafficlight_B';
  return 'trafficlight_A';
}
function signalPlacements(city,cfg,seed,buildings){
  const junctions=signalJunctions(city,cfg,seed),out=[];
  const extra=Math.max(.45,Number(cfg.signalCurbExtraM??.65));
  const clearance=Math.max(.15,Number(cfg.buildingClearanceM??.65));
  for(const j of junctions){
    for(const a of j.approaches.slice(0,4)){
      const base={x:j.x+a.dir.x*(j.radius+1.2),z:j.z+a.dir.z*(j.radius+1.2)};
      const side=chooseSide(base,a.dir,a.widthM/2,extra,buildings,clearance);
      if(!side)continue;
      out.push({
        type:signalKind(j,a),x:side.p.x,z:side.p.z,normal:side.normal,tangent:a.dir,
        junctionNodeId:j.nodeId,roadId:a.roadId,widthM:a.widthM,
        truth:'AUTHORED_TOPOLOGY_DEMO_NOT_OSM_SIGNAL_TAG'
      });
    }
  }
  return {junctions,placements:out};
}
function yawArmOverRoad(normal){return Math.atan2(-normal.z,normal.x);}
function candidateSet(city,cfg,seed){
  const buildings=prepBuildings(city.features.buildings);
  const signals=signalPlacements(city,cfg,seed,buildings);
  const blocked=signals.placements.map(p=>({x:p.x,z:p.z}));
  const slots=makeCurbSlots(city,cfg,seed);
  const streetlights=selectSpaced(slots,Math.max(0,Number(cfg.maxStreetlights??28)),Math.max(20,Number(cfg.streetlightMinSpacingM??38)),()=>true,blocked).map(s=>({...s,type:'streetlight'}));
  const benches=selectSpaced(slots,Math.max(0,Number(cfg.maxBenches??7)),Math.max(35,Number(cfg.benchMinSpacingM??75)),s=>s.local,[...blocked,...streetlights]).map(s=>({...s,type:'bench'}));
  const hydrants=selectSpaced(slots,Math.max(0,Number(cfg.maxHydrants??9)),Math.max(28,Number(cfg.hydrantMinSpacingM??62)),s=>s.local,[...blocked,...benches]).map(s=>({...s,type:'firehydrant'}));
  const dumpsters=selectSpaced(slots,Math.max(0,Number(cfg.maxDumpsters??4)),Math.max(45,Number(cfg.dumpsterMinSpacingM??110)),s=>s.local&&Number.isFinite(s.buildingClearanceM)&&s.buildingClearanceM<8,[...blocked,...benches,...hydrants]).map(s=>({...s,type:'dumpster'}));
  return {
    all:[...signals.placements,...streetlights,...benches,...hydrants,...dumpsters],
    trafficPlan:{
      schema:'kfb.osm-city.traffic-plan-seam.v0',
      status:'PROPOSAL_SEAM_NO_RULE_RUNTIME',
      truth:'signal placements are authored from road topology; current normalized source has no preserved OSM traffic_signal point semantics',
      junctions:signals.junctions.map(j=>({
        id:'osm-node-'+j.nodeId,sourceNodeId:j.nodeId,approachCount:j.approaches.length,
        maxRoadWidthM:+j.maxWidth.toFixed(2),
        hooks:['traffic.red_light','traffic.speeding','traffic.yield_missed','traffic.clean_pass']
      }))
    }
  };
}
function loadAsync(loader,url){return new Promise((resolve,reject)=>loader.load(url,resolve,undefined,reject));}

export async function createCityFurniture(THREE,city,cfg={},seedRoot='kfb-city'){
  const root=new THREE.Group();root.name='kfb-city-furniture-r0';
  const seed=seedRoot+':furniture-r0';
  const {all:candidates,trafficPlan}=candidateSet(city,cfg,seed);
  const assets=new Map((cfg.assets||[]).map(a=>[a.id,a]));
  const loader=new GLTFLoader(),templates=new Map(),errors=[];
  for(const id of [...new Set(candidates.map(c=>c.type))]){
    const spec=assets.get(id);
    if(!spec?.url){errors.push({id,error:'missing asset config'});continue;}
    try{
      const gltf=await loadAsync(loader,spec.url);
      gltf.scene.updateMatrixWorld(true);
      const box=new THREE.Box3().setFromObject(gltf.scene);
      const height=Math.max(.0001,box.max.y-box.min.y);
      templates.set(id,{spec,scene:gltf.scene,minY:box.min.y,height});
    }catch(error){errors.push({id,url:spec.url,error:String(error)});}
  }
  const placed=[];
  for(const c of candidates){
    const t=templates.get(c.type);if(!t)continue;
    const desired=Math.max(.05,Number(t.spec.targetHeightM||t.height));
    const scale=desired/t.height,clone=t.scene.clone(true);
    clone.scale.setScalar(scale);
    clone.position.set(c.x,-t.minY*scale+.012,c.z);
    if(c.type==='streetlight'||c.type.startsWith('trafficlight_'))clone.rotation.y=yawArmOverRoad(c.normal);
    else if(c.type==='bench'||c.type==='dumpster')clone.rotation.y=Math.atan2(-c.normal.x,-c.normal.z);
    else clone.rotation.y=(stableRank(seed,c.type+':yaw:'+c.roadId+':'+Math.round(c.x))%6283)/1000;
    clone.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;}});
    clone.userData.cityFurnitureType=c.type;clone.userData.sourceRoadId=c.roadId||null;clone.userData.junctionNodeId=c.junctionNodeId||null;
    root.add(clone);placed.push({...c,asset:t.spec.url,targetHeightM:desired});
  }
  const byType={};for(const p of placed)byType[p.type]=(byType[p.type]||0)+1;
  return {root,candidates:placed,byType,trafficPlan,errors,loadedAssets:[...templates.values()].map(t=>t.spec.url),dispose(){root.clear();}};
}
