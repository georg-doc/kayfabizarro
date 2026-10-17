/* KFB ChatterBox Studio — presentation core (cbs-core v0.1, 2026-10-04)
   PRESENTATION ONLY. No dialogue state, no quest/combat/world ownership.
   Ported (not reinvented) from:
   · overworld/overworld/bubble-ts.js        rectPath / shoutPath / blobPath / thinkTail, KANON
   · skills/KFB PetStudio/bubble/bubble.v1.js paper tint, tintMix 0.17, pinned anchor
   · overworld-v13/bubble-layout.js           KINDS, LIMITS, TIME, parse/normalisieren, wrapBalanced, sentenceSplit
   · SPEC_lettering_2026-08-12                 *emph* · … · --  (three marks, no more)
   · ABGLEICH_bubbles_2026-08-12               shout = crown (Kranz) + 1–2 long spikes + 1 inward; think dots from cloud size
   · kfb-cartoon-animation refs 75/77          word timing 80–140 / 350–650 / 160–260 ms, one readable word, omit if unsafe */
(function(){
'use strict';
const INK='#1f1a14';
function mul(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hash(s){let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)%99991;}
const f1=n=>n.toFixed(1);
function poly(P){let d='M'+f1(P[0][0])+' '+f1(P[0][1]);for(let i=1;i<P.length;i++)d+=' L'+f1(P[i][0])+' '+f1(P[i][1]);return d+' Z';}
function circ(cx,cy,r){return 'M'+f1(cx-r)+' '+f1(cy)+' a'+f1(r)+' '+f1(r)+' 0 1 1 '+f1(2*r)+' 0 a'+f1(r)+' '+f1(r)+' 0 1 1 '+f1(-2*r)+' 0 Z';}

/* ── Shapes ─────────────────────────────────────────────────────────────── */
// bubble-ts.js rectPath, unchanged maths; noTail added for caption/kayfabulate boxes.
/* Tail rules (v0.3): edge = where the anchor IS relative to the box (below → bottom, above → top, beside → that side),
   not the centre direction. Foot = projection of the anchor onto that edge, clamped to the 32–68 % band.
   Tail direction is clamped to ≤ 50° from the edge normal so it never folds back along or into the body. */
function pickEdge(x0,y0,x1,y1,hx,hy){if(hx==null)return 0;if(hy>=y1)return 0;if(hy<=y0)return 1;return hx>=(x0+x1)/2?2:3;}
function clampDir(vx,vy,nx,ny,maxA){const L=Math.hypot(vx,vy)||1,ux=vx/L,uy=vy/L,c=ux*nx+uy*ny,ca=Math.cos(maxA);if(c>=ca)return [ux,uy];
  let tx=ux-c*nx,ty=uy-c*ny,tl=Math.hypot(tx,ty);if(tl<1e-6){tx=-ny;ty=nx;tl=1;}const sa=Math.sin(maxA);return [nx*ca+tx/tl*sa,ny*ca+ty/tl*sa];}
const TAIL_MAX_ANGLE=50*Math.PI/180;
function rectPath(M,w,hh,seed,hlx,hly,arrow,noTail,jit){
  const rng=mul(seed),J=jit==null?1.3:jit,j=()=>(rng()*2-1)*J;
  const x0=M,y0=M,x1=M+w,y1=M+hh,cx=M+w/2,cy=M+hh/2;
  const dx=(hlx==null?0:hlx-cx),dy=(hly==null?1:hly-cy);
  let edge=pickEdge(x0,y0,x1,y1,hlx,hly);
  if(noTail)edge=-1;
  const E=[{a:[x0,y0],b:[x1,y0],n:[0,-1],id:1},{a:[x1,y0],b:[x1,y1],n:[1,0],id:2},{a:[x1,y1],b:[x0,y1],n:[0,1],id:0},{a:[x0,y1],b:[x0,y0],n:[-1,0],id:3}];
  const foot=18,hlen=Math.hypot(dx,dy)||1,aMax=arrow==null?24:arrow,aMin=Math.min(14,aMax);
  const tailLen=Math.max(aMin,Math.min(aMax,hlen-8));
  const P=[];
  for(const e of E){
    P.push([e.a[0],e.a[1]]);
    const len=Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]),ux=(e.b[0]-e.a[0])/len,uy=(e.b[1]-e.a[1])/len;
    const K=4,mids=[];
    for(let k=1;k<K;k++){const ss=len*k/K;mids.push({s:ss,x:e.a[0]+ux*ss+e.n[0]*j(),y:e.a[1]+uy*ss+e.n[1]*j()});}
    if(e.id===edge){
      let ha=(hlx==null)?len/2:(hlx-e.a[0])*ux+(hly-e.a[1])*uy;
      ha=Math.max(len*0.32,Math.min(len*0.68,ha));
      const fcx=e.a[0]+ux*ha,fcy=e.a[1]+uy*ha;let tx,ty;
      if(hlx!=null&&hly!=null){const vx=hlx-fcx,vy=hly-fcy,tl=Math.hypot(vx,vy)||1,[ux2,uy2]=clampDir(vx,vy,e.n[0],e.n[1],TAIL_MAX_ANGLE),use=Math.max(aMin,Math.min(aMax,tl));tx=fcx+ux2*use;ty=fcy+uy2*use;}
      else{tx=fcx+e.n[0]*tailLen;ty=fcy+e.n[1]*tailLen;}
      const fx=e.a[0]+ux*(ha-foot/2),fy=e.a[1]+uy*(ha-foot/2),gx=e.a[0]+ux*(ha+foot/2),gy=e.a[1]+uy*(ha+foot/2);
      const shx=fcx+(tx-fcx)*0.55,shy=fcy+(ty-fcy)*0.55;
      const s1x=shx+(fx-fcx)*0.34,s1y=shy+(fy-fcy)*0.34,s2x=shx+(gx-fcx)*0.34,s2y=shy+(gy-fcy)*0.34;
      for(const m of mids)if(m.s<ha-foot/2)P.push([m.x,m.y]);
      P.push([fx,fy],[s1x,s1y],[tx,ty],[s2x,s2y],[gx,gy]);
      for(const m of mids)if(m.s>ha+foot/2)P.push([m.x,m.y]);
    }else for(const m of mids)P.push([m.x,m.y]);
  }
  return poly(P);
}
// Tapered tail with a real foot (speech grammar): foot ±f/2 along tangent t, shoulders at 55 %, taper 0.34.
function tailPts(bx,by,tx_,ty_,tanx,tany,foot){const h=foot/2,fx=bx-tanx*h,fy=by-tany*h,gx=bx+tanx*h,gy=by+tany*h,shx=bx+(tx_-bx)*.55,shy=by+(ty_-by)*.55;
  return [[fx,fy],[shx+(fx-bx)*.34,shy+(fy-by)*.34],[tx_,ty_],[shx+(gx-bx)*.34,shy+(gy-by)*.34],[gx,gy]];}
// Clay-only house form: rounded corners, calm wobble, smaller sharp tail (≈ 2/3 of speech).
function roundRectPath(M,w,hh,r,seed,hlx,hly,arrow,foot,noTail){
  r=Math.max(2,Math.min(r,hh/2-1,w/2-1));foot=foot||12;const aMax=arrow||16,aMin=Math.min(10,aMax);
  const x0=M,y0=M,x1=M+w,y1=M+hh,cx=M+w/2,cy=M+hh/2,dx=(hlx==null?0:hlx-cx),dy=(hly==null?1:hly-cy);
  let edge=pickEdge(x0,y0,x1,y1,hlx,hly);if(noTail||hlx==null)edge=-1;
  const E=[{a:[x0,y0],b:[x1,y0],id:1,n:[0,-1],c:[x1-r,y0+r],a0:-Math.PI/2},{a:[x1,y0],b:[x1,y1],id:2,n:[1,0],c:[x1-r,y1-r],a0:0},{a:[x1,y1],b:[x0,y1],id:0,n:[0,1],c:[x0+r,y1-r],a0:Math.PI/2},{a:[x0,y1],b:[x0,y0],id:3,n:[-1,0],c:[x0+r,y0+r],a0:Math.PI}];
  const P=[];
  for(const e of E){const len=Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]),ux=(e.b[0]-e.a[0])/len,uy=(e.b[1]-e.a[1])/len,at=s=>[e.a[0]+ux*s,e.a[1]+uy*s];
    P.push(at(r));
    if(e.id===edge){let ha=(hlx-e.a[0])*ux+(hly-e.a[1])*uy;ha=Math.max(Math.max(len*.32,r+foot/2+2),Math.min(Math.min(len*.68,len-r-foot/2-2),ha));
      const [bx,by]=at(ha),vx=hlx-bx,vy=hly-by,tl=Math.hypot(vx,vy)||1,[u2,v2]=clampDir(vx,vy,e.n[0],e.n[1],TAIL_MAX_ANGLE),use=Math.max(aMin,Math.min(aMax,tl));
      tailPts(bx,by,bx+u2*use,by+v2*use,ux,uy,foot).forEach(p=>P.push(p));}
    P.push(at(len-r));
    for(let k=1;k<=6;k++){const a=e.a0+k/6*Math.PI/2;P.push([e.c[0]+Math.cos(a)*r,e.c[1]+Math.sin(a)*r]);}
  }
  return poly(P);
}
// Crown (Kranz): many spikes, deep valleys, calm angles; 1–2 longer (×1.45), one tipped inward.
function crown(cx,cy,rx,ry,seed,o){
  o=o||{};const rng=mul(seed),n=o.n||3,N=o.N||16,step=2*Math.PI/N,a0=-Math.PI/2+(rng()*2-1)*0.1;
  const se=(a)=>{const c=Math.cos(a),s=Math.sin(a);return [cx+rx*Math.sign(c)*Math.pow(Math.abs(c),2/n),cy+ry*Math.sign(s)*Math.pow(Math.abs(s),2/n)];};
  const l1=Math.floor(rng()*N),l2=(l1+Math.floor(N/2)+(rng()<.5?0:1))%N,inw=(l1+Math.floor(N/4)+1)%N;
  let tailI=-1;
  if(o.tx!=null){const ta=Math.atan2(o.ty-cy,o.tx-cx);let b=9;for(let i=0;i<N;i++){const a=a0+(i+0.5)*step,d=Math.abs(Math.atan2(Math.sin(a-ta),Math.cos(a-ta)));if(d<b){b=d;tailI=i;}}}
  const P=[],depth=o.depth||15;
  for(let i=0;i<N;i++){
    P.push(se(a0+i*step+(rng()*2-1)*step*0.07));
    const as=a0+(i+0.5)*step+(rng()*2-1)*step*0.07,base=se(as);
    if(i===tailI){const ox=base[0]-cx,oy=base[1]-cy,ol=Math.hypot(ox,oy)||1,vx=o.tx-base[0],vy=o.ty-base[1],L=Math.hypot(vx,vy)||1,am=o.arrow||26,use=Math.max(Math.min(14,am),Math.min(am,L-4)),[u2,v2]=clampDir(vx,vy,ox/ol,oy/ol,TAIL_MAX_ANGLE);
      tailPts(base[0],base[1],base[0]+u2*use,base[1]+v2*use,-oy/ol,ox/ol,o.foot||18).forEach(p=>P.push(p));continue;}
    let dd=depth*(0.85+rng()*0.3);if(o.irregular!==false){if(i===l1||i===l2)dd*=1.45;if(i===inw)dd=-depth*0.25;}
    const ox=base[0]-cx,oy=base[1]-cy,ol=Math.hypot(ox,oy)||1;P.push([base[0]+ox/ol*dd,base[1]+oy/ol*dd]);
  }
  return poly(P);
}
function shoutPath(M,w,hh,seed,hlx,hly,arrow,foot){
  const cx=M+w/2,cy=M+hh/2,rx=w/2*1.12+10,ry=hh/2*1.25+10;
  const N=Math.max(12,Math.min(18,Math.round(Math.PI*(rx+ry)/32)));
  return crown(cx,cy,rx,ry,seed,{N,depth:Math.min(16,Math.max(9,hh*0.2)),tx:hlx,ty:hly,arrow,foot:foot||18});
}
function blobPath(cx,cy,rx,ry,seed,N0){
  const rng=mul(seed),N=N0||(11+Math.floor(rng()*3)),step=Math.PI*2/N,P=[],a0=-Math.PI/2+(rng()*2-1)*0.15;
  for(let i=0;i<N;i++){const a=a0+i*step+(rng()*2-1)*step*0.28,rr=1+(rng()*2-1)*0.07;P.push([cx+Math.cos(a)*rx*rr,cy+Math.sin(a)*ry*rr]);}
  let d='M'+f1(P[0][0])+' '+f1(P[0][1]);
  for(let i=0;i<N;i++){const p1=P[(i+1)%N],ch=Math.hypot(p1[0]-P[i][0],p1[1]-P[i][1]),r=f1(ch/2*1.02);d+=' A'+r+' '+r+' 0 0 1 '+f1(p1[0])+' '+f1(p1[1]);}
  return d+' Z';
}
function thoughtPath(M,w,hh,seed){return blobPath(M+w/2,M+hh/2,w*0.60+12,hh*0.64+12,seed);}
// Thought trail: three separate bubbles that GROW from the head toward the cloud (small → large),
// clear gaps, starting outside the scallop bulge, on a gentle arc (not on a ruler line).
function thinkGeo(w,hh){const R0=Math.max(7,Math.min(13,hh*0.2));return {R:[R0,R0*0.64,R0*0.4],g:Math.max(9,R0*0.6)+7};}
function thinkTrailLen(w,hh){const T=thinkGeo(w,hh);return T.g+2*T.R[0]+T.g+2*T.R[1]+T.g*0.8+2*T.R[2]+6;}
function thinkDots(M,w,hh,hlx,hly,seed){
  const rng=mul(seed+7),cx=M+w/2,cy=M+hh/2;let dx=(hlx==null?0:hlx-cx),dy=(hly==null?1:hly-cy);
  const L=Math.hypot(dx,dy)||1;dx/=L;dy/=L;
  const rx=w*.6+12,ry=hh*.64+12,t=1/Math.sqrt(dx*dx/(rx*rx)+dy*dy/(ry*ry));
  const bulge=Math.PI*Math.sqrt((rx*rx+ry*ry)/2)/12*0.55,tOut=t*1.07+bulge;
  const T=thinkGeo(w,hh),R=T.R,g=T.g,need=thinkTrailLen(w,hh),avail=L-tOut-4,k=avail<need?Math.max(.55,avail/need):1;
  const s0=tOut+(g+R[0])*k,s1=s0+(R[0]+g+R[1])*k,s2=s1+(R[1]+g*.8+R[2])*k,px=-dy,py=dx,sg=rng()<.5?-1:1;
  return [[s0,R[0],0],[s1,R[1],3],[s2,R[2],7]].map(([s,r,side])=>circ(cx+dx*s+px*side*sg,cy+dy*s+py*side*sg,r*Math.max(.8,k))).join(' ');
}

/* ── Layout (bubble-layout.js bl-v1.1, pixel-measured) ──────────────────── */
const KINDS={
  speech:     {chars:28,lines:3,fs:1,   face:'body', padX:.6, padY:.45,tail:'arrow',lh:1.25},
  thought:    {chars:28,lines:3,fs:1,   face:'body', padX:.7, padY:.5, tail:'dots', lh:1.25},
  whisper:    {chars:28,lines:3,fs:.85, face:'body', padX:.6, padY:.45,tail:'arrow',lh:1.25},
  shout:      {chars:21,lines:3,fs:1.35,face:'shout',padX:.8, padY:.45,tail:'spike',lh:1.08},
  caption:    {chars:34,lines:4,fs:.92, face:'body', padX:.7, padY:.5, tail:null,   lh:1.25},
  kayfabulate:{chars:34,lines:4,fs:1,   face:'body', padX:.8, padY:.62,tail:null,   lh:1.25},
  ambient:    {chars:24,lines:2,fs:.82, face:'body', padX:.55,padY:.4, tail:'arrow',lh:1.2},
  choice:     {chars:30,lines:2,fs:.92, face:'body', padX:.6, padY:.5, tail:'arrow',lh:1.22}
};
const LIMITS={minChars:7,padMinX:11,padMinY:8,floorPx:11,lastLineShare:.40};
const TIME={cps:34,holdBase:800,holdPerChar:42,holdCap:5000,exit:220,minTotal:1200};
const FONTS={body:'"Shantell Sans", "Comic Sans MS", cursive',shout:'Bangers, "Irish Grover", cursive',label:'"Irish Grover", cursive',word:'Bangers, "Irish Grover", cursive'};
let _c=null;const mctx=()=>(_c||(_c=document.createElement('canvas').getContext('2d')));
function measure(text,px,face,bold){const c=mctx();c.font=(bold?'700 ':'400 ')+px+'px '+FONTS[face||'body'];let w=c.measureText(text).width;if(face==='shout'||face==='word')w+=text.length*px*0.02;return w;}
function normalisieren(t){return String(t).replace(/\. ?\. ?\./g,'…').replace(/!{2,}/g,'!').replace(/\?{2,}/g,'?').replace(/—|–/g,'--').replace(/\s+/g,' ').trim();}
function parse(text,maxB){
  const roh=normalisieren(text),teile=[];let n=0,last=0,plain='',m;const re=/\*([^*\n]+)\*/g;
  while((m=re.exec(roh))){if(m.index>last){const s=roh.slice(last,m.index);teile.push({text:s,fett:false});plain+=s;}
    const fett=(maxB==null||n<maxB);teile.push({text:m[1],fett});plain+=m[1];if(fett)n++;last=m.index+m[0].length;}
  if(last<roh.length){const s=roh.slice(last);teile.push({text:s,fett:false});plain+=s;}
  if(!teile.length)teile.push({text:roh,fett:false});
  return {plain,teile,betont:n};
}
function sentenceSplit(text){
  const t=String(text).trim(),marks=[];
  for(let i=1;i<t.length-1;i++)if('.!?'.includes(t[i])&&/\s/.test(t[i+1])&&!/\s/.test(t[i-1]))marks.push(i+1);
  if(!marks.length)return null;const mid=t.length/2,cut=marks.reduce((a,b)=>Math.abs(b-mid)<Math.abs(a-mid)?b:a);
  // §5b: first ends with …, second begins with …
  const a=t.slice(0,cut).trim().replace(/\.$/,'…'),b='…'+t.slice(cut).trim();
  return [a,b];
}
function times(n){const write=Math.round(n/TIME.cps*1000),hold=Math.min(TIME.holdCap,TIME.holdBase+TIME.holdPerChar*n);return {chars:n,write,hold,exit:TIME.exit,total:Math.max(TIME.minTotal,write+hold+TIME.exit)};}
function wrapBalanced(plain,maxChars,maxPx,widthOf){
  const ws=plain.split(' ').filter(Boolean);if(!ws.length)return [];
  const fits=a=>a.length===1||(a.join(' ').length<=maxChars&&widthOf(a.join(' '))<=maxPx);
  let L=1,cur=[];for(const w of ws){const t=cur.concat(w);if(fits(t))cur=t;else{L++;cur=[w];}}
  const memo=new Map();
  function best(i,left){if(i>=ws.length)return left===0?{cost:0,cuts:[]}:null;if(left===0)return null;const k=i+'|'+left;if(memo.has(k))return memo.get(k);
    let out=null;const cu=[];for(let j=i;j<ws.length;j++){cu.push(ws[j]);if(!fits(cu))break;const r=best(j+1,left-1);if(r){const m=widthOf(cu.join(' ')),c=m*m+r.cost;if(!out||c<out.cost)out={cost:c,cuts:[j+1].concat(r.cuts)};}}
    memo.set(k,out);return out;}
  const r=best(0,L),cuts=r?r.cuts:[ws.length],lines=[];let p=0;for(const c of cuts){lines.push(ws.slice(p,c).join(' '));p=c;}return lines;
}
const _lc=new Map();
function layout(text,kind,o){
  o=o||{};const key=text+'|'+kind+'|'+(o.basePx||16)+'|'+Math.round(o.maxPx||9999);if(_lc.has(key))return _lc.get(key);
  const K=KINDS[kind]||KINDS.speech,fontPx=Math.max(LIMITS.floorPx,Math.round((o.basePx||16)*K.fs)),face=K.face;
  const P=parse(text,String(text).length<=34?1:2),n=P.plain.length,bold=new Uint8Array(n);let ix=0;
  for(const t of P.teile)for(let c=0;c<t.text.length;c++)bold[ix++]=t.fett?1:0;
  const boldW=new Set();for(const t of P.teile)if(t.fett)t.text.split(' ').forEach(w=>w&&boldW.add(w));
  const sp=measure(' ',fontPx,face,false);
  const widthOf=s=>{const a=s.split(' ');let sum=0;a.forEach((w,i)=>{sum+=measure(w,fontPx,face,boldW.has(w));if(i<a.length-1)sum+=sp;});return sum;};
  const padX=Math.max(LIMITS.padMinX,Math.round(K.padX*fontPx)),padY=Math.max(LIMITS.padMinY,Math.round(K.padY*fontPx));
  const maxPx=Math.max(LIMITS.minChars*fontPx*0.55,(o.maxPx||9999)-2*padX);
  const lines=wrapBalanced(P.plain,K.chars,maxPx,widthOf);
  const words=[];let pos=0;const out=[];
  lines.forEach((ln,li)=>{const toks=[];const ws=ln.split(' ');ws.forEach((w,wi)=>{const start=pos,end=pos+w.length;const isB=!!bold[start];words.push({start,end,bold:isB});
    toks.push({text:w+(wi<ws.length-1?' ':''),bold:isB,start,end:end+(wi<ws.length-1?1:0),wi:words.length-1});pos=end+1;});out.push(toks);});
  const lw=lines.map(widthOf),longest=Math.max(0,...lw);
  const w=Math.round(Math.max(longest,LIMITS.minChars*fontPx*0.5)+2*padX+4),lh=K.lh,h=Math.round(lines.length*fontPx*lh+2*padY);
  const res={kind,K,fontPx,face,lh,padX,padY,w,h,lines:out,plain:P.plain,words,times:times(n),overflow:lines.length>K.lines,split:null};
  if(res.overflow){const s=sentenceSplit(normalisieren(text).replace(/\*([^*]+)\*/g,'*$1*'));res.split=s;res.reject=!s;}
  _lc.set(key,res);return res;
}

/* ── Streaming / TTS-near timing ─────────────────────────────────────────── */
const PAUSE={comma:170,colon:240,stop:380,ellipsis:520,cut:160};
function syl(s){const m=s.toLowerCase().replace(/[^a-zäöüß]/g,'').match(/[aeiouyäöü]+/g);return Math.max(1,m?m.length:1);}
function schedule(L,preset,o){
  o=o||{};const wpm=o.wpm||150,cps=o.cps||TIME.cps,plain=L.plain,n=plain.length,words=L.words;
  const reveal=new Float32Array(n+1),voice=[],chunks=[];
  const pauseAfter=w=>{const s=plain.slice(w.start,w.end);if(/…$/.test(s))return PAUSE.ellipsis;if(/--$/.test(s))return PAUSE.cut;if(/[.!?]$/.test(s))return PAUSE.stop;if(/[;:]$/.test(s))return PAUSE.colon;if(/,$/.test(s))return PAUSE.comma;return 0;};
  const maxW=preset==='tts-follow'?4:5;let cur=[];
  words.forEach((w,i)=>{cur.push(i);const p=pauseAfter(w);if(p>0||cur.length>=maxW||i===words.length-1){chunks.push({w:cur.slice(),pause:p});cur=[];}});
  const beat=60000/wpm;let t=0;
  const wd=words.map(w=>{let d=beat*Math.min(2.2,Math.max(.6,syl(plain.slice(w.start,w.end))/1.5));if(w.bold)d*=1.25;return d;});
  if(preset==='instant'){words.forEach((w,i)=>voice[i]=[0,0]);chunks.forEach(c=>{c.t0=0;c.t1=0;});return {reveal,voice,chunks,total:0,preset};}
  if(preset==='typewriter'){
    for(let i=0;i<n;i++){reveal[i]=t;t+=1000/cps;const ch=plain[i];if(ch===',')t+=120;else if('.!?'.includes(ch)&&plain[i+1]===' ')t+=280;else if(ch==='…')t+=360;}
    reveal[n]=t;words.forEach((w,i)=>voice[i]=[reveal[w.start],reveal[Math.max(w.start,w.end-1)]+1000/cps]);
    chunks.forEach(c=>{c.t0=voice[c.w[0]][0];c.t1=voice[c.w[c.w.length-1]][1];});return {reveal,voice,chunks,total:t,preset};
  }
  for(const c of chunks){c.t0=t;for(const i of c.w){voice[i]=[t,t+wd[i]];t+=wd[i];}c.t1=t;t+=c.pause;}
  if(preset==='chunked'){for(const c of chunks){const a=words[c.w[0]].start,b=words[c.w[c.w.length-1]].end;for(let k=a;k<=b&&k<=n;k++)reveal[k]=c.t0;}}
  else{const lead=o.lead==null?140:o.lead;words.forEach((w,i)=>{for(let k=w.start;k<=w.end&&k<=n;k++)reveal[k]=Math.max(0,voice[i][0]-lead);});}
  return {reveal,voice,chunks,total:t,preset};
}
function revealedCount(S,el){if(!S||S.preset==='instant')return 1e9;const r=S.reveal;let lo=0,hi=r.length;while(lo<hi){const m=(lo+hi)>>1;if(r[m]<=el)lo=m+1;else hi=m;}return lo;}

/* ── Comic words (VFX objects) ───────────────────────────────────────────── */
const WORD={
  impact:  {fill:'#ffd84a',deep:'#b52a19',burst:'#e94a2e',inner:'#ffd84a',dots:'url(#kfbDotsDeep)',shape:'crown',place:'contact',motion:{enter:110,hold:520,exit:200},sfx:'thump'},
  movement:{fill:'#a6f0cf',deep:'#1d6f55',burst:'#1f1a14',shape:'streaks',place:'trajectory',motion:{enter:120,hold:420,exit:180},sfx:'whoosh'},
  reaction:{fill:'#ff8fcf',deep:'#8a2471',burst:'#fffaf0',dots:'url(#kfbDotsPink)',shape:'cloud',place:'head-side',motion:{enter:140,hold:600,exit:220},sfx:'boing'},
  reward:  {fill:'#ffcf3a',deep:'#5b2fa8',burst:'#7c4fd0',inner:'#ffcf3a',dots:'url(#kfbDotsViolet)',shape:'badge',place:'stage-top',motion:{enter:140,hold:650,exit:260},sfx:'chime'}
};
const CLAY={putty:'#ead6b1',shade:'#9a7d55',hi:'#fff4dc',slab:'#2a2119'};
/* Rim = BACK layers only (v0.4 · clay as a VOLUME, not a copied plate).
   Light from top-left. Under the face: a continuous extruded wall (sweep of 3 copies per px, no outlines, so it reads
   as one solid side, not stacked sheets) with a darker far rim, plus a soft blurred contact shadow, all toward bottom-right.
   The face itself is lit by #kfbClayBevel (blurred alpha → diffuse + specular), which gives the rounded clay edge. */
function rimLayers(d,rim,o){
  o=o||{};const L=[],ex=o.ext==null?5:o.ext;
  if(rim==='slab'){L.push({d,fill:CLAY.slab,stroke:CLAY.slab,sw:5,tf:'translate(4,7)',lj:'round'});}
  else if((rim==='clay'||rim==='clayonly')&&ex>0){const wall=o.side||CLAY.shade,dark=o.wallDark||wall,N=Math.max(6,Math.round(ex*3));
    L.push({d,fill:'rgba(50,30,12,.18)',tf:'translate('+(ex*.75+3).toFixed(1)+','+(ex+4).toFixed(1)+')',filter:'url(#kfbSoftShadow)'});
    for(let k=N;k>=1;k--){const t=k/N;L.push({d,fill:wall,tf:'translate('+(ex*.75*t).toFixed(2)+','+(ex*t).toFixed(2)+')'});}
    L.push({d,fill:'url(#kfbWallShade)',tf:'translate('+(ex*.75).toFixed(2)+','+ex.toFixed(2)+')'});}
  return L;
}
/* Clay face modelling (v0.4b): ONE frame only. Volume comes from the solid wall under the face (bottom-right) and a
   gentle convex gradient on the face itself — no lips, no bevel bands, no extra outlines. */
function clayFront(d){return [{d,fill:'url(#kfbFaceShade)'}];}
/* Comic word (v0.5). Font size is DYNAMIC: longer / bigger words get a bigger size (AMAZING > COOL),
   and every shape is built from the measured text box + padding in em, so text and shape always scale together.
   Movement streaks are attached to the actual glyph rows: same shear, same scale, ending at the first letter. */
function comicWord(word,cls,fs0,seed,rim,cid){const clayM=rim==='clay'||rim==='clayonly';cid=cid||'cw';
  const C=WORD[cls]||WORD.impact,rng=mul(seed||hash(word+cls)),chars=[...word],n=chars.length;
  const grow=cls==='movement'?1:Math.max(1,Math.min(1.32,0.9+n*0.05)),fs=Math.round(fs0*grow);
  const cw=chars.map(ch=>measure(ch,fs,'word',false));const tw=cw.reduce((a,b)=>a+b,0);
  const letters=chars.map((ch,i)=>{const r=rng(),r2=rng();let rot=0,dy=0,sc=1;
    if(cls==='impact'){rot=(r-.5)*18;dy=(r2-.5)*.12*fs;sc=.92+rng()*.22;if(i===0)sc=1.12;}
    else if(cls==='reaction'){rot=(r-.5)*24;dy=Math.sin(i*1.7)*.08*fs;sc=.95+r2*.15;}
    else if(cls==='movement'){rot=(r-.5)*4;}
    else{const u=(i+.5)/n;dy=-Math.sin(Math.PI*u)*.14*fs;rot=(u-.5)*20;sc=.96+r2*.1;}
    return {ch,tf:'translate(0,'+f1(dy)+'px) rotate('+f1(rot)+'deg) scale('+sc.toFixed(2)+')'};});
  const steps=Math.max(3,Math.round(fs*0.08)),o=Math.max(1.2,fs*0.035).toFixed(1);
  let sh='-'+o+'px 0 0 '+INK+', '+o+'px 0 0 '+INK+', 0 -'+o+'px 0 '+INK+', 0 '+o+'px 0 '+INK;
  for(let i=1;i<=steps;i++)sh+=', '+i+'px '+i+'px 0 '+C.deep;sh+=', '+(steps+1)+'px '+(steps+1)+'px 0 '+INK+', '+(steps+2)+'px '+(steps+3)+'px 0 rgba(31,26,20,.35)';
  const stroke=Math.max(1.2,fs*0.035),pad=24,th=fs*0.86;   // th ≈ cap height of Bangers
  let bw,bh,layers=[],rowShift=0;
  const edgeInk=w=>rim==='clayonly'?null:{fill:'none',stroke:INK,sw:w,lj:'round'};
  const finish=(d,extra)=>{const e=edgeInk(cls==='impact'?3.2:3);return rimLayers(d,rim,{ext:Math.round(fs*.09),side:C.deep}).concat([{d,fill:C.burst},...(clayM?clayFront(d):[]),{d,fill:C.dots,op:.5,mask:'url(#kfbCornerMask)'}],extra||[],e?[Object.assign({d},e)]:[]);};
  if(C.shape==='crown'){
    const rx=tw/2+fs*.66,ry=th/2+fs*.5,dep=fs*.36,ext=dep*1.5;bw=Math.round(2*(rx+ext)+pad);bh=Math.round(2*(ry+ext)+pad);const cx=bw/2,cy=bh/2;
    const d=crown(cx,cy,rx,ry,seed||7,{N:Math.max(14,Math.min(22,Math.round((rx+ry)/9))),depth:dep,n:2.4});
    const di=crown(cx,cy,tw/2+fs*.34,th/2+fs*.24,(seed||7)+3,{N:12,depth:dep*.5,n:2.4,irregular:false});
    layers=finish(d,[{d:di,fill:C.inner}]);
  }else if(C.shape==='cloud'){
    const rx=tw/2+fs*.62,ry=th/2+fs*.46,pe=fs*.5;bw=Math.round(2*(rx*1.1+pe)+pad);bh=Math.round(2*(ry*1.12+pe)+pad);const cx=bw/2,cy=bh/2;
    const d=blobPath(cx,cy,rx,ry,seed||5,Math.max(9,Math.min(14,Math.round(rx/(fs*.42)))))+' '+circ(cx-rx*.86,cy+ry*1.08,fs*.15)+' '+circ(cx-rx*1.06,cy+ry*1.36,fs*.08);
    layers=finish(d);
  }else if(C.shape==='badge'){
    const rx=tw/2+fs*.62,ry=th/2+fs*.44;bw=Math.round(2*rx*1.55+pad);bh=Math.round(2*ry*1.7+pad);const cx=bw/2,cy=bh/2;
    let rays='';const R=12;for(let i=0;i<R;i++){const a=i/R*Math.PI*2+0.13,b=0.15,k1=1.0,k2=i%2?1.38:1.6;
      const p=(t,s)=>[cx+Math.cos(t)*rx*s,cy+Math.sin(t)*ry*s];const A=p(a-b,k1),B=p(a,k2),D=p(a+b,k1);
      rays+='M'+f1(A[0])+' '+f1(A[1])+' L'+f1(B[0])+' '+f1(B[1])+' L'+f1(D[0])+' '+f1(D[1])+' Z ';}
    const d=blobPath(cx,cy,rx,ry,seed||9,Math.max(14,Math.min(24,Math.round((rx+ry)/(fs*.26)))));
    layers=[{d:rays,fill:C.inner,stroke:rim==='clayonly'?C.deep:INK,sw:2}].concat(finish(d));
  }else{
    // streaks live in the same frame as the glyph row: row is centred, sheared −14°, scaled 1.08 about the box centre
    const S=fs*2.6+16;bw=Math.round(S+tw*1.12+fs*.5+pad);bh=Math.round(th*1.5+pad);const cy=bh/2,k=Math.tan(14*Math.PI/180);
    rowShift=Math.round(2*S-bw+tw);const left0=(bw+rowShift-tw)/2,left=bw/2+(left0-bw/2)*1.08;
    let st='';const rows=[-.34,-.12,.1,.32];
    rows.forEach((u,i)=>{const y=cy+u*th,xr=left-k*(y-cy)-fs*.08,len=fs*(1.5+rng()*1.1)*(i===1||i===2?1.15:.85),t=Math.max(1.6,fs*(.05+rng()*.03));
      const xl=xr-len,shear=k*t;st+='M'+f1(xl)+' '+f1(y)+' L'+f1(xr+shear)+' '+f1(y-t)+' L'+f1(xr-shear)+' '+f1(y+t)+' Z ';});
    layers=[{d:st,fill:INK,tf:'translate(2,2)'},{d:st,fill:C.fill}];
  }
  return {word,cls,fs,tw,th,bw,bh,letters,layers,fill:C.fill,shadow:sh,stroke:f1(stroke),rowTf:cls==='movement'?'skewX(-14deg) scaleX(1.08)':'none',clipD:layers.length?(layers.find(l=>l.fill===C.burst)||{}).d||'':'',cid,rowShift,motion:C.motion,place:C.place,sfx:C.sfx};
}
function wordKeyframes(cls,k){
  const C=WORD[cls]||WORD.impact,M=C.motion,e=M.enter,h=M.hold,x=M.exit,T=e+h+x,o=v=>Math.min(1,Math.max(0,v/T));
  let f;
  if(cls==='impact')f=[{transform:'scale(.2) rotate(-16deg)',opacity:0},{transform:'scale(1.25) rotate(5deg)',opacity:1,offset:o(e*.7)},{transform:'scale(1) rotate(0deg)',opacity:1,offset:o(e)},{transform:'scale(1.04) rotate(-1.5deg)',opacity:1,offset:o(e+50)},{transform:'scale(1) rotate(0deg)',opacity:1,offset:o(e+110)},{transform:'scale(1) rotate(0deg)',opacity:1,offset:o(e+h)},{transform:'scale(1.16) rotate(3deg)',opacity:0}];
  else if(cls==='movement')f=[{transform:'translateX(-70%) skewX(-20deg) scaleX(1.4)',opacity:0},{transform:'translateX(4%) skewX(-6deg) scaleX(.96)',opacity:1,offset:o(e)},{transform:'translateX(0%) skewX(0deg) scaleX(1)',opacity:1,offset:o(e+60)},{transform:'translateX(5%) skewX(0deg) scaleX(1)',opacity:1,offset:o(e+h)},{transform:'translateX(60%) skewX(-18deg) scaleX(1.3)',opacity:0}];
  else if(cls==='reaction')f=[{transform:'translateY(30%) scale(.5,1.4) rotate(0deg)',opacity:0},{transform:'translateY(-6%) scale(1.18,.86) rotate(0deg)',opacity:1,offset:o(e*.65)},{transform:'translateY(0%) scale(1,1) rotate(0deg)',opacity:1,offset:o(e)},{transform:'translateY(0%) scale(1,1) rotate(-3deg)',opacity:1,offset:o(e+h*.35)},{transform:'translateY(0%) scale(1,1) rotate(2deg)',opacity:1,offset:o(e+h*.7)},{transform:'translateY(0%) scale(1,1) rotate(0deg)',opacity:1,offset:o(e+h)},{transform:'translateY(-25%) scale(.7,.7) rotate(0deg)',opacity:0}];
  else f=[{transform:'translateY(0%) scale(0) rotate(-30deg)',opacity:0},{transform:'translateY(0%) scale(1.18) rotate(6deg)',opacity:1,offset:o(e*.7)},{transform:'translateY(0%) scale(1) rotate(0deg)',opacity:1,offset:o(e)},{transform:'translateY(0%) scale(1.05) rotate(0deg)',opacity:1,offset:o(e+h*.5)},{transform:'translateY(0%) scale(1) rotate(0deg)',opacity:1,offset:o(e+h)},{transform:'translateY(-30%) scale(.9) rotate(0deg)',opacity:0}];
  return {frames:f,duration:T/(k||1),M};
}

/* ── Export contracts (presentation descriptors, never runtime truth) ─────── */
function emphasisOf(text){const out=[];String(text).replace(/\*([^*]+)\*/g,(m,a)=>{out.push(a);return m;});return out;}

function clearCache(){_lc.clear();}
window.KFB_CB={version:'cbs-core-0.1',clearCache,INK,CLAY,KINDS,LIMITS,TIME,PAUSE,FONTS,WORD,mul,hash,circ,
  rectPath,roundRectPath,clayFront,shoutPath,thoughtPath,thinkDots,thinkTrailLen,crown,blobPath,rimLayers,measure,normalisieren,parse,sentenceSplit,times,wrapBalanced,layout,
  schedule,revealedCount,comicWord,wordKeyframes,emphasisOf};
})();
