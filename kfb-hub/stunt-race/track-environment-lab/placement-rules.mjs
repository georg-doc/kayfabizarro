// Race-local visual placement only. No contact, route editing or shared A0 additions.
export const TAU=Math.PI*2;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};
export function hash(text){let h=2166136261;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0')}
export function rng(seed,stream=''){let s=parseInt(hash(`${seed}:${stream}`),16);return ()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296}}
export function makeRouteQuery(samples){
  if(samples.length<16)throw Error('Missing accepted Race route samples');
  const segments=samples.map((a,i)=>{const b=samples[(i+1)%samples.length];return {a,b,dx:b.x-a.x,dz:b.z-a.z,len2:(b.x-a.x)**2+(b.z-a.z)**2}});
  const center=samples.reduce((c,p)=>({x:c.x+p.x/samples.length,z:c.z+p.z/samples.length}),{x:0,z:0});
  function nearest(x,z){let best=Infinity,result;for(const {a,b,dx,dz,len2} of segments){const t=clamp(((x-a.x)*dx+(z-a.z)*dz)/(len2||1),0,1),px=a.x+dx*t,pz=a.z+dz*t,d2=(x-px)**2+(z-pz)**2;if(d2<best){best=d2;const ry=a.ry+(b.ry-a.ry)*t,rx=a.rx+(b.rx-a.rx)*t,rz=a.rz+(b.rz-a.rz)*t;result={x:px,z:pz,y:a.y+(b.y-a.y)*t,half:Math.max(a.half,b.half),d:Math.sqrt(d2),lateral:((x-px)*rx+(z-pz)*rz)/Math.max(.1,rx*rx+rz*rz),ry}}}return result}
  // A capsule test against EVERY route segment, not just the nominal placement station.
  function clear(x,z,radius,setback=3){for(const {a,b,dx,dz,len2} of segments){const t=clamp(((x-a.x)*dx+(z-a.z)*dz)/(len2||1),0,1);if(Math.hypot(x-a.x-dx*t,z-a.z-dz*t)<radius+Math.max(a.half,b.half)+setback)return false}return true}
  return {nearest,clear,center};
}
export function makeTerrain(samples,query,seed,recipe){
  const size=560,n=141,step=size/(n-1),origin={x:query.center.x-size/2,z:query.center.z-size/2},heights=new Float32Array(n*n),random=rng(seed,'terrain'),phase=random()*TAU;
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){
    const x=origin.x+i*step,z=origin.z+j*step,q=query.nearest(x,z),d=q.d-q.half;
    const low=recipe.ground.base+Math.sin(x*.022+phase)*recipe.ground.amplitude+Math.cos(z*.027-phase)*recipe.ground.amplitude*.7;
    const shoulder=q.y+q.ry*clamp(q.lateral,-q.half-2,q.half+2)-1.1;
    heights[j*n+i]=shoulder*(1-smooth(2,29,d))+low*smooth(2,29,d);
  }
  function cell(x,z){const xx=clamp((x-origin.x)/step,0,n-1.00001),zz=clamp((z-origin.z)/step,0,n-1.00001),i=Math.floor(xx),j=Math.floor(zz),u=xx-i,v=zz-j,a=j*n+i,b=a+1,d=a+n,c=d+1;return u+v<=1?[[a,1-u-v],[b,u],[d,v]]:[[b,1-v],[d,1-u],[c,u+v-1]]}
  const height=(x,z)=>cell(x,z).reduce((sum,[i,w])=>sum+heights[i]*w,0);
  // Lower ONLY terrain vertices; never touch the Race mesh. Test the actual rendered triangles.
  function protectRoad(){
  for(let pass=0;pass<4;pass++)for(const q of samples)for(const l of [-1,-.75,-.5,0,.5,.75,1]){
    const x=q.x+q.rx*q.half*l,z=q.z+q.rz*q.half*l,target=q.y+q.ry*q.half*l-.68,excess=height(x,z)-target;
    if(excess>0)for(const [i] of cell(x,z))heights[i]-=excess+.035;
  }
  }
  protectRoad();
  function grade(cx,cz,radius,y){for(let j=0;j<n;j++)for(let i=0;i<n;i++){const d=Math.hypot(origin.x+i*step-cx,origin.z+j*step-cz);if(d<radius){const blend=1-smooth(radius-3,radius,d);heights[j*n+i]=heights[j*n+i]*(1-blend)+y*blend}}protectRoad()}
  function gap(){let minRoadGap=Infinity;for(const q of samples)for(const l of [-1,-.75,-.5,0,.5,.75,1])minRoadGap=Math.min(minRoadGap,q.y+q.ry*q.half*l-height(q.x+q.rx*q.half*l,q.z+q.rz*q.half*l));
  return minRoadGap;}
  return {size,n,step,origin,heights,height,grade,get minRoadGap(){return gap()}};
}
