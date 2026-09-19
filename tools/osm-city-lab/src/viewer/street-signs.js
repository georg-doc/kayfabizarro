import { stableHash, mulberry32 } from '../style/cartoon-city.js';

function clean(points){
  const out=[];
  for(const p of points||[]){
    if(!Number.isFinite(p?.x)||!Number.isFinite(p?.z))continue;
    const prev=out[out.length-1];
    if(!prev||Math.hypot(prev.x-p.x,prev.z-p.z)>.001)out.push({x:+p.x,z:+p.z});
  }
  return out;
}

function lineLength(line){
  let n=0;
  for(let i=1;i<line.length;i++)n+=Math.hypot(line[i].x-line[i-1].x,line[i].z-line[i-1].z);
  return n;
}

function representative(road){
  const line=clean(road.centerline);
  if(line.length<2)return null;
  let total=0;
  const lengths=[];
  for(let i=1;i<line.length;i++){
    const l=Math.hypot(line[i].x-line[i-1].x,line[i].z-line[i-1].z);
    lengths.push(l); total+=l;
  }
  let target=total*.5,acc=0;
  for(let i=0;i<lengths.length;i++){
    const l=lengths[i];
    if(acc+l>=target){
      const t=l>0?(target-acc)/l:.5;
      const a=line[i],b=line[i+1];
      const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz)||1;
      return {
        x:a.x+dx*t,
        z:a.z+dz*t,
        tangent:{x:dx/len,z:dz/len},
        lengthM:total
      };
    }
    acc+=l;
  }
  return null;
}

function openPoly(poly){
  const pts=(poly||[]).map(p=>({x:+p.x,z:+p.z})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.z));
  if(pts.length>1&&Math.hypot(pts[0].x-pts.at(-1).x,pts[0].z-pts.at(-1).z)<.001)pts.pop();
  return pts;
}
function polyBounds(poly){
  const xs=poly.map(p=>p.x),zs=poly.map(p=>p.z);
  return {minX:Math.min(...xs),maxX:Math.max(...xs),minZ:Math.min(...zs),maxZ:Math.max(...zs)};
}
function pointSegDistance(p,a,b){
  const dx=b.x-a.x,dz=b.z-a.z,l2=dx*dx+dz*dz||1;
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/l2));
  return Math.hypot(p.x-(a.x+dx*t),p.z-(a.z+dz*t));
}
function inside(p,poly){
  let hit=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];
    const cross=((a.z>p.z)!==(b.z>p.z))&&(p.x<(b.x-a.x)*(p.z-a.z)/((b.z-a.z)||1e-12)+a.x);
    if(cross)hit=!hit;
  }
  return hit;
}
function pointPolyDistance(p,poly){
  if(inside(p,poly))return 0;
  let best=Infinity;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++)best=Math.min(best,pointSegDistance(p,poly[j],poly[i]));
  return best;
}
function prepareBuildings(buildings){
  return (buildings||[]).map(b=>{
    const poly=openPoly(b.footprint);
    return poly.length>=3?{poly,bounds:polyBounds(poly),sourceId:b.id}:null;
  }).filter(Boolean);
}
function buildingDistance(p,prepared){
  let best=Infinity;
  for(const b of prepared){
    const q=b.bounds;
    const dx=p.x<q.minX?q.minX-p.x:p.x>q.maxX?p.x-q.maxX:0;
    const dz=p.z<q.minZ?q.minZ-p.z:p.z>q.maxZ?p.z-q.maxZ:0;
    const boxD=Math.hypot(dx,dz);
    if(boxD>best)continue;
    best=Math.min(best,pointPolyDistance(p,b.poly));
  }
  return best;
}

export function streetSignCandidates(roads,cfg={},seedRoot='kfb-city',buildings=[]){
  const maxSigns=Math.max(1,Number(cfg.maxSigns??28));
  const minLength=Number(cfg.minRoadLengthM??16);
  const preparedBuildings=prepareBuildings(buildings);
  const groups=new Map();

  for(const road of roads||[]){
    if(!road.driveable)continue;
    const name=String(road.osm?.tags?.name||'').trim();
    if(!name)continue;
    const rep=representative(road);
    if(!rep||rep.lengthM<minLength)continue;
    const old=groups.get(name);
    if(!old||rep.lengthM>old.rep.lengthM)groups.set(name,{name,road,rep});
  }

  const ranked=[...groups.values()].map(e=>{
    const jitter=mulberry32(stableHash(seedRoot+':sign:'+e.name))();
    return {...e,score:e.rep.lengthM*(.9+jitter*.2)};
  }).sort((a,b)=>b.score-a.score).slice(0,maxSigns);

  const minClearance=Math.max(.08,Number(cfg.minBuildingClearanceM??.28));
  const maxSideOffset=Math.max(.35,Number(cfg.sideOffsetM??1.25));
  const offsets=[.35,.5,.7,.9,maxSideOffset].filter((v,i,a)=>v<=maxSideOffset+.001&&a.indexOf(v)===i);
  const placed=[];
  for(const e of ranked){
    const nx=-e.rep.tangent.z,nz=e.rep.tangent.x;
    const roadHalf=Number(e.road.widthM||5)/2;
    const options=[];
    for(const side of [-1,1]){
      for(const extra of offsets){
        const edgeOffset=roadHalf+extra;
        const p={x:e.rep.x+nx*edgeOffset*side,z:e.rep.z+nz*edgeOffset*side};
        options.push({side,extra,p,clearance:buildingDistance(p,preparedBuildings)});
      }
    }
    options.sort((a,b)=>b.clearance-a.clearance||a.extra-b.extra);
    const chosen=options.find(o=>!Number.isFinite(o.clearance)||o.clearance>=minClearance);
    if(!chosen)continue;
    const normal={x:nx*chosen.side,z:nz*chosen.side};
    placed.push({
      name:e.name,
      sourceRoadId:e.road.id,
      x:chosen.p.x,
      z:chosen.p.z,
      roadX:e.rep.x,
      roadZ:e.rep.z,
      tangent:e.rep.tangent,
      normal,
      sideOffsetFromRoadEdgeM:chosen.extra,
      buildingClearanceM:Number.isFinite(chosen.clearance)?+chosen.clearance.toFixed(3):null,
      lengthM:e.rep.lengthM
    });
  }
  return placed;
}

function makeTexture(THREE,name,colors){
  const canvas=document.createElement('canvas');
  const ctx=canvas.getContext('2d');
  const scale=Math.max(1,Math.min(2,window.devicePixelRatio||1));
  canvas.width=Math.round(512*scale);
  canvas.height=Math.round(96*scale);
  ctx.scale(scale,scale);
  ctx.fillStyle=colors.board||'#255a72';
  ctx.fillRect(0,0,512,96);
  ctx.strokeStyle='rgba(255,255,255,.75)';
  ctx.lineWidth=5;
  ctx.strokeRect(4,4,504,88);
  let font=34;
  ctx.font=`700 ${font}px system-ui, sans-serif`;
  while(font>19&&ctx.measureText(name).width>455){
    font-=2;
    ctx.font=`700 ${font}px system-ui, sans-serif`;
  }
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillStyle=colors.text||'#f7efe0';
  ctx.fillText(name,256,50);
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=4;
  return texture;
}

export function createStreetSigns(THREE,roads,cfg={},colors={},seedRoot='kfb-city',buildings=[]){
  const root=new THREE.Group();
  root.name='osm-street-signs';
  const candidates=streetSignCandidates(roads,cfg,seedRoot,buildings);
  const poleHeight=Number(cfg.poleHeightM??2.15);
  const boardHeight=Number(cfg.boardHeightM??.52);
  const poleGeo=new THREE.CylinderGeometry(.035,.05,poleHeight,7);
  const poleMat=new THREE.MeshStandardMaterial({color:colors.pole||'#504a48',roughness:.82,metalness:.05});
  const signs=[];

  for(const c of candidates){
    const group=new THREE.Group();
    group.position.set(c.x,0,c.z);
    group.userData.streetSign=true;
    group.userData.name=c.name;
    group.userData.sourceRoadId=c.sourceRoadId;
    group.userData.buildingClearanceM=c.buildingClearanceM;

    const pole=new THREE.Mesh(poleGeo,poleMat);
    pole.position.y=poleHeight/2;
    pole.castShadow=true;
    group.add(pole);

    const width=Math.max(1.65,Math.min(4.8,.74+c.name.length*.105));
    const boardGeo=new THREE.PlaneGeometry(width,boardHeight);
    const texture=makeTexture(THREE,c.name,colors);
    const boardMat=new THREE.MeshBasicMaterial({map:texture,transparent:false,side:THREE.DoubleSide});
    const board=new THREE.Mesh(boardGeo,boardMat);
    board.position.y=poleHeight-.16;
    board.userData.billboard=true;
    board.userData.texture=texture;
    group.add(board);

    root.add(group);
    signs.push({group,board,candidate:c});
  }

  function update(camera){
    for(const s of signs){
      const dx=camera.position.x-s.group.position.x;
      const dz=camera.position.z-s.group.position.z;
      s.group.rotation.y=Math.atan2(dx,dz);
    }
  }

  function dispose(){
    poleGeo.dispose();
    poleMat.dispose();
    for(const s of signs){
      s.board.geometry.dispose();
      s.board.material.map?.dispose();
      s.board.material.dispose();
    }
  }

  return {root,candidates,update,dispose};
}
