(async()=>{
const $=q=>document.querySelector(q);
const NS='http://www.w3.org/2000/svg';
const COMPONENT_URL='../source-assets/EUMEL_SOURCE_COMPONENTS.svg';
const CONTRACT_URL='../data/rig_contract.json';
const BIND_URL='../data/neutral_bind_pose.json';
const [svgText,contract,bind]=await Promise.all([
  fetch(COMPONENT_URL).then(r=>r.text()),
  fetch(CONTRACT_URL).then(r=>r.json()),
  fetch(BIND_URL).then(r=>r.json())
]);

const stageMount=$('#stageMount'),staticMount=$('#staticMount');
stageMount.innerHTML=svgText;staticMount.innerHTML=svgText;
const stageSvg=stageMount.querySelector('svg'),staticSvg=staticMount.querySelector('svg');
stageSvg.id='rigSvg';staticSvg.id='staticSvg';

function G(id,cls){const n=document.createElementNS(NS,'g');if(id)n.id=id;if(cls)n.setAttribute('class',cls);return n}
function stripIds(n){if(n.removeAttribute)n.removeAttribute('id');for(const c of n.querySelectorAll('[id]'))c.removeAttribute('id');return n}
function setDisplay(n,on){if(n)n.style.display=on?'':'none'}
function setMatrix(n,m){n.setAttribute('transform','matrix('+m.join(' ')+')')}
function setTranslate(n,x,y){n.setAttribute('transform','translate('+x+' '+y+')')}
function centerOf(b){return{x:b.x+b.width/2,y:b.y+b.height/2}}
function makeCircle(x,y,r=1.25,cls='bone-joint'){const c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',r);c.setAttribute('class',cls);return c}
function makeLine(x1,y1,x2,y2){const l=document.createElementNS(NS,'line');for(const [k,v] of Object.entries({x1,y1,x2,y2}))l.setAttribute(k,v);l.setAttribute('class','bone-line');return l}

const sourceNormalizer=stageSvg.querySelector('#page-normalizer');
const defs=stageSvg.querySelector('defs');
const NORMALIZER='translate(0 200.701) scale(1 -1)';

function takeSource(id){
  const el=sourceNormalizer.querySelector('#rig-'+id);
  if(!el)throw new Error('Missing source component '+id);
  const wrap=G('srcwrap-'+id,'source-wrap');
  wrap.setAttribute('transform',NORMALIZER);
  wrap.appendChild(el);
  return wrap;
}
function cloneSource(wrap){
  const c=wrap.cloneNode(true);stripIds(c);c.setAttribute('class','source-wrap source-clone');return c;
}

const stageRoot=G('stage-root','rig-wrapper');
stageSvg.appendChild(stageRoot);

// Shadow remains outside actor centering.
const shadowBind=G('shadow-bind','rig-wrapper');
const shadowBoneNode=G('shadow-bone','rig-bone');
shadowBoneNode.appendChild(takeSource('shadow'));shadowBind.appendChild(shadowBoneNode);stageRoot.appendChild(shadowBind);

// Actor bind = source pose or neutral centered pose. Dynamic actor bone lives inside it.
const actorBind=G('actor-bind','rig-wrapper'),actorBoneNode=G('actor-bone','rig-bone');
actorBind.appendChild(actorBoneNode);stageRoot.appendChild(actorBind);

// Pull leg source before removing the remaining normalizer.
function makeClip(id,x,y,w,h){
  const cp=document.createElementNS(NS,'clipPath');cp.id=id;cp.setAttribute('clipPathUnits','userSpaceOnUse');
  const r=document.createElementNS(NS,'rect');r.setAttribute('x',x);r.setAttribute('y',y);r.setAttribute('width',w);r.setAttribute('height',h);cp.appendChild(r);defs.appendChild(cp);return cp;
}
function makeLeg(id,cfg){
  const original=takeSource(id),upperSrc=cloneSource(original),lowerSrc=cloneSource(original);
  const root=G('bone-'+id,'rig-bone'),sourceMode=G('source-'+id+'-mode','rig-wrapper'),neutralMode=G('neutral-'+id+'-mode','rig-wrapper');
  sourceMode.appendChild(original);
  const nb=cfg.neutralVisualBBox,knee=cfg.knee,pad=6;
  makeClip('clip-'+id+'-upper',nb[0]-pad,nb[1]-pad,(nb[2]-nb[0])+pad*2,(knee[1]-nb[1])+pad);
  makeClip('clip-'+id+'-lower',nb[0]-pad,knee[1],(nb[2]-nb[0])+pad*2,(nb[3]-knee[1])+pad*2);
  const upperClip=G(null,'rig-wrapper'),lowerBoneNode=G('knee-'+id,'rig-bone'),lowerClip=G(null,'rig-wrapper');
  upperClip.setAttribute('clip-path','url(#clip-'+id+'-upper)');
  lowerClip.setAttribute('clip-path','url(#clip-'+id+'-lower)');
  const upperBind=G(null,'rig-wrapper'),lowerBind=G(null,'rig-wrapper');
  setMatrix(upperBind,cfg.bindMatrix);setMatrix(lowerBind,cfg.bindMatrix);
  upperBind.appendChild(upperSrc);lowerBind.appendChild(lowerSrc);
  upperClip.appendChild(upperBind);lowerClip.appendChild(lowerBind);lowerBoneNode.appendChild(lowerClip);
  neutralMode.append(upperClip,lowerBoneNode);root.append(sourceMode,neutralMode);actorBoneNode.appendChild(root);
  const bone=new KFBBone2D.Bone2D(root,{x:cfg.targetHip[0],y:cfg.targetHip[1]});
  const kneeBone=new KFBBone2D.Bone2D(lowerBoneNode,{x:knee[0],y:knee[1]});
  const visual=G(null,'bone-visual');
  visual.append(makeLine(cfg.targetHip[0],cfg.targetHip[1],knee[0],knee[1]),makeCircle(cfg.targetHip[0],cfg.targetHip[1]),makeCircle(knee[0],knee[1]));
  root.appendChild(visual);
  return {root,sourceMode,neutralMode,bone,kneeBone,cfg,visual};
}
const legA=makeLeg('leg-A',bind.legA),legB=makeLeg('leg-B',bind.legB);

// Body.
const bodyWrap=takeSource('body');bodyWrap.dataset.layer='body';actorBoneNode.appendChild(bodyWrap);

// Stethoscope hierarchy.
const stethBoneNode=G('steth-bone','rig-bone'),chestBoneNode=G('chest-bone','rig-bone');
stethBoneNode.append(takeSource('steth-stem'),takeSource('steth-tube'),chestBoneNode);
chestBoneNode.append(takeSource('chest-outer'),takeSource('chest-inner'));actorBoneNode.appendChild(stethBoneNode);

// Head + source accessories.
const headBoneNode=G('head-bone','rig-bone'),hatBoneNode=G('hat-bone','rig-bone'),eyesRoot=G('eyes-root','rig-wrapper');
const headSource=takeSource('head'),mirrorOuter=takeSource('mirror-outer'),mirrorInner=takeSource('mirror-inner');
headBoneNode.append(headSource,mirrorOuter,mirrorInner,eyesRoot,hatBoneNode);
actorBoneNode.appendChild(headBoneNode);

// Each eye + pupil gets its own wrapper so EyeRig can blink/gaze without editing source.
function makeEye(keyEye,keyPupil){
  const eye=G('bone-'+keyEye,'rig-bone'),pupil=G('bone-'+keyPupil,'rig-bone');
  eye.append(takeSource(keyEye),pupil);pupil.append(takeSource(keyPupil));eyesRoot.appendChild(eye);return{eye,pupil};
}
const eyeA=makeEye('eye-A','pupil-A'),eyeB=makeEye('eye-B','pupil-B');
hatBoneNode.append(takeSource('foreground-black'),takeSource('foreground-white'));

if(sourceNormalizer)sourceNormalizer.remove();

// Static rig bones.
const actorBone=new KFBBone2D.Bone2D(actorBoneNode,{x:bind.body.sourceCenterX,y:bind.body.hipY});
const shadowBone=new KFBBone2D.Bone2D(shadowBoneNode,{x:bind.page.centerX,y:191.6});
const hb=headBoneNode.getBBox(),headPivot={x:hb.x+hb.width/2,y:hb.y+hb.height*.93};
const headBone=new KFBBone2D.Bone2D(headBoneNode,headPivot);
const sb=stethBoneNode.getBBox(),stethPivot={x:sb.x+sb.width/2,y:sb.y+sb.height*.08};
const stethBone=new KFBBone2D.Bone2D(stethBoneNode,stethPivot);
const cb=chestBoneNode.getBBox(),chestPivot=centerOf(cb),chestBone=new KFBBone2D.Bone2D(chestBoneNode,chestPivot);
const hatBox=hatBoneNode.getBBox(),hatPivot={x:hatBox.x+hatBox.width/2,y:hatBox.y+hatBox.height*.82};
const hatBone=new KFBBone2D.Bone2D(hatBoneNode,hatPivot);

// Head/root bone visualization.
const actorVisual=G(null,'bone-visual');actorVisual.append(makeCircle(bind.body.sourceCenterX,bind.body.hipY,1.35),makeCircle(headPivot.x,headPivot.y,1.2),makeLine(bind.body.sourceCenterX,bind.body.hipY,headPivot.x,headPivot.y));actorBoneNode.appendChild(actorVisual);
const headVisual=G(null,'bone-visual');headVisual.append(makeCircle(hatPivot.x,hatPivot.y,1));headBoneNode.appendChild(headVisual);

// Shared EyeRig adapter mirrors v6 semantic calls.
const frameA=eyeA.eye.getBBox(),frameB=eyeB.eye.getBBox();
const eyeFrameData={
  left:{x:frameB.x+frameB.width/2,y:frameB.y+frameB.height/2},
  right:{x:frameA.x+frameA.width/2,y:frameA.y+frameA.height/2},
  radius:(frameA.width+frameB.width)/8,
  parent:eyesRoot,rig:eyesRoot,unit:(frameA.width+frameB.width)/2
};
function applyEyeTransform(node,p={}){
  if(!node)return;
  const b=node.getBBox(),cx=b.x+b.width/2,cy=b.y+b.height/2;
  const x=p.x||0,y=p.y||0,r=p.r||0,sx=p.sx==null?1:p.sx,sy=p.sy==null?1:p.sy;
  node.setAttribute('transform','translate('+x+' '+y+') translate('+cx+' '+cy+') rotate('+r+') scale('+sx+' '+sy+') translate('+(-cx)+' '+(-cy)+')');
}
const eyeRig=new KFBEyeRig2D({
  nodes:{eyeA:eyeA.eye,eyeB:eyeB.eye,pupilA:eyeA.pupil,pupilB:eyeB.pupil},
  frame:eyeFrameData,
  applyTransform:applyEyeTransform,
  maxTrack:2.2
});

// UI state.
const state={
  bindPose:'neutral',preset:'hampelmann',intensity:1,speed:1,play:true,pivots:false,parallax:false,
  bendLeft:0,bendRight:0,legStretch:1,legSquash:1,gazeX:0,gazeY:0,eyeLife:true,eyeFollow:false,mx:0,my:0,pose:{}
};
const bindPose=$('#bindPose'),preset=$('#preset'),intensity=$('#intensity'),speed=$('#speed'),play=$('#play'),pivots=$('#pivots'),parallax=$('#parallax');
const bendLeft=$('#bendLeft'),bendRight=$('#bendRight'),legStretch=$('#legStretch'),legSquash=$('#legSquash'),gazeX=$('#gazeX'),gazeY=$('#gazeY'),eyeLife=$('#eyeLife'),eyeFollow=$('#eyeFollow');
function uiLabels(){
  $('#intensityOut').value=state.intensity.toFixed(2);$('#speedOut').value=state.speed.toFixed(2);
  $('#bendLeftOut').value=state.bendLeft.toFixed(1)+'°';$('#bendRightOut').value=state.bendRight.toFixed(1)+'°';
  $('#legStretchOut').value=state.legStretch.toFixed(2);$('#legSquashOut').value=state.legSquash.toFixed(2);
  $('#gazeXOut').value=state.gazeX.toFixed(2);$('#gazeYOut').value=state.gazeY.toFixed(2);
}
function bindInput(el,key,parse=Number){el.oninput=e=>{state[key]=parse(e.target.value);uiLabels()}}
bindPose.onchange=e=>{state.bindPose=e.target.value;applyBindPose()};
preset.onchange=e=>state.preset=e.target.value;bindInput(intensity,'intensity');bindInput(speed,'speed');play.onchange=e=>state.play=e.target.checked;parallax.onchange=e=>state.parallax=e.target.checked;
bindInput(bendLeft,'bendLeft');bindInput(bendRight,'bendRight');bindInput(legStretch,'legStretch');bindInput(legSquash,'legSquash');bindInput(gazeX,'gazeX');bindInput(gazeY,'gazeY');
eyeLife.onchange=e=>{state.eyeLife=e.target.checked;eyeRig.setLife({on:state.eyeLife})};eyeFollow.onchange=e=>{state.eyeFollow=e.target.checked;eyeRig.setGazeFollow(state.eyeFollow)};
$('#blinkNow').onclick=()=>eyeRig.blinkNow();
uiLabels();

function applyBindPose(){
  const neutral=state.bindPose==='neutral';
  setTranslate(actorBind,neutral?bind.body.actorTranslateX:0,0);
  setTranslate(shadowBind,neutral?bind.shadow.translateX:0,0);
  for(const leg of [legA,legB]){
    setDisplay(leg.sourceMode,!neutral);setDisplay(leg.neutralMode,neutral);
    const p=neutral?leg.cfg.targetHip:leg.cfg.sourceHip;leg.bone.setPivot({x:p[0],y:p[1]});
  }
}
applyBindPose();

pivots.onchange=e=>{state.pivots=e.target.checked;for(const n of stageSvg.querySelectorAll('.bone-visual'))n.style.display=state.pivots?'':'none'};
for(const n of stageSvg.querySelectorAll('.bone-visual'))n.style.display='none';

$('#reset').onclick=()=>{
  state.preset='neutral';preset.value='neutral';state.bendLeft=state.bendRight=0;state.legStretch=state.legSquash=1;state.gazeX=state.gazeY=0;
  bendLeft.value=bendRight.value=0;legStretch.value=legSquash.value=1;gazeX.value=gazeY.value=0;uiLabels();
};
$('#export').onclick=()=>{
  const payload={schema:'kfb.eumel.pose/0.2',sourceBlobSha:contract.source.sourceBlobSha,bindPose:state.bindPose,preset:state.preset,
    deformers:{bendLeft:state.bendLeft,bendRight:state.bendRight,legStretch:state.legStretch,legSquash:state.legSquash},pose:state.pose};
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));a.download='eumel-pose-v02.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};

const viewport=$('#viewport');
viewport.onpointermove=e=>{const r=viewport.getBoundingClientRect();state.mx=((e.clientX-r.left)/r.width-.5)*2;state.my=((e.clientY-r.top)/r.height-.5)*2};
viewport.onpointerleave=()=>{state.mx=state.my=0};

// Layer controls target wrapper ownership rather than duplicated source IDs.
const layerMap=[
 ['shadow',[shadowBind]],['legs',[legA.root,legB.root]],['body',[bodyWrap]],['stethoscope',[stethBoneNode]],
 ['head',[headSource,mirrorOuter,mirrorInner]],['eyes',[eyeA.eye,eyeB.eye]],['pupils',[eyeA.pupil,eyeB.pupil]],['hat',[hatBoneNode]]
];
for(const [label,nodes] of layerMap){
  const l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=true;c.onchange=()=>nodes.forEach(n=>setDisplay(n,c.checked));
  l.append(c,document.createTextNode(label));$('#layerToggles').appendChild(l);
}

const lerp=(a,b,t)=>a+(b-a)*t;
function motion(name,t,I){
  const px=state.parallax?state.mx:0,py=state.parallax?state.my:0;
  const P={root:{},shadow:{},legA:{},legB:{},kneeA:{},kneeB:{},head:{},steth:{},chest:{},hat:{},gaze:{x:state.gazeX,y:state.gazeY},kin:{a:0,c:0,j:0}};
  if(name==='neutral')return P;
  if(name==='idle'){
    const b=Math.sin(t*1.15),breath=Math.sin(t*1.15+.5);P.root={y:b*1.1*I,x:px*.7,r:Math.sin(t*.55)*.55*I,sx:1-breath*.006*I,sy:1+breath*.012*I};
    P.legA={r:b*.8*I};P.legB={r:-b*.6*I};P.head={r:Math.sin(t*.75+.35)*1.8*I+px*1.2,y:py*.35};P.steth={r:Math.sin(t*.9+1)*1.2*I};P.chest={r:Math.sin(t*1.05+1.4)*4*I};P.hat={r:-Math.sin(t*.75+.55)*.7*I};
    P.shadow={sx:1-breath*.01*I,sy:1-breath*.006*I,x:px*1.1};return P;
  }
  if(name==='look'){
    const h=Math.sin(t*.8)*6*I+px*3;P.root={x:px*.7,y:Math.sin(t*.6)*.5*I,r:-h*.04};P.head={r:h,y:py*.5};P.hat={r:-h*.12};P.steth={r:h*.08};P.chest={r:Math.sin(t*1.1+.8)*4*I};P.shadow={x:px*1.1};
    P.gaze={x:Math.max(-1,Math.min(1,h/7)),y:Math.cos(t*.55)*.18+py*.25};return P;
  }
  if(name==='walk'){
    const c=Math.sin(t*5.1),step=Math.abs(c),dir=Math.cos(t*5.1);
    P.root={y:-step*1.8*I,x:px*.5,r:c*.7*I,sx:1-step*.008*I,sy:1+step*.012*I};
    P.legA={r:13*c*I};P.legB={r:-13*c*I};P.head={r:-c*2.2*I+px*.9,y:Math.sin(t*10.2)*.35*I};P.hat={r:c*.8*I};
    P.steth={r:-c*4.2*I};P.chest={r:-c*10*I};P.shadow={sx:1-step*.025*I,sy:1-step*.015*I,x:px*.8};P.gaze={x:.28,y:.02};P.kin={a:dir*.15,c:c*.22,j:0};return P;
  }
  if(name==='hampelmann'){
    const c=Math.sin(t*3),up=Math.abs(c);P.root={y:-up*3.4*I,x:px*.6,r:c*.65*I,sx:1-up*.01*I,sy:1+up*.015*I};
    P.legA={r:-20*c*I};P.legB={r:20*c*I};P.head={r:-Math.sin(t*3+.32)*5*I+px*1.2,y:Math.sin(t*3+.45)*.55*I};P.hat={r:Math.sin(t*3+.55)*2.2*I};
    P.steth={r:Math.sin(t*3+.58)*5*I};P.chest={r:Math.sin(t*3+.92)*17*I,x:Math.sin(t*3+.92)*.7*I};P.shadow={sx:1-up*.07*I,sy:1-up*.04*I,y:up*.65*I,x:px};
    P.gaze={x:Math.sin(t*1.05)*.18+state.gazeX,y:state.gazeY};return P;
  }
  if(name==='hop'){
    const ph=(t*.62)%1;let y=0,sx=1,sy=1,hr=0,j=0;
    if(ph<.16){const z=ph/.16;y=lerp(0,2.6,z)*I;sx=lerp(1,1.04,z);sy=lerp(1,.94,z);j=-.2}
    else if(ph<.34){const z=(ph-.16)/.18;y=lerp(2.6,-11,z)*I;sx=lerp(1.04,.98,z);sy=lerp(.94,1.05,z);hr=lerp(0,-4.5,z)*I;j=.4}
    else if(ph<.66){const z=(ph-.34)/.32;y=(-11-Math.sin(z*Math.PI)*2)*I;hr=Math.sin(z*Math.PI)*2.5*I;j=.1}
    else if(ph<.82){const z=(ph-.66)/.16;y=lerp(-11,1.8,z)*I;sx=lerp(.98,1.05,z);sy=lerp(1.03,.92,z);j=1}
    else {const z=(ph-.82)/.18;y=lerp(1.8,0,z)*I;sx=lerp(1.05,1,z);sy=lerp(.92,1,z);j=-.2}
    P.root={y,x:px*.5,sx,sy};P.head={r:hr+px};P.hat={r:-hr*.3};P.legA={r:Math.sin(t*5)*4*I};P.legB={r:-Math.sin(t*5)*4*I};P.steth={r:Math.sin(t*3.5+.5)*4*I};P.chest={r:Math.sin(t*4+.9)*10*I};
    const lift=Math.max(0,-y);P.shadow={sx:1-lift*.018,sy:1-lift*.012,y:lift*.08,x:px};P.gaze={x:state.gazeX,y:state.gazeY};P.kin={a:0,c:0,j};return P;
  }
  return P;
}

function applyPose(P,dt){
  state.pose=P;actorBone.setPose(P.root);shadowBone.setPose(P.shadow);
  legA.bone.setPose({r:(P.legA.r||0),sx:state.legSquash,sy:state.legStretch});legB.bone.setPose({r:(P.legB.r||0),sx:state.legSquash,sy:state.legStretch});
  if(state.bindPose==='neutral'){legA.kneeBone.setPose({r:state.bendRight+(P.kneeA.r||0)});legB.kneeBone.setPose({r:state.bendLeft+(P.kneeB.r||0)});}else{legA.kneeBone.reset();legB.kneeBone.reset();}
  headBone.setPose(P.head);stethBone.setPose(P.steth);chestBone.setPose(P.chest);hatBone.setPose(P.hat);
  const gx=state.eyeFollow?state.mx:(P.gaze.x==null?state.gazeX:P.gaze.x),gy=state.eyeFollow?-state.my:(P.gaze.y==null?state.gazeY:P.gaze.y);
  eyeRig.setGazeFollow(true);eyeRig.pointTo(gx,gy);eyeRig.setKinetics(P.kin||{});eyeRig.setLife({on:state.eyeLife});eyeRig.update(dt);
}

let last=performance.now(),t0=last;
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;const t=(now-t0)/1000*state.speed;
  const P=state.play?motion(state.preset,t,state.intensity):(state.pose.root?state.pose:motion('neutral',0,0));
  applyPose(P,dt);
  $('#debug').textContent=[
    'bind: '+state.bindPose,
    'preset: '+state.preset,
    'source: '+contract.source.sourceBlobSha.slice(0,12)+'…',
    'source paths: IMMUTABLE',
    'hip bones: EXPLICIT / DERIVED',
    'knee bend: OPTIONAL PROXY',
    'EyeRig API: shared v1 / donor v6',
    '',
    'left/leg-B bend '+state.bendLeft.toFixed(1)+'°',
    'right/leg-A bend '+state.bendRight.toFixed(1)+'°',
    'leg scale '+state.legSquash.toFixed(2)+' × '+state.legStretch.toFixed(2),
    'eyeFrame radius '+eyeRig.eyeFrame().radius.toFixed(2)
  ].join('\n');
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Robust component atlas: compute each part's bbox in root SVG coordinates, then clone its defs + source group.
function rootBBox(el,svg){
  const b=el.getBBox(),em=el.getScreenCTM(),rm=svg.getScreenCTM();
  if(!em||!rm)throw new Error('No CTM');
  const rel=rm.inverse().multiply(em),pts=[
    new DOMPoint(b.x,b.y).matrixTransform(rel),new DOMPoint(b.x+b.width,b.y).matrixTransform(rel),
    new DOMPoint(b.x+b.width,b.y+b.height).matrixTransform(rel),new DOMPoint(b.x,b.y+b.height).matrixTransform(rel)
  ];
  const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);return{x:Math.min(...xs),y:Math.min(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};
}
const ids=['shadow','leg-A','leg-B','body','steth-stem','steth-tube','chest-outer','chest-inner','head','mirror-outer','mirror-inner','eye-A','eye-B','pupil-A','pupil-B','foreground-black','foreground-white'];
const labels={'foreground-black':'hat / silhouette','foreground-white':'hat / band','leg-A':'leg-A · right candidate','leg-B':'leg-B · left candidate'};
function buildAtlas(){
  const atlas=$('#atlas'),defsText=staticSvg.querySelector('defs').innerHTML;atlas.replaceChildren();
  for(const id of ids){
    const card=document.createElement('article');card.className='atlas-card';card.innerHTML='<b>'+(labels[id]||id)+'</b><div class="atlas-view"></div><small>source-exact isolated view</small><span class="source-role">SOURCE</span>';
    const host=card.querySelector('.atlas-view'),target=staticSvg.querySelector('#rig-'+id);
    try{
      const b=rootBBox(target,staticSvg),pad=Math.max(b.width,b.height)*.18+1;
      const mini=document.createElementNS(NS,'svg');mini.setAttribute('viewBox',(b.x-pad)+' '+(b.y-pad)+' '+(b.width+2*pad)+' '+(b.height+2*pad));mini.setAttribute('preserveAspectRatio','xMidYMid meet');
      mini.innerHTML='<defs>'+defsText+'</defs><g transform="'+NORMALIZER+'">'+target.outerHTML+'</g>';host.appendChild(mini);
    }catch(err){card.classList.add('bad');host.textContent='bbox/render fail';card.querySelector('small').textContent=String(err);}
    atlas.appendChild(card);
  }
}
requestAnimationFrame(()=>requestAnimationFrame(buildAtlas));
})();