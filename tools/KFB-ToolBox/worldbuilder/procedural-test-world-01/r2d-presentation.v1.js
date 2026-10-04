/* KFB R2D presentation v1
 * Source-derived from R2D v0 donor island.js blob 6952697d...
 * Presentation only: NO renderer, scene, camera, frame loop, movement, collision or material SSOT.
 * WB2 remains renderer/world/edit owner; R2D core remains world-data truth.
 */
import * as THREE from 'three';
import {
  buildP0BTreeGeometry,
  buildK1BoulderGeometry,
  buildT3AccentRockGeometry,
  buildT3BushGeometry
} from '../world-corridor-01/procedural-props-local-proof/environment-family-p1.mjs';
import {
  buildSoftLogSeparatorGeometry,
  buildSoftStumpDetailedGeometry,
  buildSoftMushroomGroup3Geometry,
  buildSoftGrassTuftGeometry
} from '../world-corridor-01/procedural-environment-p2/environment-family-p2.mjs';

export const SCHEMA='kfb.r2d-wb2-presentation/1';
export const SOURCE=Object.freeze({
  r2dDonorBlob:'6952697d7d3c9cd159ac3fdd924f24fa333c904d',
  p1Blob:'e64ed265882b973235cef04251073840e0231e72',
  p2Blob:'b036b34b37cac1926550a58fe5bceae0c2478523'
});

const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const sstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const hash2=(x,y,s)=>{const h=Math.sin(x*127.1+y*311.7+s*74.7)*43758.5453;return h-Math.floor(h)};
const vnoise=(x,y,s)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=hash2(xi,yi,s),b=hash2(xi+1,yi,s),c=hash2(xi,yi+1,s),d=hash2(xi+1,yi+1,s);
  return(a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v)*2-1};
const fbm=(x,y,s,o=4)=>{let a=0,f=1,w=.5;for(let i=0;i<o;i++){a+=w*vnoise(x*f,y*f,s+i*13);f*=2.03;w*=.5}return a};
const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};

function colorArray(hex){const c=new THREE.Color(hex);return[c.r,c.g,c.b]}

export function buildIslandBody(plan,field,palette,lifeTreeRecipe=null){
  const {c0,NA,edgeR,seed}=plan,NR=44,NU=30,rows=NR+1+NU;
  const pos=new Float32Array(rows*NA*3),col=new Float32Array(rows*NA*3);
  const grass=colorArray(palette.grass),grass2=colorArray(palette.grass2||palette.grass),hill=colorArray(palette.hill||palette.grass),
    paved=colorArray(palette.paved),sand=colorArray(palette.sand),lip=colorArray(palette.lip||palette.rock),rock=colorArray(palette.rock||palette.lip);
  const R=rng(seed*31+7),depth=13+R()*4,edgeY=new Float32Array(NA);
  let vi=0;
  const put=(x,y,z,c)=>{pos.set([x,y,z],vi*3);col.set(c,vi*3);vi++};
  for(let i=0;i<=NR;i++){
    const t=1-Math.pow(1-i/NR,1.35);
    for(let a=0;a<NA;a++){
      const th=a/NA*Math.PI*2,r=edgeR[a]*t,x=c0[0]+Math.cos(th)*r,z=c0[1]+Math.sin(th)*r,y=field.heightAt(x,z),m=field.maskAt(x,z),e=-plan.sdf(x,z);
      const pn=fbm(x*.07,z*.07,seed+21),d=plan.roadDist(x,z);
      let cw=pn>.14?grass2:pn<-.32?hill:grass;
      if(m==='building'||m==='interact'||m==='walk')cw=paved;else if(d<plan.hw+1.6&&d>=plan.hw-2.2)cw=sand;else if(e<1.3)cw=lip;
      if(i===NR)edgeY[a]=y;put(x,y,z,cw);
    }
  }
  const meanEdgeY=edgeY.reduce((a,b)=>a+b,0)/NA;
  for(let j=1;j<=NU;j++){
    const s=j/NU;
    for(let a=0;a<NA;a++){
      const th=a/NA*Math.PI*2;
      let rf=(1+.05*Math.sin(Math.min(1,s/.1)*Math.PI))*Math.pow(1-s,.7);
      rf*=1+.1*fbm(th*2.2,s*5,seed+31)*sstep(.05,.3,s);
      const rr=edgeR[a]*rf,y=(edgeY[a]*(1-s)+meanEdgeY*s)-.9*sstep(0,.1,s)-depth*Math.sin(s*Math.PI/2)*(1+(.16*Math.sin(th*3+seed)+.11*Math.sin(th*5-seed))*(1-s))+.8*fbm(th*3,s*3,seed+41)*sstep(.1,.4,s)*(1-s);
      const band=fbm(y*.35+th*.6,th,seed+51)>.05?.78:1,cw=rock.map(v=>v*band*(1-.25*s));
      put(c0[0]+Math.cos(th)*rr+((lifeTreeRecipe?.position[0]??c0[0])-c0[0])*s*s,y,c0[1]+Math.sin(th)*rr+((lifeTreeRecipe?.position[2]??c0[1])-c0[1])*s*s,cw);
    }
  }
  const idx=[];
  for(let k=0;k<rows-1;k++)for(let a=0;a<NA;a++){const a1=(a+1)%NA,v00=k*NA+a,v01=k*NA+a1,v10=(k+1)*NA+a,v11=(k+1)*NA+a1;idx.push(v00,v10,v11,v00,v11,v01)}
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
  if(g.attributes.normal.getY(NA*5)<0){const ix=g.index.array;for(let i=0;i<ix.length;i+=3){const t=ix[i+1];ix[i+1]=ix[i+2];ix[i+2]=t}g.index.needsUpdate=true;g.computeVertexNormals()}
  const ix=g.index.array,cut=(NR+3)*NA*6;
  const slice=(a,b)=>{const s=new THREE.BufferGeometry();for(const k of['position','normal','color'])s.setAttribute(k,g.attributes[k]);s.setIndex(Array.from(ix.slice(a,b)));s.computeBoundingBox();s.computeBoundingSphere();return s};
  return{top:slice(0,cut),under:slice(cut,ix.length),depth:+depth.toFixed(1),vertices:vi};
}

function waterMaterial(color){return new THREE.MeshStandardMaterial({color,roughness:.3,metalness:0,transparent:true,opacity:.92,side:THREE.DoubleSide})}

export function buildWaterGroup(plan,field,palette){
  const group=new THREE.Group();group.name='R2D water presentation';
  const mat=waterMaterial(palette.water||'#3f8fd6');
  const report={pond:false,creek:false,waterfall:false};
  if(plan.pond){
    const pd=plan.pond,wl=pd.h-.32,g=new THREE.CircleGeometry(pd.r+.9,64);g.rotateX(-Math.PI/2);
    const pa=g.attributes.position;for(let i=1;i<pa.count;i++){const x=pa.getX(i),z=pa.getZ(i),a=Math.atan2(z,x),k=1+.08*vnoise(Math.cos(a)*2,Math.sin(a)*2,plan.seed+71);pa.setXYZ(i,x*k,0,z*k)}
    g.translate(pd.x,wl,pd.z);g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat);m.name='R2D pond';m.receiveShadow=true;group.add(m);report.pond=true;
  }
  if(plan.creek){
    const C=plan.creek,end=C.lip?C.lip.i:C.pts.length-1,verts=[],idx=[],hw=C.w+1.15;
    for(let i=0;i<=end;i++){
      const a=C.pts[Math.max(0,i-1)],b=C.pts[Math.min(C.pts.length-1,i+1)],tx=b[0]-a[0],tz=b[1]-a[1],l=Math.hypot(tx,tz)||1,nx=-tz/l,nz=tx/l,y=field.heightAt(C.pts[i][0],C.pts[i][1])+.42;
      for(const sd of[-1,1])verts.push(C.pts[i][0]+nx*sd*hw,y,C.pts[i][1]+nz*sd*hw);
      if(i){const v=(i-1)*2;idx.push(v,v+2,v+1,v+1,v+2,v+3)}
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat);m.name='R2D creek';m.receiveShadow=true;group.add(m);report.creek=true;
    if(C.lip){
      const L=C.lip.p,dv=C.lip.dir,y0=field.heightAt(L[0],L[1])+.42,nx=-dv[1],nz=dv[0],fp=[],fi=[],N=32;
      const curve=t=>[L[0]+dv[0]*(.6+3.8*t),y0-24*t*t,L[1]+dv[1]*(.6+3.8*t)];
      for(let k=0;k<=N;k++){const t=k/N,p=curve(t),w=hw*(.85+.45*t);for(const sd of[-1,1])fp.push(p[0]+nx*sd*w,p[1],p[2]+nz*sd*w);if(k){const v=(k-1)*2;fi.push(v,v+2,v+1,v+1,v+2,v+3)}}
      const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.Float32BufferAttribute(fp,3));fg.setIndex(fi);fg.computeVertexNormals();
      const fm=new THREE.Mesh(fg,mat);fm.name='R2D waterfall';group.add(fm);report.waterfall=true;
    }
  }
  return{group,report};
}

function geometryMinY(g){g.computeBoundingBox();return Number.isFinite(g.boundingBox?.min?.y)?g.boundingBox.min.y:0}
function instanced(name,geometry,points,material,field,seed,scale=1){
  if(!points.length)return null;
  const mesh=new THREE.InstancedMesh(geometry,material,points.length);mesh.name=name;mesh.castShadow=mesh.receiveShadow=true;
  const M=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3(),s=new THREE.Vector3(),minY=geometryMinY(geometry);
  points.forEach((pt,i)=>{const k=scale*(.86+.28*hash2(pt[0],pt[1],seed+17)),yaw=hash2(pt[0],pt[1],seed+23)*Math.PI*2;q.setFromAxisAngle(new THREE.Vector3(0,1,0),yaw);p.set(pt[0],field.heightAt(pt[0],pt[1])-minY*k,pt[1]);s.setScalar(k);M.compose(p,q,s);mesh.setMatrixAt(i,M)});
  mesh.instanceMatrix.needsUpdate=true;return mesh;
}

export function buildNatureGroup(plan,field,palette){
  const group=new THREE.Group();group.name='R2D source-proven procedural nature';
  const R=rng(plan.seed*101+5),all=[];
  const free=(x,z)=>field.maskAt(x,z)==='veg';
  const scatter=(n,cx,cz,r0,r1,minD,test,tries=300)=>{const out=[];for(let k=0;k<tries&&out.length<n;k++){const a=R()*Math.PI*2,rr=r0+(r1-r0)*Math.sqrt(R()),x=cx+Math.cos(a)*rr,z=cz+Math.sin(a)*rr;if(!test(x,z)||[...out,...all].some(o=>Math.hypot(o[0]-x,o[1]-z)<minD))continue;out.push([x,z])}all.push(...out);return out};
  const centres=scatter(3,plan.c0[0],plan.c0[1],0,40,15,(x,z)=>free(x,z)&&-plan.sdf(x,z)>8,1200);
  const trees=[],bushes=[],boulders=[];
  const entry=plan.plazas.find(p=>p.kind==='big')||{x:plan.c0[0],z:plan.c0[1]};
  // Preserve native P1 geometry; keep tall vegetation out of the entry/camera corridor.
  const treeFree=(x,z)=>free(x,z)&&Math.hypot(x-entry.x,z-entry.z)>18;
  centres.forEach(c=>{trees.push(...scatter(2,c[0],c[1],0,5,3.4,treeFree));bushes.push(...scatter(2,c[0],c[1],3.5,7,2.2,free));boulders.push(...scatter(1,c[0],c[1],5,8,2,free))});
  const edge=scatter(5,plan.c0[0],plan.c0[1],0,60,5,(x,z)=>{const e=-plan.sdf(x,z);return field.maskAt(x,z)==='edge'&&e>.8&&e<2.6},1500);
  const detailAnchor=plan.plazas.find(p=>p.kind==='big')||{x:plan.c0[0],z:plan.c0[1]};
  const detail=scatter(4,detailAnchor.x,detailAnchor.z,7,13,2.5,free,600);
  const mats={
    tree:new THREE.MeshStandardMaterial({color:palette.grass2||palette.grass,roughness:1}),
    bush:new THREE.MeshStandardMaterial({color:palette.grass,roughness:1}),
    rock:new THREE.MeshStandardMaterial({color:palette.rock||palette.lip,roughness:1}),
    wood:new THREE.MeshStandardMaterial({color:'#70583f',roughness:1}),
    mush:new THREE.MeshStandardMaterial({color:'#9c5f49',roughness:1}),
    grass:new THREE.MeshStandardMaterial({color:palette.grass2||palette.grass,roughness:1})
  };
  const items=[
    instanced('P1 soft trees',buildP0BTreeGeometry(),trees,mats.tree,field,plan.seed,1),
    instanced('P1 cushion bushes',buildT3BushGeometry(plan.seed+1801,1),bushes,mats.bush,field,plan.seed+1,.28),
    instanced('P1 boulders',buildK1BoulderGeometry(),boulders,mats.rock,field,plan.seed+2,1),
    instanced('P1 accent edge rocks',buildT3AccentRockGeometry(plan.seed+1701,1),edge,mats.rock,field,plan.seed+3,.9)
  ].filter(Boolean);
  items.forEach(x=>group.add(x));
  if(detail.length){
    const [a,b,c,d]=detail;
    const addOne=(name,g,pt,mat,scale)=>{const m=instanced(name,g,[pt],mat,field,plan.seed+11,scale);if(m)group.add(m)};
    addOne('P2 log',buildSoftLogSeparatorGeometry(),a,mats.wood,1);
    addOne('P2 stump',buildSoftStumpDetailedGeometry(),b,mats.wood,1);
    addOne('P2 mushroom family',buildSoftMushroomGroup3Geometry(),c,mats.mush,1);
    addOne('P2 grass group',buildSoftGrassTuftGeometry(),d,mats.grass,1.1);
  }
  return{group,report:{centres:centres.length,trees:trees.length,bushes:bushes.length,boulders:boulders.length,edgeRocks:edge.length,p2Details:Math.min(4,detail.length)}};
}

export function mountR2DPresentation({group,supportTerrain,plan,field,palette,lifeTreeRecipe=null}){
  if(supportTerrain)supportTerrain.visible=false;
  const body=buildIslandBody(plan,field,palette,lifeTreeRecipe);
  const topMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0});
  const underMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0});
  const top=new THREE.Mesh(body.top,topMat);top.name='R2D continuous island top';top.castShadow=top.receiveShadow=true;
  const under=new THREE.Mesh(body.under,underMat);under.name='R2D floating island underside';under.castShadow=under.receiveShadow=true;
  group.add(top,under);
  const water=buildWaterGroup(plan,field,palette);group.add(water.group);
  const nature=buildNatureGroup(plan,field,palette);group.add(nature.group);
  const presentationSource={commit:'8614726082b820fed1795c105b2581265985c9fd',path:'tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/r2d-presentation.v1.js'};
  for(const mesh of [top,under])mesh.userData.sourceRecord={assetId:mesh.name,packId:'R2D source-derived island',source:presentationSource,lineage:SOURCE.r2dDonorBlob};
  water.group.userData.sourceRecord={assetId:'R2D native water',packId:'R2D source-derived water',source:presentationSource,lineage:SOURCE.r2dDonorBlob};
  nature.group.traverse(o=>{if(o.isMesh){const p2=o.name.startsWith('P2');o.userData.sourceRecord={assetId:o.name,packId:p2?'KFB Environment P2':'KFB Environment P1',source:{commit:'8614726082b820fed1795c105b2581265985c9fd',path:'tools/KFB-ToolBox/worldbuilder/world-corridor-01/'+(p2?'procedural-environment-p2/environment-family-p2.mjs':'procedural-props-local-proof/environment-family-p1.mjs'),blobSha:p2?SOURCE.p2Blob:SOURCE.p1Blob}}}});
  const natureBases=[];nature.group.traverse(o=>{if(o.isInstancedMesh){const matrices=[];for(let i=0;i<o.count;i++){const m=new THREE.Matrix4();o.getMatrixAt(i,m);matrices.push(m)}natureBases.push({mesh:o,matrices})}});
  return{
    report:{schema:SCHEMA,depth:body.depth,bodyVertices:body.vertices,underside:true,...water.report,nature:nature.report},
    refreshSurface(heightAt){
      // This is the existing WB2 sculpt truth projected onto its visible R2D mesh.
      // Underside shape, island topology and Track support remain their existing owners.
      const pos=body.top.attributes.position;for(let i=0;i<45*plan.NA;i++){const x=pos.getX(i),z=pos.getZ(i);pos.setY(i,heightAt(x,z))}pos.needsUpdate=true;
      body.top.computeVertexNormals();body.top.computeBoundingBox();body.top.computeBoundingSphere();body.under.computeBoundingBox();body.under.computeBoundingSphere();
      for(const {mesh,matrices} of natureBases){matrices.forEach((base,i)=>{const m=base.clone(),x=m.elements[12],z=m.elements[14];m.elements[13]+=heightAt(x,z)-field.heightAt(x,z);mesh.setMatrixAt(i,m)});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere()}
    },
    dispose(){group.remove(top,under,water.group,nature.group);body.top.dispose();body.under.dispose()}
  };
}

