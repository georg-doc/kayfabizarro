// KFB Billboard B2b-P1 · deterministic CanvasTexture collage engine
// [DONOR COPY] The Gate-1 functions below are copied from
// BILLBOARD_B0_SOURCE_PROOF_2026-09-24/bb-scene.js lines 236-294 and 358-401.
// The source rendering is kept intact and rendered first into every composition.
// [NAHT] Everything after drawGate1CollageFace() is the B2b scheduler/asset/treatment seam.

export const RECIPES = ['HEADLINE_SHOCK', 'POSTER_STACK', 'SIGNAL_NOISE', 'ARCHIVE_FEVER'];
export const GRADES = ['WARM_DIRTY', 'COLD_PRINT', 'ACID_FAIRGROUND', 'MONO_PAPER'];
export const TREATMENTS = ['FLAT_COLLAGE', 'LIVING_SCREEN'];

const PHRASES = [
  'NORMAL IS A SPECIAL EFFECT',
  'REALITY HAS SPONSORS',
  'THE ARCHIVE IS STILL BROADCASTING',
  'EVERY EXIT IS A SCREEN',
  'THIS MESSAGE REMEMBERS YOU',
  'DO NOT ADJUST YOUR MEMORY',
  'THE PAST IS RUNNING AN AD',
  'PUBLIC SPACE HAS A DREAM'
];

function makeRng(seed) {
  let x = (Number(seed) >>> 0) || 0x6d2b79f5;
  return () => {
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17; x >>>= 0;
    x ^= x << 5; x >>>= 0;
    return (x >>> 0) / 4294967296;
  };
}

function pickAllowed(list, banned, rng) {
  const pool = list.filter((x) => !banned.includes(x));
  const usable = pool.length ? pool : list;
  return usable[Math.floor(rng() * usable.length) % usable.length];
}

function paperGrain(ctx, W, H) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
    ctx.fillRect(Math.random() * W, Math.random() * H, 1.6, 1.6);
  }
  ctx.restore();
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(20,12,6,0.24)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function tag(ctx, text, x, y, opts = {}) {
  ctx.save();
  const size = opts.size || 15;
  ctx.font = size + "px 'JetBrains Mono', monospace";
  const pad = 8;
  const w = ctx.measureText(text).width + pad * 2;
  ctx.fillStyle = opts.bg || 'rgba(35,26,19,0.82)';
  ctx.fillRect(x, y, w, size + 10);
  ctx.fillStyle = opts.fg || '#f2e6c9';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + pad, y + size / 2 + 5);
  ctx.restore();
  return w;
}

function tornClip(ctx, x, y, w, h, jitter = 6, seg = 7) {
  const pts = [];
  const edges = [[x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]];
  for (const [x1, y1, x2, y2] of edges) {
    for (let i = 0; i <= seg; i++) {
      const t = i / seg;
      const px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t;
      const nx = -(y2 - y1), ny = (x2 - x1);
      const len = Math.hypot(nx, ny) || 1;
      const j = (Math.random() - 0.5) * jitter * (i > 0 && i < seg ? 1 : 0.15);
      pts.push([px + (nx / len) * j, py + (ny / len) * j]);
    }
  }
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

export function drawGate1CollageFace(ctx, W, H, cardResult, t, revealed) {
  ctx.fillStyle = '#231a13'; ctx.fillRect(0, 0, W, H);
  const frags = [
    { x: W * 0.04, y: H * 0.08, w: W * 0.46, h: H * 0.5, rot: -0.04, speed: 0.6, phase: 0 },
    { x: W * 0.42, y: H * 0.34, w: W * 0.42, h: H * 0.48, rot: 0.05, speed: 0.5, phase: 1.4 },
    { x: W * 0.18, y: H * 0.5, w: W * 0.36, h: H * 0.42, rot: -0.02, speed: 0.7, phase: 2.6 }
  ];
  frags.forEach((f, i) => {
    const alpha = revealed ? 0.94 : Math.max(0.4, 0.6 + 0.3 * Math.sin(t * f.speed + f.phase));
    const drift = revealed ? 0 : Math.sin(t * 0.3 + f.phase) * 6;
    ctx.save();
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.translate(f.x + f.w / 2 + drift, f.y + f.h / 2);
    ctx.rotate(f.rot);
    tornClip(ctx, -f.w / 2, -f.h / 2, f.w, f.h, 7, 7);
    ctx.clip();
    if (cardResult && cardResult.canvas) {
      const img = cardResult.canvas;
      const s = Math.max(f.w / img.width, f.h / img.height) * (1 + i * 0.15);
      ctx.drawImage(img, -img.width * s / 2, -img.height * s / 2, img.width * s, img.height * s);
      ctx.fillStyle = 'rgba(35,26,19,0.18)'; ctx.fillRect(-f.w / 2, -f.h / 2, f.w, f.h);
    } else {
      ctx.fillStyle = i % 2 ? '#dba233' : '#2c5c56';
      ctx.fillRect(-f.w / 2, -f.h / 2, f.w, f.h);
      ctx.fillStyle = '#f2e6c9';
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.fillText('FRAGMENT — awaiting KFB card art', 0, 0);
      ctx.textAlign = 'left';
    }
    ctx.restore();
  });
  ctx.save();
  ctx.globalAlpha = revealed ? 1 : 0.5;
  ctx.fillStyle = '#f2e6c9';
  ctx.font = '700 ' + (revealed ? 150 : 128) + "px 'Anton', sans-serif";
  ctx.textAlign = 'center';
  ctx.translate(W * 0.62, H * 0.72);
  ctx.rotate(-0.05);
  ctx.fillText(revealed ? 'FLUFFY' : 'STAY', 0, 0);
  ctx.restore();
  paperGrain(ctx, W, H);
  tag(ctx, 'COLLAGE LOOP · HyperNormalisation cut', 14, 14);
}

const RECIPE_META = {
  HEADLINE_SHOCK: { heroRole: 'left', layout: [[0.02,0.18,0.50,0.72,-0.035],[0.55,0.08,0.34,0.36,0.045],[0.61,0.50,0.32,0.38,-0.02]] },
  POSTER_STACK: { heroRole: 'right', layout: [[0.48,0.05,0.48,0.80,0.035],[0.05,0.12,0.34,0.42,-0.055],[0.12,0.54,0.30,0.34,0.025]] },
  SIGNAL_NOISE: { heroRole: 'center', layout: [[0.21,0.09,0.58,0.73,-0.012],[0.01,0.48,0.28,0.40,-0.045],[0.72,0.14,0.26,0.36,0.04]] },
  ARCHIVE_FEVER: { heroRole: 'full', layout: [[0.05,0.06,0.88,0.82,0.006],[0.02,0.55,0.30,0.36,-0.05],[0.70,0.08,0.27,0.34,0.055]] }
};

export function generateSequence(seed, assets, count = 8) {
  const ids = assets.map((a) => typeof a === 'string' ? a : a.assetId);
  const rng = makeRng(seed);
  const out = [];
  const heroMemory = [];
  const recipeMemory = [];
  let lastRole = null;
  for (let i = 0; i < count; i++) {
    let recipe = pickAllowed(RECIPES, recipeMemory.slice(-2), rng);
    if (RECIPE_META[recipe].heroRole === lastRole) {
      const alt = RECIPES.filter((r) => !recipeMemory.slice(-2).includes(r) && RECIPE_META[r].heroRole !== lastRole);
      if (alt.length) recipe = alt[Math.floor(rng() * alt.length) % alt.length];
    }
    const hero = pickAllowed(ids, heroMemory.slice(-4), rng);
    const supportPool = ids.filter((id) => id !== hero);
    const supportA = supportPool[Math.floor(rng() * supportPool.length) % supportPool.length];
    const supportBPool = supportPool.filter((id) => id !== supportA);
    const supportB = supportBPool[Math.floor(rng() * supportBPool.length) % supportBPool.length];
    const grade = GRADES[Math.floor(rng() * GRADES.length) % GRADES.length];
    const phrase = PHRASES[Math.floor(rng() * PHRASES.length) % PHRASES.length];
    const durationSec = +(5.0 + rng() * 1.8).toFixed(3);
    const item = {
      index: i,
      recipe,
      grade,
      hero,
      supports: [supportA, supportB],
      heroRole: RECIPE_META[recipe].heroRole,
      phrase,
      durationSec
    };
    out.push(item);
    heroMemory.push(hero);
    recipeMemory.push(recipe);
    lastRole = item.heroRole;
  }
  return out;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image failed: ' + src));
    img.src = src;
  });
}

function seededTornPath(ctx, x, y, w, h, seed) {
  const rng = makeRng(seed);
  const pts = [];
  const seg = 8, jitter = Math.min(w,h) * 0.025;
  const edges = [[x,y,x+w,y],[x+w,y,x+w,y+h],[x+w,y+h,x,y+h],[x,y+h,x,y]];
  for (const [x1,y1,x2,y2] of edges) {
    for (let i=0;i<=seg;i++) {
      const t=i/seg, px=x1+(x2-x1)*t, py=y1+(y2-y1)*t;
      const nx=-(y2-y1), ny=(x2-x1), len=Math.hypot(nx,ny)||1;
      const j=(rng()-0.5)*jitter*(i>0&&i<seg?1:0.12);
      pts.push([px+(nx/len)*j,py+(ny/len)*j]);
    }
  }
  ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]);
  ctx.closePath();
}

function drawImageCover(ctx, img, x, y, w, h) {
  const s=Math.max(w/img.naturalWidth,h/img.naturalHeight);
  const dw=img.naturalWidth*s, dh=img.naturalHeight*s;
  ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
}

function applyGrade(ctx,W,H,grade) {
  const overlays = {
    WARM_DIRTY: ['rgba(159,72,39,.18)','rgba(230,174,70,.08)'],
    COLD_PRINT: ['rgba(42,78,92,.22)','rgba(223,232,218,.05)'],
    ACID_FAIRGROUND: ['rgba(168,35,72,.12)','rgba(190,217,50,.10)'],
    MONO_PAPER: ['rgba(235,222,190,.16)','rgba(20,18,15,.15)']
  };
  const pair=overlays[grade]||overlays.WARM_DIRTY;
  ctx.save();
  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle=pair[0];ctx.fillRect(0,0,W,H);
  const g=ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0,pair[1]);g.addColorStop(1,'rgba(0,0,0,.12)');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(grade==='MONO_PAPER'){
    ctx.globalCompositeOperation='saturation';ctx.fillStyle='rgba(120,120,120,.8)';ctx.fillRect(0,0,W,H);
  }
  ctx.restore();
}

export class CollageEngine {
  constructor({ manifestUrl, seed = 18472, treatment = 'LIVING_SCREEN' }) {
    this.manifestUrl=manifestUrl;
    this.seed=Number(seed)>>>0;
    this.treatment=TREATMENTS.includes(treatment)?treatment:'LIVING_SCREEN';
    this.canvas=document.createElement('canvas'); this.canvas.width=1280; this.canvas.height=720;
    this.ctx=this.canvas.getContext('2d');
    this.base=document.createElement('canvas'); this.base.width=1280; this.base.height=720;
    this.bctx=this.base.getContext('2d');
    this.manifest=null; this.images=new Map(); this.cardResult=null;
    this.sequence=[]; this.sequenceIndex=0; this.elapsed=0; this.totalElapsed=0;
    this.current=null; this.loaded=false; this.renderCount=0; this.compositionCount=0;
  }
  async load() {
    const r=await fetch(this.manifestUrl,{cache:'no-store'});
    if(!r.ok) throw new Error('provenance manifest HTTP '+r.status);
    this.manifest=await r.json();
    if(!Array.isArray(this.manifest.assets)||this.manifest.assets.length<6) throw new Error('CC0 pool requires >=6 assets');
    const loaded=await Promise.all(this.manifest.assets.map(async(a)=>[a.assetId,await loadImage(a.localPath)]));
    loaded.forEach(([id,img])=>this.images.set(id,img));
    this.sequence=generateSequence(this.seed,this.manifest.assets,24);
    this.current=this.sequence[0];
    this.loaded=true;
    return this;
  }
  setCard(cardResult) { this.cardResult=cardResult; this._composeBase(); }
  setTreatment(t) { if(TREATMENTS.includes(t)) this.treatment=t; }
  previewSequence(seed=this.seed,count=8) { return generateSequence(seed,this.manifest?.assets||[],count); }
  _composeBase() {
    if(!this.loaded||!this.current) return;
    const ctx=this.bctx,W=this.base.width,H=this.base.height,c=this.current;
    ctx.clearRect(0,0,W,H);
    // Literal Gate-1 donor output first; B2b layers are additive.
    drawGate1CollageFace(ctx,W,H,this.cardResult,0,false);

    const layout=RECIPE_META[c.recipe].layout;
    const ids=[c.hero,...c.supports];
    ids.forEach((id,i)=>{
      const img=this.images.get(id); if(!img) return;
      const [nx,ny,nw,nh,rot]=layout[i];
      const x=nx*W,y=ny*H,w=nw*W,h=nh*H;
      ctx.save();
      ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);
      ctx.shadowColor='rgba(0,0,0,.42)';ctx.shadowBlur=16;ctx.shadowOffsetY=8;
      seededTornPath(ctx,0,0,w,h,(this.seed+c.index*101+i*17)>>>0);ctx.clip();
      drawImageCover(ctx,img,0,0,w,h);
      ctx.fillStyle=i===0?'rgba(15,8,5,.06)':'rgba(35,26,19,.16)';ctx.fillRect(0,0,w,h);
      ctx.restore();
    });

    ctx.save();
    const phrase=c.phrase;
    const headlineY=c.recipe==='HEADLINE_SHOCK'?H*.08:H*.80;
    ctx.translate(W*.5,headlineY);
    ctx.rotate(c.recipe==='SIGNAL_NOISE'?-0.018:0.012);
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font="700 72px 'Anton', Impact, sans-serif";
    const tw=Math.min(W*.92,ctx.measureText(phrase).width+64);
    ctx.fillStyle=c.recipe==='ACID_FAIRGROUND'?'#d9ff48':'#f2e6c9';
    ctx.fillRect(-tw/2,-49,tw,98);
    ctx.fillStyle='#201711';ctx.fillText(phrase,0,4);
    ctx.restore();

    applyGrade(ctx,W,H,c.grade);
    tag(ctx,c.recipe+' · '+c.grade,W-360,H-38,{size:13,bg:'rgba(20,16,12,.76)'});
    this.compositionCount++;
  }
  _advance() {
    this.sequenceIndex=(this.sequenceIndex+1)%this.sequence.length;
    this.current=this.sequence[this.sequenceIndex];
    this.elapsed=0;
    this._composeBase();
  }
  update(dt) {
    if(!this.loaded||!this.current) return;
    this.elapsed+=dt;this.totalElapsed+=dt;
    if(this.elapsed>=this.current.durationSec) this._advance();
    this.render();
  }
  render() {
    const ctx=this.ctx,W=this.canvas.width,H=this.canvas.height;
    ctx.clearRect(0,0,W,H);ctx.drawImage(this.base,0,0);
    if(this.treatment==='LIVING_SCREEN'){
      ctx.save();
      const sweep=((this.totalElapsed*.035)%1.4)-.2;
      const g=ctx.createLinearGradient((sweep-.25)*W,0,(sweep+.25)*W,H);
      g.addColorStop(0,'rgba(255,255,255,0)');
      g.addColorStop(.48,'rgba(255,248,220,.10)');
      g.addColorStop(.54,'rgba(255,255,255,.22)');
      g.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      ctx.globalAlpha=.045;ctx.fillStyle='#f7edcf';
      for(let y=1;y<H;y+=5) ctx.fillRect(0,y,W,1);
      ctx.globalAlpha=1;
      const v=ctx.createRadialGradient(W/2,H/2,H*.18,W/2,H/2,H*.82);
      v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(2,5,4,.28)');
      ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
      ctx.restore();
    }
    this.renderCount++;
  }
  snapshot() {
    return {
      seed:this.seed,
      treatment:this.treatment,
      current:this.current?{...this.current}:null,
      sequence:this.sequence.slice(0,this.sequenceIndex+1).map((x)=>({index:x.index,recipe:x.recipe,grade:x.grade,hero:x.hero,heroRole:x.heroRole,durationSec:x.durationSec})),
      poolCount:this.manifest?.assets?.length||0,
      localAssets:this.manifest?.assets?.map((a)=>a.localPath)||[],
      renderCount:this.renderCount,
      compositionCount:this.compositionCount,
      elapsed:+this.elapsed.toFixed(3),
      totalElapsed:+this.totalElapsed.toFixed(3)
    };
  }
}
