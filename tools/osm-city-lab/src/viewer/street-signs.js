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

export function streetSignCandidates(roads,cfg={},seedRoot='kfb-city'){
  const maxSigns=Math.max(1,Number(cfg.maxSigns??28));
  const minLength=Number(cfg.minRoadLengthM??16);
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

  return ranked.map(e=>{
    const sideOffset=Number(cfg.sideOffsetM??1.25)+Number(e.road.widthM||5)/2;
    const nx=-e.rep.tangent.z,nz=e.rep.tangent.x;
    const flip=(stableHash(seedRoot+':sign-side:'+e.name)&1)?1:-1;
    return {
      name:e.name,
      sourceRoadId:e.road.id,
      x:e.rep.x+nx*sideOffset*flip,
      z:e.rep.z+nz*sideOffset*flip,
      roadX:e.rep.x,
      roadZ:e.rep.z,
      tangent:e.rep.tangent,
      lengthM:e.rep.lengthM
    };
  });
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

export function createStreetSigns(THREE,roads,cfg={},colors={},seedRoot='kfb-city'){
  const root=new THREE.Group();
  root.name='osm-street-signs';
  const candidates=streetSignCandidates(roads,cfg,seedRoot);
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
