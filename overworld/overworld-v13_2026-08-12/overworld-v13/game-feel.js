/* KFB Overworld — Game Feel (gf-v1.0, V5-S12)
   **Bewegung und Kampf sind Kurven, keine Schalter.** Georgs Befund: »Animation und Kampf wirken
   noch sehr bulky und roh«. Der Grund war nicht die Animation, sondern dass es dazwischen nichts
   gab: der Held wurde mit **fester** Geschwindigkeit geschoben (`moveEntity(h,dx,dy,250,dt)`), und
   ein Treffer war ein Zustand mit einer Uhr. Kein Antritt, kein Auslauf, kein Treffer-Stopp, kein
   Rückstoß — also nichts, woran das Auge Wucht ablesen könnte.

   Was hier drinsteht, ist Cartoon-Physik: **Anfahren dauert, Stoppen nicht.** Ein Zeichentrickläufer
   nimmt Fahrt auf und steht dann auf einen Schlag. Deshalb ist der Antritt weicher als die Bremse.

   Vier Kurven, alle in einer Tabelle statt über den Runner verstreut:
   - **Antritt / Auslauf** — Trägheit als Geschwindigkeitsvektor, nicht als Positionssprung.
   - **Fahrt aufnehmen** (Georg): wer ungestört läuft, wird über Sekunden schneller. Wer angreift,
     getroffen wird oder anhält, verliert die Fahrt sofort.
   - **Kampfbremse** (Georg): im Kampf und betäubt läuft man langsamer — Flucht ist eine
     Entscheidung, kein Ausweg.
   - **Bloodlust** (Georg, WoW-Logik, KISS): jeder Kill gibt kurz Tempo. Stapelt bis zu einem
     Deckel, verfällt von selbst.

   Und die Wucht: **Treffer-Stopp** (60–140 ms, gestaffelt nach Streak und Kill) plus **Rückstoß als
   abklingende Geschwindigkeit** statt als Sofort-Versatz. Ein Versatz sieht wie ein Fehler aus, eine
   Bewegung wie ein Schlag.

   Was dieses Modul NICHT tut: zeichnen, verformen, Ton spielen, Schaden rechnen. Die Verformung
   gehört §17 (`cartoon-motion-2d.js`), der Schaden dem Runner. */
(function(){
'use strict';

const T={
  base:250,          // px/s — die Zahl, die vorher hart im Runner stand
  accel:1400,        // px/s² Antritt: 0 → base in 0,18 s
  brake:2600,        // px/s² Auslauf: base → 0 in 0,10 s (Stoppen ist knackiger als Anfahren)
  // Fahrt aufnehmen: erst nach `flowDelay` ungestörtem Lauf, dann linear bis `flowMax`
  flowDelay:1.1, flowRamp:2.6, flowMax:1.45,
  fightSlow:0.62,    // im Kampf
  stunSlow:0.42,     // betäubt (Treffer-Stopp aktiv)
  fightRange:260,    // ab wann »im Kampf«
  lustGain:0.09, lustMax:0.34, lustDecay:0.42,   // je Kill, Deckel, Abbau je Sekunde
  hitStop:0.07, hitStopStreak:0.11, hitStopKill:0.14,
  /* v11-R1: **170 statt 230.** Der Rückstoß trägt 170/9,5 ≈ 18 px. Das Trefferband aus
     `reach.js` ist 30 px breit (−8 … +22) — also bleibt der Gegner nach einem Treffer INNERHALB
     der Reichweite und der zweite Schlag trifft ohne Nachlaufen. Bei 230 waren es 24 px gegen ein
     Band von 8, und der Held lief nach jedem Hieb hinterher. Der Held selbst wird weiter mit 150
     gestoßen: er soll den Treffer spüren, er schlägt nicht sofort zurück. */
  knockMob:170, knockHero:150, knockDecay:9.5,   // px/s Anstoß, Abbau je Sekunde
  /* v11-R2 · Nachlauf. `recover` als Anteil der Clipdauer, `buffer` als Gedächtnis der Taste.
     Der Nachlauf sperrt den SCHLAG, nicht die Bewegung — sonst klebt der Held nach jedem Hieb am
     Boden, und das liest sich als Hänger, nicht als Gewicht. Ein Druck im Nachlauf wird gemerkt und
     beim Ablaufen ausgeführt; älter als 0,15 s zählt er nicht mehr, sonst schlägt der Held noch,
     wenn die Taste längst los ist. */
  recover:0.35, buffer:0.15,
  /* v11-U1 · **Der Körper gibt das Tempo** (Georg 11.8., »die 30 Einheiten«). Bis hierher lief
     jede Einheit mit denselben 250 px/s: das Schaf (Körper 31 px) genauso schnell wie der Troll
     (177 px) — die Wahl im Wahlblatt war ein Kostüm, kein Entschluss.

     Die Kurve ist eine WURZEL, keine Gerade: (Körper/91)^0,3, gedeckelt auf 0,82 … 1,22, also
     205 … 305 px/s. Linear gerechnet läge das Schaf bei 85 px/s (zäh bis unspielbar) und der Troll
     bei 486 (nicht mehr lenkbar, und die Kollisionsschritte in `moveEntity` sind für 250 gebaut).
     Mit der Wurzel liegen alle 30 in einem Band, in dem man den Unterschied SPÜRT, ohne dass eine
     Einheit unbrauchbar wird. Gerechnet (Körper → Faktor → px/s):
       Schaf 31 → 0,82 → 205 (Deckel) · Schwein 66 → 0,91 → 227 · Gnom 71 → 0,93 → 232
       Warrior 91 → 1,00 → 250 · Panda 102 → 1,03 → 258 · Minotaur 159 → 1,18 → 296
       Troll 177 → 1,22 → 305 (Deckel)
     Die Bezugszahl ist HERO_REF (91) — dieselbe, an der Reichweite und Bestiarium hängen. */
  bodyRef:91, bodyPow:0.3, bodyMin:0.82, bodyMax:1.22,
};

/* ── v11-H7 · Die Farbe sagt den Stand (Georg 11.8.) ──────────────────────────────────────────────
   Klassische Rollenspiel-Logik: voll ist grün, dann gelb, orange, und knapp vor dem Umfallen rot.
   Vorher trug der Balken im HUD einen Verlauf ÜBER SEINE BREITE (rot links, grün rechts) — das ist
   eine Skala, keine Auskunft: bei 140 von 140 war der sichtbare Teil grün UND rot, und bei 20 von
   140 sah man nur das rote Stück, also stand die Farbe für die Position im Balken statt für den
   Zustand des Helden.

   Interpoliert statt gestuft. Vier Stufen mit harten Kanten würden bei jedem Treffer umschlagen,
   und ein Umschlag liest sich als Ereignis — es soll aber ein Verlauf sein, den man kommen sieht.
   Die vier Stützpunkte sind Kanon-nahe Töne aus dem HUD, keine reinen Ampelfarben:

     0,00  #a8231a   dunkles Rot      · gleich vorbei
     0,16  #c33320   Rot
     0,33  #dd6b22   Orange
     0,62  #dcc247   Gelb
     1,00  #5fbf7a   Grün             · unversehrt

   **Nachgeschärft am 11.8. (Georg): das letzte Drittel ist ROT.** Die erste Treppe hatte ihren
   Orange-Punkt bei 0,25 und ihren Gelb-Punkt bei 0,55 — dazwischen lag der ganze bedrohliche
   Bereich, und bei einem Drittel Leben sah der Balken bernsteinfarben aus, also wie »geht schon«.
   Mit einem zweiten Rotpunkt bei 0,16 und Orange erst bei 0,33 gilt: unter einem Drittel ist es
   rot, und zwischen den Stufen bleibt genug Abstand, dass man sie auseinanderhält.

   EIN Ort für beide Leser: das Blatt im HUD (card-rail-v9b.js) und die Leisten über den Köpfen
   (overworld-game-v10.js). Zwei Farbtabellen für dieselbe Aussage wären zwei Wahrheiten. */
const FLUFF_STOPS=[[0,0xa8,0x23,0x1a],[0.16,0xc3,0x33,0x20],[0.33,0xdd,0x6b,0x22],
  [0.62,0xdc,0xc2,0x47],[1,0x5f,0xbf,0x7a]];
/* `ink` mischt die Farbe zur Tusche hin (0 = pur, 1 = ganz Tusche). Gebraucht wird das für SCHRIFT:
   ein reines Balkengrün auf Creme ist als Fläche richtig und als Ziffer zu schwach — dieselbe Farbe,
   ein Drittel tiefer, liest sich und bleibt erkennbar dieselbe Auskunft. */
function fluffColor(t,ink){
  t=Math.max(0,Math.min(1,t||0));
  const mix=Math.max(0,Math.min(1,ink||0));
  const zu=(c)=>{
    if(!mix)return c;
    const m=/rgb\((\d+),(\d+),(\d+)\)/.exec(c);if(!m)return c;
    const I=[0x1f,0x1a,0x14];
    return 'rgb('+[1,2,3].map(i=>Math.round(+m[i]*(1-mix)+I[i-1]*mix)).join(',')+')';
  };
  for(let i=1;i<FLUFF_STOPS.length;i++){
    const a=FLUFF_STOPS[i-1],b=FLUFF_STOPS[i];
    if(t<=b[0]||i===FLUFF_STOPS.length-1){
      const k=(t-a[0])/Math.max(1e-6,b[0]-a[0]),u=Math.max(0,Math.min(1,k));
      return zu('rgb('+Math.round(a[1]+(b[1]-a[1])*u)+','+Math.round(a[2]+(b[2]-a[2])*u)+','
        +Math.round(a[3]+(b[3]-a[3])*u)+')');
    }
  }
  return zu('rgb(95,191,122)');
}
/* Die Geschwindigkeit ist ein Produkt aus vier Faktoren — jeder für sich lesbar, jeder messbar. */
function factors(g,h){
  const stunned=(g.freeze||0)>0.001;
  let fight=1;
  if(!stunned){
    for(const m of g.mobs){
      if(m.hp<=0||m.critter)continue;
      if(m.aggro&&Math.hypot(m.x-h.x,m.y-h.y)<T.fightRange){fight=T.fightSlow;break;}
    }
  }
  const flowT=Math.max(0,(h._flow||0)-T.flowDelay);
  const flow=1+Math.min(1,flowT/T.flowRamp)*(T.flowMax-1);
  const lust=1+(h._lust||0);
  return{stun:stunned?T.stunSlow:1,fight,flow,lust,body:bodyFactor(h)};
}

/* Der fünfte Faktor: die gemessene Körperhöhe der gespielten Einheit (Weltpixel, aus dem Loader).
   Ohne geladene Einheit ist er 1 — der Faktor darf nie der Grund sein, dass sich nichts bewegt. */
function bodyFactor(h){
  const b=h&&h.unit&&h.unit.bodyH;
  if(!(b>0))return 1;
  return Math.max(T.bodyMin,Math.min(T.bodyMax,Math.pow(b/T.bodyRef,T.bodyPow)));
}

function targetSpeed(g,h){
  const f=factors(g,h);
  return T.base*f.stun*f.fight*f.flow*f.lust*f.body;
}

/* Ein Frame Bewegung. Rückgabe: die tatsächlich gelaufene Strecke in px (für Schritte und Prellen). */
function drive(g,h,dx,dy,dt){
  const want=Math.hypot(dx,dy)>0;
  // Fahrt: wächst beim Laufen, fällt sofort bei Stillstand, Angriff oder Treffer
  if(want&&h.state!=='attack'&&(g.freeze||0)<=0.001)h._flow=(h._flow||0)+dt;
  else h._flow=0;
  // Bloodlust verfällt von selbst
  if(h._lust)h._lust=Math.max(0,h._lust-T.lustDecay*dt);

  const tgt=want?targetSpeed(g,h):0;
  const cur=h._sp||0;
  const rate=(tgt>cur?T.accel:T.brake)*dt;
  h._sp=cur+Math.max(-rate,Math.min(rate,tgt-cur));

  const px=h.x,py=h.y;
  if(h._sp>0.5&&want)g.moveEntity(h,dx,dy,h._sp,dt);
  return Math.hypot(h.x-px,h.y-py);
}

/* **Ein Durchgang für alle.** Der Rückstoß lag zuerst in `drive()` — und `drive()` gilt nur für den
   Helden. Die auf Mobs gespeicherte Geschwindigkeit wurde also nie integriert: gemessen blieb `_kx`
   nach 600 ms exakt bei 230, der Gegner stand still. Ein Slice, dessen Zweck Trefferwucht ist, hatte
   damit **null** Pushback am Ziel — schlechter als vorher, wo eine Zeile ihn wenigstens versetzte.
   Die Kurve liegt jetzt wirklich an einer Stelle, wie der Modulkopf es verspricht. */
function tick(g,dt){
  if(g.hero)applyKnock(g,g.hero,dt);
  for(const m of g.mobs)if(m.hp>0)applyKnock(g,m,dt);
}

/* Rückstoß als Geschwindigkeit: ein Sofort-Versatz sieht wie ein Fehler aus, eine Bewegung wie ein
   Schlag. Kollision gilt weiter — geschoben wird über denselben Weg wie gelaufen. */
function knock(u,dirx,diry,force){
  const l=Math.hypot(dirx,diry)||1;
  u._kx=(u._kx||0)+dirx/l*force;
  u._ky=(u._ky||0)+diry/l*force;
}
function applyKnock(g,u,dt){
  const kx=u._kx||0,ky=u._ky||0;
  if(Math.abs(kx)<1&&Math.abs(ky)<1){u._kx=0;u._ky=0;return;}
  g.moveEntity(u,kx,ky,Math.hypot(kx,ky),dt);
  const d=Math.exp(-T.knockDecay*dt);
  u._kx=kx*d;u._ky=ky*d;
}

/* Treffer-Stopp: der kurze Halt, an dem das Auge den Schlag liest. Gestaffelt, damit der zehnte
   Treffer sich anders anfühlt als der erste. */
function hitStop(g,kind){
  const s=kind==='kill'?T.hitStopKill:(kind==='streak'?T.hitStopStreak:T.hitStop);
  g.freeze=Math.max(g.freeze||0,s);
  return s;
}

function onKill(g){
  const h=g.hero;
  h._lust=Math.min(T.lustMax,(h._lust||0)+T.lustGain);
  h._flow=0;   // ein Kill unterbricht die Fahrt — man hat gerade gestanden und geschlagen
  return h._lust;
}

/* **Die Fahrt bricht am Ereignis, nicht im Bewegungsframe.** Sie stand zuerst nur in `drive()` — und
   `drive()` läuft nicht, solange der Held angreift. Gemessen: `_flow` blieb über den ganzen Angriff
   auf voll, das Zieltempo im Kampf lag bei **225 px/s statt 155** — 45 % zu schnell, und damit genau
   gegen den Auftrag »verringerte Fluchtgeschwindigkeit im Kampf«. Wer sich auf einen Frame verlässt,
   der in diesem Zustand nicht läuft, dokumentiert eine Regel, die es nicht gibt. */
function breakFlow(g){
  const h=g&&g.hero?g.hero:g;
  if(h)h._flow=0;
}

/* Für das Abnahme-Blatt und die Messung: was gilt gerade? */
function probe(g){
  const h=g.hero;
  const f=factors(g,h);
  return{sp:Math.round(h._sp||0),target:Math.round(targetSpeed(g,h)),
    flow:+f.flow.toFixed(2),fight:+f.fight.toFixed(2),stun:+f.stun.toFixed(2),body:+f.body.toFixed(2),
    lust:+((h._lust||0)*100).toFixed(0)+'%',knock:Math.round(Math.hypot(h._kx||0,h._ky||0))};
}

window.OW_FEEL={fluffColor,version:'gf-v1.3',T,drive,tick,knock,applyKnock,hitStop,onKill,breakFlow,probe,targetSpeed,bodyFactor,
  note:'Anfahren dauert, Stoppen nicht. Fahrt · Kampfbremse · Bloodlust · Treffer-Stopp · Rückstoß für alle.'};
})();
