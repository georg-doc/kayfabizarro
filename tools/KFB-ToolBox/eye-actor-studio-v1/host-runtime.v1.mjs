import {clone as skinClone} from 'three/addons/utils/SkeletonUtils.js';
import {buildFaceHost} from '../kfb-rigs-embed-v3/frizzlegraft-v1/facehost.v1.js';
import {assembleLegacy,replaceHead} from '../legacy-rpg-rigging/lib/legacy-rig-adapter.v1.js';
import {buildLegacyFaceHost} from '../legacy-rpg-rigging/lib/legacy-facehost.v1.js';
import {buildStaticFaceHost} from './static-facehost.v1.mjs';

export const HOST_RUNTIME_SCHEMA='kfb.eye-actor-host-runtime/0.1-candidate';
export const LEGACY_RIG_URL='/media/3D_Assets/KayKit Legacy/KayKit Character Animations 1.2 - legacy/Animations/gltf/KayKit_AnimatedCharacter_v1.2.glb';

function cloneStatic(scene){
  const s=scene.clone(true);
  s.traverse(o=>{
    if(!o.isMesh||!o.material)return;
    o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone();
  });
  return s;
}

function firstColor(root){
  let c=null;
  root?.traverse?.(o=>{
    if(c||!o.isMesh)return;
    for(const m of [].concat(o.material||[])){
      if(m?.color){c='#'+m.color.getHexString();break;}
    }
  });
  return c;
}

function normalizeWrapper(THREE,wrapper,targetHeight=3.15){
  wrapper.updateMatrixWorld(true);
  let box=new THREE.Box3().setFromObject(wrapper);
  if(box.isEmpty())return {status:'UNSUPPORTED',reason:'empty bounds'};
  const size=box.getSize(new THREE.Vector3());
  const h=Math.max(.001,size.y);
  const k=targetHeight/h;
  wrapper.scale.setScalar(k);
  wrapper.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(wrapper);
  const center=box.getCenter(new THREE.Vector3());
  wrapper.position.x-=center.x;
  wrapper.position.z-=center.z;
  wrapper.position.y-=box.min.y;
  wrapper.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(wrapper);
  return {
    status:'OK',
    scale:k,
    bounds:box,
    size:box.getSize(new THREE.Vector3()),
    center:box.getCenter(new THREE.Vector3())
  };
}

function makePlaceholder(THREE){
  const g=new THREE.Group();g.name='Lab placeholder host';
  const mat=new THREE.MeshStandardMaterial({color:'#d69a78',roughness:.84,metalness:0});
  const head=new THREE.Mesh(new THREE.SphereGeometry(1,42,28),mat);head.name='LabPlaceholder_Head';head.scale.set(.96,1.12,.82);head.position.y=1.85;g.add(head);
  const body=new THREE.Mesh(new THREE.CapsuleGeometry(.58,1.1,8,20),mat.clone());body.name='LabPlaceholder_Body';body.position.y=.72;g.add(body);
  return {scene:g,targetName:head.name};
}

export class HostRuntime{
  constructor({THREE,loader,stageRoot,catalogBundle,log=()=>{}}){
    this.THREE=THREE;this.loader=loader;this.stageRoot=stageRoot;this.bundle=catalogBundle;this.log=log;
    this.wrapper=null;this.faceHost=null;this.legacy=null;this.def=null;this.report=null;
  }

  legacyBodies(){return this.bundle?.legacyDungeon?.characters||[];}
  legacyHeads(){return this.bundle?.legacyDungeon?.heads||[];}

  async load(def,{legacyBodyId='rogue',legacyHeadId='rogue-default'}={}){
    this.dispose();
    this.def=def;
    const T=this.THREE;
    const wrapper=this.wrapper=new T.Group();wrapper.name='KFB Eye Actor source host';
    this.stageRoot.add(wrapper);
    let figure=null,face=null,legacy=null,sourceColor=def.faceColor||null,sourcePath=def.path||null,sourceKind=def.kind;
    let headInfo=null;

    if(def.kind==='placeholder'){
      const p=makePlaceholder(T);figure=p.scene;wrapper.add(figure);
      normalizeWrapper(T,wrapper,3.15);
      face=buildStaticFaceHost({THREE:T,figure,targetName:p.targetName,mode:'placeholder',log:this.log});
      sourceColor=face.report?.baseColor||sourceColor;
    }else if(def.kind==='modern'){
      const gltf=await this.loader.loadAsync('/'+def.path);
      figure=skinClone(gltf.scene);figure.name=def.id;wrapper.add(figure);
      normalizeWrapper(T,wrapper,3.15);
      face=buildFaceHost({THREE:T,figure,log:this.log});
      sourceColor=def.faceColor||firstColor(figure)||sourceColor;
    }else if(def.kind==='legacy-modular'){
      const bodyDef=this.legacyBodies().find(x=>x.id===legacyBodyId)||this.legacyBodies()[0];
      const headDef=this.legacyHeads().find(x=>x.id===legacyHeadId)||this.legacyHeads().find(x=>x.character===bodyDef.id&&x.kind==='embedded');
      if(!bodyDef)throw Error('Legacy Dungeon body source missing');
      legacy=await assembleLegacy({
        THREE:T,loader:this.loader,rigUrl:LEGACY_RIG_URL,partsUrl:'/'+bodyDef.path,catalogCharacter:bodyDef,log:this.log
      });
      figure=legacy.root;wrapper.add(figure);
      let headPart=legacy.parts?.Head?.node||null;
      if(headDef?.kind==='asset'){
        const rep=await replaceHead({loader:this.loader,character:legacy,headUrl:'/'+headDef.path,log:this.log});
        headPart=rep.headPart||headPart;
      }else{
        await replaceHead({loader:this.loader,character:legacy,headUrl:null,log:this.log});
      }
      normalizeWrapper(T,wrapper,3.15);
      face=buildLegacyFaceHost({THREE:T,figure,headBone:legacy.headBone,headPart,log:this.log});
      sourceColor=face.report?.baseColor||sourceColor;
      sourcePath=bodyDef.path;
      headInfo={id:headDef?.id||'default',label:headDef?.label||'default',path:headDef?.path||null};
      this.legacy=legacy;
    }else if(def.kind==='legacy-static'){
      legacy=await assembleLegacy({
        THREE:T,loader:this.loader,rigUrl:LEGACY_RIG_URL,partsUrl:'/'+def.path,catalogCharacter:null,log:this.log
      });
      figure=legacy.root;wrapper.add(figure);
      normalizeWrapper(T,wrapper,3.15);
      const headPart=legacy.parts?.Head?.node;
      face=buildLegacyFaceHost({THREE:T,figure,headBone:legacy.headBone,headPart,log:this.log});
      sourceColor=face.report?.baseColor||sourceColor;
      this.legacy=legacy;
    }else if(def.kind==='legacy-template'){
      const gltf=await this.loader.loadAsync('/'+def.path);
      figure=cloneStatic(gltf.scene);figure.name=def.id;wrapper.add(figure);
      normalizeWrapper(T,wrapper,3.15);
      face=buildStaticFaceHost({THREE:T,figure,targetName:def.headNode||null,mode:'legacy-template',log:this.log});
      sourceColor=face.report?.baseColor||sourceColor;
    }else if(def.kind==='prop'){
      const gltf=await this.loader.loadAsync('/'+def.path);
      figure=cloneStatic(gltf.scene);figure.name=def.id;wrapper.add(figure);
      normalizeWrapper(T,wrapper,3.15);
      face=buildStaticFaceHost({THREE:T,figure,targetObject:figure,mode:'prop',log:this.log});
      sourceColor=face.report?.baseColor||sourceColor;
    }else{
      throw Error('Unsupported host kind '+def.kind);
    }

    if(!face||face.status!=='OK')throw Error('FaceHost unsupported · '+(face?.reason||def.id));
    this.faceHost=face;
    const unit=Math.max(.05,(face.size?.y||1)/2);
    this.report={
      schema:HOST_RUNTIME_SCHEMA,status:'OK',id:def.id,label:def.label,group:def.group,kind:sourceKind,
      sourcePath,rigClass:def.rigClass||null,revision:def.revision||null,
      faceHost:face.report,sourceColor:sourceColor||'#d7a17d',unit,
      legacyBody:legacyBodyId||null,legacyHead:headInfo
    };
    this.log('Host ready · '+def.label+' · '+face.report?.headSize?.join('×'));
    return {figure,wrapper,faceHost:face,unit,color:this.report.sourceColor,report:this.report,legacy};
  }

  dispose(){
    this.faceHost?.dispose?.();this.faceHost=null;
    if(this.wrapper){
      this.wrapper.traverse(o=>{
        if(!o.isMesh)return;
        o.geometry?.dispose?.();
        if(Array.isArray(o.material))o.material.forEach(m=>m.dispose?.());
        else o.material?.dispose?.();
      });
      this.wrapper.removeFromParent();
    }
    this.wrapper=null;this.legacy=null;this.report=null;
  }
}
