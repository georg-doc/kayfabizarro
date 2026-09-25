// B2b-P1 deterministic collage compositor.
// Direct lineage from Gate-1 drawCollageFace()/BillboardContent:
// torn fragments + oversized KFB/ChatterBox type + paper grain + one CanvasTexture.
// Structural randomness is fully seeded here; no per-frame Math.random choices.

export const RECIPES = Object.freeze(['HEADLINE_SHOCK','POSTER_STACK','SIGNAL_NOISE','ARCHIVE_FEVER']);
export const GRADES = Object.freeze(['WARM_DIRTY','COLD_PRINT','ACID_FAIRGROUND','MONO_PAPER']);
export const TREATMENTS = Object.freeze(['FLAT_COLLAGE','LIVING_SCREEN']);
const ROLES = Object.freeze(['LEFT','RIGHT','FULL']);
const CUT_MS = 4800;
const LIVING_MS = 84;

function hashSeed(text) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function pick(rng, values) { return values[Math.floor(rng() * values.length) % values.length]; }
function chooseExcluding(rng, values, banned) {
  const ok = values.filter((v) => !banned.includes(typeof v === 'string' ? v : v.id));
  return pick(rng, ok.length ? ok : values);
}
function shuffled(rng, values) {
  const a = values.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function cover(ctx, image, x, y, w, h, zoom = 1, ox = 0, oy = 0) {
  const iw = image.width || image.videoWidth || 1;
  const ih = image.height || image.videoHeight || 1;
  const s = Math.max(w / iw, h / ih) * zoom;
  const dw = iw * s, dh = ih * s;
  ctx.drawImage(image, x + (w - dw) / 2 + ox, y + (h - dh) / 2 + oy, dw, dh);
}
function tornPath(ctx, x, y, w, h, rng, jitter = 12, seg = 8) {
  const edges = [[x,y,x+w,y],[x+w,y,x+w,y+h],[x+w,y+h,x,y+h],[x,y+h,x,y]];
  const pts = [];
  for (const [x1,y1,x2,y2] of edges) {
    for (let i=0;i<=seg;i++) {
      const t=i/seg, px=x1+(x2-x1)*t, py=y1+(y2-y1)*t;
      const nx=-(y2-y1), ny=x2-x1, len=Math.hypot(nx,ny)||1;
      const j=(rng()-.5)*jitter*(i>0&&i<seg?1:.12);
      pts.push([px+(nx/len)*j,py+(ny/len)*j]);
    }
  }
  ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]);
  ctx.closePath();
}
const PALETTE = {
  WARM_DIRTY: {bg:'#211812',paper:'#e9d7ad',ink:'#201813',a:'#bf4d2d',b:'#d7a033',wash:'rgba(147,77,38,.16)'},
  COLD_PRINT: {bg:'#13272b',paper:'#d8e3dc',ink:'#132025',a:'#356b68',b:'#c8d7cf',wash:'rgba(39,103,110,.15)'},
  ACID_FAIRGROUND: {bg:'#241727',paper:'#efe0ac',ink:'#20141d',a:'#ce3f72',b:'#d9bd32',wash:'rgba(206,63,114,.14)'},
  MONO_PAPER: {bg:'#1d1c19',paper:'#e5dfcf',ink:'#1c1b18',a:'#69655d',b:'#b7ae9e',wash:'rgba(20,20,20,.12)'}
};
function gradeImage(ctx, p, x, y, w, h) {
  ctx.save();
  ctx.globalCompositeOperation='multiply'; ctx.fillStyle=p.wash; ctx.fillRect(x,y,w,h);
  ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=.08; ctx.fillStyle=p.paper; ctx.fillRect(x,y,w,h);
  ctx.restore();
}
function seededGrain(ctx,W,H,rng,alpha=.055,count=820) {
  ctx.save(); ctx.globalAlpha=alpha;
  for(let i=0;i<count;i++){
    const v=rng()>.5?'#fff':'#000';
    ctx.fillStyle=v; ctx.fillRect(rng()*W,rng()*H,1+rng()*1.4,1+rng()*1.4);
  }
  ctx.restore();
}
function tag(ctx,text,x,y,p) {
  ctx.save(); ctx.font="700 15px 'JetBrains Mono', ui-monospace, monospace";
  const w=ctx.measureText(text).width+18;
  ctx.fillStyle=p.ink; ctx.fillRect(x,y,w,28);
  ctx.fillStyle=p.paper; ctx.textBaseline='middle'; ctx.fillText(text,x+9,y+14);
  ctx.restore();
}
function headline(ctx,beat,W,H,p,rng,recipe){
  const key=(beat && beat.key)||'SHOW IT';
  const line=(beat && beat.line)||'UNCLE FRIZZLEBOB\'S TRAVELING SIDESHOW';
  ctx.save();
  const size=recipe==='HEADLINE_SHOCK'?Math.floor(H*.25):Math.floor(H*.16);
  ctx.font="700 "+size+"px 'Anton', Impact, sans-serif";
  ctx.textAlign='left'; ctx.textBaseline='alphabetic';
  ctx.translate(W*.055,H*.82); ctx.rotate((rng()-.5)*.045);
  ctx.lineWidth=Math.max(3,size*.035); ctx.strokeStyle=p.paper; ctx.fillStyle=p.ink;
  ctx.strokeText(key,0,0); ctx.fillText(key,0,0);
  ctx.restore();
  ctx.save();
  ctx.font="700 19px 'JetBrains Mono', ui-monospace, monospace";
  ctx.fillStyle=p.paper; ctx.fillText(line.toUpperCase(),W*.058,H*.91);
  ctx.restore();
}
function drawAsset(ctx,asset,box,rng,p,{angle=0,alpha=1,torn=true,zoom=1}={}){
  ctx.save(); ctx.globalAlpha=alpha;
  ctx.translate(box.x+box.w/2,box.y+box.h/2); ctx.rotate(angle);
  const x=-box.w/2,y=-box.h/2;
  ctx.fillStyle=p.paper; ctx.fillRect(x-8,y-8,box.w+16,box.h+16);
  if(torn){tornPath(ctx,x,y,box.w,box.h,rng,14,9);ctx.clip();}
  cover(ctx,asset.image,x,y,box.w,box.h,zoom);
  gradeImage(ctx,p,x,y,box.w,box.h);
  ctx.restore();
}
function layout(recipe,W,H,rng){
  if(recipe==='HEADLINE_SHOCK') return [
    {x:W*.05,y:H*.07,w:W*.56,h:H*.58,a:-.035},
    {x:W*.59,y:H*.11,w:W*.35,h:H*.39,a:.04},
    {x:W*.64,y:H*.48,w:W*.28,h:H*.27,a:-.025}
  ];
  if(recipe==='POSTER_STACK') return [
    {x:W*.08,y:H*.05,w:W*.42,h:H*.72,a:-.055},
    {x:W*.36,y:H*.10,w:W*.40,h:H*.67,a:.035},
    {x:W*.69,y:H*.08,w:W*.25,h:H*.48,a:-.02}
  ];
  if(recipe==='SIGNAL_NOISE') return [
    {x:W*.04,y:H*.10,w:W*.49,h:H*.58,a:0},
    {x:W*.51,y:H*.06,w:W*.45,h:H*.41,a:.02},
    {x:W*.56,y:H*.45,w:W*.36,h:H*.31,a:-.035}
  ];
  return [
    {x:W*.03,y:H*.05,w:W*.62,h:H*.66,a:-.018},
    {x:W*.62,y:H*.07,w:W*.34,h:H*.49,a:.028},
    {x:W*.64,y:H*.51,w:W*.29,h:H*.27,a:-.04}
  ];
}
function drawComposition(ctx,W,H,comp,assets,beats,phase=0,living=false){
  const p=PALETTE[comp.grade], rng=mulberry32(hashSeed(comp.signature+'|draw'));
  ctx.clearRect(0,0,W,H); ctx.fillStyle=p.bg; ctx.fillRect(0,0,W,H);
  ctx.fillStyle=p.a; ctx.globalAlpha=.16; ctx.fillRect(0,0,W,H*.18); ctx.globalAlpha=1;

  const boxes=layout(comp.recipe,W,H,rng);
  const chosen=[comp.hero,...comp.supports].map(id=>assets.find(a=>a.id===id)).filter(Boolean);
  chosen.slice(0,3).forEach((asset,i)=>{
    const b=boxes[i];
    drawAsset(ctx,asset,b,rng,p,{angle:b.a,alpha:i?(.86-i*.08):1,torn:true,zoom:i===0?1.04:1});
  });

  if(comp.recipe==='SIGNAL_NOISE'){
    ctx.save(); ctx.globalAlpha=.22; ctx.fillStyle=p.b;
    for(let i=0;i<18;i++) ctx.fillRect(0,(i/18)*H + (rng()-.5)*5,W,1+rng()*4);
    ctx.restore();
  }
  if(comp.recipe==='ARCHIVE_FEVER'){
    ctx.save(); ctx.strokeStyle=p.b; ctx.globalAlpha=.45; ctx.lineWidth=2;
    for(let i=0;i<7;i++) ctx.strokeRect(W*(.03+i*.016),H*(.04+i*.013),W*.91,H*.82);
    ctx.restore();
  }
  headline(ctx,beats[comp.beatIndex%Math.max(1,beats.length)],W,H,p,rng,comp.recipe);
  tag(ctx,comp.recipe.replaceAll('_',' ')+' · '+comp.grade.replaceAll('_',' '),18,18,p);
  tag(ctx,'CUT '+String(comp.index+1).padStart(2,'0')+' · '+comp.heroKind,18,52,p);

  seededGrain(ctx,W,H,rng,.048,760);
  const vg=ctx.createRadialGradient(W*.5,H*.46,H*.16,W*.5,H*.46,H*.78);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(10,7,5,.28)');
  ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

  if(living){
    ctx.save();
    const y=(phase%1)*H;
    const gl=ctx.createLinearGradient(0,y-70,0,y+70);
    gl.addColorStop(0,'rgba(255,255,255,0)');
    gl.addColorStop(.5,'rgba(255,255,255,.055)');
    gl.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=gl; ctx.fillRect(0,Math.max(0,y-72),W,144);
    ctx.globalAlpha=.045; ctx.fillStyle='#fff';
    for(let yy=2;yy<H;yy+=5) ctx.fillRect(0,yy,W,1);
    ctx.restore();
  }
}

export async function loadCc0Pool(url='./cc0-pool.json'){
  const r=await fetch(url,{cache:'no-store'});
  if(!r.ok) throw new Error('cc0 pool '+r.status);
  const meta=await r.json();
  const out=[];
  for(const item of meta.items||[]){
    const ir=await fetch(item.runtimeUrl,{cache:'force-cache'});
    if(!ir.ok) throw new Error(item.id+' '+ir.status);
    const image=await createImageBitmap(await ir.blob());
    out.push({...item,kind:'CC0',label:item.title,image});
  }
  return out;
}

class Scheduler {
  constructor(seed,assets,beats){this.assets=assets.slice().sort((a,b)=>a.id.localeCompare(b.id));this.beats=beats;this.setSeed(seed);}
  setSeed(seed){this.seed=String(seed);this.rng=mulberry32(hashSeed(this.seed));this.heroHistory=[];this.recipeHistory=[];this.lastRole=null;this.index=0;}
  next(){
    const hero=chooseExcluding(this.rng,this.assets,this.heroHistory);
    const recipe=chooseExcluding(this.rng,RECIPES,this.recipeHistory);
    const role=chooseExcluding(this.rng,ROLES,this.lastRole?[this.lastRole]:[]);
    const grade=pick(this.rng,GRADES);
    const opposite=this.assets.filter(a=>a.id!==hero.id && a.kind!==hero.kind);
    const same=this.assets.filter(a=>a.id!==hero.id && a.kind===hero.kind);
    const supports=[];
    const s1=pick(this.rng,opposite.length?opposite:this.assets.filter(a=>a.id!==hero.id));
    if(s1) supports.push(s1);
    const rest=this.assets.filter(a=>a.id!==hero.id&&!supports.some(s=>s.id===a.id));
    const s2=pick(this.rng,shuffled(this.rng,rest));
    if(s2) supports.push(s2);
    const beatIndex=Math.floor(this.rng()*Math.max(1,this.beats.length));
    const comp={
      index:this.index++,recipe,grade,hero:hero.id,heroKind:hero.kind,heroRole:role,
      supports:supports.map(s=>s.id),beatIndex
    };
    comp.signature=[this.seed,comp.index,recipe,grade,hero.id,role,...comp.supports,beatIndex].join('|');
    this.heroHistory.push(hero.id); if(this.heroHistory.length>4)this.heroHistory.shift();
    this.recipeHistory.push(recipe); if(this.recipeHistory.length>2)this.recipeHistory.shift();
    this.lastRole=role;
    return comp;
  }
}
export function makeSequence({seed='kfb-b2b-p1',assets=[],beats=[],count=12}={}){
  const s=new Scheduler(seed,assets,beats); const out=[];
  for(let i=0;i<count;i++)out.push(s.next());
  return out;
}
export function createCollageEngine({canvas,seed='kfb-b2b-p1',treatment='FLAT_COLLAGE',assets=[],beats=[],onFrame=()=>{}}={}){
  let cv=canvas, current=null, running=false, lastCut=0, lastLiving=0, structuralDraws=0, livingDraws=0;
  let scheduler=new Scheduler(seed,assets,beats);
  let currentSeed=String(seed), currentTreatment=TREATMENTS.includes(treatment)?treatment:'FLAT_COLLAGE';
  function draw(kind='structural'){
    if(!cv||!current)return;
    const ctx=cv.getContext('2d');
    const phase=(performance.now()%2200)/2200;
    drawComposition(ctx,cv.width,cv.height,current,assets,beats,phase,currentTreatment==='LIVING_SCREEN');
    if(kind==='living')livingDraws++;else structuralDraws++;
    onFrame(kind);
  }
  function next(){current=scheduler.next();lastCut=performance.now();draw('structural');return current;}
  return {
    attachCanvas(canvas2){cv=canvas2;},
    start(){running=true;if(!current)next();lastCut=performance.now();},
    stop(){running=false;},
    next,
    render(force=false){if(force||current)draw('structural');},
    advance(now=performance.now()){
      if(!running)return false;
      if(now-lastCut>=CUT_MS){next();return true;}
      if(currentTreatment==='LIVING_SCREEN'&&now-lastLiving>=LIVING_MS){lastLiving=now;draw('living');return true;}
      return false;
    },
    setTreatment(t){currentTreatment=TREATMENTS.includes(t)?t:'FLAT_COLLAGE';if(current)draw('structural');},
    setSeed(s,redraw=true){currentSeed=String(s||'kfb-b2b-p1');scheduler=new Scheduler(currentSeed,assets,beats);current=null;if(redraw)next();},
    sequence(n=12,s=currentSeed){return makeSequence({seed:String(s),assets,beats,count:n});},
    snapshot(){
      return {
        seed:currentSeed,treatment:currentTreatment,recipe:current?.recipe||null,grade:current?.grade||null,
        hero:current?.hero||null,heroRole:current?.heroRole||null,supports:current?.supports||[],
        compositionIndex:current?.index??-1,structuralDraws,livingDraws,running,
        cc0Count:assets.filter(a=>a.kind==='CC0').length,kfbCount:assets.filter(a=>a.kind==='KFB').length,
        maxImageLayers:3,maxTextLayers:3,
        scheduler:{heroHistory:4,recipeHistory:2,immediateRoleRepeat:false}
      };
    }
  };
}
