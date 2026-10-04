import {mergeZones,faceNormals} from './geometry.mjs';
/** Host supplies its own THREE instance. No second renderer/camera/version owner. */
export function createLandmarkGroup(THREE,asset,colours){
 const root=new THREE.Group();root.name=asset.id;
 root.userData={kfbLandmark:{id:asset.id,units:'metre',upAxis:'+Y',pivot:asset.pivot,source:'authored-procedural',osm:null,accepted:false,collision:'not-provided',massingDeformationSupported:false}};
 for(const {zone,positions} of mergeZones(asset)){
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(faceNormals(positions),3));g.computeBoundingBox();g.computeBoundingSphere();
  const mat=new THREE.MeshStandardMaterial({color:colours[zone],roughness:.9,metalness:0,flatShading:true});mat.name=zone;mat.userData={kfbMaterialZone:zone};
  const mesh=new THREE.Mesh(g,mat);mesh.name=zone;mesh.userData.kfbMaterialZone=zone;mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);
 }
 return root;
}
export function disposeLandmark(root){root.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of [o.material].flat())m.dispose();});}
