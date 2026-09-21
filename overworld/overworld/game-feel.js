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
  knockMob:230, knockHero:150, knockDecay:9.5,   // px/s Anstoß, Abbau je Sekunde
};

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
  return{stun:stunned?T.stunSlow:1,fight,flow,lust};
}

function targetSpeed(g,h){
  const f=factors(g,h);
  return T.base*f.stun*f.fight*f.flow*f.lust;
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
    flow:+f.flow.toFixed(2),fight:+f.fight.toFixed(2),stun:+f.stun.toFixed(2),
    lust:+((h._lust||0)*100).toFixed(0)+'%',knock:Math.round(Math.hypot(h._kx||0,h._ky||0))};
}

window.OW_FEEL={version:'gf-v1.2',T,drive,tick,knock,applyKnock,hitStop,onKill,breakFlow,probe,targetSpeed,
  note:'Anfahren dauert, Stoppen nicht. Fahrt · Kampfbremse · Bloodlust · Treffer-Stopp · Rückstoß für alle.'};
})();
