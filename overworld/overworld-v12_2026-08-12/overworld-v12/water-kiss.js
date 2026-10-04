/* water-kiss.js — OW_WATER (water-v2.0) · WS0, 2026-08-12 · Slice 1 »Wasser KISS«

   ── Was v1 richtig hatte und was falsch ────────────────────────────────────────────────────
   Georgs Befund am 12.8.: »das Wasser sieht aus, als würden da ovale Fische und weichgezeichnete
   Aale schwimmen« · »das Moving-Layers-Konzept funktioniert gut« · »es passt nicht zum Cartoon-
   Stil, die Wellen sehen billig aus« · »die weißen Wellen des alten Waber-Shaders waren
   überzeugender«.

   Alle drei Beobachtungen zeigen auf dieselbe Ursache: v1 zeichnete den BETRAG DER NEIGUNG als
   weiche Rampe. Der Betrag eines Gradientenfeldes ist ein Höhenzug — er bildet geschlossene, lange
   Schlingen, und weich abgeblendet werden daraus genau die Aale. **Eine weiche Kante ist Airbrush,
   und Airbrush ist das Gegenteil dieses Bildes**: jede andere Fläche hier trägt eine Tuschekante.

   ── Was v2 macht ───────────────────────────────────────────────────────────────────────────
   1 **Harte Kante statt Rampe.** Der Glanz ist eine FORM mit Rand (Übergang 3,5 % der Höhe, also
     rund ein Pixel), keine Wolke. Das ist die Anmutung, die Georg am alten Waber-Shader gefallen
     hat — nur trägt sie jetzt die Streufarbe des Körpers (Naht 68) statt überall Weiß.
   2 **Die Formen dürfen verschieden sein.** Die Schwelle ist nicht konstant, sie wird von einem
     groben Wertrauschen moduliert: an einer Stelle bleibt ein fetter Klecks stehen, daneben nur
     ein Splitter, und dazwischen fällt der Kamm ganz aus. Eine konstante Schwelle auf einem
     Wellenfeld gibt dagegen lauter gleich große Sicheln — das war das »billig«.
   3 **Morphen statt nur schieben.** Die Lagen driften weiter (das Konzept bleibt, Georg), aber die
     Kachel ist jetzt eine FOLGE: je Bild bekommen die vier Wellen ihre eigene Phase, die Formen
     wachsen und verschwinden also an Ort und Stelle. Gestuft, nicht überblendet — Cartoon-Wasser
     ist gestuft, und eine Zwischenblende zweier harter Formen ist wieder eine weiche Kante.
   4 **Die Folgen sind verschieden lang** (7 und 9 Bilder). Beide Lagen kehren erst nach 63
     Schritten gemeinsam zurück — derselbe Gedanke wie bei den Wellenzahlen: kein gemeinsames Maß,
     keine sichtbare Schleife.

   Unverändert aus v1, weil gemessen und richtig:
   · **eine Streufarbe je Fluid-KÖRPER** (Säure = ein Giftgrün, Öl streut kein Sonnenlicht),
   · **flach/tief kommt aus der Tiefe**, nicht aus einer zweiten Farbe (der Schelf ist dieselbe
     Farbe, nur mehr davon),
   · **vier inkommensurable Wellen** (ganzzahlige Wellenzahlvektoren halten die Kachel nahtlos,
     ihre Längen √10 √29 √65 √82 haben irrationale Verhältnisse — kein Cord),
   · **die RMS-Neigung als geführte Zahl** (`OW_WATER.probe()`), Ziel 4°. */
(function(){
'use strict';
const VERSION='water-v2.0';

/* Eine Streufarbe je Fluid. Sie ist HELL — Streulicht ist immer heller als der Körper — und trägt
   den Ton des Körpers. Quelle der Körperfarben: OW_SHADE.PALETTES (skyshade-2d.js). */
const STREU={
  wasser:   '#f0fbff',   // Meerwasser: fast weiß, ein Hauch Türkis
  bubblegum:'#ffe4f2',   // Kaugummi: rosa Schaum
  oel:      '#9fb4d2',   // Öl: kaltes Blaugrau, kein Weiß — Öl streut kein Sonnenlicht
  saeure:   '#e4ff96',   // Säure: EIN Giftgrün, wie am 11.8. entschieden
};
const FALLBACK='#f0fbff';

/* ── DREI FORMFAMILIEN, EINE ENTSCHEIDUNG ─────────────────────────────────────────────
   Am 12.8. habe ich vier Runden lang nach Gefühl an den Wellenzahlen gedreht, und jede Runde hat
   ein Artefakt gegen ein anderes getauscht: runde Kleckse → senkrechte Streifen → lange Schlieren
   → ein Perlenband (das war wieder ein Cord). **Das ist keine Ingenieursfrage mehr, sondern eine
   Bildentscheidung** — also steht sie als Schalter da, statt dass ich sie für Georg treffe.

   Die Richtung der Wellenzahlvektoren ist der ganze Unterschied, und sie ist umgekehrt zur
   Anschauung: der Kamm steht SENKRECHT auf k. Vier fast parallele k geben lange Formen quer dazu,
   vier gekreuzte k geben runde Inseln.

   · `kleckse`   — gekreuzte Richtungen: rundliche Flecken in vielen Größen (v2-Erstfassung).
   · `striche`   — k um 11–19°: aufrechte, schlanke Striche.
   · `schlieren` — k um 71–101°: liegende, lange Schlieren (dem alten Waber-Shader am nächsten).

   Umschalten: Tweak `waterForm` am DC, `OW_WATER.form('striche')` in der Konsole. */
const FORMEN={
  kleckse:{schwelle:0.56,streuung:0.60,wellen:[
    {kx: 3,ky: 1,amp:1.00,dreh: 1},
    {kx: 2,ky:-3,amp:0.70,dreh:-1},
    {kx: 7,ky:-4,amp:0.22,dreh: 2},
    {kx: 1,ky: 9,amp:0.12,dreh:-2}]},
  striche:{schwelle:0.58,streuung:0.52,wellen:[
    {kx: 4,ky: 1,amp:1.00,dreh: 1},
    {kx: 3,ky: 1,amp:0.75,dreh:-1},
    {kx: 7,ky: 2,amp:0.35,dreh: 2},
    {kx: 5,ky:-1,amp:0.22,dreh:-2}]},
  schlieren:{schwelle:0.64,streuung:0.50,wellen:[
    {kx: 1,ky: 4,amp:1.00,dreh: 1},
    {kx: 1,ky: 3,amp:0.72,dreh:-1},
    {kx: 2,ky: 7,amp:0.34,dreh: 2},
    {kx:-1,ky: 5,amp:0.26,dreh:-2}]},
};
let AKTIV='aus';
const F=()=>FORMEN[AKTIV]||FORMEN.kleckse;
const N=192;                 // Kachelkante in Pixeln
const ZIEL_GRAD=4.0;         // RMS-Neigung in Grad — die geführte Zahl
const KANTE=0.035;           // Breite des Übergangs — rund ein Pixel, also eine Kante
const DECK=0.95;             // Deckung der Form
const RAUSCH_ZELLEN=3;       // Merkmalsgröße der Schwellen-Modulation, in Kachelanteilen
const SATZ=[7,9];            // Bilder je Lage — teilerfremd, gemeinsame Rückkehr erst nach 63
const TAKT=2.6;              // Schritte je Sekunde

/* Die absolute Wellenhöhe folgt aus der Zielneigung, nicht umgekehrt. Für h = Σ A·sin(2π k·u)
   ist die RMS-Steigung sqrt( Σ (2π·A_i·|k_i|)² / 2 ) je Kachelkante. */
function hoehe(){
  const W=F().wellen;
  const s2=W.reduce((s,w)=>s+w.amp*w.amp*(w.kx*w.kx+w.ky*w.ky),0);
  const einheit=2*Math.PI*Math.sqrt(s2/2);
  return {einheit,h:Math.tan(ZIEL_GRAD*Math.PI/180)/einheit};
}

/* Kachelbares Wertrauschen: der Hash nimmt seine Koordinaten modulo der Zellenzahl, sonst hätte
   die Kachel eine Naht — und eine Naht ist ein Gitter. */
function rausch(zellen){
  const h=(x,y)=>{
    x=((x%zellen)+zellen)%zellen; y=((y%zellen)+zellen)%zellen;
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

/* Die Schwellenkarte hängt am Ort und an der Streuung der Formfamilie, nicht am Bild. */
const karten={};
function schwellkarte(){
  const f=F(),key=AKTIV;
  if(karten[key])return karten[key];
  const n=rausch(RAUSCH_ZELLEN),m=new Float32Array(N*N);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)
    m[y*N+x]=f.schwelle+f.streuung*(n(x/N*RAUSCH_ZELLEN,y/N*RAUSCH_ZELLEN)-0.5);
  return (karten[key]=m);
}

/* Die Alphamasken der Folge — farblos und damit für alle Fluide dieselben. */
const masken={};
function maskenSatz(K){
  const key=AKTIV+'_'+K;
  if(masken[key])return masken[key];
  const W=F().wellen,ampsum=W.reduce((s,w)=>s+w.amp,0);
  const t=schwellkarte(),out=[];
  for(let k=0;k<K;k++){
    const a=new Uint8ClampedArray(N*N);
    const ph=W.map(w=>2*Math.PI*k*w.dreh/K);
    for(let y=0;y<N;y++){
      const v=y/N;
      for(let x=0;x<N;x++){
        const u=x/N;
        let h=0;
        for(let i=0;i<W.length;i++){
          const w=W[i];
          h+=w.amp*Math.sin(2*Math.PI*(w.kx*u+w.ky*v)+ph[i]);
        }
        h/=ampsum;
        const i0=y*N+x;
        const s=Math.min(1,Math.max(0,(h-t[i0])/KANTE));
        a[i0]=Math.round(255*DECK*s);
      }
    }
    out.push(a);
  }
  return (masken[key]=out);
}

const kacheln={},messungen={};
function satz(fluid,K){
  const key=AKTIV+'_'+(STREU[fluid]?fluid:'__fallback')+'_'+K;
  if(kacheln[key])return kacheln[key];
  const col=STREU[fluid]||FALLBACK;
  const r=parseInt(col.slice(1,3),16),g=parseInt(col.slice(3,5),16),b=parseInt(col.slice(5,7),16);
  const ms=maskenSatz(K),out=[];
  for(const m of ms){
    const c=document.createElement('canvas');c.width=c.height=N;
    const x=c.getContext('2d'),img=x.createImageData(N,N),d=img.data;
    for(let i=0;i<m.length;i++){const i4=i<<2;d[i4]=r;d[i4+1]=g;d[i4+2]=b;d[i4+3]=m[i];}
    x.putImageData(img,0,0);
    out.push(c);
  }
  if(!messungen[AKTIV+'_'+fluid])messungen[AKTIV+'_'+fluid]=messen(ms);
  return (kacheln[key]=out);
}

/* Was in den Masken WIRKLICH steht — gescannt, nicht behauptet. `wandel` ist der Anteil der
   Fläche, der sich von einem Bild zum nächsten ändert: die Zahl für »morpht es überhaupt«. */
function messen(ms){
  let maxA=0,deck=0,wandel=0;
  for(const m of ms){
    let u=0;
    for(let i=0;i<m.length;i++){if(m[i]>maxA)maxA=m[i];if(m[i]>128)u++;}
    deck+=u/m.length;
  }
  for(let k=0;k<ms.length;k++){
    const a=ms[k],b=ms[(k+1)%ms.length];
    let u=0;
    for(let i=0;i<a.length;i++)if((a[i]>128)!==(b[i]>128))u++;
    wandel+=u/a.length;
  }
  return {maxAlpha:maxA,deckung:+(100*deck/ms.length).toFixed(1),
    wandelJeBild:+(100*wandel/ms.length).toFixed(1),bilder:ms.length};
}

/* Das Glitzern. Zwei Lagen in verschiedenem Maßstab, gegenläufig driftend UND morphend.
   Der Aufrufer hat auf das Wasser geclippt.

   v12-W1c · Der Maßstab folgt dem Zoom, statt bei kleinem Zoom auszufallen: eine Kachel, hart
   verkleinert, greift je Zeile andere Quellpixel und wird streifig — deshalb eine Untergrenze,
   damit ein Quellpixel nie unter 0,6 Gerätepixel fällt. Weiter weg wird das Muster größer und
   ruhiger, statt zu verschwinden. */
function glitzer(ctx,o){
  /* v12-W3 · AUS ist die Vorgabe, und das ist ein Befund, keine Bequemlichkeit (Georg 12.8.:
     »es ruckeln Konfetti über den Screen, das sieht nach Performance-Problemen aus«). Zwei
     Bewegungen liefen gegeneinander: die Lage DRIFTET stetig, die Form SPRINGT alle 0,38 s.
     Cartoon-Wasser ist gestuft ODER es gleitet — beides zusammen liest sich als Ruckeln, und
     harte Kanten, die springen, sind Konfetti. Bis das Bildkonzept steht, zeichnet hier nichts;
     die Fluid-Schicht des Waber-Shaders bleibt allein, so wie vor v12.
     Wieder an: Tweak waterForm oder OW_WATER.form('kleckse'). */
  if(AKTIV==='aus')return false;
  const t=o.time||0,T=o.TILE||64,fluid=o.fluid||'wasser';
  const R=o.rect;
  const z=(ctx.getTransform&&ctx.getTransform().a)||1;
  const MIN=0.6/Math.max(z,0.01);
  const lay=(K,sx,sy,al,sc0)=>{
    const bilder=satz(fluid,K);
    /* Ein negativer oder krummer Takt gibt sonst einen Index außerhalb der Folge — und
       createPattern(undefined) wirft je Bild eine Zeile in die Konsole. */
    const bild=bilder[((Math.floor(t*TAKT)%K)+K)%K]||bilder[0];
    if(!bild)return;
    const sc=Math.max(sc0,MIN);
    ctx.save();
    ctx.globalAlpha=al;
    ctx.translate(sx,sy);
    ctx.scale(sc,sc);
    ctx.fillStyle=ctx.createPattern(bild,'repeat');
    ctx.fillRect((R.x-sx)/sc-N,(R.y-sy)/sc-N,R.w/sc+2*N,R.h/sc+2*N);
    ctx.restore();
  };
  lay(SATZ[0], (t*7)%1024, (t*4)%1024, 0.42, T/44);
  lay(SATZ[1],-(t*5)%1024, (t*9)%1024, 0.26, T/29);
  return true;
}

/* Der Schelf: flaches Wasser am Ufer. DIESELBE Streufarbe, nur mehr davon — zwei weiche Striche
   auf der Küstenkontur, innen geclippt. Kein zweiter Farbton, keine Maske, kein Höhenfeld. */
function schelf(ctx,path,o){
  if(!path)return false;
  const T=o.TILE||64,col=STREU[o.fluid||'wasser']||FALLBACK;
  ctx.save();
  ctx.strokeStyle=col;
  ctx.lineJoin='round';ctx.lineCap='round';
  ctx.globalAlpha=0.10;ctx.lineWidth=T*1.15;ctx.stroke(path);
  ctx.globalAlpha=0.13;ctx.lineWidth=T*0.42;ctx.stroke(path);
  ctx.restore();
  return true;
}

/* Die geführte Zahl. Analytisch, nicht am Bild gemessen — im gedrosselten Rahmen kommt kein Frame
   (Naht 66), eine Bildmessung wäre dort wertlos. */
function neigung(){
  const H=hoehe(),W=F().wellen;
  return {
    form:AKTIV,
    ziel:ZIEL_GRAD,
    rmsGrad:+(Math.atan(H.einheit*H.h)*180/Math.PI).toFixed(2),
    hoeheProKante:+H.h.toFixed(5),
    wellen:W.map(w=>({k:[w.kx,w.ky],laenge:+Math.hypot(w.kx,w.ky).toFixed(3),
      wellenlaenge:+(N/Math.hypot(w.kx,w.ky)).toFixed(1),
      kamm:+((Math.atan2(w.ky,w.kx)*180/Math.PI+90)%180).toFixed(1),amp:w.amp,dreh:w.dreh})),
  };
}
function messung(fluid){
  if(!messungen[AKTIV+'_'+fluid])satz(fluid,SATZ[0]);
  return messungen[AKTIV+'_'+fluid];
}
function tile(fluid){return satz(fluid,SATZ[0])[0];}
/* Die Formfamilie umschalten. Die Kacheln bauen sich beim nächsten Zeichnen neu — sie hängen im
   Schlüssel an der Familie, es wird also nichts weggeworfen, was noch gebraucht wird. */
function form(name){
  if(name&&(FORMEN[name]||name==='aus')&&name!==AKTIV){
    AKTIV=name;
    if(name==='aus')console.log('[water] Glitzern AUS — nur Waber-Schicht und Schelf');
    else{const m=messung('wasser');
      console.log('[water] Formfamilie '+AKTIV+' · Deckung '+m.deckung+' % · Wandel '+
        m.wandelJeBild+' % je Bild');}
  }
  return {aktiv:AKTIV,familien:['aus'].concat(Object.keys(FORMEN))};
}

window.OW_WATER={version:VERSION,STREU,FORMEN,tile,satz,glitzer,schelf,neigung,messung,form,
  farbe:f=>STREU[f]||FALLBACK,
  probe(){const n=neigung();
    console.log('[water] Formfamilie '+n.form+' · RMS-Neigung '+n.rmsGrad+'° (Ziel '+n.ziel+
      '°) · Folge '+SATZ.join(' und ')+' Bilder, gemeinsame Rückkehr nach '+(SATZ[0]*SATZ[1])+
      ' Schritten ('+(SATZ[0]*SATZ[1]/TAKT).toFixed(1)+' s)');
    console.table(n.wellen);
    console.table(Object.keys(STREU).reduce((o,f)=>{o[f]=messung(f);return o;},{}));
    return n;}};
const M0=messung('wasser');
console.log('[water] '+VERSION+' — Glitzern steht auf '+AKTIV+' (wählbar: '+
  Object.keys(FORMEN).join('/')+') · Schelf und Streufarben laufen · RMS-Neigung '+
  neigung().rmsGrad+'° · Streufarben: '+Object.keys(STREU).join(' · '));
})();
