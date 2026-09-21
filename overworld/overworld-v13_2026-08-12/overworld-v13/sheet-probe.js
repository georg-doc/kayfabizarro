/* KFB Overworld — sheet-probe (sp-v1.0)
   Ein fremdes PNG hat kein Handbuch. Diese Datei stellt genau eine Frage an ein Bild und
   beantwortet sie mit Zahlen: **wie ist dieses Blatt geschnitten?**

   Warum es das gibt: zwei der sieben Fallen der v4-Sitzung waren Blätter, die niemand angesehen
   hatte — FrizzleBobs Zeile 0 ist eine Drehung, und die UI-Blätter sind Atlanten aus neun Teilen
   mit 64 px Lücke. Der alte Browser im Repo hat die Framezahl aus dem Seitenverhältnis GERATEN
   (`round(w/h)`); genau dieser Griff erzeugt solche Fehler. Hier wird gemessen und der Grund
   mitgeliefert — die naive Schätzung bleibt als Vergleichszahl stehen.

   Vier Urteile, in dieser Reihenfolge geprüft (die Ausgabe ist englisch wie die UI):
     Grid            — X und Y teilen sich dieselbe Zellgröße (Rowsheet, z. B. 192er-Zellen)
     Strip           — eine Zeile, Grenzspalten durchgängig frei (Enemy/Free Pack)
     Atlas with gaps — es gibt Lücken, aber keinen gültigen Schnitt (UI-Blätter: Teil · Lücke · Teil)
     Single image    — keine Lücke, kein Schnitt

   Grenzregel (aus unit-loader übernommen): eine Grenze bei x gilt nur, wenn die Spalten x-1 UND x
   durchgängig durchsichtig sind. Zusätzlich muss jedes Feld Farbe enthalten — sonst zerschneidet
   man eine Figur in Luft. Für Raster ist die Leerfeld-Regel gelockert (Rowsheets haben kurze
   Zeilen), die Leerfelder werden gezählt und ausgewiesen. */
(function(){
'use strict';

const ctxCache=new WeakMap();
function ctxOf(img){
  let c=ctxCache.get(img);
  if(c)return c;
  const cv=document.createElement('canvas');
  cv.width=img.naturalWidth||img.width;cv.height=img.naturalHeight||img.height;
  c=cv.getContext('2d',{willReadFrequently:true});
  c.drawImage(img,0,0);
  ctxCache.set(img,c);return c;
}

// Läufe (Strecken gleicher Belegung) einer 0/1-Reihe: [{ink,a,b,len}]
function runs(arr){
  const out=[];let a=0;
  for(let i=1;i<=arr.length;i++){
    if(i===arr.length||arr[i]!==arr[a]){out.push({ink:!!arr[a],a,b:i,len:i-a});a=i;}
  }
  return out;
}
const clearAt=(line,x)=>x>0&&x<line.length&&!line[x-1]&&!line[x];
function hasInk(line,a,b){for(let x=a;x<b;x++)if(line[x])return true;return false;}

/* Alle gültigen Schnittweiten einer Achse. allowEmpty: Leerfelder erlaubt (Rowsheet-Zeilen sind
   kurz). Vorzug hat die Weite, die der anderen Bildkante entspricht (quadratische Zellen sind die
   Tiny-Swords-Konvention) — sonst die feinste, die durchhält. */
function cuts(line,total,other,allowEmpty){
  const list=[];
  for(let fw=8;fw<=total;fw++){
    if(total%fw)continue;
    const n=total/fw;
    if(n<2||n>64)continue;
    let ok=true;
    for(let k=1;k<n;k++)if(!clearAt(line,k*fw)){ok=false;break;}
    if(!ok)continue;
    let empty=0;
    for(let k=0;k<n;k++)if(!hasInk(line,k*fw,(k+1)*fw))empty++;
    if(empty&&!allowEmpty)continue;
    list.push({fw,frames:n,empty});
  }
  if(!list.length)return{pick:null,list:[]};
  const square=list.find(c=>c.fw===other);
  return{pick:square||list[0],list};
}

/* Die eine Messung. img muss geladen und CORS-frei lesbar sein (crossOrigin='anonymous'). */
function measure(img,opts){
  opts=opts||{};
  const A=opts.alpha!=null?opts.alpha:8;
  const w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
  const d=ctxOf(img).getImageData(0,0,w,h).data;
  const col=new Uint8Array(w),row=new Uint8Array(h);
  let opaque=0;
  for(let y=0;y<h;y++){
    const o=y*w*4;
    for(let x=0;x<w;x++){
      if(d[o+x*4+3]>A){col[x]=1;row[y]=1;opaque++;}
    }
  }
  const rx=runs(col),ry=runs(row);
  const inner=rr=>rr.filter((r,i)=>!r.ink&&i>0&&i<rr.length-1);
  const gapsX=inner(rx),gapsY=inner(ry);
  const piecesX=rx.filter(r=>r.ink),piecesY=ry.filter(r=>r.ink);

  const cx=cuts(col,w,h,true),cy=cuts(row,h,w,true);
  const cxStrict=cuts(col,w,h,false);

  let verdict,reason,frame=null,grid=null,strip=null;
  const cellMatch=cx.pick&&cy.pick&&cx.pick.fw===cy.pick.fw?cx.pick.fw:
    (cx.list.length&&cy.list.length?(cx.list.map(c=>c.fw).find(fw=>cy.list.some(c=>c.fw===fw))||0):0);

  if(cellMatch&&h/cellMatch>=2){
    verdict='Grid';
    const cell=cellMatch,cols=Math.floor(w/cell),rows=Math.floor(h/cell);
    const framesPerRow=window.OW_LOADER?window.OW_LOADER.probeRows(img,cell):null;
    grid={cell,cols,rows,framesPerRow};
    frame={w:cell,h:cell};
    reason='x and y both cut at '+cell+' px, boundaries clear · '+cols+'×'+rows+' cells'+
      (framesPerRow?' · rows '+JSON.stringify(framesPerRow):'');
  }else if(cxStrict.pick){
    // NUR der strenge Schnitt macht einen Streifen. Der lockere (Leerfelder erlaubt) ist für
    // Rowsheet-ZEILEN gedacht — bei einem Einzelbild fand er sonst eine leere zweite Hälfte
    // und behauptete zwei Felder (gemessen an KFB Knight/Attack/attack1.png, 128×128).
    const c=cxStrict.pick;
    verdict='Strip';
    strip={fw:c.fw,frames:c.frames,empty:c.empty};
    frame={w:c.fw,h};
    reason='boundary columns at '+c.fw+' px fully transparent, '+c.frames+' frames all carry paint';
  }else if(gapsX.length||gapsY.length){
    verdict='Atlas with gaps';
    frame={w,h};
    const pat=a=>a.slice(0,6).map(r=>r.len).join(' · ');
    reason='no valid cut, but '+gapsX.length+' gaps across / '+gapsY.length+' down · '+
      'pieces across '+pat(piecesX)+' · gaps across '+pat(gapsX);
  }else{
    verdict='Single image';
    frame={w,h};
    const loose=cx.pick&&cx.pick.empty?cx.pick:null;
    reason=loose
      ? 'no cut without empty fields — '+loose.fw+' px would split into '+loose.frames+
        ' fields, '+loose.empty+' of them empty'
      : 'no clear boundary column, no gap';
  }

  // Fußlinie und Körperhöhe am ersten Feld messen (der gebackene Schatten IST der Bodenpunkt)
  const PB=window.OW_LOADER&&window.OW_LOADER.probeBox;
  const box=PB?PB(img,0,0,frame.w,frame.h):null;
  const foot=box?{fromBottom:frame.h-box.bottom,bodyH:box.h,bodyW:box.w,cx:box.cx}:null;
  // Hat das Blatt einen gebackenen Schatten? (§21 — dieselbe Messung, die der Loader benutzt)
  const PS=window.OW_LOADER&&window.OW_LOADER.probeShadow;
  const shadow=PS?PS(img,0,0,frame.w,frame.h,box):null;

  // Streuung der Fußlinie über die Felder einer Zeile: schwankt sie, wackelt die Figur im Spiel
  let drift=null;
  const nF=strip?strip.frames:(grid&&grid.framesPerRow?grid.framesPerRow[0]:0);
  if(PB&&nF>1){
    let lo=1e9,hi=-1e9,seen=0;
    for(let k=0;k<Math.min(nF,16);k++){
      const b=PB(img,k*frame.w,0,frame.w,frame.h);
      if(!b)continue;
      seen++;lo=Math.min(lo,b.bottom);hi=Math.max(hi,b.bottom);
    }
    if(seen>1)drift={span:hi-lo,frames:seen};
  }

  const naive=Math.max(1,Math.round(w/h)); // was der alte Browser geraten hätte
  const measured=strip?strip.frames:(grid?grid.cols:1);

  return{w,h,verdict,reason,frame,grid,strip,foot,drift,naive,measured,shadow,
    naiveOk:naive===measured,
    fill:+(opaque/(w*h)).toFixed(3),
    gapsX:gapsX.map(r=>({at:r.a,len:r.len})),gapsY:gapsY.map(r=>({at:r.a,len:r.len})),
    piecesX:piecesX.map(r=>({at:r.a,len:r.len})),piecesY:piecesY.map(r=>({at:r.a,len:r.len})),
    cutsX:cx.list,cutsY:cy.list,alpha:A};
}

/* Felder einer Zeile als Rechtecke — der Zeichner braucht keine Fallunterscheidung mehr. */
function framesOf(m,rowIx){
  const out=[];
  if(m.grid){
    const r=rowIx|0,n=(m.grid.framesPerRow&&m.grid.framesPerRow[r])||m.grid.cols;
    for(let k=0;k<n;k++)out.push({sx:k*m.grid.cell,sy:r*m.grid.cell,sw:m.grid.cell,sh:m.grid.cell});
  }else if(m.strip){
    for(let k=0;k<m.strip.frames;k++)out.push({sx:k*m.strip.fw,sy:0,sw:m.strip.fw,sh:m.h});
  }else out.push({sx:0,sy:0,sw:m.w,sh:m.h});
  return out;
}

window.OW_PROBE={version:'sp-v1.0',measure,framesOf,runs,ctxOf,
  note:'Wie ist dieses Blatt geschnitten? Vier Urteile mit Grund, plus die naive Schätzung als Vergleich.'};
})();
