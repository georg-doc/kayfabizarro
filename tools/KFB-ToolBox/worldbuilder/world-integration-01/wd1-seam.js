/* KFB WB-DESIGN-PARALLEL-01 · PRESENTATION SEAM
   One presenter shape. Geography may come from the frozen fixture or the accepted WORLD-ZONE-BAKE-01
   package. WorldBuilder stays the local-world/terrain owner; OSM City Lab stays geographic/bake owner.

   WORLD-ZONE-BAKE-01 adapter rule:
   - manifest + baked normalized semantics + support/collision are the geographic truth;
   - the old Cologne fixture may contribute presentation-only railway/Hbf metadata that the v1 bake
     contract deliberately does not contain;
   - no live Overpass and no second geography/runtime owner;
   - Race/Track socket conflicts are NOT invented here. The current WB2 world has no Track socket.

   World coordinates: X=east, Y=up, Z=-north. */

export const SEAM = {
  version: 'kfb.wb-design.presentation-seam/1 · world-zone-bake adapter',
  fields: {
    id: 'string', status: 'string', provenance: 'object',
    rectW: '{minX,maxX,minZ,maxZ} world metres',
    heightAt: '(x,z) → metres · WORLD-ZONE support/collision ground truth',
    buildings: '[{id,h,kind,name,fp:[{x,z}]}]', roads: '[{id,cls,w,drive,name,bridge,tunnel,layer,line:[{x,z}]}]',
    railways: 'presentation metadata until a later World Zone schema explicitly owns railways',
    landuse: '[{id,cls,poly}]', water: '[{id,cls,poly,src}]',
    landmark: 'protected authored landmark placement metadata', conflicts: 'current host Track conflicts only; empty when no Track socket is mounted'
  },
  consumers: ['wd1-city.js buildCityLayer', 'wd1-landmark.js protected landmarks', 'wi1-world.js WB2 host']
};

const round3=v=>Math.round(Number(v)*1000)/1000;
const w=p=>({x:Number(p[0]??p.x),z:-Number(p[1]??p.z)});
const sourcePoint=p=>({x:Number(p.x),z:Number(p.z)});
const sameXZ=(a,b)=>a&&b&&Math.abs(a.x-b.x)<.002&&Math.abs(a.z-b.z)<.002;
const inside=(p,r)=>p.x>=r.minX&&p.x<=r.maxX&&p.z>=r.minZ&&p.z<=r.maxZ;
function centroid(poly){
  // Frozen WB-D1 crop follows the existing OSM City buildingCenter grammar:
  // use the footprint bounding-box centre, not vertex mean / polygon area centroid.
  const a=(poly||[]).map(sourcePoint);
  if(!a.length)return{x:0,z:0};
  const xs=a.map(p=>p.x),zs=a.map(p=>p.z);
  return{x:(Math.min(...xs)+Math.max(...xs))/2,z:(Math.min(...zs)+Math.max(...zs))/2};
}
function clipSegment(a,b,r){
  const dx=b.x-a.x,dz=b.z-a.z;let t0=0,t1=1;
  const p=[-dx,dx,-dz,dz],q=[a.x-r.minX,r.maxX-a.x,a.z-r.minZ,r.maxZ-a.z];
  for(let i=0;i<4;i++){
    if(Math.abs(p[i])<1e-12){if(q[i]<0)return null;continue;}
    const t=q[i]/p[i];
    if(p[i]<0){if(t>t1)return null;if(t>t0)t0=t;}
    else{if(t<t0)return null;if(t<t1)t1=t;}
  }
  return[
    {x:round3(a.x+dx*t0),z:round3(a.z+dz*t0)},
    {x:round3(a.x+dx*t1),z:round3(a.z+dz*t1)}
  ];
}
function clipPolyline(points,rect){
  const parts=[];let current=null;
  for(let i=0;i<points.length-1;i++){
    const seg=clipSegment(points[i],points[i+1],rect);
    if(!seg){if(current?.length>1)parts.push(current);current=null;continue;}
    if(!current||!sameXZ(current.at(-1),seg[0])){if(current?.length>1)parts.push(current);current=[seg[0],seg[1]];}
    else if(!sameXZ(current.at(-1),seg[1]))current.push(seg[1]);
  }
  if(current?.length>1)parts.push(current);
  return parts;
}
function clipPolygon(points,rect){
  let poly=(points||[]).map(sourcePoint);
  if(poly.length>1&&sameXZ(poly[0],poly.at(-1)))poly.pop();
  const edges=[
    {in:p=>p.x>=rect.minX,x:(a,b)=>({x:rect.minX,z:a.z+(b.z-a.z)*(rect.minX-a.x)/(b.x-a.x)})},
    {in:p=>p.x<=rect.maxX,x:(a,b)=>({x:rect.maxX,z:a.z+(b.z-a.z)*(rect.maxX-a.x)/(b.x-a.x)})},
    {in:p=>p.z>=rect.minZ,x:(a,b)=>({z:rect.minZ,x:a.x+(b.x-a.x)*(rect.minZ-a.z)/(b.z-a.z)})},
    {in:p=>p.z<=rect.maxZ,x:(a,b)=>({z:rect.maxZ,x:a.x+(b.x-a.x)*(rect.maxZ-a.z)/(b.z-a.z)})}
  ];
  for(const e of edges){
    const input=poly;poly=[];if(!input.length)break;
    let a=input.at(-1),ain=e.in(a);
    for(const b of input){const bin=e.in(b);if(bin){if(!ain)poly.push(e.x(a,b));poly.push(b);}else if(ain)poly.push(e.x(a,b));a=b;ain=bin;}
  }
  if(poly.length<3)return[];
  const out=poly.map(p=>({x:round3(p.x),z:round3(p.z)}));out.push({...out[0]});return out;
}
async function getJson(url,data=null){
  if(data)return data;
  const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('zone source HTTP '+r.status+' · '+url);return r.json();
}
function fromFrozenFixture(fx,url){
  const c=fx.crop,L=fx.landmark;
  return{
    id:fx.id||'cologne-dom-crop-v0',kind:'frozen-fixture',url,status:fx.status,provenance:fx.source,frame:fx.frame,crop:c,absent:fx.absentInSource||null,
    rectW:{minX:c.minX,maxX:c.maxX,minZ:-c.maxZ,maxZ:-c.minZ},heightAt:()=>0,heightAtSource:{kind:'fixture-flat-zero'},
    buildings:fx.buildings.map(b=>({id:b.id,h:b.h,minH:b.minH||0,kind:b.kind,name:b.name,roof:b.roof||null,mc:b.mc||null,fp:b.fp.map(w)})),
    roads:fx.roads.map(r=>({...r,line:r.line.map(w)})),
    landuse:fx.landuse.map(l=>({id:l.id,cls:l.cls,poly:l.poly.map(w)})),
    water:fx.water.map(l=>({id:l.id,cls:l.cls,poly:l.poly.map(w),src:l.poly.map(p=>({x:p[0],z:p[1]}))})),
    landmark:L?{id:L.id,name:L.name,heightTag:L.heightTag,axisDeg:L.axisDeg,extentM:L.extentM,centroid:{x:L.centroid.x,z:-L.centroid.z},footprint:L.footprint.map(w)}:null,
    railways:(fx.railways||[]).map(r=>({...r,line:r.line.map(w)})),heroes:fx.heroes,
    home:fx.home?{...fx.home,centroid:{x:fx.home.centroid.x,z:-fx.home.centroid.z}}:null,hbf:fx.hbf,
    conflicts:new Set((fx.trackCorridorConflicts||[]).map(b=>b.id)),counts:fx.counts,sourceCounts:fx.sourceCounts||null
  };
}
function bakedCrop(normalized,crop){
  const buildings=(normalized.features?.buildings||[]).filter(b=>inside(centroid(b.footprint),crop)).map(b=>({
    id:b.id,h:b.heightM,minH:b.minHeightM||0,kind:b.osm?.tags?.building||'yes',name:b.osm?.tags?.name||null,roof:b.roof||null,mc:b.materialClass||null,fp:b.footprint.map(p=>w(p))
  }));
  const roads=[];
  for(const r of normalized.features?.roads||[]){
    const parts=clipPolyline(r.centerline||[],crop);
    parts.forEach((line,i)=>roads.push({
      id:parts.length===1?r.id:r.id+':wb-crop-'+i,cls:r.class,w:r.widthM,drive:!!r.driveable,name:r.osm?.tags?.name||null,
      bridge:r.osm?.tags?.bridge||null,tunnel:r.osm?.tags?.tunnel||null,layer:Number(r.osm?.tags?.layer||0),area:false,line:line.map(w)
    }));
  }
  const landuse=[],water=[];
  for(const l of normalized.features?.landuse||[]){
    const c=centroid(l.polygon);
    if(l.class==='water'){
      const poly=clipPolygon(l.polygon,crop);if(poly.length)water.push({id:l.id,cls:l.class,poly:poly.map(w),src:poly.map(sourcePoint)});
    }else if(inside(c,crop))landuse.push({id:l.id,cls:l.class,poly:l.polygon.map(w)});
  }
  return{buildings,roads,landuse,water};
}
export async function fromBakedZone(src){
  if(!src.manifestUrl)throw new Error('world-zone-bake manifestUrl required');
  const manifest=await getJson(src.manifestUrl,src.manifestData);
  if(manifest.schema!=='kfb.world-zone.manifest.v1')throw new Error('unexpected World Zone manifest '+manifest.schema);
  if(src.expectedId&&manifest.id!==src.expectedId)throw new Error('World Zone id mismatch '+manifest.id);
  if(src.expectedRevision&&manifest.revision!==src.expectedRevision)throw new Error('World Zone revision mismatch '+manifest.revision);
  const rel=name=>new URL(name,src.manifestUrl).href;
  const [normalized,support,presentation]=await Promise.all([
    getJson(rel(manifest.contents.normalized),src.normalizedData),
    getJson(rel(manifest.contents.supportCollision),src.supportData),
    getJson(src.presentationUrl,src.presentationData)
  ]);
  if(normalized.schema!=='kfb.osm-city.normalized.v0')throw new Error('unexpected baked normalized schema');
  if(manifest.source?.normalizedBlobSha&&src.expectedNormalizedBlob&&manifest.source.normalizedBlobSha!==src.expectedNormalizedBlob)throw new Error('World Zone normalized blob mismatch');
  if(support.schema!=='kfb.world-zone.support-collision.v1'||support.truth!=='undeformed-normalized-semantics')throw new Error('World Zone support contract mismatch');

  const crop=src.crop||presentation.crop;
  const b=bakedCrop(normalized,crop);
  const L=presentation.landmark,groundY=Number(support.ground?.y||0);
  const previousConflicts=(presentation.trackCorridorConflicts||[]).map(x=>x.id);
  return{
    id:manifest.id,kind:'world-zone-bake',url:src.manifestUrl,status:'BAKED WORLD ZONE · '+manifest.revision,
    provenance:{owner:manifest.owner,source:manifest.source,compiler:manifest.compiler,look:manifest.look,runtimePolicy:manifest.runtimePolicy},
    frame:manifest.frame,crop,absent:null,rectW:{minX:crop.minX,maxX:crop.maxX,minZ:-crop.maxZ,maxZ:-crop.minZ},
    heightAt:()=>groundY,heightAtSource:{schema:support.schema,truth:support.truth,ground:support.ground},
    buildings:b.buildings,roads:b.roads,landuse:b.landuse,water:b.water,
    landmark:L?{id:L.id,name:L.name,heightTag:L.heightTag,axisDeg:L.axisDeg,extentM:L.extentM,centroid:{x:L.centroid.x,z:-L.centroid.z},footprint:L.footprint.map(w)}:null,
    // v1 bake does not own railway/Hbf presenter metadata. Reuse the already-source-backed presentation metadata only.
    railways:(presentation.railways||[]).map(r=>({...r,line:r.line.map(w)})),heroes:presentation.heroes||{},
    hbf:presentation.hbf||null,home:presentation.home?{...presentation.home,centroid:{x:presentation.home.centroid.x,z:-presentation.home.centroid.z}}:null,
    // Current WB2 does not mount a Race Track socket; do not ghost real OSM buildings against historical Track conflicts.
    conflicts:new Set(),deferredTrackConflicts:previousConflicts,
    counts:{buildings:b.buildings.length,roadParts:b.roads.length,landuse:b.landuse.length,water:b.water.length},
    sourceCounts:manifest.counts,
    package:{manifestUrl:src.manifestUrl,id:manifest.id,revision:manifest.revision,normalizedUrl:rel(manifest.contents.normalized),supportUrl:rel(manifest.contents.supportCollision),visualUrl:rel(manifest.contents.visual),runtimePolicy:manifest.runtimePolicy,worldBuilderContract:manifest.worldBuilderContract}
  };
}
export async function loadZone(src){
  if(src.kind==='frozen-fixture'){const r=await fetch(src.url);if(!r.ok)throw new Error('fixture HTTP '+r.status);return fromFrozenFixture(await r.json(),src.url);}
  if(src.kind==='world-zone-bake')return fromBakedZone(src);
  throw new Error('unknown zone source '+src.kind);
}
