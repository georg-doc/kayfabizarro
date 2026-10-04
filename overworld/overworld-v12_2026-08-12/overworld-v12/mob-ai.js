/* KFB Overworld — Mob-Eigenleben (V4-S1).
   Ein Gehirn je Mob statt einer Kette von if-Zweigen im Runner:
     · Zustände mit Mindestverweildauer (kein Umschalten je Frame)
     · Lenkung statt Teleport — Wunsch → Kraft → Geschwindigkeit → Ort
     · Boid-Anteile: Trennung, leichte Ausrichtung im Kampf, Hindernis-Whisker
     · Wahrnehmung mit Anlauf (`notice`) — wer langsam und hinter dem Rücken bleibt,
       kommt vorbei; das ist das Schleichen, ohne eigenes System dafür
     · Revier: die Karte, auf der der Mob spawnt (Torwächter: Kreis um den Brückenkopf)
     · Sprechblasen mit Ablage — Blasen weichen nach oben aus, nie hinter einen anderen Mob
   Der Runner behält Kampfwerte, Schaden und Beute. Dieses Modul bewegt und entscheidet.
   Messen statt behaupten: window.__owAi.report() / .reset().  */
(function(){
'use strict';
const TILE=64;

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

// Tempi (px/s). Alles unter dem Helden (250) — er soll wegkommen können.
const SPD={roam:44,visit:54,mingle:62,chase:126,flee:158,retreat:104};

/* ── V4-S6 · Temperamente (Masterplan §11, Option B) ─────────────────────────
   Acht Zahlen je Klasse und 0–2 benannte Aktionen. Die Zustandsmaschine bleibt dieselbe;
   ein Temperament setzt nur andere Gewichte und Radien ein. So sind neun Gegner
   unterscheidbar, ohne dass einer von ihnen eigenen Code bekommt.
     pace      Tempo relativ zur Vorgabe (Kiter < 1: er muss einholbar bleiben)
     nerve     wie schnell `notice` füllt
     leash     Revier in Tiles
     standoff  Wunschabstand zum Helden in Körperhöhen (0,6 klebt · 2,2 hält Abstand)
     courage   ab welchem Fluff-Anteil er flieht (0 = nie)
     curiosity Fundstücke gegen Held (Zombie hoch: läuft zur Blume)
     social    Nachbarn suchen — und, mit `call`, Verstärkung holen
     patrol    Wegpunkte statt Würfelziel */
const TEMPER={
  brute:     {pace:0.86,nerve:1.0,leash:6.5,standoff:0.62,courage:0,   curiosity:0.2,social:0.2,patrol:0,acts:['charge']},
  skirmisher:{pace:1.16,nerve:1.3,leash:8,  standoff:0.66,courage:0.22,curiosity:0.4,social:0.5,patrol:0,acts:['hop']},
  kiter:     {pace:0.82,nerve:1.1,leash:8,  standoff:2.2, courage:0.35,curiosity:0.5,social:0.4,patrol:0,acts:[]},
  zombie:    {pace:0.72,nerve:0.5,leash:10, standoff:0.6, courage:0,   curiosity:0.9,social:0.1,patrol:0,acts:[]},
  sentinel:  {pace:0.96,nerve:1.5,leash:2.8,standoff:0.66,courage:0,   curiosity:0.15,social:0.8,patrol:1,acts:['call']},
  elite:     {pace:0.92,nerve:1.25,leash:7, standoff:0.64,courage:0,   curiosity:0.25,social:0.6,patrol:1,acts:['charge','call']},
  critter:   {pace:0.9, nerve:0.6,leash:5,  standoff:0.95,courage:1,   curiosity:0.8,social:0.9,patrol:0,acts:[]},
};
const DEFAULT_TEMPER='skirmisher';
// Aktionen: drei Zahlen je Stück. Reichweite · Vorlauf · Abkühlung — daraus entsteht der Rhythmus.
const ACTS={
  charge:{range:[130,300],windup:0.55,cool:5.2,speed:330,dur:0.5,say:'!'},
  call:  {range:[0,520],  windup:0.35,cool:14, radius:430,say:'Reinforcements!'},
  hop:   {range:[0,0],    windup:0,   cool:2.6,back:0.42},   // Schlag und Rückschritt
};
function temperOf(m){
  if(m.critter)return TEMPER.critter;
  /* v10-S11: **Wegelagerer verteidigen ihren Fleck.** Sie bekommen das Wächter-Temperament
     (Leine 2,8 Felder) statt des Zonen-Temperaments — sonst folgt ein Trainingsgegner dem Neuling
     über die halbe Insel, und die Lektion »hier kann ich üben« wird zur Verfolgungsjagd. */
  if(m.roadside)return TEMPER.sentinel;
  const map=(window.OW_UNITS&&window.OW_UNITS.tempers)||{};
  const byId=m.unit&&map[m.unit.id];
  if(m.elite)return TEMPER.elite;
  if(m.guard)return TEMPER.sentinel;
  return TEMPER[byId]||TEMPER[DEFAULT_TEMPER];
}
// Lulls (§11): höchstens zwei handeln gleichzeitig, und nach einem Kill hält die Zone kurz die Luft an
function actSlotFree(g,m){
  if(g.time-(g._lastKill||-9)<1.2)return false;
  let n=0;
  for(const o of g.mobs)
    if(o!==m&&o.hp>0&&o.zone===m.zone&&(o.state==='attack'||(o.ai&&o.ai.st==='charge')))n++;
  return n<2;
}
const ACC=360;              // px/s² — ein Richtungswechsel braucht Zeit, sonst zappelt es
const SEP_IDLE=58;          // Trennung im Alltag: zwei Körper, zwei Plätze
// Kampfabstände sind KEINE Festwerte mehr (V4-S1b): Ring, Trennung und Schlagweite rechnen
// sich aus Körpermaß und Angreiferzahl — sonst stapelt sich ein Bär wie eine Ratte.
const bodyOf=u=>(u&&u.unit?u.unit.bodyH*(u.sizeMul||1):64);
const sepFight=(a,b)=>Math.max(44,Math.min(104,0.58*(bodyOf(a)+bodyOf(b))/2));
function ringOf(g,m){
  const a=m.ai,n=Math.max(2,a.ringN||2);
  const sep=sepFight(m,m);                       // Nachbar auf dem Ring ist im Schnitt so groß wie ich
  const byBody=0.72*(bodyOf(m)+bodyOf(g.hero))/2;
  const bySpace=sep/(2*Math.sin(Math.PI/n));     // n Körper auf einem Kreis: der Radius folgt daraus
  return Math.max(52,byBody,bySpace);
}
const SEP_FIGHT=40;         // Untergrenze im Kampf (der echte Wert kommt aus sepFight)
const FACE_HOLD=0.20;       // s Haltezeit der Spiegelung (Anti-Flacker)
/* v10-S23 · **Eine Schwelle ist kein Schalter.** `sp>20` mit 0,18 s Haltezeit war ein einziger
   Punkt: ein streifendes Wesen pendelt genau darum herum (Trennungsschub, Whisker-Ausweichen,
   Verweilen am Ziel), also sprang der Zustand rund dreimal je Sekunde idle⇄run — zwei
   verschiedene Blätter im Wechsel, jedes Mal mit `anim=0` zurück auf Bild 0. Das ist Georgs
   zitterndes Schaf. Jetzt zwei Schwellen mit Abstand (Schmitt-Trigger) und eine längere
   Haltezeit: hinein ab 34 px/s, heraus erst unter 16. */
const RUN_IN=34, RUN_OUT=16;   // px/s — Einstieg und Ausstieg, GEMESSENES Tempo
const RUN_HOLD=0.34;        // s Haltezeit idle⇄run
const BUBBLE_COOL=9;        // s je Mob zwischen zwei Blasen

const probe={t0:0,dt:0,frames:0,faceFlips:0,stateFlips:0,attacks:0,notices:0,
  stillRun:0,runFrames:0,moveSum:0,minPair:1e9,minOverlap:1e9,minHeroGap:1e9,
  noticeMax:0,bubbleShift:0,bubbles:0,calls:0,charges:0,chargeDist:0,
  visits:{},visitFrames:{}};

function resetProbe(g){
  probe.t0=g?g.time:0;probe.dt=0;probe.frames=0;probe.faceFlips=0;probe.stateFlips=0;
  probe.attacks=0;probe.notices=0;probe.stillRun=0;probe.runFrames=0;probe.moveSum=0;
  probe.minPair=1e9;probe.minOverlap=1e9;probe.minHeroGap=1e9;
  probe.noticeMax=0;probe.bubbleShift=0;probe.bubbles=0;probe.calls=0;probe.charges=0;
  probe.chargeDist=0;probe.visits={};probe.visitFrames={};
}

/* ── Gehirn anlegen (träge, beim ersten Schritt) ───────────────────────────── */
function initBrain(g,m,i){
  const z=m.zone||{x:0,y:0,w:10,h:8,zseed:1};
  const rng=mulberry32(((z.zseed|0)^Math.imul(i+1,2654435761))>>>0);
  const terr=m.guard
    ? {kind:'circle',x:m.hx,y:m.hy,r:3.2*TILE}
    : {kind:'rect',x0:(z.x+0.8)*TILE,y0:(z.y+0.9)*TILE,x1:(z.x+z.w-0.8)*TILE,y1:(z.y+z.h-0.6)*TILE};
  const tp=temperOf(m);
  m.ai={rng,terr,tp,st:'pause',t:0,dwell:0.3+rng()*1.4,vx:0,vy:0,dx:0,dy:0,
    tgt:null,poi:null,mate:null,notice:0,leash:tp.leash*TILE,
    acted:0,called:0,route:null,routeI:0,
    faceHold:0,faceWant:m.face||1,dirHold:0,runHold:0,
    lookT:0.8+rng()*1.6,stall:0,bubble:null,bubbleCool:rng()*4,slot:m.slot||0,
    px:m.x,py:m.y,moved:0};
  return m.ai;
}
function set(m,st,dwell){
  const a=m.ai;
  if(a.st===st){if(dwell)a.dwell=dwell;return;}
  a.st=st;a.t=0;a.dwell=dwell||0;probe.stateFlips++;
  probe.visits[st]=(probe.visits[st]||0)+1;   // Eintritte: gegen Frames gerechnet ergibt das die Dauer
}
/* Zustände, in denen ein Mob im Gefecht ist. Aktionen (charge, back, später lob) gehören dazu —
   sonst löscht der Verlobungsblock die Aktion im nächsten Frame wieder (V4-S6b). */
const ENGAGED={alert:1,chase:1,charge:1,back:1};
const fighting=m=>m.ai&&(!!ENGAGED[m.ai.st]||m.state==='attack');

/* ── Reviergrenzen ────────────────────────────────────────────────────────── */
function terrPoint(g,a,rng){
  for(let k=0;k<10;k++){
    let p;
    if(a.terr.kind==='circle'){
      const ang=rng()*6.2832,r=a.terr.r*(0.3+0.7*rng());
      p={x:a.terr.x+Math.cos(ang)*r,y:a.terr.y+Math.sin(ang)*r};
    }else p={x:a.terr.x0+rng()*(a.terr.x1-a.terr.x0),y:a.terr.y0+rng()*(a.terr.y1-a.terr.y0)};
    if(g.passable(p.x,p.y))return p;
  }
  return null;
}
function pickPoi(g,m){
  const a=m.ai,rng=a.rng,near=[];
  for(const d of (g.decos||[])){
    if(Math.abs(d.x-m.hx)>6*TILE||Math.abs(d.y-m.hy)>6*TILE)continue;
    near.push(d);
    if(near.length>=16)break;
  }
  for(const c of (g.corpses||[]))
    if(Math.abs(c.x-m.hx)<6*TILE&&Math.abs(c.y-m.hy)<6*TILE)near.push(c);
  if(!near.length)return null;
  const d=near[Math.floor(rng()*near.length)];
  const ang=rng()*6.2832;
  const p={x:d.x+Math.cos(ang)*42,y:d.y+24+Math.sin(ang)*20};
  return g.passable(p.x,p.y)?p:null;
}
function pickMate(g,m){
  let best=null,bd=1e9;
  for(const o of g.mobs){
    if(o===m||o.hp<=0||!o.ai||o.zone!==m.zone)continue;
    if(fighting(o)||o.ai.st==='chat')continue;
    const d=Math.hypot(o.x-m.x,o.y-m.y);
    if(d<bd&&d<7*TILE){bd=d;best=o;}
  }
  return best;
}

/* ── Sprechblasen ─────────────────────────────────────────────────────────── */
/* `g0` ist das Spiel des laufenden Takts. `speak(m,…)` bekommt es nicht übergeben (die Signatur
   gehört einem halben Dutzend Aufrufern), also merkt es sich `step` — eine Zeile, statt sechs
   Aufrufstellen umzuschreiben. */
let g0=null;
function speak(m,text,life,frei){
  /* `text` darf ein String oder `{text,potty}` sein — die Fluchschrift wird an der Quelle
     entschieden (chatter-2d.js weiß, ob sie liegt), nicht am Zeichner geraten. */
  let potty=false;
  if(text&&typeof text==='object'){potty=!!text.potty;text=text.text;}
  if(!m.ai||!text||m.critter)return false;   // Kreaturen zitieren keine Karten
  /* `frei` (v10-S3b) ist für Antwort und Fluch: beide gehören zum Satz davor bzw. zum Schlag,
     nicht zum nächsten Takt. Sie umgehen Abkühlung und Dubletten-Sperre — »Hm.« darf zweimal
     in einer Zone fallen, ein Kartentitel nicht. */
  if(!frei&&m.ai.bubbleCool>0)return false;
  const t=String(text).replace(/\s+/g,' ').trim();
  /* Erst wissen, WAS es wird, dann fragen, ob es darf: die Verdrängungsregel braucht den Typ. */
  const art0=(m.unit&&m.unit.id)||'';
  const tier0=m.critter||(m.unit&&m.unit.critter)||/sheep|pig|chicken|cow|horse|rabbit/.test(art0);
  const typ0=((tier0||(!m.aggro&&(m.ai.st==='pause'||m.ai.st==='idle')))&&!potty)?'thought':'speech';
  /* Über der Eskalationsgrenze bleibt ein Fluch trotzdem sichtbar — aber **ohne Blase**: nur der
     Glyph, überlappend, wie im Comic. Alles andere schweigt. */
  /* Eskalation ist: ein Fluch (Kampf) oder ein Schmähruf (Ruf). Der Aufrufer markiert Letzteren. */
  const eskalation=potty||!!m._schmaeht;
  const nackt=potty&&frei&&weltVoices(g0)>=BUDGET_ESKALATION;
  if(!nackt&&!darfSprechen(g0,m,typ0,frei,eskalation))return false;
  /* **Zwei Wächter, ein Satz** (Georg 9.8.: zwei identische Blasen »The Assumption Stack«
     übereinander). Der Zonendeckel erlaubt zwei Stimmen — aber er prüfte nur die Zahl, nicht den
     Inhalt, und `cardLine` gibt beiden denselben Titel. Ein Chor ist keine Unterhaltung. Die Zone
     merkt sich den letzten Satz; wer ihn wiederholen will, schweigt. */
  if(!frei&&m.zone&&m.zone._said===t)return false;
  if(!frei&&m.zone)m.zone._said=t;
  /* v10-S18 · **Denken statt sprechen** (ChatterBox S1 §8). Wer niemanden anspricht, denkt: Tiere,
     Schlafende, und wer stumpf bei der Arbeit ist. Der Typ hängt am Wesen, nicht am Satz — deshalb
     wird er hier bestimmt und nicht vom Aufrufer mitgegeben. */
  /* Erster Anlauf prüfte nur `critter` und den Zustand `pause` — das Schwein ist beides nicht
     (es trägt `critter:false` und stand auf `chat`) und sprach deshalb wie ein Söldner.
     Jetzt entscheidet die **Art**, mit derselben Liste wie `chatter-2d.js`: ein Tier denkt immer,
     alle anderen denken, wenn sie niemanden ansprechen. */
  const art=(m.unit&&m.unit.id)||'';
  const tier=m.critter||(m.unit&&m.unit.critter)||/sheep|pig|chicken|cow|horse|rabbit/.test(art);
  const denkt=typ0==='thought';
  m.ai.bubble={text:t.length>44?t.slice(0,43)+'…':t,potty,typ:denkt?'thought':'speech',
    eskal:eskalation,nackt,t:0,life:nackt?0.9:(life||3.2),w:0,dx:0,dy:0};
  m.ai.bubbleCool=BUBBLE_COOL;probe.bubbles++;
  return true;
}
/* v10-S19 · **Blasen sind Pull-Angebote, keine Beschriftung** (Georg 9.8.).
   Bisher stand der Deckel an fünf Stellen verstreut (`zoneVoices(...)<2` bzw. `<3`) — also fünf
   Zahlen für eine Regel. Jetzt eine Stelle, und die Regel ist schärfer:

     · **höchstens zwei Blasen in der ganzen Welt** — der Spieler soll hinsehen, nicht filtern
     · **höchstens eine je Zone** — eine Zone spricht mit einer Stimme
     · **Sprechen schlägt Denken**: ist das Budget voll und will jemand SPRECHEN, verdrängt er eine
       Denkblase. Umgekehrt nie — ein Gedanke unterbricht kein Gespräch.
     · **`frei` umgeht alles.** Das ist die Ausnahme, die Georg will: Antwort, Fluch, Schmährufe,
       der eskalierende Streit. Wer im Kampf beschimpft wird, wartet nicht auf ein Kontingent.

   *Zwei Blasen sind ein Angebot, sechs sind eine Wand.* */
/* v10-S19b · Der Ausnahmepfad war **unbegrenzt**, nicht erhöht: `if(frei)return true`. Und `frei`
   steht nicht an Sonderstellen, sondern bei `reply` und `curse` — den zwei häufigsten Ereignissen
   im Kampf. Bei sechs Mobs in einer Zone war der Deckel damit faktisch aufgehoben: gemessen **4**
   gleichzeitige Blasen, in 38 von 50 Kampfproben über dem Budget. Georgs Regel war »Ausnahme
   möglich«, nicht »Ausnahme ist der Normalzustand jedes Kampfes«.
   Zwei Zahlen statt keiner — und darüber die Form, die Georg ohnehin beschrieben hat: **wilde,
   sich überlappende Glyphs**, keine vier vollen Sprechblasen. Ein Fluch jenseits der Eskalation
   verliert seinen Blasenkörper und bleibt als nackter Pottymouth-Glyph stehen. */
const BUDGET_WELT=2, BUDGET_ZONE=1, BUDGET_ESKALATION=4;
function zoneVoices(g,z){if(!g||!g.mobs)return 0;let n=0;for(const o of g.mobs)if(o.zone===z&&o.ai&&o.ai.bubble)n++;return n;}
function weltVoices(g){if(!g||!g.mobs)return 0;let n=0;for(const o of g.mobs)if(o.ai&&o.ai.bubble)n++;return n;}
/* v10-S19c · **`frei` sagte zwei Dinge auf einmal, und eines davon war falsch.** Es hieß bisher
   »umgeht Abkühlung UND Budget« — und es steht an zwei sehr verschiedenen Stellen: beim **Fluch**
   (Kampf, Eskalation) und bei der **Antwort** (normale Plauderei). Dadurch stiegen auch in Ruhe bis
   zu 4 Blasen auf, 16 von 45 Proben über dem Budget: jedes Zwiegespräch in jeder Zone durfte.
   Jetzt trennt das Budget die beiden:
     · **Fluch** (`potty`) ist Eskalation → bis `BUDGET_ESKALATION`, darüber nackter Glyph
     · **Antwort** gehört zum Satz davor → sie darf den **Zonendeckel** überschreiten (ein
       Zwiegespräch ist eine Zone mit zwei Stimmen), aber nicht das **Weltbudget**
   Abkühlung und Dubletten-Sperre umgeht `frei` weiterhin für beide — das war nie das Problem. */
/* v10-S20b · **`potty` war die falsche Achse.** Der Eskalationspfad hing an `frei && potty` —
   aber `potty` heißt »Glyph statt Wort«, nicht »das ist eine Eskalation«. Der **Schmähruf** kommt
   ohne `potty` und fiel deshalb unters normale Budget — ausgerechnet in dem Augenblick, für den er
   gebaut ist: wenn ein Kampf beginnt, ist das Budget am vollsten. Gemessen blieb die Blase leer,
   obwohl die Aggro-Schwelle korrekt griff.
   Jetzt sagt der Aufrufer, was es ist: `eskalation` als eigenes Argument. *Ein Merkmal, das man als
   Stellvertreter für ein anderes benutzt, trägt genau einmal.* */
function darfSprechen(g,m,typ,frei,eskalation){
  /* v10-S19d · **Ein Modulzustand ohne Guard ist eine Zeitbombe.** `g0` wird nur in `step()`
     gesetzt; wer `speak()` von außen ruft, bevor ein Takt lief (WS0s HUD zum Beispiel), bekam
     `TypeError: g is null` statt einer Antwort. Ohne Spiel gibt es kein Budget — dann gilt die
     Blase, nicht der Absturz. *Eine Schnittstelle darf ablehnen; werfen darf sie nicht.* */
  if(!g||!g.mobs)return true;
  if(frei&&eskalation){
    if(weltVoices(g)<BUDGET_ESKALATION)return true;
    /* Auch die Eskalationsgrenze kann voll sein — und dann ist der Schmähruf trotzdem der
       wichtigste Satz im Bild: er nennt den Namen des Spielers, kurz bevor zugeschlagen wird.
       Also verdrängt er, wie Sprechen einen Gedanken verdrängt: die erste **gewöhnliche** Blase
       geht, die anderen Eskalationen bleiben. *Ein Vorrang, der nur bei freiem Platz gilt, ist
       keiner.* */
    for(const o of g.mobs)if(o!==m&&o.ai&&o.ai.bubble&&!o.ai.bubble.potty&&!o.ai.bubble.eskal){
      o.ai.bubble=null;probe.bubbleShift++;return true;
    }
    return false;
  }
  if(!frei&&zoneVoices(g,m.zone)>=BUDGET_ZONE)return false;
  if(weltVoices(g)<BUDGET_WELT)return true;
  /* Budget voll — Sprechen darf einen Gedanken verdrängen, Denken nichts. */
  if(typ!=='speech')return false;
  for(const o of g.mobs)if(o.ai&&o.ai.bubble&&o.ai.bubble.typ==='thought'&&o!==m){
    o.ai.bubble=null;probe.bubbleShift++;return true;
  }
  return false;
}
/* v10-S3b · WAS gesagt wird, steht in `chatter-2d.js` (Quelle → Ton → Laune, Living Concept §59).
   Fehlt die Datei, redet die Zone wie bisher über ihre Karte — auf »läuft« gaten, nicht auf
   »existiert«. */
function chatLine(g,m,kind,rng){
  if(g&&g.att&&g.att.chatter==='off')return null;   // Regler: die Insel schweigt
  const C=window.OW_CHATTER;
  if(C&&C.line){const s=C.line(g,m,kind,rng);if(s&&(typeof s!=='object'||s.text))return s;}
  return kind==='reply'||kind==='curse'?null:cardLine(g,m,'spin');
}
function cardLine(g,m,kind){
  const c=m.zone&&m.zone.card;if(!c)return null;
  if(kind==='show')return '»'+(c.t||'?')+'«';
  const lore=(c.l||'').split(/(?<=[.!?])\s/)[0];
  return lore?lore:(c.t?'»'+c.t+'«':null);
}

/* ── Wahrnehmung ──────────────────────────────────────────────────────────── */
function sense(g,m,dt,heroSpd){
  const a=m.ai,h=g.hero;
  const F=window.OW_FACTIONS;
  const fac=F?F.factionOf(g,m):null;
  const range=180*(F?F.nerve(g,fac):(g.repAggro?g.repAggro(m.zone&&m.zone.biome):1))*(a.tp?a.tp.nerve:1);
  const dh=Math.hypot(h.x-m.x,h.y-m.y);
  let sig=0;
  if(dh<range&&h.hp>0){
    const front=(Math.sign(h.x-m.x)===m.face)?1:0.45;   // im Blickfeld oder im Rücken
    const loud=(h.state==='attack')?1.8:0;              // wer schlägt, ist laut
    sig=(1-dh/range)*front*(0.5+heroSpd/250*1.5+loud);
  }
  a.notice=Math.max(0,Math.min(1.6,a.notice+(sig>0?sig:-0.75)*dt));
  if(m.aggro)a.notice=1.4;
  if(a.notice>probe.noticeMax)probe.noticeMax=a.notice;
  return dh;
}

/* ── Entscheiden: setzt a.dx/a.dy = Sollgeschwindigkeit ───────────────────── */
function think(g,m,dt,heroSpd){
  const a=m.ai,h=g.hero,rng=a.rng;
  a.t+=dt;a.dx=0;a.dy=0;
  if(a.bubbleCool>0)a.bubbleCool-=dt;
  if(a.replyIn>0){
    a.replyIn-=dt;
    if(a.replyIn<=0&&m.hp>0)speak(m,chatLine(g,m,'reply',rng),2.1,true);
  }
  /* **Pottymouth.** Wer getroffen wird, flucht — als Zeichenfolge, nicht als Wort (Comic-Handwerk).
     Einmal je Treffer-Serie: `cursed` fällt erst nach 1,2 s ohne Treffer zurück, sonst redet ein
     Mob im Handgemenge dreimal je Sekunde. */
  if(m.lastHit!=null&&g.time-m.lastHit<0.22&&!a.cursed){
    a.cursed=true;
    if(rng()<0.55)speak(m,chatLine(g,m,'curse',rng),1.0,true);
  }else if(m.lastHit==null||g.time-m.lastHit>1.2)a.cursed=false;
  if(a.called>0)a.called-=dt;
  if(a.chargeCool>0)a.chargeCool-=dt;
  if(a.bubble){a.bubble.t+=dt;if(a.bubble.t>a.bubble.life)a.bubble=null;}

  /* v10-S20 · **Wer tief genug unten ist, wird angegriffen** — ohne dass der Spieler etwas tut.
     Vorher hat er es dreimal gehört (die Schmähung setzt schon bei −3 ein, der Angriff erst bei −9).
     Der Übergang ist eine Ruf-Schwelle, kein eigener Zustandsautomat: die Aggro entsteht wie jede
     andere, sie hat nur einen anderen Anlass. */
  const I0=window.OW_IDENT;
  if(I0&&!m.aggro&&g.reputation&&m.zone&&a.t>2){
    const f=(window.OW_FACTIONS&&window.OW_FACTIONS.factionOf)
      ? window.OW_FACTIONS.factionOf(g,m):m.zone.biome;
    if(I0.greiftAn(g.reputation[f]||0)&&Math.hypot(h.x-m.x,h.y-m.y)<10*64){
      m.aggro=true;
      if(!m._repAggro){m._repAggro=true;
        m._schmaeht=true;speak(m,I0.schmaehung(f,-99,rng)||'You.',2.0,true);m._schmaeht=false;}
    }
  }
  if(m.frozen>0){m.frozen-=dt;faceTo(m,h.x,h.y,dt);return;}
  m.cool-=dt;

  const dh=sense(g,m,dt,heroSpd);
  const home=Math.hypot(m.x-m.hx,m.y-m.hy);

  // Angriff läuft: der Runner-Takt bleibt, aber hier, an einem Ort
  if(m.state==='attack'){
    m.atkT+=dt;
    const ma=m.unit.anim(m.atkKey),dur=ma.frames/ma.fps;
    if(!m.didHit&&m.atkT>dur*0.5){
      m.didHit=true;
      /* v11-U2 · Geschoss statt Handkante: wer eines führt, wirft es — und rechnet dann KEINEN
         Nahkampfschaden zusätzlich. Der Treffer entsteht unterwegs (shots.js), nicht hier. */
      const S=window.OW_SHOTS;
      if(S&&S.armed(m)){
        S.fire(g,m,h.x,h.y-((h.unit&&h.unit.bodyH)||60)*0.55,{dmg:m.dmg,fromHero:false});
      }
      // Reichweite wächst mit dem Körper: wer groß anläuft, trifft auch von weiter
      else if(dh<(a.strike||68)+12){g.damage(h,m.dmg,false);if(h.hp<=0)g.heroDown();}
    }
    if(m.atkT>dur){m.state='idle';
      // Schlag und Rückschritt: das ist die sichtbare Signatur des skirmisher
      if(a.tp.acts.indexOf('hop')>=0)set(m,'back',ACTS.hop.back);
      else set(m,'chase',0.3);}
    faceTo(m,h.x,h.y,dt);
    return;
  }

  // Bizarro schreckt ab (Spec): angeschlagene Nicht-Elites verlieren die Fassung
  if(!m.elite&&!m.critter&&a.tp.courage>0&&h.stats.bizarro>=4&&m.hp/m.maxhp<a.tp.courage+0.05&&dh<220){
    set(m,'flee',1.4);m.aggro=false;
    if(!m.fled){m.fled=true;g.msg(`${m.unit.name} loses its nerve.`);}
  }

  /* Friedlich heißt nicht unantastbar — und friedlich bleibt niemand, dem der Ruf verdorben ist:
     `peaceful` gilt nur, solange die eigene Fraktion nicht feindlich ist (§13). */
  const F2=window.OW_FACTIONS;
  const myFac=F2?F2.factionOf(g,m):null;
  const facHostile=!!(F2&&myFac&&F2.hostile(g,myFac));
  if(F2&&myFac)a.leash=(a.tp.leash*TILE)*F2.leash(g,myFac);
  /* v10-S3a · **Der Übungsgegner.** Ein Schwein am Wegesrand ist kein Wild: es rennt nicht weg,
     es schlägt zurück — aber erst, wenn es getroffen wurde. Danach bleibt es feindlich, sonst wäre
     die Lektion (»schlagen hat Folgen«) nach zwei Sekunden wieder weg. */
  const uebung=!!(m.critter&&m.trainee);
  if(uebung&&m.lastHit!=null)m.aggro=true;
  if(m.critter&&!facHostile&&!(uebung&&m.aggro)){
    m.aggro=false;
    if(g.time-(m.lastHit||-99)<3.5)set(m,'flee',1.3);
    else if(a.st==='flee'&&a.t>a.dwell)set(m,'pause',0.6);
  }else{
  // Feindliche Fraktion: eine Kreatur, die sonst friedlich wäre, beißt jetzt zuerst (§13)
  if(m.critter&&facHostile&&a.notice<1&&dh<260)a.notice=1.1;
  // Kampfwunsch — EIN Ort. Die Leine wirkt nur hier, nicht als zweiter Zweig,
  // und mit Hysterese: aufgeben bei leash, wieder anbeißen erst bei 60 %.
  /* **Die Aggro hängt an der Tusche** (v10-S2d). Ein Zonenwächter reagiert nicht auf Entfernung,
     sondern auf eine Überschreitung: wer das Kartenrechteck betritt, steht auf der Karte, die er
     bewacht. Das ist die Linie, die man sieht (die Kanon-Feder, seit S1b kräftig geführt) — damit
     ist die Regel im Bild erklärt und nicht in einem Radius versteckt.
     **Vor** der Auswertung, nicht danach: erst stand die Anhebung eine Zeile zu tief, und der
     Wächter flackerte im Zehntelsekundentakt zwischen Drohen und Vergessen (gemessen: 50 Wechsel in
     5 s). Wer einen Wert anhebt, muss das tun, bevor jemand ihn liest. */
  let anDerLinie=false;
  if(m.guard&&!m.critter&&m.zone&&h.hp>0){
    const z=m.zone;
    anDerLinie=h.x>=z.x*TILE&&h.x<=(z.x+z.w)*TILE&&h.y>=z.y*TILE&&h.y<=(z.y+z.h)*TILE;
    if(anDerLinie)a.notice=Math.max(a.notice,1.1);
  }
  const wants=(a.notice>=1||m.aggro)&&h.hp>0;
  const far=(home>a.leash||dh>560)&&!anDerLinie;
  /* **Die Leine ist die Karte** (v10-S2d). Gemessen: der Wächter drohte, wechselte auf `chase` und
     zog sich sofort zurück — dann drohte er wieder. Ursache war nicht die Wahrnehmung, sondern die
     Leine: sie kommt aus dem Temperament (rund sieben Felder), das Kartenrechteck ist aber 18×10.
     Wer die Karte bewacht, darf sie auch durchqueren. Dieselbe Linie, die die Aggro auslöst, hebt
     hier die Leine auf — eine Regel, ein Ort.
     (`anDerLinie` ist nur für Zonenwächter wahr; für alle anderen bleibt die Leine, wie sie war.) */
  if(ENGAGED[a.st]){
    if(!wants||far)set(m,'retreat',0.6);
  }else if(wants&&!far&&a.st!=='flee'&&a.st!=='retreat'){
    set(m,'alert',anDerLinie?0.6:0.35);   // an der Linie hält er länger — die Drohung braucht Zeit
    probe.notices++;
    speak(m,cardLine(g,m,'show'),3.0);
    if(g.audio)g.audio.sfx('card',{throttle:400,gain:0.25});
  }
  }

  switch(a.st){
    case 'pause': {
      a.lookT-=dt;
      if(a.lookT<=0){a.lookT=0.9+rng()*1.8;flip(m,rng()<0.5?1:-1,dt,true);} // umsehen: gewollt, nicht zufällig je Frame
      if(a.t>a.dwell){
        const cur=a.tp.curiosity,soc=a.tp.social;
        const sum=1+cur+soc,r=rng()*sum;
        if(r<1){ // wandern — mit Wegpunkten, wenn das Temperament patrouilliert
          if(a.tp.patrol){
            if(!a.route){a.route=[];for(let i=0;i<4;i++){const p=terrPoint(g,a,rng);if(p)a.route.push(p);}}
            if(a.route.length){a.routeI=(a.routeI+1)%a.route.length;a.tgt=a.route[a.routeI];}
            else a.tgt=terrPoint(g,a,rng);
          }else a.tgt=terrPoint(g,a,rng);
          set(m,a.tgt?'roam':'pause',a.tgt?0.9:0.8+rng());
        }
        else if(r<1+cur){a.poi=pickPoi(g,m);a.tgt=a.poi;set(m,a.poi?'visit':'roam',0.9);if(!a.poi)a.tgt=terrPoint(g,a,rng);}
        else{a.mate=pickMate(g,m);
          if(a.mate){a.tgt={x:a.mate.x,y:a.mate.y};set(m,'mingle',0.9);}
          else{a.tgt=terrPoint(g,a,rng);set(m,a.tgt?'roam':'pause',0.9);}}
      }
      break;
    }
    case 'roam': case 'visit': {
      if(!a.tgt){set(m,'pause',0.6+rng());break;}
      const d=seek(a,m,a.tgt,a.st==='visit'?SPD.visit:SPD.roam);
      if(d<20||a.t>7){
        if(a.st==='visit'){set(m,'look',1.4+rng()*1.8);if(a.tgt)a.lookAt={x:a.tgt.x,y:a.tgt.y};}
        else set(m,'pause',0.7+rng()*1.6);
      }
      break;
    }
    case 'look': { // vor dem Fund stehen und ihn ansehen — Leben ohne Bewegung
      if(a.lookAt)faceTo(m,a.lookAt.x,a.lookAt.y,dt);
      if(a.t>a.dwell)set(m,'pause',0.5+rng());
      break;
    }
    case 'mingle': {
      const o=a.mate;
      if(!o||o.hp<=0||fighting(o)){set(m,'pause',0.6);break;}
      a.tgt={x:o.x,y:o.y};
      const d=seek(a,m,a.tgt,SPD.mingle);
      if(d<74||a.t>6){
        set(m,'chat',1.2+rng()*1.4);
        if(o.ai&&o.ai.st!=='chat'&&!fighting(o)){o.ai.mate=m;set(o,'chat',1.2+rng()*1.2);}
        /* Eine Plauderei ist ein Satz UND eine Antwort — vorher sagte einer etwas und der andere
           stand daneben. Die Antwort kommt verzögert, sonst reden beide im selben Bild. */
        if(speak(m,chatLine(g,m,'spin',rng),2.8)&&o.ai)
          o.ai.replyIn=0.9+rng()*0.7;
      }
      break;
    }
    case 'chat': {
      const o=a.mate;
      if(o&&o.hp>0)faceTo(m,o.x,o.y,dt);
      if(a.t>a.dwell){ // „kein Honig" — man geht auseinander, nicht zurück auf denselben Fleck
        const away=o?Math.atan2(m.y-o.y,m.x-o.x)+(rng()-0.5):rng()*6.2832;
        const p={x:m.x+Math.cos(away)*2.4*TILE,y:m.y+Math.sin(away)*2.4*TILE};
        a.tgt=g.passable(p.x,p.y)?p:terrPoint(g,a,rng);
        set(m,a.tgt?'roam':'pause',0.9);
      }
      break;
    }
    case 'alert': {
      faceTo(m,h.x,h.y,dt);
      /* Die Warnhaltung (v10-S2d): ein Wächter, der einen Clip dafür hat, **droht erst**. Er steht,
         schaut hin und hebt die Deckung — der Spieler bekommt einen Wimpernschlag, in dem er noch
         zurücktreten kann. Das ist der Unterschied zwischen einem Posten und einer Falle. */
      if(m.guard&&m.unit&&m.unit.has&&m.unit.has('guard')&&m.state!=='attack'){
        // v10-S17: die Drohgebärde ist der Story-Anlass — einmal, beim Übergang, nicht je Bild.
        if(m.state!=='guard'&&window.OW_STORY&&m.zone)OW_STORY.beat(g,m.zone,'guard');
        m.state='guard';
        if(a.t<a.dwell)a.dx=a.dy=0;
      }
      if(a.t>a.dwell){if(m.state==='guard')m.state='idle';set(m,'chase',0.5);}
      break;
    }
    case 'chase': {
      // Ring, Schlagweite und Trefferprüfung hängen zusammen — eine Zahl, ein Ort.
      // Der Wunschabstand kommt jetzt aus dem Temperament (Kiter hält Abstand, brute klebt).
      const ring=Math.max(ringOf(g,m),a.tp.standoff*(bodyOf(m)+bodyOf(h))/2);
      /* v11-R1: die Schlagweite kommt aus `reach.js` — **derselben Funktion, die der Held liest**.
         `ring+12` bleibt als Untergrenze stehen, weil der Kiter (standoff 2,2) aus Absicht weit
         draußen steht und aus dieser Entfernung wirft; wer ihn auf die Nahreichweite zwingt, nimmt
         ihm seine Rolle. Für alles im Nahkampf ist ab jetzt `OW_REACH.hit` die größere Zahl, und
         damit trifft der Gegner genau dort, wo auch der Held trifft. */
      const strikeMelee=Math.max(ring+12,window.OW_REACH?OW_REACH.hit(m,h):ring+12);
      /* v11-U2 · **Wer wirft, trifft von weit.** Ein Gnoll mit Knochen hatte bis hierher dieselbe
         Angriffsschwelle wie ein Bär mit Tatzen — also stand er im Nahkampf und warf aus einem
         Meter. Für alles mit Geschoss im Katalog gilt jetzt die Wurfweite (`standoff`, 260 px),
         dieselbe Zahl wie beim Helden. Der ABSTAND bleibt Sache des Temperaments: der Kiter hält
         seinen Ring, der Skirmisher tritt näher — nur schlagen darf er von dort, wo er wirft. */
      const SH=window.OW_SHOTS;
      const strike=(SH&&SH.armed(m))?Math.max(strikeMelee,SH.T.standoff):strikeMelee;
      a.ring=ring;a.strike=strike;
      // Aktion »call«: Verstärkung holen, sichtbar als Sprechblase, einmal je Kampf
      if(a.tp.acts.indexOf('call')>=0&&a.called<=0&&actSlotFree(g,m)){
        a.called=ACTS.call.cool;
        let n=0;
        for(const o of g.mobs)
          if(o!==m&&o.hp>0&&o.zone===m.zone&&!o.critter&&o.ai&&
             Math.hypot(o.x-m.x,o.y-m.y)<ACTS.call.radius&&o.ai.notice<1){o.ai.notice=1.2;n++;}
        if(n){speak(m,ACTS.call.say,2.4);probe.calls++;}
      }
      // Aktion »charge«: Anlauf mit Vorlauf — man sieht ihn kommen, das ist die Fairness
      const chg=a.tp.acts.indexOf('charge')>=0;
      if(chg&&(a.chargeCool||0)<=0&&dh>ACTS.charge.range[0]&&dh<ACTS.charge.range[1]&&actSlotFree(g,m)){
        set(m,'charge',ACTS.charge.windup+ACTS.charge.dur);
        a.chargeAt={x:h.x,y:h.y};a.chargeCool=ACTS.charge.cool;a.chargeFrom={x:m.x,y:m.y};
        speak(m,ACTS.charge.say,1.1);
        break;
      }
      if(dh<strike){
        faceTo(m,h.x,h.y,dt);
        if(m.cool<=0&&actSlotFree(g,m)){
          m.cool=1.15;
          m.dir=Math.abs(h.x-m.x)>=Math.abs(h.y-m.y)?'side':(h.y>m.y?'down':'up');
          g.tryAttack(m);probe.attacks++;
        }else if(dh<ring-6){ // zu dicht: Abstand halten, ohne den Angriff aufzugeben
          const l=Math.max(1,dh);
          a.dx+=(m.x-h.x)/l*SPD.chase*0.5;a.dy+=(m.y-h.y)/l*SPD.chase*0.5;
        }
      }else{
        const tx=h.x+Math.cos(a.slot)*ring,ty=h.y+Math.sin(a.slot)*ring;
        const d=seek(a,m,{x:tx,y:ty},SPD.chase*a.tp.pace);
        if(d<30){a.dx*=0.3;a.dy*=0.3;}   // ankommen statt überschießen — das war der Klumpen
      }
      break;
    }
    case 'charge': { // Vorlauf stehen, dann losschießen — und beim Treffer selbst zuschlagen
      const w=ACTS.charge.windup;
      faceTo(m,h.x,h.y,dt);
      if(a.t<w){a.dx=a.dy=0;break;}
      /* Gezielt wird auf einen Punkt VOR dem Helden (Ringabstand), nicht in ihn hinein —
         sonst rennt der Anlauf durch ihn durch und die Abstandsregel aus V4-S1b ist außer Kraft. */
      const aim=a.chargeAt||h,ring=a.ring||64;
      const ax=aim.x-m.x,ay=aim.y-m.y,al=Math.max(1,Math.hypot(ax,ay));
      const stop=Math.max(0,al-ring);
      a.dx=ax/al*ACTS.charge.speed;a.dy=ay/al*ACTS.charge.speed;
      if(stop<6){a.dx*=0.2;a.dy*=0.2;}
      const ran=a.chargeFrom?Math.hypot(m.x-a.chargeFrom.x,m.y-a.chargeFrom.y):0;
      // Beim Verlassen wird das Nachschieben gedämpft: 317 px/s im chase umzudrehen dauert 0,9 s,
      // und genau so lange stand der Mob vorher IM Helden.
      const done=()=>{if(ran>60){probe.charges++;probe.chargeDist+=ran;}a.vx*=0.15;a.vy*=0.15;set(m,'chase',0.4);};
      if(dh<(a.strike||64)){
        m.dir=Math.abs(h.x-m.x)>=Math.abs(h.y-m.y)?'side':(h.y>m.y?'down':'up');
        if(m.cool<=0){m.cool=1.15;g.tryAttack(m);probe.attacks++;}
        done();
      }else if(a.t>a.dwell)done();
      break;
    }
    case 'back': { // Schlag und Rückschritt (skirmisher) — eine Körperlänge, dann wieder Ring
      const l=Math.max(1,dh);
      a.dx=(m.x-h.x)/l*SPD.chase*0.8;a.dy=(m.y-h.y)/l*SPD.chase*0.8;
      faceTo(m,h.x,h.y,dt);
      if(a.t>a.dwell)set(m,'chase',0.4);
      break;
    }
    case 'flee': {
      const l=Math.max(1,dh);
      a.dx=(m.x-h.x)/l*SPD.flee;a.dy=(m.y-h.y)/l*SPD.flee;
      if(a.t>a.dwell&&(dh>320||home>a.leash))set(m,'retreat',0.8);
      break;
    }
    case 'retreat': {
      seek(a,m,{x:m.hx,y:m.hy},SPD.retreat);
      if(home<a.leash*0.55||home<70){
        m.aggro=false;a.notice=0;
        if(m.hp<m.maxhp)m.hp=Math.min(m.maxhp,m.hp+8*dt);
        if(home<90)set(m,'pause',0.6+rng());
      }
      break;
    }
    default: set(m,'pause',0.8);
  }
  // Niemand steht IM Helden — auch nicht mitten im Schlagabstand. Eine Regel für alle Zustände:
  // der Abstand folgt dem Körpermaß, nicht dem Zustand. (Das war der Klumpen im Kampf.)
  const hs=a.tp.standoff*(bodyOf(m)+bodyOf(h))/2;
  if(dh>0.01&&dh<hs&&m.state!=='attack'){
    // Kräftig genug, um auch im Gedränge zu halten: die Trennung der Nachbarn drückt mit
    // bis zu 78 px/s dagegen — mit 120 px/s verlor der Heldenabstand (gemessen 0,48 Körper).
    const f=(hs-dh)/hs*SPD.chase*1.5;
    a.dx+=(m.x-h.x)/dh*f;a.dy+=(m.y-h.y)/dh*f;
  }
}
function seek(a,m,t,spd){
  const dx=t.x-m.x,dy=t.y-m.y,d=Math.hypot(dx,dy);
  if(d<1)return d;
  const brake=Math.min(1,d/46);           // ankommen, nicht anrennen
  a.dx+=dx/d*spd*brake;a.dy+=dy/d*spd*brake;
  return d;
}

/* ── Nachbarn: Trennung als Kraft (nicht als Sprung) + leichte Ausrichtung ── */
function neighbours(g){
  const mobs=g.mobs;
  for(let i=0;i<mobs.length;i++){
    const A=mobs[i];if(A.hp<=0||!A.ai)continue;
    for(let j=i+1;j<mobs.length;j++){
      const B=mobs[j];if(B.hp<=0||!B.ai)continue;
      let dx=B.x-A.x,dy=B.y-A.y;let d=Math.hypot(dx,dy);
      if(d<probe.minPair)probe.minPair=d;
      // Lesbarkeit misst sich am Körper, nicht in Tiles: Abstand / mittlere Körperhöhe
      const ov=d/Math.max(1,(bodyOf(A)+bodyOf(B))/2);
      if(ov<probe.minOverlap)probe.minOverlap=ov;
      // Wer redet, braucht Platz für seine Blase
      let sep=(fighting(A)||fighting(B))?sepFight(A,B):SEP_IDLE;
      if(sep<SEP_FIGHT)sep=SEP_FIGHT;
      if(A.ai.bubble||B.ai.bubble)sep=Math.max(sep,72);
      if(A.ai.st==='chat'&&B.ai.st==='chat')sep=54;
      if(d>=sep)continue;
      if(d<0.01){dx=A.ai.rng()-0.5;dy=A.ai.rng()-0.5;d=Math.hypot(dx,dy)||1;}
      const push=(sep-d)/sep*78;
      A.ai.dx-=dx/d*push;A.ai.dy-=dy/d*push;
      B.ai.dx+=dx/d*push;B.ai.dy+=dy/d*push;
      if(fighting(A)&&fighting(B)){       // Boid-Ausrichtung, nur im Anlauf
        A.ai.dx+=B.ai.vx*0.07;A.ai.dy+=B.ai.vy*0.07;
        B.ai.dx+=A.ai.vx*0.07;B.ai.dy+=A.ai.vy*0.07;
      }
    }
  }
}

/* ── Bewegen: Kraft, Whisker, Kollision, Stillstand-Erkennung ─────────────── */
function move(g,m,dt){
  const a=m.ai;
  const px=m.x,py=m.y;
  // Teleport erkannt (Respawn / Journey) → Gehirn nicht weiterrechnen lassen
  if(Math.hypot(m.x-a.px,m.y-a.py)>200){a.vx=a.vy=0;set(m,'pause',0.8);}
  // Ein Anlauf ist ein Ruck, kein Anfahren: die Beschleunigungsbremse (ACC) würde ihn auf
  // ~45 px begrenzen — deshalb setzt der Anlauf die Geschwindigkeit direkt (V4-S6b).
  const burst=(a.st==='charge'&&a.t>=ACTS.charge.windup);
  if(burst){a.vx=a.dx;a.vy=a.dy;}
  else{
    let fx=a.dx-a.vx,fy=a.dy-a.vy;
    const fl=Math.hypot(fx,fy),cap=ACC*dt;
    if(fl>cap){fx=fx/fl*cap;fy=fy/fl*cap;}
    a.vx+=fx;a.vy+=fy;
  }
  let sp=Math.hypot(a.vx,a.vy);
  if(sp<2.5&&!a.dx&&!a.dy){a.vx=a.vy=0;sp=0;}
  // Whisker: was vor mir liegt. Nicht gegen Wasser rennen, sondern daran vorbei.
  if(sp>8){
    const la=0.34;
    if(!g.passable(m.x+a.vx*la,m.y+a.vy*la)){
      const L={x:-a.vy,y:a.vx},R={x:a.vy,y:-a.vx};
      const okL=g.passable(m.x+L.x*la,m.y+L.y*la),okR=g.passable(m.x+R.x*la,m.y+R.y*la);
      const s=(okL&&!okR)?L:((okR&&!okL)?R:(a.rng()<0.5?L:R));
      a.vx=s.x*0.85;a.vy=s.y*0.85;
    }
  }
  const R=11,stuck=!g.passable(m.x,m.y);
  if(stuck){m.x+=a.vx*dt;m.y+=a.vy*dt;}
  else{
    const nx=m.x+a.vx*dt,ny=m.y+a.vy*dt;
    if(g.passable(nx+Math.sign(a.vx)*R,m.y-8)&&g.passable(nx+Math.sign(a.vx)*R,m.y+8))m.x=nx;
    else a.vx*=-0.15;
    if(g.passable(m.x-8,ny+Math.sign(a.vy)*R)&&g.passable(m.x+8,ny+Math.sign(a.vy)*R))m.y=ny;
    else a.vy*=-0.15;
  }
  a.moved=Math.hypot(m.x-px,m.y-py);
  a.px=m.x;a.py=m.y;
  probe.moveSum+=a.moved;
  // „Läuft auf der Stelle": Sollwert da, Weg nicht. Nach 0,6 s neues Ziel statt weiter drücken.
  const wantsMove=Math.hypot(a.dx,a.dy)>12;
  if(wantsMove&&a.moved<Math.abs(a.dx+a.dy)*dt*0.25){a.stall+=dt;}else a.stall=Math.max(0,a.stall-dt*2);
  if(a.stall>0.6){
    a.stall=0;
    if(a.st==='chase'||a.st==='retreat'){a.slot+=1.1;}
    else{a.tgt=terrPoint(g,a,a.rng);set(m,a.tgt?'roam':'pause',0.9);}
  }
  return sp;
}

/* ── Darstellung: Zustandsbild + Spiegelung, beide mit Haltezeit ──────────── */
function flip(m,want,dt,force){
  const a=m.ai;
  if(force){if(m.face!==want&&a.faceHold<=0){m.face=want;a.faceHold=FACE_HOLD;probe.faceFlips++;}return;}
  if(want===m.face){a.faceWant=want;return;}
  if(a.faceWant!==want){a.faceWant=want;a.faceHold=FACE_HOLD;return;}
  if(a.faceHold<=0){m.face=want;a.faceHold=FACE_HOLD;probe.faceFlips++;}
}
function faceTo(m,x,y,dt){
  const dx=x-m.x;
  if(Math.abs(dx)>14)flip(m,Math.sign(dx),dt,false);
}
function present(m,dt,sp){
  const a=m.ai;
  a.faceHold-=dt;a.dirHold-=dt;
  if(m.state==='attack'){
    if(window.OW_ACLOCK)window.OW_ACLOCK.advance(m,m.unit,dt,0,'attack');
    else m.anim+=dt;
    return;
  }
  /* Entschieden wird am **gelaufenen Weg**, nicht am Betrag der Geschwindigkeit — dieselbe Quelle,
     aus der die Animationsuhr ihre Bilder zieht. `sp` enthält auch Schübe, die gar keinen Boden
     abdecken (Trennung, Rückprall an der Wand): danach lief der Zustand »run« mit stehenden Beinen. */
  const spReal=dt>0?a.moved/dt:0;
  const wantRun=(m.state==='run')?spReal>RUN_OUT:spReal>RUN_IN;
  a.runHold-=dt;
  /* Die Warnhaltung ist ein Zustand, kein Bild (v10-S2d): ohne diese Sperre hätte der Takt sie im
     nächsten Frame auf `idle` zurückgesetzt — wer steht, läuft nicht, also gewann `idle`.
     **Und sie gehört `alert`, nicht der Figur:** gemessen am 9.8. blieb ein Wächter in Deckung
     stehen, nachdem die KI schon auf `pause` gewechselt war — gesetzt wurde die Haltung in einem
     Zustand, aufgeräumt in einem anderen. Wer eine Haltung setzt, räumt sie auch weg. */
  if(m.state==='guard'&&a.st!=='alert')m.state='idle';
  if(m.state==='guard'){
    if(window.OW_ACLOCK)window.OW_ACLOCK.advance(m,m.unit,dt,0,'guard');
    else m.anim+=dt*6;
    return;
  }
  if(wantRun!==(m.state==='run')&&a.runHold<=0){
    /* `m.anim=0` ist RAUS: der Phasenzähler läuft weiter. Ein Rücksprung auf Bild 0 ist genau der
       sichtbare Ruck, den die Hysterese vermeiden soll — und bei einem Blatt mit anderer Bildzahl
       stimmt die Phase trotzdem, weil der Renderer modulo rechnet. */
    m.state=wantRun?'run':'idle';a.runHold=RUN_HOLD;probe.stateFlips++;
  }
  /* V8-S1: **das war die Stelle, an der der Troll schwebte.** `min(14,6+sp/13)` ist eine Rate an
     der Uhr, gespeist vom SOLLTEMPO — nicht vom Weg. Ein Mob, der gegen einen Baum lenkt, drehte
     die Beine weiter (der Zähler `stillRun` hat das die ganze Zeit protokolliert und niemand hat
     ihn gelesen), und über die Tempi hinweg rutschte der Fuß um den Faktor 5.
     Jetzt entscheidet `a.moved` — die Strecke, die dieselbe Funktion zwei Dutzend Zeilen weiter
     oben schon gemessen hat. */
  if(window.OW_ACLOCK)window.OW_ACLOCK.advance(m,m.unit,dt,a.moved,m.state);
  else m.anim+=dt*(m.state==='run'?Math.min(14,6+sp/13):6);
  if(m.state==='run'){
    probe.runFrames++;
    if(a.moved<0.12*dt*60)probe.stillRun++;                    // Beleg gegen „läuft auf der Stelle"
    if(Math.abs(a.vx)>12)flip(m,Math.sign(a.vx),dt,false);
    if(a.dirHold<=0){
      const want=Math.abs(a.vx)>=Math.abs(a.vy)*1.25?'side':(a.vy>0?'down':'up');
      if(want!==m.dir){m.dir=want;a.dirHold=0.24;}
    }
  }
  if(m.flash>0)m.flash-=dt;
}

/* ── Ringplätze: nach Winkel verteilt, damit niemand kreuzt oder verschmilzt ─ */
function assignSlots(g){
  const byZone=new Map();
  for(const m of g.mobs){
    if(m.hp<=0||!m.ai||!fighting(m))continue;
    const k=m.zone;if(!byZone.has(k))byZone.set(k,[]);byZone.get(k).push(m);
  }
  for(const list of byZone.values()){
    const h=g.hero;
    list.sort((A,B)=>Math.atan2(A.y-h.y,A.x-h.x)-Math.atan2(B.y-h.y,B.x-h.x));
    const n=list.length;
    for(let i=0;i<n;i++){
      const base=Math.atan2(list[0].y-h.y,list[0].x-h.x);
      list[i].ai.slot=base+i*6.2832/n;
      list[i].ai.ringN=n;                 // der Ring weiß, wie viele auf ihm stehen
    }
  }
}

/* ── Ein Schritt ──────────────────────────────────────────────────────────── */
let heroLast=null,slotT=0;
function step(g,dt){
  if(!g.mobs||!g.hero||!g.hero.unit)return;
  g0=g;   // v10-S19: das Budget braucht das Spiel, speak(m,...) bekommt es nicht uebergeben
  const h=g.hero;
  // Gemessen, nicht geraten — aber gedeckelt: ein Fast Travel ist kein Trommelwirbel
  const heroSpd=heroLast?Math.min(260,Math.hypot(h.x-heroLast.x,h.y-heroLast.y)/Math.max(dt,1e-4)):0;
  heroLast={x:h.x,y:h.y};
  if(!probe.t0)resetProbe(g);
  probe.frames++;probe.dt+=dt;
  slotT-=dt;
  if(slotT<=0){slotT=0.4;assignSlots(g);}
  let i=0;
  for(const m of g.mobs){
    i++;
    if(m.hp<=0)continue;
    if(!m.ai)initBrain(g,m,i);
    think(g,m,dt,heroSpd);
  }
  neighbours(g);
  for(const m of g.mobs){
    if(m.hp<=0||!m.ai)continue;
    const sp=move(g,m,dt);
    present(m,dt,sp);
    probe.visitFrames[m.ai.st]=(probe.visitFrames[m.ai.st]||0)+1;
    const gap=Math.hypot(m.x-h.x,m.y-h.y)/Math.max(1,(bodyOf(m)+bodyOf(h))/2);
    if(gap<probe.minHeroGap)probe.minHeroGap=gap;
  }
}

/* ── Sprechblasen zeichnen: messen → ablegen → malen ─────────────────────── */
/* v10-S3b · Die Blasenschrift — **und der Befund, der die Idee korrigiert hat.**
   »PottyMouth BB« (Blambot, von Georg gekauft; Live-Lizenz offen) ist **keine Textschrift**: sie
   bildet Buchstaben auf Fluchzeichen ab. Der erste Einbau setzte sie über alle Blasen — im Bild
   stand dann »Bones do not gossip« als Reihe von Blitzen und Totenköpfen, also unlesbar.
   Also: **die Fluchschrift bekommt die Flüche.** Erkannt wird das am Text selbst (nur Satz- und
   Sonderzeichen = ein Grawlix), nicht an einem zweiten Feld — sonst hätte die Blase zwei Wahrheiten.
   Der Regler `bubbleFont` = `mono` schaltet auch die Flüche auf Monospace. */
function bubbleSkin(g,b){
  const potty=(!g||!g.att||g.att.bubbleFont!=='mono')&&!!(b&&b.potty);
  // Ein einzelnes Zeichen darf groß sein — das ist der Ausruf. Mehrere bleiben kleiner.
  if(potty)return (b.text||'').length<=2
    ? {font:'32px "PottyMouth BB",ui-monospace,monospace',H:38,base:30}
    : {font:'22px "PottyMouth BB",ui-monospace,monospace',H:28,base:21};
  return {font:'13px "Courier New",ui-monospace,monospace',H:22,base:15};
}
function drawBubbles(g){
  const ctx=g.ctx,list=[];
  ctx.textAlign='left';ctx.textBaseline='alphabetic';
  for(const m of g.mobs){
    if(m.hp<=0||!m.ai||!m.ai.bubble)continue;
    const b=m.ai.bubble,bh=(m.unit?m.unit.bodyH*(m.sizeMul||1):60);
    b.skin=bubbleSkin(g,b);
    ctx.font=b.skin.font;
    b.w=Math.min(300,ctx.measureText(b.text).width+18);
    b.ax=m.x;b.ay=m.y-bh-30;
    list.push({m,b});
  }
  if(!list.length)return;
  list.sort((p,q)=>p.b.ay-q.b.ay);
  const placed=[],H=26;   // Platzierung mit EINER Höhe — sonst rutschen Blasen je nach Schrift
  for(const it of list){
    let x=it.b.ax,y=it.b.ay,n=0;
    while(n++<14){
      const hit=placed.find(p=>Math.abs(p.x-x)<(p.w+it.b.w)/2+10&&Math.abs(p.y-y)<H+7);
      if(!hit)break;
      y=hit.y-H-8;                            // nach oben ausweichen — über den Köpfen ist Platz
      if(n>7)x+=(it.m.face<0?-1:1)*30;
    }
    if(y!==it.b.ay&&!it.b.shifted){it.b.shifted=true;probe.bubbleShift++;}
    it.b.dx=x-it.b.ax;it.b.dy=y-it.b.ay;
    placed.push({x,y,w:it.b.w,h:H});
  }
  for(const {m,b} of list){
    const x=b.ax+b.dx,y=b.ay+b.dy,w=b.w,H=b.skin.H,fade=Math.min(1,Math.min(b.t*4,(b.life-b.t)*3));
    if(fade<=0)continue;
    ctx.globalAlpha=fade;
    const l=x-w/2,t=y-H;
    if(b.nackt){
      /* Nur der Glyph. Er darf andere überlappen — genau das ist das Bild. */
      ctx.font='bold '+Math.round(b.skin.H*0.92)+'px "Courier New",ui-monospace,monospace';
      ctx.textAlign='center';
      ctx.lineWidth=3;ctx.strokeStyle='rgba(247,238,216,.9)';
      ctx.strokeText(b.text,x,t+b.skin.base);
      ctx.fillStyle='#9e2b1c';ctx.fillText(b.text,x,t+b.skin.base);
      ctx.globalAlpha=1;continue;
    }
    const denk=b.typ==='thought';
    ctx.beginPath();
    if(denk){
      /* Scallop-Wolke: Lappen auf einer Ellipse, dieselbe Grammatik wie im DOM-Overlay
         (`blobPath`) — ein Zug, zwei Orte, damit »denken« überall gleich aussieht. */
      const cx=x,cy=t+H/2,rx=w/2+5,ry=H/2+4,N=10;
      for(let i=0;i<=N;i++){
        const th=Math.PI*2*i/N;
        const px=cx+Math.cos(th)*rx, py=cy+Math.sin(th)*ry;
        if(i===0)ctx.moveTo(px,py);
        else{const p0=Math.PI*2*(i-0.5)/N;
          ctx.quadraticCurveTo(cx+Math.cos(p0)*rx*1.16,cy+Math.sin(p0)*ry*1.3,px,py);}
      }
    }else{
      const r=6;
      ctx.moveTo(l+r,t);ctx.lineTo(l+w-r,t);ctx.quadraticCurveTo(l+w,t,l+w,t+r);
      ctx.lineTo(l+w,t+H-r);ctx.quadraticCurveTo(l+w,t+H,l+w-r,t+H);
      ctx.lineTo(l+r,t+H);ctx.quadraticCurveTo(l,t+H,l,t+H-r);
      ctx.lineTo(l,t+r);ctx.quadraticCurveTo(l,t,l+r,t);
    }
    ctx.closePath();
    ctx.fillStyle='rgba(240,236,222,.94)';ctx.fill();
    ctx.strokeStyle='rgba(20,26,24,.85)';ctx.lineWidth=1.6;ctx.stroke();
    ctx.fillStyle='rgba(240,236,222,.94)';
    if(denk){
      /* Zwei Kreise statt Zipfel — und sie atmen, wie im Overlay. */
      const ph=b.t*1.6;
      for(const [o,rr,q] of [[10,4.2,0],[21,2.8,1.1]]){
        const yy=t+H+o+Math.sin(ph+q)*1.8;
        ctx.beginPath();ctx.arc(b.ax,yy,rr*(1+Math.sin(ph*1.3+q)*0.1),0,6.283);
        ctx.fill();ctx.strokeStyle='rgba(20,26,24,.7)';ctx.lineWidth=1.3;ctx.stroke();
      }
    }else{
      ctx.beginPath();
      ctx.moveTo(b.ax-5,t+H-1);ctx.lineTo(b.ax+5,t+H-1);ctx.lineTo(b.ax,b.ay+8);
      ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(20,26,24,.55)';ctx.lineWidth=1.2;ctx.stroke();
    }
    ctx.fillStyle='#1b211d';ctx.textAlign='center';
    ctx.font=b.skin.font;
    ctx.fillText(b.text,x,t+b.skin.base);
    ctx.globalAlpha=1;
  }
}

/* ── Messung ──────────────────────────────────────────────────────────────── */
function report(g){
  const t=Math.max(0.001,probe.dt),live=(g?g.mobs.filter(m=>m.hp>0).length:0)||1;
  const states={};
  if(g)for(const m of g.mobs)if(m.hp>0&&m.ai)states[m.ai.st]=(states[m.ai.st]||0)+1;
  return{
    seconds:+t.toFixed(2),frames:probe.frames,mobs:live,
    faceFlipsPerMobPerSec:+(probe.faceFlips/t/live).toFixed(3),
    aiStateChangesPerMobPerSec:+(probe.stateFlips/t/live).toFixed(3),
    runFramesStillRatio:+(probe.runFrames?probe.stillRun/probe.runFrames:0).toFixed(3),
    pxPerMobPerSec:+(probe.moveSum/t/live).toFixed(1),
    minPairDistTiles:+(probe.minPair/64).toFixed(2),
    minPairPerBody:+(probe.minOverlap===1e9?0:probe.minOverlap).toFixed(2),
    minHeroGapPerBody:+(probe.minHeroGap===1e9?0:probe.minHeroGap).toFixed(2),
    attacks:probe.attacks,charges:probe.charges,calls:probe.calls,
    chargeDistAvg:+(probe.charges?probe.chargeDist/probe.charges:0).toFixed(0),
    framesPerVisit:(()=>{const o={};for(const k in probe.visits)
      o[k]=+((probe.visitFrames[k]||0)/probe.visits[k]).toFixed(1);return o;})(),
    notices:probe.notices,noticeMax:+probe.noticeMax.toFixed(2),
    tempers:(()=>{ // je Temperament: wie viele, wie weit weg, wie viel Neugier
      const o={};
      if(!g)return o;
      const name=tp=>Object.keys(TEMPER).find(k=>TEMPER[k]===tp)||'?';
      for(const m of g.mobs){
        if(m.hp<=0||!m.ai)continue;
        const k=name(m.ai.tp);
        o[k]=o[k]||{n:0,dist:0,states:{}};
        o[k].n++;o[k].dist+=Math.hypot(m.x-g.hero.x,m.y-g.hero.y);
        o[k].states[m.ai.st]=(o[k].states[m.ai.st]||0)+1;
      }
      for(const k in o)o[k].avgDistTiles=+(o[k].dist/o[k].n/64).toFixed(2),delete o[k].dist;
      return o;})(),
    bubbles:probe.bubbles,bubblesMovedToFreeSpace:probe.bubbleShift,
    states};
}

window.OW_AI={version:'ai-v4.3',step,drawBubbles,speak,initBrain,
  report:g=>report(g),reset:g=>resetProbe(g)};
})();
