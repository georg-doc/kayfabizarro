/* WB2-owned, seeded signature recipes. New authored branch/root grammar under the
 * four-island brief; crown clumps preserve the H0 Icosahedron-in-Icosahedron donor.
 * No animation loop, scene, renderer, random global state or separate save owner. */
import {checkFootprint,protectedAnchors} from './world-clearance.v1.mjs';
export const PALETTES=Object.freeze({
 burg:{grass:'#7cba48',grass2:'#6aa83c',paved:'#e8dcc6',sand:'#e3c98f',rock:'#9b6b4a',lip:'#5f9a38',hill:'#6fae40',water:'#5aa6d6'},
 dystopia:{grass:'#9a74cc',grass2:'#8a66bd',paved:'#d4c8da',sand:'#b591d9',rock:'#6e4a3a',lip:'#7a58aa',hill:'#8b66c2',water:'#5f8fae'},
 utopia:{grass:'#a6d7a8',grass2:'#bfe3b4',paved:'#f3ecdf',sand:'#f1dcb5',rock:'#cdb59a',lip:'#8cc497',hill:'#9ccf9e',water:'#7cc4e4'},
 protopia:{grass:'#6aae3a',grass2:'#88b840',paved:'#e6d3a8',sand:'#d9b04a',rock:'#8a5634',lip:'#58932f',hill:'#5f9f34',water:'#4fa3c9'}
});
const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
const hashText=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const SPECS={
 burg:{height:29,radius:3.5,lean:[-1,2],branches:[[70,180],[180,-65],[-200,95]],levels:[.69,.88,.77],reach:[13,16,14],crownScale:[1.25,.85,1.15],rootCount:7,motifs:['layered-bark','three-future-branches','healed-seams']},
 dystopia:{height:35,radius:2.7,lean:[7,-4],branches:[[-1,.2],[.1,1],[1,.6]],levels:[.47,.69,.95],reach:[8,7,13],crownScale:[.65,1.25,.7],rootCount:5,motifs:['scar','constricted-loop','warning-scar']},
 utopia:{height:31,radius:2.9,lean:[0,0],branches:[[1,0],[0,1],[-1,0],[0,-1]],levels:[.8,.8,.8,.8],reach:[12,12,12,12],crownScale:[1.15,.65,1.15],rootCount:6,motifs:['ordered-fork','maintenance-seam','public-canopy']},
 protopia:{height:27,radius:3.3,lean:[-3,-1],branches:[[1,.3],[-.4,1],[-1,-.3],[.2,-1]],levels:[.6,.85,.73,.96],reach:[13,9,14,8],crownScale:[1.1,1,1.15],rootCount:8,motifs:['graft','repair-collar','shared-root-niches']}
};
export function signatureRecipe(node,corridors){
 const {recipe,plan,field}=node,spec=SPECS[recipe.biome];if(!spec)throw Error('Unknown Life Tree palette');
 const seed=hashText(JSON.stringify([recipe.id,recipe.seed,recipe.deckId,recipe.cardRefs,recipe.motifTags,recipe.biome]));
 const constraints={corridors,anchors:protectedAnchors(node.anchors),setback:1.2};
 const candidates=[];
 for(let dx=-42;dx<=42;dx+=2)for(let dz=-42;dz<=42;dz+=2){const x=plan.c0[0]+dx,z=plan.c0[1]+dz,r=spec.radius+1;
  const poly=Array.from({length:16},(_,i)=>[x+Math.cos(i*Math.PI/8)*r,z+Math.sin(i*Math.PI/8)*r]);
  if(poly.some(p=>plan.sdf(...p)>-2)||checkFootprint(poly,constraints).length)continue;
  candidates.push({x,z,score:Math.hypot(dx,dz)+hash(seed+dx*31+dz)*.1});
 }
 candidates.sort((a,b)=>a.score-b.score);if(!candidates.length)throw Error('No central protected Life Tree clearance: '+node.id);
 const {x,z}=candidates[0];
 return {schema:'kfb.signature-life-tree/1',id:node.id+'/life-tree',worldId:node.id,seed,worldSeed:recipe.seed,deckId:recipe.deckId,cardRefs:[...recipe.cardRefs],motifTags:[...recipe.motifTags],paletteKey:recipe.biome,
 position:[x,field.heightAt(x,z),z],trunkProfile:{height:spec.height,radius:spec.radius,lean:spec.lean,layered:recipe.biome==='burg'},
 branchGrammar:{directions:spec.branches,levels:spec.levels,reach:spec.reach},crownGrammar:{source:'H0 sphere-in-sphere',scale:spec.crownScale},
 surfaceRootGrammar:{count:spec.rootCount,burrowAtTrack:true,protectAnchors:true},hangingRootGrammar:{asymmetric:true,branchesPerRoot:2,taper:'.02 at organic tips'},embeddedPropMotifs:spec.motifs,livingLevel:'crown breath, WB2 tick',clearanceRadius:spec.radius+1,
 sourceRefs:[{commit:'425d07d25cde5a66703561be616bb23fb866f4d7',path:'WSA_FOUR_ISLAND_JOYRIDE_SSOT_REBRIEF_2026-10-04.md'},
 {blob:'069149449047ca88e9cd2792de041d1ef8f03ef7',path:'brain-world.v8.js',lines:'474–498',seam:'crown clumps at recipe branch tips; new branch/root grammar'},
 {blob:'46f7b65cc54db9b4a21cc64ef1abe56833c7c948',path:'plant-recipe.js',seam:'deterministic PlantRoot / CrownPivot recipe contract'}]};
}
export function createLifeTree(THREE,recipe,plan,field,{corridors=[],anchors=[],buildings=[]}={}){
 const root=new THREE.Group();root.name='Signature Life Tree · '+recipe.worldId;const crown=new THREE.Group();crown.name='CrownPivot';root.add(crown);
 const pal=PALETTES[recipe.paletteKey],mat=new THREE.MeshStandardMaterial({color:pal.rock,roughness:1}),leaf=new THREE.MeshStandardMaterial({color:pal.grass,roughness:1}),accent=new THREE.MeshStandardMaterial({color:pal.sand,roughness:1});
 const [x,y,z]=recipe.position,H=recipe.trunkProfile.height,B=recipe.trunkProfile.radius,L=recipe.trunkProfile.lean,S=recipe.seed,obstacles=[];
 const vec=p=>new THREE.Vector3(...p);
 function tube(points,r0,r1,name,material=mat,parent=root){
  const curve=new THREE.CatmullRomCurve3(points.map(vec)),N=Math.max(12,points.length*8),sides=10,frames=curve.computeFrenetFrames(N,false),pos=[],idx=[];
  for(let i=0;i<=N;i++){const t=i/N,p=curve.getPointAt(t),r=r0*Math.pow(1-t,.85)+r1*t;
   for(let j=0;j<sides;j++){const a=j/sides*Math.PI*2,k=1+.045*Math.sin(j*2.7+t*9+S%31),q=p.clone().addScaledVector(frames.normals[i],Math.cos(a)*r*k).addScaledVector(frames.binormals[i],Math.sin(a)*r*k);pos.push(q.x,q.y,q.z)}
   if(i)for(let j=0;j<sides;j++){const a=(i-1)*sides+j,b=(i-1)*sides+(j+1)%sides,c=i*sides+j,d=i*sides+(j+1)%sides;idx.push(a,c,b,b,c,d)}
  }
  for(const [row,reverse] of [[0,true],[N,false]]){const p=curve.getPointAt(row/N),center=pos.length/3;pos.push(p.x,p.y,p.z);for(let j=0;j<sides;j++){const a=row*sides+j,b=row*sides+(j+1)%sides;idx.push(...(reverse?[center,b,a]:[center,a,b]))}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();const m=new THREE.Mesh(g,material);m.name=name;m.castShadow=m.receiveShadow=true;parent.add(m);return m;
 }
 tube([[x,y-5,z],[x-L[0]*.2,y+H*.17,z-L[1]*.2],[x+L[0]*.35,y+H*.55,z+L[1]*.35],[x+L[0],y+H,z+L[1]]],B,.7,'PlantRoot · continuous trunk');
 obstacles.push({id:recipe.id,point:[x,z],radius:B,kind:'root'});
 const tips=[];
 recipe.branchGrammar.directions.forEach((d,k)=>{const l=Math.hypot(...d),reach=recipe.branchGrammar.reach[k],level=recipe.branchGrammar.levels[k],tip=[x+L[0]+d[0]/l*reach,y+H*level+5,z+L[1]+d[1]/l*reach];tips.push(tip);
  tube([[x+L[0]*.4,y+H*level*.67,z+L[1]*.4],[x+d[0]/l*reach*.5,y+H*level,z+d[1]/l*reach*.5],tip],B*.58,.5,'signature branch '+k);
  // H0 donor 488–498: native Icosahedron clumps; placement/scale are explicit recipe seams.
  const big=recipe.paletteKey==='burg'?25:recipe.paletteKey==='utopia'?24:20,h=0,nball=3+Math.floor(hash(S+k*7)*3),tint=new THREE.Color(pal.grass).lerp(new THREE.Color(pal.grass2),hash(S+k)*.55);
  for(let b=0;b<nball;b++){const r=(.15+hash(S+k*11+b)*.13)*big,a=hash(S+k+b*13)*6.28,off=b?.15*big:0,g=new THREE.IcosahedronGeometry(r,2);g.scale(...recipe.crownGrammar.scale);g.translate(tip[0]+Math.cos(a)*off,tip[1]+h+r*.6+(b?hash(k+b)*.25*big:.1),tip[2]+Math.sin(a)*off);const m=new THREE.Mesh(g,leaf.clone());m.material.color.copy(tint).offsetHSL(0,0,(hash(S+b+k)-.5)*.06);m.castShadow=m.receiveShadow=true;m.name='H0 clay crown '+k+'/'+b;crown.add(m)}
 });
 // Roots leave the same trunk, follow the earth, then split below its ragged rim.
 // They burrow below protected route/activity footprints instead of moving those owners.
 for(let k=0;k<recipe.surfaceRootGrammar.count;k++){
  const a=k/recipe.surfaceRootGrammar.count*Math.PI*2+(hash(S+k*17)-.5)*.45,ca=Math.cos(a),sa=Math.sin(a);let rr=5;
  while(rr<90&&plan.sdf(x+ca*rr,z+sa*rr)<0)rr+=.5;
  const points=[[x,y-1,z]];
  for(let j=1;j<=16;j++){const t=j/16,d=rr*t,px=x+ca*d+Math.sin(t*Math.PI)*2*(hash(S+k)-.5),pz=z+sa*d,r=B*.58*(1-t)+.18;
   const p=[[px-r,pz-r],[px+r,pz-r],[px+r,pz+r],[px-r,pz+r]],blocked=checkFootprint(p,{corridors,anchors,buildings,setback:1}).length>0;
   const py=field.heightAt(px,pz)+(blocked?-r-1:-r*.3);points.push([px,py,pz]);if(!blocked&&t>.15)obstacles.push({id:recipe.id+'/surface/'+k+'/'+j,point:[px,pz],radius:r+.25,kind:'root'});
  }

  const end=points.at(-1),depth=12+hash(S+k*29)*15,bend=(hash(S+k*41)-.5)*12;
  const mid=[end[0]-ca*4-sa*bend,end[1]-depth*.6,end[2]-sa*4+ca*bend],tip=[mid[0]-ca*3+sa*2, end[1]-depth,mid[2]-sa*3-ca*2];
  tube([[x,y-3,z],[x+ca*rr*.45,y-8-k%3,z+sa*rr*.45],[end[0]-ca*2,end[1]-4,end[2]-sa*2]],B*.8,1.3,'buried structural root '+k);
  tube([...points,[end[0]-ca*2,end[1]-4,end[2]-sa*2],mid,tip],B*.62,.025,'continuous surface and hanging root '+k);
  for(let b=0;b<2;b++)tube([mid,[mid[0]+ca*(3+b*3),mid[1]-3,mid[2]+sa*(3+b*3)], [mid[0]+ca*(4+b*4)+sa*2,mid[1]-7-b*2,mid[2]+sa*(4+b*4)-ca*2]],.65,.02,'root fork '+k+'/'+b);
 }
 // Authored biography is geometry, not merely recipe tags.
 if(recipe.paletteKey==='burg')for(let k=0;k<5;k++){
  const a=k*2.3,yy=y+3+k*2.5,rad=B*(1-(yy-y)/H*.5);
  tube([[x+Math.cos(a)*rad,yy-1,z+Math.sin(a)*rad],[x+Math.cos(a+.35)*rad,yy,z+Math.sin(a+.35)*rad],[x+Math.cos(a+.7)*rad,yy+2,z+Math.sin(a+.7)*rad]],.5,.22,'layered old bark '+k);
 }
 if(recipe.paletteKey==='dystopia'){
  const loop=[];for(let k=0;k<=24;k++){const a=k/24*Math.PI*2;loop.push([x+L[0]*.4+Math.cos(a)*3,y+H*.43+Math.sin(a)*1.8,z+L[1]*.4+Math.sin(a)*2.4])}tube(loop,.3,.3,'constriction loop',mat);
  for(let k=0;k<3;k++){const yy=y+8+k*3;tube([[x+L[0]*.3-1,yy,z+2],[x+L[0]*.35,yy+1,z+2.4],[x+L[0]*.4+1,yy+1.4,z+2]],.16,.1,'healed warning scar '+k,accent)}
 }
 // Explicit readable maintenance / graft seams, rather than decorative foreign props.
 if(recipe.paletteKey==='protopia'||recipe.paletteKey==='utopia')for(let k=0;k<3;k++){
  const yy=y+H*(.27+k*.12),g=new THREE.TorusGeometry(B*(.85-k*.09),.14,6,20);g.rotateX(Math.PI/2);g.translate(x+L[0]*(yy-y)/H,yy,z+L[1]*(yy-y)/H);const m=new THREE.Mesh(g,accent);m.name=recipe.paletteKey==='protopia'?'graft repair':'maintenance seam';root.add(m);
 }
 root.userData.signatureLifeTree=recipe;root.userData.sourceRecord={assetId:recipe.id,packId:'KFB Signature Life Tree / H0',source:{commit:'425d07d25cde5a66703561be616bb23fb866f4d7',path:'signature-life-tree.v1.mjs',blobSha:null}};
 return {root,obstacles,recipe,tick(time){crown.position.x=Math.sin(time*.55+S%19)*.045;crown.position.z=Math.cos(time*.43+S%23)*.04},dispose(){root.traverse(o=>{o.geometry?.dispose();if(o.isMesh)o.material.dispose()})}};
}
