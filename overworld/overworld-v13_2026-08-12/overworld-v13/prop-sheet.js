/* KFB — prop-sheet (ps-v1.0, V7-S1)
   **Ein generiertes Blatt wird zu Requisiten, ohne dass jemand eine Zahl vorgibt.**

   Der Grund, warum hier gemessen und nicht gerechnet wird: das Raster im Blatt ist NICHT das, was
   im Briefing stand. Georgs Blatt heißt 1536×1024 bei 8×6, also rechnerisch 192×171 je Zelle — die
   Alpha-Projektion findet aber Bänder bei 28…217, 268…382, 421…523 usw. Wer 192×171 vorgibt,
   schneidet quer durch Objekte. Dieselbe Fehlerklasse wie die geratenen Kachelindizes im Dungeon
   Editor (HOUSEKEEPING): **ein Index, den man nicht am Blatt geprüft hat, ist geraten.**

   Und der Befund, der die Fassung entscheidet (gemessen am 7.8. an `sheet-02.png`):
   das Blatt liegt auf **keinem** Pixelgitter. 260.742 verschiedene Farben, und die mittlere
   Blockabweichung STEIGT monoton mit der Blockgröße (2 px 52,6 → 4 px 88,0 → 8 px 116,0) statt bei
   4 einzubrechen. 71 % aller Farbsprünge sind 1 px weit, die Kantenpositionen sind gleichverteilt
   mod 8. Das ist gemalte Glätte im Pixel-Art-Stil. Tiny Swords rastert strikt auf 64 — deshalb
   liefert dieses Modul BEIDE Fassungen (`smooth` und `pixel`) und die Entscheidung fällt im Bild.

   Vier Schritte, jeder für sich prüfbar:
     1. `keyOut`   — Weiß raus über Luma-Schwelle mit weichem Saum (kein Zauberstab, kein Halo).
     2. `measure`  — Raster aus dem Blatt: Alpha auf beide Achsen projizieren, Bänder finden,
                     Streupixel unter 8 px verwerfen, Lücken unter 14 px vereinen.
     3. `trim`     — je Zelle die enge Box; der Fußpunkt ist ihre Unterkante. Den Schatten setzt
                     der Deko-Zweig des Runners über `OW_SHADOW` auf diesen Fußpunkt (V7-S1c —
                     bis dahin stand die Behauptung hier, ohne dass der Code sie einlöste).
     4. `pixelize` — die Gegenprobe: Blockmittel auf 4 px, Kanäle auf 6 Stufen, nearest hoch.

   Häufigkeit ist Datum, nicht Code: das Gewicht steht in `prop-sheets.json` neben dem Blatt.
   Georgs Kürbisproblem (»Wegweiser so oft wie Grasbüschel«) löst sich damit an der Quelle. */
(function(){
'use strict';
const TILE=64;

function loadImg(url){return new Promise((res,rej)=>{const i=new Image();i.crossOrigin='anonymous';
  i.onload=()=>res(i);i.onerror=()=>rej(new Error('Ladefehler: '+url));i.src=url;});}

/* Zwei Kanäle für dasselbe Blatt: im Chat liegt es neben dem Dokument, im Repo unter media.
   Reihenfolge ist Absicht — der Standalone-Export inlined die lokale Datei, der Chat lädt sie
   ohnehin, und wer das Blatt später ins Repo schiebt, ändert keine Zeile Code. */
async function resolveImg(file){
  const tries=['./assets-lab/'+file];
  if(window.OW_SRC)tries.push(OW_SRC.a2d('KFB_Props/'+file));
  let last=null;
  for(const u of tries){try{return await loadImg(u);}catch(e){last=e;}}
  throw last||new Error('kein Kanal für '+file);
}

function canvasOf(img){
  const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
  c.getContext('2d').drawImage(img,0,0);return c;
}

/* ── 1 · Weiß raus ─────────────────────────────────────────────────────────────────────────
   Nicht über Gleichheit mit #FFFFFF: nur 13,7 % des Blattes sind rein weiß, 63,8 % sind fast
   weiß. Eine harte Schwelle ergibt Löcher im Hintergrund und einen grauen Saum am Objekt.
   Also: über `hi` ganz weg, unter `lo` ganz da, dazwischen linear — UND die Farbe im Saum
   entsättigungsfrei zurückgeholt (Unpremultiply), sonst leuchtet die Kante hell. */
function keyOut(src,opt){
  const o=opt||{},hi=o.hi==null?250:o.hi,lo=o.lo==null?232:o.lo;
  const c=src.getContext?src:canvasOf(src);
  const x=c.getContext('2d'),W=c.width,H=c.height;
  const im=x.getImageData(0,0,W,H),d=im.data;
  let cleared=0,rim=0;
  for(let i=0;i<d.length;i+=4){
    const r=d[i],g=d[i+1],b=d[i+2];
    const l=Math.min(r,g,b);                       // Minimum: eine helle Sättigung bleibt Objekt
    if(l>=hi){d[i+3]=0;cleared++;continue;}
    if(l>lo){
      const a=1-(l-lo)/(hi-lo);
      d[i+3]=Math.round(d[i+3]*a);rim++;
      // Weißanteil aus der Farbe rechnen, damit der Saum nicht aufhellt
      const w=(l-lo)/(hi-lo);
      d[i]=Math.max(0,Math.min(255,(r-255*w)/(1-w)));
      d[i+1]=Math.max(0,Math.min(255,(g-255*w)/(1-w)));
      d[i+2]=Math.max(0,Math.min(255,(b-255*w)/(1-w)));
    }
  }
  const out=document.createElement('canvas');out.width=W;out.height=H;
  out.getContext('2d').putImageData(im,0,0);
  out.stats={cleared:cleared/(W*H),rim:rim/(W*H)};
  return out;
}

/* ── 1b · Den grauen Saum entfernen (V7-S2) ──────────────────────────────────────
   Georg sah nach dem Freistellen weiterhin graue Kanten — an Steinoberseiten, an Büschen, am
   Stamm. Gemessen: in der 2-px-Zone um jede Silhouette sind **53,5 % der Pixel grau-hell**
   (Median-Sättigung 6 %, Median-Luma 154, 38 223 Pixel). Das ist **kein Freistell-Rest**, sondern
   in das Blatt gemalt — Punkt 4 des Re-Briefings (»Kontur dunkler Ton der Objektfarbe, nicht
   schwarz, ein Pixel breit«) ist nicht befolgt. Eine feinere Weiß-Schwelle kann daran nichts
   ändern, weil die Pixel nicht weiß sind.

   Deshalb: was am Rand liegt UND grau ist, fällt weg. Die Regel greift nur in der Randzone, damit
   graue Steine mitten im Objekt bleiben — dieselbe Logik wie bei der Körpermaske, nur umgekehrt
   angewandt. Verglichen am Kontaktblatt ´docs/img/prop-saum-vergleich.png´ gegen vier Alternativen;
   diese hier trägt, weil sie die Silhouette nicht antastet. */
function degrey(cv,opt){
  const o=opt||{},sat=o.sat==null?18:o.sat,lum=o.luma==null?120:o.luma,
        reach=o.reach==null?2:o.reach,aMin=o.alphaMin==null?24:o.alphaMin;
  const x=cv.getContext('2d'),W=cv.width,H=cv.height;
  const im=x.getImageData(0,0,W,H),d=im.data;
  const A=new Uint8Array(W*H);
  for(let i=0,p=3;i<W*H;i++,p+=4)A[i]=d[p]>aMin?1:0;
  let killed=0;
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){
    const k=j*W+i;if(!A[k])continue;
    let border=false;
    for(let a=-reach;a<=reach&&!border;a++)for(let b=-reach;b<=reach;b++){
      const ii=i+b,jj=j+a;
      if(ii<0||jj<0||ii>=W||jj>=H||!A[jj*W+ii]){border=true;break;}
    }
    if(!border)continue;
    const p=k*4,mx=Math.max(d[p],d[p+1],d[p+2]),mn=Math.min(d[p],d[p+1],d[p+2]);
    const s=mx?(mx-mn)/mx*100:0, l=0.299*d[p]+0.587*d[p+1]+0.114*d[p+2];
    if(s<sat&&l>lum){d[p+3]=0;killed++;}
  }
  const out=document.createElement('canvas');out.width=W;out.height=H;
  out.getContext('2d').putImageData(im,0,0);
  out.stats=Object.assign({},cv.stats||{},{degreyed:killed});
  return out;
}

/* ── 2 · Raster aus dem Blatt ──────────────────────────────────────────────────────────────
   Bänder aus der Alpha-Projektion. `minBand` wirft Streupixel weg (ein einzelner Rest Saum ist
   kein Objekt), `mergeGap` vereint, was zusammengehört (der Zwischenraum in einem Busch ist
   kleiner als der Abstand zwischen zwei Zellen). Beide Zahlen sind das, was am Blatt trägt. */
function measure(cv,opt){
  const o=opt||{},aMin=o.alphaMin==null?24:o.alphaMin,
        minBand=o.minBand==null?8:o.minBand,gap=o.mergeGap==null?14:o.mergeGap;
  const x=cv.getContext('2d'),W=cv.width,H=cv.height;
  const d=x.getImageData(0,0,W,H).data;
  const colS=new Uint32Array(W),rowS=new Uint32Array(H);
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){
    if(d[(j*W+i)*4+3]>aMin){colS[i]++;rowS[j]++;}
  }
  const bands=(sum,n)=>{
    let out=[],s=-1;
    for(let i=0;i<n;i++){
      if(sum[i]>0&&s<0)s=i;
      else if(sum[i]===0&&s>=0){out.push([s,i-1]);s=-1;}
    }
    if(s>=0)out.push([s,n-1]);
    out=out.filter(b=>b[1]-b[0]+1>=minBand);
    const m=[];
    for(const b of out){
      const p=m[m.length-1];
      if(p&&b[0]-p[1]-1<gap)p[1]=b[1];else m.push([b[0],b[1]]);
    }
    return m;
  };
  return {cols:bands(colS,W),rows:bands(rowS,H),W,H};
}

/* ── 3 · Zuschnitt ─────────────────────────────────────────────────────────────────────────
   Die enge Box je Kreuzungsfeld. Der Fußpunkt IST die Unterkante — bei einem Blatt ohne
   gebackenen Schatten stimmt das, und genau deshalb war der Schatten der erste Punkt im
   Re-Briefing. Bei einem Blatt MIT Schatten müsste hier die Körpermaske laufen (deckend UND
   gesättigt); der Schalter `body` gibt es her, damit Fassung 1 vergleichbar bleibt. */
function trim(cv,grid,opt){
  const o=opt||{},aMin=o.alphaMin==null?24:o.alphaMin,body=!!o.body;
  const x=cv.getContext('2d'),cells=[];
  for(let r=0;r<grid.rows.length;r++){
    for(let q=0;q<grid.cols.length;q++){
      const[y0,y1]=grid.rows[r],[x0,x1]=grid.cols[q];
      const w=x1-x0+1,h=y1-y0+1;
      const d=x.getImageData(x0,y0,w,h).data;
      let miX=w,maX=-1,miY=h,maY=-1;
      for(let j=0;j<h;j++)for(let i=0;i<w;i++){
        const p=(j*w+i)*4;
        if(d[p+3]<=aMin)continue;
        if(body){
          const mx=Math.max(d[p],d[p+1],d[p+2]),mn=Math.min(d[p],d[p+1],d[p+2]);
          if(d[p+3]<200||(mx-mn)<12&&mx>200)continue;   // blasser Schleier zählt nicht als Körper
        }
        if(i<miX)miX=i;if(i>maX)maX=i;if(j<miY)miY=j;if(j>maY)maY=j;
      }
      if(maX<0)continue;
      cells.push({r,q,sx:x0+miX,sy:y0+miY,w:maX-miX+1,h:maY-miY+1});
    }
  }
  return cells;
}

/* ── 4 · Die Gegenprobe: aufs Gitter zwingen ───────────────────────────────────────────────
   Blockmittel auf `block` px, Kanäle auf `levels` Stufen, dann nearest wieder hoch. Damit liegt
   das Blatt auf demselben Gitter wie Tiny Swords und hat flache Flächen statt Verläufen.
   Alpha wird als Mehrheit entschieden, nicht gemittelt — sonst franst jede Kante. */
function pixelize(cv,opt){
  const o=opt||{},b=o.block||4,lv=o.levels||6;
  const W=cv.width,H=cv.height;
  const sx=cv.getContext('2d'),src=sx.getImageData(0,0,W,H).data;
  const out=document.createElement('canvas');out.width=W;out.height=H;
  const ox=out.getContext('2d'),im=ox.createImageData(W,H),dst=im.data;
  const step=255/(lv-1);
  for(let by=0;by<H;by+=b)for(let bx=0;bx<W;bx+=b){
    let sr=0,sg=0,sb=0,n=0,op=0,tot=0;
    for(let j=0;j<b&&by+j<H;j++)for(let i=0;i<b&&bx+i<W;i++){
      const p=((by+j)*W+bx+i)*4;tot++;
      if(src[p+3]>127){op++;sr+=src[p];sg+=src[p+1];sb+=src[p+2];n++;}
    }
    const solid=op*2>tot;
    const r=n?Math.round(Math.round(sr/n/step)*step):0,
          g=n?Math.round(Math.round(sg/n/step)*step):0,
          bl=n?Math.round(Math.round(sb/n/step)*step):0;
    for(let j=0;j<b&&by+j<H;j++)for(let i=0;i<b&&bx+i<W;i++){
      const p=((by+j)*W+bx+i)*4;
      dst[p]=r;dst[p+1]=g;dst[p+2]=bl;dst[p+3]=solid?255:0;
    }
  }
  ox.putImageData(im,0,0);
  return out;
}

/* Die Messung, die den Weg entscheidet — als Funktion, damit sie jeder nachrechnen kann.
   Ein Blatt liegt auf einem Gitter, wenn die Blockabweichung bei der Blockgröße EINBRICHT.
   Steigt sie monoton, gibt es kein Gitter. */
function gridProbe(cv,sizes){
  const W=cv.width,H=cv.height;
  const d=cv.getContext('2d').getImageData(0,0,W,H).data;
  const set=new Set();
  for(let p=0;p<d.length;p+=4)if(d[p+3]>127)set.add((d[p]<<16)|(d[p+1]<<8)|d[p+2]);
  const dev=b=>{
    let s=0,n=0;
    for(let by=0;by+b<=H;by+=b)for(let bx=0;bx+b<=W;bx+=b){
      let sr=0,sg=0,sb=0,c=0;
      for(let j=0;j<b;j++)for(let i=0;i<b;i++){const p=((by+j)*W+bx+i)*4;
        if(d[p+3]>127){sr+=d[p];sg+=d[p+1];sb+=d[p+2];c++;}}
      if(c<b*b*0.8)continue;
      const mr=sr/c,mg=sg/c,mb=sb/c;let v=0;
      for(let j=0;j<b;j++)for(let i=0;i<b;i++){const p=((by+j)*W+bx+i)*4;
        if(d[p+3]>127)v+=Math.abs(d[p]-mr)+Math.abs(d[p+1]-mg)+Math.abs(d[p+2]-mb);}
      s+=v/c;n++;
    }
    return n?s/n:0;
  };
  const list=(sizes||[2,3,4,6,8]).map(b=>({block:b,dev:+dev(b).toFixed(1)}));
  const rising=list.every((e,i)=>i===0||e.dev>=list[i-1].dev);
  return {colors:set.size,blocks:list,onGrid:!rising};
}

/* ── Vorbacken (V7-S1b) ────────────────────────────────────────────────────────────────────
   Der Verifier hat den Vergleich zerlegt: `imageSmoothingEnabled=false` allein rettet nichts,
   wenn der 4-px-Block mit 1,54 · 1,94 · 2,37 · 6,80 Bildpunkten auf dem Schirm landet. Nearest
   macht daraus abwechselnd 1- und 2-px-Streifen — und dann vergleicht Georg glatt gegen
   kaputt-resampelt statt glatt gegen Gitter.

   Also: die Zielgröße wird so gerundet, dass **block × scale ganzzahlig** ist, und die Zelle wird
   EINMAL auf diese Größe gebacken. Gezeichnet wird danach die gebackene Leinwand bei scale 1 —
   die Verformung je Instanz (±6 %) trifft beide Fassungen gleich, das ist der faire Teil. */
const baked=new Map();
function bakeCell(src,cell,scale,block){
  const b=block||4;
  const q=Math.max(1/b,Math.round(scale*b)/b);
  const key=cell.sx+','+cell.sy+','+cell.w+','+cell.h+'@'+q;
  const hit=baked.get(key);if(hit)return hit;
  const w=Math.max(1,Math.round(cell.w*q)),h=Math.max(1,Math.round(cell.h*q));
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  x.drawImage(src,cell.sx,cell.sy,cell.w,cell.h,0,0,w,h);
  c.blockPx=b*q;c.q=q;
  baked.set(key,c);
  return c;
}

/* ── Katalog ───────────────────────────────────────────────────────────────────────────────
   Das JSON neben dem Blatt ist der Kontrakt: Reihenbedeutung, Gewicht, Höhe in Feldern, Biom.
   Gemessen wird trotzdem — die Zellen im JSON sind Beleg, nicht Vorgabe (`useStored`). */
let CAT=null,pending=null;

async function ready(opt){
  if(CAT)return CAT;
  if(pending)return pending;
  const o=opt||{};
  pending=(async()=>{
    /* **Der Pfad war seit dem v11-Fork falsch** (`./overworld/…`), ist aber nie aufgefallen, weil
       der Rückfall 700 Tiny-Swords-Requisiten liefert — ein 404 mit hübschem Ersatz. Jetzt neben
       der eigenen Datei suchen, dann über den Kanal des Spiels. */
    const kand=[];
    if(o.contract)kand.push(o.contract);
    try{kand.push(new URL('./prop-sheets.json',
      (document.currentScript&&document.currentScript.src)||document.baseURI).href);}catch(e){}
    if(window.OW_SRC)kand.push(OW_SRC.ow('prop-sheets.json'));
    let spec=null,letzter=null;
    for(const url of kand){
      try{const r=await fetch(url);if(!r.ok)throw new Error(url+' '+r.status);spec=await r.json();break;}
      catch(e){letzter=e;}
    }
    if(!spec)throw letzter||new Error('prop-sheets.json nicht erreichbar');
    const sheets=[];
    for(const s of spec.sheets){
      try{
        const img=await resolveImg(s.file);
        const keyed=s.degrey===false?keyOut(img,s.key):degrey(keyOut(img,s.key),s.degrey);
        const grid=measure(keyed,s.grid);
        const cells=trim(keyed,grid,s.trim);
        const pix=pixelize(keyed,{block:s.block||4,levels:s.levels||6});
        const rows=s.rows||[];
        const items=cells.map(c=>{
          const row=rows[c.r]||{};
          const hT=row.hTiles||1;
          return Object.assign({},c,{
            name:(row.name||'Reihe '+(c.r+1))+' '+(c.q+1),
            weight:row.weight==null?10:row.weight,
            hTiles:hT,tall:row.tall==null?0.4:row.tall,
            biomes:row.biomes||['grass'],
            place:row.place||'deco',
            /* Deckel bei 1: generierte Art 1,7× hochzuziehen sieht matschig aus (der Verifier fand
               `Stein 8`, 50×32 im Blatt, auf 85×54 gezogen). Die Höhe je Reihe ist eine Absicht,
               kein Zwang — kleine Zellen bleiben klein, damit die Reihe Größenvarianz behält. */
            scale:+Math.min(1,(hT*TILE)/c.h).toFixed(4)
          });
        });
        const probe=gridProbe(keyed,[2,4,8]);
        sheets.push({id:s.id,file:s.file,smooth:keyed,pixel:pix,grid,cells:items,probe,
          block:s.block||4,rows,stats:keyed.stats});
        console.log('[prop-sheet]',s.id,'·',grid.rows.length+'×'+grid.cols.length,'Bänder ·',
          items.length,'Zellen · Weiß raus',(keyed.stats.cleared*100).toFixed(1)+'%',
          '· grauer Saum weg',(keyed.stats.degreyed||0).toLocaleString('de-DE'),'px',
          '· Gitter:',probe.onGrid?'ja':'nein ('+probe.colors+' Farben)');
      }catch(e){console.warn('[prop-sheet]',s.id,e.message);}
    }
    CAT={version:spec.version,sheets,
      total:sheets.reduce((n,s)=>n+s.cells.length,0)};
    return CAT;
  })();
  return pending;
}

/* Gewichtete Wahl. `r` kommt von außen (der Runner sät aus der Position, damit dieselbe Welt
   dieselben Requisiten hat) — dieses Modul würfelt nie selbst. */
function pick(r,opt){
  const o=opt||{};
  if(!CAT||!CAT.sheets.length)return null;
  const sh=CAT.sheets[0];
  const list=sh.cells.filter(c=>
    (o.place?c.place===o.place:c.place==='deco')&&
    (!o.biome||c.biomes.indexOf(o.biome)>=0||c.biomes.indexOf('*')>=0));
  if(!list.length)return null;
  let tot=0;for(const c of list)tot+=c.weight;
  let t=r*tot,pickC=list[list.length-1];
  for(const c of list){t-=c.weight;if(t<=0){pickC=c;break;}}
  if(o.grid==='pixel'){
    const b=bakeCell(sh.pixel,pickC,pickC.scale,sh.block);
    return {img:b,fw:b.width,fh:b.height,sx:0,sy:0,frames:1,scale:1,pad:0,
      tall:pickC.tall,name:pickC.name,src:'pixel',blockPx:b.blockPx};
  }
  return {img:sh.smooth,fw:pickC.w,fh:pickC.h,sx:pickC.sx,sy:pickC.sy,frames:1,
    scale:pickC.scale,pad:0,tall:pickC.tall,name:pickC.name,src:'smooth'};
}

window.OW_PROPS={version:'ps-v1.0',TILE,
  ready,pick,keyOut,degrey,measure,trim,pixelize,gridProbe,resolveImg,loadImg,canvasOf,bakeCell,
  get cat(){return CAT;},
  note:'Raster wird am Blatt gemessen, nie vorgegeben. Zwei Fassungen — smooth und aufs 4-px-Gitter '+
       'gezwungen — weil das generierte Blatt gemessen KEIN Pixelgitter hat.'};
})();
