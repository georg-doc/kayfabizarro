/* KFB — paper-atlas (pa-v1.0)
   Die EINE Stelle mit den Tiny-Swords-UI-Teilen und dem 9-Teil-Composer. Herkunft:
   `overworld/hud-paper.js` (hud-v4.3) — dort war die Liste zu Hause, solange nur das HUD sie
   brauchte. Seit dem Asset-Browser (V5-S2) hat sie zwei Leser, also gehört sie in eine eigene
   Datei (Falle 7 aus dem Session-Cut v4: eine Liste an zwei Orten ist eine Liste zu viel).

   Drei gemessene Regeln, die hier eingebaut sind:
     1. **Die Free-Pack-Blätter sind Atlanten aus neun Teilen** auf einem 64er-Raster mit 64 px
        Lücke — nicht eine zusammenhängende Grafik. Für ein 320er-Blatt heißt das Ecke 64 ·
        Lücke 64 · Mitte 64 · Lücke 64 · Ecke 64; für ein 448er-Blatt Ecke 128 · Lücke 64 ·
        Mitte 64 · Lücke 64 · Ecke 128. Bänder (Ribbons, Bars) sind dieselbe Regel in einer Zeile.
     2. **Mehrfarbige Bögen werden geschnitten, nicht gestreckt.** Ein Band wird als eigene Grafik
        herausgeholt (Data-URL); sonst dehnt der Browser immer den ganzen Bogen.
     3. **Papier kachelt, es dehnt nicht.** Mitte und Kanten ganzzahlig gekachelt, sonst zieht die Faser.
   Alles wird halbiert gezeichnet (ganzzahlig), deshalb stehen unten die halben Maße:
   C = Ecke, M = 32 (Mittelstück), Lücke = 32. */
(function(){
'use strict';
const S=window.OW_SRC;
if(!S)console.error('[paper-atlas] asset-source.js fehlt — Assets laden nicht');
const RAW=S?S.a2d(''):'';   // Quelle: overworld/asset-source.js
const FP=RAW+'Tiny%20Swords%20(Free%20Pack)/UI%20Elements/UI%20Elements/';
const P10UI=RAW+'Tiny%20Swords%20(Update%20010)/UI/';
const M=32;
const SHEETS={
  paper:      {u:FP+'Papers/RegularPaper.png',                   C:32},
  special:    {u:FP+'Papers/SpecialPaper.png',                    C:32},
  banner:     {u:FP+'Banners/Banner.png',                         C:64},
  table:      {u:FP+'Wood%20Table/WoodTable.png',                 C:64},
  btnBlue:    {u:FP+'Buttons/BigBlueButton_Regular.png',          C:32},
  btnBlueDown:{u:FP+'Buttons/BigBlueButton_Pressed.png',          C:32},
  btnRed:     {u:FP+'Buttons/BigRedButton_Regular.png',           C:32},
  smallRib:   {u:FP+'Ribbons/SmallRibbons.png',                   C:32,band:32},
  bigRib:     {u:FP+'Ribbons/BigRibbons.png',                     C:64,band:64},
  barBase:    {u:FP+'Bars/BigBar_Base.png',                       C:32,band:32},
  smallBar:   {u:FP+'Bars/SmallBar_Base.png',                     C:32,band:32},
  sqBlue:     {u:FP+'Buttons/SmallBlueSquareButton_Regular.png',  plain:true},
  sqBlueDown: {u:FP+'Buttons/SmallBlueSquareButton_Pressed.png',  plain:true},
  sqRed:      {u:FP+'Buttons/SmallRedSquareButton_Regular.png',   plain:true},
  icoClose:   {u:P10UI+'Icons/Regular_01.png',                    plain:true},
  icoGear:    {u:P10UI+'Icons/Regular_02.png',                    plain:true},
  icoSound:   {u:P10UI+'Icons/Regular_03.png',                    plain:true},
  icoHelp:    {u:P10UI+'Icons/Regular_08.png',                    plain:true},
  icoLock:    {u:P10UI+'Icons/Regular_10.png',                    plain:true},
};

function loadImg(u){return new Promise((ok,no)=>{const i=new Image();i.crossOrigin='anonymous';
  i.onload=()=>ok(i);i.onerror=()=>no(new Error('UI-Teil fehlt: '+u));i.src=u;});}

/* Blätter halbiert bereitstellen (Nearest Neighbour, ganzzahlig). Ein Netzweg für alle Leser:
   der zweite Aufruf bekommt dieselbe Zusage zurück, nicht einen zweiten Ladelauf. */
let PARTS=null,inflight=null;
function load(){
  if(PARTS)return Promise.resolve(PARTS);
  if(inflight)return inflight;
  inflight=(async()=>{
    const got={};
    for(const k in SHEETS){
      const sp=SHEETS[k];
      try{
        const im=await loadImg(sp.u);
        const cv=document.createElement('canvas');
        cv.width=im.width/2|0;cv.height=im.height/2|0;
        const x=cv.getContext('2d');x.imageSmoothingEnabled=false;
        x.drawImage(im,0,0,im.width,im.height,0,0,cv.width,cv.height);
        got[k]=Object.assign({},sp,{cv});
      }catch(e){console.warn('[paper]',e.message);}
    }
    PARTS=got;inflight=null;return got;
  })();
  return inflight;
}

/* Aus den neun Teilen eine Fläche bauen: Ecken 1:1, Kanten und Mitte ganzzahlig gekachelt.
   row = Farbband (nur bei Bändern). Ergebnis wird nach Größe gemerkt. */
const painted=new Map();
function compose(part,key,w,h,row){
  const ck=key+'|'+w+'x'+h+'|'+(row||0);
  if(painted.has(ck))return painted.get(ck);
  const src=part.cv,C=part.C,mid=C+M,right=mid+2*M;
  const bandH=part.band||0,oy=bandH?row*bandH*2:0; // Bandzeilen liegen 2*bandH auseinander (Lücke)
  const H=bandH||h;
  const cv=document.createElement('canvas');
  cv.width=Math.max(2*C+M,w);cv.height=Math.max(bandH?bandH:2*C+M,H);
  const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  const W=cv.width,HH=cv.height;
  const put=(sx,sy,sw,sh,dx,dy,dw,dh)=>c.drawImage(src,sx,sy,sw,sh,dx,dy,dw,dh);
  if(bandH){ // Band: Kappe · Mitte gekachelt · Kappe
    put(0,oy,C,bandH,0,0,C,bandH);
    for(let x=C;x<W-C;x+=M)put(mid,oy,Math.min(M,W-C-x),bandH,x,0,Math.min(M,W-C-x),bandH);
    put(right,oy,C,bandH,W-C,0,C,bandH);
  }else{
    for(let y=C;y<HH-C;y+=M)for(let x=C;x<W-C;x+=M){
      const dw=Math.min(M,W-C-x),dh=Math.min(M,HH-C-y);
      put(mid,mid,dw,dh,x,y,dw,dh);
    }
    for(let x=C;x<W-C;x+=M){const dw=Math.min(M,W-C-x);
      put(mid,0,dw,C,x,0,dw,C);put(mid,right,dw,C,x,HH-C,dw,C);}
    for(let y=C;y<HH-C;y+=M){const dh=Math.min(M,HH-C-y);
      put(0,mid,C,dh,0,y,C,dh);put(right,mid,C,dh,W-C,y,C,dh);}
    put(0,0,C,C,0,0,C,C);put(right,0,C,C,W-C,0,C,C);
    put(0,right,C,C,0,HH-C,C,C);put(right,right,C,C,W-C,HH-C,C,C);
  }
  const out=cv.toDataURL('image/png');painted.set(ck,out);return out;
}
function dataUrl(parts,key){const p=parts[key];return p?p.cv.toDataURL('image/png'):null;}

/* Elemente anziehen. list = [{sel, sheet, row}] — `plain` kommt aus dem Blatt (Einzelstück)
   oder aus dem Eintrag. Wer schon in dieser Größe angezogen ist, wird nicht neu gemalt. */
function dress(root,list,parts){
  if(!parts)return 0;
  let n=0;
  for(const d of list){
    const p=parts[d.sheet];if(!p)continue;
    for(const el of root.querySelectorAll(d.sel)){
      if(d.plain||p.plain){
        if(el.dataset.owSkin===d.sheet)continue;
        el.dataset.owSkin=d.sheet;
        el.style.backgroundImage='url('+dataUrl(parts,d.sheet)+')';
        el.style.backgroundSize='100% 100%';
        el.style.backgroundRepeat='no-repeat';
        el.style.backgroundColor='transparent';
        n++;continue;
      }
      const r=el.getBoundingClientRect();
      if(!r.width)continue;
      const w=Math.round(r.width),hh=p.band?p.band:Math.round(r.height);
      const key=d.sheet+'|'+(d.row||0)+'|'+w+'x'+hh;
      if(el.dataset.owSkin===key)continue;
      el.dataset.owSkin=key;
      el.style.backgroundImage='url('+compose(p,d.sheet,w,hh,d.row||0)+')';
      el.style.backgroundSize=w+'px '+hh+'px';
      el.style.backgroundRepeat='no-repeat';
      el.style.backgroundPosition=p.band?'left center':'0 0';
      el.style.backgroundColor='transparent';
      n++;
    }
  }
  return n;
}

function fonts(){
  if(document.getElementById('ow-hud-fonts'))return;
  const l=document.createElement('link');
  l.id='ow-hud-fonts';l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Special+Elite&family=Irish+Grover&display=swap';
  document.head.appendChild(l);
}

window.OW_PAPER={version:'pa-v1.0',SHEETS,M,load,compose,dataUrl,dress,fonts,loadImg,
  note:'Tiny-Swords-UI als 9-Teil-Atlas (gemessen), 0,5-Maßstab, selbst gemalt. Leser: hud-paper.js, asset-browser-2d.js'};
})();
