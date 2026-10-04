/* KFB Overworld — Spielername, Titel und die Schmähung (v10-S20 · ident-v1)
   ------------------------------------------------------------------------------------------------
   Drei Dinge, die zusammengehören und deshalb in einer Datei stehen:

   **1 · Der Name.** Der Spieler heißt, wie er heißt. Er steht neben dem Avatar, nicht in einem
   eigenen Fenster (ChatterBox §10).

   **2 · Der Titel.** Eine Trophäe, kein Wert — Kanon K1 gilt: keine Zahlen, keine Boni. Anfangs
   **Newbie**, alle weiteren werden **verdient**. »Kein Titel« ist eine gültige Wahl.
   Wichtig: der Titel ist *sozial*, nicht *mechanisch*. Er ändert nichts am Kampf, er ändert, wie
   über einen geredet wird.

   **3 · Die Schmähung** (Georgs Kern, 9.8.). Wer eine Fraktion beleidigt, wird beleidigt — mit
   **Namen und Titel**. Das Schwein, das dreimal grundlos abgestochen wurde, denkt beim vierten Mal
   nicht »ein Mensch«, sondern »da kommt wieder [Titel] [Name], die alte Dreck-SAU!«.
   Das ist die erste Stelle, an der die Welt den Spieler **persönlich** kennt — und sie kostet fast
   nichts, weil Ruf (`journey.js`) und Plauderei (`chatter-2d.js`) beide schon laufen.

   **Die Eskalationskette** (KISS, Georg 9.8.):
       Ruf sinkt → Schmährufe → weitere Schmährufe → Angriff
   Der Übergang ist eine **Schwelle im Ruf**, kein eigener Zustandsautomat. Wer tief genug unten ist,
   wird angegriffen, ohne dass der Spieler etwas tut — und vorher hat er es dreimal gehört.

   **Was hier NICHT passiert:** kein Titel wird vergeben (das tut, wer die Tat sieht), kein Ruf wird
   verändert, keine Blase wird gezeichnet. Diese Datei weiß, **wer** der Spieler ist und **was man
   ihm nachruft** — mehr nicht. */
(function(){
'use strict';

const KEY='kfb-ow-ident';
/* v10-S20b · Der Standard war `{name:'Newbie', titel:'Newbie'}` — und weil `wer()` beides
   zusammensetzt, hieß jeder frische Spieler **»Newbie Newbie«**, auch im Schmähruf. ChatterBox §10
   meint es anders: der **Titel** ist per Vorgabe »Newbie«, der **Name** gehört dem Spieler.
   Bis er ihn setzt, steht dort ein Platzhalter, der nicht so tut, als wäre er eine Wahl. */
const STANDARD={name:'Someone',titel:'Newbie'};

/* Titel als **Trophäen**: Bedingung, Titel, und wo er herkommt. Die Bedingung ist eine Funktion über
   den Spielstand — keine Punktetabelle, keine Freischaltlogik anderswo.
   Bewusst wenige. Ein Titel, den jeder hat, ist kein Titel. */
const TITEL=[
  {id:'newbie',  name:'Newbie',              woher:'the start',
   hat:()=>true},
  {id:'pigsbane',name:'Scourge of Swine',    woher:'three pigs, no reason given',
   hat:s=>(s.hunt|0)>=3},
  {id:'evidence',name:'Keeper of Evidence',  woher:'three cards secured',
   hat:s=>(s.collected|0)>=3},
  {id:'unwelcome',name:'The Unwelcome',      woher:'far enough down in somebody\'s books',
   hat:s=>Math.min(...Object.values(s.rep||{0:0}))<=-8},
  {id:'loud',    name:'Professionally Loud', woher:'ten shouts',
   hat:s=>(s.shouts|0)>=10},
  /* **ZURÜCKGENOMMEN am 11.8. (Georg): der Titel ist englisch.** Am 10.8. stand hier das Gegenteil,
     mit dem Argument, »Leichenfledderer« sei ein Eigenname wie BLÖDSINN! oder King Kayfabian. Das
     Argument stimmt für die Eigennamen — aber ein **Titel ist keine Marke, sondern eine Beschriftung
     des Spielers**, und die Beschriftung der Oberfläche ist durchgehend englisch. Georgs Regel:
     »grundsätzlich wollen wir das Interface auf Englisch halten, auch der Titel.«
     BLÖDSINN!, Kayfabulation und King Kayfabian bleiben, was sie sind: Namen, keine Beschriftung.
     Alte Spielstände, die »Leichenfledderer« gespeichert haben, werden beim Laden umgeschrieben
     (siehe UMBENANNT) — sonst zeigt das Blatt einen Titel, den es nicht mehr gibt. */
  {id:'fledderer',name:'Grave Robber',        woher:'the first card out of a cleared grave',
   hat:s=>(s.collected|0)>=1},
];

/* Was man einem nachruft. `{who}` wird durch »Titel Name« ersetzt — oder nur den Namen, wenn keiner
   gewählt ist. Grob nach Fraktion, damit ein Hofbeamter anders schimpft als ein Schwein.
   Sechs je Lage, wie überall: die Vielfalt kommt aus der Lage, nicht aus der Länge. */
const SCHMAEHUNG={
  tier:     ['Here comes {who} again. The old dirt-SOW.',
             '{who}. Of course it is {who}.',
             'That one eats standing up.',
             'Somebody should count the fences {who} broke.'],
  kingCourt:['{who} is in the file. Twice.',
             'We are aware of {who}.',
             'Kindly keep {who} away from the seal.'],
  townsfolk:['{who} again. Hide the buckets.',
             'Last time {who} came, we counted afterwards.',
             'Nobody invited {who}.'],
  camp:     ['{who}. I told you they would come back.',
             'Somebody is paying {who}. Has to be.',
             'Watch the hands on {who}.'],
  wilds:    ['The wood remembers {who}.',
             'Something walked here. {who} did.',
             '{who} leaves a wide trail.'],
  cave:     ['Even the echo is tired of {who}.',
             '{who}. Again. Again. Again.'],
  '*':      ['{who}. Wonderful.',
             'Look who it is.',
             '{who} — the one from the stories. The bad ones.'],
};

/* Ab hier wird geschmäht, ab hier geschlagen. Zwei Zahlen, eine Reihenfolge — der Spieler hört es,
   bevor es weh tut. Das ist der ganze »Automat«. */
const SCHWELLE_SPOTT=-3, SCHWELLE_ANGRIFF=-9;

/* Umbenannte Titel. Gespeichert wird der NAME, nicht die Kennung (setTitel nimmt einen String) —
   also muss eine Umbenennung die Spielstände mitnehmen, sonst trägt der Spieler einen Titel, der in
   TITEL nicht mehr vorkommt: das Blatt zeigt ihn, die Liste kennt ihn nicht, und kein Klick bringt
   ihn zurück. Eine Zeile je Umbenennung, für immer. */
const UMBENANNT={'Leichenfledderer':'Grave Robber'};
let ident=null;
function laden(){
  if(ident)return ident;
  try{ident=Object.assign({},STANDARD,JSON.parse(localStorage.getItem(KEY)||'{}'));}
  catch(e){ident=Object.assign({},STANDARD);}
  if(ident.titel&&UMBENANNT[ident.titel]){ident.titel=UMBENANNT[ident.titel];sichern();}
  return ident;
}
function sichern(){try{localStorage.setItem(KEY,JSON.stringify(ident));}catch(e){}}

window.OW_IDENT={
  version:'ident-v1',
  TITEL,SCHMAEHUNG,SCHWELLE_SPOTT,SCHWELLE_ANGRIFF,
  get(){return Object.assign({},laden());},
  setName(n){laden();ident.name=String(n||'').slice(0,18)||STANDARD.name;sichern();return ident.name;},
  /* `null` ist gültig: »kein Titel« ist eine Wahl, kein Fehler. */
  setTitel(t){laden();ident.titel=t==null?null:String(t).slice(0,28);sichern();return ident.titel;},
  /* Die sichtbare Kennung: »Titel Name« oder nur »Name«. Eine Zeile, ein Ort — HUD und Plauderei
     lesen dieselbe. */
  wer(){const i=laden();return i.titel?(i.titel+' '+i.name):i.name;},
  /* Welche Titel sind verdient? `stand` ist ein flaches Objekt, damit diese Datei den Spielstand
     nicht kennen muss: {hunt, collected, rep, shouts}. */
  verdient(stand){return TITEL.filter(t=>{try{return t.hat(stand||{});}catch(e){return false;}});},
  /* v10-S20b · **Verdienen war eine Rechnung ohne Aufrufer.** `verdient()` gab es, aber niemand
     fragte — ein Titel konnte im Spiel nie entstehen. `pruefe()` schließt die Lücke: es meldet die
     **neu** dazugekommenen zurück (und merkt sich, welche schon gemeldet waren), damit der Runner
     sie ins Logbuch schreiben kann, ohne selbst Buch zu führen.
     Vergeben wird **nicht automatisch getragen**: ein Titel ist eine Wahl, kein Aufkleber. */
  pruefe(stand){
    laden();
    /* **Ergänzen, nicht ersetzen.** Der erste Anlauf schrieb `verdienteTitel = alle` — also die
       Momentaufnahme dessen, was **gerade** qualifiziert. Damit fielen Titel wieder heraus, sobald
       ihre Bedingung nicht mehr galt: `hunt` ist ein Sitzungszähler und steht nach jedem Neuladen
       auf 0, `unwelcome` hängt am Ruf und der erholt sich. Gemessen: Besitz
       `[newbie, pigsbane]` → nach einem anderen Titel `[newbie, evidence]`, pigsbane still weg —
       und beim nächsten Mal wurde er ein zweites Mal »verdient«, mit zweitem Logbuch-Eintrag.
       *Eine Trophäe, die man wieder verlieren und noch einmal gewinnen kann, ist keine.* */
    const alle=window.OW_IDENT.verdient(stand).map(t=>t.id);
    const hatte=ident.verdienteTitel||[];
    const neu=alle.filter(id=>hatte.indexOf(id)<0);
    if(neu.length){ident.verdienteTitel=hatte.concat(neu);sichern();}
    return neu.map(id=>TITEL.filter(t=>t.id===id)[0]);
  },
  besitz(){return (laden().verdienteTitel||['newbie']).slice();},
  /* Was ruft mir diese Fraktion nach? `rep` ist ihr Ruf; über der Schwelle schweigt sie. */
  schmaehung(fraktion,rep,rnd){
    if((rep|0)>SCHWELLE_SPOTT)return null;
    const l=SCHMAEHUNG[fraktion]||SCHMAEHUNG['*'];
    const s=l[Math.floor((rnd||Math.random)()*l.length)];
    return s.split('{who}').join(window.OW_IDENT.wer());
  },
  /* Greift diese Fraktion von sich aus an? Der Übergang ist eine Schwelle, kein Automat. */
  greiftAn(rep){return (rep|0)<=SCHWELLE_ANGRIFF;},
  note:'Name + Titel + Schmähung. Titel sind Trophäen, keine Werte (K1). '+
       'Die Eskalation ist eine Ruf-Schwelle, kein zweiter Zustandsautomat.',
};
})();
