/* KFB Overworld — Sprechblase als DOM/SVG-Overlay (v10-S9 · bubble-ts-v1)
   ------------------------------------------------------------------------------------------------
   **Portiert, nicht nachgebaut.** Der Zug kommt aus KFB Pet Studio v4 (`_rectPath`, `_blobPath`,
   `_thinkTail`, Anker-Physik) — Georgs Handover sagt ausdrücklich: Reuse. Übernommen sind die
   Kennzahlen und die Form; ersetzt ist nur der Anker: statt des Pet-Kopfes in einer 3D-Szene hängt
   die Blase hier an einer Einheit in Weltkoordinaten.

   **Was gilt (Kanon aus dem Handover):**
     · Rechteck mit Feder-Jitter (±1,3 px, vier Zwischenpunkte je Kante), **keine runden Ecken**
     · der Zipfel ist ein **getaperter Pfeil** (Schulterpunkte bei 55 %), keine Kerbe
     · Fuß im **zentralen Band** der Kante (32…68 %), wandert nie in die Ecke
     · Schnur **kurz**: `tailLen = clamp(14, arrow, Abstand−8)` — kein Gummiband quer durchs Bild
     · nur das **Papier** wird getönt, Linie und Schrift bleiben schwarz
     · drei Register: `speech` (Rechteck) · `thought` (Scallop-Wolke + zwei Kreise) · `whisper`
       (gestrichelt). Ein viertes wird nicht erfunden.
     · **Totzone** (innerhalb steht der Anker still) und **Trägheit** (weiches Nachziehen)
     · **immer nur EINE Blase**

   **Abgrenzung zur Plauderei:** die Umgebungs-Blasen (`mob-ai.js drawBubbles`) bleiben auf der
   Leinwand — sie sind viele, klein und kurz. Dieses Overlay ist die **eine bedienbare** Blase: die,
   die man angeklickt hat. Zwei Aufgaben, zwei Wege; die Regel »immer nur EINE« gilt für diese hier.

   Die Blase kann **Knöpfe** tragen (Georg 9.8.): attack · ask · taunt · philosophize · trade ·
   leave. Damit ist jeder Mob ein Point of Interest, ohne dass ein Dialogsystem gebaut wird. */
(function(){
'use strict';

const KANON={gap:46,pad:9,line:2,tint:0.5,font:15,arrow:34,dead:44,lazy:0.10,M:30};
const INK='#1f1a14';

function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

/* ── Der Zug: jittriges Rechteck mit getapertem Pfeil (Pet Studio v4, unverändert übernommen) ── */
function rectPath(M,w,hh,seed,hlx,hly,arrow){
  const rng=mulberry(seed), j=()=>(rng()*2-1)*1.3;
  const x0=M,y0=M,x1=M+w,y1=M+hh,cx=M+w/2,cy=M+hh/2;
  const dx=(hlx==null?0:hlx-cx), dy=(hly==null?1:hly-cy);
  let edge; if(Math.abs(dy)>=Math.abs(dx))edge=dy>=0?0:1; else edge=dx>=0?2:3;
  const E=[{a:[x0,y0],b:[x1,y0],n:[0,-1],id:1},{a:[x1,y0],b:[x1,y1],n:[1,0],id:2},
           {a:[x1,y1],b:[x0,y1],n:[0,1],id:0},{a:[x0,y1],b:[x0,y0],n:[-1,0],id:3}];
  const foot=18, hlen=Math.hypot(dx,dy)||1;
  const aMin=14, aMax=arrow==null?KANON.arrow:arrow;
  const tailLen=Math.max(aMin,Math.min(aMax,hlen-8));
  const P=[];
  for(const e of E){
    P.push([e.a[0],e.a[1]]);
    const len=Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]);
    const ux=(e.b[0]-e.a[0])/len, uy=(e.b[1]-e.a[1])/len;
    const K=4,mids=[];
    for(let k=1;k<K;k++){const ss=len*k/K;
      mids.push({s:ss,x:e.a[0]+ux*ss+e.n[0]*j(),y:e.a[1]+uy*ss+e.n[1]*j()});}
    if(e.id===edge){
      let ha=(hlx==null)?len/2:(hlx-e.a[0])*ux+(hly-e.a[1])*uy;
      ha=Math.max(len*0.32,Math.min(len*0.68,ha));
      const fcx=e.a[0]+ux*ha, fcy=e.a[1]+uy*ha;
      let tx,ty;
      if(hlx!=null&&hly!=null){const vx=hlx-fcx,vy=hly-fcy,tl=Math.hypot(vx,vy)||1;
        const use=Math.max(aMin,Math.min(aMax,tl));tx=fcx+vx/tl*use;ty=fcy+vy/tl*use;}
      else{tx=fcx+dx/hlen*tailLen;ty=fcy+dy/hlen*tailLen;}
      const fx=e.a[0]+ux*(ha-foot/2), fy=e.a[1]+uy*(ha-foot/2);
      const gx=e.a[0]+ux*(ha+foot/2), gy=e.a[1]+uy*(ha+foot/2);
      const shx=fcx+(tx-fcx)*0.55, shy=fcy+(ty-fcy)*0.55;
      const s1x=shx+(fx-fcx)*0.34, s1y=shy+(fy-fcy)*0.34;
      const s2x=shx+(gx-fcx)*0.34, s2y=shy+(gy-fcy)*0.34;
      for(const m of mids)if(m.s<ha-foot/2)P.push([m.x,m.y]);
      P.push([fx,fy],[s1x,s1y],[tx,ty],[s2x,s2y],[gx,gy]);
      for(const m of mids)if(m.s>ha+foot/2)P.push([m.x,m.y]);
    }else{for(const m of mids)P.push([m.x,m.y]);}
  }
  let d='M'+P[0][0].toFixed(1)+' '+P[0][1].toFixed(1);
  for(let p=1;p<P.length;p++)d+=' L'+P[p][0].toFixed(1)+' '+P[p][1].toFixed(1);
  return d+' Z';
}
/* **Shout** (v10-S18, ChatterBox S1 §9). Vierte Kontur, kein zweiter Zeichner: derselbe Zug wie
   `rectPath`, nur wird jede Kante gezackt statt gejittert — und **der Zipfel bleibt Teil derselben
   Fläche**, wie bei allen anderen. Die Zacken zeigen nach außen, ihre Tiefe hängt an der Kantenlänge
   (kurze Kante = flachere Zacken), damit ein einzelnes Wort nicht zum Seeigel wird. */
function shoutPath(M,w,hh,seed,hlx,hly,arrow){
  const rng=mulberry(seed);
  const x0=M,y0=M,x1=M+w,y1=M+hh,cx=M+w/2,cy=M+hh/2;
  const dx=(hlx==null?0:hlx-cx), dy=(hly==null?1:hly-cy);
  let edge; if(Math.abs(dy)>=Math.abs(dx))edge=dy>=0?0:1; else edge=dx>=0?2:3;
  const E=[{a:[x0,y0],b:[x1,y0],n:[0,-1],id:1},{a:[x1,y0],b:[x1,y1],n:[1,0],id:2},
           {a:[x1,y1],b:[x0,y1],n:[0,1],id:0},{a:[x0,y1],b:[x0,y0],n:[-1,0],id:3}];
  const hlen=Math.hypot(dx,dy)||1;
  const P=[];
  for(const e of E){
    const len=Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]);
    const ux=(e.b[0]-e.a[0])/len, uy=(e.b[1]-e.a[1])/len;
    const N=Math.max(3,Math.round(len/26));           // Zacken je Kante
    const tief=Math.min(15,Math.max(6,len*0.075));
    P.push([e.a[0],e.a[1]]);
    for(let k=0;k<N;k++){
      const s1=len*(k+0.5)/N, s2=len*(k+1)/N;
      const t=tief*(0.7+rng()*0.6);
      P.push([e.a[0]+ux*s1+e.n[0]*t, e.a[1]+uy*s1+e.n[1]*t]);   // Spitze nach außen
      if(k<N-1)P.push([e.a[0]+ux*s2, e.a[1]+uy*s2]);            // Tal auf der Kante
    }
    if(e.id===edge){
      // Der Zipfel ersetzt das letzte Tal — eine Fläche, kein angesetztes Dreieck.
      const fcx=e.a[0]+ux*len*0.62, fcy=e.a[1]+uy*len*0.62;
      const tl=Math.max(14,Math.min(arrow==null?KANON.arrow:arrow,hlen-8));
      let vx=(hlx==null?dx:hlx-fcx), vy=(hly==null?dy:hly-fcy);
      const vl=Math.hypot(vx,vy)||1;
      P.push([fcx+vx/vl*tl, fcy+vy/vl*tl]);
    }
  }
  let d='M'+P[0][0].toFixed(1)+' '+P[0][1].toFixed(1);
  for(let p=1;p<P.length;p++)d+=' L'+P[p][0].toFixed(1)+' '+P[p][1].toFixed(1);
  return d+' Z';
}
function blobPath(M,w,hh,seed){
  const rng=mulberry(seed);
  const cx=M+w/2, cy=M+hh/2, rx=w*0.60+12, ry=hh*0.64+12;
  const N=11+Math.floor(rng()*3), step=Math.PI*2/N, P=[];
  const a0=-Math.PI/2+(rng()*2-1)*0.15;
  for(let i=0;i<N;i++){
    const a=a0+i*step+(rng()*2-1)*step*0.28, rr=1+(rng()*2-1)*0.07;
    P.push([cx+Math.cos(a)*rx*rr, cy+Math.sin(a)*ry*rr]);
  }
  let d='M'+P[0][0].toFixed(1)+' '+P[0][1].toFixed(1);
  for(let i=0;i<N;i++){const p1=P[(i+1)%N];
    const ch=Math.hypot(p1[0]-P[i][0],p1[1]-P[i][1]), r=(ch/2*1.02).toFixed(1);
    d+=' A'+r+' '+r+' 0 0 1 '+p1[0].toFixed(1)+' '+p1[1].toFixed(1);}
  return d+' Z';
}
function thinkTail(g,M,w,hh,hlx,hly,paper,line,t){
  if(!g)return;
  const cx=M+w/2, cy=M+hh/2;
  let dx=(hlx==null?0:hlx-cx), dy=(hly==null?1:hly-cy);
  const L=Math.hypot(dx,dy)||1; dx/=L; dy/=L;
  const ex=cx+dx*(w/2+4), ey=cy+dy*(hh/2+4);
  /* Atem statt Standbild: jeder Kreis wandert ein Stück auf der Achse und pulst leicht — versetzt,
     damit es wie Aufsteigen liest und nicht wie Zittern. */
  const T=t||0;
  const c=(o,r,ph)=>{
    const wander=Math.sin(T*1.6+ph)*2.2, puls=1+Math.sin(T*2.1+ph)*0.10;
    return "<circle cx='"+(ex+dx*(o+wander)).toFixed(1)+"' cy='"+(ey+dy*(o+wander)).toFixed(1)+
      "' r='"+(r*puls).toFixed(2)+"' fill='"+paper+"' stroke='"+INK+"' stroke-width='"+line+"'/>";
  };
  g.innerHTML=c(9,4.5,0)+c(20,3,1.1);
}

/* Die gestrichelte Kanon-Feder über einem fertigen Pfad. Punkte aus dem `d` zurücklesen statt sie
   ein zweites Mal zu bauen — zwei Rechnungen für eine Kante ergeben zwei Kanten. */
function fluesterKante(d){
  const C=window.OW_CARD&&OW_CARD.canon;
  if(!C||!C.dashedPathD||!C.INK_PRESETS)return '';
  const pts=[];
  for(const m of d.matchAll(/[ML]([-\d.]+) ([-\d.]+)/g))pts.push([+m[1],+m[2]]);
  if(pts.length<8)return '';
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const q of pts){if(q[0]<x0)x0=q[0];if(q[0]>x1)x1=q[0];if(q[1]<y0)y0=q[1];if(q[1]>y1)y1=q[1];}
  const W=Math.max(1,x1-x0), H=Math.max(1,y1-y0);
  const p=C.INK_PRESETS['card-dash'];
  if(!p)return '';
  try{
    const half=C.inkHalfWidth(pts,W,H,7,p,1.6);
    return C.dashedPathD(pts,half,p,W,H,7);
  }catch(e){return '';}
}

/* ── Das Overlay ───────────────────────────────────────────────────────────────────────────── */
let host=null, el=null, svg=null, pfad=null, denk=null, strich=null, box=null, txtEl=null, aktuell=null;
const anker={x:0,y:0,gesetzt:false};

/* Bangers, nur für den Schrei. **Nicht** Irish Grover: die trägt schon HUD und Karten, und eine
   Schrift mit zwei Bedeutungen ist eine zweite Wahrheit über »laut« (WS1-Einwand, von ChatGPT
   übernommen). Einmal geladen, mit eigener Kennung. */
function schriftLaden(){
  if(document.getElementById('ow-bubble-fonts'))return;
  const l=document.createElement('link');l.id='ow-bubble-fonts';l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Bangers&display=swap';
  document.head.appendChild(l);
}
function bauen(g){
  if(el)return;
  schriftLaden();
  host=document.createElement('div');
  host.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:7';
  el=document.createElement('div');
  el.style.cssText='position:absolute;pointer-events:auto;cursor:pointer;'+
    'filter:drop-shadow(2px 3px 0 rgba(31,26,20,.18))';
  el.innerHTML="<svg style='position:absolute;left:0;top:0;overflow:visible'>"+
    "<path class='out' fill='#fbf6ea' stroke='"+INK+"' stroke-linejoin='round'/>"+
    "<path class='dash' fill='"+INK+"'/>"+
    "<g class='think'></g></svg>"+
    "<div class='body' style='position:relative'></div>";
  svg=el.querySelector('svg');pfad=el.querySelector('.out');denk=el.querySelector('.think');
  strich=el.querySelector('.dash');
  box=el.querySelector('.body');
  el.onclick=e=>{if(e.target===el||e.target===svg||e.target===pfad)schliessen(g);};
  host.appendChild(el);
  (g.shadowRoot||g).appendChild(host);
}
function schliessen(g){
  aktuell=null;anker.gesetzt=false;
  if(el)el.style.display='none';
  if(g&&g.audio)g.audio.sfx('uiClose');
}
/* Weltpunkt → Bildschirmpunkt. Dieselbe Rechnung wie die Leinwand, nur ohne dpr:
   das Overlay liegt in CSS-Pixeln über dem Canvas. */
function w2s(g,wx,wy){
  const z=g.zoomEff?g.zoomEff():(g.att&&g.att.zoom||1);
  const w=g.clientWidth||(g.cv?g.cv.width/(g.dpr||1):0);
  const h=g.clientHeight||(g.cv?g.cv.height/(g.dpr||1):0);
  return {x:(wx-g.cam.x)*z+w/2, y:(wy-g.cam.y)*z+h/2, z};
}

function zeigen(g,unit,o){
  o=o||{};
  bauen(g);
  aktuell={unit,typ:o.type||'speech',text:String(o.text||''),
    aktionen:(o.actions||[]).slice(0,6),seed:0,
    /* v10-S18 · **Geometrie vor dem Streaming** (ChatterBox S1 §3, harte Regel).
       Der vollständige Text wird **einmal** gemessen, daraus entstehen Kontur, Zipfel und Jitter —
       und erst dann läuft der Text hinein. Andernfalls wüchse die Box mit jedem Zeichen, der Pfad
       würde 40× je Sekunde neu gebaut, und die Kontur zappelte beim Lesen.
       *Streaming ändert den Inhalt, nie die Form.* */
    geo:null, gezeigt:o.stream===false?1e9:0, t0:performance.now()};
  aktuell.seed=(aktuell.text.length*131+aktuell.aktionen.length*17+aktuell.typ.length*7)%9999;
  anker.gesetzt=false;
  el.style.display='block';
  setzen(g);
  /* Messen mit vollem Text, dann einfrieren. `offsetWidth` ist erst nach dem Setzen gültig — hier
     steht der volle Text noch drin, das ist genau der Zweck. */
  aktuell.geo={w:box.offsetWidth,h:box.offsetHeight};
  if(aktuell.gezeigt===0)streamen();
  if(g.audio)g.audio.sfx(o.type==='shout'?'hit':'uiOpen',{gain:o.type==='shout'?0.5:0.5});
  return aktuell;
}
/* Der Text läuft in die fertige Blase. Tempo als Zeichen je Sekunde — deutlich schneller als
   Lesetempo (ChatterBox S1 §5: »Streaming speed ≠ reading speed«). */
function streamen(){
  const b=aktuell;if(!b||!txtEl)return;
  const CPS=55;
  const n=Math.floor((performance.now()-b.t0)/1000*CPS);
  b.gezeigt=n;
  const s=b.text.slice(0,Math.min(n,b.text.length));
  if(txtEl.textContent!==s)txtEl.textContent=s;
  if(n<b.text.length)requestAnimationFrame(()=>{if(aktuell===b)streamen();});
}
function setzen(g){
  const b=aktuell;if(!b)return;
  const tint=KANON.tint;
  const paper='rgb('+[250-tint*6,244-tint*22,230-tint*62].map(Math.round).join(',')+')';
  const knoepfe=b.aktionen.map((a,i)=>
    "<button data-i='"+i+"' style=\"font:600 12px 'Courier New',monospace;background:#efe7d3;"+
    "color:"+INK+";border:1.5px solid "+INK+";border-radius:3px;padding:4px 8px;cursor:pointer\">"+
    esc(a.label)+"</button>").join('');
  /* Comic-Lettering ist **zentriert** (ChatterBox S1 §11) — links ausgerichtet las es wie UI-Text.
     Shout bekommt sein eigenes Register: Bangers, größer, gesperrt. */
  const schrei=b.typ==='shout';
  const stil=schrei
    ? "font:400 "+Math.round(KANON.font*1.9)+"px Bangers,'Irish Grover',cursive;letter-spacing:.02em;"
      +"color:"+INK+";line-height:1.06;max-width:250px;text-align:center"
    : "font:"+KANON.font+"px 'Courier New',monospace;color:"+INK+
      ";line-height:1.35;max-width:230px;text-align:center";
  box.innerHTML="<div class='txt' style=\""+stil+"\">"+esc(b.text)+"</div>"+
    (knoepfe?"<div style='display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;justify-content:center'>"
      +knoepfe+"</div>":"");
  txtEl=box.querySelector('.txt');
  box.style.padding=KANON.pad+'px';
  box.style.margin=KANON.M+'px';
  box.querySelectorAll('button').forEach(btn=>{
    btn.onclick=ev=>{
      ev.stopPropagation();
      const a=b.aktionen[+btn.dataset.i];
      if(g.audio)g.audio.sfx('uiSlot');
      if(a&&typeof a.go==='function')a.go(b.unit);
      if(!a||a.close!==false)schliessen(g);
    };
  });
  pfad.setAttribute('fill',paper);
  pfad.setAttribute('stroke-width',b.typ==='whisper'?0:(b.typ==='shout'?KANON.line*1.6:KANON.line));
  pfad.removeAttribute('stroke-dasharray');
}
/* Anker mit Totzone und Trägheit — »Luftballon an Schnur« (Pet Studio v4 §3). */
function tick(g){
  const b=aktuell;if(!b||!el)return;
  const u=b.unit;
  if(!u||u.hp<=0){schliessen(g);return;}
  const bh=(u.unit?u.unit.bodyH*(u.sizeMul||1):60);
  const kopf=w2s(g,u.x,u.y-bh);
  if(!anker.gesetzt){anker.x=kopf.x;anker.y=kopf.y;anker.gesetzt=true;}
  const d=Math.hypot(kopf.x-anker.x,kopf.y-anker.y);
  if(d>KANON.dead){anker.x+=(kopf.x-anker.x)*KANON.lazy;anker.y+=(kopf.y-anker.y)*KANON.lazy;}
  /* `offsetWidth` misst OHNE Rand (margin) — die 2×M sind also schon draußen. Der erste Anlauf zog
     sie ein zweites Mal ab: die Blase war 60 px zu klein, der Text lief oben heraus und die
     Klemmung schob sie an den Bildrand. */
  /* v10-S18: **die eingefrorene Geometrie**, nicht die aktuelle. Während der Text streamt, ist die
     Box schmaler als am Ende — würde hier gemessen, wäre die ganze Regel umsonst. */
  const w=(b.geo&&b.geo.w)||box.offsetWidth, hh=(b.geo&&b.geo.h)||box.offsetHeight;
  if(w<=0||hh<=0)return;
  const M=KANON.M;
  let tx=anker.x-M-w/2, ty=anker.y-KANON.gap-hh-2*M;
  const vw=g.clientWidth||800, vh=g.clientHeight||600;
  tx=Math.max(6-M,Math.min(vw-w-M-6,tx));
  ty=Math.max(6-M,Math.min(vh-hh-M-6,ty));
  el.style.left=Math.round(tx)+'px';el.style.top=Math.round(ty)+'px';
  svg.setAttribute('width',w+2*M);svg.setAttribute('height',hh+2*M);
  // Zipfel zeigt auf den Kopf, in Blasen-Koordinaten
  const hlx=kopf.x-tx, hly=kopf.y-ty;
  const paper=pfad.getAttribute('fill');
  if(b.typ==='thought'){
    /* v10-S12 · Die Denkblase hat **keinen Pfeil**, sondern zwei Kreise, die zum Kopf hin kleiner
       werden — und die **atmen**: sie wandern langsam auf ihrer Achse und pulsieren leicht.
       Dieselbe Logik wie die Blase selbst (Luftballon an Schnur), nur eine Ebene weiter unten. */
    pfad.setAttribute('d',blobPath(M,w,hh,b.seed));
    thinkTail(denk,M,w,hh,hlx,hly,paper,KANON.line,performance.now()/1000);
  }else{
    denk.innerHTML='';
    /* **Blase und Zipfel sind EINE Fläche** (Georg 9.8.): ein Pfad, eine Füllung, eine Kontur.
       Der Zipfel ist Teil von `rectPath` — er wird nie separat gezeichnet und nie von der
       Kontur abgetrennt. Deshalb steht hier auch kein zweiter `path`. */
    const d=(b.typ==='shout'?shoutPath:rectPath)(M,w,hh,b.seed,hlx,hly,KANON.arrow);
    pfad.setAttribute('d',d);
    /* v10-S15 · **Flüstern ist die gestrichelte Feder, kein `stroke-dasharray`.** Der Strich
       hätte konstante Breite und harte Enden — die Kanon-Feder läuft an jedem Strichende spitz aus
       und behält Bauchung und Schattenachse. Gezeichnet wird sie als **Fläche** über derselben
       Punktliste, die auch die Füllung begrenzt: die Kante bleibt eine Kante, sie hebt nur
       zwischendurch ab. */
    strich.setAttribute('d', b.typ==='whisper'?fluesterKante(d):'');
  }
}

window.OW_BUBBLE={
  version:'bubble-ts-v1',
  KANON,
  zeigen,show:zeigen,
  tick,
  schliessen,close:schliessen,
  offen(){return !!aktuell;},
  unit(){return aktuell&&aktuell.unit;},
  note:'Portiert aus KFB Pet Studio v4 (_rectPath/_blobPath/_thinkTail + Ankerphysik). '+
       'Eine bedienbare Blase; die Umgebungs-Plauderei bleibt auf der Leinwand.',
};
})();
