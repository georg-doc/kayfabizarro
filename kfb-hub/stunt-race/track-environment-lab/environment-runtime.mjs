import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clamp,hash,rng,TAU,makeRouteQuery,makeTerrain} from './placement-rules.mjs';

// Visual-only donor. This module never obtains writable Race state, mesh, camera or contact APIs.
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const dimensions=new Map(),models=new Map();
const raw=a=>'https://raw.githubusercontent.com/'+a.sourceRepo+'/'+a.revision+'/'+a.sourcePath.split('/').map(encodeURIComponent).join('/');
export async function createEnvironment(port,manifest,recipes,onProgress=()=>{}){
  const entries=manifest.assets||manifest,loader=new GLTFLoader();let completed=0;
  const needed=new Set(['gate-finish','item-banana','item-coin-gold','item-cone','grandStand','grandStandRound','tent','flagCheckers','barrierRed','barrierWhite','treeLarge','treeSmall','building_A_withoutBase','building_B_withoutBase','watertower','streetlight','bench','box_A','bush','car_hatchback','car_sedan']);
  const queue=entries.filter(a=>needed.has(a.id));
  if(queue.length!==needed.size)throw Error('Exact AssetRefs missing: '+[...needed].filter(id=>!queue.some(a=>a.id===id)).join(', '));
  await Promise.all(Array.from({length:4},async()=>{
    while(queue.length){const a=queue.shift(),scene=(await loader.loadAsync(raw(a))).scene;
      scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(scene),size=bounds.getSize(V()),center=bounds.getCenter(V());
      // Flatten only static glTF node transforms; retain original geometry and materials.
      const unit=new THREE.Group();
      scene.traverse(n=>{if(n.isMesh){if(n.isSkinnedMesh)throw Error('Static environment received a skin: '+a.id);const mesh=new THREE.Mesh(n.geometry,n.material);mesh.matrixAutoUpdate=false;mesh.matrix.copy(n.matrixWorld);unit.add(mesh)}});
      const norm=new THREE.Group();norm.add(unit);unit.position.set(-center.x,-bounds.min.y,-center.z);unit.updateMatrix();
      models.set(a.id,norm);dimensions.set(a.id,{size:size.toArray(),originalBounds:[bounds.min.toArray(),bounds.max.toArray()],blobSha:a.blobSha});
      onProgress(++completed,needed.size);
    }
  }));
  const samples=port.samples(),query=makeRouteQuery(samples),baseline=port.diagnostics();
  let current=null,enabled=true,layerState={landmarks:true,near:true,mid:true,terrain:true,far:true,sky:true};
  let activeRecipe=recipes.recipes[0],seed=recipes.defaultSeed,revision=0;
  function destroy(env){if(!env)return;port.detach(env.root);for(const g of env.generatedGeometry)g.dispose();for(const m of env.generatedMaterial)m.dispose();for(const o of env.instances)o.dispose();}
  function build(recipe,worldSeed){
    const root=new THREE.Group();root.name='KFB Environment donor';
    const layers={},generatedGeometry=[],generatedMaterial=[],instances=[],placements=[],rejected=[],batches=new Map();
    for(const key of Object.keys(layerState)){layers[key]=new THREE.Group();layers[key].name=key;root.add(layers[key]);layers[key].visible=layerState[key]}
    const terrain=makeTerrain(samples,query,worldSeed,recipe),random=rng(worldSeed,recipe.id),C=query.center;
    const ownedMaterial=o=>{const m=new THREE.MeshStandardMaterial(o);generatedMaterial.push(m);return m};
    const ownedGeometry=g=>{generatedGeometry.push(g);return g};
    const flatMaterial=ownedMaterial({color:recipe.id==='facility'?'#d1c9af':'#cfabae',roughness:1});
    function renderTerrain(){
      const {n,step,origin,heights}=terrain,pos=[],idx=[],colors=[],color=new THREE.Color(recipe.palette.ground),accent=new THREE.Color(recipe.palette.terrainAccent);
      for(let z=0;z<n;z++)for(let x=0;x<n;x++){
        const px=origin.x+x*step,pz=origin.z+z*step;pos.push(px,heights[z*n+x],pz);
        const mix=.15+.1*Math.sin(px*.07)*Math.cos(pz*.065),c=color.clone().lerp(accent,mix);colors.push(c.r,c.g,c.b);
      }
      for(let z=0;z<n-1;z++)for(let x=0;x<n-1;x++){const a=z*n+x,b=a+1,d=a+n,c=d+1;idx.push(a,d,b,b,d,c)}
      const geo=ownedGeometry(new THREE.BufferGeometry());geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setIndex(idx);geo.computeVertexNormals();
      const ground=new THREE.Mesh(geo,ownedMaterial({vertexColors:true,roughness:1}));ground.name='Visual terrain; NOT a support surface';layers.terrain.add(ground);
    }
    function makeSky(){
      const s=recipe.sky,mat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,depthTest:false,toneMapped:false,fog:false,
        uniforms:{topColor:{value:new THREE.Color(s.top)},horizonColor:{value:new THREE.Color(s.horizon)},sunColor:{value:new THREE.Color(s.sunColor)},sunDir:{value:V().fromArray(s.sunDirection).normalize()},sunSize:{value:s.sunSize},clouds:{value:s.cloudDensity},seedPhase:{value:rng(worldSeed,'sky')()*TAU},eclipse:{value:s.eclipse?1:0}},
        vertexShader:'varying vec3 direction; void main(){ direction=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
        fragmentShader:`varying vec3 direction; uniform vec3 topColor,horizonColor,sunColor,sunDir; uniform float sunSize,clouds,seedPhase,eclipse;
          void main(){vec3 d=normalize(direction);float h=max(0.,d.y);vec3 col=mix(horizonColor,topColor,smoothstep(0.,.45,h));
          float dist=length(d-sunDir);float disk=1.-smoothstep(sunSize*.96,sunSize,dist);float glow=pow(max(0.,dot(d,sunDir)),26.)*.13;
          float cut=1.-smoothstep(sunSize*.78,sunSize*.79,length(d-normalize(sunDir+vec3(sunSize*.10,sunSize*.12,0.))));
          col=mix(col,sunColor,disk);col=mix(col,topColor*.56,cut*eclipse);col+=sunColor*glow;
          float a=atan(d.z,d.x);float wave=sin(a*5.+sin(a*2.+seedPhase)*.8+seedPhase);
          float band=exp(-pow((h-(.28+.045*wave))/.017,2.))+exp(-pow((h-(.43+.028*sin(a*3.+seedPhase)))/.012,2.))*.6;
          float broken=smoothstep(-.2,.8,sin(a*7.+seedPhase)+sin(a*2.-seedPhase)*.4);
          col=mix(col,mix(horizonColor,vec3(1.),.35),clamp(band*broken*clouds,0.,.55));
          gl_FragColor=vec4(col,1.);
          #include <colorspace_fragment>
          }`});
      generatedMaterial.push(mat);const sky=new THREE.Mesh(ownedGeometry(new THREE.SphereGeometry(340,32,18)),mat);sky.frustumCulled=false;sky.renderOrder=-100;
      sky.onBeforeRender=(_r,_s,camera)=>{sky.position.copy(camera.position);sky.updateMatrixWorld()};layers.sky.add(sky);
    }
    // Normalized scale is authored and bounded, never a random giant outlier.
    function unitTransform(id,target,rotation={}){
      const dim=dimensions.get(id);if(!dim)throw Error('Unknown AssetRef '+id);
      const scale=target/Math.max(...dim.size),g=new THREE.Group();g.add(models.get(id).clone(true));g.scale.setScalar(scale);g.rotation.set(rotation.x||0,rotation.y||0,rotation.z||0);g.updateMatrixWorld(true);
      const b=new THREE.Box3().setFromObject(g),offset=V(-(b.min.x+b.max.x)/2,-b.min.y,-(b.min.z+b.max.z)/2);
      const radius=Math.hypot((b.max.x-b.min.x)/2,(b.max.z-b.min.z)/2),height=b.max.y-b.min.y;
      const tilted=rotation.x||rotation.z,footprint=tilted?{halfX:(b.max.x-b.min.x)/2,halfZ:(b.max.z-b.min.z)/2,yaw:0}:{halfX:dim.size[0]*scale/2,halfZ:dim.size[2]*scale/2,yaw:rotation.y||0};
      return {g,b,offset,radius,height,scale,footprint};
    }
    function batch(id,layer,group){
      group.updateMatrixWorld(true);group.traverse(n=>{if(!n.isMesh)return;const key=layer+':'+n.geometry.uuid+':'+(Array.isArray(n.material)?n.material.map(m=>m.uuid).join(','):n.material.uuid);
        if(!batches.has(key))batches.set(key,{layer,geometry:n.geometry,material:n.material,matrices:[]});batches.get(key).matrices.push(n.matrixWorld.clone());
      });
    }
    function overlaps(a,b){
      for(const yaw of [a.footprint.yaw,b.footprint.yaw])for(const turn of [0,Math.PI/2]){
        const nx=Math.cos(yaw+turn),nz=-Math.sin(yaw+turn),projection=p=>p.footprint.halfX*Math.abs(nx*Math.cos(p.footprint.yaw)-nz*Math.sin(p.footprint.yaw))+p.footprint.halfZ*Math.abs(nx*Math.sin(p.footprint.yaw)+nz*Math.cos(p.footprint.yaw));
        if(Math.abs((a.x-b.x)*nx+(a.z-b.z)*nz)>projection(a)+projection(b)+.35)return false;
      }return true;
    }
    function place(id,x,z,target,layer='mid',rotation={},options={}){
      const {g,offset,radius,height,scale,footprint}=unitTransform(id,target,rotation),margin=height>5?recipe.exclusions.tallMargin:recipe.exclusions.routeMargin;
      if(!query.clear(x,z,radius,margin)){rejected.push({id,reason:'route-clearance'});return null}
      if(placements.some(p=>!p.overhead&&!p.base&&overlaps({x,z,footprint},p))){rejected.push({id,reason:'cluster-spacing'});return null}
      const y=options.y??terrain.height(x,z),wrapper=new THREE.Group();wrapper.position.set(x+offset.x,y+offset.y,z+offset.z);wrapper.add(g);wrapper.updateMatrixWorld(true);
      batch(id,layer,wrapper);const p={id,layer,x,y,z,radius,height,scale,footprint,rotation:[rotation.x||0,rotation.y||0,rotation.z||0],margin};placements.push(p);return p;
    }
    function pad(x,z,radius,height,layer='mid'){
      if(!query.clear(x,z,radius,recipe.exclusions.routeMargin))return false;
      terrain.grade(x,z,radius,height-.1);
      const g=ownedGeometry(new THREE.CylinderGeometry(radius,radius,.38,48)),m=new THREE.Mesh(g,flatMaterial);m.position.set(x,height-.2,z);layers[layer].add(m);placements.push({id:'generated:service-plinth',layer,x,y:height-.39,z,radius,height:.38,base:true,margin:recipe.exclusions.routeMargin});return true;
    }
    function at(t,side,offset){const q=port.sample(t*port.total),out=q.right.x*(q.pos.x-C.x)+q.right.z*(q.pos.z-C.z)>0?1:-1;
      const sign=side==='outer'?out:-out,p=q.pos.clone().addScaledVector(q.right,sign*offset);return {x:p.x,z:p.z,yaw:Math.atan2(q.forward.x,q.forward.z),q,sign};}
    function along(id,t,side,offset,target,layer,extra={}){const a=at(t,side,offset);return place(id,a.x,a.z,target,layer,{y:a.yaw+(extra.yaw||0),x:extra.tiltX||0,z:extra.tiltZ||0},extra)}
    // Real entry anchor, local visual staging offset -18 m: keeps the unchanged spawn/chase shot clear.
    // This is NOT a moved lap trigger or a new track anchor. Opening measured from source vertices.
    function finishGate(){
      const q=port.sample(-18),id='gate-finish',target=26.5,{g}=unitTransform(id,target,{y:Math.atan2(q.forward.x,q.forward.z)+Math.PI}),scale=target/1.55;
      const feet=[-1,1].map(sign=>q.pos.clone().addScaledVector(q.right,sign*.60*scale));
      const base=Math.min(...feet.map(p=>terrain.height(p.x,p.z))),holder=new THREE.Group();holder.position.set(q.pos.x,base,q.pos.z);holder.add(g);holder.updateMatrixWorld(true);
      // Conservative full foot width is verified separately; the portal's void does not count as a solid prop.
      batch(id,'landmarks',holder);
      const openingHalf=.4577*scale,beamHeight=.8738*scale+base-q.pos.y;
      placements.push({id,layer:'landmarks',x:q.pos.x,y:base,z:q.pos.z,radius:target/2,height:1.1625*scale,scale,overhead:true,openingHalf,roadHalf:q.half,beamClearance:beamHeight,anchor:'track.entry@routeS=0',routeOffsetMeters:-18});
      // Thin visual foot foundations reach the terrain; no roadway or collision object is created.
      for(const p of feet){const y=terrain.height(p.x,p.z),h=Math.max(.25,y-base+.2);const geo=ownedGeometry(new THREE.BoxGeometry(3.7,h,3.7)),foot=new THREE.Mesh(geo,flatMaterial);foot.position.set(p.x,base+h/2-.15,p.z);foot.rotation.y=Math.atan2(q.forward.x,q.forward.z);layers.landmarks.add(foot)}
    }
    makeSky();finishGate();
    // Rhythmic sequences. Curvature controls emphasis; seed only changes bounded gaps, not route semantics.
    for(let s=22,i=0;s<port.total-18;s+=recipe.near.spacing,i++){
      const t=s/port.total,q=port.sample(s),curve=Math.abs(q.curvature)>.018,selected=random()<recipe.near.density;
      if(!selected)continue;
      const side=curve?'outer':(i%2?'outer':'inner');
      if(recipe.id==='facility'){
        along(curve?(i%2?'barrierRed':'barrierWhite'):'item-cone',t,side,q.half+(curve?6.7:4.7),curve?3.3:1.55,'near',{yaw:Math.PI/2});
        if(i%5===0)along('streetlight',t,'outer',q.half+15,8,'near',{yaw:Math.PI/2});
      }else along('item-cone',t,side,q.half+6.0,1.5,'near');
    }
    if(recipe.id==='facility'){
      // Service district beside (NOT connected to) the accepted mainline. No pit lane claim.
      const a=at(.065,'inner',35),f=a.q.forward,r=a.q.right,ground=a.q.pos.y-.65;
      pad(a.x,a.z,20,ground+.18);
      const local=(x,z)=>({x:a.x+r.x*x+f.x*z,z:a.z+r.z*x+f.z*z});
      const court=[['building_A_withoutBase',9,-8,12],['building_B_withoutBase',8,8,11.5],['tent',-7,-9,7.5],['tent',-7,2,7.5],['car_sedan',-7,12,4.1],['car_hatchback',-12,12,4.1],['box_A',0,-12,1.7],['box_A',2.2,-12,1.4],['bench',-13,-4,3.7]];
      for(const [id,x,z,size] of court){const p=local(x,z);place(id,p.x,p.z,size,'mid',{y:a.yaw+(id.startsWith('building')?Math.PI/2:0)},{y:ground+.2})}
      along('watertower',.11,'inner',63,22,'landmarks');
      for(const cluster of [{t:.015,side:'outer',count:3},{t:.31,side:'outer',count:3},{t:.66,side:'inner',count:2}]){
        for(let j=0;j<cluster.count;j++){
          const t=cluster.t+(j-(cluster.count-1)/2)*.032;
          along('grandStand',t,cluster.side,29,12.8,'mid',{yaw:Math.PI});
          along('flagCheckers',t+.014,cluster.side,21,8,'mid');
        }
        along('tent',cluster.t+.052,cluster.side,44,10,'mid');
      }
      for(const t of [.22,.45,.77,.9]){
        const a=at(t,'outer',37),localR=rng(worldSeed,'copse'+t);
        for(let i=0;i<5;i++){const angle=localR()*TAU,d=5+localR()*9;place(i%2?'treeSmall':'treeLarge',a.x+Math.cos(angle)*d,a.z+Math.sin(angle)*d,9+localR()*4,'mid',{y:localR()*TAU})}
      }
      // Distant districts, not a wall of evenly spaced assets.
      for(let i=0;i<recipe.farDensity;i++){
        const t=.18+i*.119,a=at(t,'outer',85+random()*25);
        place(i%3===0?'watertower':i%2?'building_A_withoutBase':'building_B_withoutBase',a.x,a.z,17+random()*8,'far',{y:a.yaw});
      }
    }else{
      // Explicit compositions from actual repository meshes. Giants have separate authored scale bands.
      place('item-banana',C.x+2,C.z+15,40,'mid',{y:.45+(random()-.5)*.2});
      const coin=at(.36,'outer',61);place('item-coin-gold',coin.x,coin.z,34,'mid',{y:coin.yaw+.6,z:.18});
      const tower=at(.82,'outer',61);place('watertower',tower.x,tower.z,46,'mid',{y:.3,z:-.22});
      for(const [t,id,size] of [[.14,'item-coin-gold',21],[.56,'item-banana',27],[.93,'watertower',28]]){
        const a=at(t,'outer',111);place(id,a.x,a.z,size,'far',{y:a.yaw,z:id==='watertower'?.12:-.18});
      }
      // A very small witness gives the landmark a human/vehicle scale, without a new road or interactable.
      const witness=at(.83,'outer',35);place('car_hatchback',witness.x,witness.z,4.1,'mid',{y:witness.yaw});
    }
    renderTerrain();
    for(const {layer,geometry,material,matrices} of batches.values()){
      const mesh=new THREE.InstancedMesh(geometry,material,matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingBox();mesh.computeBoundingSphere();layers[layer].add(mesh);instances.push(mesh);
    }
    const stablePlacement=placements.map(p=>Object.fromEntries(Object.entries(p).map(([k,v])=>[k,typeof v==='number'?+v.toFixed(5):v])));
    const placementHash=hash(JSON.stringify({recipe:recipe.id,seed:worldSeed,placements:stablePlacement,terrain:hash(Array.from(terrain.heights).join(','))}));
    const minClearance=Math.min(...placements.filter(p=>!p.overhead).map(p=>{const q=query.nearest(p.x,p.z);return q.d-q.half-p.radius}));
    return {root,layers,generatedGeometry,generatedMaterial,instances,placements,rejected,terrain,placementHash,minClearance,recipe:recipe.id,seed:worldSeed};
  }
  function change(id=activeRecipe.id,nextSeed=seed){
    const recipe=recipes.recipes.find(r=>r.id===id);if(!recipe)throw Error('Unknown EnvironmentRecipe '+id);
    nextSeed=String(nextSeed).trim().slice(0,64)||recipes.defaultSeed;
    // Build the entire candidate before swapping, so a failed recipe keeps the last valid world.
    const candidate=build(recipe,nextSeed);const old=current;current=candidate;activeRecipe=recipe;seed=nextSeed;revision++;
    if(enabled){port.attach(current.root);port.atmosphere(recipe.sky)}destroy(old);return snapshot();
  }
  function toggleLayer(name,on){if(!(name in layerState))throw Error('Unknown layer '+name);layerState[name]=!!on;if(current)current.layers[name].visible=!!on;return snapshot()}
  function setEnabled(on){enabled=!!on;if(current){if(enabled){port.attach(current.root);port.atmosphere(activeRecipe.sky)}else{port.detach(current.root);port.restore()}}return snapshot()}
  function snapshot(){const d=port.diagnostics();return {build:'ENV1-20260918-A',recipe:activeRecipe.id,seed,revision,enabled,layers:{...layerState},placementHash:current?.placementHash,placements:current?.placements.length||0,rejected:current?.rejected.length||0,byLayer:current?Object.fromEntries(Object.keys(layerState).map(k=>[k,current.placements.filter(p=>p.layer===k).length])):{},minRoadClearance:current?.minClearance,minTerrainRoadGap:current?.terrain.minRoadGap,gate:current?.placements.find(p=>p.overhead),unchangedRoute:d.routeBytes===baseline.routeBytes,unchangedWidths:d.widthBytes===baseline.widthBytes,host:d,assetCount:models.size,loadedAssets:[...dimensions.keys()],assetBounds:Object.fromEntries(dimensions)};}
  change(activeRecipe.id,seed);
  return Object.freeze({change,toggleLayer,setEnabled,snapshot,placementEvidence:()=>structuredClone(current.placements),dispose(){destroy(current);current=null;port.restore();}});
}
