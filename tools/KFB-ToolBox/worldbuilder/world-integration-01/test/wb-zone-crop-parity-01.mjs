import fs from 'node:fs';
import assert from 'node:assert/strict';

const PIN='3b4909d4c83b704662e66b60212e7f20ba5cf662';
const NORMALIZED_URL='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+PIN+'/tools/osm-city-lab/world-zones/cologne-dom-zentrum-v0/2026-09-24.1/normalized.json';
const FIXTURE='tools/KFB-ToolBox/worldbuilder/world-integration-01/fixtures/cologne-dom-crop-v0.json';
const REPORT='wb-zone-crop-parity-01-report.json';

const fixture=JSON.parse(fs.readFileSync(FIXTURE,'utf8'));
const response=await fetch(NORMALIZED_URL,{cache:'no-store'});
assert.equal(response.ok,true,'pinned normalized source must load');
const normalized=await response.json();

const crop={minX:Number(fixture.crop.minX),maxX:Number(fixture.crop.maxX),minZ:Number(fixture.crop.minZ),maxZ:Number(fixture.crop.maxZ)};
const source=normalized.features?.buildings||[];
const targetIds=new Set((fixture.buildings||[]).map(b=>b.id));
const point=p=>({x:Number(p.x??p[0]),z:Number(p.z??p[1])});
const serializedPoints=poly=>(poly||[]).map(point);
const openPoints=poly=>{
  const a=serializedPoints(poly);
  if(a.length>1&&a[0].x===a.at(-1).x&&a[0].z===a.at(-1).z)return a.slice(0,-1);
  return a;
};
const mean=a=>({x:a.reduce((n,p)=>n+p.x,0)/a.length,z:a.reduce((n,p)=>n+p.z,0)/a.length});
const vertexMeanSerialized=poly=>mean(serializedPoints(poly));
const vertexMeanOpen=poly=>mean(openPoints(poly));
const bboxCenter=poly=>{
  const a=openPoints(poly),xs=a.map(p=>p.x),zs=a.map(p=>p.z);
  return{x:(Math.min(...xs)+Math.max(...xs))/2,z:(Math.min(...zs)+Math.max(...zs))/2};
};
const areaCentroid=poly=>{
  const a=openPoints(poly);let twiceArea=0,cx=0,cz=0;
  for(let i=0;i<a.length;i++){
    const p=a[i],q=a[(i+1)%a.length],cross=p.x*q.z-q.x*p.z;
    twiceArea+=cross;cx+=(p.x+q.x)*cross;cz+=(p.z+q.z)*cross;
  }
  return Math.abs(twiceArea)<1e-12?vertexMeanOpen(poly):{x:cx/(3*twiceArea),z:cz/(3*twiceArea)};
};
const insideInclusive=(p,r=crop,eps=0)=>p.x>=r.minX-eps&&p.x<=r.maxX+eps&&p.z>=r.minZ-eps&&p.z<=r.maxZ+eps;
const insideStrict=(p,r=crop)=>p.x>r.minX&&p.x<r.maxX&&p.z>r.minZ&&p.z<r.maxZ;
const rounded=(p,d)=>{const k=10**d;return{x:Math.round(p.x*k)/k,z:Math.round(p.z*k)/k};};
const idsFor=(center,inside=insideInclusive)=>new Set(source.filter(b=>inside(center(b.footprint))).map(b=>b.id));
const delta=set=>({
  missing:[...targetIds].filter(id=>!set.has(id)).sort(),
  extra:[...set].filter(id=>!targetIds.has(id)).sort()
});
const result=(name,set)=>{const d=delta(set);return{name,count:set.size,...d,exact:d.missing.length===0&&d.extra.length===0};};

let pass=0;
const ok=(name,cond,detail='')=>{assert.ok(cond,name+(detail?' · '+detail:''));pass++;console.log('ok '+pass+' - '+name+(detail?' · '+detail:''));};
const eq=(name,a,b)=>{assert.deepEqual(a,b,name);pass++;console.log('ok '+pass+' - '+name+' · '+JSON.stringify(a));};

eq('fixture building count',targetIds.size,369);
eq('normalized schema',normalized.schema,'kfb.osm-city.normalized.v0');
ok('pinned source is larger than frozen crop',source.length>targetIds.size,'source='+source.length);

const openMean=result('vertex_mean_drop_closing_inclusive',idsFor(vertexMeanOpen));
const area=result('polygon_area_centroid_inclusive',idsFor(areaCentroid));
const bbox=result('bbox_center_inclusive',idsFor(bboxCenter));
const canonical=result('serialized_vertex_mean_inclusive',idsFor(vertexMeanSerialized));
const canonicalStrict=result('serialized_vertex_mean_strict',idsFor(vertexMeanSerialized,insideStrict));

eq('previous vertex-mean candidate reproduces 368 count',openMean.count,368);
eq('previous polygon-area candidate reproduces 370 count',area.count,370);
eq('previous bbox candidate reproduces 370 count',bbox.count,370);
eq('canonical serialized vertex mean reproduces exact frozen id set',canonical,{name:'serialized_vertex_mean_inclusive',count:369,missing:[],extra:[],exact:true});
eq('strict and inclusive are observationally identical for this source',canonicalStrict,{name:'serialized_vertex_mean_strict',count:369,missing:[],extra:[],exact:true});

const exactBoundary=source.filter(b=>{
  const c=vertexMeanSerialized(b.footprint);
  return c.x===crop.minX||c.x===crop.maxX||c.z===crop.minZ||c.z===crop.maxZ;
}).map(b=>b.id);
eq('no canonical centre lies exactly on a crop edge',exactBoundary,[]);

const oldDeltaIds=[...new Set([...openMean.missing,...openMean.extra])].sort();
eq('closing-point weighting explains the complete 368→369 delta',oldDeltaIds,['way/282677032','way/328262455','way/328265555']);

const unionIds=[...new Set([openMean,area,bbox].flatMap(r=>[...r.missing,...r.extra]))].sort();
const byId=new Map(source.map(b=>[b.id,b]));
const boundaryDistances=c=>({
  minX:c.x-crop.minX,maxX:crop.maxX-c.x,minZ:c.z-crop.minZ,maxZ:crop.maxZ-c.z
});
const diagnostics=unionIds.map(id=>{
  const b=byId.get(id),p=openPoints(b.footprint),xs=p.map(q=>q.x),zs=p.map(q=>q.z);
  const centers={
    serializedVertexMean:vertexMeanSerialized(b.footprint),
    openVertexMean:vertexMeanOpen(b.footprint),
    polygonAreaCentroid:areaCentroid(b.footprint),
    bboxCenter:bboxCenter(b.footprint)
  };
  return{
    id,inFrozenFixture:targetIds.has(id),
    kind:b.osm?.tags?.building||null,name:b.osm?.tags?.name||null,
    centers,
    bbox:{minX:Math.min(...xs),maxX:Math.max(...xs),minZ:Math.min(...zs),maxZ:Math.max(...zs)},
    distanceToCrop:Object.fromEntries(Object.entries(centers).map(([k,c])=>[k,boundaryDistances(c)]))
  };
});

const round3=result('serialized_vertex_mean_round3_inclusive',idsFor(poly=>rounded(vertexMeanSerialized(poly),3)));
const epsilonOut=result('serialized_vertex_mean_epsilon_plus_1mm',idsFor(vertexMeanSerialized,p=>insideInclusive(p,crop,0.001)));
const epsilonIn=result('serialized_vertex_mean_epsilon_minus_1mm',idsFor(vertexMeanSerialized,p=>insideInclusive(p,{minX:crop.minX+0.001,maxX:crop.maxX-0.001,minZ:crop.minZ+0.001,maxZ:crop.maxZ-0.001},0)));

const report={
  schema:'kfb.wb-zone-crop-parity-01.report/1',
  source:{pin:PIN,normalizedUrl:NORMALIZED_URL,fixture:FIXTURE},
  crop,
  conclusion:{
    pass:true,
    rule:'arithmetic mean of every serialized footprint vertex exactly as stored, INCLUDING the duplicated closing vertex; inclusive crop comparison',
    exactIdCount:canonical.count,
    edgeComparatorObservable:false,
    note:'strict and inclusive produce the same set because no canonical centre lies exactly on a crop edge; inclusive is retained to match the existing WorldBuilder inside() grammar'
  },
  candidates:[openMean,area,bbox,canonical,canonicalStrict],
  namedBoundaryVariants:[round3,epsilonOut,epsilonIn],
  diagnostics
};
fs.writeFileSync(REPORT,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
console.log('WB-ZONE-CROP-PARITY-01 PASS '+pass+'/'+pass);
