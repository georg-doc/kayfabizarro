/** Pilot 02: architecture studies, not geographic or security/site plans. */
import {buildLandmark as buildPrior,MODEL_IDS as PRIOR_IDS} from '../pilot-01/geometry.mjs';
import {assembly,spin,add} from './builder.mjs';
export const NEW_MODEL_IDS=['pentagon','spasskaya','kremlin-wall'];
export const MODEL_IDS=[...PRIOR_IDS,...NEW_MODEL_IDS];
export const PENTAGON={sideM:281,heightM:23.5,courtApothemM:75,ringWidthM:15};
const TAU=Math.PI*2;
function extrude(a,name,zone,poly,front,back){
 const n=poly.length,pts=[...poly.map(([x,y])=>[x,y,front]),...poly.map(([x,y])=>[x,y,back])];
 const faces=[Array.from({length:n},(_,i)=>i),Array.from({length:n},(_,i)=>i+n)];
 for(let i=0;i<n;i++){const j=(i+1)%n;faces.push([i,j,j+n,i+n]);}
 a.solid(name,zone,pts,faces);
}
function rotateLast(a,from,yaw,offset=[0,0,0]){
 for(const p of a.parts.slice(from))for(let i=0;i<p.positions.length;i+=3){const v=add(spin(p.positions.slice(i,i+3),yaw),offset);p.positions.splice(i,3,...v);}
}
function ringWall(a,name,zone,outerA,innerA,y0,y1){
 const r0=outerA/Math.cos(Math.PI/5),r1=innerA/Math.cos(Math.PI/5);
 const point=(r,i,y)=>[Math.sin(i*TAU/5+Math.PI/5)*r,y,Math.cos(i*TAU/5+Math.PI/5)*r];
 for(let i=0;i<5;i++){
  const p=[point(r0,i,y0),point(r0,i+1,y0),point(r1,i+1,y0),point(r1,i,y0)];
  a.solid(`${name}-${i}`,zone,[...p,...p.map(q=>[q[0],y1,q[2]])],[[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]]);
 }
}
function roofRing(a,name,outerA,innerA,eave,ridge){
 const radii=[outerA,(outerA+innerA)/2,innerA].map(v=>v/Math.cos(Math.PI/5));
 const P=(r,i,y)=>[Math.sin(i*TAU/5+Math.PI/5)*r,y,Math.cos(i*TAU/5+Math.PI/5)*r];
 for(let side=0;side<5;side++){
  // Closed triangular-section roof prisms with a pentagonal ridge, not five cones.
  const v=[P(radii[0],side,eave),P(radii[1],side,ridge),P(radii[2],side,eave),P(radii[0],side+1,eave),P(radii[1],side+1,ridge),P(radii[2],side+1,eave)];
  a.solid(`${name}-${side}`,'upper',v,[[0,1,2],[3,4,5],[0,3,4,1],[1,4,5,2],[2,5,3,0]]);
 }
}
function pentagon(){
 const a=assembly('pentagon','The Pentagon','Five rings and an open court. 281 m outer sides; nominal 23.5 m roof height. Simplified exterior; no surveyed OSM binding.');
 const {sideM,heightM,courtApothemM,ringWidthM}=PENTAGON;
 const outerA=sideM/(2*Math.tan(Math.PI/5));const gap=(outerA-courtApothemM-5*ringWidthM)/4;
 for(let i=0;i<5;i++){
  const o=outerA-i*(ringWidthM+gap),inn=o-ringWidthM,h=i===0||i===4?20.6:21.7;
  ringWall(a,`ring-${i}-body`,i%2?'secondary':'structure',o,inn,0,h);
  if(i===0||i===4)roofRing(a,`ring-${i}-roof`,o,inn,h,heightM);
  else ringWall(a,`ring-${i}-roof`,'upper',o,inn,h,h+.45);
 }
 // Ten visual connector axes (schematic, no interior navigation/access semantics).
 for(let i=0;i<10;i++)for(let j=0;j<4;j++){
  const theta=i*TAU/10,angleToNormal=(i%2)*Math.PI/5;
  const rOuter=(outerA-j*(ringWidthM+gap)-ringWidthM)/Math.cos(angleToNormal);
  const rInner=(outerA-(j+1)*(ringWidthM+gap))/Math.cos(angleToNormal);
  const from=a.parts.length;
  a.box(`link-${i}-${j}`,'secondary',[0,10.4,(rOuter+rInner)/2],[6,20.8,rOuter-rInner+1]);
  a.box(`link-${i}-${j}-roof`,'upper',[0,21.0,(rOuter+rInner)/2],[6.2,.4,rOuter-rInner+1]);
  rotateLast(a,from,theta);
 }
 for(let side=0;side<5;side++){
  const from=a.parts.length;
  for(const [surface,half,dir] of [[outerA,sideM/2,1],[courtApothemM,courtApothemM*Math.tan(Math.PI/5),-1]]){
   // Sparse volumetric window codes at four upper levels; no textures or huge mesh count.
   const bays=surface===outerA?28:12;
   for(let row=0;row<4;row++)for(let k=0;k<bays;k++){
    const step=half*2/bays,x=-half+step*(k+.5);
    a.box(`window-${side}-${surface}-${row}-${k}`,'glazing',[x,5.7+row*3.5,surface+dir*.09],[step*.49,1.7,.18]);
   }
   a.box(`cornice-${side}-${surface}`,'secondary',[0,19.8,surface+dir*.13],[half*2,.65,.35]);
  }
  rotateLast(a,from,side*TAU/5);
 }
 // One abstract colonnaded facade motif, not a map of operational entrances.
 a.box('portico-cap','secondary',[0,18.7,outerA+.9],[44,1.3,2]);
 for(let i=0;i<11;i++)a.box(`portico-pier-${i}`,'structure',[-20+i*4,9.3,outerA+1],[1,17.4,1.5]);
 const result=a.finish();result.referenceDimensions={outerSideM:sideM,roofHeightM:heightM};return result;
}
function frustum(a,name,zone,y0,y1,r0,r1,n=8,c=[0,0],yaw=Math.PI/8){
 const pts=[];for(const [y,r] of [[y0,r0],[y1,r1]])for(let i=0;i<n;i++)pts.push([c[0]+Math.sin(i*TAU/n+yaw)*r,y,c[1]+Math.cos(i*TAU/n+yaw)*r]);
 const faces=[Array.from({length:n},(_,i)=>i),Array.from({length:n},(_,i)=>i+n)];
 for(let i=0;i<n;i++){const j=(i+1)%n;faces.push([i,j,j+n,i+n]);}
 a.solid(name,zone,pts,faces);
}
function clock(a,yaw){
 const from=a.parts.length,N=24,r=3.06,z=5.48,y=41.5;
 const poly=Array.from({length:N},(_,i)=>[Math.sin(i*TAU/N)*r,y+Math.cos(i*TAU/N)*r]);
 extrude(a,`clock-face-${yaw}`,'glazing',poly,z,z+.13);
 for(let i=0;i<N;i++){
  const t=i*TAU/N,u=(i+1)*TAU/N;
  extrude(a,`clock-rim-${yaw}-${i}`,'accent',[[Math.sin(t)*r,y+Math.cos(t)*r],[Math.sin(u)*r,y+Math.cos(u)*r],[Math.sin(u)*(r+.17),y+Math.cos(u)*(r+.17)],[Math.sin(t)*(r+.17),y+Math.cos(t)*(r+.17)]],z+.08,z+.21);
 }
 for(let i=0;i<12;i++){const t=i*TAU/12;a.beam(`clock-tick-${yaw}-${i}`,'accent',[Math.sin(t)*2.54,y+Math.cos(t)*2.54,z+.25],[Math.sin(t)*2.85,y+Math.cos(t)*2.85,z+.25],.11);}
 a.beam(`clock-hour-${yaw}`,'accent',[0,y,z+.3],[-1.45,y+.84,z+.3],.14);
 a.beam(`clock-minute-${yaw}`,'accent',[0,y,z+.32],[1.95,y+1.13,z+.32],.105);
 rotateLast(a,from,yaw);
}
function spasskayaInto(a){
 const half=8.9,r=2.8,spring=6.0;
 a.box('gate-left','structure',[-(half+r)/2,6,0],[half-r,12,17.8]);
 a.box('gate-right','structure',[(half+r)/2,6,0],[half-r,12,17.8]);
 for(let i=0;i<12;i++){
  const t0=Math.PI-i*Math.PI/12,t1=Math.PI-(i+1)*Math.PI/12;
  const x0=Math.cos(t0)*r,x1=Math.cos(t1)*r,y0=spring+Math.sin(t0)*r,y1=spring+Math.sin(t1)*r;
  extrude(a,`gate-arch-masonry-${i}`,'structure',[[x0,y0],[x1,y1],[x1,12],[x0,12]],-8.9,8.9);
  const rr=r+.36;
  const poly=[[x0,y0],[x1,y1],[Math.cos(t1)*rr,spring+Math.sin(t1)*rr],[Math.cos(t0)*rr,spring+Math.sin(t0)*rr]];
  for(const face of [-1,1])extrude(a,`arch-trim-${i}-${face}`,'secondary',poly,face*8.94-.12,face*8.94+.12);
 }
 for(const x of [-r-.2,r+.2])for(const z of [-8.98,8.98])a.box(`gate-jamb-${x}-${z}`,'secondary',[x,3,z],[.4,6,.32]);
 a.box('tower-base-mass','structure',[0,21,0],[17.8,18,17.8]);
 for(const [name,y,w] of [['low-band',19.7,18.15],['gallery-band',29.8,18.8]])a.box(name,'secondary',[0,y,0],[w,.65,w]);
 for(const x of [-8.6,8.6])for(const z of [-8.6,8.6])a.box(`corner-pilaster-${x}-${z}`,'secondary',[x,24.2,z],[.62,11,.62]);
 frustum(a,'lower-hip-roof','upper',30.2,34.7,12.8,7.4,4,[0,0],Math.PI/4);
 a.box('clock-stage','structure',[0,39.3,0],[10.8,13.4,10.8]);
 a.box('clock-stage-bottom','secondary',[0,35.1,0],[11.2,.6,11.2]);
 a.box('clock-stage-top','secondary',[0,46.1,0],[11.4,.75,11.4]);
 for(const sx of [-1,1])for(const sz of [-1,1]){
  const x=sx*7.9,z=sz*7.9,id=`pinnacle-${sx}-${sz}`;
  a.box(id+'-pillar','structure',[x,32.8,z],[1.7,5.2,1.7]);
  a.box(id+'-cap','secondary',[x,35.5,z],[2.15,.4,2.15]);
  frustum(a,id+'-spire','secondary',35.7,39.6,1.15,.07,4,[x,z],Math.PI/4);
 }
 for(let side=0;side<4;side++){
  const first=a.parts.length;
  extrude(a,`gable-${side}`,'structure',[[-6,30.6],[6,30.6],[0,35.8]],8.84,9.12);
  a.beam(`gable-left-${side}`,'secondary',[-6,30.6,9.2],[0,35.8,9.2],.48);
  a.beam(`gable-right-${side}`,'secondary',[0,35.8,9.2],[6,30.6,9.2],.48);
  rotateLast(a,first,side*Math.PI/2);clock(a,side*Math.PI/2);
 }
 // Eight-sided open belfry, intentionally thick enough to read at map distance.
 frustum(a,'belfry-drum','structure',46.5,48.2,5.7,5.7);
 frustum(a,'belfry-sill','secondary',48.15,48.65,5.95,5.95);
 for(let i=0;i<8;i++){
  const t=i*TAU/8+Math.PI/8,x=Math.sin(t)*5.15,z=Math.cos(t)*5.15;
  a.box(`belfry-post-${i}`,'secondary',[x,50.8,z],[.65,4.4,.65],t);
 }
 frustum(a,'belfry-crown','secondary',52.8,53.6,5.95,5.95);
 frustum(a,'green-tent','upper',53.6,67.25,5.55,.13);
 for(let i=0;i<8;i++){
  const t=i*TAU/8+Math.PI/8;a.beam(`tent-rib-${i}`,'accent',[Math.sin(t)*5.55,53.6,Math.cos(t)*5.55],[Math.sin(t)*.13,67.25,Math.cos(t)*.13],.13,.035);
 }
 a.beam('star-mast','accent',[0,67.2,0],[0,69.2,0],.16);
 // Convex triangular sectors avoid incorrect fan triangulation of a concave star.
 const top=71,R=1.96,cy=top-R;
 const points=Array.from({length:10},(_,i)=>{const t=i*TAU/10,r=i%2?R*.43:R;return [Math.sin(t)*r,cy+Math.cos(t)*r];});
 for(let i=0;i<10;i++)extrude(a,`star-sector-${i}`,'structure',[[0,cy],points[i],points[(i+1)%10]],-.12,.12);
}
function battlement(a,x,z,id){
 // Two sloping horns and a connecting base, with a real swallow-tail notch.
 extrude(a,`${id}-left`,'structure',[[x-.65,11],[x-.65,13.1],[x-.05,12.35],[x,11.55]],z-.42,z+.42);
 extrude(a,`${id}-right`,'structure',[[x,11.55],[x+.05,12.35],[x+.65,13.1],[x+.65,11]],z-.42,z+.42);
 a.box(id+'-bridge','structure',[x,11.3,z],[1.3,.6,.84]);
}
function kremlin(walls=false){
 const a=assembly(walls?'kremlin-wall':'spasskaya',walls?'Kremlin wall study':'Spasskaya Tower',walls?'Spasskaya with reusable wall segments. Schematic ensemble, not the full Moscow Kremlin or a surveyed wall layout.':'71 m silhouette study with open gateway, four clock faces and an eight-sided belfry. Secondary dimensions are approximated.');
 spasskayaInto(a);
 if(walls)for(const sign of [-1,1]){
  const mid=sign*33.5;a.box(`wall-${sign}`,'structure',[mid,5.5,0],[49.2,11,4]);
  a.box(`wall-${sign}-plinth`,'base',[mid,.75,0],[49.2,1.5,4.15]);
  a.box(`wall-${sign}-walkway`,'secondary',[mid,10.8,-.65],[49.2,.5,2.7]);
  for(let i=0;i<20;i++)battlement(a,sign*(10.2+i*2.42),1.6,`merlon-${sign}-${i}`);
 }
 const result=a.finish();result.referenceDimensions={towerHeightM:71};return result;
}
export function buildLandmark(id){
 if(PRIOR_IDS.includes(id))return buildPrior(id);
 if(id==='pentagon')return pentagon();if(id==='spasskaya')return kremlin();if(id==='kremlin-wall')return kremlin(true);
 throw Error('Unknown landmark: '+id);
}
