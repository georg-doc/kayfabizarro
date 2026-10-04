import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {buildLandmark} from '../landmarks/pilot-02/geometry.mjs';
import {rigLandmark as socketRigV1} from '../landmarks/pilot-04/rig.mjs';
import {bandRigLandmark,clockMountReport,bandGroupForPart,BAND_IDS,BAND_RANGES,bandFieldPoint,applyBandTransformPoint} from '../landmarks/pilot-05/band-rig.mjs';
import {sampleBandVibe} from '../landmarks/pilot-05/band-reactor.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const style=JSON.parse(readFileSync(new URL('../../osm-city-lab/styles/kfb-city-v0.json',import.meta.url)));
const checks=[];const stats={};
function ok(id,value,detail=null){checks.push({id,pass:!!value,detail});if(!value)throw Error('FAIL '+id+' '+JSON.stringify(detail));}
const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],len=a=>Math.hypot(...a);
function triCount(a){return a.parts.reduce((s,p)=>s+p.positions.length/9,0);}
function normalOf(t){const n=cross(sub(t[1],t[0]),sub(t[2],t[0])),l=len(n);return n.map(v=>v/l);}
function closestPointTriangle(p,a,b,c){
  const ab=sub(b,a),ac=sub(c,a),ap=sub(p,a),d1=dot(ab,ap),d2=dot(ac,ap);if(d1<=0&&d2<=0)return a;
  const bp=sub(p,b),d3=dot(ab,bp),d4=dot(ac,bp);if(d3>=0&&d4<=d3)return b;
  const vc=d1*d4-d3*d2;if(vc<=0&&d1>=0&&d3<=0){const v=d1/(d1-d3);return a.map((x,i)=>x+v*ab[i]);}
  const cp=sub(p,c),d5=dot(ab,cp),d6=dot(ac,cp);if(d6>=0&&d5<=d6)return c;
  const vb=d5*d2-d1*d6;if(vb<=0&&d2>=0&&d6<=0){const w=d2/(d2-d6);return a.map((x,i)=>x+w*ac[i]);}
  const va=d3*d6-d5*d4;if(va<=0&&(d4-d3)>=0&&(d5-d6)>=0){const w=(d4-d3)/((d4-d3)+(d5-d6));return b.map((x,i)=>x+w*(c[i]-b[i]));}
  const den=1/(va+vb+vc),v=vb*den,w=vc*den;return a.map((x,i)=>x+ab[i]*v+ac[i]*w);
}
function pointFaceDistance(point,sourceStage,riggedStage,axis){
  const src=sourceStage.positions,rig=riggedStage.positions,candidates=[];
  for(let i=0;i<src.length;i+=9){
    const tri=[src.slice(i,i+3),src.slice(i+3,i+6),src.slice(i+6,i+9)];
    if(dot(normalOf(tri),axis)>.9)candidates.push(i/9);
  }
  let best=Infinity;
  for(const ti of candidates){
    const tri=[rig.slice(ti*9,ti*9+3),rig.slice(ti*9+3,ti*9+6),rig.slice(ti*9+6,ti*9+9)];
    best=Math.min(best,len(sub(point,closestPointTriangle(point,...tri))));
  }
  return best;
}

// Reproduce the v1.2 failure against the ACTUAL rendered host triangles.
{
  const source=buildLandmark('spasskaya'),old=socketRigV1(source,style,'city-grotesque');
  const ss=source.parts.find(p=>p.name==='clock-stage'),rs=old.parts.find(p=>p.name==='clock-stage');
  const axes=[[0,0,1],[1,0,0],[0,0,-1],[-1,0,0]];
  const distances=old.rig.attachments.map((a,i)=>pointFaceDistance(a.anchorDeformed,ss,rs,axes[i]));
  ok('v1.2.failure-reproduced',distances.every(v=>v>1),distances);
  ok('v1.2.failure-range',Math.min(...distances)>2.0&&Math.max(...distances)>3.7,distances);
  stats.socketV12HostFaceDistanceM=distances;
  stats.socketV12ClockCenterBiasM=old.rig.attachments[0].anchorOriginal[1]-41.5;
}

for(const id of ['spasskaya','kremlin-wall']){
  const source=buildLandmark(id),frozen=JSON.stringify(source);
  for(const mode of ['base','city-grotesque','soft-cubist']){
    const rigged=bandRigLandmark(source,style,mode);
    ok(id+'.'+mode+'.source-unchanged',JSON.stringify(source)===frozen);
    ok(id+'.'+mode+'.triangles',triCount(rigged)===triCount(source),[triCount(rigged),triCount(source)]);
    ok(id+'.'+mode+'.ground-plane',Math.abs(rigged.bounds.min[1])<1e-9,rigged.bounds.min);
    ok(id+'.'+mode+'.clock-stage-band',rigged.parts.find(p=>p.name==='clock-stage')?.rigBand==='clock');
    ok(id+'.'+mode+'.all-clocks-band',rigged.parts.filter(p=>p.name.startsWith('clock-')).every(p=>p.rigBand==='clock'));
    const mount=clockMountReport(source,rigged);
    ok(id+'.'+mode+'.mount-four',mount.length===4);
    ok(id+'.'+mode+'.mount-positive',mount.every(r=>r.riggedStandoff>0),mount);
    ok(id+'.'+mode+'.mount-error',mount.every(r=>r.error<1e-9),mount);
    for(const band of BAND_IDS){
      const T=rigged.rig.bands[band],range=BAND_RANGES[band],bounds={minY:source.bounds.min[1],maxY:source.bounds.max[1],h:Math.max(1e-5,source.bounds.size[1]),cx:(source.bounds.min[0]+source.bounds.max[0])/2,cz:(source.bounds.min[2]+source.bounds.max[2])/2};
      const profile=mode==='base'?null:{params:rigged.rig.modeParams?.params,bulge:rigged.rig.modeParams?.bulge||0};
      // Endpoint identity is guaranteed directly by the fitted transform. Test against stored transform geometry.
      const A=applyBandTransformPoint([0,range[0],0],T),B=applyBandTransformPoint([0,range[1],0],T);
      ok(id+'.'+mode+'.'+band+'.bottom-origin',len(sub(A,T.origin))<1e-9,A);
      ok(id+'.'+mode+'.'+band+'.top-length',Math.abs(len(sub(B,A))-(range[1]-range[0])*T.sy)<1e-9,[A,B,T.sy]);
      ok(id+'.'+mode+'.'+band+'.finite',[...T.origin,...T.x,...T.y,...T.z,T.sx,T.sy,T.sz].every(Number.isFinite));
      if(band==='lower')ok(id+'.'+mode+'.lower-horizontal-basis',Math.abs(T.x[1])<1e-12&&Math.abs(T.z[1])<1e-12,[T.x,T.z]);
      else{
        ok(id+'.'+mode+'.'+band+'.orthogonal',
          Math.max(Math.abs(dot(T.x,T.y)),Math.abs(dot(T.x,T.z)),Math.abs(dot(T.y,T.z)))<1e-8,[T.x,T.y,T.z]);
      }
    }
    stats[id+'-'+mode]={triangles:triCount(rigged),bounds:rigged.bounds,mount};
  }
}

for(const mode of ['idle','disco'])for(const intensity of [0,.5,1])for(const t of [0,.17,.53,1.2,2.4]){
  const s=sampleBandVibe({time:t,bpm:112,intensity,mode,impact:0});
  ok('reactor.'+mode+'.finite.'+intensity+'.'+t,[s.rootScaleY,s.rootScaleXZ,s.rootTiltZ,s.rootOffsetX,s.accent,...Object.values(s.bands)].every(Number.isFinite));
  ok('reactor.'+mode+'.bounds.'+intensity+'.'+t,s.rootScaleY>=.99&&s.rootScaleY<=1.06&&s.rootScaleXZ>=.97&&s.rootScaleXZ<=1.01,[s.rootScaleY,s.rootScaleXZ]);
}
for(const dir of [-1,1]){
  const s=sampleBandVibe({time:.4,bpm:120,intensity:1,mode:'disco',impact:1,direction:dir});
  ok('reactor.impact-dir-'+dir,Math.sign(s.rootOffsetX)===dir,s.rootOffsetX);
  ok('reactor.impact-bounds-'+dir,Math.abs(s.rootOffsetX)<=.43&&Math.abs(s.rootTiltZ)<=.065,[s.rootOffsetX,s.rootTiltZ]);
}

const sourceFiles=['landmarks/pilot-05/SLICE.md','landmarks/pilot-05/band-rig.mjs','landmarks/pilot-05/band-three.mjs','landmarks/pilot-05/band-reactor.mjs','landmarks/pilot-05/viewer.mjs','landmarks/pilot-05/index.html'];
for(const file of ['landmarks/pilot-05/band-rig.mjs','landmarks/pilot-05/band-three.mjs','landmarks/pilot-05/band-reactor.mjs','landmarks/pilot-05/viewer.mjs']){
  const src=readFileSync(root+file,'utf8').replace(/^import .*?;\s*$/gm,'').replace(/\bexport\s+(?=(const|function|async function))/g,'');
  try{new Function(src);ok(file+'.syntax',true);}catch(e){ok(file+'.syntax',false,String(e));}
}
const index=readFileSync(root+'landmarks/pilot-05/index.html','utf8');
ok('index.controls',['rigMode','palette','vibe','impactL','impactR','showRig'].every(x=>index.includes('id="'+x+'"')));
ok('index.module',index.includes('./viewer.mjs'));
const hashes=Object.fromEntries(sourceFiles.map(f=>[f,createHash('sha256').update(readFileSync(root+f)).digest('hex')]));
const out=root+'evidence/2026-09-19-landmark-band-rig-v2/';mkdirSync(out,{recursive:true});
const result={schema:'kfb.landmark-band-rig-v2.qa/0.1',evidenceClass:'STATIC_NUMERICAL_PLUS_CPU_VISUAL',browserWebGL:'NOT_VERIFIED',consumerIntegration:'NOT_RUN',humanAcceptance:'PENDING',passed:checks.length,total:checks.length,stats,sha256:hashes,checks};
writeFileSync(out+'checks.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,stats},null,2));
