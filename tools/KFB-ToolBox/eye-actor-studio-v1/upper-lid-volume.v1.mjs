export const UPPER_LID_SCHEMA='kfb.upper-lid-volume/0.2-candidate';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;

function spherePoint(R,lat,lon){
  const cl=Math.cos(lat);
  return [R*Math.sin(lon)*cl,R*Math.sin(lat),R*Math.cos(lon)*cl];
}

export function buildUpperLidVolumeGeometry(THREE,{
  radius=1,
  cover=.16,
  slant=0,
  curve=0,
  thickness=.20,
  roundness=.72,
  bulge=.42,
  clearance=.018,
  lonMax=1.18,
  lonSegments=52,
  latSegments=16
}={}){
  const R=radius;
  const innerR=R*(1+clearance);
  const cover01=clamp(cover,0,1);
  const thick=Math.max(.04,thickness);
  const round=clamp(roundness,0,1);
  const bul=clamp(bulge,0,1);

  // Reference logic: compact upper-lid pad, not a hemisphere-to-pole cap.
  // Neutral lower edge sits above the eye centre; more cover moves it down.
  const baseMargin=lerp(.23,-.62,cover01);

  const marginLat=(lon)=>{
    const side=clamp(lon/lonMax,-1,1);
    const centre=1-side*side;
    return baseMargin + slant*.30*side + curve*.25*centre;
  };

  const pos=[];
  const idx=[];
  const rows=latSegments+1;
  const cols=lonSegments+1;
  const outerIds=Array.from({length:cols},()=>Array(rows));
  const innerIds=Array.from({length:cols},()=>Array(rows));

  function push(v){const id=pos.length/3;pos.push(v[0],v[1],v[2]);return id;}

  for(let j=0;j<=lonSegments;j++){
    const u=j/lonSegments;
    const lon=lerp(-lonMax,lonMax,u);
    const side=Math.abs(lon/lonMax);
    const sideSoft=Math.max(0,1-side*side);
    const low=marginLat(lon);

    // Compact pad height. Sides taper shorter to create soft rounded canthi.
    const centreSpan=.48 + round*.10;
    const span=centreSpan*(.72+.28*sideSoft);
    const high=clamp(low+span,-.05,1.12);

    for(let i=0;i<=latSegments;i++){
      const v=i/latSegments;
      const smooth=v*v*(3-2*v);
      const lat=lerp(low,high,smooth);

      const ip=spherePoint(innerR,lat,lon);
      innerIds[j][i]=push(ip);

      const radialLen=Math.hypot(ip[0],ip[1],ip[2])||1;
      const nx=ip[0]/radialLen,ny=ip[1]/radialLen,nz=ip[2]/radialLen;

      // Thick clay body, kept substantial at the opening edge.
      const crown=Math.sin(Math.PI*v);
      const bodyProfile=.92 + .18*crown*sideSoft;
      const t=R*thick*bodyProfile;

      let ox=ip[0]+nx*t;
      let oy=ip[1]+ny*t;
      let oz=ip[2]+nz*t;

      // Soft molded fullness, but no giant hood/dome.
      ox*=1+round*.018*sideSoft;
      oy+=R*round*.018*crown*sideSoft;
      oz+=R*bul*.055*(.35+.65*crown)*sideSoft;

      // Slight front-plane coherence makes the body read as one pad rather than shell flakes.
      const frontTarget=R*(1.015 + thick*.50 + bul*.035) - R*.08*side*side;
      const blend=(.10+.12*round)*sideSoft;
      oz=lerp(oz,frontTarget,blend);

      outerIds[j][i]=push([ox,oy,oz]);
    }
  }

  for(let j=0;j<lonSegments;j++)for(let i=0;i<latSegments;i++){
    const a=outerIds[j][i],b=outerIds[j+1][i],c=outerIds[j+1][i+1],d=outerIds[j][i+1];
    idx.push(a,b,d,b,c,d);
  }

  for(let j=0;j<lonSegments;j++)for(let i=0;i<latSegments;i++){
    const a=innerIds[j][i],b=innerIds[j][i+1],c=innerIds[j+1][i+1],d=innerIds[j+1][i];
    idx.push(a,b,d,b,c,d);
  }

  function sealStrip(outerA,outerB,innerA,innerB){
    idx.push(outerA,innerA,outerB,outerB,innerA,innerB);
  }

  // Real visible lower margin: part of the closed lid volume, not a separate line/tube.
  for(let j=0;j<lonSegments;j++){
    sealStrip(
      outerIds[j][0],outerIds[j+1][0],
      innerIds[j][0],innerIds[j+1][0]
    );
  }

  // Upper/back edge closes the compact pad.
  for(let j=0;j<lonSegments;j++){
    sealStrip(
      outerIds[j+1][latSegments],outerIds[j][latSegments],
      innerIds[j+1][latSegments],innerIds[j][latSegments]
    );
  }

  // Soft side/end mass / canthi closure.
  for(let i=0;i<latSegments;i++){
    sealStrip(
      outerIds[0][i+1],outerIds[0][i],
      innerIds[0][i+1],innerIds[0][i]
    );
    sealStrip(
      outerIds[lonSegments][i],outerIds[lonSegments][i+1],
      innerIds[lonSegments][i],innerIds[lonSegments][i+1]
    );
  }

  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.computeBoundingBox();
  g.computeBoundingSphere();

  const centreJ=Math.floor(lonSegments/2);
  const oi=outerIds[centreJ][0]*3,ii=innerIds[centreJ][0]*3;
  const arr=g.attributes.position.array;
  const marginThickness=Math.hypot(
    arr[oi]-arr[ii],
    arr[oi+1]-arr[ii+1],
    arr[oi+2]-arr[ii+2]
  );

  const boxSize=g.boundingBox.getSize(new THREE.Vector3());

  g.userData={
    schema:UPPER_LID_SCHEMA,
    closedVolume:true,
    realOcclusionMargin:true,
    outerSurface:'compact-rounded-pad',
    innerSurface:'eyeball-conforming',
    cover:cover01,slant,curve,thickness:thick,roundness:round,bulge:bul,
    marginThickness,
    size:[boxSize.x,boxSize.y,boxSize.z],
    designCorrection:'localized upper-lid mass; no hemisphere helmet'
  };
  return g;
}

export default buildUpperLidVolumeGeometry;
