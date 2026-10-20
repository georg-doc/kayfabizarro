export const FACE_COLOR_SCHEMA='kfb.face-color-sampler/0.1-candidate';

function colorHex(THREE, rgb){
  const c=new THREE.Color(rgb[0]/255,rgb[1]/255,rgb[2]/255);
  return '#'+c.getHexString();
}

function textureSampler(mesh){
  const cache=new Map();
  return (hit)=>{
    const mats=Array.isArray(mesh.material)?mesh.material:[mesh.material];
    const mi=hit?.face?.materialIndex||0;
    const mat=mats[mi]||mats[0]||null;
    if(!mat) return null;
    const tint=mat.color||null;
    const map=mat.map||null;
    if(!map?.image || !hit?.uv){
      if(!tint) return null;
      return [
        Math.round(tint.r*255),
        Math.round(tint.g*255),
        Math.round(tint.b*255)
      ];
    }
    let sampler=cache.get(map.uuid);
    if(sampler===undefined){
      sampler=null;
      try{
        const img=map.image,w=img.width,h=img.height;
        if(w&&h){
          const cv=document.createElement('canvas');cv.width=w;cv.height=h;
          const cx=cv.getContext('2d',{willReadFrequently:true});
          cx.drawImage(img,0,0);
          const data=cx.getImageData(0,0,w,h).data,flip=!!map.flipY;
          sampler=(u,v)=>{
            const px=Math.min(w-1,Math.max(0,Math.round(u*w)));
            const py=Math.min(h-1,Math.max(0,Math.round((flip?1-v:v)*h)));
            const o=(py*w+px)*4;
            let r=data[o],g=data[o+1],b=data[o+2];
            if(tint){r*=tint.r;g*=tint.g;b*=tint.b;}
            return [Math.round(r),Math.round(g),Math.round(b)];
          };
        }
      }catch(e){sampler=null;}
      cache.set(map.uuid,sampler);
    }
    return sampler?sampler(hit.uv.x,hit.uv.y):null;
  };
}

export function pickDominantColor(samples){
  if(!samples?.length)return null;
  const bins=new Map();
  for(const rgb of samples){
    if(!rgb||rgb.length<3)continue;
    const key=rgb.map(v=>Math.max(0,Math.min(7,Math.round(v/36)))).join('_');
    let row=bins.get(key);if(!row){row={n:0,sum:[0,0,0]};bins.set(key,row);}
    row.n++;row.sum[0]+=rgb[0];row.sum[1]+=rgb[1];row.sum[2]+=rgb[2];
  }
  if(!bins.size)return null;
  const rows=[...bins.values()].sort((a,b)=>b.n-a.n);
  const win=rows[0];
  return win.sum.map(v=>Math.round(v/win.n));
}

function findHeadMesh(figure,preferred){
  let exact=null,fallback=null;
  figure?.traverse?.((n)=>{
    if(!n?.isSkinnedMesh||!n.geometry)return;
    if(preferred&&n.name===preferred)exact=n;
    if(!fallback&&/head|face|skull/i.test(String(n.name||'')))fallback=n;
  });
  return exact||fallback;
}

export function sampleActorFaceColor({THREE,figure,faceHost,anchor,preferredHeadMesh,log=()=>{}}={}){
  if(!THREE||!figure||!faceHost?.box)return {schema:FACE_COLOR_SCHEMA,status:'UNSUPPORTED',reason:'missing host'};
  const head=findHeadMesh(figure,preferredHeadMesh);
  if(!head)return {schema:FACE_COLOR_SCHEMA,status:'UNSUPPORTED',reason:'no head mesh'};

  const body=faceHost.box;
  if(!body.geometry.boundingBox)body.geometry.computeBoundingBox();
  const bb=body.geometry.boundingBox;
  const size=bb.getSize(new THREE.Vector3());
  const lc=bb.getCenter(new THREE.Vector3());
  const U=size.y/2;
  const A={dx:0.295,dy:0,ring:0.153,...(anchor||{})};
  const R=Math.max(U*0.03,U*(A.ring||0.153));
  const ray=new THREE.Raycaster();ray.layers.enableAll();
  const sampleTex=textureSampler(head);
  const colors=[];
  const hits=[];

  const offsets=[
    [0,0.75],[0,1.25],[0,-0.75],
    [-0.85,0],[0.85,0],
    [-0.55,0.75],[0.55,0.75]
  ];

  for(const sx of [-1,1]){
    const ex=lc.x+sx*U*(A.dx||0),ey=lc.y+U*(A.dy||0);
    for(const [ox,oy] of offsets){
      const px=ex+ox*R,py=ey+oy*R;
      const oL=new THREE.Vector3(px,py,lc.z+U*3.8);
      const oW=body.localToWorld(oL.clone());
      const dW=new THREE.Vector3(0,0,-1).transformDirection(body.matrixWorld).normalize();
      ray.set(oW,dW);
      const hit=ray.intersectObject(head,false)[0];
      if(!hit)continue;
      const rgb=sampleTex(hit);
      if(rgb){colors.push(rgb);hits.push({uv:hit.uv?[+hit.uv.x.toFixed(4),+hit.uv.y.toFixed(4)]:null,rgb});}
    }
  }

  const rgb=pickDominantColor(colors);
  if(!rgb){
    log('face color · no readable head texture sample');
    return {schema:FACE_COLOR_SCHEMA,status:'HUMAN_REQUIRED',reason:'no readable texture samples',headMesh:head.name||null,samples:hits};
  }
  const hex=colorHex(THREE,rgb);
  log(`face color · ${head.name||'(head)'} · ${hex} · ${colors.length} samples`);
  return {
    schema:FACE_COLOR_SCHEMA,status:'OK',headMesh:head.name||null,
    color:hex,rgb,sampleCount:colors.length,samples:hits,
    source:'head-texture-around-eye-host'
  };
}

export default sampleActorFaceColor;
