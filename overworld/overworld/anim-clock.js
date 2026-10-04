/* KFB Overworld — anim-clock (aclock-v1.0, V8-S1)
   **Laufen ist eine Strecke. Atmen ist eine Zeit. Zuschlagen ist eine Aufführung.**

   Drei Uhren, eine Stelle. Bisher liefen alle drei an derselben: `anim += dt * fps`. Deshalb schwebte
   der Troll — seine Beine liefen nach der Uhr weiter, während der Boden unter ihm nicht mitkam.
   Und deshalb lief in der Mob-Übersicht der Streifen, obwohl niemand ging: dort gibt es keinen Boden,
   also gab es auch nichts, was die Uhr hätte bremsen können.

   Georgs Beobachtung am Godot-Fork war der Fingerzeig: das fühlt sich flüssig an, weil die Animation
   an der Bewegung hängt, nicht an der Uhr. Kein Engine-Zauber, eine Kopplung.

   ── Die Regel ────────────────────────────────────────────────────────────────────────────────────
   Ein Laufzyklus ist ein SCHRITTPAAR und deckt eine feste Strecke Boden ab — die Schrittlänge. Die
   ist keine Konstante, sondern hängt am Körper: ein Troll macht längere Schritte als ein Gnom. Also

       Schrittlänge = Körperhöhe × STRIDE_REL
       anim += (gelaufene Strecke / Schrittlänge) × Bilder je Zyklus

   Damit ist der Fuß am Boden festgenagelt, bei jedem Tempo. Wer blockiert ist, bewegt die Beine
   nicht — nicht weil wir das abfragen, sondern weil `gelaufene Strecke` dann 0 ist. Der Bug
   verschwindet als FOLGE der Regel, nicht als Sonderfall darin (dieselbe Form wie das
   Vorbeischleichen aus V4-S1).

   Idle bleibt an der Zeit: Atmen hat nichts mit Boden zu tun. Angriff bleibt an der Zeit: eine
   Aufführung dauert, was sie dauert, sonst hängt der Schlag am Laufweg.

   ── Warum nicht einfach die Rate am Tempo skalieren? ─────────────────────────────────────────────
   Das war die alte Fassung: `min(14, 6 + sp/13)`. Sie ist gedeckelt und additiv, also stimmt sie bei
   genau einem Tempo. Gemessen an der eigenen Formel: bei 20 px/s kommen 2,6 px auf ein Bild, bei
   180 px/s sind es 12,9 — der Fuß rutscht um den Faktor 5. Eine Strecke je Bild ist keine
   Geschmacksfrage, sie ist eine Zahl, und sie muss konstant sein. */
(function(){
'use strict';

/* ── v10-S14 · Die Kopplung stimmte, die Zahl nicht ────────────────────────────────────────────
   Georgs Befund: »alle schweben eher als dass sie gehen«. Gemessen war die Kopplung tadellos
   (`worstUnitRatio 1,000`, `stillRun 0`) — der Fuß rutschte bei jedem Tempo gleich viel. Nur:
   **gleich viel war zu viel.** Der Schlupf, also der Boden je Animationsbild, lag beim Bären bei
   **31,2 px**, beim Skelett bei 20,2, beim Helden bei 10,5. Ein Bild, das 31 px Boden abdeckt, liest
   das Auge nicht als Schritt, sondern als Gleiten.

   Zwei Ursachen, beide in der Formel:
     1. `STRIDE_REL 1,15` war zu großzügig. `bodyH` ist die **gemessene Tintenhöhe** — sie enthält
        erhobene Waffen, Hörner, Ohren. Als Maß für die **Beinlänge** ist sie zu groß, also war die
        Schrittlänge zu lang und die Beine drehten zu langsam.
     2. `stride / frames`: eine Einheit mit vier Laufbildern rutscht doppelt so weit je Bild wie eine
        mit acht. Das ist rechnerisch korrekt und sieht trotzdem falsch aus — die Bilderzahl ist eine
        Eigenschaft des Blattes, keine des Ganges.

   Deshalb jetzt **zwei Zahlen statt einer**: eine kürzere Bezugsschrittlänge **und** eine Obergrenze
   für den Boden je Bild. *Ein Animationsbild darf höchstens so viel Boden abdecken, wie ein Auge
   noch als einen Schritt liest.* Die Regel bleibt unangetastet — Laufen hängt weiter an der
   gelaufenen Strecke, nicht an der Uhr. Gedeckelt wird nur, wie weit ein Bild trägt. */
const STRIDE_REL=0.62;   // Schrittpaar deckt 0,62 Körperhöhen Boden ab (war 1,15)
const MAX_SLIP=9;        // Boden je Animationsbild, Obergrenze in Weltpixeln
const IDLE_FPS=7;        // Atmen
const MIN_STRIDE=18;     // sonst zappelt ein sehr kleines Wesen

/* Belege. Der Schlupf ist die Strecke je Animationsbild.
   **Achtung, hier habe ich mich beim ersten Versuch selbst reingelegt:** Schlupf = Schrittlänge /
   Bilder, also je EINHEIT eine Konstante und zwischen Einheiten verschieden — ein Troll deckt mehr
   Boden je Bild ab als ein Gnom, und genau das ist der Sinn. Ein Verhältnis über alle Einheiten
   hinweg misst deshalb Körpergrößen, nicht Kopplung (erste Messung: 5,25 — sah nach Fehler aus, war
   Bauart). Die richtige Frage lautet: schwankt der Schlupf EINER Einheit über die Tempi? Dann ist
   die Kopplung kaputt. Also wird je Einheit gebucht. */
const probe={runFrames:0,stillRun:0,pxSum:0,frameSum:0,idleFrames:0,atkFrames:0,
  spMin:1e9,spMax:0,per:new Map()};

function strideOf(ent,unit,frames){
  const bh=(unit&&unit.bodyH?unit.bodyH:48)*(ent.sizeMul||1);
  let s=Math.max(MIN_STRIDE,bh*STRIDE_REL);
  /* Der Deckel greift an der Schrittlänge, nicht am Ergebnis — so bleibt `stride/frames` die eine
     Rechnung und der Schlupf bleibt je Einheit konstant (die Prüfzahl `worstUnitRatio` misst
     weiterhin, was sie messen soll). */
  const f=Math.max(1,frames||6);
  if(s/f>MAX_SLIP)s=MAX_SLIP*f;
  return s;
}

/* Die eine Stelle, an der ein Animationsbild weiterläuft.
   `moved` ist die TATSÄCHLICH gelaufene Strecke in Weltpixeln, vom Aufrufer gemessen — nicht das
   Sollwert-Tempo. Wer hier `sp` einsetzt, hat den Fehler nur verschoben. */
function advance(ent,unit,dt,moved,state){
  const st=state||ent.state||'idle';
  if(st==='attack'||st==='hit'||st==='dead'||st==='cast'){
    ent.anim+=dt;                       // Aufführung: der Aufrufer liest mit atkT/fps aus
    probe.atkFrames++;
    return ent.anim;
  }
  if(st!=='run'){
    ent.anim+=dt*IDLE_FPS;              // Atmen
    probe.idleFrames++;
    return ent.anim;
  }
  const a=unit&&unit.anim?unit.anim('run'):null;
  const frames=(a&&a.frames)||6;
  const stride=strideOf(ent,unit,frames);
  const d=Math.max(0,moved||0);
  const step=(d/stride)*frames;
  ent.anim+=step;
  probe.runFrames++;
  probe.pxSum+=d;probe.frameSum+=step;
  if(dt>0&&d>0.01){const sp=d/dt;
    if(sp<probe.spMin)probe.spMin=sp;
    if(sp>probe.spMax)probe.spMax=sp;}
  if(step>1e-6){
    const slip=d/step;
    /* Der Eimer muss der KÖRPER sein, nicht die Art. Zweimal habe ich das falsch gemacht:
       erst alle Einheiten in einen Topf (5,25 — das war Körpergröße), dann alle Gnome in einen
       (1,22 — das war der **Elite**, `sizeMul` 1,22, dauerhaft größer und also mit längerem Schritt).
       Beide Male sah Bauart wie ein Fehler aus. Wer den Schlupf misst, muss nach dem Maß buchen, das
       ihn bestimmt — Körperhöhe mal Größenfaktor. */
    const id=((unit&&unit.id)||ent.name||'?')+'@'+(+(ent.sizeMul||1)).toFixed(2);
    let p=probe.per.get(id);
    if(!p){p={lo:slip,hi:slip,n:0,spLo:1e9,spHi:0};probe.per.set(id,p);}
    if(slip<p.lo)p.lo=slip; if(slip>p.hi)p.hi=slip; p.n++;
    if(dt>0){const s2=d/dt; if(s2<p.spLo)p.spLo=s2; if(s2>p.spHi)p.spHi=s2;}
  }else if(d<0.01)probe.stillRun++;     // steht und läuft: darf es jetzt nicht mehr geben
  return ent.anim;
}

/* Für Ansichten ohne Boden (Mob-Übersicht, Asset Browser): ein Tempo behaupten und daraus eine
   Strecke ableiten, statt heimlich zur Uhr zurückzufallen. Die Ansicht sagt dann ehrlich, mit
   welchem Tempo sie läuft — und benutzt dieselbe Regel wie das Spiel. */
function advanceAt(ent,unit,dt,speedPxS,state){
  return advance(ent,unit,dt,(speedPxS||0)*dt,state);
}

function report(){
  /* Gegenrechnung mit der ALTEN Formel an denselben gemessenen Tempi: `min(14, 6+sp/13)`. So ist der
     Vergleich gemessen und nicht behauptet — wir rechnen nicht v7 nach, wir rechnen die alte Regel
     auf die Tempi an, die gerade wirklich vorgekommen sind. */
  const oldSlip=sp=>sp/Math.min(14,6+sp/13);
  const units=[];
  let worst=1,worstId=null;
  for(const [id,p] of probe.per){
    if(p.n<20)continue;                       // zu wenige Bilder sagen nichts
    const ratio=p.hi/Math.max(1e-6,p.lo);
    const a=oldSlip(p.spLo),b=oldSlip(p.spHi);
    const oldR=(p.spLo<1e9&&p.spHi>p.spLo)?Math.max(a,b)/Math.max(1e-6,Math.min(a,b)):1;
    units.push({id,n:p.n,slip:+p.lo.toFixed(2),ratio:+ratio.toFixed(3),
      oldRatio:+oldR.toFixed(3),speed:[+p.spLo.toFixed(0),+p.spHi.toFixed(0)]});
    if(ratio>worst){worst=ratio;worstId=id;}
  }
  units.sort((a,b)=>b.oldRatio-a.oldRatio);
  return {version:'aclock-v1.1',maxSlip:MAX_SLIP,
    runFrames:probe.runFrames,stillRun:probe.stillRun,
    stillRunShare:probe.runFrames?+(probe.stillRun/probe.runFrames*100).toFixed(1):0,
    pxPerFrame:probe.frameSum?+(probe.pxSum/probe.frameSum).toFixed(2):0,
    /* Der EINE Wert: der schlechteste Schlupf-Ausschlag INNERHALB einer Einheit.
       1,000 heißt, der Fuß klebt bei jedem Tempo. */
    worstUnitRatio:+worst.toFixed(3),worstUnit:worstId,units:units.slice(0,8),
    speedRange:probe.spMin<1e9?[+probe.spMin.toFixed(1),+probe.spMax.toFixed(1)]:null,
    idleFrames:probe.idleFrames,atkFrames:probe.atkFrames};
}
function reset(){Object.assign(probe,{runFrames:0,stillRun:0,pxSum:0,frameSum:0,
  idleFrames:0,atkFrames:0,spMin:1e9,spMax:0,per:new Map()});}

window.OW_ACLOCK={version:'aclock-v1.1',advance,advanceAt,strideOf,report,reset,probe,
  STRIDE_REL,MAX_SLIP,IDLE_FPS,
  note:'Laufen an der gelaufenen Strecke, Atmen an der Zeit, Angriff an der Aufführung. '+
       'Eine Strecke je Animationsbild — konstant über alle Tempi.'};
})();
