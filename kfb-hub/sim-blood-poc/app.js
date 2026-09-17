(() => {
  'use strict';

  const canvas = document.getElementById('smearCanvas');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d', { alpha: false }) : null;
  const scope = document.getElementById('scope');
  if (!canvas || !ctx || !scope) {
    document.body.insertAdjacentHTML('beforeend','<div style="padding:16px;font:14px system-ui">SimBlood konnte den Canvas nicht initialisieren.</div>');
    return;
  }

  const debugLabel = document.getElementById('debugLabel');
  const focus = document.getElementById('focus');
  const focusLabel = document.getElementById('focusLabel');
  const objectiveLabel = document.getElementById('objectiveLabel');
  const status = document.getElementById('status');
  const recipeSummary = document.getElementById('recipeSummary');
  const counts = {
    rbc: document.getElementById('rbcCount'),
    wbc: document.getElementById('wbcCount'),
    platelet: document.getElementById('pltCount')
  };

  const WORLD = { w: 2400, h: 1600 };
  const RECIPES = {
    normal: {
      id:'normal', label:'NORMAL', rbc:1150, platelets:95,
      wbc:[['segmented_neutrophil',7],['mature_lymphocyte',4],['monocyte',2]],
      morphology:{ micro:0, hypochromia:0, elliptocyte:0, schistocyte:0, polychromasia:0 },
      summary:'Normaler technischer Basis-Preset. Procedural RBCs; WBCs bleiben TEMP_VISUAL_DONOR.'
    },
    iron_deficiency: {
      id:'iron_deficiency', label:'EISENMANGEL · POC', rbc:1150, platelets:105,
      wbc:[['segmented_neutrophil',7],['mature_lymphocyte',4],['monocyte',2]],
      morphology:{ micro:.50, hypochromia:.58, elliptocyte:.11, schistocyte:0, polychromasia:.01 },
      summary:'Technischer Composer-Test: kleinere/hypochromere RBC-Population + Teilmenge elliptischer/pencil-artiger Formen. Nicht medizinisch kalibriert.'
    },
    tma: {
      id:'tma', label:'TMA · POC', rbc:1120, platelets:32,
      wbc:[['segmented_neutrophil',7],['mature_lymphocyte',4],['monocyte',2]],
      morphology:{ micro:0, hypochromia:0, elliptocyte:0, schistocyte:.065, polychromasia:.035 },
      summary:'Technischer Composer-Test: kleine diverse Fragmentformen + reduzierte Plättchendichte. Häufigkeiten sind POC-Platzhalter, keine klinischen Defaults.'
    }
  };

  const params = new URLSearchParams(location.search);
  const requestedPreset = params.get('preset');
  const initialPreset = RECIPES[requestedPreset] ? requestedPreset : 'normal';
  const initialSeed = Number(params.get('seed')) || 42;
  const initialObjective = Number(params.get('objective')) === 40 ? 40 : 100;

  const state = {
    seed: initialSeed,
    preset: initialPreset,
    objective: initialObjective,
    focus: 0,
    view: { x: WORLD.w * .50, y: WORLD.h * .50 },
    cells: [],
    dragging: false,
    moved: false,
    dragStart: null
  };

  function recipe(){ return RECIPES[state.preset]; }
  function mulberry32(seed){ let a=seed>>>0; return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}; }
  function gaussian(rng){ let u=0,v=0;while(!u)u=rng();while(!v)v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
  function clamp(v,lo,hi){ return Math.max(lo,Math.min(hi,v)); }

  function warpedEllipsePath(cx,cy,rx,ry,rotation,wobble,seed){
    const rng=mulberry32(seed),pts=[],n=20,cr=Math.cos(rotation),sr=Math.sin(rotation);
    for(let i=0;i<n;i++){const a=i/n*Math.PI*2,j=1+(rng()-.5)*wobble,ex=Math.cos(a)*rx*j,ey=Math.sin(a)*ry*j;pts.push({x:cx+ex*cr-ey*sr,y:cy+ex*sr+ey*cr});}
    ctx.beginPath(); const p0=pts[0],plast=pts[n-1]; ctx.moveTo((p0.x+plast.x)/2,(p0.y+plast.y)/2);
    for(let i=0;i<n;i++){const p=pts[i],q=pts[(i+1)%n];ctx.quadraticCurveTo(p.x,p.y,(p.x+q.x)/2,(p.y+q.y)/2);} ctx.closePath();
  }

  function chooseRbcClass(rng, m){
    const q=rng();
    if(q<m.schistocyte) return 'schistocyte_fragment';
    if(q<m.schistocyte+m.elliptocyte) return 'elliptocyte_pencil_cell';
    if(q<m.schistocyte+m.elliptocyte+m.polychromasia) return 'polychromatophilic_rbc';
    const micro = rng() < m.micro;
    const hypo = rng() < m.hypochromia;
    if(micro || hypo) return 'microcytic_hypochromic_rbc';
    return 'normal_erythrocyte';
  }

  function createRbc(rng,i){
    const m=recipe().morphology;
    const cls=chooseRbcClass(rng,m);
    let r=clamp(16+gaussian(rng)*1.15,13.4,18.8),aspect=clamp(1+gaussian(rng)*.04,.92,1.09),pallor=clamp(.31+gaussian(rng)*.022,.26,.36),wobble=.06+rng()*.06;
    if(cls==='microcytic_hypochromic_rbc'){r*=.80+rng()*.08;pallor=clamp(.49+gaussian(rng)*.035,.42,.58);aspect=clamp(1+gaussian(rng)*.08,.86,1.18);}
    if(cls==='elliptocyte_pencil_cell'){r*=.94;aspect=1.65+rng()*.55;pallor=.34+rng()*.08;wobble=.05+rng()*.04;}
    if(cls==='polychromatophilic_rbc'){r*=1.05+rng()*.08;pallor=.23+rng()*.05;}
    if(cls==='schistocyte_fragment'){r*=.58+rng()*.18;pallor=0;aspect=1;wobble=0;}
    return {instanceId:`rbc-${i}`,family:'rbc',class:cls,truth:cls,sourceStatus:cls==='normal_erythrocyte'?'PROCEDURAL_POC':'TECHNICAL_PATHOLOGY_PLACEHOLDER',x:rng()*WORLD.w,y:rng()*WORLD.h,r,aspect,rotation:rng()*Math.PI*2,hueShift:gaussian(rng)*2.2,pallor,wobble,seed:(state.seed*65537+i*31)>>>0};
  }

  function createPlatelet(rng,i){return{instanceId:`plt-${i}`,family:'platelet',class:'normal_platelet',truth:'normal_platelet',sourceStatus:'PROCEDURAL_POC',x:rng()*WORLD.w,y:rng()*WORLD.h,r:2.1+rng()*1.5,rotation:rng()*Math.PI,seed:(state.seed*131071+i*101)>>>0};}
  function createWbc(rng,type,i){const size=type==='monocyte'?31:type==='segmented_neutrophil'?27:21;return{instanceId:`wbc-${type}-${i}`,family:'wbc',class:type,truth:type,sourceStatus:'PROCEDURAL_TEMP_VISUAL_DONOR',x:90+rng()*(WORLD.w-180),y:90+rng()*(WORLD.h-180),r:size*(.92+rng()*.15),rotation:rng()*Math.PI*2,seed:(state.seed*524287+i*337+type.length*13)>>>0};}

  function generateField(){
    const rng=mulberry32(state.seed),cells=[],r=recipe();
    for(let i=0;i<r.rbc;i++)cells.push(createRbc(rng,i));
    for(let i=0;i<r.platelets;i++)cells.push(createPlatelet(rng,i));
    let wi=0; for(const[type,amount]of r.wbc){for(let i=0;i<amount;i++)cells.push(createWbc(rng,type,wi++));}
    cells.sort((a,b)=>a.family==='wbc'?1:b.family==='wbc'?-1:0); state.cells=cells;
    counts.rbc.textContent=r.rbc; counts.platelet.textContent=r.platelets; counts.wbc.textContent=wi; recipeSummary.textContent=r.summary; updateStatus(); draw();
  }

  function fillRbcEllipse(c,fill,edge){
    const rx=c.r*c.aspect,ry=c.r/c.aspect; warpedEllipsePath(c.x,c.y,rx,ry,c.rotation,c.wobble,c.seed); ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=.7;ctx.globalAlpha=.32;ctx.stroke();ctx.globalAlpha=1;
  }

  function drawRbc(c){
    ctx.save();
    if(c.class==='schistocyte_fragment'){
      const rng=mulberry32(c.seed),n=3+Math.floor(rng()*3),pts=[];
      for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2+c.rotation,rr=c.r*(.70+rng()*.52);pts.push([c.x+Math.cos(a)*rr,c.y+Math.sin(a)*rr]);}
      ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();ctx.fillStyle='#d89096';ctx.fill();ctx.strokeStyle='rgba(126,72,79,.42)';ctx.lineWidth=.7;ctx.stroke();ctx.restore();return;
    }
    if(c.class==='polychromatophilic_rbc'){
      fillRbcEllipse(c,'#aab7c8','rgba(92,92,118,.32)');ctx.restore();return;
    }
    const rx=c.r*c.aspect,ry=c.r/c.aspect;
    warpedEllipsePath(c.x,c.y,rx,ry,c.rotation,c.wobble,c.seed);
    ctx.fillStyle=`hsl(${350+c.hueShift} 41% ${c.class==='microcytic_hypochromic_rbc'?78:75}%)`;ctx.fill();
    ctx.strokeStyle=`hsla(${350+c.hueShift} 36% 54% / .28)`;ctx.lineWidth=.7;ctx.stroke();
    const paleRx=rx*clamp(c.pallor*1.42,.30,.78),paleRy=ry*clamp(c.pallor*1.42,.30,.78);
    ctx.save();ctx.globalAlpha=c.class==='microcytic_hypochromic_rbc'?.92:.76;warpedEllipsePath(c.x,c.y,paleRx,paleRy,c.rotation,c.wobble*.55,c.seed^0x51a2);ctx.fillStyle='#f2dedb';ctx.fill();ctx.restore();
    ctx.restore();
  }

  function granules(c,rng,n,color,minR,maxR,alpha){ctx.save();ctx.fillStyle=color;ctx.globalAlpha=alpha;for(let i=0;i<n;i++){const a=rng()*Math.PI*2,rr=Math.sqrt(rng())*c.r*.72,x=c.x+Math.cos(a)*rr,y=c.y+Math.sin(a)*rr;ctx.beginPath();ctx.arc(x,y,minR+rng()*(maxR-minR),0,Math.PI*2);ctx.fill();}ctx.restore();}
  function drawWbc(c){
    const rng=mulberry32(c.seed);ctx.save();const cyt=ctx.createRadialGradient(c.x-c.r*.15,c.y-c.r*.15,1,c.x,c.y,c.r);
    if(c.class==='segmented_neutrophil'){
      cyt.addColorStop(0,'#f3eef6');cyt.addColorStop(1,'#d8d0e5');ctx.fillStyle=cyt;ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.fill();granules(c,rng,52,'#9674a6',.45,1.05,.30);
      const lobes=3+Math.floor(rng()*2),base=c.rotation;ctx.strokeStyle='#62416f';ctx.lineWidth=1.8;ctx.globalAlpha=.72;ctx.beginPath();
      for(let i=0;i<lobes;i++){const a=base+i/lobes*Math.PI*2,x=c.x+Math.cos(a)*c.r*.28,y=c.y+Math.sin(a)*c.r*.22;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.globalAlpha=1;
      for(let i=0;i<lobes;i++){const a=base+i/lobes*Math.PI*2,x=c.x+Math.cos(a)*c.r*.30,y=c.y+Math.sin(a)*c.r*.24;ctx.save();ctx.translate(x,y);ctx.rotate(a*.4);ctx.fillStyle='#593567';ctx.beginPath();ctx.ellipse(0,0,c.r*.20,c.r*.27,0,0,Math.PI*2);ctx.fill();ctx.restore();}
    }else if(c.class==='mature_lymphocyte'){
      cyt.addColorStop(0,'#d7e5f8');cyt.addColorStop(1,'#a7bce0');ctx.fillStyle=cyt;ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#4d2c67';ctx.beginPath();ctx.arc(c.x+c.r*.02,c.y-c.r*.01,c.r*.71,0,Math.PI*2);ctx.fill();
    }else{
      cyt.addColorStop(0,'#d9e4ec');cyt.addColorStop(1,'#a9bccb');ctx.fillStyle=cyt;ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.fill();granules(c,rng,32,'#7f7791',.45,.9,.16);ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.rotation);ctx.fillStyle='#65456e';ctx.beginPath();ctx.moveTo(-c.r*.45,-c.r*.22);ctx.bezierCurveTo(-c.r*.10,-c.r*.60,c.r*.42,-c.r*.34,c.r*.34,c.r*.05);ctx.bezierCurveTo(c.r*.28,c.r*.42,-c.r*.02,c.r*.52,-c.r*.32,c.r*.30);ctx.bezierCurveTo(-c.r*.04,c.r*.12,c.r*.02,-c.r*.10,-c.r*.45,-c.r*.22);ctx.fill();ctx.restore();
    }
    ctx.strokeStyle='rgba(72,49,83,.20)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  function drawPlatelet(c){const rng=mulberry32(c.seed);ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.rotation);ctx.fillStyle='#75508a';ctx.beginPath();ctx.ellipse(0,0,c.r*1.12,c.r*.72,.2,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.50;ctx.fillStyle='#4d2e68';for(let i=0;i<3;i++){ctx.beginPath();ctx.arc((rng()-.5)*c.r,(rng()-.5)*c.r*.7,.4+rng()*.4,0,Math.PI*2);ctx.fill();}ctx.restore();}

  function scaleForObjective(){return state.objective===100?1.18:.56;}
  function resizeCanvas(){const rect=scope.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));canvas.style.width=`${rect.width}px`;canvas.style.height=`${rect.height}px`;draw();}
  function draw(){
    if(!canvas.width||!canvas.height)return;const dpr=canvas.width/Math.max(1,scope.clientWidth),z=scaleForObjective()*dpr,vw=canvas.width/z,vh=canvas.height/z;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#f6eee9';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.save();ctx.setTransform(z,0,0,z,canvas.width/2-state.view.x*z,canvas.height/2-state.view.y*z);
    const rng=mulberry32(state.seed^0xA53A9E37);ctx.fillStyle='rgba(146,102,97,.035)';for(let i=0;i<180;i++){ctx.beginPath();ctx.arc(rng()*WORLD.w,rng()*WORLD.h,.7+rng()*1.6,0,Math.PI*2);ctx.fill();}
    const margin=70;for(const c of state.cells){if(c.x<state.view.x-vw/2-margin||c.x>state.view.x+vw/2+margin||c.y<state.view.y-vh/2-margin||c.y>state.view.y+vh/2+margin)continue;if(c.family==='rbc')drawRbc(c);else if(c.family==='platelet')drawPlatelet(c);else drawWbc(c);}ctx.restore();
  }

  function screenToWorld(clientX,clientY){const rect=canvas.getBoundingClientRect(),z=scaleForObjective();return{x:state.view.x+(clientX-rect.left-rect.width/2)/z,y:state.view.y+(clientY-rect.top-rect.height/2)/z};}
  function pickCell(clientX,clientY){const p=screenToWorld(clientX,clientY);let best=null,bestD=Infinity;for(const c of state.cells){if(c.family==='rbc')continue;const d=Math.hypot(p.x-c.x,p.y-c.y),hit=c.family==='wbc'?c.r*1.15:c.r*2.4;if(d<hit&&d<bestD){best=c;bestD=d;}}return best;}
  function showCell(c){if(!c){debugLabel.hidden=true;return;}const labels={segmented_neutrophil:'Segmentierter Neutrophiler',mature_lymphocyte:'Reifer Lymphozyt',monocyte:'Monozyt',normal_platelet:'Thrombozyt'};debugLabel.innerHTML=`<strong>${labels[c.truth]||c.truth}</strong><br><span>${c.instanceId} · ${c.sourceStatus}</span>`;debugLabel.hidden=false;}
  function clampView(){const z=scaleForObjective(),w=scope.clientWidth/z,h=scope.clientHeight/z;state.view.x=clamp(state.view.x,w*.48,WORLD.w-w*.48);state.view.y=clamp(state.view.y,h*.48,WORLD.h-h*.48);}
  function updateStatus(){status.textContent=`${recipe().label} · seed ${state.seed}`;objectiveLabel.textContent=`${state.objective}×`;document.querySelectorAll('[data-objective]').forEach(b=>b.classList.toggle('active',Number(b.dataset.objective)===state.objective));document.querySelectorAll('[data-preset]').forEach(b=>b.classList.toggle('active',b.dataset.preset===state.preset));}
  function syncUrl(){try{const u=new URL(location.href);u.searchParams.set('preset',state.preset);u.searchParams.set('seed',String(state.seed));u.searchParams.set('objective',String(state.objective));history.replaceState(null,'',u);}catch(_){} }

  scope.addEventListener('pointerdown',e=>{if(scope.setPointerCapture)scope.setPointerCapture(e.pointerId);state.dragging=true;state.moved=false;scope.classList.add('dragging');state.dragStart={x:e.clientX,y:e.clientY,viewX:state.view.x,viewY:state.view.y};debugLabel.hidden=true;});
  scope.addEventListener('pointermove',e=>{if(!state.dragging)return;const dx=e.clientX-state.dragStart.x,dy=e.clientY-state.dragStart.y;if(Math.hypot(dx,dy)>4)state.moved=true;const z=scaleForObjective();state.view.x=state.dragStart.viewX-dx/z;state.view.y=state.dragStart.viewY-dy/z;clampView();draw();});
  scope.addEventListener('pointerup',e=>{if(!state.dragging)return;state.dragging=false;scope.classList.remove('dragging');if(!state.moved)showCell(pickCell(e.clientX,e.clientY));});
  scope.addEventListener('pointercancel',()=>{state.dragging=false;scope.classList.remove('dragging');});

  document.querySelectorAll('[data-objective]').forEach(btn=>btn.addEventListener('click',()=>{state.objective=Number(btn.dataset.objective);clampView();updateStatus();syncUrl();draw();}));
  document.querySelectorAll('[data-preset]').forEach(btn=>btn.addEventListener('click',()=>{state.preset=btn.dataset.preset;state.view.x=WORLD.w*.5;state.view.y=WORLD.h*.5;debugLabel.hidden=true;generateField();syncUrl();}));
  focus.addEventListener('input',()=>{state.focus=Number(focus.value);focusLabel.textContent=state.focus.toFixed(1);canvas.style.filter=`blur(${state.focus*.34}px)`;});
  document.getElementById('resetView').addEventListener('click',()=>{state.view.x=WORLD.w*.5;state.view.y=WORLD.h*.5;state.objective=100;focus.value='0';focus.dispatchEvent(new Event('input'));updateStatus();syncUrl();draw();});
  document.getElementById('newSeed').addEventListener('click',()=>{state.seed=Math.floor(Math.random()*999999)+1;state.view.x=WORLD.w*.5;state.view.y=WORLD.h*.5;debugLabel.hidden=true;generateField();syncUrl();});

  if('ResizeObserver' in window){const ro=new ResizeObserver(resizeCanvas);ro.observe(scope);}else{window.addEventListener('resize',resizeCanvas);resizeCanvas();}
  generateField();syncUrl();
})();
