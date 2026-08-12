/* KFB Overworld — Waber-Shader in 2D (shade-v1.0, Slice T2)
   Portiert `terrain-v12/skydome-shader.js` (Modus 'S', Nebel) auf Canvas 2D. **Dieselbe Mathematik,
   andere Abtastung:** dort ein Fragment-Shader je Bildpunkt, hier ein grobes Gitter, das geglättet
   hochskaliert wird. Ein Skydome füllt den Blick mit weichen Wolken — genau die Art Bild, die man
   grob rechnen und weich vergrößern darf, ohne dass es auffällt.

     Warp    drei fbm-Kanäle verschieben die Abfragestelle   (uSphWarp)
     Feld    fbm an der verschobenen Stelle                  → große Massen
     Detail  fbm an derselben Stelle, 2,6-fach feiner         → Zeichnung darin
     Farbe   mix(A,B, smoothstep(0.15,0.62,t)) dann C nach Detail

   Kosten (die Regel: keine Aussage ohne Zahl): Gitter 96×96 = 9216 Punkte, je Punkt 5 fbm à
   4 Oktaven. Neu gerechnet wird **jedes zweite Bild** (`OW_SHADE.jedes`), hochskaliert je Bild —
   ein `drawImage`. Wer es billiger braucht, dreht `gitter` auf 64; wer mehr Zeichnung will, auf 128.

   Die Farbe kommt aus einer Palette je Biom oder Fluid, nicht aus dem Rauschen. Über dem Terrain
   liegt sie **gedämpft** (`overlay`, Deckung 0,16): der Boden lebt, er wird nicht eingefärbt.
   Über Fluiden liegt sie **deckend** — dort IST sie das Material. */
(function(){
'use strict';
const VERSION='shade-v1.0';
if(window.OW_SHADE&&window.OW_SHADE.version===VERSION){
  console.log('[shade] schon geladen ('+VERSION+')');return;}

/* Wertrauschen statt Simplex: in JS ist der Hash billiger als die Gradienten, und bei vier Oktaven
   auf einem groben Gitter sieht man den Unterschied nicht. Die Oktavfaktoren sind die des Originals
   (2.03 · 4.11 · 8.07 mit Versatz), damit die Struktur dieselbe Handschrift hat. */
function vn(x,y,k){
  const gx=Math.floor(x),gy=Math.floor(y),fx=x-gx,fy=y-gy;
  const ex=fx*fx*(3-2*fx),ey=fy*fy*(3-2*fy);
  const h=(a,b)=>{let v=(a|0)*374761393+(b|0)*668265263+(k|0)*2246822519;
    v=(v^(v>>>13))>>>0;v=Math.imul(v,1274126177);return((v^(v>>>16))>>>0)/2147483647.5-1;};
  const a=h(gx,gy),b=h(gx+1,gy),c=h(gx,gy+1),d=h(gx+1,gy+1);
  const u=a+(b-a)*ex,w=c+(d-c)*ex;return u+(w-u)*ey;
}
function fbm(x,y,k){
  return vn(x,y,k)*0.5 + vn(x*2.03+11.7,y*2.03+11.7,k+7)*0.25
       + vn(x*4.11+23.3,y*4.11+23.3,k+19)*0.125 + vn(x*8.07+47.1,y*8.07+47.1,k+37)*0.0625;
}

const hx=h=>{const s=h.replace('#','');
  return [parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)];};

/* Paletten: drei Farben wie im Original (uColA/B/C) plus das Gefühl (warp · contrast · flow).
   Terrain gedämpft, Fluide sättiger — Georgs Vorgabe: »Rest dezenter und eher morphend«. */
const PALETTES={
  /* sechs Biome, gedämpft. Sie tönen den gebackenen Boden, sie ersetzen ihn nicht. */
  hof:      {a:'#4a6b34',b:'#8aa85c',c:'#e8d894', warp:0.7,contrast:0.8,flow:0.5,tempo:0.055,modus:'overlay',alpha:0.16},
  wildnis:  {a:'#243d24',b:'#4f7a3e',c:'#a8c46a', warp:0.9,contrast:1.0,flow:0.7,tempo:0.048,modus:'overlay',alpha:0.18},
  goblins:  {a:'#3d3320',b:'#7a6a3a',c:'#c4b45a', warp:1.1,contrast:1.1,flow:1.0,tempo:0.062,modus:'overlay',alpha:0.18},
  verlies:  {a:'#241f2e',b:'#4a4459',c:'#8a7fa0', warp:1.0,contrast:1.3,flow:0.6,tempo:0.040,modus:'overlay',alpha:0.20},
  lager:    {a:'#4a3a24',b:'#8a6f42',c:'#dcc088', warp:0.8,contrast:0.9,flow:0.6,tempo:0.052,modus:'overlay',alpha:0.16},
  wasserland:{a:'#2e4a4a',b:'#5f8a86',c:'#bcd8cc', warp:0.9,contrast:0.9,flow:0.8,tempo:0.058,modus:'overlay',alpha:0.17},

  /* Fluide. Hier ist der Shader das Material, also deckend und mit mehr Schwung. */
  wasser:   {a:'#0d4a5e',b:'#2e9ab0',c:'#e8f6f2', warp:1.3,contrast:1.6,flow:1.5,tempo:0.11, modus:'source-over',alpha:1, skala:340},
  bubblegum:{a:'#8a2a6a',b:'#e86ab0',c:'#fff0f6', warp:1.5,contrast:1.7,flow:1.6,tempo:0.10, modus:'source-over',alpha:1, skala:300},
  /* Öl/Tusche: fast schwarz mit einem schmalen Spiegel-Band. Der Glanz ist die dritte Farbe, sehr
     spät in der Rampe — deshalb blitzt er nur in den Kämmen und nicht auf der Fläche. */
  oel:      {a:'#080a0c',b:'#171c22',c:'#7f8ea8', warp:1.1,contrast:2.1,flow:0.9,tempo:0.07, modus:'source-over',alpha:1,glanz:0.82, skala:420},
  saeure:   {a:'#1d3a12',b:'#5fbf28',c:'#e4ff8a', warp:1.2,contrast:1.9,flow:1.2,tempo:0.13, modus:'source-over',alpha:1,puls:0.22, skala:330},
};

const API={version:VERSION, PALETTES, schritt:26, maxGitter:88, rand:8, jedes:3,
  /* `stats` bleibt fuer den Gesamtzaehler; die Zahlen JE SCHICHT stehen in `stats.pro[name]`.
     Eine globale Zahl fuer zwei Schichten ist ein Aliasing-Fehler: wer sie liest, bekommt die
     Werte der Schicht, die zuletzt gerechnet hat — und beschriftet sie mit der falschen. */
  stats:{rechnungen:0,letztMs:0,gitter:0,schritt:26,pro:{}}};

/* ── WELTVERANKERUNG ────────────────────────────────────────────────────────────────────────
   Die erste Fassung rechnete das Gitter über den aktuellen Ausschnitt und blittete zwei von drei
   Bildern dasselbe kleine Bild in den inzwischen verschobenen Ausschnitt. Ergebnis: das Muster zog
   mit der Kamera mit und sprang beim Neurechnen zurück — eine Tapete vor der Welt, genau das, was
   der Kopf dieses Moduls ausschließen wollte. Und die Abtastpunkte wurden über die Fensterbreite
   gespreizt, also hätte dasselbe Biom in zwei Fenstergrößen verschieden grob ausgesehen.

   Jetzt gilt: der **Abstand zweier Abtastpunkte ist eine Weltlänge** (`schritt`), der Ursprung ist
   auf ein Vielfaches davon gerastert, und geblittet wird immer an dem Weltort, an dem gerechnet
   wurde — nicht an dem, wo die Kamera gerade steht. Ein Rand von `rand` Schritten sorgt dafür, dass
   das gerechnete Stück den Ausschnitt auch noch deckt, wenn der Held ein Stück gelaufen ist.
   Die Frequenz hängt damit allein am Weltmaßstab, und das Muster steht still, während die Kamera
   läuft. */

const flaechen=new Map();
let naechsterPlatz=0;
/* Jede Schicht bekommt bei der Anlage eine laufende Nummer. Der Versatz kam vorher aus der
   Zeichensumme des Palettennamens — und der ist Zufall: 'hof' und 'oel' liegen beide auf 2,
   'wildnis' und 'saeure' beide auf 0. Bei diesen Paaren rechneten BEIDE Gitter im selben Bild, also
   genau die doppelte Spitze, die die Staffelung verhindern sollte. Ein Platz ist garantiert, ein
   Hash ist geraten. */
function feld(name){
  let f=flaechen.get(name);
  if(!f){f={name,klein:document.createElement('canvas'),bild:null,gw:0,gh:0,
    qx:0,qy:0,s:0,rahmen:-999,platz:naechsterPlatz++};
    flaechen.set(name,f);}
  return f;
}

/* Die gerasterte Weltkachel für einen Ausschnitt: Ursprung auf `schritt` gerastert, `rand` Schritte
   Zuschlag auf jeder Seite, Gitter so groß wie nötig — und wenn das über `maxGitter` geht, wird der
   Schritt gröber statt das Gitter teurer. Die Kosten sind damit oben beschränkt, die Frequenz nicht
   an das Fenster gekoppelt. */
function plan(rect,pal){
  /* Der Abtastschritt folgt dem Maßstab: rund 14 Punkte je Merkmal. Bei festem Schritt von 26 px
     hätte ein Fluid-Merkmal von 340 px nur 13 Punkte über die ganze Breite — das Morphen zerfiele
     in Karos, und man würde die Abtastung sehen statt der Bewegung. */
  const merkmal=(pal&&pal.skala)||1400;
  let s=Math.max(4,Math.min(API.schritt|0,Math.round(merkmal/14)));
  const r=Math.max(1,API.rand|0);
  let gw=Math.ceil(rect.w/s)+2*r+1, gh=Math.ceil(rect.h/s)+2*r+1;
  const max=Math.max(24,API.maxGitter|0);
  if(gw>max||gh>max){
    const f=Math.max(gw/max,gh/max);
    s=Math.ceil(s*f);
    gw=Math.ceil(rect.w/s)+2*r+1; gh=Math.ceil(rect.h/s)+2*r+1;
  }
  return {s, gw, gh,
    qx:Math.floor(rect.x/s)*s - r*s,
    qy:Math.floor(rect.y/s)*s - r*s};
}

let rahmen=0;
/* Die Weltkoordinate muss mitgerechnet werden, sonst klebt das Muster am Bildschirm statt an der
   Welt — der Fehler, den man erst beim Laufen sieht: das Wabern zieht mit der Kamera mit und die
   Welt fühlt sich an wie eine Tapete davor. */
function rechne(f,pal,P,zeit){
  const gw=P.gw, gh=P.gh, s=P.s, QX=P.qx, QY=P.qy;
  if(f.klein.width!==gw||f.klein.height!==gh){
    f.klein.width=gw; f.klein.height=gh;
    f.bild=f.klein.getContext('2d').createImageData(gw,gh);
  }
  const d=f.bild.data;
  const ph=zeit*pal.tempo;
  /* Weltmaßstab: eine Feldbreite auf ~1400 Weltpixel. Groß gewählt, weil Georgs Vorgabe »selten und
     großflächig« ist — kleine Muster wären Rauschen, und Rauschen gehört in den Dreck, nicht hierhin. */
  /* Merkmalsgröße in Weltpixeln, je Palette. Terrain 1400 (rund 22 Felder — groß und selten,
     Georgs Vorgabe), Fluide 300–420 (fünf bis sieben Felder — sichtbar auf einem Wasserstreifen). */
  const S=1/(pal.skala||1400);
  const A=hx(pal.a),B=hx(pal.b),C=hx(pal.c);
  const puls=pal.puls?1+pal.puls*Math.sin(zeit*1.7):1;
  const t0=performance.now();
  for(let j=0;j<gh;j++){
    const wy=(QY+j*s)*S;
    for(let i=0;i<gw;i++){
      const wx=(QX+i*s)*S;
      /* Vektor-Warp: drei Kanäle, zwei laufen mit der Zeit vor, einer zurück — genau die Kombination
         aus dem Original. Sie ist der Grund, dass die Formen rund sind und nicht wellig. */
      const w1=fbm(wx*0.75+ph*0.5, wy*0.75+ph*0.5, 0)*pal.warp;
      const w2=fbm(wx*0.75+5.2, wy*0.75+ph*0.5+5.2, 40)*pal.warp;
      const w3=fbm(wx*0.75+9.1, wy*0.75-ph*0.35+9.1, 80)*pal.warp;
      const qx=wx*0.7+w1, qy=wy*0.7+w2+w3*0.35;
      const fld=fbm(qx*0.95+ph*0.4, qy*0.95+ph*0.4, 120);
      const det=fbm(qx*2.6-ph*0.7, qy*2.6-ph*0.7, 160);
      let t1=fld*0.5*pal.contrast+0.5;
      t1=Math.max(0,Math.min(1,t1*puls));
      /* smoothstep(0.15,0.62,t1) — dieselben Kanten wie im Skydome. Eine Rampe mit harten Grenzen
         gibt Bänder, eine ohne gibt Brei. */
      const s1=(u=>{const q=Math.max(0,Math.min(1,(u-0.15)/0.47));return q*q*(3-2*q);})(t1);
      let r=A[0]+(B[0]-A[0])*s1, g=A[1]+(B[1]-A[1])*s1, b=A[2]+(B[2]-A[2])*s1;
      /* Die dritte Farbe kommt nur in den Kämmen. Bei Öl steht der Einsatz sehr spät (`glanz`),
         daher blitzt der Spiegel statt zu leuchten. */
      const ein=pal.glanz||0.55;
      const s2=(u=>{const q=Math.max(0,Math.min(1,(u-ein)/(1-ein+0.001)));return q*q*(3-2*q);})(det*0.5+0.5);
      const k=s2*(pal.flow*0.45);
      r+=(C[0]-r)*k; g+=(C[1]-g)*k; b+=(C[2]-b)*k;
      const o=(j*gw+i)*4;
      d[o]=r|0; d[o+1]=g|0; d[o+2]=b|0; d[o+3]=255;
    }
  }
  f.klein.getContext('2d').putImageData(f.bild,0,0);
  f.gw=gw; f.gh=gh; f.s=s; f.qx=QX; f.qy=QY;
  const ms=Math.round((performance.now()-t0)*10)/10;
  API.stats.rechnungen++;
  API.stats.letztMs=ms; API.stats.gitter=gw+'x'+gh; API.stats.schritt=s;
  API.stats.pro[f.name]={ms, gitter:gw+'x'+gh, schritt:s, rechnungen:(API.stats.pro[f.name]?API.stats.pro[f.name].rechnungen+1:1)};
}

/* Zeichnet die Schicht in `rect` (Weltkoordinaten). Der Aufrufer clippt vorher — über Land als
   Tönung, über Fluid als Material. */
API.draw=function(ctx,rect,palette,zeit,opt){
  const pal=PALETTES[palette]; if(!pal) return false;
  const o=opt||{};
  const f=feld(palette);
  const P=plan(rect,pal);
  /* **Versetzt rechnen.** Zwei Gitter, die im selben Bild neu gerechnet werden, addieren ihre
     Kosten zu einer Spitze — und eine Spitze je zweitem Bild ist ein Ruckler, kein Mittelwert.
     Der Versatz kommt aus dem Palettennamen, ist also stabil und braucht keinen Zähler. */
  const takt=Math.max(1,API.jedes|0);
  const vs=f.platz;
  /* Neu gerechnet wird aus zwei Gruenden: die Zeit ist weiter (Morphen), oder der Ausschnitt hat das
     gerechnete Stueck verlassen. Dazwischen wird dasselbe Bild an DEMSELBEN WELTORT geblittet. */
  const raus = f.s!==P.s || f.gw!==P.gw || f.gh!==P.gh ||
    rect.x<f.qx || rect.y<f.qy ||
    rect.x+rect.w>f.qx+(f.gw-1)*f.s || rect.y+rect.h>f.qy+(f.gh-1)*f.s;
  /* (Die Deckung wird bewusst gegen den letzten ABTASTPUNKT geprueft, nicht gegen den Blit-Rand:
     der halbe Zellrand darf ausserhalb liegen, ein fehlender Abtastpunkt nicht.) */
  const jetzt = ((rahmen+vs)%takt)===0;
  /* Auch der ERSTE Aufbau wartet auf seinen Takt: sonst rechnen alle Schichten im ersten Bild
     gleichzeitig, und der teuerste Moment ist genau der, den der Spieler zuerst sieht. Nur wenn
     noch gar nichts da ist, das man blitten könnte, wird sofort gerechnet. */
  const leer = f.rahmen<0;
  if((leer&&jetzt) || raus || (!leer && rahmen-f.rahmen>=takt && jetzt)){
    rechne(f,pal,P,zeit||0); f.rahmen=rahmen;
  }
  if(leer&&f.rahmen<0) return false;   // noch nichts zu zeigen — der Aufrufer zeichnet ohne diese Schicht
  ctx.save();
  ctx.globalCompositeOperation=o.modus||pal.modus;
  ctx.globalAlpha=o.alpha==null?pal.alpha:o.alpha;
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  /* Geblittet wird an dem Weltort, an dem gerechnet wurde — nicht dort, wo die Kamera steht. Das ist
     der ganze Unterschied zwischen »die Welt lebt« und »eine Tapete klebt vor der Welt«. */
  /* Abtastpunkt i sitzt in der Welt auf qx+i*s; beim Vergroessern liegt die Mitte der Spalte i auf
     destX+(i+0.5)*destW/gw. Damit beides zusammenfaellt: Zielbreite gw*s, Ursprung eine halbe Zelle
     zurueck. Vorher war das Muster um eine halbe Zelle versetzt und um gw/(gw-1) gestreckt. */
  ctx.drawImage(f.klein,0,0,f.gw,f.gh, f.qx-f.s/2,f.qy-f.s/2,f.gw*f.s,f.gh*f.s);
  ctx.restore();
  return true;
};
/* Eine Uhr für alle: der Runner ruft das einmal je Bild, damit `jedes` zählt und nicht jede
   Schicht ihren eigenen Takt erfindet (§28.3 — vier Takte sind Rauschen, nicht Leben). */
API.tick=function(){ rahmen++; };
/* Eine Zeile je Schicht, mit den Zahlen DIESER Schicht. */
API.zeile=function(name){
  const s=API.stats.pro[name];
  return name+(s?' '+s.ms+' ms · '+s.gitter+' · Schritt '+s.schritt:' —');
};

window.OW_SHADE=API;
console.log('[shade] '+VERSION+' — Schritt '+API.schritt+' Weltpixel, Gitter <= '+API.maxGitter+
  ', jedes '+API.jedes+'. Paletten: '+Object.keys(PALETTES).join(' · '));
})();
