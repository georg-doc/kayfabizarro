/* KFB — contact-shadow (cs-v1.1, V7-S3/S6)
   **Der Schatten hat die Form des Dings, nicht die Form eines Kreises.**

   ── Wer überhaupt einen bekommt (Georgs Regel vom 8.8., jetzt Kanon) ──────────────────────────
   »unser schatten macht mehr probleme bei tiny swords als nutzen — ggf. nur für unser
   chatGPT/custom assets ohne schatten? also auch heros & frizzlebob (haben keine schatten)«

   Belegt: **jedes** geprüfte Tiny-Swords-Blatt backt seinen Schatten ein (Troll 3129
   halbtransparente dunkle Pixel im unteren Drittel, Burg 3322, Warrior 342, selbst das Schaf 207).
   Wer da noch eine Auflage darunter legt, zeichnet zwei Schatten — bei den Gebäuden war es am
   schlimmsten, weil die Ellipse gegen die Bildbreite rechnete statt gegen den Körper.

   Also gilt: **eine Auflage bekommt nur, wer gemessen keine mitbringt.** Das ist keine Liste von
   Ausnahmen, sondern eine Messung — `unit-loader.probeShadow` entscheidet es je Blatt
   (`shadow: 'baked' | 'ellipse'`), und der Katalog darf es überschreiben. In der Praxis bleiben
   damit genau unsere eigenen Sachen übrig: die fünf Helden aus `hero-frames.js`, Uncle FrizzleBob,
   und die Requisiten aus Georgs generierten Blättern (Punkt 1 des Re-Briefings war »kein
   Schatten«, und das war richtig — unsere Blätter sollen keinen mitbringen).
   Eine Liste wäre geraten, sobald ein Blatt dazukommt. Die Messung ist es nie.

   Georgs Befund am 7.8. nachts: die eine Ellipse unter allem ist »für die meisten falsch« — extrem
   flach platzierte Ovale sehen aus wie Pfützen, nicht wie Bodenkontakt. Drei Forderungen, wörtlich:
   die **Form und die Breite des Assets** nehmen, **abgerundet**, und **nicht grau, sondern so
   durchlässig, dass die Textur darunter noch zu sehen ist**. Gilt global, also auch für Einheiten
   ohne eigenen gebackenen Schatten.

   Also wird der Schatten aus dem Sprite MESSEND abgeleitet, nicht geraten:

     1. **Standfläche.** Im unteren Band des Sprites (`band`, Anteil der Körperhöhe) wird je Spalte
        gezählt, wie viel davon deckend ist. Das ist die Kontaktbreite je Spalte — ein Baumstamm
        bekommt eine schmale, ein liegender Stamm eine lange Fläche. Der Rahmen ist kein Standpunkt
        (§21.5), und die Bounding Box ist keine Standfläche.
     2. **Streuung.** Das Profil wird verbreitert (`spread`) und geglättet: Licht ist nicht punktförmig,
        harte Profilkanten wären eine Behauptung über die Lichtquelle.
     3. **Form.** Die halbe Höhe je Spalte folgt der Wurzel der Deckung — in der Mitte breit,
        an den Enden rund auslaufend. Keine Ellipse, kein Rechteck.
     4. **Farbe.** Gezeichnet wird mit `multiply` in einem warmen Dunkelton. Multiplikation heißt:
        die Textur darunter bleibt sichtbar, weil sie mitgerechnet wird statt übermalt zu werden.
        Grau wäre ein Deckel, und ein Deckel ist kein Schatten.

   Gebacken wird einmal je Sprite und Zielbreite (`bakeCache`), gezeichnet wird ein `drawImage` —
   die Messung darf nicht im Frame liegen.

   Was hier NICHT hineingehört: die Pfützen. Georg: »das könnte ein gutes Feature sein, aber
   getrennt vom Schatten, zusammen mit den Materialcodes« — organische Ovale mit farblicher
   Variation, verteilt wie die Requisiten. Steht im Masterplan bei §31.2, nicht hier. */
(function(){
'use strict';

const K={
  band:0.26,        // Anteil der Körperhöhe, der als Standfläche zählt
  spread:0.16,      // Verbreiterung gegen die Profilkante (Anteil der Zielbreite)
  flat:0.34,        // Gesamthöhe des Schattens als Anteil der Kontaktbreite
  alpha:0.46,       // Stärke der Multiplikation
  blur:0.09,        // Weichzeichnung als Anteil der Zielbreite
  color:'#5b4a33',  // warmer Dunkelton — nicht grau, nicht schwarz
  dx:0.03,          // leichter Versatz gegen die Sonne
  zShrink:0.34,zFade:0.5,   // in der Luft kleiner und schwächer
  /* Das Zentrum sitzt NICHT auf dem Fußpunkt (V7-S3c). Georgs Befund: dann liegt die halbe
     Schattenhöhe unter dem Sprite, und das Sprite scheint zu schweben. Das Zentrum gehört knapp
     ÜBER die untere solide Baseline — `lift` ist der Anteil der halben Schattenhöhe, um den es
     angehoben wird. 0,55 heißt: 78 % der Auflage liegen über der Baseline, der Rest schaut als
     Kontaktsaum darunter hervor. */
  lift:0.55,
  press:0.15,       // beim Aufsetzen breiter
  minW:5
};

let enabled=true;
const last={n:0,w:0,h:0,a:0,profiles:0,bakes:0};
const profCache=new WeakMap();   // img → Map(rect → Float32Array)
const bakeCache=new WeakMap();   // img → Map(rect@width → canvas)

function ctxOf(img){
  let c=img.__csCtx;
  if(!c){
    const cv=document.createElement('canvas');
    cv.width=img.width||img.videoWidth;cv.height=img.height||img.videoHeight;
    c=cv.getContext('2d',{willReadFrequently:true});
    c.drawImage(img,0,0);
    try{Object.defineProperty(img,'__csCtx',{value:c});}catch(e){img.__csCtx=c;}
  }
  return c;
}

/* Die Standfläche messen. Rückgabe: Deckung je Spalte im unteren Band, 0…1, plus die Zeile, auf
   der das Sprite wirklich aufsetzt (nicht die Rahmenkante). */
function profileOf(img,sx,sy,w,h){
  let m=profCache.get(img);
  if(!m){m=new Map();profCache.set(img,m);}
  const key=sx+','+sy+','+w+','+h;
  const hit=m.get(key);if(hit)return hit;
  let d;
  try{d=ctxOf(img).getImageData(sx,sy,w,h).data;}
  catch(e){return null;}
  // unterste deckende Zeile finden — der echte Fußpunkt
  let bottom=-1;
  for(let j=h-1;j>=0&&bottom<0;j--){
    for(let i=0;i<w;i++)if(d[(j*w+i)*4+3]>96){bottom=j;break;}
  }
  if(bottom<0)return null;
  // Körperhöhe für das Band: von der obersten deckenden Zeile bis zum Fußpunkt
  let top=bottom;
  for(let j=0;j<=bottom;j++){
    let any=false;
    for(let i=0;i<w;i++)if(d[(j*w+i)*4+3]>96){any=true;break;}
    if(any){top=j;break;}
  }
  const bodyH=Math.max(1,bottom-top+1);
  const band=Math.max(2,Math.round(bodyH*K.band));
  const cols=new Float32Array(w);
  let max=0;
  for(let i=0;i<w;i++){
    let n=0;
    for(let j=bottom;j>bottom-band&&j>=0;j--)if(d[(j*w+i)*4+3]>96)n++;
    cols[i]=n/band;if(cols[i]>max)max=cols[i];
  }
  if(max<=0)return null;
  for(let i=0;i<w;i++)cols[i]=Math.min(1,cols[i]/max);
  const out={cols,bottom,bodyH,band};
  m.set(key,out);last.profiles++;
  return out;
}

/* Aus dem Profil eine Auflage backen. Einmal je Sprite und Zielbreite. */
function bakeOf(img,sx,sy,w,h,targetW){
  const tw=Math.max(K.minW,Math.round(targetW));
  let m=bakeCache.get(img);
  if(!m){m=new Map();bakeCache.set(img,m);}
  const key=sx+','+sy+','+w+','+h+'@'+tw;
  const hit=m.get(key);if(hit!==undefined)return hit;
  const p=profileOf(img,sx,sy,w,h);
  if(!p){m.set(key,null);return null;}
  // Profil auf die Zielbreite abtasten
  const raw=new Float32Array(tw);
  for(let i=0;i<tw;i++){
    const a=Math.floor(i*w/tw),b=Math.max(a+1,Math.floor((i+1)*w/tw));
    let s=0,n=0;for(let k=a;k<b&&k<w;k++){s+=p.cols[k];n++;}
    raw[i]=n?s/n:0;
  }
  /* **Die Maße hängen an der gemessenen Standfläche, nicht am Rahmen** (V8-S4).
     Georg: FrizzleBobs Schatten sei zu groß und zu weich — und fragte, ob es eine Ausnahme
     »Einheit gegen Requisite« braucht. Braucht es nicht: es war derselbe Fehler wie »der Rahmen ist
     kein Standpunkt« (§21.5), eine Ebene höher. Streuung, Höhe und Weichzeichnung waren Anteile von
     `tw` — und `tw` ist die **Rahmenbreite** (im Spiel `ia.fw*s`). Ein Hase, der auf zwei Stiefeln
     steht, füllt seinen Rahmen nicht; sein Schatten wurde trotzdem rahmenbreit und rahmenweich.
     Jetzt trägt die gemessene Aufsatzbreite die Zahlen. Ein breiter Busch ändert sich kaum (seine
     Standfläche *ist* der Rahmen), eine schmale Figur wird schmal und scharf — dieselbe Regel für
     beide, ohne Sonderfall. */
  let lo=-1,hi=-1;
  for(let i=0;i<tw;i++)if(raw[i]>0.12){if(lo<0)lo=i;hi=i;}
  const contactW=lo<0?tw:(hi-lo+1);
  // Streuung: Maximum im Fenster (Dilatation), dann Mittel im Fenster (Glättung)
  const r=Math.max(1,Math.round(contactW*K.spread));
  const dil=new Float32Array(tw),sm=new Float32Array(tw);
  for(let i=0;i<tw;i++){
    let mx=0;
    for(let k=-r;k<=r;k++){const j=i+k;if(j>=0&&j<tw&&raw[j]>mx)mx=raw[j];}
    dil[i]=mx;
  }
  for(let i=0;i<tw;i++){
    let s=0,n=0;
    for(let k=-r;k<=r;k++){const j=i+k;if(j>=0&&j<tw){s+=dil[j];n++;}}
    sm[i]=s/n;
  }
  const half=Math.max(1.4,contactW*K.flat*0.5);
  const blur=Math.max(0.6,contactW*K.blur);
  const pad=Math.ceil(blur*2)+2;
  const cw=tw+pad*2,ch=Math.ceil(half*2)+pad*2;
  const cv=document.createElement('canvas');cv.width=cw;cv.height=ch;
  const x=cv.getContext('2d');
  if('filter' in x)x.filter='blur('+blur.toFixed(2)+'px)';
  x.fillStyle=K.color;
  x.beginPath();
  const cy=ch/2;
  // Oberkante hin, Unterkante zurück — die Wurzel macht die Enden rund statt spitz
  for(let i=0;i<tw;i++){
    const hy=half*Math.sqrt(sm[i]);
    const px=pad+i+0.5;
    if(i===0)x.moveTo(px,cy-hy);else x.lineTo(px,cy-hy);
  }
  for(let i=tw-1;i>=0;i--){
    const hy=half*Math.sqrt(sm[i]);
    x.lineTo(pad+i+0.5,cy+hy);
  }
  x.closePath();x.fill();
  if('filter' in x)x.filter='none';
  cv.pad=pad;cv.tw=tw;cv.half=half;cv.contactW=contactW;
  m.set(key,cv);last.bakes++;
  return cv;
}

/* Zeichnen. x/y ist der **Fußpunkt** — derselbe Ursprung wie beim Sprite.
   `src` beschreibt das Sprite, aus dem die Standfläche gemessen wird. */
function draw(ctx,x,y,src,opt){
  if(!enabled||!src||!src.img)return 0;
  const o=opt||{};
  const tw=o.width||0;
  if(!(tw>0))return 0;
  const z=Math.max(0,Math.min(1,o.z||0));
  const press=Math.max(0,Math.min(1,o.press||0));
  const mass=Math.max(0.75,Math.min(1.4,o.mass||1));
  const cv=bakeOf(src.img,src.sx|0,src.sy|0,src.w|0,src.h|0,tw);
  if(!cv)return 0;
  const shrink=(1-K.zShrink*z)*(1+K.press*press);
  const a=K.alpha*(1-K.zFade*z)*mass*(o.alpha==null?1:o.alpha);
  if(a<0.02||shrink<=0)return 0;
  const dw=cv.width*shrink,dh=cv.height*shrink;
  const lift=cv.half*shrink*K.lift;
  ctx.save();
  ctx.globalCompositeOperation='multiply';
  ctx.globalAlpha=Math.min(1,a);
  ctx.drawImage(cv,x-dw/2+cv.tw*K.dx*shrink,y-lift-dh/2,dw,dh);
  ctx.restore();
  last.n++;last.w=cv.tw*shrink;last.h=cv.half*2*shrink;last.a=a;
  return cv.tw*shrink;
}

/* Dieselbe Rechnung ohne Leinwand — damit die Abnahme Zahlen lesen kann statt Pixel zu deuten. */
function probe(img,sx,sy,w,h,targetW){
  const p=profileOf(img,sx,sy,w,h);
  if(!p)return null;
  let wide=0;for(let i=0;i<p.cols.length;i++)if(p.cols[i]>0.15)wide++;
  const contact=wide/p.cols.length;
  const cv=bakeOf(img,sx,sy,w,h,targetW||w);
  return {contactRel:+contact.toFixed(3),bodyH:p.bodyH,band:p.band,bottom:p.bottom,
    shadowW:cv?cv.tw:0,shadowH:cv?+(cv.half*2).toFixed(1):0,
    /* Die eigentliche Zahl seit cs-v1.2: worauf die Maße sich beziehen. */
    contactW:cv?cv.contactW:0,
    rahmenAnteil:cv?+(cv.contactW/cv.tw).toFixed(2):0,
    /* Der Beleg gegen die alte Ellipse: dort war die Breite immer 0,86 der Körperbreite,
       egal was unten wirklich aufsetzt. */
    ellipseW:+(0.43*2*(targetW||w)).toFixed(1)};
}

window.OW_CONTACT={version:'cs-v1.2',K,draw,probe,profileOf,bakeOf,last,
  get enabled(){return enabled;},set enabled(v){enabled=!!v;},
  note:'Standfläche gemessen, Form aus dem Sprite, multiply statt Grau — die Textur bleibt sichtbar. '+
       'Eine Auflage bekommt NUR, wer gemessen keinen gebackenen Schatten mitbringt (V7-S6). '+
       'Streuung, Höhe und Weichzeichnung sind Anteile der **gemessenen Aufsatzbreite**, nicht der '+
       'Rahmenbreite (V8-S4) — sonst bekommt eine schmale Figur den Schatten ihres leeren Rahmens.'};
})();
