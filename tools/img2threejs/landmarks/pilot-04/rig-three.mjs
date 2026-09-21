import {faceNormals} from '../pilot-01/geometry.mjs';

function mergeByGroupZone(asset){
  const map=new Map();
  for(const part of asset.parts){
    const group=part.rigGroup||'towerCore',key=group+'|'+part.zone;
    if(!map.has(key))map.set(key,{group,zone:part.zone,positions:[]});
    map.get(key).positions.push(...part.positions);
  }
  return [...map.values()];
}

export function createRiggedLandmarkGroup(THREE,asset,colours){
  if(!asset?.rig)throw Error('Expected rigged landmark asset');
  const root=new THREE.Group();root.name=asset.id+'-rig';
  root.userData={kfbLandmarkRig:{schema:asset.rig.schema,id:asset.id,shapeMode:asset.shapeMode,bumperProfile:asset.rig.bumperProfile}};
  const body=new THREE.Group();body.name='landmarkBody';root.add(body);
  const groups=new Map(),materialsByZone=new Map();
  for(const g of asset.rig.groups){
    const node=new THREE.Group();node.name=g.id;node.userData={kfbRigGroup:g};groups.set(g.id,node);body.add(node);
  }
  for(const chunk of mergeByGroupZone(asset)){
    let node=groups.get(chunk.group);
    if(!node){node=new THREE.Group();node.name=chunk.group;groups.set(chunk.group,node);body.add(node);}
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(chunk.positions,3));
    geo.setAttribute('normal',new THREE.Float32BufferAttribute(faceNormals(chunk.positions),3));
    geo.computeBoundingBox();geo.computeBoundingSphere();
    const mat=new THREE.MeshStandardMaterial({color:colours[chunk.zone],roughness:.9,metalness:0,flatShading:true});
    mat.name=chunk.zone;mat.userData={kfbMaterialZone:chunk.zone};
    const mesh=new THREE.Mesh(geo,mat);mesh.name=chunk.group+'|'+chunk.zone;mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData={kfbMaterialZone:chunk.zone,kfbRigGroup:chunk.group};
    node.add(mesh);
    if(!materialsByZone.has(chunk.zone))materialsByZone.set(chunk.zone,[]);
    materialsByZone.get(chunk.zone).push(mat);
  }
  return {root,body,groups,materialsByZone,asset};
}
export function disposeRiggedLandmark(view){
  view.root.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of [o.material].flat())m.dispose();});
}
export function addRigHelpers(THREE,view,visible=false){
  const helper=new THREE.Group();helper.name='rigHelpers';helper.visible=visible;view.root.add(helper);
  const scale=Math.max(1,view.asset.bounds.size[1]*.018);
  for(const a of view.asset.rig.attachments){
    const g=new THREE.Group();g.position.set(...a.anchorDeformed);
    const sphere=new THREE.Mesh(new THREE.SphereGeometry(scale*.34,10,7),new THREE.MeshBasicMaterial({color:0xffcc44,depthTest:false}));
    sphere.renderOrder=99;g.add(sphere);
    const axes=new THREE.AxesHelper(scale*1.8);axes.renderOrder=99;g.add(axes);helper.add(g);
  }
  return helper;
}
