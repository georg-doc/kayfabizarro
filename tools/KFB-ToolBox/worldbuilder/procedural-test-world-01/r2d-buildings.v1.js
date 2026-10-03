/* KFB Procedural Test World · R2D building-family adapter v1
 *
 * PURPOSE
 * Reuse the already-proven WorldBuilder building/facade owner on R2D building pads.
 *
 * This module does NOT generate a new building grammar.
 * It:
 *  1. reads the exact B1 sibling donor footprints already proven in the WorldBuilder fixture,
 *  2. translates / uniformly shrinks them only when required to fit an R2D pad,
 *  3. calls the existing wd1-city.js buildCityLayer() + kfb-facade-rule-v1,
 *  4. exposes the existing support records as logical building/collision facts.
 */
export const SCHEMA='kfb.r2d-building-family-adapter/1';
export const SOURCE=Object.freeze({
  fixture:'fixtures/huerth-b1-siblings-v0.json',
  fixtureBlob:'1452f44920239e870091b1803c0d2bd183679881',
  cityOwner:'wd1-city.js',
  cityOwnerBlob:'c11b6f7156eaee808fe4689ee406f9b3480b6f0b',
  facadeRule:'kfb-facade-rule-v1',
  b1Donors:[
    'b1/compact-simple/371401529-to-371401477',
    'b1/ordinary-notched/371401481-to-371401497',
    'b1/large-complex/371401488-to-371401495'
  ]
});

const ROOT=new URL('../../../../',import.meta.url).href;
const FIXTURE=new URL('../../../../fixtures/huerth-b1-siblings-v0.json',import.meta.url).href;
const CITY_URL=new URL('../../../../wd1-city.js',import.meta.url).href;
const PIN='c049cae386e1';
const CDN='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+PIN+'/';
const CARTOON=CDN+'tools/osm-city-lab/src/style/cartoon-city.js';
const STYLE=CDN+'tools/osm-city-lab/styles/kfb-city-v0.json';
const ELASTIC='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@0c59e92d9d8688f5a88cd309ae8891dcd174c2fc/tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs';

async function imp(url){
  try{return await import(url)}
  catch(e1){
    const res=await fetch(url);if(!res.ok)throw e1;
    const txt=await res.text(),base=url.slice(0,url.lastIndexOf('/')+1);
    const fixed=txt.replace(/(from\s+|import\s*\()(['"])(\.\.?\/[^'"]+)\2/g,(m,a,q,p)=>a+q+new URL(p,base).href+q);
    return import(URL.createObjectURL(new Blob([fixed],{type:'text/javascript'})));
  }
}

const meanPoint=fp=>{
  const pts=fp.map(([x,z])=>({x:+x,z:+z}));
  const c=pts.reduce((a,p)=>({x:a.x+p.x,z:a.z+p.z}),{x:0,z:0});
  c.x/=pts.length;c.z/=pts.length;
  return{pts,c};
};
const radiusOf=(pts,c)=>Math.max(...pts.map(p=>Math.hypot(p.x-c.x,p.z-c.z)));

function transformDonor(rec,pad,index){
  const {pts,c}=meanPoint(rec.fp),rad=radiusOf(pts,c);
  if(!(rad>0))throw new Error('R2D building donor has zero footprint radius: '+rec.id);
  // Preserve source scale when it already fits. Otherwise uniformly shrink just enough to fit the authored R2D pad.
  const scale=Math.min(1,pad.r/rad);
  const fp=pts.map(p=>({x:pad.x+(p.x-c.x)*scale,z:pad.z+(p.z-c.z)*scale}));
  const id='r2d-b1/'+index+'/'+rec.b1.lane;
  return{
    id,h:+(rec.h*scale).toFixed(4),hs:'r2d-pad-from-'+rec.hs,kind:rec.kind,name:rec.name,
    fp,roof:rec.roof,mc:rec.mc,minH:+((rec.minH||0)*scale).toFixed(4),
    b1:{...rec.b1,sourceId:rec.id,fitScale:+scale.toFixed(5),pad:{x:pad.x,z:pad.z,r:pad.r,h:pad.h}}
  };
}

function pip(x,z,poly){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];
    if(((a.z>z)!==(b.z>z))&&(x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x))inside=!inside;
  }
  return inside;
}

async function loadB1Donors(){
  const res=await fetch(FIXTURE);if(!res.ok)throw new Error('B1 fixture '+res.status);
  const fixture=await res.json();
  const byId=new Map((fixture.buildings||[]).map(b=>[b.id,b]));
  const list=SOURCE.b1Donors.map(id=>byId.get(id));
  const missing=SOURCE.b1Donors.filter((id,i)=>!list[i]);
  if(missing.length)throw new Error('missing exact B1 donors: '+missing.join(', '));
  return list;
}

function makeZone(plan,donors){
  const buildings=(plan.pads||[]).slice(0,donors.length).map((pad,i)=>transformDonor(donors[i],pad,i));
  const maxR=Math.max(...plan.edgeR)+10;
  const roadLine=(plan.poly||[]).map(([x,z])=>({x,z}));
  return{
    id:'r2d-b1-building-pads',
    status:'SOURCE_DERIVED_B1_FAMILY_ON_R2D_PADS',
    rectW:{minX:plan.c0[0]-maxR,maxX:plan.c0[0]+maxR,minZ:plan.c0[1]-maxR,maxZ:plan.c0[1]+maxR},
    counts:{buildings:buildings.length,roads:roadLine.length?1:0,landuse:0},
    buildings,
    roads:roadLine.length?[{id:'r2d-track-core-facade-context',cls:'residential',w:6,drive:true,name:'R2D Track Core',bridge:null,tunnel:null,layer:0,area:false,line:roadLine}]:[],
    landuse:[],water:[],waterLines:[],railways:[],landmark:null,heroes:null,hbf:null,trackCorridorConflicts:[]
  };
}

function stripNonBuildingPresentation(city){
  let n=0;
  for(const o of city.flatParts||[]){
    if(!o)continue;
    if(o.parent===city.group){city.group.remove(o);n++;}
    // Release the duplicate 4k ground-map resources after the existing owner has built the building family.
    if(o===city.plate){
      try{o.material?.map?.dispose?.()}catch{}
      try{o.material?.dispose?.()}catch{}
      try{o.geometry?.dispose?.()}catch{}
    }
  }
  return n;
}

export async function mountR2DBuildings({group,plan,field,renderer=null}){
  const [donors,CITY,CC,EG,style]=await Promise.all([
    loadB1Donors(),
    import(CITY_URL),
    imp(CARTOON),
    imp(ELASTIC),
    fetch(STYLE).then(r=>{if(!r.ok)throw new Error('city style '+r.status);return r.json()})
  ]);
  if(CITY.FACADE_RULE?.id!==SOURCE.facadeRule)throw new Error('unexpected facade owner '+CITY.FACADE_RULE?.id);

  const zone=makeZone(plan,donors);
  const city=CITY.buildCityLayer(zone,{mode:'elastic',style,CC,EG,ghosts:false,renderer,facade:'rule-v1'});
  const Ly=CITY.layersFrom(style);
  city.group.position.y=-Ly.plate;
  const stripped=stripNonBuildingPresentation(city);
  const support=city.support?.apply?.((x,z)=>field.heightAt(x,z))||null;
  city.group.name='R2D B1 building family · '+CITY.FACADE_RULE.id;
  group.add(city.group);

  const placed=zone.buildings.map(b=>{
    const base=city.support?.offsetOf?.(b.id)||0;
    return{
      id:b.id,donorId:b.b1.sourceId,lane:b.b1.lane,fitScale:b.b1.fitScale,
      x:b.b1.pad.x,z:b.b1.pad.z,padRadius:b.b1.pad.r,height:b.h,base,top:base+b.h
    };
  });
  const at=(x,z)=>{
    const b=zone.buildings.find(q=>pip(x,z,q.fp));
    if(!b)return null;
    const base=city.support?.offsetOf?.(b.id)||0;
    return{id:b.id,donorId:b.b1.sourceId,lane:b.b1.lane,base,height:b.h,top:base+b.h,fitScale:b.b1.fitScale};
  };
  const report={
    schema:SCHEMA,
    owner:'wd1-city.js/buildCityLayer',
    facadeRule:CITY.FACADE_RULE.id,
    fixtureBlob:SOURCE.fixtureBlob,
    availableDonors:[...SOURCE.b1Donors],
    placed,
    unplacedDonors:SOURCE.b1Donors.filter(id=>!placed.some(p=>p.donorId===id)),
    support,
    strippedFlatParts:stripped,
    stats:{
      buildings:city.stats?.buildings||0,
      windows:city.stats?.facade?.windows||0,
      doors:city.stats?.facade?.doors||0,
      bare:city.stats?.facade?.bare||0,
      wallNormalsOnly:city.stats?.wallNormalsOnly||0
    }
  };
  return{zone,city,at,report};
}
