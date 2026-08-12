/* KFB Overworld — Fraktions-Phrasen (v10-S10 · phrases-v1)
   ------------------------------------------------------------------------------------------------
   **Warum eine eigene Datei, und warum Daten statt Code.** Bis heute lagen drei Platzhalter-Zeilen
   je Biom in `chatter-2d.js` — die Insel redete, aber alle klangen gleich. Living Concept §59 und
   das WS0-Briefing verlangen dasselbe: **Stil-Grundzüge je Fraktion, keine fertigen Dialoge.**
   Wer eine Quelle (Karte, Schlagzeile, Ort) durch eine Fraktion schickt, soll ihre Haltung hören,
   nicht ihren Wortlaut wiederholen.

   **Was eine Fraktion hier hat:**
     `ton`      — ein Satz, der die Haltung beschreibt (später auch der Kern des LLM-Prompts)
     `idle`     — was sie sagt, wenn nichts los ist
     `ueber`    — wie sie **über etwas** redet: `{X}` wird durch das Bruchstück ersetzt
     `antwort`  — kurze Erwiderungen im Gespräch
     `frage`    — was sie zurückfragt (Knopf »ask«)
     `philo`    — die Denkwolke (Knopf »philo«)
     `spott`    — nach einem »taunt«
     `handel`   — auf »trade«
     `emote`    — bevorzugte Stimmung für das eine Zeichen (siehe KEY in chatter-2d.js)

   **Die Regel dahinter:** keine ganzen Gespräche hier hineinschreiben. Sechs kurze Zeilen je Feld
   reichen — die Vielfalt entsteht aus **Quelle × Fraktion × Anlass**, nicht aus Länge. Wer hundert
   Zeilen schreibt, baut ein Drehbuch; wer sechs schreibt, baut eine Stimme.

   **Eigentum:** die Laufzeit gehört dem Lead, dieser Vorrat ist **Inhalt** — WS0 darf ihn erweitern
   (Masterplan §6b). Deshalb steht hier nichts als Code, nur benannte Listen. */
(function(){
'use strict';

const F={
  /* Der Hof — höflich, verwaltend, immer eine Instanz im Rücken. */
  kingCourt:{
    ton:'procedural and polite, always speaks for someone higher up',
    idle:['The paperwork survived. We did not.','By order, this is a good day.',
          'Kindly do not touch the seal.','Someone signed for this.'],
    ueber:['We have a file on »{X}«.','»{X}« was submitted. Twice.','Regarding »{X}«: noted.'],
    antwort:['Noted.','As per protocol.','That is one view.','It is filed.'],
    frage:['Do you have that in writing?','And your authority is…?','Shall I record this?'],
    philo:['Order is what happens while nobody watches.','A rule outlives the reason for it.'],
    spott:['That will go in the file.','Your tone has been recorded.'],
    handel:['Requisition forms are two zones east.'],
    emote:'frage',
  },
  /* Städter — beschäftigt, praktisch, leicht genervt. */
  townsfolk:{
    ton:'busy, practical, mildly annoyed by adventurers',
    idle:['The fence moved again.','Mind the bucket.','Not now, I am counting.'],
    ueber:['They keep talking about »{X}«.','»{X}«? That is a city problem.'],
    antwort:['Sure.','If you say so.','Uh-huh.','Move along, then.'],
    frage:['Are you buying or blocking?','Do you know how heavy this is?'],
    philo:['A day is what you carry across it.','Nothing is far if you walk early.'],
    spott:['Say that to the baker.','Big words, small basket.'],
    handel:['Come back when I have hands free.'],
    emote:'verwirrt',
  },
  /* Goblins/Lager — misstrauisch, opportunistisch, immer eine Verschwörung im Kopf. */
  camp:{
    ton:'paranoid and opportunistic, everything is a scheme',
    idle:['Somebody moved the fence again.','Third watch. Nobody told me.',
          'That is not how you hold it.','I did not agree to this.'],
    ueber:['»{X}«. That is how they get you.','Who profits from »{X}«? Exactly.',
           'They say »{X}«. They would.'],
    antwort:['Says you.','Convenient.','Sure. Sure.','Not what I heard.'],
    frage:['Who sent you?','What is in it for me?','You are not with them, are you?'],
    philo:['Everyone is somebody else\u2019s plan.','A gift is a debt with better manners.'],
    spott:['Try that closer.','Loud for someone alone.'],
    handel:['Show the goods first.'],
    emote:'wut',
  },
  /* Wildnis — knapp, aufmerksam, redet vom Ort statt von sich. */
  wilds:{
    ton:'sparse and watchful, speaks about the place rather than itself',
    idle:['Something walked here. Not us.','The trees count us.','I liked the quiet.'],
    ueber:['»{X}« does not grow here.','The wood has heard »{X}« before.'],
    antwort:['Hm.','Quieter.','It passes.','If you must.'],
    frage:['Did you come alone?','Do you hear that too?'],
    philo:['A path is a wound that healed wrong.','What waits is not always patient.'],
    spott:['The wood repeats that.','Louder, then. See who comes.'],
    handel:['Take what falls. Not what stands.'],
    emote:'gedanke',
  },
  /* Höhle — Echo, Wiederholung, Zeit ohne Uhr. */
  cave:{
    ton:'echoing and repetitive, time without a clock',
    idle:['Drip. Drip. Same drip.','I know that echo. It knows me.','Down is further than they said.'],
    ueber:['»{X}« sounds different in here.','Say »{X}« again. It comes back wrong.'],
    antwort:['…again?','It repeats.','So it goes.','Down here, yes.'],
    frage:['How long have you been walking?','Did you count the turns?'],
    philo:['Every echo is a smaller lie.','Dark is only a room you did not finish.'],
    spott:['The wall said it better.','Even the drip is bored.'],
    handel:['Nothing here is for sale. It is just here.'],
    emote:'verwirrt',
  },
  /* Frost — sachlich, kalt, buchhalterisch. */
  frost:{
    ton:'flat and cold, keeps a tally',
    idle:['My hands stopped arguing.','Snow keeps the tally.','Nothing rots here. Nothing leaves.'],
    ueber:['»{X}« will keep. Everything keeps.','Write »{X}« in the snow. See how long.'],
    antwort:['Noted, coldly.','It holds.','For now.'],
    frage:['How long can you stand still?','Do you feel that yet?'],
    philo:['Cold is honest. It says the same thing to everyone.'],
    spott:['Warm words. Cold ground.'],
    handel:['Trade later. Fingers first.'],
    emote:'schmerz',
  },
  /* Küste — Handel, Gerüchte, alles kommt und geht. */
  shore:{
    ton:'transactional and gossipy, everything arrives and leaves',
    idle:['The tide took the marker.','Salt in the paperwork.','Boats come back emptier.'],
    ueber:['»{X}« came in on the last boat.','Two people already sold me »{X}«.'],
    antwort:['For a price.','Heard it twice today.','Depends who is asking.'],
    frage:['Buying, selling, or watching?','What did you bring?'],
    philo:['The sea does not keep accounts. That is why we do.'],
    spott:['Say it to the harbour master.'],
    handel:['Now we are talking. Later, though.'],
    emote:'fluch',
  },
  /* Verlies/Knochen — trocken, existenziell, ohne Eile. */
  dungeon:{
    ton:'deadpan and existential, in no hurry at all',
    idle:['Bones do not gossip. They confirm.','It moved. Do not tell the others.','Rest is a rumour here.'],
    ueber:['»{X}«. We had one of those.','»{X}« outlived somebody.'],
    antwort:['Eventually.','It ends the same.','Was it?','Give it time.'],
    frage:['Do you know how you will go?','Are you in a hurry?'],
    philo:['Everyone is temporary staff.','The floor remembers more than the walls.'],
    spott:['Bold, for something with skin.','You will be quieter later.'],
    handel:['I have nothing. That is the point.'],
    emote:'totenkopf',
  },
};
/* **Tätigkeitsgedanken** (v10-S18, ChatterBox S1 §17D). Nicht jeder Gedanke muss Handlung sein:
   ein Schaf beim Grasen, ein Goblin beim Schürfen, ein Skelett auf dem Friedhof. Der Gedanke handelt
   von der **Tätigkeit selbst**, nicht vom Plot — das ist der billigste Weg zu Innenleben, den es
   gibt, und er braucht weder Quest noch LLM.
   Sie werden **selten** gezogen: wenn jedes Wesen dauernd denkt, wird die Welt zu Untertiteln. */
const TAETIGKEIT={
  critter:['This grass again.','Nobody watches the fence.','I have opinions about the wind.',
           'The good spot is taken.'],
  arbeit: ['Arbeitstiere, das sind wir…','Gold is heavy.','This hole was my idea.',
           'Nobody counts what I carry.'],
  wache:  ['Nothing. Again nothing.','I could be inside.','Standing is also work.',
           'Something moved. Probably me.'],
  knochen:['I miss having knees.','It was warmer before.','Somebody rearranged me.'],
};

/* Wer keine Fraktion hat, bekommt keinen Notvorrat, sondern den des Bioms — und wenn das auch
   fehlt, `camp`. Eine Stimme, die niemandem gehört, klingt nach niemandem. */
const FALLBACK='camp';

window.OW_PHRASES={
  version:'phrases-v1',
  F,FALLBACK,
  fraktionen(){return Object.keys(F);},
  hat(k){return !!F[k];},
  /* Ein Feld einer Fraktion, gewürfelt. `X` ersetzt den Platzhalter in `ueber`. */
  zeile(key,feld,rnd,X){
    const f=F[key]||F[FALLBACK];
    const l=(f&&f[feld])||null;
    if(!l||!l.length)return null;
    let s=l[Math.floor((rnd||Math.random)()*l.length)];
    if(X!=null)s=s.replace('{X}',X);
    return s;
  },
  TAETIGKEIT,
  /* Was denkt jemand, der gerade etwas tut? `was` ist grob: critter · arbeit · wache · knochen. */
  taetigkeit(was,rnd){
    const l=TAETIGKEIT[was];if(!l||!l.length)return null;
    return l[Math.floor((rnd||Math.random)()*l.length)];
  },
  ton(key){return (F[key]||F[FALLBACK]).ton;},
  emote(key){return (F[key]||F[FALLBACK]).emote;},
  note:'Stil-Grundzüge je Fraktion, keine fertigen Dialoge. Inhalt (WS0 darf erweitern), '+
       'Laufzeit gehört chatter-2d.js.',
};
})();
