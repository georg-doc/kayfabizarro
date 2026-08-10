/* KFB Overworld — unit-loader (V2-S1)
   Die eine Wahrheit für Sprite-Sheets. Vereinheitlicht die zwei Formate des Repos
   (rowsheet: 192er-Raster mit Zeilen · strips: eine Datei je Animation, Frames horizontal)
   zu EINEM Unit-Objekt, das der Renderer ohne Fallunterscheidung zeichnen kann.

   Gemessen wird zur Laufzeit, nie geraten (Falle 1+2 aus dem Session-Cut v1):
   - Frames je Zeile  → probeRows  (Alpha-Probe im Zellinneren)
   - Frames im Streifen → probeStrip (Grenze gilt nur bei durchgängig transparenter Pixelspalte)
   - Fußlinie + Körperhöhe → probeBox (Bounding-Box der opaken Pixel im Idle-Frame 0)

   Größe ist eine Entscheidung, kein Zufall des Sheets: `sizeRel` (im Katalog, sonst nach Rolle)
   ist die Körperhöhe RELATIV zum Helden. Der Loader rechnet daraus den Zeichenmaßstab.
   Damit ist ein Minotaur groß, weil er groß sein soll — nicht, weil sein PNG größer ist. */
(function(){
'use strict';

const FPS={idle:7,run:10,attack:14,attack2:14,cast:12,hit:12,guard:9,guardIn:9,guardOut:9,
  dead:8,windup:10,recovery:10,row:9,swim:9};
// Körperhöhe relativ zum Helden, Vorgabe nach Rolle (Katalog darf je Einheit überschreiben)
const SIZE_ROLE={critter:0.72,melee:0.95,ranged:0.95,boss:1.7,hero:1};
const CELL=192;

function loadImg(url){return new Promise((res,rej)=>{const i=new Image();i.crossOrigin='anonymous';
  i.onload=()=>res(i);i.onerror=()=>rej(new Error('Ladefehler: '+url));i.src=url;});}

const ctxCache=new WeakMap();
function ctxOf(img){
  let c=ctxCache.get(img);
  if(c)return c;
  const cv=document.createElement('canvas');cv.width=img.width;cv.height=img.height;
  c=cv.getContext('2d',{willReadFrequently:true});c.drawImage(img,0,0);
  ctxCache.set(img,c);return c;
}

// Frames je Zeile eines Raster-Sheets zählen
function probeRows(img,cell){
  const cols=Math.floor(img.width/cell),rows=Math.floor(img.height/cell);
  const c=ctxOf(img),out=[];
  for(let r=0;r<rows;r++){let n=0;
    for(let col=0;col<cols;col++){
      const s=Math.floor(cell*0.5);
      const d=c.getImageData(col*cell+Math.floor(cell*0.25),r*cell+Math.floor(cell*0.25),s,s).data;
      for(let i=3;i<d.length;i+=64){if(d[i]>10){n=col+1;break;}}
    }
    out.push(n);
  }
  return out;
}

// Rahmenbreite eines Streifens — nur gültig, wenn JEDE Grenzspalte durchgängig transparent ist
function probeStrip(img){
  const c=ctxOf(img);
  const colClear=x=>{
    if(x<=0||x>=img.width)return false;
    const d=c.getImageData(x-1,0,2,img.height).data;
    for(let i=3;i<d.length;i+=4)if(d[i]>8)return false;
    return true;
  };
  for(const fw of [img.height,CELL,128,96,64]){
    if(!(fw>0&&img.width%fw===0))continue;
    const n=img.width/fw;
    if(n<2||n>16)continue;
    let ok=true;
    for(let k=1;k<n;k++)if(!colClear(k*fw)){ok=false;break;}
    if(ok)return{fw,frames:n};
  }
  return{fw:img.width,frames:1};
}
const stripCache=new Map();
function probeStripCached(img){
  if(!stripCache.has(img))stripCache.set(img,probeStrip(img));
  return stripCache.get(img);
}

/* Hat dieses Blatt einen GEBACKENEN Schatten? Gemessen wird am Fußband (unteres Sechstel des
   Körpers): ein gebackener Tiny-Swords-Schatten ist eine halbtransparente Fläche, ein CraftPix-Held
   ist dort vollständig deckend. Schwelle aus der Messung 2026-08-06 (§21): halbtransparenter Anteil
   ≥ 0,35 UND mittlere Deckung ≤ 200 → gebacken. Der Abstand der Messwerte war 0,50 (Goblin) gegen
   0,21 (Baum) gegen 0,00 (Rogue/Knight/Mage) — die Schwelle liegt in der Lücke, nicht im Auge. */
function probeShadow(img,sx,sy,sw,sh,box){
  if(!box)return null;
  /* Band = unteres **8 %** des Körpers (mind. 3 px). Gemessen 2026-08-06 an neun Blättern: bei 16 %
     verwässert der Körper das Ergebnis (Pig Rider 0,25 — die Beine des Schweins sind deckend), bei
     5 % liegt das Band unter dem Schatten (Spear Goblin fällt auf 0,24). Bei 8 % trennt es sauber:
     gebacken 0,44–1,00 (Deckung 69–174) gegen ohne 0,00–0,27 (Deckung 215–255). Die Schwelle sitzt
     in dieser Lücke — 0,35 und Deckung ≤ 200. */
  const band=Math.max(3,Math.round(box.h*0.08));
  const y0=Math.max(0,box.bottom-band);
  const d=ctxOf(img).getImageData(sx,sy+y0,sw,box.bottom-y0).data;
  let semi=0,opq=0,aSum=0;
  for(let i=3;i<d.length;i+=4){
    const a=d[i];
    if(a>8){opq++;aSum+=a;if(a<225)semi++;}
  }
  const semiShare=opq?semi/opq:0,alphaMean=opq?Math.round(aSum/opq):0;
  return{baked:semiShare>=0.35&&alphaMean<=200,
    semiShare:+semiShare.toFixed(3),alphaMean,band,pixels:opq};
}

/* **Wo steht die Figur?** (V5-S7d) Der Rahmen sagt es nicht: CraftPix legt die Figur nicht mittig
   ins 128er-Feld (Rogue −6 px, Mage +5 px gemessen), und wer den Rahmen als Standpunkt nimmt, hängt
   Schatten, Trefferpunkt und Kollision **neben** die Figur. Gemessen wird das **Fußband** (dasselbe
   untere 8 % wie beim Schattentest): dessen Mitte ist die Auflage. Nicht die Mitte des Körperkastens —
   ein erhobener Dolch oder ein Umhang zieht die quer, die Füße nicht. */
function probeFoot(img,sx,sy,sw,sh,box){
  if(!box)return null;
  const band=Math.max(3,Math.round(box.h*0.08));
  const y0=Math.max(0,box.bottom-band);
  const d=ctxOf(img).getImageData(sx,sy+y0,sw,box.bottom-y0).data;
  let minX=sw,maxX=-1;
  const rows=box.bottom-y0;
  for(let y=0;y<rows;y++){const o=y*sw*4;
    for(let x=0;x<sw;x++)if(d[o+x*4+3]>12){if(x<minX)minX=x;if(x>maxX)maxX=x;}}
  if(maxX<0)return null;
  return{cx:(minX+maxX+1)/2,w:maxX-minX+1,band};
}

// Bounding-Box der opaken Pixel eines Frames → Fußlinie (bottom) und Körperhöhe (h)
function probeBox(img,sx,sy,sw,sh){
  const d=ctxOf(img).getImageData(sx,sy,sw,sh).data;
  let minX=sw,maxX=-1,minY=sh,maxY=-1;
  for(let y=0;y<sh;y++){
    const rowOff=y*sw*4;
    for(let x=0;x<sw;x++){
      if(d[rowOff+x*4+3]>12){
        if(x<minX)minX=x;if(x>maxX)maxX=x;
        if(y<minY)minY=y;if(y>maxY)maxY=y;
      }
    }
  }
  if(maxY<0)return null;
  return{x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1,bottom:maxY+1,cx:(minX+maxX+1)/2};
}

// Zeilen-Zuordnung für Troop-Sheets (Knights: 8 Zeilen, Goblins: 5)
function rowMap(rows){
  const R=rows.length,m={idle:0,run:R>1?1:0};
  if(R>=8){m.side=[2,3];m.down=[4,5];m.up=[6,7];}
  else if(R>=5){m.side=[2,2];m.down=[3,3];m.up=[4,4];}
  else if(R>=3){m.side=[2,2];m.down=[2,2];m.up=[2,2];}
  else{m.side=[m.idle,m.idle];m.down=[m.idle,m.idle];m.up=[m.idle,m.idle];}
  return m;
}

function makeUnit(id,def,anims,meta){
  return {
    id,def,name:def.name||id,role:def.role||'melee',biome:def.biome||null,ranged:!!def.ranged,
    kind:meta.kind,anims,scale:meta.scale,bodyH:meta.bodyH,srcBodyH:meta.srcBodyH,
    bodyW:meta.bodyW,shadow:meta.shadow,shadowProbe:meta.shadowProbe,
    footCx:meta.footCx,footDx:meta.footDx,footW:meta.footW,
    faceSign:def.faceLeft?-1:1,
    has(k){return !!this.anims[k];},
    anim(k){return this.anims[k]||this.anims.idle;},
    // Zustand + Richtung + Combo → Animations-Schlüssel. Rowsheets haben Richtungen,
    // Streifen sind seitlich (gespiegelt) — der Renderer merkt den Unterschied nicht.
    pick(state,dir,combo){
      if(state==='attack'){
        if(this.kind==='rowsheet'){
          const k=`attack:${dir||'side'}:${combo?1:0}`;
          if(this.has(k))return k;
          if(this.has(`attack:${dir||'side'}:0`))return `attack:${dir||'side'}:0`;
          if(this.has('attack:side:0'))return 'attack:side:0';
        }else{
          if(combo&&this.has('attack2'))return 'attack2';
          if(this.has('attack'))return 'attack';
          if(this.has('attack2'))return 'attack2';
        }
        return 'idle';
      }
      if(state==='run'&&this.has('run'))return 'run';
      return 'idle';
    }
  };
}

const cache=new Map();

/* def: Katalog-Eintrag. opts.refBody = Körperhöhe des Helden in Quellpixeln (Maßstab-Referenz).
   Ohne refBody ist die Einheit selbst die Referenz (scale = sizeRel). */
function loadUnit(id,def,opts){
  opts=opts||{};
  const ck=id+'|'+(opts.refBody||0);
  if(cache.has(ck))return cache.get(ck);
  const p=build(id,def,opts).catch(e=>{cache.delete(ck);throw e;});
  cache.set(ck,p);
  return p;
}

async function build(id,def,opts){
  if(!def)throw new Error('Kein Katalog-Eintrag: '+id);
  const anims={};
  let kind,idleImg,idleFrame;

  if(def.anims){ // ── strips: eine Datei je Animation
    kind='strips';
    const keys=Object.keys(def.anims);
    const imgs=await Promise.all(keys.map(async k=>{
      try{
        const src=def.anims[k];
        // Ein Held aus Einzelframes bringt fertige Streifen als LEINWAND mit (V5-S7) — der Loader
        // nimmt beides: URL oder etwas, das man schon zeichnen kann.
        const img=typeof src==='string'?await loadImg(src):src;
        return[k,img];
      }catch(e){console.warn('[unit-loader]',id,k,e.message);return null;}
    }));
    for(const pair of imgs){
      if(!pair)continue;
      const[k,img]=pair;
      /* Ein Streifen, den wir selbst gelegt haben, muss nicht geraten werden: `frameW` im Vertrag
         schlägt die Messung. Gemessen 2026-08-06 am Rogue-Idle (2176 × 128, 17 Frames): die Messung
         findet **keine** freie Grenzspalte und liefert `fw 2176 / frames 1` — die Figur berührt an
         mehreren Nahtstellen den Rand. Bei `run` (1024 × 128) trifft sie 128/8 richtig. Raten ist
         für FREMDE Blätter; für eigene ist es ein Fehler mit Zwischenschritt. */
      const st=def.frameW?{fw:def.frameW,frames:Math.max(1,Math.round(img.width/def.frameW))}
        :probeStripCached(img);
      anims[k]={img,fw:st.fw,fh:img.height,sy:0,frames:st.frames,fps:FPS[k]||10};
    }
    if(!anims.idle){
      const first=Object.keys(anims)[0];
      if(!first)throw new Error('Keine Animation geladen: '+id);
      anims.idle=anims[first];
    }
    idleImg=anims.idle.img;idleFrame={sx:0,sy:0,sw:anims.idle.fw,sh:anims.idle.fh};
  }else if(def.sheet){ // ── rowsheet: ein Raster-Sheet mit Zeilen
    kind='rowsheet';
    const cell=def.cell||CELL;
    const img=await loadImg(def.sheet);
    // Fremde Sheets (nicht Tiny Swords) bringen ihre Zeilen selbst mit — dann wird nicht geraten
    const rows=def.framesPerRow||probeRows(img,cell);
    const map=def.rows
      ?{idle:def.rows.idle,run:def.rows.run,
        side:def.rows.attack,down:def.rows.attack,up:def.rows.attack}
      :rowMap(rows);
    const put=(key,row,fps)=>{
      // row kann [Zeile, Startspalte, Anzahl] sein: nicht jede Zeile ist von vorn bis hinten brauchbar
      let r=row,sx=0,n;
      if(Array.isArray(row)&&row.length===3){r=row[0];sx=row[1];n=row[2];}
      else n=rows[r]|0;
      if(n>0)anims[key]={img,fw:cell,fh:cell,sx:sx*cell,sy:r*cell,frames:n,fps};
    };
    put('idle',map.idle,FPS.idle);
    put('run',map.run,FPS.run);
    for(const d of ['side','down','up']){
      const pair=map[d]||[map.idle,map.idle];
      put(`attack:${d}:0`,pair[0],FPS.attack);
      put(`attack:${d}:1`,pair[1],FPS.attack);
    }
    if(!anims.idle)anims.idle={img,fw:cell,fh:cell,sy:0,frames:Math.max(1,rows[0]|0),fps:FPS.idle};
    def._rows=rows;
    idleImg=img;idleFrame={sx:anims.idle.sx||0,sy:anims.idle.sy,sw:cell,sh:cell};
  }else throw new Error('Unbekanntes Sheet-Format: '+id);

  // Fußlinie + Körperhöhe am Idle-Frame 0 messen (der gebackene Schatten IST der Bodenpunkt)
  const box=probeBox(idleImg,idleFrame.sx,idleFrame.sy,idleFrame.sw,idleFrame.sh);
  const shadowProbe=probeShadow(idleImg,idleFrame.sx,idleFrame.sy,idleFrame.sw,idleFrame.sh,box);
  const foot=probeFoot(idleImg,idleFrame.sx,idleFrame.sy,idleFrame.sw,idleFrame.sh,box);
  const srcBodyH=box?box.h:idleFrame.sh*0.5;
  const footFromBottom=box?(idleFrame.sh-box.bottom):0;

  const sizeRel=def.sizeRel!=null?def.sizeRel:(SIZE_ROLE[def.role]||1);
  const scale=opts.refBody?sizeRel*(opts.refBody/srcBodyH):sizeRel;

  // Anker je Animation: horizontal Framemitte, vertikal konstanter Abstand von der Unterkante.
  // Unterschiedlich hohe Streifen bekommen ihre eigene Messung (sonst schwebt die Figur).
  /* Ankerpunkt quer: der gemessene Fußpunkt, nicht `fw/2`. Damit steht die Figur **auf** ihrer
     Position — Schatten, Lebensbalken und Kollision sitzen ohne Sonderfall richtig. Nur für Felder
     mit der Breite des Idle-Felds; alles andere behält die Rahmenmitte. */
  const footCx=foot?foot.cx:idleFrame.sw/2;
  for(const k in anims){
    const a=anims[k];
    a.anchorX=(a.fw===idleFrame.sw)?footCx:a.fw/2;
    if(a.fh===idleFrame.sh)a.anchorY=a.fh-footFromBottom;
    else{
      const b=probeBox(a.img,a.sx||0,a.sy,a.fw,a.fh);
      a.anchorY=b?b.bottom:a.fh;
    }
  }

  // Schattenmodus: Vorgabe aus der Messung, überschreibbar im Katalog (§21.4 — Daten, kein Sonderfall)
  const shadow=def.shadow||(shadowProbe&&shadowProbe.baked?'baked':'ellipse');
  const u=makeUnit(id,def,anims,{kind,scale,bodyH:srcBodyH*scale,srcBodyH,
    bodyW:(box?box.w:idleFrame.sw*0.5)*scale,shadow,shadowProbe,
    footCx,footDx:footCx-idleFrame.sw/2,footW:(foot?foot.w:0)*scale});
  console.log('[unit-loader]',id,kind,
    '· Körper',Math.round(srcBodyH)+'px → ×'+scale.toFixed(2)+' = '+Math.round(u.bodyH)+'px',
    '· Schatten',shadow+(shadowProbe?' (semi '+shadowProbe.semiShare+', Deckung '+shadowProbe.alphaMean+')':''),
    '· Fußpunkt',Math.round(footCx)+'px (Rahmenmitte '+(idleFrame.sw/2)+', Versatz '+
      (footCx-idleFrame.sw/2>=0?'+':'')+Math.round(footCx-idleFrame.sw/2)+')',
    '· Anims',Object.keys(anims).map(k=>k+':'+anims[k].frames).join(' '));
  return u;
}

window.OW_LOADER={loadUnit,probeRows,probeStrip,probeStripCached,probeBox,probeShadow,probeFoot,rowMap,loadImg,
  FPS,SIZE_ROLE,
  note:'V2-S1 — rowsheet + strips zu einem Unit-Objekt; Größe über sizeRel; Schattenmodus gemessen (V5-S4)'};
})();
