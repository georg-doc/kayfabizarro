/* reach.js — EINE Zahl für »in Reichweite« (v11-R1, Block C1)
   ────────────────────────────────────────────────────────────────────────────────────────────────
   Vorher gab es drei Wahrheiten und keine davon kannte die andere:

     · overworld-game-v10.js:4099  Held läuft heran und stoppt bei **54** — feste Zahl
     · overworld-game-v10.js:4132  Trefferprüfung bei **62** — feste Zahl
     · mob-ai.js:514               Gegner rechnet körperabhängig: ringOf + standoff, strike = ring+12

   Gemessene Folge: gegen die Schildkröte (Motiv 148 px) steht der Held bei 54 px vom Mittelpunkt
   IM Panzer. Gegen den Bären (Körper 111 px) schlägt der Gegner aus ~75 px, während der Held auf 54
   heran muß — er kassiert also eine ganze Körperlänge, bevor er selbst dran ist.

   Jetzt eine Rechnung, zwei Ränder, beide Seiten lesen dieselbe Funktion.

   ── Warum drei Werte und nicht einer? ───────────────────────────────────────────────────────────
   `reach` ist die Mitte: der Abstand, in dem sich zwei Körper berühren. Darum liegt ein Band:

     stop = reach − 8    wo das Heranlaufen endet — knapp INNEN, sonst pendelt man um die Grenze
     hit  = reach + 22   wie weit der Schlag noch zählt — knapp AUSSEN

   Die 22 sind keine Geschmackszahl, sondern der Rückstoß. `game-feel.js` stößt einen getroffenen
   Gegner mit 170 px/s an, Abbau 9,5 je Sekunde — das trägt ihn 170/9,5 ≈ **18 px** weit. Wäre das
   Band schmaler als dieser Weg, stünde der Gegner nach JEDEM Treffer außerhalb der Reichweite, der
   Held müßte nachlaufen, und genau das liest sich als Klebrigkeit. 30 px Band > 18 px Weg: der
   zweite Schlag trifft, ohne einen Schritt. Vorher: 230 px/s ≈ 24 px Weg gegen ein Band von 8 px —
   also lief der Held nach jedem eigenen Treffer hinterher. Das war die Klebrigkeit, nicht das Tempo.

   ── Warum 0,62? Der Beleg hängt an HERO_REF ────────────────────────────────────────────────────
   0,62 mal die mittlere Körperhöhe. Bezugsgröße der Welt ist `HERO_REF = 91` im Runner — der
   gemessene Warrior-Körper, gegen den das ganze Bestiarium skaliert ist (`sizeRel`). Für ein Paar
   auf Referenzgröße (91 gegen 91) gibt die Rechnung **56,4** — also stop 48, hit 78. Die alte feste
   54 lag genau dort. **Deshalb funktionierte sie so lange:** bei mittelgroßen Gegnern war sie
   richtig. Falsch wurde sie an den Rändern, und die Ränder sind das Interessante.

   Nachgerechnet gegen einen Helden auf Referenzgröße (91), Körperhöhen aus `sizeRel × 91`:

     Schaf   31 (0,34) → Mitte 61   → 37,8 → Boden 46 → stoppt 38 · trifft 68
     Gnom    71 (0,78) → Mitte 81   → 50,2            → stoppt 42 · trifft 72
     Skull   86 (0,95) → Mitte 89   → 55,0            → stoppt 47 · trifft 77
     Bär    111        → Mitte 101  → 62,6            → stoppt 55 · trifft 85
     Troll  177 (1,95) → Mitte 134  → 83,1            → stoppt 75 · trifft 105

   ── Der Deckel ist RELATIV, nicht 112 ──────────────────────────────────────────────────────────
   Erste Fassung hatte einen festen Deckel von 112 px. Am laufenden Spiel widerlegt: der Held muß
   nicht 91 groß sein. `hero_minotaur` hat sizeRel 1,75 und damit Körper **159 px** — gegen einen
   Skull (86) ergibt das Mitte 122,5 → reach 76 → stoppt 68, trifft 98. Das ist **kein Fehler**: der
   Held ist dort anderthalb Skulls hoch, sein Arm ist wirklich länger. Ein fester Deckel hätte
   stattdessen alle großen Paarungen auf denselben Wert gepreßt — der Troll hätte dieselbe Reichweite
   wie das Schaf gehabt, sobald der Held groß genug ist. Der Deckel bindet jetzt an den größeren der
   beiden Körper (0,75 davon). Er hält Gebäude und Riesenblätter davon ab, quer über das Bild zu
   treffen, ohne die Abstufung zwischen den Gegnern einzuebnen.

   ── Hausregel ──────────────────────────────────────────────────────────────────────────────────
   Wer hier eine Zahl ändert, ändert sie für BEIDE Seiten. Das ist der ganze Zweck der Datei.
   Eine zweite feste Reichweite irgendwo im Code ist ab jetzt ein Fehler, kein Feinschliff. */
(function(){
'use strict';
const FLOOR=46, CAP_REL=0.75, K=0.62, BACK=8, FRONT=22;
/* Dieselbe Körperzahl wie mob-ai.js: die GEMESSENE Körperhöhe des Blattes, nicht die Bildhöhe.
   `unit-loader.js` legt sie beim Laden an (probeBox × scale), `sizeMul` ist die Zonen-Skalierung. */
const bodyOf=u=>(u&&u.unit&&u.unit.bodyH?u.unit.bodyH*(u.sizeMul||1):64);
function reach(a,b){
  const ba=bodyOf(a),bb=bodyOf(b);
  return Math.max(FLOOR,Math.min(CAP_REL*Math.max(ba,bb),K*(ba+bb)/2));
}
const stop=(a,b)=>reach(a,b)-BACK;
const hit =(a,b)=>reach(a,b)+FRONT;

/* Beweis-Zeile für C6: was gilt gegen wen — eine Zeile je Gegnerart, die im Bild steht.
   Aufruf in der Konsole: OW_REACH.report()
   Die Identität hängt an `m.unit` (dem Objekt aus unit-loader.js, Feld `name`/`id`). Die erste
   Fassung las `m.def`/`m.kind` — **die es am Mob nicht gibt**: der Schlüssel war für jeden Mob
   `undefined`, der erste besetzte ihn, alle anderen galten als Doppel, und 37 Mobs kamen als EINE
   Zeile heraus. Fehlerklasse wie am 8.8. beim Boden: ein leerer Ersatzwert, der wie ein Ergebnis
   aussieht. Deshalb steht die Feldzahl jetzt im Bericht — eine Zeile für alles ist sichtbar falsch. */
function report(g){
  g=g||document.querySelector('overworld-game');
  const h=g&&g.hero;
  if(!h)return 'kein Held gefunden — OW_REACH.report(document.querySelector("overworld-game"))';
  const mobs=(g.mobs||[]).filter(m=>m.hp>0);
  const seen=new Map();
  for(const m of mobs){
    const key=(m.unit&&(m.unit.name||m.unit.id))||'ohne Blatt';
    if(!seen.has(key))seen.set(key,m);
  }
  const zeilen=[...seen.entries()].map(([Gegner,m])=>({Gegner,
    Körper:Math.round(bodyOf(m)),
    stoppt:+stop(h,m).toFixed(1),trifft:+hit(h,m).toFixed(1),Band:BACK+FRONT}))
    .sort((a,b)=>a.Körper-b.Körper);
  const T=window.OW_FEEL?window.OW_FEEL.T:{knockMob:170,knockDecay:9.5};
  return {held:(h.unit&&(h.unit.name||h.unit.id))||'?',heldKörper:Math.round(bodyOf(h)),
    rückstoßWeg:Math.round(T.knockMob/T.knockDecay),band:BACK+FRONT,
    mobsImBild:mobs.length,arten:zeilen.length,zeilen};
}
window.OW_REACH={version:'reach-v1.1',reach,stop,hit,bodyOf,report,
  FLOOR,CAP_REL,K,BACK,FRONT,band:BACK+FRONT,
  note:'Eine Rechnung aus beiden Körpermaßen. stop = reach−8, hit = reach+22, Deckel 0,75 × größerer '+
       'Körper. Das Band ist breiter als der Rückstoßweg, damit der zweite Schlag ohne Nachlaufen trifft.'};
})();
