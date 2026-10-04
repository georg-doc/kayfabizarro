/* KFB Overworld — Sprechblase als DOM/SVG-Overlay (v10-S9 · bubble-ts-v1)
   ------------------------------------------------------------------------------------------------
   **Portiert, nicht nachgebaut.** Der Zug kommt aus KFB Pet Studio v4 (`_rectPath`, `_blobPath`,
   `_thinkTail`, Anker-Physik) — Georgs Handover sagt ausdrücklich: Reuse. Übernommen sind die
   Kennzahlen und die Form; ersetzt ist nur der Anker: statt des Pet-Kopfes in einer 3D-Szene hängt
   die Blase hier an einer Einheit in Weltkoordinaten.

   **Was gilt (Kanon aus dem Handover):**
     · Rechteck mit Feder-Jitter (±1,3 px, vier Zwischenpunkte je Kante), **keine runden Ecken**
     · der Zipfel ist ein **getaperter Pfeil** (Schulterpunkte bei 55 %), keine Kerbe
     · Fuß im **zentralen Band** der Kante (32…68 %), wandert nie in die Ecke
     · Schnur **kurz**: `tailLen = clamp(14, arrow, Abstand−8)` — kein Gummiband quer durchs Bild
     · nur das **Papier** wird getönt, Linie und Schrift bleiben schwarz
     · drei Register: `speech` (Rechteck) · `thought` (Scallop-Wolke + zwei Kreise) · `whisper`
       (gestrichelt). Ein viertes wird nicht erfunden.
     · **Totzone** (innerhalb steht der Anker still) und **Trägheit** (weiches Nachziehen)
     · **immer nur EINE Blase**

   **Abgrenzung zur Plauderei:** die Umgebungs-Blasen (`mob-ai.js drawBubbles`) bleiben auf der
   Leinwand — sie sind viele, klein und kurz. Dieses Overlay ist die **eine bedienbare** Blase: die,
   die man angeklickt hat. Zwei Aufgaben, zwei Wege; die Regel »immer nur EINE« gilt für diese hier.

   Die Blase kann **Knöpfe** tragen (Georg 9.8.): attack · ask · taunt · philosophize · trade ·
   leave. Damit ist jeder Mob ein Point of Interest, ohne dass ein Dialogsystem gebaut wird. */
(function(){
'use strict';

const KANON={gap:46,pad:9,line:2,tint:0.5,font:15,arrow:34,dead:44,lazy:0.10,M:30};
const INK='#1f1a14';
/* **Ein Register, zwei Namen — also eine Tabelle.** Das Overlay heißt die Register seit v10-S9
   englisch (`speech`…), `bubble-layout.js` heißt sie deutsch (`rede`…). Wer das im Kopf umrechnet,
   rechnet es irgendwann falsch. */
const TYP={speech:'rede',thought:'gedanke',shout:'ruf',whisper:'fluester',kayfabulate:'kayfabulate'};
/* Bangers läuft optisch kleiner als ihre Punktgröße — eine SCHRIFTMETRIK, keine zweite Kanonzahl.
   Die 1,35 des Rufs stehen im Layout-Modul und werden hier nicht wiederholt. */
const OPT_BANGERS=1.45;
/* **Schrift-Variante für den Lesbarkeitsvergleich** (Georg, 12.8.). Der Bestand schreibt in
   Courier New; »Special Elite« ist die Schreibmaschine mit Comic-Anmutung, »Shantell Sans« die
   handgeschriebene Alternative. Eine Stelle, drei Kandidaten — wer sie umstellt, ändert auch die
   MESSUNG (`satz` misst mit der wirklich gesetzten Schrift), nicht nur das Aussehen. */
const SCHRIFTEN={
  'courier':  "'Courier New',monospace",
  'elite':    "'Special Elite','Courier New',monospace",
  'shantell': "'Shantell Sans','Comic Sans MS',cursive"
};
/* **Vorgabe seit 12.8. (Georg): `shantell`.** Der Bestand schrieb Courier — Schreibmaschine liest
   sich sauber, aber nicht gesprochen. Shantell Sans ist handgeschrieben und bleibt bei 13 px lesbar.
   **Der Erzählkasten macht die Ausnahme:** Kayfabulate bekommt *Special Elite*, weil Erzählung nicht
   dieselbe Stimme haben darf wie Rede — die Schrift trägt hier denselben Unterschied wie die Form. */
let SCHRIFT='shantell';
const SCHRIFT_JE_ART={kayfabulate:'elite'};
/* **Zeichenbreite wird gemessen, nicht angenommen.** Der erste C2-Anlauf gab dem Layout
   `charPx = font·0,60` mit — stimmt für Courier, nicht für Bangers und nicht für einen
   Ersatz-Monospace. Folge: der Block war schmaler als die Schrift, der Text lief aus der Kontur.
   `measureText` über den WIRKLICHEN Satz gibt den mittleren Vorschub dieser Schrift. */
const _mc=(function(){try{return document.createElement('canvas').getContext('2d');}catch(e){return null;}})();
function mittlereBreite(text,font,fallback){
  if(!_mc||!text)return fallback;
  _mc.font=font;
  const w=_mc.measureText(text).width;
  return w>0?w/text.length:fallback;
}
/* **Der Ruf steht im Bogen** (Georg, 12.8.): Bangers gerade auf der Linie liest sich wie eine
   Überschrift, nicht wie ein Schrei. Also je Zeichen eine kleine Drehung und ein Versatz auf einem
   flachen Bogen, dazu eine leichte Gesamtneigung — **geseedet**, damit dieselbe Blase immer gleich
   aussieht. Kein Filter, kein Warp: nur Buchstaben auf einer Kurve, wie von Hand gesetzt.
   Deshalb schreibt sich der Ruf auch nicht Zeichen für Zeichen ein: *ein Schrei tippt sich nicht.* */
function bogenSatz(text,seed,bogen){
  const rng=mulberry(seed+91);
  const zeichen=[...String(text)];
  const n=Math.max(1,zeichen.length-1);
  const spanne=(bogen==null?15:bogen)*Math.PI/180;      // Gesamtwinkel des Bogens
  let out='';
  zeichen.forEach((c,i)=>{
    const t=(i/n)-0.5;
    const w=t*spanne*(180/Math.PI);                     // Drehung je Zeichen
    const hoch=(1-Math.cos(t*spanne*1.6))*38;           // Bogenhöhe in px
    const kipp=(rng()*2-1)*1.6;
    out+="<span style='display:inline-block;transform:translateY("+hoch.toFixed(1)+
      "px) rotate("+(w+kipp).toFixed(1)+"deg)'>"+(c===' '?'&nbsp;':esc(c))+"</span>";
  });
  return out;
}

/* **Hat diese Schrift überhaupt einen Fettschnitt?** (Coworker, 12.8. — eine Messung, keine
   Meinung.) Viele Display- und Pixelschriften haben keinen; der Browser verfettet dann synthetisch,
   und bei 13 px sieht das matschig aus statt betont. Also messen: gleiche Breite bei 400 und 700
   heißt kein echter Schnitt. Dann trägt die Betonung **nicht** Fettdruck, sondern eine Spur mehr
   Größe und Laufweite — ein Mittel, eine Eigenschaft, nur ein anderes Mittel. */
const _fettCache={};
function hatFett(fam,px){
  const k=fam+'|'+px;
  if(k in _fettCache)return _fettCache[k];
  if(!_mc)return (_fettCache[k]=true);
  _mc.font='400 '+px+'px '+fam; const a=_mc.measureText('MMMWWWiii').width;
  _mc.font='700 '+px+'px '+fam; const b=_mc.measureText('MMMWWWiii').width;
  const ok=(b-a)>px*0.06;
  if(!ok&&!window['__owFett_'+k]){window['__owFett_'+k]=1;
    console.warn('[bubble] '+fam+' hat keinen echten Fettschnitt ('+a.toFixed(1)+' → '+b.toFixed(1)+
      ' px) — Betonung läuft über Größe und Laufweite');}
  return (_fettCache[k]=ok);
}

/* **Ein Satz, eine Rechnung.** Umbruch, Schriftgröße und Familie entstehen hier — der Träger
   (`setzen`) und das Messblatt (`KFB Blasen-Formen`) rufen beide diese Funktion. Wer sie nachbaut,
   prüft seinen Nachbau. */
function satz(text,typ,opts){
  const L=window.OW_BLAYOUT;
  const art=TYP[typ]||typ||'rede';
  const K=(L&&(L.KINDS[art]||L.KINDS.rede))||{fontScale:1};
  const schrei=art==='ruf';
  const gewaehlt=(opts&&opts.schrift)||SCHRIFT;
  const fam=schrei?"Bangers,'Irish Grover',cursive"
    :(SCHRIFTEN[SCHRIFT_JE_ART[art]||gewaehlt]||SCHRIFTEN.courier);
  const gesetzt=Math.round(KANON.font*(K.fontScale||1)*(schrei?OPT_BANGERS:1));
  const cw=mittlereBreite(String(text||''),gesetzt+'px '+fam,KANON.font*0.60);
  /* Die Breite kommt aus der WIRKLICH gesetzten Schrift, fett wie normal — sonst sitzt genau die
     Zeile mit dem betonten Wort daneben (Coworker-Fang 2). */
  const fettOk=hatFett(fam,gesetzt);
  const messen=(s,fett)=>{
    if(!_mc)return String(s).length*cw*(fett?1.06:1);
    _mc.font=((fett&&fettOk)?'700 ':'400 ')+
      (fett&&!fettOk?Math.round(gesetzt*1.06):gesetzt)+'px '+fam;
    return _mc.measureText(String(s)).width;
  };
  const lay=L?L.layout(String(text||''),art,
    {fontPx:KANON.font,charPx:cw/(K.fontScale||1),messen}):null;
  return {art,K,fam,gesetzt,schrei,lay,fettOk,
    fettStil:fettOk?'font-weight:700':'font-size:'+Math.round(gesetzt*1.06)+'px;letter-spacing:.04em',
    block:lay?lay.lines.join('\n'):String(text||''),
    stil:(schrei
      ? "font:400 "+gesetzt+"px "+fam+";letter-spacing:.02em;line-height:1.06"
      : "font:"+gesetzt+"px "+fam+";line-height:1.35")+";color:"+INK+
      ";text-align:center;white-space:pre"};
}

function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

/* ── Der Zug: jittriges Rechteck mit getapertem Pfeil (Pet Studio v4, unverändert übernommen) ── */
function rectPath(M,w,hh,seed,hlx,hly,arrow){
  const rng=mulberry(seed), j=()=>(rng()*2-1)*1.3;
  const x0=M,y0=M,x1=M+w,y1=M+hh,cx=M+w/2,cy=M+hh/2;
  const dx=(hlx==null?0:hlx-cx), dy=(hly==null?1:hly-cy);
  let edge; if(Math.abs(dy)>=Math.abs(dx))edge=dy>=0?0:1; else edge=dx>=0?2:3;
  const E=[{a:[x0,y0],b:[x1,y0],n:[0,-1],id:1},{a:[x1,y0],b:[x1,y1],n:[1,0],id:2},
           {a:[x1,y1],b:[x0,y1],n:[0,1],id:0},{a:[x0,y1],b:[x0,y0],n:[-1,0],id:3}];
  /* Pfeilbasis: 18 → 13,5 px (Georg, 12.8.: »ca. 1/4 schmaler«). Der Fuß bleibt im mittleren Band
     der Kante; schmaler heißt spitzer, nicht kürzer — die Länge macht `tailLen`. */
  const foot=13.5, hlen=Math.hypot(dx,dy)||1;
  const aMin=14, aMax=arrow==null?KANON.arrow:arrow;
  const tailLen=Math.max(aMin,Math.min(aMax,hlen-8));
  const P=[];
  for(const e of E){
    P.push([e.a[0],e.a[1]]);
    const len=Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]);
    const ux=(e.b[0]-e.a[0])/len, uy=(e.b[1]-e.a[1])/len;
    const K=4,mids=[];
    for(let k=1;k<K;k++){const ss=len*k/K;
      mids.push({s:ss,x:e.a[0]+ux*ss+e.n[0]*j(),y:e.a[1]+uy*ss+e.n[1]*j()});}
    if(e.id===edge){
      let ha=(hlx==null)?len/2:(hlx-e.a[0])*ux+(hly-e.a[1])*uy;
      ha=Math.max(len*0.32,Math.min(len*0.68,ha));
      const fcx=e.a[0]+ux*ha, fcy=e.a[1]+uy*ha;
      let tx,ty;
      if(hlx!=null&&hly!=null){const vx=hlx-fcx,vy=hly-fcy,tl=Math.hypot(vx,vy)||1;
        const use=Math.max(aMin,Math.min(aMax,tl));tx=fcx+vx/tl*use;ty=fcy+vy/tl*use;}
      else{tx=fcx+dx/hlen*tailLen;ty=fcy+dy/hlen*tailLen;}
      const fx=e.a[0]+ux*(ha-foot/2), fy=e.a[1]+uy*(ha-foot/2);
      const gx=e.a[0]+ux*(ha+foot/2), gy=e.a[1]+uy*(ha+foot/2);
      const shx=fcx+(tx-fcx)*0.55, shy=fcy+(ty-fcy)*0.55;
      const s1x=shx+(fx-fcx)*0.34, s1y=shy+(fy-fcy)*0.34;
      const s2x=shx+(gx-fcx)*0.34, s2y=shy+(gy-fcy)*0.34;
      for(const m of mids)if(m.s<ha-foot/2)P.push([m.x,m.y]);
      P.push([fx,fy],[s1x,s1y],[tx,ty],[s2x,s2y],[gx,gy]);
      for(const m of mids)if(m.s>ha+foot/2)P.push([m.x,m.y]);
    }else{for(const m of mids)P.push([m.x,m.y]);}
  }
  let d='M'+P[0][0].toFixed(1)+' '+P[0][1].toFixed(1);
  for(let p=1;p<P.length;p++)d+=' L'+P[p][0].toFixed(1)+' '+P[p][1].toFixed(1);
  return d+' Z';
}
/* **Die ovale Grundform** (Georg, 12.8.): »die Bubbles dürfen nicht stumpf aus Kreisen gebaut sein;
   es muss eine ovale Grundform sein, die harmonisch mit Bogenformen nachgezeichnet wird.«
   Also EINE Grundellipse für Wolke und Ruf: sie umschließt den Textblock (Halbmaße × √2 + Polster,
   damit die Ecken sicher drin liegen) und wird flach begrenzt, damit eine einzeilige Zeile keine
   Zigarre ergibt. Lappen und Zacken sitzen danach AUF dieser Ellipse — sie ist die Harmonie, die
   Bögen sind die Handschrift. */
function ovalBasis(w,hh,padX,padY){
  /* **Zweiter Befund am Rand (Georg, 12.8.): die Ellipse durch die Ecken polstert ungleich.**
     Die kleinste ähnliche Ellipse um ein Rechteck ist Halbmaß × √2 — an den Ecken sitzt sie am
     Block, an den Seiten steht sie 41 % der halben Breite ab. Bei einer breiten Zeile sind das
     40 px links und rechts und 14 px oben: dieselbe Zahl, völlig andere Wirkung.
     Deshalb eine **Superellipse** (n = 3): sie hält denselben glatten Zug, legt sich aber eng um
     den Block und polstert überall ähnlich. Der Rest ist eine Mindestskalierung, damit die Ecken
     sicher innen liegen. *Ein Polster ist erst gleich, wenn es überall gleich gemessen wird.* */
  const n=3, halfW=w/2, halfH=hh/2;
  let a=halfW+padX, b=halfH+padY;
  const drin=Math.pow(halfW/a,n)+Math.pow(halfH/b,n);
  if(drin>1){const k=Math.pow(drin,1/n);a*=k;b*=k;}
  const r=ang=>{
    const c=Math.abs(Math.cos(ang)), s=Math.abs(Math.sin(ang));
    return 1/Math.pow(Math.pow(c/a,n)+Math.pow(s/b,n),1/n);
  };
  return {rx:a,ry:b,r};
}

/* **Ruf · Sternplatzer** (C2, 2026-08-12 — ERSETZT den gezackten Kasten aus v10-S18).
   Georgs Befund: die alte Fassung war ein Rechteck mit Zähnen, also eine Kante mit Sägeprofil.
   Die klassische Comic-Logik ist eine ANDERE Form: **Spitzen strahlen von der Mitte nach außen**,
   lange und kurze abwechselnd, Täler tief dazwischen. Der Ruf ist deshalb jetzt **radial** gebaut
   und nicht mehr kantenweise. *Eine Zacke auf einer Kante ist kein Platzer — sie ist eine Kante
   mit Zähnen.*

   Die Regeln, damit daraus kein Seeigel wird:
   · **7 bis 11 Spitzen**, aus dem Umfang gerechnet, nicht je Kante gezählt.
   · Das Tal-Oval **umschreibt** den Textblock (Halbmaße × 1,42 + Polster), sonst schneiden die Täler
     in die Schrift. Darum wirkt ein Sternplatzer immer größer als eine Rede — er ist es auch.
   · Spitzen **abwechselnd lang und kurz** (1,52 / 1,22 des Tals) mit Streuung: Regelmäßigkeit wäre
     ein Zahnrad, kein Ausruf.
   · **Der Zipfel ist eine gestreckte Spitze**, keine angesetzte Fahne — die dem Anker nächste Spitze
     wird lang gezogen und bekommt zwei Schulterpunkte (55 %), damit sie sich verjüngt. Er zeigt
     GERADE auf die Einheit, wie bei allen anderen Registern (Georg, 12.8.).
   · Eine Fläche, eine Kontur — wie überall (Georg 9.8.). */
function burstPath(M,w,hh,seed,hlx,hly,arrow){
  const rng=mulberry(seed);
  const cx=M+w/2, cy=M+hh/2;
  /* Grundmaß ist das **Oval**, nicht das Rechteck (Georg, 12.8.). Mit der Rechteckkante wuchsen
     zwei waagerechte Hörner, weil der Abstand zur Kante an den Diagonalen springt; auf der Ellipse
     läuft er rund, und die Zacken sitzen gleichmäßig. */
  const O=ovalBasis(w,hh,13,11);
  const rTal=O.r;
  /* **Zweiter Anlauf (Georgs Referenzblatt).** Der erste hatte zu wenige, zu ungleiche Spitzen —
     das liest sich als Klecks mit Hörnern. Im Vorbild ist der Platzer ein **Kranz**: VIELE Spitzen
     (12–18), fast gleich lang, dazwischen Täler, die bis auf den Block zurückgehen. Die Wirkung
     kommt aus der Zahl und der Tiefe, nicht aus der Streuung.
     *Ein Ausruf ist ein Kranz, kein Igel mit zwei langen Stacheln.* */
  const umfang=Math.PI*(3*(O.rx+O.ry)-Math.sqrt((3*O.rx+O.ry)*(O.rx+3*O.ry)));  // Ramanujan
  const N=Math.max(12,Math.min(18,Math.round(umfang/34)));
  const lang=Math.max(16,Math.min(34,Math.min(O.rx,O.ry)*0.42+9));
  const dx=(hlx==null?0:hlx-cx), dy=(hly==null?1:hly-cy);
  const hlen=Math.hypot(dx,dy)||1;
  const ziel=Math.atan2(dy,dx);
  const step=Math.PI*2/N;
  const a0=Math.PI/2+(rng()*2-1)*0.12;
  const sp=[];
  for(let i=0;i<N;i++)
    sp.push({a:a0+i*step+(rng()*2-1)*step*0.07, len:lang*(0.86+rng()*0.22)});
  let zip=0, best=1e9;
  for(let i=0;i<N;i++){
    const d=Math.abs(Math.atan2(Math.sin(sp[i].a-ziel),Math.cos(sp[i].a-ziel)));
    if(d<best){best=d;zip=i;}
  }
  const P=[], pol=(a,r)=>[cx+Math.cos(a)*r, cy+Math.sin(a)*r];
  for(let i=0;i<N;i++){
    const s=sp[i], nx=sp[(i+1)%N];
    const tal=s.a+(((nx.a-s.a)+Math.PI*2)%(Math.PI*2))/2;
    if(i===zip){
      const maxA=arrow==null?KANON.arrow:arrow;
      const reach=rTal(s.a)+Math.max(16,Math.min(maxA*0.9,hlen-8));
      const tip=pol(s.a,reach);
      const wl=pol(s.a-step*0.40,rTal(s.a-step*0.40)*0.92), wr=pol(s.a+step*0.40,rTal(s.a+step*0.40)*0.92);
      const shL=[wl[0]+(tip[0]-wl[0])*0.55, wl[1]+(tip[1]-wl[1])*0.55];
      const shR=[wr[0]+(tip[0]-wr[0])*0.55, wr[1]+(tip[1]-wr[1])*0.55];
      P.push(wl,shL,tip,shR,wr,pol(tal,rTal(tal)*0.92));
    }else{
      P.push(pol(s.a,rTal(s.a)+s.len), pol(tal,rTal(tal)*0.92));
    }
  }
  let d='M'+P[0][0].toFixed(1)+' '+P[0][1].toFixed(1);
  for(let p=1;p<P.length;p++)d+=' L'+P[p][0].toFixed(1)+' '+P[p][1].toFixed(1);
  return d+' Z';
}

/* **Aufprall-Striche** — im Vorbild gehören sie zum Schrei wie die Kreise zum Gedanken: kurze
   Keile AUSSERHALB der Fläche, in drei Gruppen, nie rundherum verteilt. Sie sind **kein Teil der
   Kontur** (Kanon: eine Fläche, eine Kontur), sondern ein eigenes Element wie `thinkTail` —
   deshalb stehen sie in derselben Gruppe und nicht im Pfad. */
function aufprall(g,M,w,hh,seed,hlx,hly){
  if(!g)return;
  const rng=mulberry(seed+17);
  const cx=M+w/2, cy=M+hh/2;
  const O=ovalBasis(w,hh,13,11), rTal=O.r;
  const zip=Math.atan2((hly==null?1:hly-cy),(hlx==null?0:hlx-cx));
  const lang=Math.max(16,Math.min(34,Math.min(O.rx,O.ry)*0.42+9));
  let out='';
  /* Drei Gruppen, gesetzt statt gestreut: oben links, oben rechts, unten — und die Gruppe, in der
     der Zipfel steht, fällt aus (dort ist schon Bewegung). */
  const gruppen=[-Math.PI*0.78,-Math.PI*0.22,Math.PI*0.5];
  for(const gm of gruppen){
    if(Math.abs(Math.atan2(Math.sin(gm-zip),Math.cos(gm-zip)))<0.5)continue;
    for(let k=0;k<3;k++){
      const a=gm+(k-1)*0.16+(rng()*2-1)*0.05;
      const r0=rTal(a)+lang*(1.25+rng()*0.20);
      const r1=r0+lang*(0.55+rng()*0.35);
      const x0=cx+Math.cos(a)*r0, y0=cy+Math.sin(a)*r0;
      const x1=cx+Math.cos(a)*r1, y1=cy+Math.sin(a)*r1;
      const q=1.6+rng()*1.0;                         // Keil: am Ende dicker, am Anfang spitz
      const nx=-Math.sin(a)*q, ny=Math.cos(a)*q;
      out+="<path d='M"+x0.toFixed(1)+" "+y0.toFixed(1)+
        " L"+(x1+nx).toFixed(1)+" "+(y1+ny).toFixed(1)+
        " L"+(x1-nx).toFixed(1)+" "+(y1-ny).toFixed(1)+" Z' fill='"+INK+"'/>";
    }
  }
  g.innerHTML=out;
}

/* **Kayfabulate · der Kasten** (C2). Erzählung, nicht Rede: gerade Kanten, **kein Zipfel**, sitzt
   höher. Vier Zeilen, bis 34 Zeichen — beides entscheidet `bubble-layout.js`, nicht diese Datei.
   Ein Hauch Jitter (±0,5 px), damit er nicht wie ein UI-Dialog aussieht, aber deutlich weniger als
   die Rede: ein Kasten, der wackelt, ist wieder eine Blase.
   **Offen (O2):** Kasten ODER Blase mit doppelter Kontur. Bis Georg entscheidet: Kasten. */
function kastenPath(M,w,hh,seed){
  /* **Keine tote Linie** (Georg, 12.8.). Der erste Kasten war ein gerades Rechteck mit ±0,5 px —
     das liest sich als UI-Dialog, nicht als Erzählkasten im Heft. Jetzt dieselbe Federsprache wie
     die Rede (vier Zwischenpunkte je Kante, ±1,3 px, keine runden Ecken), nur **ohne Zipfel**:
     der Kasten ist Erzählung, er kommt aus keinem Mund.
     ⚠ Das ist die Jitter-Kante des Trägers, **nicht** die Kanon-Feder — die kann im SVG bis heute
     niemand zeichnen (siehe `fluesterKante`, Naht 115). Derselbe offene Punkt, dieselbe Bitte. */
  const rng=mulberry(seed), j=()=>(rng()*2-1)*1.3;
  const x0=M,y0=M,x1=M+w,y1=M+hh;
  const E=[{a:[x0,y0],b:[x1,y0],n:[0,-1]},{a:[x1,y0],b:[x1,y1],n:[1,0]},
           {a:[x1,y1],b:[x0,y1],n:[0,1]},{a:[x0,y1],b:[x0,y0],n:[-1,0]}];
  const P=[];
  for(const e of E){
    P.push([e.a[0],e.a[1]]);
    const len=Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]);
    const ux=(e.b[0]-e.a[0])/len, uy=(e.b[1]-e.a[1])/len;
    for(let k=1;k<4;k++){const s=len*k/4;
      P.push([e.a[0]+ux*s+e.n[0]*j(), e.a[1]+uy*s+e.n[1]*j()]);}
  }
  let d='M'+P[0][0].toFixed(1)+' '+P[0][1].toFixed(1);
  for(let p=1;p<P.length;p++)d+=' L'+P[p][0].toFixed(1)+' '+P[p][1].toFixed(1);
  return d+' Z';
}
/* **Denkwolke, zweiter Anlauf (Georgs Referenzblatt).** Vorher: Punkte auf einer Ellipse, mit
   Bögen vom halben Sehnenmaß verbunden — das ergibt eine gewellte Kartoffel, keine Wolke.
   Im Vorbild ist die Wolke ein **Kranz fetter Lappen**: jeder Lappen ist ein fast voller Kreisbogen
   nach außen, und zwischen zwei Lappen sitzt eine **Einkerbung**, die bis auf den Textblock
   zurückgeht. Also: Kerben auf dem Grundmaß, Lappen als Bögen darüber, Radius größer als die halbe
   Sehne (Bauchung 0,78) — dann wölbt sich der Bogen, statt nur zu runden.
   *Eine Wolke ist ein Kranz aus Lappen, keine gewellte Kante.* */
function blobPath(M,w,hh,seed){
  const P=blobPunkte(M,w,hh,seed);
  let d='M'+P[0][0].toFixed(1)+' '+P[0][1].toFixed(1);
  for(let i=1;i<P.length;i++)d+=' L'+P[i][0].toFixed(1)+' '+P[i][1].toFixed(1);
  return d+' Z';
}
/* **Die Lappen als dichte Punktkette, nicht als A-Befehl.** Ein Bogen im `d` ist für den Betrachter
   dasselbe, für die Kanon-Feder aber nichts: sie zeichnet über eine PUNKTLISTE. Solange die Wolke
   aus `A`-Befehlen bestand, konnte sie als einzige Form keine KFB-Kante bekommen.
   Also acht Stützpunkte je Lappen (quadratisch, Bauchung 0,22 der Sehne) — optisch derselbe Zug,
   aber eine Kette, die jeder lesen kann. *Eine Form, die nur der Renderer versteht, hat keine Kante.* */
function blobPunkte(M,w,hh,seed){
  const rng=mulberry(seed);
  const cx=M+w/2, cy=M+hh/2;
  const O=ovalBasis(w,hh,12,10), rKerbe=O.r;
  const umfang=Math.PI*(3*(O.rx+O.ry)-Math.sqrt((3*O.rx+O.ry)*(O.rx+3*O.ry)));
  const N=Math.max(7,Math.min(12,Math.round(umfang/62)));
  const step=Math.PI*2/N;
  const a0=-Math.PI/2+(rng()*2-1)*0.18;
  const K=[];
  for(let i=0;i<N;i++){const a=a0+i*step+(rng()*2-1)*step*0.10;K.push([cx+Math.cos(a)*rKerbe(a),cy+Math.sin(a)*rKerbe(a)]);}
  const P=[];
  for(let i=0;i<N;i++){
    const p0=K[i], p1=K[(i+1)%N];
    const mx=(p0[0]+p1[0])/2, my=(p0[1]+p1[1])/2;
    const sehne=Math.hypot(p1[0]-p0[0],p1[1]-p0[1])||1;
    let nx=(my-cy), ny=-(mx-cx);            // Normale nach außen
    const nl=Math.hypot(mx-cx,my-cy)||1;
    nx=(mx-cx)/nl; ny=(my-cy)/nl;
    const bauch=sehne*(0.42+rng()*0.06);    // Steuerpunkt: doppelte Sagitta
    const qx=mx+nx*bauch, qy=my+ny*bauch;
    const S=8;
    for(let s=0;s<S;s++){
      const t=s/S, u=1-t;
      P.push([u*u*p0[0]+2*u*t*qx+t*t*p1[0], u*u*p0[1]+2*u*t*qy+t*t*p1[1]]);
    }
  }
  return P;
}
function thinkTail(g,M,w,hh,hlx,hly,paper,line,t){
  if(!g)return;
  const cx=M+w/2, cy=M+hh/2;
  let dx=(hlx==null?0:hlx-cx), dy=(hly==null?1:hly-cy);
  const L=Math.hypot(dx,dy)||1; dx/=L; dy/=L;
  /* Die Kreise liegen **außerhalb** der Wolke (Georg, 12.8.). Vorher saßen sie auf halber
     Blockbreite und lagen damit unter den Lappen — die Wolke hat aber ein Oval als Grundmaß, und
     die Lappen stehen noch darüber. Also vom Ellipsenrand aus messen, plus Lappenhöhe. */
  const OO=ovalBasis(w,hh,12,10);
  const kante=OO.r(Math.atan2(dy,dx))+Math.min(OO.rx,OO.ry)*0.22;
  const ex=cx+dx*kante, ey=cy+dy*kante;
  /* Atem statt Standbild: jeder Kreis wandert ein Stück auf der Achse und pulst leicht — versetzt,
     damit es wie Aufsteigen liest und nicht wie Zittern. */
  const T=t||0;
  const c=(o,r,ph)=>{
    const wander=Math.sin(T*1.6+ph)*2.2, puls=1+Math.sin(T*2.1+ph)*0.10;
    return "<circle cx='"+(ex+dx*(o+wander)).toFixed(1)+"' cy='"+(ey+dy*(o+wander)).toFixed(1)+
      "' r='"+(r*puls).toFixed(2)+"' fill='"+paper+"' stroke='"+INK+"' stroke-width='"+line+"'/>";
  };
  g.innerHTML=c(10,5,0)+c(24,3.2,1.1);
}

/* **Gestrichelt heißt: Lücken über einer DURCHGÄNGIGEN Kante** (Georg, 12.8.).
   Damit löst sich der Befund aus Naht 115 ohne zweiten Federzeichner: die Kante wird **einmal**
   gezeichnet — heute die Jitter-Kante des Trägers, morgen die Kanon-Feder, sobald sie im SVG
   ankommt — und eine SVG-Maske stanzt die Lücken hinein. Der Strich bleibt also der Strich; er
   wird nur stellenweise nicht gezeigt.
   *Ein Stil ist eine Maske über der Kante, keine zweite Kante.*
   Die Lücken sitzen auf dem Pfad selbst (Punkte aus dem `d` zurückgelesen), stehen quer zur
   Laufrichtung und sind etwas dicker als die Feder, damit sie sauber durchtrennen. */
function lueckenGeo(d,schritt,breite,dick){
  const pts=punkteAus(d), out=[];
  if(pts.length<4)return out;
  let rest=schritt*0.5;
  for(let i=0;i<pts.length;i++){
    const a=pts[i], b=pts[(i+1)%pts.length];
    const dx=b[0]-a[0], dy=b[1]-a[1], len=Math.hypot(dx,dy);
    if(len<0.01)continue;
    const ux=dx/len, uy=dy/len, w=Math.atan2(uy,ux);
    let s=rest;
    while(s<len){out.push({x:a[0]+ux*s,y:a[1]+uy*s,a:w,w:breite,h:dick});s+=schritt;}
    rest=s-len;
  }
  return out;
}
function luecken(d,schritt,breite,dick){
  const pts=[];
  for(const m of d.matchAll(/[ML]([-\d.]+) ([-\d.]+)/g))pts.push([+m[1],+m[2]]);
  if(pts.length<4)return '';
  let out='', rest=schritt*0.5;
  for(let i=0;i<pts.length;i++){
    const a=pts[i], b=pts[(i+1)%pts.length];
    const dx=b[0]-a[0], dy=b[1]-a[1], len=Math.hypot(dx,dy);
    if(len<0.01)continue;
    const ux=dx/len, uy=dy/len, w=Math.atan2(uy,ux)*180/Math.PI;
    let s=rest;
    while(s<len){
      const x=a[0]+ux*s, y=a[1]+uy*s;
      out+="<rect x='"+(-breite/2).toFixed(1)+"' y='"+(-dick/2).toFixed(1)+"' width='"+breite+
        "' height='"+dick+"' fill='#000' transform='translate("+x.toFixed(1)+" "+y.toFixed(1)+
        ") rotate("+w.toFixed(1)+")'/>";
      s+=schritt;
    }
    rest=s-len;
  }
  return out;
}

/* Die gestrichelte Kanon-Feder über einem fertigen Pfad. Punkte aus dem `d` zurücklesen statt sie
   ein zweites Mal zu bauen — zwei Rechnungen für eine Kante ergeben zwei Kanten.

   ⚠ **BEFUND 12.8. (C2): diesen Weg gibt es im Kanon nicht.** `kfb-ink-canon.js` v2 führt
   `inkRibbon2D` / `inkHalfWidth` / `measureInk` und die Presets `card · chip · academy-2026-07 ·
   sky-2026-07` — **kein `dashedPathD` und kein Preset `card-dash`**. Der Aufruf war seit v10-S15
   ein Griff nach einer API, die es nicht gibt: er lieferte immer `''`, und weil die Blase daraufhin
   mit `stroke-width 0` gezeichnet wurde, hatte das Flüstern **nie** eine Kante — sichtbar war nur
   der Schlagschatten.
   Ein zweiter Federzeichner wird hier NICHT gebaut (K5: eine Feder, ein Ort). Bis der Kanon eine
   gestrichelte Variante bekommt, gilt der gestrichelte Strich als **benannter Platzhalter**.
   Zusätzlich: `inkRibbon2D` zeichnet auf einen **Canvas**-Kontext, nicht in einen SVG-Pfad — eine
   Kanonfeder im Overlay braucht also entweder eine Canvas-Ebene oder eine SVG-Ausgabe im Kanon.
   *Beides ist eine Entscheidung des Kanon-Eigentümers, keine dieses Moduls.* */
function fluesterKante(d){
  const C=window.OW_CARD&&OW_CARD.canon;
  if(!C||!C.INK_PRESETS)return '';
  if(!C.dashedPathD){
    if(!window.__owKanonDash){window.__owKanonDash=1;
      console.warn('[bubble] Kanon v'+(C.INK_CANON_VERSION||'?')+' hat kein dashedPathD und kein Preset '+
        '»card-dash« — Flüstern läuft auf dem gestrichelten Platzhalter (K5: kein zweiter Federzeichner)');}
    return '';
  }
  const pts=[];
  for(const m of d.matchAll(/[ML]([-\d.]+) ([-\d.]+)/g))pts.push([+m[1],+m[2]]);
  if(pts.length<8)return '';
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const q of pts){if(q[0]<x0)x0=q[0];if(q[0]>x1)x1=q[0];if(q[1]<y0)y0=q[1];if(q[1]>y1)y1=q[1];}
  const W=Math.max(1,x1-x0), H=Math.max(1,y1-y0);
  const p=C.INK_PRESETS['card-dash'];
  if(!p)return '';
  try{
    const half=C.inkHalfWidth(pts,W,H,7,p,1.6);
    return C.dashedPathD(pts,half,p,W,H,7);
  }catch(e){return '';}
}

/* **Die KFB-Feder für alle Register** (Georg, 12.8.: »Ruf hat eine dead line … bitte für alle«).
   Der Kanon zeichnet auf **Canvas** (`inkRibbon2D`), das Overlay ist SVG — also bekommt das Overlay
   eine Canvas-Ebene: die Fläche bleibt SVG (Papier, Maske, Klick), die **Kante** kommt aus dem
   Kanon, über dieselbe Punktkette, die die Fläche begrenzt. Kein zweiter Federzeichner (K5), keine
   nachgebaute Feder — der Kanon selbst, nur auf seiner eigenen Ausgabefläche.
   Lücken (Flüstern) werden **herausradiert** (`destination-out`) statt gestrichelt gezeichnet:
   dieselbe Geometrie wie die SVG-Maske, dieselbe Regel — ein Stil ist eine Maske über der Kante. */
function punkteAus(d){
  const pts=[];
  for(const m of d.matchAll(/[ML]([-\d.]+) ([-\d.]+)/g))pts.push([+m[1],+m[2]]);
  return pts;
}
function kanonFeder(cv,W,H,d,seed,gaps,preset){
  const C=window.OW_CARD&&OW_CARD.canon;
  if(!cv)return false;
  const g=cv.getContext('2d');
  const dpr=Math.min(2,window.devicePixelRatio||1);
  /* **Nur umbauen, wenn sich das Maß ändert.** Ein `canvas.width`-Schreibzugriff LÖSCHT die Fläche —
     je Bild neu gesetzt heißt: zwischen Löschen und Zeichnen darf nichts schiefgehen, sonst bleibt
     eine leere Kante stehen und niemand sieht warum. */
  const bw=Math.max(1,Math.round(W*dpr)), bh=Math.max(1,Math.round(H*dpr));
  if(cv.width!==bw||cv.height!==bh){cv.width=bw;cv.height=bh;
    cv.style.width=W+'px';cv.style.height=H+'px';}
  g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
  if(!C||!C.inkRibbon2D||!C.inkHalfWidth||!C.INK_PRESETS)return false;
  const pts=punkteAus(d);
  if(pts.length<8)return false;
  const p=C.INK_PRESETS[preset||'card'];
  if(!p)return false;
  try{
    const half=C.inkHalfWidth(pts,W,H,seed|0,p,1.0);
    C.inkRibbon2D(g,pts,half,INK);
  }catch(e){
    if(!window.__owFederWarn){window.__owFederWarn=1;
      console.warn('[bubble] Kanon-Feder nicht gezeichnet:',e&&e.message);}
    return false;
  }
  if(gaps&&gaps.length){
    g.globalCompositeOperation='destination-out';
    for(const q of gaps){g.save();g.translate(q.x,q.y);g.rotate(q.a);
      g.fillRect(-q.w/2,-q.h/2,q.w,q.h);g.restore();}
    g.globalCompositeOperation='source-over';
  }
  return true;
}

/* ── Das Overlay ───────────────────────────────────────────────────────────────────────────── */
let host=null, el=null, svg=null, pfad=null, denk=null, strich=null, box=null, txtEl=null, aktuell=null, maske=null, feder=null;
const anker={x:0,y:0,gesetzt:false};

/* Bangers, nur für den Schrei. **Nicht** Irish Grover: die trägt schon HUD und Karten, und eine
   Schrift mit zwei Bedeutungen ist eine zweite Wahrheit über »laut« (WS1-Einwand, von ChatGPT
   übernommen). Einmal geladen, mit eigener Kennung. */
function schriftLaden(){
  if(document.getElementById('ow-bubble-fonts'))return;
  const l=document.createElement('link');l.id='ow-bubble-fonts';l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Bangers&family=Shantell+Sans:wght@400;600'+
    '&family=Special+Elite&display=swap';
  document.head.appendChild(l);
}
function bauen(g){
  if(el)return;
  schriftLaden();
  host=document.createElement('div');
  host.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:7';
  el=document.createElement('div');
  el.style.cssText='position:absolute;pointer-events:auto;cursor:pointer;'+
    'filter:drop-shadow(2px 3px 0 rgba(31,26,20,.18))';
  el.innerHTML="<canvas class='feder' style='position:absolute;left:0;top:0;pointer-events:none'></canvas>"+
    "<svg style='position:absolute;left:0;top:0;overflow:visible'>"+
    "<defs><mask id='ow-fl-mask' maskUnits='userSpaceOnUse' x='-40' y='-40' width='4000' height='4000'>"+
      "<rect class='mk-bg' x='-40' y='-40' width='4000' height='4000' fill='#fff'/>"+
      "<g class='mk-gaps'></g></mask></defs>"+
    "<path class='out' fill='#fbf6ea' stroke='"+INK+"' stroke-linejoin='round'/>"+
    "<path class='dash' fill='"+INK+"'/>"+
    "<g class='think'></g></svg>"+
    "<div class='body' style='position:relative'></div>";
  svg=el.querySelector('svg');pfad=el.querySelector('.out');denk=el.querySelector('.think');
  maske=el.querySelector('.mk-gaps');
  feder=el.querySelector('.feder');
  strich=el.querySelector('.dash');
  box=el.querySelector('.body');
  el.onclick=e=>{if(e.target===el||e.target===svg||e.target===pfad)schliessen(g);};
  host.appendChild(el);
  (g.shadowRoot||g).appendChild(host);
}
function schliessen(g){
  aktuell=null;anker.gesetzt=false;
  if(el)el.style.display='none';
  if(g&&g.audio)g.audio.sfx('uiClose');
}
/* Weltpunkt → Bildschirmpunkt. Dieselbe Rechnung wie die Leinwand, nur ohne dpr:
   das Overlay liegt in CSS-Pixeln über dem Canvas. */
function w2s(g,wx,wy){
  const z=g.zoomEff?g.zoomEff():(g.att&&g.att.zoom||1);
  const w=g.clientWidth||(g.cv?g.cv.width/(g.dpr||1):0);
  const h=g.clientHeight||(g.cv?g.cv.height/(g.dpr||1):0);
  return {x:(wx-g.cam.x)*z+w/2, y:(wy-g.cam.y)*z+h/2, z};
}

function zeigen(g,unit,o){
  o=o||{};
  bauen(g);
  aktuell={unit,typ:o.type||'speech',text:String(o.text||''),
    aktionen:(o.actions||[]).slice(0,6),seed:0,
    /* v10-S18 · **Geometrie vor dem Streaming** (ChatterBox S1 §3, harte Regel).
       Der vollständige Text wird **einmal** gemessen, daraus entstehen Kontur, Zipfel und Jitter —
       und erst dann läuft der Text hinein. Andernfalls wüchse die Box mit jedem Zeichen, der Pfad
       würde 40× je Sekunde neu gebaut, und die Kontur zappelte beim Lesen.
       *Streaming ändert den Inhalt, nie die Form.* */
    geo:null, gezeigt:(o.stream===false||(o.type||'speech')==='shout')?1e9:0, t0:performance.now()};
  aktuell.seed=(aktuell.text.length*131+aktuell.aktionen.length*17+aktuell.typ.length*7)%9999;
  anker.gesetzt=false;
  el.style.display='block';
  setzen(g);
  /* Messen mit vollem Text, dann einfrieren. `offsetWidth` ist erst nach dem Setzen gültig — hier
     steht der volle Text noch drin, das ist genau der Zweck. */
  aktuell.geo={w:box.offsetWidth,h:box.offsetHeight};
  if(aktuell.gezeigt===0)streamen();
  if(g.audio)g.audio.sfx(o.type==='shout'?'hit':'uiOpen',{gain:o.type==='shout'?0.5:0.5});
  return aktuell;
}
/* Der Text läuft in die fertige Blase. Tempo als Zeichen je Sekunde — deutlich schneller als
   Lesetempo (ChatterBox S1 §5: »Streaming speed ≠ reading speed«). */
function streamen(){
  const b=aktuell;if(!b||!txtEl)return;
  const CPS=55;
  /* Gestreamt wird der **umbrochene Block**, nicht der Rohsatz — sonst verschwinden die Umbrüche
     beim Schreiben und die Kontur hätte eine andere Form als der Inhalt. */
  /* Ein fettes Wort, das buchstabenweise einläuft, verliert seine Auszeichnung mittendrin —
     deshalb wird ein betonter Satz **gesetzt**, nicht getippt. */
  if(b.lay&&b.lay.betont>0){b.gezeigt=1e9;return;}
  const full=b.block||b.text;
  const n=Math.floor((performance.now()-b.t0)/1000*CPS);
  b.gezeigt=n;
  const s=full.slice(0,Math.min(n,full.length));
  if(txtEl.textContent!==s)txtEl.textContent=s;
  if(n<full.length)requestAnimationFrame(()=>{if(aktuell===b)streamen();});
}
function setzen(g){
  const b=aktuell;if(!b)return;
  const tint=KANON.tint;
  const paper='rgb('+[250-tint*6,244-tint*22,230-tint*62].map(Math.round).join(',')+')';
  const knoepfe=b.aktionen.map((a,i)=>
    "<button data-i='"+i+"' style=\"font:600 12px 'Courier New',monospace;background:#efe7d3;"+
    "color:"+INK+";border:1.5px solid "+INK+";border-radius:3px;padding:4px 8px;cursor:pointer\">"+
    esc(a.label)+"</button>").join('');
  /* Comic-Lettering ist **zentriert** (ChatterBox S1 §11) — links ausgerichtet las es wie UI-Text.
     Shout bekommt sein eigenes Register: Bangers, größer, gesperrt.
     C2 · **Der Textblock kommt aus `bubble-layout.js`**, nicht aus einer CSS-Breite. Vorher stand
     hier `max-width:230px` — das ist eine Blasengröße, in die Text gelegt wird, also genau die
     Reihenfolge, die O6 verbietet. Jetzt: **erst umbrechen (ausgeglichen), dann legt sich die Kontur
     darum.** Polster, Schriftgröße und Zeilenzahl kommen aus derselben Rechnung. */
  const schrei=b.typ==='shout';
  const S=satz(b.text,b.typ);
  const lay=S.lay;
  b.lay=lay; b.block=S.block;
  const stil=S.stil;
  /* Der Ruf wird **gesetzt**, nicht getippt: Zeichen einzeln auf dem Bogen, leichte Gesamtneigung.
     Alle anderen Register behalten den fließenden Block (und damit das Streaming). */
  /* Segmente statt roher Text: das Markup ist beim Umbruch schon abgezogen, hier wird es gesetzt. */
  const zeilenHtml=()=>{
    const segs=S.lay&&S.lay.segmente;
    if(!segs)return esc(b.block);
    return segs.map(zeile=>zeile.map(s=>s.fett
      ? "<b style='"+S.fettStil+"'>"+esc(s.text)+"</b>" : esc(s.text)).join('')).join('\n');
  };
  const inhalt=S.schrei
    ? "<span style='display:inline-block;transform:rotate("+(((b.seed%7)-3)*0.9).toFixed(1)+
      "deg) skewX(-3deg)'>"+bogenSatz(b.block,b.seed,15)+"</span>"
    : zeilenHtml();
  box.innerHTML="<div class='txt' style=\""+stil+"\">"+inhalt+"</div>"+
    (knoepfe?"<div style='display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;justify-content:center'>"
      +knoepfe+"</div>":"");
  txtEl=box.querySelector('.txt');
  box.style.padding=(lay?lay.box.padY:KANON.pad)+'px '+(lay?lay.box.padX:KANON.pad)+'px';
  box.style.margin=KANON.M+'px';
  box.querySelectorAll('button').forEach(btn=>{
    btn.onclick=ev=>{
      ev.stopPropagation();
      const a=b.aktionen[+btn.dataset.i];
      if(g.audio)g.audio.sfx('uiSlot');
      if(a&&typeof a.go==='function')a.go(b.unit);
      if(!a||a.close!==false)schliessen(g);
    };
  });
  pfad.setAttribute('fill',paper);
  pfad.setAttribute('stroke-width',b.typ==='whisper'?0:(b.typ==='shout'?KANON.line*1.6:KANON.line));
  pfad.removeAttribute('stroke-dasharray');
}
/* Anker mit Totzone und Trägheit — »Luftballon an Schnur« (Pet Studio v4 §3). */
function tick(g){
  const b=aktuell;if(!b||!el)return;
  const u=b.unit;
  if(!u||u.hp<=0){schliessen(g);return;}
  const bh=(u.unit?u.unit.bodyH*(u.sizeMul||1):60);
  const kopf=w2s(g,u.x,u.y-bh);
  if(!anker.gesetzt){anker.x=kopf.x;anker.y=kopf.y;anker.gesetzt=true;}
  const d=Math.hypot(kopf.x-anker.x,kopf.y-anker.y);
  if(d>KANON.dead){anker.x+=(kopf.x-anker.x)*KANON.lazy;anker.y+=(kopf.y-anker.y)*KANON.lazy;}
  /* `offsetWidth` misst OHNE Rand (margin) — die 2×M sind also schon draußen. Der erste Anlauf zog
     sie ein zweites Mal ab: die Blase war 60 px zu klein, der Text lief oben heraus und die
     Klemmung schob sie an den Bildrand. */
  /* v10-S18: **die eingefrorene Geometrie**, nicht die aktuelle. Während der Text streamt, ist die
     Box schmaler als am Ende — würde hier gemessen, wäre die ganze Regel umsonst. */
  const w=(b.geo&&b.geo.w)||box.offsetWidth, hh=(b.geo&&b.geo.h)||box.offsetHeight;
  if(w<=0||hh<=0)return;
  const M=KANON.M;
  /* Der Kasten der Erzählung sitzt höher als Rede — er ist keine Äußerung der Figur (O6.7). */
  const gap=b.typ==='kayfabulate'?KANON.gap*1.4:KANON.gap;
  let tx=anker.x-M-w/2, ty=anker.y-gap-hh-2*M;
  const vw=g.clientWidth||800, vh=g.clientHeight||600;
  tx=Math.max(6-M,Math.min(vw-w-M-6,tx));
  ty=Math.max(6-M,Math.min(vh-hh-M-6,ty));
  el.style.left=Math.round(tx)+'px';el.style.top=Math.round(ty)+'px';
  svg.setAttribute('width',w+2*M);svg.setAttribute('height',hh+2*M);
  // Zipfel zeigt auf den Kopf, in Blasen-Koordinaten
  const hlx=kopf.x-tx, hly=kopf.y-ty;
  const paper=pfad.getAttribute('fill');
  if(b.typ==='thought'){
    /* v10-S12 · Die Denkblase hat **keinen Pfeil**, sondern zwei Kreise, die zum Kopf hin kleiner
       werden — und die **atmen**: sie wandern langsam auf ihrer Achse und pulsieren leicht.
       Dieselbe Logik wie die Blase selbst (Luftballon an Schnur), nur eine Ebene weiter unten. */
    pfad.setAttribute('d',blobPath(M,w,hh,b.seed));
    thinkTail(denk,M,w,hh,hlx,hly,paper,KANON.line,performance.now()/1000);
  }else{
    /* Die Gruppe trägt das, was NEBEN der Fläche liegt: beim Gedanken die Kreise, beim Ruf die
       Aufprall-Striche. Zwei Inhalte, ein Ort — nicht zwei Ebenen für dasselbe. */
    if(b.typ==='shout')aufprall(denk,M,w,hh,b.seed,hlx,hly);
    else denk.innerHTML='';
    /* **Blase und Zipfel sind EINE Fläche** (Georg 9.8.): ein Pfad, eine Füllung, eine Kontur.
       Der Zipfel ist Teil von `rectPath` — er wird nie separat gezeichnet und nie von der
       Kontur abgetrennt. Deshalb steht hier auch kein zweiter `path`. */
    const d=(b.typ==='shout'?burstPath
            :b.typ==='kayfabulate'?kastenPath
            :rectPath)(M,w,hh,b.seed,hlx,hly,KANON.arrow);
    pfad.setAttribute('d',d);
    /* v10-S15 · **Flüstern ist die gestrichelte Feder, kein `stroke-dasharray`.** Der Strich
       hätte konstante Breite und harte Enden — die Kanon-Feder läuft an jedem Strichende spitz aus
       und behält Bauchung und Schattenachse. Gezeichnet wird sie als **Fläche** über derselben
       Punktliste, die auch die Füllung begrenzt: die Kante bleibt eine Kante, sie hebt nur
       zwischendurch ab. */
    strich.setAttribute('d','');
    const fl=b.typ==='whisper';
    const gaps=fl?lueckenGeo(d,13,6,KANON.line*3):null;
    /* **Die Kante kommt aus dem Kanon** — über dieselbe Punktkette, die die Fläche begrenzt.
       Gelingt das nicht (Kanon noch nicht geladen), zeichnet das SVG die Kante weiter, beim
       Flüstern mit den Maskenlücken. Ein Rückfall, der sich meldet, ist kein stiller Rückfall. */
    const ok=kanonFeder(feder,w+2*M,hh+2*M,d,b.seed,gaps,'card');
    if(ok){
      pfad.setAttribute('stroke','none');
      pfad.removeAttribute('mask');
      if(maske)maske.innerHTML='';
    }else{
      pfad.setAttribute('stroke',INK);
      pfad.setAttribute('stroke-width',b.typ==='shout'?KANON.line*1.6:KANON.line);
      if(fl){ if(maske)maske.innerHTML=luecken(d,13,6,KANON.line*3);
        pfad.setAttribute('mask','url(#ow-fl-mask)'); }
      else { if(maske)maske.innerHTML=''; pfad.removeAttribute('mask'); }
    }
  }
}

window.OW_BUBBLE={
  version:'bubble-ts-v3',
  KANON,TYP,
  /* Die Konturen einzeln erreichbar — für das Messblatt (»prüfen heißt nebeneinanderlegen«).
     Ein Messblatt, das die Formen nachbaut, prüft seinen eigenen Nachbau. */
  formen:{rede:rectPath,ruf:burstPath,gedanke:blobPath,kayfabulate:kastenPath,
          denkzipfel:thinkTail,aufprall,fluesterKante,luecken,lueckenGeo,ovalBasis,
          kanonFeder,punkteAus},
  SCHRIFTEN, bogenSatz,
  schrift(k){SCHRIFT=SCHRIFTEN[k]?k:'courier';return SCHRIFT;},
  satz,
  zeigen,show:zeigen,
  tick,
  schliessen,close:schliessen,
  offen(){return !!aktuell;},
  unit(){return aktuell&&aktuell.unit;},
  note:'Fünf Register: rede · gedanke · ruf (Sternplatzer, C2) · fluester · kayfabulate (Kasten). '+
       'Der Textblock kommt aus bubble-layout.js — erst umbrechen, dann Kontur.',
};
})();
