/* KFB Overworld — Bodenschicht (gp-v1.0, V6-S1, Masterplan §26/§27.3)
   **Der Boden wird nicht ersetzt, er wird überzogen.** Das Autotiling für Gras, Sand, Wasser,
   Schaum und Klippen bleibt unangetastet — darüber liegt eine Schicht aus drei Dingen:

     Grundton (Palette des Bioms) · Textur (Georgs Auswahl) · Decals (gestreut)

   Dazu die obere Lichtkante und die untere Schattenkante je Spielfeld — Georgs Voxel-Idee in die
   Draufsicht übersetzt: ein Feld ist ein Block, also hat es eine belichtete und eine beschattete
   Seite. Das kostet nichts, weil es **in die Kachel gebacken** wird.

   Warum eine Overlay-Schicht und kein Kachelersatz: der Sandsaum, der Schaum an der Küste und die
   Klippenfront hängen an vier gemessenen Autotile-Blättern. Wer den Boden ersetzt, baut sie nach —
   und zwei Implementierungen derselben Regel laufen auseinander (Lehre S13b).

   Und **eine Uhr** (§28.3): das Atmen kommt von außen als `t`, nicht aus einer eigenen Zeitbasis.
   Vier pulsierende Systeme mit vier Takten sind Rauschen, nicht Leben.

   Verbrauch: EIN `fillRect` je Frame und Biom. Die 512er-Kachel (8×8 Felder) wird einmal gebaut. */
(function(){
'use strict';
/* **Einmal ist einmal.** Die Helmet-Skripte laufen beim zweiten Mount erneut — und jede Ausführung
   legt eine NEUE, leere Instanz über die gefüllte. Am 8.8. gemessen: das Log sagte »Blätter geladen:
   13 von 13«, während `OW_GROUND.loaded` 0 war und die Kachel Korn 1,17 statt 7,34 hatte. Der Boden
   war flach, ohne eine einzige Fehlermeldung — dieselbe Fehlerklasse wie der Textur-Cache am 7.8.:
   wer beim ersten Versuch leer ausgeht, darf den Ersatz nicht für das Ergebnis halten.
   Die Versionsnummer ist der Schlüssel: eine neue Version darf übernehmen, dieselbe nicht. */
if(window.OW_GROUND&&window.OW_GROUND.version==='gp-v1.8'){
  console.log('[ground] schon geladen ('+window.OW_GROUND.version+
    ', '+window.OW_GROUND.loaded+' Blätter) — zweite Ausführung übersprungen');
  return;
}
const N=64,TILE=512;            // Spielfeld · Kachelkante (8×8 Felder)
const B=()=>window.OW_SRC?OW_SRC.a3d('Textures/'):'';
const diffuse=n=>B()+encodeURI(n+'/'+n+'_diffuse.jpg');
const decal=n=>B()+'decals/'+n+'.png';

/* Die sieben Biome als Daten. `tex` aus Georgs Auswahl (docs/TEXTUR_AUSWAHL_georg.md),
   `tint` ist der Grundton, `a` die Deckung der Textur, `decals` was gestreut wird.
   Keine Kachelindizes — eine Textur ist eine Fläche, keine Position in einem Blatt. */
const BIOMES={
  grass:   {tex:'Ground049A',        tint:'#7fa64e',a:0.30,decals:['scratches_alpha'],       dn:7},
  wilds:   {tex:'forest_ground_05',  tint:'#5e7f3e',a:0.38,decals:['scratches_alpha','ink_splat_alpha'],dn:9},
  swamp:   {tex:'Ground012',         tint:'#4d6b52',a:0.42,decals:['ink_splat_alpha'],       dn:11},
  ash:     {tex:'Ground087',         tint:'#6b6259',a:0.46,decals:['scratches_alpha','coffee_ring_alpha'],dn:13},
  highland:{tex:'Ground037',         tint:'#8a9a86',a:0.34,decals:['scratches_alpha'],       dn:6},
  winter:  {tex:'Ground026',         tint:'#c6d4dc',a:0.28,decals:['scratches_alpha'],       dn:5},
  waste:   {tex:'clay_floor_001',    tint:'#a8895c',a:0.40,decals:['coffee_ring_alpha','scratches_alpha'],dn:10},
  paper:   {tex:'Paper004',          tint:'#d8cdb2',a:0.34,decals:['coffee_ring_alpha','ink_splat_alpha','fingerprint_alpha'],dn:12},
};
// Sand und Kies bekommen ihre eigene, ruhigere Schicht — sonst schluckt die Erdtextur den Saum
const SAND={tex:'Ground071',tint:'#dfc98e',a:0.24,decals:['scratches_alpha'],dn:4};

const imgs={},tiles={},masks={},reliefs={};
let want=null, reliefSettled=false;
/* Backvorgänge zählen — nicht für die Statistik, sondern weil der **erste** Blick auf ein Biome die
   512er-Kachel erst herstellt (Textur + Relief + Decals + nahtloser Rand). Das kostet einmal viel und
   danach nichts. Wer das nicht zählt, sucht den Ruckler an der falschen Stelle. */
let bakes=0, bakeMs=0;
/* Deckung der **Textur**-Reliefschicht. Heißt `reliefTex`, nicht `relief`: `relief` ist im Runner
   seit V6 die **Feldkante** (Licht oben, Schatten unten je Spielfeld). Zwei Dinge, zwei Namen —
   ein Wort für zwei Regler ist der Anfang eines Fehlers, den niemand findet. */
let RELIEF_A=0.55;

function load(u){return new Promise((res,rej)=>{const i=new Image();i.crossOrigin='anonymous';
  i.onload=()=>res(i);i.onerror=()=>rej(new Error(u));i.src=u;});}
function rnd(seed){let a=seed|0;return()=>{a=(a+0x6D2B79F5)|0;
  let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;
  return((t^(t>>>14))>>>0)/4294967296;};}

/* Ein `*_alpha`-Blatt ist eine **Graustufen-Maske ohne Transparenz** — wer es als Bild zeichnet,
   malt helle Quadrate auf die Karte (genau der Fehler in gp-v1.0). Also: Helligkeit wird Deckung,
   die Farbe kommt von uns. Polarität gemessen statt geraten — ein Decal bedeckt weniger als die
   halbe Fläche, also ist die häufigere Helligkeit der Hintergrund. */
function maskToDecal(img,ink){
  /* 128 statt 256: ein Decal wird mit 22–70 px gezeichnet (`sz = N*(0,35…1,1)`), die zweite
     Hälfte der Auflösung hat nie jemand gesehen — sie stand nur im Speicher. Und das Rücklesen darf
     scheitern: geht es nicht, fällt das Decal aus, nicht das Bild (Befund 9.8.,
     `NS_ERROR_OUT_OF_MEMORY` mitten im Backvorgang — danach lief die Spielschleife gar nicht mehr an). */
  const s=Math.min(128,img.width||128);
  const c=document.createElement('canvas');c.width=c.height=s;
  const x=c.getContext('2d',{willReadFrequently:true});
  x.drawImage(img,0,0,s,s);
  let d;
  try{d=x.getImageData(0,0,s,s);}
  catch(e){console.warn('[ground] Decal übersprungen (Speicher):',e.name);return null;}
  const p=d.data;
  let sum=0;
  for(let i=0;i<p.length;i+=4)sum+=(p[i]*0.299+p[i+1]*0.587+p[i+2]*0.114);
  const mean=sum/(p.length/4), inv=mean>128;   // helles Blatt = Form ist dunkel
  const ir=parseInt(ink.slice(1,3),16),ig=parseInt(ink.slice(3,5),16),ib=parseInt(ink.slice(5,7),16);
  for(let i=0;i<p.length;i+=4){
    const l=(p[i]*0.299+p[i+1]*0.587+p[i+2]*0.114)/255;
    p[i]=ir;p[i+1]=ig;p[i+2]=ib;
    p[i+3]=Math.round(255*(inv?1-l:l));
  }
  x.putImageData(d,0,0);
  return c;
}

/* Nahtlos kacheln — **Halbversatz mit Kreuzblende am Rand** (v10-S1e, 9.8.).

   Zwei Fehlversuche liegen hinter dieser Fassung, beide am Bild widerlegt:
     1. Rechten Streifen mit Verlauf über die LINKE Kante legen (bis v9). Danach ist Spalte 0 =
        Quelle(size−F), die rechte Kante bleibt Quelle(size): beim Kacheln stoßen zwei verschiedene
        Werte aufeinander. Die Kante war weichgezeichnet, nicht geschlossen — das Raster blieb.
     2. Spiegelkachel (v10-S1d). Mathematisch nahtlos, aber vier gespiegelte Quadranten ergeben eine
        Rorschach-Figur mit zwei Symmetrieachsen. Georg: »KISS, aber nicht lazy.« Richtig.

   Der saubere Weg ist der klassische: die Kachel um die **Hälfte versetzt** kopieren. Der Versatz
   schiebt die schlechte Kante der Quelle in die Mitte und holt dafür INNENMATERIAL an den Rand.
   Geblendet wird nur in einem Band von 12 % um die Kanten, und zwar in beide Richtungen getrennt
   (vier versetzte Kopien, Gewichte f(x)·f(y) mit f=1 innen, 0 an der Kante):
     · am Rand zählt allein die versetzte Kopie — deren Inhalt ist dort stetig, also schließt die
       Kachel exakt gegen sich selbst;
     · in der Mitte zählt allein das Original — dort bleibt das Korn scharf;
     · die Naht der versetzten Kopie liegt genau da, wo ihr Gewicht null ist.
   Kein Spiegel, keine Achse, keine Behauptung: nur der Randstreifen ist eine Überblendung, und der
   ist 12 % breit. Gerechnet wird das **einmal je Textur im Backvorgang**, nicht in der Zeichenkette. */
/* **Ohne Rücklesen.** Zwei bezahlte Anläufe stecken in dieser Zeile: die erste Fassung rechnete die
   Blende pixelweise (`getImageData` + Kopie, 512² je Textur) und lief in `bake()` — und `bake()`
   läuft je Bild, solange `reliefSettled` den Kachel-Cache sperrt. Ergebnis: `NS_ERROR_OUT_OF_MEMORY`,
   gemeldet drei Funktionen später im Decal, das Spiel startete seine Schleife nie.
   **Wer knapp am Speicherdeckel arbeitet, sieht den Verursacher nie im Stacktrace.**
   Dieselbe Mathematik geht ohne einen einzigen gelesenen Pixel: die versetzte Kopie wird mit einem
   Verlauf maskiert (`destination-in`) und darübergelegt. Zwei Durchgänge, x und y, sechs
   `drawImage`, zwei Verläufe — und die Gewichte sind exakt dieselben f(x)·f(y) wie vorher, weil
   Alpha-Blenden nichts anderes ist. Die Kratzfläche liegt im Modul und wird wiederverwendet. */
let einmalig=new WeakMap(), kratz=null;
function kratzFlaeche(size){
  if(!kratz||kratz.width!==size){kratz=document.createElement('canvas');kratz.width=kratz.height=size;}
  return kratz;
}
// Alpha 1 an den Kanten, 0 im Inneren — das Gegenstück zu f, in zwei Stufen weich gemacht
function randMaske(ctx,size,F,waagerecht){
  const g=waagerecht?ctx.createLinearGradient(0,0,size,0):ctx.createLinearGradient(0,0,0,size);
  const q=F/size;
  g.addColorStop(0,'rgba(0,0,0,1)');
  g.addColorStop(q*0.45,'rgba(0,0,0,.72)');
  g.addColorStop(q,'rgba(0,0,0,0)');
  g.addColorStop(1-q,'rgba(0,0,0,0)');
  g.addColorStop(1-q*0.45,'rgba(0,0,0,.72)');
  g.addColorStop(1,'rgba(0,0,0,1)');
  return g;
}
function seamless(img,size){
  const c0=einmalig.get(img);
  if(c0&&c0.size===size)return c0.out;
  const out=document.createElement('canvas');out.width=out.height=size;
  const o=out.getContext('2d');
  o.imageSmoothingQuality='high';
  o.drawImage(img,0,0,size,size);
  const h=size>>1, F=Math.max(8,Math.round(size*0.12));
  const s=kratzFlaeche(size), sx=s.getContext('2d');
  for(const waagerecht of [true,false]){
    sx.setTransform(1,0,0,1,0,0);
    sx.globalCompositeOperation='source-over';
    sx.clearRect(0,0,size,size);
    // die um die Hälfte versetzte Kopie, umlaufend (zwei Anschnitte decken die ganze Fläche)
    if(waagerecht){sx.drawImage(out,-h,0);sx.drawImage(out,size-h,0);}
    else{sx.drawImage(out,0,-h);sx.drawImage(out,0,size-h);}
    sx.globalCompositeOperation='destination-in';
    sx.fillStyle=randMaske(sx,size,F,waagerecht);
    sx.fillRect(0,0,size,size);
    sx.globalCompositeOperation='source-over';
    o.drawImage(s,0,0);
  }
  einmalig.set(img,{size,out});
  return out;
}

/* Eine Biom-Kachel: Grundton · Textur (überlagert, entsättigt zum Ton) · Decals · Feldkanten.
   Alles gebacken — pro Frame bleibt ein fillRect. */
function bake(def,seed,neutral,flat){
  const c=document.createElement('canvas');c.width=c.height=TILE;
  const x=c.getContext('2d');
  /* Im Korn-Modus liegt die Kachel als soft-light auf der Pixelkunst. Ein satter Grundton kippt
     dort die Farbe (gp-v1.1 machte das Gras giftig gelbgrün), also wird er zur Neutralen gezogen:
     #808080 ist für soft-light das Nichts. Die Kachel gibt dann Korn und einen Hauch Ton — die
     Farbe gehört weiter dem Blatt darunter. Im Wash-Modus deckt sie, dort gilt der volle Ton. */
  x.fillStyle=neutral?mix(def.tint,'#808080',0.72):def.tint;
  x.fillRect(0,0,TILE,TILE);
  const im=imgs[def.tex];
  if(im){
    const s=seamless(im,TILE);
    x.save();
    x.globalAlpha=def.a;
    x.globalCompositeOperation='overlay';   // Korn ohne den Ton zu verlieren
    x.drawImage(s,0,0);
    x.globalCompositeOperation='soft-light';
    x.globalAlpha=def.a*0.5;
    x.drawImage(s,0,0);
    x.restore();
  }
  /* **Das Relief.** Bis V8-S3 lag hier nur das Diffuse — und bei Gras hat das Korn 2,57 von 255,
     bei `a: 0.30` also nichts. Georg sah eine flache Welt und dachte, die Texturen seien weg; sie
     waren nie sichtbar. Das Relief steckt je Material in einer anderen Karte (Gras: normal 18,75,
     Waldboden: ao 23,68, Sand: diffuse 16,98), deshalb wählt `OW_RELIEF` sie **gemessen**.
     Gezeichnet als `overlay` — die Leinwand ist entfärbt und liegt um 128, moduliert also nur
     Helligkeit. Fehlt sie, bleibt es beim Diffuse: auf »läuft« gaten, nie auf »existiert«. */
  const rl=reliefs[def.tex];
  if(rl&&rl.canvas&&RELIEF_A>0){
    const rs=seamless(rl.canvas,TILE);
    x.save();
    x.globalCompositeOperation='overlay';
    x.globalAlpha=Math.min(1,RELIEF_A*(def.relief==null?1:def.relief));
    x.drawImage(rs,0,0);
    x.restore();
  }
  // Decals: gestreut, gedreht, klein. Sie tragen das Interesse, nicht die Textur — aber sie dürfen
  // die Pixelkunst nicht überschreiben, also klein und schwach (Lehre gp-v1.1).
  const R=rnd(seed);
  const ink=def.ink||'#2b2118';
  for(let i=0;i<(def.dn||8);i++){
    const nm=def.decals[i%def.decals.length],src=imgs['__d_'+nm];
    if(!src)continue;
    const di=masks[nm+ink]||(masks[nm+ink]=maskToDecal(src,ink));
    if(!di)continue;
    const sz=N*(0.35+R()*0.75),px=R()*TILE,py=R()*TILE;
    x.save();
    x.globalAlpha=0.05+R()*0.11;
    x.translate(px,py);x.rotate(R()*6.283);
    x.drawImage(di,-sz/2,-sz/2,sz,sz);
    x.restore();
  }
  /* Licht oben, Schatten unten — je Spielfeld, 3 px. Das ist die 2D-Übersetzung von Georgs
     Voxel-Boden: ein Feld ist ein Block, also hat es eine Oberkante im Licht. Eine Lichtrichtung
     für die ganze Welt (§21.2), abgelesen am gebackenen Tiny-Swords-Schatten: von oben links. */
  /* Licht oben, Schatten unten — je Spielfeld. Das ist die 2D-Übersetzung von Georgs Voxel-Boden.
     **Im Malmodus abgeschaltet** (`flat`): dort gibt es keine Felder, und die Kanten würden als
     waagerechte Linien durch eine Fläche laufen, die gerade deshalb gebaut wurde, damit man kein
     Raster sieht (Georg, 2026-08-07: »keine künstlichen Pixel/Kanten«). */
  if(!flat)for(let ty=0;ty<TILE/N;ty++){
    const yy=ty*N;
    let g=x.createLinearGradient(0,yy,0,yy+3);
    g.addColorStop(0,'rgba(255,250,235,.07)');g.addColorStop(1,'rgba(255,250,235,0)');
    x.fillStyle=g;x.fillRect(0,yy,TILE,3);
    g=x.createLinearGradient(0,yy+N-4,0,yy+N);
    g.addColorStop(0,'rgba(28,22,14,0)');g.addColorStop(1,'rgba(28,22,14,.09)');
    x.fillStyle=g;x.fillRect(0,yy+N-4,TILE,4);
  }
  /* Korn-Modus: soft-light darf **nur Helligkeit** modulieren, sonst verschiebt es den Farbton —
     Georgs Befund »giftig gelbgrün«. Also wird die Kachel entfärbt und auf Mittel 128 gezogen:
     dann färbt die Schicht nichts, sie körnt nur, und die Farbe gehört weiter der Pixelkunst. */
  if(neutral){
    let d=null;
    try{d=x.getImageData(0,0,TILE,TILE);}catch(e){
      console.warn('[ground] Korn-Modus ohne Entfärbung (Speicher):',e.name);d=null;}
    if(d){
    const p=d.data;
    let sum=0;
    for(let i=0;i<p.length;i+=4){
      const l=p[i]*0.299+p[i+1]*0.587+p[i+2]*0.114;
      p[i]=p[i+1]=p[i+2]=l;sum+=l;
    }
    const off=128-sum/(p.length/4);
    for(let i=0;i<p.length;i+=4){
      const v=Math.max(0,Math.min(255,p[i]+off));
      p[i]=p[i+1]=p[i+2]=v;
    }
    x.putImageData(d,0,0);
    c._off=Math.round(off);
    }
  }
  return c;
}

async function ready(list){
  const names=new Set(),dec=new Set();
  const defs=(list||Object.keys(BIOMES)).map(k=>BIOMES[k]).filter(Boolean).concat([SAND]);
  for(const d of defs){names.add(d.tex);for(const n of d.decals)dec.add(n);}
  const jobs=[];
  for(const n of names)if(!imgs[n])jobs.push(load(diffuse(n)).then(i=>imgs[n]=i).catch(()=>null));
  for(const n of dec)if(!imgs['__d_'+n])jobs.push(load(decal(n)).then(i=>imgs['__d_'+n]=i).catch(()=>null));
  await Promise.all(jobs);
  /* Relief je Material — nach den Bildern, weil es dieselben Namen braucht. Ein Fehlschlag ist
     erlaubt und wird gezählt, nicht verschwiegen. */
  if(window.OW_RELIEF){
    const mats=[...names];
    const t0=performance.now();
    const rr=await Promise.all(mats.map(n=>
      OW_RELIEF.build(n,512,{gain:1}).catch(()=>null)));
    mats.forEach((n,i)=>{if(rr[i])reliefs[n]=rr[i];});
    const kinds={};
    for(const n of mats)if(reliefs[n])kinds[reliefs[n].kind]=(kinds[reliefs[n].kind]||0)+1;
    /* **Die kalte Gesamtdauer gehört ins Log**, nicht nur die je Material. Am 8.8. hat die Abnahme
       36 Sekunden gemessen, während hier 171–535 ms standen — warme Zahlen. Und solange das Relief
       nicht steht, sperrt `reliefSettled` den Kachel-Cache: die Welt läuft flach und backt jede
       Kachel neu (gemessen 640 Backvorgänge gegen 8 im Cache). */
    console.log('[ground] Relief:',Object.keys(reliefs).length,'von',mats.length,
      '· Karten',Object.keys(kinds).map(k=>k+'×'+kinds[k]).join(' · ')||'—',
      '· gesamt',Math.round(performance.now()-t0)+' ms (kalt)');
  }
  reliefSettled=true;
  /* Kacheln, die ohne Relief gebacken wurden, sind jetzt falsch — wegwerfen statt behalten.
     Dieselbe Regel wie beim Textur-Cache: ein Ergebnis aus leerem Vorrat hält man nicht für das
     Ergebnis. */
  for(const k of Object.keys(tiles))delete tiles[k];
  const ok=Object.keys(imgs).length;
  console.log('[ground] Blätter geladen:',ok,'von',names.size+dec.size,
    '· Biome',defs.length-1,'· Kachel',TILE+'px = '+(TILE/N)+'×'+(TILE/N)+' Felder');
  return ok;
}

function mix(a,b,f){
  const p=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const A=p(a),B=p(b);
  return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*f).toString(16).padStart(2,'0')).join('');
}

/* **Spiegelkachel gegen die Naht** (V9-B7, Georgs KISS-Wunsch). Die Texturen aus dem Asset-Ordner
   sind nicht nahtlos: bei `repeat` trifft rechte Kante auf linke, und das sieht man als Raster — bei
   Gras und Papier am stärksten. Der billige und immer funktionierende Trick: die Kachel in eine 2×2
   legen und die Nachbarn **spiegeln**. Dann ist jede Kante mit sich selbst benachbart, und die Naht
   verschwindet mathematisch, nicht näherungsweise.
   Preis: eine Spiegelachse im Muster (bei Korn und Fleck unsichtbar) und vierfache Kachelfläche —
   die liegt aber im Cache, wird also einmal gebacken und nicht je Bild. */
const spiegelCache=new WeakMap();
function spiegeln(t){
  if(!t||!t.width)return t;
  /* **Einmal spiegeln, nicht je Bild.** Der Kachel-Cache oben greift bewusst erst, wenn die Texturen
     wirklich geladen sind (»auf läuft gaten«) — bis dahin backt jeder Frame neu, und das Spiegeln
     kam vier drawImage-Aufrufe teuer obendrauf: gemessen 64 → 30 fps. Der eigene Cache hängt am
     Quell-Canvas, lebt also genau so lange wie die Kachel selbst.
     **Gleiche Endgröße, nicht doppelte:** eine 2×2 in doppelter Kachelgröße (1024) kostete 44 ms je
     Bild — `createPattern` zahlt für die Fläche. Also wird die Quelle auf die Hälfte gelegt und
     daraus die 2×2 gebaut: dieselbe Kachel wie vorher, nur nahtlos, Korn halb so groß. */
  const c=spiegelCache.get(t);if(c)return c;
  const w=t.width,h=t.height,hw=Math.max(1,w>>1),hh=Math.max(1,h>>1);
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;
  const g=cv.getContext('2d');
  g.imageSmoothingQuality='high';
  g.drawImage(t,0,0,w,h,0,0,hw,hh);
  g.save();g.translate(w,0);g.scale(-1,1);g.drawImage(t,0,0,w,h,0,0,hw,hh);g.restore();
  g.save();g.translate(0,h);g.scale(1,-1);g.drawImage(t,0,0,w,h,0,0,hw,hh);g.restore();
  g.save();g.translate(w,h);g.scale(-1,-1);g.drawImage(t,0,0,w,h,0,0,hw,hh);g.restore();
  spiegelCache.set(t,cv);
  return cv;
}

function tileFor(key,seed,neutral,flat){
  const k=key+':'+(seed|0)+(neutral?'|g':'')+(flat?'|f':'');
  if(tiles[k])return tiles[k];
  const t0=performance.now(); tiles[k];
  const def=key==='__sand'?SAND:BIOMES[key];
  if(!def)return null;
  const t=bakeSicher(def,(seed|0)||7,neutral,flat);
  /* **Nur cachen, wenn die Texturen wirklich da sind.** Sonst backt der erste Aufruf eine flache
     Kachel aus dem Grundton allein — und die bleibt für immer liegen. Im Chat gewinnt das Laden
     das Rennen, im Standalone nicht: Georg sah am 7.8. eine Welt ganz ohne Korn, während die
     Sprites daneben längst da waren. Ein Ergebnis aus leerem Vorrat hebt man nicht auf
     (Hausregel: auf »läuft« gaten, nie auf »existiert«). */
  bakes++;bakeMs+=performance.now()-t0;
  /* **Der Naht-Fix ist zurückgenommen** (V9-B7, 9.8.). Idee war eine 2×2-Spiegelkachel: mathematisch
     nahtlos, egal welche Textur. Drei Anläufe, drei Messungen, jeder schlechter als der Stand ohne:
       · 2×2 in doppelter Größe (1024) → 44 ms je Bild; `createPattern` zahlt für die Fläche.
       · halbe Quelle, gleiche Endgröße → 30 fps; das Spiegeln lief je Bild mit.
       · Cache am Canvas-Objekt → 20 fps; jeder Backvorgang liefert ein NEUES Canvas, der Schlüssel
         traf nie.
     Gegen 64 fps ohne. Eine sichtbare Naht ist Kosmetik, 47 fps sind es nicht — also bleibt die
     Naht, bis der Fix an der richtigen Stelle sitzt: **beim Backen der Textur, einmal, nicht in der
     Zeichenkette**. Das gehört in `bake()` und ist ein eigener Slice mit ruhigem Kopf.
     `spiegeln()` bleibt als Funktion stehen und wird nicht gerufen. */
  if(Object.keys(imgs).length&&reliefSettled&&t&&t._voll)tiles[k]=t;
  return t;
}

/* **Eine Kachel darf misslingen, die Bildschleife nicht.** Am 9.8. hat ein `NS_ERROR_OUT_OF_MEMORY`
   mitten im Backvorgang die ganze `draw()` geworfen — und weil `draw()` in der rAF-Schleife hängt,
   lief das Spiel nie an: schwarzes Bild, `time` blieb 0, keine einzige Kachel. Ein Korn ist kein
   Grund, ein Spiel nicht zu starten. Scheitert das Backen, kommt der Grundton allein zurück, und
   weil er ohne `_voll`-Marke kommt, landet er auch nicht im Cache: der nächste Versuch darf es
   wieder richtig machen. */
function bakeSicher(def,seed,neutral,flat){
  try{const c=bake(def,seed,neutral,flat);if(c)c._voll=true;return c;}
  catch(e){
    console.warn('[ground] Kachel notgedämpft (',e.name,') — Grundton statt Textur');
    const c=document.createElement('canvas');c.width=c.height=TILE;
    const x=c.getContext('2d');
    x.fillStyle=neutral?mix(def.tint,'#808080',0.72):def.tint;
    x.fillRect(0,0,TILE,TILE);
    return c;
  }
}

/* Über den fertigen Boden legen. `t` ist die EINE Uhr von außen (§28.3): die Deckung atmet, und
   `life` skaliert **nur die Amplitude** — nicht die Schicht. Wer die Schicht weghaben will, zeichnet
   sie nicht; wer Ruhe will, dreht `life` auf 0. Zwei Dinge, zwei Regler.

   Zwei Modi, und der Unterschied ist der Grund, warum gp-v1.0 flach aussah:
     `grain` — die Kachel liegt als **overlay** auf. Die Tiny-Swords-Pixelkunst bleibt lesbar, wir
               geben nur Ton und Korn dazu. Für die Basisinsel: dort ist das gute Blatt schon da.
     `wash`  — die Kachel deckt. Für Zonen, denn ein Palettentausch (Thronsaal) muss übermalen.
   Wer alles als Wash zeichnet, löscht das, wofür er Tiny Swords gekauft hat. */
function draw(ctx,key,rect,t,life,seed,mode){
  const grain=mode==='grain';
  const tl=tileFor(key,seed,grain);
  if(!tl)return false;
  const amp=life==null?1:life;
  const puls=1+0.05*amp*Math.sin((t||0)*0.5+(seed||0)*0.7);
  ctx.save();
  if(grain){
    ctx.globalCompositeOperation='soft-light';
    ctx.globalAlpha=Math.min(1,0.62*puls);
  }else{
    ctx.globalAlpha=Math.min(1,0.86*puls);
  }
  ctx.fillStyle=ctx.createPattern(tl,'repeat');
  ctx.fillRect(rect.x,rect.y,rect.w,rect.h);
  ctx.restore();
  return true;
}

window.OW_GROUND={version:'gp-v1.8',BIOMES,SAND,TILE,ready,draw,tileFor,maskToDecal,
  get reliefTex(){return RELIEF_A;},
  set reliefTex(v){const n=Math.max(0,Math.min(1,+v||0));
    if(n===RELIEF_A)return;RELIEF_A=n;
    for(const k of Object.keys(tiles))delete tiles[k];},   // Regler ändert die Kachel, also neu backen
  reliefReport(){return Object.keys(reliefs).map(n=>({tex:n,kind:reliefs[n].kind,
    sd:reliefs[n].sd,diffuse:reliefs[n].diffuseSd,out:reliefs[n].grainOut}));},
  grainOf(key,seed,neutral,flat){
    const t=tileFor(key,seed,neutral,flat);
    return t&&window.OW_RELIEF?+OW_RELIEF.grain(t).toFixed(2):null;},
  bakeReport(){return {bakes,ms:+bakeMs.toFixed(1),
    msJeBacken:bakes?+(bakeMs/bakes).toFixed(2):null,
    imCache:Object.keys(tiles).length};},
  get loaded(){return Object.keys(imgs).length;},
  note:'Overlay über dem Autotiling: Grundton + Textur + **Relief** + Decals + Feldkanten, in eine '+
       '512er-Kachel gebacken. Ein fillRect je Frame. Das Relief kommt aus der Karte, die es trägt '+
       '(je Material gemessen), nicht aus dem Diffuse — das ist bei Gras 2,57 von 255 flach. '+
       'Zwei Modi: grain (overlay, Pixelkunst bleibt) und wash (deckend, für Palettentausch).'};
})();
