// KFB Eye Actor Studio PR #159 — isolated geometry candidate, NOT a second EyeRig owner.
// Source-derived from clay-lid.v1.mjs (blob 30201095b2f686ba3a78b8512e7cee37d07e30b7).
// Shared eye sphere and shared contact seam; preserve all existing EyeRig v6 profiles.
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const KFB_THIN_CLAY_SCHEMA='kfb.thin-clay-lid/0.1-candidate';
export function thinClayLidMeshData({radius=1,upper=true,blink=0,thickness=.085,roundness=.025,
  innerOffset=.006,overlap=.028,neutralUpper=1.14,neutralLower=2.00,
  edgeCurve=.035,slant=0,lonSegments=80,capSegments=16,bevelSegments=7}={}){
  const b=clamp(blink,0,1),t=clamp(thickness,.035,.23),rInner=radius*(1+Math.max(.002,innerOffset));
  const rOuter=rInner+radius*t;
  const baseRound=clamp(roundness,.004,Math.min(.08,t*.65))*radius;
  const boundary=upper?neutralUpper+(Math.PI/2+overlap-neutralUpper)*b:neutralLower+(Math.PI/2-overlap-neutralLower)*b;
  const positions=[],indices=[];
  const append=(r,theta,phi)=>{const s=Math.sin(theta),i=positions.length/3;
    positions.push(r*s*Math.cos(phi),r*Math.cos(theta),r*s*Math.sin(phi));return i;};
  const outer=[],lip=[],inner=[];
  for(let j=0;j<lonSegments;j++){
    const phi=j/lonSegments*2*Math.PI,front=Math.max(0,Math.sin(phi));
    const frontBlend=front*front*(3-2*front);
    const side=1-frontBlend;
    const taper=.23+.77*frontBlend;
    const localOuter=rInner+radius*t*taper;
    const cornerRad=baseRound*taper/localOuter;
    const shape=front*(edgeCurve*Math.cos(2*(phi-Math.PI/2)) + slant*Math.cos(phi));
    const margin=clamp(boundary+(Math.PI/2-boundary)*side+shape,.14,Math.PI-.14);
    const endOuter=margin+(upper?-cornerRad:cornerRad);
    const sectionOuter=[],sectionLip=[],sectionInner=[];
    for(let k=0;k<=capSegments;k++){
      const u=k/capSegments,theta=upper?endOuter*u:endOuter+(Math.PI-endOuter)*u;
      sectionOuter.push(append(localOuter,theta,phi));
    }
    // Convex rounded lip is integral to the clay volume, not a separate tube.
    for(let k=0;k<=bevelSegments;k++){
      const a=Math.PI*k/bevelSegments,blend=(1+Math.cos(a))/2;
      sectionLip.push(append(rInner+(localOuter-rInner)*blend,margin+(upper?-cornerRad:cornerRad)*blend,phi));
    }
    for(let k=0;k<=capSegments;k++){
      const u=k/capSegments,theta=upper?margin*u:margin+(Math.PI-margin)*u;
      sectionInner.push(append(rInner,theta,phi));
    }
    outer.push(sectionOuter);lip.push(sectionLip);inner.push(sectionInner);
  }
  const rings=[];
  for(let j=0;j<lonSegments;j++){
    const os=upper?[...outer[j]]:[...outer[j]].reverse();
    const is=upper?[...inner[j]].reverse():[...inner[j]];
    const ls=[...lip[j]].slice(1,-1);
    rings.push([...os,...ls,...is]);
  }
  const N=rings[0].length;
  for(let j=0;j<lonSegments;j++)for(let k=0;k<N;k++){
    const k1=(k+1)%N,j1=(j+1)%lonSegments,A=rings[j][k],B=rings[j1][k],C=rings[j1][k1],D=rings[j][k1];
    if(upper)indices.push(A,B,D,B,C,D);
    else indices.push(A,D,B,B,D,C); // outward cap / inward contact surface
  }
  // Cyclic longitude indices close both shells at the rear seam.
  return {positions:new Float32Array(positions),indices:new Uint32Array(indices),schema:KFB_THIN_CLAY_SCHEMA,
    meta:{upper,blink:b,thickness:t,roundness,innerOffset,boundary,rInner,rOuter,segments:[lonSegments,N]}};
}
export function thinClayLidGeometry(THREE,options={}){
 const {positions,indices,meta}=thinClayLidMeshData(options),g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.BufferAttribute(positions,3));g.setIndex(Array.from(indices));g.computeVertexNormals();g.computeBoundingSphere();
 g.userData={schema:KFB_THIN_CLAY_SCHEMA,sharedSphere:true,closedVolume:true,realOcclusion:true,...meta};return g;
}
