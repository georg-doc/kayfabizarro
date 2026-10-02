function cloneAsset(asset){
  return {
    ...asset,
    bounds:{min:[...asset.bounds.min],max:[...asset.bounds.max],size:[...asset.bounds.size]},
    parts:asset.parts.map(p=>({...p,positions:[...p.positions]}))
  };
}
function boundsOf(parts){
  const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
  for(const part of parts)for(let i=0;i<part.positions.length;i++){
    const k=i%3;lo[k]=Math.min(lo[k],part.positions[i]);hi[k]=Math.max(hi[k],part.positions[i]);
  }
  return {min:lo,max:hi,size:hi.map((v,i)=>v-lo[i])};
}

export function removeVisibleBaseAndGround(asset,opts={}){
  const out=cloneAsset(asset);
  const reject=new Set(opts.rejectParts||['foundation']);
  out.parts=out.parts.filter(p=>!reject.has(p.name));
  if(!out.parts.length)throw Error('Grounded landmark lost all parts');
  const before=boundsOf(out.parts),drop=before.min[1]-Number(opts.targetY??0);
  for(const part of out.parts)for(let i=1;i<part.positions.length;i+=3)part.positions[i]-=drop;
  out.bounds=boundsOf(out.parts);
  out.grounding={
    schema:'kfb.landmark-grounding/0.1',
    visibleBase:false,
    removedParts:[...reject],
    verticalDropM:drop,
    targetY:Number(opts.targetY??0),
    terrainOwnsGround:true
  };
  return out;
}

export function footprintFromBounds(asset,position={x:0,z:0},yaw=0,margin=0){
  const w=asset.bounds.size[0]+margin*2,d=asset.bounds.size[2]+margin*2;
  const cx=position.x+(asset.bounds.min[0]+asset.bounds.max[0])/2;
  const cz=position.z+(asset.bounds.min[2]+asset.bounds.max[2])/2;
  const hw=w/2,hd=d/2,c=Math.cos(yaw),s=Math.sin(yaw);
  return [[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]].map(([x,z])=>({x:cx+x*c-z*s,z:cz+x*s+z*c}));
}
