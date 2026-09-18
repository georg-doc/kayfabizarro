(async()=>{
const $=q=>document.querySelector(q), $$=q=>[...document.querySelectorAll(q)];
const COMPONENT_URL='../source-assets/EUMEL_SOURCE_COMPONENTS.svg';
const CONTRACT_URL='../data/rig_contract.json';
const [svgText,contract]=await Promise.all([fetch(COMPONENT_URL).then(r=>r.text()),fetch(CONTRACT_URL).then(r=>r.json())]);

const stageMount=$('#stageMount'), staticMount=$('#staticMount');
stageMount.innerHTML=svgText; staticMount.innerHTML=svgText;
const stageSvg=stageMount.querySelector('svg'), staticSvg=staticMount.querySelector('svg');
stageSvg.id='rigSvg'; staticSvg.id='staticSvg';

const normalizer=stageSvg.querySelector('#page-normalizer');
const ids=[
'shadow','leg-A','leg-B','body','steth-stem','steth-tube','chest-outer','chest-inner',
'head','mirror-outer','mirror-inner','eye-A','eye-B','pupil-A','pupil-B','foreground-black','foreground-white'
];
const part=id=>stageSvg.querySelector('#rig-'+id);

// Build non-destructive rig hierarchy around source groups.
const NS='http://www.w3.org/2000/svg';
function g(id){const x=document.createElementNS(NS,'g');x.id=id;x.classList.add('rig-wrapper');return x}
const shadow=part('shadow');
const root=g('anim-root'), steth=g('anim-stethoscope'), chest=g('anim-chest'), head=g('anim-head'), eyes=g('anim-eyes');
normalizer.insertBefore(root,shadow.nextSibling);
for(const id of ['leg-A','leg-B','body']) root.appendChild(part(id));
root.appendChild(steth);
for(const id of ['steth-stem','steth-tube']) steth.appendChild(part(id));
steth.appendChild(chest); chest.appendChild(part('chest-outer'));chest.appendChild(part('chest-inner'));
root.appendChild(head);
for(const id of ['head','mirror-outer','mirror-inner']) head.appendChild(part(id));
head.appendChild(eyes);
for(const id of ['eye-A','eye-B','pupil-A','pupil-B']) eyes.appendChild(part(id));
head.appendChild(part('foreground-black'));head.appendChild(part('foreground-white'));

const nodes={
shadow,root,legA:part('leg-A'),legB:part('leg-B'),body:part('body'),
steth,chest,head,eyes,pupilA:part('pupil-A'),pupilB:part('pupil-B')
};
for(const n of Object.values(nodes)) if(n){n.style.transformBox='fill-box';n.style.transformOrigin='50% 50%'}
nodes.root.style.transformOrigin='50% 55%';nodes.head.style.transformOrigin='50% 86%';
nodes.legA.style.transformOrigin='50% 8%';nodes.legB.style.transformOrigin='50% 8%';
nodes.steth.style.transformOrigin='50% 10%';nodes.chest.style.transformOrigin='50% 50%';

const state={preset:'hampelmann',intensity:1,speed:1,play:true,pivots:false,parallax:false,mx:0,my:0,pose:{}};
const preset=$('#preset'), intensity=$('#intensity'), speed=$('#speed'), play=$('#play'), pivots=$('#pivots'), parallax=$('#parallax');
function labels(){ $('#intensityOut').value=state.intensity.toFixed(2);$('#speedOut').value=state.speed.toFixed(2)}
preset.onchange=e=>state.preset=e.target.value;
intensity.oninput=e=>{state.intensity=+e.target.value;labels()};
speed.oninput=e=>{state.speed=+e.target.value;labels()};
play.onchange=e=>state.play=e.target.checked;
parallax.onchange=e=>state.parallax=e.target.checked;
labels();

function tr(el,{x=0,y=0,r=0,sx=1,sy=1,kx=0}={}){
 if(!el)return;el.style.transform=`translate(${x}px,${y}px) rotate(${r}deg) skewX(${kx}deg) scale(${sx},${sy})`;
}
function clear(){for(const n of Object.values(nodes))tr(n,{});state.pose={}}
$('#reset').onclick=()=>{state.preset='neutral';preset.value='neutral';clear()};
$('#export').onclick=()=>{
 const payload={schema:'kfb.eumel.pose/0.1',sourceBlobSha:contract.source.sourceBlobSha,preset:state.preset,intensity:state.intensity,speed:state.speed,pose:state.pose};
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));a.download='eumel-pose.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};

const viewport=$('#viewport');
viewport.onpointermove=e=>{const r=viewport.getBoundingClientRect();state.mx=((e.clientX-r.left)/r.width-.5)*2;state.my=((e.clientY-r.top)/r.height-.5)*2};
viewport.onpointerleave=()=>{state.mx=state.my=0};

// layer visibility controls from exact source groups
const layers=[
['shadow',['rig-shadow']],['legs',['rig-leg-A','rig-leg-B']],['body',['rig-body']],
['stethoscope',['rig-steth-stem','rig-steth-tube','rig-chest-outer','rig-chest-inner']],
['head',['rig-head','rig-mirror-outer','rig-mirror-inner']],['eyes',['rig-eye-A','rig-eye-B']],['pupils',['rig-pupil-A','rig-pupil-B']],
['foreground',['rig-foreground-black','rig-foreground-white']]
];
for(const [label,targets] of layers){
 const l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=true;
 c.onchange=()=>targets.forEach(id=>{const el=stageSvg.querySelector('#'+id);if(el)el.style.display=c.checked?'':'none'});
 l.append(c,document.createTextNode(label));$('#layerToggles').appendChild(l);
}

// Pivot overlay uses derived metadata only.
let pivotLayer;
function setPivots(on){
 if(pivotLayer)pivotLayer.remove();pivotLayer=null;if(!on)return;
 pivotLayer=document.createElementNS(NS,'g');pivotLayer.id='derived-pivot-overlay';stageSvg.appendChild(pivotLayer);
 const list=[[nodes.root,.5,.55],[nodes.head,.5,.86],[nodes.legA,.5,.08],[nodes.legB,.5,.08],[nodes.steth,.5,.1],[nodes.chest,.5,.5],[nodes.pupilA,.5,.5],[nodes.pupilB,.5,.5],[nodes.shadow,.5,.5]];
 for(const [el,fx,fy] of list){if(!el)continue;const b=el.getBBox(),p=document.createElementNS(NS,'circle');p.setAttribute('cx',b.x+b.width*fx);p.setAttribute('cy',b.y+b.height*fy);p.setAttribute('r','1.4');p.classList.add('pivot-dot');pivotLayer.appendChild(p)}
}
pivots.onchange=e=>{state.pivots=e.target.checked;setPivots(state.pivots)};

const lerp=(a,b,t)=>a+(b-a)*t;
function motion(name,t,I){
 const px=state.parallax?state.mx:0,py=state.parallax?state.my:0;
 const P={root:{},shadow:{},legA:{},legB:{},steth:{},chest:{},head:{},eyes:{},pupilA:{},pupilB:{}};
 if(name==='neutral')return P;
 if(name==='idle'){
  const b=Math.sin(t*1.15),breath=Math.sin(t*1.15+.5);
  P.root={y:b*1.5*I,x:px*.7,r:Math.sin(t*.55)*.7*I,sx:1-breath*.006*I,sy:1+breath*.012*I};
  P.head={r:Math.sin(t*.75+.35)*1.9*I+px*1.2,y:py*.35};
  P.legA={r:b*1.2*I};P.legB={r:-b*.9*I};
  P.steth={r:Math.sin(t*.9+1)*1.2*I};P.chest={r:Math.sin(t*1.05+1.4)*4*I};
  P.pupilA={x:Math.sin(t*.45)*1.2*I+px*.7,y:Math.cos(t*.38)*.7*I+py*.5};P.pupilB={...P.pupilA,x:P.pupilA.x*.9};
  P.shadow={sx:1-breath*.01*I,sy:1-breath*.006*I,x:px*1.1};
  return P;
 }
 if(name==='look'){
  const h=Math.sin(t*.8)*7*I+px*3,ey=Math.cos(t*.55)*1.3*I+py*1.2;
  P.root={x:px*.7,y:Math.sin(t*.6)*.6*I,r:-h*.04};
  P.head={r:h,y:py*.5};P.eyes={x:h*.12,y:ey};
  P.pupilA={x:h*.28,y:ey*1.7};P.pupilB={x:h*.25,y:ey*1.6};
  P.steth={r:h*.08};P.chest={r:Math.sin(t*1.1+.8)*4*I};
  P.shadow={x:px*1.1};return P;
 }
 if(name==='hampelmann'){
  const c=Math.sin(t*3),q=Math.sin(t*3+Math.PI),up=Math.abs(c);
  P.root={y:-up*4.2*I,x:px*.6,r:c*.9*I,sx:1-up*.012*I,sy:1+up*.018*I};
  P.legA={r:-24*c*I};P.legB={r:24*q*I};
  P.head={r:-Math.sin(t*3+.32)*5.8*I+px*1.4,y:Math.sin(t*3+.45)*.7*I};
  P.steth={r:Math.sin(t*3+.58)*5*I};P.chest={r:Math.sin(t*3+.92)*18*I,x:Math.sin(t*3+.92)*.8*I};
  P.pupilA={x:Math.sin(t*1.05)*1.1*I+px*.7,y:py*.5};P.pupilB={x:Math.sin(t*1.05)*.9*I+px*.7,y:py*.5};
  P.shadow={sx:1-up*.08*I,sy:1-up*.04*I,y:up*.8*I,x:px*1.1};return P;
 }
 if(name==='hop'){
  const ph=(t*.62)%1;let y=0,sx=1,sy=1,hr=0;
  if(ph<.16){const z=ph/.16;y=lerp(0,3,z)*I;sx=lerp(1,1.04,z);sy=lerp(1,.94,z)}
  else if(ph<.34){const z=(ph-.16)/.18;y=lerp(3,-13,z)*I;sx=lerp(1.04,.98,z);sy=lerp(.94,1.05,z);hr=lerp(0,-5,z)*I}
  else if(ph<.66){const z=(ph-.34)/.32;y=(-13-Math.sin(z*Math.PI)*2.5)*I;hr=Math.sin(z*Math.PI)*3*I}
  else if(ph<.82){const z=(ph-.66)/.16;y=lerp(-13,2,z)*I;sx=lerp(.98,1.05,z);sy=lerp(1.03,.92,z)}
  else {const z=(ph-.82)/.18;y=lerp(2,0,z)*I;sx=lerp(1.05,1,z);sy=lerp(.92,1,z)}
  P.root={y,x:px*.6,sx,sy};P.head={r:hr+px*1.2};P.legA={r:Math.sin(t*5)*5*I};P.legB={r:-Math.sin(t*5)*5*I};
  P.steth={r:Math.sin(t*3.5+.5)*4*I};P.chest={r:Math.sin(t*4+.9)*10*I};
  const lift=Math.max(0,-y);P.shadow={sx:1-lift*.018,sy:1-lift*.012,y:lift*.08,x:px*1.1};P.pupilA={x:px*.7,y:py*.5};P.pupilB={x:px*.7,y:py*.5};return P;
 }
 return P;
}
let t0=performance.now();
function frame(now){
 const t=(now-t0)/1000*state.speed;if(state.play){const P=motion(state.preset,t,state.intensity);state.pose=P;for(const [k,v] of Object.entries(P))tr(nodes[k],v)}
 $('#debug').textContent=[
  'preset: '+state.preset,
  'source: '+contract.source.sourceBlobSha.slice(0,12)+'…',
  'geometry: SOURCE EXACT',
  'pivots: DERIVED / metadata only',
  '',
  'root '+JSON.stringify(state.pose.root||{}),
  'head '+JSON.stringify(state.pose.head||{}),
  'legA '+JSON.stringify(state.pose.legA||{}),
  'chest '+JSON.stringify(state.pose.chest||{}),
  'pupilA '+JSON.stringify(state.pose.pupilA||{})
 ].join('\n');
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Build component atlas from the static SVG, isolating exact groups and auto-fitting each source part.
const atlas=$('#atlas');
for(const id of ids){
 const card=document.createElement('article');card.className='atlas-card';card.innerHTML=`<b>${id}</b><div class="atlas-view"></div><small>source path · isolated view</small>`;
 const host=card.querySelector('.atlas-view'),clone=staticSvg.cloneNode(true);host.appendChild(clone);
 clone.querySelectorAll('.rig-part').forEach(p=>p.style.display=p.id==='rig-'+id?'':'none');
 requestAnimationFrame(()=>{const p=clone.querySelector('#rig-'+id);if(!p)return;try{const b=p.getBBox(),pad=Math.max(b.width,b.height)*.16;clone.setAttribute('viewBox',`${b.x-pad} ${b.y-pad} ${b.width+2*pad} ${b.height+2*pad}`)}catch{}});
 atlas.appendChild(card);
}
})();