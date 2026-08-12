/* KFB — puddles (pd-v1.0, V7-S4, Masterplan §31.2b)
   **Aus dem verworfenen Schatten wird eine eigene Schicht.**

   Georgs Satz, aus dem dieses Modul entstand: die extrem flach platzierten Ovale »sehen eher aus wie
   Pfützen — was auch ein gutes Feature sein könnte, aber was ich getrennt vom Schatten bauen würde,
   zusammen mit den Materialcodes«. Also genau das: keine Auflage unter einem Asset, sondern **Fläche**.
   Der Schatten hängt an einem Sprite, eine Pfütze hängt an der Senke.

   Vier Regeln, damit es Landschaft wird und nicht Konfetti:

     1. **Sie liegen, wo Wasser läge.** Ein Dichtefeld aus zwei Rauschskalen entscheidet, nicht ein
        Würfel je Feld: Senken sammeln, Höhen bleiben trocken. Nasse Flecken treten deshalb in
        Gruppen auf und der Weg dazwischen bleibt lesbar. Zusätzlich zieht die Nähe zum echten Wasser
        (`wetness`) die Wahrscheinlichkeit hoch — am Ufer ist der Boden feucht.
     2. **Organisch, nicht oval.** Der Radius je Winkel ist eine Summe aus drei Harmonischen mit
        gesäten Phasen; dazu eine Grundstauchung. Eine Ellipse hat zwei Zahlen und sieht gestempelt
        aus, sobald zwei nebeneinander liegen.
     3. **Farbliche Variation ist der Beitrag.** Georgs Punkt. Jede Pfütze bekommt aus ihrer Position
        eine eigene Tönung entlang einer kurzen Achse (feuchte Erde → Moor → Algenwasser) und einen
        eigenen Grad an Spiegelung. Gezeichnet wird mit `multiply` für das Nasse und einem knappen
        `screen`-Streifen für das Licht darauf — der Boden bleibt in beiden Fällen sichtbar, weil er
        mitgerechnet wird statt übermalt zu werden.
     4. **Ein Rand, kein Umriss.** Der Saum ist eine dunklere Wiederholung derselben Form, leicht
        kleiner und weich — nicht eine Kontur mit eigener Feder. Die Kanon-Tusche gehört der Küste
        und den Karten, nicht einer Bodenpfütze.

   Gebacken wird in Flecken (`patch`, 8×8 Felder), gezeichnet wird ein `drawImage` je Fleck. Das
   Verfahren ist deterministisch: dieselbe Welt sät dieselben Pfützen (Journey-Kompatibilität).

   Was hier NICHT hineingehört: Punkte und Striche. Die sind die andere Hälfte von §31.2 und kommen
   als eigenes Modul mit derselben Verteilung — hier liegt nur das Nasse. */
(function(){
'use strict';

const K={
  cell:64,
  patch:8,            // Felder je gebackenem Fleck
  chance:0.030,       // Grundwahrscheinlichkeit je Feld im nassen Bereich
  wet:0.46,           // ab diesem Feldwert gilt ein Feld als Senke
  wetGain:2.1,        // wie stark die Senke die Wahrscheinlichkeit hebt
  rMin:0.30,rMax:0.92,// Radius in Feldern
  squash:0.52,        // Grundstauchung (Draufsicht, kein Kreis)
  wobble:0.30,        // Anteil der Formabweichung an den drei Harmonischen
  alpha:0.40,         // Stärke des Nassen
  rim:0.26,           // Stärke des Saums
  gloss:0.16,         // Stärke des Lichtstreifens
  minGap:2,           // Mindestabstand in Feldern zwischen zwei Pfützen
  /* Die Tönungsachse (Georgs »farbliche Variation«). Drei Stützen, dazwischen wird gemischt:
     feuchte Erde, moorig, algig. Alle drei sind Multiplikatoren, keine Deckfarben. */
  tints:[[0.72,0.64,0.55],[0.60,0.62,0.52],[0.55,0.67,0.62]],
  glossColor:'rgba(214,238,255,1)'
};

/* **Standard aus (V8-S2).** Georg am 8.8. über das Ergebnis: »ganz schlimme Konstrukte« — und er hat
   recht. Nachgemessen an einer fünffach vergrößerten Pfütze: der Glanz ist ein `fillRect`, in die
   Form geclippt, und macht an seiner Unterkante einen Sprung von **16 Helligkeitsstufen in einer
   Pixelzeile**. Das ist kein Licht auf Wasser, das ist ein aufgeklebter Balken — und weil die Form
   an den Seiten schmaler ist als das Rechteck, endet er senkrecht abgeschnitten.
   474 Stück davon lagen auf der Welt.
   Das Modul bleibt liegen; wer es zurückholt, braucht einen weichen Verlauf statt einer Kante und
   sollte den Glanz an der Form entlang führen, nicht quer darüber. */
let enabled=false;
const stats={patches:0,puddles:0,ms:0};

function hash(a,b,s){
  let h=(a*374761393+b*668265263+((s|0)*2654435761))|0;
  h=(h^(h>>>13))*1274126177;
  return ((h^(h>>>16))>>>0)/4294967296;
}
function vnoise(a,b,s){
  const ix=Math.floor(a),iy=Math.floor(b),fx=a-ix,fy=b-iy;
  const u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
  const p=(i,j)=>hash(i,j,s);
  return (p(ix,iy)*(1-u)+p(ix+1,iy)*u)*(1-v)+(p(ix,iy+1)*(1-u)+p(ix+1,iy+1)*u)*v;
}

/* Das Feuchtefeld. Zwei Skalen: die große entscheidet über Landschaftsteile, die kleine über
   einzelne Senken. Ohne die zweite liegen alle Pfützen in einem Klumpen. */
function wetAt(x,y,seed){
  const big=vnoise(x/23+11,y/23+7,seed*7+3);
  const small=vnoise(x/6.5+31,y/6.5+17,seed*13+5);
  return big*0.62+small*0.38;
}

/* Eine Form als Pfad. Drei Harmonische mit gesäten Phasen — nie zwei gleiche Nachbarn. */
function shapePath(ctx,r,squash,seed){
  const p1=hash(seed,1,7)*6.283,p2=hash(seed,2,7)*6.283,p3=hash(seed,3,7)*6.283;
  const a1=0.58,a2=0.30,a3=0.12;
  const steps=34;
  ctx.beginPath();
  for(let i=0;i<=steps;i++){
    const t=i/steps*6.283;
    const w=1+K.wobble*(a1*Math.sin(t*2+p1)+a2*Math.sin(t*3+p2)+a3*Math.sin(t*5+p3));
    const px=Math.cos(t)*r*w, py=Math.sin(t)*r*w*squash;
    if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
  }
  ctx.closePath();
}

/* Die Tönung als Zahl zwischen 0 und 1. Geklemmt, weil ein Feld auch über die Ufernähe nass wird —
   dann ist `w - K.wet` negativ, und eine Tönung von −0,17 fällt am Rand der Palette heraus
   (gemessen: die erste Fassung meldete −0,17…1,00). */
function toneAt(w,near,r){
  return Math.max(0,Math.min(0.999,
    Math.max(0,(w-K.wet)/(1-K.wet))*0.55+near*0.45+r*0.3));
}

function tintOf(t){
  const n=K.tints.length-1;
  const f=Math.max(0,Math.min(0.999,t))*n;
  const i=Math.floor(f),m=f-i;
  const a=K.tints[i],b=K.tints[Math.min(n,i+1)];
  const mix=k=>Math.round(255*(a[k]*(1-m)+b[k]*m));
  return 'rgb('+mix(0)+','+mix(1)+','+mix(2)+')';
}

/* Einen Fleck backen. `wetness(x,y)` darf fehlen — dann zählt nur das Feld. */
function bakePatch(px,py,seed,wetness){
  const P=K.patch,C=K.cell;
  const cv=document.createElement('canvas');
  cv.width=P*C;cv.height=P*C;
  const x=cv.getContext('2d');
  const taken=[];
  let n=0;
  for(let j=0;j<P;j++)for(let i=0;i<P;i++){
    const gx=px*P+i, gy=py*P+j;
    const w=wetAt(gx,gy,seed);
    const near=wetness?Math.max(0,Math.min(1,wetness(gx,gy))):0;
    const dry=w<K.wet&&near<0.25;
    if(dry)continue;
    const lift=Math.max(0,(w-K.wet)/(1-K.wet))*K.wetGain+near*1.4;
    if(hash(gx,gy,seed*29+13)>K.chance*(0.35+lift))continue;
    // Mindestabstand: zwei Pfützen, die sich berühren, sind eine schlechte große
    let clash=false;
    for(const t of taken){
      if(Math.abs(t[0]-gx)<K.minGap&&Math.abs(t[1]-gy)<K.minGap){clash=true;break;}
    }
    if(clash)continue;
    taken.push([gx,gy]);
    const rr=hash(gx+7,gy+3,seed+91);
    const r=(K.rMin+(K.rMax-K.rMin)*rr*rr)*C;         // quadratisch: viele kleine, wenige große
    const sq=K.squash*(0.82+hash(gx+5,gy+11,seed+17)*0.36);
    const tone=toneAt(w,near,hash(gx,gy,seed+7));
    const cx=(i+0.5)*C+(hash(gx+2,gy+8,seed+51)-0.5)*C*0.5;
    const cy=(j+0.5)*C+(hash(gx+9,gy+4,seed+63)-0.5)*C*0.5;
    const sd=(gx*7919+gy*104729)|0;
    // Saum: dieselbe Form, größer und dunkler — der Rand ist eine Wiederholung, kein Umriss
    x.save();x.translate(cx,cy);
    x.globalCompositeOperation='multiply';
    x.globalAlpha=K.rim;
    x.fillStyle='rgb(122,110,92)';
    shapePath(x,r*1.11,sq,sd);x.fill();
    x.globalAlpha=K.alpha*(0.78+tone*0.34);
    x.fillStyle=tintOf(tone);
    shapePath(x,r,sq,sd);x.fill();
    // Licht darauf: ein knapper Streifen im oberen Drittel, in der Form beschnitten
    x.globalCompositeOperation='screen';
    x.globalAlpha=K.gloss*(0.5+hash(gx+13,gy+21,seed+83));
    shapePath(x,r*0.98,sq,sd);x.save();x.clip();
    x.fillStyle=K.glossColor;
    x.fillRect(-r,-r*sq*0.72,r*2,r*sq*0.42);
    x.restore();
    x.restore();
    n++;
  }
  if(!n)return null;
  cv.count=n;
  return cv;
}

/* Der Cache lebt je Welt (seed + Feuchtefunktion). `reset()` beim Weltbau. */
let cache=new Map(),curSeed=null,curWet=null;

function reset(seed,wetness){
  cache=new Map();curSeed=seed|0;curWet=wetness||null;
  stats.patches=0;stats.puddles=0;
  }

/* Zeichnen. `view` ist der sichtbare Weltbereich in Pixeln — es werden nur berührte Flecken
   gebacken, und jeder genau einmal. */
function draw(ctx,view){
  if(!enabled||curSeed==null)return 0;
  const t0=performance.now();
  const S=K.patch*K.cell;
  const x0=Math.floor(view.x/S),x1=Math.floor((view.x+view.w)/S);
  const y0=Math.floor(view.y/S),y1=Math.floor((view.y+view.h)/S);
  let drawn=0;
  for(let py=y0;py<=y1;py++)for(let px=x0;px<=x1;px++){
    if(px<0||py<0)continue;
    const key=px+','+py;
    let cv=cache.get(key);
    if(cv===undefined){
      cv=bakePatch(px,py,curSeed,curWet);
      cache.set(key,cv);
      stats.patches++;
      if(cv)stats.puddles+=cv.count;
    }
    if(!cv)continue;
    ctx.drawImage(cv,px*S,py*S);
    drawn++;
  }
  stats.ms=+(performance.now()-t0).toFixed(2);
  return drawn;
}

/* Für die Abnahme: wie viele Pfützen auf welcher Fläche, ohne zu zeichnen. */
function probe(w,h,seed,wetness){
  let n=0,tones=[];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const wv=wetAt(x,y,seed);
    const near=wetness?Math.max(0,Math.min(1,wetness(x,y))):0;
    if(wv<K.wet&&near<0.25)continue;
    const lift=Math.max(0,(wv-K.wet)/(1-K.wet))*K.wetGain+near*1.4;
    if(hash(x,y,seed*29+13)>K.chance*(0.35+lift))continue;
    n++;tones.push(toneAt(wv,near,hash(x,y,seed+7)));
  }
  tones.sort((a,b)=>a-b);
  return {n,per1000:+(n/(w*h)*1000).toFixed(1),
    toneMin:+(tones[0]||0).toFixed(2),toneMax:+(tones[tones.length-1]||0).toFixed(2),
    toneMed:+(tones[tones.length>>1]||0).toFixed(2)};
}

window.OW_PUDDLES={version:'pd-v1.0',K,draw,reset,probe,bakePatch,wetAt,shapePath,tintOf,toneAt,stats,
  get enabled(){return enabled;},set enabled(v){enabled=!!v;},
  note:'Eigene Schicht, kein Schatten: Senken statt Sprites, Form aus drei Harmonischen, '+
       'Tönung je Pfütze aus der Position, multiply für nass und screen für das Licht darauf.'};
})();
