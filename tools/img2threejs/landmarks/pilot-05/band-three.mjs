import {faceNormals} from '../pilot-01/geometry.mjs';

function merged(asset){
  const map=new Map();
  for(const part of asset.parts){
    const band=part.rigBand||'lower',key=band+'|'+part.zone;
    if(!map.has(key))map.set(key,{band,zone:part.zone,positions:[]});
    map.get(key).positions.push(...part.positions);
  }
  return [...map.values()];
}

export function createBandRigGroup(THREE,asset,colours){
  if(!asset?.rig?.bands)throw Error('Expected Band Rig v2 asset');
  const root=new THREE.Group();root.name=asset.id+'-band-rig-v2';
  root.userData={kfbLandmarkBandRig:{schema:asset.rig.schema,id:asset.id,shapeMode:asset.shapeMode,bumperProfile:asset.rig.bumperProfile}};
  const bandGroups=new Map(),materialsByZone=new Map();
  for(const [id,T] of Object.entries(asset.rig.bands)){
    const g=new THREE.Group();g.name=id;g.position.set(...T.origin);g.userData={kfbRigBand:id,sourceY:T.sourceY};
    bandGroups.set(id,g);root.add(g);
  }
  for(const chunk of merged(asset)){
    const T=asset.rig.bands[chunk.band],local=[];
    for(let i=0;i<chunk.positions.length;i+=3){
      local.push(chunk.positions[i]-T.origin[0],chunk.positions[i+1]-T.origin[1],chunk.positions[i+2]-T.origin[2]);
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(local,3));
    geo.setAttribute('normal',new THREE.Float32BufferAttribute(faceNormals(local),3));
    geo.computeBoundingBox();geo.computeBoundingSphere();
    const mat=new THREE.MeshStandardMaterial({color:colours[chunk.zone],roughness:.9,metalness:0,flatShading:true});
    mat.name=chunk.zone;mat.userData={kfbMaterialZone:chunk.zone};
    const mesh=new THREE.Mesh(geo,mat);mesh.name=chunk.band+'|'+chunk.zone;mesh.castShadow=true;mesh.receiveShadow=true;
    mesh.userData={kfbMaterialZone:chunk.zone,kfbRigBand:chunk.band};
    bandGroups.get(chunk.band).add(mesh);
    if(!materialsByZone.has(chunk.zone))materialsByZone.set(chunk.zone,[]);
    materialsByZone.get(chunk.zone).push(mat);
  }
  return {root,bandGroups,materialsByZone,asset};
}
export function addBandHelpers(THREE,view,visible=true){
  const helper=new THREE.Group();helper.name='bandRigHelpers';helper.visible=visible;view.root.add(helper);
  const size=Math.max(.55,view.asset.bounds.size[1]*.012);
  for(const [id,T] of Object.entries(view.asset.rig.bands)){
    const g=new THREE.Group();g.position.set(...T.origin);
    const sphere=new THREE.Mesh(new THREE.SphereGeometry(size*.34,10,7),new THREE.MeshBasicMaterial({color:id==='clock'?0xffc23b:0x71c8b0,depthTest:false}));
    sphere.renderOrder=99;g.add(sphere);g.add(new THREE.AxesHelper(size*1.4));helper.add(g);
  }
  return helper;
}
export function disposeBandRig(view){
  view.root.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of [o.material].flat())m.dispose();});
}
