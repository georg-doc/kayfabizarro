export const UPPER_LID_SCHEMA='kfb.upper-lid-volume/0.1-candidate';

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
  thickness=.24,
  roundness=.72,
  bulge=.42,
  clearance=.018,
  lonMax=1.26,
  topLat=1.34,
  lonSegments=52,
  latSegments=18
}={}){
  const R=radius;
  const innerR=R*(1+clearance);
  const cover01=clamp(cover,0,1);
  const thick=Math.max(.04,thickness);
  const round=clamp(roundness,0,1);
  const bul=clamp(bulge,0,1);

  // Neutral opening sits above eye centre. More cover drives the lower edge downward.
  const baseMargin=lerp(.30,-.76,cover01);

  const marginLat=(lon)=>{
    const side=clamp(lon/lonMax,-1,1);
    const centre=1-side*side;
    return baseMargin + slant*.34*side + curve*.30*centre;
  };

  const pos=[];
  const idx=[];
  const rows=latSegments+1;
  const cols=lonSegments+1;

  // Store corresponding inner/outer vertex ids so every perimeter can be sealed.
  const outerIds=Array.from({length:cols},()=>Array(rows));
  const innerIds=Array.from({length:cols},()=>Array(rows));

  function push(v){const id=pos.length/3;pos.push(v[0],v[1],v[2]);return id;}

  for(let j=0;j<=lonSegments;j++){
    const u=j/lonSegments;
    const lon=lerp(-lonMax,lonMax,u);
    const side=Math.abs((lon/lonMax));
    const sideSoft=1-side*side;
    const low=marginLat(lon);

    for(let i=0;i<=latSegments;i++){
      const v=i/latSegments;
      const lat=lerp(low,topLat,v);

      const ip=spherePoint(innerR,lat,lon);
      innerIds[j][i]=push(ip);

      const radialLen=Math.hypot(ip[0],ip[1],ip[2])||1;
      const nx=ip[0]/radialLen,ny=ip[1]/radialLen,nz=ip[2]/radialLen;

      // Substantial body thickness remains visible even right at the eye-opening margin.
      const bodyProfile=.88 + .32*Math.sin(Math.PI*(.12+.76*v))*Math.max(0,sideSoft);
      const t=R*thick*bodyProfile;

      let ox=ip[0]+nx*t;
      let oy=ip[1]+ny*t;
      let oz=ip[2]+nz*t;

      // The reference is a rounded hood/block, not a constant-radius spherical shell.
      // Blend the front toward a broad soft hood envelope while preserving wrap at the sides.
      const hoodZ=R*(1.035 + thick*.78 + bul*.11)
        - R*(.18-.05*round)*side*side
        - R*.055*(1-v)*(1-v);
      const hoodBlend=(.34 + .36*round)*Math.max(.20,sideSoft);
      oz=lerp(oz,hoodZ,hoodBlend);

      // Slightly widen and crown the cap so it reads as facial/clay mass.
      ox*=1+round*.045*Math.max(.2,sideSoft);
      oy+=R*round*.055*(.25+.75*v)*Math.max(.15,sideSoft);
      oz+=R*bul*.055*Math.max(0,sideSoft)*( .35 + .65*Math.sin(Math.PI*v) );

      outerIds[j][i]=push([ox,oy,oz]);
    }
  }

  // Outer/front surface.
  for(let j=0;j<lonSegments;j++)for(let i=0;i<latSegments;i++){
    const a=outerIds[j][i],b=outerIds[j+1][i],c=outerIds[j+1][i+1],d=outerIds[j][i+1];
    idx.push(a,b,d,b,c,d);
  }

  // Inner eyeball-conforming surface: reverse winding.
  for(let j=0;j<lonSegments;j++)for(let i=0;i<latSegments;i++){
    const a=innerIds[j][i],b=innerIds[j][i+1],c=innerIds[j+1][i+1],d=innerIds[j+1][i];
    idx.push(a,b,d,b,c,d);
  }

  function sealStrip(outerA,outerB,innerA,innerB){
    idx.push(outerA,innerA,outerB,outerB,innerA,innerB);
  }

  // Lower visible margin: this is the real crisp eye-facing lid edge.
  for(let j=0;j<lonSegments;j++){
    sealStrip(
      outerIds[j][0],outerIds[j+1][0],
      innerIds[j][0],innerIds[j+1][0]
    );
  }

  // Top/back perimeter.
  for(let j=0;j<lonSegments;j++){
    sealStrip(
      outerIds[j+1][latSegments],outerIds[j][latSegments],
      innerIds[j+1][latSegments],innerIds[j][latSegments]
    );
  }

  // Left/right side walls / canthi closure.
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

  // Useful proof metrics at the centre of the visible margin.
  const centreJ=Math.floor(lonSegments/2);
  const oi=outerIds[centreJ][0]*3, ii=innerIds[centreJ][0]*3;
  const arr=g.attributes.position.array;
  const marginThickness=Math.hypot(
    arr[oi]-arr[ii],
    arr[oi+1]-arr[ii+1],
    arr[oi+2]-arr[ii+2]
  );

  g.userData={
    schema:UPPER_LID_SCHEMA,
    closedVolume:true,
    realOcclusionMargin:true,
    outerSurface:'rounded-hood',
    innerSurface:'eyeball-conforming',
    cover:cover01,slant,curve,thickness:thick,roundness:round,bulge:bul,
    marginThickness
  };
  return g;
}

export default buildUpperLidVolumeGeometry;
