import fs from 'node:fs/promises';

const id = process.argv[2];
if (!id || !/^[a-z0-9-]+$/.test(id)) throw new Error('Usage: node analyze-city.mjs <city-id>');
const DATA = new URL(`../data/${id}/`, import.meta.url);
const norm = JSON.parse(await fs.readFile(new URL('normalized.json', DATA), 'utf8'));

const roadLength = line => {
  let n=0; for(let i=1;i<line.length;i++) n+=Math.hypot(line[i].x-line[i-1].x,line[i].z-line[i-1].z); return n;
};
const classes={}, names={}, nodeUse=new Map();
let longest=null;
for(const r of norm.features.roads){
  classes[r.class]=(classes[r.class]||0)+1;
  const name=r.osm.tags?.name || '(unnamed)';
  names[name]=(names[name]||0)+1;
  const len=roadLength(r.centerline);
  if(!longest||len>longest.lengthM) longest={sourceId:r.id,name,rClass:r.class,lengthM:+len.toFixed(2),driveable:r.driveable};
  (r.nodeIds||[]).forEach((nodeId,i)=>{ if(nodeId==null)return; const p=r.centerline[i]; const e=nodeUse.get(nodeId)||{count:0,p}; e.count++; nodeUse.set(nodeId,e); });
}
const intersections=[...nodeUse.entries()].filter(([,e])=>e.count>=2).map(([nodeId,e])=>({nodeId,count:e.count,local:e.p}));
const green=norm.features.landuse.filter(x=>x.class==='green');
const rect=norm.frame.clipRectM;
const edgeTol=30;
const nearEdge=p=>Math.min(Math.abs(p.x-rect.minX),Math.abs(p.x-rect.maxX),Math.abs(p.z-rect.minZ),Math.abs(p.z-rect.maxZ))<=edgeTol;
const greenAtEdge=green.filter(g=>g.polygon.some(nearEdge)).length;
const driveRoads=norm.features.roads.filter(r=>r.driveable);
const driveRoadsAtEdge=driveRoads.filter(r=>r.centerline.some(nearEdge)).length;
const buildingKinds={};
for(const b of norm.features.buildings){const k=b.osm.tags?.building||'yes';buildingKinds[k]=(buildingKinds[k]||0)+1;}

const analysis={
  schema:'kfb.osm-city.fixture-analysis.v0',
  id,
  generatedAt:new Date().toISOString(),
  bounds:norm.bounds,
  counts:{
    roads:norm.features.roads.length,
    driveableRoads:driveRoads.length,
    buildings:norm.features.buildings.length,
    greenPolygons:green.length,
    landuse:norm.features.landuse.length,
    intersections:intersections.length,
    driveRoadsAtEdge,
    greenPolygonsAtEdge:greenAtEdge
  },
  roadClasses:classes,
  topRoadNames:Object.entries(names).sort((a,b)=>b[1]-a[1]).slice(0,25).map(([name,count])=>({name,count})),
  buildingKinds:Object.entries(buildingKinds).sort((a,b)=>b[1]-a[1]).slice(0,20).map(([kind,count])=>({kind,count})),
  longestRoadPart:longest,
  fixtureSignals:{
    residentialContext:(classes.residential||0)+(classes.living_street||0)+(classes.service||0)>3,
    intersection:intersections.length>0,
    accelerationCorridor:Boolean(longest?.driveable && longest.lengthM>=120),
    roadTerrainEdge:driveRoadsAtEdge>0 && greenAtEdge>0
  }
};
await fs.mkdir(new URL('../evidence/',import.meta.url),{recursive:true});
await fs.writeFile(new URL(`../evidence/${id}-fixture-analysis.json`,import.meta.url),JSON.stringify(analysis,null,2)+'\n');
console.log(JSON.stringify(analysis,null,2));
