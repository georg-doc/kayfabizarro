/* KFB Overworld — Mini-Story je Zone (v10-S17 · story-v1)
   ------------------------------------------------------------------------------------------------
   **Das Gerüst, nicht die Geschichte.** Georgs Auftrag (9.8.): eine Card- oder Mob-Zone soll eine
   kleine Erzählung tragen — die Story-Logik selbst kommt aus der NIE (mit ChatGPT und Coworker).
   Dieses Modul ist deshalb ausdrücklich **leer an Inhalt** und liefert nur, was die Laufzeit können
   muss: die richtigen Sätze am richtigen Moment, durch den richtigen Mund, ohne Doppelungen.

   Dieselbe Arbeitsteilung wie bei der Plauderei (Masterplan §6b): **Laufzeit hier, Inhalt dort.**
   Wer Beats schreibt, ändert keinen Zustandsautomaten; wer den Automaten ändert, schreibt keine
   Beats.

   ── Was ein Beat ist ────────────────────────────────────────────────────────────────────────────
       {on:'enter', who:'guard', text:'You are early.', type:'speech', once:true}

     `on`    WANN — einer der Anlässe unten. Der Runner ruft sie, das Modul entscheidet nichts.
     `who`   WER — 'guard' (der Wächter der Zone) · 'mob' (irgendwer, der da ist) ·
             'narrator' (die Logzeile, wenn niemand sprechen soll)
     `text`  WAS. Ein Satz. Eine Blase trägt rund 40 Zeichen bequem.
     `type`  'speech' · 'thought' · 'whisper' — dieselben drei Register wie überall.
     `once`  Standard **true**. Eine Geschichte, die sich wiederholt, ist keine.

   **Mehrere Beats auf denselben Anlass sind kein Fehler, sondern eine Folge:** beim ersten Betreten
   spielt der erste, beim zweiten der nächste. So kann eine Zone beim Wiederkommen etwas anderes
   sagen, ohne dass jemand einen Zähler führt. Ist die Folge aufgebraucht, ist die Zone still.

   ── Die sechs Anlässe ───────────────────────────────────────────────────────────────────────────
     `enter`   der Held betritt die Zone
     `guard`   der Wächter droht (bevor er zuschlägt)
     `fight`   der erste Schlag ist gefallen
     `win`     die Zone ist geräumt
     `reveal`  die Karte ist aufgedeckt (nach der Rückseite, ~1,5 s nach `win`)
     `leave`   der Held verlässt die Zone

   Mehr werden es nicht ohne Grund. Sechs Anlässe sind eine Dramaturgie; zwanzig sind ein Skript,
   und ein Skript will jemand pflegen.

   ── Was das Modul NICHT tut ─────────────────────────────────────────────────────────────────────
     · Es erfindet keinen Text. Ohne Beats ist eine Zone still — und das ist ein gültiger Zustand,
       kein Fehler.
     · Es kennt keine Bedingungen, Verzweigungen oder Zustände über `once` hinaus. Wer verzweigen
       will, schickt eine andere Story.
     · Es entscheidet nicht, WELCHE Story eine Zone bekommt. Das tut `bind()`, und aufgerufen wird
       es von außen — vom Runner, von einem Deck-Import, später von der NIE.

   ── Avatar-Skins (Georg 9.8., NICHT hier) ───────────────────────────────────────────────────────
   Die Idee, dass jedes gekaufte Deck einen Avatar-Skin freischaltet — **Trophäe, kein Skill** —,
   gehört in die Fortschritts- und Besitzschicht, nicht hierher. Eine Story darf einen Skin
   erwähnen; sie darf ihn nicht vergeben. */
(function(){
'use strict';

const ANLAESSE=['enter','guard','fight','win','reveal','leave'];
const stories=new Map();     // zoneKey → {id, beats:[…]}
const gespielt=new Map();    // zoneKey → Set der schon gespielten Beat-Indizes
let zaehler={gebunden:0,gespielt:0,still:0};

const keyOf=z=>z&&(z.zseed!=null?String(z.zseed):(z.biome||'?'));

function pruefe(beats,id){
  const gut=[],klagen=[];
  (beats||[]).forEach((b,i)=>{
    if(!b||!b.text){klagen.push('#'+i+' ohne Text');return;}
    if(!ANLAESSE.includes(b.on)){klagen.push('#'+i+' unbekannter Anlass »'+b.on+'«');return;}
    gut.push({on:b.on,who:b.who||'mob',text:String(b.text),
      type:b.type||'speech',once:b.once!==false});
  });
  if(klagen.length)console.warn('[story] »'+id+'« — '+klagen.length+' Beat(s) verworfen: '+klagen.join(' · '));
  return gut;
}

/* Wer spricht? Der Wächter, wenn es ihn gibt und er lebt; sonst der NÄCHSTE Mob; sonst niemand —
   dann geht der Satz ins Logbuch statt in eine Blase. *Ein Satz ohne Sprecher ist eine
   Bildunterschrift, keine Figur.*

   **Und ein Sprecher, den niemand sieht, ist schlechter als das Logbuch** (Befund 9.8.): der erste
   Anlauf nahm `da[0]`, also die Array-Reihenfolge, und prüfte nur, ob ein Mob **existiert**. Bei
   einer 18×10-Zone (1152×640 Weltpixel) und rund 924×540 Sichtfeld liegt die andere Zonenhälfte
   grundsätzlich außerhalb — und `enter` feuert genau am Rand. Gemessen: Sprecher 12,1 Felder
   entfernt, Bildschirmposition (1093,715) bei Viewport 924×540, Blase von der Klemmung in die linke
   obere Ecke geschoben, Zipfel ins Nichts. Der Satz hatte einen Sprecher, den es gibt und den
   niemand sieht — er behauptet eine Figur.

   Also zwei Bedingungen, für Wächter wie für jeden anderen: **der Nächste**, und er muss **im Bild**
   sein. `SICHT_FELDER 7` ist bewusst der Temperament-Radius aus v10-S2d — wer weiter weg ist,
   reagiert ohnehin nicht auf den Helden. */
const SICHT_FELDER=7, TILE=64;
function imBild(g,m){
  if(!g.cv)return true;
  const z=g.zoomEff?g.zoomEff():1, dpr=g.dpr||1;
  const vw=g.cv.width/dpr, vh=g.cv.height/dpr;
  const sx=(m.x-g.cam.x)*z+vw/2, sy=(m.y-g.cam.y)*z+vh/2;
  const rand=60;
  return sx>=-rand&&sx<=vw+rand&&sy>=-rand&&sy<=vh+rand;
}
function sprecher(g,z,who){
  if(who==='narrator')return null;
  const h=g.hero;
  const nah=m=>h?Math.hypot(m.x-h.x,m.y-h.y):1e9;
  const da=g.mobs.filter(m=>m.hp>0&&m.zone===z&&nah(m)<=SICHT_FELDER*TILE&&imBild(g,m))
                 .sort((a,b)=>nah(a)-nah(b));
  if(!da.length)return null;
  if(who==='guard'){
    const w=da.find(m=>m.guard||m.isGuard||(m.ai&&m.ai.guard));
    if(w)return w;
  }
  return da[0];
}

window.OW_STORY={
  version:'story-v1',
  ANLAESSE,
  /* Eine Story an eine Zone hängen. \`beats\` ist die Liste, \`id\` nur zum Wiedererkennen im Log. */
  bind(zone,beats,id){
    const k=keyOf(zone);if(!k)return null;
    const gut=pruefe(beats,id||k);
    if(!gut.length){stories.delete(k);return null;}
    stories.set(k,{id:id||k,beats:gut});
    gespielt.set(k,new Set());
    zaehler.gebunden++;
    return {zone:k,id:id||k,beats:gut.length};
  },
  unbind(zone){const k=keyOf(zone);stories.delete(k);gespielt.delete(k);},
  hat(zone){return stories.has(keyOf(zone));},
  /* **Der eine Aufruf des Runners.** Er meldet, was passiert ist; ob und wie daraus ein Satz wird,
     entscheidet das Modul. Gibt den gespielten Beat zurück oder \`null\` (= Stille, gültig). */
  beat(g,zone,anlass){
    const k=keyOf(zone);
    const st=stories.get(k);
    if(!st||!g||!zone){zaehler.still++;return null;}
    const schon=gespielt.get(k)||new Set();
    const i=st.beats.findIndex((b,j)=>b.on===anlass&&!(b.once&&schon.has(j)));
    if(i<0){zaehler.still++;return null;}
    const b=st.beats[i];
    if(b.once)schon.add(i);
    gespielt.set(k,schon);
    zaehler.gespielt++;
    const u=sprecher(g,zone,b.who);
    if(u&&window.OW_BUBBLE)OW_BUBBLE.zeigen(g,u,{text:b.text,type:b.type});
    else if(u&&g.say)g.say(b.text,2.2,b.type);
    else if(g.msg)g.msg(b.text);
    console.log('[story] '+st.id+' · '+anlass+' → '+(u?(u.unit&&u.unit.id):'Logbuch')+
      ' · "'+b.text+'"');
    return {beat:b,sprecher:u?(u.unit&&u.unit.id):null};
  },
  /* Alles wieder auf Anfang — für einen Weltneuaufbau, nicht für den Spielstand. */
  reset(){gespielt.forEach((s,k)=>gespielt.set(k,new Set()));
    zaehler={gebunden:zaehler.gebunden,gespielt:0,still:0};},
  report(){return Object.assign({stories:stories.size},zaehler,
    {ids:[...stories.values()].map(s=>s.id)});},
  note:'Gerüst ohne Inhalt. Sechs Anlässe, ein Aufruf. Die Beats kommen aus der NIE; '+
       'ohne Beats ist eine Zone still, und das ist gültig.',
};
})();
