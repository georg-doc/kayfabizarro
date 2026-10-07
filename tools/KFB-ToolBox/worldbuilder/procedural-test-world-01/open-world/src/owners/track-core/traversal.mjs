// Track Core consumer path: existing compiled route samples and node lane paths only.
// No road geometry, smoothing, topology solver, input or movement integration.
export function compileTraversal(graph,parts,{id,closed=false,laneOffset=2.7}={}){
 const points=[],append=(p,q,part)=>{if(points.length&&Math.hypot(...p.map((x,i)=>x-points.at(-1).p[i]))<1e-5)return;points.push({p:[...p],q,part})};
 for(const part of parts){
  if(part.route){const route=graph.routes[part.route];if(!route)throw Error('Missing traversal route '+part.route);const samples=part.reverse?[...route.samples].reverse():route.samples;for(const q of samples){const sign=part.reverse?-1:1;append(q.p.map((x,i)=>x+q.R[i]*laneOffset*sign),q,part.route)}}
  else {const node=graph.nodes.find(n=>n.id===part.node),path=node?.paths.find(p=>p.id===part.path);if(!path)throw Error('Missing native junction path');const template=Object.values(graph.routes)[0].samples[0];for(const p of path.pts)append(p,template,part.node+'/'+part.path)}
 }
 if(closed){const gap=Math.hypot(...points[0].p.map((x,i)=>x-points.at(-1).p[i]));if(gap>.05)throw Error('Traversal closure gap '+gap);points.at(-1).p=[...points[0].p]}
 let s=0;const samples=points.map((v,i)=>{if(i){const d=Math.hypot(...v.p.map((x,k)=>x-points[i-1].p[k]));if(d>1.2)throw Error('Unconnected traversal seam '+v.part+': '+d);s+=d}const a=points[Math.max(0,i-1)].p,b=points[Math.min(points.length-1,i+1)].p,T=b.map((x,k)=>x-a[k]),l=Math.hypot(...T);for(let k=0;k<3;k++)T[k]/=l;const R=[-T[2],0,T[0]],rl=Math.hypot(...R);for(let k=0;k<3;k++)R[k]/=rl;return {...v.q,p:v.p,T,R,U:[-R[2]*T[1],R[2]*T[0]-R[0]*T[2],R[0]*T[1]],s,part:v.part,prm:{...v.q.prm,width:5.4,offset:0},slots:v.q.slots.map(([lat,h])=>[lat<0?-2.7:2.7,h])}});
 return {schema:'kfb.track-core.traversal/1',id,closed,samples,ds:.5,sourceGraph:graph.id,parts:structuredClone(parts)};
}
