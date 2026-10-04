/* Geometric placement constraints only. Track Core owns all route/support/collision.
 * Polygon tests include edges, containment and setback; no centre-only acceptance. */
import {createStrandProfile} from './joyride-profile.v1.mjs';
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
export function hull(points){
 const p=[...new Map(points.map(p=>[p.join(','),p])).values()].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 if(p.length<3)return p;
 const lo=[],hi=[];for(const q of p){while(lo.length>1&&cross(lo.at(-2),lo.at(-1),q)<=0)lo.pop();lo.push(q)}
 for(const q of p.toReversed()){while(hi.length>1&&cross(hi.at(-2),hi.at(-1),q)<=0)hi.pop();hi.push(q)}
 return lo.slice(0,-1).concat(hi.slice(0,-1));
}
export function segmentDistance(p,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dz)}
export function inside(p,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if(segmentDistance(p,a,b)<1e-7)return true;if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
function intersects(a,b,c,d){return cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0}
export function polygonDistance(a,b){
 if(!a.length||!b.length)throw Error('Empty footprint');
 if(a.some(p=>inside(p,b))||b.some(p=>inside(p,a)))return 0;
 let m=Infinity;
 for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++){const aa=a[i],ab=a[(i+1)%a.length],ba=b[j],bb=b[(j+1)%b.length];if(intersects(aa,ab,ba,bb))return 0;m=Math.min(m,segmentDistance(aa,ba,bb),segmentDistance(ab,ba,bb),segmentDistance(ba,aa,ab),segmentDistance(bb,aa,ab))}return m;
}
export function pointPolygonDistance(p,poly){return inside(p,poly)?0:Math.min(...poly.map((a,i)=>segmentDistance(p,a,poly[(i+1)%poly.length])))}
export function trackCorridor(stream,atlas,id,kind='track'){
 const {ringOf,W3}=createStrandProfile(stream,atlas),rings=stream.samples.map((q,i)=>{
  // Full projected visible strand PLUS authoritative slots. Banking remains represented.
  return hull([...ringOf(q,i),...q.slots.map(([l,h])=>W3(q,l,h))].map(p=>[p[0],p[2]]));
 });
 return rings.slice(1).map((r,i)=>({id,kind,polygon:hull([...rings[i],...r])}));
}
export function protectedAnchors(anchors){return anchors.map(a=>({id:a.id,point:[a.position[0],a.position[2]],radius:a.role==='media'?2.5:a.role==='spawn'?3:a.role.includes('scene')||a.role==='resident-set-slot'?5:3.5,kind:'anchor'}))}
export function checkFootprint(poly,{corridors=[],anchors=[],roots=[],buildings=[],setback=1}){
 const box=p=>[Math.min(...p.map(v=>v[0])),Math.min(...p.map(v=>v[1])),Math.max(...p.map(v=>v[0])),Math.max(...p.map(v=>v[1]))];
 const a=box(poly),near=c=>{const b=c.bounds||(c.bounds=box(c.polygon));return a[0]-setback<=b[2]&&a[2]+setback>=b[0]&&a[1]-setback<=b[3]&&a[3]+setback>=b[1]};
 const hits=[];
 for(const c of corridors)if(near(c)&&polygonDistance(poly,c.polygon)<setback-1e-6)hits.push({kind:c.kind,id:c.id});
 for(const a of [...anchors,...roots])if(pointPolygonDistance(a.point,poly)<a.radius+setback-1e-6)hits.push({kind:a.kind||'root',id:a.id});
 for(const b of buildings)if(polygonDistance(poly,b.footprint)<setback-1e-6)hits.push({kind:'building',id:b.id});
 return [...new Map(hits.map(x=>[x.kind+'/'+x.id,x])).values()];
}
// Search a grid, scored toward a landmark cluster. Reject outside or excessive slopes.
// The caller fixes geometry/scale BEFORE this function; no hidden shrinking.
export function findPlacement({localFootprint,preferred,centre,plan,field,constraints,rotation=0}){
 const c=Math.cos(rotation),s=Math.sin(rotation),rot=localFootprint.map(([x,z])=>[c*x+s*z,-s*x+c*z]);
 const points=[preferred];const R=Math.ceil(Math.max(...plan.edgeR));
 for(let dx=-R;dx<=R;dx+=2)for(let dz=-R;dz<=R;dz+=2)points.push([plan.c0[0]+dx,plan.c0[1]+dz]);
 points.sort((a,b)=>score(a)-score(b));
 function score(p){const d=Math.hypot(p[0]-preferred[0],p[1]-preferred[1]),cluster=Math.hypot(p[0]-centre[0],p[1]-centre[1]);return d*.65+cluster*.35}
 let rejected=0;
 for(const [x,z] of points){const polygon=rot.map(([dx,dz])=>[x+dx,z+dz]);
  const samples=polygon.flatMap((p,i)=>{const b=polygon[(i+1)%polygon.length],n=Math.max(1,Math.ceil(Math.hypot(b[0]-p[0],b[1]-p[1])));return Array.from({length:n},(_,k)=>[p[0]+(b[0]-p[0])*k/n,p[1]+(b[1]-p[1])*k/n])});
  if(samples.some(p=>plan.sdf(...p)>-1.2)||checkFootprint(polygon,constraints).length){rejected++;continue}
  const heights=samples.map(p=>field.heightAt(...p)),span=Math.max(...heights)-Math.min(...heights);
  if(span>2.5){rejected++;continue}
  return {x,z,footprint:polygon,base:Math.max(...heights),span,rejected,rotation};
 }
 throw Error('No clear authored-scale placement for '+plan.worldId+' ('+rejected+' rejected)');
}
