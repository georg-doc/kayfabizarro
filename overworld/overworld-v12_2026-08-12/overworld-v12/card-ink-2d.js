/* KFB Overworld — KFB-Karte als 2D-Blatt (ci-v1.0, V5-S5)
   Die Karte im Spiel ist **dieselbe** Karte wie in 3D: der Kanon der Tuschekante wird importiert,
   nicht nachgebaut. Quelle: `skills/kfb-ink-canon.js` (Kanon-Version 2) + `skills/kfb-card-format.js`
   (`CARD_AR` — eine Zahl, ein Ort), gelesen über `OW_SRC` (also pages.dev; gemessen 2026-08-06:
   über die Rohadresse schlägt der ES-Import fehl, über den CDN kommt er sauber).

   Die Regel aus dem Kanon, die hier zählt: **Fläche und Tusche teilen EINE Kontur.** Der Clip für
   das Papier und das Band der Feder benutzen dieselbe Punktliste — zwei getrennt gerechnete
   Konturen ergeben zwei Kanten mit einer Lücke. Und: **Text zuerst, Bild später** (Builder-Regel 1) —
   dieses Modul malt das Textblatt; das Artwork aus dem Deck-PDF ist ein eigener Slice.

   Wer keine Verbindung hat, bekommt ein Blatt **ohne** Tusche und eine Warnung in der Konsole —
   keine selbstgebaute Jitter-Schleife. Eine erfundene Kante wäre schlimmer als keine. */
(function(){
'use strict';
const CREAM='#f2e8cf',INKT='#1f1a14',DIM='#6b5a42';
/* **Wie dick die Kartenfeder höchstens wird** (v10, Georg 9.8.: »die Outline-Max-Dicke der Cards
   sollte etwas geringer sein«). Der Kanon bleibt unangetastet — `drawInk` nimmt einen Faktor auf
   die Halbbreite entgegen, und der gehört dem Aufrufer. Eine Zahl, ein Ort: wer eine Karte malt
   (auch der Runner auf dem Blatt im Terrain), nimmt `OW_CARD.inkGain`. */
const INK_GAIN=0.82;
let ink=null,fmt=null,pending=null,tried=false;

function ready(){
  if(ink||tried&&!pending)return Promise.resolve(ink);
  if(pending)return pending;
  const S=window.OW_SRC,base=S?S.base():'https://kayfabizarro.pages.dev/';
  if(window.OW_PAPER&&OW_PAPER.fonts)OW_PAPER.fonts();
  /* **Lokal zuerst.** Bis zum 8.8. stand hier nur `base+'skills/…'` — also immer die Repo-Fassung,
     auch wenn daneben eine bearbeitete `cardbuilder/kfb-ink-canon.js` lag. Folge: eine Änderung am
     Kanon wirkte im Spiel nicht, ohne dass irgendetwas fehlschlug, und der Changelog behauptete das
     Gegenteil. Die Repo-Adresse bleibt als Fallback — für den Standalone-Export ist sie die
     richtige. */
  const canonTries=[
    new URL('./cardbuilder/kfb-ink-canon.js',location.href).href,
    base+'skills/kfb-ink-canon.js'];
  const importFirst=async list=>{
    let lastErr=null;
    for(const u of list){try{return await import(u);}catch(e){lastErr=e;}}
    throw lastErr||new Error('kein Kanon erreichbar');
  };
  pending=Promise.all([
    importFirst(canonTries),
    import(base+'skills/kfb-card-format.js').catch(()=>null),
    (document.fonts&&document.fonts.ready)||Promise.resolve()
  ]).then(([a,b])=>{
    ink=a;fmt=b;tried=true;
    console.log('[card-ink] Kanon v'+a.INK_CANON_VERSION,'· Presets',Object.keys(a.INK_PRESETS).join('/'),
      '· CARD_AR',ar(),fmt?'(aus kfb-card-format.js)':'(Fallback 1.74 — Format-Modul fehlt)');
    return ink;
  }).catch(e=>{tried=true;
    console.warn('[card-ink] Kanon nicht erreichbar — Blatt ohne Tusche:',e.message);return null;});
  return pending;
}
const ar=()=>(fmt&&fmt.CARD_AR)||1.74;

function wrap(g,text,maxW){
  const words=String(text||'').split(/\s+/),lines=[];let l='';
  for(const w of words){
    const t=l?l+' '+w:w;
    if(g.measureText(t).width>maxW&&l){lines.push(l);l=w;}else l=t;
  }
  if(l)lines.push(l);
  return lines;
}

/* Ein Blatt. Rückgabe: {canvas, ink:<Messung|null>, ar}. Hochkant, weil die Karte im Spiel steht
   statt zu liegen: `portrait:true` dreht das Sollformat, das Verhältnis bleibt die Kanon-Zahl. */
function draw(card,opt){
  opt=opt||{};
  const portrait=opt.portrait!==false;
  const long=Math.max(320,opt.size||880);
  const W=portrait?Math.round(long/ar()):long, H=portrait?long:Math.round(long/ar());
  const seed=(opt.seed==null?((card&&card.n)|0)+11:opt.seed)|0;
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;
  const g=cv.getContext('2d');
  const pts=ink?ink.contour('card',seed,W,H):null;
  g.save();
  if(pts){ink.pathOf(g,pts);g.clip();}
  // Papier: cremefarben mit einem Hauch Fleck — die Karte ist gedruckt, nicht gerendert
  g.fillStyle=CREAM;g.fillRect(0,0,W,H);
  const rg=g.createRadialGradient(W*0.34,H*0.22,0,W*0.5,H*0.5,Math.max(W,H)*0.82);
  rg.addColorStop(0,'rgba(255,252,240,.55)');rg.addColorStop(1,'rgba(120,96,60,.16)');
  g.fillStyle=rg;g.fillRect(0,0,W,H);
  const pad=Math.round(W*0.11);
  // Kopfzeile: Deck und Nummer, klein und ruhig — und **gekürzt**, nicht abgeschnitten
  g.fillStyle=DIM;g.textAlign='left';g.textBaseline='alphabetic';
  g.font=Math.round(W*0.038)+'px "Special Elite","Courier New",monospace';
  const head=(opt.deck||'KFB')+(card&&card.n?'  ·  #'+card.n:'');
  let ht=head;
  while(ht.length>6&&g.measureText(ht).width>W-2*pad)ht=ht.slice(0,-2);
  g.fillText(ht===head?head:ht+'…',pad,pad+W*0.03);
  // Titel + Lore als EIN Block, mittig gesetzt: das Blatt hat noch keinen Bildplatz (das Artwork
  // aus dem Deck-PDF ist ein eigener Slice) — also füllt keine Leerzeile die untere Hälfte.
  const tSize=Math.round(W*0.098);
  g.font=tSize+'px "Irish Grover","Special Elite",cursive';
  const tLines=wrap(g,card&&card.t||'Untitled',W-2*pad).slice(0,4);
  const lore=card&&(card.lore||card.l||card.text)||'';
  const lSize=Math.round(W*0.048);
  g.font=lSize+'px "Special Elite","Courier New",monospace';
  const lLines=lore?wrap(g,lore,W-2*pad).slice(0,9):[];
  const blockH=tLines.length*tSize*1.14+(lLines.length?lSize*0.9+lLines.length*lSize*1.42:0);
  let y=Math.max(pad+W*0.2,(H-blockH)/2+tSize*0.8);
  g.font=tSize+'px "Irish Grover","Special Elite",cursive';
  g.fillStyle=INKT;
  for(const line of tLines){g.fillText(line,pad,y);y+=tSize*1.14;}
  if(lLines.length){
    g.font=lSize+'px "Special Elite","Courier New",monospace';
    g.fillStyle='rgba(31,26,20,.86)';
    y+=lSize*0.9;
    for(const line of lLines){g.fillText(line,pad,y);y+=lSize*1.42;}
  }
  // Fußzeile: Beweisstück, kein Zahlenwert (Kanon: Karten sind keine Powers)
  g.font=Math.round(W*0.036)+'px "Special Elite","Courier New",monospace';
  g.fillStyle=DIM;g.fillText('evidence · cut & play',pad,H-pad*0.72);
  g.restore();
  let meas=null;
  if(pts){
    ink.drawInk('card',g,pts,W,H,seed,INK_GAIN);
    meas=ink.measureInk(pts,W,H,'card',seed);
  }
  return{canvas:cv,ink:meas,ar:ar(),w:W,h:H,seed};
}

/* Die Rückseite. Der Builder malt heute nur die Vorderseite (Bauanleitung §8) und im Repo liegt kein
   Rückseiten-Blatt — also wird sie hier gezeichnet: dasselbe Papier, dieselbe Kanon-Kontur, in der
   Mitte die Wortmarke. Kommt ein echtes Blatt ins Repo, ersetzt es diese Funktion. */
function back(opt){
  opt=opt||{};
  const portrait=!!opt.portrait;
  const long=Math.max(160,opt.size||620);
  const W=portrait?Math.round(long/ar()):long,H=portrait?long:Math.round(long/ar());
  const seed=(opt.seed==null?3:opt.seed)|0;
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;
  const g=cv.getContext('2d');
  const pts=ink?ink.contour('card',seed,W,H):null;
  g.save();
  if(pts){ink.pathOf(g,pts);g.clip();}
  g.fillStyle='#e8d9b4';g.fillRect(0,0,W,H);
  const rg=g.createRadialGradient(W*0.5,H*0.42,0,W*0.5,H*0.5,Math.max(W,H)*0.7);
  rg.addColorStop(0,'rgba(255,250,236,.5)');rg.addColorStop(1,'rgba(96,74,44,.22)');
  g.fillStyle=rg;g.fillRect(0,0,W,H);
  g.textAlign='center';g.textBaseline='middle';
  g.fillStyle='rgba(31,26,20,.9)';
  g.font=Math.round(H*0.2)+'px "Irish Grover","Special Elite",cursive';
  g.fillText('KFB',W/2,H*0.44);
  g.font=Math.round(H*0.075)+'px "Special Elite","Courier New",monospace';
  g.fillStyle='rgba(31,26,20,.6)';
  g.fillText('cut & play',W/2,H*0.63);
  g.restore();
  if(pts)ink.drawInk('card',g,pts,W,H,seed,INK_GAIN);
  return{canvas:cv,w:W,h:H,ink:pts?ink.measureInk(pts,W,H,'card',seed):null};
}

/* Das echte Kartenbild aufs fertige Blatt (V9-B2). Malt in DASSELBE Canvas, das `draw()` geliefert
   hat — die Enthüllung zeichnet ihre Quelle jeden Frame neu, also erscheint das Bild von selbst,
   sobald es da ist. Reihenfolge wie im Original: Kontur → Clip → Papier → Bild → Tusche.
   Die Kontur wird aus demselben `seed` geholt, sonst kriegt das Blatt eine zweite Silhouette. */
function paintArt(sheet,artCv){
  if(!sheet||!sheet.canvas||!artCv)return false;
  const cv=sheet.canvas,W=cv.width,H=cv.height,g=cv.getContext('2d');
  const seed=sheet.seed|0;
  const pts=ink?ink.contour('card',seed,W,H):null;
  g.save();
  if(pts){ink.pathOf(g,pts);g.clip();}
  g.fillStyle=CREAM;g.fillRect(0,0,W,H);
  /* Rand, damit das Bild die eigene Kontur nicht überklebt. Und **mittig eingelegt, nie `cover`**:
     `cover` schnitt bei Deck A 18 % der Zellhöhe weg — je 9 % oben und unten, und genau dort stehen
     Titel und LORE-Zeile (Kanon `fitCell`, cardbuilder/kfb-card-format.js). */
  const m=Math.round(Math.min(W,H)*0.055);
  const bw=W-2*m,bh=H-2*m;
  const k=Math.min(bw/artCv.width,bh/artCv.height);
  const w=artCv.width*k,h=artCv.height*k;
  g.imageSmoothingQuality='high';
  g.drawImage(artCv,m+(bw-w)/2,m+(bh-h)/2,w,h);
  g.restore();
  if(pts)ink.drawInk('card',g,pts,W,H,seed,INK_GAIN);
  return true;
}

window.OW_CARD={version:'ci-v1.3',ready,draw,back,paintArt,inkGain:INK_GAIN,
  get canon(){return ink;},get CARD_AR(){return ar();},
  note:'Blatt + Kanon-Tusche in 2D. Kontur EINMAL, Clip und Band teilen sie (Builder-Regel 4).'};
})();
