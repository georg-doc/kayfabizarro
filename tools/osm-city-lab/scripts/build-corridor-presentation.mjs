import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { stableHash, mulberry32 } from '../src/style/cartoon-city.js';
import { streetSignCandidates } from '../src/viewer/street-signs.js';

const ID='ehrenfeld-huerth-corridor-v0';
const DATA=new URL('../data/ehrenfeld-huerth-corridor-v0/',import.meta.url);
const normalized=JSON.parse(await fs.readFile(new URL('normalized.json',DATA),'utf8'));
const style=JSON.parse(await fs.readFile(new URL('../styles/kfb-city-v0.json',import.meta.url),'utf8'));
const consumer=JSON.parse(await fs.readFile(new URL('../evidence/ehrenfeld-huerth-corridor-v0-consumer.json',import.meta.url),'utf8'));

if(normalized.id!==ID)throw new Error('wrong normalized corridor id');
if(consumer.id!==ID)throw new Error('wrong consumer evidence id');
if(normalized.frame?.units!=='metre')throw new Error('corridor presentation requires local metre frame');

const cfg=style.corridorPresentation;
if(!cfg?.forest?.assetSource?.paths?.length)throw new Error('corridor forest config missing');
if(!cfg?.streetSigns)throw new Error('corridor street-sign config missing');

function sha(text){return crypto.createHash('sha256').update(text).digest('hex');}
function round(v,n=3){return +Number(v).toFixed(n);}
function openPoly(poly){
  const out=(poly||[]).map(p=>({x:+p.x,z:+p.z})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.z));
  if(out.length>1&&Math.hypot(out[0].x-out.at(-1).x,out[0].z-out.at(-1).z)<.001)out.pop();
  return out;
}
function polyArea(poly){
  let a=0;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++)a+=poly[j].x*poly[i].z-poly[i].x*poly[j].z;
  return Math.abs(a*.5);
}
function polyBounds(poly){
  let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
  for(const p of poly){if(p.x<minX)minX=p.x;if(p.x>maxX)maxX=p.x;if(p.z<minZ)minZ=p.z;if(p.z>maxZ)maxZ=p.z;}
  return {minX,maxX,minZ,maxZ};
}
function inside(p,poly){
  let hit=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];
    if(((a.z>p.z)!==(b.z>p.z))&&(p.x<(b.x-a.x)*(p.z-a.z)/((b.z-a.z)||1e-12)+a.x))hit=!hit;
  }
  return hit;
}
function pointSegDistance(p,a,b){
  const dx=b.x-a.x,dz=b.z-a.z,l2=dx*dx+dz*dz||1;
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/l2));
  return Math.hypot(p.x-(a.x+dx*t),p.z-(a.z+dz*t));
}
function pointPolyDistance(p,poly){
  if(inside(p,poly))return 0;
  let best=Infinity;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++)best=Math.min(best,pointSegDistance(p,poly[j],poly[i]));
  return best;
}

class Grid{
  constructor(size){this.size=size;this.map=new Map();}
  key(ix,iz){return ix+','+iz;}
  cells(minX,maxX,minZ,maxZ){
    const a=Math.floor(minX/this.size),b=Math.floor(maxX/this.size);
    const c=Math.floor(minZ/this.size),d=Math.floor(maxZ/this.size);
    const out=[];
    for(let ix=a;ix<=b;ix++)for(let iz=c;iz<=d;iz++)out.push(this.key(ix,iz));
    return out;
  }
  insertBox(minX,maxX,minZ,maxZ,item){
    for(const key of this.cells(minX,maxX,minZ,maxZ)){
      if(!this.map.has(key))this.map.set(key,[]);
      this.map.get(key).push(item);
    }
  }
  around(p,r=0){
    const out=new Set();
    for(const key of this.cells(p.x-r,p.x+r,p.z-r,p.z+r))for(const item of this.map.get(key)||[])out.add(item);
    return [...out];
  }
}

const forestCfg=cfg.forest;
const roadClearance=Number(forestCfg.roadClearanceM??3.8);
const buildingClearance=Number(forestCfg.buildingClearanceM??2.2);
const spacing=Number(forestCfg.treeSpacingM??4.5);
const obstacleGrid=new Grid(80);
const buildingGrid=new Grid(80);

for(const road of normalized.features.roads||[]){
  const line=road.centerline||[];
  const half=Math.max(0,Number(road.widthM||0)/2);
  for(let i=1;i<line.length;i++){
    const a=line[i-1],b=line[i];
    const item={a,b,half,sourceRoadId:road.id};
    const pad=half+roadClearance+.5;
    obstacleGrid.insertBox(Math.min(a.x,b.x)-pad,Math.max(a.x,b.x)+pad,Math.min(a.z,b.z)-pad,Math.max(a.z,b.z)+pad,item);
  }
}
for(const b of normalized.features.buildings||[]){
  const poly=openPoly(b.footprint);
  if(poly.length<3)continue;
  const box=polyBounds(poly);
  const item={poly,box,sourceBuildingId:b.id};
  buildingGrid.insertBox(box.minX-buildingClearance,box.maxX+buildingClearance,box.minZ-buildingClearance,box.maxZ+buildingClearance,item);
}

function nearestRoadEdge(p){
  let best=Infinity;
  for(const s of obstacleGrid.around(p,roadClearance+12))best=Math.min(best,pointSegDistance(p,s.a,s.b)-s.half);
  return best;
}
function nearestBuilding(p){
  let best=Infinity;
  for(const b of buildingGrid.around(p,buildingClearance+4)){
    const q=b.box;
    const dx=p.x<q.minX?q.minX-p.x:p.x>q.maxX?p.x-q.maxX:0;
    const dz=p.z<q.minZ?q.minZ-p.z:p.z>q.maxZ?p.z-q.maxZ:0;
    if(Math.hypot(dx,dz)>best)continue;
    best=Math.min(best,pointPolyDistance(p,b.poly));
  }
  return best;
}

function greenWeight(tags={}){
  if(tags.natural==='wood'||tags.landuse==='forest')return 1;
  if(tags.leisure==='park'||tags.leisure==='nature_reserve')return .62;
  if(['meadow','grass','recreation_ground','village_green'].includes(tags.landuse))return .34;
  if(['grassland','scrub','heath'].includes(tags.natural))return .38;
  return .2;
}

const green=(normalized.features.landuse||[])
  .filter(g=>g.class==='green')
  .map(g=>{
    const poly=openPoly(g.polygon);
    const area=poly.length>=3?polyArea(poly):0;
    const density=greenWeight(g.osm?.tags||{});
    return {source:g,poly,area,density,weighted:area*density,box:poly.length>=3?polyBounds(poly):null};
  })
  .filter(g=>g.box&&g.area>=Number(forestCfg.minGreenAreaM2??120)&&g.weighted>0)
  .sort((a,b)=>String(a.source.id).localeCompare(String(b.source.id)));

const maxTrees=Math.max(0,Math.floor(Number(forestCfg.maxTrees??420)));
const totalWeight=green.reduce((sum,g)=>sum+g.weighted,0)||1;
const allocation=green.map(g=>{
  const exact=maxTrees*g.weighted/totalWeight;
  return {g,base:Math.floor(exact),fraction:exact-Math.floor(exact)};
});
let assigned=allocation.reduce((s,a)=>s+a.base,0);
for(const a of [...allocation].sort((a,b)=>b.fraction-a.fraction||String(a.g.source.id).localeCompare(String(b.g.source.id)))){
  if(assigned>=maxTrees)break;
  a.base++;assigned++;
}

const treeGrid=new Grid(Math.max(2,spacing));
const forest=[];
let minTreeRoad=Infinity,minTreeBuilding=Infinity,minTreeSpacing=Infinity;
const assets=forestCfg.assetSource.paths;

for(const {g,target=0,base} of allocation.map(x=>({...x,target:x.base}))){
  const wanted=base;
  if(!wanted)continue;
  const rand=mulberry32(stableHash(style.seed+':corridor-forest:'+g.source.id));
  let accepted=0,attempts=0;
  while(accepted<wanted&&attempts<Math.max(100,wanted*100)&&forest.length<maxTrees){
    attempts++;
    const p={x:g.box.minX+rand()*(g.box.maxX-g.box.minX),z:g.box.minZ+rand()*(g.box.maxZ-g.box.minZ)};
    if(!inside(p,g.poly))continue;
    const rd=nearestRoadEdge(p);
    if(rd<roadClearance)continue;
    const bd=nearestBuilding(p);
    if(bd<buildingClearance)continue;
    let spacingOk=true,nearestTree=Infinity;
    for(const t of treeGrid.around(p,spacing)){
      const tx=t.local?.x, tz=t.local?.z;
      if(!Number.isFinite(tx)||!Number.isFinite(tz))throw new Error('tree spacing index missing local coordinates');
      const d=Math.hypot(p.x-tx,p.z-tz);
      if(d<nearestTree)nearestTree=d;
      if(d<spacing){spacingOk=false;break;}
    }
    if(!spacingOk)continue;
    const assetIndex=Math.floor(rand()*assets.length);
    const scale=Number(forestCfg.treeScaleMin??.82)+rand()*(Number(forestCfg.treeScaleMax??1.5)-Number(forestCfg.treeScaleMin??.82));
    const item={
      id:'tree:'+g.source.id+':'+accepted,
      sourceLanduseId:g.source.id,
      sourceOsm:{type:g.source.osm?.type??null,id:g.source.osm?.id??null},
      local:{x:round(p.x),y:0,z:round(p.z)},
      yawRad:round(rand()*Math.PI*2,6),
      scale:round(scale,4),
      assetIndex,
      assetPath:assets[assetIndex],
      greenDensityClass:g.density>=.9?'forest':g.density>=.5?'park':'open-green',
      clearancesM:{road:Number.isFinite(rd)?round(rd):null,building:Number.isFinite(bd)?round(bd):null}
    };
    forest.push(item);
    treeGrid.insertBox(p.x,p.x,p.z,p.z,item);
    minTreeRoad=Math.min(minTreeRoad,rd);
    minTreeBuilding=Math.min(minTreeBuilding,bd);
    if(Number.isFinite(nearestTree))minTreeSpacing=Math.min(minTreeSpacing,nearestTree);
    accepted++;
  }
}

const signCandidates=streetSignCandidates(
  normalized.features.roads||[],
  cfg.streetSigns,
  style.seed+':corridor',
  normalized.features.buildings||[]
);
const streetSigns=signCandidates.map((s,i)=>({
  id:'street-sign:'+stableHash(s.sourceRoadId+':'+s.name+':'+i).toString(16),
  name:s.name,
  sourceRoadId:s.sourceRoadId,
  local:{x:round(s.x),y:0,z:round(s.z)},
  roadLocal:{x:round(s.roadX),y:0,z:round(s.roadZ)},
  tangent:{x:round(s.tangent.x,6),z:round(s.tangent.z,6)},
  normal:{x:round(s.normal.x,6),z:round(s.normal.z,6)},
  sideOffsetFromRoadEdgeM:round(s.sideOffsetFromRoadEdgeM),
  buildingClearanceM:s.buildingClearanceM,
  presentation:'generated-osm-name-board',
  carrierCandidate:cfg.streetSigns.carrierCandidate
}));

function makeSidecar(){
  return {
    schema:'kfb.osm-city.presentation-sidecar.v0',
    id:ID,
    status:'PRESENTATION_ONLY_CONSUMER_CANDIDATE',
    source:{
      normalizedSha256:consumer.normalizedSha256,
      sceneSha256:consumer.sceneSha256,
      routePhysicalLengthM:consumer.routePhysicalLengthM,
      halfWidthM:consumer.halfWidthM,
      styleId:style.id,
      styleSeed:style.seed
    },
    frame:{
      units:'metre',
      axes:{x:'east',y:'up',z:'north'},
      originWgs84:normalized.frame.originWgs84,
      bounds:consumer.bounds
    },
    ownerContract:{
      owns:['deterministic scenery placement metadata','OSM street-name presentation anchors','GitHub asset references'],
      doesNotOwn:['movement','vehicle physics','collision geometry','Travel mode switching','persistence','asset registry'],
      movementOwner:'EXTERNAL_FREE_ROAM_C0',
      collisionGeometryModified:false
    },
    forest:{
      assetSource:forestCfg.assetSource,
      maxConfigured:maxTrees,
      instances:forest,
      rules:{
        mappedGreenOnly:true,
        roadClearanceM:roadClearance,
        buildingClearanceM:buildingClearance,
        treeSpacingM:spacing
      }
    },
    streetSigns:{
      carrierCandidate:cfg.streetSigns.carrierCandidate,
      maxConfigured:Number(cfg.streetSigns.maxSigns??80),
      instances:streetSigns,
      textSource:'preserved OSM name tag'
    },
    landmarkSocket:{
      source:cfg.landmarkSocket,
      instances:[],
      status:'PASSTHROUGH_NON_OWNING_SOCKET'
    }
  };
}

const sidecarA=makeSidecar();
const sidecarText=JSON.stringify(sidecarA,null,2);
const sidecarB=makeSidecar();
const deterministic=JSON.stringify(sidecarA)===JSON.stringify(sidecarB);

const normalizedHash=sha(JSON.stringify(normalized));
const report={
  schema:'kfb.osm-city.presentation-report.v0',
  id:ID,
  source:{
    expectedNormalizedSha256:consumer.normalizedSha256,
    actualNormalizedSha256:normalizedHash,
    sceneSha256:consumer.sceneSha256
  },
  counts:{
    greenLanduseCandidates:green.length,
    forestInstances:forest.length,
    streetSigns:streetSigns.length,
    forestAssets:assets.length
  },
  minimumObservedClearanceM:{
    road:Number.isFinite(minTreeRoad)?round(minTreeRoad):null,
    building:Number.isFinite(minTreeBuilding)?round(minTreeBuilding):null,
    treeSpacing:Number.isFinite(minTreeSpacing)?round(minTreeSpacing):null
  },
  sidecarSha256:sha(sidecarText),
  gates:{
    exactNormalizedPin:normalizedHash===consumer.normalizedSha256,
    forestExists:forest.length>0&&forest.length<=maxTrees,
    forestAssetsAreGithubPaths:forest.every(t=>String(t.assetPath).startsWith('media/3D_Assets/')),
    forestRoadClearance:Number.isFinite(minTreeRoad)&&minTreeRoad>=roadClearance-1e-6,
    forestBuildingClearance:Number.isFinite(minTreeBuilding)&&minTreeBuilding>=buildingClearance-1e-6,
    forestSpacing:forest.length<2||!Number.isFinite(minTreeSpacing)||minTreeSpacing>=spacing-1e-6,
    streetSignsExist:streetSigns.length>0&&streetSigns.length<=Number(cfg.streetSigns.maxSigns??80),
    streetNamesSourceExact:streetSigns.every(s=>s.name&&s.sourceRoadId),
    localMetreFrame:sidecarA.frame.units==='metre',
    noCollisionMutation:sidecarA.ownerContract.collisionGeometryModified===false,
    movementOwnerExternal:sidecarA.ownerContract.movementOwner==='EXTERNAL_FREE_ROAM_C0',
    landmarkSocketNonOwning:sidecarA.landmarkSocket.status==='PASSTHROUGH_NON_OWNING_SOCKET',
    deterministic
  }
};
if(!Object.values(report.gates).every(Boolean))throw new Error('corridor presentation gates failed: '+JSON.stringify(report.gates));

await fs.mkdir(new URL('../scenes/',import.meta.url),{recursive:true});
await fs.mkdir(new URL('../evidence/',import.meta.url),{recursive:true});
await fs.writeFile(new URL('../scenes/ehrenfeld-huerth-corridor-v0.presentation.json',import.meta.url),sidecarText+'\n');
await fs.writeFile(new URL('../evidence/ehrenfeld-huerth-corridor-v0-presentation.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
