// Extracted unchanged WB2 pinned ZyFou MIT cpuNoise/seedDomain subset. Source: wb2d-app.js blob 74f32.
function fract(v){return v-Math.floor(v)}
function hash12(px,py){
  let p3x=fract(px*0.1031),p3y=fract(py*0.1031),p3z=p3x;
  const d=p3x*(p3y+33.33)+p3y*(p3z+33.33)+p3z*(p3x+33.33);
  p3x+=d;p3y+=d;
  return fract((p3x+p3y)*(p3z+d));
}
function vnoise2(px,py){
  const ix=Math.floor(px),iy=Math.floor(py),fx=px-ix,fy=py-iy;
  const ux=fx*fx*fx*(fx*(fx*6-15)+10),uy=fy*fy*fy*(fy*(fy*6-15)+10);
  const a=hash12(ix,iy),b=hash12(ix+1,iy),c=hash12(ix,iy+1),d=hash12(ix+1,iy+1);
  const top=a+(b-a)*ux,bot=c+(d-c)*ux;
  return top+(bot-top)*uy;
}
function rot2(x,y){return [0.80*x+0.60*y,-0.60*x+0.80*y]}
function fbm2(px,py,octaves,pers,lac){
  let amp=.5,sum=0,norm=0,x=px,y=py;
  const n=Math.max(1,Math.min(9,octaves|0));
  for(let i=0;i<n;i++){
    sum+=amp*vnoise2(x,y);norm+=amp;amp*=pers;
    const r=rot2(x,y);x=r[0]*lac;y=r[1]*lac;
  }
  return sum/Math.max(norm,1e-4);
}
function seedDomainOffset(value){
  const numeric=Number(value);if(!Number.isFinite(numeric))return 0;
  const seed=Math.trunc(numeric);if(seed===0)return 0;
  let hash=seed>>>0;
  hash=Math.imul(hash^(hash>>>16),0x7feb352d);
  hash=Math.imul(hash^(hash>>>15),0x846ca68b);
  hash=(hash^(hash>>>16))>>>0;
  return Math.fround((hash/0x100000000)*2048-1024);
}

export {fbm2, seedDomainOffset};
