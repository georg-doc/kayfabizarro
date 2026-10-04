/* KFB Overworld — Reveal (rv-v1.0, V5-S5, Masterplan §22)
   **Eine** Schnittstelle für jedes Aufdecken: Lootbox, Ability, Level-Up, später die Dungeon-Seite.
   Wer etwas aufdeckt, übergibt eine Leinwand und einen Titel — die Regie gehört diesem Modul, nicht
   dem Aufrufer. Sonst hat am Ende jedes System seine eigene halbe Animation.

     OW_REVEAL.show({host, canvas, title, sub, mask:'curtain', onClose})

   **Maske #5 »Vorhang«** (das Papier gibt den Blick frei): eine Schwelle läuft von unten nach oben,
   die Kante ist **gerissen statt geschnitten** — pro Spalte ein Versatz aus zwei langwelligen Sinus
   plus Rauschen, gesät. An der Reißkante fliegen Papierflocken weg. Der Rest ist Zeit: das Blatt
   steigt (0 → 0,42 s), der Vorhang läuft (0,18 → 1,25 s), danach steht die Karte.

   Was dieses Modul NICHT tut: pausieren, Tasten sperren, Ton spielen, den Fortschritt buchen. Das
   ist Sache des Aufrufers — ein Reveal, das das Spiel anhält, wäre in der nächsten Szene falsch. */
(function(){
'use strict';
const DUR={rise:0.42,curtainIn:0.18,curtain:1.07,out:0.26};
let live=null;

const smooth=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
function rnd(seed){let a=seed|0;return()=>{a=(a+0x6D2B79F5)|0;
  let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;
  return((t^(t>>>14))>>>0)/4294967296;};}

/* Der Vorhang als Maske: alles UNTER der gerissenen Kante bleibt stehen. Gezeichnet auf einer
   eigenen Leinwand und mit `destination-in` in das Blatt gestanzt — eine Kante, kein Verlauf über
   das ganze Bild (ein Verlauf hätte die Karte insgesamt blass gemacht, nicht aufgedeckt). */
function curtainPath(g,W,H,p,seed){
  const R=rnd(seed*31+7),a1=H*0.028*(1+R()),f1=2+Math.floor(R()*3),ph=R()*6.283;
  const a2=H*0.012,f2=6+Math.floor(R()*5),ph2=R()*6.283;
  const step=Math.max(4,Math.round(W/120));
  const base=H*(1-p);
  g.beginPath();g.moveTo(0,H+2);
  for(let x=0;x<=W;x+=step){
    const u=x/W;
    const y=base+Math.sin(f1*u*6.283+ph)*a1+Math.sin(f2*u*6.283+ph2)*a2+(R()-0.5)*H*0.006;
    g.lineTo(x,y);
  }
  g.lineTo(W+2,H+2);g.closePath();
  return base;
}

function show(o){
  o=o||{};
  const host=o.host||document.body;
  const src=o.canvas;
  if(!src){console.warn('[reveal] ohne Leinwand nichts zu zeigen');return null;}
  if(live)close(true);
  const seed=(o.seed==null?7:o.seed)|0;
  const wrap=document.createElement('div');
  wrap.setAttribute('data-reveal','');
  wrap.style.cssText='position:absolute;inset:0;z-index:80;display:flex;flex-direction:column;'+
    'align-items:center;justify-content:center;gap:14px;background:rgba(16,13,9,0);'+
    'transition:background .3s ease;cursor:pointer;font-family:"Special Elite",monospace';
  const cv=document.createElement('canvas');
  /* Auch die Lage muss gesetzt werden, nicht nur die Größe: die Spielszene pinnt ihren Weltcanvas
     mit `position:absolute;inset:0` — dieselbe Regel zog dieses Blatt an die linke obere Ecke,
     obwohl der Rahmen zentriert. Gemessen: Karte bei x 0 statt x 341. */
  cv.style.cssText='position:relative;inset:auto;margin:0;flex:none;'+
    'filter:drop-shadow(0 18px 34px rgba(0,0,0,.5))';
  const cap=document.createElement('div');
  cap.style.cssText='color:#f2e8cf;font-size:15px;letter-spacing:.02em;text-align:center;'+
    'opacity:0;transition:opacity .4s ease;text-shadow:0 2px 6px rgba(0,0,0,.7);max-width:70%';
  cap.innerHTML=(o.title?'<b style="color:#e8d38a">'+o.title+'</b>':'')+
    (o.sub?'<br>'+o.sub:'')+'<br><span style="opacity:.6;font-size:13px">Enter · Esc · click</span>';
  wrap.appendChild(cv);wrap.appendChild(cap);
  host.appendChild(wrap);
  requestAnimationFrame(()=>{wrap.style.background='rgba(16,13,9,.66)';});

  const fit=()=>{
    /* Der Host kann ein ShadowRoot sein — der hat kein Äußeres. Dann wird das **Wirtselement**
     gemessen (gefunden, weil die Karte sonst auf 248 px schrumpfte: die Fallback-Zahl 900×600). */
    const box=host.getBoundingClientRect?host:(host.host||document.documentElement);
    const hb=box.getBoundingClientRect();
    const maxH=(hb.height||600)*0.78,maxW=(hb.width||900)*0.5;
    const k=Math.min(maxH/src.height,maxW/src.width,1.6);
    cv.width=Math.round(src.width*k);cv.height=Math.round(src.height*k);
    /* Die Maße MUSS auch in CSS stehen. Der Gastgeber ist eine Spielszene und hat eine Regel für
       seinen Weltcanvas (´canvas{width:100%´…) — die zog dieses Blatt auf 924×540 auf, während die
       Attribute 242×421 sagten. Gemessen, nicht vermutet: CSS-Box gegen Attribut. */
    cv.style.width=cv.width+'px';cv.style.height=cv.height+'px';
    cv.style.maxWidth='none';cv.style.maxHeight='none';cv.style.flex='none';
  };
  fit();
  const mask=document.createElement('canvas');
  const flakes=[];
  const g=cv.getContext('2d');
  const t0=performance.now();
  let raf=0,done=false;

  const frame=(now)=>{
    if(!live)return;
    const t=(now-t0)/1000;
    const W=cv.width,H=cv.height;
    if(mask.width!==W){mask.width=W;mask.height=H;}
    const rise=smooth(t/DUR.rise);
    const p=smooth((t-DUR.curtainIn)/DUR.curtain);
    const mg=mask.getContext('2d');
    mg.clearRect(0,0,W,H);
    mg.drawImage(src,0,0,W,H);
    if(p<1){
      mg.globalCompositeOperation='destination-in';
      mg.fillStyle='#000';
      const edge=curtainPath(mg,W,H,p,seed);
      mg.fill();
      mg.globalCompositeOperation='source-over';
      // Flocken an der Reißkante — nur solange gerissen wird
      if(p>0&&p<1)for(let i=0;i<2;i++)
        flakes.push({x:Math.random()*W,y:edge+(Math.random()-0.5)*H*0.02,
          vx:(Math.random()-0.5)*40,vy:-20-Math.random()*50,r:1+Math.random()*2.6,
          a:0.85,rot:Math.random()*6.28});
    }
    g.clearRect(0,0,W,H);
    g.save();
    g.translate(0,(1-rise)*H*0.16);
    g.globalAlpha=0.15+0.85*rise;
    g.drawImage(mask,0,0);
    g.restore();
    g.globalAlpha=1;
    for(let i=flakes.length-1;i>=0;i--){
      const f=flakes[i];
      f.x+=f.vx*0.016;f.y+=f.vy*0.016;f.vy+=90*0.016;f.a-=0.012;f.rot+=0.08;
      if(f.a<=0){flakes.splice(i,1);continue;}
      g.save();g.translate(f.x,f.y);g.rotate(f.rot);
      g.fillStyle='rgba(242,232,207,'+f.a.toFixed(2)+')';
      g.fillRect(-f.r,-f.r*0.7,f.r*2,f.r*1.4);
      g.restore();
    }
    if(!done&&p>=1&&rise>=1){done=true;cap.style.opacity='1';if(o.onDone)o.onDone();}
    raf=requestAnimationFrame(frame);
  };

  const onKey=e=>{
    const k=(e.key||'').toLowerCase();
    if(k==='escape'||k==='enter'||k===' '){e.preventDefault();e.stopPropagation();close();}
  };
  wrap.addEventListener('click',()=>close());
  window.addEventListener('keydown',onKey,true);
  const onResize=()=>{fit();};
  window.addEventListener('resize',onResize);

  live={wrap,cv,onKey,onResize,onClose:o.onClose,get raf(){return raf;},stop:()=>cancelAnimationFrame(raf)};
  raf=requestAnimationFrame(frame);
  return live;
}

function close(silent){
  if(!live)return;
  const l=live;live=null;
  l.stop();
  window.removeEventListener('keydown',l.onKey,true);
  window.removeEventListener('resize',l.onResize);
  l.wrap.style.background='rgba(16,13,9,0)';
  l.wrap.style.opacity='0';
  l.wrap.style.transition='opacity .22s ease, background .22s ease';
  setTimeout(()=>{l.wrap.remove();},240);
  if(!silent&&l.onClose)l.onClose();
}

window.OW_REVEAL={version:'rv-v1.0',show,close,masks:['curtain'],
  get open(){return !!live;},DUR,
  note:'Eine Schnittstelle für jedes Aufdecken. Maske #5 Vorhang: gerissene Kante läuft nach oben.'};
})();
