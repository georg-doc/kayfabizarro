// KFB Cutout SVG → THREE texture plane helpers · v0.1
// Browser-only proof utility. Source SVG geometry stays immutable; this module rasterizes selected source groups for world-space presentation.

function loadImage(url){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error('SVG image decode failed'));
    img.src=url;
  });
}

function alphaBounds(ctx,w,h){
  const data=ctx.getImageData(0,0,w,h).data;
  let minX=w,minY=h,maxX=-1,maxY=-1;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      if(data[(y*w+x)*4+3]>2){
        if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
      }
    }
  }
  if(maxX<minX||maxY<minY)return null;
  return {x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
}

export async function rasterizeSvgGroups(THREE,svgText,visibleIds,{pixelWidth=768,paddingPx=3}={}){
  const doc=new DOMParser().parseFromString(svgText,'image/svg+xml');
  const svg=doc.documentElement;
  const vb=(svg.getAttribute('viewBox')||'0 0 100 100').trim().split(/\s+/).map(Number);
  const viewBox={x:vb[0],y:vb[1],w:vb[2],h:vb[3]};
  const ids=new Set(visibleIds);
  for(const el of svg.querySelectorAll('[id^="rig-"]')){
    if(!ids.has(el.id))el.setAttribute('display','none');
  }
  const pixelHeight=Math.max(1,Math.round(pixelWidth*viewBox.h/viewBox.w));
  svg.setAttribute('width',String(pixelWidth));
  svg.setAttribute('height',String(pixelHeight));
  const xml=new XMLSerializer().serializeToString(svg);
  const blob=new Blob([xml],{type:'image/svg+xml'});
  const url=URL.createObjectURL(blob);
  let img;
  try{img=await loadImage(url);}finally{URL.revokeObjectURL(url);}
  const full=document.createElement('canvas');full.width=pixelWidth;full.height=pixelHeight;
  const fctx=full.getContext('2d',{willReadFrequently:true});fctx.clearRect(0,0,pixelWidth,pixelHeight);fctx.drawImage(img,0,0,pixelWidth,pixelHeight);
  const b=alphaBounds(fctx,pixelWidth,pixelHeight);
  if(!b)throw new Error('No visible pixels for '+[...ids].join(','));
  const x0=Math.max(0,b.x-paddingPx),y0=Math.max(0,b.y-paddingPx);
  const x1=Math.min(pixelWidth,b.x+b.w+paddingPx),y1=Math.min(pixelHeight,b.y+b.h+paddingPx);
  const cw=x1-x0,ch=y1-y0;
  const crop=document.createElement('canvas');crop.width=cw;crop.height=ch;
  crop.getContext('2d').drawImage(full,x0,y0,cw,ch,0,0,cw,ch);
  const texture=new THREE.CanvasTexture(crop);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.needsUpdate=true;
  const bbox={
    x:viewBox.x+(x0/pixelWidth)*viewBox.w,
    y:viewBox.y+(y0/pixelHeight)*viewBox.h,
    w:(cw/pixelWidth)*viewBox.w,
    h:(ch/pixelHeight)*viewBox.h
  };
  return {texture,bbox,viewBox,canvas:crop};
}

export function svgPointToActorLocal(x,y,viewBox,scale){
  return {
    x:(x-(viewBox.x+viewBox.w/2))*scale,
    y:((viewBox.y+viewBox.h/2)-y)*scale
  };
}

export function makeTransparentPlane(THREE,layer,scale,z=0){
  const w=layer.bbox.w*scale,h=layer.bbox.h*scale;
  const geometry=new THREE.PlaneGeometry(w,h);
  const material=new THREE.MeshBasicMaterial({
    map:layer.texture,
    transparent:true,
    depthWrite:false,
    alphaTest:.01,
    side:THREE.DoubleSide,
    toneMapped:false
  });
  const mesh=new THREE.Mesh(geometry,material);
  mesh.position.z=z;
  mesh.renderOrder=Math.round((z+1)*1000);
  return mesh;
}
