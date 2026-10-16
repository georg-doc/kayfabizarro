import { BrowRig } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@5650b6c54d8789b20ea80abe857688173d506d3b/tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/brow-rig.v2.js';
import { paintOverRegion } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@5650b6c54d8789b20ea80abe857688173d506d3b/tools/KFB-ToolBox/kfb-rigs-embed-v3/lab-v6/texclean.js';

export const NORMAN_FACE_SCHEMA = 'kfb.norman-companion-face/0.1-candidate';
const clone = (v) => JSON.parse(JSON.stringify(v));

function findDummyHead(figure, hints=[]) {
  let best=null, score=-Infinity;
  const tokens=(hints||[]).map((x)=>String(x).toLowerCase());
  figure?.traverse?.((node)=>{
    if(!node?.isMesh || !node.geometry?.attributes?.position)return;
    const n=String(node.name||'').toLowerCase();
    const gn=String(node.geometry?.name||'').toLowerCase();
    let s=0;
    if(n.includes('dummy_head'))s+=100;
    if(n==='dummy_head')s+=40;
    if(n.includes('head'))s+=25;
    if(gn.includes('prototypepete_head'))s+=90;
    if(gn.includes('head'))s+=20;
    for(const t of tokens)if(t&&(n.includes(t)||gn.includes(t)))s+=60;
    if(node.isSkinnedMesh)s+=10;
    if(s>score){score=s;best=node;}
  });
  return best;
}

export function prepareNormanFaceCleanup({THREE,figure,actor,preset,log=()=>{}}) {
  const cfg=preset?.cleanup||{};
  const head=findDummyHead(figure,cfg.headMeshHints||[]);
  const report={
    status:'HUMAN_REQUIRED',
    actorId:actor?.id||'norman',
    method:'texture-face-paint',
    removalMode:'texture-clean',
    headMesh:head?.name||null,
    geometryName:head?.geometry?.name||null,
    sourceUntouched:true,
    boxesLocal:clone(cfg.boxesLocal||[]),
    grow:cfg.grow??0.12,
    colour:null,
    triangles:0,
    reason:''
  };
  if(!head){report.reason='Dummy head mesh not found';return inert(report);}
  if(Array.isArray(head.material)){report.reason='Dummy head unexpectedly has material array';return inert(report);}
  if(!head.material?.map?.image){report.reason='Dummy head texture image unavailable';return inert(report);}
  if(!cfg.boxesLocal?.length){report.reason='No measured paint-clean boxes';return inert(report);}

  const sourceMaterial=head.material;
  const sourceMap=sourceMaterial.map;
  const runtimeMaterial=sourceMaterial.clone();
  runtimeMaterial.map=sourceMap;
  head.material=runtimeMaterial;
  head.userData=head.userData||{};
  head.userData.origMap=sourceMap;

  let cleaned=null;
  try{
    const out=paintOverRegion({
      THREE,
      mesh:head,
      boxesLocal:cfg.boxesLocal,
      grow:cfg.grow??0.12,
      color:cfg.fillColor||null
    });
    cleaned=out.map;
    report.paintReport=clone(out.report||{});
    report.triangles=out.report?.triangles||0;
    report.colour=out.report?.colour||null;
    report.texture=out.report?.texture||null;
    if(!cleaned || out.report?.status!=='OK')throw new Error(out.report?.reason||'texclean produced no cleaned map');
    report.status='TEXTURE_CLEAN_CANDIDATE';
    report.reason='painted source eyes + mouth hidden by reversible measured texture cleanup';
  }catch(err){
    report.reason=String(err?.message||err);
    runtimeMaterial.map=sourceMap;
    runtimeMaterial.needsUpdate=true;
    log(`Norman source-face cleanup failed · ${report.reason}`);
  }

  let active=false;
  const apply=(hide)=>{
    const next=!!hide&&!!cleaned;
    runtimeMaterial.map=next?cleaned:sourceMap;
    runtimeMaterial.needsUpdate=true;
    active=next;
    api.active=active;
    report.runtimeSourceFaceHidden=active;
    return active;
  };
  const api={
    status:report.status,
    active,
    report,
    head,
    apply,
    measureOnFaceHost(){return null;},
    setComponentIsolation(){return null;},
    clearComponentIsolation(){},
    dispose(){
      head.material=sourceMaterial;
      delete head.userData.origMap;
      runtimeMaterial.dispose?.();
      cleaned?.dispose?.();
    }
  };
  if(cleaned)apply(true);
  log(`Norman texture cleanup · ${report.status} · ${report.triangles} triangles · ${report.colour||'sampled'}`);
  return api;
}

function inert(report){
  return {
    status:report.status,active:false,report,
    apply(){return false;},
    measureOnFaceHost(){return null;},
    setComponentIsolation(){return null;},
    clearComponentIsolation(){},
    dispose(){}
  };
}

function loadImage(url){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.crossOrigin='anonymous';
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error('mouth source image failed to load'));
    img.src=url;
  });
}

function edgeKeyWhite(canvas) {
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const image=ctx.getImageData(0,0,canvas.width,canvas.height);
  const d=image.data,W=canvas.width,H=canvas.height,N=W*H;
  const seen=new Uint8Array(N), queue=new Int32Array(N);
  let q0=0,q1=0;
  const isBg=(i)=>{
    const k=i*4,r=d[k],g=d[k+1],b=d[k+2],a=d[k+3];
    return a>0 && r>=238 && g>=238 && b>=238 && Math.max(r,g,b)-Math.min(r,g,b)<=18;
  };
  const push=(i)=>{if(i<0||i>=N||seen[i]||!isBg(i))return;seen[i]=1;queue[q1++]=i;};
  for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}
  for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}
  while(q0<q1){
    const i=queue[q0++],x=i%W,y=(i/W)|0;
    if(x>0)push(i-1);if(x<W-1)push(i+1);if(y>0)push(i-W);if(y<H-1)push(i+W);
  }
  for(let i=0;i<N;i++)if(seen[i])d[i*4+3]=0;
  ctx.putImageData(image,0,0);
  return q1;
}

function mouthCanvas(img,form,pad=8){
  const [sx,sy,sw,sh]=form.bbox;
  const cv=document.createElement('canvas');
  cv.width=sw+pad*2;cv.height=sh+pad*2;
  const ctx=cv.getContext('2d',{willReadFrequently:true});
  ctx.fillStyle='#fff';ctx.fillRect(0,0,cv.width,cv.height);
  ctx.drawImage(img,sx,sy,sw,sh,pad,pad,sw,sh);
  edgeKeyWhite(cv);
  return cv;
}

function markOverlay(root){
  root?.traverse?.((o)=>{o.userData=o.userData||{};o.userData.petOverlay=true;o.userData.noClay=true;if(o.isMesh){o.castShadow=false;o.frustumCulled=false;}});
}

function probeSurfaceZ(THREE,frame,x,y){
  const host=frame?.parent;
  if(!host)return null;
  host.updateMatrixWorld?.(true);
  const ray=new THREE.Raycaster();ray.layers.enableAll();
  const oW=host.localToWorld(new THREE.Vector3(x,y,frame.radius*14));
  const dW=new THREE.Vector3(0,0,-1).transformDirection(host.matrixWorld).normalize();
  ray.set(oW,dW);
  const hit=ray.intersectObject(host,false)?.[0];
  return hit?host.worldToLocal(hit.point.clone()).z:null;
}

export async function mountNormanCompanionFace({THREE,eyes,profile,mouthCatalog,log=()=>{}}) {
  const cfg=clone(profile||{});
  const expressionMap=cfg.expressionMap||{};
  const browParams=clone(cfg.brows||{});
  const mouth={form:'closed',x:0,y:-3.15,width:4.35,depth:0.1,visible:true,...clone(cfg.mouth||{})};
  const getEyeFrame=()=>eyes?.eyeFrame?.()||null;
  const brow=new BrowRig({
    THREE,
    getEyeFrame,
    baseColor:cfg.eye?.baseColor||'#e4b53c',
    seed:8713,
    params:browParams
  });
  markOverlay(brow.mesh);

  const mouthMaterial=new THREE.MeshBasicMaterial({
    transparent:true,alphaTest:0.015,depthWrite:true,depthTest:true,
    side:THREE.DoubleSide,toneMapped:false
  });
  const mouthMesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mouthMaterial);
  mouthMesh.name='KFB Norman yellow cartoon mouth';
  mouthMesh.renderOrder=6;
  mouthMesh.raycast=()=>{};
  markOverlay(mouthMesh);

  const forms=new Map((mouthCatalog?.forms||[]).map((f)=>[f.id,f]));
  const textureCache=new Map();
  let sourceImagePromise=null,mouthStatus='PENDING',lastGen=-1,lastForm=null,visible=true;

  const ensureSourceImage=()=>{
    if(!sourceImagePromise)sourceImagePromise=loadImage(mouthCatalog?.source?.sourceUrl);
    return sourceImagePromise;
  };
  const textureFor=async(id)=>{
    if(textureCache.has(id))return textureCache.get(id);
    const form=forms.get(id);if(!form)throw new Error(`unknown mouth form: ${id}`);
    const img=await ensureSourceImage();
    const canvas=mouthCanvas(img,form);
    const tex=new THREE.CanvasTexture(canvas);
    if(THREE.SRGBColorSpace)tex.colorSpace=THREE.SRGBColorSpace;
    tex.needsUpdate=true;
    textureCache.set(id,{texture:tex,aspect:canvas.width/canvas.height,canvas});
    return textureCache.get(id);
  };
  const syncFrame=()=>{
    const f=getEyeFrame();if(!f)return false;
    if(f.parent&&mouthMesh.parent!==f.parent){mouthMesh.removeFromParent();f.parent.add(mouthMesh);}
    const form=forms.get(mouth.form)||forms.get('closed');
    const aspect=textureCache.get(mouth.form)?.aspect || ((form?.bbox?.[2]||1)/(form?.bbox?.[3]||1));
    const cx=(f.left.x+f.right.x)/2 + (mouth.x||0)*f.radius;
    const cy=(f.left.y+f.right.y)/2 + (mouth.y||0)*f.radius;
    const skinZ=probeSurfaceZ(THREE,f,cx,cy);
    const eyeZ=(f.left.z+f.right.z)/2;
    const z=(Number.isFinite(skinZ)?skinZ:eyeZ+f.radius*.8)+f.radius*(mouth.depth||0);
    const w=Math.max(.05,(mouth.width||4.35)*f.radius);
    mouthMesh.position.set(cx,cy,z);
    mouthMesh.scale.set(w,w/Math.max(.15,aspect),1);
    mouthMesh.visible=visible && mouth.visible!==false && !!mouthMaterial.map;
    lastGen=f.gen||0;
    return true;
  };
  const setMouth=async(patch={})=>{
    const previous=mouth.form;
    Object.assign(mouth,patch||{});
    if(!forms.has(mouth.form))mouth.form=previous&&forms.has(previous)?previous:'closed';
    if(mouth.form!==lastForm || !mouthMaterial.map){
      try{
        const rec=await textureFor(mouth.form);
        mouthMaterial.map=rec.texture;mouthMaterial.needsUpdate=true;
        lastForm=mouth.form;mouthStatus='OK';
      }catch(err){
        mouthStatus='ERROR';
        log(`Norman mouth source · ${err.message}`);
      }
    }
    syncFrame();
    return {status:mouthStatus,...clone(mouth)};
  };
  const setBrow=(patch={})=>{
    const check=brow.set(patch);
    if(check.status!=='OK')log(`Norman BrowRig · ${check.field||''} ${check.reason||check.status}`);
    markOverlay(brow.mesh);
    return check;
  };
  const applyExpression=(name)=>{
    const map=expressionMap[name]||{};
    if(map.brow)brow.expression(map.brow);
    if(map.mouth)setMouth({form:map.mouth}).catch((err)=>log(`Norman expression mouth · ${err.message}`));
    markOverlay(brow.mesh);
  };
  const setVisible=(on)=>{
    visible=!!on;
    brow.mesh.visible=visible && brow.params.enabled!==false;
    mouthMesh.visible=visible && mouth.visible!==false && !!mouthMaterial.map;
  };
  const exportProfile=()=>({
    schema:NORMAN_FACE_SCHEMA,
    status:'DESIGN_TUNE',
    visualCanon:'OPEN_DESIGN',
    brows:clone(brow.params),
    mouth:clone(mouth),
    expressionMap:clone(expressionMap)
  });

  await setMouth({form:mouth.form});
  syncFrame();
  const api={
    brow,mouthMesh,
    setMouth,setBrow,applyExpression,setVisible,
    applyProfile(next={}){
      if(next.brows)setBrow(next.brows);
      if(next.mouth)setMouth(next.mouth).catch((err)=>log(`Norman mouth profile · ${err.message}`));
    },
    update(){
      brow.sync();
      const f=getEyeFrame();
      if(f&&(f.gen||0)!==lastGen)syncFrame();
    },
    export:exportProfile,
    report:()=>({
      schema:NORMAN_FACE_SCHEMA,
      status:'DESIGN_TUNE',
      visualCanon:'OPEN_DESIGN',
      brow:{status:brow.last?.status||'OK',params:clone(brow.params),frame:brow.frame?clone(brow.frame):null},
      mouth:{status:mouthStatus,...clone(mouth),formCount:forms.size,sourceRevision:mouthCatalog?.source?.revision||null,sourceBlob:mouthCatalog?.source?.blob||null},
      visible
    }),
    dispose(){
      brow.dispose();
      mouthMesh.removeFromParent();
      mouthMesh.geometry.dispose();
      mouthMaterial.dispose();
      for(const rec of textureCache.values())rec.texture.dispose?.();
      textureCache.clear();
    }
  };
  log(`Norman companion face · BrowRig v2 + ${forms.size} source mouth forms · OPEN_DESIGN`);
  return api;
}
