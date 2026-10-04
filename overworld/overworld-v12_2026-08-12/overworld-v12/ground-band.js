/* KFB Overworld — Boden als BAND (band-v1.0, V9-S1, Masterplan §29)

   Portiert die neunte Bauart aus der WS0-Bodenwerkstatt (`_handoff/…/KFB Boden-Konzept.dc.html`).
   Acht Bauarten davor sind gescheitert, alle am selben Fehler: **ein Grundelement erzeugen und
   vervielfältigen**. Oval, Gitter, Zug, Scheibe, Rechteck — sobald das Bild aus Dingen besteht,
   sieht man die Dinge, und keine Parameteränderung heilt das.

   Was trägt: Detail auf allen Größenstufen aus EINER Regel.
     Fläche  — Wertefeld über Weltkoordinaten, quantisiert auf flache Stufen (kein Verlauf)
     Kontur  — Randabstand als Summe von fünf Wellen über der Bogenlänge, links und rechts eigene
     Wellenlänge in BANDBREITEN, nie in Objektlängen (sonst liest sich eine Welle als Gerade)

   Neu gegenüber WS0, aus Georgs Entscheidungen vom 8.8.:
     · **Sechs Biome als Gewichtung, nicht als Palette.** Jedes Biom enthält ALLE Terrain-Familien
       (Gras · Sand · Fels · Moos · Staub), nur anders gewichtet. Zwei Biome mit denselben Familien
       sehen verschieden aus, weil die Gewichte, der Akzent und die Marken abweichen.
     · **Wabern deutlich wahrnehmbar, zwei Amplituden.** Der Boden wabert voll, Requisiten mit
       `propFaktor` (0,45). Eine Uhr, ein Feld, zwei Stärken — vier pulsierende Systeme mit vier
       Takten sind Rauschen, nicht Leben (§28.3).
     · **Das Fraktal verzerrt, es färbt nicht.** Die Verschiebung kommt aus dem domänenverzerrten
       Feld (runde, langsam morphende Struktur), die Farbigkeit bleibt in der Biom-Familie plus EIN
       komplementärer Akzent. Volle Sättigung auf dem Boden frisst die Einheiten — genau das
       »Absuppen«, das verhindert werden soll.
     · **Tusche hell und dunkel gegeneinander**: helle Bahnen additiv (screen), dunkle
       multiplizierend, aus derselben Bahn. Eigenes Terrain-Preset, das Karten-Preset bleibt heil.

   Kosten (die Regel: ein Vorschlag ohne Kostenaussage gilt als unfertig):
     Backen   je Eimer 460 px bei halber Auflösung, **asynchron, ein Eimer je Einzelbild**,
              nie im Zeichenpfad. Ein noch nicht gebackener Eimer liefert `null` — der Aufrufer
              zeichnet dann weiter, was er vorher hatte. Auf »läuft« gaten, nie auf »existiert«.
     Zeichnen je Bild und Biom: ~9 Blits in die Eimerfläche (nur bei Kamerabewegung) plus
              H/`streifen` Streifenblits. Kein Neuaufbau, keine Fläche wird zweimal gemalt. */
(function(){
'use strict';
const VERSION='band-v1.0';
if(window.OW_BAND&&window.OW_BAND.version===VERSION){
  console.log('[band] schon geladen ('+VERSION+') — zweite Ausführung übersprungen');return;}

const ZELLE=460, SUB=0.5;

/* Die Terrain-Familien. Fünf Tonleitern à fünf Stufen — das ist der ganze Farbvorrat. */
const FAMILIEN={
  gras: ['#3f5f2e','#4e7139','#628544','#77974d','#8cae59'],
  sand: ['#b7935c','#c8a66c','#d8bb7e','#e6cd94','#f3e0af'],
  fels: ['#4a4a52','#5d5c63','#726f74','#8a8589','#a29c9c'],
  moos: ['#26383a','#334b40','#47624c','#587356','#6d8a5e'],
  staub:['#39353f','#4c4750','#655c54','#7c7168','#948779'],
};

/* Sechs Biome = Georgs sechs Zonen. `w` sind die Gewichte über die Familien (Summe 1),
   `akzent` ist der EINE komplementäre Ton, `marke` das Vokabular der gesetzten Marken. */
const BIOMES={
  hof:     {label:'Hof',     grund:'#628544', akzent:'#e8c34a', marke:'buschel',  markenDichte:1.0,
            w:{gras:.58,sand:.18,moos:.12,fels:.08,staub:.04}, schwamm:{d:.55,g:[5,13]}, trocken:.7},
  wildnis: {label:'Wildnis', grund:'#47624c', akzent:'#d96a3c', marke:'blatt',    markenDichte:1.5,
            w:{moos:.42,gras:.30,fels:.12,staub:.08,sand:.08}, schwamm:{d:.85,g:[4,10]}, trocken:1.0},
  goblins: {label:'Goblins', grund:'#6b6259', akzent:'#8ab63a', marke:'riss',     markenDichte:1.2,
            w:{staub:.34,fels:.24,gras:.22,sand:.14,moos:.06}, schwamm:{d:.70,g:[3,8]},  trocken:.8},
  verlies: {label:'Verlies', grund:'#5d5c63', akzent:'#8a4a6e', marke:'kristall', markenDichte:.6,
            w:{fels:.46,staub:.30,moos:.14,sand:.08,gras:.02}, schwamm:{d:.62,g:[4,12]}, trocken:.45},
  lager:   {label:'Lager',   grund:'#77974d', akzent:'#e0622c', marke:'strich',   markenDichte:.85,
            w:{gras:.34,staub:.22,sand:.22,fels:.14,moos:.08}, schwamm:{d:.5,g:[6,15]},  trocken:.95},
  wasser:  {label:'Wasser',  grund:'#d8bb7e', akzent:'#4fa3b0', marke:'ring',     markenDichte:.7,
            w:{sand:.40,gras:.22,moos:.20,fels:.14,staub:.04}, schwamm:{d:.30,g:[8,21]}, trocken:1.2},
  /* Der Sandsaum ist kein Biom, sondern eine Rolle: er läuft an jeder Küste und muss in jedem
     Biom derselbe Saum bleiben, sonst wandert die Küste mit der Zone. */
  __saum:  {label:'Saum',    grund:'#d8bb7e', akzent:'#6f9a52', marke:'strich',   markenDichte:.4,
            w:{sand:.78,fels:.10,gras:.08,staub:.04,moos:0}, schwamm:{d:.28,g:[9,22]}, trocken:1.25},
};

/* Zonen-Biome des Runners auf Bänder abbilden. Eine Zuordnung an EINER Stelle — zwei Tabellen
   für dieselbe Frage laufen beim nächsten Fork auseinander. */
const VON_ZONE={camp:'lager',wilds:'wildnis',cave:'verlies',dungeon:'verlies',
  goblins:'goblins',water:'wasser',town:'hof',grass:'hof',
  /* Auch die Namen der alten Bodenschicht (`OW_GROUND.BIOMES`) zeigen hierher — sonst fällt der
     Grundboden stumm auf »hof« zurück und die Insel verliert ihre Zonenfarbe. */
  waste:'lager',swamp:'wildnis',ash:'goblins',highland:'verlies',winter:'verlies',paper:'hof'};

let KEIM=7;
const rnd=seed=>{let a=seed|0;return()=>{a=(a+0x6D2B79F5)|0;
  let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;
  return((t^(t>>>14))>>>0)/4294967296;};};
function hash(a,b,c){let h=(a|0)*374761393+(b|0)*668265263+(c|0)*2246822519+KEIM*3266489917;
  h=(h^(h>>>13))>>>0;h=Math.imul(h,1274126177);return(h^(h>>>16))>>>0;}

/* Das Schwungfeld: groß, langsam, über die ganze Welt stetig. Es gibt es nur EINMAL, also
   schwingt alles miteinander. 60er-Jahre-Schwung kommt nicht aus Zufall, sondern daraus, dass
   alles derselben Kurve folgt. */
const schwung=(wx,wy)=>Math.sin(wx*0.00042+0.7)*1.15+Math.cos(wy*0.00051-0.3)*0.95
  +Math.sin((wx-wy)*0.00027)*0.55;

function saat(x0,y0,x1,y1,okt,jeEimer,art,rand){
  const pad=rand||okt,out=[];
  for(let gy=Math.floor((y0-pad)/okt);gy<=Math.floor((y1+pad)/okt);gy++)
  for(let gx=Math.floor((x0-pad)/okt);gx<=Math.floor((x1+pad)/okt);gx++){
    const s=hash(gx,gy,art),R=rnd(s),n=Math.max(1,Math.round(jeEimer*(0.6+R())));
    for(let i=0;i<n;i++)out.push({x:(gx+R())*okt,y:(gy+R())*okt,keim:(s+i*2654435761)|0});
  }
  return out;
}

/* Die Bahn wird INTEGRIERT, nicht gerechnet — daher die weichen langen Bögen einer Hand. */
function bahn(p,laenge,abweichung,schritte,kruemmung){
  const pts=[];let px=p.x,py=p.y;const d=laenge/schritte,k=kruemmung||0;
  for(let i=0;i<=schritte;i++){pts.push([px,py]);
    const t=i/schritte,a=schwung(px,py)+abweichung+k*(t-0.5);
    px+=Math.cos(a)*d;py+=Math.sin(a)*d;}
  return pts;
}

let pinsel=null;
/* Der Zug ist ein BAND: eine gefüllte Fläche, deren linke und rechte Kante als Abstand von der
   Bahn definiert sind. Der Abstand kommt aus fünf Wellen über der Bogenlänge — kein
   charakteristischer Krümmungsradius, also nichts wiederzuerkennen. Links und rechts eigene
   Wellen, also nichts symmetrisch. Enden schließen, sonst ist das Band ein Rechteck. */
function zug(x,pts,breite,farbe,alpha,keim){
  const RF=rnd((keim|0)||12345);
  let weg=0;for(let i=1;i<pts.length;i++)weg+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
  if(weg<2)return;
  const R2=Math.min(breite*0.5,Math.max(2,weg*0.24));
  const gl=u=>u*u*(3-2*u);
  const p0=0.22+RF()*0.5,pk=0.15+RF()*0.55,p1=RF()<0.45?0.05+RF()*0.15:0.35+RF()*0.5;
  const staerke=t=>Math.max(0.14,t<pk?p0+(1-p0)*gl(t/Math.max(0.001,pk))
    :1+(p1-1)*gl((t-pk)/Math.max(0.001,1-pk)));
  const G=[];for(let i=0;i<296;i++)G.push(RF());
  const nz=(u,fr,off)=>{const xx=u*fr+off,i=((Math.floor(xx)%280)+280)%280,s=xx-Math.floor(xx);
    return G[i]+(G[i+1]-G[i])*(s*s*(3-2*s));};
  const kante=(t,o)=>0.5*nz(t,2.6,o)+0.25*nz(t,6.1,o+37)+0.125*nz(t,13.7,o+91)
    +0.0625*nz(t,29.3,o+143)+0.0625*nz(t,61.7,o+201);
  const oL=RF()*200,oR=RF()*200;
  const laengen=[0];
  for(let i=1;i<pts.length;i++)
    laengen.push(laengen[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
  /* Catmull-Rom statt linear: zwischen zwei Bahnpunkten lag sonst eine GERADE, und das Band erbt
     jeden Knick am Gelenk — daher in WS0 die Papierschnipsel-Optik. */
  const auf=u=>{const ziel=u*weg;let i=1;while(i<laengen.length-1&&laengen[i]<ziel)i++;
    const l0=laengen[i-1],l1=laengen[i],q=(l1-l0)>0.0001?(ziel-l0)/(l1-l0):0;
    const g=k=>pts[Math.max(0,Math.min(pts.length-1,k))];
    const a=g(i-2),b=g(i-1),c=g(i),d=g(i+1),q2=q*q,q3=q2*q;
    const cr=(A,B,C,D)=>0.5*((2*B)+(-A+C)*q+(2*A-5*B+4*C-D)*q2+(-A+3*B-3*C+D)*q3);
    return[cr(a[0],b[0],c[0],d[0]),cr(a[1],b[1],c[1],d[1])];};
  const n=Math.max(48,Math.min(420,Math.round(weg/3)));
  const links=[],rechts=[];
  let bx0=1e9,by0=1e9,bx1=-1e9,by1=-1e9;
  for(let i=0;i<=n;i++){
    const t=i/n,p=auf(t),q=auf(Math.min(1,t+1/n)),o=auf(Math.max(0,t-1/n));
    const dx=q[0]-o[0],dy=q[1]-o[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,st=staerke(t);
    /* Die Welle läuft in BANDBREITEN: eine Ausbuchtung etwa alle zwei Breiten, unabhängig davon,
       wie lang der Zug ist. Über die normierte Bahn skalierte sie mit der Länge — und eine Welle,
       die dreimal so lang ist wie das Band breit, liest sich als Gerade. */
    const u=t*weg/Math.max(6,R2*2.2),ende=Math.min(1,Math.min(t,1-t)*14);
    const wl=R2*st*ende*(0.30+1.30*kante(u,oL)),wr=R2*st*ende*(0.30+1.30*kante(u,oR));
    const lp=[p[0]+nx*wl,p[1]+ny*wl],rp=[p[0]-nx*wr,p[1]-ny*wr];
    links.push(lp);rechts.push(rp);
    for(const q2 of[lp,rp]){if(q2[0]<bx0)bx0=q2[0];if(q2[0]>bx1)bx1=q2[0];
      if(q2[1]<by0)by0=q2[1];if(q2[1]>by1)by1=q2[1];}
  }
  const zeichne=c=>{c.fillStyle=farbe;c.beginPath();c.moveTo(links[0][0],links[0][1]);
    for(let i=1;i<links.length;i++)c.lineTo(links[i][0],links[i][1]);
    for(let i=rechts.length-1;i>=0;i--)c.lineTo(rechts[i][0],rechts[i][1]);
    c.closePath();c.fill();};
  if(alpha==null||alpha>=0.995){x.save();zeichne(x);x.restore();return;}
  /* Bei Teildeckung darf sich die Fläche nicht selbst durchscheinen: erst deckend auf eine
     Hilfsfläche, dann EINMAL mit der Deckung darüber. */
  const bw=Math.ceil(bx1-bx0)+4,bh=Math.ceil(by1-by0)+4;
  if(bw<2||bh<2||bw>ZELLE*2||bh>ZELLE*2){x.save();x.globalAlpha=alpha;zeichne(x);x.restore();return;}
  if(!pinsel)pinsel=document.createElement('canvas');
  if(pinsel.width<bw)pinsel.width=bw;
  if(pinsel.height<bh)pinsel.height=bh;
  const px=pinsel.getContext('2d');
  px.setTransform(1,0,0,1,0,0);px.clearRect(0,0,bw,bh);
  px.setTransform(1,0,0,1,-bx0+2,-by0+2);zeichne(px);px.setTransform(1,0,0,1,0,0);
  x.save();x.globalAlpha=alpha;x.drawImage(pinsel,0,0,bw,bh,bx0-2,by0-2,bw,bh);x.restore();
}

/* Trockenpinsel: dieselbe Bahn, in parallele Streifen zerlegt, von denen ein Teil aussetzt.
   Breit, roh, ausgefranst — eine Spur, kein Strich. */
function trocken(x,start,laenge,breite,farbe,R){
  const streifen=4+Math.round(R()*5);
  x.save();x.globalCompositeOperation='multiply';x.lineCap='round';
  for(let s=0;s<streifen;s++){
    const off=((s+R()*0.7)/(streifen-1)-0.5)*breite;
    const pts=bahn(start,laenge*(0.7+R()*0.6),(R()-0.5)*1.1,26,0.9+R()*1.6),N=pts.length-1;
    x.strokeStyle=farbe;x.lineWidth=1.4+R()*3.4;
    const t0=R()*0.3,t1=1-R()*0.3;let auf=false;
    x.beginPath();
    for(let i=0;i<=N;i++){
      const t=i/N;if(t<t0||t>t1){auf=false;continue;}
      const p=pts[i],q=pts[Math.min(N,i+1)],o=pts[Math.max(0,i-1)];
      const dx=q[0]-o[0],dy=q[1]-o[1],l=Math.hypot(dx,dy)||1;
      const k=0.55+0.45*Math.sin(Math.PI*t);
      const cx=p[0]-dy/l*off*k,cy=p[1]+dx/l*off*k;
      if(R()<0.3){auf=false;continue;}
      if(!auf){x.moveTo(cx,cy);auf=true;}else x.lineTo(cx,cy);
    }
    x.globalAlpha=0.10+R()*0.26;x.stroke();
  }
  x.restore();
}

let papierC=null;
function papier(){
  if(papierC)return papierC;
  const N=256,c=document.createElement('canvas');c.width=c.height=N;
  const x=c.getContext('2d'),d=x.createImageData(N,N),p=d.data;
  for(let i=0;i<N*N;i++){const v=236+((Math.random()*Math.random()*54)|0)-22;
    p[i*4]=p[i*4+1]=p[i*4+2]=Math.max(200,Math.min(255,v));p[i*4+3]=255;}
  x.putImageData(d,0,0);
  x.globalAlpha=0.16;x.strokeStyle='#b9b0a0';x.lineWidth=1;
  for(let i=0;i<40;i++){const y=Math.random()*N;
    x.beginPath();x.moveTo(0,y);
    x.bezierCurveTo(N*0.3,y+(Math.random()-0.5)*5,N*0.7,y+(Math.random()-0.5)*5,N,y);x.stroke();}
  x.globalAlpha=1;papierC=c;return c;
}

const tupferC=new Map();
/* Schwamm: getupfte Auflage benachbarter Töne INNERHALB der Fläche. »Grün ist nicht einfach
   grün« (Lozzi). Der Schwamm deckt nie ganz — er hat viele Seiten, und man dreht ihn. */
function tupfer(groesse,farbe,keim,art){
  const key=groesse+'|'+farbe+'|'+art,da=tupferC.get(key);if(da)return da;
  const R=rnd(keim||12345),s=groesse*2;
  const c=document.createElement('canvas');c.width=c.height=s;
  const x=c.getContext('2d');x.fillStyle=farbe;
  const streck=art===1?2.6:art===2?0.45:1,n=Math.round(groesse*2.4);
  for(let i=0;i<n;i++){
    const a=R()*6.283,r=Math.pow(R(),0.5)*groesse*0.95,rr=groesse*(0.09+R()*0.3);
    x.globalAlpha=0.5+R()*0.5;x.beginPath();
    x.ellipse(s/2+Math.cos(a)*r*streck,s/2+Math.sin(a)*r/streck,
      rr*(art===1?1.5:1),rr*(0.5+R()*0.8),R()*3,0,6.3);x.fill();}
  x.globalCompositeOperation='destination-out';
  for(let i=0;i<Math.round(groesse*1.5);i++){
    const a=R()*6.283,r=Math.pow(R(),0.45)*groesse*0.95;
    x.globalAlpha=0.4+R()*0.55;x.beginPath();
    x.ellipse(s/2+Math.cos(a)*r*streck,s/2+Math.sin(a)*r/streck,
      groesse*(0.08+R()*0.26),groesse*(0.08+R()*0.26),R()*3,0,6.3);x.fill();}
  x.globalCompositeOperation='source-over';x.globalAlpha=1;
  tupferC.set(key,c);return c;
}

/* ══ DAS FELD ══ Wertrauschen, domänenverzerrt. Es liefert zwei Dinge aus EINER Regel:
   die quantisierten Feldbänder der Fläche und — in `waberDx` — die Verzerrung, die den Boden
   leben lässt. Ein Feld, zwei Verwendungen: es kann nicht auseinanderlaufen. */
function fwert(x,y,k){
  const gx=Math.floor(x),gy=Math.floor(y),fx=x-gx,fy=y-gy;
  const ex=fx*fx*(3-2*fx),ey=fy*fy*(3-2*fy);
  const h=(a,b)=>{let v=(a|0)*374761393+(b|0)*668265263+(k|0)*2246822519+KEIM*3266489917;
    v=(v^(v>>>13))>>>0;v=Math.imul(v,1274126177);return((v^(v>>>16))>>>0)/4294967295;};
  const a=h(gx,gy),b=h(gx+1,gy),c=h(gx,gy+1),d=h(gx+1,gy+1);
  const u=a+(b-a)*ex,w=c+(d-c)*ex;return u+(w-u)*ey;
}
function ffbm(x,y,k,okt){
  let s=0,amp=1,sum=0;
  for(let i=0;i<okt;i++){s+=amp*fwert(x,y,k+i*17);sum+=amp;amp*=0.5;x*=2.02;y*=2.02;}
  return s/sum;
}
/* Der Trick: das Feld wird nicht an (x,y) abgefragt, sondern an einer Stelle, die selbst aus
   Feldern kommt. Daraus entstehen die langen Schwünge und die Schachtelung — runde, organische
   Formen ohne ein einziges gezeichnetes Rund. */
function ffeld(wx,wy,zeit){
  const S=1/760,a=0.55,co=Math.cos(a),si=Math.sin(a);
  let x=wx*S,y=wy*S;
  const u=x*co+y*si,v=(-x*si+y*co)*2.6;
  x=u*co-v*si;y=u*si+v*co;
  const dz=zeit||0;
  const q1=ffbm(x,y+dz,0,4),q2=ffbm(x+5.2,y+1.3-dz,40,4);
  const r1=ffbm(x+2.1*q1+1.7,y+2.1*q2+9.2,80,3);
  const r2=ffbm(x+2.1*q1+8.3,y+2.1*q2+2.8,120,3);
  return ffbm(x+2.4*r1,y+2.4*r2,160,7);
}

const API={
  version:VERSION, BIOMES, FAMILIEN, VON_ZONE, ZELLE,
  /* Regler. `waber` ist die Amplitude in Pixeln bei Zoom 1 — Georgs Wahl vom 8.8. ist
     »deutlich wahrnehmbar«, also 4,5 statt der 3 aus der Werkstatt. Als ZAHL festgeschrieben,
     damit sie messbar ist und nicht als Gefühl wandert (offene Entscheidung §10.1). */
  waber:4.5, propFaktor:0.45, streifen:6, tempo:0.055,
  an:{zuege:true,schwamm:true,trocken:true,tusche:true,marken:true,papier:true,dreck:true,feld:true},
  stats:{bakes:0,bakeMs:0,warteschlange:0,eimer:0,streifenBlits:0,ersteBildMs:0},
  keim(k){if(k!=null&&(k|0)!==KEIM){KEIM=k|0;eimer.clear();schlange.length=0;}return KEIM;},
  biomFuer(zone){return VON_ZONE[zone]||'hof';},
};

/* ── Familienwahl aus den Gewichten ───────────────────────────────────────────────────────
   Jeder Zug fragt: welche Familie? Die Antwort kommt aus dem Keim und den Biom-Gewichten. So
   enthält jedes Biom alle Terrain-Arten, und die Gewichtung ist die einzige Stellschraube. */
function familie(B,keim){
  const R=(keim>>>3)/536870912%1;let s=0;
  for(const k in B.w){s+=B.w[k];if(R<=s)return FAMILIEN[k];}
  return FAMILIEN.gras;
}

function marke(x,B,px,py,R,gross){
  const s=gross?15+R()*11:6+R()*7,tinte=FAMILIEN[Object.keys(B.w)[0]][0];
  x.save();x.translate(px,py);x.rotate((R()-0.5)*0.45);
  x.strokeStyle=tinte;x.fillStyle=tinte;x.lineCap='round';
  x.globalAlpha=gross?0.62:0.44;x.lineWidth=Math.max(1.1,s*0.13);
  if(B.marke==='buschel'||B.marke==='blatt'){
    /* Dreierregel: drei Elemente, drei Längen, drei Ansätze, kein gemeinsames Zentrum. */
    const laenge=[1.0,0.56,0.79],stand=[-0.36,0.06,0.41],neigung=[-0.52,0.12,0.6];
    const dreh=Math.floor(R()*3);
    for(let j=0;j<3;j++){
      const k=(j+dreh)%3,L=s*laenge[k]*(0.85+R()*0.3),fuss=s*stand[j];
      const a=-1.57+neigung[k]+(R()-0.5)*0.22;
      x.beginPath();x.moveTo(fuss,0);
      x.quadraticCurveTo(fuss+Math.cos(a)*L*0.34,Math.sin(a)*L*0.7,
        fuss+Math.cos(a-0.32)*L,Math.sin(a-0.32)*L);x.stroke();}
    if(B.marke==='blatt'){x.globalAlpha*=0.8;x.beginPath();
      x.ellipse(s*0.5,-s*0.15,s*0.28,s*0.14,-0.5,0,6.3);x.fill();}
  }else if(B.marke==='riss'){
    x.beginPath();x.moveTo(0,0);let cx=0,cy=0;
    for(let j=0;j<3;j++){cx+=(R()-0.38)*s;cy+=(R()-0.5)*s*0.75;
      x.quadraticCurveTo(cx-s*0.12,cy-s*0.08,cx,cy);}
    x.stroke();
  }else if(B.marke==='ring'){
    x.beginPath();x.ellipse(0,0,s*0.9,s*0.55,(R()-0.5)*0.6,0.4,5.6);x.stroke();
    if(gross){x.beginPath();x.ellipse(s*0.14,-s*0.1,s*0.45,s*0.26,0.3,0.8,5.2);x.stroke();}
  }else if(B.marke==='kristall'){
    const l=[1.0,0.58,0.8];
    for(let j=0;j<3;j++){const a=j*1.047+R()*0.5;
      x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(a)*s*l[j],Math.sin(a)*s*l[j]);x.stroke();}
  }else{
    x.beginPath();x.moveTo(-s*0.9,0);
    x.quadraticCurveTo(-s*0.2,-s*0.26,s*(0.55+R()*0.5),s*0.05);x.stroke();}
  x.restore();
}

/* ── FELDBÄNDER ── Overlay, keine Ersatzschicht. Ein stetiges Feld, quantisiert auf fünf Stufen:
   daraus die klaren geschachtelten Formen, aus den gemalten Ebenen darunter die Hand. Es TÖNT
   nur (die Textur bleibt sichtbar) und setzt die Bandgrenze als Tusche unten rechts, Lichtsaum
   oben links — dieselbe Sonne wie die Kontaktschatten der Sprites (§21.2). */
function feldband(x,x0,y0){
  const N=5,P=2,w=Math.ceil(ZELLE/P),F=new Float32Array((w+2)*(w+2));
  for(let j=-1;j<=w;j++)for(let i=-1;i<=w;i++)F[(j+1)*(w+2)+(i+1)]=ffeld(x0+i*P,y0+j*P,0);
  const st=q=>Math.max(0,Math.min(N-1,Math.floor(q*N)));
  const roh=document.createElement('canvas');roh.width=roh.height=w;
  const rx=roh.getContext('2d'),bild=rx.createImageData(w,w),pix=bild.data;
  const ton=[[24,32,20,86],[36,50,30,44],[0,0,0,0],[196,214,150,40],[226,238,178,74]];
  const ti=[20,30,22,235],li=[214,232,166,215];
  for(let j=0;j<w;j++)for(let i=0;i<w;i++){
    const s=st(F[(j+1)*(w+2)+(i+1)]);
    const sL=st(F[(j+1)*(w+2)+i]),sR=st(F[(j+1)*(w+2)+(i+2)]);
    const sO=st(F[j*(w+2)+(i+1)]),sU=st(F[(j+2)*(w+2)+(i+1)]);
    const c=(sL!==s||sR!==s||sO!==s||sU!==s)?((sL>s||sO>s)?li:ti):ton[s];
    const o=(j*w+i)*4;pix[o]=c[0];pix[o+1]=c[1];pix[o+2]=c[2];pix[o+3]=c[3];}
  rx.putImageData(bild,0,0);
  x.save();x.imageSmoothingEnabled=false;x.drawImage(roh,x0,y0,ZELLE,ZELLE);x.restore();
}

const eimer=new Map(), schlange=[];
let laeuft=false;

function schluessel(zx,zy,biom){
  const a=API.an;
  return zx+','+zy+','+biom+','+KEIM+','+
    (a.zuege?1:0)+(a.schwamm?1:0)+(a.trocken?1:0)+(a.tusche?1:0)+
    (a.marken?1:0)+(a.papier?1:0)+(a.dreck?1:0)+(a.feld?1:0);
}

function backe(zx,zy,biom){
  const t0=performance.now();
  const B=BIOMES[biom]||BIOMES.hof,an=API.an;
  const c=document.createElement('canvas');
  c.width=c.height=Math.round(ZELLE*SUB);
  const x=c.getContext('2d'),x0=zx*ZELLE,y0=zy*ZELLE;
  x.setTransform(SUB,0,0,SUB,-x0*SUB,-y0*SUB);
  x.fillStyle=B.grund;x.fillRect(x0,y0,ZELLE,ZELLE);

  /* ZÜGE — wenige, lange, breite Bahnen, die weit über den Eimer hinausreichen. Dunkel nach
     hell geschichtet, deckend. Das IST die Fläche; es gibt keine Grundfarbe darunter zu sehen. */
  if(an.zuege){
    const lagen=[
      {okt:ZELLE*0.95,n:2,br:[300,470],len:[1300,2400],ton:0,streu:1.05},
      {okt:ZELLE*0.75,n:1,br:[180,300],len:[900,1700], ton:2,streu:1.35},
      {okt:ZELLE*0.60,n:1,br:[90,180], len:[600,1200], ton:3,streu:1.7},
      {okt:ZELLE*0.50,n:1,br:[40,90],  len:[380,780],  ton:4,streu:2.1},
    ];
    for(const L of lagen)
      for(const p of saat(x0,y0,x0+ZELLE,y0+ZELLE,L.okt,L.n,3+L.ton,1400)){
        const R=rnd(p.keim);
        const len=L.len[0]+R()*(L.len[1]-L.len[0]),br=L.br[0]+R()*(L.br[1]-L.br[0]);
        const a0=schwung(p.x,p.y);
        const pts=bahn({x:p.x-Math.cos(a0)*len*0.5,y:p.y-Math.sin(a0)*len*0.5},
          len,(R()-0.5)*L.streu,40,(R()-0.5)*1.3);
        const fam=familie(B,p.keim);
        /* Ton wandert je Zug um eine Stufe: Nachbarn berühren sich über eine Wertdifferenz,
           und die Kante ist entschieden statt unentschieden. */
        const stufe=Math.max(0,Math.min(4,L.ton+((p.keim>>5)%3)-1));
        const fremd=L.ton>=3&&(Math.abs(p.keim)%100)<4;
        zug(x,pts,br,fremd?B.akzent:fam[stufe],fremd?0.5:1,p.keim);
      }
  }
  if(an.schwamm){
    const R=rnd(hash(zx,zy,31)),n=Math.round(ZELLE*ZELLE/1600*B.schwamm.d);
    for(let i=0;i<n;i++){
      const px=x0+R()*ZELLE,py=y0+R()*ZELLE;
      const fam=familie(B,hash(i,zx*7+zy,17)),zu=Math.floor(R()*5);
      const g=Math.round((B.schwamm.g[0]+R()*(B.schwamm.g[1]-B.schwamm.g[0]))*2.1/4)*4;
      const art=Math.floor(R()*3),t=tupfer(g,fam[zu],hash(g,zu,art),art);
      x.save();x.globalAlpha=0.28+R()*0.5;x.translate(px,py);x.rotate(R()*6.283);
      x.drawImage(t,-t.width/2,-t.height/2);x.restore();}
  }
  if(an.trocken){
    for(const p of saat(x0,y0,x0+ZELLE,y0+ZELLE,ZELLE*0.8,1,61,1100)){
      const R=rnd(p.keim);if(R()>0.55*B.trocken+0.25)continue;
      const len=420+R()*760,a0=schwung(p.x,p.y);
      const fam=familie(B,p.keim);
      trocken(x,{x:p.x-Math.cos(a0)*len*0.5,y:p.y-Math.sin(a0)*len*0.5},
        len,60+R()*140,R()<0.5?fam[0]:fam[4],R);}
  }
  /* TUSCHE — die KFB-Kontur in drei Größen, getapert, bewusst NEBEN der Form. Sie umrandet
     nichts; sie begleitet und schwingt. Hell additiv (screen) gegen dunkel multiplizierend —
     Georgs Wahl vom 8.8.: beides gemischt, gegeneinander. */
  if(an.tusche){
    const lagen=[
      {okt:ZELLE*0.9,br:[11,21],len:[420,900]},
      {okt:ZELLE*0.6,br:[6,12], len:[300,660]},
      {okt:ZELLE*0.4,br:[3,6],  len:[190,430]},
    ];
    for(const L of lagen)
      for(const p of saat(x0,y0,x0+ZELLE,y0+ZELLE,L.okt,1,83,950)){
        const R=rnd(p.keim);
        const len=L.len[0]+R()*(L.len[1]-L.len[0]),hell=R()<0.46;
        const seit=(R()-0.5)*70,a0=schwung(p.x,p.y);
        const pts=bahn({x:p.x-Math.cos(a0)*len*0.5-Math.sin(a0)*seit,
          y:p.y-Math.sin(a0)*len*0.5+Math.cos(a0)*seit},len,(R()-0.5)*3.4,30,(R()-0.5)*2.6);
        x.save();x.globalCompositeOperation=hell?'screen':'multiply';
        zug(x,pts,L.br[0]+R()*(L.br[1]-L.br[0]),
          hell?B.akzent:familie(B,p.keim)[0],hell?0.5:0.62,p.keim^0x5f);
        x.restore();}
  }
  if(an.marken){
    const R=rnd(hash(zx,zy,101));
    for(let g=0;g<Math.round(11*B.markenDichte);g++){
      const nx=x0+R()*ZELLE,ny=y0+R()*ZELLE;
      for(let i=0,k=2+Math.floor(R()*4);i<k;i++){
        const a=R()*6.283,r=Math.pow(R(),0.6)*ZELLE*0.09;
        marke(x,B,nx+Math.cos(a)*r,ny+Math.sin(a)*r,R,R()<0.18);}}
  }
  /* DRECK & STAUB — Rauschen gehört hierhin und nirgendwo sonst: als Korn ÜBER allem, nie als
     eigene Fläche. Wer aus Rauschen Formen macht, benutzt das richtige Werkzeug am falschen Ort. */
  if(an.dreck){
    const R=rnd(hash(zx,zy,199));
    x.save();x.globalCompositeOperation='multiply';
    for(let i=0;i<240;i++){
      x.globalAlpha=0.03+R()*0.07;x.fillStyle=R()<0.5?'#4a4034':'#2a2620';
      x.beginPath();x.arc(x0+R()*ZELLE,y0+R()*ZELLE,0.6+R()*2,0,6.3);x.fill();}
    x.restore();
  }
  if(an.papier){
    x.save();x.globalCompositeOperation='multiply';x.globalAlpha=0.30;
    x.fillStyle=x.createPattern(papier(),'repeat');
    x.fillRect(x0,y0,ZELLE,ZELLE);x.restore();
  }
  if(an.feld)feldband(x,x0,y0);

  API.stats.bakes++;
  API.stats.bakeMs=Math.round((API.stats.bakeMs*(API.stats.bakes-1)+(performance.now()-t0))/API.stats.bakes);
  while(eimer.size>=96)eimer.delete(eimer.keys().next().value);
  eimer.set(schluessel(zx,zy,biom),c);
  API.stats.eimer=eimer.size;
  return c;
}

/* Ein Eimer je Einzelbild, in einem eigenen rAF — **nie im Zeichenpfad**. Wer synchron backt,
   erzeugt genau die Blockade, die dieses Projekt am 8.8. 36 Sekunden gekostet hat. */
function plan(){
  if(laeuft||!schlange.length)return;
  laeuft=true;
  requestAnimationFrame(()=>{
    laeuft=false;
    const e=schlange.shift();
    API.stats.warteschlange=schlange.length;
    if(e)backe(e.zx,e.zy,e.biom);
    plan();
  });
}
function eimerWennDa(zx,zy,biom){
  const key=schluessel(zx,zy,biom),da=eimer.get(key);
  if(da)return da;
  if(!schlange.some(e=>e.key===key)){schlange.push({key,zx,zy,biom});API.stats.warteschlange=schlange.length;}
  plan();
  return null;
}
API.warm=function(rect,biom){
  const b=biom||'hof';
  for(let zy=Math.floor(rect.y/ZELLE);zy<=Math.floor((rect.y+rect.h)/ZELLE);zy++)
    for(let zx=Math.floor(rect.x/ZELLE);zx<=Math.floor((rect.x+rect.w)/ZELLE);zx++)
      eimerWennDa(zx,zy,b);
  return schlange.length;
};

/* ── WABERN ── Eine Uhr, ein Feld, zwei Amplituden.
   Die Verschiebung ist waagerecht, die STRUKTUR kommt aus dem domänenverzerrten Feld — deshalb
   wandern runde, langsam morphende Beulen durch den Boden, ohne dass ein einziges Rund gezeichnet
   wird. `faktor` ist die zweite Amplitude: Requisiten wiegen mit `propFaktor` mit, Einheiten und
   Gebäude gar nicht (Georg, 8.8.). Ein wabernder Boden unter starr stehenden Bäumen liest sich
   als Fehler; wabernde Einheiten lesen sich als Bug. */
API.waberDx=function(worldY,zeit,faktor){
  const f=faktor==null?1:faktor;
  const q=ffeld(worldY*0.7,worldY,zeit*API.tempo)-0.5;
  return (Math.sin(worldY*0.009+zeit*0.38)*0.55+q*2.6)*API.waber*f;
};

const flaechen=new Map();   // je Biom eine Eimerfläche und eine Ausgabefläche
function flaeche(biom,W,H){
  let f=flaechen.get(biom);
  if(!f){f={bk:document.createElement('canvas'),out:document.createElement('canvas'),ox:null,oy:null};
    flaechen.set(biom,f);}
  const A=Math.ceil(API.waber)+3;
  if(f.bk.width!==W+2*A||f.bk.height!==H){f.bk.width=W+2*A;f.bk.height=H;f.ox=null;}
  if(f.out.width!==W||f.out.height!==H){f.out.width=W;f.out.height=H;}
  f.A=A;return f;
}

/* Zeichnet den Boden EINES Bioms in den Ausschnitt. `rect` sind Weltkoordinaten; der Aufrufer
   clippt vorher gegen seine Landmaske — der Boden ist die sichtbare Schicht, nie die spielende
   (Kollision bleibt beim `land[]`-Raster). */
API.floor=function(ctx,rect,biom,zeit){
  const W=Math.max(2,Math.ceil(rect.w)),H=Math.max(2,Math.ceil(rect.h));
  if(W>4096||H>4096)return false;
  const b=BIOMES[biom]?biom:'hof';
  const f=flaeche(b,W,H),A=f.A;
  const ox=Math.round(rect.x),oy=Math.round(rect.y);
  let fertig=true;
  /* `f.fertig===false` MUSS den Neuaufbau erzwingen. Sonst wird beim ersten Bild die flache
     Ersatzfüllung geschrieben und gecacht — und solange der Held stillsteht, ändert sich der
     Ursprung nie, also bleibt der Boden für immer flach. Genau die Fehlerklasse, die im Kopf
     dieses Moduls zitiert wird: auf »läuft« gaten, nie auf »existiert«. Der Zustand war da, er
     wurde nur nie gelesen. (Abnahme 8.8.: Farbspanne 0,0,0 im stehenden Bild.) */
  if(f.ox!==ox||f.oy!==oy||f.fertig===false){
    const bx=f.bk.getContext('2d');
    bx.setTransform(1,0,0,1,0,0);bx.clearRect(0,0,f.bk.width,f.bk.height);
    bx.setTransform(1,0,0,1,A-ox,-oy);
    for(let zy=Math.floor(oy/ZELLE);zy<=Math.floor((oy+H)/ZELLE);zy++)
      for(let zx=Math.floor((ox-A)/ZELLE);zx<=Math.floor((ox+W+A)/ZELLE);zx++){
        const e=eimerWennDa(zx,zy,b);
        if(e)bx.drawImage(e,zx*ZELLE,zy*ZELLE,ZELLE,ZELLE);
        else{fertig=false;bx.fillStyle=BIOMES[b].grund;bx.fillRect(zx*ZELLE,zy*ZELLE,ZELLE,ZELLE);}
      }
    bx.setTransform(1,0,0,1,0,0);
    f.ox=ox;f.oy=oy;f.fertig=fertig;
  }else fertig=f.fertig!==false;

  const S=Math.max(2,API.streifen|0);
  if(API.waber<=0.05){ctx.drawImage(f.bk,A,0,W,H,ox,oy,W,H);return fertig;}
  const oc=f.out.getContext('2d');
  oc.setTransform(1,0,0,1,0,0);
  /* Erst das Bild UNVERZERRT auflegen, dann die versetzten Streifen darüber. Drei Runden lang
     wurde in WS0 versucht, die Randabdeckung exakt auszurechnen — jedes Mal eine andere Lücke.
     Mit einer Grundlage darunter kann eine unbedeckte Spalte gar nicht auffallen. */
  oc.drawImage(f.bk,A,0,W,H,0,0,W,H);
  let blits=0;
  for(let y=0;y<H;y+=S){
    const dx=API.waberDx(oy+y,zeit||0,1);
    const yy=Math.max(0,y-1),hh=Math.min(H-yy,S+2);
    /* GANZZAHLIG abtasten: bei gebrochener Quell-x interpoliert drawImage an der Kante und zieht
       Transparenz von außerhalb herein — daher blieben in WS0 die ersten Spalten blass. */
    oc.drawImage(f.bk,Math.round(A-dx),yy,W,hh,0,yy,W,hh);blits++;
  }
  API.stats.streifenBlits=blits;
  ctx.drawImage(f.out,ox,oy);
  return fertig;
};

window.OW_BAND=API;
/* Die Malwerkzeuge nach außen \u2014 nicht als Bequemlichkeit, sondern weil die **Backstube** (Slice T1)
   dieselben Striche braucht und ein zweiter Satz derselben Regeln beim ersten Fork auseinanderläuft
   (Lehre S13b). Der Boden im Spiel und das gebackene Blatt müssen aus EINER Feder kommen. */
API.mal={zug,trocken,tupfer,saat,bahn,schwung,marke,papier,familie,rnd,hash,feldband,ffeld};
console.log('[band] '+VERSION+' — '+Object.keys(BIOMES).length+' Biome, Zelle '+ZELLE+
  ', Waber '+API.waber+' px, Streifen '+API.streifen);
})();
