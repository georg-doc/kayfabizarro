/* KFB tileable RGB brush macro texture v1
 *
 * Fixes the proven seam cause in the earlier brush generator:
 * random strokes/blobs are authored periodically on a 3x3 toroidal canvas,
 * then the center tile is cropped. RepeatWrapping is therefore used on an
 * actually periodic source rather than a non-tileable bitmap.
 */

function mulberry32(seed){
  let a=seed>>>0;
  return()=>{a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};
}

function strokePath(ctx,x0,y0,x1,y1,cx,cy,width,style,alpha){
  ctx.beginPath();
  ctx.moveTo(x0,y0);
  ctx.quadraticCurveTo(cx,cy,x1,y1);
  ctx.strokeStyle=style;
  ctx.lineWidth=width;
  ctx.globalAlpha=alpha;
  ctx.stroke();
}

function drawPeriodicStroke(ctx,size,params){
  for(let oy=0;oy<3;oy++)for(let ox=0;ox<3;ox++){
    const dx=ox*size,dy=oy*size;
    strokePath(ctx,
      params.x0+dx,params.y0+dy,
      params.x1+dx,params.y1+dy,
      params.cx+dx,params.cy+dy,
      params.width,params.style,params.alpha
    );
  }
}

function drawPeriodicBlob(ctx,size,{x,y,r,rgb,alpha}){
  for(let oy=0;oy<3;oy++)for(let ox=0;ox<3;ox++){
    const px=x+ox*size,py=y+oy*size;
    const g=ctx.createRadialGradient(px,py,0,px,py,r);
    g.addColorStop(0,`rgba(${rgb},${alpha})`);
    g.addColorStop(1,`rgba(${rgb},0)`);
    ctx.fillStyle=g;
    ctx.fillRect(px-r,py-r,r*2,r*2);
  }
}

export function createTileableRgbBrushCanvas({size=256,seed=0x4b4642}={}){
  const work=document.createElement('canvas');
  work.width=work.height=size*3;
  const ctx=work.getContext('2d',{alpha:false,willReadFrequently:true});
  ctx.fillStyle='rgb(32,32,32)';
  ctx.fillRect(0,0,work.width,work.height);
  ctx.lineCap='round';
  ctx.lineJoin='round';
  ctx.globalCompositeOperation='screen';

  const rng=mulberry32(seed);
  const colors=['rgba(255,0,0,.28)','rgba(0,255,0,.28)','rgba(0,0,255,.28)'];

  for(let pass=0;pass<4;pass++){
    for(let channel=0;channel<3;channel++){
      for(let i=0;i<9;i++){
        const x0=rng()*size,y0=rng()*size;
        const x1=rng()*size,y1=rng()*size;
        const cx=(x0+x1)*.5+(rng()-.5)*size*.42;
        const cy=(y0+y1)*.5+(rng()-.5)*size*.42;
        drawPeriodicStroke(ctx,size,{
          x0,y0,x1,y1,cx,cy,
          width:size*(.06+rng()*.13),
          style:colors[channel],
          alpha:.82+rng()*.18
        });
      }
    }
  }

  ctx.globalCompositeOperation='source-over';
  ctx.globalAlpha=.15;
  for(let i=0;i<18;i++){
    const x=rng()*size,y=rng()*size,r=size*(.025+rng()*.08);
    const rgb=i%3===0?'255,0,0':i%3===1?'0,255,0':'0,0,255';
    drawPeriodicBlob(ctx,size,{x,y,r,rgb,alpha:.55});
  }
  ctx.globalAlpha=1;

  const canvas=document.createElement('canvas');
  canvas.width=canvas.height=size;
  const out=canvas.getContext('2d',{alpha:false,willReadFrequently:true});
  out.drawImage(work,size,size,size,size,0,0,size,size);
  return{canvas,seed,size};
}

export function createTileableRgbBrushTexture(THREE,options={}){
  const result=createTileableRgbBrushCanvas(options);
  const texture=new THREE.CanvasTexture(result.canvas);
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.colorSpace=THREE.NoColorSpace;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.generateMipmaps=true;
  texture.anisotropy=8;
  texture.name='KFB_RGB_TRIPLANAR_TILEABLE_TEXTURE';
  texture.needsUpdate=true;
  return{...result,texture};
}

export function edgeContinuity(canvas){
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const {width:w,height:h}=canvas;
  const d=ctx.getImageData(0,0,w,h).data;
  const px=(x,y,c)=>d[((y*w+x)*4)+c];
  let seamX=0,seamY=0,localX=0,localY=0,countX=0,countY=0;

  for(let y=0;y<h;y++)for(let c=0;c<3;c++){
    seamX+=Math.abs(px(0,y,c)-px(w-1,y,c));
    countX++;
    for(let x=1;x<w;x++){
      localX+=Math.abs(px(x,y,c)-px(x-1,y,c));
    }
  }
  for(let x=0;x<w;x++)for(let c=0;c<3;c++){
    seamY+=Math.abs(px(x,0,c)-px(x,h-1,c));
    countY++;
    for(let y=1;y<h;y++){
      localY+=Math.abs(px(x,y,c)-px(x,y-1,c));
    }
  }

  const seamXMean=seamX/countX;
  const seamYMean=seamY/countY;
  const localXMean=localX/(h*(w-1)*3);
  const localYMean=localY/(w*(h-1)*3);
  return{
    seamXMean,seamYMean,localXMean,localYMean,
    seamXRatio:seamXMean/Math.max(localXMean,1e-6),
    seamYRatio:seamYMean/Math.max(localYMean,1e-6)
  };
}

export function makeTiledPreview(canvas,tiles=2){
  const out=document.createElement('canvas');
  out.width=canvas.width*tiles;
  out.height=canvas.height*tiles;
  const ctx=out.getContext('2d');
  for(let y=0;y<tiles;y++)for(let x=0;x<tiles;x++)ctx.drawImage(canvas,x*canvas.width,y*canvas.height);
  return out;
}
