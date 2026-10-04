# Übergabe an ChatGPT — Ideation-Kontext und Work-Slices

**Von:** WS1 (Lead) · **Stand:** 10. August 2026, nach V10-S23
**Zweck:** Georg riffelt drüben weiter, hier wird geplant. Das hier ist der Kontext, damit die
Ideation nicht gegen Gebautes läuft — und die Aufträge, die daraus schon fällig sind.

---

## 0 · Die Statusspalte, damit nichts doppelt gebaut wird

Jeder Punkt trägt einen: `BUILT` · `PARTIAL` · `OPEN` · `HOOK` · `DEFERRED` · `REJECTED`.
Das ist die Lehre vom 10.8., als eine »build now«-Liste fünf fertige Punkte enthielt.

---

## 1 · Was heute NEU dazugekommen ist (Georgs Ideation, eingeordnet)

### 1a · Sidescroller-Assets in Top-down — statt 3D zuerst

| Punkt | Status | Kommentar |
|---|---|---|
| Treasure Hunters / Kings & Pigs als Quelle | `OPEN` | **Bessere Idee als der 3D-Ball.** Selber Autor wie Tiny Swords, also derselbe Strich — kein Stilbruch, kein neuer Renderpfad, kein Schattenproblem. Der 3D-Ball löst eine Frage, die wir gerade erst in 2D beantwortet haben (»wo steht etwas?«) |
| Pirate Captain, King Kayfabian, Mini-Pigs | `OPEN` | Die Animationsmenge ist der eigentliche Gewinn. Was fehlt: Seitenansicht-Sprites haben **keine vier Richtungen** — geklärt werden muss, ob sie stehen (Thron, Marktplatz) oder laufen |
| 3D-Ball-POC | `DEFERRED` | Nicht verworfen. Nach den Lulls-Skins, die dieselbe Physik in 2D klären |

### KORREKTUR (Georg, 10.8.) — die Schweine laufen, und das Profil ist die Pointe

Meine Einordnung oben war die vorsichtige, und sie war falsch. Georgs Satz dazu:

> *Ich habe noch niemand gesehen, der das einfach mal macht — und schaut, was passiert.*

**Der Grund, warum es trägt:** ein Sidescroller-Sprite bleibt **immer im Profil**. Läuft es durch
eine Top-down-Welt, läuft es sichtbar falsch — es dreht sich nicht, egal wohin es geht. Das ist
kein Darstellungsfehler, sondern die **Enthüllung, dass die Figur flach ist**. Genau das ist die
Aussage: Papierfiguren auf Papiergras.

Und die Szene, die Georg daraus baut, ist deren Vollendung:

```
Schweineherde laeuft im Profil ueber Papiergras
   -> prallt gegen die Gummi-Ink-Outline der Kartenzone
   -> bouncet als MULTIBALL durch die Zone
   -> zerstaeubt den roten Teppich
   -> darunter: eine Comic-Spielkarte, nackter Kaiser (Kayfabe-Powerplay-Deck)
   -> der 2D-Koenig wirbelt vom Aufprall um die eigene Achse
      und stellt dabei seine eigene Flachheit bloß
   -> die Burger-King-Krone kullert vor die Fuesse des Spielers
   -> "Wanna be King?"
```

**Vier Dinge machen das stark.** Der Zusammenstoss nutzt die **Gummikante**, die seit v6-S12 liegt.
Die Enthuellung liegt **unter** etwas, statt daneben. Der Koenig entlarvt sich **durch Physik**,
nicht durch einen Satz. Und am Ende steht kein Gewinn, sondern eine **Frage** — die Krone gehoert
damit zu den Meta-Sprites: ein Gegenstand, der etwas will.

**Die eine Grenze:** es funktioniert **einmal**. Wenn alle Schweine immer so laufen, ist das Profil
Standard und niemand sieht es mehr. Der Bruch braucht eine Welt, die sonst funktioniert —
*eine Enthuellung, die staendig passiert, ist eine Textur.*

**3D ist zurueckgestellt** (Georg 10.8.): nicht KISS.

**Was bleibt** von meiner ersten Einordnung: an **Orten** (Thron, Buehne, Zelle) liest sich ein
Seitenansicht-Sprite ohnehin, das ist der ruhige Fall. Der König sitzt, der Narr steht auf einer Kiste, die
Propaganda-Schweine stehen in Reihe. Wer laufen soll, braucht vier Richtungen — und die gibt es dort
nicht. *Ein Sidescroller-Sprite ist ein Standbild mit Charakter, kein Wandler.*

### 1b · Der König, die Propaganda-Schweine und der Jackpot

| Punkt | Status |
|---|---|
| **King Kayfabian auf dem Zentralturm**, schwebende Pixelkrone (Burger-King-Stil) über dem erhabenen Haupt | `OPEN` — der Turm existiert seit v5.1, der König sitzt schon auf der Krone |
| **Propaganda-Schweine als Jubelperser**, bis der König abgesetzt oder von den eigenen gefressen wird | `OPEN` |
| **Nachfolge per Slot-Machine-Orakel**: wer dreimal angezeigt wird, bekommt den Kayfabe-Jackpot und wird König | `OPEN` — **koppelt die semantische Slot Machine an die Weltordnung**, das ist die stärkste Verbindung im ganzen Paket |
| **Zensur-Mönch** in Fraktur-Font, Signature Words, Mainstream-Buzzwords | `OPEN` |
| **Critical Thinking als Closure-Übung** | `ENTSCHIEDEN` als Haltung |

**Warum der Jackpot-König gut ist:** er macht aus einem Möbel (Slot Machine) eine **Regel** — und
die Regel ist selbst die Satire. Niemand wird König, weil er etwas kann; er wird es, weil dreimal
dasselbe Symbol fiel. Das ist Kayfabe in Reinform, und es braucht keinen einzigen Kampf.

**Und die Sprache-als-Font-Idee (Asterix) ist gut und billig:** der Mönch spricht Fraktur, die
Schweine sprechen in Versalien, der Narr in Bangers. Ein Font ist eine Fraktion, ohne dass jemand
etwas erklären muss. **Aber:** wir haben gerade festgelegt, dass Bangers **nur** dem Schrei gehört
(eine Schrift, eine Bedeutung). Wenn der Narr Bangers bekommt, ist er permanent laut — was für einen
Hofnarren stimmen könnte, aber es ist eine Entscheidung, keine Nebensache.

### 1c · Der Wiseguy ist ein Clown mit Googly Eyes

| Punkt | Status |
|---|---|
| Wiseguy = **Hofnarr am Marktplatz** (Starterzone), beleidigt jede vorbeikommende Einheit; Primärziele Spieler und König | `OPEN` — schärfer als die alte Fassung |
| Flache Triplet-Witze im Knock-Knock-Beat, aber KFB-origineller | `OPEN` (Auftrag K3) |
| **Googly-Eye-Rig mit vier Lidern** (happy/sad, Schrägen, Zwinkern) — aus Pet Studio v4 | `OPEN` — **der wertvollste technische Punkt heute** |

**Der Ort macht ihn besser.** Ein Wiseguy irgendwo im Feld ist ein Zufallsfund; einer auf dem
Marktplatz der Starterzone ist eine **Institution** — man kommt an ihm vorbei, jedes Mal. Und dass
er den König beleidigt, gibt ihm eine Position statt nur einer Funktion.

**Zu den Lidern:** vier separate Lider sind der Unterschied zwischen »zwei Kreise, die sich drehen«
und »ein Gesicht«. Das gehört ins Skin-Briefing, und Pet Studio v4 ist gescannt zu werden, bevor WS0
den Glubschauge-Skin baut — sonst bauen sie ihn ohne Lider und wir tauschen ihn später aus.

### 1d · Doc als Hampelmann

| Punkt | Status |
|---|---|
| DocCheck-Maskottchen mit Googly Eyes als Hampelmann | `HOOK` — Side-Quest, EPS/SVG liegt bei Georg |

Passt sauber ins Meta-Narrativ (die Werkstatt in Travel v12 zeigt schon laufende Demos). Ein
Hampelmann ist außerdem genau die richtige Bauform: **Gliedmaßen an Fäden** ist dieselbe Physik wie
Follow-Anchor und Luftballon. Ein Slice, kein Projekt.

---

## 2 · Was aus früheren Runden offen blieb (Kurzliste)

| Punkt | Status |
|---|---|
| **Meta-Sprites als Satz**: Pinsel · Schere · Bleistift · Radiergummi | `OPEN` — WS0-nah, gleiche Physik wie Lulls-Skins |
| **Debatten-Modus** (4–6 Blasen, drängeln statt ausweichen, Anfang und Ende) | `OPEN` — Lead |
| **Speaker's Corner** mit Lucky-Monolog und Zensur-Mönch | `OPEN` — braucht die zwei darüber |
| **Ink-Sauger** als Action Card (Sci-Fi-Gun = Radiergummi in Verkleidung) | `OPEN` — unabhängig |
| **Snacks sprechen mit niedrigster Priorität** (»Eat me.« → Eskalation bei Ignorieren) | `ENTSCHIEDEN` 10.8. |
| **Popcorn-Buffet** (POP-Tüte = Icon + Zähler + Knopf) | `OPEN` |
| **Googly Eyes**, 12–14 px (gemessen: 16 % der Körperhöhe) | `OPEN` — Teil des Skin-Pakets bei WS0 |
| Wortwechsel-Kette (These · Antithese · Synthese) | `PARTIAL` — gebaut, Budget-Ursache behoben, Abnahme offen |
| Lulls-Skins (Kopf-Anker, Follow-Anker) | `OPEN` — bei WS0, Zeichen-Haken ist `BUILT` |
| NIE-Adapter | `HOOK` — Vertragsform steht, nichts gebaut |
| TTS / STT | `OPEN` — Klärung liegt (`docs/KLAERUNG_TTS_STT.md`) |

---

## 3 · Was ChatGPT jetzt ausarbeiten sollte

Fünf Aufträge, nach Wert sortiert. Alle **Inhalt und Struktur**, keine Laufzeit.

### A · Der Hofnarr — vollständig (erweitert K3)
Nicht mehr »ein Witzpool«, sondern **eine Figur an einem Ort**. Gebraucht:
- 30–40 Triplet-Witze im Knock-Knock-**Beat**, aber KFB-original (der Beat ist Setup · Kippen ·
  Pointe in drei kurzen Zügen — nicht die Form »Klopf klopf«)
- **Beleidigungen nach Ziel**: Spieler (mit `{who}` = Titel + Name) · König · vorbeigehende Mobs
- die **Eskalation** beim Ausweich-Duell über drei Runden
- der Abgangssatz vor dem Puff

Die Frage dahinter: *warum hassen ihn die anderen, und warum kommt man trotzdem an ihm vorbei?*

### B · Der König, die Schweine und der Jackpot
Konzeptarbeit, nicht Zeilenarbeit. Gebraucht:
- der **Regelkreis**: wie wird ein König abgesetzt, wie wird der nächste gezogen, was ändert sich
  für die Welt (Chatter? Ruf? Zonennamen?)
- der **Propaganda-Ton**: was sagen die Jubel-Schweine, und wie kippt es, wenn sie ihn fressen
- das **Slot-Machine-Orakel** als Ereignis: was sieht man, was hört man, wie lange dauert es
- **die Frage, die zuerst zu beantworten ist:** ist der König eine Figur oder eine Position? Wenn
  jede Einheit König werden kann, ist es eine Position — und dann braucht die Krone eine eigene
  Grammatik, nicht der Träger

### C · Der Zensur-Mönch und die Propaganda-Sprache
- Fraktur als Fraktions-Font (billig, sofort lesbar) — plus **Signature Words**
- Buzzword-Verdauung: derselbe Seed durch »Mainstream«, »schwarze Wahrheit« und
  »Übererfüllung« — drei Verdauungen, wie Werkzeug 10 es beschreibt
- was er **schwärzt** und was er **gelb markiert** — der Unterschied ist die Pointe

### D · Snack-Dramaturgie (»Eat me.«)
Kurz, aber präzise: die Eskalationsstufen bei Ignorieren (drei reichen), je Snack-Art ein anderer
Ton, und die eine Zeile, die kommt, **wenn der Spieler doch hinsieht**. Letztere ist die
schwierigste — sie muss die Erwartung enttäuschen, ohne den Gag zu töten.

### E · Sidescroller-Orte statt -Wege
Design-Frage, keine Textarbeit: **welche Orte** in der Welt vertragen ein Seitenansicht-Sprite?
Thron, Marktplatzbühne, Gefängniszelle, Schaufenster — Orte, an denen jemand **steht und
performt**. Eine Liste mit je einem Satz Begründung ist wertvoller als jede Asset-Sichtung.

---

## 3b · Zulauf vom selben Abend (10.8.) — schon eingeordnet

| Idee | Status | Kurzurteil |
|---|---|---|
| **Sidescroller-Tiles im Terrain**, nicht nur Figuren — Boden und Bauten aus der Seitenansicht, alles Collage und Papierschnitt | `OPEN` | konsequent: wenn die Figur flach sein darf, darf es die Welt auch |
| **»Es ist so falsch, dass nicht einmal das Gegenteil wahr ist.«** · **»Kognitive Dissonanz ist der Resonanzraum für KFB.«** | `GILT` als Haltung | erklärt, warum die Perspektiv-Brüche kein Fehler sind: der Bruch ist nicht der Preis für die Collage, er ist ihr Zweck |
| **Welt als D6** — um Kanten segeln, Würfelreihen als Strecke, Escher-Voxel, Hohlwelt/flache Erde/hohler Mond aus Käse | `DEFERRED` — Travel 14+, **nicht** Overworld | notiert in Masterplan §4.2e, damit es nicht verlorengeht. Anschluss existiert: die Sky-Dice aus Travel v11 sind schon drei Würfel als Gesetz des Spiels |
| **3D-Ball-POC** | `DEFERRED` (Georg 10.8.) | nicht KISS |

**Für die Ideation drüben** ist die Dissonanz-Formel der nützlichste Satz: sie gibt ein Kriterium.
Eine Idee ist KFB, wenn sie **zwei Perspektiven nebeneinanderlegt, ohne eine zu bevorzugen** — und
sie ist es nicht, wenn sie eine davon auflöst. Das trennt Satire von Erklärung.

## 3c · Der »M«-View als 3D-Ebene (Georg 10.8.) — der beste Ort für 3D

`OPEN`, keine Priorität — aber konzeptionell die sauberste 3D-Idee bisher, und zwar aus einem
Grund, der leicht übersehen wird:

> **Die Übersicht ist ohnehin schon eine andere Ebene.** Man verlässt die Welt, um auf sie zu
> schauen. Ein Perspektivwechsel an dieser Stelle **kostet nichts an Glaubwürdigkeit** — im
> Gegenteil, er begründet sich selbst.

Das ist der Unterschied zum 3D-Ball: der hätte ein 3D-Objekt **in** die 2D-Welt gestellt und damit
die Frage »wo steht etwas?« ein zweites Mal beantworten müssen. Der M-View stellt sie gar nicht —
er ist ein eigener Raum mit eigener Kamera, betreten über einen Tastendruck, verlassen über
denselben. **Gekapselt, wie Georg sagt.**

**Und er hat schon einen Zweck**, der über »hübscher« hinausgeht: die Übersicht ist heute die
Insel-Karte mit Reisepunkten. Als 3D-Ebene könnte sie der **Meta-View** sein — Galaxie, Tesserakt,
das fraktal-holografisch gedachte KFB-Universum in einer Nussschale. Dann ist der Wechsel nicht
Dekoration, sondern **ein Maßstabssprung**: von der Insel zur Welt zum Deck zum Universum.
Das passt zur Sky-Dice-Idee (§4.2e) und zum Seitenmodell (»die Insel ist endlich, das Heft ist es
nicht«).

### KORREKTUR (Georg, 10.8.) — kein Schalter, sondern ein Wegklappen

Mein »ein Schalter, kein Übergang« war wieder der vorsichtige Reflex. Georgs Einwand ist besser,
und er stützt sich auf etwas, das schon läuft: **die Karte wird ohnehin unter dem Viewport
herumgeschoben** (beim Tod sieht man es sogar — die Überblendung fehlt, das ist notiert).

> **»M« klappt die 2D-Ebene sichtbar weg, oder die Kamera fährt eine Etage höher.**
> Jedenfalls behandeln wir die 2D-Welt als das, was sie ist.

Das ist der Punkt, den ich verpasst hatte: Der Übergang stellt die Frage »wo steht etwas?« gar
nicht neu — er **beantwortet sie endgültig**. Die 2D-Welt ist eine Fläche. Wenn sie wegklappt,
sieht man das, und es ist die ehrlichste Aussage, die das Spiel über sich machen kann. Dieselbe
Logik wie beim Profil-Schwein: nicht der Bruch verstecken, sondern zeigen.

## 3d · Der Würfel-Kosmos — vom M-View zur Weltstruktur

Und daraus wird eine Struktur, die weit über eine Übersicht hinausgeht:

| Ebene | Was es ist |
|---|---|
| **Eine Karte** | eine Zone in der 2D-Welt |
| **Ein Deck** = 56 Karten | verteilt auf **sechs Würfelseiten** → ein Deck **ist** ein D6 |
| **Drei D6** | eine borromäische Würfelwelt, umeinander kreisend mit Attraktor-Physik |
| **3×3 Würfel** | ein KFB-Cluster |

**Warum das trägt:** die Zahl war schon da. 56 Karten auf sechs Seiten sind gut neun je Fläche,
plus Cover — das ist keine erfundene Geometrie, sondern eine, die aus dem Deck fällt. Und
»borromäisch« ist im Projekt kein Schmuckwort: die drei Sky-Dice aus Travel v11 sind bereits drei
Würfel als Gesetz des Spiels, King Kayfabian ist wörtlich der rotierende Richter.

**Der Reisemodus dazu** (Georgs Slingshot-Surf): die 2D-Einheit fliegt auf einer animierten
KFB-Karte im Partikelsog zwischen den Würfeln, dockt mit Space und ein paar WASD-Manövern an einer
Würfelseite an — spektakulär animiert, aber mit dem **Gefühl**, es selbst zu steuern. Die Vorlage
liegt: Travel v6 und rollercoaster v11+ haben den Kartenflug schon.

**Was ich daran am stärksten finde:** das Andocken ist eine **Landung auf einer Karte**, und die
Karte kommt aus dem Almanach (Standard: der aktive Actor). Damit ist die Reise zwischen Welten
dasselbe Material wie das Spiel selbst — man reist auf dem, was man gesammelt hat.

**Drei Fragen, die vor dem Bauen zu klären sind** (für die Ideation drüben):

1. **Ist die Würfelseite eine Karte oder ein Kartensatz?** Bei 56/6 ist es ein Satz — also braucht
   eine Seite eine eigene Ordnung, sonst ist sie ein Haufen.
2. **Was passiert mit einem gespielten Würfel?** Bleibt er sichtbar (Trophäe), verblasst er, oder
   wird er dunkel und man kann zurück? Die Antwort bestimmt, ob der Kosmos wächst oder sich leert.
3. **Wie sieht ein ungespielter Würfel aus?** Er darf nicht leer sein (dann ist er langweilig) und
   nicht voll (dann ist er verraten). Verdeckte Kartenrückseiten wären die naheliegende Antwort —
   und die liegen seit V10-S16 als Satz vor.

**Referenz (Georg 10.8.):** [ludowala.app](https://ludowala.app) — 3D-Ludo im Browser, ohne
Download, mit Würfelphysik und »11 things to throw«. Als **Machbarkeitsbeleg** nützlich: ein
Würfelbrett in 3D trägt im Browser, und der Ton der Seite (»when the dice betray you, there is a
rocket on the shelf«) liegt nah an unserem.

**Der Unterschied, der dabei wichtig ist:** Ludo benutzt 3D für **Physik** — werfen, rollen,
treffen. Bei uns wäre 3D der **Maßstabssprung**, nicht die Physik: man verlässt die Fläche, um zu
sehen, dass sie eine ist. Wer die Referenz als Vorbild nimmt, baut ein Physikspiel; wer sie als
Beleg nimmt, weiß nur, dass die Technik trägt. *Das Zweite ist gemeint.*

**Status:** `OPEN`, ohne Priorität, aber **nicht mehr »3D deferred«** — das galt dem Ball in der
2D-Welt. Der Würfel-Kosmos ist eine eigene Ebene und damit eine andere Sache.
**To-do notiert:** die fehlende Überblendung beim Tod (man sieht die Karte unter dem Viewport
wandern).

## 3e · Der Erzähler als Figur (Georg 10.8.) — und ein Auftrag daraus

»It was a dark and stormy Knight…«, Ritter aus dem Nebel, nächtlicher Friedhof, Reinkarnation mit
Amnesie. Später wird der Erzähler eine **Figur** — wie der Datumscomputer bei »Es war einmal… der
Mensch«. Und die **Zeitmaschine ist die Drei-Beat-Slot-Machine** — mit **MM · DD · YYYY** auf den drei
Walzen (Georg 10.8.). Das ist der Punkt, an dem die Idee zuschnappt: dieselben drei Walzen tragen
das semantische Triplett (`A + B + C → closure`), die Königswahl (dreimal dasselbe Symbol) **und**
ein Datum. Drei Bedeutungen, ein Möbel, und keine davon ist aufgesetzt — *ein Datum ist ohnehin ein
Triplett, das nur so tut, als wäre es eine Zahl.*

Zwei Dinge daran sind stark. Die **Amnesie macht aus Erklärung eine gemeinsame Suche** — der
klassische Tutorial-Ausweg, aber hier begründet er sich aus der Welt. Und das eine Möbel für drei
Zwecke ist genau die Ökonomie, die KFB trägt.

**Die Falle, die im Konzept mitgedacht gehört:** der Erzähler ist die **einzige Stimme ohne
Körper**. Er umgeht damit Präsentationsbudget und Sprecherwahl — also muss er selten sein.
*Kommentiert er, was man ohnehin sieht, ist er ein Untertitel; sagt er, was man nicht sehen kann,
ist er ein Erzähler.* Und ein Erzähler, der erklärt, **wie man spielt**, ist ein Handbuch mit
Stimme.

### Auftrag F · Der Eröffnungs-Erzähler (klein, sofort machbar)

**Einer**, nicht sechs (die sechs aus `media/prompts/narrator/` sind `DEFERRED`): FrizzleBob im
**Carny-Register** (Voice Engine, Maske 3 — direkte Ansprache, hält das Objekt hoch, selbstironisch
übers Geschäft, Sign-off »Stay fluffy.«).

Gebraucht: die **Eröffnung** in maximal fünf Boxen (Nebel · Ritter · Friedhof · Amnesie · erster
Auftrag), plus je zwei Alternativen für den zweiten Durchlauf. Und die eine Zeile, mit der er sich
**verabschiedet**, wenn der Spieler ihn nicht mehr braucht — die ist die schwierigste, weil sie
das Versprechen einlöst, dass er später eine Figur wird.

**Register: deadpan und trocken, Loriot-Logik** (Georg 10.8.), Stimme später Roboter-TTS.

Loriot ist die genaueste Referenz, die bisher gefallen ist, und zwar wegen der **Mechanik**, nicht
wegen des Tons: bei ihm eskaliert eine Situation, weil **alle Beteiligten sich korrekt verhalten**.
Niemand ist dumm, niemand ist böse — die Katastrophe entsteht aus Höflichkeit, Ordnung und dem
Beharren auf einem an sich vernünftigen Standpunkt. Das ist exakt unsere Höflich-Verwaltend-Fraktion
(»We have a file on {X}«) und exakt der Grund, warum der Erzähler nicht kommentieren darf: *bei
Loriot erklärt nie jemand den Witz, alle meinen es ernst.*

Drei Dinge, die daraus für die Zeilen folgen:

1. **Die Figuren wissen nicht, dass es komisch ist.** Wer zwinkert, hat verloren. Das deckt sich
   mit »Kayfabe als Ernst«.
2. **Die Steigerung kommt aus Wiederholung mit winziger Abweichung**, nicht aus Übertreibung —
   das ist derselbe Beat wie unsere These/Antithese/Synthese, nur langsamer.
3. **Das Genaue ist komischer als das Große.** Nicht »eine Katastrophe«, sondern »der Vorgang ist
   zweimal eingegangen«. Präzision ist die Pointe. Das hat eine Folge für
die Zeilen: **der Witz muss im Satz stecken, nicht in der Betonung** — keine Ausrufezeichen, keine
Kursiv-Hilfen, keine eingebauten Pausen. Eine Maschine, die eine Katastrophe im selben Ton meldet
wie ein Datum, ist komisch; eine, die sich anstrengt, ist peinlich.

Länge: die Erzählerbox darf mehr als 60 Zeichen tragen (sie ist kein Sprecher), aber nicht mehr als
zwei Zeilen. **»It was a dark and stormy Knight.«** ist dabei die Messlatte: neun Wörter, ein
Wortspiel, ein ganzes Genre.

---

## 3f · Slice F — der Eröffnungs-Erzähler, zusammengefasst

**Der nächste Konzept-Slice, klein und sofort machbar.** Alles, was oben verstreut steht, an einer
Stelle:

### Was er ist

Eine **Erzählerbox** — eckig, oben, **ohne Anker**. Die einzige Blase, die niemandem gehört, und
damit die einzige Stimme ohne Körper. Später wird er eine **Figur** (Datumscomputer-Logik aus »Es
war einmal… der Mensch«), aber zuerst ist er nur Text im Nebel.

### Register

**FrizzleBob, Carny-Maske · deadpan · trocken · Loriot-Logik.** Später Roboter-TTS (tiefer Pitch,
langsame Rate, erstbeste Systemstimme — sie **kann** nicht betonen, und das ist der Vorteil).

Daraus folgt für jede Zeile:
- **Der Witz steckt im Satz, nicht in der Betonung.** Keine Ausrufezeichen, keine eingebauten
  Pausen, keine Kursiv-Hilfen.
- **Niemand weiß, dass es komisch ist.** Wer zwinkert, hat verloren.
- **Das Genaue ist komischer als das Große.** Nicht »eine Katastrophe«, sondern »der Vorgang ist
  zweimal eingegangen«.
- **Steigerung durch Wiederholung mit winziger Abweichung**, nicht durch Übertreibung.

### Was gebraucht wird

| Teil | Umfang |
|---|---|
| **Die Eröffnung** — Nebel · Ritter · Friedhof · Amnesie · erster Auftrag | max. **5 Boxen** |
| **Alternativen** für den zweiten Durchlauf | je 2 pro Box |
| **Die Abschiedszeile** — wenn der Spieler ihn nicht mehr braucht | **1**, und sie ist die schwierigste |
| **Zeitmaschinen-Ansagen** — die drei Walzen sind **MM · DD · YYYY** | 6–8 Zeilen |

Die Abschiedszeile trägt das Versprechen, dass er später eine Figur wird — sie darf es nicht
aussprechen und muss es trotzdem einlösen.

### Länge

Die Box darf mehr als 60 Zeichen tragen (sie ist kein Sprecher), aber **nicht mehr als zwei
Zeilen**. Die Messlatte ist die Eröffnung selbst:

> **»It was a dark and stormy Knight.«**
> Neun Wörter, ein Wortspiel, ein ganzes Genre.

### Was ausdrücklich NICHT dazugehört

**Sechs Erzähler zur Wahl** (`media/prompts/narrator/`) sind `DEFERRED` — erst einer. Und: der
Erzähler erklärt **Meta-Closure**, nicht Bedienung. *Ein Erzähler, der erklärt, wie man spielt, ist
ein Handbuch mit Stimme.* Kommentiert er, was man ohnehin sieht, ist er ein Untertitel.

---

## 4 · Zwei Grenzen, die im Riffing gern verrutschen

**Laufzeit gehört dem Lead.** Kein zweiter Automat, kein zweiter Blasenzeichner, kein
Auswahlalgorithmus im Konzeptdokument. Wenn eine Idee einen Zustandsautomaten braucht, ist sie eine
Anfrage an mich, keine Spezifikation.

**Jede neue Blase kostet.** Wir haben ein Präsentationsbudget (max 2 in der Welt, 1 je Zone,
Eskalation bis 4). Alles, was spricht — Snacks, Narr, Schweine, Mönch, Debatte — teilt sich diese
Bühne. Neue Sprecher sind deshalb keine Addition, sondern eine **Umverteilung**: wer spricht, nimmt
jemand anderem das Wort. Die richtige Frage bei jeder neuen Stimme lautet nicht »was sagt sie?«,
sondern **»wen bringt sie zum Schweigen?«**

**Stay fluffy.**
