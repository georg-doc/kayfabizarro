import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {buildLandmark} from '../landmarks/pilot-02/geometry.mjs';
import {shapeAsset} from '../landmarks/pilot-03/deform.mjs';
import {rigLandmark,rigidDistanceReport,groupForPart} from '../landmarks/pilot-04/rig.mjs';
import {sampleLivingToyState} from '../landmarks/pilot-04/reactor.mjs';
import {deformPoint} from '../../osm-city-lab/src/style/cartoon-city.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const style=JSON.parse(readFileSync(new URL('../../osm-city-lab/styles/kfb-city-v0.json',import.meta.url)));
const checks=[];
function ok(id,value,detail=null){checks.push({id,pass:!!value,detail});if(!value)throw Error('FAIL '+id+(detail?' '+JSON.stringify(detail):''));}
function countTriangles(a){return a.parts.reduce((s,p)=>s+p.positions.length/9,0);}
function avgPoint(parts){
  let n=0,s=[0,0,0];for(const p of parts)for(let i=0;i<p.positions.length;i+=3){s[0]+=p.positions[i];s[1]+=p.positions[i+1];s[2]+=p.positions[i+2];n++;}
  return s.map(v=>v/Math.max(1,n));
}
function dist(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);}
function independentAnchor(source,a,deformation){
  if(deformation.mode==='base')return [...a.anchorOriginal];
  const b={minY:source.bounds.min[1],maxY:source.bounds.max[1],h:Math.max(1e-5,source.bounds.size[1]),cx:(source.bounds.min[0]+source.bounds.max[0])/2,cz:(source.bounds.min[2]+source.bounds.max[2])/2};
  const p=a.anchorOriginal,q=deformPoint({x:p[0],y:p[1],z:p[2]},b,deformation.params);
  if(!deformation.bulge)return [q.x,q.y,q.z];
  const t=Math.max(0,Math.min(1,(p[1]-b.minY)/b.h));
  const center=deformPoint({x:b.cx,y:p[1],z:b.cz},b,deformation.params),s=1+deformation.bulge*Math.sin(Math.PI*t);
  return [center.x+(q.x-center.x)*s,q.y,center.z+(q.z-center.z)*s];
}
const stats={};

for(const id of ['spasskaya','kremlin-wall']){
  const source=buildLandmark(id),sourceJson=JSON.stringify(source);
  for(const mode of ['base','city-grotesque','soft-cubist']){
    const rigged=rigLandmark(source,style,mode);
    ok(id+'.'+mode+'.source-unchanged',JSON.stringify(source)===sourceJson);
    ok(id+'.'+mode+'.triangles',countTriangles(rigged)===countTriangles(source),[countTriangles(rigged),countTriangles(source)]);
    ok(id+'.'+mode+'.ground',Math.abs(rigged.bounds.min[1]-source.bounds.min[1])<1e-9,[rigged.bounds.min[1],source.bounds.min[1]]);
    ok(id+'.'+mode+'.four-attachments',rigged.rig.attachments.length===4);
    ok(id+'.'+mode+'.semantic-groups',rigged.rig.groups.some(g=>g.id==='towerCore')&&rigged.rig.groups.filter(g=>g.type==='rigidAttached').length===4);
    if(id==='kremlin-wall')ok(id+'.'+mode+'.wall-groups',rigged.rig.groups.some(g=>g.id==='wall:left')&&rigged.rig.groups.some(g=>g.id==='wall:right'));
    const reports=rigidDistanceReport(source,rigged);
    ok(id+'.'+mode+'.clock-rigid',reports.every(r=>r.vertices>0&&r.maxError<1e-8),reports);
    for(const a of rigged.rig.attachments){
      const parts=rigged.parts.filter(p=>p.rigGroup===a.id),center=avgPoint(parts);
      ok(id+'.'+mode+'.anchor-field-'+a.id,dist(independentAnchor(source,a,rigged.rig.deformation),a.anchorDeformed)<1e-9);
      ok(id+'.'+mode+'.anchor-near-clock-'+a.id,dist(center,a.anchorDeformed)<4.0,[center,a.anchorDeformed]);
      const xy=Math.abs(a.basis.x[0]*a.basis.y[0]+a.basis.x[1]*a.basis.y[1]+a.basis.x[2]*a.basis.y[2]);
      const xz=Math.abs(a.basis.x[0]*a.basis.z[0]+a.basis.x[1]*a.basis.z[1]+a.basis.x[2]*a.basis.z[2]);
      const yz=Math.abs(a.basis.y[0]*a.basis.z[0]+a.basis.y[1]*a.basis.z[1]+a.basis.y[2]*a.basis.z[2]);
      ok(id+'.'+mode+'.basis-orthogonal-'+a.id,Math.max(xy,xz,yz)<1e-8,[xy,xz,yz]);
    }
    stats[id+'-'+mode]={triangles:countTriangles(rigged),bounds:rigged.bounds,rigidDistance:reports};
  }
  // The grouped path should preserve clock geometry better than the legacy pointwise path.
  for(const mode of ['city-grotesque','soft-cubist']){
    const legacy=shapeAsset(source,style,mode),grouped=rigLandmark(source,style,mode);
    const groupedReports=rigidDistanceReport(source,grouped);
    let legacyMax=0;
    for(const a of grouped.rig.attachments){
      const p0=source.parts.filter(p=>groupForPart(p.name)===a.id);
      const p1=legacy.parts.filter(p=>groupForPart(p.name)===a.id);
      for(let pi=0;pi<p0.length;pi++)for(let i=0;i<p0[pi].positions.length;i+=3){
        const d0=dist(p0[pi].positions.slice(i,i+3),a.anchorOriginal);
        const d1=dist(p1[pi].positions.slice(i,i+3),a.anchorDeformed);
        legacyMax=Math.max(legacyMax,Math.abs(d0-d1));
      }
    }
    ok(id+'.'+mode+'.grouped-better-than-legacy',Math.max(...groupedReports.map(r=>r.maxError))<1e-8&&legacyMax>.01,legacyMax);
    stats[id+'-'+mode].legacyClockDistortionM=legacyMax;
  }
}

for(const mode of ['idle','disco']){
  for(const intensity of [0,.5,1]){
    for(const t of [0,.17,.53,1.2,2.4]){
      const s=sampleLivingToyState({time:t,bpm:112,intensity,mode,impact:0});
      ok('reactor.'+mode+'.finite.'+intensity+'.'+t,Object.values(s.scale).every(Number.isFinite)&&Number.isFinite(s.tiltZ)&&Number.isFinite(s.accent));
      ok('reactor.'+mode+'.scale-bounds.'+intensity+'.'+t,s.scale.y>=.95&&s.scale.y<=1.09&&s.scale.x>=.95&&s.scale.x<=1.03,s.scale);
      ok('reactor.'+mode+'.accent-bounds.'+intensity+'.'+t,s.accent>=0&&s.accent<=1,s.accent);
    }
  }
}
for(const dir of [-1,1]){
  const s=sampleLivingToyState({time:.4,bpm:120,intensity:1,mode:'disco',impact:1,direction:dir});
  ok('reactor.impact-direction-'+dir,Math.sign(s.offsetX)===dir,[s.offsetX,dir]);
  ok('reactor.impact-bounded-'+dir,Math.abs(s.offsetX)<=.61&&Math.abs(s.tiltZ)<=.08,[s.offsetX,s.tiltZ]);
}

const viewerSource=readFileSync(root+'landmarks/pilot-04/viewer.mjs','utf8');
const strippedViewer=viewerSource.replace(/^import .*?;\s*$/gm,'').replace(/\bexport\s+(?=(const|function|async function))/g,'');
try{new Function(strippedViewer);ok('viewer.syntax',true);}catch(e){ok('viewer.syntax',false,String(e));}
const indexSource=readFileSync(root+'landmarks/pilot-04/index.html','utf8');
ok('index.controls',['rigMode','vibe','impactL','impactR','showRig'].every(id=>indexSource.includes('id="'+id+'"')));
ok('index.module',indexSource.includes('./viewer.mjs'));

const files=[
  'landmarks/pilot-04/SLICE.md','landmarks/pilot-04/rig.mjs','landmarks/pilot-04/rig-three.mjs',
  'landmarks/pilot-04/reactor.mjs','landmarks/pilot-04/viewer.mjs','landmarks/pilot-04/index.html'
];
const hashes=Object.fromEntries(files.map(f=>[f,createHash('sha256').update(readFileSync(root+f)).digest('hex')]));
const out=root+'evidence/2026-09-19-landmark-rig-v1/';mkdirSync(out,{recursive:true});
const result={schema:'kfb.landmark-rig-v1.qa/0.1',evidenceClass:'STATIC_NUMERICAL',browserRender:'NOT_YET_RUN',consumerIntegration:'NOT_RUN',humanAcceptance:'PENDING',passed:checks.length,total:checks.length,stats,sha256:hashes,checks};
writeFileSync(out+'checks.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,stats},null,2));
