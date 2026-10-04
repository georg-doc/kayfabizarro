/* KFB R2D archipelago composition v1
 * PURE WORLD DATA. No renderer, scene, camera, input, movement or material owner.
 * Composes the proven R2D island core into data-driven translated nodes and
 * asks the existing Track Core to compile every inter-island connection.
 */
import {makeIslandCore} from './r2d-island-core.v1.js';

export const SCHEMA='kfb.r2d-archipelago/1';

const add3=(p,dx,dy,dz)=>[p[0]+dx,p[1]+dy,p[2]+dz];
const add2=(p,dx,dz)=>[p[0]+dx,p[1]+dz];
const headingDegFromVector=(dx,dz)=>Math.atan2(-dx,dz)*180/Math.PI;

function translateStream(stream,dx,dy,dz){
  const shiftPoint=p=>p?add3(p,dx,dy,dz):p;
  return {
    ...stream,
    samples:(stream.samples||[]).map(q=>({...q,p:shiftPoint(q.p)})),
    joints:(stream.joints||[]).map(j=>({...j,p:shiftPoint(j.p)}))
  };
}
function translateCreek(c,dx,dz){
  if(!c)return null;
  return {
    ...c,
    pts:c.pts.map(p=>add2(p,dx,dz)),
    cross:c.cross?add2(c.cross,dx,dz):null,
    lip:c.lip?{...c.lip,p:add2(c.lip.p,dx,dz)}:null,
    dist:(x,z)=>c.dist(x-dx,z-dz)
  };
}
function translatePlan(core,node){
  const L=core.plan, target=node.position||[0,0,0];
  const dx=target[0]-L.c0[0],dy=target[1]||0,dz=target[2]-L.c0[1];
  const mapPad=p=>({...p,x:p.x+dx,z:p.z+dz,h:p.h+dy});
  const plan={
    ...L,
    worldId:node.id,
    worldLabel:node.label,
    biome:node.biome,
    deckId:node.deckId||null,
    cardRefs:[...(node.cardRefs||[])],
    c0:[L.c0[0]+dx,L.c0[1]+dz],
    cells:(L.cells||[]).map(c=>({...c,xz:add2(c.xz,dx,dz)})),
    sdf:(x,z)=>L.sdf(x-dx,z-dz),
    roadDist:(x,z)=>L.roadDist(x-dx,z-dz),
    natural:(x,z)=>L.natural(x-dx,z-dz)+dy,
    roadY:L.roadY+dy,
    pads:(L.pads||[]).map(mapPad),
    plazas:(L.plazas||[]).map(mapPad),
    paths:(L.paths||[]).map(seg=>seg.map(p=>add2(p,dx,dz))),
    poly:(L.poly||[]).map(p=>add2(p,dx,dz)),
    pond:L.pond?{...L.pond,x:L.pond.x+dx,z:L.pond.z+dz,h:L.pond.h+dy}:null,
    creek:translateCreek(L.creek,dx,dz),
    stream:translateStream(L.stream,dx,dy,dz),
    recipe:{...L.recipe,start:{...L.recipe.start,p:add3(L.recipe.start.p,dx,dy,dz)}}
  };
  const field={
    heightAt:(x,z)=>core.field.heightAt(x-dx,z-dz)+dy,
    maskAt:(x,z)=>core.field.maskAt(x-dx,z-dz),
    weightsAt:(x,z)=>core.field.weightsAt(x-dx,z-dz)
  };
  return {id:node.id,recipe:node,plan,field,offset:[dx,dy,dz]};
}

function roadPoint(node,fraction){
  const s=node.plan.stream.samples||[];
  return s[Math.max(0,Math.min(s.length-1,Math.round((s.length-1)*fraction)))];
}
function endpointNearest(node,p){
  const s=node.plan.stream.samples||[];
  const ends=[s[0],s[s.length-1]].filter(Boolean);
  return ends.sort((a,b)=>Math.hypot(a.p[0]-p[0],a.p[2]-p[2])-Math.hypot(b.p[0]-p[0],b.p[2]-p[2]))[0];
}
function resolveAnchor(node,a){
  const P=node.plan,F=node.field,L=a.locator||{kind:'center'};
  let x=P.c0[0],z=P.c0[1],y=null,heading=0;
  if(L.kind==='plaza'){
    const q=P.plazas.find(p=>p.kind===(L.name||'big'))||P.plazas[0];
    if(q){x=q.x;z=q.z;y=q.h;}
  }else if(L.kind==='pad'){
    const q=P.pads[Math.max(0,Math.min(P.pads.length-1,L.index||0))];
    if(q){x=q.x;z=q.z;y=q.h;}
  }else if(L.kind==='road'){
    const q=roadPoint(node,L.fraction??.5);
    if(q){x=q.p[0];y=q.p[1];z=q.p[2];heading=Math.atan2(q.T?.[0]||0,q.T?.[2]||1);}
  }
  if(y==null)y=F.heightAt(x,z);
  const o=a.offset||[0,0,0];
  x+=o[0]||0;z+=o[2]||0;y=F.heightAt(x,z)+(o[1]||0);
  return {id:a.id,role:a.role,worldId:node.id,position:[+x.toFixed(3),+y.toFixed(3),+z.toFixed(3)],heading:+heading.toFixed(5),locator:L};
}

function makeBridge(connection,nodes,TC){
  const A=nodes.get(connection.from),B=nodes.get(connection.to);
  if(!A||!B)throw new Error('connection references unknown world '+connection.id);
  const start=roadPoint(A,connection.fromFraction??.5);
  const end=endpointNearest(B,start.p);
  if(!start||!end)throw new Error('connection road sample missing '+connection.id);
  const dx=end.p[0]-start.p[0],dz=end.p[2]-start.p[2];
  const towardB=headingDegFromVector(dx,dz);
  const intoB=headingDegFromVector(B.plan.c0[0]-end.p[0],B.plan.c0[1]-end.p[2]);
  const recipe={
    schema:'kfb.route-recipe/0.1-draft',
    id:connection.id,
    label:connection.id+' · ROAD_BRIDGE',
    start:{p:[...start.p],headingDeg:towardB},
    defaults:{widthClass:'NARROW',markings:'STREET'},
    pieces:[{
      id:connection.id+'.connect',
      type:'CONNECT',
      to:{p:[...end.p],headingDeg:intoB,grade:0},
      tags:['ROAD_BRIDGE',connection.from,connection.to],
      drive:{mode:'free'}
    }]
  };
  const stream=TC.compileRecipe(recipe);
  return {
    ...connection,
    schema:'kfb.world-connection/0.1',
    owner:'Track Core',
    recipe,
    stream,
    fromPoint:[...start.p],
    toPoint:[...end.p],
    sampleCount:stream.samples.length,
    lengthM:+((stream.samples.at(-1)?.s)||0).toFixed(2)
  };
}

export function makeArchipelago(recipeSet,TC){
  if(recipeSet?.schema!=='kfb.world-recipe-set/0.1')throw new Error('unexpected world recipe set');
  const list=recipeSet.nodes.map(r=>translatePlan(makeIslandCore(r.seed,TC,r.shape||'frei'),r));
  const nodes=new Map(list.map(n=>[n.id,n]));
  for(const n of list)n.anchors=(n.recipe.anchors||[]).map(a=>resolveAnchor(n,a));
  const connections=recipeSet.connections.map(c=>makeBridge(c,nodes,TC));
  const anchorMap=new Map(list.flatMap(n=>n.anchors.map(a=>[a.id,a])));
  let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
  for(const n of list){
    const r=Math.max(...n.plan.edgeR);
    minX=Math.min(minX,n.plan.c0[0]-r);maxX=Math.max(maxX,n.plan.c0[0]+r);
    minZ=Math.min(minZ,n.plan.c0[1]-r);maxZ=Math.max(maxZ,n.plan.c0[1]+r);
  }
  for(const c of connections)for(const q of c.stream.samples||[]){
    minX=Math.min(minX,q.p[0]);maxX=Math.max(maxX,q.p[0]);minZ=Math.min(minZ,q.p[2]);maxZ=Math.max(maxZ,q.p[2]);
  }
  const margin=35,cx=(minX+maxX)/2,cz=(minZ+maxZ)/2,size=Math.ceil(Math.max(maxX-minX,maxZ-minZ)+margin*2);
  return {
    schema:SCHEMA,id:recipeSet.id,recipeSet,nodes:list,nodeMap:nodes,connections,anchorMap,
    bounds:{minX,minZ,maxX,maxZ,cx,cz,size,margin},
    worldGraph:{
      schema:'kfb.world-graph/0.1',
      id:recipeSet.id,
      nodes:list.map(n=>({id:n.id,label:n.recipe.label,deckId:n.recipe.deckId||null,cardRefs:[...(n.recipe.cardRefs||[])],biome:n.recipe.biome,position:[...n.recipe.position],anchors:n.anchors})),
      connections:connections.map(c=>({id:c.id,kind:c.kind,from:c.from,to:c.to,owner:c.owner,sampleCount:c.sampleCount,lengthM:c.lengthM}))
    }
  };
}
