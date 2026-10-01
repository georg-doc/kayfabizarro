import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeClayMaterial } from '../clay-perf/clay-material.v10-partsdiag.js';

const smoothstep=(a,b,x)=>{const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const underShade=(bottom,top,dark=.74)=>(_x,y)=>dark+(1-dark)*smoothstep(bottom,top,y);

function rng(seed){let a=seed>>>0;return()=>{a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}

function paint(g,color,shade=null){
  if(g.getAttribute('uv')) g.deleteAttribute('uv');
  const p=g.getAttribute('position'),c=new THREE.Color(color),arr=new Float32Array(p.count*3);
  for(let i=0;i<p.count;i++){
    const k=shade?shade(p.getX(i),p.getY(i),p.getZ(i)):1;
    arr[i*3]=c.r*k;arr[i*3+1]=c.g*k;arr[i*3+2]=c.b*k;
  }
  g.setAttribute('color',new THREE.BufferAttribute(arr,3));
  return g;
}
function finish(g,seed=.37){
  const n=g.getAttribute('position').count;
  const a=new Float32Array(n*3);
  for(let i=0;i<n;i++){a[i*3]=seed;a[i*3+1]=seed*.61;a[i*3+2]=seed*.29;}
  g.setAttribute('claySeed',new THREE.BufferAttribute(a,3));
  if(!g.getAttribute('color')){
    const c=new Float32Array(n*3).fill(1);
    g.setAttribute('color',new THREE.BufferAttribute(c,3));
  }
  g.computeVertexNormals();
  return g;
}
function merge(parts,seed){
  const indexed=parts.every(p=>p.index);
  const list=indexed?parts:parts.map(p=>p.index?p.toNonIndexed():p);
  const g=mergeGeometries(list,false);
  for(const p of new Set([...parts,...list])) if(p!==g) p.dispose();
  return finish(g,seed);
}
function lathe(pts,segments=12){return new THREE.LatheGeometry(pts.map(([r,y])=>new THREE.Vector2(r,y)),segments);}
function trunkGeometry(height=.9,base=.12,top=.075,roots=4,segments=12){
  const g=lathe([[base*1.5,0],[base*1.08,height*.07],[base*.86,height*.22],[(base*.86+top)/2,height*.6],[top,height]],segments);
  const p=g.getAttribute('position');
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),z=p.getZ(i),flare=Math.max(0,1-p.getY(i)/(height*.3));
    const lobe=1+.28*flare*Math.max(0,Math.cos(roots*Math.atan2(x,z)))**2;
    p.setXYZ(i,x*lobe,p.getY(i),z*lobe);
  }
  return g;
}
function blob(x,y,z,r,color,squash=1,ws=18,hs=12,dark=.74){
  const g=new THREE.SphereGeometry(r,ws,hs);
  g.scale(1,squash,1); paint(g,color,underShade(-r*squash,r*squash*.55,dark)); g.translate(x,y,z); return g;
}
function tuftGeometry(){
  const parts=[],blades=[[.3,.01,.62,.12,1.1],[1.4,.05,.48,.45,1],[2.5,.05,.55,.35,1.05],[3.6,.06,.38,.55,.9],[4.6,.05,.46,.4,1],[5.5,.06,.34,.6,.85]];
  for(const [a,d,h,lean,w] of blades){
    const g=new THREE.CylinderGeometry(.014*w,.052*w,h,6,4,true);
    g.scale(.48,1,1);g.translate(0,h/2,0);
    const p=g.getAttribute('position');
    for(let i=0;i<p.count;i++){const t=p.getY(i)/h;p.setX(i,p.getX(i)+lean*h*t*t);}
    paint(g,'#ffffff',underShade(0,h,.7));g.rotateY(-a);g.translate(Math.cos(a)*d,0,Math.sin(a)*d);parts.push(g);
  }
  return merge(parts,.11);
}
function pebbleGeometry(){
  const a=new THREE.SphereGeometry(.43,16,10);a.scale(1,.58,.82);paint(a,'#ffffff',underShade(-.25,.25,.78));a.translate(-.07,.25,0);
  const b=new THREE.SphereGeometry(.24,14,9);b.scale(1,.72,.88);paint(b,'#eee7de',underShade(-.14,.18,.8));b.translate(.37,.14,.16);
  return merge([a,b],.22);
}
function treeTrunkGeometry(){
  const g=trunkGeometry(1.18,.14,.085,5,14); paint(g,'#8d6a4c',underShade(0,.8,.76)); return finish(g,.33);
}
function treeCrownGeometry(){
  return merge([
    blob(0,1.46,0,.58,'#ffffff',.92,20,13,.7),
    blob(-.34,1.24,-.12,.38,'#dce7d1',1,18,12,.72),
    blob(.18,1.82,.1,.36,'#eef2d7',1,18,12,.74),
    blob(.34,1.32,.08,.32,'#e8edd7',.96,16,11,.73)
  ],.44);
}
function clayMaterial(api,color){
  const src=new THREE.MeshStandardMaterial({color,roughness:.82,metalness:0,vertexColors:true});
  const m=makeClayMaterial(THREE,api.U,{src,role:'world',proc:false,objSize:2});
  src.dispose();
  return m;
}
function hashCell(c,seed){let h=Math.imul((c.q|0)+101,374761393)^Math.imul((c.r|0)-77,668265263)^seed;h=Math.imul(h^(h>>>13),1274126177);return(h^(h>>>16))>>>0;}
function pickCells(cells,count,seed){
  return cells.slice().sort((a,b)=>hashCell(a,seed)-hashCell(b,seed)).slice(0,count);
}
function addInstances(group,geometry,material,placements,palette,seed,baseScale){
  const mesh=new THREE.InstancedMesh(geometry,material,placements.length);
  mesh.castShadow=true;mesh.receiveShadow=true;
  const R=rng(seed),m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(),up=new THREE.Vector3(0,1,0),col=new THREE.Color();
  placements.forEach((v,i)=>{
    const k=baseScale*(.86+R()*.28);
    p.set(v.x,v.y,v.z);q.setFromAxisAngle(up,R()*Math.PI*2);s.set(k,k*(.92+R()*.16),k);m.compose(p,q,s);mesh.setMatrixAt(i,m);
    if(palette){col.set(palette[Math.floor(R()*palette.length)]);mesh.setColorAt(i,col);}
  });
  mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  group.add(mesh);return mesh;
}

export function mountProceduralPropsP0B(api,{islandId='burg'}={}){
  const I=api.world.islands.find(x=>x.id===islandId);
  if(!I) throw new Error('P0B island not found: '+islandId);
  const worldPos=c=>({x:I.pos[0]+c.x,y:I.pos[1]+(c.lift||0)+.18,z:I.pos[2]+c.z});
  const freeGrass=I.cells.filter(c=>c.type==='grass'&&!c.path&&!c.used&&!c.edge);
  const freeEdge=I.cells.filter(c=>(c.type==='sand'||c.edge)&&!c.path&&!c.used);
  const trees=pickCells(freeGrass,12,301).map(worldPos);
  const treeKeys=new Set(trees.map(v=>v.x.toFixed(2)+':'+v.z.toFixed(2)));
  const tufts=pickCells(freeGrass.filter(c=>!treeKeys.has((I.pos[0]+c.x).toFixed(2)+':'+(I.pos[2]+c.z).toFixed(2))),16,401).map(worldPos);
  const pebbles=pickCells(freeEdge.length?freeEdge:I.cells.filter(c=>!c.path&&!c.used),12,501).map(worldPos);

  const group=new THREE.Group();group.name='KFB_PROC_PROPS_P0B';
  const tuft=addInstances(group,tuftGeometry(),clayMaterial(api,'#ffffff'),tufts,['#6f9e4f','#7eaa59','#91b966','#628d49'],601,4.0);
  tuft.name='P0B_TUFT';
  const pebble=addInstances(group,pebbleGeometry(),clayMaterial(api,'#ffffff'),pebbles,['#8f7c69','#a58f79','#b59d86','#7e6e61'],701,5.0);
  pebble.name='P0B_PEBBLE';
  const trunk=addInstances(group,treeTrunkGeometry(),clayMaterial(api,'#76543e'),trees,null,801,3.5);trunk.name='P0B_TREE_TRUNK';
  const crown=addInstances(group,treeCrownGeometry(),clayMaterial(api,'#ffffff'),trees,['#5f963f','#70a64c','#81b258','#56873b'],801,3.5);crown.name='P0B_TREE_CROWN';

  api.addDiagnosticObject(group);
  const triangles=[tuft,pebble,trunk,crown].reduce((sum,m)=>sum+(m.geometry.index?m.geometry.index.count/3:m.geometry.getAttribute('position').count/3)*m.count,0);
  return {
    group,
    meshes:[tuft,pebble,trunk,crown],
    counts:{tufts:tufts.length,pebbles:pebbles.length,trees:trees.length,meshInstances:tufts.length+pebbles.length+trees.length*2},
    estimatedTriangles:Math.round(triangles),
    setVisible(v){group.visible=!!v;},
    dispose(){api.removeDiagnosticObject(group);group.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});}
  };
}
