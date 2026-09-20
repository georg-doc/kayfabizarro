/* KFB Overworld — Die Küste ist ein Gummiband (rc-v1.0, V6-S12, 2026-08-07)

   Georgs Idee, wörtlich: »Wenn wir die Sandfläche mit der Outline als eine mathematische Funktion
   sehen — könnte sich das bei Kollision nicht wie ein Gummiband erst weiter ausdehnen, ab einem
   gewissen Punkt mit der entsprechenden Kinetik zurückschnappen und den Helden mit bouncy Cartoon-
   Physik wegkatapultieren? Wer besonders schnell dagegenläuft, wird wie eine Billardkugel weiter
   durch die Gegend geschossen.«

   ── Warum das hier billig ist und anderswo teuer wäre ──────────────────────────────────────
   Die Kontur IST schon eine Punktliste (Marching Squares + Chaikin, `terrain-paint.js`), und
   Fläche, Feder und Schatten teilen sie sich. Eine Auslenkung je Punkt wirkt deshalb auf ALLES
   gleichzeitig: der Strand beult aus, die Tuschelinie beult mit, der Schlagschatten auch. Es gibt
   keine zweite Geometrie, die man synchron halten müsste — das ist der ganze Trick.

   ── Das Modell ────────────────────────────────────────────────────────────────────────────
   Je Konturpunkt eine Feder mit Ruhelage 0, ausgelenkt entlang der Normalen:
     · Eindrücken  — wer gegen die Kante läuft, verschiebt den nächsten Punkt und, mit einer
                     Glocke gewichtet, seine Nachbarn. Die Breite der Glocke ist die Steifheit
                     des Geländes: Sand gibt weit nach, Fels punktuell.
     · Rückstellung — Federkraft gegen die Ruhelage, gedämpft. Reine Cartoon-Physik: leicht
                     unterdämpft, damit sie zwei-, dreimal nachwippt statt satt zu stoppen.
     · Kopplung    — jeder Punkt zieht an seinen zwei Nachbarn. Ohne das entstünde eine Zacke
                     statt einer Beule; die Kopplung macht daraus eine Welle, die ausläuft.
     · Reißen      — über einer Schwelle schnappt die Kante zurück und gibt den aufgestauten
                     Weg als Geschwindigkeit an den Verursacher zurück. Das ist das Katapult.

   Nur ausgelenkte Punkte werden gerechnet (eine Liste aktiver Indizes) — eine Insel hat 5000
   Punkte, und 4990 davon liegen still. */
(function(){
'use strict';

/* Die Zahlen sind am Bedienweg gemessen, nicht geraten. Der Held läuft rund 4 Felder je Sekunde;
   im Gleichgewicht steht die Beule bei etwa v·D/K. Mit K = 42 und D = 5,2 waren das 0,19 Felder
   — zwölf Pixel, und der Reißpunkt bei 1,35 wurde nie erreicht: die Kante war zu hart, um sie
   zu sehen. Weicher und träger gestellt kommt die Beule auf gut ein halbes Feld und reißt. */
const K=12,            // Federkonstante (1/s²) — wie hart es zurückzieht
      D=2.6,           // Dämpfung. Unter dem kritischen Wert: es wippt nach, wie es soll
      LINK=0.34,       // Kopplung an die Nachbarn: aus der Zacke wird eine Welle
      SPREAD=8,        // Sigma-Maß der Glocke in Konturpunkten (≈ 1,8 Felder)
      MAXDISP=0.62,    // Reißpunkt in Feldern. Gemessen: bei vollem Anlauf (3,9 Felder/s) steht
                       // die Beule im Gleichgewicht bei 0,787 — der Reißpunkt muß darunter liegen,
                       // sonst dehnt sie sich ewig und schnappt nie.
      KICK=2.7,        // Wie viel vom aufgestauten Weg als Tempo zurückkommt. Zum Vergleich:
                       // ein Treffer stoßt den Helden mit 150 px/s an (`game-feel.js` knockHero).
                       // Ein Katapult muß deutlich darüber liegen, sonst ist es ein Schubser.
      SLEEP=0.0025;    // Darunter gilt ein Punkt als in Ruhe

let world=null;        // {rings, key}
const state=new Map(); // ring -> {disp, vel, nx, ny, active:Set, lockUntil}
/* Die Uhr des Moduls ist die SPIELZEIT, nicht `performance.now()`. Sie wird in `step(dt)`
   fortgeschrieben. Erst hing die Sperre an der Wanduhr — gemessen: drei Anläufe hintereinander,
   und nur der erste feuerte, weil die Prüfschleife schneller lief als die Echtzeit. Was in
   Spielsekunden gedacht ist, muß in Spielsekunden gezählt werden. */
let clock=0;

function normalsOf(r){
  const n=r.n,nx=new Float32Array(n),ny=new Float32Array(n);
  for(let i=0;i<n;i++){
    const a=r.pts[(i-1+n)%n],b=r.pts[(i+1)%n];
    let dx=b[0]-a[0],dy=b[1]-a[1];
    const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;
    nx[i]=-dy;ny[i]=dx;
  }
  return {nx,ny};
}

function stOf(r){
  let s=state.get(r);
  if(s)return s;
  const nn=normalsOf(r);
  s={disp:new Float32Array(r.n),vel:new Float32Array(r.n),nx:nn.nx,ny:nn.ny,active:new Set(),lockUntil:0};
  state.set(r,s);
  return s;
}

/* Die Welt anmelden. Der Ringsatz wechselt bei jedem Weltaufbau — dann sind alle Federn neu. */
function attach(rings,key){
  if(world&&world.key===key)return;
  state.clear();
  world={rings,key};
}

/* Nächster Konturpunkt zu einer Weltposition (in FELD-Koordinaten). Über die Bounding Box der
   Ringe vorgefiltert; ohne das durchsucht man für jeden Schritt die ganze Insel. */
function nearest(fx,fy,maxD){
  if(!world)return null;
  let best=null,bd=maxD*maxD;
  for(const r of world.rings){
    const b=r.box;
    if(fx<b[0]-maxD||fx>b[2]+maxD||fy<b[1]-maxD||fy>b[3]+maxD)continue;
    for(let i=0;i<r.n;i++){
      const p=r.pts[i],dx=p[0]-fx,dy=p[1]-fy,d2=dx*dx+dy*dy;
      if(d2<bd){bd=d2;best={r,i,d:Math.sqrt(d2)};}
    }
  }
  return best;
}

/* Eindrücken. `fx,fy` Position in Feldern, `vx,vy` Bewegung in Feldern je Sekunde.
   Rückgabe: null, oder {x,y} als Katapult-Geschwindigkeit in Feldern je Sekunde. */
function push(fx,fy,vx,vy,dt,reach){
  if(!world)return null;
  const hit=nearest(fx,fy,reach==null?1.1:reach);
  if(!hit)return null;
  const {r,i}=hit;
  const s=stOf(r);
  // Nur wer AUF die Kante zu läuft, drückt sie ein — Entlanglaufen soll nichts verformen
  const into=-(vx*s.nx[i]+vy*s.ny[i]);
  if(into<=0.05)return null;
  const amt=into*dt;
  /* Gedeckelt wird die SPITZE, nicht jeder Punkt einzeln. Der erste Deckel stand in der Schleife
     (`max(-MAXDISP, disp[j]-amt*w)`) — bei anhaltendem Druck lief damit die ganze Glocke in
     denselben Anschlag, und aus der Kurve wurde ein Tisch mit senkrechten Kanten: gemessen sechs
     Nachbarpunkte auf exakt 41,3 px und dann in einem Schritt auf 0. Genau die Zacke, die Georg
     ausgeschlossen hat. Jetzt wächst die Spitze bis zum Anschlag, und das Profil wird aus ihr
     GESCHRIEBEN — die Glockenform bleibt bei jeder Druckstärke erhalten. */
  const peak=Math.min(MAXDISP*1.04,-s.disp[i]+amt);
  /* Das Fenster muß auf NULL auslaufen. Vorher lief die Schleife von −SPREAD bis +SPREAD, und
     bei k = ±SPREAD stand die Gaußkurve noch bei **19 %** — dort sprang die Auslenkung in einem
     Schritt auf 0. Das ist die »rechteckige Begrenzung«, die Georg sieht: nicht die Kurve war
     falsch, sondern ihr Abschneiden. Jetzt reicht das Fenster über drei Sigma (Rest 1,1 %) und
     wird zusätzlich mit einem Hann-Fenster multipliziert, das am Rand **exakt** null ist.
     Eine Welle ist erlaubt, eine Zacke nicht. */
  const SIG=SPREAD*0.55, WIN=Math.ceil(SIG*3);
  for(let k=-WIN;k<=WIN;k++){
    const j=((i+k)%r.n+r.n)%r.n;
    const w=Math.exp(-(k*k)/(2*SIG*SIG))*(0.5+0.5*Math.cos(Math.PI*k/WIN));
    s.disp[j]=-Math.max(-s.disp[j],peak*w);
    s.active.add(j);
  }
  if(-s.disp[i]>=MAXDISP&&!(s.lockUntil>clock)){
    /* Gerissen — EINMAL. Der erste Entwurf hat nur den Kick zurückgegeben und die Auslenkung
       stehen lassen: die Schwelle blieb überschritten, und jeder Folgeframe feuerte erneut
       (gemessen: 120 Aufrufe → 105 Kicks). Georgs Modell ist »dehnt sich, dann schnappt zurück« —
       ein Schnappen je Kontakt. Also: die Spanne auf einen kleinen Rest zurücksetzen, ihr die
       aufgestaute Energie als Geschwindigkeit mitgeben, und den Ring kurz sperren. */
    const stored=-s.disp[i];
    /* Entspannen über eine BREITE, weiche Glocke. Die erste Fassung nahm die schmale Druckglocke
       — die Lösung war dann punktuell und hinterließ eine **Zacke** statt einer auslaufenden
       Welle (Georg: »das darf nicht passieren, das muß ein Gummiband sein«). Doppelte Breite,
       und die Geschwindigkeit bekommt dieselbe Verteilung wie die Entspannung: dann löst sich die
       ganze Beule als eine Bewegung, nicht als Riss in der Mitte. */
    const WIDE=SPREAD*2.2, WW=Math.ceil(WIDE*2.2);
    for(let k=-WW;k<=WW;k++){
      const j=((i+k)%r.n+r.n)%r.n;
      const w=Math.exp(-(k*k)/(2*WIDE*WIDE))*(0.5+0.5*Math.cos(Math.PI*k/WW));
      s.disp[j]*=(1-0.85*w);
      s.vel[j]+=stored*K*0.30*w;
      s.active.add(j);
    }
    s.lockUntil=clock+0.45;                   // kein Dauerfeuer beim Anlehnen
    return {x:s.nx[i]*stored*KICK*13, y:s.ny[i]*stored*KICK*13};
  }
  return null;
}

/* Ein Zeitschritt für alle wachen Punkte. Feder + Dämpfung + Kopplung, halb-implizit
   integriert (erst die Geschwindigkeit, dann die Lage) — explizit fliegt das bei K=42 auseinander. */
function step(dt){
  if(!world)return 0;
  const h=Math.min(dt,1/45);
  clock+=h;
  let awake=0;
  for(const [r,s] of state){
    if(!s.active.size)continue;
    const add=[];
    for(const i of s.active){
      const n=r.n;
      const l=s.disp[(i-1+n)%n],rr=s.disp[(i+1)%n],c=s.disp[i];
      const a=-K*c-D*s.vel[i]+LINK*K*((l-c)+(rr-c));
      s.vel[i]+=a*h;
      s.disp[i]+=s.vel[i]*h;
      // Die Welle darf weiterwandern: wache Nachbarn ziehen ihre Nachbarn mit
      if(Math.abs(s.disp[i])>SLEEP*3){add.push((i-1+n)%n,(i+1)%n);}
    }
    for(const j of add)s.active.add(j);
    for(const i of [...s.active]){
      if(Math.abs(s.disp[i])<SLEEP&&Math.abs(s.vel[i])<SLEEP*4){
        s.disp[i]=0;s.vel[i]=0;s.active.delete(i);
      }
    }
    awake+=s.active.size;
  }
  return awake;
}

/* Die Auslenkung eines Punktes, für den Zeichner. Zwei Zahlen, kein Objekt — das läuft je Frame
   für jeden sichtbaren Punkt, und ein Objekt je Aufruf wäre Müll für den Sammler. */
function dx(r,i){const s=state.get(r);return s?s.nx[i]*s.disp[i]:0;}
function dy(r,i){const s=state.get(r);return s?s.ny[i]*s.disp[i]:0;}
const busy=r=>{const s=state.get(r);return !!(s&&s.active.size);};
function awakeTotal(){let n=0;for(const [,s] of state)n+=s.active.size;return n;}

window.OW_RUBBER={version:'rc-v1.0',attach,push,step,dx,dy,busy,awakeTotal,
  K,D,LINK,SPREAD,MAXDISP,
  reset(){state.clear();},
  note:'Die Küstenkontur als Federkette. Fläche, Tusche und Schatten teilen dieselbe Punktliste — '+
       'eine Auslenkung beult deshalb alle drei zugleich aus. Reißt sie, katapultiert sie zurück.'};
})();
