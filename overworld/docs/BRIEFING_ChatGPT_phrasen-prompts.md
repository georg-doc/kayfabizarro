# Briefing für ChatGPT-WS — Phrasenvorrat und Prompt-Bausteine

**Von:** WS1 (Lead, Overworld-Runner) · **Stand:** 2026-08-09, nach V10-S14
**Für:** Ausarbeitung mit Georg, danach Test und Optimierung in seiner NIE
(Narrative Intelligence Engine), dann Review und Einbau hier und in WS0.

Du kennst den Masterplan. Was du **noch nicht** kennst, ist, was seit heute im Code steht — und
genau das bestimmt, welche Form deine Arbeit haben muss, damit sie ohne Umbau eingesetzt werden
kann. Deshalb zuerst der Ist-Stand, dann der Auftrag.

---

## 1 · Was gebaut ist (und deshalb nicht neu erfunden wird)

**Die Plauderei läuft.** `overworld/chatter-2d.js` ist die Laufzeit: sie entscheidet, **wer wann
was** sagt. Vier Quellen, in dieser Reihenfolge befragt — Feed · Karte · Fraktion · Emote —, dazu
Entprellung, Blasenverwaltung und die Regel, dass gewöhnliche Bewegung **still** ist.

**Der Vorrat liegt daneben.** `overworld/chatter-phrases.js` (`OW_PHRASES`) hält **acht Fraktionen**
mit je acht Feldern. Das ist die Datei, um die es hier geht.

**Die Blase ist bedienbar.** Linksklick auf eine Figur öffnet ihre Sprechblase mit sechs Knöpfen:
`attack · ask · taunt · philo · trade · leave`. Vier davon holen sich ihre Sprache aus dem Vorrat
(`ask → frage`, `philo → philo`, `taunt → spott`, `trade → handel`). Es gibt **kein** Dialogsystem
und es soll keines geben: die Antwort ist eine Blase, die Aktion eine Zeile im Verhalten.

**Der Stoff von außen kommt an.** `overworld/rss-2d.js` holt Schlagzeilen und bindet sie je Quelle
an eine Fraktion. Wichtig für dich: **eine Schlagzeile wird nie zitiert.** Sie geht als Bruchstück
in das Feld `ueber` — der Hof sagt »We have a file on »harbour tax«.«, die Höhle »Say »harbour tax«
again. It comes back wrong.« Die Welt liest keine Nachrichten vor, sie **verdaut** sie.

---

## 2 · Das Datenformat (bitte exakt so)

Eine Fraktion ist ein Objekt mit diesen Feldern:

```js
kingCourt:{
  ton:'procedural and polite, always speaks for someone higher up',
  idle:   ['The paperwork survived. We did not.', …],   // wenn nichts los ist
  ueber:  ['We have a file on »{X}«.', …],              // {X} = Schlagzeile/Kartentitel
  antwort:['Noted.','As per protocol.', …],             // kurze Erwiderung im Gespräch
  frage:  ['Do you have that in writing?', …],          // Knopf »ask«
  philo:  ['Order is what happens while nobody watches.', …],  // Knopf »philo«, Denkwolke
  spott:  ['That will go in the file.', …],             // Knopf »taunt«
  handel: ['Requisition forms are two zones east.'],    // Knopf »trade«
  emote:  'frage',    // bevorzugte Stimmung fürs eine Zeichen
}
```

Die acht bestehenden Fraktionen: `kingCourt · townsfolk · camp · wilds · cave · shore · frost ·
dungeon`.

**Sechs Zeilen je Feld, nicht dreißig.** Die Vielfalt entsteht aus **Quelle × Fraktion × Anlass**,
nicht aus Länge. Wer hundert Zeilen schreibt, baut ein Drehbuch; wer sechs schreibt, baut eine
Stimme. Wenn dir eine Fraktion zu eng wird, ist die Antwort eine **neue Fraktion**, nicht ein
längeres Feld.

**Sprache: Englisch.** Eigennamen bleiben deutsch: Puste · Witz · Schneid · **BLÖDSINN!** ·
Kayfabulation · Uncle FrizzleBob · King Kayfabian. Grußformel **Stay fluffy.**

**Länge:** eine Blase trägt rund 40 Zeichen bequem, 60 ist die Schmerzgrenze. `philo` darf länger
sein (Denkwolke), `antwort` soll kurz sein.

---

## 3 · Was gebraucht wird

### 3a · Der Vorrat, ausgebaut

Die acht Fraktionen sind angelegt, aber dünn — manche Felder haben zwei Zeilen. Ziel: **je Feld
sechs**, in der Haltung konsistent, ohne Wiederholung zwischen Fraktionen.

Und: **welche Fraktionen fehlen?** Der Masterplan kennt mehr Milieus als der Vorrat. Ein Vorschlag
für zwei bis vier weitere (mit Begründung, warum sie eine eigene Stimme brauchen und nicht eine
Spielart einer bestehenden sind) wäre wertvoller als hundert weitere Zeilen für die vorhandenen.

### 3b · Die Prompt-Bausteine

Das ist der eigentliche Auftrag. `ton` ist heute **ein Satz** — er soll später der Kern eines
LLM-Prompts sein. Gebraucht wird eine Struktur, die

- **aus demselben Material** funktioniert, das die Laufzeit ohnehin hat: Fraktion, Anlass
  (`idle/ask/philo/taunt/trade`), Quelle (Schlagzeile, Kartentitel, Ort), Laune, Zonenname;
- **ohne LLM einen Fallback** hat — der Vorrat aus 3a **ist** dieser Fallback, also darf die
  Prompt-Struktur nichts voraussetzen, was der Vorrat nicht auch liefern kann;
- **kurze Antworten erzwingt** (eine Blase, nicht ein Absatz);
- **den KFB-Ton trägt**: mehrschichtige Satire, Kayfabe als Ernst, Blödsinn als Methode — und
  **keine Erklärbär-Stimme**. Die Figuren wissen nicht, dass sie in einem Spiel sind, aber sie
  wissen, dass die Welt nicht stimmt.

**Eine Frage, die du beantworten sollst, statt sie zu umgehen:** wie viel Kontext braucht eine
brauchbare Antwort wirklich? Je mehr Kontext, desto teurer und langsamer. Ein Vorschlag mit
**Stufen** (was geht mit 200 Zeichen Prompt, was mit 800, was mit 2000) ist nützlicher als ein
maximaler Prompt.

### 3c · Die Skalierung 18+/NSFW

Georgs Idee: KFB-Level ähnlich einer Bloom-Taxonomie. Das ist **Konzeptarbeit**, keine Zeilenarbeit
— gebraucht wird die **Achse** (was genau steigt: Derbheit? Zynismus? Politische Schärfe?
Metaebene?) und wie sie sich auf `ton` und die Felder auswirkt, ohne dass acht Fraktionen × vier
Stufen zu 32 Vorräten werden.

---

## 4 · Was ausdrücklich **nicht** gebraucht wird

- **Keine Laufzeit.** Kein `chatter-seeds.js`, kein Zustandsautomat, kein Auswahlalgorithmus. Die
  Entscheidung, wer wann spricht, gehört `chatter-2d.js` und bleibt beim Lead. Das ist keine
  Zuständigkeitsfrage, sondern eine Fehlerquelle: zwei Automaten für eine Frage laufen beim nächsten
  Fork auseinander.
- **Keine Zahlen, keine Werte, keine Punktestände** in Texten. Kanon K1: Karten sind Beweisstücke,
  keine Powers.
- **Keine fertigen Dialoge**, keine Bäume, keine Antwortketten. Sechs Knöpfe, eine Blase.
- **Kein zweiter Ton für Emotes.** Ein Zeichen je Blase, gewählt über `emote`.

---

## 5 · Wie es zurückkommt

Am liebsten als **eine Datei im Format von §2** (JS-Objekt oder JSON, beides geht) plus ein kurzes
Dokument mit den Entscheidungen: welche Fraktionen neu und warum, wie die Prompt-Stufen aussehen,
wie die 18+-Achse gedacht ist.

Danach: Georg testet in der NIE, wir prüfen hier gegen die Laufzeit (die Felder müssen belegt sein,
die Längen passen, kein Feld leer), und WS0 bekommt die Emote-Zuordnung für das PNG-Set.

**Stay fluffy.**
