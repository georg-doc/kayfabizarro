import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {buildLandmark,MODEL_IDS,mergeZones,faceNormals} from '../landmarks/pilot-01/geometry.mjs';
import {zoneColours} from '../landmarks/pilot-01/presentation.mjs';
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
const out=root+'evidence/2026-09-18-landmark-pilot/';mkdirSync(out,{recursive:true});const stats={};
for(const id of MODEL_IDS){
 const asset=buildLandmark(id);stats[id]={triangles:asset.triangles,parts:asset.parts.length,materialMeshes:mergeZones(asset).length,bounds:asset.bounds};
 ok(id+'.deterministic',JSON.stringify(asset)===JSON.stringify(buildLandmark(id)));
 ok(id+'.metres',asset.units==='metre');ok(id+'.grounded',Math.abs(asset.bounds.min[1])<1e-6);
 ok(id+'.finite',asset.parts.every(p=>p.positions.every(Number.isFinite)));
 const tests=asset.parts.map(inspect);ok(id+'.all-parts-closed',tests.every(t=>t.closed));ok(id+'.positive-volume',tests.every(t=>t.volume>1e-6));ok(id+'.nondegenerate',tests.every(t=>t.minArea>1e-7));
 ok(id+'.unique-part-names',new Set(asset.parts.map(p=>p.name)).size===asset.parts.length);
 ok(id+'.at-most-six-material-meshes',mergeZones(asset).length<=6);
 ok(id+'.no-osm-fabrication',asset.geographicBinding===null);
 for(const mode of ['city','natural','colour','zones']){
  const colours=zoneColours(asset,style,mode);ok(id+'.palette-'+mode,asset.parts.every(p=>/^#[0-9a-f]{6}$/i.test(colours[p.zone])));
  const bytes=exportGLB(asset,colours),v=new DataView(bytes.buffer);ok(id+'.glb-header-'+mode,v.getUint32(0,true)===0x46546c67&&v.getUint32(4,true)===2&&v.getUint32(8,true)===bytes.length);
  const jlen=v.getUint32(12,true),doc=JSON.parse(new TextDecoder().decode(bytes.slice(20,20+jlen)));ok(id+'.glb-triangles-'+mode,doc.meshes.reduce((sum,m)=>sum+doc.accessors[m.primitives[0].attributes.POSITION].count/3,0)===asset.triangles);
  ok(id+'.glb-zones-'+mode,doc.materials.every(m=>m.extras.kfbMaterialZone===m.name));
  if(mode==='city'){writeFileSync(out+id+'.glb',bytes);writeFileSync(out+id+'-geometry.json',JSON.stringify({asset,colours}));stats[id].glbBytes=bytes.length;}
 }
 for(const zone of mergeZones(asset))ok(id+'.normals-'+zone.zone,faceNormals(zone.positions).every(Number.isFinite));
}
ok('eiffel.height-330m',stats.eiffel.bounds.max[1]===330);ok('eiffel.base-125m',stats.eiffel.bounds.size[0]===125&&stats.eiffel.bounds.size[2]===125);
ok('giza.original-height-146.5m',stats.giza.bounds.max[1]===146.5);
const frames=[{origin:{lat:50.949425,lon:6.9175},bboxWgs84:{south:50.94675,west:6.91280,north:50.95210,east:6.92220}},{origin:{lat:50.8659,lon:6.877},bboxWgs84:{south:50.862756,west:6.872018,north:50.869044,east:6.881982}}].map(f=>({...f,units:'metre',axes:{x:'east',y:'up',z:'north'}}));
// Explicit synthetic placement fixture: not a claimed real OSM ID or asset pin.
const entry={osm:{type:'way',id:123},asset:{repo:'georg-doc/kayfabizarro',path:'SYNTHETIC-TEST-ONLY.glb',sourceCommit:'0'.repeat(40)},placement:{originPolicy:'osm-footprint-centroid',scale:1,yawDeg:0,yOffsetM:0},baseBuilding:{policy:'hide-only-after-asset-loaded-and-validated'}};
frames.forEach((f,i)=>{
 const source={osm:{...entry.osm},centroidWgs84:{...f.origin},groundY:0};const p=preparePlacement(entry,source,f);
 ok(`frame-${i}.origin`,p.status==='PLACEMENT_PREVIEW_ONLY'&&p.position.x===0&&p.position.z===0&&p.keepBaseBuilding);
 ok(`frame-${i}.north-east`,(()=>{const q=preparePlacement(entry,{...source,centroidWgs84:{lat:f.origin.lat+.0001,lon:f.origin.lon+.0001}},f);return q.position.x>0&&q.position.z>0;})());
 ok(`frame-${i}.outside-blocked`,preparePlacement(entry,{...source,centroidWgs84:{lat:48.8,lon:2.3}},f).status==='BLOCKED');
 ok(`frame-${i}.mismatch-blocked`,preparePlacement(entry,{...source,osm:{type:'way',id:124}},f).status==='BLOCKED');
 ok(`frame-${i}.missing-osm-blocked`,preparePlacement({...entry,osm:null},source,f).status==='BLOCKED');
 ok(`frame-${i}.wrong-axis-blocked`,preparePlacement(entry,source,{...f,axes:{x:'east',y:'up',z:'south'}}).status==='BLOCKED');
 ok(`frame-${i}.bad-scale-blocked`,preparePlacement({...entry,placement:{...entry.placement,scale:0}},source,f).status==='BLOCKED');
 ok(`frame-${i}.no-fallback-blocked`,preparePlacement({...entry,baseBuilding:null},source,f).status==='BLOCKED');
});
const files=['geometry.mjs','presentation.mjs','three-adapter.mjs','glb.mjs','osm-bridge.mjs','viewer.mjs','index.html'];const hashes=Object.fromEntries(files.map(f=>[f,createHash('sha256').update(readFileSync(root+'landmarks/pilot-01/'+f)).digest('hex')]));
const result={schema:'kfb.img2threejs.landmark-pilot-evidence/0.1',evidenceClass:'STATIC_NUMERICAL_AND_BINARY_EXPORT',browserRender:'NOT_VERIFIED',consumerIntegration:'NOT_RUN',humanAcceptance:'PENDING',checksPassed:checks.length,checks,stats,sha256:hashes};
writeFileSync(out+'checks.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({passed:checks.length,stats},null,2));
