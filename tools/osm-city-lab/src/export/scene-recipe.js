function r3(v){ return +Number(v).toFixed(3); }
function dist2(p){ return p.x*p.x+p.z*p.z; }
function midlinePoint(line){
  if (!line.length) return {x:0,z:0};
  const i=Math.max(0,Math.floor((line.length-1)/2));
  const a=line[i], b=line[Math.min(i+1,line.length-1)];
  return {x:r3((a.x+b.x)/2), z:r3((a.z+b.z)/2)};
}
function sideOffset(line, point, amount){
  if (line.length < 2) return {...point};
  const a=line[0], b=line[1];
  const dx=b.x-a.x, dz=b.z-a.z, len=Math.hypot(dx,dz)||1;
  return {x:r3(point.x-dz/len*amount),z:r3(point.z+dx/len*amount)};
}
function nearestRoad(roads, predicate=()=>true){
  return roads.filter(predicate).map(r=>({r,p:midlinePoint(r.centerline)}))
    .sort((a,b)=>dist2(a.p)-dist2(b.p))[0] || null;
}
function intersectionCandidate(roads){
  const uses=new Map(), coord=new Map();
  for(const r of roads.filter(r=>r.driveable)){
    const ids=r.nodeIds||[];
    r.centerline.forEach((p,i)=>{
      const id=ids[i]; if(id==null)return;
      uses.set(id,(uses.get(id)||0)+1); coord.set(id,p);
    });
  }
  const candidates=[...uses.entries()].filter(([,n])=>n>=2).map(([id,n])=>({id,n,p:coord.get(id)}))
    .filter(c=>c.p).sort((a,b)=>(b.n-a.n)||(dist2(a.p)-dist2(b.p)));
  return candidates[0]||null;
}
function polyBounds(poly){
  const xs=poly.map(p=>p.x),zs=poly.map(p=>p.z);
  return {minX:Math.min(...xs),maxX:Math.max(...xs),minZ:Math.min(...zs),maxZ:Math.max(...zs)};
}
function inBounds(p,b,pad=0){return p.x>=b.minX-pad&&p.x<=b.maxX+pad&&p.z>=b.minZ-pad&&p.z<=b.maxZ+pad;}
function pointInPoly(p,poly){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];
    const hit=((a.z>p.z)!==(b.z>p.z))&&(p.x<(b.x-a.x)*(p.z-a.z)/((b.z-a.z)||1e-12)+a.x);
    if(hit)inside=!inside;
  }
  return inside;
}
function pointSegDistance(p,a,b){
  const dx=b.x-a.x,dz=b.z-a.z,l2=dx*dx+dz*dz||1;
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/l2));
  return Math.hypot(p.x-(a.x+dx*t),p.z-(a.z+dz*t));
}
function pointPolyDistance(p,poly){
  if(pointInPoly(p,poly))return 0;
  let best=Infinity;
  for(let i=1;i<poly.length;i++)best=Math.min(best,pointSegDistance(p,poly[i-1],poly[i]));
  return best;
}
function roadTerrainCandidate(normalized){
  const drive=normalized.features.roads.filter(r=>r.driveable);
  const buildings=normalized.features.buildings.map(b=>({poly:b.footprint,bounds:polyBounds(b.footprint)}));
  const greens=normalized.features.landuse.filter(g=>g.class==='green').map(g=>({poly:g.polygon,bounds:polyBounds(g.polygon)}));
  const clip=normalized.frame?.clipRectM;
  const blocked=p=>buildings.some(b=>inBounds(p,b.bounds)&&pointInPoly(p,b.poly));
  const greenDistance=p=>{
    let best=Infinity;
    for(const g of greens){
      const bboxDist=Math.hypot(
        p.x<g.bounds.minX?g.bounds.minX-p.x:p.x>g.bounds.maxX?p.x-g.bounds.maxX:0,
        p.z<g.bounds.minZ?g.bounds.minZ-p.z:p.z>g.bounds.maxZ?p.z-g.bounds.maxZ:0
      );
      if(bboxDist>best)continue;
      best=Math.min(best,pointPolyDistance(p,g.poly));
    }
    return best;
  };
  const edgeDistance=p=>clip?Math.min(p.x-clip.minX,clip.maxX-p.x,p.z-clip.minZ,clip.maxZ-p.z):Math.hypot(p.x,p.z);
  const classPenalty=c=>({primary:35,secondary:18,tertiary:8,trunk:50,motorway:80}[c]||0);
  const candidates=[];
  for(const r of drive){
    const line=r.centerline||[];
    for(let i=1;i<line.length;i++){
      const a=line[i-1],b=line[i];
      for(const t of [0,.15,.35,.5,.65,.85,1]){
        const p={x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t};
        if(blocked(p))continue;
        const edge=Math.max(0,edgeDistance(p));
        const green=greenDistance(p);
        const score=edge*1.6+Math.min(green,120)*.55+classPenalty(r.class);
        candidates.push({r,p:{x:r3(p.x),z:r3(p.z)},edgeDistanceM:r3(edge),greenDistanceM:Number.isFinite(green)?r3(green):null,score});
      }
    }
  }
  candidates.sort((a,b)=>a.score-b.score);
  return candidates[0]||null;
}

export function buildConsumerScene(normalized){
  const roads=normalized.features.roads;
  const quiet=nearestRoad(roads,r=>r.driveable && ['residential','living_street','service','unclassified'].includes(r.class))
    || nearestRoad(roads,r=>r.driveable);
  const parkBase=quiet?.p || {x:0,z:0};
  const roadWidth=quiet?.r.widthM || 5;
  const park=sideOffset(quiet?.r.centerline||[],parkBase,roadWidth/2+2.4);
  const foot=sideOffset(quiet?.r.centerline||[],parkBase,-roadWidth/2-2.4);
  const ix=intersectionCandidate(roads);
  const terrain=roadTerrainCandidate(normalized);

  return {
    schema:'kfb.osm-city.consumer-scene.v0',
    status:'CANDIDATE_EXPORT_REQUIRES_RECEIVER_VALIDATION',
    id:normalized.id,
    frame:normalized.frame,
    source:{
      normalized:`../data/${normalized.id}/normalized.json`,
      provenance:normalized.source.provenance,
      attribution:normalized.source.attribution
    },
    ownerContract:{
      cityLab:'geodata normalization + city geometry/style/export only',
      worldHost:'georg-doc/KFB-Travel-Globe',
      groundReceiver:'Travel WB0 ground-controller / current accepted Ground seam',
      driveReceiver:'Race Slice-04 physics donor via WALK_DRIVE_COMBAT/CONTRACT_PROPOSAL.md',
      movementRule:'exactly one active movement writer; no City-Lab controller'
    },
    surfaces:{
      roads:roads.map(r=>({sourceId:r.id,class:r.class,driveable:r.driveable,widthM:r.widthM,centerline:r.centerline,tags:r.osm.tags})),
      sidewalks:roads.filter(r=>r.sidewalk?.left||r.sidewalk?.right).map(r=>({
        sourceId:r.id, inferred:true, policy:r.sidewalk, roadWidthM:r.widthM,
        bandWidthM:2.1, centerline:r.centerline
      })),
      landuse:normalized.features.landuse
    },
    obstacles:{
      buildings:normalized.features.buildings.map(b=>({
        sourceId:b.id,footprint:b.footprint,heightM:b.heightM,minHeightM:b.minHeightM||0,tags:b.osm.tags
      }))
    },
    waterLines:normalized.features.waterLines,
    anchors:[
      {id:'foot-spawn-candidate',kind:'spawn-foot',local:{x:foot.x,y:0,z:foot.z},
       status:'candidate',safety:['walkable support','capsule clearance','not inside vehicle/building collider']},
      {id:'park-candidate',kind:'park-vehicle',local:{x:park.x,y:0,z:park.z},
       status:'candidate',headingSource:quiet?.r.id||null,safety:['roadside clearance','vehicle hull free','stable support']},
      {id:'intersection-test',kind:'drive-intersection',local:{x:r3(ix?.p.x||0),y:0,z:r3(ix?.p.z||0)},
       status:'candidate',osmNodeId:ix?.id||null,safety:['receiver contact mesh aligned','no building overlap']},
      {id:'road-terrain-seam',kind:'road-terrain-transition',local:{x:r3(terrain?.p.x||0),y:0,z:r3(terrain?.p.z||0)},
       status:'candidate',sourceRoadId:terrain?.r.id||null,edgeDistanceM:terrain?.edgeDistanceM??null,greenDistanceM:terrain?.greenDistanceM??null,
       safety:['not inside mapped building footprint','Travel terrain continues beyond city surface','slope/contact within receiver budget']}
    ],
    acceptanceLoop:'walk → street → vehicle → forward → reverse → turn → park → intersection → road/terrain → stop → exit',
    deferred:['combat target','stunt branch','traffic','police/wanted','economy','landmarkOverride','2.5D residents']
  };
}
