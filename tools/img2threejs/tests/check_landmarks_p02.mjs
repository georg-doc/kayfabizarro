import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {buildLandmark,MODEL_IDS,NEW_MODEL_IDS} from '../landmarks/pilot-02/geometry.mjs';
import {buildLandmark as prior,mergeZones,faceNormals} from '../landmarks/pilot-01/geometry.mjs';
import {zoneColours} from '../landmarks/pilot-02/presentation.mjs';
import {exportGLB} from '../landmarks/pilot-01/glb.mjs';
import {preparePlacement} from '../landmarks/pilot-01/osm-bridge.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const style=JSON.parse(readFileSync(new URL('../../osm-city-lab/styles/kfb-city-v0.json',import.meta.url)));
const checks=[];const ok=(id,value)=>{checks.push({id,pass:!!value});if(!value)throw Error('FAIL: '+id);};
const sub=(a,b)=>a.map((v,i)=>v-b[i]);const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
function inspect(part){
 const edges=new Map();let volume=0,minArea=Infinity;const key=p=>p.map(v=>v.toFixed(6)).join(',');
 for(let i=0;i<part.positions.length;i+=9){const a=part.positions.slice(i,i+3),b=part.positions.slice(i+3,i+6),c=part.positions.slice(i+6,i+9);minArea=Math.min(minArea,Math.hypot(...cross(sub(b,a),sub(c,a)))/2);volume+=dot(a,cross(b,c))/6;
 for(const [p,q] of [[a,b],[b,c],[c,a]]){const x=key(p),y=key(q),id=[x,y].sort().join('/'),e=edges.get(id)||[0,0];e[0]++;e[1]+=x<y?1:-1;edges.set(id,e);}}
 return {closed:[...edges.values()].every(([n,s])=>n===2&&s===0),volume,minArea};
}
const out=root+'evidence/2026-09-18-landmark-pilot-02/';mkdirSync(out,{recursive:true});const stats={};
for(const id of MODEL_IDS){
 const a=buildLandmark(id);const b=buildLandmark(id);const inspected=a.parts.map(inspect);
 ok(id+'.deterministic',JSON.stringify(a)===JSON.stringify(b));
 ok(id+'.finite',a.parts.every(p=>p.positions.every(Number.isFinite)));
 ok(id+'.nondegenerate',inspected.every(t=>t.minArea>1e-8));
 if(!inspected.every(t=>t.closed))console.error(a.parts.filter((p,i)=>!inspected[i].closed).map(p=>p.name));
 ok(id+'.closed-parts',inspected.every(t=>t.closed));
 ok(id+'.outward',inspected.every(t=>t.volume>1e-6));
 ok(id+'.ground',Math.abs(a.bounds.min[1])<1e-7);
 ok(id+'.unique-part-names',new Set(a.parts.map(p=>p.name)).size===a.parts.length);
 ok(id+'.zones-bounded',mergeZones(a).length<=6);
 ok(id+'.metres',a.units==='metre');ok(id+'.no-osm-claim',a.geographicBinding===null);
 if(!NEW_MODEL_IDS.includes(id))ok(id+'.unchanged-vs-p01',JSON.stringify(a)===JSON.stringify(prior(id)));
 const before=JSON.stringify(a);
 for(const mode of ['natural','city','colour','zones']){
  const colours=zoneColours(a,style,mode);
  ok(id+'.palette-'+mode,a.parts.every(p=>/^#[0-9a-f]{6}$/i.test(colours[p.zone])));
  const bytes=exportGLB(a,colours),v=new DataView(bytes.buffer),len=v.getUint32(12,true),doc=JSON.parse(new TextDecoder().decode(bytes.slice(20,20+len)));
  ok(id+'.glb-header-'+mode,v.getUint32(0,true)===0x46546c67&&v.getUint32(8,true)===bytes.length);
  ok(id+'.glb-count-'+mode,doc.meshes.reduce((s,m)=>s+doc.accessors[m.primitives[0].attributes.POSITION].count/3,0)===a.triangles);
  ok(id+'.glb-zones-'+mode,doc.materials.every(m=>m.extras.kfbMaterialZone===m.name));
  if(mode==='natural'){
   writeFileSync(out+id+'.glb',bytes);writeFileSync(out+id+'-geometry.json',JSON.stringify({asset:a,colours}));
   stats[id]={triangles:a.triangles,parts:a.parts.length,materialMeshes:mergeZones(a).length,bounds:a.bounds,glbBytes:bytes.length};
  }
 }
 ok(id+'.colours-never-mutate-geometry',before===JSON.stringify(a));
}
for(const id of ['spasskaya','kremlin-wall'])ok(id+'.height-71m',Math.abs(stats[id].bounds.max[1]-71)<1e-6);
ok('pentagon.nominal-height-23.5m',Math.abs(stats.pentagon.bounds.max[1]-23.5)<1e-6);
// Intersect a vertical or forward ray with all triangles. Checks real empty openings.
function hit(o,d,p){const e1=sub(p[1],p[0]),e2=sub(p[2],p[0]),h=cross(d,e2),det=dot(e1,h);if(Math.abs(det)<1e-8)return false;const f=1/det,s=sub(o,p[0]),u=f*dot(s,h);if(u<0||u>1)return false;const q=cross(s,e1),v=f*dot(d,q);return v>=0&&u+v<=1&&f*dot(e2,q)>1e-6;}
function obstructed(asset,o,d){return asset.parts.some(part=>{for(let i=0;i<part.positions.length;i+=9)if(hit(o,d,[part.positions.slice(i,i+3),part.positions.slice(i+3,i+6),part.positions.slice(i+6,i+9)]))return true;return false;});}
const p=buildLandmark('pentagon');ok('pentagon.courtyard-open',!obstructed(p,[0,100,0],[0,-1,0]));
ok('pentagon.five-roof-rings',p.parts.filter(p=>/^ring-[0-4]-roof-0$/.test(p.name)).length===5);
for(const id of ['spasskaya','kremlin-wall']){const a=buildLandmark(id);ok(id+'.gateway-open',!obstructed(a,[0,3,30],[0,0,-1]));ok(id+'.gateway-jamb-solid',obstructed(a,[6,3,30],[0,0,-1]));ok(id+'.four-clocks',a.parts.filter(p=>p.name.startsWith('clock-face-')).length===4);}
const pins={};for(const f of ['builder.mjs','geometry.mjs','presentation.mjs','viewer.mjs','index.html'])pins[f]=createHash('sha256').update(readFileSync(root+'landmarks/pilot-02/'+f)).digest('hex');
const result={schema:'kfb.landmark-pilot-02.qa/0.1',evidenceClass:'NUMERICAL_AND_BINARY_EXPORT',browserRender:'NOT_VERIFIED',humanAcceptance:'PENDING',consumerIntegration:'NOT_RUN',passed:checks.length,total:checks.length,stats,sha256:pins,checks};
writeFileSync(out+'checks.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({passed:checks.length,stats},null,2));
