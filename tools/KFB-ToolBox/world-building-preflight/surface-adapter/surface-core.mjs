export const SURFACE_SCHEMA = 'kfb.surface-adapter/0.1-candidate';
export const SURFACE_IDS = Object.freeze(['FLAT','SPHERE','TORUS']);

const TAU = Math.PI * 2;
const EPS = 1e-12;
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
export const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const length=(a)=>Math.hypot(a[0],a[1],a[2]);
export const normalize=(a)=>{ const n=length(a); if(!(n>EPS)) throw new Error('zero-length vector'); return [a[0]/n,a[1]/n,a[2]/n]; };
export const finite3=(a)=>Array.isArray(a)&&a.length===3&&a.every(Number.isFinite);
const wrap=(a)=>{ let x=(a+Math.PI)%TAU; if(x<0)x+=TAU; return x-Math.PI; };

function frame(position, normal, tangentU, tangentV, surfaceId, address){
  const n=normalize(normal), u=normalize(tangentU), v=normalize(tangentV);
  return Object.freeze({
    surfaceId,
    address:Object.freeze({...address}),
    position:Object.freeze([...position]),
    normal:Object.freeze(n),
    tangentU:Object.freeze(u),
    tangentV:Object.freeze(v),
    handedness:Math.sign(dot(cross(u,n),v))||0
  });
}

function flatAdapter(){
  return Object.freeze({
    id:'FLAT',
    schema:SURFACE_SCHEMA,
    addressFromLogical(logical){ return {u:Number(logical[0]),v:Number(logical[1])}; },
    logicalFromAddress(address){ return [Number(address.u),Number(address.v)]; },
    poseAt(address,heightOffset=0){
      const u=Number(address.u), v=Number(address.v), h=Number(heightOffset)||0;
      return frame([u,h,v],[0,1,0],[1,0,0],[0,0,1],'FLAT',{u,v});
    },
    project(world){ const address={u:Number(world[0]),v:Number(world[2])}; return {address,logical:this.logicalFromAddress(address)}; }
  });
}

function sphereAdapter({radius=12,anchorLon=0.35,anchorLat=0.55}={}){
  const R=Number(radius), lon0=Number(anchorLon), lat0=Number(anchorLat);
  if(!(R>0)) throw new Error('sphere radius must be > 0');
  return Object.freeze({
    id:'SPHERE', schema:SURFACE_SCHEMA, radius:R, anchorLon:lon0, anchorLat:lat0,
    addressFromLogical(logical){ return {lon:lon0+Number(logical[0])/R,lat:lat0+Number(logical[1])/R}; },
    logicalFromAddress(address){ return [wrap(Number(address.lon)-lon0)*R,(Number(address.lat)-lat0)*R]; },
    poseAt(address,heightOffset=0){
      const lon=Number(address.lon), lat=Number(address.lat), rr=R+(Number(heightOffset)||0);
      const cl=Math.cos(lat), sl=Math.sin(lat), co=Math.cos(lon), so=Math.sin(lon);
      const n=[cl*co,sl,cl*so];
      const u=[-so,0,co];
      const v=[-sl*co,cl,-sl*so];
      return frame(mul(n,rr),n,u,v,'SPHERE',{lon,lat});
    },
    project(world){
      const p=[Number(world[0]),Number(world[1]),Number(world[2])];
      const r=length(p); if(!(r>EPS)) throw new Error('cannot project sphere origin');
      const address={lon:Math.atan2(p[2],p[0]),lat:Math.asin(Math.max(-1,Math.min(1,p[1]/r)))};
      return {address,logical:this.logicalFromAddress(address)};
    }
  });
}

function torusAdapter({majorRadius=12,minorRadius=5,anchorU=-0.45,anchorV=0.42}={}){
  const R=Number(majorRadius), r=Number(minorRadius), u0=Number(anchorU), v0=Number(anchorV);
  if(!(R>r&&r>0)) throw new Error('torus requires majorRadius > minorRadius > 0');
  return Object.freeze({
    id:'TORUS', schema:SURFACE_SCHEMA, majorRadius:R, minorRadius:r, anchorU:u0, anchorV:v0,
    addressFromLogical(logical){ return {u:u0+Number(logical[0])/R,v:v0+Number(logical[1])/r}; },
    logicalFromAddress(address){ return [wrap(Number(address.u)-u0)*R,wrap(Number(address.v)-v0)*r]; },
    poseAt(address,heightOffset=0){
      const u=Number(address.u), v=Number(address.v), h=Number(heightOffset)||0;
      const cu=Math.cos(u), su=Math.sin(u), cv=Math.cos(v), sv=Math.sin(v);
      const n=[cu*cv,sv,su*cv];
      const center=[R*cu,0,R*su];
      const p=add(center,mul(n,r+h));
      const tu=[-su,0,cu];
      const tv=[-cu*sv,cv,-su*sv];
      return frame(p,n,tu,tv,'TORUS',{u,v});
    },
    project(world){
      const x=Number(world[0]),y=Number(world[1]),z=Number(world[2]);
      const u=Math.atan2(z,x); const rho=Math.hypot(x,z)-R; const v=Math.atan2(y,rho);
      const address={u,v}; return {address,logical:this.logicalFromAddress(address)};
    }
  });
}

export function createSurfaceAdapter(id,options={}){
  if(id==='FLAT') return flatAdapter(options);
  if(id==='SPHERE') return sphereAdapter(options);
  if(id==='TORUS') return torusAdapter(options);
  throw new Error('unknown surface '+id);
}

export function logicalPose(adapter,logical,heightOffset=0){
  const address=adapter.addressFromLogical(logical);
  return adapter.poseAt(address,heightOffset);
}

export function frameDiagnostics(f){
  return Object.freeze({
    finite:[f.position,f.normal,f.tangentU,f.tangentV].every(finite3),
    normalLength:length(f.normal),uLength:length(f.tangentU),vLength:length(f.tangentV),
    nu:dot(f.normal,f.tangentU),nv:dot(f.normal,f.tangentV),uv:dot(f.tangentU,f.tangentV),
    handedness:f.handedness
  });
}

export function roundTripError(adapter,logical){
  const address=adapter.addressFromLogical(logical);
  const back=adapter.logicalFromAddress(address);
  return Math.hypot(back[0]-logical[0],back[1]-logical[1]);
}

export function surfaceRing(adapter,center,radius,segments=64,heightOffset=0.12){
  const out=[];
  for(let i=0;i<segments;i++){
    const a=TAU*i/segments;
    const logical=[center[0]+Math.cos(a)*radius,center[1]+Math.sin(a)*radius];
    out.push(logicalPose(adapter,logical,heightOffset).position);
  }
  return out;
}
