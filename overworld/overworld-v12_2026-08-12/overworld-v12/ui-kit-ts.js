/* KFB — ui-kit-ts (uikit-v1.5, WS0-Paket 2)
   Fork-Stempel: gebaut in WS0 gegen `overworld/asset-source.js` (src-v1.0), Briefing WS0 v10 §1/§2.

   **Der Tiny-Swords-Baukasten.** Vier Muster, zwei Zeichenwege, eine Messung.

   Warum es das gibt: `paper-atlas.js` (pa-v1.0) trägt die Slice-Maße als Konstanten im Kopf
   (C:32/64, M:32, „Lücke 64") und zeichnet alles halbiert. Beides ist überholt — Originalgröße
   (`scale = 1`) ist seit 2026-08-08 die Regel, und die Lücken-Annahme stimmt für die
   Slice-Blätter nicht (sie stimmt für die Vorschaubilder, siehe Befund unten).
   Dieses Modul **misst die Blätter selbst** (Alpha-Scan) und legt das Protokoll offen;
   wer es nicht glaubt, ruft `OW_UIKIT.protocol()`.

   ---- Befund der Messung 2026-08-09 (gegen die Annahme geprüft) ----------------------
   1. Die `*_Slots.png` des Free Packs und die `*_9Slides.png` des Update 010 sind DASSELBE
      Format: **lückenloses 3×3 aus 64er-Zellen, Blatt 192×192.** Gilt für `Banner_Slots`,
      `WoodTable_Slots`, `Carved_9Slides`, `Button_*_9Slides`.
      → `Banner_Slots` ist ein **9-Slice**, kein 3-Slice. Das Briefing (§2) nennt den Banner
        3-Slice; das gilt für die Bänder des 010-Satzes (`*_3Slides`, 192×64), nicht fürs Banner.
   2. Die `*_3Slides.png` sind lückenlose **1×3 aus 64ern, Blatt 192×64**.
   3. Die **Bars sind 3-Slice mit echten Lücken**: Blatt 320×64 = Kappe 64 · Lücke 64 ·
      Mitte 64 · Lücke 64 · Kappe 64. Damit ist eine Leiste **jeder Länge** baubar — die
      Annahme „Free-Pack-Bars haben feste Länge" war falsch.
   4. **`RegularPaper`/`SpecialPaper` sind 9-Slice-Atlanten**, nicht feste Flächen: 320×320,
      drei Spalten und drei Zeilen mit Lücke, alles auf dem 64er-Raster. Der Asset-Index §8.2
      („ganze Flächen mit gemalten Rändern, kein 9-Slice") ist damit widerlegt — die
      Schriftrolle ist in jeder Größe baubar. Auch `Swords.png` ist ein 3-Slice (Trennstrich).
   5. **Die Messung rastet auf 64 ein.** Der reine Alpha-Scan liefert den Inhalt (z. B. 52 px),
      nicht das Fach (64 px) — die durchsichtige Fassung um die gerissene Kante GEHÖRT zum
      Teil. Ohne Einrasten rücken die Kappen zusammen und die Fassung geht verloren.
   ------------------------------------------------------------------------------------

   Die vier Muster:
     paper9(key,w,h)      — 9-Slice: Ecken 1:1, Kanten und Mitte GEKACHELT (nie gedehnt)
     band3(key,w)         — 3-Slice: Kappen 1:1, Mitte gekachelt, **Höhe fix** (nie gedehnt)
     bar(key,v,w,scale)   — Base als 3-Slice + Fill gekachelt und BESCHNITTEN, nicht skaliert
     fixed(key,scale)     — Icon/Cursor/Avatar/Schriftrolle, nur ganzzahliger Maßstab

   Die zwei Zeichenwege (Briefing §2: der Banner ist auch Welt-Möbel):
     drawScreen(ctx,cv,x,y,anchor)          — HUD, Bildschirm-Koordinaten
     drawWorld(ctx,cv,wx,wy,cam,opt)        — Welt-Koordinaten, Kamera + Kontaktschatten
   Beide holen aus DEMSELBEN Cache. Es gibt keinen zweiten Zeichenweg, der später nachgebaut wird.

   Harte Regeln, im Code durchgesetzt:
     · aus dem Slice-Blatt schneiden, nie das Vorschaubild dehnen  → SHEETS zeigt auf `_Slots`/`_Slides`
     · Kappen und Ecken nie strecken                              → 1:1 gezeichnet, per Proof belegt
     · Maßstab nur ganzzahlig                                     → fixed()/bar() runden
     · kein KFB-Ink auf TS-Kunst (K5-Grenze)                      → dieses Modul kennt kfb-ink-canon nicht
     · kein weißer Rand bei fremder AR                            → nichts wird auf ein Format gezogen */
(function(){
'use strict';
const VERSION='uikit-v1.5';
const S=window.OW_SRC;
if(!S)console.error('[ui-kit-ts] asset-source.js fehlt — Blätter laden nicht');
const A=p=>(S?S.a2d(p):p);
const FP='Tiny%20Swords%20(Free%20Pack)/UI%20Elements/UI%20Elements/';
const U10='Tiny%20Swords%20(Update%20010)/UI/';
const RES='Tiny%20Swords%20(Update%20010)/Resources/Resources/';

/* Die Teileliste. `kind` ist die ABSICHT; was daraus wird, entscheidet die Messung.
   Weicht das Gemessene ab, steht beides im Protokoll — geraten wird nichts. */
const SHEETS={
  /* 9-Slice — dehnbare Flächen (Blatt 192×192, 3×3 aus 64ern) */
  bannerFP:   {u:FP+'Banners/Banner_Slots.png',           kind:'9',    set:'free', role:'Banner · Zonentitel · Ortsschild'},
  table9:     {u:FP+'Wood%20Table/WoodTable_Slots.png',   kind:'9',    set:'free', role:'Ablage · Inventar'},
  carved9:    {u:U10+'Banners/Carved_9Slides.png',        kind:'9',    set:'010',  role:'Textfläche · Dialog'},
  btnBlue9:   {u:U10+'Buttons/Button_Blue_9Slides.png',   kind:'9',    set:'010',  role:'Knopf blau'},
  btnRed9:    {u:U10+'Buttons/Button_Red_9Slides.png',    kind:'9',    set:'010',  role:'Knopf rot'},
  btnHover9:  {u:U10+'Buttons/Button_Hover_9Slides.png',  kind:'9',    set:'010',  role:'Knopf, Zeiger darauf'},
  btnDis9:    {u:U10+'Buttons/Button_Disable_9Slides.png',kind:'9',    set:'010',  role:'Knopf, gesperrt'},
  btnBlue9P:  {u:U10+'Buttons/Button_Blue_9Slides_Pressed.png',kind:'9',set:'010', role:'Knopf blau, gedrueckt'},
  btnRed9P:   {u:U10+'Buttons/Button_Red_9Slides_Pressed.png', kind:'9',set:'010', role:'Knopf rot, gedrueckt'},
  /* 3-Slice — Bänder, Reiter (Blatt 192×64, 1×3 aus 64ern) */
  carved3:    {u:U10+'Banners/Carved_3Slides.png',        kind:'3',    set:'010',  role:'Tafel einzeilig'},
  ribbonBlue3:{u:U10+'Ribbons/Ribbon_Blue_3Slides.png',   kind:'3',    set:'010',  role:'Reiter blau'},
  ribbonYel3: {u:U10+'Ribbons/Ribbon_Yellow_3Slides.png', kind:'3',    set:'010',  role:'Reiter gelb'},
  btnBlue3:   {u:U10+'Buttons/Button_Blue_3Slides.png',   kind:'3',    set:'010',  role:'Knopf einzeilig'},
  btnRed3:    {u:U10+'Buttons/Button_Red_3Slides.png',    kind:'3',    set:'010',  role:'Knopf rot, einzeilig'},
  btnHover3:  {u:U10+'Buttons/Button_Hover_3Slides.png',  kind:'3',    set:'010',  role:'Knopf, Zeiger darauf'},
  btnDis3:    {u:U10+'Buttons/Button_Disable_3Slides.png',kind:'3',    set:'010',  role:'Knopf, gesperrt'},
  btnBlue3P:  {u:U10+'Buttons/Button_Blue_3Slides_Pressed.png',kind:'3',set:'010', role:'Knopf blau, gedrueckt'},
  btnRed3P:   {u:U10+'Buttons/Button_Red_3Slides_Pressed.png', kind:'3',set:'010', role:'Knopf rot, gedrueckt'},
  ribbonRed3: {u:U10+'Ribbons/Ribbon_Red_3Slides.png',    kind:'3',    set:'010',  role:'Reiter rot'},
  /* Bar — Base als 3-Slice mit Lücken + Fill-Kachel */
  barBig:     {u:FP+'Bars/BigBar_Base.png',   fill:FP+'Bars/BigBar_Fill.png',   kind:'bar', set:'free', role:'Leiste groß'},
  barSmall:   {u:FP+'Bars/SmallBar_Base.png', fill:FP+'Bars/SmallBar_Fill.png', kind:'bar', set:'free', role:'Leiste klein'},
  /* Fixed — feste Form, nur ganzzahliger Maßstab */
  swords:     {u:FP+'Swords/Swords.png',                  kind:'3',    set:'free', role:'Schwert · Trennstrich · Leiste', rows:5,
               bands:['blue','red','yellow','purple','steel']},
  /* Schriftrollen — 9-Slice-Atlas mit Lücken (Blatt 320×320) */
  paperReg:   {u:FP+'Papers/RegularPaper.png',            kind:'9',    set:'free', role:'Schriftrolle',
               warn:'Mittel- und Kantenteile tragen eine gemalte Falte — über große Flächen gekachelt wiederholt sie sich sichtbar. Für große Textflächen carved9 nehmen.'},
  paperSpec:  {u:FP+'Papers/SpecialPaper.png',            kind:'9',    set:'free', role:'Schriftrolle besonders',
               warn:'wie paperReg'},
  cursor01:   {u:U10+'Pointers/01.png',                   kind:'fixed',set:'010',  role:'Zeiger (Musterblatt)'},
  /* Runder Knopf als Muenzfassung. Georg will den POP-Stand DARIN sehen, nicht daneben —
     deshalb ist er hier ein `fixed`-Teil: feste Form, ganzzahliger Massstab, und die Zahl
     liegt als Text darueber. Ein 9-Slice waere falsch, ein Kreis hat keine dehnbare Mitte. */
  btnRound:   {u:FP+'Buttons/TinyRoundBlueButton.png',    kind:'fixed',set:'free', role:'Runder Knopf, blau'},
  /* Georg, 9.8.: fuer den POP-Stand ist der GROESSERE runde Knopf der bessere Traeger — seine
     Scheibe ist glatt und ohne Nietenrand, die Ziffer steht darauf frei. Gemessen: Blatt 128x128,
     die Scheibe belegt davon 88 px (bbox 20..107), Mitte 63,5/63,6 — also exakt zentriert, die
     Zahl darf mittig darueberliegen. Zwei Zustaende, weil der Knopf jetzt etwas OEFFNET. */
  btnRoundS:  {u:FP+'Buttons/SmallBlueRoundButton_Regular.png',kind:'fixed',set:'free', role:'Runder Knopf, blau (POP-Stand)'},
  btnRoundSP: {u:FP+'Buttons/SmallBlueRoundButton_Pressed.png',kind:'fixed',set:'free', role:'Runder Knopf, gedrueckt'},
  /* Der Zielpfeil. **Gemessen, nicht geraten:** Blatt 64x64, das Motiv zeigt nach LINKS
     (Spitze bei x=4, Schaft rechts) — wer ihn dreht, rechnet deshalb +180 Grad auf die Peilung. */
  arrowNear:  {u:FP+'Icons/Icon_08.png',                  kind:'fixed',set:'free', role:'Zielpfeil orange · zeigt nach LINKS'},
  /* Carved_Regular ist KEIN Slice-Blatt, sondern ein fertiges Taefelchen (1,2 kB). Es steht
     hier als eigenes Teil, damit niemand versucht es zu dehnen: dehnbare Tafeln sind carved3
     und carved9. Ebenso die beiden haengenden Banner — Requisiten, keine Flaechen. */
  carvedFix:  {u:U10+'Banners/Carved_Regular.png',        kind:'fixed',set:'010',  role:'Taefelchen, feste Form'},
  bannerH:    {u:U10+'Banners/Banner_Horizontal.png',     kind:'fixed',set:'010',  role:'Banner waagerecht'},
  bannerV:    {u:U10+'Banners/Banner_Vertical.png',       kind:'fixed',set:'010',  role:'Banner senkrecht'},
  avatar01:   {u:FP+'Human%20Avatars/Avatars_01.png',     kind:'fixed',set:'free', role:'Avatar'},
  /* Münze — zwei Blätter, zwei Zwecke (gemessen 9.8.): `G_Idle` ist EIN Bild, die ruhende
     Münze für den Zähler. `G_Spawn` ist ein Streifen aus sieben Bildern, und Bild 1 ist der
     weiße Blitz — als Zähler ein Fleck, als Gewinn-Wurf der Mario-Moment. */
  coinIdle:   {u:RES+'G_Idle.png',                        kind:'fixed',set:'010', role:'Münze, ruhend'},
  coinSpin:   {u:RES+'G_Spawn.png',                       kind:'strip',set:'010', role:'Münze, Wurf', frames:7}
};

/* Icons und Zeiger als benannte Teile — damit die Adresse EINMAL steht.
   Vorher rechnete das Rail sich Adressen aus, indem es in einer fremden URL `Regular_` gegen
   `Pressed_` tauschte und den Icons-Ordner gegen den Resources-Ordner. Das ist dieselbe Liste
   an zwei Orten, nur schlechter lesbar. Was drauf ist, ist nachgesehen — nicht geraten. */
const ICONS={close:'01',gear:'02',sound:'03',one:'04',two:'05',three:'06',
             cart:'07',plus:'08',minus:'09',lock:'10'};
const POINTERS={arrow:'01',hand:'02',bracketTL:'03',bracketTR:'04',bracketBL:'05',bracketBR:'06'};
for(const n in ICONS)for(const st of ['Regular','Pressed','Disable'])
  SHEETS['ico_'+n+'_'+st.toLowerCase()]={u:U10+'Icons/'+st+'_'+ICONS[n]+'.png',
    kind:'fixed',set:'010',role:'Icon '+n+' · '+st,group:'icon'};
/* Verbindungsstuecke fuer Menuebaeume: vier Richtungen x drei Reiterfarben x zwei Zustaende,
   plus die vier Banner-Verbinder — 28 Blaetter. Als Liste waeren sie unlesbar, als Regel sind
   sie sechs Zeilen. Benannt wird nach dem, wonach man sucht: Farbe, Richtung, Zustand. */
const DIRS=['Up','Down','Left','Right'];
for(const d of DIRS)
  SHEETS['conn_banner_'+d.toLowerCase()]={u:U10+'Banners/Banner_Connection_'+d+'.png',
    kind:'fixed',set:'010',role:'Verbinder Banner '+d,group:'conn'};
for(const col of ['Blue','Red','Yellow'])for(const d of DIRS)for(const st of ['','_Pressed'])
  SHEETS['conn_'+col.toLowerCase()+'_'+d.toLowerCase()+(st?'_pressed':'')]={
    u:U10+'Ribbons/Ribbon_'+col+'_Connection_'+d+st+'.png',
    kind:'fixed',set:'010',role:'Verbinder Reiter '+col+' '+d+(st?' gedrueckt':''),group:'conn'};
for(const n in POINTERS)
  SHEETS['ptr_'+n]={u:U10+'Pointers/'+POINTERS[n]+'.png',
    kind:'fixed',set:'010',role:'Zeiger '+n,group:'pointer'};

const PARTS={};
const painted=new Map();
let inflight=null, loaded=false, loadMs=0, errors=[];

function loadImg(u){return new Promise((ok,no)=>{const i=new Image();
  i.crossOrigin='anonymous';i.onload=()=>ok(i);
  i.onerror=()=>no(new Error('UI-Teil fehlt: '+u));i.src=u;});}
function toCanvas(im){
  const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;
  const c=cv.getContext('2d',{willReadFrequently:true});
  c.imageSmoothingEnabled=false;c.drawImage(im,0,0);return cv;}

/* ---- Messung -------------------------------------------------------------
   Zwei Bauarten kommen vor, beide werden erkannt:
     · **Lücken**       — die Teile liegen mit durchsichtigen Spalten dazwischen (Bars)
     · **gleichmäßig**  — lückenloses Raster, in Drittel geteilt (Slots/Slides)
   Beide rasten auf das 64er-Fach ein (`snap64`). Der benutzte Weg steht als `mode` im
   Protokoll. Gedrittelt wird nur, wenn die Kante glatt aufgeht — sonst bleibt es ein
   Einzelstück. */
const ALPHA=8;
function runsOf(flags){
  const r=[];let s=-1;
  for(let i=0;i<flags.length;i++){
    if(flags[i]&&s<0)s=i;
    else if(!flags[i]&&s>=0){r.push([s,i-s]);s=-1;}}
  if(s>=0)r.push([s,flags.length-s]);
  return r;}
const thirds=n=>[[0,n/3],[n/3,n/3],[2*n/3,n/3]];
/* Auf das 64er-Fach einrasten und benachbarte Fächer verschmelzen. Das ist die Regel aus
   dem Briefing (»alles Vielfaches von 64«), hier als Messverfahren: was nach dem Einrasten
   kein Vielfaches von 64 ist, ist kein Slice-Blatt. */
const G=64;
function snap64(runs,len){
  const out=[];
  for(const r of runs){
    const a=Math.floor(r[0]/G)*G, b=Math.min(len,Math.ceil((r[0]+r[1])/G)*G);
    const last=out[out.length-1];
    if(last&&a<=last[0]+last[1])last[1]=Math.max(last[1],b-last[0]);
    else out.push([a,b-a]);}
  return out;}

function measureSheet(cv,want,rowsWanted){
  const w=cv.width,h=cv.height;
  const d=cv.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h).data;
  const col=new Uint8Array(w),row=new Uint8Array(h);
  for(let y=0;y<h;y++){const o=y*w*4;
    for(let x=0;x<w;x++){if(d[o+x*4+3]>ALPHA){col[x]=1;row[y]=1;}}}
  let cols=snap64(runsOf(col),w),rows=snap64(runsOf(row),h);
  let mode=(cols.length===3||rows.length===3)?'Lücken':'gleichmäßig';
  if(cols.length===1&&w%3===0){cols=thirds(w);mode='gleichmäßig';}
  if(want==='9'){ if(rows.length===1&&h%3===0){rows=thirds(h);mode='gleichmäßig';} }
  else if(rowsWanted>1&&h%rowsWanted===0){
    /* **Ein Bandblatt kann mehrere Zeilen haben — eine je Farbe.** `Swords.png` ist genau das:
       fünf liegende Schwerter untereinander (blau · rot · gelb · lila · stahl), jedes ein
       3-Slice aus Griff, Klinge und Spitze. Ohne diese Teilung galt das ganze Blatt als EIN
       Band — und die Messung meldete eine 602 px hohe Klinge, die es nicht gibt.
       Der Fehler war nicht der Scan, sondern die Annahme: »Band« hieß im Code »eine Zeile«. */
    const rh=h/rowsWanted;rows=[];
    for(let i=0;i<rowsWanted;i++)rows.push([i*rh,rh]);
    mode=mode==='Lücken'?'Lücken · Zeilen':'Zeilen';
  }
  else { rows=[[0,h]]; }                      // einzeilige Bänder und Bars
  const cells=rows.map(r=>cols.map(c=>({x:c[0],y:r[0],w:c[1],h:r[1]})));
  const flat=[].concat.apply([],cells);
  const mult64=flat.every(c=>c.w%64===0&&c.h%64===0);
  const got=rows.length+'×'+cols.length;
  /* Ein Bandblatt bleibt ein Band, auch wenn es fuenf Farbzeilen hat - die Zeilenzahl sagt
     nichts ueber die Bauart, die Spaltenzahl schon. */
  const measured=(want!=='9'&&cols.length===3)?'3'
    :(rows.length===3&&cols.length===3)?'9':'fixed';
  return {w,h,cols,rows,cells,mode,mult64,got,measured,
    ok:(want==='9'?measured==='9':measured==='3')};
}

function load(){
  if(loaded)return Promise.resolve(PARTS);
  if(inflight)return inflight;
  const t0=performance.now();errors=[];
  /* **Nebenlaeufig laden, sonst wartet das Blatt auf seinen Vorgaenger.** Mit 19 Teilen war
     die Reihe egal; mit 96 kostete sie 3,0 s kalt, weil jedes Blatt auf das vorige wartete —
     bei Bildern, die alle vom selben Server kommen, ist das reine Wartezeit. Die Messung selbst
     bleibt in der Reihenfolge der Liste, damit das Protokoll lesbar bleibt.
     Fehler bleiben EINZELN: ein fehlendes Blatt darf die anderen 95 nicht mitreissen. */
  inflight=(async()=>{
    const keys=Object.keys(SHEETS);
    const bilder=await Promise.all(keys.map(async(k)=>{
      const sp=SHEETS[k];
      try{
        const cv=toCanvas(await loadImg(A(sp.u)));
        const fv=sp.fill?toCanvas(await loadImg(A(sp.fill))):null;
        return {k,cv,fv};
      }catch(e){return {k,err:e.message};}
    }));
    for(const b of bilder){
      const k=b.k,sp=SHEETS[k];
      if(b.err){errors.push(k+': '+b.err);console.warn('[ui-kit-ts]',b.err);continue;}
      try{
        const cv=b.cv;
        const p={key:k,kind:sp.kind,set:sp.set,role:sp.role,warn:sp.warn||null,url:sp.u,cv,w:cv.width,h:cv.height};
        if(sp.kind==='9'||sp.kind==='3'||sp.kind==='bar')p.grid=measureSheet(cv,sp.kind,sp.rows||1);
        if(sp.fill&&b.fv){
          const fv=b.fv;
          p.fillCv=fv;p.fillW=fv.width;p.fillH=fv.height;p.fillUrl=sp.fill;
          /* Der Fill ist eine Kachel, kein Balken: waagerecht gekachelt, senkrecht bündig.
             Verschiebt eine Leiste die Füllung, wird `setFillInset` gesetzt — nicht der Code. */
          p.fillInset={x:0,y:0,src:'gemessen: bündig'};
        }
        PARTS[k]=p;
      }catch(e){errors.push(k+': '+e.message);console.warn('[ui-kit-ts]',e.message);}
    }
    loadMs=Math.round(performance.now()-t0);loaded=true;inflight=null;return PARTS;
  })();
  return inflight;}

/* ---- Kacheln statt Dehnen -----------------------------------------------
   Der letzte Kachelrest wird an der QUELLE beschnitten, nicht gestaucht. Das ist der
   ganze Unterschied zwischen Kacheln und Dehnen. */
function newCv(w,h){const cv=document.createElement('canvas');
  cv.width=Math.max(1,w|0);cv.height=Math.max(1,h|0);
  const c=cv.getContext('2d');c.imageSmoothingEnabled=false;return cv;}
function tileX(c,src,cell,dx,dy,span,dh){
  for(let x=0;x<span;x+=cell.w){const w=Math.min(cell.w,span-x);
    c.drawImage(src,cell.x,cell.y,w,cell.h,dx+x,dy,w,dh);}}
function tileY(c,src,cell,dx,dy,dw,span){
  for(let y=0;y<span;y+=cell.h){const h=Math.min(cell.h,span-y);
    c.drawImage(src,cell.x,cell.y,cell.w,h,dx,dy+y,dw,h);}}
function tileXY(c,src,cell,dx,dy,sw,sh){
  for(let y=0;y<sh;y+=cell.h)for(let x=0;x<sw;x+=cell.w){
    const w=Math.min(cell.w,sw-x),h=Math.min(cell.h,sh-y);
    c.drawImage(src,cell.x,cell.y,w,h,dx+x,dy+y,w,h);}}

function paper9(key,w,h){
  const p=PARTS[key];if(!p||!p.grid||p.grid.measured!=='9')return null;
  const g=p.grid.cells;
  const L=g[0][0].w,R=g[0][2].w,T=g[0][0].h,B=g[2][0].h;
  w=Math.max(L+R+1,Math.round(w));h=Math.max(T+B+1,Math.round(h));
  const ck=key+'|9|'+w+'x'+h;if(painted.has(ck))return painted.get(ck);
  const cv=newCv(w,h),c=cv.getContext('2d'),s=p.cv,mw=w-L-R,mh=h-T-B;
  tileXY(c,s,g[1][1],L,T,mw,mh);
  tileX(c,s,g[0][1],L,0,mw,g[0][1].h);
  tileX(c,s,g[2][1],L,h-B,mw,g[2][1].h);
  tileY(c,s,g[1][0],0,T,g[1][0].w,mh);
  tileY(c,s,g[1][2],w-R,T,g[1][2].w,mh);
  const put=(cell,dx,dy)=>c.drawImage(s,cell.x,cell.y,cell.w,cell.h,dx,dy,cell.w,cell.h);
  put(g[0][0],0,0);put(g[0][2],w-R,0);put(g[2][0],0,h-B);put(g[2][2],w-R,h-B);
  painted.set(ck,cv);return cv;}

/* `row` wählt die Zeile eines Bandblatts — bei `swords` ist das die FARBE (0 blau · 1 rot ·
   2 gelb · 3 lila · 4 stahl). Einzeilige Bänder ignorieren das Argument. */
function band3(key,w,row){
  const p=PARTS[key];if(!p||!p.grid)return null;
  const rr=Math.max(0,Math.min(p.grid.cells.length-1,row|0));
  const g=p.grid.cells[rr];if(!g||g.length!==3)return null;
  const L=g[0].w,R=g[2].w,H=p.grid.rows[rr][1];
  w=Math.max(L+R+1,Math.round(w));
  const ck=key+'|3|'+rr+'|'+w;if(painted.has(ck))return painted.get(ck);
  const cv=newCv(w,H),c=cv.getContext('2d'),s=p.cv;
  tileX(c,s,g[1],L,0,w-L-R,g[1].h);
  c.drawImage(s,g[0].x,g[0].y,g[0].w,g[0].h,0,0,g[0].w,g[0].h);
  c.drawImage(s,g[2].x,g[2].y,g[2].w,g[2].h,w-R,0,g[2].w,g[2].h);
  painted.set(ck,cv);return cv;}
/* Farbname → Zeile, damit die Aufrufstelle die Farbe nennt und nicht eine Zahl. */
function band3By(key,w,name){
  const b=(SHEETS[key]&&SHEETS[key].bands)||null;
  return band3(key,w,b?Math.max(0,b.indexOf(name)):0);}

/* Leiste: Base als 3-Slice (jede Länge), Fill als Kachel im Innenfeld, waagerecht
   BESCHNITTEN. Nichts wird skaliert — sonst wandert die Schnitzerei mit dem Wert. */
function bar(key,value,width,scale){
  const p=PARTS[key];if(!p||!p.fillCv||!p.grid)return null;
  const g=p.grid.cells[0],L=g[0].w,R=g[2].w;
  const w=Math.max(L+R+1,Math.round(width||(L+g[1].w+R)));
  const k=Math.max(1,Math.round(scale||1));
  const v=Math.max(0,Math.min(1,value==null?1:value));
  const span=w-L-R,cut=Math.round(span*v);
  const ck=key+'|bar|'+w+'|'+cut+'|'+k;if(painted.has(ck))return painted.get(ck);
  const base=band3(key,w);if(!base)return null;
  const cv=newCv(base.width*k,base.height*k),c=cv.getContext('2d');
  c.imageSmoothingEnabled=false;if(k!==1)c.scale(k,k);
  if(cut>0){
    const fx=L+p.fillInset.x,fy=p.fillInset.y;
    for(let x=0;x<cut;x+=p.fillW){const ww=Math.min(p.fillW,cut-x);
      c.drawImage(p.fillCv,0,0,ww,p.fillH,fx+x,fy,ww,p.fillH);}}
  c.drawImage(base,0,0);
  painted.set(ck,cv);return cv;}

function fixed(key,scale){
  const p=PARTS[key];if(!p)return null;
  const k=Math.max(1,Math.round(scale||1));
  if(k===1)return p.cv;
  const ck=key+'|fix|'+k;if(painted.has(ck))return painted.get(ck);
  const cv=newCv(p.w*k,p.h*k),c=cv.getContext('2d');
  c.imageSmoothingEnabled=false;c.drawImage(p.cv,0,0,p.w,p.h,0,0,p.w*k,p.h*k);
  painted.set(ck,cv);return cv;}

/* Ein Bild aus einem Streifen. Die Bildbreite kommt aus der ERKLÄRTEN Bildzahl, nicht aus
   einer Vermutung über die Höhe — `G_Spawn` ist 896×128 bei sieben Bildern, also 128 breit;
   quadratisch zu raten geht hier zufällig gut und beim nächsten Blatt schief. */
function strip(key,frame,scale){
  const p=PARTS[key];if(!p)return null;
  const n=Math.max(1,(SHEETS[key]&&SHEETS[key].frames)||1);
  const fw=Math.floor(p.w/n),i=Math.max(0,Math.min(n-1,frame|0));
  const k=Math.max(1,Math.round(scale||1));
  const ck=key+'|str|'+i+'|'+k;if(painted.has(ck))return painted.get(ck);
  const cv=newCv(fw*k,p.h*k),c=cv.getContext('2d');
  c.imageSmoothingEnabled=false;
  c.drawImage(p.cv,i*fw,0,fw,p.h,0,0,fw*k,p.h*k);
  painted.set(ck,cv);return cv;}

/* Benannte Einzelstücke. `state`: regular (Vorgabe) · pressed · disable.
   Unbekannte Namen werfen — ein stilles `undefined` wäre ein leeres Bild ohne Hinweis. */
function icon(name,state,scale){
  const k='ico_'+name+'_'+(state||'regular');
  if(!SHEETS[k])throw new Error('[ui-kit-ts] unbekanntes Icon: '+name+' · '+Object.keys(ICONS).join(', '));
  return fixed(k,scale);}
function pointer(name,scale){
  const k='ptr_'+(name||'arrow');
  if(!SHEETS[k])throw new Error('[ui-kit-ts] unbekannter Zeiger: '+name+' · '+Object.keys(POINTERS).join(', '));
  return fixed(k,scale);}

/* Für CSS: dasselbe Bild als Adresse. Ergebnis wird gemerkt — `toDataURL` ist teuer genug,
   dass ein Aufruf je Bild und Größe der Unterschied zwischen flüssig und ruckelig ist. */
const urls=new Map();
function url(cvOrKey,scale){
  const cv=typeof cvOrKey==='string'?fixed(cvOrKey,scale):cvOrKey;
  if(!cv)return '';
  if(urls.has(cv))return urls.get(cv);
  const u=cv.toDataURL('image/png');urls.set(cv,u);return u;}
const iconUrl=(name,state,scale)=>url(icon(name,state,scale));
const pointerUrl=(name,scale)=>url(pointer(name,scale));

/* Die bloße Adresse eines Teils — **synchron**, ohne Laden, ohne Canvas.
   Dafür gibt es einen Grund: Chrome, das beim Anhängen gebaut wird, kann nicht auf ein
   Versprechen warten. `src()` gibt die Adresse aus DERSELBEN Teileliste heraus, aus der auch
   die gemessenen Blätter kommen — eine Liste, zwei Zugriffsarten. Wer ein Bild braucht, nimmt
   `icon()`; wer eine URL für CSS oder ein `<img>` braucht, nimmt `iconSrc()`. */
const src=(key)=>{const sp=SHEETS[key];return sp?A(sp.u):'';};
const iconSrc=(name,state)=>src('ico_'+name+'_'+(state||'regular'));
const pointerSrc=(name)=>src('ptr_'+(name||'arrow'));

/* ---- Die zwei Zeichenwege ------------------------------------------------ */
function drawScreen(ctx,cv,x,y,anchor){
  if(!cv)return null;
  const a=anchor||'topleft';
  let dx=Math.round(x),dy=Math.round(y);
  if(a==='center'){dx-=cv.width>>1;dy-=cv.height>>1;}
  else if(a==='bottom'){dx-=cv.width>>1;dy-=cv.height;}
  const s=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=false;
  ctx.drawImage(cv,dx,dy);ctx.imageSmoothingEnabled=s;
  return {x:dx,y:dy,w:cv.width,h:cv.height};}

/* Welt: dieselbe Grafik, andere Rechnung. cam = {x,y,zoom}.
   **Der Maßstab bleibt 1** — UI-Kunst wächst nicht mit dem Zoom, sonst frisst er die
   Outline-Pixel (Originalgrößen-Regel, INDEX §0). `scaleMode:'integer'` erlaubt das
   Mitwachsen, dann aber ganzzahlig gerundet.
   Sortierung ist Sache des Aufrufers: `sortY` kommt zurück, damit das Möbel hinter dem
   Helden landet, wenn es weiter hinten steht. */
function drawWorld(ctx,cv,wx,wy,cam,opt){
  if(!cv)return null;
  const o=opt||{},z=(cam&&cam.zoom)||1;
  const cw=ctx.canvas.width,ch=ctx.canvas.height;
  const sx=Math.round((wx-(cam?cam.x:0))*z+cw/2);
  const sy=Math.round((wy-(cam?cam.y:0))*z+ch/2);
  const k=o.scaleMode==='integer'?Math.max(1,Math.round(z)):1;
  const w=cv.width*k,h=cv.height*k,anchor=o.anchor||'bottom';
  let dx=sx,dy=sy;
  if(anchor==='bottom'){dx-=w>>1;dy-=h;}
  else if(anchor==='center'){dx-=w>>1;dy-=h>>1;}
  const sm=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=false;
  if(o.shadow!==false){
    const rx=Math.max(6,w*0.34),ry=Math.max(3,rx*0.28);
    ctx.save();ctx.globalAlpha=(o.shadowAlpha==null?0.28:o.shadowAlpha);
    ctx.fillStyle='#000';ctx.beginPath();
    ctx.ellipse(sx,sy-2,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.restore();}
  ctx.drawImage(cv,0,0,cv.width,cv.height,dx,dy,w,h);
  ctx.imageSmoothingEnabled=sm;
  return {x:dx,y:dy,w,h,sortY:wy};}

/* ---- Protokoll und Nachweis ---------------------------------------------- */
function protocol(){
  const rows=[];
  for(const k in PARTS){
    const p=PARTS[k],g=p.grid;
    rows.push({key:k,set:p.set,kind:p.kind,role:p.role,sheet:p.w+'×'+p.h,
      raster:g?g.got:'—',measured:g?g.measured:'fixed',
      modus:g?g.mode:'Einzelstück',
      teile:g?g.cells.map(r=>r.map(c=>c.w+'×'+c.h).join(' · ')).join(' | ')
             :p.w+'×'+p.h,
      fill:p.fillCv?('Fill '+p.fillW+'×'+p.fillH+' @'+p.fillInset.x+','+p.fillInset.y):'',
      m64:g?(g.mult64?'ja':'nein'):(p.w%64===0&&p.h%64===0?'ja':'nein'),
      ok:g?g.ok:true});}
  return {version:VERSION,loadMs,errors:errors.slice(),rows};}

/* Abnahme-Beweis 3-Slice: dieselbe Kappe bei drei Breiten, Pixel gegen Pixel.
   0 heißt: nicht gedehnt. */
function px(cv,x,y,w,h){return cv.getContext('2d',{willReadFrequently:true}).getImageData(x,y,w,h).data;}
function maxDiff(a,b){let m=0;for(let i=0;i<a.length;i++){const d=Math.abs(a[i]-b[i]);if(d>m)m=d;}return m;}
function capProof(key,widths){
  const p=PARTS[key];if(!p||!p.grid||p.grid.cells[0].length!==3)return null;
  const g=p.grid.cells[0],L=g[0].w,R=g[2].w;
  const ws=(widths||[]).map(w=>Math.max(L+R+1,Math.round(w)));
  const cvs=ws.map(w=>band3(key,w));if(cvs.some(c=>!c))return null;
  const ref=cvs[0],rl=px(ref,0,0,L,ref.height),rr=px(ref,ref.width-R,0,R,ref.height);
  let dl=0,dr=0;
  for(let i=1;i<cvs.length;i++){
    dl=Math.max(dl,maxDiff(rl,px(cvs[i],0,0,L,cvs[i].height)));
    dr=Math.max(dr,maxDiff(rr,px(cvs[i],cvs[i].width-R,0,R,cvs[i].height)));}
  return {key,kind:'3-Slice',sizes:ws.map(w=>w+'px'),capL:L,capR:R,height:ref.height,
    diffA:dl,diffB:dr,labelA:'Kappe links',labelB:'Kappe rechts',pass:dl===0&&dr===0};}

/* Abnahme-Beweis 9-Slice: dieselben vier Ecken bei drei Größen. */
function cornerProof(key,sizes){
  const p=PARTS[key];if(!p||!p.grid||p.grid.measured!=='9')return null;
  const g=p.grid.cells,L=g[0][0].w,R=g[0][2].w,T=g[0][0].h,B=g[2][0].h;
  const ss=(sizes||[]).map(s=>[Math.max(L+R+1,s[0]),Math.max(T+B+1,s[1])]);
  const cvs=ss.map(s=>paper9(key,s[0],s[1]));if(cvs.some(c=>!c))return null;
  const corners=cv=>[px(cv,0,0,L,T),px(cv,cv.width-R,0,R,T),
                     px(cv,0,cv.height-B,L,B),px(cv,cv.width-R,cv.height-B,R,B)];
  const ref=corners(cvs[0]);let d=0;
  for(let i=1;i<cvs.length;i++){const c=corners(cvs[i]);
    for(let j=0;j<4;j++)d=Math.max(d,maxDiff(ref[j],c[j]));}
  /* zweite Probe: die Mitte darf sich wiederholen, aber nicht verzerren.
     die Probe wird auf das kleinste vorkommende Mittelfeld beschnitten, sonst liest sie
     über den Rand und meldet einen Fehler, den die Kunst nicht hat. */
  const mw=Math.min(g[1][1].w,...ss.map(s=>s[0]-L-R));
  const mh=Math.min(g[1][1].h,...ss.map(s=>s[1]-T-B));
  const mid=cv=>px(cv,L,T,Math.max(1,mw),Math.max(1,mh));
  let dm=0;const rm=mid(cvs[0]);
  for(let i=1;i<cvs.length;i++)dm=Math.max(dm,maxDiff(rm,mid(cvs[i])));
  return {key,kind:'9-Slice',sizes:ss.map(s=>s[0]+'×'+s[1]),capL:L,capR:R,height:T+'/'+B,
    diffA:d,diffB:dm,labelA:'vier Ecken',labelB:'Mittelkachel',pass:d===0&&dm===0};}

/* Für `overworld/ui-slices.json` — eine Zahl, ein Ort. Die Datei ist die Kopie zum Nachlesen;
   bei Abweichung gilt die Messung. Form und Feldnamen hier sind DIE Form der Datei — wer den
   Knopf im Musterblatt drückt, bekommt genau das, was im Projekt liegt. */
function exportSlices(){
  const out={version:VERSION,measured:new Date().toISOString(),
    source:'Tiny Swords — aus den Slice-Blättern gemessen (Alpha-Scan + Einrasten auf 64), WS0 Paket 2',
    note:'Erzeugt von overworld/ui-kit-ts.js via OW_UIKIT.exportSlices(). Das Modul misst zur Laufzeit selbst; diese Datei ist die Kopie zum Nachlesen. Bei Abweichung gilt die Messung.',
    raster:G,sheets:{}};
  for(const k in PARTS){const p=PARTS[k],g=p.grid;
    const e={url:p.url,set:p.set,kind:p.kind,measuredKind:g?g.measured:'fixed',
      mode:g?g.mode:null,sheet:[p.w,p.h],role:p.role};
    if(g){e.cellW=g.cols.map(c=>c[1]);e.cellH=g.rows.map(r=>r[1]);
          e.originX=g.cols.map(c=>c[0]);e.originY=g.rows.map(r=>r[0]);}
    if(p.fillCv){e.fillUrl=p.fillUrl;
      e.fill={size:[p.fillW,p.fillH],inset:[p.fillInset.x,p.fillInset.y],src:p.fillInset.src};}
    if(p.warn)e.warn=p.warn;
    out.sheets[k]=e;}
  return out;}
function setFillInset(key,x,y){const p=PARTS[key];if(!p||!p.fillInset)return false;
  p.fillInset={x:x|0,y:y|0,src:'gesetzt'};painted.clear();return true;}

window.OW_UIKIT={version:VERSION,SHEETS,PARTS,ICONS,POINTERS,DIRS,load,
  paper9,band3,band3By,bar,fixed,strip,icon,pointer,url,iconUrl,pointerUrl,src,iconSrc,pointerSrc,
  drawScreen,drawWorld,
  protocol,capProof,cornerProof,exportSlices,setFillInset,
  get ready(){return loaded;},
  note:'Tiny-Swords-Baukasten, aus den Slice-Blättern gemessen. Zwei Zeichenwege (Bildschirm/Welt), ein Cache. Ecken und Kappen nie gedehnt.'};
console.log('[ui-kit-ts] '+VERSION+' · '+Object.keys(SHEETS).length+' Teile · 9-Slice · 3-Slice · Bar · Fixed · Screen+Welt');
})();
