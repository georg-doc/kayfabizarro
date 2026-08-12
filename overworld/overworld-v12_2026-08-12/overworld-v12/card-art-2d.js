/* card-art-2d.js — das echte Kartenbild aus dem Deck-PDF, für 2D (V9-B2, art-v1.0)
   ---------------------------------------------------------------------------------
   Der 3D-Weg steht seit S71 in `cardbuilder/kfb-card-builder.js` und ist die SSOT für Karten.
   Er verlangt aber `THREE` und liefert eine `THREE.Group` — im Overworld gibt es keine Szene,
   nur ein Canvas. Dieses Modul ist deshalb **nicht** ein zweiter Builder, sondern der schmale
   Ausschnitt, der ohne 3D auskommt: Registry lesen · PDF-Seite rendern · Quadranten schneiden.
   Blatt, Silhouette und Tusche bleiben, wo sie hingehören (`card-ink-2d.js`, Kanon v2).

   Der Vertrag ist derselbe wie im Builder, absichtlich Zeile für Zeile:
     Seite   = coverOffset + 1 + floor((n-1)/4)      vier Karten je Seite
     Quadrant= (n-1) % 4                             links oben · rechts oben · links unten · …
     Zelle   = (w - gapX)/2 × (h - gapY)/2           SECHS Zahlen, nicht vier

   **Warum sechs Zahlen:** zwischen den Zellen liegt Illustration (bei `forget_utopia` 0,135 der
   Seitenbreite — BLÖDSINN! und die Kraken). Ein Raster ohne Abzug nimmt den Nachbarn mit ins Bild.
   Die Zahlen sind gemessen, nicht geraten: `overworld/card-grids.json` (Synthese vom 26.7.).
   Ein Deck ohne Messung bekommt die ganze Seite und sagt es in der Konsole — geraten wird nicht.

   Fällt irgendetwas aus (keine Verbindung, Deck nicht im Manifest, pdf.js nicht erreichbar),
   ist die Antwort `null` und das Textblatt bleibt stehen. Auf »läuft« gaten, nie auf »existiert«. */
(function(){
'use strict';

const PDFJS='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs';
const PDFJS_WORKER='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';
const COLS=2,ROWS=2;

let lib=null,reg=null,grids=null,libTried=false;
/* Der eigene Pfad, EINMAL beim Laden festgehalten. `document.baseURI` ist die Seite, nicht der
   Modulordner: die Rasterdatei wurde damit gegen die Projektwurzel aufgelöst, das Ergebnis war
   eine 404-Seite, und `JSON.parse` sagte »unexpected keyword«. Gemessen und behoben, V9-B3. */
const SELF=(document.currentScript&&document.currentScript.src)||document.baseURI;
const docs=new Map(),pageCache=new Map(),artCache=new Map();
let busy=false;const queue=[];
const stats={pages:0,crops:0,misses:0};

const base=()=>(window.OW_SRC?window.OW_SRC.kfb(''):'');

async function ensureLib(){
  if(lib)return lib;
  if(libTried)return null;
  libTried=true;
  try{
    const m=await import(PDFJS);
    m.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
    lib=m;return m;
  }catch(e){console.warn('[card-art] pdf.js nicht erreichbar:',e.message);return null;}
}

async function ensureReg(){
  if(reg)return reg;
  try{
    const r=await(await fetch(base()+'index.json')).json();
    reg={};for(const d of (r.decks||[]))reg[d.packId]=d;
  }catch(e){console.warn('[card-art] Registry:',e.message);reg={};}
  return reg;
}

/* Das Raster: erst das Manifest (falls es die Zahlen eines Tages führt), dann die gemessene
   Tabelle, dann die ganze Seite. Reihenfolge ist der Vertrag aus card-grids.json (_note). */
async function ensureGrids(){
  if(grids)return grids;
  try{
    const j=await(await fetch(new URL('./card-grids.json',SELF).href)).json();
    grids=j.grids||{};
  }catch(e){console.warn('[card-art] card-grids.json:',e.message);grids={};}
  return grids;
}
function gridFor(rd,packId){
  const g=(rd&&rd.cardGrid)||((grids&&grids[packId])||{}).cardGrid;
  if(!g){
    /* Kein gemessenes Raster. **Die ganze Seite wäre der schlechtere Fehler** — sie nimmt Schnittmarken,
       Kopfband und die halbe Nachbarkarte mit ins Bild. Also der benannte Rückfallwert aus
       card-grids.json (`_fallback_vorschlag_coworker`, 5 % Rand) mit einem Zwischenraum in der
       Größenordnung der drei gemessenen Decks (0,022 · 0,090 · 0,135 → 0,065). Das ist geraten und
       sagt es: `measured:false` steht in der Konsole, und 20 Sekunden mit tools/cardgrid-pick.html
       machen daraus eine Zahl. */
    console.warn('[card-art] kein gemessenes Raster für',packId,'— Rückfallwert (geraten). '+
      'Messen: tools/cardgrid-pick.html, dann overworld/card-grids.json ergänzen');
    return{x:0.05,y:0.05,w:0.90,h:0.90,gapX:0.065,gapY:0.020,measured:false};
  }
  return{x:g.x||0,y:g.y||0,w:g.w!=null?g.w:1,h:g.h!=null?g.h:1,
    gapX:g.gapX||0,gapY:g.gapY||0,measured:true};
}

async function renderPage(url,num,targetW){
  const key=url+'#'+num+'@'+targetW;
  if(pageCache.has(key))return pageCache.get(key);
  const L=await ensureLib();if(!L)return null;
  let doc=docs.get(url);
  if(!doc){doc=await L.getDocument({url}).promise;docs.set(url,doc);}
  if(num<1||num>doc.numPages){console.warn('[card-art] Seite',num,'von',doc.numPages,'— außerhalb');return null;}
  const page=await doc.getPage(num);
  const scale=targetW/page.getViewport({scale:1}).width;
  const vp=page.getViewport({scale});
  const cv=document.createElement('canvas');
  cv.width=Math.ceil(vp.width);cv.height=Math.ceil(vp.height);
  await page.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;
  stats.pages++;
  pageCache.set(key,cv);
  return cv;
}

async function crop(card,res){
  await ensureReg();await ensureGrids();
  const pid=card&&card.packId;
  const rd=pid?reg[pid]:null;
  if(!rd||!rd.pdf){stats.misses++;return null;}
  const off=rd.coverOffset!=null?rd.coverOffset:1;
  const n=card.n|0;if(n<1)return null;
  const num=off+1+Math.floor((n-1)/4);
  const qi=(n-1)%4;
  const pg=await renderPage(base()+rd.pdf,num,res||1400);
  if(!pg)return null;
  const G=gridFor(rd,pid);
  const cw=Math.floor(pg.width*(G.w-G.gapX)/COLS);
  const ch=Math.floor(pg.height*(G.h-G.gapY)/ROWS);
  if(cw<8||ch<8)return null;
  const sx=Math.round(pg.width*G.x+(qi%COLS)*(cw+pg.width*G.gapX));
  const sy=Math.round(pg.height*G.y+Math.floor(qi/COLS)*(ch+pg.height*G.gapY));
  const cv=document.createElement('canvas');cv.width=cw;cv.height=ch;
  cv.getContext('2d').drawImage(pg,sx,sy,cw,ch,0,0,cw,ch);
  stats.crops++;
  return{canvas:cv,ar:cw/ch,page:num,quad:qi,measured:G.measured};
}

/* Eine Warteschlange mit Wachhund. pdf.js rendert intern über requestAnimationFrame: wechselt
   der Spieler während eines Renders den Tab, settelt das Versprechen NIE. Ohne diesen Timer
   bliebe `busy` für die Sitzung hängen und die Pipeline wäre tot, ohne eine Zeile im Log.
   Der Fehler ist im 3D-Builder bezahlt worden (S71) — hier steht er von Anfang an drin. */
function pump(){
  if(busy||!queue.length)return;
  const job=queue.shift();busy=true;
  let settled=false;
  const finish=v=>{if(settled)return;settled=true;busy=false;job.done(v);setTimeout(pump,0);};
  const wd=setTimeout(()=>{console.warn('[card-art] Wachhund: Render hängt (Tab inaktiv?)');finish(null);},20000);
  crop(job.card,job.res).then(v=>{clearTimeout(wd);finish(v);})
    .catch(e=>{clearTimeout(wd);console.warn('[card-art]',e.message);finish(null);});
}

function art(card,opt){
  opt=opt||{};
  if(!card||!card.packId||!(card.n>0))return Promise.resolve(null);
  const ck=card.packId+'#'+card.n;
  if(artCache.has(ck))return Promise.resolve(artCache.get(ck));
  return new Promise(res=>{
    queue.push({card,res:opt.res,done:v=>{artCache.set(ck,v);res(v);}});
    pump();
  });
}

/* Die ganze Deck-SEITE, nicht die Zelle (V9-B3). Der Terrain-Reader zeigt das Blatt als Blatt:
   vier Karten in einem 2×2, so wie es gedruckt aus dem Drucker kommt. */
async function pageOf(packId,num,res){
  await ensureReg();
  const rd=packId?reg[packId]:null;
  if(!rd||!rd.pdf)return null;
  try{return await renderPage(base()+rd.pdf,num,res||1200);}
  catch(e){console.warn('[card-art] Seite',num,e.message);return null;}
}
async function meta(packId){
  await ensureReg();await ensureGrids();
  const rd=packId?reg[packId]:null;
  if(!rd||!rd.pdf)return null;
  const off=rd.coverOffset!=null?rd.coverOffset:1;
  let pages=null;
  const doc=docs.get(base()+rd.pdf);
  if(doc)pages=doc.numPages;
  return{off,pages,grid:gridFor(rd,packId),cards:rd.cardCount||null};
}
/* Die Umkehrung des Adress-Vertrags. Steht hier, damit es sie nur EINMAL gibt:
   Seite = off+1+floor((n-1)/4)  ↔  n = (Seite-off-1)*4 + Quadrant + 1 */
const cardAt=(off,page,qi)=>(page-off-1)*4+qi+1;
const pageFor=(off,n)=>off+1+Math.floor((n-1)/4);

/* **Die Viertelseite** (V9-B4g, Georg: »statt einfach die entsprechende 2x2 ecke des PDFs in der
   aspect ratio der page zu zeigen!«). Genau das: Seite halbieren, Ecke nehmen, fertig. Kein
   `cardGrid`, kein `gapX`, keine Messung — und deshalb **nichts, was falsch sitzen kann**.
   Der Preis ist ein Streifen Papier und ein Schnipsel des Nachbarn am Rand; der Gewinn ist, dass die
   Karte NIE angeschnitten ist. Drei Anläufe mit sechs gemessenen Zahlen haben das nicht geschafft.
   Das gemessene Raster (`art()`) bleibt daneben stehen — es ist der Weg für das Blatt in der Hand,
   wo der Rand kein Papier sein darf. Zwei Werkzeuge, zwei Zwecke, beide benannt. */
async function quarter(card,res){
  await ensureReg();
  const pid=card&&card.packId;
  const rd=pid?reg[pid]:null;
  if(!rd||!rd.pdf)return null;
  const off=rd.coverOffset!=null?rd.coverOffset:1;
  const n=card.n|0;if(n<1)return null;
  const num=off+1+Math.floor((n-1)/4);
  const qi=(n-1)%4;
  const pg=await renderPage(base()+rd.pdf,num,res||1400);
  if(!pg)return null;
  const cw=Math.floor(pg.width/2),ch=Math.floor(pg.height/2);
  const sx=(qi%2)*cw,sy=((qi/2)|0)*ch;
  const cv=document.createElement('canvas');cv.width=cw;cv.height=ch;
  cv.getContext('2d').drawImage(pg,sx,sy,cw,ch,0,0,cw,ch);
  return{canvas:cv,ar:cw/ch,page:num,quad:qi,pageAR:pg.width/pg.height};
}

window.OW_ART={art,quarter,pageOf,meta,cardAt,pageFor,stats,version:'art-v1.2'};
console.log('[card-art] art-v1.2 — Viertelseite (roh) + gemessene Zelle · zwei Wege, zwei Zwecke');
})();
