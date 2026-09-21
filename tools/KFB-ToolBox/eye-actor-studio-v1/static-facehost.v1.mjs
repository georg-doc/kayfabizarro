export const SCHEMA='kfb.static-facehost/0.1-candidate';

const HEAD_RE=/head|skull|pumpkin|jack/i;
const EXCLUDE=/hair|hat|helmet|visor|hood|mask|beard|horn|accessory/i;

function meshList(root){
  const out=[];
  root?.traverse?.(o=>{if(o.isMesh&&!EXCLUDE.test(o.name||''))out.push(o)});
  return out;
}

function chooseTarget(root,preferred=null){
  if(preferred){
    const hit=root.getObjectByName?.(preferred);
    if(hit)return hit;
  }
  const named=[];
  root?.traverse?.(o=>{if((o.isMesh||o.children?.length)&&HEAD_RE.test(o.name||'')&&!EXCLUDE.test(o.name||''))named.push(o)});
  return named[0]||root;
}

function baseColor(root){
  for(const m of meshList(root)){
    const mats=[].concat(m.material||[]);
    for(const x of mats)if(x?.color)return '#'+x.color.getHexString();
  }
  return '#d7a17d';
}

export function buildStaticFaceHost({THREE,figure,targetName=null,targetObject=null,mode='head',log=()=>{}}={}){
  if(!THREE||!figure)return {status:'UNSUPPORTED',reason:'missing THREE/figure'};
  figure.updateMatrixWorld(true);
  const target=targetObject||chooseTarget(figure,targetName);
  if(!target)return {status:'UNSUPPORTED',reason:'no target'};
  target.updateMatrixWorld(true);

  const boxW=new THREE.Box3().setFromObject(target);
  if(boxW.isEmpty())return {status:'UNSUPPORTED',reason:'empty target bounds'};

  const centerW=boxW.getCenter(new THREE.Vector3());
  const sizeW=boxW.getSize(new THREE.Vector3());
  const parent=target.parent||figure;
  parent.updateMatrixWorld(true);
  const centerL=parent.worldToLocal(centerW.clone());

  const inner=new THREE.Group();
  inner.name='staticFaceHost';
  inner.position.copy(centerL);
  parent.add(inner);

  // Cancel parent's world rotation so Eye Cluster +Z remains a stable authored face direction.
  const parentQ=parent.getWorldQuaternion(new THREE.Quaternion());
  inner.quaternion.copy(parentQ).invert();

  const parentS=parent.getWorldScale(new THREE.Vector3());
  inner.scale.set(1/(parentS.x||1),1/(parentS.y||1),1/(parentS.z||1));

  const geo=new THREE.SphereGeometry(1,36,24);
  geo.scale(sizeW.x/2,sizeW.y/2,sizeW.z/2);
  geo.computeBoundingBox();
  const body=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
  body.name='body';body.userData.noMeasure=true;inner.add(body);

  const report={
    status:'OK',schema:SCHEMA,mode,target:target.name||'(root)',
    headSize:[sizeW.x,sizeW.y,sizeW.z].map(v=>+v.toFixed(4)),
    centerWorld:[centerW.x,centerW.y,centerW.z].map(v=>+v.toFixed(4)),
    baseColor:baseColor(target),
    facing:'+z candidate / author-adjustable'
  };
  log('StaticFaceHost · '+report.target+' · '+report.headSize.join('×'));
  return {
    status:'OK',schema:SCHEMA,inner,box:body,size:sizeW,target,report,
    faceCtx(){return {THREE,inner,o:{},_squash:null,getFaceShells:()=>[]}},
    dispose(){inner.removeFromParent();geo.dispose();body.material.dispose()}
  };
}

export default buildStaticFaceHost;
