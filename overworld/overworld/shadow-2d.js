/* KFB Overworld — shadow-2d (sh-v1.0, V5-S4 »Bodenkontakt«, Masterplan §21)
   Der Schatten ist kein Schmuck, er ist die **Auflage**. Tiny Swords backt einen halbtransparenten
   Schatten ins Blatt; FrizzleBob und die drei CraftPix-Helden haben **keinen** (gemessen: 0 %
   halbtransparente Pixel am Fußband, Deckung 255) — ohne Auflage schwebt die Figur.

   Drei Zahlen kommen aus der Messung an den gebackenen Schatten (2026-08-06), nicht aus dem Gefühl:
   - **Mittig unter dem FUSSPUNKT** (korrigiert V5-S7d): der Ursprung ist die gemessene Mitte des
     Fußbands (¦unit-loader.probeFoot¦), nicht die Rahmenmitte und nicht die Körpermitte. Vorher saß
     er bei den drei Helden sichtbar daneben, weil CraftPix die Figur nicht mittig ins Feld legt.
   - **Mittig.** Schattenmitte gegen Körpermitte: −4,5 · −3,1 · −1,0 · −2,3 · +2,4 · −3,7 px bei
     Körperbreiten von 43–115 px. Mittel ≈ −2 px → das Pack zeichnet **senkrecht von oben**.
     Also gibt es hier keine erfundene Lichtrichtung, nur einen Hauch Versatz (`DX`).
   - **Breite 0,49–0,56 der Körperbreite** bei Zweibeinern (Warrior 0,49 · Goblin 0,56), breiter bei
     Vierbeinern (Bär 0,80 · Schaf 0,93 — die stehen auf mehr Fläche). Der Radius ist deshalb
     **0,30 · bodyW** (Durchmesser 0,60), nicht 0,42 wie im Konzept geschätzt. Messen korrigiert.
   - **Deckung 85–167** in den gebackenen Bändern → gezeichnet wird mit **0,30** Mitte, nach außen
     auslaufend. Gezeichnet und gebacken dürfen sich nicht widersprechen.

   Die Kopplung (§21.3): §17 verformt **nur im Bild**, der Schatten hängt an der **Physik**. Deshalb
   bleibt er beim Stauchen liegen, schrumpft und blasst mit der Höhe (`z`) und wird beim Aufprall
   kurz breiter (`press`). `z` und `press` liefert das Spiel; wer nichts liefert, bekommt den
   ruhenden Schatten — kein Sonderweg. */
(function(){
'use strict';
const K={
  rx:0.30,      // Radius quer, Anteil der gemessenen Körperbreite
  flat:0.38,    // Verkürzung in der Draufsicht (ry = rx · flat)
  alpha:0.30,   // Deckung in der Mitte
  zShrink:0.45, // wie stark der Schatten mit der Höhe schrumpft
  zFade:0.55,   // und wie stark er ausblasst
  press:0.22,   // Aufprall: kurz breiter
  dx:0,         // **kein** Versatz: der Ursprung ist der gemessene Fußpunkt (V5-S7d)
  edge:0.84,    // ab hier läuft die Kante aus — Tiny Swords backt eine harte Ellipse, keinen Nebel
};
let enabled=true;
const last={rx:0,ry:0,a:0,n:0};

/* Ein Schatten. x/y ist der **Fußpunkt** (derselbe Ursprung wie beim Sprite), bodyW die gemessene
   Körperbreite in Bildschirmpixeln. Rückgabe: der gezeichnete Querradius (0 = nichts gezeichnet). */
function draw(ctx,x,y,bodyW,o){
  if(!enabled||!(bodyW>0))return 0;
  o=o||{};
  const z=Math.max(0,Math.min(1,o.z||0));
  const press=Math.max(0,Math.min(1,o.press||0));
  const mass=Math.max(0.8,Math.min(1.35,o.mass||1));
  const rx=K.rx*bodyW*(1-K.zShrink*z)*(1+K.press*press);
  const ry=rx*K.flat;
  const a=K.alpha*(1-K.zFade*z)*mass;
  if(rx<0.6||a<0.02)return 0;
  ctx.save();
  ctx.translate(x+K.dx*bodyW,y);
  ctx.scale(1,K.flat);
  const g=ctx.createRadialGradient(0,0,0,0,0,rx);
  /* Kante statt Nebel: bis ¦edge¦ voll deckend, dann in einem Schritt aus. Der weiche Verlauf
     (0,62 → 0) sah aus wie ein Weichzeichner unter der Figur, nicht wie eine Auflage. */
  g.addColorStop(0,'rgba(26,22,16,'+a.toFixed(3)+')');
  g.addColorStop(K.edge,'rgba(26,22,16,'+(a*0.96).toFixed(3)+')');
  g.addColorStop(1,'rgba(26,22,16,0)');
  ctx.fillStyle=g;
  ctx.beginPath();ctx.arc(0,0,rx,0,7);ctx.fill();
  ctx.restore();
  last.rx=rx;last.ry=ry;last.a=a;last.n++;
  return rx;
}

/* Dieselbe Rechnung ohne Leinwand — damit die Abnahme Zahlen lesen kann, statt Pixel zu deuten. */
function probe(bodyW,o){
  o=o||{};
  const z=Math.max(0,Math.min(1,o.z||0)),press=Math.max(0,Math.min(1,o.press||0));
  const mass=Math.max(0.8,Math.min(1.35,o.mass||1));
  const rx=K.rx*bodyW*(1-K.zShrink*z)*(1+K.press*press);
  return{rx:+rx.toFixed(2),ry:+(rx*K.flat).toFixed(2),
    alpha:+(K.alpha*(1-K.zFade*z)*mass).toFixed(3),
    widthRel:+((2*rx)/bodyW).toFixed(3)};
}

window.OW_SHADOW={version:'sh-v1.0',K,draw,probe,last,
  get enabled(){return enabled;},set enabled(v){enabled=!!v;},
  note:'Gezeichnete Auflage für Blätter ohne gebackenen Schatten. Zahlen gemessen an Tiny Swords (§21).'};
})();
