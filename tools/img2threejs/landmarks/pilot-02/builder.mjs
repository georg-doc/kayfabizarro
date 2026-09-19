/** Extracted unchanged solid builder from pilot-01 geometry blob 39b2e511e58e270499391027c267dab0e4a1f395.
 * No changes to prior models. Reuse their zone and bound contracts. Convex faces only. */
import {ZONES,boundsOf} from "../pilot-01/geometry.mjs";
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>{const n=Math.hypot(...a);if(n<1e-9)throw Error('Zero-length direction');return mul(a,1/n);};
const average=ps=>mul(ps.reduce((a,p)=>add(a,p),[0,0,0]),1/ps.length);
const spin=(p,yaw)=>[p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw),p[1],-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw)];
const lerp=(a,b,t)=>a+(b-a)*t;
const TAU=Math.PI*2;
export function assembly(id,title,note){
 const a={id,title,note,units:'metre',upAxis:'+Y',pivot:'ground-origin',geographicBinding:null,accepted:false,parts:[]};
 a.solid=(name,zone,vertices,faces)=>{
  if(!ZONES.includes(zone))throw Error('Unknown zone '+zone);
  const center=average(vertices),positions=[];
  for(const ids of faces){
   let f=ids.map(i=>vertices[i]);
   if(dot(cross(sub(f[1],f[0]),sub(f[2],f[0])),sub(average(f),center))<0)f=[...f].reverse();
   for(let i=1;i<f.length-1;i++)positions.push(...f[0],...f[i],...f[i+1]);
  }
  a.parts.push({name,zone,positions});
 };
 a.beam=(name,zone,start,end,width,endWidth=width)=>{
  if(!(width>0&&endWidth>0))throw Error('Invalid beam width');
  const d=unit(sub(end,start));
  const u=unit(cross(d,Math.abs(d[1])>.94?[1,0,0]:[0,1,0]));const v=cross(d,u);
  const points=[];
  for(const [c,w] of [[start,width],[end,endWidth]])for(const [x,z] of [[-1,-1],[1,-1],[1,1],[-1,1]])points.push(add(c,add(mul(u,x*w/2),mul(v,z*w/2))));
  a.solid(name,zone,points,[[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]]);
 };
 a.box=(name,zone,center,size,yaw=0)=>{
  const points=[];
  for(const y of [-1,1])for(const [x,z] of [[-1,-1],[1,-1],[1,1],[-1,1]])points.push(add(center,spin([x*size[0]/2,y*size[1]/2,z*size[2]/2],yaw)));
  a.solid(name,zone,points,[[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]]);
 };
 a.finish=()=>{delete a.solid;delete a.beam;delete a.box;delete a.finish;a.bounds=boundsOf(a.parts);a.triangles=a.parts.reduce((s,p)=>s+p.positions.length/9,0);return a;};
 return a;
}

export {spin,add,mul};
