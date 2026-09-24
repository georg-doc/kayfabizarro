// KFB World Zone compiler · deterministic visual geometry helpers.
const round6 = (v) => +Number(v).toFixed(6);
export function stableHash(value){
  let h=2166136261;
  for(const c of String(value)){ h^=c.charCodeAt(0); h=Math.imul(h,16777619); }
  return h>>>0;
}
function mulberry32(seed){
  let a=(seed>>>0)||1;
  return function(){
    a=(a+0x6D2B79F5)|0;
    let t=Math.imul(a^(a>>>15),1|a);
    t=(t+Math.imul(t^(t>>>7),61|t))^t;
    return ((t^(t>>>14))>>>0)/4294967296;
  };
}
function cityCartoonParams(id,cfg={},seedRoot='kfb-city'){
  const seed=stableHash(seedRoot+':'+id),r=mulberry32(seed),sym=()=>r()*2-1;
  const bend=Number(cfg.bend??0.018),lean=Number(cfg.lean??0.024),taper=Number(cfg.taper??0.055),twistDeg=Number(cfg.twistDeg??1.8);
  const stackSteps=Math.max(0,Math.floor(Number(cfg.stackSteps??0))),stackShift=Math.max(0,Number(cfg.stackShift??0));
  const stackOffsets=[{x:0,z:0}];
  for(let i=1;i<=stackSteps;i++){
    const strength=stackShift*(.4+.6*i/Math.max(1,stackSteps));
    stackOffsets.push({x:sym()*strength,z:sym()*strength});
  }
  return {bendX:sym()*bend,bendZ:sym()*bend,leanX:sym()*lean,leanZ:sym()*lean,taper:(.35+r()*.65)*taper,twist:sym()*twistDeg*Math.PI/180,stackOffsets,seed};
}
function deformXZ(x,z,y,bounds,p){
  const t=Math.max(0,Math.min(1,(y-bounds.minY)/bounds.h));
  let rx=x-bounds.cx,rz=z-bounds.cz;
  const s=Math.max(.68,1-p.taper*t);rx*=s;rz*=s;
  const a=p.twist*t,ca=Math.cos(a),sa=Math.sin(a);
  const tx=rx*ca-rz*sa,tz=rx*sa+rz*ca;
  const offsets=p.stackOffsets||[];
  let ox=0,oz=0;
  if(offsets.length>1){
    const index=Math.min(offsets.length-1,Math.max(0,Math.round(t*(offsets.length-1))));
    const o=offsets[index]||offsets[0]; ox=o.x*bounds.h; oz=o.z*bounds.h;
  }
  return {x:bounds.cx+tx+(p.bendX*t*t+p.leanX*t)*bounds.h+ox,z:bounds.cz+tz+(p.bendZ*t*t+p.leanZ*t)*bounds.h+oz};
}
function openRing(poly=[]){
  const out=poly.map(p=>({x:Number(p.x),z:Number(p.z)})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.z));
  if(out.length>1&&Math.hypot(out[0].x-out.at(-1).x,out[0].z-out.at(-1).z)<.001)out.pop();
  return out;
}
function polygonArea(poly){
  let a=0; for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length];a+=p.x*q.z-q.x*p.z;} return a/2;
}
function pointInTri(p,a,b,c){
  const sign=(p1,p2,p3)=>(p1.x-p3.x)*(p2.z-p3.z)-(p2.x-p3.x)*(p1.z-p3.z);
  const d1=sign(p,a,b),d2=sign(p,b,c),d3=sign(p,c,a),hasNeg=d1<0||d2<0||d3<0,hasPos=d1>0||d2>0||d3>0;
  return !(hasNeg&&hasPos);
}
function earClip(poly){
  if(poly.length<3)return [];
  const pts=polygonArea(poly)>0?poly:poly.slice().reverse();
  const order=polygonArea(poly)>0?[...poly.keys()]:[...poly.keys()].reverse();
  const work=pts.map((p,i)=>({p,src:order[i]})),out=[];
  let guard=0;
  while(work.length>3&&guard++<10000){
    let cut=false;
    for(let i=0;i<work.length;i++){
      const a=work[(i+work.length-1)%work.length],b=work[i],c=work[(i+1)%work.length];
      const cross=(b.p.x-a.p.x)*(c.p.z-b.p.z)-(b.p.z-a.p.z)*(c.p.x-b.p.x);
      if(cross<=1e-10)continue;
      let inside=false;
      for(let j=0;j<work.length;j++){
        if(j===i||j===(i+1)%work.length||j===(i+work.length-1)%work.length)continue;
        if(pointInTri(work[j].p,a.p,b.p,c.p)){inside=true;break;}
      }
      if(inside)continue;
      out.push(a.src,b.src,c.src);work.splice(i,1);cut=true;break;
    }
    if(!cut)break;
  }
  if(work.length===3)out.push(work[0].src,work[1].src,work[2].src);
  if(!out.length){ for(let i=1;i<poly.length-1;i++)out.push(0,i,i+1); }
  return out;
}
function cleanLine(points=[]){
  const out=[];
  for(const p of points){
    if(!Number.isFinite(p?.x)||!Number.isFinite(p?.z))continue;
    const q={x:Number(p.x),z:Number(p.z)},prev=out.at(-1);
    if(!prev||Math.hypot(prev.x-q.x,prev.z-q.z)>.001)out.push(q);
  }
  return out;
}
function hexToFactor(hex){
  const s=hex.replace('#',''); const n=parseInt(s.length===3?s.split('').map(x=>x+x).join(''):s,16);
  return [((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255,1];
}
export class Bucket{
  constructor(name,color){this.name=name;this.color=color;this.positions=[];this.indices=[];}
  v(x,y,z){const i=this.positions.length/3;this.positions.push(round6(x),round6(y),round6(z));return i;}
  tri(a,b,c){this.indices.push(a,b,c);}
}
export function addBuilding(bucket,b,profile,seedRoot){
  const ring=openRing(b.footprint); if(ring.length<3)return {vertices:0,triangles:0};
  const minX=Math.min(...ring.map(p=>p.x)),maxX=Math.max(...ring.map(p=>p.x)),minZ=Math.min(...ring.map(p=>p.z)),maxZ=Math.max(...ring.map(p=>p.z));
  const minY=Math.max(0,Number(b.minHeightM)||0),maxY=Math.max(minY+.1,Number(b.heightM)||3),h=maxY-minY;
  const bounds={minY,maxY,h,cx:(minX+maxX)/2,cz:(minZ+maxZ)/2};
  const p=cityCartoonParams(b.id,profile,seedRoot),steps=Math.max(2,Math.floor(Number(profile.verticalSteps||4)));
  const start=bucket.positions.length/3,rings=[];
  for(let si=0;si<=steps;si++){
    const y=minY+h*si/steps,idx=[];
    for(const q of ring){const d=deformXZ(q.x,q.z,y,bounds,p);idx.push(bucket.v(d.x,y,d.z));}
    rings.push(idx);
  }
  for(let si=0;si<steps;si++)for(let i=0;i<ring.length;i++){
    const j=(i+1)%ring.length,a=rings[si][i],bb=rings[si][j],c=rings[si+1][i],d=rings[si+1][j];
    bucket.tri(a,c,bb);bucket.tri(bb,c,d);
  }
  const top=rings.at(-1),cap=earClip(ring); for(let i=0;i<cap.length;i+=3)bucket.tri(top[cap[i]],top[cap[i+1]],top[cap[i+2]]);
  return {vertices:bucket.positions.length/3-start,triangles:steps*ring.length*2+cap.length/3};
}
export function addRoad(bucket,road,y){
  const pts=cleanLine(road.centerline); if(pts.length<2)return {vertices:0,triangles:0};
  const half=Math.max(.02,Number(road.widthM||4)/2),verts=[];
  const dir=(a,b)=>{const dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz)||1;return{x:dx/l,z:dz/l};};
  const normal=d=>({x:-d.z,z:d.x});
  for(let i=0;i<pts.length;i++){
    const p=pts[i],d0=i>0?dir(pts[i-1],p):dir(p,pts[i+1]),d1=i<pts.length-1?dir(p,pts[i+1]):d0,n0=normal(d0),n1=normal(d1);
    let mx=n0.x+n1.x,mz=n0.z+n1.z,ml=Math.hypot(mx,mz);if(ml<1e-5){mx=n1.x;mz=n1.z;ml=1;}mx/=ml;mz/=ml;
    const denom=Math.max(.38,Math.abs(mx*n1.x+mz*n1.z)),miter=Math.min(half*1.8,half/denom);
    verts.push(bucket.v(p.x+mx*miter,y,p.z+mz*miter),bucket.v(p.x-mx*miter,y,p.z-mz*miter));
  }
  for(let i=0;i<pts.length-1;i++){const a=verts[i*2],b=a+1,c=verts[i*2+2],d=c+1;bucket.tri(a,c,b);bucket.tri(b,c,d);}
  return {vertices:pts.length*2,triangles:(pts.length-1)*2};
}
function pad4(n){return (n+3)&~3;}
export function buildGlb(buckets,extras){
  const materials=[],bufferViews=[],accessors=[],primitives=[],chunks=[];let offset=0;
  const pushChunk=(buf,target)=>{const aligned=pad4(offset);if(aligned>offset){chunks.push(Buffer.alloc(aligned-offset));offset=aligned;}const index=bufferViews.length;bufferViews.push({buffer:0,byteOffset:offset,byteLength:buf.length,target});chunks.push(buf);offset+=buf.length;return index;};
  for(const bucket of buckets.filter(b=>b.indices.length&&b.positions.length)){
    const pos=Buffer.allocUnsafe(bucket.positions.length*4);bucket.positions.forEach((v,i)=>pos.writeFloatLE(v,i*4));
    const ind=Buffer.allocUnsafe(bucket.indices.length*4);bucket.indices.forEach((v,i)=>ind.writeUInt32LE(v>>>0,i*4));
    const pv=pushChunk(pos,34962),iv=pushChunk(ind,34963);
    let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity;
    for(let i=0;i<bucket.positions.length;i+=3){const x=bucket.positions[i],y=bucket.positions[i+1],z=bucket.positions[i+2];if(x<minX)minX=x;if(y<minY)minY=y;if(z<minZ)minZ=z;if(x>maxX)maxX=x;if(y>maxY)maxY=y;if(z>maxZ)maxZ=z;}
    const pa=accessors.length;accessors.push({bufferView:pv,componentType:5126,count:bucket.positions.length/3,type:'VEC3',min:[minX,minY,minZ],max:[maxX,maxY,maxZ]});
    const ia=accessors.length;accessors.push({bufferView:iv,componentType:5125,count:bucket.indices.length,type:'SCALAR'});
    const mi=materials.length;materials.push({name:bucket.name,pbrMetallicRoughness:{baseColorFactor:hexToFactor(bucket.color),metallicFactor:0,roughnessFactor:.92},doubleSided:true,extensions:{KHR_materials_unlit:{}}});
    primitives.push({attributes:{POSITION:pa},indices:ia,material:mi,mode:4,extras:{role:bucket.name}});
  }
  const aligned=pad4(offset);if(aligned>offset){chunks.push(Buffer.alloc(aligned-offset));offset=aligned;}
  const bin=Buffer.concat(chunks);
  const gltf={asset:{version:'2.0',generator:'KFB World Zone Compiler 1.0.0',extras},extensionsUsed:['KHR_materials_unlit'],buffers:[{byteLength:bin.length}],bufferViews,accessors,materials,meshes:[{name:'KFB Cologne baked visual',primitives}],nodes:[{name:'cologne-dom-zentrum-v0',mesh:0,extras:{schema:'kfb.world-zone.visual-node.v1'}}],scenes:[{nodes:[0]}],scene:0};
  let json=Buffer.from(JSON.stringify(gltf));const jp=pad4(json.length)-json.length;if(jp)json=Buffer.concat([json,Buffer.alloc(jp,0x20)]);
  const total=12+8+json.length+8+bin.length,out=Buffer.allocUnsafe(total);let o=0;
  out.writeUInt32LE(0x46546c67,o);o+=4;out.writeUInt32LE(2,o);o+=4;out.writeUInt32LE(total,o);o+=4;
  out.writeUInt32LE(json.length,o);o+=4;out.writeUInt32LE(0x4E4F534A,o);o+=4;json.copy(out,o);o+=json.length;
  out.writeUInt32LE(bin.length,o);o+=4;out.writeUInt32LE(0x004E4942,o);o+=4;bin.copy(out,o);
  return out;
}
