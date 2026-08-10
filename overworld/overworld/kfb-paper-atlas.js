/* KFB Overworld — paper-atlas (hud-v6.0)
   Die TEILELISTE der Tiny-Swords-UI plus der 9-Slice-Setzer. Ein Ort, eine Wahrheit.

   GEMESSEN am 2026-08-06 gegen die Blätter im Repo (Alpha-Profil je Spalte/Zeile):
     Update-010 `UI/Buttons/*_9Slides.png`  = 192×192 → **lückenloses 3×3 aus 64er-Zellen**
     Update-010 `UI/Banners/Carved_9Slides` = 192×192 → dasselbe Raster
     Update-010 `*_3Slides.png`             = 192×64  → 3×1 aus 64er-Zellen (Kappe·Mitte·Kappe)
     Update-010 `UI/Icons/Regular_XX.png`   = 64×64   → Einzelstück
   Das ist NICHT das Free-Pack-Raster (dort 64er-Zellen mit 64 px LÜCKE, Falle 5 im v4-Cut).
   Wer ein Free-Pack-Blatt hier einträgt, setzt `gap:64` — sonst zieht die Lücke mit.

   Drei Regeln, aus denen alles folgt:
     1. Ecken 1:1, Kanten und Mitte GEKACHELT — nie gedehnt.
     2. Ganzzahliger Maßstab (1 oder 0,5), Nearest Neighbour. Nichts dazwischen.
     3. Fertig gesetzte Fläche = ein PNG in Zielgröße (`background-size:100% 100%`), damit weder
        `border-image` noch ein Renderer die Kachelung nachträglich verzieht.
   `surface(key,w,h)` liefert deshalb eine Data-URL, gemerkt nach Schlüssel und Größe. */
(function(){
'use strict';
const RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/2D_Assets/'
        +'Tiny%20Swords%20(Update%20010)/UI/';

const PARTS={
  btn:      {u:RAW+'Buttons/Button_Blue_9Slides.png',          cell:64,grid:9},
  btnDown:  {u:RAW+'Buttons/Button_Blue_9Slides_Pressed.png',  cell:64,grid:9},
  btnHover: {u:RAW+'Buttons/Button_Hover_9Slides.png',         cell:64,grid:9},
  btnOff:   {u:RAW+'Buttons/Button_Disable_9Slides.png',       cell:64,grid:9},
  btnRed:   {u:RAW+'Buttons/Button_Red_9Slides.png',           cell:64,grid:9},
  btnRedDn: {u:RAW+'Buttons/Button_Red_9Slides_Pressed.png',   cell:64,grid:9},
  carved:   {u:RAW+'Banners/Carved_9Slides.png',               cell:64,grid:9},
  carvedBar:{u:RAW+'Banners/Carved_3Slides.png',               cell:64,grid:3},
  ribGold:  {u:RAW+'Ribbons/Ribbon_Yellow_3Slides.png',        cell:64,grid:3},
  ribBlue:  {u:RAW+'Ribbons/Ribbon_Blue_3Slides.png',          cell:64,grid:3},
  ribRed:   {u:RAW+'Ribbons/Ribbon_Red_3Slides.png',           cell:64,grid:3},
};
/* Einzelstücke. Was drauf ist, ist nachgesehen — nicht geraten. */
const ICONS={
  close:'Regular_01', gear:'Regular_02', sound:'Regular_03',
  one:'Regular_04',   two:'Regular_05',  three:'Regular_06',
  cart:'Regular_07',  plus:'Regular_08', minus:'Regular_09', lock:'Regular_10',
};
const POINTER={arrow:'01',bracketTL:'03',bracketTR:'04',bracketBL:'05',bracketBR:'06'};

const imgs=new Map();
function img(u){
  if(imgs.has(u))return imgs.get(u);
  const p=new Promise((ok,no)=>{const i=new Image();i.crossOrigin='anonymous';
    i.onload=()=>ok(i);i.onerror=()=>no(new Error('UI-Teil fehlt: '+u));i.src=u;});
  imgs.set(u,p);return p;
}

/* Der 9-Slice-Setzer. Ein Blatt, neun Teile, eine Fläche in Zielgröße.
   `scale` halbiert (0.5) oder lässt 1:1 — dazwischen gibt es nichts. */
const made=new Map();
async function surface(key,w,h,scale){
  const p=PARTS[key];
  if(!p)throw new Error('[paper-atlas] unbekanntes Teil: '+key);
  const s=(scale===1)?1:0.5;                       // Regel 2
  const C=Math.round(p.cell*s);                    // Ecke/Kappe in Zielpixeln
  const W=Math.max(2*C,Math.round(w)),H=p.grid===3?C:Math.max(2*C,Math.round(h));
  const ck=key+'|'+W+'x'+H+'|'+s;
  if(made.has(ck))return made.get(ck);
  const job=(async()=>{
    const im=await img(p.u);
    const g0=p.cell,gap=p.gap||0,step=g0+gap;      // Quellraster (Free-Pack hätte gap:64)
    const cv=document.createElement('canvas');cv.width=W;cv.height=H;
    const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
    // sx/sy der neun Quellzellen
    const sx=[0,step,2*step],sy=[0,step,2*step];
    const put=(a,b,dx,dy,dw,dh)=>c.drawImage(im,sx[a],sy[b],g0,g0,dx,dy,dw,dh);
    if(p.grid===3){                                 // Band: Kappe · Mitte gekachelt · Kappe
      for(let x=C;x<W-C;x+=C)put(1,0,x,0,Math.min(C,W-C-x),H);
      put(0,0,0,0,C,H);put(2,0,W-C,0,C,H);
    }else{                                          // Fläche: Mitte · Kanten · Ecken
      for(let y=C;y<H-C;y+=C)for(let x=C;x<W-C;x+=C)
        put(1,1,x,y,Math.min(C,W-C-x),Math.min(C,H-C-y));
      for(let x=C;x<W-C;x+=C){const dw=Math.min(C,W-C-x);
        put(1,0,x,0,dw,C);put(1,2,x,H-C,dw,C);}
      for(let y=C;y<H-C;y+=C){const dh=Math.min(C,H-C-y);
        put(0,1,0,y,C,dh);put(2,1,W-C,y,C,dh);}
      put(0,0,0,0,C,C);put(2,0,W-C,0,C,C);put(0,2,0,H-C,C,C);put(2,2,W-C,H-C,C,C);
    }
    return cv.toDataURL('image/png');
  })();
  made.set(ck,job);
  return job;
}

function icon(name){
  const f=ICONS[name];
  if(!f)throw new Error('[paper-atlas] unbekanntes Icon: '+name+' — '+Object.keys(ICONS).join(', '));
  return RAW+'Icons/'+f+'.png';
}
function pointer(name){return RAW+'Pointers/'+(POINTER[name]||'01')+'.png';}

/* Blätter vorwärmen, damit der erste Aufbau nicht flackert. */
function prime(keys){
  return Promise.all((keys||Object.keys(PARTS)).map(k=>img(PARTS[k].u).catch(()=>null)));
}

window.KFB_PAPER={version:'paper-atlas-1.0',PARTS,ICONS,surface,icon,pointer,prime,
  note:'Update-010-Blätter: lückenloses 3×3 aus 64er-Zellen. Fläche wird gesetzt, nie gedehnt.'};
})();
