import {rasterizeSvgGroups,svgPointToActorLocal,makeTransparentPlane} from '../../../shared/renderers/three2p5d/cutout-svg-plane-stack.v0.1.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function rememberBase(node){
  node.userData.base={
    px:node.position.x,py:node.position.y,pz:node.position.z,
    rx:node.rotation.x,ry:node.rotation.y,rz:node.rotation.z,
    sx:node.scale.x,sy:node.scale.y,sz:node.scale.z
  };
}
function applyLocal(node,{x=0,y=0,z=0,r=0,sx=1,sy=1,sz=1}={}){
  const b=node.userData.base;
  node.position.set(b.px+x,b.py+y,b.pz+z);
  node.rotation.set(b.rx,b.ry,b.rz+r);
  node.scale.set(b.sx*sx,b.sy*sy,b.sz*sz);
}
function makeBone(THREE,parent,name,pivot,viewBox,scale){
  const g=new THREE.Group();g.name=name;
  const p=svgPointToActorLocal(pivot.x,pivot.y,viewBox,scale);
  g.position.set(p.x,p.y,0);rememberBase(g);parent.add(g);
  return {group:g,pivotLocal:p};
}
function attachLayer(THREE,bone,layer,viewBox,scale,z){
  const mesh=makeTransparentPlane(THREE,layer,scale,z);
  const cx=layer.bbox.x+layer.bbox.w/2,cy=layer.bbox.y+layer.bbox.h/2;
  const c=svgPointToActorLocal(cx,cy,viewBox,scale);
  mesh.position.x=c.x-bone.pivotLocal.x;
  mesh.position.y=c.y-bone.pivotLocal.y;
  bone.group.add(mesh);
  return mesh;
}

export async function mountEumelThree2p5D({
  THREE,parent,camera,svgUrl,bindUrl,worldHeight=2.0,
  facingPolicy='upright-yaw-billboard',EyeRigClass=window.KFBEyeRig2D
}){
  if(!THREE||!parent||!camera)throw new Error('THREE, parent and camera are required');
  if(!EyeRigClass)throw new Error('KFBEyeRig2D not loaded');
  const [svgText,bind]=await Promise.all([fetch(svgUrl).then(r=>{if(!r.ok)throw new Error('SVG '+r.status);return r.text()}),fetch(bindUrl).then(r=>{if(!r.ok)throw new Error('bind '+r.status);return r.json()})]);
  const specs={
    legA:['rig-leg-A'],legB:['rig-leg-B'],body:['rig-body'],
    steth:['rig-steth-stem','rig-steth-tube','rig-chest-outer','rig-chest-inner'],
    head:['rig-head'],mirror:['rig-mirror-outer','rig-mirror-inner'],
    eyeA:['rig-eye-A'],eyeB:['rig-eye-B'],pupilA:['rig-pupil-A'],pupilB:['rig-pupil-B'],
    hat:['rig-foreground-black','rig-foreground-white'],shadow:['rig-shadow']
  };
  const layers={};
  for(const [k,ids] of Object.entries(specs))layers[k]=await rasterizeSvgGroups(THREE,svgText,ids,{pixelWidth:720});
  const viewBox=layers.body.viewBox,scale=worldHeight/viewBox.h;
  const root=new THREE.Group();root.name='KFB Eumel 2.5D root';parent.add(root);
  const actor=new THREE.Group();actor.name='KFB Eumel actor';root.add(actor);

  // Neutral bind: all actor parts get the measured body-centering shift; feet share a ground baseline.
  const footY=Math.max(bind.legA.neutralVisualBBox[3],bind.legB.neutralVisualBBox[3]);
  const groundLift=(footY-(viewBox.y+viewBox.h/2))*scale;
  actor.position.set(bind.body.actorTranslateX*scale,groundLift,0);
  rememberBase(actor);

  const bodyBBox=layers.body.bbox;
  const bodyPivot={x:bodyBBox.x+bodyBBox.w/2,y:bodyBBox.y+bodyBBox.h*.55};
  const bodyBone=makeBone(THREE,actor,'body-bone',bodyPivot,viewBox,scale);
  attachLayer(THREE,bodyBone,layers.body,viewBox,scale,0);

  const legABone=makeBone(THREE,actor,'leg-A-bone',{x:bind.legA.targetHip[0],y:bind.legA.targetHip[1]},viewBox,scale);
  const legBBone=makeBone(THREE,actor,'leg-B-bone',{x:bind.legB.targetHip[0],y:bind.legB.targetHip[1]},viewBox,scale);
  attachLayer(THREE,legABone,layers.legA,viewBox,scale,-.018);
  attachLayer(THREE,legBBone,layers.legB,viewBox,scale,-.017);
  legABone.group.rotation.z=THREE.MathUtils.degToRad(-bind.legA.restCorrectionDeg);rememberBase(legABone.group);
  legBBone.group.rotation.z=THREE.MathUtils.degToRad(-bind.legB.restCorrectionDeg);rememberBase(legBBone.group);

  const headBBox=layers.head.bbox;
  const headPivot={x:headBBox.x+headBBox.w/2,y:headBBox.y+headBBox.h*.86};
  const headBone=makeBone(THREE,actor,'head-bone',headPivot,viewBox,scale);
  attachLayer(THREE,headBone,layers.head,viewBox,scale,.025);
  attachLayer(THREE,headBone,layers.mirror,viewBox,scale,.03);
  attachLayer(THREE,headBone,layers.hat,viewBox,scale,.045);

  const stethBBox=layers.steth.bbox;
  const stethPivot={x:stethBBox.x+stethBBox.w/2,y:stethBBox.y+stethBBox.h*.1};
  const stethBone=makeBone(THREE,actor,'stethoscope-bone',stethPivot,viewBox,scale);
  attachLayer(THREE,stethBone,layers.steth,viewBox,scale,.015);

  function makeEye(keyEye,keyPupil,z){
    const eb=layers[keyEye].bbox;
    const pivot={x:eb.x+eb.w/2,y:eb.y+eb.h/2};
    const eyeBone=makeBone(THREE,headBone.group,keyEye+'-bone',pivot,viewBox,scale);
    // makeBone gives actor-local coords; convert to head-local.
    eyeBone.group.position.x-=headBone.pivotLocal.x;eyeBone.group.position.y-=headBone.pivotLocal.y;rememberBase(eyeBone.group);
    attachLayer(THREE,eyeBone,layers[keyEye],viewBox,scale,z);
    const pupilBone=makeBone(THREE,eyeBone.group,keyPupil+'-bone',pivot,viewBox,scale);
    pupilBone.group.position.set(0,0,0);rememberBase(pupilBone.group);
    attachLayer(THREE,pupilBone,layers[keyPupil],viewBox,scale,z+.006);
    return {eyeBone,pupilBone,pivot,bbox:eb};
  }
  const eyeA=makeEye('eyeA','pupilA',.052),eyeB=makeEye('eyeB','pupilB',.053);

  // Source shadow becomes a world-space ground plane, not a screen-space oval.
  const sh=layers.shadow;
  const shadowMat=new THREE.MeshBasicMaterial({map:sh.texture,transparent:true,depthWrite:false,alphaTest:.01,side:THREE.DoubleSide,toneMapped:false});
  const shadowMesh=new THREE.Mesh(new THREE.PlaneGeometry(sh.bbox.w*scale,Math.max(.06,sh.bbox.h*scale*1.15)),shadowMat);
  shadowMesh.rotation.x=-Math.PI/2;
  shadowMesh.position.set(0,.006,.035);
  root.add(shadowMesh);

  const frame={
    left:new THREE.Vector3(...Object.values(svgPointToActorLocal(eyeB.pivot.x,eyeB.pivot.y,viewBox,scale)),0),
    right:new THREE.Vector3(...Object.values(svgPointToActorLocal(eyeA.pivot.x,eyeA.pivot.y,viewBox,scale)),0),
    radius:((eyeA.bbox.w+eyeB.bbox.w)/4)*scale,
    parent:headBone.group,rig:headBone.group,unit:((eyeA.bbox.w+eyeB.bbox.w)/4)*scale/.3
  };
  const eyeRig=new EyeRigClass({
    nodes:{eyeA:eyeA.eyeBone.group,eyeB:eyeB.eyeBone.group,pupilA:eyeA.pupilBone.group,pupilB:eyeB.pupilBone.group},
    frame,
    maxTrack:.035,
    applyTransform:(node,p)=>applyLocal(node,{x:p.x||0,y:p.y||0,r:THREE.MathUtils.degToRad(p.r||0),sx:p.sx==null?1:p.sx,sy:p.sy==null?1:p.sy})
  });
  eyeRig.setLife({on:true,wander:.45,tremor:.25});

  let state='idle',time=0,mode=facingPolicy,baseRootY=root.position.y;
  function setState(v){state=v||'idle';}
  function setFacingPolicy(v){mode=v;}
  function update(dt,{camera:cam=camera,velocity=0,gaze=null}={}){
    time+=dt;
    if(mode==='upright-yaw-billboard'){
      const wp=new THREE.Vector3();root.getWorldPosition(wp);
      root.rotation.y=Math.atan2(cam.position.x-wp.x,cam.position.z-wp.z);
    }else if(mode==='world-facing-upright'){root.rotation.y=0;}

    let bob=0,leg=0,head=0,steth=0,stretch=1;
    if(state==='idle'){
      bob=Math.sin(time*1.7)*.014;leg=Math.sin(time*1.35)*.015;head=Math.sin(time*.9)*.018;steth=Math.sin(time*1.1+.7)*.025;
    }else if(state==='walk'){
      const c=Math.sin(time*5.2);bob=Math.abs(c)*.025;leg=c*.24;head=-c*.035;steth=-c*.09;
    }else if(state==='hop'){
      const p=(time*.85)%1;const lift=Math.sin(Math.PI*clamp((p-.12)/.72,0,1));bob=lift*.20;stretch=1+lift*.035;leg=Math.sin(time*4)*.05;head=-lift*.04;steth=Math.sin(time*4+.6)*.08;
    }else if(state==='look'){
      head=Math.sin(time*.8)*.05;
    }
    applyLocal(actor,{y:bob,sx:1/stretch,sy:stretch});
    applyLocal(legABone.group,{r:leg});
    applyLocal(legBBone.group,{r:-leg});
    applyLocal(headBone.group,{r:head});
    applyLocal(stethBone.group,{r:steth});
    shadowMesh.scale.set(1-Math.abs(bob)*.5,1-Math.abs(bob)*.25,1);

    if(gaze)eyeRig.setGazeFollow(true),eyeRig.pointTo(gaze.x,gaze.y);
    else if(state==='look')eyeRig.setGazeFollow(true),eyeRig.pointTo(Math.sin(time*.75)*.75,Math.cos(time*.55)*.14);
    else eyeRig.setGazeFollow(false);
    eyeRig.setKinetics({a:clamp(velocity,-1,1)*.12,c:0,j:state==='hop'?.2:0});
    eyeRig.update(dt);
  }
  function dispose(){
    root.traverse(o=>{
      if(o.geometry)o.geometry.dispose?.();
      if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms){m.map?.dispose?.();m.dispose?.();}}
    });
    root.removeFromParent();
  }
  return {root,actor,eyeRig,setState,setFacingPolicy,update,dispose,meta:{scale,viewBox,worldHeight}};
}
