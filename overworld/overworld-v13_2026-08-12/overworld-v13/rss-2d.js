/* KFB Overworld — RSS-Leitung (v10-S13 · rss-v1)
   ------------------------------------------------------------------------------------------------
   **Der Anschluss lag seit v10-S3b bereit** (`OW_CHATTER.setFeed`), die Leitung fehlte. Das hier ist
   die Leitung — und ausdrücklich ein **PoC**, kein Nachrichtendienst.

   **Drei Dinge, die man wissen muss, bevor man daran baut:**

   1. **Der Browser kann RSS nicht direkt lesen.** Fast kein Feed schickt CORS-Kopfzeilen, also
      scheitert `fetch` an fremden Adressen. Wir gehen über einen **Vermittler** (`PROXY`), der die
      Antwort mit erlaubender Kopfzeile weiterreicht. Das ist der Grund, warum diese Datei
      existiert — nicht das Parsen.
   2. **Ground.news geht nicht** (geprüft 9.8.): die Artikel sind hinter einem Abo, öffentliche Feeds
      gibt es nicht mehr. Die Quellenliste unten ist deshalb austauschbar; wer eine andere Adresse
      hat, trägt sie ein.
   3. **Der Vorrat ist der Normalfall, nicht der Notnagel.** Ein Export muss offline laufen und im
      Abnahmefall dieselben Zeilen liefern — also liegt in `VORRAT` je Fraktion ein fester Satz
      Schlagzeilen, und das Netz **überschreibt** ihn nur, wenn es antwortet. Auf »läuft« gaten,
      nie auf »existiert«.

   **Was am Ende ankommt:** kein Zitat. `chatter-2d.js` schickt die Schlagzeile als Bruchstück durch
   `OW_PHRASES` — der Höhlenbewohner sagt »Say »harbour tax« again. It comes back wrong.«, der Hof
   »We have a file on »harbour tax«.«. Die Welt liest keine Nachrichten vor, sie **verdaut** sie.

   Standard: **aus**. Wer die Insel ans Netz hängen will, ruft `OW_RSS.start(game)`. */
(function(){
'use strict';

/* Vermittler. Zwei Adressen, damit ein Ausfall nicht das Ende ist. `{u}` = die Feed-Adresse. */
const PROXY=[
  'https://api.allorigins.win/raw?url={u}',
  'https://corsproxy.io/?{u}',
];

/* Quelle → Fraktion. Die Zuordnung ist die halbe Miete: eine Wirtschaftsmeldung im Hof klingt
   anders als dieselbe Meldung im Lager. Wer eine Quelle tauscht, tauscht eine Haltung. */
const QUELLEN=[
  {an:'kingCourt', url:'https://feeds.bbci.co.uk/news/politics/rss.xml'},
  {an:'townsfolk', url:'https://feeds.bbci.co.uk/news/business/rss.xml'},
  {an:'camp',      url:'https://feeds.bbci.co.uk/news/world/rss.xml'},
  {an:'wilds',     url:'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml'},
  {an:'cave',      url:'https://feeds.bbci.co.uk/news/technology/rss.xml'},
  {an:'shore',     url:'https://feeds.bbci.co.uk/news/world/europe/rss.xml'},
];

/* Der feste Vorrat. Absichtlich **gewöhnliche** Schlagzeilen: die Komik entsteht daraus, dass eine
   Höhle darüber redet, nicht daraus, dass die Zeile schon lustig ist. */
const VORRAT={
  kingCourt:['Council delays vote on harbour tax','Ministry announces review of the review',
             'Committee cannot agree on agenda','Seal of office reported missing'],
  townsfolk:['Bread prices up again this quarter','Market stalls to move two streets east',
             'Fence dispute enters third year','Bucket shortage blamed on weather'],
  camp:['Border patrol doubled after sighting','Trade route closed without notice',
        'Unnamed source denies everything','Supplies arrive short by a third'],
  wilds:['Forest survey finds fewer birds','River runs low for a second summer',
         'Migration arrives eleven days early','Old growth mapped for the first time'],
  cave:['System outage enters fourth hour','Signal lost in the lower tunnels',
        'Update rolled back after complaints','Nobody can reproduce the fault'],
  shore:['Ferry delayed by weather again','Cargo manifest does not match the hold',
         'Harbour dues rise for small boats','Tide marker washed away overnight'],
  frost:['Record cold recorded at the pass','Supply road closed until spring'],
  dungeon:['Excavation halted pending inquiry','Remains dated older than expected'],
};

let laeuft=false, uhr=null, stand={netz:0,vorrat:0,fehler:0,letzte:null};

const sauber=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/&[a-z]+;/gi,' ')
  .replace(/\s+/g,' ').trim();

/* RSS **und** Atom, ohne Bibliothek: der DOMParser liegt im Browser. Ein Feed, den man nicht
   parsen kann, gibt eine leere Liste zurück — kein Wurf, keine halbe Wahrheit. */
function titel(xml){
  try{
    const d=new DOMParser().parseFromString(xml,'text/xml');
    if(d.querySelector('parsererror'))return [];
    const knoten=[...d.querySelectorAll('item > title, entry > title')];
    return knoten.map(n=>sauber(n.textContent)).filter(t=>t.length>12&&t.length<110).slice(0,12);
  }catch(e){return [];}
}
async function holen(url){
  for(const p of PROXY){
    try{
      const r=await fetch(p.replace('{u}',encodeURIComponent(url)),{cache:'no-store'});
      if(!r.ok)continue;
      const t=await r.text();
      const li=titel(t);
      if(li.length)return li;
    }catch(e){}
  }
  return null;
}

/* Erst den Vorrat legen, dann versuchen zu ersetzen. So redet die Insel ab der ersten Sekunde —
   und wenn das Netz antwortet, redet sie über heute. */
function vorratLegen(){
  const C=window.OW_CHATTER;if(!C)return 0;
  let n=0;
  for(const k in VORRAT){C.setFeed(k,VORRAT[k]);n++;}
  stand.vorrat=n;
  return n;
}
async function runde(){
  const C=window.OW_CHATTER;if(!C)return;
  for(const q of QUELLEN){
    const li=await holen(q.url);
    if(li&&li.length){C.setFeed(q.an,li);stand.netz++;stand.letzte=li[0];}
    else stand.fehler++;
  }
  console.log('[rss] Runde · Netz '+stand.netz+' · Fehlschläge '+stand.fehler+
    (stand.letzte?' · zuletzt: "'+stand.letzte+'"':''));
}

window.OW_RSS={
  version:'rss-v1',
  PROXY,QUELLEN,VORRAT,
  /* `start()` legt sofort den Vorrat und fragt danach das Netz. Alle 10 Minuten neu — häufiger wäre
     Lärm, seltener merkt es niemand. */
  async start(g,ms){
    vorratLegen();
    if(laeuft)return stand;
    laeuft=true;
    await runde();
    uhr=setInterval(runde,Math.max(60000,ms||600000));
    return stand;
  },
  stop(){laeuft=false;if(uhr)clearInterval(uhr);uhr=null;},
  /* Nur der Vorrat, ohne Netz — das ist der Abnahmeweg und der Standard im Export. */
  offline(){return vorratLegen();},
  stand(){return Object.assign({laeuft},stand);},
  note:'PoC. Ground.news bietet keine öffentlichen Feeds mehr (geprüft 9.8.); Quellen sind '+
       'austauschbar. Der Vorrat ist der Normalfall, das Netz überschreibt ihn nur bei Antwort.',
};
})();
