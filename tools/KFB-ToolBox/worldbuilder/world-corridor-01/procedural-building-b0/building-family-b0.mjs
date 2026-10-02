import * as THREE from 'three';
import {
  buildElasticShell,
  buildElasticRoof,
  centroid
} from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@0c59e92d9d8688f5a88cd309ae8891dcd174c2fc/tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs';

export const B0_SOURCE = Object.freeze({
  familyId:'kfb-building-b0-ordinary-low-rise-elastic',
  elastic:{
    head:'0c59e92d9d8688f5a88cd309ae8891dcd174c2fc',
    module:'tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs',
    viewer:'tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/viewer.mjs',
    normalized:'tools/osm-city-lab/data/huerth-v0/normalized.json'
  },
  facade:{
    id:'kfb-facade-rule-v1',
    sourceBlob:'c11b6f7156eaee808fe4689ee406f9b3480b6f0b',
    renderedInB0Isolation:false,
    reason:'B0 isolation proves body/roof parity; it does not create a second facade-rule clone.'
  },
  kaykitSideDonor:{
    head:'2ff8b350beefe02912bbff6eeeead3882e583d08',
    path:'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/building_A.gltf',
    role:'cartoon proportion/source-identity side donor only'
  }
});

export const HURTH_FIXTURE_IDS=Object.freeze([
  "way/371401492","way/371401494","way/371401485","way/371401566",
  "way/371401483","way/371401495","way/371401482","way/371401475",
  "way/371401481","way/371401529","way/371401497","way/371401491",
  "way/371401471","way/371401493","way/371401480","way/371401490",
  "way/371401488","way/371401477","way/371401469","way/371401496",
  "way/371401465","way/371401499"
]);

export const B0_GOLDENS=Object.freeze([
  Object.freeze({role:'compact-flat',id:'way/371401529',heightM:10.13,roof:'flat'}),
  Object.freeze({role:'larger-gable',id:'way/371401492',heightM:12.46,roof:'gabled-hint'}),
  Object.freeze({role:'compact-hip',id:'way/371401475',heightM:12.19,roof:'hipped-hint'})
]);

const DATA_URL=
  'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+
  B0_SOURCE.elastic.head+
  '/tools/osm-city-lab/data/huerth-v0/normalized.json';

let cached=null;

export async function loadB0Source(){
  if(cached)return cached;
  const data=await fetch(DATA_URL,{cache:'no-store'}).then(r=>{
    if(!r.ok)throw new Error('Hürth source '+r.status);
    return r.json();
  });
  const byId=new Map(data.features.buildings.map(b=>[b.id,b]));
  const fixture=HURTH_FIXTURE_IDS.map(id=>byId.get(id)).filter(Boolean);
  if(fixture.length!==HURTH_FIXTURE_IDS.length){
    throw new Error('Hürth pinned fixture mismatch '+fixture.length+'/'+HURTH_FIXTURE_IDS.length);
  }
  const centers=fixture.map(b=>centroid(b.footprint));
  const anchor=centers.reduce(
    (a,c)=>({x:a.x+c.x/centers.length,z:a.z+c.z/centers.length}),
    {x:0,z:0}
  );
  const golden=B0_GOLDENS.map(g=>{
    const b=byId.get(g.id);
    if(!b)throw new Error('Missing B0 Golden '+g.id);
    return b;
  });
  cached={data,byId,fixture,anchor,golden};
  return cached;
}

function shape(poly){
  const pts=[...poly];
  if(pts.length>1){
    const a=pts[0],b=pts[pts.length-1];
    if(Math.hypot(a.x-b.x,a.z-b.z)<.001)pts.pop();
  }
  const s=new THREE.Shape();
  pts.forEach((p,i)=>i?s.lineTo(p.x,-p.z):s.moveTo(p.x,-p.z));
  return s;
}

export function buildCleanSource(building){
  const g=new THREE.ExtrudeGeometry(shape(building.footprint),{
    depth:building.heightM,
    bevelEnabled:false,
    steps:1
  });
  g.rotateX(-Math.PI/2);
  g.computeVertexNormals();
  return {body:g,roof:null};
}

export function buildAcceptedV2(building,anchor){
  const shell=buildElasticShell(building,anchor);
  const roof=buildElasticRoof(building,shell);
  return {body:shell.geometry,roof,shell};
}

export function buildB0Candidate(building,anchor){
  // B0 is intentionally a no-regression wrapper around the accepted V2 geometry owner.
  const shell=buildElasticShell(building,anchor);
  const roof=buildElasticRoof(building,shell);
  return {
    body:shell.geometry,
    roof,
    shell,
    familyId:B0_SOURCE.familyId,
    facadeRuleId:B0_SOURCE.facade.id,
    facadeRendered:false
  };
}

function mix(h,v){
  h^=v;
  return Math.imul(h,16777619)>>>0;
}
function hashNumber(h,n){
  const q=Math.round(Number(n)*1e6);
  h=mix(h,q&255);
  h=mix(h,(q>>>8)&255);
  h=mix(h,(q>>>16)&255);
  h=mix(h,(q>>>24)&255);
  return h;
}
export function geometryHash(g){
  let h=2166136261>>>0;
  const p=g.getAttribute('position');
  h=mix(h,p.count&255);
  for(let i=0;i<p.count;i++){
    h=hashNumber(h,p.getX(i));
    h=hashNumber(h,p.getY(i));
    h=hashNumber(h,p.getZ(i));
  }
  if(g.index){
    const a=g.index.array;
    for(let i=0;i<a.length;i++)h=hashNumber(h,a[i]);
  }
  return h.toString(16).padStart(8,'0');
}

export function geometryFacts(g){
  g.computeBoundingBox();
  const b=g.boundingBox,size=new THREE.Vector3();
  b.getSize(size);
  return {
    vertices:g.getAttribute('position')?.count||0,
    triangles:g.index?g.index.count/3:(g.getAttribute('position')?.count||0)/3,
    bounds:[size.x,size.y,size.z],
    minY:b.min.y,
    maxY:b.max.y,
    hash:geometryHash(g)
  };
}

export function parityFacts(building,anchor){
  const accepted=buildAcceptedV2(building,anchor);
  const candidate=buildB0Candidate(building,anchor);
  const aBody=geometryFacts(accepted.body),bBody=geometryFacts(candidate.body);
  const aRoof=geometryFacts(accepted.roof),bRoof=geometryFacts(candidate.roof);
  return {
    id:building.id,
    accepted:{body:aBody,roof:aRoof},
    candidate:{body:bBody,roof:bRoof},
    bodyParity:aBody.hash===bBody.hash,
    roofParity:aRoof.hash===bRoof.hash,
    baseAnchored:Math.abs(aBody.minY)<1e-6&&Math.abs(bBody.minY)<1e-6,
    facadeRuleId:B0_SOURCE.facade.id
  };
}
