/* KFB Overworld — Dungeon (dg-v2.0, V5-S8b, Masterplan §24)
   **Ein Innenraum ist eine zweite Welt in denselben Feldern.** Kein zweiter Maßstab, kein zweiter
   Renderer, kein zweiter Kollisionsweg: das Innere liefert dieselben zwei Felder wie draußen
   (`land` begehbar, `blocked` versperrt) auf demselben 64er-Gitter. Damit gelten A*, Fußpunkt,
   Mob-KI, y-Sortierung und Schatten unverändert.

   ── Was sich gegenüber dg-v1.0 geändert hat, und warum ──────────────────────────
   v1 hat die Wand als EINE Ebene gelegt und dafür den falschen Nine-Slice benutzt. Georgs zwei
   Promo-Bilder des Packs zeigen die Regel, die das Blatt tatsächlich meint:

   **Eine Wand ist zwei Ebenen, und sie zeigt nach Süden.**
   Man blickt von unten auf den Raum. Also sieht man von der NORDwand ihre Vorderseite (gemauert,
   mit Bögen, Türen und Fackeln), und von der SÜDwand nur ihre Krone von oben. v1 hatte genau das
   umgekehrt — deshalb wirkte die Kammer wie eine helle Platte mit hellem Rand.

   **Der Kachelvertrag**, abgelesen an `walls_floor.png` (13×23 Kacheln à 16 px):
   - **Krone** (0–2 × 0–2), Nine-Slice, dunkel — die Mauer von oben. Mitte (1,1) ist Wandinneres.
   - **Vorderwand** (0–2 × 3) oben und (0–2 × 4) unten — zwei Reihen, gemauert, links/Mitte/rechts.
     Die drei Spalten sind KEINE Varianten: 0 und 2 haben halbtransparente Außenkanten (gemessen an
     den Randspalten), mitten im Lauf stehen sie als Kerben.
   - **Boden** (1,10) als Vollkachel; (0–2 × 9–11) wäre der Nine-Slice, aber die Kante macht hier
     die Wand — ein Boden mit eigener Kante ergäbe eine doppelte Naht.
   - **Podest** (0–2 × 5–8): eine zweite Höhenstufe nach demselben Muster (Fläche · Sims ·
     Vorderwand). Ungenutzt — hier steht, was es ist, damit es niemand nochmal für die Mauer hält.
   - **Treppe** (2,13), in ihrer Kachel zentriert (2,15 sitzt links).

   `Objects.png` (24×6) und `fire_animation.png` sind Atlanten, keine Raster. Das Feuerblatt wurde
   **gemessen**, nicht geraten: vier Typen in den Spaltenläufen [5,28] [41,68] [87,121] [133,167],
   sechs Frames in den Zeilenläufen ab y = 4 · 51 · 98 · 148 · 195 · 242.

   Was dieses Modul NICHT tut: Zustand halten, Gegner setzen, den Helden bewegen, speichern. */
(function(){
'use strict';
const BASE='free-2d-top-down-pixel-dungeon-asset-pack/PNG/';
const T=16, SCALE=4, TILE=T*SCALE;   // 64 — dieselbe Zahl wie draußen

const CROWN=[0,0];      // Nine-Slice der Mauerkrone
const FACE_TOP=[0,3];   // Vorderwand, obere Reihe   (Spalten 0|1|2 = links|Mitte|rechts)
const FACE_BOT=[0,4];   // Vorderwand, untere Reihe
const FLOOR=[1,10];     // Bodenfläche (Grundton)
const STAIR=[2,13];
/* `decorative_cracks_floor.png` (8×15) heißt Risse und ist in Wahrheit die **Bodentextur**:
   Zeilen 3–6 sind vollflächige Steinplatten in 32 Varianten (derselbe Ton wie der Grundboden),
   Zeilen 8–10 sind halbtransparente Flecken zum Darüberlegen. Ohne sie ist der Boden eine leere
   Fläche — genau der Unterschied zur Vorlage. */
const SLAB={c:8,r0:3,r1:6};
const GRIME={c:8,r0:8,r1:10};

// Requisiten: nur Kacheln, die genau EIN Feld füllen (die großen Kisten und Truhen im Atlas
// greifen über zwei Felder — die kämen halbiert heraus).
const PROPS=[
  {sx:11,sy:4,w:1,h:1,n:'jug'},   {sx:12,sy:4,w:1,h:1,n:'jug small'},
  {sx:15,sy:4,w:1,h:1,n:'sack'},  {sx:16,sy:4,w:1,h:1,n:'sack small'},
  {sx:14,sy:2,w:1,h:1,n:'gold'},  {sx:15,sy:2,w:1,h:1,n:'gold small'},
  {sx:5, sy:4,w:1,h:1,n:'barrel'},
];
// Feuer, gemessen (siehe Kopf). Typ 0 = Fackel, Typ 2 = Lagerfeuer.
const FIRE_X=[[5,24],[41,28],[87,35],[133,35]];
const FIRE_Y=[4,51,98,148,195,242];
const FIRE_H=39;

const sheets={};
let pending=null;

function loadImg(url){return new Promise((res,rej)=>{const i=new Image();i.crossOrigin='anonymous';
  i.onload=()=>res(i);i.onerror=()=>rej(new Error('fehlt: '+url));i.src=url;});}

function ready(){
  if(sheets.walls)return Promise.resolve(sheets);
  if(pending)return pending;
  const u=f=>(window.OW_SRC?OW_SRC.a2d(BASE+f):BASE+f);
  pending=Promise.all([
    loadImg(u('walls_floor.png')).then(i=>sheets.walls=i),
    loadImg(u('decorative_cracks_floor.png')).then(i=>sheets.slabs=i).catch(e=>console.warn('[dungeon]',e.message)),
    loadImg(u('Objects.png')).then(i=>sheets.objects=i).catch(e=>console.warn('[dungeon]',e.message)),
    loadImg(u('fire_animation.png')).then(i=>sheets.fire=i).catch(e=>console.warn('[dungeon]',e.message)),
  ]).then(()=>{
    const w=sheets.walls;
    console.log('[dungeon] Blätter ·',w.width+'×'+w.height,'=',(w.width/T)+'×'+(w.height/T),
      'Kacheln · Maßstab ×'+SCALE+' → Feld '+TILE+'px · Platten',!!sheets.slabs,
      '· Objects',!!sheets.objects,'· Feuer',!!sheets.fire);
    return sheets;
  });
  return pending;
}

function rnd(seed){let a=seed|0;return()=>{a=(a+0x6D2B79F5)|0;
  let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;
  return((t^(t>>>14))>>>0)/4294967296;};}

/* Grundriss (§24): Kammer oben, Treppentunnel nach unten, Ausgang unten in der Mitte.

   Gebaut wird der BEGEHBARE Bereich; die Mauer entsteht daraus durch Aufdicken — nach Norden um
   drei Felder (Krone + zwei Reihen Vorderwand), sonst um eins. Wer die Wand von Hand setzt,
   pflegt sie an jedem neuen Grundriss noch einmal. */
function build(o){
  o=o||{};
  const seed=(o.seed==null?7:o.seed)|0, R=rnd(seed);
  /* `??`-Semantik von Hand: `o.x||default` schluckt jede explizite **0**. Gemessen: mit
     `tunnelLength:0` kam derselbe Raum heraus wie mit 6, der Treppenschacht blieb 6 Felder lang
     und 41 % der Abbildung standen leer. Ein Vorgabewert darf nur einspringen, wenn nichts
     übergeben wurde — nicht, wenn eine Null übergeben wurde. */
  const num=(v,d)=>(v==null?d:v|0);
  const roomW=num(o.roomW,11), roomH=num(o.roomH,7);   // begehbar
  const tunW=num(o.tunnelWidth,3), tunH=num(o.tunnelLength,6);
  const NORTH=3, SIDE=1, SOUTH=1;
  const W=Math.max(roomW,tunW)+2*SIDE, H=NORTH+roomH+tunH+SOUTH;
  const walkA=new Uint8Array(W*H);
  const rx0=((W-roomW)>>1), ry0=NORTH;
  const tx0=((W-tunW)>>1),  ty0=ry0+roomH;
  for(let y=0;y<roomH;y++)for(let x=0;x<roomW;x++)walkA[(ry0+y)*W+rx0+x]=1;
  for(let y=0;y<tunH;y++)for(let x=0;x<tunW;x++)walkA[(ty0+y)*W+tx0+x]=1;
  const walk=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&!!walkA[y*W+x];

  // Aufdicken: links/rechts 1, unten 1, oben 3 — die Nordwand trägt die Vorderseite
  const massA=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(walkA[y*W+x]){massA[y*W+x]=1;continue;}
    let hit=false;
    for(let dy=-SOUTH;dy<=NORTH&&!hit;dy++)for(let dx=-SIDE;dx<=SIDE;dx++)
      if(walk(x+dx,y+dy)){hit=true;break;}
    if(hit)massA[y*W+x]=1;
  }
  // Ohne Tunnel liegt der Ausgang in der Südwand der Kammer selbst
  const exit=tunH>0?{x:tx0+((tunW/2)|0),y:ty0+tunH-1}
                   :{x:rx0+((roomW/2)|0),y:ry0+roomH-1};
  // Unter dem Ausgang steht keine Mauer — dort ist das Loch, durch das man wieder hinausgeht
  if(exit.y+1<H)massA[(exit.y+1)*W+exit.x]=0;

  const ft=new Uint8Array(W*H), bl=new Uint8Array(W*H);
  for(let i=0;i<W*H;i++){
    if(walkA[i])ft[i]=(i>=ty0*W)?3:1;   // 1 Kammerboden · 3 Treppentunnel
    else if(massA[i]){ft[i]=2;bl[i]=1;}
  }
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)
    if(walkA[y*W+x]&&y>=ty0)ft[y*W+x]=3;

  const spawn={x:exit.x,y:exit.y-1};
  const guardAt={x:rx0+((roomW/2)|0),y:ry0+((roomH/2)|0)};

  // Requisiten an die Ränder der Kammer, nie auf den Weg zur Treppe und nie auf den Wächter
  const props=[];
  const busy=(x,y)=>(x===guardAt.x&&y===guardAt.y)||Math.abs(x-exit.x)<=1&&y>=ty0-1;
  for(let i=0;i<9;i++){
    const edge=R()<0.7;
    const x=rx0+(edge?(R()<0.5?0:roomW-1):Math.floor(R()*roomW));
    const y=ry0+Math.floor(R()*roomH);
    if(!walk(x,y)||busy(x,y))continue;
    if(props.some(p=>p.x===x&&p.y===y))continue;
    props.push({x,y,def:PROPS[Math.floor(R()*PROPS.length)]});
  }
  // Fackeln an der Vorderseite der Nordwand — dort, wo man sie in der Vorlage auch sieht
  const torches=[];
  for(let x=rx0+1;x<rx0+roomW-1;x+=3)torches.push({x,y:ry0-1});

  return{W,H,TILE,floorType:ft,blocked:bl,seed,spawn,exit,guardAt,props,torches,
    room:{x:rx0,y:ry0,w:roomW,h:roomH},tunnel:{x:tx0,y:ty0,w:tunW,h:tunH},
    walk:(x,y)=>walk(x,y),
    walkable(x,y){return walk(x,y);}};
}

/* Die Autotile-Formel gehört an EINE Stelle. Der Runner hält sie modul-privat als `autoTileIdx`;
   wer sie nachbaut, bekommt beim nächsten Fork zwei Wahrheiten — genau so ist die Wandregel im
   Biome-Labor auseinandergelaufen. Ab dg-v2.1 liegt sie hier und wird exportiert. */
function autoTile(N,E,S,W){
  return{col:(!W&&!E)?3:(!W?0:(!E?2:1)),row:(!N&&!S)?3:(!N?0:(!S?2:1))};
}
// Der Innenraum-Ton des Spiels, damit niemand ihn erfindet (draw() in overworld-game.js)
const DARK='#100e15';

const sliceCol=(l,r)=>!l?0:(!r?2:1);
const sliceRow=(u,d)=>!u?0:(!d?2:1);

/* Der Boden ist ein Bild, kein Zustand. Drei Durchgänge, damit nichts einander überschreibt:
   Boden → Vorderwand → Krone.
   `override` erlaubt umgefärbte Blätter (Biome-Labor, §Palette) — **eine** Implementierung der
   Wandregel für alle, die sie zeichnen. Zwei Nachbauten driften auseinander; das ist im Labor
   passiert, bevor es hier durchgereicht wurde. */
function drawFloor(ctx,int,x0,y0,x1,y1,override){
  const o=override||{};
  const img=o.walls||sheets.walls;
  if(!img)return 0;
  const W=int.W,H=int.H,ft=int.floorType;
  const at=(x,y)=>(x<0||y<0||x>=W||y>=H)?0:ft[y*W+x];
  const walk=(x,y)=>at(x,y)===1||at(x,y)===3;
  const face=(x,y)=>!walk(x,y)&&at(x,y)===2&&(walk(x,y+1)||walk(x,y+2));
  const crown=(x,y)=>at(x,y)===2&&!face(x,y);
  let n=0;
  const blit=(bx,by,x,y)=>{ctx.drawImage(img,bx*T,by*T,T,T,x*TILE,y*TILE,TILE,TILE);n++;};
  const sl=o.slabs||sheets.slabs;
  const blitSlab=(im,bx,by,x,y)=>{ctx.drawImage(im,bx*T,by*T,T,T,x*TILE,y*TILE,TILE,TILE);n++;};
  // Deterministisch aus der Feldkoordinate: derselbe Boden bei jedem Frame, kein Flackern
  const hash=(x,y,k)=>{let h=Math.imul(x*73856093^y*19349663^k*83492791,2654435761)>>>0;return h/4294967296;};

  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const v=at(x,y);
    if(v!==1&&v!==3)continue;
    if(v===3){
      blit(1,1,x,y);
      // Stufen nur in der Mitte des Gangs — drei Treppen nebeneinander lesen sich als Rost
      if(x===int.tunnel.x+((int.tunnel.w/2)|0))blit(STAIR[0],STAIR[1],x,y);
      continue;
    }
    blit(FLOOR[0],FLOOR[1],x,y);
    if(sl){
      // Sparsam: liegt auf jedem Feld eine andere Platte, wird der Boden ein Flickenteppich.
      // Die Vorlage zeigt überwiegend glatten Stein mit Gruppen von Platten dazwischen.
      if(hash(x,y,3)<0.38)
        blitSlab(sl,Math.floor(hash(x,y,1)*SLAB.c),SLAB.r0+Math.floor(hash(x,y,2)*(SLAB.r1-SLAB.r0+1)),x,y);
      if(hash(x,y,6)<0.16)
        blitSlab(sl,Math.floor(hash(x,y,4)*GRIME.c),GRIME.r0+Math.floor(hash(x,y,5)*(GRIME.r1-GRIME.r0+1)),x,y);
    }
  }
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    if(!face(x,y))continue;
    const col=sliceCol(face(x-1,y),face(x+1,y));
    const b=walk(x,y+1)?FACE_BOT:FACE_TOP;
    blit(b[0]+col,b[1],x,y);
  }
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    if(!crown(x,y))continue;
    blit(CROWN[0]+sliceCol(crown(x-1,y),crown(x+1,y)),
         CROWN[1]+sliceRow(crown(x,y-1),crown(x,y+1)),x,y);
  }
  return n;
}

/* Fackeln gehören zur Wand, nicht zu den Figuren: sie hängen darüber und werden nie verdeckt.
   Deshalb malt sie der Boden — mit ihrem Lichtschein, der in der Vorlage die halbe Miete ist. */
function drawTorches(ctx,int,time){
  const f=sheets.fire;
  if(!f||!int.torches)return;
  const [fx,fw]=FIRE_X[0];
  for(const t of int.torches){
    const cx=(t.x+0.5)*TILE, cy=(t.y+1)*TILE;
    const g=ctx.createRadialGradient(cx,cy,8,cx,cy,TILE*2.6);
    g.addColorStop(0,'rgba(255,196,110,.30)');
    g.addColorStop(0.45,'rgba(255,170,80,.11)');
    g.addColorStop(1,'rgba(255,150,60,0)');
    ctx.fillStyle=g;ctx.fillRect(cx-TILE*2.6,cy-TILE*2.6,TILE*5.2,TILE*5.2);
    const fr=Math.floor(time*9+t.x*2)%FIRE_Y.length;
    const dw=fw*SCALE, dh=FIRE_H*SCALE;
    ctx.drawImage(f,fx,FIRE_Y[fr],fw,FIRE_H,cx-dw/2,cy-dh*0.82,dw,dh);
  }
}

/* Requisiten dagegen stehen IM Raum: der Held läuft davor und dahinter, also gehören sie in die
   y-Sortierung des Runners. Zurückgegeben wird das Deko-Format, das er ohnehin zeichnet. */
function propDecos(int){
  const o=sheets.objects;
  if(!o||!int.props)return[];
  return int.props.map(p=>({
    img:o,sx:p.def.sx*T,sy:p.def.sy*T,fw:T,fh:T,frames:1,anim:0,scale:SCALE,
    x:(p.x+0.5)*TILE,y:(p.y+0.9)*TILE,name:p.def.n
  }));
}

window.OW_DUNGEON={version:'dg-v2.1',ready,build,drawFloor,drawTorches,propDecos,autoTile,DARK,
  TILE,SCALE,sheets,
  note:'Wand ist zwei Ebenen und zeigt nach Süden: Krone von oben, Vorderseite unter der Nordkante.'};
})();
