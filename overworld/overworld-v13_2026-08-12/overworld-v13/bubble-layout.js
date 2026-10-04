/* KFB Overworld — Blasen-Layout (bl-v1.0, Slice v13-C1, 2026-08-12)
   Setzungen aus `uploads/kfb_overworld_living_doc.html` §O6, Abnahme gegen die zwölf Fixtures §O7.
   Leser dieses Moduls: `bubble-ts.js` (Träger) und `chatter-2d.js` (Inhalt) — beide später (C2/C3).

   **Die eine Grundregel: die Blase wird aus dem Textblock abgeleitet, nie umgekehrt.**
   Deshalb kennt dieses Modul KEINE Blasengröße als Eingabe. Es bekommt Text und gibt Zeilen,
   Kasten und Zeiten zurück. Damit ist die riesige leere Blase konstruktiv unmöglich.

   Was hier NICHT drin ist, mit Absicht:
   · Zeichnen, Kontur, Zeiger  → C2 (`bubble-ts.js`, fünf Formen)
   · Anker, Ausweichen am Bildrand, Ablage über dem Kopf → C3 (vier Anker, ein Ausweichsystem)
   Die Konstanten dafür stehen unten in `PLACE`, damit C2/C3 sie nicht neu erfinden.

   Fehlerklasse, gegen die dieses Modul gebaut ist: der **füllende** Umbruch. Er füllt jede Zeile
   maximal und lässt den Rest fallen — daraus entsteht die einsame Ein-Wort-Restzeile. Fünf von
   sechs mehrzeiligen Fixtures brechen füllend schlecht. Der ausgeglichene Umbruch ist deshalb keine
   Feinheit, sondern eine andere Methode. `wrapFill()` bleibt als Gegenprobe im Modul, nicht als
   Rückweg: wer sie im Spiel benutzt, hat den Slice zurückgedreht. */
(function(){
'use strict';

/* Fünf Arten = fünf Formen (O2/O7). `chars` ist die maximale ZEILENLÄNGE in Zeichen — sie folgt
   aus der Schriftgröße: größere Schrift = weniger Zeichen in dieselbe Breite. */
const KINDS={
  rede:        {chars:28, lines:3, fontScale:1,    padX:0.60, padY:0.45, tail:'strich'},
  gedanke:     {chars:28, lines:3, fontScale:1,    padX:0.70, padY:0.45, tail:'punktspur'},
  ruf:         {chars:21, lines:3, fontScale:1.35, padX:0.80, padY:0.45, tail:'zacke'},
  /* ⚠ Lücke in O6, beim Rechnen gefunden: für Flüstern war keine Zeilenlänge festgelegt. Kleinere
     Schrift legt MEHR Zeichen in dieselbe Breite, rechnerisch ~33. Die Fixtures sind mit **28**
     gerechnet (konservativ) — deshalb steht 28 hier und 33 daneben. **Georgs Entscheidung.** */
  fluester:    {chars:28, lines:3, fontScale:0.85, padX:0.60, padY:0.45, tail:'strich', charsRechnerisch:33},
  kayfabulate: {chars:34, lines:4, fontScale:1,    padX:0.60, padY:0.45, tail:null, box:true}
};

const LIMITS={
  minChars:7,        // sonst wird »Stay fluffy.« ein Chip und der Zeiger findet keinen Platz
  maxWidthShare:.38, // deckelt vor der Zeichenzahl, greift auf schmalen Geräten zuerst
  lineHeight:1.25,
  /* **Ein Polster in em schrumpft mit der Schrift — der Zeichenstrich nicht.** Beim Flüstern
     (0,85-fach) fielen 0,60 em auf 8 px, und die Kante saß dem Text auf. Also ein Mindestmaß in
     Pixeln, unabhängig von der Schriftgröße (Georg, 12.8.: »bei Flüstern zu klein«). */
  padMinX:11, padMinY:8,
  lastLineShare:.40, // letzte Zeile mindestens 40 % der längsten
  floorPx:11         // Lesbarkeitsboden: darunter wird die Blase NICHT kleiner
};

const TIME={cps:34, holdBase:800, holdPerChar:42, holdCap:5000, exit:220, minTotal:1200};

/* Für C2/C3 — hier abgelegt, damit es die Zahlen nur einmal gibt. */
const PLACE={anchorLift:6, tailMax:22, emanatumOffset:4, maxBubbles:2};

/* **Drei Zeichen, mehr nicht** (Spec Lettering §2): `*wort*` betont, `…` pausiert, `--` bricht ab.
   Der Parser trennt **sichtbaren Text** von Markup — alles Weitere (Umbruch, Zeiten, Breite) rechnet
   ausschließlich auf dem sichtbaren Text. Ein Markup, das mitzählt, bricht die Zeile zu früh. */
function normalisieren(t){
  return String(t)
    .replace(/\. ?\. ?\./g,'…')
    .replace(/!{2,}/g,'!')
    .replace(/\?{2,}/g,'?')
    .replace(/—|–/g,'--');
}
function parse(text,maxBetont){
  const roh=normalisieren(text);
  const teile=[]; let rest=roh, n=0;
  const re=/\*([^*\n]+)\*/g; let m, last=0, plain='';
  while((m=re.exec(roh))){
    if(m.index>last){const s=roh.slice(last,m.index);teile.push({text:s,fett:false});plain+=s;}
    /* **Mehr Betonung wird abgeschnitten, nicht abgelehnt** — die Erzählschicht darf sich irren,
       die Blase nicht. Über dem Deckel bleibt das Wort stehen, nur ohne Fettdruck. */
    const fett=(maxBetont==null||n<maxBetont);
    teile.push({text:m[1],fett}); plain+=m[1]; if(fett)n++;
    last=m.index+m[0].length;
  }
  if(last<roh.length){const s=roh.slice(last);teile.push({text:s,fett:false});plain+=s;}
  if(!teile.length)teile.push({text:roh,fett:false});
  return {plain,teile,betont:n,roh};
}
/* Zeilen wieder mit dem Markup zusammenbringen: die Umbruchrechnung arbeitet auf dem sichtbaren
   Text, das Zeichnen braucht die Segmente je Zeile. */
function segmente(teile,lines){
  const out=[]; let ti=0, off=0;
  for(const line of lines){
    const segs=[]; let rest=line.length;
    /* Leerzeichen an Zeilengrenzen sind im sichtbaren Text noch da; sie werden übersprungen. */
    while(rest>0&&ti<teile.length){
      const t=teile[ti], vorrat=t.text.length-off;
      if(vorrat<=0){ti++;off=0;continue;}
      const nimm=Math.min(vorrat,rest);
      const s=t.text.substr(off,nimm);
      if(s)segs.push({text:s,fett:t.fett});
      off+=nimm; rest-=nimm;
      if(off>=t.text.length){ti++;off=0;}
    }
    // das trennende Leerzeichen überspringen
    while(ti<teile.length){
      const t=teile[ti];
      if(off<t.text.length&&/\s/.test(t.text[off])){off++;break;}
      if(off>=t.text.length){ti++;off=0;continue;}
      break;
    }
    out.push(segs);
  }
  return out;
}

const isWordChar=c=>!/\s/.test(c);
const words=t=>String(t).trim().split(/\s+/).filter(Boolean);
const len=a=>a.join(' ').length;

/* Kleinste Zeilenzahl, in die der Text überhaupt passt (greedy ist dafür optimal). */
function minLines(ws,max){
  let n=1,cur=0;
  for(const w of ws){
    const add=cur?cur+1+w.length:w.length;
    if(w.length>max&&cur===0){cur=w.length;continue;}   // ein zu langes Wort bleibt allein
    if(add<=max)cur=add; else {n++;cur=w.length;}
  }
  return n;
}

/* **Ausgeglichen umbrechen:** unter allen Umbrüchen mit der kleinstmöglichen Zeilenzahl den wählen,
   dessen Zeilenlängen am wenigsten voneinander abweichen. Bei gleicher Zeilensumme ist die Summe
   der QUADRATE genau dann minimal, wenn die Zeilen gleich lang sind — das ist der ganze Trick, und
   er braucht keine Heuristik. DP über (Wortindex, Restzeilen). */
/* **Sobald Fettdruck im Spiel ist, muss der Ausgleich in Pixeln rechnen** (Coworker, 12.8.):
   der ausgeglichene Umbruch minimiert die Abweichung der ZeilenLÄNGEN — mit einem fetten Wort ist
   die Zeichenzahl aber nicht mehr die Länge. Die 28 Zeichen bleiben als Deckel, die Ausgleichs-
   rechnung nimmt die echte Breite. `breite(wort)` misst; fehlt sie, zählt weiter das Zeichen. */
function wrapBalanced(text,max,maxLines,breite){
  const ws=words(text);
  if(!ws.length)return {lines:[],overflow:false};
  const L=minLines(ws,max);
  const memo=new Map();
  function best(i,left){
    if(i>=ws.length)return left===0?{cost:0,cuts:[]}:null;
    if(left===0)return null;
    const key=i+'|'+left;
    if(memo.has(key))return memo.get(key);
    let out=null,cur=[];
    for(let j=i;j<ws.length;j++){
      cur.push(ws[j]);
      const l=len(cur);
      if(l>max&&cur.length>1)break;                     // Zeile voll (nie trennen)
      const rest=best(j+1,left-1);
      if(rest){
        const mass=breite?breite(cur.join(' ')):l;
        const cost=mass*mass+rest.cost;
        if(!out||cost<out.cost)out={cost,cuts:[j+1].concat(rest.cuts)};
      }
    }
    memo.set(key,out);
    return out;
  }
  const r=best(0,L);
  const cuts=r?r.cuts:[ws.length];
  const lines=[]; let p=0;
  for(const c of cuts){lines.push(ws.slice(p,c).join(' '));p=c;}

  /* Zwei Nachprüfungen, die nicht aus dem Ausgleich folgen (O6.3):
     ein Wort allein steht nie, und die letzte Zeile ist mindestens 40 % der längsten. Beides ist
     hier ein BEFUND, keine stille Korrektur — der Ausgleich hat sein Bestes schon getan. */
  const longest=Math.max(...lines.map(s=>s.length));
  const last=lines[lines.length-1]||'';
  const notes=[];
  if(lines.length>1&&last.split(' ').length===1&&ws.length>1)notes.push('einzelnes Wort in der letzten Zeile');
  if(lines.length>1&&last.length<longest*LIMITS.lastLineShare)notes.push('letzte Zeile unter 40 %');
  return {lines,overflow:lines.length>maxLines,notes,longest};
}

/* Die Gegenprobe. Nur für Messblätter — nie im Spiel. */
function wrapFill(text,max){
  const ws=words(text),lines=[];let cur='';
  for(const w of ws){
    const add=cur?cur+' '+w:w;
    if(add.length<=max||!cur)cur=add; else {lines.push(cur);cur=w;}
  }
  if(cur)lines.push(cur);
  return lines;
}

/* Satzgrenze für O6.5: zu langer Text wird an einer Satzgrenze in ZWEI Blasen geteilt.
   Gibt es keine, ist der Satz zu lang — und das ist eine Anforderung an die Erzählschicht. */
function sentenceSplit(text){
  const t=String(text).trim();
  const marks=[];
  for(let i=0;i<t.length-1;i++)
    if('.!?'.includes(t[i])&&/\s/.test(t[i+1])&&isWordChar(t[i-1]||''))marks.push(i+1);
  if(!marks.length)return null;
  const mid=t.length/2;
  const cut=marks.reduce((a,b)=>Math.abs(b-mid)<Math.abs(a-mid)?b:a);
  return [t.slice(0,cut).trim(),t.slice(cut).trim()];
}

/* Zeiten (O6.6). Die »kurze Extrapause an Satzzeichen« ist bewusst NICHT eingerechnet: die
   Fixture-Zahlen sind reines `Zeichen/34`, und eine Zahl, die in der Tabelle nicht steht, darf
   hier nicht auftauchen. Sie gehört in die Wiedergabe (C2), als Zuschlag über diesem Budget. */
function times(text){
  const n=String(text).length;
  const write=Math.round(n/TIME.cps*1000);
  const hold=Math.min(TIME.holdCap,TIME.holdBase+TIME.holdPerChar*n);
  const total=Math.max(TIME.minTotal,write+hold+TIME.exit);
  return {chars:n,write,hold,exit:TIME.exit,total};
}

/* Der eine Aufruf für die Leser. `fontPx` ist die Schrifthöhe am Bildschirm (nicht am Zoom!),
   `charPx` die mittlere Zeichenbreite in derselben Schrift (gemessen, nicht geraten),
   `viewW` die Bildbreite für den 38-%-Deckel. */
function layout(text,kind,opts){
  opts=opts||{};
  const K=KINDS[kind]||KINDS.rede;
  const fontPx=Math.max(LIMITS.floorPx,(opts.fontPx||14)*K.fontScale);
  const charPx=(opts.charPx||fontPx*0.54)*(opts.charPx?K.fontScale:1);
  /* `opts.maxChars` überschreibt die Zeilenlänge der Art — gebraucht für die offene
     Flüstern-Entscheidung (28 konservativ gegen 33 rechnerisch). Wer sie setzt, weiß, was er tut;
     die Fixture-Erwartungen aus O7 sind mit den Vorgaben der Art gerechnet. */
  let max=opts.maxChars||K.chars;
  if(opts.viewW){                                     // Breitendeckel greift VOR der Zeichenzahl
    const byWidth=Math.floor((opts.viewW*LIMITS.maxWidthShare-2*K.padX*fontPx)/charPx);
    max=Math.max(LIMITS.minChars,Math.min(max,byWidth));
  }
  /* Betonungs-Deckel nach Länge (Spec §2): kurzer Satz eins, langer zwei. */
  const P=parse(text,String(text).length<=34?1:2);
  /* **Fett ist breiter — also muss die Ausgleichsrechnung wissen, WELCHES Wort fett ist.**
     Die Breitenfunktion bekommt deshalb je Wort den Schnitt mit; ohne diese Zeile misst sie die
     fette Zeile als normale und die Zeile mit der Betonung sitzt daneben. */
  const fetteWorte=new Set();
  for(const t of P.teile)if(t.fett)for(const wd of String(t.text).trim().split(/\s+/))if(wd)fetteWorte.add(wd);
  const messen=opts.messen?(zeile=>{
    const teile=String(zeile).split(' ');
    let sum=0;
    for(let i=0;i<teile.length;i++){
      sum+=opts.messen(teile[i],fetteWorte.has(teile[i]));
      if(i<teile.length-1)sum+=opts.messen(' ',false);
    }
    return sum;
  }):null;
  const w=wrapBalanced(P.plain,max,K.lines,messen);
  const t=times(P.plain);
  const cols=Math.max(LIMITS.minChars,w.longest||0);
  const pX=Math.max(LIMITS.padMinX,K.padX*fontPx), pY=Math.max(LIMITS.padMinY,K.padY*fontPx);
  const box={
    w:Math.round(cols*charPx+2*pX),
    h:Math.round(w.lines.length*fontPx*LIMITS.lineHeight+2*pY),
    padX:Math.max(LIMITS.padMinX,Math.round(K.padX*fontPx)),
    padY:Math.max(LIMITS.padMinY,Math.round(K.padY*fontPx)), fontPx:Math.round(fontPx)
  };
  const segs=segmente(P.teile,w.lines);
  const out={kind:kind||'rede',lines:w.lines,segmente:segs,text:P.plain,betont:P.betont,cols:w.longest||0,maxChars:max,maxLines:K.lines,
    overflow:w.overflow,notes:w.notes||[],box,times:t,tail:K.tail,isBox:!!K.box,split:null,
    atFloor:fontPx<=LIMITS.floorPx};
  if(out.overflow){
    /* Sichtbar scheitern, nicht stillschweigend vierzeilig zeigen (O7-Abnahme Punkt 4). */
    const s=sentenceSplit(text);
    out.split=s?s.map(part=>layout(part,kind,opts)):null;
    out.reject=!s;
    out.notes=out.notes.concat(s?['Überlauf: an der Satzgrenze in zwei Blasen geteilt']
                                :['Überlauf ohne Satzgrenze: zu lang als INHALT, gehört gekürzt']);
  }
  return out;
}

window.OW_BLAYOUT={version:'bl-v1.1',KINDS,LIMITS,TIME,PLACE,
  layout,times,wrapBalanced,wrapFill,sentenceSplit,minLines,parse,normalisieren,segmente,
  note:'Textblock zuerst, Kontur danach. Ausgeglichener Umbruch (DP über Quadratsummen), '+
       'Überlauf wird gemeldet statt gezeigt. wrapFill ist die Gegenprobe, kein Rückweg.'};
console.log('[bubble-layout] bl-v1.1 · Arten',Object.keys(KINDS).join(' · '),
  '· max Zeilen 3 (Kayfabulate 4) · Flüstern-Zeilenlänge 28 (rechnerisch 33, offen)');
})();
