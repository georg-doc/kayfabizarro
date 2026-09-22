/* KFB Tileable RGB Brush v0.1
 *
 * Seam-only successor to createRgbBrushTexture().
 * It keeps the same "one shared RGB macro texture" concept but makes the canvas periodic:
 * - every brush stroke and blob is drawn on a 3x3 toroidal neighborhood;
 * - opposite pixel edges are explicitly normalized;
 * - RepeatWrapping now repeats matching borders instead of exposing a hard edge.
 *
 * No shader/material/scale owner changes.
 */

function mulberry32(seed){
  let a=seed>>>0;
  return()=>{a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};
}

function withWrapCopies(ctx,size,draw){
  for(const dx of [-size,0,size])for(const dy of [-size,0,size]){
    ctx.save();ctx.translate(dx,dy);draw();ctx.restore();
  }
}

function paintStroke(ctx,rng,channel,size){
  const colors=['rgba(255,0,0,.28)','rgba(0,255,0,.28)','rgba(0,0,255,.28)'];
  const x0=rng()*size,y0=rng()*size;
  const x1=rng()*size,y1=rng()*size;
  const cx=(x0+x1)*.5+(rng()-.5)*size*.42;
  const cy=(y0+y1)*.5+(rng()-.5)*size*.42;
  const lineWidth=size*(.06+rng()*.13);
  const alpha=.82+rng()*.18;
  withWrapCopies(ctx,size,()=>{
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(cx,cy,x1,y1);
    ctx.strokeStyle=colors[channel];ctx.lineWidth=lineWidth;ctx.globalAlpha=alpha;ctx.stroke();
  });
}

function paintBlob(ctx,rng,channel,size){
  const x=rng()*size,y=rng()*size,r=size*(.025+rng()*.08);
  const rgb=channel===0?'255,0,0':channel===1?'0,255,0':'0,0,255';
  withWrapCopies(ctx,size,()=>{
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,`rgba(${rgb},.55)`);
    g.addColorStop(1,`rgba(${rgb},0)`);
    ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
  });
}

function normalizeOppositeEdges(ctx,size){
  const img=ctx.getImageData(0,0,size,size);
  const d=img.data;
  const px=(x,y)=>4*(y*size+x);
  for(let y=0;y<size;y++){
    const a=px(0,y),b=px(size-1,y);
    for(let c=0;c<4;c++)d[b+c]=d[a+c];
  }
  for(let x=0;x<size;x++){
    const a=px(x,0),b=px(x,size-1);
    for(let c=0;c<4;c++)d[b+c]=d[a+c];
  }
  ctx.putImageData(img,0,0);
}

export function measureTileEdges(canvas){
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const {width:w,height:h}=canvas;
  const d=ctx.getImageData(0,0,w,h).data;
  const px=(x,y)=>4*(y*w+x);
  let sum=0,count=0,max=0;
  for(let y=0;y<h;y++){
    const a=px(0,y),b=px(w-1,y);
    for(let c=0;c<3;c++){const v=Math.abs(d[a+c]-d[b+c]);sum+=v;count++;if(v>max)max=v}
  }
  for(let x=0;x<w;x++){
    const a=px(x,0),b=px(x,h-1);
    for(let c=0;c<3;c++){const v=Math.abs(d[a+c]-d[b+c]);sum+=v;count++;if(v>max)max=v}
  }
  return{maxAbs:max,meanAbs:count?sum/count:0,samples:count,width:w,height:h};
}

export function createTileableRgbBrushTexture(THREE,{size=256,seed=0x4b4642}={}){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
  const ctx=canvas.getContext('2d',{alpha:false,willReadFrequently:true});
  ctx.fillStyle='rgb(32,32,32)';ctx.fillRect(0,0,size,size);
  ctx.lineCap='round';ctx.lineJoin='round';ctx.globalCompositeOperation='screen';

  const rng=mulberry32(seed);
  for(let pass=0;pass<4;pass++)for(let channel=0;channel<3;channel++)for(let i=0;i<9;i++)paintStroke(ctx,rng,channel,size);

  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.15;
  for(let i=0;i<18;i++)paintBlob(ctx,rng,i%3,size);
  ctx.globalAlpha=1;

  normalizeOppositeEdges(ctx,size);
  const edgeMetrics=measureTileEdges(canvas);

  const texture=new THREE.CanvasTexture(canvas);
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.colorSpace=THREE.NoColorSpace;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.generateMipmaps=true;
  texture.anisotropy=8;
  texture.name='KFB_RGB_TRIPLANAR_TILEABLE_TEXTURE';
  texture.needsUpdate=true;

  return{texture,canvas,seed,size,edgeMetrics};
}
