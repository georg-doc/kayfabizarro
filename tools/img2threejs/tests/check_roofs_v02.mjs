/** Geometry-only checks against the exact roof functions embedded in the shipped HTML.
 * No Three.js substitute, browser, WebGL or visual acceptance is involved.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import os from 'node:os';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const target=path.join(root,'prototypes/koelner-dom/v0.2/index.html');
const bytes=fs.readFileSync(target), html=bytes.toString('utf8');
const code=html.split('// PURE_ROOF_DATA_BEGIN')[1]?.split('// PURE_ROOF_DATA_END')[0];
if(!code) throw new Error('Production roof block not found');
const context=vm.createContext({});
vm.runInContext(code+';globalThis.parts=makeRoofParts();',context,{timeout:1000});
const parts=context.parts;
const checks=[];
function check(name,value,detail) {checks.push({name,status:value?'PASS':'FAIL',...(detail?{detail}:{})});}
function near(a,b){return Math.abs(a-b)<1e-6;}
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const world=p=>p.vertices.map(([x,y,z])=>[
 x*Math.cos(p.rotationY)+z*Math.sin(p.rotationY)+p.position[0],
 y+p.position[1],-x*Math.sin(p.rotationY)+z*Math.cos(p.rotationY)+p.position[2]]);
const stats=[];
check('10 explicitly bounded roof parts',parts.length===10);
check('Unique roof names',new Set(parts.map(p=>p.id)).size===parts.length);
for(const p of parts){
 const edges=new Map();let volume=0,minArea=Infinity;
 for(const f of p.indices){
  const [a,b,c]=f.map(i=>p.vertices[i]);
  minArea=Math.min(minArea,Math.hypot(...cross(sub(b,a),sub(c,a)))/2);
  volume+=dot(a,cross(b,c))/6;
  for(let i=0;i<3;i++){
   const u=f[i],v=f[(i+1)%3],k=[Math.min(u,v),Math.max(u,v)].join(':');
   const e=edges.get(k)||{count:0,direction:0};
   e.count++;e.direction+=u<v?1:-1;edges.set(k,e);
  }
 }
 check(p.id+' finite positions',p.vertices.flat().every(Number.isFinite));
 check(p.id+' nondegenerate faces',minArea>1e-6);
 check(p.id+' closed consistently oriented mesh',[...edges.values()].every(e=>e.count===2&&e.direction===0));
 check(p.id+' outward winding / positive volume',volume>0);
 stats.push({id:p.id,triangles:p.indices.length,vertices:p.vertices.length,volume:+volume.toFixed(6)});
}
const crossing=parts.find(p=>p.id==='roof-crossing');
const wc=world(crossing);
function matchingInterface(id,axis,value){
 const p=parts.find(p=>p.id===id);
 const a=world(p).filter(v=>near(v[axis],value));
 const b=wc.filter(v=>near(v[axis],value));
 return a.length===3&&b.length===3&&a.every(v=>b.some(q=>v.every((x,i)=>near(x,q[i]))));
}
check('Front nave / crossing exact interface',matchingInterface('roof-nave-front',2,1.4));
check('Choir / crossing exact interface',matchingInterface('roof-nave-choir',2,-9.4));
check('Left transept / crossing exact interface',matchingInterface('roof-transept-left',0,-7.4));
check('Right transept / crossing exact interface',matchingInterface('roof-transept-right',0,7.4));
const core=parts.filter(p=>!p.id.includes('aisle')&&!p.id.includes('facade'));
check('Shared main eaves at y19 and ridges at y26',core.every(p=>{
 const ys=world(p).map(v=>v[1]);return near(Math.min(...ys),19)&&near(Math.max(...ys),26);
}));
check('Roof footprint stays inside foundation',parts.every(p=>world(p).every(v=>Math.abs(v[0])<22&&Math.abs(v[2])<32)));
check('No lateral cones used as roofs',!html.includes('ConeGeometry(11.5')&&!html.includes('ConeGeometry(4.8')&&!html.includes('ConeGeometry(10.5'));
check('Original eight-sided main spires retained',html.includes('ConeGeometry(3.2,22,8)'));
check('Roof budget <= 100 triangles',stats.reduce((s,p)=>s+p.triangles,0)<=100);
check('Three.js still pinned to 0.161.0',html.includes('three@0.161.0/build/three.module.js')&&html.includes('three@0.161.0/examples/jsm/'));
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'dom-v02-'));
try{
 const script=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
 if(!script)throw new Error('Module not found');
 const modulePath=path.join(temp,'viewer.mjs');fs.writeFileSync(modulePath,script);
 const syntax=spawnSync(process.execPath,['--check',modulePath],{encoding:'utf8'});
 check('Full JavaScript module syntax',syntax.status===0,syntax.status!==0?syntax.stderr:undefined);
}finally{fs.rmSync(temp,{recursive:true,force:true});}
const result={schema:'kfb.img2threejs.roof-geometry-check/0.1',version:'0.2.0',
 evidenceClass:'STATIC_AND_NUMERICAL_ONLY',browserRender:'NOT_VERIFIED',humanAccepted:false,
 node:process.version,artifact:'prototypes/koelner-dom/v0.2/index.html',
 bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),
 passed:checks.filter(c=>c.status==='PASS').length,total:checks.length,
 roofTriangles:stats.reduce((s,p)=>s+p.triangles,0),roofParts:stats,checks};
console.log(JSON.stringify(result,null,2));
process.exitCode=checks.some(c=>c.status==='FAIL')?1:0;
