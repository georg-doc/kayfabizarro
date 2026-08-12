/* KFB Overworld — Plauder-Schicht (v10-S3b · chatter-v1)
   ------------------------------------------------------------------------------------------------
   **Was das ist.** Die Mobs reden im Leerlauf, und zwar über etwas. Living Concept §59 nennt die
   Kette:  Quelle → Ton der Fraktion → Laune → kurzer Satz. Diese Datei ist genau diese Kette,
   ohne LLM und ohne Netz.

   **Vier Quellen, in dieser Reihenfolge befragt:**
     1. `feed`     — der RSS-Plauder-Seed je Zone/Fraktion (§59). **Noch keine Leitung**: die Datei
                     holt nichts, sie nimmt entgegen. Wer Schlagzeilen hat, ruft `OW_CHATTER.setFeed`.
                     Damit ist der Anschluss da, bevor die Leitung liegt — und niemand muss später
                     eine zweite Quelle erfinden.
     2. `card`     — die Karte der Zone (Titel, erste Lore-Zeile). Läuft seit V2.
     3. `faction`  — Ton der Fraktion/des Bioms.
     4. `emote`    — Pottymouth: Fluch als Zeichenfolge, kein Wort. Der Kanon sagt »keine Zahlen an
                     der Karte«; über Flüche steht da nichts.

   **Warum eine eigene Datei.** `mob-ai.js` entscheidet, WANN jemand redet — das ist Verhalten.
   WAS gesagt wird, ist Inhalt und wechselt mit jedem Deck. Zwei Aufgaben, zwei Dateien; sonst
   wandert beim nächsten Deck-Wechsel das halbe Gehirn mit.

   **Lizenz-Hinweis:** die Schrift »PottyMouth BB« (Blambot) ist gekauft, die Lizenz für den
   Live-Einsatz ist NICHT geklärt (Georg, 9.8.). Sie liegt hier für den internen Blick. Der Zeichner
   fällt ohne sie auf Monospace zurück — das Spiel hängt nie an einer Schrift. */
(function(){
'use strict';

/* Flüche als Zeichenfolge (»grawlix«) — das Comic-Handwerk dafür ist älter als jede Ratingstufe.
   Kurz halten: eine Blase ist 44 Zeichen breit, ein Fluch drei bis sieben.

   **Befund 9.8. (v10-S3b):** »PottyMouth BB« ist eine Fluch-Schrift — sie bildet **Buchstaben** auf
   Fluchzeichen ab (Blitz, Totenkopf, Wirbel). Ein Grawlix aus `#$@!` trifft dort **keine** Glyphe
   und fällt auf Monospace zurück; im Bild stand deshalb schlicht »@#$%&!«. Also zwei Vorräte:
   liegt die Schrift, werden **Buchstaben** gewürfelt (die Schrift macht die Zeichen daraus);
   liegt sie nicht, die getippten Sonderzeichen. Eine Absicht, zwei Vorräte — nicht zwei Systeme. */
const GRAWLIX=['#$@!','@#$%&!','$#@*!','%$#@!','#@$&!','!@#?!','&$#@!!'];
/* **Der Zeichenschlüssel, abgelesen am Blatt** (`KFB Pottymouth Key.dc.html`, 9.8.): die Schrift
   legt auf jede Taste ein anderes Fluchzeichen. Damit ist ein Emote **ein Buchstabe** — kein Bild,
   keine Kachel, kein zweiter Zeichenweg. Georg 9.8.: **ein Emote je Blase, nicht drei.**
   Diese Tabelle ist zugleich das semantische Briefing für ein späteres PNG-Set. */
const KEY={
  totenkopf:'A', knochen:'N', grinsen:'L', blitz:'O', knall:'T', funken:'Q',
  wolke:'F', hirn:'H', wirbel:'C', strudel:'U', frage:'K', ausruf:'J',
  hammer:'V', axt:'X', grab:'W', zacken:'S', kette:'R', wurm:'E',
};
/* Wofür welches Zeichen steht — die Aufrufstelle nennt die Absicht, nicht die Taste. */
const EMOTE_BY_MOOD={
  fluch:['A','N','L','F'], wut:['O','T','S'], schmerz:['X','V','N'],
  verwirrt:['K','C','U'], schreck:['J','Q','W'], gedanke:['H','E','R'],
};
const LETTERS='abcdefghijklmnopqrstuvwxyz';
let pottyDa=false;
/* **Auf »läuft« gaten, nicht auf »existiert« — und `check()` ist kein »läuft«.** Die @font-face
   stand angemeldet, aber `status:'unloaded'`; `document.fonts.check` sagt darauf **false**, und die
   Flüche fielen auf Sonderzeichen zurück. Eine Schrift, die nie benutzt wurde, lädt der Browser
   nicht. Also erst `load()` erzwingen, dann fragen. */
try{
  const F=document.fonts;
  if(F&&F.load)F.load('20px "PottyMouth BB"').then(()=>{
    pottyDa=F.check('20px "PottyMouth BB"');
    console.log('[chatter] chatter-v1 · PottyMouth BB',pottyDa?'liegt — Flüche als Buchstaben':'fehlt — Flüche als Sonderzeichen');
  }).catch(()=>{});
}catch(e){}
/* **Ein Zeichen, nicht drei** (Georg 9.8.). Drei gewürfelte Buchstaben ergaben drei Symbole
   nebeneinander — das liest sich als Wort, nicht als Ausruf. Ein einzelnes großes Zeichen ist
   die Comic-Konvention. Ohne die Schrift bleibt die getippte Zeichenkette als Rückweg. */
function grawlix(rnd,mood){
  if(!pottyDa)return{text:GRAWLIX[Math.floor(rnd()*GRAWLIX.length)],potty:false};
  const pool=EMOTE_BY_MOOD[mood]||EMOTE_BY_MOOD.fluch;
  return{text:pool[Math.floor(rnd()*pool.length)],potty:true};
}
/* Emotes als Zeichen, nicht als Bild — dieselbe Semantik, die später die PNG-Vorlage wird
   (Georg 9.8.: das Set taugt als Briefing für ein Bild-Modell). Wer ein Icon-Blatt hat, ersetzt
   `EMOTE` durch Indizes ins Blatt; die Aufrufstelle bleibt. */
const EMOTE=KEY;   // Name → Taste. `OW_CHATTER.emote('blitz')` gibt das Zeichen, nicht die Taste.
/* v10-S10: der Vorrat liegt in `chatter-phrases.js` (Inhalt, von WS0 erweiterbar). TONE bleibt als
   **Notnagel**, falls die Datei fehlt — auf »läuft« gaten, nicht auf »existiert«. */
const TONE={
  camp:    ['Somebody moved the fence again.','Third watch. Nobody told me.','That is not how you hold it.'],
  wilds:   ['Something walked here. Not us.','The trees count us.','I liked the quiet.'],
  cave:    ['Drip. Drip. Same drip.','I know that echo. It knows me.','Down is further than they said.'],
  frost:   ['My hands stopped arguing.','Snow keeps the tally.','Nothing rots here. Nothing leaves.'],
  shore:   ['The tide took the marker.','Salt in the paperwork.','Boats come back emptier.'],
  dungeon: ['Bones do not gossip. They confirm.','It moved. Do not tell the others.','Rest is a rumour here.'],
};
const REPLY=['Sure.','Says you.','Hm.','Again with that.','And?','Fine. Fine.','Not what I heard.',
  'Say it louder.','That is not it.','It is.','Was it?','No.'];

const feeds=Object.create(null);      // key (Zonen-Biome oder Fraktion) → [Schlagzeilen]
let counts={feed:0,card:0,faction:0,emote:0,reply:0};

/* Eine Schlagzeile ist Rohstoff, kein Zitat (§59: »fuel, not canon«). Sie wird auf ein Bruchstück
   gekürzt und in den Mund einer Figur gelegt, die davon nichts versteht. */
/* Eine Blase ist 44 Zeichen breit — `speak` schneidet hart ab. Gemessen: die erste Lore-Zeile von
   »The Convert Bonus« ist 118 Zeichen und endete als »…makes visib…«. Also hier kürzen, an einer
   Fuge und an einer Wortgrenze, nicht dort. */
function kurz(s,max){
  s=String(s||'').replace(/\s+/g,' ').trim();
  if(s.length<=max)return s;
  const fuge=s.split(/[,;:—–]/)[0].trim();
  let t=fuge.length<=max?fuge:fuge.slice(0,max);
  if(t.length>max||fuge.length>max){
    t=t.slice(0,max);
    const sp=t.lastIndexOf(' ');
    if(sp>max*0.5)t=t.slice(0,sp);
    t+='…';
  }
  return t;
}
function fromFeed(key,rnd){
  const list=feeds[key]||feeds['*'];
  if(!list||!list.length)return null;
  const raw=String(list[Math.floor(rnd()*list.length)]||'').replace(/\s+/g,' ').trim();
  if(!raw)return null;
  const rahmen=['They say »X«.','Heard about »X«?','»X«. In this weather.','Somebody wrote »X«.',
    '»X«, apparently.'][Math.floor(rnd()*5)];
  return rahmen.replace('X',kurz(raw,28));
}

/* Der eine Einstieg für `mob-ai.js`. `kind` sagt den Anlass, nicht den Inhalt:
   'spin'  = Leerlauf-Plauderei · 'reply' = die Antwort des Gegenübers · 'curse' = getroffen. */
function line(g,m,kind,rnd){
  rnd=rnd||Math.random;
  const P0=window.OW_PHRASES;
  const stimme0=(()=>{const F0=window.OW_FACTIONS;
    const f=F0&&F0.factionOf?F0.factionOf(g,m):null, b=(m.zone&&m.zone.biome)||'camp';
    return P0?((f&&P0.hat(f)&&f)||(P0.hat(b)&&b)||null):null;})();
  if(kind==='curse'){counts.emote++;
    return grawlix(rnd,(P0&&stimme0)?P0.emote(stimme0):'schmerz');}
  if(kind==='reply'){counts.reply++;
    if(rnd()<0.22)return grawlix(rnd,'verwirrt');
    const s=P0&&stimme0&&P0.zeile(stimme0,'antwort',rnd);
    return s||REPLY[Math.floor(rnd()*REPLY.length)];}
  /* Die drei Knöpfe der bedienbaren Blase (v10-S9) holen sich ihre Sprache hier. */
  if(kind==='ask'||kind==='philo'||kind==='taunt'||kind==='trade'){
    const feld={ask:'frage',philo:'philo',taunt:'spott',trade:'handel'}[kind];
    const s=P0&&stimme0&&P0.zeile(stimme0,feld,rnd);
    if(s){counts.faction++;return s;}
  }
  const z=m.zone,biome=(z&&z.biome)||'camp';
  const F=window.OW_FACTIONS;
  const fac=F&&F.factionOf?F.factionOf(g,m):null;
  const P=window.OW_PHRASES;
  /* **Erst die Fraktion, dann das Biom.** Wer eine Fraktion hat, spricht ihre Haltung; wer keine
     hat, spricht die des Ortes. Ein Wesen ohne beides gibt es nicht. */
  const stimme=(P&&((fac&&P.hat(fac)&&fac)||(P.hat(biome)&&biome)))||null;
  /* v10-S21 · **Die Karte schlägt die Schlagzeile** (ChatGPT-Handoff C1, angenommen). Bisher wurde
     der Feed zuerst befragt (30 %), auch wenn eine Karte in der Zone lag. Aber die Karte IST der
     semantische Kern, wenn es eine gibt — sie ist das Beweisstück, die Schlagzeile ist Beiwerk.
     Also: liegt eine Karte, kommt der Feed erst danach dran. */
  const w=(z&&z.card&&rnd()<0.45)?0.99:rnd();
  if(w<0.30){
    const roh=(feeds[fac||biome]||feeds[biome]||feeds['*']||[]);
    if(roh.length&&stimme){
      const st=kurz(String(roh[Math.floor(rnd()*roh.length)]||''),26);
      const s=P.zeile(stimme,'ueber',rnd,st);
      if(s){counts.feed++;return s;}
    }
    const s=fromFeed(fac||biome,rnd)||fromFeed(biome,rnd);
    if(s){counts.feed++;return s;}
  }
  if(w<0.68&&z&&z.card){
    const c=z.card,lore=(c.l||'').split(/(?<=[.!?])\s/)[0];
    /* Zur Hälfte redet die Fraktion **über** die Karte (ihr Titel als Bruchstück), zur Hälfte
       zitiert sie die Lore. Nur zitieren klang wie ein Vorleser, nur reden wie ein Kommentator. */
    if(stimme&&c.t&&rnd()<0.5){
      const s=P.zeile(stimme,'ueber',rnd,kurz(c.t,30));
      if(s){counts.card++;return s;}
    }
    const s=lore?kurz(lore,42):(c.t?'»'+kurz(c.t,38)+'«':null);
    if(s){counts.card++;return s;}
  }
  /* v10-S20 · **Die Schmähung schlägt alles.** Wer eine Fraktion tief genug beleidigt hat, hört
     nicht mehr ihre Haltung, sondern seinen eigenen Namen. Das ist die erste Stelle, an der die Welt
     den Spieler persönlich kennt — und sie steht ganz oben, weil sie sonst nie drankäme. */
  const I=window.OW_IDENT;
  if(I&&g.reputation){
    const f=fac||biome;
    const s=I.schmaehung(f,g.reputation[f]||0,rnd);
    if(s){counts.faction++;return s;}
  }
  /* v10-S18 · **Tätigkeit vor Haltung** (ChatterBox S1 §17D). Wer gerade etwas tut, denkt zuerst
     darüber — ein Schaf über das Gras, nicht über die Fraktion. Nur bei jedem dritten Zug, damit es
     ein Fund bleibt und keine Dauerbeschriftung. */
  if(P&&P.taetigkeit&&rnd()<0.34){
    const un=m.unit&&m.unit.id||'';
    const was=(m.critter||/sheep|pig|chicken|cow|horse/.test(un))?'critter'
      :(/skull|skeleton|bone/.test(un)?'knochen'
      :(m.guard?'wache':(biome==='cave'||biome==='dungeon'?'arbeit':null)));
    if(was){const s=P.taetigkeit(was,rnd);if(s){counts.faction++;return s;}}
  }
  counts.faction++;
  if(stimme){
    const s=P.zeile(stimme,'idle',rnd);
    if(s)return s;
  }
  const t=TONE[biome]||TONE.camp;
  return t[Math.floor(rnd()*t.length)];
}

window.OW_CHATTER={
  version:'chatter-v1',
  line,EMOTE,KEY,EMOTE_BY_MOOD,GRAWLIX,grawlix,
  /* Ein benanntes Zeichen für alle, die eines brauchen (HUD, Regie, BLÖDSINN!-Slice). */
  emote(name){return{text:KEY[name]||KEY.totenkopf,potty:pottyDa};},
  pottyReady(){return pottyDa;},
  /* §59-Anschluss: `key` ist ein Zonen-Biome ODER eine Fraktion, `*` gilt für alle.
     Wer die Leitung baut (Proxy, weil Browser kein CORS-freies RSS lesen), ruft nur noch das hier. */
  setFeed(key,lines){feeds[key]=Array.isArray(lines)?lines.slice(0,20):[];},
  feedKeys(){return Object.keys(feeds);},
  report(){return Object.assign({},counts,{feeds:Object.keys(feeds).length});},
  reset(){counts={feed:0,card:0,faction:0,emote:0,reply:0};},
};
})();
