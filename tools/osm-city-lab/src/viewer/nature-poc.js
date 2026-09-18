import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { stableHash, mulberry32 } from '../style/cartoon-city.js';
import { pointRoadDistance, pointSegmentDistance } from './street-surface.js';

function openPoly(poly){
  const out=(poly||[]).map(p=>({x:+p.x,z:+p.z})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.z));
  if(out.length>1&&Math.hypot(out[0].x-out.at(-1).x,out[0].z-out.at(-1).z)<.001)out.pop();
  return out;
}

function area(poly){
  let a=0;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++)a+=(poly[j].x*poly[i].z-poly[i].x*poly[j].z);
  return Math.abs(a*.5);
}

function bounds(poly){
  const xs=poly.map(p=>p.x),zs=poly.map(p=>p.z);
  return {minX:Math.min(...xs),maxX:Math.max(...xs),minZ:Math.min(...zs),maxZ:Math.max(...zs)};
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

function polyDistance(p,poly){
  if(inside(p,poly))return 0;
  let best=Infinity;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++)best=Math.min(best,pointSegmentDistance(p,poly[j],poly[i]));
  return best;
}

function prepObstacles(city){
  return (city.features.buildings||[]).map(b=>{
    const poly=openPoly(b.footprint);
    return {poly,bounds:poly.length>=3?bounds(poly):null};
  }).filter(b=>b.bounds);
}

function validPoint(p,city,cfg,buildings){
  const roadClear=Number(cfg.roadClearanceM??3.2);
  if(pointRoadDistance(p,city.features.roads)<roadClear)return false;
  const buildClear=Number(cfg.buildingClearanceM??1.8);
  for(const b of buildings){
    const q=b.bounds;
    if(p.x<q.minX-buildClear||p.x>q.maxX+buildClear||p.z<q.minZ-buildClear||p.z>q.maxZ+buildClear)continue;
    if(polyDistance(p,b.poly)<buildClear)return false;
  }
  return true;
}

function scatterCandidates(city,cfg,seedRoot){
  const maxTrees=Math.max(0,Math.floor(Number(cfg.maxTrees??72)));
  if(!maxTrees)return [];
  const minArea=Number(cfg.minGreenAreaM2??120);
  const buildings=prepObstacles(city);
  const greens=city.features.landuse
    .filter(g=>g.class==='green')
    .map(g=>({source:g,poly:openPoly(g.polygon)}))
    .map(g=>({...g,area:area(g.poly),bounds:bounds(g.poly)}))
    .filter(g=>g.poly.length>=3&&g.area>=minArea);
  const total=greens.reduce((a,g)=>a+g.area,0)||1;
  const out=[];

  for(const g of greens){
    const wanted=Math.max(1,Math.round(maxTrees*g.area/total));
    const r=mulberry32(stableHash(seedRoot+':nature:'+g.source.id));
    for(let n=0;n<wanted&&out.length<maxTrees;n++){
      let accepted=null;
      for(let attempt=0;attempt<60;attempt++){
        const p={
          x:g.bounds.minX+r()*(g.bounds.maxX-g.bounds.minX),
          z:g.bounds.minZ+r()*(g.bounds.maxZ-g.bounds.minZ)
        };
        if(!inside(p,g.poly))continue;
        if(!validPoint(p,city,cfg,buildings))continue;
        accepted={
          ...p,
          yaw:r()*Math.PI*2,
          scale:Number(cfg.treeScaleMin??.82)+r()*(Number(cfg.treeScaleMax??1.35)-Number(cfg.treeScaleMin??.82)),
          assetIndex:Math.floor(r()*Math.max(1,(cfg.assets||[]).length)),
          sourceLanduseId:g.source.id
        };
        break;
      }
      if(accepted)out.push(accepted);
    }
    if(out.length>=maxTrees)break;
  }
  return out;
}

function loadAsync(loader,url){
  return new Promise((resolve,reject)=>loader.load(url,resolve,undefined,reject));
}

export async function createNaturePoc(THREE,city,cfg={},seedRoot='kfb-city'){
  const root=new THREE.Group();
  root.name='kaykit-forest-poc';
  root.visible=false;
  const assets=Array.isArray(cfg.assets)?cfg.assets:[];
  const candidates=scatterCandidates(city,cfg,seedRoot);
  if(!assets.length||!candidates.length)return {root,candidates,loadedAssets:[],errors:[],dispose(){}};

  const loader=new GLTFLoader();
  const templates=[];
  const errors=[];
  for(const url of assets){
    try{
      const gltf=await loadAsync(loader,url);
      const scene=gltf.scene;
      scene.updateMatrixWorld(true);
      const box=new THREE.Box3().setFromObject(scene);
      templates.push({url,scene,minY:box.min.y});
    }catch(error){
      errors.push({url,error:String(error)});
    }
  }
  if(!templates.length)return {root,candidates:[],loadedAssets:[],errors,dispose(){}};

  const placed=[];
  for(const c of candidates){
    const t=templates[c.assetIndex%templates.length];
    const clone=t.scene.clone(true);
    clone.scale.setScalar(c.scale);
    clone.position.set(c.x,-t.minY*c.scale+.035,c.z);
    clone.rotation.y=c.yaw;
    clone.traverse(n=>{
      if(n.isMesh){
        n.castShadow=true;
        n.receiveShadow=true;
      }
    });
    root.add(clone);
    placed.push({...c,asset:t.url});
  }

  return {
    root,
    candidates:placed,
    loadedAssets:templates.map(t=>t.url),
    errors,
    dispose(){
      // Templates/clones share source geometry/material. The page owns them for its lifetime.
      root.clear();
    }
  };
}
