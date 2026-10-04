/** KFB landmark pilot 01. Authored geometry, not an img2threejs/OSM reconstruction.
 * Units: metres; +Y up; root at local ground origin. No viewer scale baked into data.
 * All intermediate dimensions and schematic layouts are declared in sources.json.
 */
export const ZONES = ['structure','secondary','upper','accent','glazing','base'];
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
export function boundsOf(parts){
 const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
 for(const part of parts)for(let i=0;i<part.positions.length;i++){const a=i%3;lo[a]=Math.min(lo[a],part.positions[i]);hi[a]=Math.max(hi[a],part.positions[i]);}
 return {min:lo,max:hi,size:sub(hi,lo)};
}
function assembly(id,title,note){
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
function squareBand(a,name,zone,y,outer,inner,height){
 const t=(outer-inner)/2,c=(outer+inner)/4;
 a.box(name+'-n',zone,[0,y,c],[outer,height,t]);a.box(name+'-s',zone,[0,y,-c],[outer,height,t]);
 a.box(name+'-e',zone,[c,y,0],[t,height,inner]);a.box(name+'-w',zone,[-c,y,0],[t,height,inner]);
}
function eiffel(){
 const a=assembly('eiffel','Eiffel Tower','330 m high / 125 m base. Key levels calibrated; lattice and arches simplified. Geographic yaw not surveyed.');
 const stations=[[3,50,8.5],[22,40.5,7],[42,31,5],[55.5,26,4.2],[83,20,3.1],[113.5,15.3,2.5]];
 for(const sx of [-1,1])for(const sz of [-1,1]){
  const label=`leg-${sx}-${sz}`;
  a.box(label+'-foot','base',[sx*50,1.5,sz*50],[25,3,25]);
  const rings=stations.map(([y,c,w])=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(([dx,dz])=>[sx*c+dx*w,y,sz*c+dz*w]));
  for(let k=0;k<rings.length-1;k++)for(let side=0;side<4;side++){
   const next=(side+1)%4,width=k<2?2.2:1.5;
   a.beam(`${label}-${k}-rail-${side}`,'structure',rings[k][side],rings[k+1][side],width);
   a.beam(`${label}-${k}-tie-${side}`,'secondary',rings[k+1][side],rings[k+1][next],width*.75);
   a.beam(`${label}-${k}-x1-${side}`,'secondary',rings[k][side],rings[k+1][next],width*.58);
   a.beam(`${label}-${k}-x2-${side}`,'secondary',rings[k][next],rings[k+1][side],width*.58);
  }
 }
 // Decorative arches are explicit polylines: never a sideways cone or a solid wall.
 for(let side=0;side<4;side++){
  const pts=[];for(let i=0;i<=12;i++){const x=lerp(-43,43,i/12),h=Math.sqrt(Math.max(0,1-(x/43)**2));pts.push(spin([x,14+29*h,43-13*h],side*Math.PI/2));}
  for(let i=0;i<12;i++)a.beam(`arch-${side}-${i}`,'structure',pts[i],pts[i+1],2.1);
 }
 squareBand(a,'first-deck','upper',55.5,66,37,3); // deck top at 57 m
 squareBand(a,'first-edge','accent',57.6,66.5,63.5,1.2);
 squareBand(a,'second-deck','upper',113.5,40,19,3); // deck top at 115 m
 squareBand(a,'second-edge','accent',115.6,40.5,38,1.2);
 const heights=[116,139,161,183,205,227,249,273],half=[15.3,12.5,10.1,8.2,6.7,5.4,4.4,3.4];
 for(let k=0;k<heights.length-1;k++){
  const r=h=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,z])=>[x*half[h],heights[h],z*half[h]]);
  const p=r(k),q=r(k+1);
  for(let j=0;j<4;j++){let n=(j+1)%4;
   a.beam(`shaft-${k}-rail-${j}`,'structure',p[j],q[j],k<2?1.7:1.15);
   a.beam(`shaft-${k}-tie-${j}`,'secondary',q[j],q[n],.8);
   a.beam(`shaft-${k}-x1-${j}`,'secondary',p[j],q[n],.65);
   a.beam(`shaft-${k}-x2-${j}`,'secondary',p[n],q[j],.65);
  }
 }
 a.box('summit-deck','upper',[0,274.5,0],[16,3,16]); // 276 m
 a.box('summit-room','glazing',[0,279.5,0],[9,7,9]);
 a.box('summit-cornice','accent',[0,283.5,0],[11,1,11]);
 a.beam('lantern','structure',[0,284,0],[0,297,0],7,2.4);
 a.beam('mast','secondary',[0,297,0],[0,330,0],1.8,.22);
 return a.finish();
}
function pyramidSection(a,name,zone,c,y0,y1,w0,w1){
 const points=[];
 for(const [y,w] of [[y0,w0],[y1,w1]])for(const [x,z] of [[-1,-1],[1,-1],[1,1],[-1,1]])points.push([c[0]+x*w/2,y,c[1]+z*w/2]);
 if(w1===0){a.solid(name,zone,points.slice(0,5),[[0,1,2,3],[0,1,4],[1,2,4],[2,3,4],[3,0,4]]);}
 else a.solid(name,zone,points,[[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]]);
}
function giza(){
 const a=assembly('giza','Giza pyramids','Three-pyramid original-height study. Relative ground placement and bases are schematic; not an OSM site reconstruction.');
 const configs=[['khufu',[225,290],230.3,146.5,12],['khafre',[-70,0],215.5,143.5,11],['menkaure',[-230,-330],108.5,65,7]];
 for(const [id,c,w,h,steps] of configs){
  // Stacked closed tapered bands share exact boundaries. No displaced coplanar overlays.
  for(let i=0;i<steps;i++){
   const t0=i/steps,t1=(i+1)/steps;
   const zone=id==='khafre'&&i>=steps-2?'upper':id==='menkaure'&&i<2?'accent':i%4===0?'secondary':'structure';
   pyramidSection(a,`${id}-course-${i}`,zone,c,h*t0,h*t1,w*(1-t0),w*(1-t1));
  }
 }
 return a.finish();
}
function stoneBlock(a,name,zone,c,w,h,d,yaw,seed){
 // Eight-sided chamfered cross-section: shape variation rather than texture noise.
 const cut=.18;const xy=[[-.5+cut,-.5],[.5-cut,-.5],[.5,-.5+cut],[.5,.5-cut],[.5-cut,.5],[-.5+cut,.5],[-.5,.5-cut],[-.5,-.5+cut]];
 const vertices=[];let rnd=seed>>>0;const rand=()=>{rnd=(Math.imul(rnd,1664525)+1013904223)>>>0;return rnd/4294967296;};
 const lean=(rand()-.5)*w*.13;
 for(const level of [0,1])for(const [x,z] of xy){const f=level?.9:1;vertices.push(add(c,spin([x*w*f+level*lean,level*h,z*d*f],yaw)));}
 const faces=[Array.from({length:8},(_,i)=>i),Array.from({length:8},(_,i)=>i+8)];
 for(let i=0;i<8;i++){let j=(i+1)%8;faces.push([i,j,j+8,i+8]);}
 a.solid(name,zone,vertices,faces);
}
function stonehenge(){
 const a=assembly('stonehenge','Stonehenge','Schematic ruin study: broken outer ring, inner horseshoe, three complete trilithons. Stone identities and archaeological placement are not reproduced.');
 const stand=new Set([0,1,2,3,4,5,6,7,8,9,13,14,18,21,24,26,28]);
 const cap=new Set([0,1,2,4,6,8]);
 const radial=i=>{const t=i/30*TAU;return {t,p:[Math.sin(t)*14,0,Math.cos(t)*14]};};
 for(let i=0;i<30;i++){
  const {t,p}=radial(i);
  if(stand.has(i))stoneBlock(a,`sarsen-${i}`,'structure',p,2.1,4.1,1.35,t,100+i);
  else if([11,16,23].includes(i))stoneBlock(a,`fallen-${i}`,'secondary',[p[0],0,p[2]],4.1,1.15,1.7,t+.25,200+i);
  if(cap.has(i)){
   const next=radial(i+1).p,center=mul(add(p,next),.5),length=Math.hypot(next[0]-p[0],next[2]-p[2])+1.4;
   stoneBlock(a,`lintel-${i}`,'upper',[center[0],4.1,center[2]],length,.9,1.45,t+Math.PI/30,300+i);
  }
 }
 // Opens toward +Z locally; world alignment remains unresolved until source-bound.
 const sets=[[-6.2,3.7,6.05,-.65],[-6.2,-2.2,6.55,-1.08],[0,-6.2,7.25,0],[6.2,-2.2,6.55,1.08],[6.2,3.7,6.05,.65]];
 sets.forEach(([x,z,h,yaw],i)=>{
  for(const side of [-1,1]){const p=add([x,0,z],spin([side*1.18,0,0],yaw));
   if(i===2&&side===-1)stoneBlock(a,`inner-${i}-fallen`,'secondary',add([x+1.6,0,z-1.5],[0,0,0]),h-1.05,1.35,1.8,yaw+.45,400+i);
   else stoneBlock(a,`inner-${i}-${side}`,'structure',p,1.8,h-1.05,1.65,yaw,500+i*4+side);
  }
  if([0,1,4].includes(i))stoneBlock(a,`inner-${i}-lintel`,'accent',[x,h-1.05,z],4.75,1.05,1.9,yaw,700+i);
  else stoneBlock(a,`inner-${i}-lintel-fallen`,'secondary',[x+2.2,0,z+1],4.75,1.05,1.9,yaw+.25,700+i);
 });
 for(let i=0;i<16;i++){const t=i/16*TAU;stoneBlock(a,`bluestone-${i}`,'secondary',[Math.sin(t)*10.2,0,Math.cos(t)*10.2],.8,1.1+(i%4)*.22,.75,t,800+i);}
 return a.finish();
}
export const MODEL_IDS=['eiffel','giza','stonehenge'];
export function buildLandmark(id){
 const factories={eiffel,giza,stonehenge};
 if(!Object.hasOwn(factories,id))throw Error('Unknown landmark: '+id);
 return factories[id]();
}
export function mergeZones(asset){
 return ZONES.map(zone=>({zone,positions:asset.parts.filter(p=>p.zone===zone).flatMap(p=>p.positions)})).filter(p=>p.positions.length);
}
export function faceNormals(positions){
 const n=[];for(let i=0;i<positions.length;i+=9){const a=positions.slice(i,i+3),b=positions.slice(i+3,i+6),c=positions.slice(i+6,i+9);const normal=unit(cross(sub(b,a),sub(c,a)));n.push(...normal,...normal,...normal);}return n;
}
