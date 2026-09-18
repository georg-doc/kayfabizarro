import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const ids=process.argv.slice(2);
if(!ids.length) throw new Error('Usage: node check-consumer-contract.mjs <city-id> [...]');

const finitePoint=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.z);
const pointInPoly=(p,poly)=>{
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];
    const hit=((a.z>p.z)!==(b.z>p.z))&&(p.x<(b.x-a.x)*(p.z-a.z)/((b.z-a.z)||1e-12)+a.x);
    if(hit)inside=!inside;
  }
  return inside;
};
const pointSegDistance=(p,a,b)=>{
  const dx=b.x-a.x,dz=b.z-a.z,l2=dx*dx+dz*dz||1;
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/l2));
  return Math.hypot(p.x-(a.x+dx*t),p.z-(a.z+dz*t));
};
const pointLineDistance=(p,line)=>{
  let best=Infinity;
  for(let i=1;i<line.length;i++)best=Math.min(best,pointSegDistance(p,line[i-1],line[i]));
  return best;
};

const results=[];
for(const id of ids){
  if(!/^[a-z0-9-]+$/.test(id)) throw new Error('invalid city id '+id);
  const scene=JSON.parse(await fs.readFile(new URL(`../scenes/${id}.json`,import.meta.url),'utf8'));
  assert.equal(scene.schema,'kfb.osm-city.consumer-scene.v0',id+' schema');
  assert.equal(scene.id,id,id+' identity');
  assert.equal(scene.frame?.units,'metre',id+' local metre frame');
  assert.equal(scene.frame?.axes?.x,'east',id+' east axis');
  assert.equal(scene.frame?.axes?.y,'up',id+' up axis');
  assert.equal(scene.frame?.axes?.z,'north',id+' north axis');
  assert.equal(scene.source?.normalized,`../data/${id}/normalized.json`,id+' normalized source path');
  assert.equal(scene.source?.attribution?.license,'ODbL 1.0',id+' attribution');

  assert.equal(scene.ownerContract?.worldHost,'georg-doc/KFB-Travel-Globe',id+' Travel host owner');
  assert.match(scene.ownerContract?.driveReceiver||'',/Race Slice-04/,id+' named DRIVE donor');
  assert.match(scene.ownerContract?.movementRule||'',/one active movement writer/i,id+' movement-owner rule');

  const roads=scene.surfaces?.roads||[];
  const driveable=roads.filter(r=>r.driveable);
  const sidewalks=scene.surfaces?.sidewalks||[];
  const buildings=scene.obstacles?.buildings||[];
  assert.ok(roads.length>0,id+' roads');
  assert.ok(driveable.length>0,id+' driveable roads');
  assert.ok(sidewalks.length>0,id+' sidewalk hints');
  assert.ok(buildings.length>0,id+' building obstacles');

  for(const r of roads){
    assert.ok(Number.isFinite(r.widthM)&&r.widthM>0,id+' road width '+r.sourceId);
    assert.ok(Array.isArray(r.centerline)&&r.centerline.length>=2,id+' road centerline '+r.sourceId);
    for(const p of r.centerline) assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.z),id+' finite road point');
  }
  for(const b of buildings){
    assert.ok(Number.isFinite(b.heightM)&&b.heightM>0,id+' building height '+b.sourceId);
    assert.ok(Array.isArray(b.footprint)&&b.footprint.length>=4,id+' building footprint '+b.sourceId);
  }

  const anchors=scene.anchors||[];
  const byKind=new Map(anchors.map(a=>[a.kind,a]));
  const required=['spawn-foot','park-vehicle','drive-intersection','road-terrain-transition'];
  for(const kind of required){
    assert.ok(byKind.has(kind),id+' anchor '+kind);
    assert.ok(finitePoint(byKind.get(kind).local),id+' finite anchor '+kind);
    assert.equal(byKind.get(kind).status,'candidate',id+' candidate status '+kind);
    assert.ok(Array.isArray(byKind.get(kind).safety)&&byKind.get(kind).safety.length>0,id+' safety predicates '+kind);
  }
  assert.ok(byKind.get('drive-intersection').osmNodeId!=null,id+' intersection OSM node');
  const terrain=byKind.get('road-terrain-transition');
  assert.ok(terrain.sourceRoadId,id+' road-terrain source road');
  const terrainRoad=roads.find(r=>r.sourceId===terrain.sourceRoadId);
  assert.ok(terrainRoad?.driveable,id+' road-terrain anchor must reference a driveable road');
  const terrainRoadDistance=pointLineDistance(terrain.local,terrainRoad.centerline);
  assert.ok(terrainRoadDistance<=0.01,id+' road-terrain anchor must lie on its source road; distance='+terrainRoadDistance);
  assert.ok(Number.isFinite(terrain.edgeDistanceM)&&terrain.edgeDistanceM>=0,id+' road-terrain edge distance metadata');
  if(terrain.greenDistanceM!=null)assert.ok(Number.isFinite(terrain.greenDistanceM)&&terrain.greenDistanceM>=0,id+' road-terrain green distance metadata');

  // Candidate does not mean receiver-safe, but it must at least avoid an obvious mapped building footprint.
  for(const kind of required){
    const p=byKind.get(kind).local;
    const containing=buildings.find(b=>pointInPoly({x:p.x,z:p.z},b.footprint));
    assert.equal(containing,undefined,`${id} ${kind} anchor inside building ${containing?.sourceId||''}`);
  }

  const clip=scene.frame?.clipRectM;
  if(clip){
    for(const a of anchors){
      assert.ok(a.local.x>=clip.minX-20&&a.local.x<=clip.maxX+20,id+' anchor x near local frame '+a.id);
      assert.ok(a.local.z>=clip.minZ-20&&a.local.z<=clip.maxZ+20,id+' anchor z near local frame '+a.id);
    }
  }

  assert.equal(scene.acceptanceLoop,'walk → street → vehicle → forward → reverse → turn → park → intersection → road/terrain → stop → exit',id+' acceptance loop');
  results.push({
    id,
    roads:roads.length,
    driveableRoads:driveable.length,
    sidewalks:sidewalks.length,
    buildings:buildings.length,
    roadTerrain:{
      sourceRoadId:terrain.sourceRoadId,
      local:terrain.local,
      edgeDistanceM:terrain.edgeDistanceM,
      greenDistanceM:terrain.greenDistanceM,
      sourceRoadDistanceM:+terrainRoadDistance.toFixed(6)
    },
    anchors:Object.fromEntries(required.map(k=>[k,byKind.get(k).local]))
  });
}
console.log(JSON.stringify({status:'PASS',results},null,2));
