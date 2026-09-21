export const UPPER_LID_SCHEMA='kfb.upper-lid-volume/0.3-candidate';

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
  clearance=.016,
  lonMax=1.04,
  lonSegments=56,
  latSegments=18
}={}){
  const R=radius;
  const innerR=R*(1+clearance);
  const cover01=clamp(cover,0,1);
  const thick=Math.max(.04,thickness);
  const round=clamp(roundness,0,1);
  const bul=clamp(bulge,0,1);

  // Reference: compact individual upper-lid pad. The lower edge is the eye opening.
  const baseMargin=lerp(.24,-.58,cover01);

  const marginLat=(lon)=>{
    const side=clamp(lon/lonMax,-1,1);
    const centre=1-side*side;
    const endLift=.08*Math.pow(Math.abs(side),4);
    return baseMargin + slant*.28*side + curve*.24*centre + endLift;
  };

  const pos=[],idx=[];
  const rows=latSegments+1,cols=lonSegments+1;
  const outerIds=Array.from({length:cols},()=>Array(rows));
  const innerIds=Array.from({length:cols},()=>Array(rows));

  function push(v){const id=pos.length/3;pos.push(v[0],v[1],v[2]);return id;}

  for(let j=0;j<=lonSegments;j++){
    const u=j/lonSegments;
    const lon=lerp(-lonMax,lonMax,u);
    const side=Math.abs(lon/lonMax);
    const sideSoft=Math.max(0,1-side*side);
    const low=marginLat(lon);

    // Strong side taper creates rounded canthi instead of a rectangular visor.
    const sideEnvelope=.26+.74*Math.pow(sideSoft,.62);
    const centreSpan=.44 + round*.09;
    const span=centreSpan*sideEnvelope;
    const high=clamp(low+span,-.03,1.03);

    for(let i=0;i<=latSegments;i++){
      const v=i/latSegments;
      const smooth=v*v*(3-2*v);
      const lat=lerp(low,high,smooth);

      const ip=spherePoint(innerR,lat,lon);
      innerIds[j][i]=push(ip);

      const radialLen=Math.hypot(ip[0],ip[1],ip[2])||1;
      const nx=ip[0]/radialLen,ny=ip[1]/radialLen,nz=ip[2]/radialLen;

      const crown=Math.sin(Math.PI*v);
      // Substantial central body, naturally tapering into the side canthi.
      const sideThickness=.30+.70*Math.pow(sideSoft,.52);
      const verticalBody=.90+.16*crown;
      const t=R*thick*sideThickness*verticalBody;

      let ox=ip[0]+nx*t;
      let oy=ip[1]+ny*t;
      let oz=ip[2]+nz*t;

      // Only a gentle local clay fullness. No planar hood/shelf projection.
      const localFullness=sideThickness*crown;
      oy+=R*round*.018*localFullness;
      oz+=R*bul*.045*(.30+.70*crown)*sideThickness;

      outerIds[j][i]=push([ox,oy,oz]);
    }
  }

  // Outer clay surface.
  for(let j=0;j<lonSegments;j++)for(let i=0;i<latSegments;i++){
    const a=outerIds[j][i],b=outerIds[j+1][i],c=outerIds[j+1][i+1],d=outerIds[j][i+1];
    idx.push(a,b,d,b,c,d);
  }

  // Inner surface follows the eyeball; reversed winding.
  for(let j=0;j<lonSegments;j++)for(let i=0;i<latSegments;i++){
    const a=innerIds[j][i],b=innerIds[j][i+1],c=innerIds[j+1][i+1],d=innerIds[j+1][i];
    idx.push(a,b,d,b,c,d);
  }

  function sealStrip(outerA,outerB,innerA,innerB){
    idx.push(outerA,innerA,outerB,outerB,innerA,innerB);
  }

  // Crisp eye-facing opening edge, physically part of the closed lid volume.
  for(let j=0;j<lonSegments;j++){
    sealStrip(
      outerIds[j][0],outerIds[j+1][0],
      innerIds[j][0],innerIds[j+1][0]
    );
  }

  // Upper/back closure of the pad.
  for(let j=0;j<lonSegments;j++){
    sealStrip(
      outerIds[j+1][latSegments],outerIds[j][latSegments],
      innerIds[j+1][latSegments],innerIds[j][latSegments]
    );
  }

  // Closed rounded canthi / side mass.
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
    outerSurface:'rounded-eye-hugging-pad',
    innerSurface:'eyeball-conforming',
    cover:cover01,slant,curve,thickness:thick,roundness:round,bulge:bul,
    marginThickness,
    size:[boxSize.x,boxSize.y,boxSize.z],
    designCorrection:'eye-hugging tapered clay pad; no helmet and no visor'
  };
  return g;
}

export default buildUpperLidVolumeGeometry;
