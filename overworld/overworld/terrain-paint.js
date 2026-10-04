/* KFB Overworld — Terrain als EBENENSTAPEL (tp-v4.0, V6-S9, Masterplan §26/§28)

   ┌─ GEORGS MODELL, WÖRTLICH ────────────────────────────────────────────────────────────────┐
   │ »Eine Farbfläche, die mit einer unregelmäßigen Kante abschließt. Darunter eine Farbfläche.│
   │ Und dann einfach mit einer Schattenebene arbeiten. Ebene, Ebene, Ebene — jeweils mit einer│
   │ Schattenfunktion, wenn es eine Erhöhung gibt, und einer Outline, wenn man abgrenzen will.«│
   └──────────────────────────────────────────────────────────────────────────────────────────┘

   Bis v3 war das Modell verkehrt herum gedacht: EINE Küstenkante, überladen mit Feder,
   Weichzeichnung und Tiefenverlauf — und der Übergang Gras→Sand hatte gar keinen Schatten. Die
   Höhe kam aus einem Gradienten statt daraus, dass jede Stufe ihren Schatten auf die darunter
   wirft. Georgs Zoom vom 7.8. zeigte die Folge: das Wasser lief über die Outline, weil die
   Fläche eine 8-px-Maske war und die Linie ein Vektor. Zwei Genauigkeiten in einem Bild.

   ── Drei Entscheidungen, aus denen alles folgt ────────────────────────────────────────────
   1. FLÄCHEN SIND VEKTOR, NICHT MASKE. Der Clip auf die Kontur kostet gemessen 0,6 ms je Frame
      — es gab nie einen Grund, die Kante an eine Backauflösung zu binden. Die Fläche endet
      exakt dort, wo die Linie liegt, bei jedem Zoom.
   2. SCHATTEN SIND HART. Kein Blur, kein Verlauf: eine versetzte Kopie derselben Kontur in
      einer dunkleren Variante der Fläche DARUNTER. Die Höhe entsteht aus dem Versatz.
   3. DIE OUTLINE IST OPTIONAL und liegt obenauf. Sie ist eine Markierung, keine Konstruktion:
      wer sie abschaltet, sieht immer noch saubere Kanten.

   Der Stapel von unten: Wasser · Sand · Gras. Je Stufe Schatten, dann Fläche. Die Feder liegt
   ganz oben auf der äußersten Kante und kommt aus dem Kartenkanon (cardbuilder/kfb-ink-canon.js)
   — ein Band, ein fill(), kein Strich. */
(function(){
'use strict';
const S=8;                      // Auflösung der Flächenmaske: Pixel je Spielfeld
const P=4;                      // Abtastung der Kontur: Punkte je Spielfeld
const cache={},coastCache={};
let scratch=null;
let CANON=null,canonAsked=false;

function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}

/* Der Kanon liegt hinter `OW_CARD` (card-ink-2d.js lädt ihn von pages.dev). Auf »läuft« gaten,
   nicht auf »existiert« — und ohne ihn wird KEINE Feder gezeichnet. Eine erfundene Kante wäre
   schlimmer als keine; das steht so im Kanon und gilt hier genauso. */
function canon(){
  if(CANON)return CANON;
  const C=window.OW_CARD;
  if(C&&C.canon&&C.canon.inkRibbon2D)return (CANON=C.canon);
  if(C&&!canonAsked){canonAsked=true;C.ready();}
  return null;
}

/* Wertrauschen mit Periode Q (in Konturpunkten). Eine Schwelle bei konstant 0,5 liefert **exakt
   die Rasterkante zurück** — waagerecht schnurgerade, diagonal als Treppe. Georgs Diagnose:
   »wenn das Gras ist, müsste die horizontale Kante auch irregulär sein«. */
function vnoise(Q){
  const h=(x,y)=>{let n=(x|0)*374761393+(y|0)*668265263;
    n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296;};
  return (x,y)=>{
    const fx=x/Q,fy=y/Q,ix=Math.floor(fx),iy=Math.floor(fy);
    const tx=fx-ix,ty=fy-iy;
    const sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);
    const a=h(ix,iy),b=h(ix+1,iy),c=h(ix,iy+1),d=h(ix+1,iy+1);
    return a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy;
  };
}

function scratchFor(w,h){
  if(!scratch||scratch.width<w||scratch.height<h)scratch=mk(Math.max(w,1),Math.max(h,1));
  return scratch;
}

// ── Marching Squares ────────────────────────────────────────────────────────────────────────
function traceIso(V,GW,GH){
  const segs=[];
  const ip=(a,b)=>a/(a-b);
  for(let y=0;y<GH-1;y++)for(let x=0;x<GW-1;x++){
    const tl=V[y*GW+x],tr=V[y*GW+x+1],bl=V[(y+1)*GW+x],br=V[(y+1)*GW+x+1];
    const ci=(tl>0?8:0)|(tr>0?4:0)|(br>0?2:0)|(bl>0?1:0);
    if(ci===0||ci===15)continue;
    const T=[x+ip(tl,tr),y],R=[x+1,y+ip(tr,br)],B=[x+ip(bl,br),y+1],L=[x,y+ip(tl,bl)];
    const p=(a,b)=>segs.push(a[0],a[1],b[0],b[1]);
    switch(ci){
      case 1: case 14: p(L,B); break;
      case 2: case 13: p(B,R); break;
      case 3: case 12: p(L,R); break;
      case 4: case 11: p(T,R); break;
      case 6: case 9:  p(T,B); break;
      case 7: case 8:  p(L,T); break;
      case 5:  p(L,T); p(B,R); break;
      case 10: p(T,R); p(B,L); break;
    }
  }
  return segs;
}

/* Segmente zu Ringen verketten. Die Endpunkte liegen auf Zellkanten und treffen sich exakt —
   ein Schlüssel mit drei Nachkommastellen reicht, es wird nichts »in die Nähe« gerundet. */
function chainSegs(s){
  const N=s.length/4;
  const key=(x,y)=>(Math.round(x*1000)+','+Math.round(y*1000));
  const ends=new Map();
  const add=(k,i)=>{let a=ends.get(k);if(!a)ends.set(k,a=[]);a.push(i);};
  for(let i=0;i<N;i++){add(key(s[i*4],s[i*4+1]),i);add(key(s[i*4+2],s[i*4+3]),i);}
  const used=new Uint8Array(N),polys=[];
  const nextFrom=(k,skip)=>{
    const a=ends.get(k);if(!a)return -1;
    for(const i of a)if(i!==skip&&!used[i])return i;
    return -1;
  };
  for(let i=0;i<N;i++){
    if(used[i])continue;
    used[i]=1;
    const pts=[[s[i*4],s[i*4+1]],[s[i*4+2],s[i*4+3]]];
    for(let dir=0;dir<2;dir++){
      let cur=i;
      for(;;){
        const tip=dir?pts[0]:pts[pts.length-1];
        const j=nextFrom(key(tip[0],tip[1]),cur);
        if(j<0)break;
        used[j]=1;cur=j;
        const a=[s[j*4],s[j*4+1]],b=[s[j*4+2],s[j*4+3]];
        const same=Math.round(a[0]*1000)===Math.round(tip[0]*1000)&&
                   Math.round(a[1]*1000)===Math.round(tip[1]*1000);
        if(dir)pts.unshift(same?b:a);else pts.push(same?b:a);
      }
    }
    if(pts.length>6)polys.push(pts);
  }
  return polys;
}

/* Ausdünnen auf einen Mindestabstand — gegen den ZULETZT BEHALTENEN Punkt, nicht gegen den
   Nachbarn, sonst summieren sich Kleinstschritte zu einer Wanderung.
   `minPts` ist die Rettung für KLEINE Ringe: ein Wassergraben hat nach Chaikin vielleicht drei
   Dutzend Punkte, und ein fester Mindestabstand macht daraus ein Vier- oder Fünfeck — auf Georgs
   Bild vom 7.8. sind die Gräben genau das, eckig mit geraden Kanten. Wer zu wenig Punkte behält,
   dünnt mit halbem Abstand nochmal aus, bis die Form wieder rund ist. */
function thin(pts,minD,minPts){
  const run=d=>{
    const out=[pts[0]];let last=pts[0];
    for(let i=1;i<pts.length-1;i++){
      const dx=pts[i][0]-last[0],dy=pts[i][1]-last[1];
      if(dx*dx+dy*dy>=d*d){out.push(pts[i]);last=pts[i];}
    }
    out.push(pts[pts.length-1]);
    return out;
  };
  let d=minD,r=run(d);
  const want=Math.min(minPts||0,pts.length);
  for(let k=0;k<5&&r.length<want;k++){d*=0.5;r=run(d);}
  return r;
}

/* Kacheln für die Sichtbarkeit. Ein Inselring liegt fast immer im Bild, aber nur ein Bruchteil
   seiner Punkte — ohne diese Aufteilung zeichnet man die ganze Insel, um vierzig Felder Küste
   zu sehen. */
const CHUNK=24;
function chunkOf(pts,n){
  const cs=[];
  for(let a=0;a<n-1;a+=CHUNK){
    const b=Math.min(n-1,a+CHUNK);
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    for(let i=a;i<=b;i++){const p=pts[i];
      if(p[0]<x0)x0=p[0];if(p[0]>x1)x1=p[0];if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
    cs.push({a,b,box:[x0,y0,x1,y1]});
  }
  return cs;
}

function chaikin(pts,iter,closed){
  for(let k=0;k<iter;k++){
    const n=pts.length,out=[];
    if(!closed)out.push(pts[0]);
    const last=closed?n:n-1;
    for(let i=0;i<last;i++){
      const p=pts[i],q=pts[(i+1)%n];
      out.push([p[0]*0.75+q[0]*0.25,p[1]*0.75+q[1]*0.25],
               [p[0]*0.25+q[0]*0.75,p[1]*0.25+q[1]*0.75]);
    }
    if(!closed)out.push(pts[n-1]);
    pts=out;
  }
  return pts;
}

/* Die Konturen einer Welt. EINMAL für Land und Sandsaum, beide aus demselben Feld und derselben
   Rauschschwelle — sonst stünde der Saum wieder woanders als die Küste.
   Rückgabe je Ring: Punkte in FELD-Koordinaten (unabhängig von TILE und Maskenauflösung),
   Neigung je Punkt, Bounding Box, und ob er geschlossen ist. */
function bakeCoast(land,W,H){
  const t0=performance.now();
  const GW=W*P+1,GH=H*P+1;
  const n1=vnoise(P*2.4),n2=vnoise(P*0.8);
  /* Weiches Landfeld ohne Canvas: ein gewichteter 3×3-Kasten über dem Feldgitter, danach
     bilinear abgetastet. Bikubisch wäre Zuckerguss — der Kasten rundet genauso. */
  const SW=W+2;
  const mkSoft=pred=>{
    /* Ein Feld Rahmen ist immer Wasser. Ohne das berührt die Insel gelegentlich den Kartenrand,
       der Ring bleibt OFFEN, und ein offener Ring kippt die evenodd-Füllung des ganzen Stapels
       (gemessen: 2 von 28 Ringen offen, Landfläche kleiner als die Grasfläche darin). */
    const raw=(x,y)=>(x<1||y<1||x>=W-1||y>=H-1)?0:(pred(land[y*W+x])?1:0);
    const f=new Float32Array((W+2)*(H+2));
    for(let y=-1;y<=H;y++)for(let x=-1;x<=W;x++){
      let s=0;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)
        s+=raw(x+dx,y+dy)*((dx&&dy)?0.6:((dx||dy)?1:1.8));
      f[(y+1)*SW+(x+1)]=s/8.4;
    }
    return f;
  };
  const sample=(f,fx,fy)=>{
    const x=Math.max(-1,Math.min(W,fx)),y=Math.max(-1,Math.min(H,fy));
    const ix=Math.floor(x),iy=Math.floor(y),tx=x-ix,ty=y-iy;
    const c=(gx,gy)=>f[Math.min(H+1,Math.max(0,gy+1))*SW+Math.min(W+1,Math.max(0,gx+1))];
    return c(ix,iy)*(1-tx)*(1-ty)+c(ix+1,iy)*tx*(1-ty)+c(ix,iy+1)*(1-tx)*ty+c(ix+1,iy+1)*tx*ty;
  };
  const thrAt=(gx,gy)=>0.5+(n1(gx,gy)-0.5)*0.26+(n2(gx,gy)-0.5)*0.09;

  const ringsOf=pred=>{
    const f=mkSoft(pred);
    const field=(gx,gy)=>sample(f,gx/P-0.5,gy/P-0.5)-thrAt(gx,gy);
    const V=new Float32Array(GW*GH);
    for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)V[y*GW+x]=field(x,y);
    const out=[];
    for(let raw of chainSegs(traceIso(V,GW,GH))){
      const closed=Math.abs(raw[0][0]-raw[raw.length-1][0])<1e-6&&
                   Math.abs(raw[0][1]-raw[raw.length-1][1])<1e-6;
      if(closed)raw=raw.slice(0,-1);
      /* Kleine Ringe brauchen MEHR Glättung, nicht weniger. Ein Wassergraben von zwei Feldern hat
         nach Marching Squares rund zwei Dutzend Segmente, und die Zickzacks an den Zellgrenzen
         sind bei so wenigen Punkten ein großer Anteil der Form — gemessen Richtungswechsel bis
         **144°** trotz Ausdünn-Rettung. Zwei Durchgänge glätten das nicht weg, vier schon. */
      const sm=chaikin(raw,raw.length<90?4:2,closed);
      if(sm.length<10)continue;
      /* Ausdünnen. Chaikin vervierfacht die Punktzahl je Durchgang — aus 4 Punkten je Feld werden
         16, und die Inselkontur hatte 16 644. Ein Pfad mit so vielen Quads kostete **1350 ms je
         Frame** (gemessen). Ein Punkt alle 0,22 Felder ≈ 14 Weltpixel ist feiner, als die Feder
         breit ist; alles darunter ist Rechenzeit ohne Bild. */
      const th=thin(sm,0.22*P,28);
      if(th.length<8)continue;
      const n=th.length;
      const pts=new Array(n),sh=new Float32Array(n);
      let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
      for(let i=0;i<n;i++){
        const gx=th[i][0],gy=th[i][1];
        const fx=gx/P,fy=gy/P;
        pts[i]=[fx,fy];
        if(fx<x0)x0=fx;if(fx>x1)x1=fx;if(fy<y0)y0=fy;if(fy>y1)y1=fy;
        const gyv=field(gx,gy+1)-field(gx,gy-1);
        const gxv=field(gx+1,gy)-field(gx-1,gy);
        const gl=Math.sqrt(gxv*gxv+gyv*gyv)||1;
        sh[i]=-gyv/gl;               // +1 Südkante (Schatten) … −1 Nordkante (Licht)
      }
      out.push({pts,sh,n,closed,box:[x0,y0,x1,y1],chunks:chunkOf(pts,n)});
    }
    return {rings:out,field};
  };
  const L=ringsOf(v=>v>=1),G=ringsOf(v=>v===2);
  const res={land:L.rings,grass:G.rings,fieldLand:L.field,fieldGrass:G.field};
  const cnt=a=>a.reduce((s,r)=>s+r.n,0);
  console.log('[terrain] Konturen ·',res.land.length,'Land-Ringe /',cnt(res.land),'Punkte ·',
    res.grass.length,'Gras-Ringe /',cnt(res.grass),'Punkte ·',((performance.now()-t0)|0)+' ms');
  return res;
}

// ── Der Stapel ──────────────────────────────────────────────────────────────────────────────
/* Eine Zeile je Ebene. Die Schattenfarbe ist eine dunklere Variante der Fläche DARUNTER —
   farb-agnostisch im Sinne Georgs: sie modelliert Höhe, nicht Material.

   Georgs Rezept, wörtlich: »die Sandfläche duplizieren, mit einem Gaußschen Weichzeichner
   versehen und ein paar Steps nach rechts und nach unten verschieben — oder in Photoshop direkt
   die Drop-Shadow-Funktion nehmen.« Canvas hat sie: `shadowColor/OffsetX/OffsetY/Blur`. Dieselbe
   Konstruktion, ein Aufruf, kein zweites Canvas.

   `off` ist die behauptete Höhe der Stufe (7.8.: ein Drittel größer als S9).
   `lean` ist der seitliche Anteil: das Licht steht oben-links, der Schatten fällt nach
   rechts-unten. Damit wird er an waagerechten Kanten breit, an senkrechten schmal und an
   Nordkanten unsichtbar (er fällt unter die eigene Fläche) — genau Georgs Beobachtung, dass er
   »nach hinten dünner« wird. Das ergibt sich aus der Richtung; es muss nicht je Punkt gerechnet
   werden. */
const LAYERS=[
  {id:'land', rings:'land', tile:'sand',
   shadow:{off:0.27,lean:0.34,blur:0.30,color:'rgba(28,88,94,0.62)'},
   bevel:{size:0.09,blur:0.11,light:'rgba(255,246,214,0.50)',dark:'rgba(96,66,32,0.34)'}},
  {id:'grass',rings:'grass',tile:'grass',
   shadow:{off:0.19,lean:0.34,blur:0.22,color:'rgba(150,120,78,0.58)'},
   bevel:{size:0.08,blur:0.10,light:'rgba(232,255,196,0.42)',dark:'rgba(46,74,30,0.30)'}},
];

/* Die Ringe als LÖCHER in einen schon begonnenen Pfad legen (für Inverse-Clips). Dieselbe
   Auslenkung wie pathRings — sonst wanderte die Beule aus dem Clip heraus. */
function holeRings(ctx,rings,T){
  const R=RB();
  for(const r of rings){
    const p=r.pts,warp=R&&R.busy(r);
    ctx.moveTo((p[0][0]+(warp?R.dx(r,0):0))*T,(p[0][1]+(warp?R.dy(r,0):0))*T);
    for(let i=1;i<r.n;i++)
      ctx.lineTo((p[i][0]+(warp?R.dx(r,i):0))*T,(p[i][1]+(warp?R.dy(r,i):0))*T);
    ctx.closePath();
  }
}

/* Bevel & Emboss, Georgs zweiter Photoshop-Griff: »man kann mit Bevel and Emboss auch eine
   gewisse Tiefe erzeugen, obwohl man eigentlich nur Flächen hat.«

   Derselbe Schatten, nur nach innen. Der Trick ist eine Zeile: auf die Fläche clippen und dann
   das INVERSE der Kontur füllen (Riesenrechteck mit der Kontur als Loch, evenodd). Das Rechteck
   liegt außerhalb des Clips und ist unsichtbar — nur sein Schlagschatten fällt nach innen und
   legt sich als Kante an den Rand. Zweimal: hell von oben-links, dunkel von unten-rechts. */
function innerEdge(ctx,P2,dx,dy,blur,color){
  ctx.save();
  ctx.clip(P2.solid,'evenodd');
  ctx.shadowColor=color;ctx.shadowOffsetX=dx;ctx.shadowOffsetY=dy;ctx.shadowBlur=blur;
  ctx.fillStyle='#000';
  ctx.fill(P2.inv,'evenodd');
  ctx.restore();
}

/* Die Stile der Küstenlinie. Halbbreite in FELD-Einheiten (1 = ein Spielfeld), damit keine Zahl
   an TILE hängt. Die Farbe ist aus dem Sandton abgeleitet, nicht erfunden: #d9bc8a auf ein
   Viertel Helligkeit. */
const INK_STYLES={
  /* v10 (Georg 9.8.): die Terrainkante darf **dicker** sein als die Karte — sie ist die Kante der
   Welt, nicht die eines Blattes. `half` ist die Grund-Halbbreite in FELDERN; die Spitze liegt bei
   rund dem 1,6-fachen (Schwellung 0,40 + 0,19). 0,015 → 0,019 hebt die dickste Stelle von gut
   3 auf knapp 4 px bei Zoom 1. */
  feather:{half:0.019,bias:0.92,color:'#4a3218',alpha:0.95},
  hard:   {half:0.022,bias:0,   color:'#1f1a14',alpha:0.85},
  off:    null,
};
const styleOf=s=>(s in INK_STYLES)?s:'feather';

function masks(key,land,W,H,style){
  const st=styleOf(style),base=key||('w'+W+'x'+H);
  const coast=coastCache[base]||(coastCache[base]=bakeCoast(land,W,H));
  const R=RB();
  if(R)R.attach(coast.land,base);      // die Federkette hängt an der Landkontur
  return {coast,W,H,style:st,ink:INK_STYLES[st]};
}

/* Alle Ringe einer Ebene als EIN Pfad, in Weltpixeln, optional nach unten versetzt.
   Ohne Sichtbarkeitsfilter, mit Absicht: fehlt der Ring, der den Bildausschnitt umschließt,
   wird gar nichts gefüllt — die Kamera steht dann mitten im Land und sieht Wasser. */
/* Die Auslenkung der Gummiband-Küste (V6-S12). Sie kommt aus `rubber-coast.js` und wirkt HIER —
   an der einen Stelle, an der die Kontur zu Pixeln wird. Damit beulen Fläche, Tuschefeder und
   Schlagschatten zusammen aus, ohne dass irgendetwas synchronisiert werden müsste: es gibt nur
   eine Geometrie. Ohne das Modul ist `RB` null und alles läuft wie vorher. */
const RB=()=>window.OW_RUBBER;

/* Der Pfad wird EINMAL gebaut und als Path2D behalten. Vorher entstand er sechsmal je Frame —
   zwei Clips je Ebene plus zwei Bevel-Durchgänge, jedes Mal 5 173 `lineTo`. Gemessen: `draw`
   4,8 ms von 7,7 ms Gesamtframe. Die Kontur ändert sich aber nur, wenn das Gummiband arbeitet;
   in jedem anderen Frame ist sie dieselbe wie im letzten. */
const p2dCache=new Map();
function ringsPath2D(rings,T){
  const R=RB();
  const live=!!(R&&rings.some(r=>R.busy(r)));
  const e=p2dCache.get(rings);
  if(e&&e.T===T&&!live&&!e.live)return e;
  const solid=new Path2D(),inv=new Path2D();
  inv.rect(-1e5,-1e5,2e5,2e5);
  for(const r of rings){
    const p=r.pts,warp=live&&R.busy(r);
    const X=i=>(p[i][0]+(warp?R.dx(r,i):0))*T, Y=i=>(p[i][1]+(warp?R.dy(r,i):0))*T;
    solid.moveTo(X(0),Y(0));inv.moveTo(X(0),Y(0));
    for(let i=1;i<r.n;i++){const x=X(i),y=Y(i);solid.lineTo(x,y);inv.lineTo(x,y);}
    solid.closePath();inv.closePath();
  }
  const out={solid,inv,T,live};
  p2dCache.set(rings,out);
  return out;
}

function pathRings(ctx,rings,T,dx,dy){
  const R=RB();
  ctx.beginPath();
  for(const r of rings){
    const p=r.pts,warp=R&&R.busy(r);
    if(!warp){
      ctx.moveTo(p[0][0]*T+dx,p[0][1]*T+dy);
      for(let i=1;i<r.n;i++)ctx.lineTo(p[i][0]*T+dx,p[i][1]*T+dy);
    }else{
      ctx.moveTo((p[0][0]+R.dx(r,0))*T+dx,(p[0][1]+R.dy(r,0))*T+dy);
      for(let i=1;i<r.n;i++)
        ctx.lineTo((p[i][0]+R.dx(r,i))*T+dx,(p[i][1]+R.dy(r,i))*T+dy);
    }
    ctx.closePath();
  }
}

/* Textur, in WELTkoordinaten verankert — sonst wandert das Muster mit der Kamera (der Fehler,
   der jedem Parallax-Boden passiert).
   v10-S1: zwei Wege, damit man sie gegeneinander messen kann — `createPattern`+`fillRect` (wie
   bisher) oder die Kachel einzeln gelegt (`drawImage` im Raster, bei 512er Kachel und diesem
   Ausschnitt rund neun Aufrufe). Die Bodenschicht ist die teuerste im Bild (gemessen 12 von 29 ms
   im Wechselvergleich), und davon ist genau diese eine Füllung fast alles. */
let FUELLART='muster';
function fillPattern(ctx,tile,x0,y0,w,h,T){
  const ox=Math.floor(x0*T/tile.width)*tile.width;
  const oy=Math.floor(y0*T/tile.height)*tile.height;
  const bx=(x0+w)*T+tile.width, by=(y0+h)*T+tile.height;
  if(FUELLART==='kacheln'){
    for(let py=oy;py<by;py+=tile.height)
      for(let px=ox;px<bx;px+=tile.width)ctx.drawImage(tile,px,py);
    return;
  }
  ctx.save();
  ctx.translate(ox,oy);
  ctx.fillStyle=ctx.createPattern(tile,'repeat');
  ctx.fillRect(0,0,bx-ox,by-oy);
  ctx.restore();
}

/* Wasser: ein WABERN, keine Striche und kein Gitter.

   Zwei Fehlversuche, beide am Bild widerlegt:
     1. Parallele weiße Spiegelstriche. Georg: »genau das, was ich nicht wollte — unabhängig von
        der Konstruktionsform weitere Konstrukte hineingebastelt.« Ein Strich ist eine Behauptung
        über eine Form; Wasser hat keine.
     2. Drei reine Sinuswellen, zweimal gekachelt und gegenläufig driftend. Der Kommentar behaup-
        tete eine Schwebung ohne fassbare Periode — gemessen kam ein Streifenabstand von **37–45 px
        bei Amplitude 131–143 Luma** heraus, also ein diagonaler Cord. Der erste Term dominierte
        mit halber Amplitude alles andere. **Zwei regelmäßige Gitter übereinander bleiben zwei
        regelmäßige Gitter.**

   Jetzt kachelbares WERTRAUSCHEN in drei Oktaven: keine Raumfrequenz dominiert, es gibt keinen
   Abstand, den man messen könnte. Zwei Lagen in verschiedenem Maßstab driften gegenläufig.
   Kachelbar wird es dadurch, dass der Hash seine Koordinaten modulo der Zellenzahl nimmt — sonst
   hätte die Kachel eine Naht, und eine Naht ist wieder ein Gitter. */
let waveTile=null;
function tileNoise(cells){
  const h=(x,y)=>{
    x=((x%cells)+cells)%cells; y=((y%cells)+cells)%cells;
    let n=x*374761393+y*668265263;
    n=Math.imul(n^(n>>>13),1274126177);
    return((n^(n>>>16))>>>0)/4294967296;
  };
  return (fx,fy)=>{
    const ix=Math.floor(fx),iy=Math.floor(fy),tx=fx-ix,ty=fy-iy;
    const sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);
    const a=h(ix,iy),b=h(ix+1,iy),c=h(ix,iy+1),d=h(ix+1,iy+1);
    return a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy;
  };
}
function waterTile(){
  if(waveTile)return waveTile;
  const N=256,c=mk(N,N),x=c.getContext('2d');
  const img=x.createImageData(N,N),d=img.data;
  const n4=tileNoise(4),n8=tileNoise(8),n16=tileNoise(16);
  for(let y=0;y<N;y++)for(let xx=0;xx<N;xx++){
    const u=xx/N,v=y/N;
    const s=0.55*n4(u*4,v*4)+0.28*n8(u*8,v*8)+0.17*n16(u*16,v*16);
    /* Nur die Kuppen glitzern. Die Schwelle war erst 0,56 MIT Quadrierung MIT gesenkter Deckung
       MIT gesenkten Lagen-Alphas — vier Reduktionen gleichzeitig, und gemessen kam ein Maximum von
       **5 von 255** heraus: nichts. Von einem Gitter direkt in die Unsichtbarkeit. Jetzt eine
       lineare Rampe ab 0,50; die Summe der drei Oktaven liegt bei höchstens ~0,75, also trifft
       die Rampe den ganzen brauchbaren Bereich. */
    const a=Math.min(1,Math.max(0,(s-0.50)/0.25));
    const i=((y*N+xx)<<2);
    d[i]=d[i+1]=d[i+2]=255;
    d[i+3]=Math.round(200*a);
  }
  x.putImageData(img,0,0);
  return (waveTile=c);
}

function drawWater(ctx,o,t){
  const {W,H,TILE:T,x0,y0,x1,y1,key,land}=o;
  if(!land)return;
  const m=masks(key,land,W,H,o.inkStyle);
  const tile=waterTile();
  const px0=Math.max(0,x0-1),py0=Math.max(0,y0-1);
  const px1=Math.min(W-1,x1+1),py1=Math.min(H-1,y1+1);
  const w=(px1-px0+1)*T,h=(py1-py0+1)*T;
  if(w<=0||h<=0)return;
  ctx.save();
  /* Nur auf dem Wasser: das Inverse der Landkontur. Derselbe Clip-Trick wie beim Schatten —
     Riesenrechteck mit der Kontur als Loch. */
  ctx.clip(ringsPath2D(m.coast.land,T).inv,'evenodd');
  const pat=ctx.createPattern(tile,'repeat');
  const lay=(sx,sy,al,sc)=>{
    ctx.save();
    ctx.globalAlpha=al;
    ctx.translate(sx,sy);
    ctx.scale(sc,sc);
    ctx.fillStyle=pat;
    ctx.fillRect((px0*T-sx)/sc-tile.width,(py0*T-sy)/sc-tile.height,
                 w/sc+2*tile.width,h/sc+2*tile.height);
    ctx.restore();
  };
  lay( (t*7)%1024, (t*4)%1024, 0.11, T/48);
  lay(-(t*5)%1024, (t*9)%1024, 0.085, T/31);
  ctx.restore();
}

/* ── v10-S1 · WAS AN DER BODENSCHICHT WIRKLICH KOSTET ────────────────────────────────────
   Gemessen am 9.8. mit `OW_SPOT` (fester Standpunkt, Zeichenzeit MIT Spülung — also inklusive
   Rasterung —, Varianten im Wechsel): die Bodenschicht ist die teuerste im Bild, 12 von 29 ms auf
   freiem Feld. Nicht der Clip auf die 6150-Punkt-Kontur, nicht Wurfschatten, nicht Bevel: die
   **Fläche**. Wer hier optimieren will, muss Pixel sparen, nicht Pfade. */
function draw(ctx,o){
  const {land,W,H,TILE:T,x0,y0,x1,y1,key}=o;
  const m=masks(key,land,W,H,o.inkStyle);
  const px0=Math.max(0,x0-1),py0=Math.max(0,y0-1);
  const px1=Math.min(W-1,x1+1),py1=Math.min(H-1,y1+1);
  const w=px1-px0+1,h=py1-py0+1;
  if(w<=0||h<=0)return 0;
  const tiles={sand:o.sand,grass:o.grass};
  /* v10-S1, gemessen und verworfen: ein Kurzweg, der im Landesinneren Clip, Wurfschatten und Bevel
     weglässt (dort ist keine Kante im Bild), brachte im Wechselvergleich −1 ms bei ±6 ms Rauschen —
     also nichts. Die Kette ist nicht durch ihre Pfade teuer, sondern durch die FLÄCHE: eine
     Vollbild-Füllung mit Textur kostet ~12 ms, ob als Muster oder als gelegte Kacheln (beide
     gemessen, identisch). Der Code ist wieder raus; die Zahl bleibt hier stehen. */
  for(const L of LAYERS){
    const rings=m.coast[L.rings];
    if(!rings||!rings.length)continue;
    const P2=ringsPath2D(rings,T);
    /* Schatten zuerst. Gezeichnet wird er mit einem Clip auf das ÄUSSERE der Fläche.

       Georg 7.8.: »durch das Bevel ist dann im Sand doch noch eine blaue Linie zu sehen.« Die kam
       daher, dass `fill()` mit Schatten auch die FLÄCHE in der Schattenfarbe füllt — ein blaues
       Duplikat unter dem Sand. Wo der Sand an der Kante nur zu 90 % deckt (Antialiasing), blitzte
       es durch. Der Clip auf das Inverse lässt nur den Schatten nach außen; die blaue Fläche liegt
       außerhalb und existiert nicht mehr im Bild.

       `shadowOffset` wird von der Canvas-Transform NICHT erfasst — der Kamera-Zoom muss selbst
       hinein, sonst wandert die Höhe beim Zoomen. */
    if(L.shadow&&o.shadows!==false){
      const SH=L.shadow,z=(ctx.getTransform&&ctx.getTransform().a)||1;
      ctx.save();
      ctx.clip(P2.inv,'evenodd');               // nur außerhalb der eigenen Fläche
      ctx.shadowColor=SH.color;
      ctx.shadowOffsetX=SH.off*SH.lean*T*z;
      ctx.shadowOffsetY=SH.off*T*z;
      ctx.shadowBlur=SH.blur*T*z;
      ctx.fillStyle=SH.color;
      ctx.fill(P2.solid,'evenodd');
      ctx.restore();
    }
    const tile=tiles[L.tile];
    if(!tile)continue;
    ctx.save();
    ctx.clip(P2.solid,'evenodd');
    fillPattern(ctx,tile,px0,py0,w,h,T);
    ctx.restore();
    /* Bevel zuletzt, ÜBER der Textur: es ist Licht auf der Fläche, nicht unter ihr.
       Ein Bevel unter der Textur wäre ein Untergrund, kein Relief. */
    if(L.bevel&&o.relief==='bevel'){
      const B=L.bevel,z=(ctx.getTransform&&ctx.getTransform().a)||1;
      const s=B.size*T*z,bl=B.blur*T*z;
      innerEdge(ctx,P2, s, s,bl,B.light);        // Licht von oben-links
      innerEdge(ctx,P2,-s,-s,bl,B.dark);         // Schatten unten-rechts
    }
  }
  return w*h;
}

// ── Die Feder ───────────────────────────────────────────────────────────────────────────────
/* Die Halbbreite je Punkt. inkRibbon2D aus dem Kanon nimmt eine halfFn entgegen — eine eigene
   zu übergeben ist vorgesehen, nicht ein Bruch mit dem Kanon; das Band bleibt sein Band.

   Warum nicht inkHalfWidth: dessen Modulation zählt Perioden PRO UMFANG (k ≈ 3–13). Auf einer
   Kartenkante ist das die Tusche-Dynamik; auf einem Inselumfang von hunderten Feldern ist eine
   Periode so lang, dass die Linie im Bildausschnitt gleich dick läuft — genau der Befund »ich
   sehe kein Tapering«. Hier zählt die Modulation in FELDERN: lang alle ~7, kurz alle ~2,4.

   Drei Faktoren, multiplikativ: Neigung (Licht von oben) · Schwellung (die geführte Hand) ·
   Auslauf an offenen Enden. */
function halfWidths(r,K,seed){
  const n=r.n,cum=new Float32Array(n);
  for(let i=1;i<n;i++)
    cum[i]=cum[i-1]+Math.hypot(r.pts[i][0]-r.pts[i-1][0],r.pts[i][1]-r.pts[i-1][1]);
  const tot=cum[n-1]||1;
  let s0=seed>>>0;
  const rnd=()=>{s0=(Math.imul(s0,1664525)+1013904223)>>>0;return s0/4294967296;};
  const q1=rnd()*6.283,q2=rnd()*6.283,TAU=Math.PI*2;
  const out=new Float32Array(n);
  for(let i=0;i<n;i++){
    const s=cum[i];
    const swell=1+0.40*Math.sin(TAU*s/7.0+q1)+0.19*Math.sin(TAU*s/2.4+q2);
    const tilt=1+r.sh[i]*K.bias;
    let taper=1;
    if(!r.closed){const d=Math.min(s,tot-s);taper=Math.min(1,d/1.6);taper*=taper;}
    out[i]=Math.max(0.0035,K.half*swell*tilt*taper);
  }
  return out;
}

/* inkRibbon2D aus dem Kanon, auf einen INDEXBEREICH eingeschränkt. Der Kanon zeichnet eine
   geschlossene Kartenkontur in einem Pfad — auf einer Weltkarte sind das 16 000 Quads je Frame
   und 1350 ms (gemessen). Die Geometrie ist unverändert seine: Quad je Segment zwischen innerer
   und äußerer Offsetkurve, alle Quads in EINEM Pfad, EIN fill(). Nur der Umlauf ist offen. */
function ribbonRun(g,pts,n,closed,hw,a,b,k,ring){
  const R=(ring&&RB()&&RB().busy(ring))?RB():null;
  const raw=j=>pts[closed?((j%n)+n)%n:Math.max(0,Math.min(n-1,j))];
  const at=R?(j=>{const i=closed?((j%n)+n)%n:Math.max(0,Math.min(n-1,j));
    const p=pts[i];return[p[0]+R.dx(ring,i),p[1]+R.dy(ring,i)];}):raw;
  const off=(j,s)=>{
    const pp=at(j-1),cc=at(j),pn=at(j+1);
    let d1x=cc[0]-pp[0],d1y=cc[1]-pp[1];const l1=Math.hypot(d1x,d1y)||1;d1x/=l1;d1y/=l1;
    let d2x=pn[0]-cc[0],d2y=pn[1]-cc[1];const l2=Math.hypot(d2x,d2y)||1;d2x/=l2;d2y/=l2;
    const n1x=-d1y,n1y=d1x,n2x=-d2y,n2y=d2x;
    let mx=n1x+n2x,my=n1y+n2y;const ml=Math.hypot(mx,my)||1;mx/=ml;my/=ml;
    const ext=hw[((j%n)+n)%n]*k/Math.max(mx*n1x+my*n1y,0.35)*s;
    return[cc[0]+mx*ext,cc[1]+my*ext];
  };
  for(let i=a;i<b;i++){
    const o1=off(i,1),i1=off(i,-1),o2=off(i+1,1),i2=off(i+1,-1);
    g.moveTo(o1[0],o1[1]);g.lineTo(i1[0],i1[1]);g.lineTo(i2[0],i2[1]);g.lineTo(o2[0],o2[1]);
    g.closePath();
  }
}

function drawInk(ctx,o){
  const {W,H,TILE,x0,y0,x1,y1,key,land}=o;
  const m=masks(key,land,W,H,o.inkStyle);
  const K=m.ink;
  if(!K||!canon())return;
  const vis=m.coast.land.filter(r=>r.box[2]>=x0-2&&r.box[0]<=x1+2&&r.box[3]>=y0-2&&r.box[1]<=y1+2);
  if(!vis.length)return;
  ctx.save();
  ctx.scale(TILE,TILE);              // ab hier ist eine Einheit ein Spielfeld
  /* DIE EINE REGEL DES KANONS: »Die Tusche liegt auf der BILDEBENE, nicht in der Welt. Eine
     gezeichnete Linie auf Papier hat überall dieselbe Feder.« Die Halbbreiten stehen in Feldern,
     also schrumpften sie beim Herauszoomen mit — bei Zoom 0,65 war die Feder 1,3 statt 2 px und
     verschwand neben dem Schatten. Der Zoom wird herausgerechnet: die Feder bleibt auf dem Blatt
     gleich breit, egal wie weit man weggeht. */
  const z0=(ctx.getTransform&&ctx.getTransform().a)||TILE;
  const zoom=z0/TILE||1;
  const k=1/zoom;
  ctx.globalAlpha=K.alpha;
  ctx.fillStyle=K.color;
  ctx.beginPath();
  let quads=0;
  for(const r of vis){
    if(!r.hw)r.hw=halfWidths(r,K,(r.n*2654435761+((r.box[0]*977)|0))|0);
    let a=-1,b=-1;
    for(const c of r.chunks){
      const seen=c.box[2]>=x0-1&&c.box[0]<=x1+1&&c.box[3]>=y0-1&&c.box[1]<=y1+1;
      if(seen){if(a<0)a=c.a;b=c.b;}
      else if(a>=0){ribbonRun(ctx,r.pts,r.n,r.closed,r.hw,a,b,k,r);quads+=b-a;a=-1;}
    }
    if(a>=0){ribbonRun(ctx,r.pts,r.n,r.closed,r.hw,a,b,k,r);quads+=b-a;}
  }
  ctx.fill();
  ctx.restore();
  o.inkQuads=quads;
}

/* Eine Zonenpalette, an der Landkontur beschnitten — damit ein Biom keine Rechtecke hat.
   Die Zone endet, wo das Land endet, nicht wo ihr Rechteck endet (§27.1). */
function fillZone(ctx,tile,o,rect,alpha){
  const {land,W,H,TILE:T,key}=o;
  const m=masks(key,land,W,H,o.inkStyle);
  const zx0=Math.max(0,Math.floor(rect.x/T)),zy0=Math.max(0,Math.floor(rect.y/T));
  const zx1=Math.min(W-1,Math.ceil((rect.x+rect.w)/T)-1);
  const zy1=Math.min(H-1,Math.ceil((rect.y+rect.h)/T)-1);
  const w=zx1-zx0+1,h=zy1-zy0+1;
  if(w<=0||h<=0)return false;
  ctx.save();
  ctx.beginPath();ctx.rect(rect.x,rect.y,rect.w,rect.h);ctx.clip();
  ctx.clip(ringsPath2D(m.coast.land,T).solid,'evenodd');
  if(alpha!=null)ctx.globalAlpha=alpha;
  fillPattern(ctx,tile,zx0,zy0,w,h,T);
  ctx.restore();
  return true;
}

/* Clip auf Wasser bzw. Land, aus DERSELBEN Kontur wie drawWater und die Feder. Wer sich seinen
   eigenen Clip aus dem land[]-Raster baut, bekommt die Kachel-Treppe (Befund Georg, 8.8.: das
   Fluid lag als Bloecke ueber der geglaetteten Kueste). Kostet nichts extra — der Path2D ist
   derselbe gecachte wie im Wasserzweig. */
function clipTo(ctx,o,welche){
  const {W,H,TILE:T,land}=o;
  if(!land)return false;
  const m=masks(o.key,land,W,H,o.inkStyle);
  const rings=m.coast&&m.coast.land;
  if(!rings||!rings.length)return false;
  const P2=ringsPath2D(rings,T);
  ctx.clip(welche==='land'?P2.solid:P2.inv,'evenodd');
  return true;
}

window.OW_TERRAIN={version:'tp-v4.5',S,P,LAYERS,masks,draw,drawInk,drawWater,fillZone,INK_STYLES,
  get fuellart(){return FUELLART;},set fuellart(v){FUELLART=(v==='kacheln')?'kacheln':'muster';},
  clipWater:(ctx,o)=>clipTo(ctx,o,'water'),
  clipLand:(ctx,o)=>clipTo(ctx,o,'land'),
  clear(){for(const k in cache)delete cache[k];for(const k in coastCache)delete coastCache[k];
    p2dCache.clear();},
  note:'Ebenenstapel: je Stufe ein harter Schatten und eine Vektorfläche, geclippt auf DIESELBE '+
       'Kontur, die auch die Feder trägt. Keine Masken, keine Verläufe, keine Backauflösung.'};
})();
